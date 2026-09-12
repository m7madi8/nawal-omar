/* Nawal Yoga Admin Workspace */
(function () {
  var AUTH_KEY = 'yogaAdminSession';
  var SESSION_REVISION = 2;
  var STAFF_KEY = 'nawalAdminStaff';
  var COSTS_KEY = 'nawalShopCosts';
  var LEGACY_CLASS_KEY = 'yogaClassRequests';
  var CONFIG = window.YOGA_DASHBOARD_CONFIG || {};
  var SUPABASE_URL = String(CONFIG.supabaseUrl || '').trim().replace(/\/+$/, '');
  var SUPABASE_ANON_KEY = String(CONFIG.supabaseAnonKey || '').trim();
  var SUPABASE_TABLE = String(CONFIG.supabaseTable || 'retreat_requests').trim();
  var USERNAME = 'nawal';
  var PASSWORD = 'Areen12@n';
  var OWNER_NAME = 'Nawal Omar';
  var DEVELOPER_USERNAME = 'mohammad';
  var DEVELOPER_PASSWORD = 'mohammadd';
  var DEVELOPER_NAME = 'Mohammad';
  var OWNER_AVATAR = '/media/home/nawal_aom.jpg';
  var DEVELOPER_AVATAR = '/media/me.webp';
  var BUILTIN_STAFF = [
    {
      id: 'builtin-shatha',
      name: 'Shatha',
      username: 'shada',
      password: 'shadak12',
      permissions: ['medical'],
      viewOnly: true,
      locked: true,
    },
  ];

  /* Icon set — 18px line icons, inherit currentColor */
  var ICONS = {
    overview: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/></svg>',
    retreats: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19h18"/><path d="m6 19 5.2-11L14 14l1.6-2.6L21 19"/><path d="M9.5 19 12 14.5"/></svg>',
    events: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="16" rx="2.2"/><path d="M3.5 9.5h17"/><path d="M8 3v3M16 3v3"/><circle cx="8.2" cy="13.5" r="1"/><circle cx="12" cy="13.5" r="1"/><circle cx="15.8" cy="13.5" r="1"/></svg>',
    community: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8.5" r="3"/><path d="M2.8 19c.7-3 3-4.8 6.2-4.8s5.5 1.8 6.2 4.8"/><circle cx="17" cy="8" r="2.2"/><path d="M15.6 14.4c2.6.3 4.4 2 5 4.6"/></svg>',
    medical: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6a4.6 4.6 0 0 1 8.4-2.6 4.6 4.6 0 0 1 8.4 2.6 4.6 4.6 0 0 1-.2 1"/><path d="M6 11h2.2l1.3-2.4L11 13l1.1-2h2.4"/></svg>',
    content: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3.5h8l4 4v13a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"/><path d="M14 3.5V8h4.5"/><path d="M8.5 12.5h7M8.5 15.5h7M8.5 18h4"/></svg>',
    settings: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.6V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.6 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z"/></svg>',
    shop: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16l-1.2 11.2A2 2 0 0 1 16.8 21H7.2a2 2 0 0 1-2-1.8L4 8Z"/><path d="M8 8V6.5A4 4 0 0 1 12 2.5 4 4 0 0 1 16 6.5V8"/></svg>',
    orders: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h13l-1.4 9.2A2 2 0 0 1 16.6 18H8.5A2 2 0 0 1 6.5 16.3L5 4H3"/><circle cx="9" cy="20.5" r="1.3"/><circle cx="17" cy="20.5" r="1.3"/></svg>',
    sales: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16"/><path d="M6 16V10"/><path d="M12 16V6"/><path d="M18 16v-4"/><path d="M4 8.5c3-3 6 3 9 0s6 3 9 0"/></svg>',
    staff: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="8.5" cy="8" r="2.6"/><path d="M3.4 18.4c.6-2.8 2.8-4.4 5.1-4.4s4.5 1.6 5.1 4.4"/><circle cx="16.6" cy="8.4" r="2.1"/><path d="M15.4 14.3c2.3.3 3.9 1.8 4.5 4.1"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.2-5.5"/><path d="M20 4v5h-5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    empty: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5Z"/><path d="M4 8.5 12 13l8-4.5M12 13v7"/></svg>',
  };

  var VIEWS = [
    { id: 'overview', path: '/admin/overview', label: 'Overview', group: null },
    { id: 'retreats', path: '/admin/retreats', label: 'Retreats', group: 'Bookings' },
    { id: 'events', path: '/admin/events', label: 'Events', group: 'Bookings' },
    { id: 'community', path: '/admin/community', label: 'Community', group: 'People' },
    { id: 'medical', path: '/admin/medical', label: 'Medical forms', group: 'Intake' },
    { id: 'shop', path: '/admin/shop', label: 'Shop', group: 'Commerce' },
    { id: 'orders', path: '/admin/orders', label: 'Orders', group: 'Commerce' },
    { id: 'sales', path: '/admin/sales', label: 'Sales & profit', group: 'Commerce' },
    { id: 'staff', path: '/admin/staff', label: 'Team', group: 'Workspace' },
    { id: 'content', path: '/admin/content', label: 'Content', group: 'Workspace' },
    { id: 'settings', path: '/admin/settings', label: 'Settings', group: 'Workspace' },
  ];

  var OWNER_ONLY_VIEWS = ['staff', 'settings'];
  var STAFF_PERMISSIONS = [
    { id: 'overview', label: 'Overview', hint: 'Dashboard snapshot' },
    { id: 'retreats', label: 'Retreats', hint: 'Retreat reservations' },
    { id: 'events', label: 'Events', hint: 'Events and classes' },
    { id: 'community', label: 'Community', hint: 'Returning guests' },
    { id: 'medical', label: 'Medical forms', hint: 'Health intake' },
    { id: 'shop', label: 'Shop', hint: 'Catalog and products' },
    { id: 'orders', label: 'Orders', hint: 'Fulfill shop orders' },
    { id: 'sales', label: 'Sales & profit', hint: 'Revenue and profit' },
    { id: 'content', label: 'Content', hint: 'Feedback and pages' },
  ];

  var SOURCE_LABELS = {
    'mountain-voice-registration': "Nawal's Care",
    'ice-bath-health': 'Ice Bath Health Form',
    'ice-bath-registration': 'Ice Bath Day Retreat',
    'wadi-rum-registration': 'Initial Registration | Wadi Rum Desert Retreat',
    'zanzibar-retreat-reserve': 'Zanzibar Retreat',
    'dahab-retreat-reserve': 'Dahab Retreat',
    'yoga-class-registration': 'Haifa Yoga',
    'yoga-class-request': 'Haifa Yoga',
    'sound-healing-registration': 'Sound Healing',
    'nature-chocolate-registration': 'Nature & Chocolate',
    'feedback-dahab': 'Feedback · Dahab',
    'feedback-wadi-rum': 'Feedback · Wadi Rum',
    'feedback-zanzibar': 'Feedback · Zanzibar',
    'feedback-sound-healing': 'Feedback · Sound Healing',
    'feedback-nature-chocolate': 'Feedback · Nature & Chocolate',
    'feedback-ice': 'Feedback · Ice Bath',
    'shop-order': 'Shop order',
  };

  var PLACE_BY_SOURCE = {
    'wadi-rum-registration': 'wadi-rum',
    'zanzibar-retreat-reserve': 'zanzibar',
    'dahab-retreat-reserve': 'dahab',
    'mountain-voice-registration': 'mountain-voice',
    'ice-bath-registration': 'ice-bath',
    'ice-bath-health': 'ice-bath',
    'yoga-class-registration': 'haifa-yoga',
    'yoga-class-request': 'haifa-yoga',
    'sound-healing-registration': 'sound-healing',
    'nature-chocolate-registration': 'nature-chocolate',
    'shop-order': 'shop',
  };

  var PLACE_CATALOG = {
    'wadi-rum': { id: 'wadi-rum', name: 'Initial Registration | Wadi Rum Desert Retreat', image: '/media/wadi-rum/cover.jpg' },
    'zanzibar': { id: 'zanzibar', name: 'Zanzibar Retreat', image: '/media/zanzibar/NUR-Beach-Hotel---Jambiani.jpg' },
    'dahab': { id: 'dahab', name: 'Dahab Retreat', image: '/media/dahab/cover.jpeg' },
    'mountain-voice': { id: 'mountain-voice', name: "Nawal's Care", image: '/media/nawal.png', imagePosition: '50% 8%' },
    'ice-bath': { id: 'ice-bath', name: 'Ice Bath Day Retreat', image: '/media/events/ice-bath/hero.jpg' },
    'sound-healing': { id: 'sound-healing', name: 'Sound Healing', image: '/media/events/sound-healing-01.jpg' },
    'nature-chocolate': { id: 'nature-chocolate', name: 'Nature & Chocolate', image: '/media/events/nature-chocolate-hero.jpg' },
    'haifa-yoga': { id: 'haifa-yoga', name: 'Haifa Yoga', image: '/media/haifa/hero.jpg' },
    'shop': { id: 'shop', name: 'Nawal Shop', image: '/media/products/nawal-prod.png' },
  };

  var RETREAT_CATALOG = [
    {
      id: 'wadi-rum',
      name: 'Initial Registration | Wadi Rum Desert Retreat',
      source: 'wadi-rum-registration',
      image: '/media/wadi-rum/cover.jpg',
      dates: '22–26 Oct 2027',
      location: 'Jordan',
      startDate: '2027-10-22',
      endDate: '2027-10-26',
    },
    {
      id: 'zanzibar',
      name: 'Zanzibar Retreat',
      source: 'zanzibar-retreat-reserve',
      image: '/media/zanzibar/NUR-Beach-Hotel---Jambiani.jpg',
      dates: 'Ended',
      location: 'Zanzibar',
      startDate: '2026-07-07',
      endDate: '2026-07-14',
      schedule: 'past',
    },
    {
      id: 'dahab',
      name: 'Dahab Retreat',
      source: 'dahab-retreat-reserve',
      image: '/media/dahab/cover.jpeg',
      dates: '19–23 Aug 2026',
      location: 'Egypt',
      startDate: '2026-08-19',
      endDate: '2026-08-23',
      schedule: 'open',
    },
  ];

  var EVENT_CATALOG = [
    {
      id: 'ice-bath',
      name: 'Day Retreat | Ice Bath',
      source: 'ice-bath-registration',
      image: '/media/events/ice-bath/hero.jpg',
      dates: '29 Aug 2026',
      location: 'Hofit',
      startDate: '2026-08-29',
      endDate: '2026-08-29',
    },
    {
      id: 'sound-healing',
      name: 'Sound Healing',
      source: 'sound-healing-registration',
      image: '/media/events/sound-healing-01.jpg',
      dates: '4 Sep 2026',
      location: 'Haifa, Atlit',
      startDate: '2026-09-04',
      endDate: '2026-09-04',
    },
    {
      id: 'nature-chocolate',
      name: 'Nature & Chocolate',
      source: 'nature-chocolate-registration',
      image: '/media/events/nature-chocolate-hero.jpg',
      dates: 'Completed',
      location: 'Al-Bqeia',
      startDate: '2025-05-10',
      endDate: '2025-05-10',
    },
    {
      id: 'haifa-yoga',
      name: 'Haifa Yoga Classes',
      source: 'yoga-class-registration',
      sources: ['yoga-class-request'],
      image: '/media/haifa/hero.jpg',
      dates: 'Weekly classes',
      location: 'Haifa',
      schedule: 'ongoing',
    },
  ];

  var MEDICAL_SOURCES = ['mountain-voice-registration', 'ice-bath-health', 'wadi-rum-registration'];
  var MEDICAL_CATALOG = [
    {
      id: 'mountain-voice',
      name: "Nawal's Care",
      source: 'mountain-voice-registration',
      image: '/media/nawal.png',
      imagePosition: '50% 8%',
      dates: 'General health declaration',
      location: 'Nawal Yoga',
      schedule: 'ongoing',
    },
    {
      id: 'ice-bath-health',
      name: 'Ice Bath Health Form',
      source: 'ice-bath-health',
      image: '/media/events/ice-bath/health-form.jpg',
      dates: 'Required before the day retreat',
      location: 'Hofit',
      schedule: 'ongoing',
    },
    {
      id: 'wadi-rum-health',
      name: 'Wadi Rum · Health & Registration',
      source: 'wadi-rum-registration',
      image: '/media/wadi-rum/cover.jpg',
      dates: '22–26 Oct 2027 · health & intake',
      location: 'Wadi Rum, Jordan',
      schedule: 'open',
    },
  ];
  var RETREAT_SOURCES = ['wadi-rum-registration', 'zanzibar-retreat-reserve', 'dahab-retreat-reserve'];
  var EVENT_SOURCES = [
    'ice-bath-registration',
    'sound-healing-registration',
    'nature-chocolate-registration',
    'yoga-class-registration',
    'yoga-class-request',
  ];
  var FEEDBACK_SOURCES = [
    'feedback-dahab',
    'feedback-wadi-rum',
    'feedback-zanzibar',
    'feedback-sound-healing',
    'feedback-nature-chocolate',
    'feedback-ice',
  ];
  var BOOKING_SOURCES = RETREAT_SOURCES.concat(EVENT_SOURCES).concat(MEDICAL_SOURCES).filter(function (source, index, list) {
    return list.indexOf(source) === index;
  });
  var CLASS_SOURCES = ['yoga-class-registration', 'yoga-class-request'];
  var SHOP_SOURCES = ['shop-order'];
  var OVERVIEW_SOURCES = BOOKING_SOURCES.concat(FEEDBACK_SOURCES).concat(SHOP_SOURCES);
  var SHOP_CATALOG = [
    {
      id: 'mat',
      name: 'Yoga Mat',
      source: 'shop-order',
      image: '/media/products/pink-matt.png',
      dates: 'From $128',
      location: 'Cork & rubber',
      schedule: 'open',
    },
    {
      id: 'block',
      name: 'Yoga Block',
      source: 'shop-order',
      image: '/media/products/black-blocks.png',
      dates: 'From $48',
      location: 'Solid cork',
      schedule: 'open',
    },
  ];
  var PAYMENT_LABELS = {
    whatsapp: 'WhatsApp',
    cash: 'Cash on delivery',
    stripe: 'Visa · Mastercard',
    paypal: 'PayPal',
  };

  var cache = { rows: null, loading: null };

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function initials(name) {
    var clean = String(name || '').trim();
    if (!clean || clean === '-') return '—';
    var parts = clean.split(/\s+/).filter(Boolean);
    var first = parts[0] ? parts[0].charAt(0) : '';
    var second = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + second).toUpperCase() || '—';
  }

  function getSession() {
    try {
      var raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
      var session = raw ? JSON.parse(raw) : null;
      if (!session || !session.isLoggedIn) return null;
      if (Number(session.authRevision) !== SESSION_REVISION) {
        clearSession();
        return null;
      }
      return session;
    } catch (_) {
      return null;
    }
  }

  function setSession(payload, remember) {
    var data = JSON.stringify(Object.assign({}, payload, {
      authRevision: SESSION_REVISION,
      savedAt: Date.now(),
      remember: remember !== false,
    }));
    clearSession();
    if (remember !== false) localStorage.setItem(AUTH_KEY, data);
    else sessionStorage.setItem(AUTH_KEY, data);
  }

  function clearSession() {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  }

  function normalizeSession(session) {
    if (!session || !session.isLoggedIn) return null;
    var username = String(session.username || '').trim();
    if (!username) return null;
    if (session.role === 'owner' || username.toLowerCase() === USERNAME) {
      return {
        isLoggedIn: true,
        username: USERNAME,
        name: OWNER_NAME,
        role: 'owner',
        permissions: STAFF_PERMISSIONS.map(function (item) { return item.id; }).concat(OWNER_ONLY_VIEWS),
      };
    }
    if (session.role === 'developer' || username.toLowerCase() === DEVELOPER_USERNAME) {
      return {
        isLoggedIn: true,
        username: DEVELOPER_USERNAME,
        name: DEVELOPER_NAME,
        role: 'developer',
        locked: true,
        permissions: STAFF_PERMISSIONS.map(function (item) { return item.id; }).concat(OWNER_ONLY_VIEWS),
      };
    }
    var builtin = findBuiltinStaff(username, session.staffId);
    if (builtin) {
      return {
        isLoggedIn: true,
        username: builtin.username,
        name: builtin.name,
        role: 'staff',
        staffId: builtin.id,
        locked: true,
        viewOnly: !!builtin.viewOnly,
        permissions: Array.isArray(builtin.permissions) ? builtin.permissions.slice() : [],
      };
    }
    return {
      isLoggedIn: true,
      username: username,
      name: session.name || username,
      role: 'staff',
      staffId: session.staffId || '',
      viewOnly: !!session.viewOnly,
      permissions: Array.isArray(session.permissions) ? session.permissions.slice() : [],
    };
  }

  function findBuiltinStaff(username, staffId) {
    var needle = String(username || '').trim().toLowerCase();
    return BUILTIN_STAFF.find(function (item) {
      return (staffId && item.id === staffId) || String(item.username || '').toLowerCase() === needle;
    }) || null;
  }

  function currentSession() {
    var session = normalizeSession(getSession());
    if (!session || session.role !== 'staff') return session;
    var builtin = findBuiltinStaff(session.username, session.staffId);
    if (builtin) {
      session.username = builtin.username;
      session.name = builtin.name;
      session.staffId = builtin.id;
      session.locked = true;
      session.viewOnly = !!builtin.viewOnly;
      session.permissions = Array.isArray(builtin.permissions) ? builtin.permissions.slice() : [];
      return session;
    }
    var member = loadStaff().find(function (item) {
      return (session.staffId && item.id === session.staffId) ||
        String(item.username || '').toLowerCase() === String(session.username || '').toLowerCase();
    });
    if (!member) {
      clearSession();
      return null;
    }
    session.username = member.username;
    session.name = member.name;
    session.staffId = member.id;
    session.viewOnly = !!member.viewOnly;
    session.permissions = Array.isArray(member.permissions) ? member.permissions.slice() : [];
    return session;
  }

  function isOwner(session) {
    session = session || currentSession();
    return !!(session && (session.role === 'owner' || session.role === 'developer'));
  }

  function isViewOnly(session) {
    session = session || currentSession();
    return !!(session && session.viewOnly);
  }

  function isReservedUsername(username) {
    var value = String(username || '').trim().toLowerCase();
    if (value === USERNAME || value === DEVELOPER_USERNAME) return true;
    return !!findBuiltinStaff(value);
  }

  function hasPermission(viewId, session) {
    session = session || currentSession();
    if (!session) return false;
    if (isOwner(session)) return true;
    if (OWNER_ONLY_VIEWS.indexOf(viewId) !== -1) return false;
    return (session.permissions || []).indexOf(viewId) !== -1;
  }

  function allowedViews(session) {
    return VIEWS.filter(function (view) { return hasPermission(view.id, session); });
  }

  function firstAllowedPath(session) {
    var views = allowedViews(session);
    return views.length ? views[0].path : '/admin';
  }

  function applySessionChrome(session) {
    session = session || currentSession();
    var label = document.getElementById('adminSessionLabel');
    var role = document.getElementById('adminSidebarRole');
    var avatar = document.getElementById('adminSessionAvatar');
    var isDeveloper = !!(session && session.role === 'developer');
    if (label) label.textContent = session ? (session.username || USERNAME) : USERNAME;
    if (role) {
      role.textContent = isDeveloper
        ? 'Web developer'
        : session && session.role === 'staff'
          ? (session.viewOnly ? 'View only' : 'Team member')
          : 'Owner';
    }
    if (avatar) {
      avatar.src = isDeveloper ? DEVELOPER_AVATAR : OWNER_AVATAR;
      avatar.style.objectPosition = isDeveloper ? '50% 28%' : '50% 18%';
    }
  }

  function loadStaff() {
    try {
      var list = JSON.parse(localStorage.getItem(STAFF_KEY) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function saveStaff(list) {
    localStorage.setItem(STAFF_KEY, JSON.stringify(list));
  }

  function findStaffAccount(username, password) {
    var needle = String(username || '').trim().toLowerCase();
    var pass = String(password || '');
    var builtin = findBuiltinStaff(needle);
    if (builtin && String(builtin.password || '') === pass) return builtin;
    return loadStaff().find(function (item) {
      return String(item.username || '').trim().toLowerCase() === needle && String(item.password || '') === pass;
    }) || null;
  }

  function loadCosts() {
    var defaults = { mat: 0, block: 0 };
    try {
      var stored = JSON.parse(localStorage.getItem(COSTS_KEY) || '{}');
      if (!stored || typeof stored !== 'object') return defaults;
      return {
        mat: Number(stored.mat) || 0,
        block: Number(stored.block) || 0,
      };
    } catch (_) {
      return defaults;
    }
  }

  function saveCosts(costs) {
    localStorage.setItem(COSTS_KEY, JSON.stringify({
      mat: Math.max(0, Number(costs.mat) || 0),
      block: Math.max(0, Number(costs.block) || 0),
    }));
  }

  function getPath() {
    return window.location.pathname.replace(/\/+$/, '') || '/';
  }

  function getView() {
    var path = getPath();
    var match = VIEWS.find(function (view) {
      return path === view.path;
    });
    return match ? match.id : 'overview';
  }

  function isLoginPage() {
    return getPath() === '/admin';
  }

  function isWorkspacePage() {
    return getPath().indexOf('/admin/') === 0 && !isLoginPage();
  }

  function readLegacyRequests() {
    try {
      return JSON.parse(localStorage.getItem(LEGACY_CLASS_KEY) || '[]');
    } catch (_) {
      return [];
    }
  }

  function normalizeArray(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value.split(',').map(function (item) { return item.trim(); }).filter(Boolean);
    }
    return [];
  }

  function normalizeRequest(item) {
    return {
      id: item.id || item['id'] || 'local-' + Math.random().toString(36).slice(2),
      source: String(item.source || item['source'] || ''),
      fullName: item.fullName || item['fullName'] || item['الاسم الكامل'] || '-',
      phone: item.phone || item['phone'] || item['رقم الهاتف'] || '-',
      age: item.age || item['العمر'] || '-',
      city: item.city || item['مكان السكن'] || '-',
      reason: item.reason || item['دافع الاهتمام بالريتريت'] || '-',
      expectation: item.expectation || item['التوقع من التجربة'] || '-',
      yogaExperience: item.yogaExperience || item['خبرة يوغا/تأمل'] || '-',
      healthStatus: item.healthStatus || item['حالة صحية حالية'] || '-',
      healthDetails: item.healthDetails || item['تفاصيل صحية'] || '-',
      activities: normalizeArray(item.activities || item['اهتمامات الأنشطة']),
      freeNote: item.freeNote || item['ملاحظات إضافية'] || '-',
      date: item.submittedAt || item.date || item['submittedAt'] || item['date'] || '-',
      status: item.status || item['status'] || 'pending',
      retreatType: item.retreatType || item['retreatType'] || '-',
      raw: item,
    };
  }

  function parseSubmittedAt(value) {
    if (!value || value === '-') return null;
    var d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  function formatDisplayDate(value) {
    var d = parseSubmittedAt(value);
    if (!d) return '-';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function relativeTime(value) {
    var d = parseSubmittedAt(value);
    if (!d) return '-';
    var diff = Date.now() - d.getTime();
    var mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + 'm ago';
    var hours = Math.floor(mins / 60);
    if (hours < 48) return hours + 'h ago';
    var days = Math.floor(hours / 24);
    if (days < 14) return days + 'd ago';
    return formatDisplayDate(value);
  }

  function sourceLabel(source) {
    return SOURCE_LABELS[source] || source || 'Request';
  }

  function parseShopOrder(row) {
    var note = row && row.freeNote;
    if (note && note !== '-') {
      try {
        var parsed = JSON.parse(note);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (err) {
        /* ignore */
      }
    }
    return {
      productId: '',
      productName: (row && row.retreatType) || 'Shop order',
      color: '',
      qty: 1,
      priceUsd: 0,
      amountUsd: 0,
      payment: (row && row.healthStatus) || '',
      paid: !!(row && row.yogaExperience === 'paid'),
    };
  }

  function shopPayment(row) {
    return parseShopOrder(row).payment || row.healthStatus || '';
  }

  function shopMatchesProduct(row, item) {
    if (row.source !== 'shop-order') return false;
    var order = parseShopOrder(row);
    return !item || !item.id || order.productId === item.id;
  }

  function shopAmount(row) {
    var order = parseShopOrder(row);
    var qty = Number(order.qty) || 1;
    return Number(order.amountUsd) || (Number(order.priceUsd) * qty) || 0;
  }

  function shopQty(row) {
    return Number(parseShopOrder(row).qty) || 1;
  }

  function shopIsPaid(row) {
    var order = parseShopOrder(row);
    return !!(order.paid || (row && row.yogaExperience === 'paid'));
  }

  function shopCost(row, costs) {
    var order = parseShopOrder(row);
    var unit = Number(costs[order.productId]) || 0;
    return unit * shopQty(row);
  }

  function money(value) {
    var amount = Number(value) || 0;
    return '$' + amount.toLocaleString(undefined, {
      minimumFractionDigits: amount % 1 ? 2 : 0,
      maximumFractionDigits: 2,
    });
  }

  function computeShopFinance(rows, costs) {
    costs = costs || loadCosts();
    var shopRows = rows.filter(function (row) { return SHOP_SOURCES.indexOf(row.source) !== -1; });
    var finance = {
      orders: shopRows.length,
      units: 0,
      revenue: 0,
      paidRevenue: 0,
      outstanding: 0,
      cost: 0,
      profit: 0,
      paidOrders: 0,
      byProduct: {},
      byPayment: {},
    };

    SHOP_CATALOG.forEach(function (item) {
      finance.byProduct[item.id] = {
        id: item.id,
        name: item.name,
        orders: 0,
        units: 0,
        revenue: 0,
        paid: 0,
        cost: 0,
        profit: 0,
      };
    });

    Object.keys(PAYMENT_LABELS).forEach(function (key) {
      finance.byPayment[key] = { id: key, label: PAYMENT_LABELS[key], orders: 0, revenue: 0, paid: 0 };
    });

    shopRows.forEach(function (row) {
      var order = parseShopOrder(row);
      var amount = shopAmount(row);
      var qty = shopQty(row);
      var paid = shopIsPaid(row);
      var cost = shopCost(row, costs);
      var productId = order.productId || 'other';
      var payment = order.payment || 'whatsapp';

      finance.units += qty;
      finance.revenue += amount;
      if (paid) {
        finance.paidOrders += 1;
        finance.paidRevenue += amount;
        finance.cost += cost;
      } else {
        finance.outstanding += amount;
      }

      if (!finance.byProduct[productId]) {
        finance.byProduct[productId] = {
          id: productId,
          name: order.productName || 'Other',
          orders: 0,
          units: 0,
          revenue: 0,
          paid: 0,
          cost: 0,
          profit: 0,
        };
      }
      finance.byProduct[productId].orders += 1;
      finance.byProduct[productId].units += qty;
      finance.byProduct[productId].revenue += amount;
      if (paid) {
        finance.byProduct[productId].paid += amount;
        finance.byProduct[productId].cost += cost;
      }

      if (!finance.byPayment[payment]) {
        finance.byPayment[payment] = { id: payment, label: PAYMENT_LABELS[payment] || payment, orders: 0, revenue: 0, paid: 0 };
      }
      finance.byPayment[payment].orders += 1;
      finance.byPayment[payment].revenue += amount;
      if (paid) finance.byPayment[payment].paid += amount;
    });

    finance.profit = finance.paidRevenue - finance.cost;
    Object.keys(finance.byProduct).forEach(function (id) {
      finance.byProduct[id].profit = finance.byProduct[id].paid - finance.byProduct[id].cost;
    });
    return finance;
  }

  function catalogSources(item) {
    return [item.source].concat(item.sources || []);
  }

  function matchesCatalog(row, item) {
    return catalogSources(item).indexOf(row.source) !== -1;
  }

  function placeIdForSource(source) {
    return PLACE_BY_SOURCE[source] || null;
  }

  function placeMeta(placeId) {
    return PLACE_CATALOG[placeId] || { id: placeId, name: placeId, image: '/media/home/hero.jpg' };
  }

  function normalizePhone(phone) {
    var digits = String(phone || '').replace(/\D/g, '');
    if (!digits || digits.length < 8) return '';
    if (digits.length > 9) digits = digits.slice(-9);
    return digits;
  }

  function personKey(row) {
    var phone = normalizePhone(row.phone);
    if (phone) return 'p:' + phone;
    var name = String(row.fullName || '').trim().toLowerCase();
    if (name && name !== '-') return 'n:' + name;
    return 'id:' + String(row.id);
  }

  function buildReturningPeople(rows) {
    var groups = {};
    rows.forEach(function (row) {
      var key = personKey(row);
      if (!groups[key]) {
        groups[key] = { key: key, rows: [], places: {} };
      }
      groups[key].rows.push(row);
      var place = placeIdForSource(row.source);
      if (place) groups[key].places[place] = true;
    });

    return Object.keys(groups).map(function (key) {
      var group = groups[key];
      var sorted = group.rows.slice().sort(function (a, b) {
        var da = parseSubmittedAt(a.date);
        var db = parseSubmittedAt(b.date);
        return (db ? db.getTime() : 0) - (da ? da.getTime() : 0);
      });
      var latest = sorted[0] || {};
      var placeIds = Object.keys(group.places);
      return {
        key: key,
        fullName: latest.fullName || '-',
        phone: latest.phone || '-',
        city: latest.city || '-',
        date: latest.date,
        placeIds: placeIds,
        rows: sorted,
        pending: sorted.filter(function (row) { return row.status !== 'completed'; }).length,
      };
    }).filter(function (person) {
      return person.placeIds.length >= 2;
    }).sort(function (a, b) {
      return b.placeIds.length - a.placeIds.length || b.rows.length - a.rows.length;
    });
  }

  function getFilters() {
    var params = new URLSearchParams(window.location.search);
    return {
      status: params.get('status') || 'all',
      source: params.get('source') || 'all',
      range: params.get('range') || 'all',
      tab: params.get('tab') || 'all',
      q: params.get('q') || '',
      sort: params.get('sort') || 'newest',
    };
  }

  function setFilters(next) {
    var current = getFilters();
    var merged = Object.assign({}, current, next);
    var params = new URLSearchParams();
    Object.keys(merged).forEach(function (key) {
      var val = merged[key];
      if (!val || val === 'all' || val === 'newest') return;
      params.set(key, val);
    });
    var query = params.toString();
    var url = window.location.pathname + (query ? '?' + query : '');
    window.history.replaceState({}, '', url);
  }

  function startOfDay(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  var EXPERIENCE_STATUS_LABELS = {
    upcoming: 'Upcoming',
    active: 'Active',
    past: 'Past',
    'coming-soon': 'Coming soon',
    ongoing: 'Ongoing',
    open: 'Open',
  };

  function parseCatalogDate(value) {
    if (!value) return null;
    var parts = String(value).trim().split('-');
    if (parts.length !== 3) return null;
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10) - 1;
    var d = parseInt(parts[2], 10);
    if (!y || m < 0 || m > 11 || d < 1 || d > 31) return null;
    return startOfDay(new Date(y, m, d));
  }

  function getExperienceStatus(item, now) {
    now = startOfDay(now || new Date());

    if (item.schedule === 'coming-soon') {
      return { key: 'coming-soon', label: EXPERIENCE_STATUS_LABELS['coming-soon'] };
    }

    if (item.schedule === 'past') {
      return { key: 'past', label: EXPERIENCE_STATUS_LABELS.past };
    }

    if (item.schedule === 'ongoing') {
      return { key: 'ongoing', label: EXPERIENCE_STATUS_LABELS.ongoing };
    }

    var start = parseCatalogDate(item.startDate);
    var end = parseCatalogDate(item.endDate || item.startDate);

    if (item.schedule === 'open') {
      if (end && now > end) return { key: 'past', label: EXPERIENCE_STATUS_LABELS.past };
      if (start && now < start) return { key: 'upcoming', label: EXPERIENCE_STATUS_LABELS.upcoming };
      return { key: 'open', label: EXPERIENCE_STATUS_LABELS.open };
    }

    if (!start && !end) {
      var manual = String(item.status || 'draft');
      return { key: manual, label: EXPERIENCE_STATUS_LABELS[manual] || manual };
    }

    if (!start) start = end;
    if (!end) end = start;

    if (now < start) return { key: 'upcoming', label: EXPERIENCE_STATUS_LABELS.upcoming };
    if (now > end) return { key: 'past', label: EXPERIENCE_STATUS_LABELS.past };
    return { key: 'active', label: EXPERIENCE_STATUS_LABELS.active };
  }

  function withExperienceStatus(item) {
    var status = getExperienceStatus(item);
    return Object.assign({}, item, {
      liveStatus: status.key,
      liveStatusLabel: status.label,
    });
  }

  function experienceStatusClass(key) {
    if (key === 'active' || key === 'open' || key === 'ongoing') return 'active';
    if (key === 'past') return 'past';
    if (key === 'upcoming') return 'upcoming';
    return 'draft';
  }

  function renderExperienceStatusPill(statusKey, label) {
    return '<span class="status-pill status-' + experienceStatusClass(statusKey) + '">' + escapeHtml(label) + '</span>';
  }

  function renderExperienceCardStatus(statusKey, label) {
    return '<span class="admin-retreat-card__status admin-retreat-card__status--' + escapeHtml(statusKey) + '">' + escapeHtml(label) + '</span>';
  }

  function catalogCardImage(item) {
    var attrs = ' src="' + item.image + '" alt="' + escapeHtml(item.name) + '"';
    if (item.imagePosition) attrs += ' style="object-position:' + item.imagePosition + ';"';
    if (item.imageClass) attrs += ' class="' + escapeHtml(item.imageClass) + '"';
    return '<img' + attrs + '>';
  }

  function renderCatalogCard(item, count, pending, countLabel) {
    countLabel = countLabel || 'bookings';
    var enriched = withExperienceStatus(item);
    return '<article class="admin-retreat-card' + (item.cardClass ? ' ' + escapeHtml(item.cardClass) : '') + '"><div class="admin-retreat-card__media">' + catalogCardImage(item) + renderExperienceCardStatus(enriched.liveStatus, enriched.liveStatusLabel) + '</div><div class="admin-retreat-card__body"><h3>' + escapeHtml(item.name) + '</h3><p>' + escapeHtml(item.dates) + ' · ' + escapeHtml(item.location) + '</p><div class="admin-retreat-card__stats"><span>' + count + ' ' + countLabel + '</span><span>' + pending + ' pending</span></div></div></article>';
  }

  function findCatalogItemBySource(source) {
    var catalogs = RETREAT_CATALOG.concat(EVENT_CATALOG).concat(MEDICAL_CATALOG);
    for (var i = 0; i < catalogs.length; i += 1) {
      var item = catalogs[i];
      if (item.source === source) return item;
      if (item.sources && item.sources.indexOf(source) !== -1) return item;
    }
    return null;
  }

  function getSourceExperienceStatus(source) {
    var item = findCatalogItemBySource(source);
    if (!item) return null;
    return getExperienceStatus(item);
  }

  function isLiveExperienceSource(source) {
    var status = getSourceExperienceStatus(source);
    if (!status) return true;
    return status.key === 'upcoming' || status.key === 'active' || status.key === 'open' || status.key === 'ongoing';
  }

  var EXPERIENCE_STATUS_ORDER = {
    upcoming: 0,
    active: 1,
    open: 2,
    ongoing: 3,
    'coming-soon': 4,
    past: 5,
    draft: 6,
  };

  function experienceSortWeight(item) {
    var status = getExperienceStatus(item);
    var rank = EXPERIENCE_STATUS_ORDER[status.key];
    if (rank === undefined) rank = 6;
    var start = parseCatalogDate(item.startDate);
    var end = parseCatalogDate(item.endDate || item.startDate);
    var dateSort;
    if (status.key === 'past' && end) {
      dateSort = -end.getTime();
    } else if (start) {
      dateSort = start.getTime();
    } else if (end) {
      dateSort = end.getTime();
    } else {
      dateSort = Number.MAX_SAFE_INTEGER;
    }
    return { rank: rank, dateSort: dateSort, name: String(item.name || '').toLowerCase() };
  }

  function sortExperienceCatalog(catalog) {
    return catalog.slice().sort(function (a, b) {
      var wa = experienceSortWeight(a);
      var wb = experienceSortWeight(b);
      if (wa.rank !== wb.rank) return wa.rank - wb.rank;
      if (wa.dateSort !== wb.dateSort) return wa.dateSort - wb.dateSort;
      return wa.name.localeCompare(wb.name);
    });
  }

  function sortedExperienceCatalog(catalog) {
    return sortExperienceCatalog(catalog).map(withExperienceStatus);
  }

  function compareRows(a, b, sortOrder) {
    var da = parseSubmittedAt(a.date);
    var db = parseSubmittedAt(b.date);
    var ta = da ? da.getTime() : 0;
    var tb = db ? db.getTime() : 0;
    if (ta !== tb) return sortOrder === 'oldest' ? ta - tb : tb - ta;
    var sa = sourceLabel(a.source).toLowerCase();
    var sb = sourceLabel(b.source).toLowerCase();
    if (sa !== sb) return sa.localeCompare(sb);
    return String(a.fullName || '').localeCompare(String(b.fullName || ''));
  }

  function dayKey(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }

  function inRange(dateValue, range) {
    if (range === 'all') return true;
    var d = parseSubmittedAt(dateValue);
    if (!d) return false;
    var now = startOfDay(new Date());
    var days = range === '7d' ? 7 : range === '30d' ? 30 : 0;
    if (!days) return true;
    var start = new Date(now);
    start.setDate(now.getDate() - (days - 1));
    return startOfDay(d) >= start;
  }

  function filterRows(rows, filters, view) {
    var q = String(filters.q || '').trim().toLowerCase();
    return rows.filter(function (row) {
      if (view === 'medical' && MEDICAL_SOURCES.indexOf(row.source) === -1) return false;
      if (view === 'retreats' && RETREAT_SOURCES.indexOf(row.source) === -1) return false;
      if (view === 'events' && EVENT_SOURCES.indexOf(row.source) === -1) return false;
      if ((view === 'shop' || view === 'orders' || view === 'sales') && SHOP_SOURCES.indexOf(row.source) === -1) return false;

      if (filters.status !== 'all' && row.status !== filters.status) return false;
      if (filters.source !== 'all' && row.source !== filters.source) return false;
      if (!inRange(row.date, filters.range)) return false;

      if (filters.tab === 'pending' && row.status !== 'pending') return false;
      if (filters.tab === 'completed' && row.status !== 'completed') return false;
      if ((filters.tab === 'whatsapp' || filters.tab === 'cash' || filters.tab === 'stripe' || filters.tab === 'paypal') && shopPayment(row) !== filters.tab) return false;
      if (filters.tab === 'upcoming' && !isLiveExperienceSource(row.source)) return false;
      if (filters.tab === 'archive' && row.status !== 'completed' && isLiveExperienceSource(row.source)) return false;

      if (q) {
        var hay = [row.fullName, row.phone, row.city, row.reason, row.freeNote, sourceLabel(row.source), row.retreatType]
          .join(' ')
          .toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    }).sort(function (a, b) {
      return compareRows(a, b, filters.sort);
    });
  }

  async function fetchAllRequestsFromSupabase() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_TABLE) return [];
    var url = SUPABASE_URL + '/rest/v1/' + encodeURIComponent(SUPABASE_TABLE) + '?select=*&order=submittedAt.desc.nullslast,createdAt.desc.nullslast';
    var res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      },
    });
    if (!res.ok) throw new Error('Failed loading Supabase data');
    var list = await res.json();
    return (Array.isArray(list) ? list : []).map(normalizeRequest);
  }

  async function getCachedRequests(forceRefresh) {
    if (!forceRefresh && cache.rows) return cache.rows;
    if (!forceRefresh && cache.loading) return cache.loading;

    cache.loading = fetchAllRequestsFromSupabase()
      .then(function (rows) {
        var yogaInSupabase = rows.filter(function (row) {
          return CLASS_SOURCES.indexOf(String(row.source || '')) !== -1;
        });
        if (!yogaInSupabase.length) {
          cache.rows = rows.concat(readLegacyRequests().map(normalizeRequest));
        } else {
          cache.rows = rows;
        }
        cache.loading = null;
        return cache.rows;
      })
      .catch(function (err) {
        cache.loading = null;
        throw err;
      });

    return cache.loading;
  }

  function invalidateCache() {
    cache.rows = null;
    cache.loading = null;
  }

  async function updateStatusInSupabase(item, nextStatus) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_TABLE) return false;
    var url = SUPABASE_URL + '/rest/v1/' + encodeURIComponent(SUPABASE_TABLE) + '?id=eq.' + encodeURIComponent(item.id);
    var res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ status: nextStatus }),
    });
    return res.ok;
  }

  async function deleteInSupabase(item) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_TABLE) return false;
    var url = SUPABASE_URL + '/rest/v1/' + encodeURIComponent(SUPABASE_TABLE) + '?id=eq.' + encodeURIComponent(item.id);
    var res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        Prefer: 'return=minimal',
      },
    });
    return res.ok;
  }

  function computeStats(rows) {
    var pending = rows.filter(function (r) { return r.status !== 'completed'; }).length;
    var completed = rows.filter(function (r) { return r.status === 'completed'; }).length;
    var weekRows = rows.filter(function (r) { return inRange(r.date, '7d'); });
    var medical = rows.filter(function (r) { return MEDICAL_SOURCES.indexOf(r.source) !== -1; });
    var retreats = rows.filter(function (r) { return RETREAT_SOURCES.indexOf(r.source) !== -1; });
    var events = rows.filter(function (r) { return EVENT_SOURCES.indexOf(r.source) !== -1; });
    var shop = rows.filter(function (r) { return SHOP_SOURCES.indexOf(r.source) !== -1; });
    var returning = buildReturningPeople(rows);

    var byType = {};
    rows.forEach(function (row) {
      var key = sourceLabel(row.source);
      byType[key] = (byType[key] || 0) + 1;
    });

    var activity = [];
    var today = startOfDay(new Date());
    for (var i = 6; i >= 0; i -= 1) {
      var day = new Date(today);
      day.setDate(today.getDate() - i);
      var count = rows.filter(function (row) {
        var d = parseSubmittedAt(row.date);
        return d && dayKey(startOfDay(d)) === dayKey(day);
      }).length;
      activity.push({
        label: day.toLocaleDateString(undefined, { weekday: 'short' }),
        count: count,
      });
    }

    return {
      total: rows.length,
      pending: pending,
      completed: completed,
      week: weekRows.length,
      medical: medical.length,
      medicalPending: medical.filter(function (r) { return r.status !== 'completed'; }).length,
      retreats: retreats.length,
      retreatsPending: retreats.filter(function (r) { return r.status !== 'completed'; }).length,
      events: events.length,
      eventsPending: events.filter(function (r) { return r.status !== 'completed'; }).length,
      shop: shop.length,
      shopPending: shop.filter(function (r) { return r.status !== 'completed'; }).length,
      shopPaid: shop.filter(function (r) { return parseShopOrder(r).paid || r.yogaExperience === 'paid'; }).length,
      community: returning.length,
      communityPending: returning.filter(function (p) { return p.pending > 0; }).length,
      byType: byType,
      activity: activity,
    };
  }

  function greeting() {
    var hour = new Date().getHours();
    var session = currentSession();
    var first = session && session.role !== 'owner' ? String(session.name || '').trim().split(/\s+/)[0] : '';
    var base = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return first ? base + ', ' + first : base;
  }

  function exportCsv(rows) {
    var isShop = rows.some(function (row) { return row.source === 'shop-order'; });
    var headers = isShop
      ? ['Date', 'Status', 'Product', 'Colour', 'Qty', 'Amount', 'Payment', 'Paid', 'Name', 'Phone', 'City']
      : ['Date', 'Status', 'Type', 'Name', 'Phone', 'City', 'Source'];
    var lines = [headers.join(',')];
    rows.forEach(function (row) {
      if (isShop) {
        var order = parseShopOrder(row);
        lines.push([
          formatDisplayDate(row.date),
          row.status,
          '"' + String(order.productName || row.retreatType || '').replace(/"/g, '""') + '"',
          order.color || '',
          order.qty || 1,
          order.amountUsd || order.priceUsd || '',
          PAYMENT_LABELS[order.payment] || order.payment || row.healthStatus,
          order.paid || row.yogaExperience === 'paid' ? 'yes' : 'no',
          '"' + String(row.fullName).replace(/"/g, '""') + '"',
          row.phone,
          row.city,
        ].join(','));
        return;
      }
      lines.push([
        formatDisplayDate(row.date),
        row.status,
        row.retreatType,
        '"' + String(row.fullName).replace(/"/g, '""') + '"',
        row.phone,
        row.city,
        sourceLabel(row.source),
      ].join(','));
    });
    var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'nawal-admin-export.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function modalField(label, value, wide) {
    return '<div class="admin-modal-item' + (wide ? ' is-wide' : '') + '"><strong>' + escapeHtml(label) + '</strong><span>' + escapeHtml(value || '-') + '</span></div>';
  }

  function openModal(item) {
    var modal = document.getElementById('adminModal');
    var body = document.getElementById('adminModalBody');
    var title = document.getElementById('adminModalTitle');
    if (!modal || !body) return;
    if (title) title.textContent = item.fullName !== '-' ? item.fullName : 'Registration details';

    var html = '';
    html += '<div class="admin-modal-section"><p class="admin-modal-section__title">Submission</p><div class="admin-modal-grid">';
    html += modalField('Type', item.retreatType && item.retreatType !== '-' ? item.retreatType : sourceLabel(item.source));
    html += modalField('Source', sourceLabel(item.source));
    html += modalField('Submitted', formatDisplayDate(item.date));
    html += modalField('Status', item.status);
    html += '</div></div>';

    if (item.source === 'shop-order') {
      var order = parseShopOrder(item);
      html += '<div class="admin-modal-section"><p class="admin-modal-section__title">Shop order</p><div class="admin-modal-grid">';
      html += modalField('Product', order.productName || item.retreatType);
      html += modalField('Colour', order.color);
      html += modalField('Quantity', order.qty || 1);
      html += modalField('Amount', order.amountUsd ? '$' + order.amountUsd : (order.priceUsd ? '$' + order.priceUsd : '-'));
      html += modalField('Payment', PAYMENT_LABELS[order.payment] || order.payment || item.healthStatus);
      html += modalField('Paid', order.paid || item.yogaExperience === 'paid' ? 'Yes' : 'No');
      html += '</div></div>';
    }

    html += '<div class="admin-modal-section"><p class="admin-modal-section__title">Contact</p><div class="admin-modal-grid">';
    html += modalField('Full name', item.fullName);
    html += modalField('Phone', item.phone);
    html += modalField('City', item.city);
    html += modalField('Age', item.age);
    html += '</div></div>';

    if ((item.reason && item.reason !== '-') || (item.freeNote && item.freeNote !== '-')) {
      html += '<div class="admin-modal-section"><p class="admin-modal-section__title">Notes</p><div class="admin-modal-grid">';
      html += modalField('Reason / notes', item.reason !== '-' ? item.reason : item.freeNote, true);
      html += '</div></div>';
    }

    if ((item.healthStatus && item.healthStatus !== '-') || (item.healthDetails && item.healthDetails !== '-') || (item.yogaExperience && item.yogaExperience !== '-')) {
      html += '<div class="admin-modal-section"><p class="admin-modal-section__title">Health &amp; experience</p><div class="admin-modal-grid">';
      html += modalField('Health status', item.healthStatus);
      html += modalField('Yoga experience', item.yogaExperience);
      html += modalField('Health details', item.healthDetails, true);
      html += '</div></div>';
    }

    if (item.activities && item.activities.length) {
      html += '<div class="admin-modal-section"><p class="admin-modal-section__title">Activities</p><div class="admin-modal-grid">';
      html += modalField('Interested in', item.activities.join(', '), true);
      html += '</div></div>';
    }

    body.innerHTML = html;
    modal.hidden = false;
  }

  function closeModal() {
    var modal = document.getElementById('adminModal');
    if (modal) modal.hidden = true;
  }

  function renderSidebar(stats) {
    var nav = document.getElementById('adminSidebarNav');
    if (!nav) return;
    var view = getView();

    var groups = [{ label: null, items: [] }];
    var groupIndex = { null: 0 };
    allowedViews().forEach(function (item) {
      var key = item.group || 'null';
      if (!(key in groupIndex)) {
        groupIndex[key] = groups.length;
        groups.push({ label: item.group, items: [] });
      }
      groups[groupIndex[key]].items.push(item);
    });

    nav.innerHTML = groups.filter(function (group) { return group.items.length; }).map(function (group) {
      var itemsHtml = group.items.map(function (item) {
        var badge = '';
        if (item.id === 'medical' && stats.medicalPending > 0) {
          badge = '<span class="admin-nav-badge">' + stats.medicalPending + '</span>';
        } else if (item.id === 'retreats' && stats.retreatsPending > 0) {
          badge = '<span class="admin-nav-badge">' + stats.retreatsPending + '</span>';
        } else if (item.id === 'events' && stats.eventsPending > 0) {
          badge = '<span class="admin-nav-badge">' + stats.eventsPending + '</span>';
        } else if (item.id === 'community' && stats.community > 0) {
          badge = '<span class="admin-nav-badge">' + stats.community + '</span>';
        } else if ((item.id === 'orders' || item.id === 'shop' || item.id === 'sales') && stats.shopPending > 0) {
          badge = '<span class="admin-nav-badge">' + stats.shopPending + '</span>';
        }
        return (
          '<a href="' + item.path + '" class="admin-nav-link' + (view === item.id ? ' is-active' : '') + '">' +
          '<span class="admin-nav-link__icon">' + (ICONS[item.id] || '') + '</span>' +
          '<span class="admin-nav-link__label">' + escapeHtml(item.label) + '</span>' + badge + '</a>'
        );
      }).join('');
      var labelHtml = group.label ? '<p class="admin-nav-group__label">' + escapeHtml(group.label) + '</p>' : '';
      return '<div class="admin-nav-group">' + labelHtml + '<div class="admin-nav-group__items">' + itemsHtml + '</div></div>';
    }).join('');
  }

  function renderFilterBar(filters, options) {
    var html = '<div class="admin-filters" data-admin-filters>';
    var statusOptions = options.status;
    if (statusOptions !== false && (!statusOptions || statusOptions.length > 1)) {
      html += '<div class="admin-filter-group">';
      (statusOptions || ['all', 'pending', 'completed']).forEach(function (value) {
        html += '<button type="button" class="admin-filter-chip' + (filters.status === value ? ' is-active' : '') + '" data-filter="status" data-value="' + value + '">' + value + '</button>';
      });
      html += '</div>';
    }
    if (options.tabs) {
      html += '<div class="admin-filter-group">';
      options.tabs.forEach(function (tab) {
        html += '<button type="button" class="admin-filter-chip' + (filters.tab === tab.value ? ' is-active' : '') + '" data-filter="tab" data-value="' + tab.value + '">' + tab.label + '</button>';
      });
      html += '</div>';
    }
    html += '<select class="admin-select" data-filter="range">';
    ['all', '7d', '30d'].forEach(function (value) {
      html += '<option value="' + value + '"' + (filters.range === value ? ' selected' : '') + '>' + (value === 'all' ? 'All time' : 'Last ' + value.replace('d', ' days')) + '</option>';
    });
    html += '</select>';
    if (options.sources) {
      html += '<select class="admin-select" data-filter="source"><option value="all">All types</option>';
      options.sources.forEach(function (source) {
        html += '<option value="' + source + '"' + (filters.source === source ? ' selected' : '') + '>' + escapeHtml(sourceLabel(source)) + '</option>';
      });
      html += '</select>';
    }
    html += '<select class="admin-select" data-filter="sort">';
    html += '<option value="newest"' + (filters.sort === 'newest' ? ' selected' : '') + '>Newest first</option>';
    html += '<option value="oldest"' + (filters.sort === 'oldest' ? ' selected' : '') + '>Oldest first</option>';
    html += '</select>';
    html += '<input class="admin-search" type="search" placeholder="Search name, phone, notes..." value="' + escapeHtml(filters.q) + '" data-filter="q">';
    if (!options.hideExport) {
      html += '<button type="button" class="admin-btn admin-btn--ghost" data-action="export">Export CSV</button>';
    }
    html += '</div>';
    return html;
  }

  function renderEmptyState(message) {
    return (
      '<div class="admin-empty">' +
      '<div class="admin-empty__icon">' + ICONS.empty + '</div>' +
      '<p class="admin-empty__title">Nothing here yet</p>' +
      '<p class="admin-empty__hint">' + escapeHtml(message || 'No records match these filters.') + '</p>' +
      '</div>'
    );
  }

  function renderTable(rows, emptyMessage) {
    if (!rows.length) {
      return renderEmptyState(emptyMessage);
    }
    var html = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>';
    html += '<th>When</th><th>Status</th><th>Type</th><th>Person</th><th></th></tr></thead><tbody>';
    rows.forEach(function (row) {
      html += '<tr data-id="' + escapeHtml(row.id) + '">';
      html += '<td><div class="admin-table__primary">' + escapeHtml(relativeTime(row.date)) + '</div><div class="admin-table__sub">' + escapeHtml(formatDisplayDate(row.date)) + '</div></td>';
      html += '<td><span class="status-pill ' + (row.status === 'completed' ? 'status-completed' : 'status-pending') + '">' + escapeHtml(row.status) + '</span></td>';
      html += '<td><div class="admin-table__type">';
      var placeId = placeIdForSource(row.source);
      if (placeId) {
        html += '<img class="admin-table__thumb" src="' + placeMeta(placeId).image + '" alt="">';
      }
      html += '<div><div class="admin-table__primary">' + escapeHtml(sourceLabel(row.source)) + '</div><div class="admin-table__sub">' + escapeHtml(row.retreatType || '-') + '</div></div></div></td>';
      html += '<td><div class="admin-table__person"><span class="admin-table__avatar">' + escapeHtml(initials(row.fullName)) + '</span><div><div class="admin-table__primary">' + escapeHtml(row.fullName) + '</div><div class="admin-table__sub">' + escapeHtml(row.phone) + '</div></div></div></td>';
      html += '<td><div class="admin-row-actions">';
      html += '<button type="button" class="admin-row-btn" data-action="view">View</button>';
      if (!isViewOnly()) {
        html += '<button type="button" class="admin-row-btn" data-action="toggle">' + (row.status === 'completed' ? 'Mark pending' : 'Complete') + '</button>';
        html += '<button type="button" class="admin-row-btn admin-row-btn--danger" data-action="delete">Delete</button>';
      }
      html += '</div></td></tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }

  function bindTableActions(root, allRows) {
    if (!root) return;
    var viewOnly = isViewOnly();
    root.querySelectorAll('tr[data-id]').forEach(function (tr) {
      var id = tr.getAttribute('data-id');
      var row = allRows.find(function (item) { return item.id === id; });
      if (!row) return;
      var viewBtn = tr.querySelector('[data-action="view"]');
      if (viewBtn) viewBtn.addEventListener('click', function () { openModal(row); });
      if (viewOnly) return;
      var toggleBtn = tr.querySelector('[data-action="toggle"]');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', async function () {
          var next = row.status === 'completed' ? 'pending' : 'completed';
          if (await updateStatusInSupabase(row, next)) {
            invalidateCache();
            renderWorkspace(true);
          }
        });
      }
      var deleteBtn = tr.querySelector('[data-action="delete"]');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', async function () {
          if (!window.confirm('Delete this request?')) return;
          if (await deleteInSupabase(row)) {
            invalidateCache();
            renderWorkspace(true);
          }
        });
      }
    });
  }

  function bindFilters(root, rows) {
    if (!root) return;
    var container = root.querySelector('[data-admin-filters]');
    if (!container) return;

    container.querySelectorAll('[data-filter]').forEach(function (el) {
      var key = el.getAttribute('data-filter');
      var eventName = el.tagName === 'INPUT' ? 'input' : 'change';
      if (el.classList.contains('admin-filter-chip')) {
        eventName = 'click';
      }
      el.addEventListener(eventName, function () {
        var value = el.classList.contains('admin-filter-chip') ? el.getAttribute('data-value') : el.value;
        var patch = {};
        patch[key] = value;
        setFilters(patch);
        renderWorkspace(false);
      });
    });

    var exportBtn = container.querySelector('[data-action="export"]');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        exportCsv(filterRows(rows, getFilters(), getView()));
      });
    }
  }

  function renderOverview(root, rows, stats, filters) {
    var filteredRecent = filterRows(rows, Object.assign({}, filters, { range: '30d' }), 'overview').slice(0, 12);
    var maxType = Math.max.apply(null, Object.values(stats.byType).concat([1]));
    var maxActivity = Math.max.apply(null, stats.activity.map(function (d) { return d.count; }).concat([1]));

    var html = '<div class="admin-page-head"><div><h1>' + greeting() + '</h1><p>Statistics and what needs your attention — across retreats, classes, the shop, and medical forms.</p></div></div>';

    html += '<div class="admin-stats">';
    [
      ['Total submissions', stats.total, 'Lifetime', ICONS.overview, ''],
      ['Reviewed', stats.completed, 'Marked complete', ICONS.medical, ''],
      ['Pending review', stats.pending, 'Needs action', ICONS.events, 'is-sand'],
      ['New this week', stats.week, 'Last 7 days', ICONS.community, ''],
    ].forEach(function (item) {
      html += '<article class="admin-stat"><div class="admin-stat__top"><p class="admin-stat__label">' + item[0] + '</p><span class="admin-stat__icon ' + item[4] + '">' + item[3] + '</span></div><strong class="admin-stat__value">' + item[1] + '</strong><p class="admin-stat__meta">' + item[2] + '</p></article>';
    });
    html += '</div><div class="admin-stats">';
    [
      ['Community', stats.community, 'Returning guests across places', ICONS.community, ''],
      ['Medical forms', stats.medical, 'Health questionnaires', ICONS.medical, 'is-rust'],
      ['Events & classes', stats.events, 'Events and Haifa yoga', ICONS.events, 'is-sand'],
      ['Retreats', stats.retreats, 'Retreat reservations', ICONS.retreats, ''],
    ].forEach(function (item) {
      html += '<article class="admin-stat"><div class="admin-stat__top"><p class="admin-stat__label">' + item[0] + '</p><span class="admin-stat__icon ' + item[4] + '">' + item[3] + '</span></div><strong class="admin-stat__value">' + item[1] + '</strong><p class="admin-stat__meta">' + item[2] + '</p></article>';
    });
    html += '</div>';

    html += '<div class="admin-grid-2">';
    html += '<section class="admin-panel"><div class="admin-panel__head"><div><h2>By type</h2><p>Share of all submissions</p></div></div><div class="admin-bars">';
    Object.keys(stats.byType).sort(function (a, b) { return stats.byType[b] - stats.byType[a]; }).slice(0, 6).forEach(function (key) {
      var count = stats.byType[key];
      html += '<div class="admin-bar-row"><span>' + escapeHtml(key) + '</span><div class="admin-bar-track"><div class="admin-bar-fill" style="width:' + Math.round((count / maxType) * 100) + '%"></div></div><span class="admin-bar-count">' + count + '</span></div>';
    });
    html += '</div></section>';

    html += '<section class="admin-panel"><div class="admin-panel__head"><div><h2>Activity · last 7 days</h2><p>New registrations per day</p></div></div><div class="admin-chart">';
    stats.activity.forEach(function (point) {
      var height = Math.max(6, Math.round((point.count / maxActivity) * 100));
      html += '<div class="admin-chart-col"><div class="admin-chart-bar" style="height:' + height + '%"></div><span class="admin-chart-label">' + escapeHtml(point.label) + '</span></div>';
    });
    html += '</div></section></div>';

    html += '<div class="admin-grid-2">';
    html += '<section class="admin-panel"><div class="admin-panel__head"><div><h2>Experiences</h2><p>Upcoming and active first · past at the bottom</p></div></div><div class="admin-experience-list">';
    sortedExperienceCatalog(RETREAT_CATALOG.concat(EVENT_CATALOG)).forEach(function (item) {
      html += '<article class="admin-experience"><img class="admin-experience__img" src="' + item.image + '" alt="' + escapeHtml(item.name) + '"><div><p class="admin-experience__title">' + escapeHtml(item.name) + '</p><p class="admin-experience__meta">' + escapeHtml(item.dates) + ' · ' + escapeHtml(item.location) + '</p></div>' + renderExperienceStatusPill(item.liveStatus, item.liveStatusLabel) + '</article>';
    });
    html += '</div></section>';

    html += '<section class="admin-panel"><div class="admin-panel__head"><div><h2>Needs attention</h2></div></div><div class="admin-attention">';
    html += '<div class="admin-attention-item"><span>Medical forms awaiting review</span><strong>' + stats.medicalPending + '</strong></div>';
    html += '<div class="admin-attention-item"><span>Retreat reservations pending</span><strong>' + stats.retreatsPending + '</strong></div>';
    html += '<div class="admin-attention-item"><span>Events & Haifa yoga pending</span><strong>' + stats.eventsPending + '</strong></div>';
    html += '<div class="admin-attention-item"><span>Shop orders pending</span><strong>' + stats.shopPending + '</strong></div>';
    html += '<div class="admin-attention-item"><span>Returning guests</span><strong>' + stats.community + '</strong></div>';
    html += '</div></section></div>';

    html += renderFilterBar(filters, { status: ['all', 'pending', 'completed'], sources: OVERVIEW_SOURCES });
    html += '<section class="admin-panel"><div class="admin-panel__head"><div><h2>Recent activity</h2><p>Latest submissions across all channels</p></div></div>';
    html += renderTable(filteredRecent, 'No recent activity yet.');
    html += '<div class="admin-link-row"><a href="/admin/community">View returning guests →</a></div></section>';

    root.innerHTML = html;
    bindFilters(root, rows);
    bindTableActions(root, rows);
  }

  function renderRetreats(root, rows, stats, filters) {
    var filtered = filterRows(rows, filters, 'retreats');
    var html = '<div class="admin-page-head"><div><h1>Retreats</h1><p>Featured journeys, occupancy, and every retreat reservation in one place.</p></div><div class="admin-page-actions"><button type="button" class="admin-btn admin-btn--primary" data-action="export-all">Export filtered</button></div></div>';

    html += '<div class="admin-retreat-cards">';
    sortedExperienceCatalog(RETREAT_CATALOG).forEach(function (retreat) {
      var count = rows.filter(function (row) { return row.source === retreat.source; }).length;
      var pending = rows.filter(function (row) { return row.source === retreat.source && row.status !== 'completed'; }).length;
      html += '<article class="admin-retreat-card"><div class="admin-retreat-card__media"><img src="' + retreat.image + '" alt="' + escapeHtml(retreat.name) + '">' + renderExperienceCardStatus(retreat.liveStatus, retreat.liveStatusLabel) + '</div><div class="admin-retreat-card__body"><h3>' + escapeHtml(retreat.name) + '</h3><p>' + escapeHtml(retreat.dates) + ' · ' + escapeHtml(retreat.location) + '</p><div class="admin-retreat-card__stats"><span>' + count + ' bookings</span><span>' + pending + ' pending</span></div></div></article>';
    });
    html += '</div>';

    html += '<div class="admin-stats"><article class="admin-stat"><p class="admin-stat__label">Total bookings</p><strong class="admin-stat__value">' + stats.retreats + '</strong></article>';
    html += '<article class="admin-stat"><p class="admin-stat__label">Pending review</p><strong class="admin-stat__value">' + stats.retreatsPending + '</strong></article>';
    html += '<article class="admin-stat"><p class="admin-stat__label">Reviewed</p><strong class="admin-stat__value">' + (stats.retreats - stats.retreatsPending) + '</strong></article></div>';

    html += '<div class="admin-progress-list">';
    sortExperienceCatalog(RETREAT_CATALOG).forEach(function (retreat) {
      var count = rows.filter(function (row) { return row.source === retreat.source; }).length;
      var pct = stats.retreats ? Math.round((count / stats.retreats) * 100) : 0;
      html += '<div class="admin-progress-row"><span>' + escapeHtml(retreat.name) + '</span><div class="admin-progress-track"><div class="admin-progress-fill" style="width:' + pct + '%"></div></div><span>' + count + '</span></div>';
    });
    html += '</div>';

    html += renderFilterBar(filters, {
      status: ['all', 'pending', 'completed'],
      sources: RETREAT_SOURCES,
      tabs: [
        { value: 'all', label: 'All retreats' },
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Reviewed' },
        { value: 'archive', label: 'Archive' },
      ],
    });
    html += renderTable(filtered, 'No retreat reservations match these filters.');
    root.innerHTML = html;
    bindFilters(root, rows);
    bindTableActions(root, rows);
    var exportAll = root.querySelector('[data-action="export-all"]');
    if (exportAll) exportAll.addEventListener('click', function () { exportCsv(filtered); });
  }

  function renderEvents(root, rows, stats, filters) {
    var filtered = filterRows(rows, filters, 'events');
    var html = '<div class="admin-page-head"><div><h1>Events</h1><p>Every gathering on the site — day retreats, sound healing, nature days, and Haifa yoga classes.</p></div><div class="admin-page-actions"><button type="button" class="admin-btn admin-btn--primary" data-action="export-all">Export filtered</button></div></div>';

    html += '<div class="admin-retreat-cards is-events">';
    sortedExperienceCatalog(EVENT_CATALOG).forEach(function (item) {
      var count = rows.filter(function (row) { return matchesCatalog(row, item); }).length;
      var pending = rows.filter(function (row) { return matchesCatalog(row, item) && row.status !== 'completed'; }).length;
      html += '<article class="admin-retreat-card"><div class="admin-retreat-card__media"><img src="' + item.image + '" alt="' + escapeHtml(item.name) + '">' + renderExperienceCardStatus(item.liveStatus, item.liveStatusLabel) + '</div><div class="admin-retreat-card__body"><h3>' + escapeHtml(item.name) + '</h3><p>' + escapeHtml(item.dates) + ' · ' + escapeHtml(item.location) + '</p><div class="admin-retreat-card__stats"><span>' + count + ' bookings</span><span>' + pending + ' pending</span></div></div></article>';
    });
    html += '</div>';

    html += '<div class="admin-stats"><article class="admin-stat"><p class="admin-stat__label">Total bookings</p><strong class="admin-stat__value">' + stats.events + '</strong></article>';
    html += '<article class="admin-stat"><p class="admin-stat__label">Pending review</p><strong class="admin-stat__value">' + stats.eventsPending + '</strong></article>';
    html += '<article class="admin-stat"><p class="admin-stat__label">Reviewed</p><strong class="admin-stat__value">' + (stats.events - stats.eventsPending) + '</strong></article></div>';

    html += renderFilterBar(filters, {
      status: ['all', 'pending', 'completed'],
      sources: EVENT_SOURCES,
      tabs: [
        { value: 'all', label: 'All events' },
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Reviewed' },
        { value: 'archive', label: 'Archive' },
      ],
    });
    html += renderTable(filtered, 'No event or Haifa yoga bookings match these filters.');
    root.innerHTML = html;
    bindFilters(root, rows);
    bindTableActions(root, rows);
    var exportAll = root.querySelector('[data-action="export-all"]');
    if (exportAll) exportAll.addEventListener('click', function () { exportCsv(filtered); });
  }

  function renderCommunity(root, rows, stats, filters) {
    var people = buildReturningPeople(rows);
    var q = String(filters.q || '').trim().toLowerCase();
    if (q) {
      people = people.filter(function (person) {
        var hay = [person.fullName, person.phone, person.city].concat(person.placeIds.map(function (id) {
          return placeMeta(id).name;
        })).join(' ').toLowerCase();
        return hay.indexOf(q) !== -1;
      });
    }
    if (filters.source && filters.source !== 'all') {
      var wantedPlace = placeIdForSource(filters.source);
      people = people.filter(function (person) {
        return wantedPlace ? person.placeIds.indexOf(wantedPlace) !== -1 : true;
      });
    }

    var html = '<div class="admin-page-head"><div><h1>Community</h1><p>Returning guests — people who came back and registered for another retreat, event, or class.</p></div></div>';

    html += '<div class="admin-stats">';
    html += '<article class="admin-stat"><p class="admin-stat__label">Returning guests</p><strong class="admin-stat__value">' + stats.community + '</strong><p class="admin-stat__meta">Two or more places</p></article>';
    html += '<article class="admin-stat"><p class="admin-stat__label">Need follow-up</p><strong class="admin-stat__value">' + stats.communityPending + '</strong><p class="admin-stat__meta">With a pending request</p></article>';
    html += '<article class="admin-stat"><p class="admin-stat__label">Shown now</p><strong class="admin-stat__value">' + people.length + '</strong><p class="admin-stat__meta">After search and filters</p></article>';
    html += '</div>';

    html += renderFilterBar(filters, {
      status: false,
      sources: RETREAT_SOURCES.concat(EVENT_SOURCES),
      hideExport: true,
    });

    if (!people.length) {
      html += renderEmptyState('No returning guests yet. This list fills when someone registers for a second place.');
      root.innerHTML = html;
      bindFilters(root, rows);
      return;
    }

    html += '<div class="admin-people-grid">';
    people.forEach(function (person) {
      html += '<article class="admin-person-card">';
      html += '<div class="admin-person-card__head">';
      html += '<span class="admin-person-card__avatar">' + escapeHtml(initials(person.fullName)) + '</span>';
      html += '<div><p class="admin-person-card__name">' + escapeHtml(person.fullName) + '</p><p class="admin-person-card__meta">' + escapeHtml(person.phone) + (person.city && person.city !== '-' ? ' · ' + escapeHtml(person.city) : '') + '</p></div>';
      html += '<span class="admin-person-card__count">' + person.placeIds.length + ' places</span>';
      html += '</div>';
      html += '<div class="admin-place-chips">';
      person.placeIds.forEach(function (placeId) {
        var place = placeMeta(placeId);
        html += '<span class="admin-place-chip"><img src="' + place.image + '" alt="">' + escapeHtml(place.name) + '</span>';
      });
      html += '</div>';
      html += '<div class="admin-person-card__visits">';
      person.rows.slice(0, 4).forEach(function (row) {
        html += '<div class="admin-person-visit"><strong>' + escapeHtml(sourceLabel(row.source)) + '</strong><span>' + escapeHtml(relativeTime(row.date)) + '</span></div>';
      });
      html += '</div></article>';
    });
    html += '</div>';

    var allReturningRows = [];
    people.forEach(function (person) {
      person.rows.forEach(function (row) { allReturningRows.push(row); });
    });
    allReturningRows.sort(function (a, b) { return compareRows(a, b, 'newest'); });
    html += '<section class="admin-panel"><div class="admin-panel__head"><div><h2>Their submissions</h2><p>Every request from returning guests</p></div></div>';
    html += renderTable(allReturningRows, 'No matching submissions.');
    html += '</section>';

    root.innerHTML = html;
    bindFilters(root, rows);
    bindTableActions(root, allReturningRows);
  }

  function renderMedical(root, rows, filters) {
    var filtered = filterRows(rows, filters, 'medical');
    var viewOnly = isViewOnly();
    var html = '<div class="admin-page-head"><div><h1>Medical forms</h1><p>' + (viewOnly
      ? 'View-only access — you can open medical forms, but not change or delete them.'
      : 'Health intake forms — Nawal\'s Care, Ice Bath, and Wadi Rum registration.') + '</p></div></div>';
    html += '<div class="admin-retreat-cards is-medical">';
    MEDICAL_CATALOG.forEach(function (item) {
      var count = rows.filter(function (row) { return matchesCatalog(row, item); }).length;
      var pending = rows.filter(function (row) { return matchesCatalog(row, item) && row.status !== 'completed'; }).length;
      html += renderCatalogCard(item, count, pending, 'forms');
    });
    html += '</div>';
    html += renderFilterBar(filters, {
      status: ['all', 'pending', 'completed'],
      sources: MEDICAL_SOURCES,
      hideExport: viewOnly,
    });
    html += renderTable(filtered, 'No medical forms match these filters.');
    root.innerHTML = html;
    bindFilters(root, rows);
    bindTableActions(root, rows);
  }

  function renderSimpleListPage(root, rows, filters, view, title, subtitle, sources, catalog) {
    var filtered = filterRows(rows, filters, view);
    var html = '<div class="admin-page-head"><div><h1>' + escapeHtml(title) + '</h1><p>' + escapeHtml(subtitle) + '</p></div></div>';
    if (catalog && catalog.length) {
      html += '<div class="admin-retreat-cards">';
      sortedExperienceCatalog(catalog).forEach(function (item) {
        var count = rows.filter(function (row) { return matchesCatalog(row, item); }).length;
        var pending = rows.filter(function (row) { return matchesCatalog(row, item) && row.status !== 'completed'; }).length;
        html += '<article class="admin-retreat-card"><div class="admin-retreat-card__media"><img src="' + item.image + '" alt="' + escapeHtml(item.name) + '">' + renderExperienceCardStatus(item.liveStatus, item.liveStatusLabel) + '</div><div class="admin-retreat-card__body"><h3>' + escapeHtml(item.name) + '</h3><p>' + escapeHtml(item.dates) + ' · ' + escapeHtml(item.location) + '</p><div class="admin-retreat-card__stats"><span>' + count + ' forms</span><span>' + pending + ' pending</span></div></div></article>';
      });
      html += '</div>';
    }
    html += renderFilterBar(filters, { status: ['all', 'pending', 'completed'], sources: sources });
    html += renderTable(filtered, 'No records match these filters.');
    root.innerHTML = html;
    bindFilters(root, rows);
    bindTableActions(root, rows);
  }

  function renderOrdersTable(rows, emptyMessage) {
    if (!rows.length) return renderEmptyState(emptyMessage);
    var html = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>';
    html += '<th>When</th><th>Fulfillment</th><th>Product</th><th>Payment</th><th>Person</th><th></th></tr></thead><tbody>';
    rows.forEach(function (row) {
      var order = parseShopOrder(row);
      var paid = order.paid || row.yogaExperience === 'paid';
      html += '<tr data-id="' + escapeHtml(row.id) + '">';
      html += '<td><div class="admin-table__primary">' + escapeHtml(relativeTime(row.date)) + '</div><div class="admin-table__sub">' + escapeHtml(formatDisplayDate(row.date)) + '</div></td>';
      html += '<td><span class="status-pill ' + (row.status === 'completed' ? 'status-completed' : 'status-pending') + '">' + escapeHtml(row.status === 'completed' ? 'fulfilled' : 'open') + '</span></td>';
      html += '<td><div class="admin-table__type">';
      html += '<img class="admin-table__thumb" src="' + placeMeta('shop').image + '" alt="">';
      html += '<div><div class="admin-table__primary">' + escapeHtml(order.productName || row.retreatType) + '</div><div class="admin-table__sub">' + escapeHtml([order.color, order.qty ? '×' + order.qty : '', order.amountUsd ? '$' + order.amountUsd : ''].filter(Boolean).join(' · ')) + '</div></div></div></td>';
      html += '<td><div class="admin-table__primary">' + escapeHtml(PAYMENT_LABELS[order.payment] || order.payment || '—') + '</div><div class="admin-table__sub">' + (paid ? 'Paid' : 'Unpaid') + '</div></td>';
      html += '<td><div class="admin-table__person"><span class="admin-table__avatar">' + escapeHtml(initials(row.fullName)) + '</span><div><div class="admin-table__primary">' + escapeHtml(row.fullName) + '</div><div class="admin-table__sub">' + escapeHtml(row.phone) + '</div></div></div></td>';
      html += '<td><div class="admin-row-actions">';
      html += '<button type="button" class="admin-row-btn" data-action="view">View</button>';
      html += '<button type="button" class="admin-row-btn" data-action="toggle">' + (row.status === 'completed' ? 'Mark open' : 'Fulfill') + '</button>';
      html += '<button type="button" class="admin-row-btn admin-row-btn--danger" data-action="delete">Delete</button>';
      html += '</div></td></tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }

  function renderShop(root, rows, stats, filters) {
    var filtered = filterRows(rows, filters, 'shop');
    var html = '<div class="admin-page-head"><div><h1>Shop</h1><p>The Nawal edit — mats, blocks, and every order coming in from the store.</p></div><div class="admin-page-actions">';
    if (hasPermission('sales')) html += '<a href="/admin/sales" class="admin-btn admin-btn--ghost">Sales &amp; profit</a>';
    html += '<a href="/shop" class="admin-btn admin-btn--ghost" target="_blank" rel="noopener">Open shop</a><button type="button" class="admin-btn admin-btn--primary" data-action="export-all">Export orders</button></div></div>';

    html += '<div class="admin-retreat-cards">';
    SHOP_CATALOG.forEach(function (item) {
      var count = rows.filter(function (row) { return shopMatchesProduct(row, item); }).length;
      var pending = rows.filter(function (row) { return shopMatchesProduct(row, item) && row.status !== 'completed'; }).length;
      html += renderCatalogCard(item, count, pending, 'orders');
    });
    html += '</div>';

    var finance = computeShopFinance(rows);
    html += '<div class="admin-stats"><article class="admin-stat"><p class="admin-stat__label">Total orders</p><strong class="admin-stat__value">' + stats.shop + '</strong></article>';
    html += '<article class="admin-stat"><p class="admin-stat__label">Open</p><strong class="admin-stat__value">' + stats.shopPending + '</strong></article>';
    html += '<article class="admin-stat"><p class="admin-stat__label">Paid</p><strong class="admin-stat__value">' + stats.shopPaid + '</strong></article>';
    html += '<article class="admin-stat"><p class="admin-stat__label">Paid income</p><strong class="admin-stat__value">' + money(finance.paidRevenue) + '</strong></article></div>';

    html += renderFilterBar(filters, {
      status: ['all', 'pending', 'completed'],
      tabs: [
        { value: 'all', label: 'All orders' },
        { value: 'pending', label: 'Open' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'cash', label: 'Cash' },
        { value: 'stripe', label: 'Visa · Mastercard' },
        { value: 'paypal', label: 'PayPal' },
      ],
    });
    html += renderOrdersTable(filtered, 'No shop orders yet.');
    root.innerHTML = html;
    bindFilters(root, rows);
    bindTableActions(root, rows);
    var exportAll = root.querySelector('[data-action="export-all"]');
    if (exportAll) exportAll.addEventListener('click', function () { exportCsv(filtered); });
  }

  function renderOrders(root, rows, stats, filters) {
    var filtered = filterRows(rows, filters, 'orders');
    var html = '<div class="admin-page-head"><div><h1>Orders</h1><p>WhatsApp, cash on delivery, and Stripe card payments from the shop.</p></div><div class="admin-page-actions"><button type="button" class="admin-btn admin-btn--primary" data-action="export-all">Export filtered</button></div></div>';

    html += '<div class="admin-stats"><article class="admin-stat"><p class="admin-stat__label">All orders</p><strong class="admin-stat__value">' + stats.shop + '</strong></article>';
    html += '<article class="admin-stat"><p class="admin-stat__label">Open</p><strong class="admin-stat__value">' + stats.shopPending + '</strong></article>';
    html += '<article class="admin-stat"><p class="admin-stat__label">Paid</p><strong class="admin-stat__value">' + stats.shopPaid + '</strong></article>';
    html += '<article class="admin-stat"><p class="admin-stat__label">Fulfilled</p><strong class="admin-stat__value">' + (stats.shop - stats.shopPending) + '</strong></article></div>';

    html += renderFilterBar(filters, {
      status: ['all', 'pending', 'completed'],
      tabs: [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Open' },
        { value: 'completed', label: 'Fulfilled' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'cash', label: 'Cash on delivery' },
        { value: 'stripe', label: 'Visa · Mastercard' },
        { value: 'paypal', label: 'PayPal' },
      ],
    });
    html += renderOrdersTable(filtered, 'No orders match these filters.');
    root.innerHTML = html;
    bindFilters(root, rows);
    bindTableActions(root, rows);
    var exportAll = root.querySelector('[data-action="export-all"]');
    if (exportAll) exportAll.addEventListener('click', function () { exportCsv(filtered); });
  }

  function renderContent(root) {
    root.innerHTML = '<div class="admin-page-head"><div><h1>Content</h1><p>Feedback links hub and future editorial tools.</p></div><div class="admin-page-actions"><a href="/feedback" class="admin-btn admin-btn--primary">Open feedback hub</a></div></div><div class="admin-settings-grid"><article class="admin-settings-card"><h3>' + ICONS.content + ' Feedback pages</h3><p>Share post-experience evaluation links for retreats and events. Responses flow into the admin dashboard via Supabase.</p><p style="margin-top:10px"><a href="/feedback">/feedback</a></p></article><article class="admin-settings-card"><h3>Coming soon</h3><p>Manage homepage highlights, journal posts, and featured experiences from this section.</p></article></div>';
  }

  function permissionLabel(id) {
    var found = STAFF_PERMISSIONS.find(function (item) { return item.id === id; });
    return found ? found.label : id;
  }

  function renderStaff(root) {
    var session = currentSession();
    if (!isOwner(session)) {
      root.innerHTML = renderEmptyState('Only the owner or web developer can add and edit team permissions.');
      return;
    }

    var staff = loadStaff().filter(function (member) {
      return !member.locked && !isReservedUsername(member.username);
    });
    var html = '<div class="admin-page-head"><div><h1>Team</h1><p>Create staff logins and choose exactly which sections each person can open. Team settings stay on this device with Nawal’s account.</p></div></div>';
    html += '<div class="admin-staff-layout">';

    html += '<section class="admin-panel admin-staff-form-card">';
    html += '<div class="admin-panel__head"><div><h2 id="staffFormTitle">Add team member</h2><p>Username, password, and the pages they may use.</p></div></div>';
    html += '<form id="staffForm" class="admin-staff-form" novalidate>';
    html += '<input type="hidden" name="staffId" value="">';
    html += '<label>Full name<input name="name" type="text" placeholder="" required autocomplete="off"></label>';
    html += '<label>Username<input name="username" type="text" placeholder="" required autocomplete="off"></label>';
    html += '<label>Password<input name="password" type="text" placeholder="Choose a password" required autocomplete="off"></label>';
    html += '<p class="admin-staff-form__hint" id="staffPasswordHint">They will use this username and password on the admin login page.</p>';
    html += '<p class="admin-staff-form__section">Permissions</p>';
    html += '<div class="admin-perm-grid">';
    STAFF_PERMISSIONS.forEach(function (perm) {
      html += '<label class="admin-perm"><input type="checkbox" name="perm" value="' + perm.id + '"><span><strong>' + escapeHtml(perm.label) + '</strong><em>' + escapeHtml(perm.hint) + '</em></span></label>';
    });
    html += '</div>';
    html += '<p class="form-error" id="staffFormError" aria-live="polite"></p>';
    html += '<div class="admin-staff-form__actions">';
    html += '<button type="submit" class="admin-btn admin-btn--primary" id="staffSubmitBtn">Save team member</button>';
    html += '<button type="button" class="admin-btn admin-btn--ghost" id="staffResetBtn" hidden>Cancel edit</button>';
    html += '</div></form></section>';

    html += '<section class="admin-staff-list">';
    html += '<article class="admin-staff-card is-owner">';
    html += '<div class="admin-staff-card__head"><span class="admin-staff-card__avatar admin-staff-card__avatar--photo admin-staff-card__avatar--owner"><img src="' + OWNER_AVATAR + '" alt="" width="40" height="40"></span><div><p class="admin-staff-card__name">' + escapeHtml(OWNER_NAME) + '</p><p class="admin-staff-card__meta">nawal · owner account</p></div><span class="admin-staff-card__badge">Full access</span></div>';
    html += '<p class="admin-staff-card__note">This account can open every section, add staff, and change permissions.</p>';
    html += '</article>';

    html += '<article class="admin-staff-card is-owner is-locked">';
    html += '<div class="admin-staff-card__head"><span class="admin-staff-card__avatar admin-staff-card__avatar--photo"><img src="' + DEVELOPER_AVATAR + '" alt="" width="40" height="40"></span><div><p class="admin-staff-card__name">' + escapeHtml(DEVELOPER_NAME) + '</p><p class="admin-staff-card__meta">mohammad · web developer</p></div><span class="admin-staff-card__badge">Full access</span></div>';
    html += '<p class="admin-staff-card__note">Built-in developer account with the same access as Nawal. It cannot be edited or removed.</p>';
    html += '</article>';

    BUILTIN_STAFF.forEach(function (member) {
      var perms = Array.isArray(member.permissions) ? member.permissions : [];
      html += '<article class="admin-staff-card is-locked">';
      html += '<div class="admin-staff-card__head"><span class="admin-staff-card__avatar">' + escapeHtml(initials(member.name)) + '</span><div><p class="admin-staff-card__name">' + escapeHtml(member.name) + '</p><p class="admin-staff-card__meta">' + escapeHtml(member.username) + ' · built-in team login</p></div><span class="admin-staff-card__badge">' + (member.viewOnly ? 'View only' : 'Limited') + '</span></div>';
      html += '<div class="admin-staff-card__perms">';
      if (!perms.length) {
        html += '<span class="admin-place-chip">No sections</span>';
      } else {
        perms.forEach(function (perm) {
          html += '<span class="admin-place-chip">' + escapeHtml(permissionLabel(perm)) + '</span>';
        });
      }
      html += '</div>';
      html += '<p class="admin-staff-card__note">Built-in account. Access is fixed in the system and cannot be edited or removed here.</p>';
      html += '</article>';
    });

    if (!staff.length) {
      html += '<div class="admin-empty admin-empty--soft"><p class="admin-empty__title">No team members yet</p><p class="admin-empty__hint">Add someone on the left and choose the pages they should see.</p></div>';
    }

    staff.forEach(function (member) {
      var perms = Array.isArray(member.permissions) ? member.permissions : [];
      html += '<article class="admin-staff-card" data-staff-id="' + escapeHtml(member.id) + '">';
      html += '<div class="admin-staff-card__head"><span class="admin-staff-card__avatar">' + escapeHtml(initials(member.name)) + '</span><div><p class="admin-staff-card__name">' + escapeHtml(member.name) + '</p><p class="admin-staff-card__meta">' + escapeHtml(member.username) + ' · team login</p></div></div>';
      html += '<div class="admin-staff-card__perms">';
      if (!perms.length) {
        html += '<span class="admin-perm-pill is-empty">No pages assigned</span>';
      } else {
        perms.forEach(function (id) {
          html += '<span class="admin-perm-pill">' + escapeHtml(permissionLabel(id)) + '</span>';
        });
      }
      html += '</div>';
      html += '<div class="admin-staff-card__actions">';
      html += '<button type="button" class="admin-btn admin-btn--ghost" data-staff-edit="' + escapeHtml(member.id) + '">Edit permissions</button>';
      html += '<button type="button" class="admin-btn admin-btn--danger" data-staff-delete="' + escapeHtml(member.id) + '">Remove</button>';
      html += '</div></article>';
    });

    html += '</section></div>';
    root.innerHTML = html;
    bindStaffForm(root);
  }

  function fillStaffForm(form, member) {
    var title = document.getElementById('staffFormTitle');
    var hint = document.getElementById('staffPasswordHint');
    var submit = document.getElementById('staffSubmitBtn');
    var reset = document.getElementById('staffResetBtn');
    var error = document.getElementById('staffFormError');
    if (error) error.textContent = '';
    form.staffId.value = member ? member.id : '';
    form.name.value = member ? member.name : '';
    form.username.value = member ? member.username : '';
    form.password.value = '';
    form.password.required = !member;
    form.password.placeholder = member ? 'Leave blank to keep current password' : 'Choose a password';
    Array.prototype.forEach.call(form.querySelectorAll('input[name="perm"]'), function (input) {
      input.checked = !!(member && (member.permissions || []).indexOf(input.value) !== -1);
    });
    if (title) title.textContent = member ? 'Edit permissions' : 'Add team member';
    if (hint) hint.textContent = member ? 'Leave the password blank to keep the current one.' : 'They will use this username and password on the admin login page.';
    if (submit) submit.textContent = member ? 'Update team member' : 'Save team member';
    if (reset) reset.hidden = !member;
  }

  function bindStaffForm(root) {
    var form = document.getElementById('staffForm');
    if (!form) return;
    var error = document.getElementById('staffFormError');
    var reset = document.getElementById('staffResetBtn');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (error) error.textContent = '';
      var id = String(form.staffId.value || '').trim();
      var name = String(form.name.value || '').trim();
      var username = String(form.username.value || '').trim().toLowerCase();
      var password = String(form.password.value || '');
      var permissions = Array.prototype.map.call(form.querySelectorAll('input[name="perm"]:checked'), function (input) {
        return input.value;
      });

      if (!name || !username) {
        if (error) error.textContent = 'Name and username are required.';
        return;
      }
      if (!/^[a-z0-9._-]{2,24}$/.test(username)) {
        if (error) error.textContent = 'Username must be 2–24 letters, numbers, dots, dashes, or underscores.';
        return;
      }
      if (isReservedUsername(username)) {
        if (error) error.textContent = 'That username belongs to a built-in account.';
        return;
      }
      if (!id && password.length < 4) {
        if (error) error.textContent = 'Password must be at least 4 characters.';
        return;
      }
      if (id && password && password.length < 4) {
        if (error) error.textContent = 'New password must be at least 4 characters.';
        return;
      }
      if (!permissions.length) {
        if (error) error.textContent = 'Choose at least one permission so they can open the workspace.';
        return;
      }

      var list = loadStaff();
      var taken = list.some(function (item) {
        return item.id !== id && String(item.username || '').toLowerCase() === username;
      });
      if (taken) {
        if (error) error.textContent = 'That username is already in use.';
        return;
      }

      if (id) {
        var existing = list.find(function (item) { return item.id === id; });
        if (!existing || existing.locked || isReservedUsername(existing.username)) {
          if (error) error.textContent = existing && (existing.locked || isReservedUsername(existing.username))
            ? 'This account cannot be edited.'
            : 'Team member not found.';
          return;
        }
        existing.name = name;
        existing.username = username;
        existing.permissions = permissions;
        if (password) existing.password = password;
        existing.updatedAt = new Date().toISOString();
      } else {
        list.push({
          id: 'staff-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6),
          name: name,
          username: username,
          password: password,
          permissions: permissions,
          createdAt: new Date().toISOString(),
        });
      }

      saveStaff(list);
      renderStaff(root);
    });

    if (reset) {
      reset.addEventListener('click', function () {
        fillStaffForm(form, null);
      });
    }

    root.querySelectorAll('[data-staff-edit]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var member = loadStaff().find(function (item) { return item.id === btn.getAttribute('data-staff-edit'); });
        if (member) {
          fillStaffForm(form, member);
          form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    root.querySelectorAll('[data-staff-delete]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-staff-delete');
        var member = loadStaff().find(function (item) { return item.id === id; });
        if (!member || member.locked || isReservedUsername(member.username)) return;
        if (!window.confirm('Remove ' + member.name + ' from the team? They will no longer be able to sign in.')) return;
        saveStaff(loadStaff().filter(function (item) { return item.id !== id; }));
        renderStaff(root);
      });
    });
  }

  function renderSales(root, rows, filters) {
    var costs = loadCosts();
    var filtered = filterRows(rows, filters, 'sales');
    var finance = computeShopFinance(filtered, costs);
    var products = Object.keys(finance.byProduct).map(function (id) { return finance.byProduct[id]; });
    var payments = Object.keys(finance.byPayment).map(function (id) { return finance.byPayment[id]; });
    var maxProduct = Math.max.apply(null, products.map(function (item) { return item.paid; }).concat([1]));
    var maxPayment = Math.max.apply(null, payments.map(function (item) { return item.paid; }).concat([1]));

    var activity = [];
    var today = startOfDay(new Date());
    var maxActivity = 1;
    for (var i = 6; i >= 0; i -= 1) {
      var day = new Date(today);
      day.setDate(today.getDate() - i);
      var dayRows = filtered.filter(function (row) {
        var d = parseSubmittedAt(row.date);
        return d && dayKey(startOfDay(d)) === dayKey(day);
      });
      var amount = dayRows.reduce(function (sum, row) { return sum + shopAmount(row); }, 0);
      if (amount > maxActivity) maxActivity = amount;
      activity.push({
        label: day.toLocaleDateString(undefined, { weekday: 'short' }),
        amount: amount,
      });
    }

    var html = '<div class="admin-page-head"><div><h1>Sales &amp; profit</h1><p>Shop revenue, paid income, outstanding orders, and profit after the unit cost you set for each product.</p></div><div class="admin-page-actions"><button type="button" class="admin-btn admin-btn--primary" data-action="export-sales">Export sales</button></div></div>';

    html += renderFilterBar(filters, {
      status: false,
      hideExport: true,
      tabs: [
        { value: 'all', label: 'All orders' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'cash', label: 'Cash' },
        { value: 'stripe', label: 'Visa · Mastercard' },
        { value: 'paypal', label: 'PayPal' },
      ],
    });

    html += '<div class="admin-stats">';
    [
      ['Sales', money(finance.revenue), finance.orders + ' orders · ' + finance.units + ' items', ICONS.shop, ''],
      ['Paid income', money(finance.paidRevenue), finance.paidOrders + ' paid', ICONS.sales, ''],
      ['Outstanding', money(finance.outstanding), (finance.orders - finance.paidOrders) + ' unpaid', ICONS.orders, 'is-sand'],
      ['Profit', money(finance.profit), finance.cost ? 'After $' + finance.cost + ' cost' : 'Set unit cost below', ICONS.staff, finance.profit < 0 ? 'is-rust' : ''],
    ].forEach(function (item) {
      html += '<article class="admin-stat"><div class="admin-stat__top"><p class="admin-stat__label">' + item[0] + '</p><span class="admin-stat__icon ' + item[4] + '">' + item[3] + '</span></div><strong class="admin-stat__value">' + item[1] + '</strong><p class="admin-stat__meta">' + item[2] + '</p></article>';
    });
    html += '</div>';

    html += '<div class="admin-grid-2">';
    html += '<section class="admin-panel"><div class="admin-panel__head"><div><h2>By product</h2><p>Paid income from mats and blocks</p></div></div><div class="admin-bars">';
    products.forEach(function (item) {
      html += '<div class="admin-bar-row"><span>' + escapeHtml(item.name) + '</span><div class="admin-bar-track"><div class="admin-bar-fill" style="width:' + Math.round((item.paid / maxProduct) * 100) + '%"></div></div><span class="admin-bar-count">' + money(item.paid) + '</span></div>';
    });
    html += '</div></section>';

    html += '<section class="admin-panel"><div class="admin-panel__head"><div><h2>By payment</h2><p>Paid income by method</p></div></div><div class="admin-bars">';
    payments.forEach(function (item) {
      html += '<div class="admin-bar-row"><span>' + escapeHtml(item.label) + '</span><div class="admin-bar-track"><div class="admin-bar-fill" style="width:' + Math.round((item.paid / maxPayment) * 100) + '%"></div></div><span class="admin-bar-count">' + money(item.paid) + '</span></div>';
    });
    html += '</div></section></div>';

    html += '<div class="admin-grid-2">';
    html += '<section class="admin-panel"><div class="admin-panel__head"><div><h2>Sales · last 7 days</h2><p>Order value placed each day</p></div></div><div class="admin-chart">';
    activity.forEach(function (point) {
      var height = Math.max(6, Math.round((point.amount / maxActivity) * 100));
      html += '<div class="admin-chart-col"><div class="admin-chart-bar" style="height:' + height + '%"></div><span class="admin-chart-label">' + escapeHtml(point.label) + '</span><span class="admin-chart-value">' + (point.amount ? money(point.amount) : '–') + '</span></div>';
    });
    html += '</div></section>';

    html += '<section class="admin-panel"><div class="admin-panel__head"><div><h2>Unit cost</h2><p>Used only to calculate profit. Sales stay the same.</p></div></div>';
    if (isOwner()) {
      html += '<form id="shopCostForm" class="admin-cost-form">';
      html += '<label>Yoga Mat cost ($)<input name="mat" type="number" min="0" step="0.01" value="' + escapeHtml(costs.mat) + '"></label>';
      html += '<label>Yoga Block cost ($)<input name="block" type="number" min="0" step="0.01" value="' + escapeHtml(costs.block) + '"></label>';
      html += '<button type="submit" class="admin-btn admin-btn--primary">Update costs</button>';
      html += '</form>';
    }
    html += '<div class="admin-cost-breakdown">';
    products.forEach(function (item) {
      html += '<div class="admin-attention-item"><span>' + escapeHtml(item.name) + ' · ' + item.units + ' sold</span><strong>' + money(item.profit) + '</strong></div>';
    });
    html += '</div></section></div>';

    html += renderOrdersTable(filtered, 'No shop sales in this period.');
    root.innerHTML = html;
    bindFilters(root, rows);
    bindTableActions(root, rows);

    var exportBtn = root.querySelector('[data-action="export-sales"]');
    if (exportBtn) exportBtn.addEventListener('click', function () { exportCsv(filtered); });

    var costForm = document.getElementById('shopCostForm');
    if (costForm) {
      costForm.addEventListener('submit', function (event) {
        event.preventDefault();
        saveCosts({ mat: costForm.mat.value, block: costForm.block.value });
        renderSales(root, rows, getFilters());
      });
    }
  }

  function renderSettings(root) {
    var connected = !!SUPABASE_URL;
    var session = currentSession();
    var sessionLine = session
      ? ('Signed in as ' + (session.username || USERNAME) + (session.role === 'owner' ? ' · owner' : session.role === 'developer' ? ' · web developer' : ' · team member') + '.')
      : 'Not signed in.';
    root.innerHTML = '<div class="admin-page-head"><div><h1>Settings</h1><p>Workspace preferences and integrations.</p></div></div><div class="admin-settings-grid"><article class="admin-settings-card"><h3>' + ICONS.settings + ' Supabase connection</h3><p><span class="admin-status-dot' + (connected ? '' : ' is-off') + '">' + (connected ? 'Connected to retreat_requests table' : 'Supabase is not configured') + '</span></p></article><article class="admin-settings-card"><h3>' + ICONS.shop + ' Shop payments</h3><p>Orders save to the same table with source <code>shop-order</code>. WhatsApp and cash on delivery work now. Card payments need <code>STRIPE_SECRET_KEY</code> on the server, plus <code>NEXT_PUBLIC_SITE_URL</code>. Optional: <code>STRIPE_WEBHOOK_SECRET</code> for <code>/api/shop/webhook</code>.</p></article><article class="admin-settings-card"><h3>' + ICONS.staff + ' Team access</h3><p>Nawal’s account can add staff logins and edit permissions from <a href="/admin/staff">Team</a>. Staff only see the pages they are given.</p></article><article class="admin-settings-card"><h3>Session</h3><p>' + escapeHtml(sessionLine) + ' Stored locally in this browser.</p></article></div>';
  }

  function renderSkeleton(root) {
    var html = '<div class="admin-skeleton">';
    html += '<div class="admin-skeleton-block is-row" style="height:64px;max-width:420px"></div>';
    html += '<div class="admin-skeleton__stats">';
    for (var i = 0; i < 4; i += 1) html += '<div class="admin-skeleton-block is-stat"></div>';
    html += '</div>';
    html += '<div class="admin-grid-2">';
    html += '<div class="admin-skeleton-block is-panel"></div>';
    html += '<div class="admin-skeleton-block is-panel"></div>';
    html += '</div>';
    html += '<div class="admin-skeleton" style="gap:8px">';
    for (var j = 0; j < 5; j += 1) html += '<div class="admin-skeleton-block is-row"></div>';
    html += '</div></div>';
    root.innerHTML = html;
  }

  async function renderWorkspace(forceRefresh) {
    var root = document.getElementById('adminRoot');
    if (!root) return;

    var session = currentSession();
    var view = getView();
    if (!hasPermission(view, session)) {
      window.location.replace(firstAllowedPath(session));
      return;
    }

    var topbarSection = document.getElementById('adminTopbarSection');
    var currentView = VIEWS.find(function (item) { return item.id === view; }) || VIEWS[0];
    if (topbarSection) topbarSection.textContent = currentView.label;
    applySessionChrome(session);

    renderSkeleton(root);

    try {
      var rows = await getCachedRequests(!!forceRefresh);
      var stats = computeStats(rows);
      var filters = getFilters();
      renderSidebar(stats);

      if (view === 'overview') renderOverview(root, rows, stats, filters);
      else if (view === 'retreats') renderRetreats(root, rows, stats, filters);
      else if (view === 'events') renderEvents(root, rows, stats, filters);
      else if (view === 'community') renderCommunity(root, rows, stats, filters);
      else if (view === 'medical') renderMedical(root, rows, filters);
      else if (view === 'shop') renderShop(root, rows, stats, filters);
      else if (view === 'orders') renderOrders(root, rows, stats, filters);
      else if (view === 'sales') renderSales(root, rows, filters);
      else if (view === 'staff') renderStaff(root);
      else if (view === 'content') renderContent(root);
      else if (view === 'settings') renderSettings(root);
      else renderOverview(root, rows, stats, filters);
    } catch (_) {
      root.innerHTML = renderEmptyState('Could not load data. Check the Supabase connection and try refresh.');
    }
  }

  function initLogin() {
    var session = currentSession();
    if (session && allowedViews(session).length) {
      window.location.href = firstAllowedPath(session);
      return;
    }
    if (session) clearSession();
    var form = document.getElementById('loginForm');
    if (!form || form.dataset.adminBound === '1') return;
    form.dataset.adminBound = '1';
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var error = document.getElementById('loginError');
      var username = String(form.username.value || '').trim();
      var password = String(form.password.value || '').trim();
      var remember = !(form.rememberMe && !form.rememberMe.checked);
      if (username.toLowerCase() === USERNAME && password === PASSWORD) {
        setSession({
          isLoggedIn: true,
          username: USERNAME,
          name: OWNER_NAME,
          role: 'owner',
        }, remember);
        window.location.href = '/admin/overview';
        return;
      }
      if (username.toLowerCase() === DEVELOPER_USERNAME && password === DEVELOPER_PASSWORD) {
        setSession({
          isLoggedIn: true,
          username: DEVELOPER_USERNAME,
          name: DEVELOPER_NAME,
          role: 'developer',
        }, remember);
        window.location.href = '/admin/overview';
        return;
      }
      var staff = findStaffAccount(username, password);
      if (staff) {
        setSession({
          isLoggedIn: true,
          username: staff.username,
          name: staff.name,
          role: 'staff',
          staffId: staff.id,
          viewOnly: !!staff.viewOnly,
          permissions: staff.permissions || [],
        }, remember);
        window.location.href = firstAllowedPath(currentSession());
        return;
      }
      if (error) error.textContent = 'Invalid username or password.';
    });
  }

  var shellEventsBound = false;
  var adminScrollLockY = 0;

  function closeAdminMenu() {
    var sidebar = document.getElementById('adminSidebar');
    var overlay = document.getElementById('adminOverlay');
    var menuToggle = document.getElementById('adminMenuToggle');
    var app = document.querySelector('.admin-app');
    if (sidebar) sidebar.classList.remove('is-open');
    if (overlay) overlay.hidden = true;
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('admin-nav-open');
    document.body.style.top = '';
    if (app) app.classList.remove('admin-nav-open');
    window.scrollTo(0, adminScrollLockY);
  }

  function openAdminMenu() {
    var sidebar = document.getElementById('adminSidebar');
    var overlay = document.getElementById('adminOverlay');
    var menuToggle = document.getElementById('adminMenuToggle');
    var app = document.querySelector('.admin-app');
    adminScrollLockY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add('admin-nav-open');
    document.body.style.top = '-' + adminScrollLockY + 'px';
    if (app) app.classList.add('admin-nav-open');
    if (sidebar) sidebar.classList.add('is-open');
    if (overlay) overlay.hidden = false;
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
  }

  function bindAdminShellEvents() {
    if (shellEventsBound) return;
    shellEventsBound = true;

    document.addEventListener('click', function (event) {
      if (event.target.closest('#adminMenuToggle')) {
        event.preventDefault();
        var sidebar = document.getElementById('adminSidebar');
        if (sidebar && sidebar.classList.contains('is-open')) closeAdminMenu();
        else openAdminMenu();
        return;
      }
      if (event.target.closest('#adminOverlay')) {
        closeAdminMenu();
        return;
      }
      if (event.target.closest('#adminSidebarClose')) {
        event.preventDefault();
        closeAdminMenu();
        return;
      }
      if (event.target.closest('.admin-nav-link')) {
        closeAdminMenu();
        return;
      }
      if (event.target.closest('#adminLogoutBtn')) {
        clearSession();
        window.location.href = '/admin';
        return;
      }
      if (event.target.closest('#adminModalClose')) {
        closeModal();
        return;
      }
      var modal = document.getElementById('adminModal');
      if (modal && event.target === modal) {
        closeModal();
      }
      var refreshBtn = event.target.closest('#adminRefreshBtn');
      if (refreshBtn) {
        event.preventDefault();
        if (refreshBtn.classList.contains('is-busy')) return;
        refreshBtn.classList.add('is-busy');
        renderWorkspace(true).finally(function () {
          refreshBtn.classList.remove('is-busy');
        });
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeModal();
        closeAdminMenu();
      }
    });

    document.addEventListener('touchmove', function (event) {
      if (!document.body.classList.contains('admin-nav-open')) return;
      if (event.target.closest('.admin-sidebar')) return;
      event.preventDefault();
    }, { passive: false });
  }

  function initWorkspace() {
    bindAdminShellEvents();
    closeAdminMenu();

    var session = currentSession();
    if (!session) {
      window.location.href = '/admin';
      return;
    }
    if (!allowedViews(session).length) {
      clearSession();
      window.location.href = '/admin';
      return;
    }
    if (!hasPermission(getView(), session)) {
      window.location.replace(firstAllowedPath(session));
      return;
    }
    applySessionChrome(session);

    var refreshBtn = document.getElementById('adminRefreshBtn');
    var menuToggle = document.getElementById('adminMenuToggle');

    if (refreshBtn) refreshBtn.innerHTML = ICONS.refresh;
    if (menuToggle) menuToggle.innerHTML = ICONS.menu;

    renderWorkspace(true);
  }

  function boot() {
    if (isLoginPage()) initLogin();
    else if (isWorkspacePage()) initWorkspace();
  }

  window.nawalAdminBoot = boot;
  document.addEventListener('nawal:admin-mount', boot);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
