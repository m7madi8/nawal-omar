import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ALLOWED_EXTERNAL_HOSTS,
  BLOCKER_SELECTORS,
  EXCLUDED_PREFIXES,
  GLOBAL_GAP_HOURS,
  RETENTION_DAYS,
  STORAGE_KEY,
  TIMING,
  checkHref,
  commitDismiss,
  commitImpression,
  evaluateCampaign,
  findUiBlocker,
  isExcludedPath,
  normalizeCampaigns,
  normalizePath,
  pageMatches,
  readRecord,
  selectCampaign,
  validateCampaign,
} from '../lib/campaigns/engine.js';
import { resolveCampaigns } from '../lib/campaigns/resolve.js';
import { CAMPAIGNS } from '../lib/campaigns/campaigns.js';
import { getCatalogItem } from '../lib/commerce/catalog/index.js';

/**
 * Offline tests for the campaign system. The rules, validation, storage and overlay guard are the REAL
 * lib/campaigns/engine.js; nothing touches the network, a database, a payment provider or the consent
 * record. The visual UI (components/CampaignHost.jsx + public/css/campaigns.css) needs a real browser and
 * is NOT run here: it is checked separately in Chrome. This file only inspects its source for the rules
 * that can be asserted statically.
 */

const root = join(fileURLToPath(import.meta.url), '..', '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const T0 = Date.UTC(2026, 10, 2, 10, 0, 0); // a fixed "now"

const copy = (ar, en) => ({ ar, en });
const base = (over = {}) => ({
  id: 'sample-campaign',
  status: 'active',
  format: 'strip',
  title: copy('عنوان', 'Title'),
  body: copy('نص قصير', 'Short text'),
  cta: { label: copy('اكتشفي', 'Discover'), href: '/events/sound-healing' },
  pages: ['/', '/events'],
  ...over,
});
const must = (raw) => {
  const r = validateCampaign(raw);
  assert.ok(r.ok, r.errors && r.errors.join('; '));
  return r.campaign;
};

function memoryStorage(seed = {}) {
  const data = new Map(Object.entries(seed));
  return {
    data,
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => void data.set(k, String(v)),
    removeItem: (k) => void data.delete(k),
  };
}
const throwingStorage = (when) => ({
  getItem() {
    if (when === 'read' || when === 'both') throw new Error('blocked');
    return null;
  },
  setItem() {
    if (when === 'write' || when === 'both') throw new Error('quota');
  },
});
// A storage that "accepts" writes but forgets them (some private modes do exactly this).
const forgetfulStorage = () => ({ getItem: () => null, setItem() {} });

const ctx = (storage, over = {}) => ({ now: T0, pathname: '/', record: readRecord(storage, over.now ?? T0), ...over });

// ---------------------------------------------------------------------------------------------
// 1. Inactive campaigns, time window
// ---------------------------------------------------------------------------------------------
{
  const storage = memoryStorage();
  for (const status of ['draft', 'paused', 'ended']) {
    const r = evaluateCampaign(must(base({ status })), ctx(storage));
    assert.deepEqual([r.eligible, r.reason], [false, 'status'], `${status} never shows`);
  }
  assert.equal(evaluateCampaign(must(base()), ctx(storage)).eligible, true, 'active + in window + listed page shows');

  const windowed = must(base({ startsAt: '2026-11-03T09:00:00+02:00', endsAt: '2026-11-10T09:00:00+02:00' }));
  const at = (iso) => evaluateCampaign(windowed, ctx(storage, { now: Date.parse(iso) }));
  assert.equal(at('2026-11-03T06:59:59Z').reason, 'not-started', 'before startsAt');
  assert.equal(at('2026-11-03T07:00:00Z').eligible, true, 'startsAt is inclusive');
  assert.equal(at('2026-11-10T06:59:59Z').eligible, true, 'just before endsAt');
  assert.equal(at('2026-11-10T07:00:00Z').reason, 'ended', 'endsAt is exclusive');
  assert.equal(at('2027-01-01T00:00:00Z').reason, 'ended', 'long after endsAt');

  // Dates without an explicit offset or with a bad shape are refused (no timezone guessing).
  for (const bad of ['2026-11-03', '2026-11-03T09:00:00', '2026-13-03T09:00:00Z', 'tomorrow', 12345, '']) {
    assert.equal(validateCampaign(base({ startsAt: bad })).ok, false, `startsAt ${JSON.stringify(bad)} is rejected`);
  }
  assert.equal(validateCampaign(base({ startsAt: '2026-11-10T00:00:00Z', endsAt: '2026-11-03T00:00:00Z' })).ok, false, 'end before start');
}

// ---------------------------------------------------------------------------------------------
// 2. Pages: allow-list, wildcards, hard exclusions, destination page
// ---------------------------------------------------------------------------------------------
{
  const storage = memoryStorage();
  const c = must(base({ pages: ['/', '/events', '/retreats/*'] }));
  const at = (pathname) => evaluateCampaign(c, ctx(storage, { pathname }));
  assert.equal(at('/').eligible, true);
  assert.equal(at('/events').eligible, true);
  assert.equal(at('/events/').eligible, true, 'trailing slash');
  assert.equal(at('/events?x=1#top').eligible, true, 'query and hash are ignored');
  assert.equal(at('/retreats/zanzibar').eligible, true, 'wildcard covers children');
  assert.equal(at('/retreats').reason, 'page-not-listed', '"/retreats/*" does not include the hub itself');
  assert.equal(at('/yoga').reason, 'page-not-listed');
  assert.equal(at('/eventsx').reason, 'page-not-listed', 'exact match is by whole path');

  // "*" means every public page, but never the excluded areas.
  const all = must(base({ pages: ['*'] }));
  for (const prefix of EXCLUDED_PREFIXES) {
    for (const path of [prefix, `${prefix}/anything`, `${prefix.toUpperCase()}/x`]) {
      assert.equal(evaluateCampaign(all, ctx(storage, { pathname: path })).reason, 'page-excluded', `${path} is excluded`);
    }
  }
  assert.equal(evaluateCampaign(all, ctx(storage, { pathname: '/yoga' })).eligible, true);
  // Whole-segment matching: a similarly named page is not swallowed by an exclusion.
  assert.equal(isExcludedPath('/registered-events'), false);
  assert.equal(isExcludedPath('/shopping-guide'), false);
  // Booking, payment, thanks, health and private pages specifically:
  for (const p of ['/register/wadi-rum', '/register/wadi-rum/pay', '/register/wadi-rum/thanks', '/payment/thanks', '/payment/demo', '/shop/thanks', '/health-forms', '/register/ice-bath', '/feedback/some-slug', '/privacy', '/nawal', '/admin/dashboard', '/wadi-rum-registration', '/mountain-voice-registration']) {
    assert.equal(isExcludedPath(p), true, `${p} is excluded`);
  }

  // A campaign is not shown on the very page it points to.
  const dest = must(base({ pages: ['*'], cta: { label: copy('ا', 'a'), href: '/events/sound-healing' } }));
  assert.equal(evaluateCampaign(dest, ctx(storage, { pathname: '/events/sound-healing' })).reason, 'is-destination');
  assert.equal(evaluateCampaign(dest, ctx(storage, { pathname: '/events/sound-healing/' })).reason, 'is-destination');
  assert.equal(evaluateCampaign(dest, ctx(storage, { pathname: '/events' })).eligible, true);

  assert.equal(normalizePath('events//x/?q#h'), '/events/x');
  assert.equal(normalizePath(''), '/');
  assert.equal(normalizePath(undefined), '/');
  assert.equal(pageMatches(['/a/*'], '/a'), false);

  // Page patterns themselves are validated.
  for (const bad of ['events', '/events x', '/../admin', '/a/../b', '//evil', '/ev?q', '', 'http://x', '/*', '**']) {
    assert.equal(validateCampaign(base({ pages: [bad] })).ok, false, `pattern ${JSON.stringify(bad)} is rejected`);
  }
  assert.equal(validateCampaign(base({ pages: [] })).ok, false, 'at least one page is required');
}

// ---------------------------------------------------------------------------------------------
// 3. Close, remember the close, cool-down, impressions, global gap
// ---------------------------------------------------------------------------------------------
{
  const storage = memoryStorage();
  const c = must(base({ maxImpressions: 3, cooldownDays: 7 }));

  assert.equal(evaluateCampaign(c, ctx(storage)).eligible, true, 'first visit');
  assert.equal(commitImpression(storage, c.id, T0), true, 'a display is recorded');
  assert.equal(evaluateCampaign(c, ctx(storage, { now: T0 + 5 * 60_000 })).reason, 'cooldown', 'not shown again minutes later');

  // Closing it restarts the cool-down from the moment of closing and remembers it across reloads.
  const closeAt = T0 + 3 * DAY;
  assert.equal(commitDismiss(storage, c.id, closeAt), true);
  const reload = (now) => evaluateCampaign(c, { now, pathname: '/', record: readRecord(storage, now) }); // fresh "page load"
  assert.equal(reload(closeAt + 6 * DAY).reason, 'cooldown', 'still quiet 6 days after closing');
  assert.equal(reload(closeAt + 7 * DAY - 1).reason, 'cooldown', 'quiet until the cool-down ends');
  assert.equal(reload(closeAt + 7 * DAY).eligible, true, 'cool-down over: allowed again');

  // Impression cap.
  assert.equal(commitImpression(storage, c.id, closeAt + 8 * DAY), true);
  commitDismiss(storage, c.id, closeAt + 8 * DAY);
  assert.equal(commitImpression(storage, c.id, closeAt + 20 * DAY), true);
  assert.equal(reload(closeAt + 90 * DAY - 1).reason, 'max-impressions', 'three impressions is the cap');

  // Global gap: a second, different campaign does not follow right after the first.
  const s2 = memoryStorage();
  const a = must(base({ id: 'campaign-a' }));
  const b = must(base({ id: 'campaign-b' }));
  assert.equal(commitImpression(s2, a.id, T0), true);
  const sel = (now) => selectCampaign([a, b], { now, pathname: '/', record: readRecord(s2, now) });
  assert.equal(sel(T0 + HOUR).campaign, null, 'no other campaign within the global gap');
  assert.equal(sel(T0 + HOUR).decisions.find((d) => d.id === 'campaign-b').reason, 'global-gap');
  assert.equal(sel(T0 + GLOBAL_GAP_HOURS * HOUR).campaign.id, 'campaign-b', 'after the gap the next campaign may show');
  assert.equal(sel(T0 + GLOBAL_GAP_HOURS * HOUR).decisions.length, 2);

  // One campaign per view, first eligible in list order wins.
  assert.equal(selectCampaign([a, b], ctx(memoryStorage())).campaign.id, 'campaign-a');
  assert.equal(selectCampaign([], ctx(memoryStorage())).campaign, null);

  // Retention: the record forgets a campaign RETENTION_DAYS after its last activity (and prunes it on write).
  const old = memoryStorage();
  commitImpression(old, 'ancient-campaign', T0);
  const later = T0 + (RETENTION_DAYS + 1) * DAY;
  assert.equal(Object.keys(readRecord(old, later).campaigns).length, 0, 'expired entry is forgotten');
  commitImpression(old, 'fresh-campaign', later);
  const stored = JSON.parse(old.getItem(STORAGE_KEY));
  assert.deepEqual(Object.keys(stored.c), ['fresh-campaign'], 'expired entry is removed on the next write');
  assert.equal(readRecord(old, T0 + 30 * DAY).campaigns['ancient-campaign']?.n, undefined);
  commitImpression(old, 'recent-campaign', later + DAY);
  assert.ok(readRecord(old, later + DAY + (RETENTION_DAYS - 1) * DAY).campaigns['recent-campaign'], 'kept within the retention period');

  // What is stored: only counters and times, keyed by campaign id. No text, URL, language, path or person.
  const probe = memoryStorage();
  commitImpression(probe, 'wadi-rum-sample', T0);
  const payload = JSON.parse(probe.getItem(STORAGE_KEY));
  assert.deepEqual(Object.keys(payload).sort(), ['c', 'l', 'v']);
  assert.deepEqual(Object.keys(payload.c['wadi-rum-sample']).sort(), ['n', 't']);
  assert.deepEqual([...probe.data.keys()], [STORAGE_KEY], 'exactly one storage key is written');
  assert.ok(probe.getItem(STORAGE_KEY).length < 120, 'tiny record');
}

// ---------------------------------------------------------------------------------------------
// 4. Storage failures: predictable, quiet, never a loop
// ---------------------------------------------------------------------------------------------
{
  const c = must(base());
  for (const when of ['read', 'write', 'both']) {
    const storage = throwingStorage(when);
    let result;
    assert.doesNotThrow(() => {
      result = [readRecord(storage, T0).available, commitImpression(storage, c.id, T0), commitDismiss(storage, c.id, T0)];
    }, `${when}: no exception escapes`);
    if (when !== 'write') assert.equal(result[0], false, `${when}: storage reported unavailable`);
    assert.equal(result[1], false, `${when}: an impression cannot be recorded => the campaign must not be shown`);
    assert.equal(result[2], false, `${when}: dismissing never throws`);
  }
  for (const storage of [null, undefined, {}, { getItem: 'nope' }]) {
    assert.equal(readRecord(storage, T0).available, false);
    assert.equal(commitImpression(storage, c.id, T0), false);
  }
  // Unreadable => not eligible. Never "show it anyway".
  assert.equal(evaluateCampaign(c, ctx(throwingStorage('read'))).reason, 'storage-unavailable');
  assert.equal(evaluateCampaign(c, { now: T0, pathname: '/', record: null }).reason, 'storage-unavailable');
  assert.equal(evaluateCampaign(c, { now: T0, pathname: '/' }).reason, 'storage-unavailable');
  // Silent write loss is detected by the read-back, so it cannot cause a re-display on every page.
  assert.equal(commitImpression(forgetfulStorage(), c.id, T0), false, 'a write that is not remembered is a failure');
  // Even with no storage, the loop is impossible: nothing is shown, so nothing can repeat.
  for (let i = 0; i < 5; i += 1) {
    assert.equal(selectCampaign([c], { now: T0 + i * 1000, pathname: '/', record: readRecord(throwingStorage('both'), T0) }).campaign, null);
  }

  // Corrupt / hostile records are ignored or repaired, not trusted.
  const bad = [
    'not json',
    '[]',
    'null',
    '{"v":2,"l":1,"c":{}}',
    '{"v":1,"c":[]}',
    `{"v":1,"l":${T0 + 400 * DAY},"c":{"sample-campaign":{"n":99,"t":${T0 + 400 * DAY}}}}`, // timestamps far in the future
    '{"v":1,"l":1,"c":{"sample-campaign":{"n":-1,"t":1}}}',
    '{"v":1,"l":1,"c":{"sample-campaign":{"n":1.5,"t":1}}}',
    '{"v":1,"l":1,"c":{"__proto__":{"n":9,"t":1},"constructor":{"n":9,"t":1}}}',
  ];
  for (const raw of bad) {
    const storage = memoryStorage({ [STORAGE_KEY]: raw });
    const record = readRecord(storage, T0);
    assert.equal(record.available, true, `corrupt record is not "unavailable": ${raw.slice(0, 30)}`);
    assert.equal(Object.keys(record.campaigns).length, 0, `no entries trusted from: ${raw.slice(0, 30)}`);
    assert.ok(record.last === 0 || T0 - record.last > GLOBAL_GAP_HOURS * HOUR, 'no recent "last shown" is trusted from a corrupt record');
    assert.equal(evaluateCampaign(c, { now: T0, pathname: '/', record }).eligible, true, 'a repaired record behaves like a first visit');
    assert.equal(commitImpression(storage, c.id, T0), true, 'the next write replaces the corrupt value');
  }
  // Ids that collide with Object.prototype names are ordinary ids (no prototype pollution / lookup leaks).
  for (const id of ['constructor', 'tostring', 'hasownproperty', 'valueof']) {
    const cc = must(base({ id }));
    const storage = memoryStorage();
    assert.equal(evaluateCampaign(cc, ctx(storage)).eligible, true, `${id}: first visit`);
    commitImpression(storage, id, T0);
    assert.equal(evaluateCampaign(cc, ctx(storage, { now: T0 + 1000 })).reason, 'cooldown', `${id}: remembered`);
  }
  assert.equal({}.n, undefined, 'Object.prototype is untouched');
}

// ---------------------------------------------------------------------------------------------
// 5. Never over another dialog, sticky bar, menu or the consent UI
// ---------------------------------------------------------------------------------------------
{
  const el = ({ ours = false, hiddenAncestor = false, shown = true } = {}) => ({
    closest: (sel) => (sel === '[data-ny-campaign]' ? (ours ? {} : null) : sel.startsWith('[hidden]') ? (hiddenAncestor ? {} : null) : null),
    __shown: shown,
  });
  const makeDoc = ({ present = [], modals = [], bodyClasses = [], overflow = '', active = null } = {}) => ({
    querySelector: (sel) => (present.includes(sel) ? el() : null),
    querySelectorAll: (sel) => (sel === '[aria-modal="true"]' ? modals : []),
    body: { classList: { contains: (c) => bodyClasses.includes(c) }, style: { overflow } },
    activeElement: active,
  });
  const isVisible = (e) => e.__shown && !e.closest('[hidden],[aria-hidden="true"]');

  assert.equal(findUiBlocker(makeDoc(), { isVisible }), null, 'a clear page has no blocker');
  assert.equal(findUiBlocker(null), null, 'no document => nothing to block (server side)');

  // Every dialog / bar the site owns is named, and each one blocks on its own.
  const wanted = [
    '#ny-consent-banner:not([hidden])',
    '#ny-consent-panel:not([hidden])',
    '.ny-thanks:not([hidden])',
    '.mobile-nav.is-open',
    '.mobile-nav.is-closing',
    '.ib-register-modal:not([hidden])',
    '.haifa-register-modal:not([hidden])',
    '.wr-sticky.is-visible',
  ];
  for (const selector of wanted) {
    assert.ok(BLOCKER_SELECTORS.includes(selector), `${selector} is a blocker`);
    assert.equal(findUiBlocker(makeDoc({ present: [selector] }), { isVisible }), selector);
  }
  // Generic dialogs: visible blocks, hidden or inside aria-hidden does not (the closed mobile menu).
  assert.equal(findUiBlocker(makeDoc({ modals: [el({ shown: true })] }), { isVisible }), '[aria-modal]');
  assert.equal(findUiBlocker(makeDoc({ modals: [el({ hiddenAncestor: true })] }), { isVisible }), null);
  assert.equal(findUiBlocker(makeDoc({ modals: [el({ shown: false })] }), { isVisible }), null);
  assert.equal(findUiBlocker(makeDoc({ modals: [el({ ours: true })] }), { isVisible }), null, 'its own dialog never blocks itself');
  assert.equal(findUiBlocker(makeDoc({ bodyClasses: ['nav-open'] }), { isVisible }), 'nav-open');
  assert.equal(findUiBlocker(makeDoc({ overflow: 'hidden' }), { isVisible }), 'scroll-locked', 'another modal locked the scroll');
  // Typing in a field blocks a NEW campaign but does not hide one that is already showing.
  const field = { tagName: 'INPUT', type: 'text' };
  assert.equal(findUiBlocker(makeDoc({ active: field }), { isVisible }), 'typing');
  assert.equal(findUiBlocker(makeDoc({ active: field }), { isVisible, ignoreTyping: true }), null);
  assert.equal(findUiBlocker(makeDoc({ active: { tagName: 'TEXTAREA' } }), { isVisible }), 'typing');
  assert.equal(findUiBlocker(makeDoc({ active: { tagName: 'INPUT', type: 'checkbox' } }), { isVisible }), null);
  assert.equal(findUiBlocker(makeDoc({ active: { tagName: 'BUTTON' } }), { isVisible }), null);

  // The selectors match what the pages really render (so the guard is not aimed at nothing).
  const siteChrome = read('lib/siteChrome.js');
  assert.match(siteChrome, /class="mobile-nav"/);
  assert.match(read('public/js/consent.js'), /id: 'ny-consent-banner'/);
  assert.match(read('public/js/consent.js'), /id: 'ny-consent-panel'/);
  assert.match(read('public/js/thank-you-modal.js'), /className = "ny-thanks"/);
  assert.match(read('public/legacy/css/wadi-rum-retreat.css'), /\.wr-sticky\.is-visible/);
  assert.match(read('public/legacy/css/register-modal-shell.css'), /\.ib-register-modal:not\(\[hidden\]\)/);
  assert.match(read('public/legacy/css/jiva-page.css'), /\.haifa-register-modal/);
}

// ---------------------------------------------------------------------------------------------
// 6. Languages: Arabic and English copy is required and escaped
// ---------------------------------------------------------------------------------------------
{
  const noAr = base({ title: { en: 'Only English' } });
  const noEn = base({ title: { ar: 'عربي فقط' } });
  assert.equal(validateCampaign(noAr).ok, false, 'title.ar is required');
  assert.equal(validateCampaign(noEn).ok, false, 'title.en is required');
  assert.equal(validateCampaign(base({ body: { ar: 'نص' } })).ok, false, 'body needs both languages when present');
  assert.equal(validateCampaign(base({ cta: { label: { ar: 'زر' }, href: '/events' } })).ok, false, 'cta.label needs both languages');
  assert.equal(validateCampaign(base({ title: { ar: 'ع', en: 'e', fr: 'f' } })).ok, false, 'unknown language key');
  assert.equal(validateCampaign(base({ body: undefined })).ok, true, 'body is optional');

  const campaign = must(base());
  assert.equal(campaign.title.ar, 'عنوان');
  assert.equal(campaign.title.en, 'Title');
  assert.ok(/[\u0600-\u06FF]/.test(campaign.cta.label.ar));

  // Text is plain text: length limits, no control or bidi-override characters. HTML is not interpreted
  // (the component renders text nodes only; asserted below), so markup would show literally.
  assert.equal(validateCampaign(base({ title: copy('ع'.repeat(81), 'x') })).ok, false, 'title length cap');
  assert.equal(validateCampaign(base({ body: copy('ع', 'x'.repeat(221)) })).ok, false, 'body length cap');
  assert.equal(validateCampaign(base({ title: copy('ع', 'ab\u202ecd') })).ok, false, 'bidi override is rejected');
  assert.equal(validateCampaign(base({ title: copy('ع', 'ab\u0000cd') })).ok, false, 'control character is rejected');
  assert.equal(validateCampaign(base({ title: copy('   ', 'x') })).ok, false, 'blank text is rejected');
  assert.equal(must(base({ title: copy('  ع  ', '  x  ') })).title.en, 'x', 'text is trimmed');

  // The component carries both UI languages and follows the html lang attribute.
  const host = read('components/CampaignHost.jsx');
  assert.match(host, /const UI = \{[\s\S]*en: \{[^}]*close:[^}]*later:[^}]*\},[\s\S]*ar: \{[^}]*close:[^}]*later:[^}]*\}/);
  assert.match(host, /getAttribute\('lang'\) === 'en' \? 'en' : 'ar'/);
  assert.match(host, /attributeFilter: \['lang'\]/);
  assert.match(read('public/css/campaigns.css'), /html\[dir="rtl"\]/);
  const stripRule = read('public/css/campaigns.css').match(/\n\.ny-campaign--strip \{[^}]*\}/)[0];
  assert.match(stripRule, /inset-inline-end:/, 'strip sits on the inline-end side, away from hero copy and primary buttons (like the consent banner)');
  assert.ok(!/inset-inline-start:/.test(stripRule));
  const arClose = host.match(/ar: \{[^}]*close: '([^']+)'/)[1];
  assert.ok(/[\u0600-\u06FF]/.test(arClose));
}

