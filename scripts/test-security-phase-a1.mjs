import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { verifyAdminCredentials, credentialsConfiguredForLogin } from '../lib/admin/builtin-accounts.js';
import { assertAdminMutationOrigin } from '../lib/admin/csrf.js';
import { resolveApiPermissionsForAccount, sessionHasApiPermission, PERMISSION } from '../lib/admin/permissions.js';
import { enrichSessionFromDirectory } from '../lib/admin/directory.js';
import { ADMIN_ROUTE_PERMISSIONS } from '../lib/admin/routes.js';
import {
  createAdminSessionToken,
  currentAuthEpoch,
  verifyAdminSessionToken,
  ADMIN_SESSION_COOKIE,
} from '../lib/admin/session.js';
import { safeEqualSecret } from '../lib/admin/password-verify.js';

const root = join(fileURLToPath(import.meta.url), '..', '..');

const FORBIDDEN_LITERALS = ['Areen12@n', 'shadak12', 'mohammadd'];

function walkPublicJs(dir, acc = []) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) walkPublicJs(p, acc);
    else if (/\.(js|html)$/i.test(name.name)) acc.push(p);
  }
  return acc;
}

for (const file of walkPublicJs(join(root, 'public', 'admin'))) {
  const text = readFileSync(file, 'utf8');
  for (const lit of FORBIDDEN_LITERALS) {
    assert.ok(!text.includes(lit), `forbidden credential literal in ${file}`);
  }
}

const legacyAdminScript = readFileSync(join(root, 'admin', 'script.js'), 'utf8');
assert.ok(!legacyAdminScript.includes('Areen12'), 'legacy admin/script.js must not authenticate locally');

process.env.ADMIN_SESSION_SECRET = 'test-phase-a1-secret';
process.env.ADMIN_AUTH_EPOCH = '1';
delete process.env.ADMIN_OWNER_PASSWORD;
delete process.env.ADMIN_DEVELOPER_PASSWORD;
delete process.env.ADMIN_TEAM_ACCOUNTS;

assert.equal(credentialsConfiguredForLogin(), false);
assert.equal(verifyAdminCredentials('nawal', 'anything'), null);

process.env.ADMIN_OWNER_PASSWORD = 'owner-test-pass';
assert.equal(verifyAdminCredentials('nawal', 'owner-test-pass')?.role, 'owner');
assert.equal(verifyAdminCredentials('nawal', 'wrong'), null);

process.env.ADMIN_TEAM_ACCOUNTS = JSON.stringify([
  { username: 'shada', password: 'staff-pass', name: 'Shatha', permissions: ['medical'] },
]);
assert.equal(verifyAdminCredentials('shada', 'staff-pass')?.role, 'staff');
assert.equal(verifyAdminCredentials('shatha', 'staff-pass')?.username, 'shada');
assert.equal(verifyAdminCredentials('sahda', 'staff-pass')?.username, 'shada');

const staffPerms = resolveApiPermissionsForAccount({
  role: 'staff',
  permissions: ['medical'],
});
assert.ok(sessionHasApiPermission({ apiPermissions: staffPerms }, PERMISSION.REGISTRATIONS_READ));
assert.ok(!sessionHasApiPermission({ apiPermissions: staffPerms }, PERMISSION.INVOICES_READ));

const ownerPerms = resolveApiPermissionsForAccount({ role: 'owner', permissions: null });
assert.ok(sessionHasApiPermission({ apiPermissions: ownerPerms }, PERMISSION.INVOICES_READ));

const token = createAdminSessionToken({
  username: 'shada',
  name: 'Shatha',
  role: 'staff',
  staffId: 'builtin-shatha',
  sid: 'test-sid-1',
});
const payload = verifyAdminSessionToken(token);
assert.ok(payload);
const session = enrichSessionFromDirectory(payload);
assert.ok(session);
assert.ok(!sessionHasApiPermission(session, PERMISSION.COMMERCE_READ));

const tampered = token.replace(/.$/, token.endsWith('a') ? 'b' : 'a');
assert.equal(verifyAdminSessionToken(tampered), null);

process.env.ADMIN_AUTH_EPOCH = '2';
assert.equal(verifyAdminSessionToken(token), null);
process.env.ADMIN_AUTH_EPOCH = '1';

const csrfBad = assertAdminMutationOrigin(
  new Request('http://localhost/api/admin/bookings', {
    method: 'POST',
    headers: { host: 'localhost:3000' },
  }),
);
assert.equal(csrfBad.ok, false);

const csrfGood = assertAdminMutationOrigin(
  new Request('http://localhost/api/admin/bookings', {
    method: 'POST',
    headers: { host: 'localhost:3000', origin: 'http://localhost:3000' },
  }),
);
assert.equal(csrfGood.ok, true);

assert.ok(ADMIN_ROUTE_PERMISSIONS.length >= 10);
const commerceRoute = ADMIN_ROUTE_PERMISSIONS.find((r) => r.path.includes('commerce-orders'));
assert.equal(commerceRoute.permission, PERMISSION.COMMERCE_READ);

assert.ok(safeEqualSecret('abc', 'abc'));
assert.ok(!safeEqualSecret('abc', 'abd'));

const adminWs = readFileSync(join(root, 'lib', 'adminWorkspace.js'), 'utf8');
assert.ok(!adminWs.includes('adminApiKey'));

console.log('test-security-phase-a1: all assertions passed');
