import { isHypPayOperational } from '@/lib/commerce/payment/hyp-pay/config';
import { isPaymentMethodEnabled } from '@/lib/commerce/payment';

export async function GET() {
  const hypLive = isHypPayOperational();
  const stripe = isPaymentMethodEnabled('stripe');
  return Response.json({
    ok: true,
    hyp: hypLive,
    hypLive,
    demo: false,
    cardPrimary: hypLive,
    stripe,
    manual: true,
    whatsapp: true,
    online: hypLive || stripe,
  });
}
