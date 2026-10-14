export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  DECLINED: 'declined',
  EXPIRED: 'expired',
};

/** Customer-facing booking workflow (stored on orders.metadata.bookingStatus and retreat_requests.status). */
export const CUSTOMER_BOOKING_STATUS = {
  NEW_REQUEST: 'new_request',
  AWAITING_DISCUSSION: 'awaiting_discussion',
  AWAITING_PAYMENT: 'awaiting_payment',
  CONFIRMED: 'confirmed',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  UNPAID: 'unpaid',
  PARTIALLY_PAID: 'partially_paid',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
};

/** Checkout / gateway attempt lifecycle (payment_attempts.status + order.metadata.paymentAttemptStatus). */
export const PAYMENT_ATTEMPT_STATUS = {
  CREATED: 'created',
  SIGN_OK: 'sign_ok',
  SIGN_FAILED: 'sign_failed',
  AWAITING_CUSTOMER: 'awaiting_customer',
  RETURN_RECEIVED: 'return_received',
  VERIFY_OK: 'verify_ok',
  VERIFY_FAILED: 'verify_failed',
  GATEWAY_DECLINED: 'gateway_declined',
  PAID_CONFIRMED: 'paid_confirmed',
  DUPLICATE_RETURN: 'duplicate_return',
  OUTCOME_UNKNOWN: 'outcome_unknown',
};

/** Wadi Rum business rule: first deposit to secure a spot (ILS). */
export const WADI_RUM_DEPOSIT_ILS = 400;

export const OFFLINE_PAYMENT_METHODS = new Set(['cash', 'bank_transfer', 'manual', 'bit', 'other']);

/** Gateway methods that require server-verified payment before a booking counts as secured. */
export const GATEWAY_PAYMENT_METHODS = new Set(['hyp', 'stripe']);

export function requiresGatewayConfirmation(method) {
  return GATEWAY_PAYMENT_METHODS.has(String(method || '').toLowerCase());
}

export const PAYMENT_METHODS = {
  manual: 'Manual',
  whatsapp: 'WhatsApp',
  cash: 'Cash on delivery',
  stripe: 'Visa · Mastercard',
  hyp: 'Hyp Pay',
  paypal: 'PayPal',
  grow: 'Grow',
};

export const BOOKING_STATUS = {
  OPEN: 'open',
  SOLD_OUT: 'sold_out',
  CLOSED: 'closed',
};

export const COMMERCE_WHATSAPP = '972522496366';

export const ACTIVE_ORDER_STATUSES = [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED];

export function paymentLabel(method) {
  return PAYMENT_METHODS[method] || method || '—';
}
