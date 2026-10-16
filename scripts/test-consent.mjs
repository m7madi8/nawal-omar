import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

import { renderSiteFooter } from '../lib/siteChrome.js';

/**
 * Offline tests for the visitor-consent system and its control over analytics (Phase 1).
 *
 * The REAL public/js/consent.js and public/js/site-analytics.js are executed inside a vm context with
 * stubbed browser APIs (storage, document, navigator.sendBeacon, fetch). Nothing touches the network,
 * a database or a payment provider. The visual banner/dialog needs a real DOM: it is NOT covered
 * here (it is checked separately in a real browser).
 */

const root = join(fileURLToPath(import.meta.url), '..', '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');
const CONSENT_SRC = read('public/js/consent.js');
const ANALYTICS_SRC = read('public/js/site-analytics.js');
const DAY = 24 * 60 * 60 * 1000;
const T0 = Date.UTC(2026, 9, 16, 12, 0, 0);

// ---------------------------------------------------------------------------------------------
// Browser stand-in
// ---------------------------------------------------------------------------------------------
function createEnv({ now = T0, readFails = false, writeFails = false, local: seedLocal = {}, session: seedSession = {}, withForm = false } = {}) {
  const clock = { now };
  const flags = { readFails, writeFails };
  const local = new Map(Object.entries(seedLocal));
  const session = new Map(Object.entries(seedSession));

  const localStorage = {
    getItem(key) {
      if (flags.readFails) throw new Error('storage blocked');
      return local.has(key) ? local.get(key) : null;
    },
    setItem(key, value) {
      if (flags.writeFails) throw new Error('quota exceeded');
      local.set(key, String(value));
    },
    removeItem(key) {
      local.delete(key);
    },
  };
  const sessionStorage = {
    getItem: (key) => (session.has(key) ? session.get(key) : null),
    setItem: (key, value) => void session.set(key, String(value)),
    removeItem: (key) => void session.delete(key),
  };

  const sent = [];
  const docListeners = {};
  const winListeners = {};
  const scripts = [];

  const addTo = (map) => (type, fn) => {
    (map[type] ||= []).push(fn);
  };
  const removeFrom = (map) => (type, fn) => {
    map[type] = (map[type] || []).filter((f) => f !== fn);
  };

  const formAttrs = {};
  const formListeners = {};
  const form = {
    id: 'wadiRegForm',
    getAttribute: (k) => (k in formAttrs ? formAttrs[k] : null),
    setAttribute: (k, v) => void (formAttrs[k] = v),
    addEventListener: addTo(formListeners),
    closest: () => null,
  };

  const document = {
    readyState: 'complete',
    referrer: '',
    documentElement: { getAttribute: (k) => (k === 'lang' ? 'en' : null) },
    head: {
      appendChild(node) {
        node.parentNode = this;
        scripts.push(node);
        return node;
      },
      removeChild(node) {
        const i = scripts.indexOf(node);
        if (i >= 0) scripts.splice(i, 1);
        node.parentNode = null;
      },
    },
    body: null, // headless: the visual UI is not built here
    createElement: (tag) => ({ tag, id: '', src: '', parentNode: null }),
    getElementById: (id) => scripts.find((s) => s.id === id) || null,
    addEventListener: addTo(docListeners),
    removeEventListener: removeFrom(docListeners),
    dispatchEvent(event) {
      for (const fn of docListeners[event.type] || []) fn(event);
      return true;
    },
    querySelectorAll: (selector) => (withForm && /form/.test(selector) ? [form] : []),
  };

  class FakeDate extends Date {
    constructor(...args) {
      if (args.length) super(...args);
      else super(clock.now);
    }
    static now() {
      return clock.now;
    }
  }
  class FakeBlob {
    constructor(parts) {
      this.text = parts.join('');
    }
  }
  class FakeCustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  }

  const ctx = {
    document,
    localStorage,
    sessionStorage,
    location: { pathname: '/retreats/wadi-rum', search: '?utm_source=ig&utm_campaign=test', host: 'site.invalid' },
    navigator: {
      sendBeacon(url, blob) {
        sent.push({ via: 'beacon', url, body: blob.text });
        return true;
      },
    },
    fetch(url, init = {}) {
      sent.push({ via: 'fetch', url, body: init.body });
      return Promise.resolve({});
    },
    Blob: FakeBlob,
    CustomEvent: FakeCustomEvent,
    Date: FakeDate,
    URL,
    URLSearchParams,
    addEventListener: addTo(winListeners),
    removeEventListener: removeFrom(winListeners),
    setTimeout,
    console,
  };
  ctx.window = ctx;
  vm.createContext(ctx);

  const loaded = new Set();
  const env = {
    ctx,
    clock,
    flags,
    local,
    session,
    sent,
    scripts,
    winListeners,
    formListeners,
    loadConsent: () => vm.runInContext(CONSENT_SRC, ctx),
    /** Simulates the browser fetching and running every script consent.js appended (once each). */
    flushScripts() {
      for (const node of [...scripts]) {
        if (loaded.has(node)) continue;
        loaded.add(node);
        assert.equal(node.src, '/js/site-analytics.js', 'only the analytics script may be appended');
        vm.runInContext(ANALYTICS_SRC, ctx);
      }
    },
    analyticsEvents: () =>
      sent.filter((s) => s.url === '/api/analytics').map((s) => JSON.parse(s.body)),
    analyticsKeys: () => [...session.keys()].filter((k) => k.startsWith('nawal-an-')),
    fireDoc(type, detail) {
      document.dispatchEvent(new FakeCustomEvent(type, { detail }));
    },
    fireWin(type, event = {}) {
      for (const fn of winListeners[type] || []) fn({ type, ...event });
    },
    consentRecord: () => JSON.parse(local.get('ny-consent') || 'null'),
  };
  return env;
}

