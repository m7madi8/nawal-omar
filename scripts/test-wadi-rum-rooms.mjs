import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { inflateSync } from 'node:zlib';

import {
  BOOKING_STATUS,
  PAYMENT_STATUS,
  WADI_RUM_DEPOSIT_ILS,
} from '../lib/commerce/constants.js';
import { RETREAT_CATALOG } from '../lib/commerce/catalog/retreats.js';
import { LESSON_CATALOG } from '../lib/commerce/catalog/lessons.js';
import {
  resolveRetreatRoom,
  retreatHasRooms,
  retreatRoomLineTitle,
} from '../lib/commerce/retreat-rooms.js';
import { processCheckout } from '../lib/commerce/checkout.js';
import { confirmHypPayFromRedirect } from '../lib/commerce/payment/confirmation.js';
import { paymentSummary, remainingBalance } from '../lib/commerce/financials.js';
import { whatsappFromOrder } from '../lib/commerce/whatsapp-messages.js';
import { generateReceiptPdf } from '../lib/commerce/pdf/generate-receipt.js';
import { bookingAccessToken } from '../lib/commerce/booking-access.js';

/**
 * Offline tests for Wadi Rum room selection, server-side pricing and downstream consistency.
 * - No network, no real database, no payment provider. global.fetch is replaced with:
 *     * an in-memory fake of the PostgREST endpoints used by lib/commerce (fake host), and
 *     * a stub for the Hyp SIGN endpoint that only records the request (no real call).
 *   Any other URL throws.
 * - All credentials below are fake placeholders. Hyp VERIFY is injected (never performed).
 */

const root = join(fileURLToPath(import.meta.url), '..', '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');

// ---- Fake environment -----------------------------------------------------------------
const FAKE_SUPABASE = 'https://fake-project.invalid';
const ENV = {
  SUPABASE_URL: FAKE_SUPABASE,
  SUPABASE_SERVICE_ROLE_KEY: 'fake-service-key-for-offline-test',
  HYP_PAYMENTS_ENABLED: 'true',
  HYP_TERMINAL_ID: '0010012345', // Hyp test-terminal prefix; fake value
  HYP_API_KEY: 'fake-hyp-key',
  HYP_API_PASSP: 'fake-hyp-passp',
  HYP_ALLOW_INSTALLMENTS: 'false',
  HYP_RETURN_URL: 'https://site.invalid/api/payment/hyp/return',
  NAWAL_DEPLOYMENT_MODE: 'development',
  DEPLOYMENT_MODE: 'development',
  NEXT_PUBLIC_SITE_URL: 'https://site.invalid',
  BOOKING_ACCESS_SECRET: 'fake-booking-secret-for-offline-test',
};

async function withEnv(overrides, fn) {
  const prior = {};
  for (const key of Object.keys(overrides)) {
    prior[key] = process.env[key];
    process.env[key] = overrides[key];
  }
  try {
    return await fn();
  } finally {
    for (const key of Object.keys(overrides)) {
      if (prior[key] === undefined) delete process.env[key];
      else process.env[key] = prior[key];
    }
  }
}

// ---- In-memory fake PostgREST + Hyp SIGN stub -----------------------------------------
const tables = new Map();
const writes = []; // every POST / PATCH to the fake database
const hypSignCalls = []; // parameters of every (stubbed) Hyp SIGN request

function table(name) {
  if (!tables.has(name)) tables.set(name, new Map());
  return tables.get(name);
}
function resetDb() {
  tables.clear();
  writes.length = 0;
  hypSignCalls.length = 0;
}
const clone = (value) => JSON.parse(JSON.stringify(value));
const RESERVED = new Set(['select', 'order', 'limit', 'offset', 'or']);

