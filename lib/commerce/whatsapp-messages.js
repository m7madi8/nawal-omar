import { COMMERCE_WHATSAPP } from './constants.js';
import { paymentSummary } from './financials.js';
import { paymentLabel } from './constants.js';

function formatMoney(amount, currency) {
  const symbol = currency === 'USD' ? '$' : '₪';
  const value = Number(amount) || 0;
  return `${symbol}${value.toLocaleString('en-IL', { maximumFractionDigits: 2 })}`;
}

export function whatsappClickUrl(message) {
  return `https://wa.me/${COMMERCE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function buildPaidBookingWhatsAppMessage({
  bookingReference,
  experienceName,
  amountPaid,
  remaining,
  currency,
  paymentStatusLabel,
  customerName,
  customerPhone,
  lang = 'en',
}) {
  if (lang === 'ar') {
    const lines = [
      'مرحباً نوال،',
      '',
      'تم الاشتراك والدفع بنجاح ✅',
      '',
      customerName ? `الاسم: ${customerName}` : '',
      customerPhone ? `الهاتف: ${customerPhone}` : '',
      `الحجز / الباقة: ${experienceName}`,
      `رقم المرجع: ${bookingReference}`,
      `المبلغ المدفوع: ${formatMoney(amountPaid, currency)}`,
      remaining > 0 ? `المتبقي: ${formatMoney(remaining, currency)}` : '',
      `الحالة: ${paymentStatusLabel === 'Paid' ? 'مدفوع بالكامل' : paymentStatusLabel}`,
      '',
      'أرفقتُ إيصال الدفع من الموقع.',
      'شكراً 🙏',
    ].filter(Boolean);
    return lines.join('\n');
  }

  const lines = [
    'Hello Nawal,',
    '',
    'Subscription and payment completed successfully ✅',
    '',
    customerName ? `Name: ${customerName}` : '',
    customerPhone ? `Phone: ${customerPhone}` : '',
    `Booking: ${experienceName}`,
    `Reference: ${bookingReference}`,
    `Amount paid: ${formatMoney(amountPaid, currency)}`,
    remaining > 0 ? `Remaining: ${formatMoney(remaining, currency)}` : '',
    `Status: ${paymentStatusLabel}`,
    '',
    'Payment receipt downloaded from the website.',
    '',
    'Thank you.',
  ].filter(Boolean);
  return lines.join('\n');
}

export function buildManualRequestWhatsAppMessage({
  bookingReference,
  experienceName,
  customerName,
}) {
  const lines = [
    'Hello Nawal,',
    '',
    `I submitted a booking request (not yet confirmed).`,
    '',
    bookingReference ? `Reference: ${bookingReference}` : '',
    `Experience: ${experienceName}`,
    customerName ? `Name: ${customerName}` : '',
    '',
    'I would like to discuss the details with you.',
    '',
    'Thank you.',
  ].filter(Boolean);
  return lines.join('\n');
}

export function whatsappFromOrder(order, items = [], lang = 'en') {
  const item = items[0] || {};
  const summary = paymentSummary(order);
  const bookingReference = order?.metadata?.bookingReference || order?.booking_reference || order?.id;
  const experienceName = item.title || order?.metadata?.itemId || 'Booking';
  const paymentStatusLabel =
    summary.paymentStatus === 'paid'
      ? 'Paid'
      : summary.paymentStatus === 'partially_paid'
        ? 'Partially paid'
        : 'Unpaid';

  if (summary.amountPaid > 0 && order?.payment_status !== 'failed') {
    return whatsappClickUrl(
      buildPaidBookingWhatsAppMessage({
        bookingReference,
        experienceName,
        amountPaid: summary.amountPaid,
        remaining: summary.remaining,
        currency: summary.currency,
        paymentStatusLabel,
        customerName: order?.customer?.fullName || '',
        customerPhone: order?.customer?.phone || '',
        lang,
      }),
    );
  }

  return whatsappClickUrl(
    buildManualRequestWhatsAppMessage({
      bookingReference,
      experienceName,
      customerName: order?.customer?.fullName || '',
    }),
  );
}

export function paymentStatusLabelForMessage(status) {
  const map = {
    unpaid: 'Unpaid',
    pending: 'Pending',
    partially_paid: 'Partially paid',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
    partially_refunded: 'Partially refunded',
  };
  return map[status] || paymentLabel(status);
}
