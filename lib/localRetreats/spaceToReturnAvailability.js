import { BOOKING_STATUS } from '../commerce/constants.js';
import { STR_ROOM_IDS } from './spaceToReturnCommerce.js';

/** First-five 10% discount — fully claimed. */
export const STR_EARLY_BIRD_DISCOUNT_SOLD_OUT = true;

/** Per-room registration availability (must match catalog `rooms.*.bookingStatus`). */
export const STR_ROOM_BOOKING = Object.freeze({
  double: BOOKING_STATUS.OPEN,
  triple: BOOKING_STATUS.SOLD_OUT,
});

export function isStrRoomSoldOut(roomId) {
  return STR_ROOM_BOOKING[roomId] === BOOKING_STATUS.SOLD_OUT;
}

export function getStrOpenRoomIds() {
  return STR_ROOM_IDS.filter((id) => !isStrRoomSoldOut(id));
}
