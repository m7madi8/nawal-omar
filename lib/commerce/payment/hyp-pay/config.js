/**
 * Hyp Pay (YaadPay) configuration — server-side only.
 * @see https://developers.hyp.co.il/pay/getting-started/creating-a-payment-page
 */

export const HYP_PAY_API_BASE = 'https://pay.hyp.co.il/p/';

/** Test terminals start with 00100 per Hyp Pay testing docs. */
export function isHypTestTerminal(masof) {
  return String(masof || '').startsWith('00100');
}

export function getHypPayConfig() {
  const masof = String(process.env.HYP_TERMINAL_ID || process.env.HYP_TERMINAL_MASOF || '').trim();
  const apiKey = String(process.env.HYP_API_KEY || '').trim();
  const apiPassp = String(
    process.env.HYP_API_PASSP || process.env.HYP_PASSWORD || process.env.HYP_PASSP || '',
  ).trim();
  const environment = String(process.env.HYP_ENVIRONMENT || 'production').trim().toLowerCase();
  const paymentsEnabled = process.env.HYP_PAYMENTS_ENABLED === 'true';

  return {
    masof,
    apiKey,
    apiPassp,
    environment,
    paymentsEnabled,
    returnUrl: String(process.env.HYP_RETURN_URL || '').trim(),
    pageLang: String(process.env.HYP_PAGE_LANG || 'HEB').trim(),
    pageTemplate: String(process.env.HYP_PAGE_TEMPLATE || '').trim(),
    /** When false (default), hosted page is single charge only (no installment dropdown). */
    allowInstallments: process.env.HYP_ALLOW_INSTALLMENTS === 'true',
  };
}

/** Methods shown on Hyp's hosted page when enabled in the merchant terminal (not toggled per-method in API). */
export function getHypHostedPaymentMethods() {
  const cfg = getHypPayConfig();
  return {
    provider: 'hyp',
    hostedPage: true,
    card: true,
    applePay: true,
    googlePay: true,
    bit: true,
    installments: cfg.allowInstallments,
  };
}

export function isHypPayConfigured() {
  const cfg = getHypPayConfig();
  return Boolean(cfg.masof && cfg.apiKey && cfg.apiPassp);
}

/** Live Hyp Pay sessions are only created when explicitly enabled and credentials exist. */
export function isHypPayOperational() {
  const cfg = getHypPayConfig();
  return cfg.paymentsEnabled && isHypPayConfigured();
}

export function assertHypPayOperational() {
  if (!isHypPayOperational()) {
    const error = new Error('Hyp Pay is not enabled or not fully configured');
    error.code = 'HYP_DISABLED';
    throw error;
  }
}
