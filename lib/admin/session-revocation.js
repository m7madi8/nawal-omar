import { supabaseInsert, supabaseSelect } from '../commerce/supabase.js';

const REVOCATION_TABLE =
  process.env.SUPABASE_ADMIN_SESSION_REVOCATIONS_TABLE || 'admin_session_revocations';

/**
 * Database-backed per-session revocation (migration 008 + service role).
 * Production: required when SUPABASE_SERVICE_ROLE_KEY is set (see admin-runtime.js).
 * Development: ADMIN_SESSION_REVOCATION_REQUIRED=true to require; ADMIN_SESSION_REVOCATION_DISABLED=true to skip.
 */
export function isSessionRevocationRequired() {
  const hasServiceRole = Boolean(String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim());
  if (!hasServiceRole) return false;

  if (process.env.NODE_ENV === 'production') {
    return true;
  }

  if (process.env.ADMIN_SESSION_REVOCATION_REQUIRED === 'true') return true;
  if (process.env.ADMIN_SESSION_REVOCATION_DISABLED === 'true') return false;

  return false;
}

/**
 * @typedef {'not_required' | 'active' | 'revoked' | 'check_failed'} SessionRevocationDecision
 */

/**
 * @param {{ supabaseSelect?: typeof supabaseSelect }} [deps]
 * @returns {Promise<{ ok: true } | { ok: false, code: 'ADMIN_REVOCATION_STORAGE_UNAVAILABLE' }>}
 */
export async function probeRevocationStorageReady(deps = {}) {
  if (!isSessionRevocationRequired()) {
    return { ok: true };
  }

  const select = deps.supabaseSelect || supabaseSelect;
  try {
    const rows = await select(REVOCATION_TABLE, 'select=session_id&limit=1');
    if (rows === null || !Array.isArray(rows)) {
      return { ok: false, code: 'ADMIN_REVOCATION_STORAGE_UNAVAILABLE' };
    }
    return { ok: true };
  } catch {
    return { ok: false, code: 'ADMIN_REVOCATION_STORAGE_UNAVAILABLE' };
  }
}

/**
 * @param {string} sessionId
 * @param {{ supabaseSelect?: typeof supabaseSelect }} [deps]
 * @returns {Promise<SessionRevocationDecision>}
 */
export async function getSessionRevocationDecision(sessionId, deps = {}) {
  const sid = String(sessionId || '').trim();
  if (!sid) return 'check_failed';

  if (!isSessionRevocationRequired()) {
    return 'not_required';
  }

  const select = deps.supabaseSelect || supabaseSelect;
  try {
    const rows = await select(
      REVOCATION_TABLE,
      `session_id=eq.${encodeURIComponent(sid)}&select=session_id&limit=1`,
    );
    if (rows === null || !Array.isArray(rows)) {
      return 'check_failed';
    }
    return rows.length > 0 ? 'revoked' : 'active';
  } catch {
    return 'check_failed';
  }
}

/**
 * @returns {Promise<boolean>} true if the session must be treated as invalid (revoked or check failed when required).
 */
export async function isSessionRevoked(sessionId, deps = {}) {
  const decision = await getSessionRevocationDecision(sessionId, deps);
  if (decision === 'revoked' || decision === 'check_failed') return true;
  return false;
}

/**
 * @returns {Promise<{ serverRevoked: boolean, skipped: boolean, ok: boolean }>}
 */
export async function revokeSessionId(sessionId, deps = {}) {
  const sid = String(sessionId || '').trim();
  if (!sid) {
    return { ok: true, skipped: true, serverRevoked: false };
  }

  if (!isSessionRevocationRequired()) {
    return { ok: true, skipped: true, serverRevoked: false };
  }

  const insert = deps.supabaseInsert || supabaseInsert;
  try {
    await insert(REVOCATION_TABLE, {
      session_id: sid,
      revoked_at: new Date().toISOString(),
    });
    return { ok: true, skipped: false, serverRevoked: true };
  } catch {
    return { ok: false, skipped: false, serverRevoked: false };
  }
}
