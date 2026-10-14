import { getPublicSupabaseBrowserConfig } from './publicSupabaseConfig.js';

export const FEEDBACK_STYLES = ['/css/feedback.css'];

export const FEEDBACK_SCRIPT = { src: '/js/feedback-form.js', attrs: '  ' };

/** Server-only: inject on feedback pages (anon config from env; null if unset). */
export function buildFeedbackSupabaseInline() {
  const cfg = getPublicSupabaseBrowserConfig();
  return `window.FEEDBACK_SUPABASE = ${JSON.stringify(
    cfg ? { url: cfg.url, key: cfg.key, table: cfg.table } : null,
  )};`;
}

export const FEEDBACK_HUB_ITEMS = [
  {
    slug: 'dahab',
    badge: 'Retreat',
    badgeAr: 'ريتريت',
    name: 'ريتريت دهب',
    desc: 'تقييم تجربة ريتريت دهب — الإقامة، اليوغا، الأجواء، الطعام والمشاعر.',
  },
  {
    slug: 'wadi-rum',
    badge: 'Retreat',
    badgeAr: 'ريتريت',
    name: 'ريتريت وادي رم',
    desc: 'تقييم تجربة ريتريت وادي رم الصحراوي — السكون، المخيم، اليوغا والنجوم.',
  },
  {
    slug: 'zanzibar',
    badge: 'Retreat',
    badgeAr: 'ريتريت',
    name: 'ريتريت زنجبار',
    desc: 'تقييم تجربة ريتريت زنجبار — المحيط، المنتجع، التأمل والغروب.',
  },
  {
    slug: 'sound-healing',
    badge: 'Event',
    badgeAr: 'فعالية',
    name: 'جلسة Sound Healing',
    desc: 'تقييم جلسة الصوت العلاجي والأوعية الكريستالية والاسترخاء.',
  },
  {
    slug: 'nature-chocolate',
    badge: 'Event',
    badgeAr: 'فعالية',
    name: 'يوم الطبيعة والشوكولاتة',
    desc: 'تقييم يوم الطبيعة، اليوغا، ورشة الشوكولاتة والوجبات.',
  },
  {
    slug: 'ice-bath',
    badge: 'Event',
    badgeAr: 'فعالية',
    name: 'تجربة حمام الثلج',
    desc: 'تقييم تجربة حمام الثلج والتنفس والبريكثرو.',
  },
];

