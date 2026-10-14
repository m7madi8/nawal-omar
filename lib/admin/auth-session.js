import { enrichSessionFromDirectory } from './directory.js';
import { getAdminRuntimeConfigIssue } from './admin-runtime.js';
import { isSessionRevoked } from './session-revocation.js';
import { readAdminSessionTokenFromRequest, verifyAdminSessionToken } from './session.js';

/**
 * @param {Request} request
 * @param {{ supabaseSelect?: Function }} [deps]
 */
export async function resolveAdminSession(request, deps = {}) {
  if (getAdminRuntimeConfigIssue()) return null;

  const token = readAdminSessionTokenFromRequest(request);
  if (!token) return null;
  const payload = verifyAdminSessionToken(token);
  if (!payload) return null;
  if (await isSessionRevoked(payload.sid, deps)) return null;
  const session = enrichSessionFromDirectory(payload);
  if (!session) return null;
  return session;
}
