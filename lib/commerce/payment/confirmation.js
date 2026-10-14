import { CUSTOMER_BOOKING_STATUS, PAYMENT_STATUS } from '../constants.js';
import { ensureBookingReference } from '../booking-reference.js';
import {
  appendPaymentHistory,
  derivePaymentStatus,
  readAmountPaid,
  roundMoney,
} from '../financials.js';
import { getOrderItems } from '../orders.js';
import { createPaymentReceipt } from '../receipts.js';
import { updateLegacyMirrorPaid } from '../legacy-update.js';
import { getOrder, updateOrder } from '../orders.js';
import {
  getPaymentTransactionByHypId,
  insertPaymentTransaction,
  updatePaymentTransaction,
} from './records.js';
import { verifyHypRedirect } from './hyp-pay/client.js';
import { logHypPaymentEvent } from './hyp-pay/logging.js';
import { parseRedirectParamsPreservingOrder } from './hyp-pay/redirect.js';
import {
  amountsMatch,
  expectedChargeAmount,
  normalizeCurrency,
  summarizeRedirectAudit,
  validateTransactionBinding,
} from './hyp-confirmation-bindings.js';
import {
  getLatestPaymentAttemptForOrder,
  getPaymentAttemptByCorrelation,
  recordDuplicateReturn,
  recordOutcomeUnknown,
  recordPaidConfirmed,
  recordReturnReceived,
  recordVerifyFailed,
} from './attempts.js';
import { logPaymentAttemptEvent } from './attempt-telemetry.js';
import { supabaseGetById, SUPABASE_TABLE_PAYMENT_ATTEMPTS } from '../supabase.js';
import {
  ensureReceiptForPaidOrder,
  FINALIZATION_STATE,
  markReceiptFinalizationFailed,
} from './finalization.js';

async function resolveAttemptForOrder(order) {
  const meta = order?.metadata || {};
  if (meta.paymentAttemptId) {
    const byId = await supabaseGetById(SUPABASE_TABLE_PAYMENT_ATTEMPTS, meta.paymentAttemptId);
    if (byId) return byId;
  }
  if (meta.correlationId) {
    const byCorr = await getPaymentAttemptByCorrelation(meta.correlationId);
    if (byCorr) return byCorr;
  }
  return getLatestPaymentAttemptForOrder(order?.id);
}

function mismatchResult(code, orderId) {
  logPaymentAttemptEvent('binding_rejected', { orderId, code });
  return { ok: false, paid: false, code, orderId };
}

/**
 * Idempotent Hyp Pay return: APISign VERIFY is authoritative; browser CCode alone never marks paid/failed.
 * @param {string} rawRedirectQuery
 * @param {{ verifyHypRedirect?: typeof verifyHypRedirect }} [deps]
 */
