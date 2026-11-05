#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'content', 'local-retreats', 'space-to-return');
const STR_ROOM_COUNT = 2;

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
}

function assertNonEmpty(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Empty or missing: ${label}`);
  }
}

function checkLang(lang, file) {
  const c = load(file);
  assertNonEmpty(c.hero?.dateDuration, `${lang}.hero.dateDuration`);
  if (!Array.isArray(c.intro?.paragraphs) || c.intro.paragraphs.length < 4) {
    throw new Error(`${lang}.intro.paragraphs must have at least 4 items`);
  }
  c.intro.paragraphs.forEach((p, i) => assertNonEmpty(p, `${lang}.intro.paragraphs[${i}]`));
  assertNonEmpty(c.destination?.heading, `${lang}.destination.heading`);
  if (!Array.isArray(c.destination?.paragraphs) || c.destination.paragraphs.length < 1) {
    throw new Error(`${lang}.destination.paragraphs required`);
  }
  if (!Array.isArray(c.journey?.days) || c.journey.days.length < 2) {
    throw new Error(`${lang}.journey.days must have at least 2 days`);
  }
  c.journey.days.forEach((day, di) => {
    assertNonEmpty(day.dayLabel, `${lang}.journey.days[${di}].dayLabel`);
    assertNonEmpty(day.dateLabel, `${lang}.journey.days[${di}].dateLabel`);
    if (!Array.isArray(day.items) || day.items.length < 1) {
      throw new Error(`${lang}.journey.days[${di}].items required`);
    }
    day.items.forEach((item, ii) => {
      assertNonEmpty(item.time, `${lang}.journey.days[${di}].items[${ii}].time`);
      assertNonEmpty(item.title, `${lang}.journey.days[${di}].items[${ii}].title`);
      assertNonEmpty(item.description, `${lang}.journey.days[${di}].items[${ii}].description`);
    });
  });
  assertNonEmpty(c.included?.heading, `${lang}.included.heading`);
  if (!Array.isArray(c.included?.items) || c.included.items.length < 1) {
    throw new Error(`${lang}.included.items required`);
  }
  assertNonEmpty(c.pricing?.heading, `${lang}.pricing.heading`);
  assertNonEmpty(c.pricing?.discountNote, `${lang}.pricing.discountNote`);
  if (!Array.isArray(c.pricing?.rooms) || c.pricing.rooms.length < 1) {
    throw new Error(`${lang}.pricing.rooms required`);
  }
  if (c.pricing.rooms.length !== STR_ROOM_COUNT) {
    throw new Error(`${lang}.pricing.rooms must have exactly ${STR_ROOM_COUNT} entries`);
  }
  assertNonEmpty(c.registration?.heading, `${lang}.registration.heading`);
  assertNonEmpty(c.cancellation?.heading, `${lang}.cancellation.heading`);
  if (!Array.isArray(c.registration?.paragraphs) || c.registration.paragraphs.length < 1) {
    throw new Error(`${lang}.registration.paragraphs required`);
  }
  if (!Array.isArray(c.cancellation?.paragraphs) || c.cancellation.paragraphs.length < 1) {
    throw new Error(`${lang}.cancellation.paragraphs required`);
  }
}

try {
  checkLang('ar', 'content.ar.json');
  checkLang('en', 'content.en.json');
  const ar = load('content.ar.json');
  const en = load('content.en.json');
  if (ar.intro.paragraphs.length !== en.intro.paragraphs.length) {
    throw new Error('intro paragraph count mismatch ar/en');
  }
  if (ar.journey.days.length !== en.journey.days.length) {
    throw new Error('journey day count mismatch ar/en');
  }
  console.log('space-to-return content: OK');
} catch (e) {
  console.error(String(e.message || e));
  process.exit(1);
}
