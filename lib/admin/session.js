import { createHmac, randomUUID, timingSafeEqual } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'nawal_admin_session';
const SESSION_VERSION = 2;
const DEFAULT_MAX_AGE_SEC = 7 * 24 * 60 * 60;

function sessionSecret() {
  return String(process.env.ADMIN_SESSION_SECRET || '').trim();
}

export function currentAuthEpoch() {
  return String(process.env.ADMIN_AUTH_EPOCH || '1').trim() || '1';
}

export function isAdminSessionConfigured() {
  return Boolean(sessionSecret());
}

function signPayload(encodedPayload) {
  return createHmac('sha256', sessionSecret()).update(encodedPayload).digest('base64url');
}

export function createAdminSessionToken(profile, maxAgeSec = DEFAULT_MAX_AGE_SEC) {
  const secret = sessionSecret();
  if (!secret) {
    const err = new Error('ADMIN_SESSION_SECRET is not configured');
    err.code = 'ADMIN_SESSION_NOT_CONFIGURED';
    throw err;
  }
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    v: SESSION_VERSION,
    sub: String(profile.username || ''),
    name: String(profile.name || profile.username || ''),
    role: String(profile.role || 'staff'),
    staffId: String(profile.staffId || ''),
    viewOnly: !!profile.viewOnly,
    locked: !!profile.locked,
    sid: String(profile.sid || randomUUID()),
    authEpoch: currentAuthEpoch(),
    iat: now,
    exp: now + maxAgeSec,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = signPayload(encoded);
  return `${encoded}.${sig}`;
}

export function verifyAdminSessionToken(token) {
  const secret = sessionSecret();
  if (!secret || !token) return null;
  const parts = String(token).split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  const expected = signPayload(encoded);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (payload.v !== SESSION_VERSION) return null;
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) return null;
    if (!payload.sub || !payload.sid) return null;
    if (String(payload.authEpoch || '') !== currentAuthEpoch()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function adminSessionCookieOptions(maxAgeSec = DEFAULT_MAX_AGE_SEC) {
  const secure = process.env.NODE_ENV === 'production';
  return {
    name: ADMIN_SESSION_COOKIE,
    maxAge: maxAgeSec,
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
  };
}

export function readAdminSessionTokenFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [rawKey, ...rest] = part.trim().split('=');
    if (rawKey === ADMIN_SESSION_COOKIE) {
      return decodeURIComponent(rest.join('='));
    }
  }
  return '';
}

export function appendSessionCookie(headers, token, maxAgeSec = DEFAULT_MAX_AGE_SEC) {
  const opts = adminSessionCookieOptions(maxAgeSec);
  const secureFlag = opts.secure ? '; Secure' : '';
  const value = `${opts.name}=${encodeURIComponent(token)}; Path=${opts.path}; HttpOnly; SameSite=Lax; Max-Age=${opts.maxAge}${secureFlag}`;
  headers.append('Set-Cookie', value);
}

export function clearSessionCookie(headers) {
  const opts = adminSessionCookieOptions(0);
  const secureFlag = opts.secure ? '; Secure' : '';
  headers.append(
    'Set-Cookie',
    `${opts.name}=; Path=${opts.path}; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`,
  );
}