/** A visitor page load: consent.js first, then whatever it decided to load. */
function pageLoad(options) {
  const env = createEnv(options);
  env.loadConsent();
  env.flushScripts();
  return env;
}

const analyticsRunning = (env) => !!(env.ctx.nawalAnalytics && env.ctx.nawalAnalytics.isRunning());

// =============================================================================================
// 1. Visitor without a decision: nothing conditional runs
// =============================================================================================
{
  const env = pageLoad({
    session: { 'nawal-an-sid': 's-stale', 'nawal-an-views': '{"/":1}', 'nawal-an-forms': '{}' },
    local: { 'nawal-lang': 'en', 'ice-bath-health-draft-v2': '{"x":1}' },
    withForm: true,
  });
  assert.equal(env.ctx.nawalConsent.has('analytics'), false);
  assert.equal(env.ctx.nawalConsent.has('necessary'), true);
  assert.equal(env.ctx.nawalConsent.getState().decided, false);
  assert.equal(env.scripts.length, 0, 'analytics script is not even loaded');
  assert.deepEqual(env.analyticsEvents(), []);
  assert.deepEqual(env.analyticsKeys(), [], 'stale analytics ids are cleared when there is no consent');
  assert.equal(env.local.get('nawal-lang'), 'en', 'language preference untouched');
  assert.equal(env.local.get('ice-bath-health-draft-v2'), '{"x":1}', 'form drafts untouched');

  // Even if somebody includes site-analytics.js directly, it fails closed.
  vm.runInContext(ANALYTICS_SRC, env.ctx);
  assert.equal(analyticsRunning(env), false);
  env.ctx.nawalAnalytics.track('page_view');
  env.ctx.nawalAnalytics.markComplete('wadi-rum-registration');
  env.ctx.nawalAnalytics.start();
  assert.deepEqual(env.sent, [], 'nothing is sent without consent');
  assert.deepEqual(env.analyticsKeys(), [], 'nothing is stored without consent');

  // Closing UI, ignoring the banner, an unknown category: never consent.
  assert.equal(env.ctx.nawalConsent.has('marketing'), false);
  assert.equal(env.local.has('ny-consent'), false, 'no record is created by merely viewing the page');
}

// A page where site-analytics.js runs without any consent.js at all (fail closed)
{
  const env = createEnv();
  vm.runInContext(ANALYTICS_SRC, env.ctx);
  env.ctx.nawalAnalytics.track('page_view');
  assert.deepEqual(env.sent, []);
  assert.equal(analyticsRunning(env), false);
}

