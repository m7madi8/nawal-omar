import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ensureAdminOperationalReadiness,
  getAdminRuntimeConfigIssue,
  hasSupabaseServiceRoleKey,
} from '../lib/admin/admin-runtime.js';
import { resolveAdminSession } from '../lib/admin/auth-session.js';
import {
  getSessionRevocationDecision,
  isSessionRevocationRequired,
  isSessionRevoked,
  probeRevocationStorageReady,
  revokeSessionId,
} from '../lib/admin/session-revocation.js';
import {
  ADMIN_SESSION_COOKIE,
  appendSessionCookie,
  createAdminSessionToken,
  isAdminSessionConfigured,
} from '../lib/admin/session.js';

const root = join(fileURLToPath(import.meta.url), '..', '..');

async function withEnv(overrides, fn) {
  const prior = {};
  for (const key of Object.keys(overrides)) {
    prior[key] = process.env[key];
    const value = overrides[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return await fn();
  } finally {
    for (const key of Object.keys(overrides)) {
      if (prior[key] === undefined) delete process.env[key];
      else process.env[key] = prior[key];
    }
  }
}

function mockRequest(cookieHeader) {
  return { headers: new Headers({ cookie: cookieHeader || '' }) };
}

function cookieFromToken(token) {
  const headers = new Headers();
  appendSessionCookie(headers, token);
  const setCookie = headers.get('Set-Cookie') || '';
  const match = setCookie.match(new RegExp(`${ADMIN_SESSION_COOKIE}=([^;]+)`));
  return match ? `${ADMIN_SESSION_COOKIE}=${match[1]}` : '';
}

// --- P0 production configuration (mocked) ---

await withEnv(
  {
    NODE_ENV: 'production',
    ADMIN_SESSION_SECRET: '',
    SUPABASE_SERVICE_ROLE_KEY: 'role-key',
  },
  () => {
    assert.equal(isAdminSessionConfigured(), false);
    assert.equal(getAdminRuntimeConfigIssue()?.code, 'ADMIN_SESSION_NOT_CONFIGURED');
  },
);

await withEnv(
  {
    NODE_ENV: 'production',
    ADMIN_SESSION_SECRET: 'secret-a3',
    SUPABASE_SERVICE_ROLE_KEY: '',
  },
  () => {
    assert.equal(hasSupabaseServiceRoleKey(), false);
    assert.equal(getAdminRuntimeConfigIssue()?.code, 'ADMIN_SERVER_NOT_CONFIGURED');
  },
);

await withEnv(
  {
    NODE_ENV: 'production',
    ADMIN_SESSION_SECRET: 'secret-a3',
    SUPABASE_SERVICE_ROLE_KEY: 'role-key',
    ADMIN_SESSION_REVOCATION_DISABLED: 'true',
  },
  () => {
    assert.equal(isSessionRevocationRequired(), true, 'DISABLE must not apply in production');
  },
);

await withEnv(
  {
    NODE_ENV: 'production',
    ADMIN_SESSION_SECRET: 'secret-a3',
    SUPABASE_SERVICE_ROLE_KEY: 'role-key',
  },
  async () => {
    const missingTable = await ensureAdminOperationalReadiness({
      supabaseSelect: async () => null,
    });
    assert.equal(missingTable.ok, false);
    assert.equal(missingTable.code, 'ADMIN_REVOCATION_STORAGE_UNAVAILABLE');

    const failedSelect = await ensureAdminOperationalReadiness({
      supabaseSelect: async () => {
        throw new Error('PGRST internal detail');
      },
    });
    assert.equal(failedSelect.ok, false);
    assert.equal(failedSelect.code, 'ADMIN_REVOCATION_STORAGE_UNAVAILABLE');
    assert.ok(!JSON.stringify(failedSelect).includes('PGRST'));
  },
);

// Login must not issue session when readiness fails (source wiring)
const loginRoute = readFileSync(join(root, 'app/api/admin/login/route.js'), 'utf8');
assert.ok(
  loginRoute.includes('ensureAdminOperationalReadiness'),
  'login route must gate session issuance on operational readiness',
);
assert.ok(
  loginRoute.indexOf('ensureAdminOperationalReadiness') < loginRoute.indexOf('appendSessionCookie'),
  'readiness check must run before Set-Cookie',
);

// --- Login success + protected session path (mocked) ---

process.env.ADMIN_AUTH_EPOCH = '1';
process.env.ADMIN_OWNER_PASSWORD = 'unused-for-token';

await withEnv(
  {
    NODE_ENV: 'development',
    ADMIN_SESSION_SECRET: 'secret-a3-dev',
    SUPABASE_SERVICE_ROLE_KEY: 'role-key',
    ADMIN_SESSION_REVOCATION_REQUIRED: 'true',
  },
  async () => {
    const ready = await ensureAdminOperationalReadiness({
      supabaseSelect: async () => [],
    });
    assert.equal(ready.ok, true);

    const token = createAdminSessionToken({
      username: 'nawal',
      name: 'Nawal',
      role: 'owner',
      sid: 'sid-protected-ok',
    });
    const req = mockRequest(cookieFromToken(token));
    const session = await resolveAdminSession(req, { supabaseSelect: async () => [] });
    assert.ok(session);
    assert.equal(session.username, 'nawal');
  },
);

// --- Revocation / logout (mocked) ---

await withEnv(
  {
    NODE_ENV: 'development',
    SUPABASE_SERVICE_ROLE_KEY: 'role-key',
    ADMIN_SESSION_REVOCATION_REQUIRED: 'true',
  },
  async () => {
    const revokeOk = await revokeSessionId('sid-out', {
      supabaseInsert: async () => ({ session_id: 'sid-out' }),
    });
    assert.equal(revokeOk.serverRevoked, true);
    assert.equal(revokeOk.ok, true);

    const revokeFail = await revokeSessionId('sid-out-fail', {
      supabaseInsert: async () => {
        throw new Error('duplicate key value violates');
      },
    });
    assert.equal(revokeFail.serverRevoked, false);
    assert.equal(revokeFail.ok, false);
    assert.ok(!String(revokeFail).includes('duplicate key'));
  },
);

// Copied cookie after failed server revoke: session still valid until expiry/epoch
await withEnv(
  {
    NODE_ENV: 'development',
    ADMIN_SESSION_SECRET: 'secret-a3-dev',
    SUPABASE_SERVICE_ROLE_KEY: 'role-key',
    ADMIN_SESSION_REVOCATION_REQUIRED: 'true',
  },
  async () => {
    const token = createAdminSessionToken({
      username: 'nawal',
      name: 'Nawal',
      role: 'owner',
      sid: 'sid-still-active',
    });
    const req = mockRequest(cookieFromToken(token));
    const session = await resolveAdminSession(req, { supabaseSelect: async () => [] });
    assert.ok(session, 'failed logout insert does not invalidate cookie-only sessions');
  },
);

// Revoked sid rejected
await withEnv(
  {
    NODE_ENV: 'development',
    SUPABASE_SERVICE_ROLE_KEY: 'role-key',
    ADMIN_SESSION_REVOCATION_REQUIRED: 'true',
  },
  async () => {
    assert.equal(
      await getSessionRevocationDecision('sid-revoked', {
        supabaseSelect: async () => [{ session_id: 'sid-revoked' }],
      }),
      'revoked',
    );
    assert.equal(
      await isSessionRevoked('sid-revoked', {
        supabaseSelect: async () => [{ session_id: 'sid-revoked' }],
      }),
      true,
    );
  },
);

// Dev explicit disable
await withEnv(
  {
    NODE_ENV: 'development',
    ADMIN_SESSION_SECRET: 'secret-a3-dev',
    SUPABASE_SERVICE_ROLE_KEY: 'role-key',
    ADMIN_SESSION_REVOCATION_DISABLED: 'true',
  },
  async () => {
    assert.equal(isSessionRevocationRequired(), false);
    const probe = await probeRevocationStorageReady({
      supabaseSelect: async () => null,
    });
    assert.equal(probe.ok, true, 'disabled dev mode skips storage probe');
    const ready = await ensureAdminOperationalReadiness();
    assert.equal(ready.ok, true);
  },
);

const logoutRoute = readFileSync(join(root, 'app/api/admin/logout/route.js'), 'utf8');
assert.ok(logoutRoute.includes("serverRevocation = 'failed'"));
assert.ok(!logoutRoute.includes('error.message'));

console.log('test-security-phase-a3: all assertions passed (mocked unit + static route checks; no HTTP server or database)');
