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
import { isHypSuccessCode, verifyHypRedirect } from './hyp-pay/client.js';
import { logHypPaymentEvent, maskHypSecretsInQuery } from './hyp-pay/logging.js';
import { parseRedirectParamsPreservingOrder } from './hyp-pay/redirect.js';
import {
  getLatestPaymentAttemptForOrder,
  getPaymentAttemptByCorrelation,
  recordDuplicateReturn,
  recordGatewayDeclined,
  recordPaidConfirmed,
  recordReturnReceived,
  recordVerifyFailed,
  resolveAuthoritativeDecline,
} from './attempts.js';
import { logPaymentAttemptEvent } from './attempt-telemetry.js';
import { supabaseGetById, SUPABASE_TABLE_PAYMENT_ATTEMPTS } from '../supabase.js';

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

function amountsMatch(expected, received) {
  const a = Math.round(Number(expected) * 100);
  const b = Math.round(Number(received) * 100);
  return Number.isFinite(a) && Number.isFinite(b) && a === b;
}

function expectedChargeAmount(order) {
  const meta = order.metadata || {};
  if (meta.chargeAmount != null && meta.chargeAmount !== '') {
    return Number(meta.chargeAmount);
  }
  return Number(order.total);
}

/**
 * Idempotent Hyp Pay return handling: VERIFY with Hyp, then mark order paid once.
 */
export async function confirmHypPayFromRedirect(rawRedirectQuery) {
  const { map: redirectParams, raw } = parseRedirectParamsPreservingOrder(rawRedirectQuery);
  const orderId = String(redirectParams.Order || redirectParams.Fild1 || '').trim();
  const hypTransactionId = String(redirectParams.Id || '').trim();
  const ccode = redirectParams.CCode;

  if (!orderId) {
    return { ok: false, paid: false, code: 'MISSING_ORDER', orderId: null };
  }

  const order = await getOrder(orderId);
  if (!order) {
    return { ok: false, paid: false, code: 'ORDER_NOT_FOUND', orderId };
  }

  const attempt = await resolveAttemptForOrder(order);
  logPaymentAttemptEvent('return_processing', {
    orderId,
    correlationId: attempt?.correlation_id || order.metadata?.correlationId,
    attemptId: attempt?.id,
    hasHypId: Boolean(hypTransactionId),
    ccode: ccode != null ? String(ccode) : '',
  });

  if (order.payment_status === PAYMENT_STATUS.PAID) {
    if (attempt) await recordDuplicateReturn(attempt);
    return {
      ok: true,
      paid: true,
      orderId,
      alreadyConfirmed: true,
      hypTransactionId: order.metadata?.hypTransactionId || hypTransactionId,
    };
  }

  if (hypTransactionId) {
    const existing = await getPaymentTransactionByHypId(hypTransactionId);
    if (existing?.status === PAYMENT_STATUS.PAID && existing.order_id === orderId) {
      if (attempt) await recordDuplicateReturn(attempt);
      return { ok: true, paid: true, orderId, alreadyConfirmed: true, hypTransactionId };
    }
  }

  if (attempt) {
    await recordReturnReceived(attempt, { hypTransactionId, ccode });
  }

  let txnRecord = null;
  if (hypTransactionId) {
    txnRecord = await getPaymentTransactionByHypId(hypTransactionId);
    if (!txnRecord) {
      txnRecord = await insertPaymentTransaction({
        order_id: orderId,
        provider: 'hyp',
        hyp_transaction_id: hypTransactionId,
        amount: Number(redirectParams.Amount) || expectedChargeAmount(order),
        currency: order.currency,
        status: PAYMENT_STATUS.PROCESSING,
        redirect_query: maskHypSecretsInQuery(raw),
        metadata: { ccode },
      });
    } else if (txnRecord.status === PAYMENT_STATUS.PAID) {
      return { ok: true, paid: true, orderId, alreadyConfirmed: true, hypTransactionId };
    } else {
      await updatePaymentTransaction(txnRecord.id, {
        status: PAYMENT_STATUS.PROCESSING,
        redirect_query: maskHypSecretsInQuery(raw),
      });
    }
  }

  if (!isHypSuccessCode(ccode)) {
    const declineCode = resolveAuthoritativeDecline(ccode);
    if (attempt && declineCode) {
      await recordGatewayDeclined(attempt, {
        ccode: declineCode,
        reason: 'hyp_redirect_ccode',
      });
    }
    await markOrderFailed(order, hypTransactionId, txnRecord?.id, declineCode || ccode);
    logPaymentAttemptEvent('confirmed_gateway_decline', {
      orderId,
      attemptId: attempt?.id,
      correlationId: attempt?.correlation_id,
      failureCode: declineCode || ccode,
    });
    return { ok: false, paid: false, code: 'HYP_DECLINED', orderId, ccode };
  }

  const verify = await verifyHypRedirect(raw);
  logHypPaymentEvent('verify', {
    orderId,
    hypTransactionId,
    verified: verify.verified,
    ccode: verify.ccode,
  });

  if (!verify.verified) {
    if (attempt) {
      await recordVerifyFailed(attempt, {
        ccode: verify.ccode,
        reason: 'hyp_verify_failed',
      });
    }
    await markOrderFailed(order, hypTransactionId, txnRecord?.id, verify.ccode || 'verify_failed');
    return { ok: false, paid: false, code: 'HYP_VERIFY_FAILED', orderId, ccode: verify.ccode };
  }

  const expected = expectedChargeAmount(order);
  if (!amountsMatch(expected, redirectParams.Amount)) {
    if (attempt) {
      await recordVerifyFailed(attempt, { ccode: 'amount_mismatch', reason: 'amount_mismatch' });
    }
    await markOrderFailed(order, hypTransactionId, txnRecord?.id, 'amount_mismatch');
    return { ok: false, paid: false, code: 'AMOUNT_MISMATCH', orderId, expected, received: redirectParams.Amount };
  }

  if (attempt) {
    await recordPaidConfirmed(attempt, { hypTransactionId });
  }

  await markOrderPaidInternal(order, hypTransactionId, txnRecord?.id, {
    verifyResponse: verify.raw,
    redirectParams,
    paymentKind: redirectParams.Fild3 || order.metadata?.paymentKind,
  });

  return { ok: true, paid: true, orderId, hypTransactionId, ccode: verify.ccode || ccode };
}