export async function confirmHypPayFromRedirect(rawRedirectQuery, deps = {}) {
  const verifyFn = deps.verifyHypRedirect || verifyHypRedirect;
  const getOrderFn = deps.getOrder || getOrder;
  const getTxnByHypFn = deps.getPaymentTransactionByHypId || getPaymentTransactionByHypId;
  const insertTxnFn = deps.insertPaymentTransaction || insertPaymentTransaction;
  const updateTxnFn = deps.updatePaymentTransaction || updatePaymentTransaction;
  const resolveAttemptFn =
    deps.resolveAttemptForOrder !== undefined
      ? deps.resolveAttemptForOrder
      : (order) => resolveAttemptForOrder(order);
  const { map: redirectParams, raw } = parseRedirectParamsPreservingOrder(rawRedirectQuery);
  const orderId = String(redirectParams.Order || redirectParams.Fild1 || '').trim();
  const hypTransactionId = String(redirectParams.Id || '').trim();
  const redirectAudit = summarizeRedirectAudit(redirectParams);

  if (!orderId) {
    return { ok: false, paid: false, code: 'MISSING_ORDER', orderId: null };
  }

  const order = await getOrderFn(orderId);
  if (!order) {
    return { ok: false, paid: false, code: 'ORDER_NOT_FOUND', orderId };
  }

  const attempt = await resolveAttemptFn(order);
  logPaymentAttemptEvent('return_processing', {
    orderId,
    correlationId: attempt?.correlation_id || order.metadata?.correlationId,
    attemptId: attempt?.id,
    hasHypId: Boolean(hypTransactionId),
  });

  if (order.payment_status === PAYMENT_STATUS.PAID) {
    if (attempt) await recordDuplicateReturn(attempt);
    const paidTxnId = order.metadata?.hypTransactionId || hypTransactionId;
    if (paidTxnId) {
      await ensureReceiptForPaidOrder(order, paidTxnId, {
        getOrderItems: deps.getOrderItems,
        createPaymentReceipt: deps.createPaymentReceipt,
        updateOrder: deps.updateOrder,
        findReceiptByTransaction: deps.findReceiptByTransaction,
      });
    }
    return {
      ok: true,
      paid: true,
      orderId,
      alreadyConfirmed: true,
      hypTransactionId: paidTxnId,
    };
  }

  if (hypTransactionId) {
    const existing = await getTxnByHypFn(hypTransactionId);
    if (existing) {
      const binding = validateTransactionBinding({
        txn: existing,
        order,
        hypTransactionId,
        redirectAmount: redirectParams.Amount,
        attempt,
      });
      if (!binding.ok) {
        return mismatchResult(binding.code, orderId);
      }
      if (binding.alreadyPaid) {
        if (attempt) await recordDuplicateReturn(attempt);
        return { ok: true, paid: true, orderId, alreadyConfirmed: true, hypTransactionId };
      }
    }
  }

  if (attempt) {
    await recordReturnReceived(attempt, { hypTransactionId });
  }

  let txnRecord = null;
  if (hypTransactionId) {
    txnRecord = await getTxnByHypFn(hypTransactionId);
    if (!txnRecord) {
      txnRecord = await insertTxnFn({
        order_id: orderId,
        provider: 'hyp',
        hyp_transaction_id: hypTransactionId,
        amount: Number(redirectParams.Amount) || expectedChargeAmount(order),
        currency: normalizeCurrency(order.currency),
        status: PAYMENT_STATUS.PROCESSING,
        redirect_query: null,
        metadata: { redirectAudit },
      });
    } else {
      const binding = validateTransactionBinding({
        txn: txnRecord,
        order,
        hypTransactionId,
        redirectAmount: redirectParams.Amount,
        attempt,
      });
      if (!binding.ok) {
        return mismatchResult(binding.code, orderId);
      }
      if (binding.alreadyPaid) {
        if (attempt) await recordDuplicateReturn(attempt);
        return { ok: true, paid: true, orderId, alreadyConfirmed: true, hypTransactionId };
      }
      await updateTxnFn(txnRecord.id, {
        status: PAYMENT_STATUS.PROCESSING,
        metadata: { ...(txnRecord.metadata || {}), redirectAudit },
      });
    }
  }

  const verify = await verifyFn(raw);
  logHypPaymentEvent('verify', {
    orderId,
    hypTransactionId,
    verified: verify.verified,
    outcome: verify.outcome,
    ccode: verify.ccode,
  });

  if (verify.outcome === 'unavailable') {
    if (attempt) {
      await recordOutcomeUnknown(attempt, { reason: 'hyp_verify_unavailable' });
    }
    await markOrderProcessingUnknown(order, hypTransactionId, txnRecord?.id, deps);
    return {
      ok: false,
      paid: false,
      pending: true,
      code: 'HYP_VERIFY_UNAVAILABLE',
      orderId,
    };
  }

  if (verify.outcome === 'declined') {
    if (attempt) {
      await recordVerifyFailed(attempt, {
        ccode: verify.ccode,
        reason: 'hyp_verify_declined',
      });
    }
    await markOrderFailed(order, hypTransactionId, txnRecord?.id, verify.ccode || 'verify_declined', deps);
    return {
      ok: false,
      paid: false,
      code: 'HYP_DECLINED',
      orderId,
      ccode: verify.ccode,
    };
  }

  if (verify.outcome !== 'paid') {
    if (attempt) {
      await recordOutcomeUnknown(attempt, { reason: 'hyp_verify_unclassified' });
    }
    await markOrderProcessingUnknown(order, hypTransactionId, txnRecord?.id, deps);
    return {
      ok: false,
      paid: false,
      pending: true,
      code: 'HYP_VERIFY_UNAVAILABLE',
      orderId,
    };
  }

  if (!hypTransactionId) {
    if (attempt) {
      await recordVerifyFailed(attempt, { ccode: 'missing_id', reason: 'missing_hyp_transaction_id' });
    }
    return {
      ok: false,
      paid: false,
      code: 'MISSING_TRANSACTION_ID',
      orderId,
    };
  }

  const expected = expectedChargeAmount(order);
  if (!amountsMatch(expected, redirectParams.Amount)) {
    if (attempt) {
      await recordVerifyFailed(attempt, { ccode: 'amount_mismatch', reason: 'amount_mismatch' });
    }
    await markOrderFailed(order, hypTransactionId, txnRecord?.id, 'amount_mismatch', deps);
    return {
      ok: false,
      paid: false,
      code: 'AMOUNT_MISMATCH',
      orderId,
      expected,
      received: redirectParams.Amount,
    };
  }

  const explicitCurrency = redirectParams.Currency || redirectParams.currency;
  if (explicitCurrency) {
    const redirectCurrency = normalizeCurrency(explicitCurrency);
    const orderCurrency = normalizeCurrency(order.currency);
    if (redirectCurrency !== orderCurrency) {
      if (attempt) {
        await recordVerifyFailed(attempt, { ccode: 'currency_mismatch', reason: 'currency_mismatch' });
      }
      await markOrderFailed(order, hypTransactionId, txnRecord?.id, 'currency_mismatch', deps);
      return { ok: false, paid: false, code: 'CURRENCY_MISMATCH', orderId };
    }
  }

  if (attempt) {
    await recordPaidConfirmed(attempt, { hypTransactionId });
  }

  const finalization = await markOrderPaidInternal(order, hypTransactionId, txnRecord?.id, {
    verifyCcode: verify.ccode,
    verifyResponseSnippet: String(verify.raw || '').slice(0, 500),
    paymentKind: redirectParams.Fild3 || order.metadata?.paymentKind,
    chargeAmount: expected,
  }, deps);

  return {
    ok: true,
    paid: true,
    orderId,
    hypTransactionId,
    ccode: verify.ccode,
    finalizationIncomplete: Boolean(finalization?.finalizationIncomplete),
  };
}

