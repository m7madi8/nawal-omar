import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BOOKING_STATUS } from './constants.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const CATALOG_OVERRIDES_PATH = path.join(root, 'content', 'admin', 'catalog-overrides.json');

const ALLOWED_BOOKING_STATUSES = new Set(Object.values(BOOKING_STATUS));

/** @typedef {{ retreats?: Record<string, { bookingStatus?: string }>, events?: Record<string, { bookingStatus?: string }> }} CatalogOverridesFile */

export function readCatalogOverridesFile() {
  try {
    if (!fs.existsSync(CATALOG_OVERRIDES_PATH)) {
      return { retreats: {}, events: {} };
    }
    const raw = JSON.parse(fs.readFileSync(CATALOG_OVERRIDES_PATH, 'utf8'));
    return {
      retreats: raw?.retreats && typeof raw.retreats === 'object' ? raw.retreats : {},
      events: raw?.events && typeof raw.events === 'object' ? raw.events : {},
    };
  } catch {
    return { retreats: {}, events: {} };
  }
}

export function writeCatalogOverridesFile(data) {
  const normalized = {
    retreats: data?.retreats && typeof data.retreats === 'object' ? data.retreats : {},
    events: data?.events && typeof data.events === 'object' ? data.events : {},
  };
  fs.mkdirSync(path.dirname(CATALOG_OVERRIDES_PATH), { recursive: true });
  fs.writeFileSync(CATALOG_OVERRIDES_PATH, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  return normalized;
}

function mergeBookingStatus(baseItem, overrideEntry) {
  if (!baseItem || !overrideEntry?.bookingStatus) return baseItem;
  const status = String(overrideEntry.bookingStatus).trim();
  if (!ALLOWED_BOOKING_STATUSES.has(status)) return baseItem;
  return { ...baseItem, bookingStatus: status };
}

export function applyRetreatCatalogOverride(baseItem, id) {
  const file = readCatalogOverridesFile();
  const entry = file.retreats?.[id];
  return mergeBookingStatus(baseItem, entry) || baseItem;
}

export function applyEventCatalogOverride(baseItem, id) {
  const file = readCatalogOverridesFile();
  const entry = file.events?.[id];
  return mergeBookingStatus(baseItem, entry) || baseItem;
}

/**
 * @param {'retreat'|'event'} commerceType
 * @param {string} id
 * @param {string} bookingStatus
 */
export function setCatalogBookingStatusOverride(commerceType, id, bookingStatus) {
  const status = String(bookingStatus || '').trim();
  if (!ALLOWED_BOOKING_STATUSES.has(status)) {
    throw new Error('Invalid bookingStatus');
  }
  const file = readCatalogOverridesFile();
  const key = commerceType === 'event' ? 'events' : 'retreats';
  const next = { ...file, [key]: { ...file[key], [id]: { bookingStatus: status } } };
  return writeCatalogOverridesFile(next);
}

export function effectiveBookingStatus(commerceType, id, codeDefault) {
  const file = readCatalogOverridesFile();
  const key = commerceType === 'event' ? 'events' : 'retreats';
  const override = file[key]?.[id]?.bookingStatus;
  if (override && ALLOWED_BOOKING_STATUSES.has(override)) return override;
  return codeDefault;
}
