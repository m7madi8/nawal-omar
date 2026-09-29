/**
 * Ice Bath day-retreat booking → Supabase → admin dashboard
 */
(function () {
  var SUPABASE_URL = "https://xzxyskufrqansbhsbdkt.supabase.co";
  var SUPABASE_ANON_KEY = "sb_publishable_V9_4QWGDFv6Vm-4DQifYGA_1xdoKkph";
  var SUPABASE_TABLE = "retreat_requests";

  function t(key) {
    var lang = (window.nawalI18n && window.nawalI18n.getLang && window.nawalI18n.getLang()) || "en";
    if (window.nawalI18n && window.nawalI18n.t) return window.nawalI18n.t(lang, key);
    return key;
  }

  function init() {
    var modal = document.getElementById("ib-register-modal");
    var closeBtn = document.getElementById("ib-register-close");
    var form = document.getElementById("ib-register-form");
    var success = document.getElementById("ib-register-success");
    var submitBtn = document.getElementById("ib-register-submit");
    var triggers = document.querySelectorAll("[data-ib-register]");
    if (!modal || !closeBtn || !form || !triggers.length) return;

    function openModal() {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      var nameInput = form.querySelector('[name="fullName"]');
      if (nameInput) nameInput.focus();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }

    function showSuccess() {
      if (!success) return;
      success.hidden = false;
      success.classList.remove("is-show");
      window.requestAnimationFrame(function () {
        success.classList.add("is-show");
      });
      window.setTimeout(function () {
        success.classList.remove("is-show");
        success.hidden = true;
      }, 3800);
    }

    async function submitRegistration(fullName, phone, notes) {
      var now = new Date();
      var payload = {
        id: "req-ice-book-" + now.getTime(),
        source: "ice-bath-registration",
        retreatType: "Day Retreat | Between Calm & Strength",
        submittedAt: now.toISOString(),
        fullName: fullName,
        phone: phone,
        age: "",
        city: "",
        reason: notes || "Ice Bath day retreat booking",
        expectation: "",
        yogaExperience: "",
        healthStatus: "",
        healthDetails: "",
        activities: [],
        freeNote: "Booking from events/ice-bath.html",
        status: "pending",
        createdAt: now.toISOString()
      };

      var url = SUPABASE_URL + "/rest/v1/" + encodeURIComponent(SUPABASE_TABLE);
      var res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: "Bearer " + SUPABASE_ANON_KEY,
          Prefer: "return=minimal"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Ice Bath booking submit failed");
    }

    triggers.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
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
      var fullName = String((form.fullName && form.fullName.value) || "").trim();
      var phone = String((form.phone && form.phone.value) || "").trim();
      var notes = String((form.notes && form.notes.value) || "").trim();
      if (!fullName || !phone) return;

      if (submitBtn) submitBtn.disabled = true;
      try {
        await submitRegistration(fullName, phone, notes);
        form.reset();
        closeModal();
        showSuccess();
      } catch (_err) {
        console.error(_err);
        alert(t("events_ib_register_error"));
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
