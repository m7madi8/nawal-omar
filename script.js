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
      window.location.href = "admin.html";
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

    var sectionTitle = document.getElementById("sectionTitle");
    var requestsContainer = document.getElementById("requestsContainer");
    var emptyState = document.getElementById("emptyState");
    var totalCount = document.getElementById("totalCount");
    var formCount = document.getElementById("formCount");
    var retreatsCount = document.getElementById("retreatsCount");
    var yogaCount = document.getElementById("yogaCount");
    var requestModal = document.getElementById("requestModal");
    var modalBody = document.getElementById("modalBody");
    var modalCloseBtn = document.getElementById("modalCloseBtn");

    var navButtons = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
    var logoutBtn = document.getElementById("logoutBtn");

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

    function sectionSources(section) {
      if (section === "form") return ["mountain-voice-registration"];
      if (section === "retreats") return ["wadi-rum-registration", "zanzibar-retreat-reserve"];
      if (section === "yoga") return ["yoga-class-registration", "yoga-class-request"];
      return [];
    }

    function sectionLabel(section) {
      if (section === "form") return "Health Form Requests";
      if (section === "retreats") return "Retreat Requests";
      if (section === "yoga") return "Yoga Classes Requests";
      return "Requests";
    }

    function statusLabel(status) {
      return status === "completed" ? "Completed" : "Pending";
    }

    function applyFilter(data) {
      if (state.filter === "all") return data;
      return data.filter(function (item) {
        return item.status === state.filter;
      });
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
          "Accept": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": "Bearer " + SUPABASE_ANON_KEY
        }
      });
      if (!res.ok) throw new Error("Failed loading Supabase data");
      var list = await res.json();
      return (Array.isArray(list) ? list : []).map(normalizeRequest);
    }

    async function updateStatusInSupabase(item, nextStatus) {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_TABLE) return false;
      var url = SUPABASE_URL + "/rest/v1/" + encodeURIComponent(SUPABASE_TABLE) + "?id=eq." + encodeURIComponent(item.id);
      var res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": "Bearer " + SUPABASE_ANON_KEY,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({ status: nextStatus })
      });
      return res.ok;
    }

    async function deleteInSupabase(item) {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_TABLE) return false;
      var url = SUPABASE_URL + "/rest/v1/" + encodeURIComponent(SUPABASE_TABLE) + "?id=eq." + encodeURIComponent(item.id);
      var res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": "Bearer " + SUPABASE_ANON_KEY,
          "Prefer": "return=minimal"
        }
      });
      return res.ok;
    }

    async function fetchSectionData(section) {
      if (section === "yoga") {
        var allYoga = await fetchAllRequestsFromSupabase();
        var yogaFromSupabase = allYoga.filter(function (row) {
          return sectionSources("yoga").indexOf(String(row.source || "")) !== -1;
        });
        if (yogaFromSupabase.length) return yogaFromSupabase;
        return readLegacyRequests(LEGACY_CLASS_KEY).map(normalizeRequest);
      }
      var all = await fetchAllRequestsFromSupabase();
      var sources = sectionSources(section);
      return all.filter(function (row) {
        return sources.indexOf(String(row.source || "")) !== -1;
      });
    }

    async function fetchSummaryCounts() {
      var all = await fetchAllRequestsFromSupabase();
      var form = all.filter(function (row) { return row.source === "mountain-voice-registration"; }).length;
      var retreats = all.filter(function (row) { return row.source === "wadi-rum-registration" || row.source === "zanzibar-retreat-reserve"; }).length;
      var yoga = all.filter(function (row) { return sectionSources("yoga").indexOf(String(row.source || "")) !== -1; }).length;
      if (!yoga) {
        yoga = readLegacyRequests(LEGACY_CLASS_KEY).length;
      }
      return { all: all.length + (yoga && all.filter(function (row) { return sectionSources("yoga").indexOf(String(row.source || "")) !== -1; }).length ? 0 : yoga), form: form, retreats: retreats, yoga: yoga };
    }

    async function renderSummary() {
      try {
        var counts = await fetchSummaryCounts();
        totalCount.textContent = String(counts.all);
        if (formCount) formCount.textContent = String(counts.form);
        if (retreatsCount) retreatsCount.textContent = String(counts.retreats);
        if (yogaCount) yogaCount.textContent = String(counts.yoga);
      } catch (_err) {
        totalCount.textContent = "0";
        if (formCount) formCount.textContent = "0";
        if (retreatsCount) retreatsCount.textContent = "0";
        if (yogaCount) yogaCount.textContent = "0";
      }
    }

    function openModal(item) {
      if (!requestModal || !modalBody) return;
      var retreat = normalizeRequest(item);
      var fields = [
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

      modalBody.innerHTML = "";
      fields.forEach(function (pair) {
        var row = document.createElement("div");
        row.className = "modal-item";
        row.innerHTML = "<strong>" + pair[0] + ":</strong> " + (pair[1] || "-");
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
      var row = document.createElement("article");
      row.className = "retreat-row";

      var name = document.createElement("div");
      name.className = "retreat-row-name";
      name.textContent = request.fullName;

      var type = document.createElement("div");
      type.className = "retreat-row-type";
      type.textContent = request.retreatType;

      var detailsBtn = document.createElement("button");
      detailsBtn.className = "action-btn";
      detailsBtn.textContent = "View Full Answers";
      detailsBtn.addEventListener("click", function () {
        openModal(request);
      });

      var completeBtn = document.createElement("button");
      completeBtn.className = "action-btn complete";
      completeBtn.textContent = request.status === "completed" ? "Mark Pending" : "Mark Completed";
      completeBtn.addEventListener("click", async function () {
        var nextStatus = request.status === "completed" ? "pending" : "completed";
        await updateStatusInSupabase(request, nextStatus);
        render();
      });

      var deleteBtn = document.createElement("button");
      deleteBtn.className = "action-btn delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async function () {
        await deleteInSupabase(request);
        render();
      });

      row.appendChild(name);
      row.appendChild(type);
      row.appendChild(detailsBtn);
      row.appendChild(completeBtn);
      row.appendChild(deleteBtn);
      return row;
    }

    async function render() {
      var title = sectionLabel(state.section);
      sectionTitle.textContent = title;

      navButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.section === state.section);
      });
      filterButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.filter === state.filter);
      });

      requestsContainer.innerHTML = "";
      var currentData = await fetchSectionData(state.section);
      var filtered = applyFilter(currentData);
      if (!filtered.length) {
        emptyState.hidden = false;
      } else {
        emptyState.hidden = true;
        filtered.forEach(function (item) {
          requestsContainer.appendChild(createRequestCard(item));
        });
      }
      await renderSummary();
    }

    navButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.section = btn.dataset.section;
        render();
      });
    });

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.filter = btn.dataset.filter;
        render();
      });
    });

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        clearSession();
        window.location.href = "admin.html";
      });
    }
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeModal);
    }
    if (requestModal) {
      requestModal.addEventListener("click", function (e) {
        if (e.target === requestModal) closeModal();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
    render();
  }

  var page = getPage();
  if (page === "dashboard") initDashboard();
  else initLogin();
})();