// ---------------------------------------------------------------------------------------------
// 7. Unsafe destinations, images and unknown fields
// ---------------------------------------------------------------------------------------------
{
  const safe = ['/events', '/events/sound-healing', '/retreats/wadi-rum?ref=home', '/#join', 'https://wa.me/972500000000', 'https://instagram.com/nawal_aom', 'https://www.instagram.com/x/', 'https://chat.whatsapp.com/abc'];
  for (const href of safe) assert.equal(checkHref(href).ok, true, `${href} is allowed`);
  assert.equal(checkHref('https://wa.me/1').external, true);
  assert.equal(checkHref('/events').external, false);

  const unsafe = [
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    '  javascript:alert(1)',
    '\tjavascript:alert(1)',
    'java\nscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'blob:https://x/y',
    'file:///etc/passwd',
    'tel:+972500000000',
    'mailto:a@b.c',
    '//evil.example/path',
    '///evil.example',
    '/\\evil.example',
    '\\\\evil.example',
    'http://wa.me/1', // not https
    'https://evil.example/',
    'https://wa.me.evil.example/',
    'https://evil.example/wa.me',
    'https://user:pass@wa.me/1',
    'https://wa.me:8443/1',
    'https://WA.ME.evil.example',
    'events', // relative
    './events',
    '../events',
    '/api/commerce/checkout',
    '/api',
    '/admin',
    '/admin/dashboard',
    '/dashboard',
    '/a/../api/x',
    '/%2e%2e/admin',
    '/events x',
    `/${'a'.repeat(400)}`,
    '',
    null,
    undefined,
    42,
    {},
  ];
  for (const href of unsafe) {
    assert.equal(checkHref(href).ok, false, `${JSON.stringify(href)} is rejected`);
    if (typeof href === 'string') {
      assert.equal(validateCampaign(base({ cta: { label: copy('ا', 'a'), href } })).ok, false, `campaign with ${JSON.stringify(href).slice(0, 40)} is rejected`);
    }
  }
  assert.ok(ALLOWED_EXTERNAL_HOSTS.every((h) => !h.includes('*')), 'allow-list is exact hosts');

  // Images: local /media files only, with stated size and alt in both languages.
  const img = { src: '/media/wadi-rum/cover.jpg', alt: copy('صورة', 'Photo'), width: 1200, height: 800 };
  assert.equal(validateCampaign(base({ format: 'modal', image: img })).ok, true);
  assert.equal(validateCampaign(base({ image: { ...img, alt: copy('', '') } })).ok, true, 'decorative image: empty alt is allowed');
  for (const src of ['https://evil.example/a.jpg', '//evil.example/a.jpg', '/media/../secret.jpg', '/media/a.svg', '/media/a.jpg?x=1', '/other/a.jpg', 'data:image/png;base64,AAAA', 'javascript:1', '/media/a b.jpg']) {
    assert.equal(validateCampaign(base({ image: { ...img, src } })).ok, false, `image ${src} is rejected`);
  }
  assert.equal(validateCampaign(base({ image: { ...img, width: 0 } })).ok, false, 'width is required (no layout shift)');
  assert.equal(validateCampaign(base({ image: { src: img.src, alt: img.alt } })).ok, false);
  assert.equal(validateCampaign(base({ image: { ...img, alt: { ar: 'x' } } })).ok, false, 'alt needs both languages');

  // Typos and extras never silently pass.
  for (const extra of [{ pageExclusions: ['/x'] }, { html: '<b>x</b>' }, { script: 'alert(1)' }, { priority: 1 }, { discount: '20%' }, { seatsLeft: 3 }, { price: 100 }]) {
    assert.equal(validateCampaign(base(extra)).ok, false, `unknown field ${Object.keys(extra)[0]} is rejected`);
  }
  assert.equal(validateCampaign(base({ cta: { label: copy('ا', 'a'), href: '/events', onclick: 'x' } })).ok, false, 'unknown cta field');
  for (const bad of ['Upper', 'a', 'has space', '../x', 'x'.repeat(65), '', 7, null]) {
    assert.equal(validateCampaign(base({ id: bad })).ok, false, `id ${JSON.stringify(bad)} is rejected`);
  }
  assert.equal(validateCampaign(base({ status: 'live' })).ok, false);
  assert.equal(validateCampaign(base({ format: 'popup' })).ok, false);
  assert.equal(validateCampaign(base({ maxImpressions: 0 })).ok, false);
  assert.equal(validateCampaign(base({ maxImpressions: 11 })).ok, false);
  assert.equal(validateCampaign(base({ cooldownDays: 0 })).ok, false);
  assert.equal(validateCampaign(base({ cooldownDays: 1.5 })).ok, false);
  assert.equal(validateCampaign(null).ok, false);
  assert.equal(validateCampaign('x').ok, false);
  assert.equal(validateCampaign([]).ok, false);
  // Defaults.
  assert.equal(must(base()).maxImpressions, 2);
  assert.equal(must(base()).cooldownDays, 7);

  // A bad campaign is dropped with a message; the rest still work. Duplicate ids are refused.
  const list = normalizeCampaigns([base(), base({ id: 'broken-one', cta: { label: copy('ا', 'a'), href: 'javascript:1' } }), base()]);
  assert.deepEqual(list.campaigns.map((c) => c.id), ['sample-campaign']);
  assert.equal(list.errors.length, 2);
  assert.equal(normalizeCampaigns('nope').campaigns.length, 0);
}

