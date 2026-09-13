import { BOOKING_STATUS, ORDER_STATUS, PAYMENT_STATUS } from './constants.js';
import { getEvent } from './catalog/events.js';
import { SUPABASE_TABLE_ORDER_ITEMS, SUPABASE_TABLE_ORDERS, supabaseSelect } from './supabase.js';

export async function countReservedSeats(eventId) {
  const items = await supabaseSelect(
    SUPABASE_TABLE_ORDER_ITEMS,
    `commerce_type=eq.event&item_id=eq.${encodeURIComponent(eventId)}&select=quantity,order_id`,
  );

  if (!items?.length) return 0;

  const orderIds = [...new Set(items.map((item) => item.order_id).filter(Boolean))];
  if (!orderIds.length) return 0;

  const orderFilter = orderIds.map((id) => `id.eq.${id}`).join(',');
  const orders = await supabaseSelect(
    SUPABASE_TABLE_ORDERS,
    `or=(${orderFilter})&select=id,status,payment_status`,
  );

  const activeOrderIds = new Set(
    (orders || [])
      .filter(
        (order) =>
          [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(order.status) &&
          order.payment_status !== PAYMENT_STATUS.CANCELLED,
      )
      .map((order) => order.id),
  );

  return items.reduce((sum, item) => {
    if (!activeOrderIds.has(item.order_id)) return sum;
    return sum + (Number(item.quantity) || 1);
  }, 0);
}

export async function getCapacityState(eventId) {
  const event = getEvent(eventId);
  if (!event) {
    return {
      capacity: null,
      reservedSeats: 0,
      availableSeats: null,
      bookingStatus: BOOKING_STATUS.CLOSED,
    };
  }

  const capacity = event.capacity ?? null;
  const reservedSeats = await countReservedSeats(eventId);
  const availableSeats = capacity === null ? null : Math.max(0, capacity - reservedSeats);

  let bookingStatus = event.bookingStatus || BOOKING_STATUS.OPEN;
  if (bookingStatus === BOOKING_STATUS.OPEN && capacity !== null && availableSeats <= 0) {
    bookingStatus = BOOKING_STATUS.SOLD_OUT;
  }

  return {
    capacity,
    reservedSeats,
    availableSeats,
    bookingStatus,
  };
}

export async function assertAvailability({ commerceType, itemId, quantity = 1 }) {
  if (commerceType !== 'event') return { ok: true };

  const event = getEvent(itemId);
  if (!event) {
    const error = new Error('Unknown event');
    error.code = 'UNKNOWN_ITEM';
    throw error;
  }

  if (event.bookingStatus === BOOKING_STATUS.CLOSED) {
    const error = new Error('Registration is closed for this event');
    error.code = 'BOOKING_CLOSED';
    throw error;
  }

  const state = await getCapacityState(itemId);
  if (state.bookingStatus === BOOKING_STATUS.SOLD_OUT) {
    const error = new Error('This event is sold out');
    error.code = 'SOLD_OUT';
    throw error;
  }

  const qty = Math.max(1, Number(quantity) || 1);
  if (state.capacity !== null && state.availableSeats !== null && qty > state.availableSeats) {
    const error = new Error('Not enough seats available');
    error.code = 'INSUFFICIENT_CAPACITY';
    throw error;
  }

  return { ok: true, capacity: state };
}
