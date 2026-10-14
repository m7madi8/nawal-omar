import { createHmac, timingSafeEqual } from 'crypto';

export const BOOKING_VIEW_COOKIE_NAME = 'nawal_bk_view';
const BOOKING_VIEW_TTL_SEC = 2 * 60 * 60;

function secret() {
  return String(process.env.BOOKING_ACCESS_SECRET || '').trim();
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}

export function bookingAccessToken(orderId, phone = '') {
  const key = secret();
  if (!key || !orderId) return '';
  const digits = String(phone || '').replace(/\D/g, '').slice(-8);
  return createHmac('sha256', key)
    .update(`${orderId}:${digits}`)
    .digest('hex')
    .slice(0, 32);
}

export function verifyBookingAccess(orderId, phone, token) {
  if (!token || !orderId) return false;
  const expected = bookingAccessToken(orderId, phone);
  if (!expected) return false;
  return safeEqual(token, expected);
}

export function verifyBookingAccessLoose(orderId, token) {
  if (!token || !orderId) return false;
  const key = secret();
  if (!key) return false;
  const expected = createHmac('sha256', key).update(`${orderId}:`).digest('hex').slice(0, 32);
  return safeEqual(token, expected);
}

/** Short-lived HttpOnly cookie value for post-payment thanks / receipt (phone-bound). */
export function createBookingViewCookieValue(orderId, phone = '') {
  const key = secret();
  if (!key || !orderId) return '';
  const exp = Math.floor(Date.now() / 1000) + BOOKING_VIEW_TTL_SEC;
  const digits = String(phone || '').replace(/\D/g, '').slice(-8);
  const payload = `${orderId}:${exp}:${digits}`;
  const sig = createHmac('sha256', key).update(payload).digest('hex');
  return `${exp}.${sig}`;
}

export function verifyBookingViewCookieValue(orderId, phone, cookieValue) {
  if (!cookieValue || !orderId) return false;
  const key = secret();
  if (!key) return false;
  const [expPart, sig] = String(cookieValue).split('.');
  const exp = Number(expPart);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const digits = String(phone || '').replace(/\D/g, '').slice(-8);
  const payload = `${orderId}:${exp}:${digits}`;
  const expected = createHmac('sha256', key).update(payload).digest('hex');
  return safeEqual(sig, expected);
}

export function bookingViewSetCookieHeader(value) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${BOOKING_VIEW_COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${BOOKING_VIEW_TTL_SEC}${secure}`;
}

export function readBookingViewCookie(request) {
  const raw = request?.cookies?.get?.(BOOKING_VIEW_COOKIE_NAME)?.value;
  return raw ? decodeURIComponent(String(raw)) : '';
}

export function isBookingAccessGranted(request, orderId, phone, queryToken = '') {
  const token = String(queryToken || '').trim();
  if (token && (verifyBookingAccess(orderId, phone, token) || verifyBookingAccessLoose(orderId, token))) {
    return true;
  }
  const cookieValue = readBookingViewCookie(request);
  return Boolean(cookieValue && verifyBookingViewCookieValue(orderId, phone, cookieValue));
}
