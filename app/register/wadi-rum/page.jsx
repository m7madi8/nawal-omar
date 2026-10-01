import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  "title": "Initial Registration | Wadi Rum Desert Retreat",
  "description": "Initial registration form for Wadi Rum desert retreat."
};

const WA_NUMBER = '972522496366';

const err = (key) => `<p class="field-error" id="err-${key}" data-err-for="${key}" hidden></p>`;
const optional = '<span class="field-optional" data-t="optional">(optional)</span>';

const choice = (kind, name, value, key, text, required) =>
  `<label class="${kind}-item"><span class="choice-text" data-t="${key}">${text}</span><input class="choice-control" type="${kind === 'radio' ? 'radio' : 'checkbox'}" name="${name}" value="${value}"${required ? ' required' : ''}></label>`;

const ACTIVITIES = [
  ['yoga-breath', 'a1', 'Yoga &amp; breathwork'],
  ['reflective-writing', 'a2', 'Reflective writing'],
  ['sound-healing', 'a3', 'Sound Healing'],
  ['desert-fire-rituals', 'a4', 'Desert &amp; fire rituals'],
  ['meditative-walk', 'a5', 'Meditative walk'],
  ['sharing-circles', 'a6', 'Sharing circles'],
  ['star-nights', 'a7', 'Nights under stars'],
];

const STEPS = [
  ['1', 'stepName1', 'Contact'],
  ['2', 'stepName2', 'About you'],
  ['3', 'stepName3', 'Your experience'],
];

