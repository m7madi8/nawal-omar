/**
 * Nature & Chocolate booking — commerce checkout + admin dashboard
 */
(function () {
  function init() {
    if (!window.nawalEventCheckout) return;
    window.nawalEventCheckout.boot({
      eventId: "nature-chocolate",
      modalId: "nc-register-modal",
      closeId: "nc-register-close",
      formId: "nc-register-form",
      successId: "nc-register-success",
      submitBtnId: "nc-register-submit",
      triggerSelector: "[data-nc-register]",
      paymentSectionId: "nc-payment-section",
      actionsSelector: ".nc-hero__panel, .nc-cta__inner",
      payButtonId: "nc-panel-pay-btn",
      payButtonClass: "nc-hero__cta ny-book-btn-primary event-pay-panel-btn",
      returnPath: "/events/nature-chocolate",
      retreatTypeKey: "events_nc_register_event",
      city: "Al-Bqeia",
      errorKey: "events_nc_register_error",
      successMessageKey: "events_nc_register_success",
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
