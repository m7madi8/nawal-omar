import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { PAYMENT_STATUS, WADI_RUM_DEPOSIT_ILS } from '../lib/commerce/constants.js';
import { RETREAT_CATALOG } from '../lib/commerce/catalog/retreats.js';
import { processCheckout } from '../lib/commerce/checkout.js';
import { confirmHypPayFromRedirect } from '../lib/commerce/payment/confirmation.js';
import { updateLegacyMirrorPaid } from '../lib/commerce/legacy-update.js';
import { collapseLinkedBookingRows } from '../lib/commerce/admin-booking-rows.js';

/**
 * Offline tests for admin booking integrity (Phase 2E):
 *   1. a verified payment confirms ONLY the linked legacy mirror (status + payment fields),
 *   2. unverified / declined / mismatched payments never confirm it,
 *   3. the admin registrations list counts one logical booking once.
 *
 * No network, no real database, no payment provider. global.fetch is an in-memory PostgREST fake
 * plus a Hyp SIGN stub that only records the request. Hyp VERIFY is injected. Credentials are fake.
 */

const root = join(fileURLToPath(import.meta.url), '..', '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');

const FAKE_SUPABASE = 'https://fake-project.invalid';
const ENV = {
  SUPABASE_URL: FAKE_SUPABASE,
  SUPABASE_SERVICE_ROLE_KEY: 'fake-service-key-for-offline-test',
  HYP_PAYMENTS_ENABLED: 'true',
  HYP_TERMINAL_ID: '0010012345',
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
const writes = [];
function table(name) {
  if (!tables.has(name)) tables.set(name, new Map());
  return tables.get(name);
}
function resetDb() {
  tables.clear();
  writes.length = 0;
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
const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

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
      return json(200, [...rows.values()].filter((row) => rowMatches(row, u.searchParams)).map(clone));
    }
    throw new Error(`Unsupported fake REST method ${method}`);
  }
  if (u.origin === 'https://pay.hyp.co.il' && u.searchParams.get('What') === 'SIGN') {
    return new Response('action=pay&signature=fake-signature-for-offline-test', { status: 200 });
  }
  throw new Error(`Network access is blocked in test-admin-booking-integrity: ${u.origin}`);
};

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
  if (specifier === '@/lib/admin-auth') return { url: adminAuthStub, shortCircuit: true };
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

const registrationsRoute = await import(
  pathToFileURL(join(root, 'app/api/admin/registrations/route.js')).href
);

// ---- Fixtures ---------------------------------------------------------------------------
const PHONE = '+972521234567';
const CUSTOMER = { fullName: 'Test Person', phone: PHONE, email: '', city: '' };
const REQUEST = new Request('http://localhost/api/commerce/checkout');
const SOURCE = 'wadi-rum-registration';
const ORIGINAL_ID = 'req-1700000000001';
const UNRELATED_ID = 'req-1700000000002'; // same phone + source, a genuinely separate request
const OTHER_PHONE_ID = 'req-1700000000003';
const STANDALONE_ID = 'req-1700000000004'; // different person, never paid

function requestRow(id, over = {}) {
  return {
    id,
    source: SOURCE,
    retreatType: 'wadi-rum',
    submittedAt: '2026-10-01T10:00:00.000Z',
    createdAt: '2026-10-01T10:00:00.000Z',
    fullName: 'Test Person',
    phone: PHONE,
    age: '33',
    city: 'Haifa',
    reason: 'Because of intake',
    expectation: 'Rest',
    yogaExperience: 'beginner',
    healthStatus: 'none',
    healthDetails: '-',
    activities: 'hiking',
    freeNote: 'User typed note, not JSON',
    status: 'pending',
    ...over,
  };
}

function seedRequests() {
  const rows = table('retreat_requests');
  rows.set(ORIGINAL_ID, requestRow(ORIGINAL_ID));
  rows.set(UNRELATED_ID, requestRow(UNRELATED_ID, { fullName: 'Same Phone Other Request' }));
  rows.set(
    OTHER_PHONE_ID,
    requestRow(OTHER_PHONE_ID, { phone: '+972509999999', fullName: 'Someone Else' }),
  );
  rows.set(
    STANDALONE_ID,
    requestRow(STANDALONE_ID, { phone: '+972508888888', fullName: 'Standalone Person' }),
  );
}

