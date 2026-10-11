import {
  SUPABASE_TABLE_PAYMENT_RECEIPTS,
  supabaseGetById,
  supabaseInsert,
  supabaseSelect,
} from './supabase.js';
import { GATEWAY_PAYMENT_METHODS } from './constants.js';
import { ensureBookingReference } from './booking-reference.js';
import { paymentSummary, readAmountPaid, roundMoney } from './financials.js';
import { paymentLabel } from './constants.js';

export const SUPABASE_TABLE_PAYMENT_RECEIPTS_EXPORT = SUPABASE_TABLE_PAYMENT_RECEIPTS;

function receiptId() {
  return `rcpt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

async function nextDocumentNumber() {
  const rows = await supabaseSelect(
    SUPABASE_TABLE_PAYMENT_RECEIPTS,
    'select=document_number&order=document_number.desc&limit=1',
  );
  const last = rows?.[0]?.document_number;
  const match = String(last || '').match(/NY-(\d+)/);
  const seq = match ? Number(match[1]) + 1 : 1;
  return `NY-${String(seq).padStart(6, '0')}`;
}

export async function findReceiptByTransaction(orderId, paymentTransactionId) {
  if (!paymentTransactionId) return null;
  const rows = await supabaseSelect(
    SUPABASE_TABLE_PAYMENT_RECEIPTS,
    `order_id=eq.${encodeURIComponent(orderId)}&payment_transaction_id=eq.${encodeURIComponent(paymentTransactionId)}&select=*&limit=1`,
  );
  return rows?.[0] || null;
}

export async function createPaymentReceipt({
  order,
  items = [],
  amount,
  paymentTransactionId = '',
  method = '',
  metadata = {},
}) {
  const existing = paymentTransactionId
    ? await findReceiptByTransaction(order.id, paymentTransactionId)
    : null;
  if (existing) return existing;

  const summary = paymentSummary(order);
  const transactionAmount = roundMoney(amount != null ? amount : summary.amountPaid);
  const cumulativePaid = roundMoney(readAmountPaid(order));
  const previousPaid = roundMoney(Math.max(0, cumulativePaid - transactionAmount));
  const totalBooking = roundMoney(order.total ?? summary.total);
  const remainingAfter = roundMoney(Math.max(0, totalBooking - cumulativePaid));
  const documentNumber = await nextDocumentNumber();
  const bookingReference = ensureBookingReference(order);
  const item = items[0] || {};
  const methodKey = String(method || order.payment_method || '').toLowerCase();
  const source =
    metadata.source ||
    (GATEWAY_PAYMENT_METHODS.has(methodKey) ? 'online' : 'manual');

  const row = {
    id: receiptId(),
    order_id: order.id,
    document_number: documentNumber,
    document_type:
      remainingAfter > 0 ? 'deposit_receipt' : 'final_payment_receipt',
    payment_transaction_id: paymentTransactionId || null,
    amount: transactionAmount,
    currency: order.currency || summary.currency,
    metadata: {
      bookingReference,
      experienceName: item.title || order.metadata?.itemId || '',
      customerName: order.customer?.fullName || '',
      customerPhone: order.customer?.phone || '',
      customerEmail: order.customer?.email || '',
      totalBooking,
      previousPaid,
      cumulativePaid,
      remainingAfter,
      transactionAmount,
      bookingPaymentStatus: order.payment_status,
      documentStatus: 'paid',
      paymentDate: metadata.paymentDate || new Date().toISOString(),
      source,
      paymentMethod: methodKey || order.payment_method,
      paymentMethodLabel: paymentLabel(methodKey || order.payment_method),
      ...metadata,
    },
  };

  try {
    return await supabaseInsert(SUPABASE_TABLE_PAYMENT_RECEIPTS, row);
  } catch (error) {
    if (paymentTransactionId) {
      const again = await findReceiptByTransaction(order.id, paymentTransactionId);
      if (again) return again;
    }
    throw error;
  }
}

export async function getReceiptById(id) {
  return supabaseGetById(SUPABASE_TABLE_PAYMENT_RECEIPTS, id);
}

export async function listReceiptsForOrder(orderId) {
  return (
    await supabaseSelect(
      SUPABASE_TABLE_PAYMENT_RECEIPTS,
      `order_id=eq.${encodeURIComponent(orderId)}&select=*&order=created_at.asc`,
    )
  ) || [];
}
