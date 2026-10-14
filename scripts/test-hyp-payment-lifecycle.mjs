import assert from 'node:assert/strict';
import { PAYMENT_ATTEMPT_STATUS, PAYMENT_STATUS } from '../lib/commerce/constants.js';
import { createCorrelationId } from '../lib/commerce/payment/attempt-telemetry.js';
import { resolveAuthoritativeDecline } from '../lib/commerce/payment/attempts.js';

assert.ok(createCorrelationId().startsWith('corr-'));
assert.equal(resolveAuthoritativeDecline('0'), null);
assert.equal(resolveAuthoritativeDecline(''), null);
assert.equal(resolveAuthoritativeDecline(undefined), null);
assert.equal(resolveAuthoritativeDecline('51'), '51');

const statuses = Object.values(PAYMENT_ATTEMPT_STATUS);
assert.ok(statuses.includes('awaiting_customer'));
assert.ok(statuses.includes('gateway_declined'));
assert.ok(statuses.includes('paid_confirmed'));
assert.notEqual(PAYMENT_ATTEMPT_STATUS.AWAITING_CUSTOMER, PAYMENT_STATUS.FAILED);
assert.notEqual(PAYMENT_ATTEMPT_STATUS.PAID_CONFIRMED, PAYMENT_STATUS.PAID);

console.log('test-hyp-payment-lifecycle: all assertions passed');
