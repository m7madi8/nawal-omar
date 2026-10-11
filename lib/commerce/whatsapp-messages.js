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
}) {
  const lines = [
    'Hello Nawal,',
    '',
    'I have completed an online payment for my booking.',
    '',
    `Booking reference: ${bookingReference}`,
    `Experience: ${experienceName}`,
    `Amount paid: ${formatMoney(amountPaid, currency)}`,
    `Remaining balance: ${formatMoney(remaining, currency)}`,
    `Payment status: ${paymentStatusLabel}`,
    '',
    'I would like to confirm the details of my booking.',
    '',
    'Thank you.',
  ];
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
  const bookingReference = order?.metadata?.bookingReference || order?.id;
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
