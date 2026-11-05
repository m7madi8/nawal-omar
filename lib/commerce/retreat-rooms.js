import { BOOKING_STATUS } from './constants.js';

const hasOwn = Object.prototype.hasOwnProperty;

/** True when a retreat catalog entry sells distinct rooms (currently Wadi Rum only). */
export function retreatHasRooms(catalogItem) {
  return Boolean(catalogItem && catalogItem.rooms && typeof catalogItem.rooms === 'object');
}

/**
 * Resolve a server-side room definition from the retreat catalog.
 * - Returns null for retreats without rooms (their behaviour is unchanged).
 * - For retreats with rooms, accepts ONLY an exact own-property string id; anything else
 *   (missing, null, empty, whitespace, wrong case, non-string, inherited keys such as
 *   `constructor` / `toString` / `__proto__`) throws INVALID_ROOM. Never falls back to a default.
 */
export function resolveRetreatRoom(catalogItem, roomId) {
  if (!retreatHasRooms(catalogItem)) return null;
  if (typeof roomId !== 'string' || !hasOwn.call(catalogItem.rooms, roomId)) {
    const error = new Error('Please choose a valid room');
    error.code = 'INVALID_ROOM';
    throw error;
  }
  const room = catalogItem.rooms[roomId];
  if (room.bookingStatus === BOOKING_STATUS.SOLD_OUT) {
    const error = new Error('This room option is sold out');
    error.code = 'ROOM_SOLD_OUT';
    throw error;
  }
  return room;
}

/** Order line title that names the room (ASCII separator keeps Hyp Info and PDF text safe). */
export function retreatRoomLineTitle(catalogItem, room) {
  return `${catalogItem.title.en} - ${room.label.en}`;
}
