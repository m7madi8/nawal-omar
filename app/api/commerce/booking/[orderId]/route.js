import { bookingAccessToken, verifyBookingAccess, verifyBookingAccessLoose } from '@/lib/commerce/booking-access';
import { getOrder, getOrderItems } from '@/lib/commerce/orders';
import { paymentSummary } from '@/lib/commerce/financials';
import { whatsappFromOrder } from '@/lib/commerce/whatsapp-messages';
import { listReceiptsForOrder } from '@/lib/commerce/receipts';
import { PAYMENT_STATUS } from '@/lib/commerce/constants';
import { bookingBackPath } from '@/lib/commerce/thanks-path';

export async function GET(request, { params }) {
  const orderId = String(params.orderId || '').trim();
  if (!orderId) {
    return Response.json({ error: 'Missing order' }, { status: 400 });
  }

  const url = new URL(request.url);
  const token = String(url.searchParams.get('token') || '').trim();
  const lang = String(url.searchParams.get('lang') || 'ar').trim() === 'en' ? 'en' : 'ar';
  const order = await getOrder(orderId);
  if (!order) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const phone = order.customer?.phone || '';
  const allowed =
    verifyBookingAccess(orderId, phone, token) || verifyBookingAccessLoose(orderId, token);
  if (!allowed) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const items = await getOrderItems(orderId);
  const summary = paymentSummary(order);
  const paid =
    summary.paymentStatus === PAYMENT_STATUS.PAID ||
    summary.paymentStatus === PAYMENT_STATUS.PARTIALLY_PAID;
  const receipts = paid ? await listReceiptsForOrder(orderId) : [];

  const commerceType = order.metadata?.commerceType || items[0]?.commerce_type || '';
  const itemId = order.metadata?.itemId || items[0]?.item_id || '';
  const accessToken = bookingAccessToken(orderId, phone);
  const pdfUrl =
    paid && accessToken
      ? `/api/commerce/receipt/${encodeURIComponent(orderId)}?token=${encodeURIComponent(accessToken)}`
      : null;

  return Response.json({
    ok: true,
    orderId,
    commerceType,
    itemId,
    backPath: bookingBackPath(commerceType, itemId),
    bookingReference: order.metadata?.bookingReference || order.booking_reference,
    bookingStatus: order.metadata?.bookingStatus,
    paymentStatus: summary.paymentStatus,
    experience: items[0]?.title || order.metadata?.itemId,
    experienceDate: items[0]?.metadata?.eventDate || null,
    customerName: order.customer?.fullName || '',
    total: summary.total,
    amountPaid: summary.amountPaid,
    remaining: summary.remaining,
    currency: summary.currency,
    paymentVerified: paid,
    receipts: receipts.map((r) => ({
      id: r.id,
      documentNumber: r.document_number,
      amount: r.amount,
      createdAt: r.created_at,
    })),
    pdfUrl,
    whatsappUrl: paid ? whatsappFromOrder(order, items, lang) : null,
    accessToken,
  });
}
