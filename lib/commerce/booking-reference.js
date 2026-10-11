import { createHash } from 'crypto';

export function bookingReferenceFromOrderId(orderId) {
  const raw = String(orderId || '').trim();
  if (!raw) return 'BK-00000';
  const hash = createHash('sha256').update(raw).digest('hex');
  const num = parseInt(hash.slice(0, 8), 16) % 100000;
  return `BK-${String(num).padStart(5, '0')}`;
}

export function ensureBookingReference(order) {
  const existing = order?.metadata?.bookingReference;
  if (existing) return String(existing);
  return bookingReferenceFromOrderId(order?.id);
}
