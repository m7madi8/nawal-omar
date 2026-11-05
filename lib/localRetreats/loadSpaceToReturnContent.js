import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { STR_ROOM_IDS } from './spaceToReturnCommerce.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const contentDir = path.join(root, 'content', 'local-retreats', 'space-to-return');

/** Drop legacy pricing rows (e.g. removed suite-four) so public HTML never renders them. */
function trimPricingRooms(langBlock) {
  if (!langBlock?.pricing?.rooms || !Array.isArray(langBlock.pricing.rooms)) return;
  langBlock.pricing.rooms = langBlock.pricing.rooms.slice(0, STR_ROOM_IDS.length);
}

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(contentDir, name), 'utf8'));
}

export function loadSpaceToReturnContent() {
  const ar = readJson('content.ar.json');
  const en = readJson('content.en.json');
  trimPricingRooms(ar);
  trimPricingRooms(en);
  return { ar, en };
}

export function isSpaceToReturnContentReady(content = loadSpaceToReturnContent()) {
  const { ar: a, en: e } = content;
  if (!a?.hero?.dateDuration?.trim() || !e?.hero?.dateDuration?.trim()) return false;
  if (!Array.isArray(a.intro?.paragraphs) || a.intro.paragraphs.length < 1) return false;
  if (!Array.isArray(e.intro?.paragraphs) || e.intro.paragraphs.length < 1) return false;
  if (!Array.isArray(a.journey?.days) || a.journey.days.length < 1) return false;
  return true;
}
