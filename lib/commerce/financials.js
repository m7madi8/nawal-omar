import { PAYMENT_STATUS } from './constants.js';

export function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

export function readAmountPaid(order) {
  const meta = order?.metadata || {};
  if (meta.amountPaid != null && meta.amountPaid !== '') {
    return roundMoney(meta.amountPaid);
  }
  if (order?.payment_status === PAYMENT_STATUS.PAID) {
    return roundMoney(order.total);
  }
  if (order?.payment_status === PAYMENT_STATUS.PARTIALLY_PAID) {
    return roundMoney(meta.chargeAmount ?? meta.lastPaymentAmount ?? 0);
  }
  return 0;
}

export function remainingBalance(order) {
  const total = roundMoney(order?.total ?? 0);
  const paid = readAmountPaid(order);
  return Math.max(0, roundMoney(total - paid));
}

export function derivePaymentStatus(order, amountPaid) {
  const total = roundMoney(order?.total ?? 0);
  const paid = roundMoney(amountPaid);
  if (paid <= 0) return PAYMENT_STATUS.UNPAID;
  if (paid >= total) return PAYMENT_STATUS.PAID;
  return PAYMENT_STATUS.PARTIALLY_PAID;
}

export function appendPaymentHistory(order, entry) {
  const history = Array.isArray(order?.metadata?.paymentHistory)
    ? [...order.metadata.paymentHistory]
    : [];
  const id = entry.id || `pay-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  history.push({
    id,
    amount: roundMoney(entry.amount),
    currency: entry.currency || order?.currency || 'ILS',
    method: entry.method || 'unknown',
    status: entry.status || PAYMENT_STATUS.PAID,
    reference: entry.reference || '',
    note: entry.note || '',
    recordedBy: entry.recordedBy || '',
    recordedAt: entry.recordedAt || new Date().toISOString(),
    providerTransactionId: entry.providerTransactionId || '',
  });
  return history;
}

export function paymentSummary(order) {
  const amountPaid = readAmountPaid(order);
  const total = roundMoney(order?.total ?? 0);
  return {
    total,
    amountPaid,
    remaining: remainingBalance(order),
    currency: order?.currency || 'ILS',
    paymentStatus: order?.payment_status || derivePaymentStatus(order, amountPaid),
    paymentKind: order?.metadata?.paymentKind || 'full',
  };
}
