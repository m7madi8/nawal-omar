import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { WADI_RUM_DEPOSIT_ILS } from '../lib/commerce/constants.js';
import { resolveCheckoutCharge } from '../lib/commerce/resolve-checkout-charge.js';
import { RETREAT_CATALOG } from '../lib/commerce/catalog/retreats.js';

const root = join(fileURLToPath(import.meta.url), '..', '..');

const wadiCatalog = RETREAT_CATALOG['wadi-rum'];
const wadiLine = {
  unitPrice: wadiCatalog.pricing.amount,
  quantity: 1,
  currency: wadiCatalog.pricing.currency,
};

// --- P1: public Hyp SIGN route removed ---
assert.equal(
  existsSync(join(root, 'app/api/commerce/hyp/sign/route.js')),
  false,
  'app/api/commerce/hyp/sign/route.js must not exist',
);

// --- P1: server-authoritative checkout charge ---
{
  const { chargeAmount, paymentKind } = resolveCheckoutCharge({
    commerceType: 'retreat',
    itemId: 'wadi-rum',
    catalogItem: wadiCatalog,
    line: wadiLine,
    body: { paymentPlan: 'deposit' },
    paymentMethod: 'hyp',
  });
  assert.equal(chargeAmount, WADI_RUM_DEPOSIT_ILS);
  assert.equal(paymentKind, 'deposit');
}

{
  const { chargeAmount } = resolveCheckoutCharge({
    commerceType: 'retreat',
    itemId: 'wadi-rum',
    catalogItem: wadiCatalog,
    line: wadiLine,
    body: {},
    paymentMethod: 'hyp',
  });
  assert.equal(chargeAmount, WADI_RUM_DEPOSIT_ILS);
}

assert.throws(
  () =>
    resolveCheckoutCharge({
      commerceType: 'retreat',
      itemId: 'wadi-rum',
      catalogItem: wadiCatalog,
      line: wadiLine,
      body: { depositAmount: 1 },
      paymentMethod: 'hyp',
    }),
  (e) => e.code === 'INVALID_CHARGE_AMOUNT',
);

assert.throws(
  () =>
    resolveCheckoutCharge({
      commerceType: 'retreat',
      itemId: 'wadi-rum',
      catalogItem: wadiCatalog,
      line: wadiLine,
      body: { depositAmount: 99999 },
      paymentMethod: 'hyp',
    }),
  (e) => e.code === 'INVALID_CHARGE_AMOUNT',
);

assert.throws(
  () =>
    resolveCheckoutCharge({
      commerceType: 'retreat',
      itemId: 'wadi-rum',
      catalogItem: wadiCatalog,
      line: wadiLine,
      body: { paymentPlan: 'full' },
      paymentMethod: 'hyp',
    }),
  (e) => e.code === 'PAYMENT_PLAN_NOT_SUPPORTED',
);

{
  const eventLine = { unitPrice: 180, quantity: 1, currency: 'ILS' };
  const { chargeAmount, paymentKind } = resolveCheckoutCharge({
    commerceType: 'event',
    itemId: 'sound-healing',
    catalogItem: {},
    line: eventLine,
    body: { chargeAmount: 180 },
    paymentMethod: 'hyp',
  });
  assert.equal(chargeAmount, 180);
  assert.equal(paymentKind, 'full');
}

assert.throws(
  () =>
    resolveCheckoutCharge({
      commerceType: 'event',
      itemId: 'sound-healing',
      catalogItem: {},
      line: { unitPrice: 180, quantity: 1, currency: 'ILS' },
      body: { chargeAmount: 1 },
      paymentMethod: 'hyp',
    }),
  (e) => e.code === 'INVALID_CHARGE_AMOUNT',
);

// --- P1: active payment attempt gate (mirrors migration 010 semantics) ---
const ACTIVE = new Set(['created', 'awaiting_customer']);
const activeByOrder = new Map();

function memoryClaimAttempt(row) {
  if (ACTIVE.has(row.status) && activeByOrder.has(row.order_id)) {
    const err = new Error('An active payment attempt already exists for this order');
    err.code = 'PAYMENT_SIGN_IN_PROGRESS';
    throw err;
  }
  if (ACTIVE.has(row.status)) activeByOrder.set(row.order_id, row);
  return row;
}

function memoryReleaseAttempt(orderId) {
  activeByOrder.delete(orderId);
}

let signCallCount = 0;
async function simulateHypSignForOrder(orderId) {
  memoryClaimAttempt({ order_id: orderId, status: 'created' });
  signCallCount += 1;
}

const orderId = 'ord-phase-d-concurrency';
const results = await Promise.allSettled([
  simulateHypSignForOrder(orderId),
  simulateHypSignForOrder(orderId),
]);
const rejected = results.filter((r) => r.status === 'rejected');
assert.equal(signCallCount, 1, 'only one Hyp SIGN when two claims race');
assert.equal(rejected.length, 1);
assert.equal(rejected[0].reason?.code, 'PAYMENT_SIGN_IN_PROGRESS');

memoryReleaseAttempt(orderId);
await simulateHypSignForOrder(orderId);
assert.equal(signCallCount, 2, 'retry allowed after active attempt cleared');

// Provider must not swallow claim failures
const providerSrc = readFileSync(
  join(root, 'lib/commerce/payment/hyp-pay/provider.js'),
  'utf8',
);
assert.match(
  providerSrc,
  /claimPaymentAttemptForSign[\s\S]*?catch \(error\)[\s\S]*?throw error/,
  'hyp provider must rethrow claimPaymentAttemptForSign errors',
);

// --- P2: feedback fail-closed ---
const feedbackJs = readFileSync(join(root, 'public/js/feedback-form.js'), 'utf8');
assert.match(feedbackJs, /fetch\('\/api\/retreat-request'/);
assert.match(feedbackJs, /if \(!res\.ok\)/);
assert.doesNotMatch(
  feedbackJs,
  /FEEDBACK_SUPABASE[\s\S]*?fetch\(/,
  'feedback must not POST directly to Supabase REST',
);

// --- P0 / legacy: no production project id in active paths ---
const FORBIDDEN = ['xzxyskufrqansbhsbdkt', 'sb_publishable_V9'];

function collectFiles(rel, acc = []) {
  const full = join(root, rel);
  if (!existsSync(full)) return acc;
  for (const name of readdirSync(full)) {
    if (name === 'node_modules' || name === '.next') continue;
    const p = join(full, name);
    const st = statSync(p);
    if (st.isDirectory()) collectFiles(join(rel, name), acc);
    else if (/\.(js|jsx|mjs|ts|tsx|html)$/.test(name)) acc.push(join(rel, name));
  }
  return acc;
}

const filesToScan = [];
for (const base of ['app', 'public', 'lib', 'components']) {
  collectFiles(base, filesToScan);
}
filesToScan.push('feedback/feedback-ice.html');

for (const rel of filesToScan) {
  const text = readFileSync(join(root, rel), 'utf8');
  for (const needle of FORBIDDEN) {
    assert.doesNotMatch(text, new RegExp(needle), `${rel} must not contain ${needle}`);
  }
}

console.log('test-security-phase-d: all assertions passed (mocks only; no network)');
