import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildAdminInlineScript } from '../lib/adminWorkspace.js';
import {
  validateDeploymentModeForPayments,
  validateExplicitDeploymentModeEnv,
} from '../lib/commerce/deployment-mode.js';
import { PAYMENT_STATUS } from '../lib/commerce/constants.js';
import { startHypSignForPersistedOrder } from '../lib/commerce/payment/hyp-sign-from-order.js';
import { getPublicSupabaseBrowserConfig } from '../lib/publicSupabaseConfig.js';

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

const hypEnv = {
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'svc-test',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-test',
  HYP_PAYMENTS_ENABLED: 'true',
  HYP_TERMINAL_ID: '0010099999',
  HYP_API_KEY: 'k',
  HYP_API_PASSP: 'p',
  NAWAL_DEPLOYMENT_MODE: 'staging',
};

function mockRequest() {
  return new Request('https://staging.example.com/api/commerce/hyp/sign', {
    headers: { host: 'staging.example.com' },
  });
}

function baseOrder(overrides = {}) {
  return {
    id: 'ord-c2-1',
    currency: 'ILS',
    total: 400,
    payment_status: PAYMENT_STATUS.PENDING,
    payment_method: 'hyp',
    metadata: { chargeAmount: 400, paymentKind: 'deposit' },
    customer: { phone: '0500000000', fullName: 'Test' },
    ...overrides,
  };
}

const items = [{ item_id: 'wadi-rum', title: 'Wadi Rum', commerce_type: 'retreat' }];

// --- Deployment mode ---
await withEnv(
  { NAWAL_DEPLOYMENT_MODE: 'staging', DEPLOYMENT_MODE: 'production' },
  () => {
    const v = validateExplicitDeploymentModeEnv();
    assert.equal(v.ok, false);
    assert.equal(v.code, 'DEPLOYMENT_MODE_CONFLICT');
  },
);

await withEnv(
  { ...hypEnv, NAWAL_DEPLOYMENT_MODE: 'not-a-mode', DEPLOYMENT_MODE: undefined },
  () => {
    const v = validateDeploymentModeForPayments();
    assert.equal(v.ok, false);
    assert.equal(v.code, 'DEPLOYMENT_MODE_INVALID');
  },
);

await withEnv(
  { NAWAL_DEPLOYMENT_MODE: 'staging', DEPLOYMENT_MODE: undefined, ...hypEnv },
  () => {
    const v = validateDeploymentModeForPayments();
    assert.equal(v.ok, true);
    assert.equal(v.mode, 'staging');
  },
);

// --- Admin inline config ---
await withEnv({ SUPABASE_URL: '', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon' }, () => {
  const script = buildAdminInlineScript();
  assert.match(script, /SUPABASE_URL_MISSING/);
  assert.doesNotMatch(script, /xzxyskufrqansbhsbdkt/);
});

// --- Public browser config ---
await withEnv({ SUPABASE_URL: '', NEXT_PUBLIC_SUPABASE_ANON_KEY: '' }, () => {
  assert.equal(getPublicSupabaseBrowserConfig(), null);
});

