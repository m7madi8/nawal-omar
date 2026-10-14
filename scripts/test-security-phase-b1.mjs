import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { classifyHypVerifyOutcome } from '../lib/commerce/payment/hyp-pay/verify-outcome.js';
import { deriveAdminPaymentOutcome } from '../lib/commerce/admin-payment-outcome.js';
import { confirmHypPayFromRedirect } from '../lib/commerce/payment/confirmation.js';
import { PAYMENT_STATUS } from '../lib/commerce/constants.js';
import { FINALIZATION_STATE } from '../lib/commerce/payment/finalization.js';
import { readRedirectOrderRef } from '../lib/commerce/payment/hyp-pay/redirect.js';

const root = join(fileURLToPath(import.meta.url), '..', '..');

// VERIFY classification
assert.equal(classifyHypVerifyOutcome({ ok: true, text: 'CCode=0' }).outcome, 'paid');
assert.equal(classifyHypVerifyOutcome({ ok: true, text: 'CCode=51' }).outcome, 'declined');
assert.equal(classifyHypVerifyOutcome({ ok: true, text: '' }).outcome, 'unavailable');
assert.equal(classifyHypVerifyOutcome({ ok: true, text: 'status=ok' }).outcome, 'unavailable');
assert.equal(classifyHypVerifyOutcome({ ok: false, text: 'CCode=0' }).outcome, 'unavailable');
assert.equal(classifyHypVerifyOutcome({ ok: true, text: 'CCode=ERR' }).outcome, 'unavailable');

// Admin outcome mapping
assert.equal(
  deriveAdminPaymentOutcome(
    { payment_status: PAYMENT_STATUS.PROCESSING, metadata: { paymentOutcomeUnknown: true } },
    null,
  ),
  'outcome_unknown',
);
assert.equal(
  deriveAdminPaymentOutcome(
    {
      payment_status: PAYMENT_STATUS.PAID,
      metadata: { paymentFinalizationState: FINALIZATION_STATE.RECEIPT_PENDING },
    },
    null,
  ),
  'finalization_error',
);

function memoryStore() {
  const orders = new Map();
  const txns = new Map();
  let receiptCount = 0;
  let receiptShouldFail = false;
  return {
    orders,
    receiptCount: () => receiptCount,
    setReceiptFail(v) {
      receiptShouldFail = v;
    },
    deps: {
      resolveAttemptForOrder: async () => null,
      getOrder: async (id) => orders.get(id) || null,
      updateOrder: async (id, patch) => {
        const cur = orders.get(id);
        const next = {
          ...cur,
          ...patch,
          metadata: { ...cur.metadata, ...(patch.metadata || {}) },
        };
        orders.set(id, next);
        return next;
      },
      getPaymentTransactionByHypId: async (hypId) => {
        for (const txn of txns.values()) {
          if (txn.hyp_transaction_id === hypId) return txn;
        }
        return null;
      },
      insertPaymentTransaction: async (row) => {
        const saved = { ...row, id: `txn-${txns.size + 1}` };
        txns.set(saved.id, saved);
        return saved;
      },
      updatePaymentTransaction: async (id, patch) => {
        const cur = txns.get(id);
        const next = { ...cur, ...patch, metadata: { ...(cur.metadata || {}), ...(patch.metadata || {}) } };
        txns.set(id, next);
        return next;
      },
      getOrderItems: async () => [],
      createPaymentReceipt: async () => {
        if (receiptShouldFail) throw new Error('receipt_fail');
        receiptCount += 1;
        return { id: 'rcpt-mock' };
      },
      updateLegacyMirrorPaid: async () => {},
      findReceiptByTransaction: async () => null,
    },
  };
}

function seedOrder(store, overrides = {}) {
  const order = {
    id: 'ord-mock-1',
    currency: 'ILS',
    total: 200,
    payment_status: PAYMENT_STATUS.PENDING,
    payment_method: 'hyp',
    customer: { phone: '0500000000', fullName: 'Test' },
    metadata: { chargeAmount: 200 },
    ...overrides,
  };
  store.orders.set(order.id, order);
  return order;
}

// Missing transaction id after verify paid
{
  const store = memoryStore();
  seedOrder(store);
  const result = await confirmHypPayFromRedirect('Order=ord-mock-1&Amount=200&CCode=0', {
    ...store.deps,
    verifyHypRedirect: async () => ({ verified: true, outcome: 'paid', ccode: '0', raw: 'CCode=0' }),
  });
  assert.equal(result.code, 'MISSING_TRANSACTION_ID');
  assert.equal(result.paid, false);
}

