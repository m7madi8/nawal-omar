import { isHypPayOperational } from '../hyp-pay/config.js';

/** Local / staging card flow without Hyp credentials. Disabled when live Hyp is on. */
export function isPaymentDemoMode() {
  if (isHypPayOperational()) return false;
  if (process.env.PAYMENT_DEMO_MODE !== 'true') return false;
  if (process.env.NODE_ENV === 'production' && process.env.PAYMENT_DEMO_ALLOW_PRODUCTION !== 'true') {
    return false;
  }
  return true;
}