// =============================================================================================
// 2. Accepting analytics: tracking starts exactly once
// =============================================================================================
{
  const env = pageLoad({ withForm: true });
  assert.equal(env.ctx.nawalConsent.acceptAll(), true);
  assert.equal(env.scripts.length, 1, 'one analytics script element');
  assert.equal(env.scripts[0].id, 'ny-site-analytics');
  env.flushScripts();

  const record = env.consentRecord();
  assert.equal(record.version, env.ctx.nawalConsent.policyVersion);
  assert.equal(record.categories.analytics, true);
  assert.equal(record.choice, 'all');
  assert.equal(env.ctx.nawalConsent.has('analytics'), true);
  assert.equal(analyticsRunning(env), true);

  let events = env.analyticsEvents();
  assert.equal(events.filter((e) => e.event === 'page_view').length, 1, 'one page_view');
  assert.equal(events.filter((e) => e.event === 'form_view').length, 1, 'one form_view');
  const pv = events.find((e) => e.event === 'page_view');
  assert.equal(pv.path, '/retreats/wadi-rum');
  assert.equal(pv.utm_source, 'ig');
  assert.ok(pv.sessionId && pv.sessionId !== 's-anon');
  assert.equal(env.winListeners.pagehide.length, 1, 'one pagehide handler');

  // Repeated accept / repeated consent events / repeated start(): still exactly one of everything.
  env.ctx.nawalConsent.acceptAll();
  env.fireDoc('nawal:consentchange', { analytics: true, decided: true });
  env.ctx.nawalAnalytics.start();
  env.flushScripts();
  assert.equal(env.scripts.length, 1, 'script is never appended twice');
  events = env.analyticsEvents();
  assert.equal(events.filter((e) => e.event === 'page_view').length, 1, 'still one page_view');
  assert.equal(events.filter((e) => e.event === 'form_view').length, 1, 'still one form_view');
  assert.equal(env.winListeners.pagehide.length, 1, 'still one pagehide handler');

  // Form interaction is recorded while consent is on.
  for (const fn of env.formListeners.input) fn({});
  assert.equal(env.analyticsEvents().filter((e) => e.event === 'form_start').length, 1);
}

// A later page load with a valid record: analytics start by themselves, once.
{
  const first = pageLoad();
  first.ctx.nawalConsent.acceptAll();
  const later = pageLoad({ local: Object.fromEntries(first.local) });
  assert.equal(later.scripts.length, 1);
  assert.equal(later.analyticsEvents().filter((e) => e.event === 'page_view').length, 1);
  assert.equal(analyticsRunning(later), true);
}

// Granting consent while the script is already resident (stop -> start) works and is not doubled.
{
  const env = pageLoad();
  env.ctx.nawalConsent.acceptAll();
  env.flushScripts();
  env.ctx.nawalConsent.rejectAll();
  const before = env.analyticsEvents().length;
  env.ctx.nawalConsent.acceptAll();
  assert.equal(env.scripts.length, 1, 'resident script is reused, not appended again');
  assert.equal(env.analyticsEvents().length, before + 1, 'exactly one page_view after re-consent');
  assert.equal(env.winListeners.pagehide.length, 1);
}

// =============================================================================================
// 3. Rejecting analytics
// =============================================================================================
{
  const env = pageLoad({ withForm: true });
  assert.equal(env.ctx.nawalConsent.rejectAll(), true);
  env.flushScripts();
  const record = env.consentRecord();
  assert.equal(record.categories.analytics, false);
  assert.equal(record.choice, 'reject');
  assert.equal(env.ctx.nawalConsent.getState().decided, true, 'a rejection is a remembered decision');
  assert.equal(env.ctx.nawalConsent.has('analytics'), false);
  assert.equal(env.scripts.length, 0);
  assert.deepEqual(env.sent, []);
  assert.deepEqual(env.analyticsKeys(), []);

  // "Customize" with analytics off behaves the same.
  assert.equal(env.ctx.nawalConsent.save({ analytics: false }), true);
  assert.equal(env.consentRecord().choice, 'custom');
  assert.deepEqual(env.sent, []);
  // "Customize" with analytics on starts it.
  assert.equal(env.ctx.nawalConsent.save({ analytics: true }), true);
  env.flushScripts();
  assert.equal(analyticsRunning(env), true);
}

