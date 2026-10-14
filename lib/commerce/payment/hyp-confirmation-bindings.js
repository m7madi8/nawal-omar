import { PAYMENT_STATUS } from '../constants.js';

export function expectedChargeAmount(order) {
  const meta = order?.metadata || {};
  if (meta.chargeAmount != null && meta.chargeAmount !== '') {
    return Number(meta.chargeAmount);
  }
  return Number(order?.total);
}

export function amountsMatch(expected, received) {
  const a = Math.round(Number(expected) * 100);
  const b = Math.round(Number(received) * 100);
  return Number.isFinite(a) && Number.isFinite(b) && a === b;
}

export function normalizeCurrency(value) {
  return String(value || 'ILS').trim().toUpperCase();
}

/**
 * Ensures an existing gateway transaction may be applied to this order.
 * @returns {{ ok: true } | { ok: false, code: string }}
 */
export function validateTransactionBinding({
  txn,
  order,
  hypTransactionId,
  redirectAmount,
  attempt,
}) {
  if (!txn || !order) {
    return { ok: false, code: 'TRANSACTION_NOT_FOUND' };
  }

  const orderId = String(order.id || '').trim();
  if (String(txn.order_id || '').trim() !== orderId) {
    return { ok: false, code: 'TRANSACTION_ORDER_MISMATCH' };
  }

  const txnHypId = String(txn.hyp_transaction_id || '').trim();
  const incomingHypId = String(hypTransactionId || '').trim();
  if (txnHypId && incomingHypId && txnHypId !== incomingHypId) {
    return { ok: false, code: 'TRANSACTION_ID_MISMATCH' };
  }

  const expected = expectedChargeAmount(order);
  const amountSource = txn.amount != null ? txn.amount : redirectAmount;
  if (!amountsMatch(expected, amountSource)) {
    return { ok: false, code: 'AMOUNT_MISMATCH' };
  }

  const orderCurrency = normalizeCurrency(order.currency);
  const txnCurrency = normalizeCurrency(txn.currency || order.currency);
  if (txnCurrency !== orderCurrency) {
    return { ok: false, code: 'CURRENCY_MISMATCH' };
  }

  const attemptHyp = String(attempt?.hyp_transaction_id || '').trim();
  if (attemptHyp && incomingHypId && attemptHyp !== incomingHypId) {
    return { ok: false, code: 'ATTEMPT_TRANSACTION_MISMATCH' };
  }

  if (txn.status === PAYMENT_STATUS.PAID) {
    return { ok: true, alreadyPaid: true };
  }

  return { ok: true, alreadyPaid: false };
}

/** Persist only non-sensitive redirect fields for support (browser-supplied; not authoritative). */
export function summarizeRedirectAudit(redirectParams) {
  if (!redirectParams || typeof redirectParams !== 'object') return null;
  return {
    hypTransactionId: String(redirectParams.Id || '').trim() || null,
    orderRef: String(redirectParams.Order || redirectParams.Fild1 || '').trim() || null,
    amount: redirectParams.Amount != null ? String(redirectParams.Amount) : null,
    recordedAt: new Date().toISOString(),
  };
}