function rowMatches(row, params) {
  for (const [key, value] of params.entries()) {
    if (RESERVED.has(key)) continue;
    if (value.startsWith('eq.') && String(row[key]) !== value.slice(3)) return false;
  }
  const or = params.get('or');
  if (or) {
    const clauses = or.replace(/^\(|\)$/g, '').split(',').map((c) => c.split('.eq.'));
    if (!clauses.some(([col, val]) => String(row[col]) === val)) return false;
  }
  return true;
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

globalThis.fetch = async (url, init = {}) => {
  const u = new URL(String(url));
  const method = String(init.method || 'GET').toUpperCase();

  if (u.origin === FAKE_SUPABASE && u.pathname.startsWith('/rest/v1/')) {
    const name = decodeURIComponent(u.pathname.slice('/rest/v1/'.length));
    const rows = table(name);
    if (method === 'POST') {
      const row = clone(JSON.parse(init.body));
      writes.push({ method, table: name, row });
      rows.set(row.id, row);
      return json(201, [clone(row)]);
    }
    if (method === 'PATCH') {
      const id = u.searchParams.get('id').slice(3);
      const patch = clone(JSON.parse(init.body));
      writes.push({ method, table: name, id, patch });
      const next = { ...(rows.get(id) || { id }), ...patch };
      rows.set(id, next);
      return json(200, [clone(next)]);
    }
    if (method === 'GET') {
      return json(
        200,
        [...rows.values()].filter((row) => rowMatches(row, u.searchParams)).map(clone),
      );
    }
    throw new Error(`Unsupported fake REST method ${method}`);
  }

  if (u.origin === 'https://pay.hyp.co.il' && u.searchParams.get('What') === 'SIGN') {
    hypSignCalls.push(Object.fromEntries(u.searchParams.entries()));
    return new Response('action=pay&signature=fake-signature-for-offline-test', { status: 200 });
  }

  throw new Error(`Network access is blocked in test-wadi-rum-rooms: ${u.origin}`);
};

// ---- Resolver hook so route handlers (which use "@/") load; admin auth is stubbed -----
const ADMIN_AUTH_STUB = `
export async function requireAdminAccess() { return { ok: true }; }
export function guardResponse() { return null; }
`;
register(
  'data:text/javascript,' +
    encodeURIComponent(`
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const root = ${JSON.stringify(root)};
const adminAuthStub = ${JSON.stringify('data:text/javascript,' + encodeURIComponent(ADMIN_AUTH_STUB))};
export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@/lib/admin-auth') {
    return { url: adminAuthStub, shortCircuit: true };
  }
  if (specifier.startsWith('@/')) {
    const base = join(root, specifier.slice(2));
    for (const candidate of [base, base + '.js', join(base, 'index.js')]) {
      if (existsSync(candidate) && statSync(candidate).isFile()) {
        return nextResolve(pathToFileURL(candidate).href, context);
      }
    }
  }
  return nextResolve(specifier, context);
}
`),
);

const importRoute = (rel) => import(pathToFileURL(join(root, rel)).href);
const checkoutRoute = await importRoute('app/api/commerce/checkout/route.js');
const bookingRoute = await importRoute('app/api/commerce/booking/[orderId]/route.js');
const adminOrdersRoute = await importRoute('app/api/admin/commerce-orders/route.js');

const ROOMS = [
  { id: 'panorama', amount: 3650, remaining: 3250, label: 'Panorama Room', labelAr: 'غرفة بانوراما' },
  { id: 'bubbles', amount: 3850, remaining: 3450, label: 'Bubbles Room', labelAr: 'غرفة بابلز' },
];
const RETREAT_TITLE = 'Initial Registration | Wadi Rum Desert Retreat';
const CUSTOMER = { fullName: 'Test Person', phone: '+972521234567', email: '', city: '' };
const REQUEST = new Request('http://localhost/api/commerce/checkout');

const wadi = RETREAT_CATALOG['wadi-rum'];

// =====================================================================================
// 1. Catalog and pricing
// =====================================================================================
assert.deepEqual(Object.keys(wadi.rooms).sort(), ['bubbles', 'panorama'], 'exactly two rooms');
assert.equal(Object.isFrozen(wadi.rooms), true);
for (const room of ROOMS) {
  const def = wadi.rooms[room.id];
  assert.equal(def.id, room.id);
  assert.equal(def.amount, room.amount);
  assert.equal(def.currency, 'ILS');
  assert.equal(def.label.en, room.label);
  assert.equal(def.label.ar, room.labelAr);
  assert.equal(WADI_RUM_DEPOSIT_ILS, 400, 'deposit stays 400 for every room');
  assert.equal(def.amount - WADI_RUM_DEPOSIT_ILS, room.remaining);
}
assert.equal(wadi.pricing.amount, 3650, 'retreat-level pricing.amount is preserved');
assert.equal(wadi.pricing.currency, 'ILS');
assert.equal(wadi.bookingStatus, BOOKING_STATUS.OPEN);
assert.equal(wadi.capacity, 20, 'capacity policy unchanged');
assert.equal(retreatHasRooms(wadi), true);
assert.equal(retreatHasRooms(RETREAT_CATALOG.dahab), false);
assert.equal(retreatHasRooms(RETREAT_CATALOG.zanzibar), false);
assert.equal(resolveRetreatRoom(RETREAT_CATALOG.dahab, 'panorama'), null, 'room-less retreats unaffected');
assert.equal(resolveRetreatRoom(RETREAT_CATALOG.zanzibar, undefined), null);
assert.equal(
  retreatRoomLineTitle(wadi, wadi.rooms.bubbles),
  `${RETREAT_TITLE} - Bubbles Room`,
);

// =====================================================================================
// 2. Room resolver: exact own-property string ids only
// =====================================================================================
assert.equal(resolveRetreatRoom(wadi, 'panorama').amount, 3650);
assert.equal(resolveRetreatRoom(wadi, 'bubbles').amount, 3850);

const INVALID_ROOMS = [
  ['missing', undefined],
  ['null', null],
  ['empty', ''],
  ['whitespace', '   '],
  ['uppercase', 'PANORAMA'],
  ['capitalised', 'Bubbles'],
  ['leading space', ' panorama'],
  ['trailing space', 'bubbles '],
  ['numeric', 1],
  ['zero', 0],
  ['boolean', true],
  ['array', ['panorama']],
  ['object', { id: 'panorama' }],
  ['object with toString', { toString: () => 'panorama' }],
  ['constructor', 'constructor'],
  ['toString', 'toString'],
  ['__proto__', '__proto__'],
  ['hasOwnProperty', 'hasOwnProperty'],
  ['valueOf', 'valueOf'],
  ['unknown', 'suite'],
];
for (const [name, value] of INVALID_ROOMS) {
  assert.throws(
    () => resolveRetreatRoom(wadi, value),
    (e) => e.code === 'INVALID_ROOM',
    `resolver must reject ${name}`,
  );
}

// =====================================================================================
// 3. Checkout: invalid rooms are rejected before anything is written
// =====================================================================================
function checkoutBody(extra = {}) {
  return {
    commerceType: 'retreat',
    itemId: 'wadi-rum',
    payment: 'manual',
    retreatRequestId: 'req-test-1',
    notes: 'Registration request req-test-1',
    customer: { ...CUSTOMER },
    ...extra,
  };
}
const postJson = (path, body) =>
  new Request(`http://localhost${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

await withEnv(ENV, async () => {
  resetDb();

  for (const [name, value] of INVALID_ROOMS) {
    await assert.rejects(
      () => processCheckout(checkoutBody({ roomId: value }), REQUEST),
      (e) => e.code === 'INVALID_ROOM',
      `processCheckout must reject ${name}`,
    );
  }
  await assert.rejects(
    () => processCheckout(checkoutBody(), REQUEST),
    (e) => e.code === 'INVALID_ROOM',
    'a missing room must never default to Panorama',
  );
  assert.equal(writes.length, 0, 'invalid rooms must not create an order, item or mirror row');

  // Route-level: HTTP 400 with the stable INVALID_ROOM code, still zero writes.
  const jsonSafeInvalid = [undefined, null, '', '   ', 'PANORAMA', 1, ['panorama'], { a: 1 }, 'constructor', 'toString', '__proto__'];
  for (const value of jsonSafeInvalid) {
    const res = await checkoutRoute.POST(postJson('/api/commerce/checkout', checkoutBody({ roomId: value })));
    assert.equal(res.status, 400, `route must answer 400 for ${JSON.stringify(value)}`);
    assert.equal((await res.json()).code, 'INVALID_ROOM');
  }
  assert.equal(writes.length, 0, 'rejected requests must not write');

  // =================================================================================
  // 4. Server-side price integrity and persistence (non-gateway path, full persistence)
  // =================================================================================
  for (const room of ROOMS) {
    resetDb();
    const out = await processCheckout(checkoutBody({ roomId: room.id }), REQUEST);
    assert.equal(out.ok, true);

    const order = table('commerce_orders').get(out.orderId);
    assert.equal(order.total, room.amount, `${room.id} order total`);
    assert.equal(order.subtotal, room.amount);
    assert.equal(order.currency, 'ILS');
    assert.equal(order.metadata.roomId, room.id, 'roomId persisted in order metadata');
    assert.equal(order.metadata.retreatRequestId, 'req-test-1', 'retreatRequestId preserved');
    assert.equal(order.metadata.itemId, 'wadi-rum');
    assert.equal(order.metadata.commerceType, 'retreat');
    assert.equal(order.metadata.legacySource, 'wadi-rum-registration');

    const items = [...table('commerce_order_items').values()];
    assert.equal(items.length, 1);
    const [item] = items;
    assert.equal(item.order_id, out.orderId);
    assert.equal(item.item_id, 'wadi-rum');
    assert.equal(item.commerce_type, 'retreat');
    assert.equal(item.quantity, 1);
    assert.equal(item.unit_price, room.amount, `${room.id} item unit price`);
    assert.equal(item.currency, 'ILS');
    assert.equal(item.title, `${RETREAT_TITLE} - ${room.label}`, 'room label in title');
    assert.equal(item.metadata.roomId, room.id);
    assert.equal(item.metadata.roomLabel, room.label);
    assert.equal(item.metadata.eventDate, wadi.date, 'existing item metadata preserved');

    // Legacy mirror: separate retreat_requests row carrying the same facts.
    const mirror = table('retreat_requests').get(out.legacyId);
    assert.ok(mirror, 'legacy mirror row exists');
    assert.equal(mirror.source, 'wadi-rum-registration');
    assert.equal(mirror.retreatType, `${RETREAT_TITLE} - ${room.label}`);
    const note = JSON.parse(mirror.freeNote);
    assert.equal(note.commerceOrderId, out.orderId);
    assert.equal(note.total, room.amount);
    assert.equal(note.items[0].unitPrice, room.amount);
    assert.equal(note.items[0].metadata.roomId, room.id);
    assert.equal(note.items[0].metadata.roomLabel, room.label);
    assert.equal(order.metadata.legacyMirrorId, out.legacyId);
  }

  // Client-supplied prices, totals, currency and quantity can never override the catalog.
  resetDb();
  const tampered = await processCheckout(
    checkoutBody({
      roomId: 'bubbles',
      unitPrice: 1,
      price: 1,
      total: 1,
      subtotal: 1,
      amount: 1,
      currency: 'USD',
      quantity: 5,
      pricing: { amount: 1 },
      rooms: { bubbles: { amount: 1 } },
    }),
    REQUEST,
  );
  const tamperedOrder = table('commerce_orders').get(tampered.orderId);
  assert.equal(tamperedOrder.total, 3850);
  assert.equal(tamperedOrder.subtotal, 3850);
  assert.equal(tamperedOrder.currency, 'ILS');
  const tamperedItem = [...table('commerce_order_items').values()][0];
  assert.equal(tamperedItem.unit_price, 3850);
  assert.equal(tamperedItem.quantity, 1, 'quantity stays 1 for retreats');

  // Other commerce types are untouched: a roomId is ignored and never persisted.
  resetDb();
  const trial = LESSON_CATALOG['haifa-yoga'].packages.trial.amount;
  const lesson = await processCheckout(
    {
      commerceType: 'lesson',
      itemId: 'haifa-yoga',
      packageId: 'trial',
      payment: 'manual',
      roomId: 'bubbles',
      customer: { ...CUSTOMER },
    },
    REQUEST,
  );
  assert.equal(table('commerce_orders').get(lesson.orderId).total, trial);
  assert.equal('roomId' in table('commerce_orders').get(lesson.orderId).metadata, false);
  assert.equal('roomId' in [...table('commerce_order_items').values()][0].metadata, false);

  // Closed retreats keep their existing rejection (Dahab/Zanzibar rules unchanged).
  resetDb();
  for (const itemId of ['dahab', 'zanzibar']) {
    await assert.rejects(
      () => processCheckout(checkoutBody({ itemId, roomId: 'panorama' }), REQUEST),
      (e) => e.code === 'BOOKING_CLOSED',
    );
  }
  assert.equal(writes.length, 0);

  // =================================================================================
  // 5. Hyp: deposit is always 400, resolved server-side (stubbed SIGN, nothing real)
  // =================================================================================
  for (const room of ROOMS) {
    resetDb();
    const out = await processCheckout(
      checkoutBody({
        roomId: room.id,
        payment: 'hyp',
        depositAmount: 400, // existing client hint; only ever compared with the server value
        hypPayMethod: 'card',
      }),
      REQUEST,
    );
    assert.equal(out.ok, true);
    assert.equal(out.via, 'hyp');
    assert.equal(out.paymentKind, 'deposit');
    assert.equal(out.chargeAmount, 400, `${room.id}: Hyp charge is the 400 deposit`);

    assert.equal(hypSignCalls.length, 1);
    const sign = hypSignCalls[0];
    assert.equal(sign.Amount, '400', `${room.id}: amount sent to Hyp`);
    assert.notEqual(sign.Amount, String(room.amount));
    assert.equal(sign.Coin, '1');
    assert.equal(sign.Order, out.orderId);
    assert.equal(sign.Fild1, out.orderId);
    assert.equal(sign.Fild3, 'deposit');
    assert.ok(sign.Info.includes(room.label), 'Hyp Info names the room');

    const order = table('commerce_orders').get(out.orderId);
    assert.equal(order.total, room.amount);
    assert.equal(Number(order.metadata.chargeAmount), 400);
    assert.equal(order.metadata.paymentKind, 'deposit');
    assert.equal(order.metadata.roomId, room.id, 'roomId survives the Hyp sign metadata updates');
    assert.equal(order.payment_status, PAYMENT_STATUS.PENDING);
  }

  // Manipulated deposits and unsupported plans keep their existing rejections, with no writes.
  resetDb();
  for (const [extra, code] of [
    [{ depositAmount: 1 }, 'INVALID_CHARGE_AMOUNT'],
    [{ depositAmount: 3850 }, 'INVALID_CHARGE_AMOUNT'],
    [{ depositAmount: 3650 }, 'INVALID_CHARGE_AMOUNT'],
    [{ chargeAmount: 3850 }, 'INVALID_CHARGE_AMOUNT'],
    [{ depositAmount: 99999 }, 'INVALID_CHARGE_AMOUNT'],
    [{ paymentPlan: 'full' }, 'PAYMENT_PLAN_NOT_SUPPORTED'],
    [{ paymentKind: 'full' }, 'PAYMENT_PLAN_NOT_SUPPORTED'],
  ]) {
    await assert.rejects(
      () => processCheckout(checkoutBody({ roomId: 'bubbles', payment: 'hyp', ...extra }), REQUEST),
      (e) => e.code === code,
      `${JSON.stringify(extra)} must fail with ${code}`,
    );
  }
  assert.equal(writes.length, 0, 'rejected charge requests must not write');
  assert.equal(hypSignCalls.length, 0, 'rejected charge requests must not reach Hyp');

  // =================================================================================
  // 6. Verified deposit -> confirmed booking with the right room and balances
  // =================================================================================
  async function payDeposit(room, hypId) {
    resetDb();
    const out = await processCheckout(
      checkoutBody({ roomId: room.id, payment: 'hyp', depositAmount: 400 }),
      REQUEST,
    );
    const query = `Id=${hypId}&Order=${out.orderId}&Amount=400&CCode=0&Coin=1&Fild1=${out.orderId}&Fild3=deposit`;
    const result = await confirmHypPayFromRedirect(query, {
      resolveAttemptForOrder: async () => null,
      verifyHypRedirect: async () => ({ verified: true, outcome: 'paid', ccode: '0', raw: 'CCode=0' }),
    });
    return { out, query, result };
  }

  for (const room of ROOMS) {
    const { out, query, result } = await payDeposit(room, `hyp-${room.id}-1`);
    assert.equal(result.paid, true);
    assert.equal(result.finalizationIncomplete, false);

    const order = table('commerce_orders').get(out.orderId);
    assert.equal(order.payment_status, PAYMENT_STATUS.PARTIALLY_PAID);
    assert.equal(order.status, 'confirmed', 'verified deposit confirms the booking');
    assert.equal(order.amount_paid, 400);
    assert.equal(order.total, room.amount);
    assert.equal(order.metadata.roomId, room.id, 'room preserved through finalization');
    assert.equal(order.metadata.bookingStatus, 'confirmed');
    assert.equal(order.metadata.amountPaid, 400);
    assert.equal(remainingBalance(order), room.remaining);
    assert.equal(paymentSummary(order).remaining, room.remaining);

    const receipts = [...table('payment_receipts').values()];
    assert.equal(receipts.length, 1);
    const receipt = receipts[0];
    assert.equal(receipt.amount, 400);
    assert.equal(receipt.document_type, 'deposit_receipt');
    assert.equal(receipt.metadata.totalBooking, room.amount);
    assert.equal(receipt.metadata.cumulativePaid, 400);
    assert.equal(receipt.metadata.remainingAfter, room.remaining);
    assert.equal(receipt.metadata.experienceName, `${RETREAT_TITLE} - ${room.label}`);

    // Legacy mirror reflects the payment and still carries the room.
    const mirror = table('retreat_requests').get(order.metadata.legacyMirrorId);
    const note = JSON.parse(mirror.freeNote);
    assert.equal(note.amountPaid, 400);
    assert.equal(note.remainingBalance, room.remaining);
    assert.equal(note.paymentStatus, PAYMENT_STATUS.PARTIALLY_PAID);
    assert.equal(note.items[0].metadata.roomId, room.id);
    assert.equal(mirror.yogaExperience, 'partial');

    // Idempotent second return: nothing is double-counted.
    const again = await confirmHypPayFromRedirect(query, {
      resolveAttemptForOrder: async () => null,
      verifyHypRedirect: async () => ({ verified: true, outcome: 'paid', ccode: '0', raw: 'CCode=0' }),
    });
    assert.equal(again.paid, true);
    assert.equal(table('commerce_orders').get(out.orderId).amount_paid, 400);
    assert.equal(table('payment_receipts').size, 1);
  }

  // --- Consumers, using the paid Bubbles order created last above ---------------------
  const bubbles = ROOMS[1];
  const paid = await payDeposit(bubbles, 'hyp-bubbles-consumers');
  const orderId = paid.out.orderId;
  const orderRow = table('commerce_orders').get(orderId);
  const itemRows = [...table('commerce_order_items').values()];
  const receiptRow = [...table('payment_receipts').values()][0];

  // Booking confirmation API (what /payment/thanks renders).
  const token = bookingAccessToken(orderId, CUSTOMER.phone);
  assert.ok(token, 'fake secret produces a token');
  const bookingRes = await bookingRoute.GET(
    new Request(`http://localhost/api/commerce/booking/${orderId}?token=${token}&lang=en`),
    { params: { orderId } },
  );
  assert.equal(bookingRes.status, 200);
  const booking = await bookingRes.json();
  assert.equal(booking.paymentVerified, true);
  assert.equal(booking.experience, `${RETREAT_TITLE} - ${bubbles.label}`);
  assert.equal(booking.total, 3850);
  assert.equal(booking.amountPaid, 400);
  assert.equal(booking.remaining, 3450);
  assert.equal(booking.paymentStatus, PAYMENT_STATUS.PARTIALLY_PAID);
  const waFromBooking = decodeURIComponent(booking.whatsappUrl.split('text=')[1]);
  assert.ok(waFromBooking.includes('Bubbles Room'));
  assert.ok(waFromBooking.includes('₪400'));
  assert.ok(waFromBooking.includes('₪3,450'));

  // WhatsApp text (EN + AR).
  for (const lang of ['en', 'ar']) {
    const text = decodeURIComponent(whatsappFromOrder(orderRow, itemRows, lang).split('text=')[1]);
    assert.ok(text.includes('Bubbles Room'), `${lang} WhatsApp names the room`);
    assert.ok(text.includes('₪400'));
    assert.ok(text.includes('₪3,450'), `${lang} WhatsApp shows the 3,450 balance`);
    assert.ok(!text.includes('₪3,250'));
  }

  // Receipt PDF: real bytes (header + page count), then the drawn text decoded from the bytes.
  const pdfBytes = await generateReceiptPdf({ order: orderRow, items: itemRows, receipt: receiptRow });
  assert.equal(Buffer.from(pdfBytes.slice(0, 5)).toString('latin1'), '%PDF-');
  assert.ok(pdfBytes.length > 1000);
  const drawn = [];
  for (const m of Buffer.from(pdfBytes).toString('latin1').matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
    const chunk = Buffer.from(m[1], 'latin1');
    let body;
    try {
      body = inflateSync(chunk).toString('latin1');
    } catch {
      body = chunk.toString('latin1');
    }
    for (const h of body.matchAll(/<([0-9A-Fa-f]+)>\s*Tj/g)) {
      drawn.push(Buffer.from(h[1], 'hex').toString('latin1'));
    }
  }
  assert.ok(drawn.some((t) => t.startsWith('Experience:') && t.includes('Bubbles Room')));
  assert.ok(drawn.includes('Total booking price: ILS 3,850'));
  assert.ok(drawn.includes('Amount received (this payment): ILS 400'));
  assert.ok(drawn.includes('Total paid to date: ILS 400'));
  assert.ok(drawn.includes('Remaining balance: ILS 3,450'));

  // Admin API: whitelisted fields only; room id/label and balances are exposed.
  orderRow.metadata.internalNote = 'INTERNAL-NOTE-MARKER';
  orderRow.metadata.healthDetails = 'HEALTH-MARKER';
  itemRows[0].metadata.notes = 'NOTES-MARKER';
  itemRows[0].metadata.healthDetails = 'HEALTH-MARKER-ITEM';
  table('commerce_orders').set(orderId, orderRow);
  table('commerce_order_items').set(itemRows[0].id, itemRows[0]);
  const adminRes = await adminOrdersRoute.GET({
    url: `http://localhost/api/admin/commerce-orders?orderId=${orderId}`,
    nextUrl: new URL(`http://localhost/api/admin/commerce-orders?orderId=${orderId}`),
    headers: new Headers(),
  });
  assert.equal(adminRes.status, 200);
  const adminText = await adminRes.text();
  const admin = JSON.parse(adminText);
  assert.equal(admin.order.total, 3850);
  assert.equal(admin.order.amount_paid, 400);
  assert.equal(admin.order.remaining, 3450);
  assert.equal(admin.order.payment_status, PAYMENT_STATUS.PARTIALLY_PAID);
  assert.equal(admin.order.status, 'confirmed');
  assert.equal(admin.order.metadata.roomId, 'bubbles');
  assert.equal(Number(admin.order.metadata.chargeAmount), 400);
  assert.equal(admin.items[0].room_id, 'bubbles');
  assert.equal(admin.items[0].room_label, 'Bubbles Room');
  assert.equal(admin.items[0].unit_price, 3850);
  assert.ok(admin.items[0].title.endsWith('Bubbles Room'));
  for (const leaked of ['INTERNAL-NOTE-MARKER', 'HEALTH-MARKER', 'NOTES-MARKER', CUSTOMER.phone]) {
    assert.ok(!adminText.includes(leaked), `admin response must not leak ${leaked}`);
  }
  const ALLOWED_ORDER_META = new Set([
    'commerceType', 'itemId', 'roomId', 'chargeAmount', 'paymentKind', 'paymentAttemptId',
    'paymentAttemptStatus', 'correlationId', 'paymentFailureCode', 'paymentFailureReason',
    'paymentAttemptUpdatedAt', 'lastPaymentUpdateAt', 'hypTransactionId', 'paymentOutcomeUnknown',
    'paymentFinalizationState', 'paymentFinalizationError', 'adminPaymentOutcome',
  ]);
  for (const key of Object.keys(admin.order.metadata)) {
    assert.ok(ALLOWED_ORDER_META.has(key), `unexpected admin metadata key ${key}`);
  }
  assert.deepEqual(
    Object.keys(admin.items[0]).sort(),
    ['commerce_type', 'currency', 'id', 'item_id', 'quantity', 'room_id', 'room_label', 'title', 'unit_price'],
  );

  // =================================================================================
  // 7. Amount mismatch still refuses to confirm (existing protection, unchanged)
  // =================================================================================
  resetDb();
  const mismatchOrder = await processCheckout(
    checkoutBody({ roomId: 'bubbles', payment: 'hyp', depositAmount: 400 }),
    REQUEST,
  );
  const mismatch = await confirmHypPayFromRedirect(
    `Id=hyp-mismatch&Order=${mismatchOrder.orderId}&Amount=3850&CCode=0&Coin=1&Fild3=deposit`,
    {
      resolveAttemptForOrder: async () => null,
      verifyHypRedirect: async () => ({ verified: true, outcome: 'paid', ccode: '0', raw: 'CCode=0' }),
    },
  );
  assert.equal(mismatch.paid, false);
  assert.equal(mismatch.code, 'AMOUNT_MISMATCH');
  const mismatchRow = table('commerce_orders').get(mismatchOrder.orderId);
  assert.equal(mismatchRow.amount_paid, 0);
  assert.notEqual(mismatchRow.payment_status, PAYMENT_STATUS.PAID);
  assert.equal(mismatchRow.status, 'pending');
});

