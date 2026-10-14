import { WADI_RUM_DEPOSIT_ILS } from './constants.js';

function reject(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

function readClientAmountHint(body) {
  const raw = body.depositAmount ?? body.chargeAmount;
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function readPaymentPlan(body) {
  const raw = String(
    body.paymentPlan || body.paymentKind || body.paymentType || '',
  )
    .trim()
    .toLowerCase();
  if (!raw) return '';
  return raw;
}

/**
 * Server-authoritative charge amount and payment kind for checkout.
 * @param {{
 *   commerceType: string,
 *   itemId: string,
 *   catalogItem: object,
 *   line: { unitPrice: number, quantity: number, currency: string },
 *   body: object,
 *   paymentMethod: string,
 * }} input
 */
export function resolveCheckoutCharge({
  commerceType,
  itemId,
  catalogItem,
  line,
  body,
  paymentMethod,
}) {
  const subtotal = line.unitPrice * line.quantity;
  const clientHint = readClientAmountHint(body);
  const plan = readPaymentPlan(body);
  const method = String(paymentMethod || '').toLowerCase();

  if (commerceType === 'retreat' && itemId === 'wadi-rum') {
    if (method === 'hyp') {
      if (plan === 'full') {
        reject(
          'PAYMENT_PLAN_NOT_SUPPORTED',
          'Full retreat payment online is not available; use deposit checkout',
        );
      }
      const chargeAmount = WADI_RUM_DEPOSIT_ILS;
      if (clientHint != null && clientHint !== chargeAmount) {
        reject('INVALID_CHARGE_AMOUNT', 'Deposit amount does not match catalog');
      }
      if (chargeAmount >= subtotal) {
        reject('INVALID_CHARGE_AMOUNT', 'Deposit must be less than retreat total');
      }
      return { paymentKind: 'deposit', chargeAmount, amountDue: subtotal };
    }
    return { paymentKind: 'full', chargeAmount: subtotal, amountDue: subtotal };
  }

  if (clientHint != null && clientHint !== subtotal) {
    reject('INVALID_CHARGE_AMOUNT', 'Charge amount does not match catalog price');
  }
  if (plan && plan !== 'full' && plan !== 'deposit') {
    reject('PAYMENT_PLAN_NOT_SUPPORTED', 'Unsupported payment plan');
  }
  if (plan === 'deposit' && commerceType !== 'retreat') {
    reject('PAYMENT_PLAN_NOT_SUPPORTED', 'Deposit checkout is not available for this item');
  }

  return { paymentKind: 'full', chargeAmount: subtotal, amountDue: subtotal };
}
