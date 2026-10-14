import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  createAdminSessionToken,
  isAdminSessionConfigured,
  verifyAdminSessionToken,
  ADMIN_SESSION_COOKIE,
} from '../lib/admin/session.js';
import { verifyConfiguredPassword } from '../lib/admin/password-verify.js';

const root = join(fileURLToPath(import.meta.url), '..', '..');

process.env.ADMIN_SESSION_SECRET = 'test-session-secret-phase-a';
process.env.ADMIN_AUTH_EPOCH = '1';
process.env.ADMIN_OWNER_PASSWORD = 'test-owner-password';

const adminWorkspaceSource = readFileSync(join(root, 'lib/adminWorkspace.js'), 'utf8');
assert.ok(!adminWorkspaceSource.includes('adminApiKey'), 'adminApiKey removed from adminWorkspace.js');

const workspaceJs = readFileSync(join(root, 'public/admin/workspace.js'), 'utf8');
assert.ok(!workspaceJs.includes('nawalAdminApiKey'), 'sessionStorage admin API key removed');
assert.ok(!workspaceJs.includes('x-admin-key'), 'x-admin-key header removed from admin workspace');
assert.ok(!workspaceJs.includes('Areen12@n'), 'owner password literal removed from workspace.js');

const migration = readFileSync(join(root, 'supabase/migrations/007_commerce_rls_hardening.sql'), 'utf8');
assert.ok(migration.includes('drop policy if exists "public can update commerce orders"'));

assert.equal(isAdminSessionConfigured(), true);
assert.ok(verifyConfiguredPassword('test-owner-password', process.env.ADMIN_OWNER_PASSWORD));

const token = createAdminSessionToken({
  username: 'nawal',
  name: 'Nawal',
  role: 'owner',
  sid: 'sid-test-1',
});
assert.ok(verifyAdminSessionToken(token));

const expired = createAdminSessionToken(
  { username: 'nawal', name: 'Nawal', role: 'owner', sid: 'sid-expired' },
  -10,
);
assert.equal(verifyAdminSessionToken(expired), null);

function readCookieToken(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  for (const part of cookieHeader.split(';')) {
    const [rawKey, ...rest] = part.trim().split('=');
    if (rawKey === ADMIN_SESSION_COOKIE) return decodeURIComponent(rest.join('='));
  }
  return '';
}

assert.equal(verifyAdminSessionToken(readCookieToken(new Request('http://localhost/'))), null);

const authed = new Request('http://localhost/', {
  headers: { cookie: `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}` },
});
assert.ok(verifyAdminSessionToken(readCookieToken(authed)));

console.log('test-security-phase-a: all assertions passed');
