/** Server-side API permissions (not UI view ids). */

export const PERMISSION = {
  REGISTRATIONS_READ: 'registrations.read',
  REGISTRATIONS_UPDATE: 'registrations.update',
  REGISTRATIONS_DELETE: 'registrations.delete',
  BOOKINGS_READ: 'bookings.read',
  BOOKINGS_UPDATE: 'bookings.update',
  COMMERCE_READ: 'commerce.read',
  INVOICES_READ: 'invoices.read',
  ANALYTICS_READ: 'analytics.read',
  STAFF_MANAGE: 'staff.manage',
};

export const ALL_API_PERMISSIONS = Object.values(PERMISSION);

/** Legacy admin UI view ids → API permissions granted for that workspace area. */
export const VIEW_ID_TO_API_PERMISSIONS = {
  overview: [PERMISSION.REGISTRATIONS_READ],
  retreats: [PERMISSION.REGISTRATIONS_READ, PERMISSION.REGISTRATIONS_UPDATE],
  events: [PERMISSION.REGISTRATIONS_READ, PERMISSION.REGISTRATIONS_UPDATE],
  'private-sessions': [PERMISSION.REGISTRATIONS_READ, PERMISSION.REGISTRATIONS_UPDATE],
  community: [PERMISSION.REGISTRATIONS_READ, PERMISSION.REGISTRATIONS_UPDATE],
  medical: [PERMISSION.REGISTRATIONS_READ, PERMISSION.REGISTRATIONS_UPDATE],
  feedback: [PERMISSION.REGISTRATIONS_READ, PERMISSION.REGISTRATIONS_UPDATE],
  analytics: [PERMISSION.ANALYTICS_READ],
  shop: [PERMISSION.REGISTRATIONS_READ, PERMISSION.COMMERCE_READ],
  orders: [PERMISSION.COMMERCE_READ, PERMISSION.BOOKINGS_READ, PERMISSION.BOOKINGS_UPDATE],
  invoices: [PERMISSION.INVOICES_READ],
  sales: [PERMISSION.INVOICES_READ, PERMISSION.COMMERCE_READ],
  content: [PERMISSION.REGISTRATIONS_READ],
};

const DEVELOPER_PERMISSIONS = ALL_API_PERMISSIONS.filter((p) => p !== PERMISSION.STAFF_MANAGE);

export function expandViewIdsToApiPermissions(viewIds) {
  const set = new Set();
  for (const id of viewIds || []) {
    const mapped = VIEW_ID_TO_API_PERMISSIONS[String(id)] || [];
    for (const perm of mapped) set.add(perm);
  }
  return [...set];
}

export function resolveApiPermissionsForAccount(account) {
  const role = String(account?.role || '').toLowerCase();
  if (role === 'owner') return [...ALL_API_PERMISSIONS];
  if (role === 'developer') return [...DEVELOPER_PERMISSIONS];
  const viewIds = Array.isArray(account?.permissions) ? account.permissions : [];
  return expandViewIdsToApiPermissions(viewIds);
}

export function sessionHasApiPermission(session, permission) {
  if (!session || !permission) return false;
  const grants = session.apiPermissions;
  if (!Array.isArray(grants) || !grants.length) return false;
  return grants.includes(permission);
}

/** UI view ids for workspace navigation (derived from API grants). */
export function apiPermissionsToViewIds(apiPermissions) {
  const grants = new Set(apiPermissions || []);
  const views = new Set();
  for (const [viewId, perms] of Object.entries(VIEW_ID_TO_API_PERMISSIONS)) {
    if (perms.some((p) => grants.has(p))) views.add(viewId);
  }
  if (grants.has(PERMISSION.STAFF_MANAGE)) views.add('staff');
  if (grants.has(PERMISSION.REGISTRATIONS_READ)) views.add('settings');
  return [...views];
}
