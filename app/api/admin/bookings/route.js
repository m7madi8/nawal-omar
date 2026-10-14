import { guardResponse, requireAdminAccess } from '@/lib/admin-auth';
import { PERMISSION } from '@/lib/admin/permissions';
import {
  recordOfflinePayment,
  updateBookingStatus,
  updateRetreatRequestBooking,
} from '@/lib/commerce/booking-admin';
import { CUSTOMER_BOOKING_STATUS } from '@/lib/commerce/constants';

const ALLOWED_BOOKING_STATUSES = new Set(Object.values(CUSTOMER_BOOKING_STATUS));

export async function POST(request) {
  const guard = await requireAdminAccess(request, {
    permission: PERMISSION.BOOKINGS_UPDATE,
    mutation: true,
  });
  const denied = guardResponse(guard);
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const action = String(body.action || '').trim();
  const actor = String(body.actor || 'staff').trim();

  try {
    if (action === 'set_booking_status') {
      const orderId = String(body.orderId || '').trim();
      const bookingStatus = String(body.bookingStatus || '').trim();
      if (!orderId || !ALLOWED_BOOKING_STATUSES.has(bookingStatus)) {
        return Response.json({ error: 'Invalid parameters' }, { status: 400 });
      }
      const order = await updateBookingStatus(orderId, bookingStatus, actor);
      return Response.json({ ok: true, orderId: order.id, bookingStatus });
    }

    if (action === 'record_offline_payment') {
      const orderId = String(body.orderId || '').trim();
      const order = await recordOfflinePayment({
        orderId,
        amount: body.amount,
        method: body.method,
        paymentDate: body.paymentDate,
        reference: body.reference,
        note: body.note,
        actor,
      });
      return Response.json({ ok: true, orderId: order.id, paymentStatus: order.payment_status });
    }

    if (action === 'set_request_status') {
      const requestId = String(body.requestId || '').trim();
      const bookingStatus = String(body.bookingStatus || '').trim();
      if (!requestId || !ALLOWED_BOOKING_STATUSES.has(bookingStatus)) {
        return Response.json({ error: 'Invalid parameters' }, { status: 400 });
      }
      const row = await updateRetreatRequestBooking({
        requestId,
        bookingStatus,
        internalNote: body.internalNote,
        actor,
      });
      return Response.json({ ok: true, requestId: row.id, bookingStatus });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    const status =
      error.code === 'ORDER_NOT_FOUND' || error.code === 'REQUEST_NOT_FOUND'
        ? 404
        : error.code === 'INVALID_AMOUNT' || error.code === 'INVALID_METHOD'
          ? 400
          : 500;
    return Response.json(
      { error: error.message || 'Action failed', code: error.code || 'FAILED' },
      { status },
    );
  }
}
