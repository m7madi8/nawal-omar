import { getEvent } from './catalog/events.js';
import {
  bookingAccessToken,
  bookingViewSetCookieHeader,
  createBookingViewCookieValue,
} from './booking-access.js';

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

/**
 * Thanks-page target for the Hyp return redirect.
 * Paid / pending orders get a short-lived HttpOnly, phone-bound booking-view cookie and the URL
 * carries no token (the receipt PDF link on the thanks page has no token and relies on the cookie).
 * Failed payments and a missing signing secret keep the legacy URL behaviour.
 */
export function paymentThanksTarget(orderId, phone, options = {}) {
  const cookieValue = options.failed ? '' : createBookingViewCookieValue(orderId, phone || '');
  return {
    path: paymentThanksUrl(orderId, phone, { ...options, bookingViewCookie: Boolean(cookieValue) }),
    setCookie: cookieValue ? bookingViewSetCookieHeader(cookieValue) : null,
  };
}
