/** Route → required API permission (for audits and tests). */
import { PERMISSION } from './permissions.js';

export const ADMIN_ROUTE_PERMISSIONS = [
  { method: 'POST', path: '/api/admin/login', permission: null, public: true },
  { method: 'POST', path: '/api/admin/logout', permission: null, public: true },
  { method: 'GET', path: '/api/admin/session', permission: null, authenticated: true },
  { method: 'GET', path: '/api/admin/registrations', permission: PERMISSION.REGISTRATIONS_READ },
  { method: 'PATCH', path: '/api/admin/registrations/:id', permission: PERMISSION.REGISTRATIONS_UPDATE },
  { method: 'DELETE', path: '/api/admin/registrations/:id', permission: PERMISSION.REGISTRATIONS_DELETE },
  { method: 'POST', path: '/api/admin/bookings', permission: PERMISSION.BOOKINGS_UPDATE },
  { method: 'GET', path: '/api/admin/commerce-orders', permission: PERMISSION.COMMERCE_READ },
  { method: 'GET', path: '/api/admin/invoices', permission: PERMISSION.INVOICES_READ },
  { method: 'GET', path: '/api/admin/invoices/:id', permission: PERMISSION.INVOICES_READ },
  { method: 'GET', path: '/api/admin/invoices/:id/pdf', permission: PERMISSION.INVOICES_READ },
  { method: 'GET', path: '/api/analytics', permission: PERMISSION.ANALYTICS_READ },
];
