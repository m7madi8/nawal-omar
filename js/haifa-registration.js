(function () {
  var SUPABASE_URL = "https://xzxyskufrqansbhsbdkt.supabase.co";
  var SUPABASE_ANON_KEY = "sb_publishable_V9_4QWGDFv6Vm-4DQifYGA_1xdoKkph";
  var SUPABASE_TABLE = "retreat_requests";

  var packageLabelKeys = {
    trial: "haifa_pkg_trial",
    pack4: "haifa_pkg_pack4",
    single: "haifa_pkg_single",
    private1: "haifa_pkg_private1",
    private2: "haifa_pkg_private2",
    gift: "haifa_pkg_gift"
  };

  function t(key) {
    var lang = (window.nawalI18n && window.nawalI18n.getLang && window.nawalI18n.getLang()) || "en";
    if (window.nawalI18n && window.nawalI18n.t) return window.nawalI18n.t(lang, key);
    return key;
  }

  function init() {
    var modal = document.getElementById("haifa-register-modal");
    var closeBtn = document.getElementById("haifa-register-close");
    var selectedEl = document.getElementById("haifa-register-selected");
    var form = document.getElementById("haifa-register-form");
    var success = document.getElementById("haifa-register-success");
    var triggers = document.querySelectorAll("[data-register-btn]");
    if (!modal || !closeBtn || !selectedEl || !form || !triggers.length) return;

    var selectedPackageKey = "trial";

    function openModal(pkgKey) {
      selectedPackageKey = pkgKey || "trial";
      selectedEl.textContent = t(packageLabelKeys[selectedPackageKey] || packageLabelKeys.trial);
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }

    function showSuccess() {
      success.hidden = false;
      success.classList.remove("is-show");
      window.requestAnimationFrame(function () {
        success.classList.add("is-show");
      });
      window.setTimeout(function () {
        success.classList.remove("is-show");
        success.hidden = true;
      }, 3500);
    }

    async function submitRegistration(fullName, phone) {
      var now = new Date();
      var payload = {
        id: "req-haifa-" + now.getTime(),
        source: "yoga-class-registration",
        retreatType: t(packageLabelKeys[selectedPackageKey] || packageLabelKeys.trial),
        submittedAt: now.toISOString(),
        fullName: fullName,
        phone: phone,
        age: "",
        city: "Haifa",
        reason: "Haifa yoga class registration",
        expectation: "",
        yogaExperience: "",
        healthStatus: "",
        healthDetails: "",
        activities: [],
        freeNote: "Registration from Haifa page",
        status: "pending",
        createdAt: now.toISOString()
      };

      var url = SUPABASE_URL + "/rest/v1/" + encodeURIComponent(SUPABASE_TABLE);
      var res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": "Bearer " + SUPABASE_ANON_KEY,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Registration submit failed");
    }

    triggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        openModal(btn.getAttribute("data-package-key") || "trial");
      });
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var fullName = String(form.fullName.value || "").trim();
      var phone = String(form.phone.value || "").trim();
      if (!fullName || !phone) return;
      try {
        await submitRegistration(fullName, phone);
        form.reset();
        closeModal();
        showSuccess();
      } catch (_err) {
        console.error(_err);
        alert(t("haifa_register_error"));
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
