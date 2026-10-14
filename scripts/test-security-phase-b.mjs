import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  amountsMatch,
  expectedChargeAmount,
  summarizeRedirectAudit,
  validateTransactionBinding,
} from '../lib/commerce/payment/hyp-confirmation-bindings.js';
import { confirmHypPayFromRedirect } from '../lib/commerce/payment/confirmation.js';
import { PAYMENT_STATUS } from '../lib/commerce/constants.js';

const root = join(fileURLToPath(import.meta.url), '..', '..');

function memoryStore() {
  const orders = new Map();
  const txns = new Map();
  let receiptCount = 0;
  const receiptKeys = new Set();
  return {
    orders,
    txns,
    receiptCount: () => receiptCount,
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
        if (!cur) return null;
        const next = {
          ...cur,
          ...patch,
          metadata: { ...(cur.metadata || {}), ...(patch.metadata || {}) },
        };
        txns.set(id, next);
        return next;
      },
      getOrderItems: async () => [],
      createPaymentReceipt: async ({ order, paymentTransactionId }) => {
        receiptCount += 1;
        if (paymentTransactionId) receiptKeys.add(`${order.id}:${paymentTransactionId}`);
        return { id: 'rcpt-mock' };
      },
      updateLegacyMirrorPaid: async () => {},
      findReceiptByTransaction: async (orderId, paymentTransactionId) =>
        receiptKeys.has(`${orderId}:${paymentTransactionId}`) ? { id: 'rcpt-mock' } : null,
    },
  };
}

function seedOrder(store, overrides = {}) {
  const order = {
    id: 'ord-mock-1',
    currency: 'ILS',
    total: 200,
    payment_status: PAYMENT_STATUS.PENDING,
    customer: { phone: '0500000000', fullName: 'Test' },
    metadata: { chargeAmount: 200 },
    ...overrides,
  };
  store.orders.set(order.id, order);
  return order;
}

const queryOk = 'Id=hyp-100&Order=ord-mock-1&Amount=200&CCode=0&Coin=1';

// Verified success
{
  const store = memoryStore();
  seedOrder(store);
  const result = await confirmHypPayFromRedirect(queryOk, {
    ...store.deps,
    verifyHypRedirect: async () => ({
      verified: true,
      outcome: 'paid',
      ccode: '0',
      raw: 'CCode=0',
    }),
  });
  assert.equal(result.paid, true);
  assert.equal(store.orders.get('ord-mock-1').payment_status, PAYMENT_STATUS.PAID);
  assert.equal(store.receiptCount(), 1);
}

// Browser decline without verify — must not mark failed; verify declined is authoritative
{
  const store = memoryStore();
  seedOrder(store);
  const browserDeclineQuery = 'Id=hyp-101&Order=ord-mock-1&Amount=200&CCode=51&Coin=1';
  const result = await confirmHypPayFromRedirect(browserDeclineQuery, {
    ...store.deps,
    verifyHypRedirect: async () => ({
      verified: false,
      outcome: 'declined',
      ccode: '51',
      raw: 'CCode=51',
    }),
  });
  assert.equal(result.paid, false);
  assert.equal(result.code, 'HYP_DECLINED');
  assert.equal(store.orders.get('ord-mock-1').payment_status, PAYMENT_STATUS.FAILED);
}

// Unknown verify unavailable — pending processing, not failed
{
  const store = memoryStore();
  seedOrder(store);
  const result = await confirmHypPayFromRedirect(queryOk, {
    ...store.deps,
    verifyHypRedirect: async () => ({
      verified: false,
      outcome: 'unavailable',
      ccode: null,
      raw: '',
    }),
  });
  assert.equal(result.paid, false);
  assert.equal(result.pending, true);
  assert.equal(result.code, 'HYP_VERIFY_UNAVAILABLE');
  assert.equal(store.orders.get('ord-mock-1').payment_status, PAYMENT_STATUS.PROCESSING);
}

