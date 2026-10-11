import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Booking confirmed | Wadi Rum Retreat',
  description: 'Your deposit was received. Your Wadi Rum retreat spot is secured.',
};

const html = `
  <main class="wrc-thanks ny-inner">
    <div class="wrc-thanks__icon" aria-hidden="true">✓</div>
    <p class="wrc-fine" id="wrc-pending-verify" hidden data-i18n="retreat_wadi_thanks_verify_body">Confirming your payment…</p>
    <h1 data-i18n="retreat_wadi_thanks_title">You're booked!</h1>
    <p data-i18n="retreat_wadi_thanks_body">We received your deposit. Your spot for the Wadi Rum retreat is secured.</p>
    <p class="wrc-fine" id="wrc-order-ref" hidden></p>
    <div class="wrc-rows" id="wrc-payment-summary" hidden></div>
    <a class="wrc-pay-btn" id="wrc-pdf-btn" href="#" hidden download data-i18n="retreat_wadi_thanks_pdf">Download payment receipt (PDF)</a>
    <a class="wrc-pay-btn" id="wrc-wa-btn" href="#" target="_blank" rel="noopener noreferrer" hidden data-i18n="retreat_wadi_thanks_wa_confirm">Confirm via WhatsApp</a>
    <p class="wrc-fine" id="wrc-wa-hint" hidden data-i18n="retreat_wadi_thanks_wa_hint">WhatsApp opens with a prefilled message — press Send when you're ready.</p>
    <a class="wrc-back-btn" href="/retreats/wadi-rum" data-i18n="retreat_wadi_thanks_back">Back to retreat page</a>
  </main>
`;

export default function Page() {
  return (
    <LegacyPage
      lang="en"
      dir="rtl"
      bodyClassName=""
      styles={['/css/wadi-rum-checkout.css']}
      currentNav="retreats"
      scripts={[
        { src: '/legacy/js/i18n.js' },
        {
          src: '/legacy/js/wadi-rum-thanks.js',
        },
      ]}
      html={html}
    />
  );
}
