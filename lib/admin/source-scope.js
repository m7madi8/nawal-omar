/** Registration / commerce visibility for scoped staff (not owner/developer). */

export const STAFF_SOURCE_SCOPES = {
  'wadi-rum': {
    registrationSources: ['wadi-rum-registration', 'feedback-wadi-rum'],
    commerceItemIds: ['wadi-rum'],
  },
};

function parseCommerceItemIdFromRow(row) {
  if (!row || typeof row !== 'object') return '';
  for (const field of ['commerceNote', 'freeNote']) {
    const raw = row[field];
    if (typeof raw !== 'string' || !raw || raw === '-') continue;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.commerceOrderId) continue;
      const direct = parsed.itemId || parsed.productId;
      if (direct) return String(direct).trim();
      const first = Array.isArray(parsed.items) ? parsed.items[0] : null;
      if (first?.item_id) return String(first.item_id).trim();
      if (parsed.commerceType === 'retreat') return 'wadi-rum';
    } catch {
      /* not JSON */
    }
  }
  const meta = row.metadata;
  if (meta && typeof meta === 'object' && meta.itemId) return String(meta.itemId).trim();
  return '';
}

export function normalizeStaffSourceScope(value) {
  const key = String(value || '').trim();
  return key && STAFF_SOURCE_SCOPES[key] ? key : '';
}

export function sessionStaffSourceScope(session) {
  if (!session) return '';
  const role = String(session.role || '').toLowerCase();
  if (role === 'owner' || role === 'developer') return '';
  return normalizeStaffSourceScope(session.sourceScope);
}

export function registrationRowInStaffScope(row, scopeKey) {
  const key = normalizeStaffSourceScope(scopeKey);
  if (!key) return true;
  const scope = STAFF_SOURCE_SCOPES[key];
  const source = String(row?.source || '').trim();
  if (scope.registrationSources.includes(source)) return true;
  const itemId = parseCommerceItemIdFromRow(row);
  return Boolean(itemId && scope.commerceItemIds.includes(itemId));
}

export function filterRegistrationRowsForSession(rows, session) {
  const scopeKey = sessionStaffSourceScope(session);
  if (!scopeKey || !Array.isArray(rows)) return rows || [];
  return rows.filter((row) => registrationRowInStaffScope(row, scopeKey));
}

export function commerceOrderInStaffScope(order, scopeKey) {
  const key = normalizeStaffSourceScope(scopeKey);
  if (!key) return true;
  const scope = STAFF_SOURCE_SCOPES[key];
  const itemId = String(order?.metadata?.itemId || '').trim();
  return scope.commerceItemIds.includes(itemId);
}
