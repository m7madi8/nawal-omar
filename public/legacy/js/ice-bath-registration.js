/**
 * Ice Bath day-retreat booking → Supabase → admin dashboard
 */
(function () {
  var EVENT_ID = "ice-bath";

  function t(key) {
    var lang = (window.nawalI18n && window.nawalI18n.getLang && window.nawalI18n.getLang()) || "ar";
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
      if (window.nawalThankYou && typeof window.nawalThankYou.show === "function") {
        window.nawalThankYou.show();
        return;
      }
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
        var submitApi =
          (window.nawalRetreatRequest && window.nawalRetreatRequest.submitEventRegistration) ||
          (window.nawalCommerceRegistration && window.nawalCommerceRegistration.submitEventRegistration);
        if (!submitApi) {
          throw new Error("Registration unavailable");
        }
        await submitApi({
          eventId: EVENT_ID,
          fullName: fullName,
          phone: phone,
          notes: notes
        });
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