// ---------------------------------------------------------------------------------------------
// 8. Linking a campaign to the catalog (no copied prices, dates or seats)
// ---------------------------------------------------------------------------------------------
{
  const linked = (over = {}) =>
    base({ id: 'event-linked', cta: { label: copy('ا', 'a') }, eventRef: { type: 'retreat', id: 'wadi-rum' }, pages: ['/', '/events'], ...over });
  const wr = getCatalogItem('retreat', 'wadi-rum');
  assert.ok(wr, 'catalog has the Wadi Rum retreat');

  // Used only as a TEST of the system: nothing here is shipped.
  const open = resolveCampaigns({ campaigns: [linked()] });
  assert.deepEqual(open.errors, []);
  assert.equal(open.campaigns.length, 1);
  const shipped = open.campaigns[0];
  assert.equal(shipped.cta.href, wr.metadata.pagePath, 'destination comes from the catalog');
  assert.equal(shipped.eventRef, undefined, 'eventRef is not sent to the browser');
  assert.equal(shipped.endsAt, `${wr.date}T00:00:00Z`, 'it stops when the event starts');
  assert.ok(!JSON.stringify(shipped).includes(String(wr.pricing.amount)), 'no price in the shipped campaign');
  assert.ok(!/capacity|seats|price|amount|rooms/i.test(JSON.stringify(shipped)));
  assert.equal(evaluateCampaign(shipped, ctx(memoryStorage(), { now: Date.parse('2026-10-16T09:00:00Z'), pathname: '/' })).eligible, true);
  assert.equal(evaluateCampaign(shipped, ctx(memoryStorage(), { now: Date.parse(`${wr.date}T00:00:00Z`), pathname: '/' })).reason, 'ended');
  assert.equal(evaluateCampaign(shipped, ctx(memoryStorage(), { now: Date.parse('2026-10-16T09:00:00Z'), pathname: '/retreats/wadi-rum' })).reason, 'page-not-listed');

  // An earlier explicit end is kept; a later one is pulled back to the event start.
  assert.equal(resolveCampaigns({ campaigns: [linked({ endsAt: '2026-10-18T00:00:00Z' })] }).campaigns[0].endsAt, '2026-10-18T00:00:00Z');
  assert.equal(resolveCampaigns({ campaigns: [linked({ endsAt: '2027-01-01T00:00:00Z' })] }).campaigns[0].endsAt, `${wr.date}T00:00:00Z`);
  // A start after the event begins can never run.
  assert.equal(resolveCampaigns({ campaigns: [linked({ startsAt: '2026-12-01T00:00:00Z' })] }).campaigns.length, 0);

  // Closed or unknown catalog items are not promoted.
  for (const id of ['zanzibar', 'dahab']) {
    assert.notEqual(getCatalogItem('retreat', id).bookingStatus, 'open', `${id} is closed in the catalog`);
    const r = resolveCampaigns({ campaigns: [linked({ eventRef: { type: 'retreat', id } })] });
    assert.equal(r.campaigns.length, 0, `${id}: closed => not shipped`);
  }
  const unknown = resolveCampaigns({ campaigns: [linked({ eventRef: { type: 'retreat', id: 'nowhere' } })] });
  assert.equal(unknown.campaigns.length, 0);
  assert.equal(unknown.errors.length, 1);
  assert.equal(resolveCampaigns({ campaigns: [linked({ eventRef: { type: 'order', id: 'wadi-rum' } })] }).campaigns.length, 0, 'only retreat/event refs');
  // A catalog item that is closed at test time (injected lookup) stops an otherwise active campaign.
  const closedLookup = () => ({ ...wr, bookingStatus: 'closed' });
  assert.equal(resolveCampaigns({ campaigns: [linked()], lookup: closedLookup }).campaigns.length, 0);

  // Only active campaigns ever leave the server; drafts, paused and ended are not even sent.
  const mixed = resolveCampaigns({
    campaigns: ['draft', 'active', 'paused', 'ended'].map((status) => base({ id: `c-${status}`, status })),
  });
  assert.deepEqual(mixed.campaigns.map((c) => c.id), ['c-active']);

  // Phase guard: the repository ships NO active campaign. The one entry is an inactive test fixture.
  // When a real campaign is approved and activated, update this assertion deliberately.
  assert.ok(CAMPAIGNS.length >= 1);
  assert.ok(CAMPAIGNS.every((c) => c.status !== 'active'), 'no campaign is active in this release');
  assert.equal(resolveCampaigns().campaigns.length, 0, 'nothing is sent to the browser');
  assert.equal(resolveCampaigns().errors.length, 0, 'the shipped definitions are valid');
  const sample = CAMPAIGNS.find((c) => c.id === 'wadi-rum-sample');
  assert.equal(sample.status, 'draft');
  assert.equal(validateCampaign(sample).ok, true, 'the fixture is a valid campaign');
  const sampleText = JSON.stringify(sample);
  assert.ok(!/\d/.test(sampleText.replace(/wadi-rum-sample|"maxImpressions":2|"cooldownDays":7/g, '')), 'fixture has no prices, dates or counts');
  assert.ok(!/(left|remaining|limited|discount|offer|hurry|last|spots|places|بقيت|متبقي|أماكن|خصم|عرض خاص|احجزي الآن)/i.test(sampleText), 'no scarcity or discount claims');
  // Wired so that nothing renders unless a campaign is active.
  const layout = read('app/layout.jsx');
  assert.match(layout, /getClientCampaigns\(\)/);
  assert.match(layout, /campaigns\.length > 0 \? <CampaignLoader campaigns=\{campaigns\} \/> : null/);
  const loader = read('components/CampaignLoader.jsx');
  assert.match(loader, /dynamic\(\(\) => import\('@\/components\/CampaignHost'\), \{ ssr: false \}\)/, 'the UI is a separate script, loaded only when rendered');
  assert.ok(!/^import .*CampaignHost/m.test(layout), 'the layout never imports the UI statically');
}

