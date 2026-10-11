import { HYP_PAY_API_BASE, assertHypPayOperational, getHypPayConfig } from './config.js';
import { safeHypLogUrl } from './logging.js';

/**
 * Server-to-server GET to Hyp Pay (APISign SIGN / VERIFY).
 * Response body is a URL-encoded query string (not JSON).
 */
export async function hypPayGet(queryString) {
  const url = queryString.startsWith('http') ? queryString : `${HYP_PAY_API_BASE}?${queryString}`;
  const res = await fetch(url, { method: 'GET', cache: 'no-store' });
  const text = (await res.text()).trim();
  return { ok: res.ok, status: res.status, text };
}

export function parseHypQueryResponse(text) {
  const params = new URLSearchParams(text);
  const map = {};
  for (const [key, value] of params.entries()) {
    map[key] = value;
  }
  return { raw: text, params: map };
}

export function parseHypStatusCode(text) {
  const match = /(?:^|&)CCode=([^&]*)/.exec(text);
  if (!match) return null;
  return decodeURIComponent(match[1]);
}

export function isHypSuccessCode(ccode) {
  const code = String(ccode ?? '').trim();
  // Standard immediate charge success (see testing-environments.md).
  return code === '0';
}

/**
 * APISign SIGN — returns signed query string to append to payment page base URL.
 */
export async function requestPaymentPageSign(signParams) {
  assertHypPayOperational();
  let text;
  let ok;
  try {
    const res = await hypPayGet(signParams.toString());
    text = res.text;
    ok = res.ok;
  } catch (error) {
    const err = new Error('Could not reach the payment gateway');
    err.code = 'HYP_NETWORK';
    throw err;
  }
  if (!ok || !text || !text.includes('signature=')) {
    const error = new Error('Hyp Pay could not sign the payment request');
    error.code = 'HYP_SIGN_FAILED';
    throw error;
  }
  if (!text.includes('action=pay')) {
    const error = new Error('Unexpected Hyp Pay sign response');
    error.code = 'HYP_SIGN_FAILED';
    throw error;
  }
  return text;
}

/**
 * APISign VERIFY — redirectQuery must preserve parameter order from the success redirect.
 */
export async function verifyHypRedirect(redirectQuery) {
  assertHypPayOperational();
  const cfg = getHypPayConfig();
  const auth = new URLSearchParams({
    action: 'APISign',
    What: 'VERIFY',
    Masof: cfg.masof,
    KEY: cfg.apiKey,
    PassP: cfg.apiPassp,
  });
  const verifyQuery = `${auth.toString()}&${redirectQuery.replace(/^\?/, '')}`;
  const verifyUrl = `${HYP_PAY_API_BASE}?${verifyQuery}`;
  const { text, ok } = await hypPayGet(verifyUrl);
  const ccode = parseHypStatusCode(text);
  const verified = ok && isHypSuccessCode(ccode);
  return {
    verified,
    ccode,
    raw: text,
    requestUrlForLog: safeHypLogUrl(verifyUrl),
  };
}

export function buildHostedPaymentUrl(signedQueryString) {
  const qs = signedQueryString.replace(/^\?/, '');
  return `${HYP_PAY_API_BASE}?${qs}`;
}
