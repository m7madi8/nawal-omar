import LegacyPage from '@/components/LegacyPage';

/**
 * Privacy & cookies policy.
 *
 * POLICY_VERSION must equal `policyVersion` in public/js/consent.js (checked by
 * scripts/test-consent.mjs). Bump both when the text or the optional categories change.
 */
const POLICY_VERSION = '2026-10-16';

export const metadata = {
  title: 'Privacy & cookies',
  description: 'How Nawal Yoga uses browser storage and handles the information you send us.',
  robots: { index: true, follow: true },
};

const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Bilingual element in the site's data-en / data-ar pattern. */
const t = (tag, en, ar, attrs = '') =>
  `<${tag}${attrs ? ` ${attrs}` : ''} data-en="${esc(en)}" data-ar="${esc(ar)}">${esc(en)}</${tag}>`;

const storageRows = [
  ['nawal-lang', 'Remembers the language you chose.', 'تحفظ اللغة التي اخترتِها.', 'Local storage', 'تخزين محلي', 'Until you clear it', 'حتى تمسحيها', 'Necessary', 'ضرورية'],
  ['ny-consent', 'Remembers your choice on this page.', 'تحفظ اختياركِ في هذه الصفحة.', 'Local storage', 'تخزين محلي', 'Up to 180 days, then we ask again', 'حتى 180 يومًا ثم نسأل من جديد', 'Necessary', 'ضرورية'],
  ['ny-transit', 'Smooth transition between pages.', 'انتقال سلس بين الصفحات.', 'Session storage', 'تخزين الجلسة', 'Until the tab is closed', 'حتى يُغلق التبويب', 'Necessary', 'ضرورية'],
  ['ice-bath-health-draft-v2, mountain-voice-retreat-draft', 'A copy of the health form you started, kept on your device only so you do not lose it before you send it.', 'نسخة من الاستمارة الصحية التي بدأتِها، تُحفظ على جهازكِ فقط كي لا تضيع قبل الإرسال.', 'Local storage', 'تخزين محلي', 'Until you submit the form (or clear it)', 'حتى ترسلي الاستمارة (أو تمسحيها)', 'Necessary', 'ضرورية'],
  ['nawal.wadiRum.depositCustomer', 'Carries your registration details from the Wadi Rum form to the payment step.', 'تنقل بيانات تسجيلكِ من استمارة وادي رم إلى خطوة الدفع.', 'Session storage', 'تخزين الجلسة', 'Until the tab is closed, or the confirmation page', 'حتى يُغلق التبويب أو تظهر صفحة التأكيد', 'Necessary', 'ضرورية'],
  ['nawal_bk_view', 'Lets you view your booking confirmation after payment.', 'تتيح لكِ عرض تأكيد الحجز بعد الدفع.', 'Cookie (HttpOnly, SameSite=Lax)', 'كوكي (HttpOnly, SameSite=Lax)', '2 hours', 'ساعتان', 'Necessary', 'ضرورية'],
  ['ny-campaigns', 'Remembers that an in-site announcement was shown or closed, so it is not repeated. It holds only counts and times, never personal, health or booking details, and is not sent anywhere. It is written only when an announcement is shown or closed.', 'تتذكّر أن إعلانًا داخل الموقع عُرض أو أُغلق كي لا يتكرر. تحتوي أعدادًا وأوقاتًا فقط، دون أي بيانات شخصية أو صحية أو حجز، ولا تُرسَل إلى أي جهة. لا تُكتب إلا عند عرض إعلان أو إغلاقه.', 'Local storage', 'تخزين محلي', 'Each entry is ignored after 90 days and removed the next time the site updates it', 'يُهمَل كل سجل بعد 90 يومًا ويُزال عند التحديث التالي', 'Necessary', 'ضرورية'],
  ['yogaFeedbackResponses', 'The feedback form keeps a copy of the feedback you submitted in your browser.', 'استمارة التقييم تحتفظ في متصفحكِ بنسخة من التقييم الذي أرسلتِه.', 'Local storage', 'تخزين محلي', 'Until you clear it', 'حتى تمسحيها', 'Necessary', 'ضرورية'],
  ['nawal-an-sid, nawal-an-views, nawal-an-forms', 'First-party analytics (see below). Only used if you allow analytics.', 'التحليلات الداخلية (انظري أدناه). تُستخدم فقط إذا سمحتِ بالتحليلات.', 'Session storage', 'تخزين الجلسة', 'Until the tab is closed, or you withdraw consent', 'حتى يُغلق التبويب أو تسحبين موافقتكِ', 'Analytics (optional)', 'تحليلات (اختيارية)'],
];

