import { timingSafeEqual } from 'crypto';

/**
 * Constant-time string compare (UTF-8). Avoids early exit on length mismatch.
 */
export function safeEqualSecret(provided, expected) {
  const a = Buffer.from(String(provided ?? ''), 'utf8');
  const b = Buffer.from(String(expected ?? ''), 'utf8');
  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function verifyConfiguredPassword(provided, envValue) {
  const expected = String(envValue || '').trim();
  if (!expected) return false;
  return safeEqualSecret(provided, expected);
}
