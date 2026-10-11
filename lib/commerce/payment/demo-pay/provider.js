import { PAYMENT_STATUS } from '../../constants.js';
import { updateOrder } from '../../orders.js';
import { bookingAccessToken } from '../../booking-access.js';
import { isPaymentDemoMode } from './config.js';

function siteOrigin() {
  const env = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (env) return env.startsWith('http') ? env.replace(/\/+$/, '') : `https://${env.replace(/\/+$/, '')}`;
  return 'http://localhost:3000';
}

export const demoPayProvider = {
  id: 'demo',
  enabled: isPaymentDemoMode(),

  async createPaymentSession({ order, items, cancelUrl, chargeAmount, paymentKind }) {
    if (!isPaymentDemoMode()) {
      const error = new Error('Payment demo mode is not enabled');
      error.code = 'DEMO_DISABLED';
      throw error;
    }

    const amount =
      chargeAmount != null && chargeAmount !== ''
        ? Number(chargeAmount)
        : Number(order.metadata?.chargeAmount ?? order.total);

    await updateOrder(order.id, {
      payment_status: PAYMENT_STATUS.PENDING,
      metadata: {
        ...(order.metadata || {}),
        chargeAmount: amount,
        paymentKind: paymentKind || order.metadata?.paymentKind || 'full',
        provider: 'demo',
        cancelUrl: cancelUrl || '',
      },
    });

    const token = bookingAccessToken(order.id, order.customer?.phone || '');
    const qs = new URLSearchParams({ order: order.id });
    if (token) qs.set('token', token);

    return {
      provider: 'demo',
      orderId: order.id,
      via: 'demo',
      url: `${siteOrigin()}/payment/demo?${qs.toString()}`,
      sessionId: order.id,
      chargeAmount: amount,
      paymentKind,
    };
  },

  async confirmPayment() {
    return { ok: false, paid: false, code: 'DEMO_USE_CONFIRM_ROUTE' };
  },
};
