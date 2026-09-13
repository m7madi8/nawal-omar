export const growProvider = {
  id: 'grow',
  enabled: false,

  async createPaymentSession() {
    const error = new Error('Grow payments are not enabled');
    error.code = 'GROW_DISABLED';
    throw error;
  },

  async confirmPayment() {
    const error = new Error('Grow payments are not enabled');
    error.code = 'GROW_DISABLED';
    throw error;
  },
};
