import { PAYMENT_ATTEMPT_STATUS } from '../constants.js';
import {
  SUPABASE_TABLE_PAYMENT_ATTEMPTS,
  supabaseGetById,
  supabaseInsert,
  supabaseSelect,
  supabaseUpdate,
} from '../supabase.js';
import { updateOrder, getOrder } from '../orders.js';
import { createCorrelationId, logPaymentAttemptEvent } from './attempt-telemetry.js';

function attemptId() {
  return `patt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function getLatestPaymentAttemptForOrder(orderId) {
  if (!orderId) return null;
  const rows = await supabaseSelect(
    SUPABASE_TABLE_PAYMENT_ATTEMPTS,
    `order_id=eq.${encodeURIComponent(orderId)}&select=*&order=created_at.desc&limit=1`,
  );
  return rows?.[0] || null;
}

export async function getPaymentAttemptByCorrelation(correlationId) {
  if (!correlationId) return null;
  const rows = await supabaseSelect(
    SUPABASE_TABLE_PAYMENT_ATTEMPTS,
    `correlation_id=eq.${encodeURIComponent(correlationId)}&select=*&limit=1`,
  );
  return rows?.[0] || null;
}

async function syncOrderAttemptMetadata(orderId, patch) {
  try {
    const order = await getOrder(orderId);
    if (!order) return;
    await updateOrder(orderId, {
      metadata: {
        ...(order.metadata || {}),
        ...patch,
        paymentAttemptUpdatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logPaymentAttemptEvent('order_metadata_sync_failed', {
      orderId,
      message: error?.message || 'sync_failed',
    });
  }
}

/**
 * Insert a new payment attempt for Hyp SIGN, or fail if an active attempt exists (DB unique index).
 */
export async function claimPaymentAttemptForSign({
  orderId,
  provider = 'hyp',
  amount,
  currency,
  correlationId,
}) {
  return createPaymentAttempt({
    orderId,
    provider,
    amount,
    currency,
    correlationId,
  });
}

export async function createPaymentAttempt({
  orderId,
  provider = 'hyp',
  amount,
  currency,
  correlationId,
}) {
  const correlation_id = correlationId || createCorrelationId();
  const now = new Date().toISOString();
  const row = {
    id: attemptId(),
    order_id: orderId,
    provider,
    correlation_id,
    status: PAYMENT_ATTEMPT_STATUS.CREATED,
    amount: amount != null ? Number(amount) : null,
    currency: currency || 'ILS',
    sign_result: null,
    last_event: 'checkout_created',
    metadata: {},
    created_at: now,
    updated_at: now,
  };

  let saved = null;
  try {
    saved = await supabaseInsert(SUPABASE_TABLE_PAYMENT_ATTEMPTS, row);
  } catch (error) {
    logPaymentAttemptEvent('persist_failed', {
      orderId,
      correlationId: correlation_id,
      stage: 'create',
      message: error?.message || 'insert_failed',
    });
    throw error;
  }

  await syncOrderAttemptMetadata(orderId, {
    paymentAttemptId: saved?.id || row.id,
    correlationId: correlation_id,
    paymentAttemptStatus: PAYMENT_ATTEMPT_STATUS.CREATED,
  });

  logPaymentAttemptEvent('created', {
    orderId,
    attemptId: saved?.id || row.id,
    correlationId: correlation_id,
    amount: row.amount,
    currency: row.currency,
  });

  return saved || row;
}

export async function updatePaymentAttempt(attemptIdKey, patch, logEvent = 'updated') {
  if (!attemptIdKey) return null;
  const now = new Date().toISOString();
  const update = {
    ...patch,
    updated_at: now,
  };
  let saved;
  try {
    saved = await supabaseUpdate(SUPABASE_TABLE_PAYMENT_ATTEMPTS, attemptIdKey, update);
  } catch (error) {
    logPaymentAttemptEvent('persist_failed', {
      attemptId: attemptIdKey,
      stage: 'update',
      message: error?.message || 'update_failed',
    });
    return null;
  }

  const row = saved || (await supabaseGetById(SUPABASE_TABLE_PAYMENT_ATTEMPTS, attemptIdKey));
  if (row?.order_id && patch.status) {
    await syncOrderAttemptMetadata(row.order_id, {
      paymentAttemptId: row.id,
      correlationId: row.correlation_id,
      paymentAttemptStatus: patch.status,
      ...(patch.failure_code ? { paymentFailureCode: String(patch.failure_code) } : {}),
    });
  }

  logPaymentAttemptEvent(logEvent, {
    attemptId: attemptIdKey,
    orderId: row?.order_id,
    correlationId: row?.correlation_id,
    status: patch.status,
    failureCode: patch.failure_code,
    lastEvent: patch.last_event,
  });

  return row;
}

export async function recordSignSuccess(attempt, { amount, currency } = {}) {
  if (!attempt?.id) return null;
  return updatePaymentAttempt(
    attempt.id,
    {
      status: PAYMENT_ATTEMPT_STATUS.AWAITING_CUSTOMER,
      sign_result: 'ok',
      last_event: 'sign_ok',
      ...(amount != null ? { amount: Number(amount) } : {}),
      ...(currency ? { currency } : {}),
    },
    'sign_ok',
  );
}

export async function recordSignFailure(attempt, { code, message } = {}) {
  if (!attempt?.id) return null;
  return updatePaymentAttempt(
    attempt.id,
    {
      status: PAYMENT_ATTEMPT_STATUS.SIGN_FAILED,
      sign_result: 'failed',
      failure_code: code ? String(code) : 'SIGN_FAILED',
      failure_reason: message ? String(message).slice(0, 500) : 'sign_failed',
      last_event: 'sign_failed',
    },
    'sign_failed',
  );
}

export async function recordReturnReceived(attempt, { hypTransactionId, ccode } = {}) {
  if (!attempt?.id) return null;
  return updatePaymentAttempt(
    attempt.id,
    {
      status: PAYMENT_ATTEMPT_STATUS.RETURN_RECEIVED,
      last_event: 'return_received',
      ...(hypTransactionId ? { hyp_transaction_id: hypTransactionId } : {}),
      ...(ccode != null ? { failure_code: String(ccode) } : {}),
    },
    'return_received',
  );
}

export async function recordGatewayDeclined(attempt, { ccode, reason } = {}) {
  if (!attempt?.id) return null;
  return updatePaymentAttempt(
    attempt.id,
    {
      status: PAYMENT_ATTEMPT_STATUS.GATEWAY_DECLINED,
      failure_code: ccode != null ? String(ccode) : '',
      failure_reason: reason ? String(reason).slice(0, 500) : 'gateway_declined',
      last_event: 'gateway_declined',
    },
    'gateway_declined',
  );
}

export async function recordVerifyFailed(attempt, { ccode, reason } = {}) {
  if (!attempt?.id) return null;
  return updatePaymentAttempt(
    attempt.id,
    {
      status: PAYMENT_ATTEMPT_STATUS.VERIFY_FAILED,
      failure_code: ccode != null ? String(ccode) : 'VERIFY_FAILED',
      failure_reason: reason ? String(reason).slice(0, 500) : 'verify_failed',
      last_event: 'verify_failed',
    },
    'verify_failed',
  );
}

export async function recordPaidConfirmed(attempt, { hypTransactionId } = {}) {
  if (!attempt?.id) return null;
  return updatePaymentAttempt(
    attempt.id,
    {
      status: PAYMENT_ATTEMPT_STATUS.PAID_CONFIRMED,
      last_event: 'paid_confirmed',
      ...(hypTransactionId ? { hyp_transaction_id: hypTransactionId } : {}),
      failure_code: null,
      failure_reason: null,
    },
    'paid_confirmed',
  );
}

export async function recordDuplicateReturn(attempt) {
  if (!attempt?.id) return null;
  return updatePaymentAttempt(
    attempt.id,
    {
      status: PAYMENT_ATTEMPT_STATUS.DUPLICATE_RETURN,
      last_event: 'duplicate_return',
    },
    'duplicate_return',
  );
}

/**
 * @deprecated Browser CCode is not authoritative. Use Hyp VERIFY outcome only.
 */
export function resolveAuthoritativeDecline(ccode) {
  const code = String(ccode ?? '').trim();
  if (!code || code === '0') return null;
  return code;
}

export async function recordOutcomeUnknown(attempt, { reason } = {}) {
  if (!attempt?.id) return null;
  return updatePaymentAttempt(
    attempt.id,
    {
      status: PAYMENT_ATTEMPT_STATUS.OUTCOME_UNKNOWN,
      failure_code: 'VERIFY_UNAVAILABLE',
      failure_reason: reason ? String(reason).slice(0, 500) : 'verify_unavailable',
      last_event: 'outcome_unknown',
    },
    'outcome_unknown',
  );
}
