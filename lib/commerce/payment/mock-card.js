/**
 * Development placeholder when card gateway credentials are not configured.
 * Does not simulate successful payments.
 */
export const mockCardProvider = {
  id: 'mock',
  enabled: true,

  async createPaymentSession() {
    const error = new Error(
      'Online card payments are not configured. Set Hyp Pay credentials and HYP_PAYMENTS_ENABLED=true, or use manual/WhatsApp checkout.',
    );
    error.code = 'PAYMENT_NOT_CONFIGURED';
    throw error;
  },

  async confirmPayment() {
    return { ok: false, paid: false, code: 'PAYMENT_NOT_CONFIGURED' };
  },
};
