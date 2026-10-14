import { currencyToHypCoin, formatHypAmount } from './currency.js';
import { getHypPayConfig } from './config.js';

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first: '', last: '' };
  if (parts.length === 1) return { first: parts[0], last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

/** Hyp bit expects Israeli mobile without country code (05xxxxxxxx). */
function formatHypCell(phone) {
  let p = String(phone || '')
    .trim()
    .replace(/[\s\-().]/g, '');
  if (p.startsWith('+972')) p = `0${p.slice(4)}`;
  else if (p.startsWith('972')) p = `0${p.slice(3)}`;
  return p;
}

/**
 * Build APISign SIGN query for a hosted payment page.
 * @see https://developers.hyp.co.il/pay/getting-started/creating-a-payment-page#create-a-payment-page-request
 */
export function buildSignRequestParams({
  order,
  items,
  chargeAmount,
  paymentKind = 'full',
  description = '',
}) {
  const cfg = getHypPayConfig();
  const customer = order.customer || {};
  const { first, last } = splitName(customer.fullName);
  const item = items?.[0];
  const currency = order.currency || item?.currency || 'ILS';
  const amount = formatHypAmount(chargeAmount ?? order.total);

  const params = new URLSearchParams();
  params.set('action', 'APISign');
  params.set('What', 'SIGN');
  params.set('Sign', 'True');
  params.set('KEY', cfg.apiKey);
  params.set('PassP', cfg.apiPassp);
  params.set('Masof', cfg.masof);
  params.set('Amount', amount);
  params.set('Coin', currencyToHypCoin(currency));
  params.set('Order', order.id);
  params.set('PageLang', cfg.pageLang || 'HEB');

  if (cfg.pageTemplate) params.set('tmp', cfg.pageTemplate);
  if (first) params.set('ClientName', first);
  if (last) params.set('ClientLName', last);
  if (customer.email) params.set('email', customer.email);
  if (customer.phone) params.set('cell', formatHypCell(customer.phone));
  if (customer.city) params.set('city', customer.city);

  const infoParts = [
    description || item?.title || 'Nawal Yoga',
    paymentKind === 'deposit' ? '(deposit)' : '',
  ].filter(Boolean);
  if (infoParts.length) params.set('Info', infoParts.join(' '));

  // Free fields returned on redirect (Fild1–Fild3).
  params.set('Fild1', order.id);
  if (customer.email) params.set('Fild2', customer.email);
  params.set('Fild3', paymentKind);

  if (!cfg.allowInstallments) {
    // Single payment only — do not send Tash>1 or tashType (credit installments).
    params.set('Tash', '1');
    params.set('FixTash', 'True');
  }

  // Show card / Apple Pay / Google Pay / bit buttons when enabled on the terminal.
  params.set('hideBtns', 'False');

  return { params, amount, currency, paymentKind };
}
