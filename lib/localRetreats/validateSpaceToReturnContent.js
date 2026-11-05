/**
 * Validates A Space to Return bilingual JSON (same rules as scripts/verify-space-to-return-content.mjs).
 * @param {{ ar: object, en: object }} payload
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function validateSpaceToReturnContentPair(payload) {
  try {
    assertNonEmpty(payload?.ar, 'ar');
    assertNonEmpty(payload?.en, 'en');
    checkLang(payload.ar, 'ar');
    checkLang(payload.en, 'en');
    if (payload.ar.intro.paragraphs.length !== payload.en.intro.paragraphs.length) {
      throw new Error('intro paragraph count mismatch ar/en');
    }
    if (payload.ar.journey.days.length !== payload.en.journey.days.length) {
      throw new Error('journey day count mismatch ar/en');
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  }
}

function assertNonEmpty(value, label) {
  if (value === null || value === undefined || (typeof value === 'object' && !Object.keys(value).length)) {
    throw new Error(`Empty or missing: ${label}`);
  }
  if (typeof value === 'string' && !value.trim()) {
    throw new Error(`Empty or missing: ${label}`);
  }
}

function checkLang(c, lang) {
  assertNonEmpty(c.hero?.dateDuration, `${lang}.hero.dateDuration`);
  if (!Array.isArray(c.intro?.paragraphs) || c.intro.paragraphs.length < 4) {
    throw new Error(`${lang}.intro.paragraphs must have at least 4 items`);
  }
  c.intro.paragraphs.forEach((p, i) => assertNonEmptyString(p, `${lang}.intro.paragraphs[${i}]`));
  assertNonEmptyString(c.destination?.heading, `${lang}.destination.heading`);
  if (!Array.isArray(c.destination?.paragraphs) || c.destination.paragraphs.length < 1) {
    throw new Error(`${lang}.destination.paragraphs required`);
  }
  if (!Array.isArray(c.journey?.days) || c.journey.days.length < 2) {
    throw new Error(`${lang}.journey.days must have at least 2 days`);
  }
  c.journey.days.forEach((day, di) => {
    assertNonEmptyString(day.dayLabel, `${lang}.journey.days[${di}].dayLabel`);
    assertNonEmptyString(day.dateLabel, `${lang}.journey.days[${di}].dateLabel`);
    if (!Array.isArray(day.items) || day.items.length < 1) {
      throw new Error(`${lang}.journey.days[${di}].items required`);
    }
    day.items.forEach((item, ii) => {
      assertNonEmptyString(item.time, `${lang}.journey.days[${di}].items[${ii}].time`);
      assertNonEmptyString(item.title, `${lang}.journey.days[${di}].items[${ii}].title`);
      assertNonEmptyString(item.description, `${lang}.journey.days[${di}].items[${ii}].description`);
    });
  });
  assertNonEmptyString(c.included?.heading, `${lang}.included.heading`);
  if (!Array.isArray(c.included?.items) || c.included.items.length < 1) {
    throw new Error(`${lang}.included.items required`);
  }
  assertNonEmptyString(c.pricing?.heading, `${lang}.pricing.heading`);
  assertNonEmptyString(c.pricing?.discountNote, `${lang}.pricing.discountNote`);
  if (!Array.isArray(c.pricing?.rooms) || c.pricing.rooms.length < 1) {
    throw new Error(`${lang}.pricing.rooms required`);
  }
  assertNonEmptyString(c.registration?.heading, `${lang}.registration.heading`);
  assertNonEmptyString(c.cancellation?.heading, `${lang}.cancellation.heading`);
  if (!Array.isArray(c.registration?.paragraphs) || c.registration.paragraphs.length < 1) {
    throw new Error(`${lang}.registration.paragraphs required`);
  }
  if (!Array.isArray(c.cancellation?.paragraphs) || c.cancellation.paragraphs.length < 1) {
    throw new Error(`${lang}.cancellation.paragraphs required`);
  }
}

function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Empty or missing: ${label}`);
  }
}
