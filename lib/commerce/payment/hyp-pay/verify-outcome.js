function parseHypStatusCode(text) {
  const match = /(?:^|&)CCode=([^&]*)/.exec(String(text || ''));
  if (!match) return null;
  return decodeURIComponent(match[1]);
}

function isHypSuccessCode(ccode) {
  return String(ccode ?? '').trim() === '0';
}

/**
 * Classify Hyp APISign VERIFY HTTP result (fail-closed).
 * Authoritative success is CCode=0 per project Hyp integration docs (hyp-pay.md).
 * Numeric non-zero CCode is treated as VERIFY-established failure (same code family as redirect).
 * Missing, malformed, or unrecognized bodies are unavailable — never definitive decline.
 *
 * @param {{ ok: boolean, status?: number, text: string }} httpResult
 * @returns {{ outcome: 'paid' | 'declined' | 'unavailable', verified: boolean, ccode: string | null }}
 */
export function classifyHypVerifyOutcome(httpResult) {
  const text = String(httpResult?.text ?? '').trim();
  const ok = Boolean(httpResult?.ok);

  if (!text) {
    return { outcome: 'unavailable', verified: false, ccode: null };
  }
  if (!ok) {
    const ccode = parseHypStatusCode(text);
    return { outcome: 'unavailable', verified: false, ccode };
  }

  const ccodeRaw = parseHypStatusCode(text);
  if (ccodeRaw == null || String(ccodeRaw).trim() === '') {
    return { outcome: 'unavailable', verified: false, ccode: null };
  }

  const ccode = String(ccodeRaw).trim();

  if (isHypSuccessCode(ccode)) {
    return { outcome: 'paid', verified: true, ccode };
  }

  if (/^\d+$/.test(ccode)) {
    return { outcome: 'declined', verified: false, ccode };
  }

  return { outcome: 'unavailable', verified: false, ccode };
}
