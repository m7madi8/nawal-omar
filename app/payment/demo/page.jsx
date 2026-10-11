import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Demo payment | Nawal Yoga',
  robots: { index: false, follow: false },
};

const html = `
  <main class="wrc-page ny-inner" style="max-width: 28rem; margin: 2rem auto;">
    <div class="wrc-card">
      <h1 class="wrc-card__title" data-i18n="payment_demo_title">Trial payment (demo)</h1>
      <p class="wrc-fine" data-i18n="payment_demo_body">No real card charge. For local testing only.</p>
      <p class="wrc-total__amount" id="demo-amount" dir="ltr" hidden></p>
      <button type="button" class="wrc-pay-btn" id="demo-pay-btn" data-i18n="payment_demo_pay">Complete demo payment</button>
      <p class="wrc-status" id="demo-status" role="status" hidden></p>
      <a class="wrc-back-btn" href="/" data-i18n="payment_demo_cancel">Cancel</a>
    </div>
  </main>
`;

export default function Page() {
  return (
    <LegacyPage
      lang="en"
      dir="rtl"
      styles={['/css/wadi-rum-checkout.css']}
      scripts={[
        { src: '/legacy/js/i18n.js' },
        { src: '/legacy/js/payment-demo.js' },
      ]}
      html={html}
    />
  );
}