async function markOrderPaidInternal(order, hypTransactionId, txnId, extra = {}, deps = {}) {
  const getOrderFn = deps.getOrder || getOrder;
  const updateOrderFn = deps.updateOrder || updateOrder;
  const updateTxnFn = deps.updatePaymentTransaction || updatePaymentTransaction;
  const getOrderItemsFn = deps.getOrderItems || getOrderItems;
  const createReceiptFn = deps.createPaymentReceipt || createPaymentReceipt;
  const updateLegacyFn = deps.updateLegacyMirrorPaid || updateLegacyMirrorPaid;
  const priorHistory = order.metadata?.paymentHistory || [];
  if (hypTransactionId && priorHistory.some((h) => h.providerTransactionId === hypTransactionId)) {
    return getOrderFn(order.id);
  }

  const chargeAmount = roundMoney(extra.chargeAmount ?? expectedChargeAmount(order));
  const previousPaid = readAmountPaid(order);
  const newPaid = roundMoney(previousPaid + chargeAmount);
  const payment_status = derivePaymentStatus(order, newPaid);
  const bookingStatus =
    payment_status === PAYMENT_STATUS.PAID || payment_status === PAYMENT_STATUS.PARTIALLY_PAID
      ? CUSTOMER_BOOKING_STATUS.CONFIRMED
      : order.metadata?.bookingStatus || CUSTOMER_BOOKING_STATUS.AWAITING_PAYMENT;

  const payMethod = extra.paymentMethod || 'hyp';
  const history = appendPaymentHistory(order, {
    amount: chargeAmount,
    currency: order.currency,
    method: payMethod,
    status: PAYMENT_STATUS.PAID,
    providerTransactionId: hypTransactionId,
    reference: hypTransactionId,
  });

  const metadata = {
    ...(order.metadata || {}),
    hypTransactionId,
    providerTransactionId: hypTransactionId,
    paymentConfirmedAt: new Date().toISOString(),
    amountPaid: newPaid,
    paymentHistory: history,
    bookingStatus,
    bookingReference: ensureBookingReference(order),
    paymentKind: extra.paymentKind || order.metadata?.paymentKind,
    hypVerifyCcode: extra.verifyCcode != null ? String(extra.verifyCcode) : undefined,
    paymentOutcomeUnknown: false,
    paymentFinalizationState: FINALIZATION_STATE.COMPLETE,
    paymentFinalizationError: null,
  };

  await updateOrderFn(order.id, {
    payment_status,
    status: 'confirmed',
    amount_paid: newPaid,
    booking_reference: metadata.bookingReference,
    metadata,
  });

  if (txnId) {
    await updateTxnFn(txnId, {
      status: PAYMENT_STATUS.PAID,
      verify_response: extra.verifyResponseSnippet || null,
      metadata: {
        verifyCcode: extra.verifyCcode != null ? String(extra.verifyCcode) : null,
      },
    });
  }

  const updated = await getOrderFn(order.id);
  const items = await getOrderItemsFn(order.id);
  const receiptMeta = {
    providerTransactionId: hypTransactionId,
    source: extra.paymentSource || 'online',
    ...(extra.receiptMetadata || {}),
  };
  try {
    await createReceiptFn({
      order: updated,
      items,
      amount: chargeAmount,
      paymentTransactionId: hypTransactionId,
      method: payMethod,
      metadata: receiptMeta,
    });
  } catch (receiptError) {
    logPaymentAttemptEvent('receipt_finalization_failed', {
      orderId: order.id,
      code: String(receiptError?.code || 'RECEIPT_CREATE_FAILED').slice(0, 64),
    });
    await markReceiptFinalizationFailed(order.id, metadata, { updateOrder: updateOrderFn });
    await updateLegacyFn(updated, hypTransactionId);
    return { order: updated, finalizationIncomplete: true, receiptError };
  }
  await updateLegacyFn(updated, hypTransactionId);
  return { order: updated, finalizationIncomplete: false };
}

