import { guardResponse, requireAdminAccess } from '@/lib/admin-auth';
import { PERMISSION } from '@/lib/admin/permissions';
import { getOrder, getOrderItems } from '@/lib/commerce/orders';
import { getLatestPaymentAttemptForOrder } from '@/lib/commerce/payment/attempts';
import { supabaseSelect, SUPABASE_TABLE_ORDERS } from '@/lib/commerce/supabase';
import { deriveAdminPaymentOutcome } from '@/lib/commerce/admin-payment-outcome';

function sanitizeOrderForAdmin(order, attempt = null) {
  if (!order) return null;
  const customer = order.customer || {};
  return {
    id: order.id,
    status: order.status,
    payment_status: order.payment_status,
    payment_method: order.payment_method,
    currency: order.currency,
    subtotal: order.subtotal,
    total: order.total,
    amount_paid: order.amount_paid,
    booking_reference: order.booking_reference,
    created_at: order.created_at,
    updated_at: order.updated_at,
    customer: {
      fullName: customer.fullName || '',
      city: customer.city || '',
    },
    metadata: {
      commerceType: order.metadata?.commerceType,
      itemId: order.metadata?.itemId,
      chargeAmount: order.metadata?.chargeAmount,
      paymentKind: order.metadata?.paymentKind,
      paymentAttemptId: order.metadata?.paymentAttemptId,
      paymentAttemptStatus: order.metadata?.paymentAttemptStatus,
      correlationId: order.metadata?.correlationId,
      paymentFailureCode: order.metadata?.paymentFailureCode,
      paymentFailureReason: order.metadata?.paymentFailureReason,
      paymentAttemptUpdatedAt: order.metadata?.paymentAttemptUpdatedAt,
      lastPaymentUpdateAt: order.metadata?.lastPaymentUpdateAt,
      hypTransactionId: order.metadata?.hypTransactionId,
      paymentOutcomeUnknown: Boolean(order.metadata?.paymentOutcomeUnknown),
      paymentFinalizationState: order.metadata?.paymentFinalizationState || null,
      paymentFinalizationError: order.metadata?.paymentFinalizationError || null,
      adminPaymentOutcome: deriveAdminPaymentOutcome(order, attempt),
    },
  };
}

function sanitizeAttempt(attempt) {
  if (!attempt) return null;
  return {
    id: attempt.id,
    order_id: attempt.order_id,
    provider: attempt.provider,
    correlation_id: attempt.correlation_id,
    status: attempt.status,
    amount: attempt.amount,
    currency: attempt.currency,
    hyp_transaction_id: attempt.hyp_transaction_id,
    failure_code: attempt.failure_code,
    failure_reason: attempt.failure_reason,
    sign_result: attempt.sign_result,
    last_event: attempt.last_event,
    created_at: attempt.created_at,
    updated_at: attempt.updated_at,
  };
}

export async function GET(request) {
  const guard = await requireAdminAccess(request, { permission: PERMISSION.COMMERCE_READ });
  const denied = guardResponse(guard);
  if (denied) return denied;

  const orderId = String(request.nextUrl.searchParams.get('orderId') || '').trim();
  const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get('limit')) || 25));

  if (orderId) {
    const order = await getOrder(orderId);
    if (!order) {
      return Response.json({ ok: false, error: 'Order not found' }, { status: 404 });
    }
    const items = await getOrderItems(orderId);
    const attempt = await getLatestPaymentAttemptForOrder(orderId);
    return Response.json({
      ok: true,
      order: sanitizeOrderForAdmin(order, attempt),
      items: (items || []).map((item) => ({
        id: item.id,
        commerce_type: item.commerce_type,
        item_id: item.item_id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency: item.currency,
      })),
      attempt: sanitizeAttempt(attempt),
    });
  }

  const rows =
    (await supabaseSelect(
      SUPABASE_TABLE_ORDERS,
      `payment_method=eq.hyp&select=id,status,payment_status,payment_method,currency,total,amount_paid,booking_reference,created_at,updated_at,customer,metadata&order=created_at.desc&limit=${limit}`,
    )) || [];

  return Response.json({
    ok: true,
    orders: rows.map((row) => sanitizeOrderForAdmin(row)),
  });
}
