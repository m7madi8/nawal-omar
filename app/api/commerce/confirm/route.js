import { confirmPayment } from '@/lib/commerce/payment';
import { getOrder, markOrderPaid } from '@/lib/commerce/orders';
import { updateLegacyMirrorPaid } from '@/lib/commerce/legacy-update';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const sessionId = String(body.sessionId || '').trim();
  if (!sessionId) return Response.json({ error: 'Missing session' }, { status: 400 });

  const result = await confirmPayment({ method: 'stripe', sessionId });
  if (!result.paid || !result.orderId) {
    return Response.json({ ok: false, paid: false, orderId: result.orderId || null });
  }

  const order = await markOrderPaid(result.orderId, sessionId);
  if (order) await updateLegacyMirrorPaid(order, sessionId);

  return Response.json({
    ok: true,
    paid: true,
    orderId: result.orderId,
    commerceType: result.metadata?.commerceType || '',
    itemId: result.metadata?.itemId || result.metadata?.productId || '',
  });
}
