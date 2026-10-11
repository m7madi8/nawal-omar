/** Hyp Pay `Coin` values — @see https://developers.hyp.co.il/pay/reference/actions */
const COIN_BY_CURRENCY = {
  ILS: '1',
  USD: '2',
  EUR: '3',
  GBP: '4',
};

export function currencyToHypCoin(currency) {
  const code = String(currency || 'ILS').trim().toUpperCase();
  return COIN_BY_CURRENCY[code] || '1';
}

export function formatHypAmount(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    const error = new Error('Invalid payment amount');
    error.code = 'INVALID_AMOUNT';
    throw error;
  }
  // Hyp Pay examples use decimal amounts in major currency units (e.g. Amount=10 for 10 ILS).
  const rounded = Math.round(value * 100) / 100;
  return String(rounded);
}
