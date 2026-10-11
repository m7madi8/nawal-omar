import assert from 'node:assert/strict';
import { mapReceiptToInvoice } from '../lib/commerce/invoices.js';
import { bookingReferenceFromOrderId } from '../lib/commerce/booking-reference.js';
import {
  appendPaymentHistory,
  derivePaymentStatus,
  paymentSummary,
  readAmountPaid,
  remainingBalance,
} from '../lib/commerce/financials.js';
import { bookingAccessToken, verifyBookingAccess } from '../lib/commerce/booking-access.js';
import {
  buildManualRequestWhatsAppMessage,
  buildPaidBookingWhatsAppMessage,
  whatsappClickUrl,
} from '../lib/commerce/whatsapp-messages.js';
import { PAYMENT_STATUS } from '../lib/commerce/constants.js';

process.env.BOOKING_ACCESS_SECRET = 'test-secret';

assert.match(bookingReferenceFromOrderId('ord-abc'), /^BK-\d{5}$/);

const order = {
  id: 'ord-test-1',
  total: 3650,
  currency: 'ILS',
  payment_status: PAYMENT_STATUS.UNPAID,
  metadata: { chargeAmount: 400, paymentKind: 'deposit' },
};

assert.equal(readAmountPaid(order), 0);
assert.equal(remainingBalance(order), 3650);

const withDeposit = {
  ...order,
  payment_status: PAYMENT_STATUS.PARTIALLY_PAID,
  metadata: {
    ...order.metadata,
    amountPaid: 400,
    paymentHistory: appendPaymentHistory(order, { amount: 400, method: 'hyp' }),
  },
};
assert.equal(derivePaymentStatus(withDeposit, 400), PAYMENT_STATUS.PARTIALLY_PAID);
assert.equal(paymentSummary(withDeposit).remaining, 3250);

const token = bookingAccessToken('ord-test-1', '+972521234567');
assert.ok(verifyBookingAccess('ord-test-1', '+972521234567', token));
assert.ok(!verifyBookingAccess('ord-test-1', '+972000000000', token));

const waMsg = buildPaidBookingWhatsAppMessage({
  bookingReference: 'BK-00124',
  experienceName: 'Wadi Rum',
  amountPaid: 400,
  remaining: 3250,
  currency: 'ILS',
  paymentStatusLabel: 'Partially paid',
});
const waUrl = whatsappClickUrl(waMsg);
assert.ok(waUrl.includes('wa.me/'));
assert.ok(waUrl.includes(encodeURIComponent('BK-00124')));

const manualMsg = buildManualRequestWhatsAppMessage({
  bookingReference: 'req-1',
  experienceName: 'Wadi Rum',
  customerName: 'Sara',
});
assert.ok(manualMsg.includes('booking request'));

const sampleReceipt = {
  id: 'rcpt-1',
  order_id: 'ord-1',
  document_number: 'NY-000042',
  document_type: 'deposit_receipt',
  payment_transaction_id: 'hyp-123',
  amount: 400,
  currency: 'ILS',
  created_at: '2026-10-01T12:00:00.000Z',
  metadata: {
    bookingReference: 'BK-00124',
    customerName: 'Sara',
    experienceName: 'Wadi Rum',
    totalBooking: 3650,
    previousPaid: 0,
    cumulativePaid: 400,
    remainingAfter: 3250,
    transactionAmount: 400,
    documentStatus: 'paid',
    paymentMethod: 'hyp',
    source: 'online',
  },
};

const mapped = mapReceiptToInvoice(sampleReceipt);
assert.equal(mapped.documentNumber, 'NY-000042');
assert.equal(mapped.transactionAmount, 400);
assert.equal(mapped.remainingAfter, 3250);
assert.equal(mapped.source, 'online');

console.log('test-commerce-booking: all assertions passed');