// =============================================================================================
// 4. Withdrawing consent stops future events and clears only analytics ids
// =============================================================================================
{
  const env = pageLoad({
    withForm: true,
    local: { 'nawal-lang': 'ar', 'ice-bath-health-draft-v2': '{"fullName":"x"}', 'mountain-voice-retreat-draft': '{"a":1}' },
    session: {
      'nawal.wadiRum.depositCustomer': '{"phone":"x"}',
      'ny-transit': '1',
    },
  });
  env.ctx.nawalConsent.acceptAll();
  env.flushScripts();
  for (const fn of env.formListeners.input) fn({}); // form started => abandon would be sent on pagehide
  assert.equal(analyticsRunning(env), true);
  assert.ok(env.analyticsKeys().length > 0, 'analytics ids exist while consented');

  const seen = [];
  env.ctx.document.addEventListener('nawal:consentchange', (e) => seen.push(e.detail));
  env.ctx.nawalConsent.rejectAll();
  assert.equal(JSON.stringify(seen), JSON.stringify([{ analytics: false, decided: true }]), 'listeners are told about the withdrawal');

  const sentBefore = env.sent.length;
  assert.equal(analyticsRunning(env), false);
  assert.deepEqual(env.analyticsKeys(), [], 'analytics ids removed');
  assert.equal(env.winListeners.pagehide.length, 0, 'pagehide handler removed');
  env.ctx.nawalAnalytics.track('page_view');
  env.ctx.nawalAnalytics.markComplete('wadi-rum-registration');
  for (const fn of env.formListeners.input) fn({});
  env.fireWin('pagehide');
  env.fireWin('beforeunload');
  assert.equal(env.sent.length, sentBefore, 'no event after withdrawal, including form-abandon on page hide');
  assert.deepEqual(env.analyticsKeys(), [], 'nothing re-created after withdrawal');

  // Necessary storage is untouched.
  assert.equal(env.local.get('nawal-lang'), 'ar');
  assert.equal(env.local.get('ice-bath-health-draft-v2'), '{"fullName":"x"}');
  assert.equal(env.local.get('mountain-voice-retreat-draft'), '{"a":1}');
  assert.equal(env.session.get('nawal.wadiRum.depositCustomer'), '{"phone":"x"}');
  assert.equal(env.session.get('ny-transit'), '1');
  assert.ok(env.local.has('ny-consent'), 'the consent record itself is kept');
}

// Withdrawal made in another tab (storage event) is followed immediately.
{
  const env = pageLoad();
  env.ctx.nawalConsent.acceptAll();
  env.flushScripts();
  env.local.set(
    'ny-consent',
    JSON.stringify({ version: env.ctx.nawalConsent.policyVersion, decidedAt: env.clock.now, choice: 'reject', categories: { analytics: false } }),
  );
  env.fireWin('storage', { key: 'ny-consent' });
  assert.equal(analyticsRunning(env), false);
  assert.deepEqual(env.analyticsKeys(), []);
}

// Even if the record changes silently (no event), the live check blocks the next event.
{
  const env = pageLoad();
  env.ctx.nawalConsent.acceptAll();
  env.flushScripts();
  const before = env.sent.length;
  env.local.delete('ny-consent');
  env.ctx.nawalAnalytics.track('page_view');
  assert.equal(env.sent.length, before);
}

