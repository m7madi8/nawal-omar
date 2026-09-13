import { growProvider } from './grow.js';
import { manualProvider } from './manual.js';
import { stripeProvider } from './stripe.js';

const providers = {
  manual: manualProvider,
  whatsapp: manualProvider,
  cash: manualProvider,
  paypal: manualProvider,
  stripe: stripeProvider,
  grow: growProvider,
};

export function getPaymentProvider(method) {
  return providers[method] || manualProvider;
}

export function isPaymentMethodEnabled(method) {
  const provider = getPaymentProvider(method);
  return provider.enabled !== false;
}

export async function createPaymentSession({ method, order, items, successUrl, cancelUrl }) {
  const provider = getPaymentProvider(method);
  if (provider.enabled === false) {
    const error = new Error(`${method} payments are not enabled`);
    error.code = `${method.toUpperCase()}_DISABLED`;
    throw error;
  }
  return provider.createPaymentSession({ order, items, successUrl, cancelUrl });
}

export async function confirmPayment({ method, sessionId }) {
  const provider = getPaymentProvider(method || 'stripe');
  return provider.confirmPayment(sessionId);
}

export { growProvider, manualProvider, stripeProvider };