const requestSnapshot = (id) => clone(table('retreat_requests').get(id));

function checkoutBody(extra = {}) {
  return {
    commerceType: 'retreat',
    itemId: 'wadi-rum',
    roomId: 'bubbles',
    payment: 'hyp',
    depositAmount: 400,
    retreatRequestId: ORIGINAL_ID,
    notes: `Registration request ${ORIGINAL_ID}`,
    customer: { ...CUSTOMER },
    ...extra,
  };
}

async function startCheckout(extra) {
  const out = await processCheckout(checkoutBody(extra), REQUEST);
  assert.equal(out.ok, true);
  const order = table('commerce_orders').get(out.orderId);
  return { out, order, mirrorId: order.metadata.legacyMirrorId };
}

const redirectQuery = (out, hypId, { amount = 400, ccode = 0 } = {}) =>
  `Id=${hypId}&Order=${out.orderId}&Amount=${amount}&CCode=${ccode}&Coin=1&Fild1=${out.orderId}&Fild3=deposit`;
const verifyAs = (outcome, ccode = '0') => ({
  resolveAttemptForOrder: async () => null,
  verifyHypRedirect: async () => ({ verified: outcome === 'paid', outcome, ccode, raw: `CCode=${ccode}` }),
});

const retreatRequestWrites = () => writes.filter((w) => w.table === 'retreat_requests');
const mirrorNote = (id) => JSON.parse(table('retreat_requests').get(id).freeNote);

async function adminRows() {
  const url = 'http://localhost/api/admin/registrations';
  const res = await registrationsRoute.GET(Object.assign(new Request(url), { nextUrl: new URL(url) }));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.ok, true);
  return body.rows;
}
// Same predicates as computeStats() in public/admin/workspace.js (asserted against the source below).
const RETREAT_SOURCES = ['wadi-rum-registration', 'zanzibar-retreat-reserve', 'dahab-retreat-reserve'];
const retreatCount = (rows) => rows.filter((r) => RETREAT_SOURCES.includes(r.source)).length;
const retreatPending = (rows) =>
  rows.filter((r) => RETREAT_SOURCES.includes(r.source) && r.status !== 'completed').length;