// =============================================================================================
// 5. Storage failure is never read as consent
// =============================================================================================
{
  // Unreadable storage on load
  const env = pageLoad({ readFails: true, local: { 'ny-consent': 'whatever' } });
  assert.equal(env.ctx.nawalConsent.getState().reason, 'unavailable');
  assert.equal(env.ctx.nawalConsent.getState().decided, false);
  assert.equal(env.ctx.nawalConsent.has('analytics'), false);
  assert.equal(env.scripts.length, 0);
  assert.deepEqual(env.sent, []);
  vm.runInContext(ANALYTICS_SRC, env.ctx);
  env.ctx.nawalAnalytics.track('page_view');
  assert.deepEqual(env.sent, []);
}
{
  // Unwritable storage: "accept" cannot be saved => stays undecided, analytics stay off
  const env = pageLoad({ writeFails: true });
  assert.equal(env.ctx.nawalConsent.acceptAll(), false);
  assert.equal(env.ctx.nawalConsent.getState().decided, false);
  assert.equal(env.ctx.nawalConsent.has('analytics'), false);
  assert.equal(env.scripts.length, 0, 'analytics script not loaded');
  assert.deepEqual(env.sent, []);
  assert.equal(env.ctx.nawalConsent.save({ analytics: true }), false);
  assert.equal(env.scripts.length, 0);
}
{
  // Storage becomes unreadable while analytics run: the next event is blocked
  const env = pageLoad();
  env.ctx.nawalConsent.acceptAll();
  env.flushScripts();
  const before = env.sent.length;
  env.flags.readFails = true;
  env.ctx.nawalAnalytics.track('page_view');
  assert.equal(env.sent.length, before);
  assert.equal(analyticsRunning(env), false);
}
{
  // Corrupted / forged records are not consent
  const base = { version: '2026-10-16', decidedAt: T0, choice: 'all' };
  const bad = [
    'not json',
    '{}',
    'null',
    '"all"',
    JSON.stringify({ ...base, categories: { analytics: 'true' } }),
    JSON.stringify({ ...base, categories: { analytics: 1 } }),
    JSON.stringify({ ...base, categories: {} }),
    JSON.stringify({ version: base.version, categories: { analytics: true } }), // no timestamp
    JSON.stringify({ ...base, decidedAt: 'yesterday', categories: { analytics: true } }),
    JSON.stringify({ ...base, categories: null }),
  ];
  for (const raw of bad) {
    const env = pageLoad({ local: { 'ny-consent': raw } });
    assert.equal(env.ctx.nawalConsent.has('analytics'), false, `not consent: ${raw}`);
    assert.equal(env.scripts.length, 0, `no script for: ${raw}`);
  }
}

// =============================================================================================
// 6. Expiry and policy version
// =============================================================================================
{
  const probe = createEnv();
  probe.loadConsent();
  const TTL = probe.ctx.nawalConsent.ttlDays;
  assert.equal(TTL, 180);
  const version = probe.ctx.nawalConsent.policyVersion;
  const record = (decidedAt, v = version) =>
    JSON.stringify({ version: v, decidedAt, choice: 'all', categories: { analytics: true } });

  // Valid inside the window
  let env = pageLoad({ local: { 'ny-consent': record(T0 - (TTL - 1) * DAY) } });
  assert.equal(env.ctx.nawalConsent.has('analytics'), true);
  assert.equal(env.scripts.length, 1);

  // Expired: asked again, analytics off, nothing loaded
  env = pageLoad({ local: { 'ny-consent': record(T0 - (TTL + 1) * DAY) } });
  assert.equal(env.ctx.nawalConsent.getState().reason, 'expired');
  assert.equal(env.ctx.nawalConsent.getState().decided, false);
  assert.equal(env.ctx.nawalConsent.has('analytics'), false);
  assert.equal(env.scripts.length, 0);

  // A different policy version: asked again
  env = pageLoad({ local: { 'ny-consent': record(T0 - DAY, '2025-01-01') } });
  assert.equal(env.ctx.nawalConsent.getState().reason, 'policy');
  assert.equal(env.ctx.nawalConsent.has('analytics'), false);
  assert.equal(env.scripts.length, 0);

  // Timestamp in the future (clock tampering): not trusted
  env = pageLoad({ local: { 'ny-consent': record(T0 + 30 * DAY) } });
  assert.equal(env.ctx.nawalConsent.has('analytics'), false);

  // Consent that expires while the page stays open stops the next event
  env = pageLoad();
  env.ctx.nawalConsent.acceptAll();
  env.flushScripts();
  const before = env.sent.length;
  env.clock.now += (TTL + 1) * DAY;
  env.ctx.nawalAnalytics.track('page_view');
  assert.equal(env.sent.length, before, 'expired consent blocks events');
  assert.equal(env.ctx.nawalConsent.getState().reason, 'expired');
}

