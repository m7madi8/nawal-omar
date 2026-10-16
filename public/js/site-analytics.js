/**
 * First-party page + form funnel analytics (no external provider).
 * Events: page_view, form_view, form_start, form_complete, form_abandon
 * Sent to /api/analytics → Supabase site_analytics.
 *
 * CONSENT: this script is loaded by public/js/consent.js only after an explicit "analytics" consent.
 * It is still self-protecting: nothing is read-for-tracking, written to storage or sent unless
 * start() was called AND window.nawalConsent.has('analytics') is true at that very moment.
 * Without window.nawalConsent it never runs (fail closed). stop() halts every future event and clears
 * the analytics ids; it touches no other storage (language, form drafts, booking data are untouched).
 */
(function (global) {
  if (global.nawalAnalytics) return;

  var ENDPOINT = '/api/analytics';
  var SESSION_KEY = 'nawal-an-sid';
  var VIEWED_KEY = 'nawal-an-views';
  var FORM_STATE_KEY = 'nawal-an-forms';

  var running = false;

  function consentGranted() {
    try {
      return !!(global.nawalConsent && typeof global.nawalConsent.has === 'function' && global.nawalConsent.has('analytics'));
    } catch (_e) {
      return false;
    }
  }

  function allowed() {
    return running && consentGranted();
  }

  var FORM_ALIASES = {
    wadiRegForm: 'wadi-rum-registration',
    'sh-register-form': 'sound-healing-registration',
    'ib-register-form': 'ice-bath-registration',
    'dahab-book-form': 'dahab-retreat-reserve',
    'retreat-reserve-form': 'zanzibar-retreat-reserve',
    feedbackForm: 'feedback',
    psRequestForm: 'private-sessions',
    mountainVoiceForm: 'mountain-voice-registration',
    'ice-bath-health-form': 'ice-bath-health',
  };

  function nowIso() {
    return new Date().toISOString();
  }

  function sessionId() {
    if (!allowed()) return 's-anon';
    try {
      var id = sessionStorage.getItem(SESSION_KEY);
      if (id) return id;
      id = 's-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem(SESSION_KEY, id);
      return id;
    } catch (_e) {
      return 's-anon';
    }
  }

  function readMap(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key) || '{}') || {};
    } catch (_e) {
      return {};
    }
  }

  function writeMap(key, value) {
    if (!allowed()) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (_e) {}
  }

  function currentPath() {
    return (location.pathname || '/').split('?')[0].split('#')[0] || '/';
  }

  function shouldSkip() {
    if (!allowed()) return true;
    var path = currentPath();
    return path.indexOf('/admin') === 0 || path.indexOf('/api') === 0;
  }

  function currentLang() {
    return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ar';
  }

  function utm() {
    var out = {};
    try {
      var params = new URLSearchParams(location.search);
      ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (key) {
        var value = params.get(key);
        if (value) out[key] = value.slice(0, 100);
      });
    } catch (_e) {}
    return out;
  }

  function referrerHost() {
    try {
      if (!document.referrer) return '';
      var url = new URL(document.referrer);
      if (url.host === location.host) return '';
      return url.origin + url.pathname;
    } catch (_e) {
      return '';
    }
  }

  function queueSend(payload) {
    if (!allowed()) return;
    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon(ENDPOINT, blob)) return;
      }
    } catch (_e) {}
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: body,
        keepalive: true,
        credentials: 'same-origin',
      }).catch(function () {});
    } catch (_e) {}
  }

  function track(event, extra) {
    if (shouldSkip()) return;
    var base = Object.assign(
      {
        id: 'an-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        event: event,
        path: currentPath(),
        sessionId: sessionId(),
        lang: currentLang(),
        referrer: referrerHost(),
        createdAt: nowIso(),
      },
      utm(),
      extra || {},
    );
    queueSend(base);
    try {
      global.wrEvents = global.wrEvents || [];
      global.wrEvents.push({ event: event, params: base, at: Date.now() });
    } catch (_e) {}
  }

  function formIdFromEl(form) {
    if (!form) return '';
    var explicit = form.getAttribute('data-track-form') || form.getAttribute('data-analytics-form');
    if (explicit) return explicit;
    var id = form.id || '';
    if (FORM_ALIASES[id]) return FORM_ALIASES[id];
    if (id) return id;
    var action = form.getAttribute('action') || '';
    if (action) return action.replace(/[^\w-]+/g, '-').slice(0, 60);
    return 'form-' + currentPath().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
  }

  function eligibleForms() {
    return Array.prototype.slice.call(document.querySelectorAll('main form, .ny-inner form, form[data-track-form]')).filter(function (form) {
      if (!form || form.closest('.admin-body, #adminRoot, #loginForm')) return false;
      if (form.getAttribute('data-analytics') === 'off') return false;
      if (form.id === 'loginForm') return false;
      return true;
    });
  }

  function markFormState(formId, patch) {
    var map = readMap(FORM_STATE_KEY);
    map[formId] = Object.assign({}, map[formId] || {}, patch, { path: currentPath(), at: Date.now() });
    writeMap(FORM_STATE_KEY, map);
  }

  function getFormState(formId) {
    return readMap(FORM_STATE_KEY)[formId] || null;
  }

  function trackPageView() {
    if (shouldSkip()) return;
    var path = currentPath();
    var viewed = readMap(VIEWED_KEY);
    if (viewed[path]) return;
    viewed[path] = 1;
    writeMap(VIEWED_KEY, viewed);
    track('page_view');
  }

  function announceForm(formId) {
    var state = getFormState(formId);
    if (!state || !state.viewed) {
      markFormState(formId, { viewed: true });
      track('form_view', { formId: formId });
    }
  }

  function bindForm(form) {
    if (!form) return;
    // Listeners are attached once per form; the view is (re)announced on every start() so that a
    // visitor who grants consent on a page that already has forms still gets one form_view.
    var alreadyBound = form.getAttribute('data-an-bound') === '1';
    form.setAttribute('data-an-bound', '1');
    var formId = formIdFromEl(form);
    if (!formId) return;

    announceForm(formId);
    if (alreadyBound) return;

    function onStart() {
      var current = getFormState(formId) || {};
      if (current.started && !current.completed) return;
      if (current.completed) return;
      markFormState(formId, { started: true, completed: false });
      track('form_start', { formId: formId });
    }

    form.addEventListener('input', onStart, { once: false });
    form.addEventListener('change', onStart, { once: false });

    form.addEventListener('submit', function () {
      // Completion is confirmed after success; mark intent only.
      markFormState(formId, { submitAttempt: true });
    });
  }

  function markComplete(formId) {
    if (!formId) return;
    var state = getFormState(formId) || {};
    if (state.completed) return;
    markFormState(formId, { started: true, completed: true });
    track('form_complete', { formId: formId });
  }

  function flushAbandons() {
    if (shouldSkip()) return;
    var map = readMap(FORM_STATE_KEY);
    Object.keys(map).forEach(function (formId) {
      var state = map[formId];
      if (!state || !state.started || state.completed || state.abandoned) return;
      state.abandoned = true;
      map[formId] = state;
      track('form_abandon', { formId: formId, path: state.path || currentPath() });
    });
    writeMap(FORM_STATE_KEY, map);
  }

  function bindAllForms() {
    eligibleForms().forEach(bindForm);
  }

  var thankYouObserved = false;

  function observeThankYou() {
    // Installed once per page load, however many times start() runs. Every handler below ends in
    // markComplete()/track(), which are no-ops whenever consent is not currently granted.
    if (thankYouObserved) return;
    thankYouObserved = true;

    document.addEventListener('nawal:analytics', function (event) {
      var detail = event.detail || {};
      if (detail.event === 'form_complete' && detail.formId) markComplete(detail.formId);
    });

    // When the shared thank-you modal opens, treat nearest tracked form as complete.
    var original = global.nawalThankYou && global.nawalThankYou.show;
    if (typeof original === 'function' && !original.__nyAnWrapped) {
      function wrapped(options) {
        var forms = eligibleForms();
        if (forms.length) markComplete(formIdFromEl(forms[0]));
        return original.call(global.nawalThankYou, options);
      }
      wrapped.__nyAnWrapped = true;
      global.nawalThankYou.show = wrapped;
    }

    // Wadi Rum registration success event buffer
    var push = function (item) {
      if (!item || !item.event) return;
      if (item.event === 'form_submit_success') {
        markComplete((item.params && item.params.form) || 'wadi-rum-registration');
      }
    };
    global.wrEvents = global.wrEvents || [];
    // Events buffered before consent are deliberately NOT replayed.
    var nativePush = global.wrEvents.push.bind(global.wrEvents);
    global.wrEvents.push = function () {
      for (var i = 0; i < arguments.length; i += 1) push(arguments[i]);
      return nativePush.apply(global.wrEvents, arguments);
    };
  }

  function boot() {
    if (shouldSkip()) return;
    trackPageView();
    bindAllForms();
    observeThankYou();
  }

  var domReady = document.readyState !== 'loading';
  var startRequested = false;

  /** Begins tracking once. Safe to call repeatedly; does nothing without current consent. */
  function start() {
    if (running || !consentGranted()) return;
    running = true;
    window.addEventListener('pagehide', flushAbandons);
    window.addEventListener('beforeunload', flushAbandons);
    if (domReady) boot();
    else startRequested = true;
  }

  /** Halts all future events and clears the analytics ids. Leaves every other storage key alone. */
  function stop() {
    running = false;
    startRequested = false;
    window.removeEventListener('pagehide', flushAbandons);
    window.removeEventListener('beforeunload', flushAbandons);
    [SESSION_KEY, VIEWED_KEY, FORM_STATE_KEY].forEach(function (key) {
      try {
        sessionStorage.removeItem(key);
      } catch (_e) {}
    });
  }

  if (!domReady) {
    document.addEventListener('DOMContentLoaded', function () {
      domReady = true;
      if (startRequested && running) {
        startRequested = false;
        boot();
      }
    });
  }

  document.addEventListener('nawal:consentchange', function () {
    if (consentGranted()) start();
    else stop();
  });

  global.nawalAnalytics = {
    track: track,
    markComplete: markComplete,
    formIdFromEl: formIdFromEl,
    start: start,
    stop: stop,
    isRunning: function () {
      return allowed();
    },
  };

  start();
})(window);
