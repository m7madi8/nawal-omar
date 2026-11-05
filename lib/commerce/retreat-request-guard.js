import { BOOKING_STATUS } from './constants.js';
import { getRetreat } from './catalog/retreats.js';

/**
 * Retreats whose public request source is rejected by POST /api/retreat-request
 * once the catalog marks them CLOSED.
 *
 * Deliberately limited to closed retreats that must reject new public registration.
 * Zanzibar (`zanzibar-retreat-reserve`) is CLOSED in the catalog but is NOT guarded here.
 */
export const GUARDED_RETREAT_IDS = Object.freeze(['dahab', 'wadi-rum', 'space-to-return']);

/**
 * @param {unknown} source Client-supplied `source` from a retreat-request body.
 * @param {Record<string, { source?: string, bookingStatus?: string }>} [catalog]
 * @returns {object | null} The closed, guarded retreat whose catalog `source` equals
 *   `source` exactly (surrounding whitespace ignored), otherwise null.
 */
export function findClosedRetreatForRequestSource(source, catalog = null) {
  const key = typeof source === 'string' ? source.trim() : '';
  if (!key) return null;

  for (const id of GUARDED_RETREAT_IDS) {
    const retreat = catalog ? catalog[id] : getRetreat(id);
    if (
      retreat &&
      retreat.source === key &&
      retreat.bookingStatus === BOOKING_STATUS.CLOSED
    ) {
      return retreat;
    }
  }
  return null;
}

/**
 * Throws an error with `code: 'BOOKING_CLOSED'` for a closed, guarded retreat source.
 * @param {unknown} source
 * @param {Record<string, object>} [catalog]
 */
export function assertRetreatRequestSourceOpen(source, catalog = null) {
  if (findClosedRetreatForRequestSource(source, catalog)) {
    const error = new Error('Registration is closed for this retreat');
    error.code = 'BOOKING_CLOSED';
    throw error;
  }
}
