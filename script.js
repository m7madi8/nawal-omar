/* Yoga Admin Dashboard - Vanilla JS only */
(function () {
  var AUTH_KEY = "yogaAdminSession";
  var CLASS_KEY = "yogaClassRequests";
  var RETREAT_KEY = "retreatRequests";
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

  function readRequests(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (_err) {
      return [];
    }
  }

  function writeRequests(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
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

  function removeDummyRequests() {
    function cleanList(key) {
      var list = readRequests(key);
      var cleaned = list.filter(function (item) {
        if (!item || typeof item !== "object") return false;
        var id = String((item && item.id) || "");
        var name = String((item && (item.fullName || item["الاسم الكامل"])) || "").toLowerCase();
        var email = String((item && (item.email || item["البريد الإلكتروني"])) || "").toLowerCase();
        if (id === "class-1" || id === "class-2" || id === "retreat-1" || id === "retreat-2") return false;
        if (name === "sara khan" || name === "maya noor" || name === "lina said" || name === "diana hamad") return false;
        if (email.indexOf("@example.com") !== -1) return false;
        return true;
      });
      writeRequests(key, cleaned);
    }

    cleanList(CLASS_KEY);
    cleanList(RETREAT_KEY);
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

      error.textContent = "Invalid credentials. Use nawal / nawalll.";
    });
  }

  function initDashboard() {
    requireAuthForDashboard();
    removeDummyRequests();

    var state = {
      section: "classes",
      filter: "all"
    };

    var sectionTitle = document.getElementById("sectionTitle");
    var requestsContainer = document.getElementById("requestsContainer");
    var emptyState = document.getElementById("emptyState");
    var totalCount = document.getElementById("totalCount");
    var classesCount = document.getElementById("classesCount");
    var retreatsCount = document.getElementById("retreatsCount");
    var requestModal = document.getElementById("requestModal");
    var modalBody = document.getElementById("modalBody");
    var modalCloseBtn = document.getElementById("modalCloseBtn");

    var navButtons = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
    var logoutBtn = document.getElementById("logoutBtn");

    function normalizeRetreat(item) {
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

    async function fetchRetreatRequestsFromSupabase() {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_TABLE) {
        return readRequests(RETREAT_KEY);
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
      return (Array.isArray(list) ? list : []).map(normalizeRetreat);
    }

    async function updateRetreatStatusInSupabase(item, nextStatus) {
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

    async function deleteRetreatInSupabase(item) {
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

    async function getCurrentData() {
      if (state.section === "classes") return readRequests(CLASS_KEY);
      try {
        var retreats = await fetchRetreatRequestsFromSupabase();
        return retreats;
      } catch (_err) {
        return readRequests(RETREAT_KEY).map(normalizeRetreat);
      }
    }

    function getCurrentKey() {
      return state.section === "classes" ? CLASS_KEY : RETREAT_KEY;
    }

    function applyFilter(data) {
      if (state.filter === "all") return data;
      return data.filter(function (item) {
        return item.status === state.filter;
      });
    }

    async function renderSummary() {
      var classData = readRequests(CLASS_KEY);
      var retreatData = [];
      try {
        retreatData = await fetchRetreatRequestsFromSupabase();
      } catch (_err) {
        retreatData = readRequests(RETREAT_KEY).map(normalizeRetreat);
      }
      classesCount.textContent = String(classData.length);
      retreatsCount.textContent = String(retreatData.length);
      totalCount.textContent = String(classData.length + retreatData.length);
    }

    function statusLabel(status) {
      return status === "completed" ? "Completed" : "Pending";
    }

    function openModal(item) {
      if (!requestModal || !modalBody) return;
      var retreat = normalizeRetreat(item);
      var fields = [
        ["Full Name", retreat.fullName],
        ["Retreat Type", retreat.retreatType],
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
      if (state.section === "retreats") {
        var retreat = normalizeRetreat(item);
        var row = document.createElement("article");
        row.className = "retreat-row";

        var name = document.createElement("div");
        name.className = "retreat-row-name";
        name.textContent = retreat.fullName;

        var type = document.createElement("div");
        type.className = "retreat-row-type";
        type.textContent = retreat.retreatType;

        var detailsBtn = document.createElement("button");
        detailsBtn.className = "action-btn";
        detailsBtn.textContent = "View Full Answers";
        detailsBtn.addEventListener("click", function () {
          openModal(retreat);
        });

        var completeBtn = document.createElement("button");
        completeBtn.className = "action-btn complete";
        completeBtn.textContent = retreat.status === "completed" ? "Mark Pending" : "Mark Completed";
        completeBtn.addEventListener("click", async function () {
          var nextStatus = retreat.status === "completed" ? "pending" : "completed";
          var updatedRemote = await updateRetreatStatusInSupabase(retreat, nextStatus);
          if (!updatedRemote) {
            var fallback = readRequests(RETREAT_KEY).map(function (row) {
              if (row.id !== retreat.id) return row;
              row.status = nextStatus;
              return row;
            });
            writeRequests(RETREAT_KEY, fallback);
          }
          render();
        });

        var deleteBtn = document.createElement("button");
        deleteBtn.className = "action-btn delete";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", async function () {
          var deletedRemote = await deleteRetreatInSupabase(retreat);
          if (!deletedRemote) {
            var fallback = readRequests(RETREAT_KEY).filter(function (row) {
              return row.id !== retreat.id;
            });
            writeRequests(RETREAT_KEY, fallback);
          }
          render();
        });

        row.appendChild(name);
        row.appendChild(type);
        row.appendChild(detailsBtn);
        row.appendChild(completeBtn);
        row.appendChild(deleteBtn);
        return row;
      }

      var card = document.createElement("article");
      card.className = "request-card";

      var top = document.createElement("div");
      top.className = "request-top";
      top.innerHTML =
        '<div class="request-name">' +
        item.fullName +
        "</div>" +
        '<span class="status-pill ' +
        (item.status === "completed" ? "status-completed" : "status-pending") +
        '">' +
        statusLabel(item.status) +
        "</span>";

      var meta = document.createElement("div");
      meta.className = "request-meta";
      meta.innerHTML =
        "<div>Phone: " +
        item.phone +
        "</div>" +
        "<div>Email: " +
        item.email +
        "</div>" +
        "<div>Date: " +
        item.date +
        "</div>";

      var notes = document.createElement("div");
      notes.className = "request-notes";
      notes.textContent = item.notes || "-";

      var actions = document.createElement("div");
      actions.className = "request-actions";

      var completeBtn = document.createElement("button");
      completeBtn.className = "action-btn complete";
      completeBtn.textContent = item.status === "completed" ? "Mark Pending" : "Mark Completed";
      completeBtn.addEventListener("click", function () {
        var key = getCurrentKey();
        var data = readRequests(key);
        var updated = data.map(function (row) {
          if (row.id !== item.id) return row;
          return {
            id: row.id,
            fullName: row.fullName,
            phone: row.phone,
            email: row.email,
            date: row.date,
            notes: row.notes,
            status: row.status === "completed" ? "pending" : "completed"
          };
        });
        writeRequests(key, updated);
        render();
      });

      var deleteBtn = document.createElement("button");
      deleteBtn.className = "action-btn delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", function () {
        var key = getCurrentKey();
        var data = readRequests(key).filter(function (row) {
          return row.id !== item.id;
        });
        writeRequests(key, data);
        render();
      });

      actions.appendChild(completeBtn);
      actions.appendChild(deleteBtn);

      card.appendChild(top);
      card.appendChild(meta);
      card.appendChild(notes);
      card.appendChild(actions);
      return card;
    }

    async function render() {
      var title = state.section === "classes" ? "Yoga Classes Requests" : "Retreat Requests";
      sectionTitle.textContent = title;

      navButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.section === state.section);
      });
      filterButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.filter === state.filter);
      });

      requestsContainer.innerHTML = "";
      var currentData = await getCurrentData();
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
