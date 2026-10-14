const buckets = new Map();

export function checkRateLimit(key, { limit = 20, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const bucketKey = String(key || 'unknown');
  let entry = buckets.get(bucketKey);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    buckets.set(bucketKey, entry);
  }
  entry.count += 1;
  if (entry.count > limit) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { allowed: true };
}