// =============================================================================================
// 7. Consent has no effect on registration, booking, payment or the server
// =============================================================================================
const stripLineComments = (text) =>
  text
    .split('\n')
    .filter((line) => !line.trim().startsWith('//') && !line.trim().startsWith('*') && !line.trim().startsWith('/*'))
    .join('\n');

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '_archive', 'docs', '.vercel', 'yoga-shop']);
function walk(dir, exts, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
}
const rel = (file) => relative(root, file).replace(/\\/g, '/');

{
  // Server code (API routes, commerce, payment, admin) never looks at the browser consent.
  const serverFiles = [...walk(join(root, 'app', 'api'), ['.js', '.jsx']), ...walk(join(root, 'lib'), ['.js'])];
  // lib/campaigns/engine.js names the consent banner/dialog elements only so a campaign never opens over
  // them. It does not use the consent API or its stored record (scripts/test-campaigns.mjs asserts that).
  const OVERLAY_GUARD = 'lib/campaigns/engine.js';
  for (const file of serverFiles) {
    if (rel(file) === OVERLAY_GUARD) continue;
    const text = read(rel(file));
    assert.ok(!/nawalConsent|ny-consent/.test(text), `${rel(file)} must not depend on browser consent`);
  }

  // Only these browser files may use the consent API.
  const ALLOWED = new Set([
    'public/js/consent.js',
    'public/js/site-analytics.js',
    'public/legacy/js/wadi-rum-registration.js',
    'public/legacy/js/wadi-rum-retreat.js',
  ]);
  const users = walk(join(root, 'public'), ['.js'])
    .map(rel)
    .filter((f) => !f.startsWith('public/admin/'))
    .filter((f) => /nawalConsent|ny-consent/.test(read(f)));
  assert.deepEqual(users.sort(), [...ALLOWED].sort(), 'consent API is used only by the analytics path');

  // Booking / registration / payment scripts do not know about consent at all.
  for (const file of [
    'public/legacy/js/commerce-registration.js',
    'public/legacy/js/wadi-rum-deposit-pay.js',
    'public/legacy/js/wadi-rum-thanks.js',
    'public/legacy/js/payment-thanks.js',
    'public/legacy/js/retreat-request-submit.js',
    'public/legacy/js/hyp-pay-method-picker.js',
    'public/legacy/js/event-checkout-registration.js',
    'public/legacy/js/haifa-registration.js',
    'public/legacy/js/dahab-registration.js',
    'public/legacy/js/ice-bath-form.js',
    'public/js/commerce-cart.js',
    'public/js/thank-you-modal.js',
  ]) {
    assert.ok(!/nawalConsent|ny-consent/.test(read(file)), `${file} must not depend on consent`);
  }

  // Their optional hooks into analytics stay guarded (analytics absent => form still submits).
  for (const file of ['public/legacy/js/wadi-rum-registration.js', 'public/legacy/js/retreat-request-submit.js']) {
    const text = read(file);
    assert.match(text, /nawalAnalytics\s*&&\s*typeof\s+(window|global)\.nawalAnalytics\.markComplete\s*===\s*"function"/, `${file} guards markComplete`);
  }

  // The Wadi Rum bridges to gtag/fbq/clarity/dataLayer sit behind the analytics consent, AFTER the in-memory buffer.
  for (const file of ['public/legacy/js/wadi-rum-registration.js', 'public/legacy/js/wadi-rum-retreat.js']) {
    const text = read(file);
    const push = text.indexOf('window.wrEvents.push({ event: name');
    const gate = text.indexOf('window.nawalConsent.has("analytics")');
    const bridge = text.indexOf('window.dataLayer.push');
    assert.ok(push > 0 && gate > push && bridge > gate, `${file}: buffer, then consent gate, then bridge`);
    for (const tool of ['window.gtag(', 'window.clarity(', 'window.fbq(']) {
      assert.ok(text.indexOf(tool) > gate, `${file}: ${tool} only after the consent gate`);
    }
  }

  // The analytics script is referenced (in code, not comments) only by the consent.js loader.
  const referencing = [...walk(join(root, 'app'), ['.js', '.jsx']), ...walk(join(root, 'components'), ['.js', '.jsx']), ...walk(join(root, 'lib'), ['.js']), ...walk(join(root, 'public'), ['.js'])]
    .map(rel)
    .filter((f) => /site-analytics/.test(stripLineComments(read(f))));
  assert.deepEqual(referencing.sort(), ['public/js/consent.js'], 'nothing else loads site-analytics.js');

  const legacyPage = stripLineComments(read('components/LegacyPage.jsx'));
  assert.ok(!/site-analytics/.test(legacyPage), 'LegacyPage no longer loads the analytics script');
  assert.match(legacyPage, /\{ src: '\/js\/consent\.js' \}/, 'LegacyPage loads the consent module on public pages');
  assert.match(legacyPage, /isAdmin\s*\n?\s*\? filteredScripts/, 'admin pages do not get the public consent/analytics scripts');
  // Page transitions and the other scripts around it are unchanged.
  assert.match(legacyPage, /\{ src: '\/api\/public\/site-config' \}/);
  assert.match(legacyPage, /\{ src: '\/js\/thank-you-modal\.js' \}/);

  // The only sender to /api/analytics is site-analytics.js
  const senders = [...walk(join(root, 'public'), ['.js']), ...walk(join(root, 'components'), ['.jsx'])]
    .map(rel)
    .filter((f) => !f.startsWith('public/admin/'))
    .filter((f) => /\/api\/analytics/.test(stripLineComments(read(f))));
  assert.deepEqual(senders, ['public/js/site-analytics.js'], 'one analytics sender, and it is consent-gated');
}

