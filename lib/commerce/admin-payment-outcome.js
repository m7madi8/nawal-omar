import { PAYMENT_ATTEMPT_STATUS, PAYMENT_STATUS } from './constants.js';

/**
 * Admin-safe payment lifecycle label (no secrets).
 * @param {object|null} order
 * @param {object|null} attempt
 */
export function deriveAdminPaymentOutcome(order, attempt) {
  const meta = order?.metadata || {};
  const attemptStatus = attempt?.status || meta.paymentAttemptStatus || '';

  if (meta.paymentFinalizationState === 'receipt_pending') {
    return 'finalization_error';
  }
  if (meta.paymentOutcomeUnknown) {
    return 'outcome_unknown';
  }
  if (attemptStatus === PAYMENT_ATTEMPT_STATUS.AWAITING_CUSTOMER) {
    return 'awaiting_customer';
  }
  if (attemptStatus === PAYMENT_ATTEMPT_STATUS.OUTCOME_UNKNOWN) {
    return 'outcome_unknown';
  }
  if (attemptStatus === PAYMENT_ATTEMPT_STATUS.VERIFY_FAILED) {
    return 'declined';
  }
  if (attemptStatus === PAYMENT_ATTEMPT_STATUS.PAID_CONFIRMED) {
    return 'paid_confirmed';
  }

  const ps = order?.payment_status;
  if (ps === PAYMENT_STATUS.PROCESSING) {
    return 'payment_processing';
  }
  if (ps === PAYMENT_STATUS.FAILED) {
    return 'declined';
  }
  if (ps === PAYMENT_STATUS.PAID || ps === PAYMENT_STATUS.PARTIALLY_PAID) {
    return 'paid_confirmed';
  }
  if (ps === PAYMENT_STATUS.PENDING || ps === PAYMENT_STATUS.UNPAID) {
    return 'awaiting_customer';
  }
  return 'unknown';
}
