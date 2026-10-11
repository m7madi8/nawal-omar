import { isHypPayOperational } from './hyp-pay/config.js';
import { hypPayProvider } from './hyp-pay/provider.js';
import { growProvider } from './grow.js';
import { manualProvider } from './manual.js';
import { mockCardProvider } from './mock-card.js';
import { stripeProvider } from './stripe.js';

const providers = {
  manual: manualProvider,
  whatsapp: manualProvider,
  cash: manualProvider,
  paypal: manualProvider,
  stripe: stripeProvider,
  grow: growProvider,
  hyp: hypPayProvider,
  mock: mockCardProvider,
};

export function getPaymentProvider(method) {
  const key = String(method || '').toLowerCase();
  if (key === 'hyp') {
    if (isHypPayOperational()) return hypPayProvider;
    return mockCardProvider;
  }
  return providers[key] || manualProvider;
}

export function isPaymentMethodEnabled(method) {
  if (method === 'hyp') return isHypPayOperational();
  const provider = getPaymentProvider(method);
  return provider.enabled !== false;
}

export async function createPaymentSession({
  method,
  order,
  items,
  successUrl,
  cancelUrl,
  chargeAmount,
  paymentKind,
  description,
}) {
  const provider = getPaymentProvider(method);
  if (method === 'hyp' && !isHypPayOperational()) {
    const error = new Error('Hyp Pay is not enabled or not fully configured');
    error.code = 'HYP_DISABLED';
    throw error;
  }
  if (provider.enabled === false && method !== 'hyp') {
    const error = new Error(`${method} payments are not enabled`);
    error.code = `${String(method).toUpperCase()}_DISABLED`;
    throw error;
  }
  return provider.createPaymentSession({
    order,
    items,
    successUrl,
    cancelUrl,
    chargeAmount,
    paymentKind,
    description,
  });
}

export async function confirmPayment({ method, sessionId, redirectQuery }) {
  const provider = getPaymentProvider(method || 'stripe');
  return provider.confirmPayment({ sessionId, redirectQuery });
}

export { growProvider, manualProvider, stripeProvider, hypPayProvider, mockCardProvider };
export { confirmHypPayFromRedirect } from './confirmation.js';
