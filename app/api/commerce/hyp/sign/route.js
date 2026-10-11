import { getCatalogItem } from '@/lib/commerce/catalog/index';
import { PAYMENT_STATUS } from '@/lib/commerce/constants';
import { siteUrlFromRequest } from '@/lib/commerce/orders';
import { createPaymentSession } from '@/lib/commerce/payment';

const WADI_RUM_DEPOSIT_ILS = 400;

function clean(value) {
  return String(value || '').trim();
}

function validateCustomer(customer) {
  const fullName = clean(customer?.fullName);
  const phone = clean(customer?.phone);
  if (!fullName || fullName.length < 2) {
    const error = new Error('Please enter your name');
    error.code = 'INVALID_CUSTOMER';
    throw error;
  }
  if (!phone || phone.replace(/\D/g, '').length < 8) {
    const error = new Error('Please enter a valid phone number');
    error.code = 'INVALID_CUSTOMER';
    throw error;
  }
  return {
    fullName,
    phone,
    email: clean(customer?.email),
    city: clean(customer?.city),
  };
}

/**
 * Start Hyp Pay redirect URL using an order id already stored (e.g. created from the browser).
 * Avoids server → Supabase writes that can fail in some local SSL setups.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const commerceType = clean(body.commerceType) || 'retreat';
    const itemId = clean(body.itemId) || 'wadi-rum';
    const orderId = clean(body.orderId);
    const customer = validateCustomer(body.customer);
    const chargeAmount = Number(body.chargeAmount ?? body.depositAmount ?? WADI_RUM_DEPOSIT_ILS);
    const paymentKind = body.paymentKind || (chargeAmount < 3650 ? 'deposit' : 'full');

    if (!orderId) {
      return Response.json({ error: 'Missing order reference', code: 'MISSING_ORDER' }, { status: 400 });
    }

    const catalogItem = getCatalogItem(commerceType, itemId);
    if (!catalogItem) {
      return Response.json({ error: 'Unknown item', code: 'UNKNOWN_ITEM' }, { status: 400 });
    }

    if (itemId === 'wadi-rum' && chargeAmount !== WADI_RUM_DEPOSIT_ILS) {
      return Response.json({ error: 'Invalid deposit amount', code: 'INVALID_AMOUNT' }, { status: 400 });
    }

    const origin = siteUrlFromRequest(request);
    const returnBase =
      process.env.HYP_RETURN_URL?.replace(/\/+$/, '') || `${origin}/api/payment/hyp/return`;

    const order = {
      id: orderId,
      status: 'pending',
      payment_status: PAYMENT_STATUS.PENDING,
      payment_method: 'hyp',
      currency: catalogItem.pricing?.currency || 'ILS',
      subtotal: catalogItem.pricing?.amount || chargeAmount,
      total: catalogItem.pricing?.amount || chargeAmount,
      customer,
      metadata: {
        commerceType,
        itemId,
        chargeAmount,
        paymentKind,
        retreatRequestId: clean(body.retreatRequestId),
      },
    };

    const items = [
      {
        commerce_type: commerceType,
        item_id: itemId,
        title: catalogItem.title?.en || 'Wadi Rum Retreat',
        quantity: 1,
        unit_price: catalogItem.pricing?.amount || chargeAmount,
        currency: order.currency,
        metadata: { paymentKind, chargeAmount },
      },
    ];

    const session = await createPaymentSession({
      method: 'hyp',
      order,
      items,
      chargeAmount,
      paymentKind,
      description: catalogItem.title?.en,
      successUrl: returnBase,
      cancelUrl: `${origin}/register/wadi-rum/pay?payment=failed`,
    });

    return Response.json({
      ok: true,
      orderId,
      url: session.url,
      chargeAmount: session.chargeAmount,
    });
  } catch (error) {
    const code = error.code || 'HYP_SIGN_FAILED';
    const status =
      code === 'INVALID_CUSTOMER' || code === 'INVALID_AMOUNT'
        ? 400
        : code === 'HYP_DISABLED' || code === 'PAYMENT_NOT_CONFIGURED'
          ? 503
          : code === 'HYP_SIGN_FAILED' || code === 'HYP_NETWORK'
            ? 502
            : 500;

    return Response.json(
      {
        error: error.message || 'Could not start payment',
        code,
      },
      { status },
    );
  }
}
