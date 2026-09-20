import { BOOKING_STATUS } from '../constants.js';

export const EVENT_CATALOG = {
  'sound-healing': {
    id: 'sound-healing',
    commerceType: 'event',
    category: 'sound-healing',
    source: 'sound-healing-registration',
    title: {
      en: 'Sound Healing',
      ar: 'ساوند هيلينغ',
    },
    description: {
      en: 'Sound Healing session',
      ar: 'جلسة ساوند هيلينغ',
    },
    images: ['/media/events/sound-healing-01.jpg'],
    date: '2026-09-04',
    startTime: '18:00',
    endTime: null,
    location: {
      en: 'Haifa, Atlit',
      ar: 'حيفا، عتليت',
    },
    pricing: {
      currency: 'ILS',
      tiers: [
        { id: 'member', labelKey: 'events_sh_price_member_label', amount: 100 },
        { id: 'guest', labelKey: 'events_sh_price_guest_label', amount: 130 },
      ],
    },
    capacity: 30,
    bookingStatus: BOOKING_STATUS.OPEN,
    metadata: {
      healthFormRequired: false,
      retreatTypeLabel: 'Sound Healing · Friday 4 September · 18:00',
      pagePath: '/events/sound-healing',
    },
  },
  'ice-bath': {
    id: 'ice-bath',
    commerceType: 'event',
    category: 'ice-bath',
    source: 'ice-bath-registration',
    title: {
      en: 'Day Retreat | Between Calm & Strength',
      ar: 'يوم ريتريت | بين الهدوء والقوة',
    },
    description: {
      en: 'Ice Bath day retreat',
      ar: 'يوم ريتريت الحمام البارد',
    },
    images: ['/media/events/ice-bath/hero.jpg'],
    date: '2026-08-29',
    startTime: '09:30',
    endTime: '16:00',
    location: {
      en: 'Hofit',
      ar: 'حوفيت',
    },
    pricing: {
      currency: 'ILS',
      tiers: [
        { id: 'member', labelKey: 'events_ib_price_member_label', amount: 650 },
        { id: 'guest', labelKey: 'events_ib_price_guest_label', amount: 680 },
      ],
    },
    capacity: 20,
    bookingStatus: BOOKING_STATUS.CLOSED,
    metadata: {
      healthFormRequired: true,
      retreatTypeLabel: 'Day Retreat | Between Calm & Strength',
      pagePath: '/events/ice-bath',
    },
  },
  'nature-chocolate': {
    id: 'nature-chocolate',
    commerceType: 'event',
    category: 'nature-chocolate',
    source: 'nature-chocolate-registration',
    title: {
      en: 'A Day Between Nature & Chocolate',
      ar: 'يوم بين الطبيعة والشوكولاته',
    },
    description: {
      en: 'Nature & Chocolate day experience',
      ar: 'يوم بين الطبيعة والشوكولاته',
    },
    images: ['/media/events/nature-chocolate-hero.jpg'],
    date: '2025-05-10',
    startTime: '10:00',
    endTime: '18:00',
    location: {
      en: 'Al-Bqeia',
      ar: 'البقيعة',
    },
    pricing: {
      currency: 'ILS',
      tiers: [
        { id: 'member', labelKey: 'events_nc_price_member_label', amount: 360 },
        { id: 'guest', labelKey: 'events_nc_price_guest_label', amount: 400 },
      ],
    },
    capacity: null,
    bookingStatus: BOOKING_STATUS.CLOSED,
    metadata: {
      healthFormRequired: false,
      retreatTypeLabel: 'A Day Between Nature & Chocolate · 8.8',
      pagePath: '/events/nature-chocolate',
    },
  },
};

export function getEvent(id) {
  return EVENT_CATALOG[id] || null;
}

export function getEventPriceTier(event, tierId = 'member') {
  if (!event?.pricing?.tiers?.length) return null;
  return event.pricing.tiers.find((tier) => tier.id === tierId) || event.pricing.tiers[0];
}

export function listEvents() {
  return Object.values(EVENT_CATALOG);
}
