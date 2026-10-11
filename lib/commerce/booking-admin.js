import {
  CUSTOMER_BOOKING_STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  OFFLINE_PAYMENT_METHODS,
} from './constants.js';
import { ensureBookingReference } from './booking-reference.js';
import {
  appendPaymentHistory,
  derivePaymentStatus,
  readAmountPaid,
  remainingBalance,
  roundMoney,
} from './financials.js';
import { getOrder, getOrderItems, updateOrder } from './orders.js';
import { createPaymentReceipt } from './receipts.js';
import {
  SUPABASE_TABLE_BOOKING_AUDIT,
  SUPABASE_TABLE_PAYMENT_LEDGER,
  SUPABASE_TABLE_RETREAT_REQUESTS,
  supabaseGetById,
  supabaseInsert,
  supabaseUpdate,
} from './supabase.js';
import { syncLegacyMirrorFromOrder } from './legacy-update.js';

function auditId() {
  return `aud-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function ledgerId() {
  return `led-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function logBookingAudit({ orderId, retreatRequestId, action, actor, payload }) {
  try {
    await supabaseInsert(SUPABASE_TABLE_BOOKING_AUDIT, {
      id: auditId(),
      order_id: orderId || null,
      retreat_request_id: retreatRequestId || null,
      action,
      actor: actor || 'staff',
      payload: payload || {},
    });
  } catch {
    /* audit must not block primary flow */
  }
}

export async function updateBookingStatus(orderId, bookingStatus, actor = 'staff') {
  const order = await getOrder(orderId);
  if (!order) {
    const error = new Error('Order not found');
    error.code = 'ORDER_NOT_FOUND';
    throw error;
  }
  const metadata = {
    ...(order.metadata || {}),
    bookingStatus,
    bookingReference: ensureBookingReference(order),
  };
  let status = order.status;
  if (bookingStatus === CUSTOMER_BOOKING_STATUS.CONFIRMED) status = ORDER_STATUS.CONFIRMED;
  if (
    bookingStatus === CUSTOMER_BOOKING_STATUS.CANCELLED ||
    bookingStatus === CUSTOMER_BOOKING_STATUS.DECLINED ||
    bookingStatus === CUSTOMER_BOOKING_STATUS.EXPIRED
  ) {
    status = bookingStatus === CUSTOMER_BOOKING_STATUS.DECLINED ? ORDER_STATUS.DECLINED : ORDER_STATUS.CANCELLED;
  }
  const updated = await updateOrder(orderId, { status, metadata });
  await syncLegacyMirrorFromOrder(updated);
  await logBookingAudit({
    orderId,
    retreatRequestId: order.metadata?.legacyMirrorId,
    action: 'booking_status',
    actor,
    payload: { bookingStatus },
  });
  return updated;
}

export async function recordOfflinePayment({
  orderId,
  amount,
  method,
  paymentDate,
  reference = '',
  note = '',
  actor = 'staff',
}) {
  const order = await getOrder(orderId);
  if (!order) {
    const error = new Error('Order not found');
    error.code = 'ORDER_NOT_FOUND';
    throw error;
  }
  const methodKey = String(method || '').toLowerCase();
  if (!OFFLINE_PAYMENT_METHODS.has(methodKey)) {
    const error = new Error('Unsupported offline payment method');
    error.code = 'INVALID_METHOD';
    throw error;
  }
  const payAmount = roundMoney(amount);
  if (!Number.isFinite(payAmount) || payAmount <= 0) {
    const error = new Error('Invalid payment amount');
    error.code = 'INVALID_AMOUNT';
    throw error;
  }
  const outstanding = remainingBalance(order);
  if (payAmount > outstanding + 0.01) {
    const error = new Error('Payment exceeds outstanding balance');
    error.code = 'AMOUNT_EXCEEDS_BALANCE';
    throw error;
  }

  const previousPaid = readAmountPaid(order);
  const newPaid = roundMoney(previousPaid + payAmount);
  const payment_status = derivePaymentStatus(order, newPaid);
  const history = appendPaymentHistory(order, {
    amount: payAmount,
    currency: order.currency,
    method: methodKey,
    reference,
    note,
    recordedBy: actor,
    recordedAt: paymentDate || new Date().toISOString(),
  });

  await supabaseInsert(SUPABASE_TABLE_PAYMENT_LEDGER, {
    id: ledgerId(),
    order_id: orderId,
    amount: payAmount,
    currency: order.currency,
    method: methodKey,
    reference,
    note,
    recorded_by: actor,
    payment_date: paymentDate || new Date().toISOString(),
  });

  const metadata = {
    ...(order.metadata || {}),
    amountPaid: newPaid,
    paymentHistory: history,
    bookingReference: ensureBookingReference(order),
    lastOfflinePaymentAt: new Date().toISOString(),
  };

  const updated = await updateOrder(orderId, {
    payment_status,
    amount_paid: newPaid,
    metadata,
  });

  const items = await getOrderItems(orderId);
  await createPaymentReceipt({
    order: updated,
    items,
    amount: payAmount,
    paymentTransactionId: `offline-${history[history.length - 1].id}`,
    method: methodKey,
    metadata: {
      reference,
      note,
      recordedBy: actor,
      source: 'manual',
      paymentDate: paymentDate || new Date().toISOString(),
      providerTransactionId: reference || '',
    },
  });

  await syncLegacyMirrorFromOrder(updated);
  await logBookingAudit({
    orderId,
    retreatRequestId: order.metadata?.legacyMirrorId,
    action: 'offline_payment',
    actor,
    payload: { amount: payAmount, method: methodKey, reference },
  });

  return updated;
}

export async function updateRetreatRequestBooking({
  requestId,
  bookingStatus,
  internalNote = '',
  actor = 'staff',
}) {
  const row = await supabaseGetById(SUPABASE_TABLE_RETREAT_REQUESTS, requestId);
  if (!row) {
    const error = new Error('Request not found');
    error.code = 'REQUEST_NOT_FOUND';
    throw error;
  }
  let note = {};
  try {
    note = row.freeNote && row.freeNote !== '-' ? JSON.parse(row.freeNote) : {};
  } catch {
    note = { freeText: row.freeNote };
  }
  if (!note || typeof note !== 'object') note = {};
  note.bookingStatus = bookingStatus;
  if (internalNote) note.internalNote = internalNote;

  const legacyStatus =
    bookingStatus === CUSTOMER_BOOKING_STATUS.CONFIRMED
      ? 'completed'
      : bookingStatus === CUSTOMER_BOOKING_STATUS.DECLINED ||
          bookingStatus === CUSTOMER_BOOKING_STATUS.CANCELLED
        ? 'cancelled'
        : 'pending';

  const updated = await supabaseUpdate(SUPABASE_TABLE_RETREAT_REQUESTS, requestId, {
    status: legacyStatus,
    freeNote: JSON.stringify(note),
  });

  await logBookingAudit({
    retreatRequestId: requestId,
    orderId: note.commerceOrderId || null,
    action: 'retreat_request_status',
    actor,
    payload: { bookingStatus, internalNote },
  });

  return updated;
}
