import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Registration | Wadi Rum Desert Retreat',
  description: 'Initial registration form for Wadi Rum desert retreat.',
};

const WA_NUMBER = '972522496366';

const err = (key) => `<p class="field-error" id="err-${key}" aria-live="polite"></p>`;

const choice = (kind, name, value, key, text, required) =>
  `<label class="${kind}-item"><span class="choice-text" data-t="${key}">${text}</span><input class="choice-control" type="${kind === 'radio' ? 'radio' : 'checkbox'}" name="${name}" value="${value}"${required ? ' required' : ''}></label>`;

const STEPS = [['1', 'stepName1', 'Booking']];

const html = `
  <main class="wadi-reg ny-inner">
    <div class="wadi-reg-top">
      <a class="back-link" href="/retreats/wadi-rum" data-t="backLink">Back to retreat</a>
      <p class="wadi-reg-top__meta">
        <a href="/register/wadi-rum-health" data-t="healthFormLink">Wadi Rum health form</a>
        <span aria-hidden="true"> · </span>
        <a href="/health-forms" data-t="wellbeingLink">Wellbeing hub</a>
      </p>
    </div>
    <section class="card">
      <h1 data-t="title">Registration | Wadi Rum Desert Retreat</h1>
      <p class="lead" data-t="lead1">Enter your details, choose your room, and pay the 400 ₪ deposit to secure your place. Limited to 20 participants.</p>
      <div class="reg-summary">
        <p class="reg-summary__row">
          <bdi dir="ltr">22–26.10.2026</bdi>
          <span class="reg-summary__sep" aria-hidden="true">·</span>
          <bdi data-t="noteDuration">5 days - 4 nights</bdi>
          <span class="reg-summary__sep" aria-hidden="true">·</span>
          <bdi>SHARAZAD CAMP</bdi>
        </p>
        <p class="reg-summary__row reg-summary__row--prices">
          <bdi data-t="pricePanorama">Panorama Room — 3,650 ₪</bdi>
          <span class="reg-summary__sep" aria-hidden="true">·</span>
          <bdi data-t="priceBubbles">Bubbles Room — 3,850 ₪</bdi>
        </p>
      </div>

      <div class="reg-progress" id="regProgress" hidden>
        <p class="reg-progress__label" id="regStepLabel" aria-live="polite"></p>
        <ol class="reg-progress__bar">
          ${STEPS.map(([n, key, text]) => `<li data-step-dot="${n}"><span class="reg-progress__num" aria-hidden="true">${n}</span><span class="reg-progress__name" data-t="${key}">${text}</span></li>`).join('')}
        </ol>
      </div>

      <form id="wadiRegForm" data-ny-thanks="off" novalidate>
        <p class="reg-required-note" data-t="requiredNote">All fields are required.</p>

        <div class="reg-hp" aria-hidden="true">
          <label for="regWebsite">Website</label>
          <input id="regWebsite" name="website" type="text" tabindex="-1" autocomplete="off">
        </div>

        <fieldset class="form-section reg-step" data-step="1" aria-labelledby="stepTitle1">
          <h2 class="section-title" id="stepTitle1" tabindex="-1" data-t="secBasic">Your booking</h2>
          <div class="grid">
            <div class="field">
              <label for="fullName" data-t="fullName">Full Name</label>
              <input id="fullName" name="الاسم الكامل" type="text" autocomplete="name" autocapitalize="words" enterkeyhint="next" required aria-describedby="err-fullName">
              ${err('fullName')}
            </div>
            <div class="field">
              <label for="phone" data-t="phone">Phone Number (WhatsApp)</label>
              <p class="field-hint" id="hint-phone" data-t="phoneHint">With country code, e.g. +972 or +970</p>
              <input id="phone" name="رقم الهاتف" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" enterkeyhint="next" required aria-describedby="hint-phone err-phone">
              ${err('phone')}
            </div>
            <div class="field">
              <label for="city" data-t="city">City / place of residence</label>
              <input id="city" name="مكان السكن" type="text" autocomplete="address-level2" enterkeyhint="next" required aria-describedby="err-city">
              ${err('city')}
            </div>
          </div>
          <fieldset class="choice-group reg-gap-top" id="grp-room" aria-describedby="hint-room err-room">
            <legend data-t="roomLegend">Choose your room</legend>
            <p class="field-hint" id="hint-room" data-t="roomHint">Per person, double room. The deposit is 400 ₪ for either room.</p>
            <div class="radio-grid">
              ${choice('radio', 'roomId', 'panorama', 'pricePanorama', 'Panorama Room — 3,650 ₪', true)}
              ${choice('radio', 'roomId', 'bubbles', 'priceBubbles', 'Bubbles Room — 3,850 ₪', true)}
            </div>
            ${err('room')}
          </fieldset>

          <p class="field-hint reg-gap-top"><span data-t="healthReminder">After booking, please complete the Wadi Rum health form in Wellbeing.</span> <a href="/register/wadi-rum-health" data-t="healthFormCta">Open health form</a></p>

          <div id="hypPayMethodsMount" class="hyp-pay-methods-mount"></div>

          <div class="reg-assure">
            <p><strong data-t="nextTitle">What happens next?</strong> <span data-t="nextText">After you pay the deposit, you'll be redirected to a confirmation page with your receipt. We'll call you shortly to welcome you to the retreat.</span></p>
            <p><a href="/retreats/wadi-rum#wr-faq-policy" data-t="policyLink">Payment &amp; cancellation terms</a></p>
            <p class="reg-assure__privacy" data-t="privacy">We only use your details to contact you about the retreat.</p>
          </div>

          <div class="reg-fail" id="regFail" role="alert" tabindex="-1" hidden>
            <p class="reg-fail__title" data-t="failTitle">The request didn't go through this time</p>
            <p data-t="failText">Your details are still here. Try again, or message us on WhatsApp and we'll continue from there.</p>
            <div class="reg-fail__actions">
              <button type="submit" class="reg-btn reg-btn--ghost" data-t="failRetry">Try again</button>
              <a class="reg-btn reg-btn--wa" id="regFailWa" href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener noreferrer" data-t="failWhatsapp">Message us on WhatsApp</a>
            </div>
          </div>
        </fieldset>

        <p class="reg-form-status" id="regFormStatus" role="status" aria-live="polite"></p>

        <div class="actions reg-nav">
          <button type="button" class="reg-btn reg-btn--ghost" data-step-prev hidden data-t="prev">Back</button>
          <button type="button" class="reg-btn" data-step-next hidden data-t="next">Next</button>
          <button type="submit" class="reg-btn" data-submit data-t="submitWithPay">Register &amp; pay 400 ₪ deposit securely</button>
        </div>
      </form>

      <div id="okMsg" class="ok reg-success" role="status" tabindex="-1" hidden aria-hidden="true"></div>

      <div class="contact" id="contactBox">
        <span data-t="contactLead">For questions:</span>
        <a href="tel:+${WA_NUMBER}" dir="ltr">052-249-6366</a>
      </div>
    </section>
  </main>
`;

export default function Page() {
  return (
    <LegacyPage
      lang="en"
      dir="ltr"
      bodyClassName=""
      styles={[
        '/css/wadi-rum-registration.css',
        '/legacy/css/hyp-pay-methods.css',
        '/legacy/css/register-modal-shell.css',
      ]}
      currentNav="retreats"
      scripts={[
        { src: '/legacy/js/i18n.js' },
        { src: '/legacy/js/hyp-pay-method-picker.js' },
        { src: '/legacy/js/wadi-rum-deposit-pay.js' },
        { src: '/legacy/js/wadi-rum-registration.js' },
      ]}
      html={html}
    />
  );
}
