import { confirmHypPayFromRedirect } from '@/lib/commerce/payment';
import { extractRedirectQueryFromUrl } from '@/lib/commerce/payment/hyp-pay/redirect';
import { getEvent } from '@/lib/commerce/catalog/events';
import { getOrder, siteUrlFromRequest } from '@/lib/commerce/orders';
import { bookingAccessToken } from '@/lib/commerce/booking-access';

function eventPagePath(itemId) {
  const event = itemId ? getEvent(itemId) : null;
  return event?.metadata?.pagePath || '/events';
}

async function thanksPath(result) {
  const order = result.orderId ? await getOrder(result.orderId) : null;
  const commerceType = order?.metadata?.commerceType || '';
  const itemId = order?.metadata?.itemId || '';

  if (!result.paid) {
    if (commerceType === 'lesson' && itemId === 'haifa-yoga') {
      return '/workshops/haifa?payment=failed';
    }
    if (commerceType === 'event' && itemId) {
      return `${eventPagePath(itemId)}?payment=failed`;
    }
    return '/register/wadi-rum/pay?payment=failed';
  }

  if (!result.orderId) {
    if (commerceType === 'lesson') return '/workshops/haifa?payment=success';
    if (commerceType === 'event' && itemId) {
      return `${eventPagePath(itemId)}?payment=success`;
    }
    return '/register/wadi-rum/thanks';
  }

  const token = bookingAccessToken(result.orderId, order?.customer?.phone || '');
  const qs = new URLSearchParams({ order: result.orderId, payment: 'success' });
  if (token) qs.set('token', token);

  if (commerceType === 'lesson' && itemId === 'haifa-yoga') {
    return `/workshops/haifa?${qs.toString()}`;
  }
  if (commerceType === 'event' && itemId) {
    return `${eventPagePath(itemId)}?${qs.toString()}`;
  }
  return `/register/wadi-rum/thanks?${qs.toString()}`;
}

/**
 * Hyp Pay success redirect handler (configure this URL in Hyp Portal).
 * Verifies payment server-side via APISign VERIFY — never trusts redirect alone.
 */
export async function GET(request) {
  const rawQuery = extractRedirectQueryFromUrl(request.url);
  if (!rawQuery) {
    return Response.redirect(new URL('/?payment=invalid', request.url), 302);
  }

  let result;
  try {
    result = await confirmHypPayFromRedirect(rawQuery);
  } catch (error) {
    console.error('[hyp-pay] return handler error', error?.code || error?.message);
    return Response.redirect(new URL('/?payment=error', request.url), 302);
  }

  const origin = siteUrlFromRequest(request);
  const target = `${origin}${await thanksPath(result)}`;
  return Response.redirect(target, 302);
}
