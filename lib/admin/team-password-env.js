import { passwordUsernamesForLogin } from './directory.js';

/** Canonical built-in usernames → dedicated env var (easier on Vercel than JSON arrays). */
const STAFF_PASSWORD_ENV = {
  salma: 'ADMIN_STAFF_SALMA_PASSWORD',
  shada: 'ADMIN_STAFF_SHADA_PASSWORD',
};

export function parseTeamAccountsEnv() {
  const raw = String(process.env.ADMIN_TEAM_ACCOUNTS || process.env.ADMIN_EXTRA_ACCOUNTS || '').trim();
  if (!raw) return [];
  try {
    let parsed = JSON.parse(raw);
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function dedicatedStaffPasswordForLogin(username) {
  for (const name of passwordUsernamesForLogin(username)) {
    const envKey = STAFF_PASSWORD_ENV[name];
    if (!envKey) continue;
    const value = String(process.env[envKey] || '').trim();
    if (value) return value;
  }
  return '';
}

export function teamPasswordForUsername(username) {
  const user = String(username || '').trim().toLowerCase();
  if (!user) return '';

  // Dedicated env vars win over ADMIN_TEAM_ACCOUNTS (avoids stale JSON passwords on Vercel).
  const dedicated = dedicatedStaffPasswordForLogin(user);
  if (dedicated) return dedicated;

  const names = new Set(passwordUsernamesForLogin(user));
  for (const row of parseTeamAccountsEnv()) {
    if (names.has(String(row.username || '').trim().toLowerCase())) {
      const fromJson = String(row.password || '').trim();
      if (fromJson) return fromJson;
    }
  }

  return '';
}
