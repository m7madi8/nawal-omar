import { createHmac, timingSafeEqual } from 'crypto';

function secret() {
  return (
    process.env.BOOKING_ACCESS_SECRET ||
    process.env.ADMIN_API_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  );
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
  const a = Buffer.from(String(token));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyBookingAccessLoose(orderId, token) {
  if (!token || !orderId) return false;
  const key = secret();
  if (!key) return false;
  const expected = createHmac('sha256', key).update(`${orderId}:`).digest('hex').slice(0, 32);
  const a = Buffer.from(String(token));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
