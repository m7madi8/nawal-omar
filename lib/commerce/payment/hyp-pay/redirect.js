/**
 * Parse Hyp Pay success redirect query string without reordering (required for VERIFY).
 */
export function extractRedirectQueryFromUrl(requestUrl) {
  const url = String(requestUrl || '');
  const qIndex = url.indexOf('?');
  if (qIndex === -1) return '';
  const hashIndex = url.indexOf('#', qIndex);
  return url.slice(qIndex + 1, hashIndex === -1 ? undefined : hashIndex);
}

export function parseRedirectParamsPreservingOrder(rawQuery) {
  const map = {};
  const pairs = [];
  const qs = String(rawQuery || '').replace(/^\?/, '');
  if (!qs) return { map, pairs, raw: '' };

  for (const segment of qs.split('&')) {
    if (!segment) continue;
    const eq = segment.indexOf('=');
    const key = eq === -1 ? segment : segment.slice(0, eq);
    const value = eq === -1 ? '' : segment.slice(eq + 1);
    const decodedKey = decodeURIComponent(key.replace(/\+/g, ' '));
    const decodedValue = decodeURIComponent(value.replace(/\+/g, ' '));
    map[decodedKey] = decodedValue;
    pairs.push({ key: decodedKey, rawKey: key, rawValue: value });
  }

  return { map, pairs, raw: qs };
}
