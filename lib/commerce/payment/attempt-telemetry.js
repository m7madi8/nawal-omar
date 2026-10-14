import { maskHypSecretsInQuery } from './hyp-pay/logging.js';

export function createCorrelationId() {
  return `corr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function sanitizeAttemptLogPayload(data = {}) {
  const out = { ...data };
  if (out.redirectQuery) out.redirectQuery = maskHypSecretsInQuery(String(out.redirectQuery));
  if (out.verifyResponse) out.verifyResponse = String(out.verifyResponse).slice(0, 200);
  delete out.apiKey;
  delete out.PassP;
  delete out.KEY;
  return out;
}

export function logPaymentAttemptEvent(event, data = {}) {
  const payload = sanitizeAttemptLogPayload({
    component: 'payment-attempt',
    event,
    ...data,
  });
  console.info('[payment-attempt]', JSON.stringify(payload));
}
