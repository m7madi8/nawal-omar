const SENSITIVE_KEYS = new Set(['KEY', 'PassP', 'passp', 'password', 'signature', 'Sign', 'Token', 'card']);

export function maskHypSecretsInQuery(queryString) {
  if (!queryString) return '';
  return queryString
    .split('&')
    .map((pair) => {
      const eq = pair.indexOf('=');
      if (eq === -1) return pair;
      const key = pair.slice(0, eq);
      if (!SENSITIVE_KEYS.has(key)) return pair;
      return `${key}=[redacted]`;
    })
    .join('&');
}

export function safeHypLogUrl(url) {
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}?${maskHypSecretsInQuery(u.search.replace(/^\?/, ''))}`;
  } catch {
    return maskHypSecretsInQuery(String(url));
  }
}

export function logHypPaymentEvent(event, data = {}) {
  const payload = { provider: 'hyp', event, ...data };
  console.info('[hyp-pay]', JSON.stringify(payload));
}
