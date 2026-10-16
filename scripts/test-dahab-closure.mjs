import assert from 'node:assert/strict';
import { register } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { BOOKING_STATUS } from '../lib/commerce/constants.js';
import { RETREAT_CATALOG } from '../lib/commerce/catalog/retreats.js';
import { EVENT_CATALOG } from '../lib/commerce/catalog/events.js';
import { LESSON_CATALOG } from '../lib/commerce/catalog/lessons.js';
import {
  GUARDED_RETREAT_IDS,
  assertRetreatRequestSourceOpen,
  findClosedRetreatForRequestSource,
} from '../lib/commerce/retreat-request-guard.js';
import { assertAvailability } from '../lib/commerce/capacity.js';

/**
 * Offline regression tests for the Dahab booking closure.
 * - No database, no network, no payment provider. global.fetch is replaced with a stub
 *   that records calls and rejects anything that is not an explicitly allowed fake insert.
 * - Supabase env values below are fake placeholders, never real credentials.
 */

const root = join(fileURLToPath(import.meta.url), '..', '..');

// ---- Network guard -------------------------------------------------------------------
const fetchCalls = [];
let fakeInsertAllowed = false;
globalThis.fetch = async (url, init = {}) => {
  fetchCalls.push({ url: String(url), method: String(init.method || 'GET').toUpperCase() });
  if (fakeInsertAllowed) {
    return new Response(JSON.stringify([{ id: 'req-fake-stub' }]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  throw new Error('Network access is blocked in test-dahab-closure');
};

async function withEnv(overrides, fn) {
  const prior = {};
  for (const key of Object.keys(overrides)) {
    prior[key] = process.env[key];
    process.env[key] = overrides[key];
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

const FAKE_ENV = {
  SUPABASE_URL: 'https://fake-project.invalid',
  SUPABASE_SERVICE_ROLE_KEY: 'fake-service-key-for-offline-test',
};

// ---- Catalog -------------------------------------------------------------------------
const dahab = RETREAT_CATALOG.dahab;
assert.equal(dahab.id, 'dahab');
assert.equal(dahab.source, 'dahab-retreat-reserve');
assert.equal(dahab.endDate, '2026-08-23');
assert.equal(dahab.bookingStatus, BOOKING_STATUS.CLOSED, 'Dahab must be CLOSED');
assert.equal(RETREAT_CATALOG['wadi-rum'].bookingStatus, BOOKING_STATUS.OPEN, 'Wadi Rum stays OPEN');
assert.equal(RETREAT_CATALOG.zanzibar.bookingStatus, BOOKING_STATUS.CLOSED, 'Zanzibar unchanged');

// ---- Helper: pure behaviour ----------------------------------------------------------
assert.deepEqual([...GUARDED_RETREAT_IDS], ['dahab'], 'Guard scope is Dahab only');

assert.equal(findClosedRetreatForRequestSource('dahab-retreat-reserve')?.id, 'dahab');
assert.equal(findClosedRetreatForRequestSource('  dahab-retreat-reserve  ')?.id, 'dahab');
assert.throws(
  () => assertRetreatRequestSourceOpen('dahab-retreat-reserve'),
  (e) => e.code === 'BOOKING_CLOSED',
);

// Allowed: Wadi Rum, feedback, events, Haifa, private sessions, unknown, malformed.
const allowedSources = [
  'wadi-rum-registration',
  'feedback-dahab',
  'feedback-wadi-rum',
  'feedback-zanzibar',
  'sound-healing-registration',
  'ice-bath-registration',
  'nature-chocolate-registration',
  'yoga-class-registration',
  'yoga-class-request',
  'private-sessions',
  'some-unknown-source',
  'dahab',
  'dahab-retreat-reserve-extra',
  'Dahab-Retreat-Reserve',
  '',
  undefined,
  null,
  42,
  {},
];
for (const source of allowedSources) {
  assert.equal(
    findClosedRetreatForRequestSource(source),
    null,
    `source ${JSON.stringify(source)} must not be blocked`,
  );
  assert.doesNotThrow(() => assertRetreatRequestSourceOpen(source));
}

// Catalog event/lesson sources must never be blocked by the retreat guard.
for (const item of [...Object.values(EVENT_CATALOG), ...Object.values(LESSON_CATALOG)]) {
  for (const source of [item.source, ...(item.sources || [])]) {
    assert.equal(findClosedRetreatForRequestSource(source), null, `${source} must stay allowed`);
  }
}

// Zanzibar policy is deliberately unresolved: its source is NOT guarded by this change.
assert.equal(findClosedRetreatForRequestSource('zanzibar-retreat-reserve'), null);

// The guard follows catalog status: an OPEN Dahab entry is allowed again.
const openDahabCatalog = {
  dahab: { ...dahab, bookingStatus: BOOKING_STATUS.OPEN },
};
assert.equal(
  findClosedRetreatForRequestSource('dahab-retreat-reserve', openDahabCatalog),
  null,
);

// ---- Commerce checkout guard: rejects before any database access ---------------------
await assert.rejects(
  () => assertAvailability({ commerceType: 'retreat', itemId: 'dahab', quantity: 1 }),
  (e) => e.code === 'BOOKING_CLOSED',
);
assert.equal(fetchCalls.length, 0, 'assertAvailability(dahab) must not touch the network');

// ---- Route-level tests (real route handlers, stubbed fetch) --------------------------
// The routes import via the "@/" alias, which plain Node cannot resolve. Register a tiny
// resolver hook that maps "@/x" to "<repo>/x(.js)". Test-only; no dependency added.
register(
  'data:text/javascript,' +
    encodeURIComponent(`
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const root = ${JSON.stringify(root)};
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const base = join(root, specifier.slice(2));
    for (const candidate of [base, base + '.js', join(base, 'index.js')]) {
      if (existsSync(candidate) && statSync(candidate).isFile()) {
        return nextResolve(pathToFileURL(candidate).href, context);
      }
    }
  }
  return nextResolve(specifier, context);
}
`),
);

const retreatRequestRoute = await import(
  pathToFileURL(join(root, 'app/api/retreat-request/route.js')).href
);
const checkoutRoute = await import(
  pathToFileURL(join(root, 'app/api/commerce/checkout/route.js')).href
);

function jsonPost(path, body) {
  return new Request(`http://localhost${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function retreatBody(source) {
  return {
    id: `req-test-${source}`,
    source,
    retreatType: 'Test',
    fullName: 'Test Person',
    phone: '0500000000',
  };
}

await withEnv(FAKE_ENV, async () => {
  // Closed Dahab request -> 409 BOOKING_CLOSED, before any insert.
  fetchCalls.length = 0;
  fakeInsertAllowed = false;
  const blocked = await retreatRequestRoute.POST(
    jsonPost('/api/retreat-request', retreatBody('dahab-retreat-reserve')),
  );
  assert.equal(blocked.status, 409);
  assert.equal((await blocked.json()).code, 'BOOKING_CLOSED');
  assert.equal(fetchCalls.length, 0, 'blocked Dahab request must not reach the database layer');

  // Allowed sources reach exactly one (stubbed) insert and succeed, unchanged.
  fakeInsertAllowed = true;
  for (const source of ['wadi-rum-registration', 'feedback-dahab', 'sound-healing-registration']) {
    fetchCalls.length = 0;
    const res = await retreatRequestRoute.POST(
      jsonPost('/api/retreat-request', retreatBody(source)),
    );
    assert.equal(res.status, 200, `${source} should still be accepted`);
    assert.equal((await res.json()).ok, true);
    assert.equal(fetchCalls.length, 1, `${source} should perform exactly one (stubbed) insert`);
    assert.equal(fetchCalls[0].method, 'POST');
    assert.match(fetchCalls[0].url, /\/rest\/v1\/retreat_requests$/);
  }

  // Existing validation behaviour is unchanged (400 for a missing required field).
  fetchCalls.length = 0;
  const invalid = await retreatRequestRoute.POST(
    jsonPost('/api/retreat-request', { id: 'x', source: 'wadi-rum-registration', phone: '1' }),
  );
  assert.equal(invalid.status, 400);
  assert.equal(fetchCalls.length, 0);

  // Dahab via the commerce checkout route: rejected with 409 before any database write.
  fetchCalls.length = 0;
  fakeInsertAllowed = false;
  const checkout = await checkoutRoute.POST(
    jsonPost('/api/commerce/checkout', {
      commerceType: 'retreat',
      itemId: 'dahab',
      payment: 'manual',
      customer: { fullName: 'Test Person', phone: '0500000000' },
    }),
  );
  assert.equal(checkout.status, 409);
  assert.equal((await checkout.json()).code, 'BOOKING_CLOSED');
  assert.equal(fetchCalls.length, 0, 'closed Dahab checkout must not touch the database layer');
});

console.log(
  'test-dahab-closure: all assertions passed (fetch stubbed, fake env only; no database or network)',
);