/** Server-verified payment (demo mode or internal use). Idempotent by transactionId. */
export async function recordVerifiedPayment(orderId, options = {}) {
  const order = await getOrder(orderId);
  if (!order) {
    const error = new Error('Order not found');
    error.code = 'ORDER_NOT_FOUND';
    throw error;
  }
  const transactionId = String(options.transactionId || '').trim();
  if (!transactionId) {
    const error = new Error('Missing transaction id');
    error.code = 'MISSING_TRANSACTION';
    throw error;
  }

  if (order.payment_status === PAYMENT_STATUS.PAID) {
    return { ok: true, paid: true, orderId, alreadyConfirmed: true };
  }

  const existing = await getPaymentTransactionByHypId(transactionId);
  if (existing?.status === PAYMENT_STATUS.PAID && existing.order_id === orderId) {
    return { ok: true, paid: true, orderId, alreadyConfirmed: true, transactionId };
  }

  let txnRecord = existing;
  if (!txnRecord) {
    txnRecord = await insertPaymentTransaction({
      order_id: orderId,
      provider: options.provider || 'demo',
      hyp_transaction_id: transactionId,
      amount: Number(options.amount) || expectedChargeAmount(order),
      currency: order.currency,
      status: PAYMENT_STATUS.PROCESSING,
      metadata: { demo: true },
    });
  }

  const amount = Number(options.amount) || expectedChargeAmount(order);
  await markOrderPaidInternal(order, transactionId, txnRecord?.id, {
    chargeAmount: amount,
    paymentMethod: options.paymentMethod || 'demo',
    paymentSource: options.paymentSource || 'online',
    receiptMetadata: options.receiptMetadata || { demo: true },
    verifyCcode: '0',
    verifyResponseSnippet: 'demo-mode',
  });

  return { ok: true, paid: true, orderId, transactionId };
}

async function markOrderFailed(order, hypTransactionId, txnId, reason, deps = {}) {
  const updateOrderFn = deps.updateOrder || updateOrder;
  const updateTxnFn = deps.updatePaymentTransaction || updatePaymentTransaction;
  await updateOrderFn(order.id, {
    payment_status: PAYMENT_STATUS.FAILED,
    metadata: {
      ...(order.metadata || {}),
      hypTransactionId: hypTransactionId || order.metadata?.hypTransactionId,
      paymentFailureReason: String(reason || ''),
      paymentFailureCode: String(reason || ''),
      lastPaymentUpdateAt: new Date().toISOString(),
      paymentOutcomeUnknown: false,
    },
  });
  if (txnId) {
    await updateTxnFn(txnId, {
      status: PAYMENT_STATUS.FAILED,
      metadata: { failureCode: String(reason || '') },
    });
  }
}

async function markOrderProcessingUnknown(order, hypTransactionId, txnId, deps = {}) {
  const updateOrderFn = deps.updateOrder || updateOrder;
  const updateTxnFn = deps.updatePaymentTransaction || updatePaymentTransaction;
  await updateOrderFn(order.id, {
    payment_status: PAYMENT_STATUS.PROCESSING,
    metadata: {
      ...(order.metadata || {}),
      hypTransactionId: hypTransactionId || order.metadata?.hypTransactionId,
      paymentOutcomeUnknown: true,
      paymentLastCheckAt: new Date().toISOString(),
    },
  });
  if (txnId) {
    await updateTxnFn(txnId, {
      status: PAYMENT_STATUS.PROCESSING,
      metadata: { outcome: 'verify_unavailable' },
    });
  }
}
