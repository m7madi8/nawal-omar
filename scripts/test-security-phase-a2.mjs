import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getSessionRevocationDecision,
  isSessionRevocationRequired,
  isSessionRevoked,
  revokeSessionId,
} from '../lib/admin/session-revocation.js';
import { createAdminSessionToken, verifyAdminSessionToken } from '../lib/admin/session.js';
import { enrichSessionFromDirectory } from '../lib/admin/directory.js';

const root = join(fileURLToPath(import.meta.url), '..', '..');

const BOOKING_AUDIT_POLICY_FROM_004 = 'service can manage booking audit';

const migration004 = readFileSync(join(root, 'supabase/migrations/004_booking_payments.sql'), 'utf8');
assert.ok(
  migration004.includes(`create policy "${BOOKING_AUDIT_POLICY_FROM_004}"`),
  '004 must create the historical booking_audit_log policy name',
);

const migration007 = readFileSync(join(root, 'supabase/migrations/007_commerce_rls_hardening.sql'), 'utf8');
assert.ok(
  migration007.includes(`drop policy if exists "${BOOKING_AUDIT_POLICY_FROM_004}" on public.booking_audit_log`),
  '007 must drop the actual 004 policy name (migration text only — not live RLS)',
);

const migration009 = readFileSync(join(root, 'supabase/migrations/009_booking_audit_log_policy_fix.sql'), 'utf8');
assert.ok(
  migration009.includes(`drop policy if exists "${BOOKING_AUDIT_POLICY_FROM_004}" on public.booking_audit_log`),
  '009 must drop residual policy for environments that ran 007 before the fix',
);

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

await withEnv(
  {
    NODE_ENV: 'development',
    SUPABASE_SERVICE_ROLE_KEY: '',
    ADMIN_SESSION_REVOCATION_REQUIRED: undefined,
    ADMIN_SESSION_REVOCATION_DISABLED: undefined,
  },
  () => {
    assert.equal(isSessionRevocationRequired(), false);
  },
);

await withEnv(
  {
    NODE_ENV: 'production',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role',
    ADMIN_SESSION_REVOCATION_DISABLED: 'true',
  },
  () => {
    assert.equal(isSessionRevocationRequired(), true, 'production cannot disable revocation when service role is set');
  },
);

await withEnv(
  {
    NODE_ENV: 'development',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role',
    ADMIN_SESSION_REVOCATION_DISABLED: 'true',
  },
  async () => {
    assert.equal(isSessionRevocationRequired(), false);
    assert.equal(await getSessionRevocationDecision('sid-dev'), 'not_required');
    assert.equal(await isSessionRevoked('sid-dev'), false);
  },
);

await withEnv(
  {
    NODE_ENV: 'development',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role',
    ADMIN_SESSION_REVOCATION_REQUIRED: 'true',
    ADMIN_SESSION_REVOCATION_DISABLED: undefined,
  },
  async () => {
    assert.equal(isSessionRevocationRequired(), true);

    const active = await getSessionRevocationDecision('sid-active', {
      supabaseSelect: async () => [],
    });
    assert.equal(active, 'active');
    assert.equal(await isSessionRevoked('sid-active', { supabaseSelect: async () => [] }), false);

    const revoked = await getSessionRevocationDecision('sid-revoked', {
      supabaseSelect: async () => [{ session_id: 'sid-revoked' }],
    });
    assert.equal(revoked, 'revoked');
    assert.equal(
      await isSessionRevoked('sid-revoked', {
        supabaseSelect: async () => [{ session_id: 'sid-revoked' }],
      }),
      true,
    );

    const failed = await getSessionRevocationDecision('sid-fail', {
      supabaseSelect: async () => null,
    });
    assert.equal(failed, 'check_failed');
    assert.equal(await isSessionRevoked('sid-fail', { supabaseSelect: async () => null }), true);

    const throws = await getSessionRevocationDecision('sid-throw', {
      supabaseSelect: async () => {
        throw new Error('db down');
      },
    });
    assert.equal(throws, 'check_failed');
    assert.equal(
      await isSessionRevoked('sid-throw', {
        supabaseSelect: async () => {
          throw new Error('db down');
        },
      }),
      true,
    );

    const revokeOk = await revokeSessionId('sid-logout', {
      supabaseInsert: async () => ({ session_id: 'sid-logout' }),
    });
    assert.equal(revokeOk.serverRevoked, true);
    assert.equal(revokeOk.ok, true);

    const revokeFail = await revokeSessionId('sid-logout-fail', {
      supabaseInsert: async () => {
        throw new Error('insert failed');
      },
    });
    assert.equal(revokeFail.serverRevoked, false);
    assert.equal(revokeFail.ok, false);
  },
);

process.env.ADMIN_SESSION_SECRET = 'test-phase-a2-secret';
process.env.ADMIN_AUTH_EPOCH = '1';
process.env.ADMIN_OWNER_PASSWORD = 'owner-test-pass';

const token = createAdminSessionToken({
  username: 'nawal',
  name: 'Nawal',
  role: 'owner',
  sid: 'auth-path-sid',
});
const payload = verifyAdminSessionToken(token);
assert.ok(payload);

await withEnv(
  {
    NODE_ENV: 'development',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role',
    ADMIN_SESSION_REVOCATION_REQUIRED: 'true',
  },
  async () => {
    const session = enrichSessionFromDirectory(payload);
    assert.ok(session);
    assert.equal(
      await isSessionRevoked(payload.sid, { supabaseSelect: async () => [{ session_id: payload.sid }] }),
      true,
    );
    assert.equal(await isSessionRevoked(payload.sid, { supabaseSelect: async () => [] }), false);
  },
);

console.log('test-security-phase-a2: all assertions passed');
