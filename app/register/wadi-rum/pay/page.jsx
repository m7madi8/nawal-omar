import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Secure your spot | Wadi Rum Retreat',
  description: 'Pay the 400 ₪ deposit to confirm your Wadi Rum retreat booking.',
};

const COVER = '/media/wadi-rum/cover.jpg';
const WA = 'https://wa.me/972522496366?text=Hi%20Nawal%2C%20I%20want%20to%20pay%20the%20400%20ILS%20deposit%20for%20Wadi%20Rum%20retreat%20by%20bank%20transfer%20or%20Bit.';

const SUPABASE_URL = 'https://xzxyskufrqansbhsbdkt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_V9_4QWGDFv6Vm-4DQifYGA_1xdoKkph';

const html = `
  <main class="wrc-page ny-inner">
    <div
      id="wrc-supabase-config"
      hidden
      data-url="${SUPABASE_URL}"
      data-key="${SUPABASE_KEY}"
      data-orders-table="commerce_orders"
      data-items-table="commerce_order_items"
    ></div>
    <div class="wrc-top">
      <a class="wrc-back" href="/retreats/wadi-rum" data-i18n="retreat_wadi_checkout_back">← Back to retreat</a>
    </div>
    <p class="wrc-banner" id="wrc-banner" hidden role="status"></p>
    <div class="wrc-grid">
      <section class="wrc-card" aria-labelledby="wrc-summary-title">
        <h1 class="wrc-card__title" id="wrc-summary-title" data-i18n="retreat_wadi_checkout_title">Order summary</h1>
        <div class="wrc-product">
          <img class="wrc-product__img" src="${COVER}" alt="" width="72" height="72" loading="lazy">
          <div>
            <p class="wrc-product__name" data-i18n="retreat_wadi_page_title">Moonlit Wadi Rum Retreat</p>
            <p class="wrc-product__meta"><span dir="ltr" data-i18n="retreat_wadi_hero_meta_date">22–26.10.2026</span> · <span data-i18n="retreat_wadi_hero_meta_place">Wadi Rum, Jordan</span></p>
          </div>
        </div>
        <div class="wrc-rows">
          <div class="wrc-row">
            <span data-i18n="retreat_wadi_checkout_line_retreat">Retreat package</span>
            <strong data-i18n="retreat_wadi_checkout_line_from">from 3,650 ₪</strong>
          </div>
          <div class="wrc-row">
            <span data-i18n="retreat_wadi_checkout_line_deposit">Deposit due today</span>
            <strong dir="ltr">400 ₪</strong>
          </div>
        </div>
        <div class="wrc-total">
          <span class="wrc-total__label" data-i18n="retreat_wadi_checkout_total_label">Total to pay now</span>
          <span class="wrc-total__amount" dir="ltr">400 ₪</span>
        </div>
        <p class="wrc-fine" data-i18n="retreat_wadi_checkout_balance_note">The remaining balance is due before the retreat — we will confirm the date with you.</p>
      </section>

      <section class="wrc-card wrc-pay-card" aria-labelledby="wrc-pay-title">
        <p class="wrc-pay-card__steps" id="wrc-steps">
          <span class="is-done" data-i18n="retreat_wadi_checkout_step_register">Registration</span>
          <span aria-hidden="true"> → </span>
          <span class="is-current" data-i18n="retreat_wadi_checkout_step_pay">Payment</span>
          <span aria-hidden="true"> → </span>
          <span data-i18n="retreat_wadi_checkout_step_done">Confirmed</span>
        </p>
        <h2 class="wrc-card__title" id="wrc-pay-title" data-i18n="retreat_wadi_checkout_pay_title">Secure payment</h2>

        <div id="wrc-customer-readonly" class="wrc-customer-readonly" hidden></div>
        <div id="wrc-customer-form">
          <div class="wrc-field">
            <label for="wrc-fullName" data-i18n="retreat_wadi_deposit_name">Full name</label>
            <input id="wrc-fullName" name="fullName" type="text" autocomplete="name" required>
          </div>
          <div class="wrc-field">
            <label for="wrc-phone" data-i18n="retreat_wadi_deposit_phone">Phone (WhatsApp)</label>
            <input id="wrc-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required>
          </div>
          <div class="wrc-field">
            <label for="wrc-email" data-i18n="retreat_wadi_deposit_email">Email (optional)</label>
            <input id="wrc-email" name="email" type="email" autocomplete="email">
          </div>
        </div>

        <button type="button" class="wrc-pay-btn" id="wrc-pay-btn" data-wadi-checkout-pay>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span data-i18n="retreat_wadi_checkout_pay_btn">Pay 400 ₪ securely</span>
        </button>
        <p class="wrc-trust">
          <span data-i18n="retreat_wadi_checkout_trust">Encrypted checkout</span>
          <span class="wrc-cards" aria-hidden="true">VISA · MC</span>
          <span data-i18n="retreat_wadi_checkout_trust2">Card details are handled by our payment partner</span>
        </p>
        <p class="wrc-status" id="wrc-pay-status" role="status" aria-live="polite" hidden></p>

        <div class="wrc-alt">
          <p data-i18n="retreat_wadi_checkout_alt">Prefer bank transfer or Bit?</p>
          <a href="${WA}" target="_blank" rel="noopener noreferrer" data-i18n="retreat_wadi_checkout_alt_link">Message us to pay another way</a>
        </div>
      </section>
    </div>
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
        { src: '/legacy/js/wadi-rum-deposit-pay.js' },
      ]}
      html={html}
    />
  );
}
