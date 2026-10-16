/**
 * Nawal Yoga — visitor consent (one small, dependency-free module).
 *
 * What it controls: the only optional technology the site uses today, i.e. first-party analytics
 * (public/js/site-analytics.js → /api/analytics). That script is NOT loaded by the page; this module
 * loads it only after an explicit "analytics" consent, and stops/clears it when consent is withdrawn.
 *
 * Rules implemented here:
 *  - No decision, an expired record, a different policy version, a corrupted record, or unreadable /
 *    unwritable storage  =>  "undecided"  =>  analytics stay off.
 *  - Closing the settings dialog, pressing Esc, or ignoring the banner is never consent.
 *  - Rejecting analytics never blocks the site, events, registration, booking or payment.
 *  - Necessary storage (language, this consent record, form drafts, booking/payment steps) is not
 *    gated and is never cleared by this module.
 *
 * Public API: window.nawalConsent { has, getState, save, acceptAll, rejectAll, openSettings,
 * policyVersion, ttlDays, copy }.  Event: document "nawal:consentchange" { analytics, decided }.
 */
(function (global) {
  'use strict';
  if (global.nawalConsent) return;

  var STORAGE_KEY = 'ny-consent';
  // Bump when the privacy text or the set of optional categories changes: everyone is asked again.
  // Must match the version printed on /privacy (checked by scripts/test-consent.mjs).
  var POLICY_VERSION = '2026-10-16';
  var TTL_DAYS = 180;
  var DAY_MS = 24 * 60 * 60 * 1000;

  var ANALYTICS_SCRIPT = '/js/site-analytics.js';
  var ANALYTICS_SCRIPT_ID = 'ny-site-analytics';
  // Storage written ONLY by site-analytics.js. Nothing else uses these keys.
  var ANALYTICS_STORAGE_KEYS = ['nawal-an-sid', 'nawal-an-views', 'nawal-an-forms'];
  var STYLE_HREF = '/css/consent.css';
  var PRIVACY_HREF = '/privacy#cookies';

  var COPY = {
    en: {
      bannerTitle: 'Your privacy',
      bannerText:
        'We use essential storage to run the site (language, forms, bookings). Only with your permission do we also use simple first-party analytics to see which pages and forms are used. No advertising trackers.',
      privacyLink: 'Privacy & cookies',
      accept: 'Accept all',
      reject: 'Reject non-essential',
      customize: 'Customize',
      storageFail: 'We could not save your choice in this browser, so analytics stay off.',
      panelTitle: 'Privacy settings',
      panelIntro: 'Choose what you allow. The site, events, registration and booking work fully either way.',
      necessaryTitle: 'Necessary',
      necessaryBadge: 'Always on',
      necessaryText:
        'Remembers your language and this choice, and keeps registration, booking and payment steps working (for example form drafts you start and booking confirmation steps). It cannot be turned off.',
      analyticsTitle: 'Site analytics',
      analyticsText:
        'Records which pages and forms are opened, the language, the page you came from and campaign tags in links, using a random session ID kept in this browser tab only. Sent to our own server only — no third parties, no advertising. Off by default.',
      on: 'On',
      off: 'Off',
      save: 'Save my choices',
      close: 'Close',
      footnote: 'You can change this at any time from “Cookie settings” at the bottom of every page.',
    },
    ar: {
      bannerTitle: 'خصوصيتكِ',
      bannerText:
        'نستخدم تخزينًا ضروريًا لتشغيل الموقع (اللغة، الاستمارات، الحجوزات). وبموافقتكِ فقط نستخدم تحليلات داخلية بسيطة لنفهم الصفحات والاستمارات الأكثر استخدامًا. لا نستخدم أي تتبّع إعلاني.',
      privacyLink: 'الخصوصية والكوكيز',
      accept: 'قبول الكل',
      reject: 'رفض غير الضروري',
      customize: 'تخصيص',
      storageFail: 'تعذّر حفظ اختياركِ في هذا المتصفح، لذلك تبقى التحليلات متوقفة.',
      panelTitle: 'إعدادات الخصوصية',
      panelIntro: 'اختاري ما تسمحين به. الموقع والفعاليات والتسجيل والحجز تعمل بالكامل في كل الأحوال.',
      necessaryTitle: 'ضرورية',
      necessaryBadge: 'مفعّلة دائمًا',
      necessaryText:
        'تحفظ اللغة التي اخترتِها وقراركِ هذا، وتُبقي خطوات التسجيل والحجز والدفع تعمل (مثل مسودات الاستمارات التي تبدئينها وخطوات تأكيد الحجز). لا يمكن إيقافها.',
      analyticsTitle: 'تحليلات الموقع',
      analyticsText:
        'تسجّل الصفحات والاستمارات التي تُفتح، واللغة، والصفحة التي جئتِ منها ووسوم الحملات في الروابط، باستخدام معرّف جلسة عشوائي يُحفظ في هذا التبويب فقط. تُرسل إلى خادمنا وحده — بلا أطراف ثالثة وبلا إعلانات. متوقفة افتراضيًا.',
      on: 'مفعّلة',
      off: 'متوقفة',
      save: 'حفظ اختياراتي',
      close: 'إغلاق',
      footnote: 'يمكنكِ تغيير اختياركِ في أي وقت من رابط «إعدادات الكوكيز» أسفل كل صفحة.',
    },
  };

  /* ------------------------------------------------------------------ record */

  function now() {
    return Date.now();
  }

  /**
   * Reads the stored decision. Anything unexpected is "undecided" — never "granted".
   * @returns {{ decided: boolean, analytics: boolean, reason: string, decidedAt?: number, choice?: string }}
   */
  function readState() {
    var raw;
    try {
      var store = global.localStorage;
      if (!store || typeof store.getItem !== 'function') {
        return { decided: false, analytics: false, reason: 'unavailable' };
      }
      raw = store.getItem(STORAGE_KEY);
    } catch (_e) {
      return { decided: false, analytics: false, reason: 'unavailable' };
    }
    if (raw === null || raw === undefined || raw === '') {
      return { decided: false, analytics: false, reason: 'none' };
    }
    var rec;
    try {
      rec = JSON.parse(raw);
    } catch (_e) {
      return { decided: false, analytics: false, reason: 'corrupt' };
    }
    if (
      !rec ||
      typeof rec !== 'object' ||
      typeof rec.decidedAt !== 'number' ||
      !isFinite(rec.decidedAt) ||
      !rec.categories ||
      typeof rec.categories !== 'object' ||
      typeof rec.categories.analytics !== 'boolean'
    ) {
      return { decided: false, analytics: false, reason: 'corrupt' };
    }
    if (rec.version !== POLICY_VERSION) {
      return { decided: false, analytics: false, reason: 'policy' };
    }
    var age = now() - rec.decidedAt;
    if (age < -DAY_MS) return { decided: false, analytics: false, reason: 'invalid' };
    if (age > TTL_DAYS * DAY_MS) return { decided: false, analytics: false, reason: 'expired' };
    return {
      decided: true,
      analytics: rec.categories.analytics === true,
      reason: 'ok',
      decidedAt: rec.decidedAt,
      choice: typeof rec.choice === 'string' ? rec.choice : '',
    };
  }

  /** Writes a decision and verifies it can be read back. Returns false if storage failed. */
  function writeDecision(analytics, choice) {
    var rec = {
      version: POLICY_VERSION,
      decidedAt: now(),
      choice: choice,
      categories: { analytics: analytics === true },
    };
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(rec));
    } catch (_e) {
      return false;
    }
    var back = readState();
    return back.decided && back.analytics === (analytics === true);
  }

  /** Live check, used by every consumer at the moment it wants to act. */
  function has(category) {
    if (category === 'necessary') return true;
    if (category === 'analytics') {
      var s = readState();
      return s.decided && s.analytics === true;
    }
    return false;
  }

  /* ----------------------------------------------------------------- effects */

  function clearAnalyticsStorage() {
    ANALYTICS_STORAGE_KEYS.forEach(function (key) {
      try {
        global.sessionStorage.removeItem(key);
      } catch (_e) {}
      try {
        global.localStorage.removeItem(key);
      } catch (_e) {}
    });
  }

  function loadAnalytics() {
    if (global.nawalAnalytics) {
      if (typeof global.nawalAnalytics.start === 'function') global.nawalAnalytics.start();
      return;
    }
    var doc = global.document;
    if (!doc || typeof doc.createElement !== 'function') return;
    if (doc.getElementById(ANALYTICS_SCRIPT_ID)) return; // already loading: never twice
    var script = doc.createElement('script');
    script.id = ANALYTICS_SCRIPT_ID;
    script.src = ANALYTICS_SCRIPT;
    script.async = true;
    script.onerror = function () {
      if (script.parentNode) script.parentNode.removeChild(script); // allow a later retry
    };
    (doc.head || doc.body || doc.documentElement).appendChild(script);
  }

  var lastEffect = null;

  function applyEffects() {
    var state = readState();
    var allowed = state.decided && state.analytics === true;
    if (allowed) {
      loadAnalytics();
    } else {
      if (global.nawalAnalytics && typeof global.nawalAnalytics.stop === 'function') {
        global.nawalAnalytics.stop();
      }
      clearAnalyticsStorage();
    }
    var key = (state.decided ? '1' : '0') + (allowed ? '1' : '0');
    if (lastEffect !== null && lastEffect !== key) {
      emit({ analytics: allowed, decided: state.decided });
    }
    lastEffect = key;
    return state;
  }

  function emit(detail) {
    var doc = global.document;
    if (!doc || typeof doc.dispatchEvent !== 'function') return;
    try {
      doc.dispatchEvent(new global.CustomEvent('nawal:consentchange', { detail: detail }));
    } catch (_e) {}
  }

  /* --------------------------------------------------------------------- UI */

  var ui = null; // built lazily, only in a real browser DOM
  var rejectedThisPage = false;
  var storageFailed = false;
  var cssReady = false;

  function lang() {
    var l = global.document && global.document.documentElement && global.document.documentElement.getAttribute('lang');
    return l === 'en' ? 'en' : 'ar';
  }

  function t(key) {
    return (COPY[lang()] || COPY.ar)[key];
  }

  function el(tag, attrs, parent) {
    var node = global.document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') node.setAttribute('data-ny-text', attrs[k]);
      else node.setAttribute(k, attrs[k]);
    });
    if (parent) parent.appendChild(node);
    return node;
  }

  function buildUi() {
    var doc = global.document;
    if (ui || !doc || typeof doc.createElement !== 'function' || !doc.body) return ui;

    // The banner is only revealed once its stylesheet is applied, so it never flashes unstyled.
    var existingLink = doc.getElementById('ny-consent-css');
    if (existingLink) {
      cssReady = true; // not created by this script instance: do not wait for an event that may have fired
    } else {
      var link = el('link', { id: 'ny-consent-css', rel: 'stylesheet', href: STYLE_HREF });
      var onCss = function () {
        cssReady = true; // also on error: an unstyled-but-visible banner beats a silent one
        syncBanner();
      };
      link.addEventListener('load', onCss);
      link.addEventListener('error', onCss);
      (doc.head || doc.body).appendChild(link);
    }

    // ---- banner (non-modal, does not trap focus, does not block the page)
    var banner = el('section', {
      id: 'ny-consent-banner',
      class: 'ny-consent',
      role: 'region',
      'aria-labelledby': 'ny-consent-title',
      hidden: '',
    });
    el('h2', { id: 'ny-consent-title', class: 'ny-consent__title', text: 'bannerTitle' }, banner);
    var p = el('p', { class: 'ny-consent__text' }, banner);
    el('span', { text: 'bannerText' }, p);
    p.appendChild(doc.createTextNode(' '));
    el('a', { class: 'ny-consent__link', href: PRIVACY_HREF, text: 'privacyLink' }, p);
    var bannerNote = el('p', { class: 'ny-consent__note', role: 'status', hidden: '', text: 'storageFail' }, banner);
    var bannerActions = el('div', { class: 'ny-consent__actions' }, banner);
    var acceptBtn = el('button', { type: 'button', class: 'ny-consent__btn', 'data-ny-consent': 'accept', text: 'accept' }, bannerActions);
    var rejectBtn = el('button', { type: 'button', class: 'ny-consent__btn', 'data-ny-consent': 'reject', text: 'reject' }, bannerActions);
    var customizeBtn = el(
      'button',
      { type: 'button', class: 'ny-consent__btn', 'data-ny-consent': 'customize', 'aria-haspopup': 'dialog', text: 'customize' },
      bannerActions,
    );

    // ---- settings dialog (modal: focus is contained, Esc / backdrop / Close dismiss WITHOUT consent)
    var panel = el('div', { id: 'ny-consent-panel', class: 'ny-consent-panel', hidden: '' });
    el('div', { class: 'ny-consent-panel__backdrop', 'data-ny-consent': 'close' }, panel);
    var dialog = el(
      'div',
      {
        class: 'ny-consent-panel__dialog',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'ny-consent-panel-title',
        tabindex: '-1',
      },
      panel,
    );
    var closeBtn = el(
      'button',
      { type: 'button', class: 'ny-consent-panel__close', 'data-ny-consent': 'close' },
      dialog,
    );
    closeBtn.appendChild(doc.createTextNode('\u00d7'));
    el('h2', { id: 'ny-consent-panel-title', class: 'ny-consent-panel__title', text: 'panelTitle' }, dialog);
    el('p', { class: 'ny-consent-panel__intro', text: 'panelIntro' }, dialog);

    var necessary = el('div', { class: 'ny-consent-cat' }, dialog);
    var necessaryHead = el('div', { class: 'ny-consent-cat__head' }, necessary);
    el('h3', { class: 'ny-consent-cat__title', text: 'necessaryTitle' }, necessaryHead);
    el('span', { class: 'ny-consent-cat__badge', text: 'necessaryBadge' }, necessaryHead);
    el('p', { class: 'ny-consent-cat__text', text: 'necessaryText' }, necessary);

    var analytics = el('div', { class: 'ny-consent-cat' }, dialog);
    var analyticsHead = el('div', { class: 'ny-consent-cat__head' }, analytics);
    el('h3', { id: 'ny-consent-analytics-label', class: 'ny-consent-cat__title', text: 'analyticsTitle' }, analyticsHead);
    var switchLabel = el('label', { class: 'ny-consent-switch' }, analyticsHead);
    var toggle = el(
      'input',
      {
        type: 'checkbox',
        role: 'switch',
        class: 'ny-consent-switch__input',
        id: 'ny-consent-analytics',
        'aria-labelledby': 'ny-consent-analytics-label',
      },
      switchLabel,
    );
    el('span', { class: 'ny-consent-switch__track', 'aria-hidden': 'true' }, switchLabel);
    var toggleState = el('span', { class: 'ny-consent-switch__state', 'aria-hidden': 'true' }, switchLabel);
    el('p', { class: 'ny-consent-cat__text', text: 'analyticsText' }, analytics);

    var panelNote = el('p', { class: 'ny-consent__note', role: 'status', hidden: '', text: 'storageFail' }, dialog);
    var panelActions = el('div', { class: 'ny-consent__actions' }, dialog);
    el('button', { type: 'button', class: 'ny-consent__btn', 'data-ny-consent': 'panel-accept', text: 'accept' }, panelActions);
    el('button', { type: 'button', class: 'ny-consent__btn', 'data-ny-consent': 'panel-reject', text: 'reject' }, panelActions);
    el('button', { type: 'button', class: 'ny-consent__btn', 'data-ny-consent': 'panel-save', text: 'save' }, panelActions);
    var foot = el('p', { class: 'ny-consent-panel__foot' }, dialog);
    el('span', { text: 'footnote' }, foot);
    foot.appendChild(doc.createTextNode(' '));
    el('a', { class: 'ny-consent__link', href: PRIVACY_HREF, text: 'privacyLink' }, foot);

    doc.body.appendChild(banner);
    doc.body.appendChild(panel);

    ui = {
      banner: banner,
      bannerNote: bannerNote,
      panel: panel,
      dialog: dialog,
      toggle: toggle,
      toggleState: toggleState,
      panelNote: panelNote,
      customizeBtn: customizeBtn,
      acceptBtn: acceptBtn,
      rejectBtn: rejectBtn,
      lastFocus: null,
      prevOverflow: '',
      open: false,
    };

    banner.addEventListener('click', onUiClick);
    panel.addEventListener('click', onUiClick);
    toggle.addEventListener('change', syncToggleState);
    renderText();
    return ui;
  }

  function renderText() {
    if (!ui) return;
    [ui.banner, ui.panel].forEach(function (root) {
      Array.prototype.forEach.call(root.querySelectorAll('[data-ny-text]'), function (node) {
        node.textContent = t(node.getAttribute('data-ny-text'));
      });
    });
    ui.panel.querySelector('.ny-consent-panel__close').setAttribute('aria-label', t('close'));
    ui.banner.setAttribute('lang', lang());
    ui.panel.setAttribute('lang', lang());
    syncToggleState();
  }

  function syncToggleState() {
    if (!ui) return;
    ui.toggleState.textContent = ui.toggle.checked ? t('on') : t('off');
  }

  function setNote(show) {
    storageFailed = !!show;
    if (!ui) return;
    ui.bannerNote.hidden = !show;
    ui.panelNote.hidden = !show;
  }

  function showBanner(show) {
    if (!ui) return;
    if (show) {
      if (!ui.banner.hidden) return;
      ui.banner.hidden = false;
      var raf = global.requestAnimationFrame || function (fn) { return setTimeout(fn, 16); };
      raf(function () {
        ui.banner.classList.add('is-visible');
      });
    } else {
      ui.banner.classList.remove('is-visible');
      ui.banner.hidden = true;
    }
  }

  function syncBanner() {
    if (!ui) return;
    var state = readState();
    var want = !state.decided && !rejectedThisPage;
    if (want && !cssReady) return; // revealed by the stylesheet load handler
    showBanner(want);
  }

  function focusables() {
    return Array.prototype.filter.call(
      ui.dialog.querySelectorAll('button, input, a[href]'),
      function (node) {
        return !node.disabled && !node.hidden && node.offsetParent !== null;
      },
    );
  }

  function openPanel(trigger) {
    if (!buildUi() || ui.open) return;
    var doc = global.document;
    ui.lastFocus = trigger || doc.activeElement;
    ui.toggle.checked = readState().analytics === true;
    renderText();
    setNote(false);
    ui.prevOverflow = doc.body.style.overflow;
    doc.body.style.overflow = 'hidden';
    ui.panel.hidden = false;
    ui.open = true;
    var raf = global.requestAnimationFrame || function (fn) { return setTimeout(fn, 16); };
    raf(function () {
      ui.panel.classList.add('is-visible');
      ui.dialog.focus();
    });
  }

  /** Closing never records a decision. */
  function closePanel() {
    if (!ui || !ui.open) return;
    var doc = global.document;
    ui.open = false;
    ui.panel.classList.remove('is-visible');
    ui.panel.hidden = true;
    doc.body.style.overflow = ui.prevOverflow;
    var back = ui.lastFocus;
    ui.lastFocus = null;
    if (back && typeof back.focus === 'function' && doc.body.contains(back)) back.focus();
  }

  function decide(analytics, choice) {
    var ok = writeDecision(analytics, choice);
    if (!ok) {
      // Cannot persist => stays "undecided" => analytics stay off. Never pretend it was saved.
      setNote(true);
      applyEffects();
      return false;
    }
    setNote(false);
    rejectedThisPage = false;
    applyEffects();
    syncBanner();
    return true;
  }

  function onUiClick(event) {
    var target = event.target && event.target.closest ? event.target.closest('[data-ny-consent]') : null;
    if (!target) return;
    var action = target.getAttribute('data-ny-consent');
    if (action === 'accept') {
      decide(true, 'all');
    } else if (action === 'reject') {
      // Rejecting needs nothing to be stored; if storage fails we simply hide the banner for this page.
      if (!decide(false, 'reject')) {
        rejectedThisPage = true;
        setNote(false);
        syncBanner();
      }
    } else if (action === 'customize') {
      openPanel(target);
    } else if (action === 'panel-accept') {
      if (decide(true, 'all')) closePanel();
    } else if (action === 'panel-reject') {
      if (decide(false, 'reject')) closePanel();
      else {
        rejectedThisPage = true;
        setNote(false);
        syncBanner();
        closePanel();
      }
    } else if (action === 'panel-save') {
      if (decide(ui.toggle.checked, 'custom')) closePanel();
    } else if (action === 'close') {
      closePanel();
    }
  }

  function onKeydown(event) {
    if (!ui || !ui.open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closePanel();
      return;
    }
    if (event.key !== 'Tab') return;
    var list = focusables();
    if (!list.length) {
      event.preventDefault();
      ui.dialog.focus();
      return;
    }
    var first = list[0];
    var last = list[list.length - 1];
    var active = global.document.activeElement;
    if (event.shiftKey && (active === first || active === ui.dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onDocClick(event) {
    var link = event.target && event.target.closest ? event.target.closest('[data-ny-cookie-settings]') : null;
    if (!link) return;
    event.preventDefault();
    openPanel(link);
  }

  function initUi() {
    var doc = global.document;
    if (!doc || typeof doc.createElement !== 'function') return;
    doc.addEventListener('click', onDocClick);
    doc.addEventListener('keydown', onKeydown);
    var refresh = function () {
      renderText();
    };
    doc.addEventListener('nawal:langchange', refresh);
    if (typeof global.MutationObserver === 'function' && doc.documentElement) {
      new global.MutationObserver(refresh).observe(doc.documentElement, {
        attributes: true,
        attributeFilter: ['lang'],
      });
    }
    // Another tab changed the decision: follow it immediately (withdrawal included).
    if (typeof global.addEventListener === 'function') {
      global.addEventListener('storage', function (event) {
        if (event.key !== null && event.key !== STORAGE_KEY) return;
        applyEffects();
        syncBanner();
      });
    }
    buildUi();
    syncBanner();
  }

  /* -------------------------------------------------------------------- boot */

  var api = {
    policyVersion: POLICY_VERSION,
    ttlDays: TTL_DAYS,
    copy: COPY,
    has: has,
    getState: readState,
    save: function (opts) {
      return decide(!!(opts && opts.analytics), 'custom');
    },
    acceptAll: function () {
      return decide(true, 'all');
    },
    rejectAll: function () {
      return decide(false, 'reject');
    },
    openSettings: function (trigger) {
      openPanel(trigger);
    },
  };
  global.nawalConsent = api;

  // Apply the stored decision first (clears stale analytics ids when there is no consent), then UI.
  applyEffects();

  var doc = global.document;
  if (doc && typeof doc.createElement === 'function') {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', initUi);
    else initUi();
  }
})(typeof window !== 'undefined' ? window : this);
