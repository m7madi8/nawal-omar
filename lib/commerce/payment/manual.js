export const manualProvider = {
  id: 'manual',
  enabled: true,

  async createPaymentSession({ orderId }) {
    return {
      provider: 'manual',
      orderId,
      via: 'manual',
    };
  },

  async confirmPayment() {
    return { ok: true, paid: false };
  },
};
