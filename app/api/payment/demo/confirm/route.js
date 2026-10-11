import { verifyBookingAccess } from '@/lib/commerce/booking-access';
import { getOrder } from '@/lib/commerce/orders';
import { recordVerifiedPayment } from '@/lib/commerce/payment/confirmation';
import { isPaymentDemoMode } from '@/lib/commerce/payment/demo-pay/config';

export async function POST(request) {
  if (!isPaymentDemoMode()) {
    return Response.json({ error: 'Demo payments are disabled' }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const orderId = String(body.orderId || '').trim();
  const token = String(body.token || '').trim();
  if (!orderId || !token) {
    return Response.json({ error: 'Missing order or token' }, { status: 400 });
  }

  const order = await getOrder(orderId);
  if (!order) {
    return Response.json({ error: 'Order not found' }, { status: 404 });
  }

  if (!verifyBookingAccess(orderId, order.customer?.phone || '', token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const amount =
    order.metadata?.chargeAmount != null && order.metadata?.chargeAmount !== ''
      ? Number(order.metadata.chargeAmount)
      : Number(order.total);

  const result = await recordVerifiedPayment(orderId, {
    transactionId: `demo-${orderId}`,
    amount,
    paymentMethod: 'demo',
    paymentSource: 'online',
    provider: 'demo',
    receiptMetadata: { demo: true, note: 'Payment demo mode — not a real charge' },
  });

  return Response.json({
    ok: true,
    paid: result.paid,
    orderId,
    commerceType: order.metadata?.commerceType,
    itemId: order.metadata?.itemId,
  });
}
