import { PAYMENT_STATUS } from '../../constants.js';
import { updateOrder } from '../../orders.js';
import { buildSignRequestParams } from './build-sign-request.js';
import { buildHostedPaymentUrl, requestPaymentPageSign } from './client.js';
import { getHypPayConfig, isHypPayOperational } from './config.js';
import { logHypPaymentEvent } from './logging.js';
import { confirmHypPayFromRedirect } from '../confirmation.js';

export const hypPayProvider = {
  id: 'hyp',
  enabled: isHypPayOperational(),

  async createPaymentSession({ order, items, successUrl, cancelUrl, chargeAmount, paymentKind, description }) {
    const cfg = getHypPayConfig();
    const { params, amount, currency, paymentKind: kind } = buildSignRequestParams({
      order,
      items,
      chargeAmount,
      paymentKind,
      description,
    });

    const signedQuery = await requestPaymentPageSign(params);
    const url = buildHostedPaymentUrl(signedQuery);

    logHypPaymentEvent('sign', {
      orderId: order.id,
      amount,
      currency,
      paymentKind: kind,
      environment: cfg.environment,
    });

    try {
      await updateOrder(order.id, {
        payment_status: PAYMENT_STATUS.PENDING,
        metadata: {
          ...(order.metadata || {}),
          chargeAmount: amount,
          paymentKind: kind,
          hypSignSession: true,
          provider: 'hyp',
          successUrl: successUrl || cfg.returnUrl || '',
          cancelUrl: cancelUrl || '',
        },
      });
    } catch (error) {
      logHypPaymentEvent('order_update_skipped', {
        orderId: order.id,
        reason: error?.message || 'update_failed',
      });
    }

    return {
      provider: 'hyp',
      orderId: order.id,
      via: 'hyp',
      url,
      sessionId: order.id,
      chargeAmount: Number(amount),
    };
  },

  async confirmPayment({ redirectQuery, sessionId }) {
    if (redirectQuery) {
      return confirmHypPayFromRedirect(redirectQuery);
    }
    if (sessionId) {
      return { ok: false, paid: false, code: 'HYP_REDIRECT_REQUIRED', orderId: sessionId };
    }
    return { ok: false, paid: false };
  },
};
