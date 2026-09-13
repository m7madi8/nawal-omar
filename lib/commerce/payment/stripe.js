export const stripeProvider = {
  id: 'stripe',
  enabled: Boolean(process.env.STRIPE_SECRET_KEY),

  async createPaymentSession({ order, items, successUrl, cancelUrl }) {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      const error = new Error('Stripe is not configured');
      error.code = 'STRIPE_MISSING';
      throw error;
    }

    const item = items[0];
    const body = new URLSearchParams();
    body.set('mode', 'payment');
    body.set('success_url', successUrl);
    body.set('cancel_url', cancelUrl);
    body.set('client_reference_id', order.id);
    body.set('metadata[orderId]', order.id);
    body.set('metadata[commerceType]', item.commerce_type);
    body.set('metadata[itemId]', item.item_id);

    if (item.commerce_type === 'product') {
      const meta = item.metadata || {};
      body.set('metadata[productId]', item.item_id);
      body.set('line_items[0][quantity]', String(item.quantity));
      body.set('line_items[0][price_data][currency]', 'usd');
      body.set('line_items[0][price_data][unit_amount]', String(Math.round(item.unit_price * 100)));
      body.set(
        'line_items[0][price_data][product_data][name]',
        meta.color ? `${item.title} · ${meta.color}` : item.title,
      );
      body.set('line_items[0][price_data][product_data][description]', 'Nawal Yoga shop');
    } else {
      body.set('line_items[0][quantity]', String(item.quantity));
      body.set('line_items[0][price_data][currency]', item.currency.toLowerCase());
      body.set('line_items[0][price_data][unit_amount]', String(Math.round(item.unit_price * 100)));
      body.set('line_items[0][price_data][product_data][name]', item.title);
      body.set('line_items[0][price_data][product_data][description]', 'Nawal Yoga');
    }

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      const error = new Error(data?.error?.message || 'Could not start card payment');
      error.code = 'STRIPE_FAILED';
      throw error;
    }
    return {
      provider: 'stripe',
      orderId: order.id,
      via: 'stripe',
      url: data.url,
      sessionId: data.id,
    };
  },

  async confirmPayment(sessionId) {
    const session = await retrieveStripeSession(sessionId);
    if (!session) return { ok: false, paid: false };

    const paid = session.payment_status === 'paid' || session.status === 'complete';
    const orderId = session.metadata?.orderId || session.client_reference_id;

    return {
      ok: paid,
      paid,
      orderId,
      sessionId: session.id,
      metadata: session.metadata || {},
    };
  },
};

export async function retrieveStripeSession(sessionId) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !sessionId) return null;
  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  if (!res.ok) return null;
  return res.json();
}