// --- Hyp SIGN from persisted order (injected deps; no network) ---
await withEnv(hypEnv, async () => {
  await assert.rejects(
    () =>
      startHypSignForPersistedOrder({
        orderId: 'missing',
        request: mockRequest(),
        deps: {
          getOrder: async () => null,
          getOrderItems: async () => items,
          createPaymentSession: async () => ({ url: 'https://hyp.test/pay' }),
          assertCheckoutPrerequisites: () => {},
        },
      }),
    (e) => e.code === 'ORDER_NOT_FOUND',
  );

  await assert.rejects(
    () =>
      startHypSignForPersistedOrder({
        orderId: 'ord-c2-1',
        request: mockRequest(),
        deps: {
          getOrder: async () => baseOrder({ payment_status: PAYMENT_STATUS.PAID }),
          getOrderItems: async () => items,
          createPaymentSession: async () => ({ url: 'https://hyp.test/pay' }),
          assertCheckoutPrerequisites: () => {},
        },
      }),
    (e) => e.code === 'ORDER_ALREADY_PAID',
  );

  await assert.rejects(
    () =>
      startHypSignForPersistedOrder({
        orderId: 'ord-c2-1',
        request: mockRequest(),
        deps: {
          getOrder: async () => baseOrder({ payment_status: PAYMENT_STATUS.CANCELLED }),
          getOrderItems: async () => items,
          createPaymentSession: async () => ({ url: 'https://hyp.test/pay' }),
          assertCheckoutPrerequisites: () => {},
        },
      }),
    (e) => e.code === 'ORDER_NOT_CHARGEABLE',
  );

  let capturedCharge;
  let capturedOrderId;
  const result = await startHypSignForPersistedOrder({
    orderId: 'ord-c2-1',
    request: mockRequest(),
    deps: {
      getOrder: async () => baseOrder({ total: 400, metadata: { chargeAmount: 400 } }),
      getOrderItems: async () => items,
      createPaymentSession: async ({ order, chargeAmount }) => {
        capturedCharge = chargeAmount;
        capturedOrderId = order.id;
        return { url: 'https://hyp.test/pay', chargeAmount };
      },
      assertCheckoutPrerequisites: () => {},
    },
  });

  assert.equal(capturedCharge, 400);
  assert.equal(capturedOrderId, 'ord-c2-1');
  assert.equal(result.chargeAmount, 400);

  // Client cannot lower charge via a different persisted field: server uses expectedChargeAmount(order)
  await startHypSignForPersistedOrder({
    orderId: 'ord-c2-1',
    request: mockRequest(),
    deps: {
      getOrder: async () =>
        baseOrder({
          total: 9999,
          metadata: { chargeAmount: 400 },
          currency: 'USD',
        }),
      getOrderItems: async () => items,
      createPaymentSession: async ({ order, chargeAmount }) => {
        assert.equal(chargeAmount, 400);
        assert.equal(order.currency, 'USD');
        return { url: 'https://hyp.test/pay', chargeAmount };
      },
      assertCheckoutPrerequisites: () => {},
    },
  });

  let prereqCalled = false;
  await assert.rejects(
    () =>
      startHypSignForPersistedOrder({
        orderId: 'ord-c2-1',
        request: mockRequest(),
        deps: {
          getOrder: async () => baseOrder(),
          getOrderItems: async () => items,
          createPaymentSession: async () => ({ url: 'x' }),
          assertCheckoutPrerequisites: () => {
            prereqCalled = true;
            const err = new Error('db');
            err.code = 'SUPABASE_URL_MISSING';
            throw err;
          },
        },
      }),
    (e) => e.code === 'SUPABASE_URL_MISSING',
  );
  assert.equal(prereqCalled, true);

  let sessionCalls = 0;
  const sharedDeps = {
    getOrder: async () => baseOrder(),
    getOrderItems: async () => items,
    createPaymentSession: async () => {
      sessionCalls += 1;
      return { url: `https://hyp.test/pay-${sessionCalls}`, chargeAmount: 400 };
    },
    assertCheckoutPrerequisites: () => {},
  };
  await Promise.all([
    startHypSignForPersistedOrder({ orderId: 'ord-c2-1', request: mockRequest(), deps: sharedDeps }),
    startHypSignForPersistedOrder({ orderId: 'ord-c2-1', request: mockRequest(), deps: sharedDeps }),
  ]);
  assert.equal(sessionCalls, 2);
});

// Real prerequisites: missing DB before SIGN
await withEnv(
  {
    ...hypEnv,
    SUPABASE_URL: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
  },
  async () => {
    await assert.rejects(
      () =>
        startHypSignForPersistedOrder({
          orderId: 'ord-c2-1',
          request: mockRequest(),
          deps: {
            getOrder: async () => baseOrder(),
            getOrderItems: async () => items,
            createPaymentSession: async () => ({ url: 'x' }),
          },
        }),
      (e) => e.code === 'SUPABASE_URL_MISSING',
    );
  },
);

// Environment guard via real prerequisites (conflicting deployment modes)
await withEnv(
  {
    ...hypEnv,
    NAWAL_DEPLOYMENT_MODE: 'staging',
    DEPLOYMENT_MODE: 'production',
  },
  async () => {
    await assert.rejects(
      () =>
        startHypSignForPersistedOrder({
          orderId: 'ord-c2-1',
          request: mockRequest(),
          deps: {
            getOrder: async () => baseOrder(),
            getOrderItems: async () => items,
            createPaymentSession: async () => ({ url: 'x' }),
          },
        }),
      (e) => e.code === 'DEPLOYMENT_MODE_CONFLICT',
    );
  },
);

// --- Static: no hardcoded production project in active browser paths ---
const ACTIVE_BROWSER_FILES = [
  'public/legacy/js/haifa-registration.js',
  'public/legacy/js/commerce-registration.js',
  'public/legacy/js/retreat-request-submit.js',
  'js/haifa-registration.js',
  'public/legacy/js/wadi-rum-registration.js',
  'public/legacy/js/ice-bath-form.js',
  'js/ice-bath-form.js',
  'lib/privateSessionsConfig.js',
  'lib/adminWorkspace.js',
  'lib/feedbackConfig.js',
];

const FORBIDDEN = ['xzxyskufrqansbhsbdkt', 'SUPABASE_SERVICE_ROLE_KEY', 'service_role'];
for (const rel of ACTIVE_BROWSER_FILES) {
  const text = readFileSync(join(root, rel), 'utf8');
  for (const needle of FORBIDDEN) {
    assert.doesNotMatch(text, new RegExp(needle), `${rel} must not contain ${needle}`);
  }
}

console.log('test-security-phase-c2: all assertions passed (mocks only; no network)');
