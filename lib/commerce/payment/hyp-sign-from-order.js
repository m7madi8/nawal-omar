import { PAYMENT_STATUS } from '../constants.js';
import { assertCheckoutPrerequisites } from '../checkout-guards.js';
import { expectedChargeAmount } from './hyp-confirmation-bindings.js';
import { getOrder, getOrderItems, siteUrlFromRequest } from '../orders.js';
import { createPaymentSession } from './index.js';

function reject(code, message, status = 400) {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  throw error;
}

const PAID_STATUSES = new Set([
  PAYMENT_STATUS.PAID,
  PAYMENT_STATUS.PARTIALLY_PAID,
  PAYMENT_STATUS.REFUNDED,
  PAYMENT_STATUS.PARTIALLY_REFUNDED,
]);

/**
 * Start Hyp SIGN for an order already persisted via /api/commerce/checkout.
 * @param {{ orderId: string, request: Request, cancelUrl?: string }} input
 */
export async function startHypSignForPersistedOrder({ orderId, request, cancelUrl, deps } = {}) {
  const getOrderFn = deps?.getOrder ?? getOrder;
  const getOrderItemsFn = deps?.getOrderItems ?? getOrderItems;
  const createPaymentSessionFn = deps?.createPaymentSession ?? createPaymentSession;
  const assertPrereqFn = deps?.assertCheckoutPrerequisites ?? assertCheckoutPrerequisites;

  const id = String(orderId || '').trim();
  if (!id) reject('MISSING_ORDER', 'Missing order reference');

  assertPrereqFn({ paymentMethod: 'hyp' });

  const order = await getOrderFn(id);
  if (!order) reject('ORDER_NOT_FOUND', 'Order not found', 404);

  if (PAID_STATUSES.has(order.payment_status)) {
    reject('ORDER_ALREADY_PAID', 'Order is already paid', 409);
  }
  if (order.payment_status === PAYMENT_STATUS.CANCELLED) {
    reject('ORDER_NOT_CHARGEABLE', 'Order cannot be charged', 409);
  }
  if (order.payment_status === PAYMENT_STATUS.FAILED) {
    reject('ORDER_NOT_CHARGEABLE', 'Order payment failed; create a new checkout', 409);
  }

  const method = String(order.payment_method || '').toLowerCase();
  if (method && method !== 'hyp') {
    reject('PAYMENT_METHOD_MISMATCH', 'Order is not a Hyp payment order', 409);
  }

  const items = (await getOrderItemsFn(id)) || [];
  if (!items.length) reject('ORDER_ITEMS_MISSING', 'Order has no line items', 409);

  const chargeAmount = expectedChargeAmount(order);
  if (!Number.isFinite(chargeAmount) || chargeAmount <= 0) {
    reject('INVALID_CHARGE_AMOUNT', 'Order charge amount is invalid', 409);
  }

  const paymentKind = order.metadata?.paymentKind || 'full';
  const commerceType = order.metadata?.commerceType || items[0]?.commerce_type || '';
  const itemId = order.metadata?.itemId || items[0]?.item_id || '';

  const origin = siteUrlFromRequest(request);
  const returnBase =
    process.env.HYP_RETURN_URL?.replace(/\/+$/, '') || `${origin}/api/payment/hyp/return`;

  const resolvedCancel =
    cancelUrl && cancelUrl.startsWith('http')
      ? cancelUrl
      : cancelUrl
        ? `${origin}${cancelUrl.startsWith('/') ? cancelUrl : `/${cancelUrl}`}`
        : `${origin}/register/wadi-rum?payment=failed`;

  const session = await createPaymentSessionFn({
    method: 'hyp',
    order,
    items,
    chargeAmount,
    paymentKind,
    description: items[0]?.title || itemId,
    successUrl: returnBase,
    cancelUrl: resolvedCancel,
  });

  return {
    ok: true,
    orderId: id,
    url: session.url,
    chargeAmount: session.chargeAmount,
    commerceType,
    itemId,
  };
}
