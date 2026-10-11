import { verifyBookingAccess, verifyBookingAccessLoose } from '@/lib/commerce/booking-access';
import { getOrder, getOrderItems } from '@/lib/commerce/orders';
import { findReceiptByTransaction, listReceiptsForOrder } from '@/lib/commerce/receipts';
import { generateReceiptPdf } from '@/lib/commerce/pdf/generate-receipt';
import { PAYMENT_STATUS } from '@/lib/commerce/constants';
import { paymentSummary } from '@/lib/commerce/financials';

export async function GET(request, { params }) {
  const orderId = String(params.orderId || '').trim();
  const url = new URL(request.url);
  const token = String(url.searchParams.get('token') || '').trim();
  const receiptId = String(url.searchParams.get('receipt') || '').trim();
  const txnId = String(url.searchParams.get('txn') || '').trim();

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

  const summary = paymentSummary(order);
  if (
    summary.paymentStatus !== PAYMENT_STATUS.PAID &&
    summary.paymentStatus !== PAYMENT_STATUS.PARTIALLY_PAID
  ) {
    return Response.json({ error: 'No paid receipt available' }, { status: 400 });
  }

  let receipt = null;
  if (txnId) receipt = await findReceiptByTransaction(orderId, txnId);
  if (!receipt && receiptId) {
    const all = await listReceiptsForOrder(orderId);
    receipt = all.find((r) => r.id === receiptId) || null;
  }
  if (!receipt) {
    const all = await listReceiptsForOrder(orderId);
    receipt = all[all.length - 1] || null;
  }
  if (!receipt) {
    return Response.json({ error: 'Receipt not found' }, { status: 404 });
  }

  const items = await getOrderItems(orderId);
  const pdfBytes = await generateReceiptPdf({ order, items, receipt });

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${receipt.document_number}.pdf"`,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
