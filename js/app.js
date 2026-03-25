/**
 * App global: audio consent, keyboard nav, custom cursor
 */
(function () {
  var AUDIO_CONSENT_KEY = 'audio-consent-v2';

  function initAudioConsent() {
    var promptEl = document.getElementById('audio-consent-prompt');
    if (!promptEl) return;

    var saved = null;
    try {
      saved = localStorage.getItem(AUDIO_CONSENT_KEY);
    } catch (e) {}

    if (saved === 'accepted' || saved === 'declined') {
      promptEl.hidden = true;
      return;
    }

    promptEl.hidden = false;

    var acceptBtn = promptEl.querySelector('[data-audio-accept]');
    var declineBtn = promptEl.querySelector('[data-audio-decline]');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        try {
          localStorage.setItem(AUDIO_CONSENT_KEY, 'accepted');
        } catch (e) {}
        promptEl.hidden = true;
        window.dispatchEvent(new CustomEvent('audio-consent-unlock'));
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        try {
          localStorage.setItem(AUDIO_CONSENT_KEY, 'declined');
        } catch (e) {}
        promptEl.hidden = true;
      });
    }
  }

  function initCursor() {
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return;

    var cursorEl = document.getElementById('custom-cursor');
    if (!cursorEl) return;

    cursorEl.style.display = 'block';
    var x = 0;
    var y = 0;
    var scale = 1;

    function updateStyle() {
      cursorEl.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) scale(' + scale + ')';
    }

    window.addEventListener('mousemove', function (e) {
      x = e.clientX;
      y = e.clientY;
      scale = 1.1;
      updateStyle();
    });
    window.addEventListener('mouseleave', function () {
      scale = 0.8;
      updateStyle();
    });
    window.addEventListener('mouseenter', function () {
      scale = 1;
      updateStyle();
    });
  }

  function initSeoUrls() {
    var o = location.origin;
    if (!o || o === 'null' || (location.protocol && location.protocol.indexOf('file') === 0)) return;
    var clean = location.href.split('#')[0].split('?')[0];
    var c = document.getElementById('seo-canonical');
    if (c) c.setAttribute('href', clean);
    var ou = document.getElementById('og-url');
    if (ou) ou.setAttribute('content', clean);
    ['hreflang-en', 'hreflang-ar', 'hreflang-def'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.setAttribute('href', clean);
    });
    var ogImg = document.getElementById('og-image');
    if (ogImg) {
      try {
        ogImg.setAttribute('content', new URL('public/media/hero.jpg', clean).href);
      } catch (e1) {}
    }
  }

  function initSeoJsonLdHome() {
    if (document.documentElement.getAttribute('data-page') !== 'home') return;
    var o = location.origin;
    if (!o || o === 'null' || (location.protocol && location.protocol.indexOf('file') === 0)) return;
    if (document.querySelector('script[type="application/ld+json"][data-nawal-seo]')) return;
    var clean = location.href.split('#')[0].split('?')[0];
    var base;
    try {
      base = new URL('./', clean).href;
    } catch (e) {
      return;
    }
    var imgPerson;
    var imgHero;
    try {
      imgPerson = new URL('public/media/10.jpg', clean).href;
      imgHero = new URL('public/media/hero.jpg', clean).href;
    } catch (e2) {
      return;
    }
    var graph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': base + '#website',
          url: base,
          name: 'Nawal Omar Yoga',
          description:
            'Yoga classes, workshops and retreats with certified instructor Nawal Omar in Haifa, Israel.',
          inLanguage: ['en', 'ar'],
          publisher: { '@id': base + '#person' }
        },
        {
          '@type': 'Person',
          '@id': base + '#person',
          name: 'Nawal Omar',
          jobTitle: 'Certified Yoga Instructor',
          description:
            'Yoga teacher offering Vinyasa, Yin, Hatha and meditation in Haifa, Israel; workshops in Al-Tira and Haifa; international retreats.',
          url: base,
          image: imgPerson,
          sameAs: ['https://www.instagram.com/nawal_aom/'],
          telephone: '+972-52-2496366',
          nationality: { '@type': 'Country', name: 'Israel' },
          homeLocation: {
            '@type': 'Place',
            name: 'Haifa, Israel',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Haifa',
              addressCountry: 'IL'
            }
          },
          knowsAbout: ['Yoga', 'Vinyasa Yoga', 'Yin Yoga', 'Hatha Yoga', 'Meditation', 'Mindfulness']
        },
        {
          '@type': 'ProfessionalService',
          '@id': base + '#yoga-service',
          name: 'Nawal Omar Yoga',
          url: base,
          description:
            'Yoga instruction: private sessions, group classes, workshops (Al-Tira, Haifa), and retreats.',
          serviceType: 'Yoga instruction',
          areaServed: [
            { '@type': 'City', name: 'Haifa', containedInPlace: { '@type': 'Country', name: 'Israel' } },
            { '@type': 'Country', name: 'Israel' }
          ],
          provider: { '@id': base + '#person' },
          image: imgHero
        }
      ]
    };
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-nawal-seo', '1');
    s.textContent = JSON.stringify(graph);
    document.head.appendChild(s);
  }

  function initPageLoader() {
    var el = document.getElementById('page-loader');
    if (!el) return;

    var html = document.documentElement;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var minMs = 2000;
    var start = typeof window.__nawalLoaderStart === 'number' ? window.__nawalLoaderStart : Date.now();

    function finish() {
      el.setAttribute('aria-busy', 'false');
      html.classList.remove('page-loader-lock');
      try {
        delete window.__nawalLoaderStart;
      } catch (e) {
        window.__nawalLoaderStart = undefined;
      }
      window.setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, prefersReduced ? 220 : 650);
    }

    function hide() {
      var heroRevealed = false;
      function revealHero() {
        if (heroRevealed) return;
        heroRevealed = true;
        var hero = document.querySelector('.hero-luxury--await-loader');
        if (hero) hero.classList.remove('hero-luxury--await-loader');
        window.dispatchEvent(new CustomEvent('nawal-hero-reveal'));
      }

      function onTransitionEnd(e) {
        if (e.propertyName !== 'opacity') return;
        el.removeEventListener('transitionend', onTransitionEnd);
        revealHero();
      }

      el.addEventListener('transitionend', onTransitionEnd);
      window.setTimeout(function () {
        el.removeEventListener('transitionend', onTransitionEnd);
        revealHero();
      }, 900);

      el.classList.add('page-loader--done');
      finish();
    }

    function scheduleHide() {
      var elapsed = Date.now() - start;
      var wait = Math.max(0, minMs - elapsed);
      window.setTimeout(hide, wait);
    }

    if (document.readyState === 'complete') scheduleHide();
    else window.addEventListener('load', scheduleHide);
  }

  function initMenu() {
    var toggle = document.getElementById('menu-toggle');
    var panel = document.getElementById('menu-panel');
    if (!toggle || !panel) return;

    var closeBtn = panel.querySelector('[data-menu-close]');
    var links = panel.querySelectorAll('a[href]');

    function openMenu() {
      panel.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.dataset.menuOpen = 'true';
      /* Two frames: let layout settle so opacity/transform transitions run (no display:none flash). */
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          panel.classList.add('is-open');
        });
      });
    }

    function closeMenu() {
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.dataset.menuOpen = 'false';
      panel.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', function () {
      var isOpen = panel.classList.contains('is-open');
      if (isOpen) closeMenu();
      else openMenu();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    panel.addEventListener('click', function (e) {
      if (e.target === panel) closeMenu();
    });

    links.forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    panel.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      btn.addEventListener('click', closeMenu);
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  function initMobileLangToggle() {
    var btn = document.getElementById('mobile-lang-toggle');
    if (!btn) return;
    if (!window.nawalI18n || !window.nawalI18n.getLang || !window.nawalI18n.setLang) return;

    function update() {
      var current = window.nawalI18n.getLang() || 'en';
      var target = current === 'ar' ? 'en' : 'ar';
      btn.setAttribute('data-lang-set', target);
      // Icon-only toggle; we only update the target language.
    }

    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-lang-set');
      if (target === 'ar' || target === 'en') window.nawalI18n.setLang(target);
    });

    window.addEventListener('nawal-lang-change', function () {
      update();
    });

    update();
  }

  function init() {
    var yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    initSeoUrls();
    initSeoJsonLdHome();
    initPageLoader();
    initAudioConsent();
    initCursor();
    initMobileLangToggle();
    initMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