async function markOrderPaidInternal(order, hypTransactionId, txnId, extra = {}) {
  const priorHistory = order.metadata?.paymentHistory || [];
  if (hypTransactionId && priorHistory.some((h) => h.providerTransactionId === hypTransactionId)) {
    return getOrder(order.id);
  }

  const chargeAmount = roundMoney(
    extra.redirectParams?.Amount ?? expectedChargeAmount(order),
  );
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
    ...extra,
  };

  await updateOrder(order.id, {
    payment_status,
    status: 'confirmed',
    amount_paid: newPaid,
    booking_reference: metadata.bookingReference,
    metadata,
  });

  if (txnId) {
    await updatePaymentTransaction(txnId, {
      status: PAYMENT_STATUS.PAID,
      verify_response: extra.verifyResponse ? String(extra.verifyResponse).slice(0, 2000) : null,
      metadata: { ...(extra.redirectParams || {}) },
    });
  }

  const updated = await getOrder(order.id);
  const items = await getOrderItems(order.id);
  const receiptMeta = {
    providerTransactionId: hypTransactionId,
    source: extra.paymentSource || 'online',
    ...(extra.receiptMetadata || {}),
  };
  await createPaymentReceipt({
    order: updated,
    items,
    amount: chargeAmount,
    paymentTransactionId: hypTransactionId,
    method: payMethod,
    metadata: receiptMeta,
  });
  await updateLegacyMirrorPaid(updated, hypTransactionId);
  return updated;
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
    redirectParams: { Amount: amount },
    paymentMethod: options.paymentMethod || 'demo',
    paymentSource: options.paymentSource || 'online',
    receiptMetadata: options.receiptMetadata || { demo: true },
    verifyResponse: 'demo-mode',
  });

  return { ok: true, paid: true, orderId, transactionId };
}

async function markOrderFailed(order, hypTransactionId, txnId, reason) {
  await updateOrder(order.id, {
    payment_status: PAYMENT_STATUS.FAILED,
    metadata: {
      ...(order.metadata || {}),
      hypTransactionId: hypTransactionId || order.metadata?.hypTransactionId,
      paymentFailureReason: String(reason || ''),
      paymentFailureCode: String(reason || ''),
      lastPaymentUpdateAt: new Date().toISOString(),
    },
  });
  if (txnId) {
    await updatePaymentTransaction(txnId, {
      status: PAYMENT_STATUS.FAILED,
      metadata: { reason: String(reason || '') },
    });
  }
}