const html = `
  <main class="wadi-reg ny-inner">
    <div class="wadi-reg-top">
      <a class="back-link" href="/retreats/wadi-rum" data-t="backLink">Back to retreat</a>
    </div>
    <section class="card">
      <span class="hero-badge" data-t="badge">🌙 Wadi Rum Retreat</span>
      <h1 data-t="title">Initial Registration | Wadi Rum Desert Retreat</h1>
      <p class="lead" data-t="lead1">This form is for initial registration. Seats are limited (up to 20 participants), and we will contact you after submission to confirm details.</p>
      <p class="lead" data-t="lead2">Wadi Rum retreat is a return path: to your body, your breath, and your inner calm. Full details are in the retreat page.</p>
      <div class="small-note">
        <bdi data-t="note">Wadi Rum Retreat – SHARAZAD CAMP</bdi>
        <span class="small-note__sep" aria-hidden="true">·</span>
        <bdi dir="ltr">22–26.10.2026</bdi>
        <span class="small-note__sep" aria-hidden="true">·</span>
        <bdi data-t="noteDuration">5 days - 4 nights</bdi>
      </div>
      <ul class="reg-prices" aria-label="Prices" data-t-attr="aria-label:pricesAria">
        <li data-t="pricePanorama">Panorama Room — 3,650 ₪</li>
        <li data-t="priceBubbles">Bubbles Room — 3,850 ₪</li>
      </ul>

      <div class="reg-progress" id="regProgress" hidden>
        <p class="reg-progress__label" id="regStepLabel" aria-live="polite"></p>
        <ol class="reg-progress__bar">
          ${STEPS.map(([n, key, text]) => `<li data-step-dot="${n}"><span class="reg-progress__num" aria-hidden="true">${n}</span><span class="reg-progress__name" data-t="${key}">${text}</span></li>`).join('')}
        </ol>
      </div>

      <form id="wadiRegForm" data-supabase-url="https://xzxyskufrqansbhsbdkt.supabase.co" data-supabase-anon-key="sb_publishable_V9_4QWGDFv6Vm-4DQifYGA_1xdoKkph" data-supabase-table="retreat_requests" data-ny-thanks="off" novalidate>
        <p class="reg-required-note" data-t="requiredNote">All fields are required unless marked optional.</p>

        <div class="reg-hp" aria-hidden="true">
          <label for="regWebsite">Website</label>
          <input id="regWebsite" name="website" type="text" tabindex="-1" autocomplete="off">
        </div>

        <fieldset class="form-section reg-step" data-step="1" aria-labelledby="stepTitle1">
          <h2 class="section-title" id="stepTitle1" tabindex="-1" data-t="secBasic">Basic Information</h2>
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
          </div>
        </fieldset>

        <fieldset class="form-section reg-step" data-step="2" aria-labelledby="stepTitle2">
          <h2 class="section-title" id="stepTitle2" tabindex="-1" data-t="secAbout">A little about you</h2>
          <div class="grid two">
            <div class="field">
              <label for="age" data-t="age">Age</label>
              <input id="age" name="العمر" type="text" inputmode="numeric" autocomplete="off" dir="ltr" data-min="16" maxlength="3" enterkeyhint="next" required aria-describedby="err-age">
              ${err('age')}
            </div>
            <div class="field">
              <label for="city"><span data-t="city">City</span> ${optional}</label>
              <input id="city" name="مكان السكن" type="text" autocomplete="address-level2" enterkeyhint="next">
            </div>
          </div>
          <h3 class="section-subtitle" data-t="secIntent">Your Intention</h3>
          <p class="section-sub" data-t="secIntentSub">Write freely. There is no right or wrong answer.</p>
          <div class="grid">
            <div class="field">
              <label for="reason"><span data-t="reason">What made you interested in this retreat?</span> ${optional}</label>
              <textarea id="reason" name="دافع الاهتمام بالريتريت"></textarea>
            </div>
            <div class="field">
              <label for="expectation"><span data-t="expectation">What do you hope to receive from this experience?</span> ${optional}</label>
              <textarea id="expectation" name="التوقع من التجربة"></textarea>
            </div>
          </div>
        </fieldset>

        <fieldset class="form-section reg-step" data-step="3" aria-labelledby="stepTitle3">
          <h2 class="section-title" id="stepTitle3" tabindex="-1" data-t="secHealth">Physical &amp; Mental Background</h2>
          <div class="grid">
            <fieldset class="choice-group" id="grp-yoga" aria-describedby="err-yoga">
              <legend data-t="yogaExp">Do you have previous experience with yoga or meditation?</legend>
              <div class="radio-grid">
                ${choice('radio', 'خبرة يوغا/تأمل', 'no-first-time', 'y1', 'No, this is my first time', true)}
                ${choice('radio', 'خبرة يوغا/تأمل', 'yes-basic', 'y2', 'Yes, basic experience', true)}
                ${choice('radio', 'خبرة يوغا/تأمل', 'yes-regular', 'y3', 'Yes, I practice regularly', true)}
              </div>
              ${err('yoga')}
            </fieldset>
            <fieldset class="choice-group" id="grp-health" aria-describedby="err-health">
              <legend data-t="healthQ">Do you currently have a physical condition we should know about?</legend>
              <div class="radio-grid radio-grid--inline">
                ${choice('radio', 'حالة صحية حالية', 'no', 'no', 'No', true)}
                ${choice('radio', 'حالة صحية حالية', 'yes', 'yes', 'Yes', true)}
              </div>
              ${err('health')}
            </fieldset>
            <div class="field">
              <label for="healthDetails"><span data-t="healthDetails">Additional details</span> ${optional}</label>
              <textarea id="healthDetails" name="تفاصيل صحية إضافية"></textarea>
            </div>
          </div>

          <h3 class="section-subtitle" data-t="secActivities">Activities &amp; Experience</h3>
          <fieldset class="choice-group" id="grp-activities" aria-describedby="hint-activities err-activities">
            <legend data-t="activitiesLabel">Which activities interest you most?</legend>
            <p class="field-hint" id="hint-activities" data-t="activitiesHint">You can choose more than one.</p>
            <div class="check-grid">
              ${ACTIVITIES.map(([value, key, text]) => choice('check', 'اهتمامات الأنشطة', value, key, text, false)).join('')}
            </div>
            ${err('activities')}
          </fieldset>

          <div class="grid reg-gap-top">
            <div class="field">
              <label for="freeNote"><span data-t="freeNote">Anything else you would like to share?</span> ${optional}</label>
              <textarea id="freeNote" name="ملاحظات إضافية"></textarea>
            </div>
          </div>

          <div class="reg-assure">
            <p><strong data-t="nextTitle">What happens next?</strong> <span data-t="nextText">We'll have a short getting-to-know-you call, then you secure your place with a first deposit of 400 ₪ (bank transfer or Bit).</span></p>
            <p><span data-t="riskText">Sending a request is free and non-binding.</span> <a href="/retreats/wadi-rum#wr-faq-policy" data-t="policyLink">Payment &amp; cancellation terms</a></p>
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
          <button type="button" class="reg-btn" data-step-next data-t="next">Next</button>
          <button type="submit" class="reg-btn" data-submit data-t="submit">Send my request — free, no commitment</button>
        </div>
      </form>

      <div id="okMsg" class="ok reg-success" role="status" tabindex="-1" hidden>
        <p class="reg-success__title" id="okTitle" data-t="successTitle">Your request arrived, thank you</p>
        <p data-t="successText">We'll get in touch soon for a short getting-to-know-you call. After that, you secure your place with a first deposit of 400 ₪.</p>
        <div class="reg-success__actions">
          <a class="reg-btn reg-btn--ghost" href="/retreats/wadi-rum" data-t="successBack">Back to the retreat page</a>
          <a class="reg-btn reg-btn--wa" id="regOkWa" href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener noreferrer" data-t="successWhatsapp">Questions? Message us on WhatsApp</a>
        </div>
      </div>

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
      styles={["/css/wadi-rum-registration.css"]}
      currentNav="retreats"
      scripts={[{ src: '/legacy/js/wadi-rum-registration.js' }]}
      html={html}
    />
  );
}
