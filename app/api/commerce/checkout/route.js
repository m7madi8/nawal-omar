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
    let code = error.code || 'CHECKOUT_FAILED';
    if (
      code === 'CHECKOUT_FAILED' &&
      (error.message?.includes('Could not reach the database') ||
        error.message?.includes('fetch failed'))
    ) {
      code = 'COMMERCE_DB_NETWORK';
    }
    const status =
      code === 'INVALID_CUSTOMER' || code === 'INVALID_TYPE' || code === 'UNKNOWN_ITEM'
        ? 400
        : code === 'BOOKING_CLOSED' || code === 'SOLD_OUT' || code === 'INSUFFICIENT_CAPACITY'
          ? 409
          : code === 'STRIPE_MISSING' ||
              code === 'GROW_DISABLED' ||
              code === 'HYP_DISABLED' ||
              code === 'PAYMENT_NOT_CONFIGURED' ||
              code === 'COMMERCE_DB_NOT_READY' ||
              code === 'COMMERCE_DB_SCHEMA' ||
              code === 'COMMERCE_DB_NETWORK'
            ? 503
            : code === 'HYP_NETWORK' || code === 'HYP_SIGN_FAILED'
              ? 502
              : 500;

    return Response.json({ error: error.message || 'Could not complete checkout', code }, { status });
  }
}

export { buildShopCheckoutBody };
