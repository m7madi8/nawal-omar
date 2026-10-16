/**
 * Campaign definitions: the single source of truth for in-site campaigns.
 *
 * Nothing here is shown unless `status` is "active". Everything is validated by lib/campaigns/engine.js
 * (a mistake drops that campaign and is reported; it never breaks a page). Read docs/CAMPAIGNS.md before
 * activating anything: it lists the checks that must pass first.
 *
 * Fields (all copy is { ar, en }; both languages are required):
 *   id              unique, lowercase, e.g. "wadi-rum-reminder". Used to remember a visitor's choice.
 *   status          "draft" | "active" | "paused" | "ended". Only "active" can show.
 *   format          "modal" (a dialog, after real engagement) | "strip" (a small non-blocking card).
 *   title, body     short text. body is optional. Plain text only: no HTML.
 *   cta             { label, href }. href is an internal path, or https on an allow-listed host.
 *                   With eventRef the href is taken from the catalog and can be left out.
 *   image           optional { src: "/media/...", alt: { ar, en }, width, height } (modal only).
 *   startsAt/endsAt optional ISO date-times WITH offset, e.g. "2026-11-01T09:00:00+02:00".
 *   pages           where it may appear: "/", "/events", "/retreats/*" or "*" (booking, payment and
 *                   health pages are always excluded by the engine).
 *   maxImpressions  how many times one browser may see it (default 2).
 *   cooldownDays    days of silence after it is shown or closed (default 7).
 *   eventRef        optional { type: "retreat" | "event", id } link to lib/commerce/catalog. The campaign
 *                   only runs while that item is open for booking and ends when it starts. Do not copy
 *                   prices, dates or seat counts into a campaign.
 *
 * The first entry is a TEST FIXTURE. It is a draft, it is not shown, and it asserts nothing about
 * availability, price or dates.
 */
export const CAMPAIGNS = [
  {
    id: 'wadi-rum-sample',
    status: 'draft',
    format: 'strip',
    title: {
      ar: 'ريتريت وادي رم',
      en: 'Wadi Rum Desert Retreat',
    },
    body: {
      ar: 'اطّلعي على برنامج الريتريت وتفاصيل التسجيل في صفحته.',
      en: 'See the programme and registration details on the retreat page.',
    },
    cta: {
      label: { ar: 'عرض التفاصيل', en: 'View details' },
    },
    eventRef: { type: 'retreat', id: 'wadi-rum' },
    pages: ['/', '/events', '/retreats'],
    maxImpressions: 2,
    cooldownDays: 7,
  },
];
