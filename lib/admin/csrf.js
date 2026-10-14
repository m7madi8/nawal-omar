/**
 * CSRF protection for cookie-authenticated admin mutations.
 * Requires a valid Origin matching the request host (or configured site URL).
 */

function normalizeOrigin(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    return new URL(raw).origin;
  } catch {
    return '';
  }
}

export function assertAdminMutationOrigin(request) {
  const method = String(request.method || 'GET').toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return { ok: true };
  }

  const origin = normalizeOrigin(request.headers.get('origin'));
  if (!origin) {
    return { ok: false, code: 'CSRF_MISSING_ORIGIN' };
  }

  const host = String(request.headers.get('host') || '').trim();
  const siteUrl = String(process.env.NEXT_PUBLIC_SITE_URL || '').trim();
  const allowed = new Set();

  if (host) {
    allowed.add(`http://${host}`);
    allowed.add(`https://${host}`);
  }
  const fromSite = normalizeOrigin(siteUrl);
  if (fromSite) allowed.add(fromSite);

  if (process.env.NODE_ENV !== 'production') {
    allowed.add('http://localhost:3000');
    allowed.add('http://127.0.0.1:3000');
  }

  if (allowed.has(origin)) {
    return { ok: true };
  }

  return { ok: false, code: 'CSRF_ORIGIN' };
}
