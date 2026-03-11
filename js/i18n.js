/**
 * i18n: English & Arabic for Nawal Yoga site
 * Usage: data-i18n="key" for text, data-i18n-attr="title:key" for attributes
 */
(function () {
  var STORAGE_KEY = 'nawal-lang';

  var translations = {
    en: {
      nav_home: 'Home',
      nav_about: 'About',
      nav_video: 'Video',
      nav_workshops: 'Workshops',
      nav_al_tira: 'Al-Tira Yoga',
      nav_jiva: 'Jiva Yoga',
      nav_retreat: 'Retreat',
      menu_label: 'Menu',
      lang_toggle: 'Change language',
      footer_tagline: 'Where yoga meets calm and quality',
      copyright: 'All rights reserved.',
      back: 'Back',
      lang_ar: 'العربية',
      lang_en: 'English',

      hero_tagline: 'Yoga · Mindfulness · Retreat',
      hero_title1: 'Change begins',
      hero_title2: 'here',
      hero_subtitle: 'Exceptional yoga with a certified instructor. Vinyasa, Yin, Hatha & meditation—in a calm studio or in nature.',
      hero_cta_book: 'Book your session',
      hero_cta_discover: 'Discover more',
      hero_bottom: 'Private · group · retreats',

      about_label: 'About Nawal',
      about_title: 'Yoga Instructor',
      about_subtitle: 'A journey of awareness, breath and movement',
      about_name: 'Nawal Omar',
      about_cert: 'Certified yoga instructor • Vinyasa, Yin, Hatha, meditation',
      about_bio: 'Certified yoga instructor with over ten years of practice. Vinyasa, Yin, Hatha & meditation—for beginners and advanced. Reconnect with your body, breath, and inner calm in the studio or in nature.',
      about_point1: 'Certified (RYT 200+) — private & group sessions',
      about_point2: 'Workshops and retreats in nature',
      stat_trainees: 'Trainees',
      stat_years: 'Years',
      stat_styles: 'Yoga styles',

      video_label: 'Practice & presence',
      video_title: 'A moment of calm',
      video_muted: 'Muted',
      video_unmute: 'Unmute video',
      video_live: 'Live audio',
      video_caption: 'Nawal Omar · Yoga & mindfulness',
      story_label: 'My story',
      story_text1: "I'm a certified yoga instructor with over ten years of practice and teaching. What started as my personal search for calm and flexibility became a path to share yoga with others—Vinyasa, Yin, Hatha, and guided meditation.",
      story_text2: 'Whether in the studio or in nature, I design every session to help you reconnect with your body, breath, and inner stillness. I believe yoga is for everyone: gentle movement, mindful breath, and moments of silence that bring you back to yourself.',

      moments_label: 'Images & moments',
      moments_title: 'Glimpses of practice & calm',
      gallery_prev: 'Previous image',
      gallery_next: 'Next image',
      gallery_swipe: 'Swipe or drag to browse',

      workshops_label: 'Workshops',
      workshops_heading: 'Al-Tira · Jiva · Retreat',
      al_tira_title: 'Al-Tira Yoga',
      al_tira_desc: 'Experience freedom in the air. Suspension-based practice for strength, flexibility and playfulness—suitable for all levels.',
      al_tira_cta: 'Discover more',
      jiva_title: 'Jiva Yoga',
      jiva_desc: 'Connect body, breath and mind. A holistic approach blending movement, meditation and mindfulness in a supportive space.',
      jiva_cta: 'Learn more',
      retreat_title: 'Retreat',
      retreat_desc: 'Step away from the everyday. Multi-day yoga retreats in nature—deep practice, rest and connection with like-minded souls.',
      retreat_cta: 'Explore retreats',

      audio_question: 'Would you like to enable sound for videos on this device?',
      audio_later: 'Later',
      audio_enable: 'Enable sound',

      retreat_page_label: 'Wadi Rum Retreat',
      retreat_page_title: 'A path back to yourself',
      retreat_page_intro: 'Wadi Rum Retreat is a path back. Back to your body, your breath, and the quiet part in you that may have been forgotten between pressure, responsibilities, and constant noise.',
      retreat_from: 'From an aware, safe, and real place',
      retreat_bio1: 'I am Nawal Omar, a yoga teacher and a nurse, and I guide women through this kind of journey from an aware, safe, and authentic place — no big promises, just honest presence and a deeply felt experience.',
      retreat_bio2: 'The retreat will take place at SHARAZAD CAMP – Wadi Rum, with very comfortable 5-star glamping rooms, nourishing meals included, and a space where you can feel held — without needing to prove, perform, or stay "strong."',
      retreat_share_title: 'What we will share during these days',
      retreat_share1: 'During the retreat we will move, breathe, write, sit in silence, laugh, and even cry if tears arise. There will be yoga, sound healing, sharing circles, silence, and fire under the stars.',
      retreat_share2: 'Most importantly, there will be space for you — exactly as you are.',
      retreat_share3: 'After you fill out the form, we will contact you as soon as possible with all details, the full schedule, and pricing, and we can see together whether this path is right for you at this stage of your life.',
      retreat_questions: 'For questions or inquiries:',
      retreat_submit: 'Submit request',

      al_tira_page_label: 'Al-Tira',
      al_tira_page_title: 'Al-Tira Yoga',
      al_tira_page_intro: 'Experience freedom in the air. Suspension-based practice for strength, flexibility and playfulness—suitable for all levels.',
      al_tira_heading: 'Suspension yoga for every body',
      al_tira_p1: 'Al-Tira Yoga brings the mat into the air. Using soft suspension, we build strength, release tension, and explore movement in a supportive, playful way. Whether you are new or experienced, the practice meets you where you are.',
      al_tira_p2: 'Join the Al-Tira community to stay updated on sessions, share with fellow practitioners, and connect with Nawal and the team.',
      al_tira_join_title: 'Join the Al-Tira Yoga group',
      al_tira_join_text: 'Get schedules, updates, and connect with others in the Al-Tira Yoga community on WhatsApp.',
      al_tira_join_btn: 'Join Al-Tira Yoga WhatsApp group',

      jiva_page_label: 'Jiva Yoga',
      jiva_page_title: 'Jiva Yoga',
      jiva_page_intro: 'Connect body, breath and mind. A holistic approach blending movement, meditation and mindfulness in a supportive space.',
      jiva_heading: 'Body, breath and mindfulness',
      jiva_p1: 'Jiva Yoga is a holistic practice that weaves movement, breathwork, and meditation into one flow. In a calm and supportive environment, we cultivate awareness and presence—on and off the mat.',
      jiva_p2: 'Join the Jiva Yoga community on WhatsApp for class updates, inspiration, and connection with fellow practitioners.',
      jiva_join_title: 'Join the Jiva Yoga group',
      jiva_join_text: 'Get schedules, updates, and connect with others in the Jiva Yoga community on WhatsApp.',
      jiva_join_btn: 'Join Jiva Yoga WhatsApp group',

      nawal_loader: 'Breathe',
      nawal_tagline: 'A quiet space for your inner light',
      nawal_register: 'Register for Retreat',
      nawal_quote: '"Inhale the future, exhale the past."',
      nawal_connect: 'Connect with presence',
      nawal_footer: 'Mindfulness · Yoga · Calm',
      nawal_haifa: 'Haifa Yoga'
    },
    ar: {
      nav_home: 'الرئيسية',
      nav_about: 'من نحن',
      nav_video: 'فيديو',
      nav_workshops: 'ورش العمل',
      nav_al_tira: 'الطيرة يوغا',
      nav_jiva: 'حيفا يوغا',
      nav_retreat: 'ريتريت',
      menu_label: 'القائمة',
      lang_toggle: 'تغيير اللغة',
      footer_tagline: 'حيث تلتقي اليوغا بالهدوء والجودة',
      copyright: 'جميع الحقوق محفوظة.',
      back: 'رجوع',
      lang_ar: 'العربية',
      lang_en: 'English',

      hero_tagline: 'يوغا · وعي · راحة',
      hero_title1: 'التغيير يبدأ',
      hero_title2: 'هنا',
      hero_subtitle: 'يوغا استثنائية مع مدربة معتمدة. فينيسا، يين، هاثا والتأمل—في استوديو هادئ أو في الطبيعة.',
      hero_cta_book: 'احجزي جلستك',
      hero_cta_discover: 'اكتشفي المزيد',
      hero_bottom: 'خاص · جماعي · رحلات راحة',

      about_label: 'عن نوال',
      about_title: 'مدربة يوغا',
      about_subtitle: 'رحلة وعي ونفس وحركة',
      about_name: 'نوال عمر',
      about_cert: 'مدربة يوغا معتمدة • فينيسا، يين، هاثا، تأمل',
      about_bio: 'مدربة يوغا معتمدة مع أكثر من عشر سنوات من الممارسة والتعليم. فينيسا، يين، هاثا والتأمل—للمبتدئين والمتقدمين. إعادة الاتصال بجسدك ونفسك والهدوء الداخلي في الاستوديو أو في الطبيعة.',
      about_point1: 'معتمدة (RYT 200+) — جلسات خاصة وجماعية',
      about_point2: 'ورش عمل ورحلات راحة في الطبيعة',
      stat_trainees: 'متدرب',
      stat_years: 'سنوات',
      stat_styles: 'أنماط يوغا',

      video_label: 'ممارسة وحضور',
      video_title: 'لحظة هدوء',
      video_muted: 'صامت',
      video_unmute: 'تشغيل الصوت',
      video_live: 'صوت مباشر',
      video_caption: 'نوال عمر · يوغا ووعي',
      story_label: 'قصتي',
      story_text1: 'أنا مدربة يوغا معتمدة مع أكثر من عشر سنوات من الممارسة والتعليم. ما بدأ كبحث شخصي عن الهدوء والمرونة أصبح طريقاً لمشاركة اليوغا مع الآخرين—فينيسا، يين، هاثا، وتأمل موجّه.',
      story_text2: 'سواء في الاستوديو أو في الطبيعة، أصمم كل جلسة لمساعدتك على إعادة الاتصال بجسدك ونفسك وسكونك الداخلي. أؤمن أن اليوغا للجميع: حركة لطيفة، نفس واعٍ، ولحظات صمت تعيدك إلى ذاتك.',

      moments_label: 'صور ولحظات',
      moments_title: 'لمحات من الممارسة والهدوء',
      gallery_prev: 'الصورة السابقة',
      gallery_next: 'الصورة التالية',
      gallery_swipe: 'اسحبي أو اسحب للتصفح',

      workshops_label: 'ورش العمل',
      workshops_heading: 'الطيرة · حيفا · ريتريت',
      al_tira_title: 'الطيرة يوغا',
      al_tira_desc: 'اختبري الحرية في الهواء. ممارسة معلقة للقوة والمرونة والمرح—مناسبة لجميع المستويات.',
      al_tira_cta: 'اكتشفي المزيد',
      jiva_title: 'حيفا يوغا',
      jiva_desc: 'ربط الجسد والنفس والعقل. نهج شامل يدمج الحركة والتأمل والوعي في فضاء داعم.',
      jiva_cta: 'اعرفي المزيد',
      retreat_title: 'ريتريت',
      retreat_desc: 'ابتعدي عن اليومي. رحلات يوغا متعددة الأيام في الطبيعة—ممارسة عميقة وراحة واتصال بأرواح متشابهة.',
      retreat_cta: 'استكشفي ريتريت',

      audio_question: 'هل ترغبين بتشغيل الصوت للفيديوهات على هذا الجهاز؟',
      audio_later: 'لاحقاً',
      audio_enable: 'تشغيل الصوت',

      retreat_page_label: 'رحلة وادي رم',
      retreat_page_title: 'طريق العودة إلى ذاتك',
      retreat_page_intro: 'رحلة وادي رم هي طريق عودة. العودة إلى جسدك ونفسك والجزء الهادئ فيك الذي ربما نُسي بين الضغوط والمسؤوليات والضجيج المستمر.',
      retreat_from: 'من مكان واعٍ وآمن وحقيقي',
      retreat_bio1: 'أنا نوال عمر، معلمة يوغا وممرضة، وأرافق النساء في هذا النوع من الرحلة من مكان واعٍ وآمن وأصيل—بدون وعود كبيرة، فقط حضور صادق وتجربة محسوسة بعمق.',
      retreat_bio2: 'ستقام الرحلة في مخيم شهرزاد – وادي رم، بغرف جلamping مريحة جداً بخمس نجوم، وجبات مغذية مشمولة، وفضاء تشعرين فيه بالاحتواء—بدون حاجة لإثبات أو أداء أو البقاء "قوية".',
      retreat_share_title: 'ما سنشاركه خلال هذه الأيام',
      retreat_share1: 'خلال الرحلة سنتحرك، نتنفس، نكتب، نجلس في صمت، نضحك، وحتى نبكي إن انهمرت الدموع. ستكون هناك يوغا، شفاء صوتي، دوائر مشاركة، صمت، ونار تحت النجوم.',
      retreat_share2: 'الأهم، سيكون هناك مساحة لك—تماماً كما أنت.',
      retreat_share3: 'بعد ملء النموذج، سنتواصل معك في أقرب وقت بكل التفاصيل والجدول الكامل والأسعار، ويمكننا معاً أن نرى إن كان هذا الطريق مناسباً لك في هذه المرحلة من حياتك.',
      retreat_questions: 'للاستفسارات أو الأسئلة:',
      retreat_submit: 'إرسال طلب',

      al_tira_page_label: 'الطيرة',
      al_tira_page_title: 'الطيرة يوغا',
      al_tira_page_intro: 'اختبري الحرية في الهواء. ممارسة معلقة للقوة والمرونة والمرح—مناسبة لجميع المستويات.',
      al_tira_heading: 'يوغا معلقة لكل جسد',
      al_tira_p1: 'الطيرة يوغا تنقل السجادة إلى الهواء. باستخدام تعليق ناعم، نبني القوة، نطلق التوتر، ونستكشف الحركة بطريقة داعمة ومرحة. سواء كنتِ جديدة أو ذات خبرة، الممارسة تلتقيك أينما كنتِ.',
      al_tira_p2: 'انضمي لمجتمع الطيرة للبقاء على تحديث بالجلسات، المشاركة مع الممارسين، والاتصال بنوال والفريق.',
      al_tira_join_title: 'انضمي لمجموعة الطيرة يوغا',
      al_tira_join_text: 'احصلي على الجداول والتحديثات وتواصلي مع الآخرين في مجتمع الطيرة يوغا على واتساب.',
      al_tira_join_btn: 'انضمي لمجموعة الطيرة يوغا على واتساب',

      jiva_page_label: 'حيفا يوغا',
      jiva_page_title: 'حيفا يوغا',
      jiva_page_intro: 'ربط الجسد والنفس والعقل. نهج شامل يدمج الحركة والتأمل والوعي في فضاء داعم.',
      jiva_heading: 'جسد ونفس ووعي',
      jiva_p1: 'حيفا يوغا ممارسة شاملة تنسج الحركة وعمل النفس والتأمل في تدفق واحد. في بيئة هادئة وداعمة، نزرع الوعي والحضور—على السجادة وخارجها.',
      jiva_p2: 'انضمي لمجتمع حيفا يوغا على واتساب لتحديثات الحصص والإلهام والاتصال بالممارسين.',
      jiva_join_title: 'انضمي لمجموعة حيفا يوغا',
      jiva_join_text: 'احصلي على الجداول والتحديثات وتواصلي مع الآخرين في مجتمع حيفا يوغا على واتساب.',
      jiva_join_btn: 'انضمي لمجموعة حيفا يوغا على واتساب',

      nawal_loader: 'تنفسي',
      nawal_tagline: 'مساحة هادئة لنورك الداخلي',
      nawal_register: 'التسجيل للرحلة',
      nawal_quote: '"استنشقي المستقبل، زفري الماضي."',
      nawal_connect: 'تواصلي مع الحضور',
      nawal_footer: 'وعي · يوغا · هدوء',
      nawal_haifa: 'يوغا حيفا'
    }
  };

  function getStoredLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function getText(lang, key) {
    var t = translations[lang] || translations.en;
    return t[key] != null ? t[key] : (translations.en[key] || key);
  }

  function applyLanguage(lang) {
    if (lang !== 'en' && lang !== 'ar') lang = 'en';
    var root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    setStoredLang(lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var text = getText(lang, key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var spec = el.getAttribute('data-i18n-attr');
      var parts = spec.split(':');
      var attr = parts[0];
      var key = parts[1];
      if (attr && key) el.setAttribute(attr, getText(lang, key));
    });

    document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      var l = btn.getAttribute('data-lang-set');
      btn.classList.toggle('font-semibold', l === lang);
      btn.setAttribute('aria-pressed', l === lang ? 'true' : 'false');
    });

    window.dispatchEvent(new CustomEvent('nawal-lang-change', { detail: { lang: lang } }));
  }

  function initI18n() {
    var stored = getStoredLang();
    var lang = stored === 'ar' || stored === 'en' ? stored : 'en';
    applyLanguage(lang);

    document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var l = btn.getAttribute('data-lang-set');
        if (l === 'ar' || l === 'en') applyLanguage(l);
      });
    });
  }

  window.nawalI18n = {
    getLang: function () { return getStoredLang() || 'en'; },
    setLang: applyLanguage,
    t: getText,
    init: initI18n
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
  } else {
    initI18n();
  }
})();