// Ambiguous VERIFY body → processing, not failed
{
  const store = memoryStore();
  seedOrder(store);
  const result = await confirmHypPayFromRedirect('Id=hyp-x&Order=ord-mock-1&Amount=200&CCode=0', {
    ...store.deps,
    verifyHypRedirect: async () => ({
      verified: false,
      outcome: 'unavailable',
      ccode: null,
      raw: 'unexpected',
    }),
  });
  assert.equal(result.code, 'HYP_VERIFY_UNAVAILABLE');
  assert.equal(store.orders.get('ord-mock-1').payment_status, PAYMENT_STATUS.PROCESSING);
}

// Receipt failure after verify — order paid, finalization flagged
{
  const store = memoryStore();
  seedOrder(store);
  store.setReceiptFail(true);
  const result = await confirmHypPayFromRedirect('Id=hyp-rcpt&Order=ord-mock-1&Amount=200&CCode=0', {
    ...store.deps,
    verifyHypRedirect: async () => ({ verified: true, outcome: 'paid', ccode: '0', raw: 'CCode=0' }),
  });
  assert.equal(result.paid, true);
  assert.equal(result.finalizationIncomplete, true);
  assert.equal(store.orders.get('ord-mock-1').payment_status, PAYMENT_STATUS.PAID);
  assert.equal(
    store.orders.get('ord-mock-1').metadata.paymentFinalizationState,
    FINALIZATION_STATE.RECEIPT_PENDING,
  );
}

// Retry duplicate return recovers receipt
{
  const store = memoryStore();
  seedOrder(store, {
    payment_status: PAYMENT_STATUS.PAID,
    metadata: {
      chargeAmount: 200,
      hypTransactionId: 'hyp-rcpt2',
      paymentFinalizationState: FINALIZATION_STATE.RECEIPT_PENDING,
    },
  });
  store.setReceiptFail(false);
  const result = await confirmHypPayFromRedirect('Id=hyp-rcpt2&Order=ord-mock-1&Amount=200&CCode=0', {
    ...store.deps,
    verifyHypRedirect: async () => ({ verified: true, outcome: 'paid', ccode: '0', raw: 'CCode=0' }),
  });
  assert.equal(result.alreadyConfirmed, true);
  assert.equal(store.receiptCount(), 1);
  assert.equal(
    store.orders.get('ord-mock-1').metadata.paymentFinalizationState,
    FINALIZATION_STATE.COMPLETE,
  );
}

assert.deepEqual(readRedirectOrderRef('Order=ord-1&Id=hyp-9&Amount=100'), {
  orderId: 'ord-1',
  hasHypTransactionId: true,
});
assert.deepEqual(readRedirectOrderRef('Fild1=ord-2&Amount=50'), {
  orderId: 'ord-2',
  hasHypTransactionId: false,
});
assert.deepEqual(readRedirectOrderRef('Order=%E0%A4%A'), {
  orderId: null,
  hasHypTransactionId: false,
});

const thanksPath = readFileSync(join(root, 'lib/commerce/thanks-path.js'), 'utf8');
assert.ok(thanksPath.includes('bookingViewCookie'));

const returnRoute = readFileSync(join(root, 'app/api/payment/hyp/return/route.js'), 'utf8');
assert.ok(returnRoute.includes('Set-Cookie'));
assert.ok(returnRoute.includes('readRedirectOrderRef'));
assert.ok(returnRoute.includes('return_invoked'));
assert.ok(returnRoute.includes('hasHypTransactionId'));
assert.ok(returnRoute.includes('finalizationIncomplete'));
assert.ok(returnRoute.includes('pending: Boolean(result.pending)'));

const confirmationSrc = readFileSync(join(root, 'lib/commerce/payment/confirmation.js'), 'utf8');
assert.ok(confirmationSrc.includes("logPaymentAttemptEvent('receipt_finalization_failed'"));

const adminRoute = readFileSync(join(root, 'app/api/admin/commerce-orders/route.js'), 'utf8');
assert.ok(adminRoute.includes('adminPaymentOutcome'));

console.log(
  'test-security-phase-b1: all assertions passed (in-memory mocks; not live Hyp, HTTP server, or PostgreSQL)',
);
