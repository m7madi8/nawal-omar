export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = {
  manual: 'Manual',
  whatsapp: 'WhatsApp',
  cash: 'Cash on delivery',
  stripe: 'Visa · Mastercard',
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
