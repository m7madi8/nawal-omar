import { buildShopCheckoutBody, processCheckout } from '@/lib/commerce/checkout';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const result = await processCheckout(body, request);
    return Response.json(result);
  } catch (error) {
    const code = error.code || 'CHECKOUT_FAILED';
    const status =
      code === 'INVALID_CUSTOMER' || code === 'INVALID_TYPE' || code === 'UNKNOWN_ITEM'
        ? 400
        : code === 'BOOKING_CLOSED' || code === 'SOLD_OUT' || code === 'INSUFFICIENT_CAPACITY'
          ? 409
          : code === 'STRIPE_MISSING' || code === 'GROW_DISABLED'
            ? 503
            : 500;

    return Response.json({ error: error.message || 'Could not complete checkout', code }, { status });
  }
}

export { buildShopCheckoutBody };
