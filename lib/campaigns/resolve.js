import { BOOKING_STATUS } from '../commerce/constants.js';
import { getCatalogItem } from '../commerce/catalog/index.js';
import { CAMPAIGNS } from './campaigns.js';
import { normalizeCampaigns } from './engine.js';

/**
 * Turns the authored campaign list into what the browser may receive.
 *
 * - Only `active` campaigns are returned. A site with no active campaign ships no campaign code and
 *   no campaign data at all (see app/layout.jsx).
 * - A campaign linked to a catalog item (`eventRef`) takes its destination page from the catalog and is
 *   dropped unless that item is OPEN for booking. It also stops at the item's start date, so a campaign
 *   can never keep selling a retreat that already began. Prices, dates and seat counts are NEVER copied
 *   into a campaign: they stay in the catalog.
 * - The static catalog status is not live seat availability. Whether to promote an event is still a
 *   decision for the owner (docs/CAMPAIGNS.md, "Before activating").
 *
 * Pure and synchronous: no database, no network, no environment variables.
 *
 * @returns {{ campaigns: object[], errors: string[] }}
 */
export function resolveCampaigns({ campaigns = CAMPAIGNS, lookup = getCatalogItem } = {}) {
  const normalized = normalizeCampaigns(campaigns);
  const errors = [...normalized.errors];
  const out = [];

  for (const campaign of normalized.campaigns) {
    if (campaign.status !== 'active') continue;
    const resolved = { ...campaign };

    if (campaign.eventRef) {
      const item = lookup(campaign.eventRef.type, campaign.eventRef.id);
      if (!item) {
        errors.push(`${campaign.id}: eventRef points to an unknown catalog item`);
        continue;
      }
      if (item.bookingStatus !== BOOKING_STATUS.OPEN) continue; // not open => not promoted
      if (!resolved.cta.href) {
        const pagePath = item.metadata && item.metadata.pagePath;
        if (typeof pagePath !== 'string') {
          errors.push(`${campaign.id}: catalog item has no page path`);
          continue;
        }
        resolved.cta = { ...resolved.cta, href: pagePath };
      }
      const start = typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) ? `${item.date}T00:00:00Z` : null;
      if (start && Number.isFinite(Date.parse(start))) {
        if (!resolved.endsAt || Date.parse(resolved.endsAt) > Date.parse(start)) resolved.endsAt = start;
      }
      delete resolved.eventRef;
    }

    // Re-validate what we are about to ship (destination filled in, dates clamped).
    const check = normalizeCampaigns([resolved]);
    if (check.campaigns.length === 1) out.push(check.campaigns[0]);
    else errors.push(...check.errors);
  }

  return { campaigns: out, errors };
}

/** What app/layout.jsx passes to the browser: active, valid campaigns only. Warns (dev) about bad definitions. */
export function getClientCampaigns(options) {
  const { campaigns, errors } = resolveCampaigns(options);
  if (errors.length && process.env.NODE_ENV !== 'production') {
    for (const message of errors) console.warn(`[campaigns] ${message}`);
  }
  return campaigns;
}
