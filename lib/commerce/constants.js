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
