import { BOOKING_STATUS } from '../constants.js';

export const RETREAT_CATALOG = {
  'wadi-rum': {
    id: 'wadi-rum',
    commerceType: 'retreat',
    category: 'retreat',
    source: 'wadi-rum-registration',
    title: {
      en: 'Initial Registration | Wadi Rum Desert Retreat',
      ar: 'التسجيل الأولي | ريتريت وادي رم',
    },
    description: {
      en: 'Wadi Rum desert retreat',
      ar: 'ريتريت وادي رم',
    },
    images: ['/media/wadi-rum/cover.jpg'],
    date: '2027-10-22',
    endDate: '2027-10-26',
    location: { en: 'Jordan', ar: 'الأردن' },
    pricing: {
      currency: 'ILS',
      amount: 3650,
    },
    capacity: 20,
    bookingStatus: BOOKING_STATUS.OPEN,
    metadata: {
      pagePath: '/retreats/wadi-rum',
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
    bookingStatus: BOOKING_STATUS.OPEN,
    metadata: {
      pagePath: '/retreats/dahab',
    },
  },
};

export function getRetreat(id) {
  return RETREAT_CATALOG[id] || null;
}

export function listRetreats() {
  return Object.values(RETREAT_CATALOG);
}
