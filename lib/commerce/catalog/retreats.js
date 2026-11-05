import { BOOKING_STATUS } from '../constants.js';
import { applyRetreatCatalogOverride } from '../catalog-overrides.js';

export const RETREAT_CATALOG = {
  'wadi-rum': {
    id: 'wadi-rum',
    commerceType: 'retreat',
    category: 'retreat',
    source: 'wadi-rum-registration',
    title: {
      en: 'Registration | Wadi Rum Desert Retreat',
      ar: 'التسجيل | ريتريت وادي رم',
    },
    description: {
      en: 'Wadi Rum desert retreat',
      ar: 'ريتريت وادي رم',
    },
    images: ['/media/wadi-rum/cover.jpg'],
    date: '2026-10-22',
    endDate: '2026-10-26',
    location: { en: 'Jordan', ar: 'الأردن' },
    pricing: {
      currency: 'ILS',
      amount: 3650,
    },
    // Authoritative per-room totals (ILS). The deposit is WADI_RUM_DEPOSIT_ILS for every room.
    // Resolve with resolveRetreatRoom() (own-property lookup); never trust a client price.
    rooms: Object.freeze({
      panorama: Object.freeze({
        id: 'panorama',
        currency: 'ILS',
        amount: 3650,
        label: Object.freeze({ en: 'Panorama Room', ar: 'غرفة بانوراما' }),
      }),
      bubbles: Object.freeze({
        id: 'bubbles',
        currency: 'ILS',
        amount: 3850,
        label: Object.freeze({ en: 'Bubbles Room', ar: 'غرفة بابلز' }),
      }),
    }),
    capacity: 20,
    bookingStatus: BOOKING_STATUS.CLOSED,
    metadata: {
      pagePath: '/retreats/wadi-rum',
      schedule: 'past',
    },
  },
  zanzibar: {
    id: 'zanzibar',
    commerceType: 'retreat',
    category: 'retreat',
    source: 'zanzibar-retreat-reserve',
    title: { en: 'Zanzibar Retreat', ar: 'ريتريت زنجبار' },
    description: {
      en: 'Zanzibar beach retreat',
      ar: 'ريتريت زنجبار',
    },
    images: ['/media/zanzibar/NUR-Beach-Hotel---Jambiani.jpg'],
    date: '2026-07-07',
    endDate: '2026-07-14',
    location: { en: 'Zanzibar', ar: 'زنجبار' },
    pricing: {
      currency: 'USD',
      amount: 0,
    },
    capacity: null,
    bookingStatus: BOOKING_STATUS.CLOSED,
    metadata: {
      pagePath: '/retreats/zanzibar',
      schedule: 'past',
    },
  },
  'space-to-return': {
    id: 'space-to-return',
    commerceType: 'retreat',
    category: 'retreat',
    source: 'space-to-return-registration',
    title: {
      en: 'A Space to Return',
      ar: 'مساحة للعودة',
    },
    description: {
      en: 'Local retreat at Slowness — Kibbutz Moran',
      ar: 'خلوة محلية في Slowness — كيبوتس מورan',
    },
    images: ['/media/local-retreats/a-space-to-return-card-cover.jpg'],
    date: '2026-11-28',
    endDate: '2026-11-29',
    location: { en: 'Galilee, Israel', ar: 'الجليل' },
    pricing: {
      currency: 'ILS',
      amount: 1890,
    },
    rooms: Object.freeze({
      double: Object.freeze({
        id: 'double',
        currency: 'ILS',
        amount: 2115,
        label: Object.freeze({
          en: 'Double room | 2 people per room',
          ar: 'غرفة زوجية | شخصان بالغرفة',
        }),
      }),
      triple: Object.freeze({
        id: 'triple',
        currency: 'ILS',
        amount: 2025,
        label: Object.freeze({
          en: 'Triple room | 3 sharers per room',
          ar: 'غرفة ثلاثية | 3 مشاركات بالغرفة',
        }),
      }),
      'suite-four': Object.freeze({
        id: 'suite-four',
        currency: 'ILS',
        amount: 1890,
        label: Object.freeze({
          en: 'Suite for four | 4 sharers in the suite',
          ar: 'سويت لأربع | 4 مشاركات بالسويت',
        }),
      }),
    }),
    capacity: null,
    bookingStatus: BOOKING_STATUS.OPEN,
    metadata: {
      pagePath: '/local-retreats/a-space-to-return',
      retreatTypeLabel: 'A Space to Return | مساحة للعودة',
    },
  },
  dahab: {
    id: 'dahab',
    commerceType: 'retreat',
    category: 'retreat',
    source: 'dahab-retreat-reserve',
    title: { en: 'Dahab Retreat', ar: 'ريتريت دهب' },
    description: {
      en: 'Dahab retreat by the Red Sea',
      ar: 'ريتريت دهب على البحر الأحمر',
    },
    images: ['/media/dahab/cover.jpeg'],
    date: '2026-08-19',
    endDate: '2026-08-23',
    location: { en: 'Egypt', ar: 'مصر' },
    pricing: {
      currency: 'ILS',
      amount: 0,
    },
    capacity: null,
    bookingStatus: BOOKING_STATUS.CLOSED,
    metadata: {
      pagePath: '/retreats/dahab',
    },
  },
};

export function getRetreat(id) {
  const base = RETREAT_CATALOG[id];
  if (!base) return null;
  return applyRetreatCatalogOverride(base, id);
}

export function listRetreats() {
  return Object.keys(RETREAT_CATALOG).map((id) => getRetreat(id));
}
