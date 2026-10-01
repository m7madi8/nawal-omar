import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const [pageRel, i18nRel = 'public/legacy/js/i18n.js'] = process.argv.slice(2);
if (!pageRel) {
  console.error('Usage: node scripts/check-i18n-keys.mjs <page-file> [i18n-file]');
  process.exit(1);
}

const page = fs.readFileSync(path.join(root, pageRel), 'utf8');
const keys = new Set();
for (const m of page.matchAll(/data-i18n="([^"]+)"/g)) keys.add(m[1]);
for (const m of page.matchAll(/data-i18n-attr="([^"]+)"/g)) {
  m[1].split(/[;,]/).forEach((pair) => {
    const key = pair.split(':')[1];
    if (key) keys.add(key.trim());
  });
}

const sandbox = { window: {}, document: { addEventListener() {}, documentElement: {}, querySelectorAll: () => [] }, localStorage: { getItem() {}, setItem() {} } };
sandbox.window.document = sandbox.document;
sandbox.window.localStorage = sandbox.localStorage;
vm.createContext(sandbox);
let src = fs.readFileSync(path.join(root, i18nRel), 'utf8');
src = src.replace(/const translations\s*=/, 'globalThis.__translations =').replace(/var translations\s*=/, 'globalThis.__translations =');
try {
  vm.runInContext(src, sandbox);
} catch (e) {
  // runtime DOM errors are fine once translations are captured
}
const t = sandbox.__translations;
if (!t) throw new Error('Could not read translations object');

const missing = { en: [], ar: [] };
const same = [];
for (const key of keys) {
  if (!(key in t.en)) missing.en.push(key);
  if (!(key in t.ar)) missing.ar.push(key);
  if (key in t.en && key in t.ar && t.en[key] === t.ar[key] && /[a-z]{3}/i.test(t.ar[key])) same.push(key);
}

console.log(`Keys used: ${keys.size}`);
console.log(`Missing in en (${missing.en.length}):`, missing.en.join(', ') || '-');
console.log(`Missing in ar (${missing.ar.length}):`, missing.ar.join(', ') || '-');
console.log(`AR identical to EN (${same.length}):`, same.join(', ') || '-');
