/**
 * Smoke test: Hyp config, DB insert, APISign (no browser).
 * Usage: node --env-file=.env.local scripts/audit-hyp-checkout.mjs
 */
import { isHypPayOperational } from '../lib/commerce/payment/hyp-pay/config.js';
import { processCheckout } from '../lib/commerce/checkout.js';

const results = [];

function pass(msg) {
  results.push({ ok: true, msg });
}
function fail(msg, detail) {
  results.push({ ok: false, msg, detail });
}

if (!isHypPayOperational()) {
  fail('Hyp Pay not operational', 'Check HYP_PAYMENTS_ENABLED and credentials');
} else {
  pass('Hyp Pay operational (credentials + enabled flag)');
}

const fakeRequest = {
  headers: { get: (h) => (h === 'host' ? 'localhost:3000' : null) },
};

const cases = [
  {
    name: 'retreat deposit',
    body: {
      commerceType: 'retreat',
      itemId: 'wadi-rum',
      payment: 'hyp',
      depositAmount: 400,
      customer: { fullName: 'Audit Test', phone: '+972521234567', email: '' },
      cancelUrl: '/register/wadi-rum?payment=failed',
    },
  },
  {
    name: 'event',
    body: {
      commerceType: 'event',
      itemId: 'sound-healing',
      priceTier: 'member',
      payment: 'hyp',
      customer: { fullName: 'Audit Test', phone: '+972521234567', city: 'Haifa' },
    },
  },
  {
    name: 'lesson',
    body: {
      commerceType: 'lesson',
      itemId: 'haifa-yoga',
      packageId: 'trial',
      payment: 'hyp',
      customer: { fullName: 'Audit Test', phone: '+972521234567', city: 'Haifa' },
    },
  },
];

for (const { name, body } of cases) {
  try {
    const out = await processCheckout(body, fakeRequest);
    if (out.url && out.url.includes('pay.hyp.co.il') && out.url.includes('signature=')) {
      pass(`checkout ${name}: order ${out.orderId}, Hyp URL signed`);
    } else {
      fail(`checkout ${name}`, JSON.stringify(out));
    }
  } catch (e) {
    fail(`checkout ${name}`, `${e.code || 'ERR'}: ${e.message}`);
  }
}

const failed = results.filter((r) => !r.ok);
for (const r of results) {
  console.log(r.ok ? '✓' : '✗', r.msg, r.detail ? `- ${r.detail}` : '');
}
process.exit(failed.length ? 1 : 0);
