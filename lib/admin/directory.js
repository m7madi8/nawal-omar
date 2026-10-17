import { expandViewIdsToApiPermissions, resolveApiPermissionsForAccount } from './permissions.js';

const OWNER_USERNAME = String(process.env.ADMIN_OWNER_USERNAME || 'nawal').trim().toLowerCase();
const DEVELOPER_USERNAME = String(process.env.ADMIN_DEVELOPER_USERNAME || 'mohammad').trim().toLowerCase();

/** Metadata only — no secrets. */
export const BUILTIN_STAFF_DIRECTORY = [
  {
    id: 'builtin-shatha',
    name: 'Shatha',
    username: 'shada',
    aliases: ['sahda', 'shatha'],
    permissions: ['medical'],
    viewOnly: false,
    locked: true,
  },
  {
    id: 'builtin-salma',
    name: 'Salma',
    username: 'salma',
    aliases: [],
    permissions: ['overview', 'retreats'],
    sourceScope: 'wadi-rum',
    viewOnly: false,
    locked: true,
  },
];

function normalizeUsername(value) {
  return String(value || '').trim().toLowerCase();
}

export function parseTeamAccountsFromEnv() {
  const raw = String(process.env.ADMIN_TEAM_ACCOUNTS || process.env.ADMIN_EXTRA_ACCOUNTS || '').trim();
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function matchBuiltinDirectory(username) {
  const needle = normalizeUsername(username);
  return (
    BUILTIN_STAFF_DIRECTORY.find((item) => {
      if (normalizeUsername(item.username) === needle) return true;
      return (item.aliases || []).some((alias) => normalizeUsername(alias) === needle);
    }) || null
  );
}

/** Usernames whose team-account password may authenticate this login (canonical name plus aliases). */
export function passwordUsernamesForLogin(username) {
  const names = [];
  const add = (value) => {
    const normalized = normalizeUsername(value);
    if (normalized && !names.includes(normalized)) names.push(normalized);
  };
  add(username);
  const builtin = matchBuiltinDirectory(username);
  if (builtin) {
    add(builtin.username);
    for (const alias of builtin.aliases || []) add(alias);
  }
  return names;
}

function accountFromTeamRow(row) {
  const username = normalizeUsername(row.username);
  if (!username) return null;
  const builtin = matchBuiltinDirectory(username);
  const sourceScope =
    String(row.sourceScope || builtin?.sourceScope || '').trim() || null;
  return {
    username,
    name: String(row.name || builtin?.name || username),
    role: 'staff',
    staffId: String(row.staffId || row.id || builtin?.id || ''),
    viewOnly: !!(row.viewOnly ?? builtin?.viewOnly),
    locked: !!(row.locked ?? builtin?.locked),
    permissions: Array.isArray(row.permissions)
      ? row.permissions.slice()
      : builtin?.permissions
        ? builtin.permissions.slice()
        : [],
    sourceScope,
  };
}

/**
 * Authoritative account record for an authenticated username (no password).
 */
export function resolveAccountByUsername(username) {
  const user = normalizeUsername(username);
  if (!user) return null;

  if (user === OWNER_USERNAME) {
    return {
      username: OWNER_USERNAME,
      name: 'Nawal Omar',
      role: 'owner',
      staffId: '',
      viewOnly: false,
      locked: false,
      permissions: null,
    };
  }

  if (user === DEVELOPER_USERNAME) {
    return {
      username: DEVELOPER_USERNAME,
      name: 'Mohammad',
      role: 'developer',
      staffId: '',
      viewOnly: false,
      locked: true,
      permissions: null,
    };
  }

  for (const row of parseTeamAccountsFromEnv()) {
    if (normalizeUsername(row.username) !== user) continue;
    return accountFromTeamRow(row);
  }

  const builtin = matchBuiltinDirectory(user);
  if (builtin) {
    return {
      username: normalizeUsername(builtin.username),
      name: builtin.name,
      role: 'staff',
      staffId: builtin.id,
      viewOnly: !!builtin.viewOnly,
      locked: !!builtin.locked,
      permissions: Array.isArray(builtin.permissions) ? builtin.permissions.slice() : [],
      sourceScope: builtin.sourceScope ? String(builtin.sourceScope) : null,
    };
  }

  return null;
}

export function enrichSessionFromDirectory(tokenPayload) {
  const account = resolveAccountByUsername(tokenPayload?.sub);
  if (!account) return null;
  const apiPermissions = resolveApiPermissionsForAccount(account);
  return {
    username: account.username,
    name: account.name,
    role: account.role,
    staffId: account.staffId || '',
    viewOnly: !!account.viewOnly,
    locked: !!account.locked,
    permissions: account.permissions,
    sourceScope: account.sourceScope || null,
    apiPermissions,
    sid: tokenPayload.sid || '',
    exp: tokenPayload.exp,
  };
}

export function findTeamAccountForLogin(username) {
  const user = normalizeUsername(username);
  for (const row of parseTeamAccountsFromEnv()) {
    if (normalizeUsername(row.username) === user) return accountFromTeamRow(row);
  }
  const builtin = matchBuiltinDirectory(user);
  if (builtin) {
    return {
      username: normalizeUsername(builtin.username),
      name: builtin.name,
      role: 'staff',
      staffId: builtin.id,
      viewOnly: !!builtin.viewOnly,
      locked: !!builtin.locked,
      permissions: Array.isArray(builtin.permissions) ? builtin.permissions.slice() : [],
      sourceScope: builtin.sourceScope ? String(builtin.sourceScope) : null,
    };
  }
  return null;
}

export { expandViewIdsToApiPermissions };
