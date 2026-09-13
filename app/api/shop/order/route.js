import { buildShopCheckoutBody, processCheckout } from '@/lib/commerce/checkout';

const PAYMENTS = ['whatsapp', 'cash', 'stripe', 'paypal'];

function clean(value) {
  return String(value || '').trim();
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const payment = clean(body.payment);
  if (!PAYMENTS.includes(payment)) {
    return Response.json({ error: 'Choose a payment method' }, { status: 400 });
  }

  if (payment === 'stripe' && !process.env.STRIPE_SECRET_KEY) {
    return Response.json(
      { error: 'Card payments are not set up yet. Please use WhatsApp or cash on delivery.' },
      { status: 503 },
    );
  }

  const checkoutBody = buildShopCheckoutBody(body);
  if (!checkoutBody.itemId) {
    return Response.json({ error: 'Unknown product' }, { status: 400 });
  }

  try {
    const result = await processCheckout(checkoutBody, request);
    return Response.json(result);
  } catch (error) {
    if (error.code === 'STRIPE_MISSING') {
      return Response.json(
        { error: 'Card payments are not set up yet. Please use WhatsApp or cash on delivery.' },
        { status: 503 },
      );
    }
    if (error.code === 'INVALID_CUSTOMER') {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: error.message || 'Could not place the order' }, { status: 500 });
  }
}
