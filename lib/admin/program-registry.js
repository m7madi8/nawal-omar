import { isSpaceToReturnContentReady } from '../localRetreats/loadSpaceToReturnContent.js';
import { loadSpaceToReturnContent } from '../localRetreats/loadSpaceToReturnContent.js';
import { getRetreat } from '../commerce/catalog/retreats.js';
import { getEvent } from '../commerce/catalog/events.js';
import { effectiveBookingStatus } from '../commerce/catalog-overrides.js';

/**
 * Admin-facing inventory of public programs (read-only metadata + management hooks).
 * Does not drive public routing — documents what the dashboard can manage today.
 */
export function buildAdminProgramRegistry() {
  const str = getRetreat('space-to-return');
  const strContentReady = isSpaceToReturnContentReady(loadSpaceToReturnContent());

  return [
    {
      id: 'local-retreats-hub',
      section: 'local-retreats',
      sectionLabel: { en: 'Local Retreats', ar: 'خلوات محلية' },
      title: { en: 'Local Retreats hub', ar: 'صفحة الخلوات المحلية' },
      publicPath: '/local-retreats',
      integration: 'partial',
      capabilities: {
        list: false,
        create: false,
        editCopy: false,
        editMedia: false,
        publish: false,
        bookings: false,
      },
      notes:
        'Hub layout and hero copy are in app/local-retreats/page.jsx. Program cards are driven by hardcoded markup plus JSON teasers where available.',
    },
    {
      id: 'space-to-return',
      section: 'local-retreats',
      sectionLabel: { en: 'Local Retreats', ar: 'خلوات محلية' },
      title: str?.title || { en: 'A Space to Return', ar: 'مساحة للعودة' },
      publicPath: '/local-retreats/a-space-to-return',
      registrationSource: 'space-to-return-registration',
      commerce: { type: 'retreat', id: 'space-to-return' },
      bookingStatus: str
        ? effectiveBookingStatus('retreat', 'space-to-return', str.bookingStatus)
        : 'unknown',
      contentReady: strContentReady,
      integration: strContentReady ? 'partial' : 'broken',
      capabilities: {
        list: true,
        create: false,
        editCopy: true,
        editMedia: false,
        publish: true,
        bookings: true,
      },
      admin: {
        bookingsView: '/admin/local-retreats',
        contentApi: '/api/admin/content/local-retreats/space-to-return',
        catalogApi: '/api/admin/content/catalog-overrides',
      },
      notes:
        'Page copy: content/local-retreats/space-to-return/*.json. Prices/dates in lib/commerce/catalog/retreats.js. Images: public/media/local-retreats/space-to-return/.',
    },
    {
      id: 'retreats-hub',
      section: 'retreats',
      sectionLabel: { en: 'Retreats (Trips)', ar: 'الرحلات' },
      title: { en: 'Retreats hub', ar: 'صفحة الرحلات' },
      publicPath: '/retreats',
      integration: 'partial',
      capabilities: {
        list: false,
        create: false,
        editCopy: false,
        editMedia: false,
        publish: false,
        bookings: false,
      },
      notes:
        '2027 teaser cards (Wadi Rum, Morocco, Albania, etc.) are hardcoded in app/retreats/page.jsx. Legacy retreat detail pages remain under /retreats/*.',
    },
    ...['wadi-rum', 'zanzibar', 'dahab'].map((id) => {
      const item = getRetreat(id);
      return {
        id,
        section: 'retreats',
        sectionLabel: { en: 'Retreats (Trips)', ar: 'الرحلات' },
        title: item?.title || { en: id, ar: id },
        publicPath: item?.metadata?.pagePath || `/retreats/${id}`,
        registrationSource: item?.source || '',
        commerce: { type: 'retreat', id },
        bookingStatus: item
          ? effectiveBookingStatus('retreat', id, item.bookingStatus)
          : 'unknown',
        integration: 'partial',
        capabilities: {
          list: true,
          create: false,
          editCopy: false,
          editMedia: false,
          publish: true,
          bookings: true,
        },
        admin: {
          bookingsView: '/admin/retreats',
          catalogApi: '/api/admin/content/catalog-overrides',
        },
        notes: 'Retreat page copy in HTML/i18n. Commerce catalog in lib/commerce/catalog/retreats.js.',
      };
    }),
    {
      id: 'private-sessions',
      section: 'private-sessions',
      sectionLabel: { en: 'Private Sessions', ar: 'جلسات خاصة' },
      title: { en: 'Private Sessions', ar: 'جلسات خاصة' },
      publicPath: '/private-sessions',
      registrationSource: 'private-sessions-page',
      integration: 'partial',
      capabilities: {
        list: true,
        create: false,
        editCopy: false,
        editMedia: false,
        publish: false,
        bookings: true,
      },
      admin: { bookingsView: '/admin/private-sessions' },
      notes: 'Program list in lib/privateSessionsConfig.js. Bridal ritual: /private-sessions/bridal-ritual.',
    },
    {
      id: 'yoga',
      section: 'yoga',
      sectionLabel: { en: 'Yoga', ar: 'اليوغا' },
      title: { en: 'Yoga hub', ar: 'اليوغا' },
      publicPath: '/yoga',
      integration: 'partial',
      capabilities: {
        list: false,
        create: false,
        editCopy: false,
        editMedia: false,
        publish: false,
        bookings: true,
      },
      admin: { bookingsView: '/admin/events' },
      notes: 'Haifa / Baqa pages are static. Class requests appear under Events in admin.',
    },
    ...['ice-bath', 'sound-healing', 'nature-chocolate'].map((id) => {
      const item = getEvent(id);
      return {
        id,
        section: 'events-legacy',
        sectionLabel: { en: 'Events (legacy)', ar: 'فعاليات (قديمة)' },
        title: item?.title || { en: id, ar: id },
        publicPath: item?.metadata?.pagePath || `/events/${id}`,
        registrationSource: item?.source || '',
        commerce: { type: 'event', id },
        bookingStatus: item ? effectiveBookingStatus('event', id, item.bookingStatus) : 'unknown',
        integration: 'partial',
        capabilities: {
          list: true,
          create: false,
          editCopy: false,
          editMedia: false,
          publish: true,
          bookings: true,
        },
        admin: {
          bookingsView: '/admin/events',
          catalogApi: '/api/admin/content/catalog-overrides',
        },
        notes: 'Public /events/* routes redirect to /local-retreats; historical bookings still in admin Events.',
      };
    }),
  ];
}
