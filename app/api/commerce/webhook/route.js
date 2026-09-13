import { createHmac, timingSafeEqual } from 'crypto';
import { confirmPayment } from '@/lib/commerce/payment';
import { getOrder, markOrderPaid } from '@/lib/commerce/orders';
import { updateLegacyMirrorPaid } from '@/lib/commerce/legacy-update';

function verifyStripeSignature(payload, header, secret) {
  if (!payload || !header || !secret) return false;
  const parts = {};
  header.split(',').forEach((part) => {
    const [key, value] = part.split('=');
    if (key && value) parts[key] = value;
  });
  if (!parts.t || !parts.v1) return false;
  const expected = createHmac('sha256', secret).update(`${parts.t}.${payload}`).digest('hex');
  const a = Buffer.from(parts.v1);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const payload = await request.text();
  if (secret) {
    const header = request.headers.get('stripe-signature') || '';
    if (!verifyStripeSignature(payload, header, secret)) {
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch {
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return Response.json({ received: true });
  }

  const session = event.data?.object || {};
  const result = await confirmPayment({ method: 'stripe', sessionId: session.id });
  if (result.paid && result.orderId) {
    const order = await markOrderPaid(result.orderId, session.id);
    if (order) await updateLegacyMirrorPaid(order, session.id);
  }

  return Response.json({ received: true });
}
