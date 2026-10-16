/**
 * Campaign engine: the ONE place that decides what a campaign is allowed to be and when it may show.
 * Pure functions only (no React, no DOM unless a document is passed in), so the same code runs in the
 * browser component, on the server (resolve.js) and in the offline tests.
 *
 * What this module never does: send anything anywhere, read cookies, identify a visitor, or touch the
 * booking / payment / consent code. The only thing it persists (and only through the storage object it
 * is handed) is a small per-campaign counter used to avoid repeating a campaign. See docs/CAMPAIGNS.md.
 */

export const STATUSES = Object.freeze(['draft', 'active', 'paused', 'ended']);
export const FORMATS = Object.freeze(['modal', 'strip']);
export const EVENT_REF_TYPES = Object.freeze(['retreat', 'event']);

/** Only these external hosts may be linked from a campaign (https only). Everything else is rejected. */
export const ALLOWED_EXTERNAL_HOSTS = Object.freeze(['wa.me', 'chat.whatsapp.com', 'instagram.com', 'www.instagram.com']);

/**
 * Areas where a promotion must never appear, whatever a campaign asks for: booking, payment, thanks,
 * health forms, private review pages, the privacy page, the link-in-bio page and anything internal.
 * Matched on whole path segments ("/register" covers "/register/wadi-rum/pay", not "/registered").
 */
export const EXCLUDED_PREFIXES = Object.freeze([
  '/admin',
  '/dashboard',
  '/api',
  '/register',
  '/payment',
  '/shop',
  '/health-forms',
  '/feedback',
  '/privacy',
  '/nawal',
  '/wadi-rum-registration',
  '/mountain-voice-registration',
  '/zanzibar-retreat-review-nw2606',
]);

export const STORAGE_KEY = 'ny-campaigns';
/** An entry is forgotten this many days after the visitor last saw / closed that campaign. */
export const RETENTION_DAYS = 90;
/** At most one campaign display (any campaign) per this many hours in a browser. */
export const GLOBAL_GAP_HOURS = 24;
export const TIMING = Object.freeze({
  /** Visible seconds on a page before a strip may appear. */
  stripSeconds: 8,
  /** Visible seconds + a sign of real engagement (scroll / tap / key) before a modal may appear. */
  modalSeconds: 20,
  /** Give up on this page view after this many visible seconds. */
  maxWaitSeconds: 300,
});

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

