import { CUSTOMER_BOOKING_STATUS, PAYMENT_STATUS } from './constants.js';

import { ensureBookingReference } from './booking-reference.js';

import { paymentSummary } from './financials.js';

import { parseOrderNote } from './orders.js';

import { SUPABASE_TABLE_RETREAT_REQUESTS, supabaseGetById, supabaseUpdate } from './supabase.js';



function mergeNote(row, patch) {

  let note = parseOrderNote(row.freeNote) || {};

  if (!note.commerceOrderId) {

    try {

      const parsed = JSON.parse(row.freeNote || '{}');

      if (parsed && typeof parsed === 'object') note = { ...note, ...parsed };

    } catch {

      /* ignore */

    }

  }

  return { ...note, ...patch };

}



export async function updateLegacyMirrorPaid(order, sessionId = '') {

  const legacyId = order?.metadata?.legacyMirrorId;

  if (!legacyId) return null;



  const row = await supabaseGetById(SUPABASE_TABLE_RETREAT_REQUESTS, legacyId);

  if (!row) return null;



  const summary = paymentSummary(order);

  const existingNote = mergeNote(row, {});

  // Only touch the mirror that really belongs to this order (the note written at checkout
  // carries the order id). An unrelated request row is never modified.
  if (existingNote.commerceOrderId !== order.id) return null;

  // Booking status follows the order: finalization only sets it to confirmed after a verified
  // payment, so mirror it only in that case (never because a checkout was merely started).
  const orderConfirmed =
    order.metadata?.bookingStatus === CUSTOMER_BOOKING_STATUS.CONFIRMED &&
    (summary.paymentStatus === PAYMENT_STATUS.PAID ||
      summary.paymentStatus === PAYMENT_STATUS.PARTIALLY_PAID);

  const note = mergeNote(row, {

    paid: summary.paymentStatus === PAYMENT_STATUS.PAID,

    paymentStatus: summary.paymentStatus,

    amountPaid: summary.amountPaid,

    remainingBalance: summary.remaining,

    bookingReference: ensureBookingReference(order),

    ...(orderConfirmed ? { bookingStatus: CUSTOMER_BOOKING_STATUS.CONFIRMED } : {}),

    providerTransactionId: sessionId || order.metadata?.hypTransactionId || '',

    stripeSessionId: sessionId || existingNote.stripeSessionId || '',

  });



  const yogaExperience =

    summary.paymentStatus === PAYMENT_STATUS.PAID || summary.paymentStatus === PAYMENT_STATUS.PARTIALLY_PAID

      ? summary.paymentStatus === PAYMENT_STATUS.PAID

        ? 'paid'

        : 'partial'

      : row.yogaExperience;



  return supabaseUpdate(SUPABASE_TABLE_RETREAT_REQUESTS, legacyId, {

    yogaExperience,

    healthDetails: sessionId || row.healthDetails || order.metadata?.hypTransactionId || '',

    freeNote: JSON.stringify(note),

    status: summary.amountPaid > 0 ? 'completed' : row.status,

  });

}



export async function syncLegacyMirrorFromOrder(order) {

  const legacyId = order?.metadata?.legacyMirrorId;

  if (!legacyId) return null;

  const row = await supabaseGetById(SUPABASE_TABLE_RETREAT_REQUESTS, legacyId);

  if (!row) return null;



  const summary = paymentSummary(order);

  const bookingStatus = order.metadata?.bookingStatus || CUSTOMER_BOOKING_STATUS.NEW_REQUEST;

  const note = mergeNote(row, {

    paymentStatus: summary.paymentStatus,

    amountPaid: summary.amountPaid,

    remainingBalance: summary.remaining,

    bookingStatus,

    bookingReference: ensureBookingReference(order),

  });



  return supabaseUpdate(SUPABASE_TABLE_RETREAT_REQUESTS, legacyId, {

    freeNote: JSON.stringify(note),

    status:

      bookingStatus === CUSTOMER_BOOKING_STATUS.CONFIRMED

        ? 'completed'

        : bookingStatus === CUSTOMER_BOOKING_STATUS.DECLINED ||

            bookingStatus === CUSTOMER_BOOKING_STATUS.CANCELLED

          ? 'cancelled'

          : row.status,

    yogaExperience:

      summary.paymentStatus === PAYMENT_STATUS.PAID

        ? 'paid'

        : summary.paymentStatus === PAYMENT_STATUS.PARTIALLY_PAID

          ? 'partial'

          : row.yogaExperience,

  });

}