// ---------------------------------------------------------------------------------------------
// 9. Not intrusive: timing, no exit-intent, no scroll lock, no auto-open, keyboard + motion
// ---------------------------------------------------------------------------------------------
{
  assert.ok(TIMING.stripSeconds >= 5, 'a strip never appears immediately');
  assert.ok(TIMING.modalSeconds >= 15 && TIMING.modalSeconds > TIMING.stripSeconds, 'a modal waits longer than a strip');
  assert.ok(TIMING.maxWaitSeconds >= TIMING.modalSeconds && TIMING.maxWaitSeconds <= 600, 'it gives up eventually');
  assert.ok(GLOBAL_GAP_HOURS >= 12);

  const host = read('components/CampaignHost.jsx');
  const code = host.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  // No exit-intent, no pointer tracking, no visibility tricks to pop something up.
  assert.ok(!/mouseleave|mouseout|mouseenter|mousemove|pointermove|beforeunload|unload|pagehide|visibilitychange|popstate|blur\b/.test(code), 'no exit-intent or pointer tracking');
  // Shown only from the timer, after the rules; never on mount.
  assert.match(code, /timer = window\.setInterval\(tick, 1000\)/);
  assert.match(code, /document\.visibilityState === 'hidden'\) return/, 'time only counts while the tab is visible');
  assert.match(code, /candidate\.format === 'modal' && !engaged/, 'a modal needs real engagement first');
  assert.match(code, /if \(findUiBlocker\(document\)\) return;/);
  assert.match(code, /if \(!commitImpression\(storage, candidate\.id, Date\.now\(\)\)\) \{/, 'fails closed if it cannot remember');
  assert.match(code, /if \(!cssOk\)/, 'never shown unstyled');
  // Page scroll is never locked and nothing is stolen from the page.
  assert.ok(!/\.overflow\b|scrollTo|scrollIntoView|preventDefault\(\)[\s\S]{0,40}scroll|disableBodyScroll/.test(code.replace(/event\.preventDefault\(\);\s*dismiss/, '')), 'no scroll lock');
  assert.ok(!/document\.body\.style/.test(code));
  assert.ok(!/autoFocus|\.focus\(\)[\s\S]{0,80}strip/.test(code));
  // Escape closes the modal; focus is contained and restored; the control labels exist.
  assert.match(code, /event\.key === 'Escape'/);
  assert.match(code, /aria-modal="true"/);
  assert.match(code, /aria-labelledby=\{titleId\}/);
  assert.match(code, /back\.focus\(\)/);
  assert.match(code, /aria-label=\{copy\.close\}/);
  assert.match(code, /onClick=\{dismiss\}/);
  // Strips are non-modal: no dialog role, no focus trap.
  const stripPart = code.slice(code.indexOf('<aside'));
  assert.ok(!/role="dialog"|aria-modal/.test(stripPart));
  // Links from data: target/rel set for external, and rendered as attributes (never HTML).
  assert.match(code, /target: '_blank', rel: 'noopener noreferrer'/);
  assert.ok(!/dangerouslySetInnerHTML|innerHTML|insertAdjacentHTML|document\.write|eval\(|new Function/.test(code), 'text only, never HTML');
  assert.ok(!/href=\{[^}]*\+/.test(code), 'href is never concatenated');

  // Styles: flat, tokens, RTL-safe, 44px targets, reduced motion, visible focus, layering below other UI.
  const css = read('public/css/campaigns.css');
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /focus-visible/);
  assert.match(css, /\.ny-campaign\[hidden\]/);
  assert.match(css, /min-height: 44px/);
  assert.ok(!/gradient|glow|backdrop-filter|blur\(/i.test(noComments), 'no gradients, glow or blur');
  assert.ok(!/@import|url\(|https?:\/\//i.test(noComments), 'no external or imported resources in the stylesheet');
  assert.ok(!/box-shadow:[^;]*\b(\d{2,})px\s+(\d{2,})px/.test(noComments.replace(/0 (6|10)px (22|30)px/g, '')), 'no heavy shadows');
  assert.ok(!/(?<![-a-z])(left|right)\s*:/.test(noComments), 'placement uses logical properties');
  const z = (re, source) => Number(source.match(re)[1]);
  const strip = z(/\.ny-campaign--strip \{[^}]*?z-index:\s*(\d+)/, css);
  const modal = z(/\.ny-campaign--modal \{[^}]*?z-index:\s*(\d+)/, css);
  const consentBanner = z(/\n\.ny-consent \{[^}]*?z-index:\s*(\d+)/, read('public/css/consent.css'));
  const consentPanel = z(/\.ny-consent-panel \{[^}]*?z-index:\s*(\d+)/, read('public/css/consent.css'));
  const home = read('public/css/home.css');
  const header = z(/\.site-header \{[^}]*?z-index:\s*(\d+)/, home);
  const mobileNav = z(/\.mobile-nav \{[^}]*?z-index:\s*(\d+)/, home);
  const thanks = z(/\.ny-thanks \{[^}]*?z-index:\s*(\d+)/, home);
  const registerModal = z(/z-index:\s*(\d+)/, read('public/legacy/css/register-modal-shell.css'));
  const wrSticky = z(/\.wr-sticky \{[^}]*?z-index:\s*(\d+)/, read('public/legacy/css/wadi-rum-retreat.css'));
  for (const layer of [strip, modal]) {
    assert.ok(layer > header, `campaign layer ${layer} is above the header (${header})`);
    assert.ok(layer < consentBanner, `campaign layer ${layer} is below the consent banner (${consentBanner})`);
    assert.ok(layer < mobileNav && layer < registerModal && layer < consentPanel && layer < thanks, 'below every other dialog');
  }
  assert.ok(strip > wrSticky, 'the script, not the z-order, keeps the strip away from the sticky bar (it hides while it is visible)');
  // The consent UI is independent: campaign files neither import nor name its API or stored record.
  assert.equal(readFileSync(join(root, 'public/css/consent.css'), 'utf8').includes('ny-campaign'), false);
}

// ---------------------------------------------------------------------------------------------
// 10. No tracking, no network, no effect on booking / payment / consent
// ---------------------------------------------------------------------------------------------
{
  const files = [
    'lib/campaigns/engine.js',
    'lib/campaigns/resolve.js',
    'lib/campaigns/campaigns.js',
    'components/CampaignHost.jsx',
    'public/css/campaigns.css',
  ];
  const strip = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  for (const file of files) {
    const code = strip(read(file));
    assert.ok(!/gtag|fbq|clarity\.ms|\bclarity\(|dataLayer|googletag|google-analytics|facebook\.net|\bpixel\b|hotjar|mixpanel|posthog|utm_|adsbygoogle|doubleclick|nawalAnalytics|site-analytics|\/api\/analytics/i.test(code), `${file}: no tracking or ad tools`);
    assert.ok(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|new Image\(|navigator\.|\.cookie|indexedDB|sessionStorage|caches\b|fingerprint|canvas|userAgent|geolocation|ipify/i.test(code), `${file}: no network, cookie, fingerprint or device access`);
    assert.ok(!/process\.env|\.env\b|supabase|stripe|hyp|payment\/|commerce\/(checkout|orders|payment|booking)|from '[^']*(orders|checkout|payment|booking|invoices|receipts)[^']*'/i.test(code.replace(/process\.env\.NODE_ENV|BOOKING_STATUS|bookingStatus/g, '')), `${file}: no database, payment or booking code`);
    assert.ok(!/nawalConsent|\bny-consent['"`]|nawal-lang|nawal_bk|health-draft|retreat-draft|depositCustomer|localStorage\.(get|set)Item\(\s*['"`](?!ny-campaigns)/i.test(code.replace(/#ny-consent-(banner|panel):not\(\[hidden\]\)/g, '')), `${file}: no consent API/record, language store, booking cookie or form drafts`);
  }
  // The engine writes exactly one key and reads no other.
  const engineCode = strip(read('lib/campaigns/engine.js'));
  assert.deepEqual([...engineCode.matchAll(/(?:get|set|remove)Item\(([^)]*)\)/g)].map((m) => m[1].split(',')[0].trim()).sort(), ['STORAGE_KEY', 'STORAGE_KEY', 'STORAGE_KEY']);
  // The only external URLs anywhere in the campaign code are the allow-listed link hosts (data, not requests).
  for (const file of ['lib/campaigns/engine.js', 'lib/campaigns/resolve.js', 'components/CampaignHost.jsx', 'lib/campaigns/campaigns.js']) {
    const hosts = [...strip(read(file)).matchAll(/https?:\/\/([a-z0-9.-]+)/gi)].map((m) => m[1].toLowerCase());
    for (const host of hosts) assert.ok(host === 'nawal.invalid', `${file}: unexpected URL host ${host}`);
  }
  // The shipped definitions never name an external host.
  assert.ok(!/https?:/.test(read('lib/campaigns/campaigns.js').replace(/\/\*[\s\S]*?\*\//g, '')));

  // Records are isolated: running every storage operation leaves other keys byte-for-byte untouched.
  const others = {
    'ny-consent': '{"version":"2026-10-16","decidedAt":1,"choice":"reject","categories":{"analytics":false}}',
    'ice-bath-health-draft-v2': 'DRAFT-PLACEHOLDER',
    'mountain-voice-retreat-draft': 'DRAFT-PLACEHOLDER',
    'nawal.wadiRum.depositCustomer': 'CUSTOMER-PLACEHOLDER',
    'nawal-lang': 'ar',
    'ny-transit': '1',
  };
  const storage = memoryStorage(others);
  commitImpression(storage, 'sample-campaign', T0);
  commitDismiss(storage, 'sample-campaign', T0 + 1000);
  commitImpression(storage, 'other-campaign', T0 + 2 * DAY);
  readRecord(storage, T0 + 3 * DAY);
  for (const [key, value] of Object.entries(others)) assert.equal(storage.getItem(key), value, `${key} is untouched`);
  assert.deepEqual([...storage.data.keys()].sort(), [...Object.keys(others), STORAGE_KEY].sort(), 'only its own key was added');

  // The component is a client-only add-on at the layout level. The consent test also asserts that the
  // consent API is used only by the analytics path, and the guard above shows campaigns never use it.
  const loaded = readFileSync(join(root, 'components/LegacyPage.jsx'), 'utf8');
  assert.ok(!/CampaignHost|ny-campaign|lib\/campaigns/.test(loaded), 'LegacyPage (page shell, consent and thank-you loading) is not touched');
  assert.ok(!/CampaignHost|ny-campaign|lib\/campaigns/.test(read('public/js/consent.js')), 'consent.js is not touched');
  assert.ok(!/CampaignHost|ny-campaign|lib\/campaigns/.test(read('public/js/thank-you-modal.js')), 'thank-you-modal.js is not touched');

  // No file outside the campaign system references it, except the layout mount.
  const SKIP = new Set(['node_modules', '.next', '.git', '_archive', 'docs', '.vercel', 'scripts']);
  const walk = (dir, out = []) => {
    for (const name of readdirSync(dir)) {
      if (SKIP.has(name)) continue;
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full, out);
      else if (/\.(jsx?|mjs|css)$/.test(name)) out.push(full);
    }
    return out;
  };
  const referencing = walk(root)
    .map((f) => relative(root, f).replace(/\\/g, '/'))
    .filter((f) => /CampaignHost|lib\/campaigns|ny-campaigns|campaigns\.css/.test(read(f)))
    .sort();
  const OWN = (f) => f.startsWith('lib/campaigns/') || f === 'components/CampaignHost.jsx' || f === 'components/CampaignLoader.jsx' || f === 'public/css/campaigns.css' || f === 'app/layout.jsx' || f === 'app/privacy/page.jsx' /* documents the storage key only */;
  assert.deepEqual(referencing.filter((f) => !OWN(f)), [], 'nothing outside the campaign files, the layout mount and the privacy text refers to the system');
  assert.ok(referencing.includes('app/layout.jsx') && referencing.includes('components/CampaignHost.jsx'));
  assert.ok(!referencing.some((f) => /^(app\/api|lib\/commerce|public\/(js|legacy|admin))/.test(f)), 'no API, commerce, payment, booking or page script references campaigns');
}

console.log('test-campaigns: all assertions passed (real engine; stubbed storage; UI source checked statically; visual behaviour NOT covered here)');
