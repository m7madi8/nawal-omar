import { getHypHostedPaymentMethods, isHypPayOperational } from '@/lib/commerce/payment/hyp-pay/config';
import { validateHypTerminalForDeployment } from '@/lib/commerce/payment/hyp-pay/environment-guard';
import { isPaymentMethodEnabled } from '@/lib/commerce/payment';

export async function GET() {
  const hypConfigured = isHypPayOperational();
  const hypGuard = hypConfigured ? validateHypTerminalForDeployment() : { ok: false };
  const hypLive = hypConfigured && hypGuard.ok;
  const stripe = isPaymentMethodEnabled('stripe');
  const hypMethods = hypLive ? getHypHostedPaymentMethods() : null;
  return Response.json({
    ok: true,
    hyp: hypLive,
    hypLive,
    demo: false,
    cardPrimary: hypLive,
    hypMethods,
    stripe,
    manual: false,
    whatsapp: true,
    online: hypLive || stripe,
  });
}