export const FEEDBACK_PAGES = {
  dahab: {
    slug: 'dahab',
    title: 'تقييم ريتريت دهب | Nawal Yoga',
    badge: 'تقييم ريتريت دهب',
    kicker: 'Dahab Retreat Feedback',
    heading: 'كيف كانت تجربتك في ريتريت دهب؟ ✨',
    description:
      'يسعدنا مشاركتك انطباعك الصادق. إجاباتك تساعدنا على الاستمرار في تطوير تجاربنا ورعايتها بحب 🤍',
    sourceKey: 'feedback-dahab',
    retreatTitle: 'Dahab Retreat Feedback',
    defaultName: 'مشاركة ريتريت دهب',
    step2Title: 'المشاعر والأثر الداخلي',
    step2Text: 'ما المشاعر التي خرجتِ بها من هذه الرحلة؟ (يمكنكِ اختيار أكثر من خيار)',
    step3Title: 'تفاصيل عناصر الريتريت',
    step3Text: 'قيّمي الجوانب المختلفة للرحلة لتساعدنا على التطور:',
    feelings: [
      '🕊️ هدوء وسكون داخلي',
      '⚡ تجديد وحيوية',
      '🌊 اتصال مع الطبيعة والمحيط',
      '✨ طاقة إيجابية',
      '🧘‍♀️ تفكر ووعي أعمق',
      '🌿 راحة جسدية',
      '❤️ دعم ومحبة المجموعة',
    ],
    ratings: [
      { key: 'venue', label: 'المكان والإقامة في دهب' },
      { key: 'yoga', label: 'حصص اليوغا والتأمل' },
      { key: 'org', label: 'التنظيم والتسهيل والتنقلات' },
      { key: 'food', label: 'الطعام والوجبات والضيافة' },
    ],
    ratingLabels: {
      venue: 'الإقامة',
      yoga: 'اليوغا',
      org: 'التنظيم',
      food: 'الطعام',
    },
    step4Title: 'ذكريات وملاحظات ختامية',
    step4Text: 'شاركينا أفكاركِ الجميلة واقتراحاتكِ بكل حريّة 💭',
    momentLabel: 'ما هي أجمل لحظة أو لحظات تركت أثراً في قلبكِ في دهب؟',
    momentPlaceholder: 'لحظة الغروب، جلسة البحر، الضحك، التأمل...',
    againLabel: 'هل ترغبين بالانضمام إلينا في ريتريتات وفعاليات قادمة؟',
    againOptions: ['نعم بكل تأكيد! 😍', 'حسب التوقيت والوجهة ✈️', 'ربما في المستقبل'],
    notesLabel: 'رسالة أو كلمة ختامية لنوال والمجموعة ❤️',
    notesPlaceholder: 'كلمة من القلب، اقتراح لتطوير، أو ملاحظة...',
    successIcon: '🤍',
    successTitle: 'شكراً لكِ من القلب!',
    successDesc:
      'تم استلام تقييمكِ بنجاح. وجودكِ معنا في ريتريت دهب أضاف روحاً جميلة، وكلماتكِ تمنحنا طاقة للاستمرار دائماً. ✨',
  },
  'wadi-rum': {
    slug: 'wadi-rum',
    title: 'تقييم ريتريت وادي رم | Nawal Yoga',
    badge: 'تقييم ريتريت وادي رم',
    kicker: 'Wadi Rum Desert Retreat Feedback',
    heading: 'كيف كانت تجربتك في ريتريت وادي رم؟ 🏜️✨',
    description:
      'يسعدنا مشاركتك انطباعك الصادق عن رحلة الصحراء. إجاباتك تساعدنا على صناعة تجارب أعمق وأجمل 🤍',
    sourceKey: 'feedback-wadi-rum',
    retreatTitle: 'Wadi Rum Retreat Feedback',
    defaultName: 'مشاركة ريتريت وادي رم',
    step2Title: 'المشاعر والأثر الداخلي',
    step2Text: 'ما المشاعر التي خرجتِ بها من هذه الرحلة؟',
    step3Title: 'تفاصيل عناصر الريتريت',
    step3Text: 'قيّمي جوانب الرحلة الصحراوية:',
    feelings: [
      '🏜️ سكون صحراوي عميق',
      '⭐ اتصال بالنجوم والسماء',
      '🔥 دفء المخيم والنار',
      '🧘‍♀️ يوغا وتنفس في الطبيعة',
      '❤️ صحبة ومحبة المجموعة',
      '✨ تجديد وطاقة جديدة',
    ],
    ratings: [
      { key: 'venue', label: 'المخيم والضيافة الصحراوية' },
      { key: 'yoga', label: 'حصص اليوغا والتنفس في الصحراء' },
      { key: 'org', label: 'التنظيم والتنقل والجولات' },
      { key: 'food', label: 'الوجبات والأكل التقليدي' },
    ],
    ratingLabels: {
      venue: 'المخيم',
      yoga: 'اليوغا',
      org: 'التنظيم',
      food: 'الطعام',
    },
    step4Title: 'ذكريات وملاحظات',
    step4Text: 'شاركينا أفكاركِ الخاصة 💫',
    momentLabel: 'ما أجمل تجربة أو لحظة عشتِها في وادي رم؟',
    momentPlaceholder: 'جلسة النجوم، تأمل الشروق، النار، اليوغا على الرمال...',
    againLabel: 'هل تحبين مشاركتنا في ريتريت صحراوي أو دولي قادم؟',
    againOptions: ['نعم بالتأكيد! 😍', 'حسب الموعد والبرنامج 🗓️', 'ربما لاحقاً'],
    notesLabel: 'كلمة من القلب أو اقتراح لنوال 🤍',
    notesPlaceholder: 'اكتبي ما في خاطركِ هنا...',
    successIcon: '🏜️',
    successTitle: 'شكراً لكِ من القلب!',
    successDesc: 'تم استلام تقييمكِ بنجاح. حضوركِ وشغفكِ جعل من رحلة وادي رم تجربة لا تُنسى 💫',
  },
  zanzibar: {
    slug: 'zanzibar',
    title: 'تقييم ريتريت زنجبار | Nawal Yoga',
    badge: 'تقييم ريتريت زنجبار',
    kicker: 'Zanzibar Island Retreat Feedback',
    heading: 'كيف كانت تجربتك في ريتريت زنجبار؟ 🌊🌴',
    description:
      'يسعدنا مشاركتك انطباعك عن رحلة الجزيرة. كلماتكِ تساعدنا على الاستمرار في صناعة تجارب استثنائية 🤍',
    sourceKey: 'feedback-zanzibar',
    retreatTitle: 'Zanzibar Retreat Feedback',
    defaultName: 'مشاركة ريتريت زنجبار',
    step2Title: 'المشاعر والأثر الداخلي',
    step2Text: 'ما المشاعر التي خرجتِ بها من هذه الرحلة؟',
    step3Title: 'تفاصيل عناصر الريتريت',
    step3Text: 'قيّمي جوانب تجربة زنجبار:',
    feelings: [
      '🌊 اتصال بالمحيط والماء',
      '🌴 استرخاء استوائي',
      '🧘‍♀️ يوغا وتأمل',
      '✨ طاقة إيجابية',
      '❤️ صحبة المجموعة',
      '🌅 لحظات غروب لا تُنسى',
    ],
    ratings: [
      { key: 'venue', label: 'المنتجع والإقامة' },
      { key: 'yoga', label: 'حصص اليوغا والتأمل' },
      { key: 'org', label: 'التنظيم والبرنامج' },
      { key: 'food', label: 'الطعام والضيافة' },
    ],
    ratingLabels: {
      venue: 'الإقامة',
      yoga: 'اليوغا',
      org: 'التنظيم',
      food: 'الطعام',
    },
    step4Title: 'ذكريات وملاحظات ختامية',
    step4Text: 'شاركينا أفكاركِ بكل حريّة 💭',
    momentLabel: 'ما أجمل لحظة عشتِها في زنجبار؟',
    momentPlaceholder: 'الغروب، البحر، التأمل، الضحك...',
    againLabel: 'هل ترغبين بالانضمام لريتريتات قادمة؟',
    againOptions: ['نعم بكل تأكيد! 😍', 'حسب التوقيت ✈️', 'ربما في المستقبل'],
    notesLabel: 'كلمة ختامية لنوال 🤍',
    notesPlaceholder: 'اكتبي ما في خاطركِ...',
    successIcon: '🌊',
    successTitle: 'شكراً لكِ من القلب!',
    successDesc: 'تم استلام تقييمكِ بنجاح. حضوركِ أضاف جمالاً لرحلة زنجبار 🤍',
  },
  'sound-healing': {
    slug: 'sound-healing',
    title: 'تقييم Sound Healing | Nawal Yoga',
    badge: 'تقييم Sound Healing',
    kicker: 'Sound Healing Session Feedback',
    heading: 'كيف كانت تجربتك في جلسة Sound Healing؟ 🔔✨',
    description:
      'يسعدنا مشاركتك انطباعك عن الجلسة. إجاباتك تساعدنا على تحسين تجربة الصوت والاسترخاء 🤍',
    sourceKey: 'feedback-sound-healing',
    retreatTitle: 'Sound Healing Session Feedback',
    defaultName: 'مشاركة Sound Healing',
    step2Title: 'شعور الجسد والعقل',
    step2Text: 'ما المشاعر أو التأثيرات التي لاحظتِها أثناء وبعد الجلسة؟',
    step3Title: 'تفاصيل تجربة الصوت',
    step3Text: 'قيّمي العناصر التالية في الجلسة:',
    feelings: [
      '🕊️ استرخاء عصبي واستكانة',
      '🌙 شعور بالنوم العميق والوعي',
      '🍃 تفرّغ وتفريغ للشحنات',
      '✨ صفاء ووضوح ذهني',
      '🌸 خفة وتوازن في الجسد',
      '❤️ شعور بالأمان والاحتواء',
    ],
    ratings: [
      { key: 'sound', label: 'جودة الآلات والترددات الصوتية' },
      { key: 'venue', label: 'المكان والأجواء العامة' },
      { key: 'guidance', label: 'الإرشاد والتهيؤ قبل وبعد الجلسة' },
      { key: 'hospitality', label: 'الضيافة والتقديمات الخفيفة' },
    ],
    ratingLabels: {
      sound: 'الصوت',
      venue: 'المكان',
      guidance: 'الإرشاد',
      hospitality: 'الضيافة',
    },
    step4Title: 'ذكريات وملاحظات ختامية',
    step4Text: 'شاركِينا رغبتك واقتراحاتك القادمة ✨',
    momentLabel: 'ما الذي أعجبكِ أكثر خلال هذه الجلسة؟',
    momentPlaceholder: 'صوت الأوعية، السكون، الهدوء، الاسترخاء...',
    againLabel: 'هل ترغبين بالانضمام لجلسات Sound Healing قادمة؟',
    againOptions: ['نعم بكل تأكيد! 🔔', 'حسب الموعد والمكان 📍', 'ربما في المستقبل'],
    notesLabel: 'ملاحظات أو كلمة لنوال 🤍',
    notesPlaceholder: 'اكتبي أي انطباع أو اقتراح تودين مشاركته...',
    successIcon: '🔔',
    successTitle: 'شكراً لكِ من القلب!',
    successDesc: 'تم استلام تقييمكِ بنجاح. حضوركِ وطاقتكِ الهادئة أضافت أثراً جميلاً للجلسة 🤍',
  },
  'nature-chocolate': {
    slug: 'nature-chocolate',
    title: 'تقييم يوم الطبيعة والشوكولاتة | Nawal Yoga',
    badge: 'تقييم يوم الطبيعة',
    kicker: 'Nature & Chocolate Day Feedback',
    heading: 'كيف كانت تجربتك في يوم الطبيعة والشوكولاتة؟ 🍫🌿',
    description:
      'يسعدنا مشاركتك انطباعك عن اليوم. إجاباتك تساعدنا على تحسين التجربة والبرنامج 🤍',
    sourceKey: 'feedback-nature-chocolate',
    retreatTitle: 'Nature & Chocolate Day Feedback',
    defaultName: 'مشاركة يوم الطبيعة',
    step2Title: 'الأثر والمشاعر',
    step2Text: 'ما أهم المشاعر والانطباعات التي خرجتِ بها من هذا اليوم؟',
    step3Title: 'تقييم الفقرات',
    step3Text: 'قيّمي جودة الفقرات المختلفة في اليوم:',
    feelings: [
      '🍫 بهجة وفرح دافئ',
      '🌿 هدوء وانتعاش في الطبيعة',
      '🧘‍♀️ مرونة وحركة لطيفة',
      '🍃 تغيير جو وتفريغ للضغط',
      '✨ صحبة وطاقة إيجابية',
      '☕ استمتاع بتجربة الشوكولاتة',
    ],
    ratings: [
      { key: 'yoga', label: 'حصة اليوغا في أحضان الطبيعة' },
      { key: 'chocolate', label: 'ورشة الشوكولاتة والتذوق' },
      { key: 'venue', label: 'المكان والأجواء الطبيعية' },
      { key: 'food', label: 'الوجبات والضيافة' },
    ],
    ratingLabels: {
      yoga: 'اليوغا',
      chocolate: 'الشوكولاتة',
      venue: 'المكان',
      food: 'الطعام',
    },
    step4Title: 'ذكريات وملاحظات',
    step4Text: 'شاركينا انطباعك الأخير 💫',
    momentLabel: 'ما أجمل لحظة في هذا اليوم؟',
    momentPlaceholder: 'اليوغا، الطبيعة، الشوكولاتة، الضحك...',
    againLabel: 'هل ترغبين بحضور أيام مشابهة قادمة؟',
    againOptions: ['نعم بكل تأكيد! 🍫', 'حسب الموعد 🗓️', 'ربما لاحقاً'],
    notesLabel: 'كلمة لنوال 🤍',
    notesPlaceholder: 'اكتبي ما في خاطركِ...',
    successIcon: '🍫',
    successTitle: 'شكراً لكِ من القلب!',
    successDesc: 'تم استلام تقييمكِ بنجاح. حضوركِ أضاف دفئاً جميلاً لليوم 🤍',
  },
  'ice-bath': {
    slug: 'ice-bath',
    title: 'تقييم حمام الثلج | Nawal Yoga',
    badge: 'تقييم حمام الثلج',
    kicker: 'Ice Bath Experience Feedback',
    heading: 'كيف كانت تجربتك في يوم حمام الثلج؟ ❄️✨',
    description:
      'يسعدنا مشاركتك انطباعك عن التجربة. إجاباتك تساعدنا على تحسين البرنامج والإرشاد 🤍',
    sourceKey: 'feedback-ice',
    retreatTitle: 'Ice Bath Experience Feedback',
    defaultName: 'مشاركة حمام الثلج',
    step2Title: 'الشعور والأثر',
    step2Text: 'ما المشاعر أو التأثيرات التي لاحظتِها أثناء وبعد اليوم؟',
    step3Title: 'تفاصيل التجربة',
    step3Text: 'قيّمي العناصر التالية:',
    feelings: [
      '❄️ انتعاش ووضوح بعد الثلج',
      '🌬️ شعور بالتنفس والهدوء',
      '🧘‍♀️ توازن بين الحركة والراحة',
      '🍃 تفرّغ وخفة في الجسد',
      '✨ صفاء ذهني',
      '❤️ شعور بالأمان والاحتواء',
    ],
    ratings: [
      { key: 'guidance', label: 'الإرشاد والتهيؤ قبل وبعد الثلج' },
      { key: 'vibes', label: 'الأجواء العامة لليوم' },
      { key: 'venue', label: 'المكان والتنظيم' },
    ],
    ratingLabels: {
      guidance: 'الإرشاد',
      vibes: 'الأجواء',
      venue: 'المكان',
    },
    step4Title: 'ذكريات وملاحظات',
    step4Text: 'شاركينا انطباعك الأخير 💫',
    momentLabel: 'ما أثر تجربة الثلج والبريكثرو عليكِ؟',
    momentPlaceholder: 'الثلج، التنفس، الهدوء، اللحظات المميزة...',
    againLabel: 'هل ترغبين بحضور تجارب مشابهة قادمة؟',
    againOptions: ['نعم بكل تأكيد! ❄️', 'حسب الموعد 🗓️', 'ربما لاحقاً'],
    notesLabel: 'كلمة لنوال 🤍',
    notesPlaceholder: 'اكتبي ما في خاطركِ...',
    successIcon: '❄️',
    successTitle: 'شكراً لكِ من القلب!',
    successDesc: 'تم استلام تقييمكِ بنجاح. حضوركِ أضاف جمالاً للتجربة 🤍',
  },
};

