import assert from 'node:assert/strict';

import {
  readExplicitDeploymentModeEnv,
  resolveDeploymentMode,
  validateDeploymentModeForPayments,
  validateExplicitDeploymentModeEnv,
} from '../lib/commerce/deployment-mode.js';
import {
  assertServerCommerceDatabaseConfigured,
  getServerSupabaseUrl,
} from '../lib/commerce/supabase.js';
import { validateHypTerminalForDeployment } from '../lib/commerce/payment/hyp-pay/environment-guard.js';
import { isHypTestTerminal } from '../lib/commerce/payment/hyp-pay/config.js';
import { assertCheckoutPrerequisites } from '../lib/commerce/checkout-guards.js';

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

assert.equal(isHypTestTerminal('0010012345'), true);
assert.equal(isHypTestTerminal('812345678'), false);

// Missing Supabase URL
await withEnv(
  { SUPABASE_URL: '', SUPABASE_SERVICE_ROLE_KEY: 'svc-test' },
  () => {
    assert.throws(() => getServerSupabaseUrl(), (e) => e.code === 'SUPABASE_URL_MISSING');
    assert.throws(
      () => assertServerCommerceDatabaseConfigured(),
      (e) => e.code === 'SUPABASE_URL_MISSING' || e.code === 'SUPABASE_SERVICE_ROLE_MISSING',
    );
  },
);

// Missing service role
await withEnv(
  { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: '' },
  () => {
    assert.throws(
      () => assertServerCommerceDatabaseConfigured(),
      (e) => e.code === 'SUPABASE_SERVICE_ROLE_MISSING',
    );
  },
);

// Staging + test terminal allowed
await withEnv(
  {
    NAWAL_DEPLOYMENT_MODE: 'staging',
    HYP_PAYMENTS_ENABLED: 'true',
    HYP_TERMINAL_ID: '0010099999',
    HYP_API_KEY: 'k',
    HYP_API_PASSP: 'p',
  },
  () => {
    const v = validateHypTerminalForDeployment();
    assert.equal(v.ok, true);
  },
);

// Staging + live terminal forbidden
await withEnv(
  {
    NAWAL_DEPLOYMENT_MODE: 'staging',
    HYP_PAYMENTS_ENABLED: 'true',
    HYP_TERMINAL_ID: '812345678',
    HYP_API_KEY: 'k',
    HYP_API_PASSP: 'p',
  },
  () => {
    const v = validateHypTerminalForDeployment();
    assert.equal(v.ok, false);
    assert.equal(v.code, 'HYP_LIVE_TERMINAL_FORBIDDEN');
  },
);

// Production + test terminal forbidden
await withEnv(
  {
    NAWAL_DEPLOYMENT_MODE: 'production',
    HYP_PAYMENTS_ENABLED: 'true',
    HYP_TERMINAL_ID: '0010012345',
    HYP_API_KEY: 'k',
    HYP_API_PASSP: 'p',
  },
  () => {
    const v = validateHypTerminalForDeployment();
    assert.equal(v.ok, false);
    assert.equal(v.code, 'HYP_TEST_TERMINAL_IN_PRODUCTION');
  },
);

// Production + live terminal OK
await withEnv(
  {
    NAWAL_DEPLOYMENT_MODE: 'production',
    HYP_PAYMENTS_ENABLED: 'true',
    HYP_TERMINAL_ID: '812345678',
    HYP_API_KEY: 'k',
    HYP_API_PASSP: 'p',
  },
  () => {
    const v = validateHypTerminalForDeployment();
    assert.equal(v.ok, true);
  },
);

// Payments disabled — no terminal validation error from guard when not configured
await withEnv(
  {
    NAWAL_DEPLOYMENT_MODE: 'staging',
    HYP_PAYMENTS_ENABLED: 'false',
    HYP_TERMINAL_ID: '812345678',
  },
  () => {
    const v = validateHypTerminalForDeployment();
    assert.equal(v.ok, false);
    assert.equal(v.code, 'HYP_NOT_CONFIGURED');
  },
);

// Hyp checkout prerequisites fail before DB when URL missing
await withEnv(
  {
    SUPABASE_URL: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
    HYP_PAYMENTS_ENABLED: 'true',
    HYP_TERMINAL_ID: '0010012345',
    HYP_API_KEY: 'k',
    HYP_API_PASSP: 'p',
    NAWAL_DEPLOYMENT_MODE: 'staging',
  },
  () => {
    assert.throws(
      () => assertCheckoutPrerequisites({ paymentMethod: 'hyp' }),
      (e) => e.code === 'SUPABASE_URL_MISSING',
    );
  },
);

await withEnv(
  {
    NODE_ENV: 'production',
    VERCEL_ENV: undefined,
    NAWAL_DEPLOYMENT_MODE: undefined,
    DEPLOYMENT_MODE: undefined,
    HYP_PAYMENTS_ENABLED: 'true',
    HYP_TERMINAL_ID: '0010012345',
    HYP_API_KEY: 'k',
    HYP_API_PASSP: 'p',
  },
  () => {
    const d = validateDeploymentModeForPayments();
    assert.equal(d.ok, false);
    assert.equal(d.code, 'DEPLOYMENT_MODE_REQUIRED');
  },
);

await withEnv(
  { NODE_ENV: 'test', NAWAL_DEPLOYMENT_MODE: undefined },
  () => {
    assert.equal(resolveDeploymentMode(), 'development');
    assert.equal(readExplicitDeploymentModeEnv(), null);
  },
);

await withEnv(
  { NAWAL_DEPLOYMENT_MODE: 'production', DEPLOYMENT_MODE: 'staging' },
  () => {
    const c = validateExplicitDeploymentModeEnv();
    assert.equal(c.ok, false);
    assert.equal(c.code, 'DEPLOYMENT_MODE_CONFLICT');
  },
);

console.log('test-security-phase-c: all assertions passed (env mocks only; no network)');
