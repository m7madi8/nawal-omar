import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Payment confirmed | Nawal Yoga',
  robots: { index: false, follow: false },
};

const html = `
  <main class="wrc-thanks ny-inner commerce-thanks">
    <div class="wrc-thanks__icon" aria-hidden="true">✓</div>
    <p class="wrc-fine" id="pay-thanks-pending" hidden data-i18n="payment_thanks_verify">Confirming your payment…</p>
    <p class="wrc-fine" id="pay-thanks-failed" hidden data-i18n="payment_thanks_failed">Payment was not completed.</p>
    <h1 id="pay-thanks-title" data-i18n="payment_thanks_title">Payment received</h1>
    <p id="pay-thanks-body" data-i18n="payment_thanks_body">Your registration is confirmed. Your receipt is downloading and WhatsApp will open with a confirmation message.</p>
    <p class="wrc-fine" id="pay-thanks-ref" hidden></p>
    <div class="wrc-rows" id="pay-thanks-summary" hidden></div>
    <a class="wrc-pay-btn" id="pay-thanks-pdf" href="#" hidden download data-i18n="payment_thanks_pdf">Download receipt (PDF)</a>
    <a class="wrc-pay-btn" id="pay-thanks-wa" href="#" target="_blank" rel="noopener noreferrer" hidden data-i18n="payment_thanks_wa">Send confirmation on WhatsApp</a>
    <p class="wrc-fine" id="pay-thanks-wa-hint" hidden data-i18n="payment_thanks_wa_hint">Tap Send in WhatsApp to notify Nawal.</p>
    <a class="wrc-back-btn" id="pay-thanks-back" href="/" data-i18n="payment_thanks_back">Back</a>
  </main>
`;

export default function Page() {
  return (
    <LegacyPage
      lang="en"
      dir="rtl"
      styles={['/css/wadi-rum-checkout.css']}
      scripts={[{ src: '/legacy/js/i18n.js' }, { src: '/legacy/js/payment-thanks.js' }]}
      html={html}
    />
  );
}
