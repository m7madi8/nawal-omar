import { assertAdminMutationOrigin } from '@/lib/admin/csrf';
import { adminRuntimeUnavailableBody, getAdminRuntimeConfigIssue } from '@/lib/admin/admin-runtime';
import { resolveAdminSession } from '@/lib/admin/auth-session';
import { sessionHasApiPermission } from '@/lib/admin/permissions';

export async function getAdminSession(request, deps) {
  return resolveAdminSession(request, deps);
}

export async function authorizeAdminRequest(request, permission = null) {
  const session = await getAdminSession(request);
  if (!session) return false;
  if (permission && !sessionHasApiPermission(session, permission)) return false;
  return true;
}

export async function requireAdminAccess(request, { permission = null, mutation = false } = {}) {
  const configIssue = getAdminRuntimeConfigIssue();
  if (configIssue) {
    return {
      ok: false,
      status: configIssue.status,
      error: adminRuntimeUnavailableBody(configIssue.code).error,
      code: configIssue.code,
    };
  }

  if (mutation) {
    const csrf = assertAdminMutationOrigin(request);
    if (!csrf.ok) {
      return { ok: false, status: 403, error: 'Forbidden', code: csrf.code || 'CSRF' };
    }
  }
  const session = await getAdminSession(request);
  if (!session) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }
  if (permission && !sessionHasApiPermission(session, permission)) {
    return { ok: false, status: 403, error: 'Forbidden' };
  }
  return { ok: true, session };
}

export function adminUnauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

export function adminForbiddenResponse() {
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}

export function adminSessionNotConfiguredResponse() {
  return Response.json(
    { error: 'Admin session is not configured on the server', code: 'ADMIN_SESSION_NOT_CONFIGURED' },
    { status: 503 },
  );
}

export function adminRuntimeUnavailableResponse(issue) {
  const body = adminRuntimeUnavailableBody(issue?.code);
  return Response.json(body, { status: issue?.status || 503 });
}

export function guardResponse(guard) {
  if (guard.ok) return null;
  return Response.json({ error: guard.error || 'Forbidden', code: guard.code }, { status: guard.status });
}
