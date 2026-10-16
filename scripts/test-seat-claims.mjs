import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { RETREAT_CATALOG } from '../lib/commerce/catalog/retreats.js';
import { WADI_RUM_DEPOSIT_ILS } from '../lib/commerce/constants.js';

/**
 * No unverified "seats left" claim may be shown to visitors.
 *
 * The site has no reliable source for remaining places (the availability endpoint reports reserved=0
 * for retreats), so a figure such as "About 10 spots left" must not exist in any page, script or
 * translation file. Also checks that the surrounding page content and the booking catalog are unchanged.
 */

const root = join(fileURLToPath(import.meta.url), '..', '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '_archive', 'docs', '.vercel', 'scripts', 'postman', '.postman', '.cursor', '.idea', '.vscode']);
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(js|jsx|mjs|html|json)$/.test(name) && !/package(-lock)?\.json$/.test(name)) out.push(full);
  }
  return out;
}

const FORBIDDEN = [
  [/\bspots?\s+left\b/i, 'English "spots left"'],
  [/\b(?:places|seats)\s+left\b/i, 'English "places/seats left"'],
  [/\babout\s+\d+\s+(?:spots?|seats?|places?)\b/i, 'English "about N spots"'],
  [/\b\d+\s+(?:spots?|seats?|places?)\s+(?:left|remaining|available)\b/i, 'English "N spots remaining"'],
  [/باقي\s+(?:حوالي\s+|تقريبًا\s+|فقط\s+)?[\d٠-٩]+\s*(?:أماكن|اماكن|مقاعد|مقعد|مكان)/, 'Arabic "باقي N أماكن"'],
  [/[\d٠-٩]+\s*(?:أماكن|اماكن|مقاعد)\s+(?:متبقية|متاحة|فقط)/, 'Arabic "N أماكن متبقية"'],
  [/retreat_wadi_spots_left/, 'removed translation key'],
  [/wr-spots\b/, 'removed class wr-spots in markup'],
  [/wr-cta-panel__spots/, 'removed class wr-cta-panel__spots in markup'],
];

const hits = [];
for (const file of walk(root)) {
  const rel = relative(root, file).replace(/\\/g, '/');
  const text = readFileSync(file, 'utf8');
  for (const [re, label] of FORBIDDEN) {
    if (re.test(text)) hits.push(`${rel}: ${label}`);
  }
}
assert.deepEqual(hits, [], `unverified seat claims found:\n${hits.join('\n')}`);

// The translation file really lost the key in both languages, in every copy that exists.
for (const file of ['public/legacy/js/i18n.js', 'js/i18n.js']) {
  const text = read(file);
  assert.ok(!text.includes('retreat_wadi_spots_left'), `${file}: key removed`);
  assert.ok(!text.includes('About 10 spots'), `${file}: EN text removed`);
  assert.ok(!text.includes('باقي حوالي 10'), `${file}: AR text removed`);
  // Neighbouring keys are still there (nothing else was lost).
  assert.ok(text.includes('retreat_wadi_hero_urgency'), `${file}: hero urgency key kept`);
  assert.ok(text.includes('retreat_wadi_price_place'), `${file}: price place key kept`);
}

// The Wadi Rum page keeps its content and design hooks.
const page = read('app/retreats/wadi-rum/page.jsx');
assert.match(page, /<p class="wr-hero__urgency"><span data-i18n="retreat_wadi_hero_urgency">/, 'hero line kept');
assert.match(page, /<p class="wr-cta-panel__dates"[^>]*data-i18n="retreat_wadi_price_dates">22–26\.10\.2026<\/p>/, 'dates kept');
assert.match(page, /<p class="wr-cta-panel__place" data-i18n="retreat_wadi_price_place">Wadi Rum, Jordan<\/p>\s*<\/div>/, 'place kept and panel head closed properly');
assert.match(page, /wr-cta-panel__rooms/, 'room cards kept');
assert.equal((page.match(/data-i18n="retreat_wadi_hero_urgency"/g) || []).length, 1);

// Booking catalog untouched: no price, capacity or status change.
const wadi = RETREAT_CATALOG['wadi-rum'];
assert.equal(wadi.capacity, 20);
assert.equal(wadi.bookingStatus, 'open');
assert.equal(wadi.rooms.panorama.amount, 3650);
assert.equal(wadi.rooms.bubbles.amount, 3850);
assert.equal(WADI_RUM_DEPOSIT_ILS, 400);

// No code derives a public seat count from the unreliable availability endpoint.
const clientCode = walk(join(root, 'public')).concat(walk(join(root, 'components'))).concat(walk(join(root, 'app')).filter((f) => !/[\\/]api[\\/]/.test(f)));
for (const file of clientCode) {
  const text = readFileSync(file, 'utf8');
  assert.ok(!/commerce\/availability/.test(text), `${relative(root, file)} must not read /api/commerce/availability`);
}

console.log('test-seat-claims: all assertions passed');