const ID_RE = /^[a-z0-9][a-z0-9-]{2,63}$/;
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;
const PAGE_RE = /^\/(?:[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*)?(?:\/\*)?$/;
const MEDIA_RE = /^\/media\/[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*\.(?:jpe?g|png|webp|avif)$/i;
// Control characters and bidi-override characters (they can disguise text) are never allowed in copy.
const BAD_TEXT_RE = /[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/;

const CAMPAIGN_KEYS = [
  'id',
  'status',
  'format',
  'title',
  'body',
  'cta',
  'image',
  'startsAt',
  'endsAt',
  'pages',
  'maxImpressions',
  'cooldownDays',
  'eventRef',
];

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

/* ---------------------------------------------------------------------------------------- links */

/**
 * A destination is either an internal path ("/events/sound-healing") or an https link to an allow-listed
 * host. No script, data or other protocol, no protocol-relative URL, no credentials, no whitespace.
 * @returns {{ ok: boolean, external?: boolean, reason?: string }}
 */
export function checkHref(href) {
  if (typeof href !== 'string' || !href) return { ok: false, reason: 'empty' };
  if (href.length > 300) return { ok: false, reason: 'too long' };
  if (/[\u0000-\u0020\u007f-\u009f\\]/.test(href)) return { ok: false, reason: 'whitespace, control or backslash character' };

  if (href.startsWith('/')) {
    if (href.startsWith('//')) return { ok: false, reason: 'protocol-relative URL' };
    let url;
    try {
      url = new URL(href, 'https://nawal.invalid');
    } catch {
      return { ok: false, reason: 'unparsable' };
    }
    if (url.origin !== 'https://nawal.invalid') return { ok: false, reason: 'leaves the site' };
    // Checked on the normalised path, so "/a/../api" and "/%2e%2e/admin" are caught as well.
    if (/^\/(?:api|admin|dashboard)(?:\/|$)/i.test(url.pathname)) return { ok: false, reason: 'internal area' };
    return { ok: true, external: false };
  }

  let url;
  try {
    url = new URL(href);
  } catch {
    return { ok: false, reason: 'not a path or https URL' };
  }
  if (url.protocol !== 'https:') return { ok: false, reason: 'only https is allowed' };
  if (url.username || url.password || url.port) return { ok: false, reason: 'credentials or port in URL' };
  if (!ALLOWED_EXTERNAL_HOSTS.includes(url.hostname.toLowerCase())) return { ok: false, reason: 'host is not allow-listed' };
  return { ok: true, external: true };
}

/* ----------------------------------------------------------------------------------- validation */

/**
 * Validates one campaign definition and returns a clean copy (defaults applied, text trimmed).
 * Unknown keys are errors, so a typo can never silently change behaviour.
 * @returns {{ ok: true, campaign: object } | { ok: false, errors: string[] }}
 */
export function validateCampaign(raw) {
  const errors = [];
  if (!isPlainObject(raw)) return { ok: false, errors: ['campaign must be an object'] };
  const label = typeof raw.id === 'string' ? raw.id : '(no id)';
  const err = (msg) => errors.push(`${label}: ${msg}`);

  for (const key of Object.keys(raw)) {
    if (!CAMPAIGN_KEYS.includes(key)) err(`unknown field "${key}"`);
  }

  const text = (value, name, max, required) => {
    if (value === undefined && !required) return undefined;
    if (!isPlainObject(value)) {
      err(`${name} must have ar and en text`);
      return undefined;
    }
    const out = {};
    for (const lang of ['ar', 'en']) {
      const v = value[lang];
      if (typeof v !== 'string' || !v.trim()) {
        err(`${name}.${lang} is required`);
      } else if (v.trim().length > max) {
        err(`${name}.${lang} is longer than ${max} characters`);
      } else if (BAD_TEXT_RE.test(v)) {
        err(`${name}.${lang} contains control characters`);
      } else {
        out[lang] = v.trim();
      }
    }
    for (const key of Object.keys(value)) if (key !== 'ar' && key !== 'en') err(`${name}.${key} is not a language`);
    return out;
  };

  if (typeof raw.id !== 'string' || !ID_RE.test(raw.id)) err('id must be 3-64 characters: a-z, 0-9 and "-"');
  if (!STATUSES.includes(raw.status)) err(`status must be one of ${STATUSES.join(', ')}`);
  if (!FORMATS.includes(raw.format)) err(`format must be one of ${FORMATS.join(', ')}`);

  const title = text(raw.title, 'title', 80, true);
  const body = text(raw.body, 'body', 220, false);

  let cta;
  const eventRef = raw.eventRef;
  if (!isPlainObject(raw.cta)) {
    err('cta is required');
  } else {
    for (const key of Object.keys(raw.cta)) if (!['label', 'href'].includes(key)) err(`cta.${key} is not allowed`);
    const labelText = text(raw.cta.label, 'cta.label', 32, true);
    let href = raw.cta.href;
    if (href === undefined && eventRef !== undefined) {
      href = undefined; // filled from the catalog by resolve.js
    } else {
      const check = checkHref(href);
      if (!check.ok) err(`cta.href is not allowed (${check.reason})`);
    }
    cta = { label: labelText, ...(href !== undefined ? { href } : {}) };
  }

  let image;
  if (raw.image !== undefined) {
    const img = raw.image;
    if (!isPlainObject(img)) {
      err('image must be an object');
    } else {
      for (const key of Object.keys(img)) if (!['src', 'alt', 'width', 'height'].includes(key)) err(`image.${key} is not allowed`);
      if (typeof img.src !== 'string' || !MEDIA_RE.test(img.src) || img.src.split('/').includes('..')) {
        err('image.src must be a local /media/... jpg, png, webp or avif file');
      }
      // The alt text may be empty (decorative image) but must be stated in both languages.
      const alt = isPlainObject(img.alt) ? img.alt : null;
      if (!alt || typeof alt.ar !== 'string' || typeof alt.en !== 'string') {
        err('image.alt needs ar and en (use "" for a decorative image)');
      } else if (BAD_TEXT_RE.test(alt.ar) || BAD_TEXT_RE.test(alt.en) || alt.ar.length > 140 || alt.en.length > 140) {
        err('image.alt is too long or has control characters');
      }
      for (const dim of ['width', 'height']) {
        if (!Number.isInteger(img[dim]) || img[dim] < 1 || img[dim] > 6000) err(`image.${dim} must be a whole number (pixels)`);
      }
      if (!errors.some((e) => e.startsWith(`${label}: image`))) {
        image = { src: img.src, alt: { ar: img.alt.ar, en: img.alt.en }, width: img.width, height: img.height };
      }
    }
  }

  const dates = {};
  for (const key of ['startsAt', 'endsAt']) {
    if (raw[key] === undefined) continue;
    if (typeof raw[key] !== 'string' || !ISO_RE.test(raw[key]) || !Number.isFinite(Date.parse(raw[key]))) {
      err(`${key} must be an ISO date-time with an explicit offset, e.g. 2026-11-01T09:00:00+02:00`);
    } else {
      dates[key] = raw[key];
    }
  }
  if (dates.startsAt && dates.endsAt && Date.parse(dates.endsAt) <= Date.parse(dates.startsAt)) err('endsAt must be after startsAt');

  let pages;
  if (!Array.isArray(raw.pages) || raw.pages.length === 0 || raw.pages.length > 40) {
    err('pages must be a list of 1-40 page patterns');
  } else {
    pages = [];
    for (const p of raw.pages) {
      const okShape = typeof p === 'string' && (p === '*' || (PAGE_RE.test(p) && !p.split('/').some((s) => s === '.' || s === '..')));
      if (!okShape) err(`page pattern "${String(p).slice(0, 40)}" is not valid (use "/path", "/path/*" or "*")`);
      else if (!pages.includes(p)) pages.push(p);
    }
  }

  const intField = (value, name, min, max, fallback) => {
    if (value === undefined) return fallback;
    if (!Number.isInteger(value) || value < min || value > max) {
      err(`${name} must be a whole number from ${min} to ${max}`);
      return fallback;
    }
    return value;
  };
  const maxImpressions = intField(raw.maxImpressions, 'maxImpressions', 1, 10, 2);
  const cooldownDays = intField(raw.cooldownDays, 'cooldownDays', 1, 90, 7);

  let ref;
  if (eventRef !== undefined) {
    if (
      !isPlainObject(eventRef) ||
      !EVENT_REF_TYPES.includes(eventRef.type) ||
      typeof eventRef.id !== 'string' ||
      !/^[a-z0-9][a-z0-9-]{1,63}$/.test(eventRef.id) ||
      Object.keys(eventRef).some((k) => k !== 'type' && k !== 'id')
    ) {
      err('eventRef must be { type: "retreat" | "event", id }');
    } else {
      ref = { type: eventRef.type, id: eventRef.id };
    }
  }

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    campaign: {
      id: raw.id,
      status: raw.status,
      format: raw.format,
      title,
      ...(body ? { body } : {}),
      cta,
      ...(image ? { image } : {}),
      ...dates,
      pages,
      maxImpressions,
      cooldownDays,
      ...(ref ? { eventRef: ref } : {}),
    },
  };
}

/** Validates a list; invalid and duplicate-id campaigns are dropped (never thrown), with their errors reported. */
export function normalizeCampaigns(list) {
  const campaigns = [];
  const errors = [];
  if (!Array.isArray(list)) return { campaigns, errors: ['campaign list must be an array'] };
  const seen = new Set();
  for (const raw of list) {
    const result = validateCampaign(raw);
    if (!result.ok) {
      errors.push(...result.errors);
      continue;
    }
    if (seen.has(result.campaign.id)) {
      errors.push(`${result.campaign.id}: duplicate id`);
      continue;
    }
    seen.add(result.campaign.id);
    campaigns.push(result.campaign);
  }
  return { campaigns, errors };
}

/* -------------------------------------------------------------------------------------- paths */

export function normalizePath(path) {
  if (typeof path !== 'string') return '/';
  let p = path.split(/[?#]/)[0];
  if (!p.startsWith('/')) p = `/${p}`;
  p = p.replace(/\/{2,}/g, '/');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return p || '/';
}

export function isExcludedPath(path) {
  const p = normalizePath(path).toLowerCase();
  return EXCLUDED_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));
}

export function pageMatches(patterns, path) {
  const p = normalizePath(path);
  return patterns.some((pattern) => {
    if (pattern === '*') return true;
    if (pattern.endsWith('/*')) return p.startsWith(`${pattern.slice(0, -2)}/`);
    return p === normalizePath(pattern);
  });
}

function isDestinationPage(campaign, path) {
  const href = campaign.cta && campaign.cta.href;
  if (typeof href !== 'string' || !href.startsWith('/')) return false;
  return normalizePath(href) === normalizePath(path);
}

/* ------------------------------------------------------------------------------------- storage */

function validTime(value, now) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= now + DAY;
}

/**
 * Reads the local record. `available: false` means the browser would not let us read storage at all.
 * Anything malformed is treated as "nothing recorded" for that part, never as an error.
 * @returns {{ available: boolean, last: number, campaigns: Record<string, {n:number,t:number}> }}
 */
export function readRecord(storage, now) {
  const unavailable = { available: false, last: 0, campaigns: Object.create(null) };
  let raw;
  try {
    if (!storage || typeof storage.getItem !== 'function') return unavailable;
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return unavailable;
  }
  const out = { available: true, last: 0, campaigns: Object.create(null) };
  if (typeof raw !== 'string' || !raw) return out;
  let rec;
  try {
    rec = JSON.parse(raw);
  } catch {
    return out;
  }
  if (!isPlainObject(rec) || rec.v !== 1 || !isPlainObject(rec.c)) return out;
  if (validTime(rec.l, now)) out.last = rec.l;
  for (const id of Object.keys(rec.c)) {
    const entry = rec.c[id];
    if (!ID_RE.test(id) || !isPlainObject(entry)) continue;
    const n = entry.n;
    if (!Number.isInteger(n) || n < 0 || n > 1000 || !validTime(entry.t, now)) continue;
    if (now - entry.t > RETENTION_DAYS * DAY) continue; // forgotten after the retention period
    out.campaigns[id] = { n, t: entry.t };
  }
  return out;
}

function writeRecord(storage, record) {
  const c = {};
  for (const id of Object.keys(record.campaigns)) c[id] = { n: record.campaigns[id].n, t: record.campaigns[id].t };
  const payload = JSON.stringify({ v: 1, l: record.last, c });
  try {
    storage.setItem(STORAGE_KEY, payload);
    return storage.getItem(STORAGE_KEY) === payload; // read it back: a silent write failure must not look like success
  } catch {
    return false;
  }
}

/** Counts one display. Returns false (and the campaign must NOT be shown) if it could not be remembered. */
export function commitImpression(storage, id, now) {
  const record = readRecord(storage, now);
  if (!record.available || !ID_RE.test(id)) return false;
  const prev = record.campaigns[id] || { n: 0, t: 0 };
  record.campaigns[id] = { n: Math.min(prev.n + 1, 1000), t: now };
  record.last = now;
  return writeRecord(storage, record);
}

/** Remembers that the visitor closed (or acted on) a campaign: starts its cool-down. Best effort. */
export function commitDismiss(storage, id, now) {
  const record = readRecord(storage, now);
  if (!record.available || !ID_RE.test(id)) return false;
  const prev = record.campaigns[id] || { n: 1, t: 0 };
  record.campaigns[id] = { n: prev.n, t: now };
  return writeRecord(storage, record);
}

/* ------------------------------------------------------------------------------------- rules */

const no = (reason) => ({ eligible: false, reason });

/**
 * Pure rule check for one campaign. `ctx = { now, pathname, record }` (record from readRecord).
 * Order matters only for the reported reason: any single failing rule means "do not show".
 */
export function evaluateCampaign(campaign, ctx) {
  if (!campaign || campaign.status !== 'active') return no('status');
  const now = ctx.now;
  if (campaign.startsAt && now < Date.parse(campaign.startsAt)) return no('not-started');
  if (campaign.endsAt && now >= Date.parse(campaign.endsAt)) return no('ended');
  if (isExcludedPath(ctx.pathname)) return no('page-excluded');
  if (!pageMatches(campaign.pages, ctx.pathname)) return no('page-not-listed');
  if (isDestinationPage(campaign, ctx.pathname)) return no('is-destination');
  const record = ctx.record;
  if (!record || record.available !== true) return no('storage-unavailable'); // cannot remember => do not show
  const seen = hasOwn(record.campaigns, campaign.id) ? record.campaigns[campaign.id] : { n: 0, t: 0 };
  if (seen.n >= campaign.maxImpressions) return no('max-impressions');
  if (seen.t && now - seen.t < campaign.cooldownDays * DAY) return no('cooldown');
  if (record.last && now - record.last < GLOBAL_GAP_HOURS * HOUR) return no('global-gap');
  return { eligible: true };
}

/** First eligible campaign in list order (list order is priority). One campaign per page view, at most. */
export function selectCampaign(campaigns, ctx) {
  const decisions = [];
  for (const campaign of campaigns) {
    const result = evaluateCampaign(campaign, ctx);
    decisions.push({ id: campaign.id, ...result });
    if (result.eligible) return { campaign, decisions };
  }
  return { campaign: null, decisions };
}

/* ---------------------------------------------------------------------------------- overlays */

/**
 * Things that are already on screen (or about to be) and must not be covered by a campaign.
 * Explicit selectors name the site's own dialogs, sticky bars and menus; the generic check below catches
 * any other visible aria-modal dialog.
 */
export const BLOCKER_SELECTORS = Object.freeze([
  '#ny-consent-banner:not([hidden])',
  '#ny-consent-panel:not([hidden])',
  '.ny-thanks:not([hidden])',
  '.mobile-nav.is-open',
  '.mobile-nav.is-closing',
  '.ib-register-modal:not([hidden])',
  '.haifa-register-modal:not([hidden])',
  '.haifa-register-success:not([hidden])',
  '.wr-sticky.is-visible',
]);

const isOurs = (el) => !!(el && typeof el.closest === 'function' && el.closest('[data-ny-campaign]'));

function defaultIsVisible(el) {
  if (typeof el.closest === 'function' && el.closest('[hidden],[aria-hidden="true"]')) return false;
  if (typeof globalThis.getComputedStyle !== 'function') return true;
  const style = globalThis.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

function isTextEntry(el) {
  if (!el || !el.tagName) return false;
  const tag = String(el.tagName).toLowerCase();
  if (tag === 'textarea' || tag === 'select') return true;
  if (tag === 'input') {
    const type = String(el.type || 'text').toLowerCase();
    return !['button', 'submit', 'reset', 'checkbox', 'radio', 'image', 'range', 'color', 'file'].includes(type);
  }
  return el.isContentEditable === true;
}

/**
 * @returns {string|null} the name of whatever is blocking, or null when the page is clear.
 * `ignoreTyping` is for an already-visible campaign: typing in a field must not make it flicker away.
 */
export function findUiBlocker(doc, { isVisible = defaultIsVisible, ignoreTyping = false } = {}) {
  if (!doc || typeof doc.querySelector !== 'function') return null;
  for (const selector of BLOCKER_SELECTORS) {
    let el = null;
    try {
      el = doc.querySelector(selector);
    } catch {
      el = null;
    }
    if (el && !isOurs(el)) return selector;
  }
  if (typeof doc.querySelectorAll === 'function') {
    for (const el of doc.querySelectorAll('[aria-modal="true"]')) {
      if (!isOurs(el) && isVisible(el)) return '[aria-modal]';
    }
  }
  const body = doc.body;
  if (body && body.classList && body.classList.contains('nav-open')) return 'nav-open';
  if (body && body.style && body.style.overflow === 'hidden') return 'scroll-locked';
  if (!ignoreTyping && isTextEntry(doc.activeElement)) return 'typing';
  return null;
}
