import { COMMERCE_WHATSAPP } from './commerce/constants.js';

/** Public product name (EN keeps editorial title; AR is bride-specific). */
export const BR_RITUAL_NAME = {
  en: 'A Space for the Bride',
  ar: 'مساحة للعروس',
};

const WA_MSG = {
  en: "Hi! I'm interested in A Space for the Bride. I'd love to know more about the experience and available options.",
  ar: 'مرحبا، مهتمة بـ«مساحة للعروس» وبحب أعرف أكثر عن التفاصيل والخيارات المتاحة.',
};

const WA_MSG_OPTION = {
  bride: {
    en: "Hi! I'm interested in A Space for the Bride — The Bride (private experience). I'd love to know more.",
    ar: 'مرحبا، مهتمة بـ«مساحة للعروس» — خيار العروس (تجربة خاصة). بحب أعرف أكثر.',
  },
  circle: {
    en: "Hi! I'm interested in A Space for the Bride — Bride & Her Circle. I'd love to know more.",
    ar: 'مرحبا، مهتمة بـ«مساحة للعروس» — العروس ودائرتها. بحب أعرف أكثر.',
  },
  mother: {
    en: "Hi! I'm interested in A Space for the Bride — Mother & Bride. I'd love to know more.",
    ar: 'مرحبا، مهتمة بـ«مساحة للعروس» — الأم والعروس. بحب أعرف أكثر.',
  },
};

export function bridalRitualWhatsAppUrl(lang = 'en', option = '') {
  const key = lang === 'ar' ? 'ar' : 'en';
  const msg = option && WA_MSG_OPTION[option] ? WA_MSG_OPTION[option][key] : WA_MSG[key];
  return `https://wa.me/${COMMERCE_WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

export const BR_INLINE_SCRIPT = `(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  var WA_MSG = ${JSON.stringify(WA_MSG)};
  var WA_MSG_OPTION = ${JSON.stringify(WA_MSG_OPTION)};
  var WA_BASE = '${COMMERCE_WHATSAPP}';

  function currentLang() {
    return document.documentElement.lang === 'ar' ? 'ar' : 'en';
  }

  function buildWaHref(option) {
    var lang = currentLang();
    var msg = option && WA_MSG_OPTION[option] ? WA_MSG_OPTION[option][lang] : WA_MSG[lang];
    return 'https://wa.me/' + WA_BASE + '?text=' + encodeURIComponent(msg);
  }

  function trackCta(el) {
    var cta = el.getAttribute('data-track-cta') || 'bridal_cta';
    var loc = el.getAttribute('data-track-loc') || 'unknown';
    var payload = { cta: cta, location: loc, page: 'bridal-ritual' };
    if (window.wrEvents) window.wrEvents.push({ event: 'bridal_ritual_cta', params: payload, at: Date.now() });
    if (window.nawalAnalytics && typeof window.nawalAnalytics.track === 'function') {
      window.nawalAnalytics.track('cta_click', payload);
    }
  }

  function syncWaLinks() {
    document.querySelectorAll('[data-br-wa]').forEach(function (a) {
      var opt = a.getAttribute('data-br-wa-option') || '';
      a.setAttribute('href', buildWaHref(opt));
    });
  }

  ready(function () {
    syncWaLinks();
    document.addEventListener('nawal:langchange', syncWaLinks);

    document.querySelectorAll('[data-br-wa], [data-track-cta]').forEach(function (el) {
      el.addEventListener('click', function () { trackCta(el); });
    });

    document.querySelectorAll('[data-br-scroll]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-br-scroll');
        var target = id ? document.getElementById(id) : null;
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    var sticky = document.querySelector('[data-br-sticky]');
    var hero = document.querySelector('.br-hero');
    if (sticky && hero && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          sticky.hidden = entries[0].isIntersecting;
        },
        { threshold: 0, rootMargin: '0px 0px -20% 0px' }
      );
      io.observe(hero);
    } else if (sticky) {
      sticky.hidden = false;
    }
  });
})();`;
