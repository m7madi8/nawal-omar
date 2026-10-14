import { isAdminSessionConfigured } from './session.js';
import { isSessionRevocationRequired, probeRevocationStorageReady } from './session-revocation.js';

/** @typedef {{ code: string, status: number }} AdminRuntimeConfigIssue */

export function isProductionNodeEnv() {
  return process.env.NODE_ENV === 'production';
}

export function hasSupabaseServiceRoleKey() {
  return Boolean(String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim());
}

/**
 * Synchronous production contract (session secret + service role in production).
 * @returns {AdminRuntimeConfigIssue | null}
 */
export function getAdminRuntimeConfigIssue() {
  if (!isAdminSessionConfigured()) {
    return { code: 'ADMIN_SESSION_NOT_CONFIGURED', status: 503 };
  }
  if (isProductionNodeEnv() && !hasSupabaseServiceRoleKey()) {
    return { code: 'ADMIN_SERVER_NOT_CONFIGURED', status: 503 };
  }
  return null;
}

/**
 * Verifies revocation storage is queryable before issuing a session or when revocation is mandatory.
 * Limits: proves a service-role SELECT against the revocation table at this moment; not a full schema audit.
 *
 * @param {{ supabaseSelect?: import('../commerce/supabase.js').supabaseSelect }} [deps]
 * @returns {Promise<{ ok: true } | { ok: false, code: string }>}
 */
export async function ensureAdminOperationalReadiness(deps = {}) {
  const configIssue = getAdminRuntimeConfigIssue();
  if (configIssue) {
    return { ok: false, code: configIssue.code };
  }

  if (!isSessionRevocationRequired()) {
    return { ok: true };
  }

  const probe = await probeRevocationStorageReady(deps);
  if (!probe.ok) {
    return { ok: false, code: probe.code };
  }
  return { ok: true };
}

export function adminRuntimeUnavailableBody(code) {
  return {
    error: 'Admin is temporarily unavailable',
    code: code || 'ADMIN_UNAVAILABLE',
  };
}