const tableRows = storageRows
  .map(
    ([name, purposeEn, purposeAr, typeEn, typeAr, durEn, durAr, catEn, catAr]) =>
      `<tr><td><code>${esc(name)}</code></td>${t('td', purposeEn, purposeAr)}${t('td', typeEn, typeAr)}${t('td', durEn, durAr)}${t('td', catEn, catAr)}</tr>`,
  )
  .join('\n');

const html = `
<main class="ny-inner legal-page">
  <section class="ny-page-hero">
    <div class="container">
      <a href="/" class="ny-page-hero__back" data-en="Back home" data-ar="العودة للرئيسية">Back home</a>
      ${t('span', 'Legal', 'قانوني', 'class="eyebrow ny-page-hero__eyebrow"')}
      ${t('h1', 'Privacy & cookies', 'الخصوصية والكوكيز', 'class="display-l ny-page-hero__title"')}
      <p class="legal-meta">
        ${t('span', 'Policy version', 'إصدار السياسة')}: <span dir="ltr" class="legal-meta__version">${POLICY_VERSION}</span>
      </p>
    </div>
  </section>

  <section class="ny-section">
    <div class="container legal-body">

      <h2>${t('span', 'Who we are', 'من نحن')}</h2>
      ${t(
        'p',
        'This is the website of Nawal Yoga (nawalyoga.com). To ask about your data you can message us on WhatsApp or Instagram using the links at the bottom of every page.',
        'هذا موقع نوال يوغا (nawalyoga.com). للاستفسار عن بياناتكِ يمكنكِ مراسلتنا عبر واتساب أو إنستغرام من الروابط أسفل كل صفحة.',
      )}

      <h2>${t('span', 'Information you send us', 'المعلومات التي ترسلينها لنا')}</h2>
      ${t(
        'p',
        'When you submit a registration, booking, private-session request, feedback or a health form, the details you type (for example name, phone number, email, city and your answers) are sent to our server and stored in our database so we can handle your request or booking. Health forms ask for health information, an ID number, an emergency contact and a signature.',
        'عند إرسال تسجيل أو حجز أو طلب جلسة خاصة أو تقييم أو استمارة صحية، تُرسَل البيانات التي تكتبينها (مثل الاسم ورقم الهاتف والبريد والمدينة وإجاباتكِ) إلى خادمنا وتُحفظ في قاعدة بياناتنا لنتمكن من معالجة طلبكِ أو حجزكِ. تطلب الاستمارات الصحية معلومات صحية ورقم هوية وجهة اتصال للطوارئ وتوقيعًا.',
      )}

      <h2>${t('span', 'Why we use your information', 'لماذا نستخدم معلوماتكِ')}</h2>
      ${t(
        'p',
        'We use the details you send so we can carry out the registration, booking, private session, feedback or health form you submitted. Health information is used only to hold that experience safely. Necessary storage runs the site: language, forms, and the booking and payment steps. Analytics is used only if you allow it.',
        'نستخدم البيانات التي ترسلينها لننفّذ التسجيل أو الحجز أو طلب الجلسة الخاصة أو التقييم أو الاستمارة الصحية التي أرسلتِها. تُستخدم المعلومات الصحية فقط لإقامة تلك التجربة بأمان. التخزين الضروري يشغّل الموقع: اللغة والاستمارات وخطوات الحجز والدفع. أما التحليلات فتُستخدم فقط إذا سمحتِ بها.',
      )}

      <h2>${t('span', 'Payments', 'الدفع')}</h2>
      ${t(
        'p',
        'Card payments for registrations are completed on the payment provider’s page (Hyp). We receive the result of the payment and a transaction reference. You can browse the site, see events and register without accepting analytics.',
        'تُكمَل مدفوعات البطاقات للتسجيل في صفحة مزوّد الدفع (Hyp). نستلم نتيجة الدفع ورقمًا مرجعيًا للعملية. يمكنكِ تصفّح الموقع ومشاهدة الفعاليات والتسجيل دون الموافقة على التحليلات.',
      )}

      <h2 id="cookies">${t('span', 'Cookies and browser storage', 'الكوكيز والتخزين في المتصفح')}</h2>
      ${t(
        'p',
        'The website stores a few items in your browser. “Necessary” items keep the site working and cannot be turned off. Analytics is optional and is off until you allow it.',
        'يحفظ الموقع بعض العناصر في متصفحكِ. العناصر «الضرورية» تُبقي الموقع يعمل ولا يمكن إيقافها. أما التحليلات فاختيارية وهي متوقفة حتى تسمحي بها.',
      )}
      <p><a href="/privacy#cookies" data-ny-cookie-settings class="legal-settings" data-en="Open cookie settings" data-ar="فتح إعدادات الكوكيز">Open cookie settings</a></p>
      <div class="legal-table-wrap">
        <table class="legal-table">
          <thead>
            <tr>
              ${t('th', 'Name', 'الاسم', 'scope="col"')}
              ${t('th', 'Purpose', 'الغرض', 'scope="col"')}
              ${t('th', 'Type', 'النوع', 'scope="col"')}
              ${t('th', 'Duration', 'المدة', 'scope="col"')}
              ${t('th', 'Category', 'الفئة', 'scope="col"')}
            </tr>
          </thead>
          <tbody>
${tableRows}
          </tbody>
        </table>
      </div>
      ${t(
        'p',
        'Staff who sign in to the admin area receive a separate sign-in cookie. It is not used for visitors.',
        'الموظفات اللواتي يسجّلن الدخول إلى لوحة الإدارة يحصلن على كوكي دخول منفصل. ولا يُستخدم للزائرات.',
      )}

      <h2>${t('span', 'Site analytics (optional)', 'تحليلات الموقع (اختيارية)')}</h2>
      ${t(
        'p',
        'If you allow analytics, our own server records simple events: which page was opened, the type of event (page view, form viewed, started, completed or left unfinished), the form name, a random session ID, the language, the address of the external page you came from, campaign tags in links (utm_source, utm_medium, utm_campaign) and the time. The analytics record itself contains no name, phone number, email or form answers. Nothing is sent to advertising or analytics companies. If you do not allow analytics, none of this is recorded; if you withdraw, recording stops and the analytics IDs are removed from your browser.',
        'إذا سمحتِ بالتحليلات، يسجّل خادمنا نفسه أحداثًا بسيطة: الصفحة التي فُتحت، ونوع الحدث (مشاهدة صفحة، أو فتح استمارة أو البدء بها أو إكمالها أو تركها دون إرسال)، واسم الاستمارة، ومعرّف جلسة عشوائيًا، واللغة، وعنوان الصفحة الخارجية التي جئتِ منها، ووسوم الحملات في الروابط (utm_source وutm_medium وutm_campaign) والوقت. لا يحتوي سجل التحليلات نفسه على اسم أو رقم هاتف أو بريد أو إجابات استمارات. لا يُرسَل شيء إلى شركات إعلانات أو تحليلات. إذا لم تسمحي بالتحليلات فلا يُسجَّل شيء من ذلك؛ وإذا سحبتِ موافقتكِ يتوقف التسجيل وتُزال معرّفات التحليلات من متصفحكِ.',
      )}

      <h2>${t('span', 'Other requests made by the site', 'طلبات أخرى يقوم بها الموقع')}</h2>
      ${t(
        'p',
        'Most fonts are served from our own server. One font (General Sans) is still loaded from Fontshare’s servers. Like any request to another server, this shares your IP address and browser details with them. It happens whenever a page loads, whatever you choose in the cookie settings. The admin area loads its fonts from Google Fonts. The site does not use advertising or social-media tracking pixels. Our hosting provider may keep ordinary server logs.',
        'تُقدَّم معظم الخطوط من خادمنا نفسه. ولا يزال خط واحد (General Sans) يُحمَّل من خوادم Fontshare. وكأي طلب إلى خادم آخر، يعني ذلك مشاركة عنوان IP وتفاصيل المتصفح معهم. يحدث هذا عند تحميل أي صفحة مهما اخترتِ في إعدادات الكوكيز. أما لوحة الإدارة فتحمّل خطوطها من Google Fonts. لا يستخدم الموقع بكسلات تتبّع إعلانية أو لوسائل التواصل. وقد تحتفظ شركة الاستضافة بسجلات خادم اعتيادية.',
      )}

      <h2>${t('span', 'Your choices', 'اختياراتكِ')}</h2>
      ${t(
        'p',
        'You can change your cookie choice at any time with “Cookie settings” at the bottom of every page. Closing the cookie banner or the settings window does not count as consent. You can also clear your browser’s site data.',
        'يمكنكِ تغيير اختياركِ في أي وقت من «إعدادات الكوكيز» أسفل كل صفحة. إغلاق شريط الكوكيز أو نافذة الإعدادات لا يُعدّ موافقة. ويمكنكِ أيضًا مسح بيانات الموقع من المتصفح.',
      )}

      <h2>${t('span', 'How long we keep it', 'مدة الاحتفاظ')}</h2>
      ${t(
        'p',
        'Items stored in your browser follow the durations in the table above. Registrations, bookings, health forms and feedback that you submit stay in our database for as long as we need them to run that session or retreat, complete payment, and answer a question about it. You can ask us to delete them.',
        'العناصر المحفوظة في متصفحكِ تتبع المدد في الجدول أعلاه. أما التسجيلات والحجوزات والاستمارات الصحية والتقييمات التي ترسلينها فتبقى في قاعدة بياناتنا طالما نحتاجها لإقامة تلك الجلسة أو الريتريت وإتمام الدفع والرد على سؤال بخصوصها. ويمكنكِ أن تطلبي حذفها.',
      )}

      <h2>${t('span', 'Your rights', 'حقوقكِ')}</h2>
      ${t(
        'p',
        'You can ask to see the information we hold about you, to correct it, or to delete it. Message us using the links below and include the phone number or email you used, so we can find the right record. Changing cookie settings stops optional analytics. It does not delete a form you already sent.',
        'يمكنكِ طلب الاطلاع على المعلومات التي نحتفظ بها عنكِ، أو تصحيحها، أو حذفها. راسلينا عبر الروابط أدناه واذكري رقم الهاتف أو البريد الذي استخدمته كي نجد السجل الصحيح. تغيير إعدادات الكوكيز يوقف التحليلات الاختيارية، ولا يحذف استمارة أرسلتِها مسبقًا.',
      )}

      <h2>${t('span', 'Services outside this website', 'خدمات خارج هذا الموقع')}</h2>
      ${t(
        'p',
        'Card payment is completed on Hyp’s page, and one font is loaded from Fontshare, as described above. Those steps exist so payment and the page can work. We do not sell your information, and we do not send it to advertising companies.',
        'يُكمَل الدفع بالبطاقة في صفحة Hyp، ويُحمَّل خط واحد من Fontshare، كما هو موضّح أعلاه. توجد هذه الخطوات كي يعمل الدفع والصفحة. لا نبيع معلوماتكِ، ولا نرسلها إلى شركات إعلانات.',
      )}

      <h2>${t('span', 'Children', 'الأطفال')}</h2>
      ${t(
        'p',
        'Our workshops, events and retreats are arranged for adults. We do not knowingly collect personal information from children. If you believe a child has sent us information, contact us and we will delete it.',
        'ورشاتنا وفعالياتنا وريتريتاتنا مُعدّة للبالغات. لا نجمع عن علم معلومات شخصية من الأطفال. إذا كنتِ تعتقدين أن طفلة أرسلت لنا معلومات، تواصلي معنا وسنحذفها.',
      )}

      <h2>${t('span', 'Contact', 'التواصل')}</h2>
      ${t(
        'p',
        'For a question about your information, or to ask to see it, correct it or delete it, message us on WhatsApp or Instagram.',
        'لأي سؤال عن معلوماتكِ، أو لطلب الاطلاع عليها أو تصحيحها أو حذفها، راسلينا عبر واتساب أو إنستغرام.',
      )}
      <p class="legal-contact">
        <a href="https://wa.me/972522496366" target="_blank" rel="noopener noreferrer" data-en="WhatsApp" data-ar="واتساب">WhatsApp</a>
        <span aria-hidden="true"> · </span>
        <a href="https://instagram.com/nawal_aom" target="_blank" rel="noopener noreferrer" data-en="Instagram" data-ar="إنستغرام">Instagram</a>
      </p>
    </div>
  </section>
</main>
`;

export default function Page() {
  return (
    <LegacyPage
      lang="en"
      dir="rtl"
      bodyClassName=""
      styles={['/css/legal.css']}
      scripts={[]}
      inlineScripts={[]}
      html={html}
      currentNav=""
    />
  );
}