// =============================================================================================
// 8. Footer link
// =============================================================================================
{
  const footer = renderSiteFooter();
  assert.match(footer, /<a href="\/privacy#cookies" data-ny-cookie-settings[^>]*data-en="Cookie settings" data-ar="إعدادات الكوكيز">Cookie settings<\/a>/);
  assert.match(footer, /<a href="\/privacy" data-en="Privacy" data-ar="الخصوصية">/);
  assert.match(CONSENT_SRC, /closest\('\[data-ny-cookie-settings\]'\)/, 'consent.js handles clicks on the footer link');
  assert.match(CONSENT_SRC, /event\.preventDefault\(\);\s*openPanel\(link\)/);
}

// =============================================================================================
// 9. Arabic / English
// =============================================================================================
{
  const probe = createEnv();
  probe.loadConsent();
  const { en, ar } = probe.ctx.nawalConsent.copy;
  assert.deepEqual(Object.keys(en).sort(), Object.keys(ar).sort(), 'same copy keys in both languages');
  for (const key of Object.keys(en)) {
    assert.ok(typeof en[key] === 'string' && en[key].trim().length > 1, `en.${key}`);
    assert.ok(typeof ar[key] === 'string' && ar[key].trim().length > 1, `ar.${key}`);
    assert.ok(/[\u0600-\u06FF]/.test(ar[key]), `ar.${key} is Arabic`);
    assert.ok(!/[\u0600-\u06FF]/.test(en[key]), `en.${key} is English`);
  }
  // Every key the UI asks for exists.
  const used = new Set([...CONSENT_SRC.matchAll(/text: '([A-Za-z]+)'/g)].map((m) => m[1]));
  for (const key of [...used, 'on', 'off', 'close']) assert.ok(key in en, `copy key used by UI: ${key}`);

  // Equal-weight actions: banner buttons share one class and have no variant classes.
  const bannerButtons = [...CONSENT_SRC.matchAll(/'data-ny-consent': '(accept|reject|customize)'/g)];
  assert.equal(bannerButtons.length, 3);
  assert.equal([...CONSENT_SRC.matchAll(/class: 'ny-consent__btn'/g)].length, 6, 'all action buttons use the same class');

  // Policy page: version matches, bilingual attributes present everywhere, no stray placeholders.
  const pageSrc = read('app/privacy/page.jsx');
  const version = /const POLICY_VERSION = '([^']+)'/.exec(pageSrc)[1];
  assert.equal(version, probe.ctx.nawalConsent.policyVersion, 'privacy page and consent.js share one policy version');
  assert.match(pageSrc, /robots:\s*\{\s*index:\s*true/, 'privacy page is published for search engines');
  assert.doesNotMatch(pageSrc, /DRAFT — not reviewed|مسودة — لم تُراجَع|legal review|قيد المراجعة/);

  const stripped = pageSrc
    .replace(/^import .*$/m, '')
    .replace(/export const metadata/, 'const metadata')
    .replace(/export default function Page[\s\S]*$/, '');
  const html = vm.runInNewContext(`${stripped}\nhtml;`);
  assert.ok(html.includes('id="cookies"'), 'cookies anchor exists');
  assert.ok(html.includes('data-ny-cookie-settings'), 'settings link exists on the policy page too');
  assert.ok(!/undefined|\[object/.test(html), 'no placeholder leaks');
  const pairs = [...html.matchAll(/data-en="([^"]*)" data-ar="([^"]*)"/g)];
  assert.ok(pairs.length > 30);
  for (const [, e, a] of pairs) {
    assert.ok(e.trim() && a.trim(), 'both languages present');
    assert.ok(/[\u0600-\u06FF]/.test(a), `Arabic text present for: ${e.slice(0, 40)}`);
  }
  assert.equal((html.match(/data-en=/g) || []).length, (html.match(/data-ar=/g) || []).length);

  // Every storage key the privacy page lists really exists in code, and every key that code writes is listed.
  const listed = ['nawal-lang', 'ny-consent', 'ny-transit', 'ice-bath-health-draft-v2', 'mountain-voice-retreat-draft', 'nawal.wadiRum.depositCustomer', 'nawal_bk_view', 'yogaFeedbackResponses', 'nawal-an-sid', 'nawal-an-views', 'nawal-an-forms'];
  for (const key of listed) assert.ok(html.includes(key), `privacy page lists ${key}`);

  // Styling rules: logical properties for RTL, reduced motion, no gradients/glow, 44px targets.
  const css = read('public/css/consent.css');
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /html\[dir="rtl"\]/);
  assert.match(css, /inset-inline-end/);
  assert.match(css, /min-height: 44px/);
  assert.ok(!/gradient|glow|backdrop-filter/i.test(css), 'no gradients, glows or blur in the consent styles');
  assert.ok(!/box-shadow:[^;]*\b(\d{2,})px\s+(\d{2,})px/.test(css.replace(/0 (6|10)px (22|30)px/g, '')), 'no heavy shadows');

  // Browser-verified layering/placement (see the browser verification run): the banner must stay UNDER the
  // open mobile menu and the registration/thank-you modals, and must not sit on the hero-copy side.
  const bannerRule = css.match(/\n\.ny-consent \{[^}]*\}/)[0];
  const bannerZ = Number(bannerRule.match(/z-index:\s*(\d+)/)[1]);
  const homeCss = read('public/css/home.css');
  const mobileNavZ = Number(homeCss.match(/\.mobile-nav \{[^}]*?z-index:\s*(\d+)/)[1]);
  const headerZ = Number(homeCss.match(/\.site-header \{[^}]*?z-index:\s*(\d+)/)[1]);
  assert.ok(bannerZ < mobileNavZ, `banner (${bannerZ}) is below the mobile menu (${mobileNavZ})`);
  assert.ok(bannerZ >= headerZ, 'banner is not below the header');
  assert.ok(bannerZ < 300, 'banner is below the registration modals (300)');
  assert.match(bannerRule, /inset-inline-end:/, 'banner sits on the inline-end side (away from hero copy and primary buttons)');
  assert.ok(!/\bleft:|\bright:/.test(bannerRule), 'banner placement uses logical properties only');

  // The banner is only revealed after its stylesheet has applied (no unstyled flash).
  const consentSrc = read('public/js/consent.js');
  assert.match(consentSrc, /if \(want && !cssReady\) return;/);
  assert.match(consentSrc, /link\.addEventListener\('load', onCss\)/);
  assert.match(consentSrc, /link\.addEventListener\('error', onCss\)/);
}

console.log('test-consent: all assertions passed (real consent.js + site-analytics.js in a vm; stubbed storage/network; visual UI not covered here)');
