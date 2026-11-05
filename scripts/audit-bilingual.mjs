#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, acc = []) {
  const excl = /node_modules|\.next|yoga-shop|_archive|admin[/\\]|dashboard/;
  if (!fs.existsSync(dir) || excl.test(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (excl.test(p)) continue;
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(jsx|tsx|html|js)$/.test(name) && !name.includes('.test.')) acc.push(p);
  }
  return acc;
}

function extractI18nKeys(i18nPath) {
  const src = fs.readFileSync(i18nPath, 'utf8');
  const enStart = src.indexOf('en: {');
  const arStart = src.indexOf('ar: {');
  const fnStart = src.indexOf('function getStoredLang');
  if (enStart < 0 || arStart < 0 || fnStart < 0) {
    throw new Error(`Could not parse i18n blocks in ${i18nPath}`);
  }
  const enSection = src.slice(enStart, arStart);
  const arSection = src.slice(arStart, fnStart);
  const keyRe = /\n\s+([a-zA-Z0-9_]+):/g;
  const enKeys = new Map();
  const arKeys = new Map();
  const dupEn = [];
  const dupAr = [];

  for (const section of [
    { map: enKeys, text: enSection, dup: dupEn },
    { map: arKeys, text: arSection, dup: dupAr },
  ]) {
    for (const m of section.text.matchAll(keyRe)) {
      const k = m[1];
      if (section.map.has(k)) section.dup.push(k);
      else section.map.set(k, true);
    }
  }

  const emptyEn = [];
  const emptyAr = [];
  const valRe = (key) =>
    new RegExp(`\\n\\s+${key}:\\s*(?:'([^']*)'|"([^"]*)"|\\n)`, 'g');

  for (const k of enKeys.keys()) {
    const m = enSection.match(new RegExp(`\\n\\s+${k}:\\s*'([^']*)'`));
    if (m && m[1].trim() === '') emptyEn.push(k);
  }
  for (const k of arKeys.keys()) {
    const m = arSection.match(new RegExp(`\\n\\s+${k}:\\s*'([^']*)'`));
    if (m && m[1].trim() === '') emptyAr.push(k);
  }

  return {
    enKeys: new Set(enKeys.keys()),
    arKeys: new Set(arKeys.keys()),
    dupEn: [...new Set(dupEn)],
    dupAr: [...new Set(dupAr)],
    emptyEn,
    emptyAr,
  };
}

function scanDataEnAr(filePath) {
  const c = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(root, filePath);
  const issues = [];
  const enCount = (c.match(/\bdata-en="/g) || []).length;
  const arCount = (c.match(/\bdata-ar="/g) || []).length;
  if (enCount !== arCount) {
    issues.push({ rel, type: 'count-mismatch', enCount, arCount });
  }
  const tagRe = /<[a-zA-Z][^>]*\bdata-en="[^"]*"[^>]*>/g;
  for (const m of c.matchAll(tagRe)) {
    const tag = m[0];
    if (!/\bdata-ar=/.test(tag)) {
      issues.push({ rel, type: 'missing-ar', tag: tag.slice(0, 120) });
    }
  }
  const tagArRe = /<[a-zA-Z][^>]*\bdata-ar="[^"]*"[^>]*>/g;
  for (const m of c.matchAll(tagArRe)) {
    const tag = m[0];
    if (!/\bdata-en=/.test(tag)) {
      issues.push({ rel, type: 'missing-en', tag: tag.slice(0, 120) });
    }
  }
  return issues;
}

function collectDataI18nKeys(filePath) {
  const c = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();
  for (const m of c.matchAll(/data-i18n="([^"]+)"/g)) {
    const k = m[1];
    if (/^[a-z0-9_]+$/i.test(k)) keys.add(k);
  }
  for (const m of c.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    const spec = m[1];
    spec.split(/[;,]/).forEach((pair) => {
      const key = pair.split(':')[1];
      if (key) {
        const k = key.trim();
        if (/^[a-z0-9_]+$/i.test(k)) keys.add(k);
      }
    });
  }
  return keys;
}

const scanRoots = [
  ...walk(path.join(root, 'app')),
  ...walk(path.join(root, 'components')),
  ...walk(path.join(root, 'lib')),
  path.join(root, 'lib', 'siteChrome.js'),
].filter((p, i, a) => fs.existsSync(p) && a.indexOf(p) === i);

let allIssues = [];
const usedI18nKeys = new Set();
for (const f of scanRoots) {
  if (/admin|dashboard|workspace/.test(f)) continue;
  allIssues = allIssues.concat(scanDataEnAr(f));
  for (const k of collectDataI18nKeys(f)) usedI18nKeys.add(k);
}

const legacyHtml = walk(path.join(root, 'public', 'legacy'));
for (const f of legacyHtml) {
  if (!f.endsWith('.html')) continue;
  for (const k of collectDataI18nKeys(f)) usedI18nKeys.add(k);
}

const i18nLegacy = path.join(root, 'public', 'legacy', 'js', 'i18n.js');
const i18nRoot = path.join(root, 'js', 'i18n.js');
const { enKeys, arKeys, dupEn, dupAr, emptyEn, emptyAr } = extractI18nKeys(i18nLegacy);
const missingInAr = [...enKeys].filter((k) => !arKeys.has(k));
const missingInEn = [...arKeys].filter((k) => !enKeys.has(k));
const missingI18nEn = [...usedI18nKeys].filter((k) => !enKeys.has(k));
const missingI18nAr = [...usedI18nKeys].filter((k) => !arKeys.has(k));

const hash = (p) =>
  crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex').slice(0, 16);
const i18nSync =
  fs.existsSync(i18nRoot) && fs.existsSync(i18nLegacy)
    ? hash(i18nRoot) === hash(i18nLegacy)
    : null;

const routes = [];
(function walkApp(d, prefix = '') {
  if (!fs.existsSync(d)) return;
  for (const name of fs.readdirSync(d)) {
    const p = path.join(d, name);
    if (fs.statSync(p).isDirectory()) walkApp(p, `${prefix}/${name}`);
    else if (name === 'page.jsx') routes.push(prefix || '/');
  }
})(path.join(root, 'app'));

const report = {
  routesAudited: routes.length,
  filesScanned: scanRoots.length,
  dataEnArIssues: allIssues.length,
  dataEnArIssueSample: allIssues.slice(0, 20),
  i18nEnKeyCount: enKeys.size,
  i18nArKeyCount: arKeys.size,
  i18nKeysMissingInAr: missingInAr.length,
  i18nKeysMissingInEn: missingInEn.length,
  i18nDuplicateKeysEn: dupEn.length,
  i18nDuplicateKeysAr: dupAr.length,
  i18nEmptyEn: emptyEn.length,
  i18nEmptyAr: emptyAr.length,
  dataI18nKeysUsed: usedI18nKeys.size,
  dataI18nMissingInEn: missingI18nEn.length,
  dataI18nMissingInAr: missingI18nAr.length,
  dataI18nMissingInEnSample: missingI18nEn.slice(0, 15),
  dataI18nMissingInArSample: missingI18nAr.slice(0, 15),
  i18nFilesInSync: i18nSync,
};

console.log(JSON.stringify(report, null, 2));

const fail =
  allIssues.length > 0 ||
  missingInAr.length > 0 ||
  missingInEn.length > 0 ||
  dupEn.length > 0 ||
  dupAr.length > 0 ||
  missingI18nEn.length > 0 ||
  missingI18nAr.length > 0 ||
  i18nSync === false;

process.exit(fail ? 1 : 0);
