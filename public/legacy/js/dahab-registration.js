/**
 * Dahab retreat booking → Supabase → admin dashboard
 */
(function () {
  function t(key) {
    var lang = (window.nawalI18n && window.nawalI18n.getLang && window.nawalI18n.getLang()) || "ar";
    if (window.nawalI18n && window.nawalI18n.t) return window.nawalI18n.t(lang, key);
    return key;
  }

  function init() {
    var modal = document.getElementById("dahab-book-modal");
    var openBtn = document.getElementById("dahab-book-btn");
    var closeBtn = document.getElementById("dahab-book-close");
    var form = document.getElementById("dahab-book-form");
    var successBox = document.getElementById("dahab-book-success");
    var scrollTriggers = document.querySelectorAll("[data-dahab-book-open], .dahab-scroll-book");
    if (!modal || !closeBtn || !form) return;

    function openModal() {
      if (openBtn && openBtn.disabled) return;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      var nameInput = form.querySelector('[name="fullName"]');
      if (nameInput) nameInput.focus();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }

    async function submitBooking(fullName, phone) {
      if (!window.nawalRetreatRequest) {
        throw new Error("Registration unavailable");
      }
      return window.nawalRetreatRequest.submit(
        window.nawalRetreatRequest.buildPayload({
          idPrefix: "req-dahab",
          source: "dahab-retreat-reserve",
          retreatType: "Dahab Retreat 2026",
          fullName: fullName,
          phone: phone,
          reason: "Dahab retreat booking request",
          freeNote: "Booking from retreats/dahab"
        })
      );
    }

    scrollTriggers.forEach(function (el) {
      el.addEventListener("click", function (e) {
        if (el.tagName === "A" && el.getAttribute("href") === "#dahab-booking") {
          e.preventDefault();
          var target = document.getElementById("dahab-booking");
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (el.id === "dahab-book-btn" || el.hasAttribute("data-dahab-book-open")) {
          e.preventDefault();
          openModal();
        }
      });
    });

    if (openBtn && !openBtn.disabled) {
      openBtn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
    }

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
      if (!fullName || !phone) return;

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      try {
        await submitBooking(fullName, phone);
        form.reset();
        closeModal();
        if (window.nawalThankYou && typeof window.nawalThankYou.show === "function") {
          window.nawalThankYou.show({ name: fullName });
        }
        if (successBox) {
          successBox.hidden = false;
        }
      } catch (_err) {
        console.error(_err);
        alert(t("retreat_form_error") || "Sorry, registration failed. Please try again.");
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