export function getFeedbackPage(slug) {
  return FEEDBACK_PAGES[slug] || null;
}

export function renderFeedbackConfigScript(config) {
  if (!config || config.type === 'legacy') return '';
  return `window.FEEDBACK_PAGE_CONFIG = ${JSON.stringify(config)};`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderStandardFeedbackForm(config) {
  const feelings = config.feelings
    .map(
      (item) =>
        `<label class="fb-chip"><input type="checkbox" value="${escapeHtml(item)}"> ${escapeHtml(item)}</label>`,
    )
    .join('\n');

  const ratings = config.ratings
    .map(
      (row) => `
          <div class="fb-rating-row">
            <span class="fb-rating-row__title">${escapeHtml(row.label)}</span>
            <div class="fb-stars fb-stars--sub" data-category="${escapeHtml(row.key)}">
              <button type="button" class="fb-star" data-val="5">★</button>
              <button type="button" class="fb-star" data-val="4">★</button>
              <button type="button" class="fb-star" data-val="3">★</button>
              <button type="button" class="fb-star" data-val="2">★</button>
              <button type="button" class="fb-star" data-val="1">★</button>
            </div>
          </div>`,
    )
    .join('');

  const againOptions = config.againOptions
    .map(
      (option) =>
        `<label class="fb-chip"><input type="radio" name="againChoice" value="${escapeHtml(option)}"> ${escapeHtml(option)}</label>`,
    )
    .join('\n');

  return `
<section class="fb-page section">
  <div class="container fb-shell">
    <div class="fb-hero">
      <p class="eyebrow">${escapeHtml(config.kicker)}</p>
      <h1 class="display-s">${escapeHtml(config.heading)}</h1>
      <p class="fb-hero__desc">${escapeHtml(config.description)}</p>
      <span class="fb-badge">${escapeHtml(config.badge)}</span>
    </div>

    <div class="fb-progress" id="fbProgress">
      <div class="fb-progress__meta">
        <span id="fbStepLabel">الخطوة 1 من 4</span>
        <span id="fbStepPercent">25%</span>
      </div>
      <div class="fb-progress__track"><div class="fb-progress__fill" id="fbProgressFill"></div></div>
    </div>

    <div class="fb-card" id="fbFormShell">
      <form id="feedbackForm" class="fb-form" novalidate>
        <div class="fb-step is-active" data-step="1">
          <p class="fb-step__tag">الخطوة الأولى</p>
          <h2 class="fb-step__title">التقييم العام والاسم</h2>
          <p class="fb-step__text">شاركينا تقييمكِ الإجمالي للتجربة</p>
          <div class="fb-field">
            <label class="fb-label" for="participantName">اسمكِ الكريم (اختياري)</label>
            <input type="text" id="participantName" class="fb-input" placeholder="اكتبي اسمك هنا...">
          </div>
          <div class="fb-field">
            <label class="fb-label" for="participantPhone">رقم الهاتف (اختياري)</label>
            <input type="tel" id="participantPhone" class="fb-input" placeholder="05X-XXXXXXX">
          </div>
          <div class="fb-field">
            <label class="fb-label">تقييمكِ الإجمالي ⭐</label>
            <div class="fb-stars" id="overallStarBox">
              <button type="button" class="fb-star" data-val="5">★</button>
              <button type="button" class="fb-star" data-val="4">★</button>
              <button type="button" class="fb-star" data-val="3">★</button>
              <button type="button" class="fb-star" data-val="2">★</button>
              <button type="button" class="fb-star" data-val="1">★</button>
            </div>
          </div>
        </div>

        <div class="fb-step" data-step="2">
          <p class="fb-step__tag">الخطوة الثانية</p>
          <h2 class="fb-step__title">${escapeHtml(config.step2Title)}</h2>
          <p class="fb-step__text">${escapeHtml(config.step2Text)}</p>
          <div class="fb-chips" id="feelingsGrid">${feelings}</div>
        </div>

        <div class="fb-step" data-step="3">
          <p class="fb-step__tag">الخطوة الثالثة</p>
          <h2 class="fb-step__title">${escapeHtml(config.step3Title)}</h2>
          <p class="fb-step__text">${escapeHtml(config.step3Text)}</p>
          ${ratings}
        </div>

        <div class="fb-step" data-step="4">
          <p class="fb-step__tag">الخطوة الرابعة والأخيرة</p>
          <h2 class="fb-step__title">${escapeHtml(config.step4Title)}</h2>
          <p class="fb-step__text">${escapeHtml(config.step4Text)}</p>
          <div class="fb-field">
            <label class="fb-label" for="bestMoment">${escapeHtml(config.momentLabel)}</label>
            <textarea id="bestMoment" class="fb-textarea" placeholder="${escapeHtml(config.momentPlaceholder)}"></textarea>
          </div>
          <div class="fb-field">
            <label class="fb-label">${escapeHtml(config.againLabel)}</label>
            <div class="fb-chips" id="againChoiceGrid">${againOptions}</div>
          </div>
          <div class="fb-field">
            <label class="fb-label" for="finalNotes">${escapeHtml(config.notesLabel)}</label>
            <textarea id="finalNotes" class="fb-textarea" placeholder="${escapeHtml(config.notesPlaceholder)}"></textarea>
          </div>
        </div>

        <div class="fb-actions">
          <button type="button" id="fbPrevBtn" class="btn btn--ghost">السابق</button>
          <button type="button" id="fbNextBtn" class="btn btn--primary">التالي</button>
          <p id="fbSubmitError" class="fb-submit-error" hidden role="alert" aria-live="polite"></p>
          <button type="button" id="fbSubmitBtn" class="btn btn--primary" hidden>إرسال التقييم 🤍</button>
        </div>
      </form>
    </div>

    <div class="fb-card fb-success" id="fbSuccessBox" hidden>
      <div class="fb-success__icon">${escapeHtml(config.successIcon)}</div>
      <h2 class="display-s">${escapeHtml(config.successTitle)}</h2>
      <p class="fb-success__desc">${escapeHtml(config.successDesc)}</p>
      <a href="/" class="btn btn--primary">العودة للموقع الرئيسي</a>
    </div>
  </div>
</section>`;
}

export function renderFeedbackHub() {
  const retreatItems = FEEDBACK_HUB_ITEMS.filter((item) => item.badge === 'Retreat')
    .map(
      (item) => `
      <article class="fb-hub-card">
        <span class="fb-hub-card__badge">${item.badgeAr}</span>
        <h3 class="fb-hub-card__title">${escapeHtml(item.name)}</h3>
        <p class="fb-hub-card__desc">${escapeHtml(item.desc)}</p>
        <div class="fb-hub-card__actions">
          <a href="/feedback/${item.slug}" class="btn btn--primary">فتح الصفحة</a>
          <button type="button" class="btn btn--ghost" data-copy="/feedback/${item.slug}">نسخ الرابط</button>
        </div>
      </article>`,
    )
    .join('');

  const eventItems = FEEDBACK_HUB_ITEMS.filter((item) => item.badge === 'Event')
    .map(
      (item) => `
      <article class="fb-hub-card">
        <span class="fb-hub-card__badge">${item.badgeAr}</span>
        <h3 class="fb-hub-card__title">${escapeHtml(item.name)}</h3>
        <p class="fb-hub-card__desc">${escapeHtml(item.desc)}</p>
        <div class="fb-hub-card__actions">
          <a href="/feedback/${item.slug}" class="btn btn--primary">فتح الصفحة</a>
          <button type="button" class="btn btn--ghost" data-copy="/feedback/${item.slug}">نسخ الرابط</button>
        </div>
      </article>`,
    )
    .join('');

  return `
<section class="fb-page section">
  <div class="container fb-shell fb-shell--wide">
    <div class="fb-hero fb-hero--hub">
      <p class="eyebrow">Nawal Yoga · Feedback</p>
      <h1 class="display-m">روابط صفحات التقييم</h1>
      <p class="fb-hero__desc">
        أرسلي هذه الصفحات للمشاركين بعد كل ريتريت أو فعالية لاستقبال آرائهم مباشرة في لوحة التحكم.
      </p>
      <a href="/admin/overview" class="btn btn--ghost">لوحة التحكم →</a>
    </div>

    <h2 class="fb-section-title">ريتريتات</h2>
    <div class="fb-hub-grid">${retreatItems}</div>

    <h2 class="fb-section-title">فعاليات</h2>
    <div class="fb-hub-grid">${eventItems}</div>

    <div class="fb-toast" id="fbToast" hidden>تم نسخ الرابط بنجاح</div>
  </div>
</section>
<script>
(function(){
  var toast = document.getElementById('fbToast');
  document.querySelectorAll('[data-copy]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var path = btn.getAttribute('data-copy');
      var url = new URL(path, window.location.origin).href;
      navigator.clipboard.writeText(url).then(function(){
        if (!toast) return;
        toast.hidden = false;
        setTimeout(function(){ toast.hidden = true; }, 2400);
      });
    });
  });
})();
</script>`;
}
