/* Yoga Admin Dashboard - Vanilla JS only */
(function () {
  var AUTH_KEY = "yogaAdminSession";
  var LEGACY_CLASS_KEY = "yogaClassRequests";
  var DASHBOARD_CONFIG = window.YOGA_DASHBOARD_CONFIG || {};
  var SUPABASE_URL = String(DASHBOARD_CONFIG.supabaseUrl || "").trim().replace(/\/+$/, "");
  var SUPABASE_ANON_KEY = String(DASHBOARD_CONFIG.supabaseAnonKey || "").trim();
  var SUPABASE_TABLE = String(DASHBOARD_CONFIG.supabaseTable || "retreat_requests").trim();
  var USERNAME = "nawal";
  var PASSWORD = "nawalll";
  var TREND_DAYS = 7;

  /**
   * Single source of truth for request categories.
   * Adding a category = add an entry here (+ form that writes matching `source` values).
   */
  var CATEGORIES = [
    {
      id: "all",
      label: "Total Requests",
      sources: null,
      icon: "total",
      inSidebar: false,
      isHero: true
    },
    {
      id: "form",
      label: "Mountain Voice Health",
      sources: ["mountain-voice-registration"],
      icon: "mountain",
      inSidebar: true
    },
    {
      id: "icebath",
      label: "Ice Bath",
      sources: ["ice-bath-health", "ice-bath-registration"],
      icon: "ice",
      inSidebar: true
    },
    {
      id: "retreats",
      label: "Retreat Requests",
      sources: ["wadi-rum-registration", "zanzibar-retreat-reserve", "dahab-retreat-reserve"],
      icon: "calendar",
      inSidebar: true
    },
    {
      id: "yoga",
      label: "Yoga Classes Requests",
      sources: ["yoga-class-registration", "yoga-class-request"],
      icon: "yoga",
      inSidebar: true,
      legacyKey: LEGACY_CLASS_KEY
    },
    {
      id: "feedback",
      label: "Feedback & Experience Reviews",
      sources: [
        "feedback-ice",
        "feedback-dahab",
        "feedback-wadi-rum",
        "feedback-zanzibar",
        "feedback-sound-healing",
        "feedback-nature-chocolate"
      ],
      icon: "feedback",
      inSidebar: true,
      legacyKey: "yogaFeedbackResponses"
    }
  ];

  var CATEGORY_BY_ID = CATEGORIES.reduce(function (map, cat) {
    map[cat.id] = cat;
    return map;
  }, {});

  var ICON_PATHS = {
    total:
      '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15v-4"/><path d="M12 15V8"/><path d="M16 15v-6"/>',
    mountain:
      '<path d="m8 18 4-8 3 5 2-3 3 6H8z"/><path d="M4 18h16"/>',
    ice:
      '<path d="M12 2v20"/><path d="m4.93 4.93 14.14 14.14"/><path d="M2 12h20"/><path d="m4.93 19.07 14.14-14.14"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/>',
    yoga:
      '<circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><path d="m8 21 4-6 4 6"/><path d="m6 11 6 2 6-2"/>',
    feedback:
      '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M12 7v5l3 3"/>'
  };

  function getPage() {
    var path = window.location.pathname.toLowerCase();
    if (path.endsWith("/dashboard.html")) return "dashboard";
    return "login";
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
    } catch (_err) {
      return null;
    }
  }

  function setSession() {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ isLoggedIn: true, username: USERNAME }));
  }

  function clearSession() {
    localStorage.removeItem(AUTH_KEY);
  }

  function requireAuthForDashboard() {
    var session = getSession();
    if (!session || !session.isLoggedIn) {
      window.location.href = "index.html";
    }
  }

  function redirectLoggedInFromLogin() {
    var session = getSession();
    if (session && session.isLoggedIn) {
      window.location.href = "dashboard.html";
    }
  }

  function readLegacyRequests(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (_err) {
      return [];
    }
  }

  function normalizeArray(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      return value
        .split(",")
        .map(function (item) {
          return item.trim();
        })
        .filter(Boolean);
    }
    return [];
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initLogin() {
    redirectLoggedInFromLogin();
    var form = document.getElementById("loginForm");
    var error = document.getElementById("loginError");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var username = String(form.username.value || "").trim();
      var password = String(form.password.value || "").trim();

      if (username === USERNAME && password === PASSWORD) {
        setSession();
        window.location.href = "dashboard.html";
        return;
      }

      error.textContent = "Invalid username or password.";
    });
  }

  function initDashboard() {
    requireAuthForDashboard();

    var state = {
      section: "form",
      filter: "all"
    };

    var cache = {
      rows: null,
      loading: null
    };

    var sectionTitle = document.getElementById("sectionTitle");
    var mobileSectionLabel = document.getElementById("mobileSectionLabel");
    var mobileTopbar = document.getElementById("mobileTopbar");
    var requestsContainer = document.getElementById("requestsContainer");
    var emptyState = document.getElementById("emptyState");
    var summaryGrid = document.getElementById("summaryGrid");
    var sidebarNav = document.getElementById("sidebarNav");
    var requestsPanel = document.getElementById("requestsPanel");
    var requestModal = document.getElementById("requestModal");
    var modalBody = document.getElementById("modalBody");
    var modalCloseBtn = document.getElementById("modalCloseBtn");

    var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
    var logoutBtn = document.getElementById("logoutBtn");
    var sidebar = document.getElementById("dashboardSidebar");
    var sidebarOverlay = document.getElementById("sidebarOverlay");
    var sidebarMenuToggle = document.getElementById("sidebarMenuToggle");
    var sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
    var refreshBtn = document.getElementById("refreshBtn");
    var mobileSidebarQuery = window.matchMedia("(max-width: 980px)");
    var previouslyFocused = null;
    var drawerFocusHandler = null;

    function getDrawerFocusable() {
      if (!sidebar) return [];
      return Array.prototype.slice
        .call(
          sidebar.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
        .filter(function (el) {
          return !el.hasAttribute("hidden") && el.getAttribute("aria-hidden") !== "true";
        });
    }

    function trapDrawerFocus(e) {
      if (!sidebar || !sidebar.classList.contains("is-open") || e.key !== "Tab") return;
      var focusables = getDrawerFocusable();
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function openSidebarMenu() {
      if (!sidebar || !sidebarOverlay || !sidebarMenuToggle) return;
      if (!mobileSidebarQuery.matches) return;
      previouslyFocused = document.activeElement;
      sidebar.classList.add("is-open");
      sidebar.setAttribute("role", "dialog");
      sidebar.setAttribute("aria-modal", "true");
      sidebarOverlay.hidden = false;
      sidebarOverlay.classList.add("is-open");
      sidebarMenuToggle.setAttribute("aria-expanded", "true");
      sidebarMenuToggle.setAttribute("aria-label", "Close menu");
      document.body.classList.add("dashboard-menu-open");
      if (!drawerFocusHandler) {
        drawerFocusHandler = trapDrawerFocus;
        document.addEventListener("keydown", drawerFocusHandler);
      }
      window.setTimeout(function () {
        var focusables = getDrawerFocusable();
        if (focusables.length) focusables[0].focus();
      }, 30);
    }

    function closeSidebarMenu() {
      if (!sidebar || !sidebarOverlay || !sidebarMenuToggle) return;
      sidebar.classList.remove("is-open");
      sidebar.removeAttribute("role");
      sidebar.removeAttribute("aria-modal");
      sidebarOverlay.classList.remove("is-open");
      sidebarMenuToggle.setAttribute("aria-expanded", "false");
      sidebarMenuToggle.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("dashboard-menu-open");
      if (drawerFocusHandler) {
        document.removeEventListener("keydown", drawerFocusHandler);
        drawerFocusHandler = null;
      }
      window.setTimeout(function () {
        if (!sidebarOverlay.classList.contains("is-open")) {
          sidebarOverlay.hidden = true;
        }
      }, 280);
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
        previouslyFocused = null;
      }
    }

    function updateTopbarScrollState() {
      if (!mobileTopbar) return;
      mobileTopbar.classList.toggle("is-scrolled", window.scrollY > 4);
    }

    function updateMobileSectionLabel(title) {
      if (mobileSectionLabel) mobileSectionLabel.textContent = title;
    }

    function normalizeRequest(item) {
      var name = item.fullName || item["fullName"] || item["الاسم الكامل"] || "-";
      var phone = item.phone || item["phone"] || item["رقم الهاتف"] || "-";
      var age = item.age || item["العمر"] || "-";
      var city = item.city || item["مكان السكن"] || "-";
      var reason = item.reason || item["دافع الاهتمام بالريتريت"] || "-";
      var expectation = item.expectation || item["التوقع من التجربة"] || "-";
      var yogaExperience = item.yogaExperience || item["خبرة يوغا/تأمل"] || "-";
      var healthStatus = item.healthStatus || item["حالة صحية حالية"] || "-";
      var healthDetails = item.healthDetails || item["تفاصيل صحية"] || "-";
      var activities = normalizeArray(item.activities || item["اهتمامات الأنشطة"]);
      var freeNote = item.freeNote || item["ملاحظات إضافية"] || "-";

      return {
        id: item.id || item["id"] || "sheet-" + Math.random().toString(36).slice(2),
        source: String(item.source || item["source"] || ""),
        fullName: name,
        phone: phone,
        age: age,
        city: city,
        reason: reason,
        expectation: expectation,
        yogaExperience: yogaExperience,
        healthStatus: healthStatus,
        healthDetails: healthDetails,
        activities: activities,
        freeNote: freeNote,
        date: item.submittedAt || item.date || item["submittedAt"] || item["date"] || "-",
        status: item.status || item["status"] || "pending",
        retreatType: item.retreatType || item["retreatType"] || "Wadi Rum",
        raw: item
      };
    }

    function getCategory(sectionId) {
      return CATEGORY_BY_ID[sectionId] || CATEGORY_BY_ID.form;
    }

    function sectionSources(section) {
      var cat = getCategory(section);
      return cat && cat.sources ? cat.sources.slice() : [];
    }

    function sectionLabel(section) {
      var cat = getCategory(section);
      return cat ? cat.label : "Requests";
    }

    function statusLabel(status) {
      return status === "completed" ? "Completed" : "Pending";
    }

    function parseSubmittedAt(value) {
      if (!value || value === "-") return null;
      var d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }

    function formatDisplayDate(value) {
      var d = parseSubmittedAt(value);
      if (!d) return "-";
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }

    function startOfDay(date) {
      var d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    function dayKey(date) {
      return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
      );
    }

    function buildSparklineSeries(rows, days) {
      var today = startOfDay(new Date());
      var buckets = {};
      var series = [];
      var i;

      for (i = days - 1; i >= 0; i -= 1) {
        var day = new Date(today);
        day.setDate(today.getDate() - i);
        buckets[dayKey(day)] = 0;
        series.push({ key: dayKey(day), count: 0, date: day });
      }

      rows.forEach(function (row) {
        var submitted = parseSubmittedAt(row.date);
        if (!submitted) return;
        var key = dayKey(startOfDay(submitted));
        if (Object.prototype.hasOwnProperty.call(buckets, key)) {
          buckets[key] += 1;
        }
      });

      return series.map(function (point) {
        return {
          key: point.key,
          date: point.date,
          count: buckets[point.key] || 0
        };
      });
    }

    function sparklineSvg(series) {
      var width = 88;
      var height = 28;
      var padY = 3;
      var counts = series.map(function (p) {
        return p.count;
      });
      var max = Math.max.apply(null, counts.concat([1]));
      var step = series.length > 1 ? width / (series.length - 1) : width;
      var points = series
        .map(function (point, index) {
          var x = index * step;
          var y = height - padY - (point.count / max) * (height - padY * 2);
          return x.toFixed(1) + "," + y.toFixed(1);
        })
        .join(" ");
      var areaPoints =
        "0," +
        height +
        " " +
        points +
        " " +
        width +
        "," +
        height;

      return (
        '<svg class="summary-sparkline" viewBox="0 0 ' +
        width +
        " " +
        height +
        '" width="' +
        width +
        '" height="' +
        height +
        '" aria-hidden="true" focusable="false">' +
        '<polygon class="summary-sparkline-area" points="' +
        areaPoints +
        '"></polygon>' +
        '<polyline class="summary-sparkline-line" fill="none" points="' +
        points +
        '"></polyline>' +
        "</svg>"
      );
    }

    function weekTrendLabel(series) {
      var total = series.reduce(function (sum, point) {
        return sum + point.count;
      }, 0);
      if (total === 0) return "No new this week";
      return "+" + total + " this week";
    }

    function iconSvg(name) {
      var paths = ICON_PATHS[name] || ICON_PATHS.total;
      return (
        '<svg class="summary-icon-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
        paths +
        "</svg>"
      );
    }

    function parseHealthFormFreeNote(text) {
      var parsed = {
        idNumber: "-",
        birthDate: "-",
        emergencyName: "-",
        emergencyPhone: "-",
        relation: "-",
        allergy: "-",
        medications: "-",
        currentInjuries: "-",
        pastFractures: "-",
        surgeries: "-",
        painZones: "-",
        heartIssues: "-",
        breathingDizziness: "-",
        signatureMode: "-",
        typedSignature: "-"
      };
      if (!text) return parsed;
      String(text).split("\n").forEach(function (line) {
        var idx = line.indexOf(":");
        if (idx === -1) return;
        var key = line.slice(0, idx).trim();
        var value = line.slice(idx + 1).trim() || "-";
        if (key === "ID") parsed.idNumber = value;
        else if (key === "Birth Date") parsed.birthDate = value;
        else if (key === "Emergency") {
          var parts = value.split("/").map(function (v) { return v.trim(); });
          parsed.emergencyName = parts[0] || "-";
          parsed.emergencyPhone = parts[1] || "-";
          parsed.relation = parts[2] || "-";
        } else if (key === "Allergy") parsed.allergy = value;
        else if (key === "Medications") parsed.medications = value;
        else if (key === "Current Injuries") parsed.currentInjuries = value;
        else if (key === "Past Fractures") parsed.pastFractures = value;
        else if (key === "Surgeries") parsed.surgeries = value;
        else if (key === "Pain Zones") parsed.painZones = value;
        else if (key === "Heart Issues") parsed.heartIssues = value;
        else if (key === "Breathing / Dizziness") parsed.breathingDizziness = value;
        else if (key === "Signature Mode") parsed.signatureMode = value;
        else if (key === "Typed Signature") parsed.typedSignature = value;
      });
      return parsed;
    }

    function parseIceBathFreeNote(text) {
      var parsed = {
        birthDate: "-",
        emergencyContact: "-",
        formDate: "-",
        declarationConfirmed: "-",
        signatureMode: "-",
        typedSignature: "-",
        // legacy keys (older submissions)
        idNumber: "-",
        emergencyName: "-",
        emergencyPhone: "-",
        relation: "-",
        heartBp: "-",
        circulation: "-",
        pregnancy: "-",
        epilepsy: "-",
        breathing: "-",
        allergy: "-",
        medications: "-",
        otherConditions: "-",
        screening: []
      };
      if (!text) return parsed;
      String(text).split("\n").forEach(function (line) {
        var idx = line.indexOf(":");
        if (idx === -1) return;
        var key = line.slice(0, idx).trim();
        var value = line.slice(idx + 1).trim() || "-";
        if (key === "Birth Date") parsed.birthDate = value;
        else if (key === "Emergency Contact") parsed.emergencyContact = value;
        else if (key === "Form Date") parsed.formDate = value;
        else if (key === "Declaration Confirmed") parsed.declarationConfirmed = value;
        else if (key === "Signature Mode") parsed.signatureMode = value;
        else if (key === "Typed Signature") parsed.typedSignature = value;
        else if (/^Q\d+/.test(key)) parsed.screening.push([key, value]);
        else if (key === "ID") parsed.idNumber = value;
        else if (key === "Emergency") {
          var parts = value.split("/").map(function (v) { return v.trim(); });
          parsed.emergencyName = parts[0] || "-";
          parsed.emergencyPhone = parts[1] || "-";
          parsed.relation = parts[2] || "-";
          if (parsed.emergencyContact === "-") {
            parsed.emergencyContact = parts.filter(Boolean).join(" / ") || "-";
          }
        } else if (key === "Heart / BP") parsed.heartBp = value;
        else if (key === "Circulation / Raynaud") parsed.circulation = value;
        else if (key === "Pregnancy") parsed.pregnancy = value;
        else if (key === "Epilepsy / Seizures") parsed.epilepsy = value;
        else if (key === "Breathing issues") parsed.breathing = value;
        else if (key === "Allergy") parsed.allergy = value;
        else if (key === "Medications") parsed.medications = value;
        else if (key === "Other conditions") parsed.otherConditions = value;
      });
      return parsed;
    }

    function applyFilter(data) {
      if (state.filter === "all") return data;
      return data.filter(function (item) {
        return item.status === state.filter;
      });
    }

    function invalidateCache() {
      cache.rows = null;
      cache.loading = null;
    }

    async function fetchAllRequestsFromSupabase() {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_TABLE) {
        return [];
      }
      var url =
        SUPABASE_URL +
        "/rest/v1/" +
        encodeURIComponent(SUPABASE_TABLE) +
        "?select=*&order=submittedAt.desc.nullslast,createdAt.desc.nullslast";

      var res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: "Bearer " + SUPABASE_ANON_KEY
        }
      });
      if (!res.ok) throw new Error("Failed loading Supabase data");
      var list = await res.json();
      return (Array.isArray(list) ? list : []).map(normalizeRequest);
    }

    async function getCachedRequests(forceRefresh) {
      if (!forceRefresh && cache.rows) return cache.rows;
      if (!forceRefresh && cache.loading) return cache.loading;

      cache.loading = fetchAllRequestsFromSupabase()
        .then(function (rows) {
          var allLegacy = [];
          CATEGORIES.forEach(function (cat) {
            if (cat.legacyKey) {
              var items = readLegacyRequests(cat.legacyKey).map(normalizeRequest);
              allLegacy = allLegacy.concat(items);
            }
          });
          var existingIds = {};
          rows.forEach(function (r) { if (r.id) existingIds[r.id] = true; });
          allLegacy.forEach(function (leg) {
            if (!existingIds[leg.id]) {
              rows.push(leg);
            }
          });
          cache.rows = rows;
          cache.loading = null;
          return cache.rows;
        })
        .catch(function (err) {
          cache.loading = null;
          throw err;
        });

      return cache.loading;
    }

    async function updateStatusInSupabase(item, nextStatus) {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_TABLE) return false;
      var url =
        SUPABASE_URL +
        "/rest/v1/" +
        encodeURIComponent(SUPABASE_TABLE) +
        "?id=eq." +
        encodeURIComponent(item.id);
      var res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: "Bearer " + SUPABASE_ANON_KEY,
          Prefer: "return=minimal"
        },
        body: JSON.stringify({ status: nextStatus })
      });
      return res.ok;
    }

    async function deleteInSupabase(item) {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_TABLE) return false;
      var url =
        SUPABASE_URL +
        "/rest/v1/" +
        encodeURIComponent(SUPABASE_TABLE) +
        "?id=eq." +
        encodeURIComponent(item.id);
      var res = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: "Bearer " + SUPABASE_ANON_KEY,
          Prefer: "return=minimal"
        }
      });
      return res.ok;
    }

    function filterByCategory(allRows, categoryId) {
      var cat = getCategory(categoryId);
      if (!cat || !cat.sources) return allRows.slice();
      return allRows.filter(function (row) {
        return cat.sources.indexOf(String(row.source || "")) !== -1;
      });
    }

    async function fetchSectionData(section) {
      var all = await getCachedRequests(false);
      return filterByCategory(all, section);
    }

    function buildCategoryStats(allRows) {
      return CATEGORIES.map(function (cat) {
        var rows = filterByCategory(allRows, cat.id);
        var pending = 0;
        var completed = 0;
        rows.forEach(function (row) {
          if (row.status === "completed") completed += 1;
          else pending += 1;
        });
        var series = buildSparklineSeries(rows, TREND_DAYS);
        return {
          cat: cat,
          total: rows.length,
          pending: pending,
          completed: completed,
          series: series,
          trendLabel: weekTrendLabel(series)
        };
      });
    }

    function sidebarCategories() {
      return CATEGORIES.filter(function (cat) {
        return cat.inSidebar;
      });
    }

    function buildSidebar() {
      if (!sidebarNav) return;
      sidebarNav.innerHTML = "";
      sidebarCategories().forEach(function (cat) {
        var btn = document.createElement("button");
        btn.className = "nav-link";
        btn.type = "button";
        btn.dataset.section = cat.id;
        btn.setAttribute("aria-current", "false");

        var label = document.createElement("span");
        label.className = "nav-link-label";
        label.textContent = cat.label;

        var badge = document.createElement("span");
        badge.className = "nav-badge nav-badge--empty";
        badge.dataset.badgeFor = cat.id;
        badge.hidden = true;
        badge.setAttribute("aria-hidden", "true");

        btn.appendChild(label);
        btn.appendChild(badge);
        btn.addEventListener("click", function () {
          selectSection(cat.id);
          if (mobileSidebarQuery.matches) closeSidebarMenu();
        });
        sidebarNav.appendChild(btn);
      });
      syncSidebar(null);
    }

    /** Active state + pending badges from cached rows. Driven by CATEGORIES / state.section. */
    function syncSidebar(allRows) {
      if (!sidebarNav) return;

      var pendingById = {};
      if (allRows) {
        buildCategoryStats(allRows).forEach(function (stat) {
          pendingById[stat.cat.id] = stat.pending;
        });
      }

      Array.prototype.slice.call(sidebarNav.querySelectorAll(".nav-link")).forEach(function (btn) {
        var sectionId = btn.dataset.section;
        var isActive = sectionId === state.section;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-current", isActive ? "page" : "false");

        var badge = btn.querySelector(".nav-badge");
        if (!badge) return;

        var pending = pendingById[sectionId];
        if (typeof pending !== "number") return;

        badge.textContent = String(pending);
        badge.setAttribute("aria-label", pending + " pending");
        if (pending > 0) {
          badge.hidden = false;
          badge.classList.remove("nav-badge--empty");
          badge.setAttribute("aria-hidden", "false");
        } else {
          badge.hidden = true;
          badge.classList.add("nav-badge--empty");
          badge.setAttribute("aria-hidden", "true");
        }
      });
    }

    function selectSection(sectionId) {
      state.section = sectionId;
      render();
      if (requestsPanel && typeof requestsPanel.scrollIntoView === "function") {
        requestsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    function renderSummary(allRows) {
      if (!summaryGrid) return;
      var stats = buildCategoryStats(allRows);
      summaryGrid.innerHTML = "";

      stats.forEach(function (stat) {
        var cat = stat.cat;
        var card = document.createElement("button");
        card.type = "button";
        card.className =
          "summary-card" +
          (cat.isHero ? " summary-card--hero" : "") +
          (state.section === cat.id ? " is-active" : "");
        card.dataset.section = cat.id;
        card.setAttribute(
          "aria-label",
          cat.label +
            ": " +
            stat.total +
            " requests, " +
            stat.pending +
            " pending, " +
            stat.completed +
            " completed. " +
            stat.trendLabel
        );

        card.innerHTML =
          '<div class="summary-card-top">' +
          '<span class="summary-icon" aria-hidden="true">' +
          iconSvg(cat.icon) +
          "</span>" +
          '<span class="summary-trend">' +
          escapeHtml(stat.trendLabel) +
          "</span>" +
          "</div>" +
          '<p class="summary-label">' +
          escapeHtml(cat.label) +
          "</p>" +
          '<strong class="summary-count">' +
          escapeHtml(String(stat.total)) +
          "</strong>" +
          '<div class="summary-card-foot">' +
          '<p class="summary-breakdown">' +
          '<span class="summary-breakdown-pending">' +
          escapeHtml(String(stat.pending)) +
          " pending</span>" +
          '<span class="summary-breakdown-sep" aria-hidden="true"> · </span>' +
          '<span class="summary-breakdown-completed">' +
          escapeHtml(String(stat.completed)) +
          " completed</span>" +
          "</p>" +
          sparklineSvg(stat.series) +
          "</div>";

        card.addEventListener("click", function () {
          selectSection(cat.id);
        });

        summaryGrid.appendChild(card);
      });
    }

    function openModal(item) {
      if (!requestModal || !modalBody) return;
      var retreat = normalizeRequest(item);
      var fields;
      if (retreat.source === "mountain-voice-registration") {
        var extra = parseHealthFormFreeNote(retreat.freeNote);
        fields = [
          ["Full Name", retreat.fullName],
          ["Request Type", retreat.retreatType],
          ["Phone", retreat.phone],
          ["ID Number", extra.idNumber],
          ["Birth Date", extra.birthDate],
          ["Submitted At", retreat.date],
          ["Emergency Contact Name", extra.emergencyName],
          ["Emergency Contact Phone", extra.emergencyPhone],
          ["Emergency Relationship", extra.relation],
          ["Do you have chronic conditions?", retreat.healthStatus || "-"],
          ["If yes, details", retreat.healthDetails || "-"],
          ["Physical Activity Level", retreat.yogaExperience || "-"],
          ["Allergy", extra.allergy],
          ["Current Medications", extra.medications],
          ["Current Injuries", extra.currentInjuries],
          ["Previous Fractures", extra.pastFractures],
          ["Surgeries", extra.surgeries],
          ["Back / Neck / Knee Pain", extra.painZones],
          ["Heart Issues", extra.heartIssues],
          ["Breathing Issues / Dizziness", extra.breathingDizziness],
          ["Additional Notes", retreat.reason || "-"],
          ["Signature Method", extra.signatureMode],
          ["Typed Signature", extra.typedSignature],
          ["Status", statusLabel(retreat.status)]
        ];
      } else if (retreat.source === "ice-bath-registration") {
        fields = [
          ["Full Name", retreat.fullName],
          ["Request Type", retreat.retreatType || "Ice Bath Day Retreat"],
          ["Phone", retreat.phone],
          ["Notes", retreat.reason || "-"],
          ["Submitted At", retreat.date],
          ["Status", statusLabel(retreat.status)]
        ];
      } else if (retreat.source === "ice-bath-health") {
        var ice = parseIceBathFreeNote(retreat.freeNote);
        fields = [
          ["Full Name", retreat.fullName],
          ["Request Type", retreat.retreatType],
          ["Phone", retreat.phone],
          ["Birth Date", ice.birthDate],
          ["Emergency Contact", ice.emergencyContact],
          ["Form Date", ice.formDate],
          ["Declaration Confirmed", ice.declarationConfirmed],
          ["Submitted At", retreat.date]
        ];
        if (ice.screening.length) {
          ice.screening.forEach(function (pair) {
            fields.push(pair);
          });
        } else {
          fields = fields.concat([
            ["ID Number", ice.idNumber],
            ["Emergency Contact Name", ice.emergencyName],
            ["Emergency Contact Phone", ice.emergencyPhone],
            ["Emergency Relationship", ice.relation],
            ["Heart / Blood Pressure Issues", ice.heartBp],
            ["Circulation / Raynaud", ice.circulation],
            ["Pregnancy", ice.pregnancy],
            ["Epilepsy / Seizures", ice.epilepsy],
            ["Breathing Issues", ice.breathing],
            ["Allergy", ice.allergy],
            ["Medications", ice.medications],
            ["Other Conditions", ice.otherConditions !== "-" ? ice.otherConditions : (retreat.healthDetails || "-")]
          ]);
        }
        fields = fields.concat([
          ["Signature Method", ice.signatureMode],
          ["Typed Signature", ice.typedSignature],
          ["Status", statusLabel(retreat.status)]
        ]);
      } else if (retreat.source === "zanzibar-retreat-reserve" || retreat.source === "dahab-retreat-reserve") {
        fields = [
          ["Full Name", retreat.fullName],
          ["Request Type", retreat.retreatType || "Retreat"],
          ["Phone", retreat.phone],
          ["Notes", retreat.reason || retreat.freeNote || "-"],
          ["Submitted At", retreat.date],
          ["Status", statusLabel(retreat.status)]
        ];
      } else if (String(retreat.source || "").startsWith("feedback-") || sectionSources("feedback").indexOf(String(retreat.source || "")) !== -1) {
        fields = [
          ["اسم المشاركة / Full Name", retreat.fullName],
          ["نوع الفعالية أو الريتريت", retreat.retreatType || "Feedback Response"],
          ["رقم الهاتف", retreat.phone || "-"],
          ["تاريخ الإرسال", formatDisplayDate(retreat.date)],
          ["تفاصيل التقييم والإجابات", retreat.freeNote || "-"],
          ["الحالة", statusLabel(retreat.status)]
        ];
      } else if (sectionSources("yoga").indexOf(String(retreat.source || "")) !== -1) {
        fields = [
          ["Full Name", retreat.fullName],
          ["Request Type", retreat.retreatType || "Yoga Class"],
          ["Phone", retreat.phone],
          ["City", retreat.city || "Haifa"],
          ["Submitted At", retreat.date],
          ["Status", statusLabel(retreat.status)]
        ];
        if (retreat.freeNote && retreat.freeNote !== "Registration from Haifa page") {
          fields.push(["Additional Note", retreat.freeNote]);
        }
      } else {
        fields = [
          ["Full Name", retreat.fullName],
          ["Request Type", retreat.retreatType],
          ["Phone", retreat.phone],
          ["Age", retreat.age],
          ["City", retreat.city],
          ["Submitted At", retreat.date],
          ["Reason", retreat.reason],
          ["Expectation", retreat.expectation],
          ["Yoga Experience", retreat.yogaExperience],
          ["Health Status", retreat.healthStatus],
          ["Health Details", retreat.healthDetails],
          ["Activities", retreat.activities.join(", ") || "-"],
          ["Additional Note", retreat.freeNote],
          ["Status", statusLabel(retreat.status)]
        ];
      }

      modalBody.innerHTML = "";
      fields.forEach(function (pair) {
        var row = document.createElement("div");
        row.className = "modal-item";
        row.innerHTML = "<strong>" + escapeHtml(pair[0]) + ":</strong> " + escapeHtml(pair[1] || "-");
        modalBody.appendChild(row);
      });
      requestModal.hidden = false;
      requestModal.style.display = "grid";
    }

    function closeModal() {
      if (!requestModal) return;
      requestModal.hidden = true;
      requestModal.style.display = "none";
    }

    function createRequestCard(item) {
      var request = normalizeRequest(item);
      var isCompleted = request.status === "completed";

      var card = document.createElement("article");
      card.className = "request-card";

      var top = document.createElement("div");
      top.className = "request-top";

      var name = document.createElement("div");
      name.className = "request-name";
      name.textContent = request.fullName;

      var status = document.createElement("span");
      status.className = "status-pill " + (isCompleted ? "status-completed" : "status-pending");
      status.textContent = statusLabel(request.status);

      top.appendChild(name);
      top.appendChild(status);

      var meta = document.createElement("div");
      meta.className = "request-meta";

      var typeLine = document.createElement("div");
      typeLine.textContent = request.retreatType || "Request";

      var phoneLine = document.createElement("div");
      phoneLine.textContent = "Phone: " + (request.phone || "-");

      var dateLine = document.createElement("div");
      dateLine.textContent = "Submitted: " + formatDisplayDate(request.date);

      meta.appendChild(typeLine);
      meta.appendChild(phoneLine);
      meta.appendChild(dateLine);

      var actions = document.createElement("div");
      actions.className = "request-actions";

      var detailsBtn = document.createElement("button");
      detailsBtn.className = "action-btn";
      detailsBtn.type = "button";
      detailsBtn.textContent = "View Full Answers";
      detailsBtn.addEventListener("click", function () {
        openModal(request);
      });

      var completeBtn = document.createElement("button");
      completeBtn.className = "action-btn complete";
      completeBtn.type = "button";
      completeBtn.textContent = isCompleted ? "Mark Pending" : "Mark Completed";
      completeBtn.addEventListener("click", async function () {
        var nextStatus = isCompleted ? "pending" : "completed";
        var ok = await updateStatusInSupabase(request, nextStatus);
        if (ok) {
          invalidateCache();
          render(true);
        }
      });

      var deleteBtn = document.createElement("button");
      deleteBtn.className = "action-btn delete";
      deleteBtn.type = "button";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async function () {
        var ok = await deleteInSupabase(request);
        if (ok) {
          invalidateCache();
          render(true);
        }
      });

      actions.appendChild(detailsBtn);
      actions.appendChild(completeBtn);
      actions.appendChild(deleteBtn);

      card.appendChild(top);
      card.appendChild(meta);
      card.appendChild(actions);
      return card;
    }

    async function render(forceRefresh) {
      var title = sectionLabel(state.section);
      if (state.section === "all") title = "All Requests";
      sectionTitle.textContent = title;
      updateMobileSectionLabel(title);

      filterButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.filter === state.filter);
      });

      try {
        var allRows = await getCachedRequests(!!forceRefresh);
        renderSummary(allRows);
        syncSidebar(allRows);

        requestsContainer.innerHTML = "";
        var currentData = filterByCategory(allRows, state.section);
        var filtered = applyFilter(currentData);

        if (!filtered.length) {
          emptyState.hidden = false;
        } else {
          emptyState.hidden = true;
          filtered.forEach(function (item) {
            requestsContainer.appendChild(createRequestCard(item));
          });
        }
      } catch (_err) {
        renderSummary([]);
        syncSidebar([]);
        requestsContainer.innerHTML = "";
        emptyState.hidden = false;
      }
    }

    buildSidebar();

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.filter = btn.dataset.filter;
        render(false);
      });
    });

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        clearSession();
        window.location.href = "index.html";
      });
    }
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeModal);
    }
    if (sidebarMenuToggle) {
      sidebarMenuToggle.addEventListener("click", function () {
        if (sidebar && sidebar.classList.contains("is-open")) closeSidebarMenu();
        else openSidebarMenu();
      });
    }
    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener("click", closeSidebarMenu);
    }
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener("click", closeSidebarMenu);
    }
    if (refreshBtn) {
      refreshBtn.addEventListener("click", async function () {
        refreshBtn.classList.add("is-busy");
        refreshBtn.setAttribute("aria-busy", "true");
        try {
          await render(true);
        } finally {
          refreshBtn.classList.remove("is-busy");
          refreshBtn.removeAttribute("aria-busy");
        }
      });
    }
    if (requestModal) {
      requestModal.addEventListener("click", function (e) {
        if (e.target === requestModal) closeModal();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModal();
        closeSidebarMenu();
      }
    });
    mobileSidebarQuery.addEventListener("change", function (e) {
      if (!e.matches) closeSidebarMenu();
    });
    window.addEventListener("scroll", updateTopbarScrollState, { passive: true });
    updateTopbarScrollState();

    render(true);
  }

  var page = getPage();
  if (page === "dashboard") initDashboard();
  else initLogin();
})();