// =====================================================================================
// 8. Static checks on browser files (no browser available in this suite)
// =====================================================================================
const fmt = (n) => n.toLocaleString('en-US');
const regJs = read('public/legacy/js/wadi-rum-registration.js');
const payJs = read('public/legacy/js/wadi-rum-deposit-pay.js');
const pageJsx = read('app/register/wadi-rum/page.jsx');
const thanksJs = read('public/legacy/js/payment-thanks.js');

// Displayed prices must match the server catalog.
for (const room of ROOMS) {
  assert.ok(regJs.includes(`Room — ${fmt(room.amount)} ₪`), `EN price text for ${room.id}`);
  assert.ok(regJs.includes(`${room.labelAr} — ${fmt(room.amount)} ₪`), `AR price text for ${room.id}`);
  assert.ok(pageJsx.includes(`Room — ${fmt(room.amount)} ₪`));
}

// Two required radios, no default selection.
assert.match(pageJsx, /choice\('radio', 'roomId', 'panorama', 'pricePanorama', '[^']+', true\)/);
assert.match(pageJsx, /choice\('radio', 'roomId', 'bubbles', 'priceBubbles', '[^']+', true\)/);
assert.doesNotMatch(pageJsx.split('id="grp-room"')[1].split('</fieldset>')[0], /\bchecked\b/);
assert.ok(pageJsx.includes('id="grp-room"') && pageJsx.includes("err('room')"));

// Validation messages exist in both languages.
for (const key of ['roomLegend', 'roomHint', 'errRoom']) {
  assert.equal(regJs.split(`${key}:`).length - 1, 2, `${key} must exist in EN and AR`);
}
assert.match(regJs, /room: \{ step: 1, group: "roomId"/);
const i18n = read('public/legacy/js/i18n.js');
assert.equal(i18n.split('retreat_wadi_checkout_room_invalid:').length - 1, 2, 'i18n key in EN and AR');

// The room reaches checkout; the request payload shape is unchanged; no price is sent.
const payloadBlock = regJs.split('var payload = {')[1].split('};')[0];
assert.ok(!payloadBlock.includes('roomId'), 'registration request payload shape is unchanged');
assert.match(payJs, /roomId: customer\.roomId,/);
const bodyStart = payJs.indexOf('body: JSON.stringify({');
const bodyEnd = payJs.indexOf('cancelUrl:', bodyStart);
assert.ok(bodyStart > 0 && bodyEnd > bodyStart, 'checkout body block located');
const checkoutBodyBlock = payJs.slice(bodyStart, bodyEnd);
for (const forbidden of ['unitPrice', 'total', 'amount:', 'price', 'currency']) {
  assert.ok(!checkoutBodyBlock.includes(forbidden), `checkout body must not send ${forbidden}`);
}
assert.ok(payJs.includes("customer.roomId !== 'panorama' && customer.roomId !== 'bubbles'"));

// Retry cannot change the chosen room: frozen object + locked radios.
assert.match(regJs, /window\.__wadiRumPayRetry = Object\.freeze\(\{[\s\S]*roomId: roomId[\s\S]*\}\);/);
assert.ok(regJs.includes('input.disabled = true'));
assert.ok(regJs.includes('showPaymentRetry(saved, roomId)'));

// Thanks page shows the remaining balance for partial payments.
assert.ok(thanksJs.includes('Number(data.remaining) > 0'));

console.log(
  'test-wadi-rum-rooms: all assertions passed (fake DB + stubbed Hyp SIGN; fake env only; no network, database or payment)',
);
