import { isHypPayOperational } from '@/lib/commerce/payment/hyp-pay/config';
import { isPaymentDemoMode } from '@/lib/commerce/payment/demo-pay/config';
import { isPaymentMethodEnabled } from '@/lib/commerce/payment';

export async function GET() {
  const hypLive = isHypPayOperational();
  const demo = isPaymentDemoMode();
  const hyp = hypLive || demo;
  const stripe = isPaymentMethodEnabled('stripe');
  return Response.json({
    ok: true,
    hyp,
    hypLive,
    demo,
    cardPrimary: hypLive,
    stripe,
    manual: true,
    whatsapp: true,
    online: hyp || stripe,
  });
}
