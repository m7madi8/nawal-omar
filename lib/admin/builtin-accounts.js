import { verifyConfiguredPassword } from './password-verify.js';
import { findTeamAccountForLogin, resolveAccountByUsername } from './directory.js';

const OWNER_USERNAME = String(process.env.ADMIN_OWNER_USERNAME || 'nawal').trim().toLowerCase();
const DEVELOPER_USERNAME = String(process.env.ADMIN_DEVELOPER_USERNAME || 'mohammad').trim().toLowerCase();

function normalizeUsername(value) {
  return String(value || '').trim().toLowerCase();
}

function teamPasswordForUsername(username) {
  const user = normalizeUsername(username);
  const raw = String(process.env.ADMIN_TEAM_ACCOUNTS || process.env.ADMIN_EXTRA_ACCOUNTS || '').trim();
  if (!raw) return '';
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return '';
    for (const row of list) {
      if (normalizeUsername(row.username) === user) {
        return String(row.password || '').trim();
      }
    }
  } catch {
    return '';
  }
  return '';
}

/**
 * @returns {null | import('./directory.js').resolveAccountByUsername extends Function ? ReturnType<...> : never}
 */
export function verifyAdminCredentials(username, password) {
  const user = normalizeUsername(username);
  const pass = String(password || '');
  if (!user || !pass) return null;

  if (user === OWNER_USERNAME) {
    if (!verifyConfiguredPassword(pass, process.env.ADMIN_OWNER_PASSWORD)) return null;
    return resolveAccountByUsername(OWNER_USERNAME);
  }

  if (user === DEVELOPER_USERNAME) {
    if (!verifyConfiguredPassword(pass, process.env.ADMIN_DEVELOPER_PASSWORD)) return null;
    return resolveAccountByUsername(DEVELOPER_USERNAME);
  }

  const teamPassword = teamPasswordForUsername(user);
  if (!teamPassword || !verifyConfiguredPassword(pass, teamPassword)) return null;
  return findTeamAccountForLogin(user);
}

export function credentialsConfiguredForLogin() {
  return Boolean(String(process.env.ADMIN_OWNER_PASSWORD || '').trim());
}