// Cross-order paid txn reuse
{
  const store = memoryStore();
  seedOrder(store, { id: 'ord-b', total: 50, metadata: { chargeAmount: 50 } });
  store.txns.set('txn-x', {
    id: 'txn-x',
    order_id: 'ord-a',
    hyp_transaction_id: 'hyp-shared',
    status: PAYMENT_STATUS.PAID,
    amount: 100,
    currency: 'ILS',
  });
  seedOrder(store, { id: 'ord-a', total: 100, metadata: { chargeAmount: 100 } });
  const result = await confirmHypPayFromRedirect('Id=hyp-shared&Order=ord-b&Amount=50&CCode=0', {
    ...store.deps,
    verifyHypRedirect: async () => ({
      verified: true,
      outcome: 'paid',
      ccode: '0',
      raw: 'CCode=0',
    }),
  });
  assert.equal(result.paid, false);
  assert.equal(result.code, 'TRANSACTION_ORDER_MISMATCH');
  assert.equal(store.orders.get('ord-b').payment_status, PAYMENT_STATUS.PENDING);
}

// Amount mismatch after verify paid
{
  const store = memoryStore();
  seedOrder(store);
  const result = await confirmHypPayFromRedirect('Id=hyp-200&Order=ord-mock-1&Amount=199&CCode=0', {
    ...store.deps,
    verifyHypRedirect: async () => ({
      verified: true,
      outcome: 'paid',
      ccode: '0',
      raw: 'CCode=0',
    }),
  });
  assert.equal(result.code, 'AMOUNT_MISMATCH');
}

// Duplicate return idempotent
{
  const store = memoryStore();
  seedOrder(store, {
    payment_status: PAYMENT_STATUS.PAID,
    metadata: { hypTransactionId: 'hyp-dup', chargeAmount: 200 },
  });
  store.deps.findReceiptByTransaction = async (orderId, txnId) =>
    txnId === 'hyp-dup' ? { id: 'rcpt-existing' } : null;
  const result = await confirmHypPayFromRedirect('Id=hyp-dup&Order=ord-mock-1&Amount=200&CCode=0', {
    ...store.deps,
    verifyHypRedirect: async () => ({ verified: true, outcome: 'paid', ccode: '0', raw: '' }),
  });
  assert.equal(result.alreadyConfirmed, true);
  assert.equal(store.receiptCount(), 0);
}

// Binding unit tests
const orderA = { id: 'ord-a', currency: 'ILS', total: 100, metadata: { chargeAmount: 100 } };
assert.equal(
  validateTransactionBinding({
    txn: {
      order_id: 'ord-a',
      status: PAYMENT_STATUS.PAID,
      hyp_transaction_id: 'hyp-1',
      amount: 100,
      currency: 'ILS',
    },
    order: orderA,
    hypTransactionId: 'hyp-1',
    redirectAmount: 100,
    attempt: null,
  }).alreadyPaid,
  true,
);

assert.equal(
  validateTransactionBinding({
    txn: { order_id: 'ord-a', status: PAYMENT_STATUS.PAID, amount: 100, currency: 'ILS' },
    order: { id: 'ord-b', currency: 'ILS', total: 50, metadata: {} },
    hypTransactionId: 'hyp-1',
    redirectAmount: 50,
    attempt: null,
  }).code,
  'TRANSACTION_ORDER_MISMATCH',
);

const audit = summarizeRedirectAudit({ Id: '1', Order: 'o1', Amount: '10', Sign: 'secret' });
assert.ok(!JSON.stringify(audit).includes('secret'));

const confirmRoute = readFileSync(join(root, 'app/api/commerce/confirm/route.js'), 'utf8');
assert.ok(confirmRoute.includes('verifyBookingAccessLoose'));
assert.ok(confirmRoute.includes('CONFIRM_FORBIDDEN'));

const confirmationSource = readFileSync(join(root, 'lib/commerce/payment/confirmation.js'), 'utf8');
assert.ok(!confirmationSource.includes('resolveAuthoritativeDecline'));
assert.ok(!confirmationSource.includes('isHypSuccessCode(ccode)'));

console.log('test-security-phase-b: all assertions passed (in-memory mocks; not live Hyp or PostgreSQL)');