await withEnv(ENV, async () => {
  // ===================================================================================
  // A. Linked mirror: verified payment confirms ONLY the mirror
  // ===================================================================================
  resetDb();
  seedRequests();
  const before = {
    original: requestSnapshot(ORIGINAL_ID),
    unrelated: requestSnapshot(UNRELATED_ID),
    otherPhone: requestSnapshot(OTHER_PHONE_ID),
    standalone: requestSnapshot(STANDALONE_ID),
  };

  const { out, order: startedOrder, mirrorId } = await startCheckout();
  assert.match(mirrorId, /^req-wadi-/, 'mirror has its own server-generated id');
  assert.notEqual(mirrorId, ORIGINAL_ID);

  const mirror0 = table('retreat_requests').get(mirrorId);
  const note0 = JSON.parse(mirror0.freeNote);
  assert.equal(note0.commerceOrderId, out.orderId, 'mirror note links to the order');
  assert.equal(note0.retreatRequestId, ORIGINAL_ID, 'mirror note links to the original request');
  assert.equal('bookingStatus' in note0, false, 'checkout alone never marks the mirror confirmed');
  assert.equal(mirror0.status, 'pending');
  assert.equal(startedOrder.metadata.bookingStatus, 'new_request');
  assert.equal(startedOrder.metadata.chargeAmount, WADI_RUM_DEPOSIT_ILS, 'deposit is still 400');
  assert.equal(startedOrder.total, 3850, 'Bubbles price unchanged');

  // A1. Admin list before payment: one logical booking, still pending, not confirmed.
  let rows = await adminRows();
  assert.equal(rows.length, 4, 'original + unrelated + other-phone + standalone (mirror collapsed)');
  assert.equal(rows.filter((r) => r.id === mirrorId).length, 0, 'mirror is not a separate row');
  const survivor0 = rows.find((r) => r.id === ORIGINAL_ID);
  assert.equal(survivor0.mirrorId, mirrorId);
  assert.equal(survivor0.status, 'pending');
  assert.equal(JSON.parse(survivor0.commerceNote).bookingStatus, undefined);
  assert.equal(retreatPending(rows), 4);

  // A2. Non-success outcomes never confirm the mirror and never write to retreat_requests.
  const noConfirmCases = [
    ['declined', async () => confirmHypPayFromRedirect(redirectQuery(out, 'hyp-declined', { ccode: 902 }), verifyAs('declined', '902'))],
    ['verify unavailable', async () => confirmHypPayFromRedirect(redirectQuery(out, 'hyp-unavail'), verifyAs('unavailable'))],
    ['unclassified outcome', async () => confirmHypPayFromRedirect(redirectQuery(out, 'hyp-weird'), verifyAs('weird'))],
    ['amount mismatch', async () => confirmHypPayFromRedirect(redirectQuery(out, 'hyp-amt', { amount: 1 }), verifyAs('paid'))],
  ];
  for (const [name, run] of noConfirmCases) {
    const writesBefore = retreatRequestWrites().length;
    const result = await run();
    assert.equal(result.paid, false, `${name}: not paid`);
    const note = mirrorNote(mirrorId);
    assert.equal('bookingStatus' in note, false, `${name}: mirror stays unconfirmed`);
    assert.equal(table('retreat_requests').get(mirrorId).status, 'pending', `${name}: mirror status unchanged`);
    assert.equal(retreatRequestWrites().length, writesBefore, `${name}: no write to retreat_requests`);
    assert.notEqual(table('commerce_orders').get(out.orderId).metadata.bookingStatus, 'confirmed');
  }

  // A3. Verified deposit: mirror confirmed, payment fields written, everything else preserved.
  const mirrorBeforePay = clone(table('retreat_requests').get(mirrorId));
  const paid = await confirmHypPayFromRedirect(redirectQuery(out, 'hyp-ok-1'), verifyAs('paid'));
  assert.equal(paid.paid, true);
  assert.equal(paid.finalizationIncomplete, false);

  const order = table('commerce_orders').get(out.orderId);
  assert.equal(order.metadata.bookingStatus, 'confirmed');
  assert.equal(order.payment_status, PAYMENT_STATUS.PARTIALLY_PAID);
  assert.equal(order.amount_paid, 400);

  const mirror1 = table('retreat_requests').get(mirrorId);
  const note1 = JSON.parse(mirror1.freeNote);
  assert.equal(note1.bookingStatus, 'confirmed', 'linked mirror is confirmed');
  assert.equal(mirror1.status, 'completed', 'mirror workflow status follows payment (existing rule)');
  assert.equal(note1.paymentStatus, PAYMENT_STATUS.PARTIALLY_PAID);
  assert.equal(note1.amountPaid, 400);
  assert.equal(note1.remainingBalance, 3450);
  assert.equal(note1.providerTransactionId, 'hyp-ok-1');
  assert.ok(note1.bookingReference, 'booking reference written');
  // Preserved note content and metadata.
  for (const key of ['commerceOrderId', 'retreatRequestId', 'commerceType', 'currency', 'subtotal', 'total', 'paymentMethod']) {
    assert.deepEqual(note1[key], note0[key], `note.${key} preserved`);
  }
  assert.deepEqual(note1.items, note0.items, 'note items (room metadata) preserved');
  assert.equal(note1.items[0].metadata.roomId, 'bubbles');
  for (const key of ['fullName', 'phone', 'source', 'retreatType', 'reason', 'age', 'city', 'submittedAt']) {
    assert.deepEqual(mirror1[key], mirrorBeforePay[key], `mirror.${key} preserved`);
  }

  // A4. Unrelated rows are untouched; only the mirror was written.
  assert.deepEqual(requestSnapshot(ORIGINAL_ID), before.original, 'original request untouched');
  assert.deepEqual(requestSnapshot(UNRELATED_ID), before.unrelated, 'same-phone request untouched');
  assert.deepEqual(requestSnapshot(OTHER_PHONE_ID), before.otherPhone, 'other-phone request untouched');
  assert.deepEqual(requestSnapshot(STANDALONE_ID), before.standalone, 'standalone request untouched');
  const touched = new Set(retreatRequestWrites().filter((w) => w.method === 'PATCH').map((w) => w.id));
  assert.deepEqual([...touched], [mirrorId], 'only the linked mirror was patched');

  // A5. Idempotent repeat return keeps the confirmed state.
  const again = await confirmHypPayFromRedirect(redirectQuery(out, 'hyp-ok-1'), verifyAs('paid'));
  assert.equal(again.paid, true);
  assert.equal(mirrorNote(mirrorId).bookingStatus, 'confirmed');
  assert.equal(mirrorNote(mirrorId).amountPaid, 400);

  // ===================================================================================
  // B. Guards: updateLegacyMirrorPaid never rewrites a row that is not this order's mirror
  // ===================================================================================
  const writesBeforeGuards = writes.length;
  const orderForGuard = clone(table('commerce_orders').get(out.orderId));

  const pointsAtRequest = {
    ...orderForGuard,
    metadata: { ...orderForGuard.metadata, legacyMirrorId: UNRELATED_ID },
  };
  assert.equal(await updateLegacyMirrorPaid(pointsAtRequest, 'x'), null, 'plain request is not a mirror');
  assert.deepEqual(requestSnapshot(UNRELATED_ID), before.unrelated);

  const pointsAtOriginal = {
    ...orderForGuard,
    metadata: { ...orderForGuard.metadata, legacyMirrorId: ORIGINAL_ID },
  };
  assert.equal(await updateLegacyMirrorPaid(pointsAtOriginal, 'x'), null);
  assert.deepEqual(requestSnapshot(ORIGINAL_ID), before.original);

  const otherOrder = { ...orderForGuard, id: 'some-other-order' };
  assert.equal(await updateLegacyMirrorPaid(otherOrder, 'x'), null, 'mirror of another order is not touched');
  assert.equal(mirrorNote(mirrorId).commerceOrderId, out.orderId);

  const noMirror = { ...orderForGuard, metadata: { ...orderForGuard.metadata, legacyMirrorId: undefined } };
  assert.equal(await updateLegacyMirrorPaid(noMirror, 'x'), null);
  assert.equal(writes.length, writesBeforeGuards, 'guarded calls performed no writes');

  // An order that is paid but not confirmed (shop/Stripe path) does not get a bookingStatus.
  resetDb();
  seedRequests();
  const shopLike = await startCheckout({ payment: 'manual', retreatRequestId: undefined, notes: undefined });
  const shopOrder = clone(table('commerce_orders').get(shopLike.out.orderId));
  shopOrder.payment_status = PAYMENT_STATUS.PAID;
  shopOrder.amount_paid = shopOrder.total;
  shopOrder.metadata.amountPaid = shopOrder.total;
  assert.equal(shopOrder.metadata.bookingStatus, 'new_request');
  await updateLegacyMirrorPaid(shopOrder, 'stripe-session-1');
  assert.equal(
    'bookingStatus' in mirrorNote(shopLike.mirrorId),
    false,
    'paid but not confirmed order does not write bookingStatus',
  );
  assert.equal(mirrorNote(shopLike.mirrorId).amountPaid, shopOrder.total, 'payment fields still updated');
  assert.equal('retreatRequestId' in mirrorNote(shopLike.mirrorId), false, 'no link when none supplied');

  // ===================================================================================
  // C. Admin counting: through the real route, after a full paid flow
  // ===================================================================================
  resetDb();
  seedRequests();
  const flow = await startCheckout();
  await confirmHypPayFromRedirect(redirectQuery(flow.out, 'hyp-ok-2'), verifyAs('paid'));

  const stored = [...table('retreat_requests').values()];
  assert.equal(stored.length, 5, 'database still holds 4 requests + 1 mirror (nothing deleted)');

  rows = await adminRows();
  assert.equal(rows.length, 4, 'one logical booking counted once');
  assert.equal(retreatCount(rows), 4);
  assert.equal(table('retreat_requests').size, 5, 'list endpoint does not mutate the database');

  const merged = rows.find((r) => r.id === ORIGINAL_ID);
  assert.equal(merged.status, 'completed', 'confirmed booking shows the confirmed workflow status');
  const mergedNote = JSON.parse(merged.commerceNote);
  assert.equal(mergedNote.bookingStatus, 'confirmed');
  assert.equal(mergedNote.commerceOrderId, flow.out.orderId);
  assert.equal(merged.fullName, 'Test Person');
  assert.equal(merged.freeNote, 'User typed note, not JSON', 'original intake data kept');
  assert.equal(merged.healthStatus, 'none');
  assert.equal(merged.yogaExperience, 'beginner', 'intake answer not replaced by payment marker');

  // Genuine standalone and same-phone-but-unlinked requests are still counted, unchanged.
  for (const id of [UNRELATED_ID, OTHER_PHONE_ID, STANDALONE_ID]) {
    const row = rows.find((r) => r.id === id);
    assert.ok(row, `${id} still listed`);
    assert.equal(row.status, 'pending');
    assert.equal('commerceNote' in row, false);
    assert.deepEqual(row, requestSnapshot(id));
  }

  // Pending count excludes the confirmed booking; the old double count would have said 4 of 5.
  assert.equal(retreatPending(rows), 3, 'confirmed booking is not pending');
  assert.equal(retreatCount(rows) - retreatPending(rows), 1, 'exactly one reviewed/confirmed booking');

  // Unpaid checkout: still one booking, counted once, pending.
  resetDb();
  seedRequests();
  await startCheckout();
  rows = await adminRows();
  assert.equal(rows.length, 4);
  assert.equal(retreatPending(rows), 4);

  // ===================================================================================
  // D. collapseLinkedBookingRows: link validation and edge cases (pure)
  // ===================================================================================
  const mirrorRow = (id, requestId, over = {}, noteOver = {}) => ({
    ...requestRow(id, {
      reason: requestId ? `Registration request ${requestId}` : 'Booking',
      freeNote: JSON.stringify({
        commerceOrderId: `order-${id}`,
        ...(requestId ? { retreatRequestId: requestId } : {}),
        paymentStatus: 'pending',
        amountPaid: 0,
        ...noteOver,
      }),
      submittedAt: '2026-10-01T10:05:00.000Z',
      ...over,
    }),
  });
  const paidNote = { paymentStatus: 'partially_paid', amountPaid: 400, bookingStatus: 'confirmed' };
  const ids = (list) => list.map((r) => r.id);

  const orig = requestRow('req-1');
  const orig2 = requestRow('req-2', { phone: '+972501111111' });

  // Standalone only -> unchanged (same array contents).
  assert.deepEqual(collapseLinkedBookingRows([orig, orig2]), [orig, orig2]);
  assert.deepEqual(collapseLinkedBookingRows([]), []);
  assert.deepEqual(collapseLinkedBookingRows(null), []);

  // Explicit-link mirror and legacy (reason-only) mirror both collapse.
  const explicit = mirrorRow('m1', 'req-1', { status: 'completed' }, paidNote);
  assert.deepEqual(ids(collapseLinkedBookingRows([explicit, orig, orig2])), ['req-1', 'req-2']);
  const legacyMirror = mirrorRow('m1', 'req-1', {}, {});
  const legacyNote = JSON.parse(legacyMirror.freeNote);
  delete legacyNote.retreatRequestId; // pre-existing mirror: only the reason carries the link
  legacyMirror.freeNote = JSON.stringify(legacyNote);
  assert.deepEqual(ids(collapseLinkedBookingRows([legacyMirror, orig, orig2])), ['req-1', 'req-2']);

  // Survivor keeps the original's position/data and takes the mirror's order note and status.
  const out1 = collapseLinkedBookingRows([explicit, orig, orig2]);
  assert.equal(out1[0].status, 'completed');
  assert.equal(out1[0].commerceNote, explicit.freeNote);
  assert.equal(out1[0].freeNote, orig.freeNote);
  // Pending mirror does not override the original's own status.
  const pendingMirror = mirrorRow('m2', 'req-1');
  assert.equal(collapseLinkedBookingRows([pendingMirror, orig])[0].status, 'pending');
  assert.equal(
    collapseLinkedBookingRows([pendingMirror, { ...orig, status: 'completed' }])[0].status,
    'completed',
    'a reviewed original keeps its status when the mirror is still pending',
  );
  // Inputs are not mutated.
  assert.equal('commerceNote' in orig, false);

  // Not linked: different phone, different source, missing original, no link, same phone only.
  const wrongPhone = mirrorRow('m3', 'req-1', { phone: '+972507777777' });
  assert.deepEqual(ids(collapseLinkedBookingRows([wrongPhone, orig])), ['m3', 'req-1']);
  const wrongSource = mirrorRow('m4', 'req-1', { source: 'zanzibar-retreat-reserve' });
  assert.deepEqual(ids(collapseLinkedBookingRows([wrongSource, orig])), ['m4', 'req-1']);
  const orphan = mirrorRow('m5', 'req-404');
  assert.deepEqual(ids(collapseLinkedBookingRows([orphan, orig])), ['m5', 'req-1']);
  const noLink = mirrorRow('m6', null);
  assert.deepEqual(ids(collapseLinkedBookingRows([noLink, orig])), ['m6', 'req-1'], 'same phone alone never links');
  const sameEverythingElse = mirrorRow('m7', null, { fullName: orig.fullName, submittedAt: orig.submittedAt });
  assert.deepEqual(ids(collapseLinkedBookingRows([sameEverythingElse, orig])), ['m7', 'req-1'], 'name/time/phone never link');
  // Standalone commerce mirrors (events, lessons, shop) stay counted.
  const eventMirror = mirrorRow('m8', null, { source: 'sound-healing-event' });
  assert.deepEqual(ids(collapseLinkedBookingRows([eventMirror, orig])), ['m8', 'req-1']);
  // A mirror cannot link to another mirror.
  const mirrorToMirror = mirrorRow('m9', 'm1', {}, {});
  assert.deepEqual(ids(collapseLinkedBookingRows([explicit, mirrorToMirror, orig])), ['m9', 'req-1']);

  // Several mirrors for one request (retried checkout): exactly one collapses, paid wins,
  // no payment record is ever hidden.
  const retryUnpaid = mirrorRow('m10', 'req-1', { submittedAt: '2026-10-01T10:30:00.000Z' });
  const retryPaid = mirrorRow('m11', 'req-1', { status: 'completed', submittedAt: '2026-10-01T10:10:00.000Z' }, paidNote);
  const res = collapseLinkedBookingRows([retryUnpaid, retryPaid, orig]);
  assert.deepEqual(ids(res), ['m10', 'req-1'], 'paid mirror collapsed, unpaid retry stays visible');
  assert.equal(res[1].mirrorId, 'm11');
  assert.equal(res[1].status, 'completed');
  const twoPaid = collapseLinkedBookingRows([
    mirrorRow('m12', 'req-1', { status: 'completed', submittedAt: '2026-10-01T10:00:00.000Z' }, paidNote),
    mirrorRow('m13', 'req-1', { status: 'completed', submittedAt: '2026-10-01T11:00:00.000Z' }, paidNote),
    orig,
  ]);
  assert.deepEqual(ids(twoPaid), ['m12', 'req-1'], 'only one of two paid mirrors collapses; the other stays visible');
  assert.equal(twoPaid[1].mirrorId, 'm13', 'latest paid mirror wins');

  // A row whose freeNote is plain text or a non-order JSON is never treated as a mirror.
  const jsonButNotOrder = requestRow('req-9', { freeNote: '{"hello":"world"}' });
  const textNote = requestRow('req-10', { freeNote: '-' });
  assert.deepEqual(
    ids(collapseLinkedBookingRows([jsonButNotOrder, textNote, orig])),
    ['req-9', 'req-10', 'req-1'],
  );

  // ===================================================================================
  // E. Source integrity checks (client wiring and unchanged money rules)
  // ===================================================================================
  const workspace = read('public/admin/workspace.js');
  assert.ok(
    workspace.includes("RETREAT_SOURCES.indexOf(r.source) !== -1; });") &&
      workspace.includes("retreats.filter(function (r) { return r.status !== 'completed'; }).length"),
    'test predicates still mirror computeStats()',
  );
  assert.ok(workspace.includes('commerceNote: item.commerceNote'), 'client keeps the collapsed order note');
  assert.ok(workspace.includes('row.commerceNote || row.freeNote'), 'client reads the collapsed order note first');

  const wadi = RETREAT_CATALOG['wadi-rum'];
  assert.equal(wadi.rooms.panorama.amount, 3650);
  assert.equal(wadi.rooms.bubbles.amount, 3850);
  assert.equal(WADI_RUM_DEPOSIT_ILS, 400);
});

console.log('test-admin-booking-integrity: all assertions passed');
