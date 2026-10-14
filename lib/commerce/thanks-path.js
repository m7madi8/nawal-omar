import { getEvent } from './catalog/events.js';
import { bookingAccessToken } from './booking-access.js';

export function bookingBackPath(commerceType, itemId) {
  if (commerceType === 'lesson' && itemId === 'haifa-yoga') return '/workshops/haifa';
  if (commerceType === 'event' && itemId) {
    return getEvent(itemId)?.metadata?.pagePath || '/events';
  }
  if (commerceType === 'retreat') return '/retreats/wadi-rum';
  return '/';
}

/** Post-payment page with PDF + WhatsApp (yoga, events, retreats). */
export function paymentThanksUrl(orderId, phone, options = {}) {
  const qs = new URLSearchParams();
  if (orderId) qs.set('order', orderId);
  const useCookie = Boolean(options.bookingViewCookie);
  if (!useCookie) {
    const token = bookingAccessToken(orderId, phone || '');
    if (token) qs.set('token', token);
  }
  if (options.failed) qs.set('payment', 'failed');
  if (options.pending) qs.set('payment', 'pending');
  return `/payment/thanks?${qs.toString()}`;
}
