import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SPACE_TO_RETURN_CONTENT_DIR = path.join(
  root,
  'content',
  'local-retreats',
  'space-to-return',
);

export function spaceToReturnContentFile(lang) {
  const file = lang === 'ar' ? 'content.ar.json' : 'content.en.json';
  return path.join(SPACE_TO_RETURN_CONTENT_DIR, file);
}

export function readSpaceToReturnContentPair() {
  return {
    ar: JSON.parse(fs.readFileSync(spaceToReturnContentFile('ar'), 'utf8')),
    en: JSON.parse(fs.readFileSync(spaceToReturnContentFile('en'), 'utf8')),
  };
}

export function writeSpaceToReturnContentPair({ ar, en }) {
  fs.mkdirSync(SPACE_TO_RETURN_CONTENT_DIR, { recursive: true });
  const arPath = spaceToReturnContentFile('ar');
  const enPath = spaceToReturnContentFile('en');
  fs.writeFileSync(arPath, `${JSON.stringify(ar, null, 2)}\n`, 'utf8');
  fs.writeFileSync(enPath, `${JSON.stringify(en, null, 2)}\n`, 'utf8');
}
