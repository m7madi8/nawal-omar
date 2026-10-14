import { ensureAdminOperationalReadiness, getAdminRuntimeConfigIssue } from '@/lib/admin/admin-runtime';
import { verifyAdminCredentials, credentialsConfiguredForLogin } from '@/lib/admin/builtin-accounts';
import { apiPermissionsToViewIds, resolveApiPermissionsForAccount } from '@/lib/admin/permissions';
import { checkRateLimit } from '@/lib/admin/rate-limit';
import { appendSessionCookie, createAdminSessionToken } from '@/lib/admin/session';
import { randomUUID } from 'crypto';

function clientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request) {
  const configIssue = getAdminRuntimeConfigIssue();
  if (configIssue) {
    return Response.json(
      { error: 'Sign-in is temporarily unavailable', code: configIssue.code },
      { status: configIssue.status },
    );
  }

  if (!credentialsConfiguredForLogin()) {
    return Response.json(
      { error: 'Sign-in is temporarily unavailable', code: 'ADMIN_CREDENTIALS_NOT_CONFIGURED' },
      { status: 503 },
    );
  }

  const limit = checkRateLimit(`admin-login:${clientIp(request)}`, { limit: 30, windowMs: 15 * 60 * 1000 });
  if (!limit.allowed) {
    return Response.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const username = String(body.username || '').trim();
  const password = String(body.password || '');
  const remember = body.remember !== false;
  const maxAge = remember ? 7 * 24 * 60 * 60 : 12 * 60 * 60;

  const profile = verifyAdminCredentials(username, password);
  if (!profile) {
    return Response.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  const readiness = await ensureAdminOperationalReadiness();
  if (!readiness.ok) {
    return Response.json(
      { error: 'Sign-in is temporarily unavailable', code: readiness.code },
      { status: 503 },
    );
  }

  const sessionProfile = { ...profile, sid: randomUUID() };
  let token;
  try {
    token = createAdminSessionToken(sessionProfile, maxAge);
  } catch (error) {
    return Response.json(
      { error: 'Sign-in is temporarily unavailable', code: error.code || 'ADMIN_SESSION_NOT_CONFIGURED' },
      { status: 503 },
    );
  }

  const apiPermissions = resolveApiPermissionsForAccount(profile);
  const viewPermissions = apiPermissionsToViewIds(apiPermissions);

  const headers = new Headers({ 'Content-Type': 'application/json' });
  appendSessionCookie(headers, token, maxAge);

  return new Response(
    JSON.stringify({
      ok: true,
      user: {
        username: profile.username,
        name: profile.name,
        role: profile.role,
        staffId: profile.staffId || '',
        viewOnly: !!profile.viewOnly,
        permissions: viewPermissions,
        locked: !!profile.locked,
      },
    }),
    { status: 200, headers },
  );
}
