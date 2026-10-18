import LegacyPage from '@/components/LegacyPage';

export const metadata = {
  title: 'Wadi Rum Health Form | Desert Retreat',
  description: 'Wellbeing and health questions for the Wadi Rum desert retreat.',
};

const WA_NUMBER = '972522496366';

const err = (key) => `<p class="field-error" id="err-${key}" aria-live="polite"></p>`;

const choice = (kind, name, value, key, text, required) =>
  `<label class="${kind}-item"><span class="choice-text" data-t="${key}">${text}</span><input class="choice-control" type="${kind === 'radio' ? 'radio' : 'checkbox'}" name="${name}" value="${value}"${required ? ' required' : ''}></label>`;

const STEPS = [
  ['1', 'stepName1', 'About you'],
  ['2', 'stepName2', 'Your experience'],
];

const html = `
  <main class="wadi-reg wadi-health ny-inner">
    <div class="wadi-reg-top">
      <a class="back-link" href="/health-forms" data-t="backLink">Back to Wellbeing</a>
      <p class="wadi-reg-top__meta">
        <a href="/register/wadi-rum" data-t="registrationLink">Wadi Rum registration &amp; deposit</a>
        <span aria-hidden="true"> · </span>
        <a href="/retreats/wadi-rum" data-t="retreatLink">Retreat page</a>
      </p>
    </div>
    <section class="card">
      <h1 data-t="title">Wadi Rum Health Form</h1>
      <p class="lead" data-t="lead1">These questions help us care for you during the desert retreat. Complete this after you register and pay your deposit — use the same name and phone as on your booking.</p>

      <div class="reg-progress" id="regProgress" hidden>
        <p class="reg-progress__label" id="regStepLabel" aria-live="polite"></p>
        <ol class="reg-progress__bar">
          ${STEPS.map(([n, key, text]) => `<li data-step-dot="${n}"><span class="reg-progress__num" aria-hidden="true">${n}</span><span class="reg-progress__name" data-t="${key}">${text}</span></li>`).join('')}
        </ol>
      </div>

      <form id="wadiHealthForm" data-ny-thanks="off" novalidate>
        <p class="reg-required-note" data-t="requiredNote">Required fields are marked; other fields are optional unless noted.</p>

        <div class="reg-hp" aria-hidden="true">
          <label for="healthWebsite">Website</label>
          <input id="healthWebsite" name="website" type="text" tabindex="-1" autocomplete="off">
        </div>

        <fieldset class="form-section reg-step" data-step="1" aria-labelledby="healthStepTitle1">
          <h2 class="section-title" id="healthStepTitle1" tabindex="-1" data-t="secContact">Your details</h2>
          <div class="grid">
            <div class="field">
              <label for="fullName" data-t="fullName">Full name</label>
              <input id="fullName" name="الاسم الكامل" type="text" autocomplete="name" autocapitalize="words" required aria-describedby="err-fullName">
              ${err('fullName')}
            </div>
            <div class="field">
              <label for="phone" data-t="phone">Phone (WhatsApp)</label>
              <p class="field-hint" id="hint-phone" data-t="phoneHint">Same number as on your registration.</p>
              <input id="phone" name="رقم الهاتف" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" required aria-describedby="hint-phone err-phone">
              ${err('phone')}
            </div>
            <div class="field">
              <label for="age" data-t="age">Age</label>
              <input id="age" name="العمر" type="text" inputmode="numeric" data-min="16" required aria-describedby="err-age">
              ${err('age')}
            </div>
            <div class="field">
              <label for="city" data-t="city">City <span data-t="optional">(optional)</span></label>
              <input id="city" name="مكان السكن" type="text" autocomplete="address-level2" aria-describedby="err-city">
              ${err('city')}
            </div>
          </div>
        </fieldset>

        <fieldset class="form-section reg-step" data-step="2" aria-labelledby="healthStepTitle2">
          <h2 class="section-title" id="healthStepTitle2" tabindex="-1" data-t="secExperience">Intention &amp; wellbeing</h2>
          <p class="field-hint" data-t="secIntentSub">Write freely — there is no right or wrong answer.</p>
          <div class="grid">
            <div class="field">
              <label for="reason" data-t="reason">What drew you to this retreat?</label>
              <textarea id="reason" name="دافع الاهتمام بالريتريت" rows="4" required aria-describedby="err-reason"></textarea>
              ${err('reason')}
            </div>
            <div class="field">
              <label for="expectation" data-t="expectation">What do you hope to receive? <span data-t="optional">(optional)</span></label>
              <textarea id="expectation" name="التوقع من التجربة" rows="3"></textarea>
            </div>
          </div>

          <fieldset class="choice-group reg-gap-top" id="grp-yoga" aria-describedby="err-yoga">
            <legend data-t="yogaExp">Yoga or meditation experience</legend>
            <div class="radio-grid">
              ${choice('radio', 'خبرة يوغا/تأمل', 'no-first-time', 'y1', 'No, this is my first time', true)}
              ${choice('radio', 'خبرة يوغا/تأمل', 'yes-basic', 'y2', 'Yes, basic experience', true)}
              ${choice('radio', 'خبرة يوغا/تأمل', 'yes-regular', 'y3', 'Yes, I practice regularly', true)}
            </div>
            ${err('yoga')}
          </fieldset>

          <fieldset class="choice-group reg-gap-top" id="grp-health" aria-describedby="err-health">
            <legend data-t="healthQ">Do you have a physical condition we should know about?</legend>
            <div class="radio-grid">
              ${choice('radio', 'حالة صحية حالية', 'no', 'no', 'No', true)}
              ${choice('radio', 'حالة صحية حالية', 'yes', 'yes', 'Yes', true)}
            </div>
            ${err('health')}
          </fieldset>

          <div class="field reg-gap-top">
            <label for="healthDetails" data-t="healthDetails">Additional health details <span data-t="optional">(optional)</span></label>
            <textarea id="healthDetails" name="تفاصيل صحية إضافية" rows="3"></textarea>
          </div>

          <fieldset class="choice-group reg-gap-top" id="grp-activities" aria-describedby="hint-activities err-activities">
            <legend data-t="activitiesLabel">Which activities interest you most?</legend>
            <p class="field-hint" id="hint-activities" data-t="activitiesHint">You can choose more than one.</p>
            <div class="check-grid">
              ${choice('check', 'اهتمامات الأنشطة', 'yoga-breath', 'a1', 'Yoga & breathwork', false)}
              ${choice('check', 'اهتمامات الأنشطة', 'reflective-writing', 'a2', 'Reflective writing', false)}
              ${choice('check', 'اهتمامات الأنشطة', 'sound-healing', 'a3', 'Sound Healing', false)}
              ${choice('check', 'اهتمامات الأنشطة', 'desert-fire-rituals', 'a4', 'Desert & fire rituals', false)}
              ${choice('check', 'اهتمامات الأنشطة', 'meditative-walk', 'a5', 'Meditative walk', false)}
              ${choice('check', 'اهتمامات الأنشطة', 'sharing-circles', 'a6', 'Sharing circles', false)}
              ${choice('check', 'اهتمامات الأنشطة', 'star-nights', 'a7', 'Nights under stars', false)}
            </div>
            ${err('activities')}
          </fieldset>

          <div class="field reg-gap-top">
            <label for="freeNote" data-t="freeNote">Anything else you would like to share? <span data-t="optional">(optional)</span></label>
            <textarea id="freeNote" name="ملاحظات إضافية" rows="3"></textarea>
          </div>
        </fieldset>

        <div class="reg-fail" id="healthFail" role="alert" tabindex="-1" hidden>
          <p class="reg-fail__title" data-t="failTitle">The form did not send this time</p>
          <p data-t="failText">Your answers are still here. Try again, or message us on WhatsApp.</p>
          <div class="reg-fail__actions">
            <button type="submit" class="reg-btn reg-btn--ghost" data-t="failRetry">Try again</button>
            <a class="reg-btn reg-btn--wa" id="healthFailWa" href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener noreferrer" data-t="failWhatsapp">Message us on WhatsApp</a>
          </div>
        </div>

        <p class="reg-form-status" id="healthFormStatus" role="status" aria-live="polite"></p>

        <div class="actions reg-nav">
          <button type="button" class="reg-btn reg-btn--ghost" data-step-prev hidden data-t="prev">Back</button>
          <button type="button" class="reg-btn" data-step-next data-t="next">Next</button>
          <button type="submit" class="reg-btn" data-submit hidden data-t="submit">Submit health form</button>
        </div>
      </form>

      <div id="healthOkMsg" class="ok reg-success" role="status" tabindex="-1" hidden>
        <p class="reg-success__title" id="healthOkTitle" data-t="successTitle">Thank you — your health form was received</p>
        <p data-t="successText">We will contact you if we need any clarification before the retreat.</p>
        <p><a href="/retreats/wadi-rum" class="reg-btn reg-btn--ghost" data-t="successBack">Back to retreat page</a></p>
      </div>

      <div class="contact" id="healthContactBox">
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
      styles={['/css/wadi-rum-registration.css']}
      currentNav="health-forms"
      scripts={[{ src: '/legacy/js/i18n.js' }, { src: '/legacy/js/wadi-rum-health-form.js' }]}
      html={html}
    />
  );
}
