import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { paymentLabel } from '../constants.js';
import { ensureBookingReference } from '../booking-reference.js';

function money(amount, currency) {
  const symbol = currency === 'USD' ? '$' : '₪';
  return `${symbol}${(Number(amount) || 0).toLocaleString('en-IL', { maximumFractionDigits: 2 })}`;
}

export async function generateReceiptPdf({ order, items = [], receipt }) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  const margin = 48;
  let y = height - margin;

  const item = items[0] || {};
  const meta = receipt?.metadata || {};
  const currency = receipt?.currency || meta.currency || order?.currency || 'ILS';
  const bookingReference = meta.bookingReference || ensureBookingReference(order);
  const docNumber = receipt?.document_number || 'NY-000000';
  const remainingAfter = Number(meta.remainingAfter ?? 0);
  const docType =
    receipt?.document_type === 'final_payment_receipt' || remainingAfter <= 0
      ? 'Payment receipt — balance settled'
      : 'Deposit / partial payment receipt';

  const totalBooking = Number(meta.totalBooking ?? order?.total ?? 0);
  const transactionAmount = Number(receipt?.amount ?? meta.transactionAmount ?? 0);
  const cumulativePaid = Number(meta.cumulativePaid ?? 0);
  const paymentDate = new Date(meta.paymentDate || receipt?.created_at || Date.now()).toLocaleDateString(
    'en-GB',
  );

  const draw = (text, opts = {}) => {
    const size = opts.size || 11;
    const f = opts.bold ? fontBold : font;
    page.drawText(String(text), {
      x: margin,
      y,
      size,
      font: f,
      color: rgb(0.15, 0.12, 0.1),
    });
    y -= size + (opts.gap ?? 6);
  };

  page.drawRectangle({
    x: margin,
    y: y - 4,
    width: width - margin * 2,
    height: 52,
    color: rgb(0.93, 0.9, 0.86),
  });
  y -= 8;
  draw('Nawal Yoga', { size: 20, bold: true, gap: 4 });
  draw(docType, { size: 12, gap: 14 });

  draw(`Document no.: ${docNumber}`, { bold: true });
  draw(`Booking reference: ${bookingReference}`);
  draw(`Customer: ${order?.customer?.fullName || meta.customerName || '—'}`);
  draw(`Experience: ${item.title || meta.experienceName || '—'}`);
  if (item.metadata?.eventDate || order?.metadata?.eventDate) {
    draw(`Experience date: ${item.metadata?.eventDate || order.metadata?.eventDate}`);
  }
  draw(`Payment date: ${paymentDate}`);
  y -= 8;
  draw('Amounts', { bold: true, size: 12 });
  draw(`Total booking price: ${money(totalBooking, currency)}`);
  draw(`Amount received (this payment): ${money(transactionAmount, currency)}`);
  if (meta.previousPaid > 0) {
    draw(`Previously received: ${money(meta.previousPaid, currency)}`);
  }
  draw(`Total paid to date: ${money(cumulativePaid, currency)}`);
  draw(`Remaining balance: ${money(remainingAfter, currency)}`);
  draw(
    `Payment method: ${paymentLabel(meta.paymentMethod || order?.payment_method)}`,
  );
  const ref = meta.providerTransactionId || meta.reference || receipt?.payment_transaction_id;
  if (ref) draw(`Payment reference: ${ref}`);
  y -= 10;
  draw(
    remainingAfter > 0
      ? 'This receipt confirms only the amount received in this transaction. The remaining balance is still outstanding.'
      : 'This receipt confirms the booking balance has been fully paid.',
    { size: 9, gap: 4 },
  );
  draw('Payment receipt — not a tax invoice unless issued separately.', { size: 8, gap: 20 });
  draw('nawalyoga.com', { size: 9 });

  return doc.save();
}
