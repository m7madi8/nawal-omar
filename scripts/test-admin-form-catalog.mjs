/**
 * Ensures every public form submission source is wired into admin/workspace.js
 * (catalog cards, filters, and SOURCE_LABELS).
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const workspace = readFileSync(join(root, 'public/admin/workspace.js'), 'utf8');

function parseSourceArray(varName) {
  const re = new RegExp(`var ${varName} = (\\[[\\s\\S]*?\\]);`);
  const m = workspace.match(re);
  assert.ok(m, `missing var ${varName}`);
  const raw = m[1].replace(/'/g, '"').replace(/,\s*]/g, ']');
  return JSON.parse(raw);
}

function catalogSourcesFromBlock(blockName) {
  const re = new RegExp(`var ${blockName} = \\[([\\s\\S]*?)\\];\\s*\\n\\s*var `);
  const m = workspace.match(re);
  assert.ok(m, `missing ${blockName}`);
  const block = m[1];
  const sources = [];
  const sourceRe = /source:\s*'([^']+)'/g;
  const sourcesRe = /sources:\s*\[([^\]]+)\]/g;
  let hit;
  while ((hit = sourceRe.exec(block))) sources.push(hit[1]);
  while ((hit = sourcesRe.exec(block))) {
    hit[1]
      .split(',')
      .map((s) => s.trim().replace(/['"]/g, ''))
      .filter(Boolean)
      .forEach((s) => sources.push(s));
  }
  return sources;
}

/** Sources that POST to /api/retreat-request or equivalent intake (site forms). */
const INTAKE_SOURCES = [
  'wadi-rum-registration',
  'wadi-rum-health',
  'zanzibar-retreat-reserve',
  'dahab-retreat-reserve',
  'ice-bath-registration',
  'sound-healing-registration',
  'nature-chocolate-registration',
  'yoga-class-registration',
  'yoga-class-request',
  'mountain-voice-registration',
  'ice-bath-health',
  'feedback-dahab',
  'feedback-wadi-rum',
  'feedback-zanzibar',
  'feedback-sound-healing',
  'feedback-nature-chocolate',
  'feedback-ice',
  'shop-order',
  'private-sessions-page',
];

const MEDICAL_SOURCES = parseSourceArray('MEDICAL_SOURCES');
const RETREAT_SOURCES = parseSourceArray('RETREAT_SOURCES');
const EVENT_SOURCES = parseSourceArray('EVENT_SOURCES');
const FEEDBACK_SOURCES = parseSourceArray('FEEDBACK_SOURCES');
const SHOP_SOURCES = parseSourceArray('SHOP_SOURCES');

const BOOKING_UNION = [...new Set([...RETREAT_SOURCES, ...EVENT_SOURCES, ...MEDICAL_SOURCES])];
const ADMIN_UNION = [...new Set([...BOOKING_UNION, ...FEEDBACK_SOURCES, ...SHOP_SOURCES, 'private-sessions-page'])];

for (const source of INTAKE_SOURCES) {
  assert.ok(ADMIN_UNION.includes(source), `intake source missing from admin unions: ${source}`);
  assert.ok(
    workspace.includes(`'${source}':`) || workspace.includes(`"${source}"`),
    `SOURCE_LABELS (or labels map) should mention: ${source}`,
  );
}

const medicalCatalog = catalogSourcesFromBlock('MEDICAL_CATALOG');
for (const s of MEDICAL_SOURCES) {
  assert.ok(medicalCatalog.includes(s), `MEDICAL_CATALOG missing source ${s}`);
}

const retreatCatalog = catalogSourcesFromBlock('RETREAT_CATALOG');
for (const s of RETREAT_SOURCES) {
  assert.ok(retreatCatalog.includes(s), `RETREAT_CATALOG missing source ${s}`);
}

const eventCatalog = catalogSourcesFromBlock('EVENT_CATALOG');
for (const s of EVENT_SOURCES) {
  assert.ok(eventCatalog.includes(s), `EVENT_CATALOG missing source ${s}`);
}

const feedbackCatalog = catalogSourcesFromBlock('FEEDBACK_CATALOG');
for (const s of FEEDBACK_SOURCES) {
  assert.ok(feedbackCatalog.includes(s), `FEEDBACK_CATALOG missing source ${s}`);
}

assert.ok(
  /var OVERVIEW_SOURCES =[\s\S]*private-sessions-page/.test(workspace),
  'overview filter should list private sessions',
);

console.log('test-admin-form-catalog: all assertions passed');
