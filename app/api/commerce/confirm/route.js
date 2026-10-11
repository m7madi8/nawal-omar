import { confirmHypPayFromRedirect, confirmPayment } from '@/lib/commerce/payment';
import { getOrder, markOrderPaid } from '@/lib/commerce/orders';
import { updateLegacyMirrorPaid } from '@/lib/commerce/legacy-update';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const method = String(body.method || body.paymentMethod || 'stripe').toLowerCase();

  if (method === 'hyp') {
    const redirectQuery = String(body.redirectQuery || '').trim();
    if (!redirectQuery) {
      return Response.json({ error: 'Missing redirect parameters' }, { status: 400 });
    }
    const result = await confirmHypPayFromRedirect(redirectQuery);
    if (!result.paid || !result.orderId) {
      return Response.json({
        ok: false,
        paid: false,
        orderId: result.orderId || null,
        code: result.code || 'HYP_NOT_PAID',
      });
    }
    const order = await getOrder(result.orderId);
    return Response.json({
      ok: true,
      paid: true,
      orderId: result.orderId,
      commerceType: order?.metadata?.commerceType || '',
      itemId: order?.metadata?.itemId || '',
      hypTransactionId: result.hypTransactionId || '',
    });
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
