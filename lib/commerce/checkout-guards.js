import { assertServerCommerceDatabaseConfigured } from './supabase.js';
import { isHypPayOperational } from './payment/hyp-pay/config.js';
import { assertHypPaymentDeploymentAllowed } from './payment/hyp-pay/environment-guard.js';

/**
 * Fail closed before persisting checkout rows or calling Hyp SIGN.
 * @param {{ paymentMethod: string }} options
 */
export function assertCheckoutPrerequisites({ paymentMethod }) {
  assertServerCommerceDatabaseConfigured();

  const method = String(paymentMethod || '').toLowerCase();
  if (method === 'hyp' && isHypPayOperational()) {
    assertHypPaymentDeploymentAllowed();
  }
}
