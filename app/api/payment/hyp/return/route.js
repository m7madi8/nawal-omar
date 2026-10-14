import { confirmHypPayFromRedirect } from '@/lib/commerce/payment';
import {
  extractRedirectQueryFromUrl,
  readRedirectOrderRef,
} from '@/lib/commerce/payment/hyp-pay/redirect';
import { getOrder, siteUrlFromRequest } from '@/lib/commerce/orders';
import { bookingBackPath, paymentThanksUrl } from '@/lib/commerce/thanks-path';
import { logPaymentAttemptEvent } from '@/lib/commerce/payment/attempt-telemetry.js';

async function thanksPath(result) {
  const order = result.orderId ? await getOrder(result.orderId) : null;
  const commerceType = order?.metadata?.commerceType || '';
  const itemId = order?.metadata?.itemId || '';
  const phone = order?.customer?.phone || '';

  if (!result.paid) {
    if (result.orderId && result.pending) {
      return paymentThanksUrl(result.orderId, phone, { pending: true });
    }
    if (result.orderId) {
      return paymentThanksUrl(result.orderId, phone, { failed: true });
    }
    if (commerceType === 'lesson' || commerceType === 'event') {
      return `${bookingBackPath(commerceType, itemId)}?payment=failed`;
    }
    return '/register/wadi-rum?payment=failed';
  }

  if (!result.orderId) {
    return '/payment/thanks?payment=pending';
  }

  return paymentThanksUrl(result.orderId, phone);
}

/**
 * Hyp Pay success redirect handler (configure this URL in Hyp Portal).
 * Verifies payment server-side via APISign VERIFY — never trusts redirect alone.
 */
export async function GET(request) {
  const rawQuery = extractRedirectQueryFromUrl(request.url);
  if (!rawQuery) {
    logPaymentAttemptEvent('return_invalid', { reason: 'missing_query' });
    return Response.redirect(new URL('/?payment=invalid', request.url), 302);
  }

  const returnRef = readRedirectOrderRef(rawQuery);
  logPaymentAttemptEvent('return_invoked', {
    method: 'GET',
    queryLength: rawQuery.length,
    orderId: returnRef.orderId,
    hasHypTransactionId: returnRef.hasHypTransactionId,
  });

  let result;
  try {
    result = await confirmHypPayFromRedirect(rawQuery);
  } catch (error) {
    console.error('[hyp-pay] return handler error', error?.code || error?.message);
    logPaymentAttemptEvent('return_handler_error', {
      orderId: returnRef.orderId,
      code: error?.code || 'ERROR',
      message: error?.message || 'handler_failed',
    });
    return Response.redirect(new URL('/?payment=error', request.url), 302);
  }

  logPaymentAttemptEvent('return_processed', {
    orderId: result.orderId || null,
    paid: Boolean(result.paid),
    pending: Boolean(result.pending),
    finalizationIncomplete: Boolean(result.finalizationIncomplete),
    code: result.code || null,
    ccode: result.ccode != null ? String(result.ccode) : null,
  });

  const origin = siteUrlFromRequest(request);
  const target = `${origin}${await thanksPath(result)}`;
  return Response.redirect(target, 302);
}
