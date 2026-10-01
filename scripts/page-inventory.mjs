import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const compareIdx = args.indexOf('--compare');
const baselineRel = compareIdx >= 0 ? args.splice(compareIdx, 2)[1] : null;
const [pageRel, outRel, i18nRel = 'public/legacy/js/i18n.js'] = args;

if (!pageRel || (!outRel && !baselineRel)) {
  console.error('Usage:');
  console.error('  node scripts/page-inventory.mjs <page-file> <out.json>             # snapshot');
  console.error('  node scripts/page-inventory.mjs <page-file> --compare <base.json>  # diff against snapshot');
  process.exit(1);
}

function loadTranslations(rel) {
  const sandbox = { window: {}, document: { addEventListener() {}, documentElement: {}, querySelectorAll: () => [] }, localStorage: { getItem() {}, setItem() {} } };
  sandbox.window.document = sandbox.document;
  sandbox.window.localStorage = sandbox.localStorage;
  vm.createContext(sandbox);
  const src = fs
    .readFileSync(path.join(root, rel), 'utf8')
    .replace(/const translations\s*=/, 'globalThis.__translations =')
    .replace(/var translations\s*=/, 'globalThis.__translations =');
  try {
    vm.runInContext(src, sandbox);
  } catch {
    // DOM errors after the translations object is defined are expected
  }
  if (!sandbox.__translations) throw new Error('Could not read translations object');
  return sandbox.__translations;
}

function snapshot() {
  const page = fs.readFileSync(path.join(root, pageRel), 'utf8');
  const t = loadTranslations(i18nRel);
  const keys = new Map();
  for (const m of page.matchAll(/data-i18n="([^"]+)"/g)) keys.set(m[1], (keys.get(m[1]) || 0) + 1);
  for (const m of page.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    m[1].split(/[;,]/).forEach((pair) => {
      const key = pair.split(':')[1]?.trim();
      if (key) keys.set(key, (keys.get(key) || 0) + 1);
    });
  }

  const literals = new Set();
  const html = page.replace(/<svg[\s\S]*?<\/svg>/g, '');
  for (const m of html.matchAll(/>([^<>{}]+)</g)) {
    const text = m[1].replace(/\s+/g, ' ').trim();
    if (text && /[\p{L}\p{N}]/u.test(text)) literals.add(text);
  }

  const entries = {};
  for (const key of [...keys.keys()].sort()) {
    entries[key] = { uses: keys.get(key), en: t.en?.[key] ?? null, ar: t.ar?.[key] ?? null };
  }
  return { page: pageRel, keyCount: keys.size, keys: entries, literals: [...literals].sort() };
}

const current = snapshot();

if (!baselineRel) {
  fs.writeFileSync(path.join(root, outRel), JSON.stringify(current, null, 2));
  console.log(`Saved ${current.keyCount} keys and ${current.literals.length} literal strings to ${outRel}`);
  process.exit(0);
}

const base = JSON.parse(fs.readFileSync(path.join(root, baselineRel), 'utf8'));
const removed = [];
const changed = [];
for (const [key, val] of Object.entries(base.keys)) {
  const now = current.keys[key];
  if (!now) {
    removed.push(key);
    continue;
  }
  if (now.en !== val.en) changed.push(`${key} [en]`);
  if (now.ar !== val.ar) changed.push(`${key} [ar]`);
}
const added = Object.keys(current.keys).filter((k) => !base.keys[k]);
const missingLiterals = base.literals.filter((l) => !current.literals.includes(l));

console.log(`Baseline keys: ${base.keyCount} | Current keys: ${current.keyCount}`);
console.log(`Removed keys (${removed.length}):`, removed.join(', ') || '-');
console.log(`Changed values (${changed.length}):`, changed.join(', ') || '-');
console.log(`Missing literal strings (${missingLiterals.length}):`, missingLiterals.join(' | ') || '-');
console.log(`New keys (${added.length}):`, added.join(', ') || '-');
process.exit(removed.length || changed.length ? 1 : 0);
