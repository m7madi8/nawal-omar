/**
 * Explicit deployment classification for payment and database guards.
 * Set NAWAL_DEPLOYMENT_MODE (or DEPLOYMENT_MODE) to development | staging | production.
 */

const ALLOWED = new Set(['development', 'staging', 'production']);

/**
 * @returns {'development' | 'staging' | 'production' | null}
 */
export function readExplicitDeploymentModeEnv() {
  const raw = String(
    process.env.NAWAL_DEPLOYMENT_MODE || process.env.DEPLOYMENT_MODE || '',
  ).trim().toLowerCase();
  if (!raw) return null;
  if (!ALLOWED.has(raw)) return null;
  return raw;
}

export function readRawDeploymentModeEnv() {
  return String(
    process.env.NAWAL_DEPLOYMENT_MODE || process.env.DEPLOYMENT_MODE || '',
  ).trim().toLowerCase();
}

/**
 * Resolves deployment mode. When Hyp payments are enabled, ambiguous production hosts
 * must set NAWAL_DEPLOYMENT_MODE explicitly (see assertDeploymentModeForPayments).
 *
 * @returns {'development' | 'staging' | 'production'}
 */
export function resolveDeploymentMode() {
  const explicit = readExplicitDeploymentModeEnv();
  if (explicit) return explicit;

  if (process.env.NODE_ENV === 'production') {
    const vercel = String(process.env.VERCEL_ENV || '').trim().toLowerCase();
    if (vercel === 'production') return 'production';
    if (vercel === 'preview' || vercel === 'development') return 'staging';
    return 'production';
  }

  return 'development';
}

/**
 * @returns {{ ok: true, mode: string } | { ok: false, code: string }}
 */
export function validateExplicitDeploymentModeEnv() {
  const nawal = String(process.env.NAWAL_DEPLOYMENT_MODE || '').trim().toLowerCase();
  const dep = String(process.env.DEPLOYMENT_MODE || '').trim().toLowerCase();
  if (nawal && dep && nawal !== dep) {
    return { ok: false, code: 'DEPLOYMENT_MODE_CONFLICT' };
  }
  const rawExplicit = readRawDeploymentModeEnv();
  if (rawExplicit && !ALLOWED.has(rawExplicit)) {
    return { ok: false, code: 'DEPLOYMENT_MODE_INVALID' };
  }
  return { ok: true };
}

export function validateDeploymentModeForPayments() {
  const conflict = validateExplicitDeploymentModeEnv();
  if (!conflict.ok) return conflict;

  const explicit = readExplicitDeploymentModeEnv();
  const mode = resolveDeploymentMode();

  if (process.env.NODE_ENV === 'production') {
    const vercel = String(process.env.VERCEL_ENV || '').trim().toLowerCase();
    if (!explicit && !vercel) {
      return { ok: false, code: 'DEPLOYMENT_MODE_REQUIRED' };
    }
    if (!explicit && vercel && vercel !== 'production' && vercel !== 'preview' && vercel !== 'development') {
      return { ok: false, code: 'DEPLOYMENT_MODE_REQUIRED' };
    }
  }

  return { ok: true, mode };
}
