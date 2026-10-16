/**
 * Offline test: Hyp return redirect hands the thanks page a booking-view cookie, and that cookie
 * (without any URL token) is what unlocks the booking API and the receipt PDF.
 *
 * - Real route handlers (return, booking, receipt) and real access/PDF code.
 * - Payment finalization and the order/receipt stores are stubbed: nothing is verified with Hyp,
 *   nothing touches a database, nothing touches the network. Fake secret only.
 *
 * Run: node scripts/test-hyp-return-cookie.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(fileURLToPath(import.meta.url), '..', '..');

process.env.BOOKING_ACCESS_SECRET = 'test-only-booking-secret-not-real';

globalThis.fetch = async () => {
  throw new Error('Network access is blocked in test-hyp-return-cookie');
};

// ---- Stub stores shared with the loader-hook modules below ---------------------------------
const PHONE = '+972501234567';
const ORDER_ID = 'ord-return-1';
const state = {
  orders: new Map(),
  items: new Map(),
  receipts: new Map(),
  confirm: null,
  confirmThrows: false,
};
globalThis.__hypReturnTest = state;

state.orders.set(ORDER_ID, {
  id: ORDER_ID,
  total: 3850,
  subtotal: 3850,
  currency: 'ILS',
  amount_paid: 400,
  payment_status: 'partially_paid',
  status: 'confirmed',
  payment_method: 'hyp',
  booking_reference: 'NY-RET-1',
  customer: { fullName: 'Test Customer', phone: PHONE },
  metadata: { commerceType: 'retreat', itemId: 'wadi-rum', roomId: 'bubbles', bookingStatus: 'confirmed', amountPaid: 400 },
});
state.items.set(ORDER_ID, [
  {
    id: 'item-1',
    commerce_type: 'retreat',
    item_id: 'wadi-rum',
    title: 'Wadi Rum Retreat - Bubbles Room',
    quantity: 1,
    unit_price: 3850,
    currency: 'ILS',
    metadata: { roomId: 'bubbles', roomLabel: 'Bubbles Room' },
  },
]);
state.receipts.set(ORDER_ID, [
  {
    id: 'rcpt-1',
    document_number: 'NY-RET-0001',
    document_type: 'deposit_receipt',
    currency: 'ILS',
    amount: 400,
    created_at: '2026-10-16T10:00:00.000Z',
    metadata: {
      totalBooking: 3850,
      cumulativePaid: 400,
      remainingAfter: 3450,
      providerTransactionId: 'HYP-TXN-1',
    },
  },
]);

// Loader hook: map "@/x" to the repo; stub only the finalization and the two data stores.
register(
  'data:text/javascript,' +
    encodeURIComponent(`
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const root = ${JSON.stringify(root)};
const stubs = {
  '@/lib/commerce/payment': \`
    export async function confirmHypPayFromRedirect() {
      const s = globalThis.__hypReturnTest;
      if (s.confirmThrows) throw new Error('boom');
      return s.confirm;
    }\`,
  '@/lib/commerce/orders': \`
    export async function getOrder(id) { return globalThis.__hypReturnTest.orders.get(id) || null; }
    export async function getOrderItems(id) { return globalThis.__hypReturnTest.items.get(id) || []; }
    export function siteUrlFromRequest() { return 'https://example.test'; }\`,
  '@/lib/commerce/receipts': \`
    export async function listReceiptsForOrder(id) { return globalThis.__hypReturnTest.receipts.get(id) || []; }
    export async function findReceiptByTransaction() { return null; }\`,
};
export async function resolve(specifier, context, nextResolve) {
  if (stubs[specifier]) {
    return { url: 'data:text/javascript,' + encodeURIComponent(stubs[specifier]), shortCircuit: true };
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

const load = (rel) => import(pathToFileURL(join(root, rel)).href);
const returnRoute = await load('app/api/payment/hyp/return/route.js');
const bookingRoute = await load('app/api/commerce/booking/[orderId]/route.js');
const receiptRoute = await load('app/api/commerce/receipt/[orderId]/route.js');
const { bookingViewSetCookieHeader, createBookingViewCookieValue, BOOKING_VIEW_COOKIE_NAME } = await load(
  'lib/commerce/booking-access.js',
);
const { paymentThanksTarget } = await load('lib/commerce/thanks-path.js');

// Silence structured telemetry from the return route.
const realLog = console.log;
console.log = (...args) => {
  if (typeof args[0] === 'string' && /^\[(payment-attempt|hyp-pay)\]/.test(args[0])) return;
  realLog(...args);
};
const realError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && /^\[(payment-attempt|hyp-pay)\]/.test(args[0])) return;
  realError(...args);
};
const realInfo = console.info;
console.info = (...args) => {
  if (typeof args[0] === 'string' && /^\[(payment-attempt|hyp-pay)\]/.test(args[0])) return;
  realInfo(...args);
};

function returnRequest(query = 'Order=ord-return-1&Id=hyp-9&Amount=400&CCode=0') {
  return new Request(`https://example.test/api/payment/hyp/return?${query}`);
}

function requestWithCookie(url, cookieHeaderValue) {
  const cookies = new Map();
  if (cookieHeaderValue) {
    const [pair] = cookieHeaderValue.split(';');
    const idx = pair.indexOf('=');
    cookies.set(pair.slice(0, idx), pair.slice(idx + 1));
  }
  const req = new Request(url);
  req.cookies = { get: (name) => (cookies.has(name) ? { value: cookies.get(name) } : undefined) };
  return req;
}

const params = (orderId) => ({ params: { orderId } });
const thanksQuery = (res) => new URL(res.headers.get('location')).searchParams;

// ---- 1. Paid return: redirect + HttpOnly cookie, no token in the URL ------------------------
state.confirm = { paid: true, orderId: ORDER_ID };
const paid = await returnRoute.GET(returnRequest());
assert.equal(paid.status, 302);
assert.ok(paid.headers.get('location').startsWith('https://example.test/payment/thanks?'));
assert.equal(thanksQuery(paid).get('order'), ORDER_ID);
assert.equal(thanksQuery(paid).get('token'), null, 'paid thanks URL must not carry the access token');
const paidCookie = paid.headers.get('set-cookie');
assert.ok(paidCookie && paidCookie.startsWith(`${BOOKING_VIEW_COOKIE_NAME}=`), 'Set-Cookie present');
assert.match(paidCookie, /;\s*HttpOnly/);
assert.match(paidCookie, /;\s*SameSite=Lax/);
assert.match(paidCookie, /;\s*Path=\//);
assert.match(paidCookie, /;\s*Max-Age=7200/);
assert.equal(paid.headers.get('cache-control'), 'no-store');

// ---- 2. Pending return: cookie too, flagged pending -----------------------------------------
state.confirm = { paid: false, pending: true, orderId: ORDER_ID };
const pending = await returnRoute.GET(returnRequest());
assert.equal(pending.status, 302);
assert.equal(thanksQuery(pending).get('payment'), 'pending');
assert.equal(thanksQuery(pending).get('token'), null);
assert.ok(pending.headers.get('set-cookie'));

// ---- 3. Failed return: no cookie, legacy URL unchanged ---------------------------------------
state.confirm = { paid: false, orderId: ORDER_ID };
const failed = await returnRoute.GET(returnRequest());
assert.equal(failed.status, 302);
assert.equal(failed.headers.get('set-cookie'), null, 'failed payment grants no booking view');
assert.equal(thanksQuery(failed).get('payment'), 'failed');
assert.ok(thanksQuery(failed).get('token'), 'failed payment keeps the legacy token URL');

state.confirm = { paid: false };
const noOrder = await returnRoute.GET(returnRequest());
assert.equal(noOrder.headers.get('set-cookie'), null);
assert.equal(new URL(noOrder.headers.get('location')).pathname, '/register/wadi-rum');

// ---- 4. Invalid / error paths never set a cookie ----------------------------------------------
const invalid = await returnRoute.GET(new Request('https://example.test/api/payment/hyp/return'));
assert.equal(invalid.status, 302);
assert.equal(invalid.headers.get('set-cookie'), null);
assert.equal(new URL(invalid.headers.get('location')).searchParams.get('payment'), 'invalid');

state.confirmThrows = true;
const errored = await returnRoute.GET(returnRequest());
state.confirmThrows = false;
assert.equal(errored.status, 302);
assert.equal(errored.headers.get('set-cookie'), null);
assert.equal(new URL(errored.headers.get('location')).searchParams.get('payment'), 'error');

// ---- 5. Missing signing secret: no cookie, no crash --------------------------------------------
{
  const saved = process.env.BOOKING_ACCESS_SECRET;
  delete process.env.BOOKING_ACCESS_SECRET;
  try {
    state.confirm = { paid: true, orderId: ORDER_ID };
    const res = await returnRoute.GET(returnRequest());
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('set-cookie'), null);
    assert.deepEqual(paymentThanksTarget(ORDER_ID, PHONE).setCookie, null);
  } finally {
    process.env.BOOKING_ACCESS_SECRET = saved;
  }
}

// ---- 6. The cookie alone unlocks booking data and the real receipt PDF -----------------------
const bookingUrl = `https://example.test/api/commerce/booking/${ORDER_ID}?lang=en`;
const withCookie = requestWithCookie(bookingUrl, paidCookie);
const bookingRes = await bookingRoute.GET(withCookie, params(ORDER_ID));
assert.equal(bookingRes.status, 200);
const booking = await bookingRes.json();
assert.equal(booking.paymentVerified, true);
assert.equal(booking.experience, 'Wadi Rum Retreat - Bubbles Room');
assert.equal(booking.total, 3850);
assert.equal(booking.amountPaid, 400);
assert.equal(booking.remaining, 3450);
assert.ok(booking.pdfUrl && !booking.pdfUrl.includes('token'), 'thanks page PDF link carries no token');

const pdfRes = await receiptRoute.GET(requestWithCookie(`https://example.test${booking.pdfUrl}`, paidCookie), params(ORDER_ID));
assert.equal(pdfRes.status, 200);
assert.equal(pdfRes.headers.get('content-type'), 'application/pdf');
const pdfBytes = new Uint8Array(await pdfRes.arrayBuffer());
assert.ok(pdfBytes.length > 1000);
assert.equal(Buffer.from(pdfBytes.slice(0, 5)).toString('latin1'), '%PDF-');

// ---- 7. Without a valid cookie or token, access is refused -----------------------------------
const noCookieBooking = await bookingRoute.GET(requestWithCookie(bookingUrl, null), params(ORDER_ID));
assert.equal(noCookieBooking.status, 403);
const noCookiePdf = await receiptRoute.GET(
  requestWithCookie(`https://example.test/api/commerce/receipt/${ORDER_ID}`, null),
  params(ORDER_ID),
);
assert.equal(noCookiePdf.status, 403, 'receipt PDF requires the cookie (or a token)');

const [name, ...rest] = paidCookie.split(';')[0].split('=');
const tampered = `${name}=${rest.join('=').replace(/.$/, (c) => (c === '0' ? '1' : '0'))}`;
assert.equal((await bookingRoute.GET(requestWithCookie(bookingUrl, tampered), params(ORDER_ID))).status, 403);

// Cookie issued for another phone / another order is rejected.
const otherPhone = bookingViewSetCookieHeader(createBookingViewCookieValue(ORDER_ID, '+972509999999'));
assert.equal((await bookingRoute.GET(requestWithCookie(bookingUrl, otherPhone), params(ORDER_ID))).status, 403);
const otherOrder = bookingViewSetCookieHeader(createBookingViewCookieValue('ord-other', PHONE));
assert.equal((await bookingRoute.GET(requestWithCookie(bookingUrl, otherOrder), params(ORDER_ID))).status, 403);

// Expired cookie is rejected.
{
  const realNow = Date.now;
  Date.now = () => realNow() + 3 * 60 * 60 * 1000;
  try {
    assert.equal((await bookingRoute.GET(requestWithCookie(bookingUrl, paidCookie), params(ORDER_ID))).status, 403);
  } finally {
    Date.now = realNow;
  }
}

// ---- 8. Cookie attributes: Secure in production ------------------------------------------------
{
  const savedEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    assert.match(bookingViewSetCookieHeader('x'), /;\s*Secure/);
  } finally {
    process.env.NODE_ENV = savedEnv;
  }
}

// ---- 9. Static invariant kept by test-security-phase-b1 ---------------------------------------
const routeSource = readFileSync(join(root, 'app/api/payment/hyp/return/route.js'), 'utf8');
assert.ok(routeSource.includes('Set-Cookie'));
assert.ok(!routeSource.includes('Response.redirect(target'), 'success redirect must not use immutable Response.redirect');

console.log = realLog;
console.error = realError;
console.info = realInfo;
console.log(
  'test-hyp-return-cookie: all assertions passed (stubbed finalization/stores; fake secret; no network, database or payment)',
);
