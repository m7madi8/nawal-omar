import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const contentDir = path.join(root, 'content', 'local-retreats', 'space-to-return');

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(contentDir, name), 'utf8'));
}

export function loadSpaceToReturnContent() {
  return {
    ar: readJson('content.ar.json'),
    en: readJson('content.en.json'),
  };
}

export function isSpaceToReturnContentReady(content = loadSpaceToReturnContent()) {
  const { ar: a, en: e } = content;
  if (!a?.hero?.dateDuration?.trim() || !e?.hero?.dateDuration?.trim()) return false;
  if (!Array.isArray(a.intro?.paragraphs) || a.intro.paragraphs.length < 1) return false;
  if (!Array.isArray(e.intro?.paragraphs) || e.intro.paragraphs.length < 1) return false;
  if (!Array.isArray(a.journey?.days) || a.journey.days.length < 1) return false;
  return true;
}
