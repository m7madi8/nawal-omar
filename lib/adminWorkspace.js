export const ADMIN_STYLES = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap',
  '/admin/workspace.css',
];

export const ADMIN_SCRIPTS = [{ src: '/admin/workspace.js', attrs: '  ' }];

export const ADMIN_INLINE = `
    window.YOGA_DASHBOARD_CONFIG = {
      supabaseUrl: "https://xzxyskufrqansbhsbdkt.supabase.co",
      supabaseAnonKey: "sb_publishable_V9_4QWGDFv6Vm-4DQifYGA_1xdoKkph",
      supabaseTable: "retreat_requests"
    };
  `;

export const ADMIN_VIEWS = [
  { id: 'overview', path: '/admin/overview', label: 'Overview', group: null },
  { id: 'retreats', path: '/admin/retreats', label: 'Retreats', group: 'Bookings' },
  { id: 'events', path: '/admin/events', label: 'Events', group: 'Bookings' },
  {
    id: 'private-sessions',
    path: '/admin/private-sessions',
    label: 'Private Sessions',
    group: 'Bookings',
  },
  { id: 'community', path: '/admin/community', label: 'Community', group: 'People' },
  { id: 'medical', path: '/admin/medical', label: 'Medical forms', group: 'Intake' },
  { id: 'feedback', path: '/admin/feedback', label: 'Feedback', group: 'Intake' },
  { id: 'shop', path: '/admin/shop', label: 'Shop', group: 'Commerce' },
  { id: 'orders', path: '/admin/orders', label: 'Orders', group: 'Commerce' },
  { id: 'sales', path: '/admin/sales', label: 'Sales & profit', group: 'Commerce' },
  { id: 'staff', path: '/admin/staff', label: 'Team', group: 'Workspace' },
  { id: 'content', path: '/admin/content', label: 'Content', group: 'Workspace' },
  { id: 'settings', path: '/admin/settings', label: 'Settings', group: 'Workspace' },
];

export function renderAdminWorkspace(view = 'overview') {
  return `
  <div class="admin-app" data-view="${view}">
    <aside class="admin-sidebar" id="adminSidebar" aria-label="Admin navigation">
      <div class="admin-sidebar__brand">
        <div class="admin-sidebar__brand-main">
          <div class="admin-sidebar__mark" aria-hidden="true">
            <img src="/media/home/nawal_aom.jpg" alt="" width="38" height="38">
          </div>
          <div>
            <p class="admin-sidebar__name">Nawal Omar</p>
            <p class="admin-sidebar__role" id="adminSidebarRole">Operations</p>
          </div>
        </div>
        <button type="button" class="admin-sidebar__close" id="adminSidebarClose" aria-label="Close menu">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <nav class="admin-sidebar__nav" id="adminSidebarNav" aria-label="Sections"></nav>
      <div class="admin-sidebar__foot">
        <p class="admin-sidebar__session">
          <span class="admin-sidebar__avatar" aria-hidden="true">
            <img id="adminSessionAvatar" src="/media/home/nawal_aom.jpg" alt="" width="26" height="26">
          </span>
          <span id="adminSessionLabel">nawal</span>
        </p>
        <button type="button" class="admin-sidebar__logout" id="adminLogoutBtn">Sign out</button>
      </div>
    </aside>

    <div class="admin-overlay" id="adminOverlay" hidden></div>

    <div class="admin-main">
      <header class="admin-topbar" id="adminTopbar">
        <button type="button" class="admin-icon-btn" id="adminMenuToggle" aria-expanded="false" aria-controls="adminSidebar" aria-label="Open menu"></button>
        <p class="admin-topbar__section" id="adminTopbarSection">Overview</p>
        <div class="admin-topbar__actions">
          <button type="button" class="admin-icon-btn" id="adminRefreshBtn" aria-label="Refresh data"></button>
        </div>
      </header>

      <div class="admin-content" id="adminRoot"></div>
    </div>
  </div>

  <div id="adminModal" class="admin-modal" hidden>
    <div class="admin-modal__card" role="dialog" aria-modal="true" aria-labelledby="adminModalTitle">
      <div class="admin-modal__head">
        <h3 id="adminModalTitle">Registration details</h3>
        <button type="button" class="admin-modal__close" id="adminModalClose" aria-label="Close">&times;</button>
      </div>
      <div class="admin-modal__body" id="adminModalBody"></div>
    </div>
  </div>
`;
}
