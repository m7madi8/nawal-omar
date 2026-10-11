/**
 * Ice Bath day-retreat booking — commerce checkout + admin dashboard
 */
(function () {
  function init() {
    if (!window.nawalEventCheckout) return;
    window.nawalEventCheckout.boot({
      eventId: "ice-bath",
      modalId: "ib-register-modal",
      closeId: "ib-register-close",
      formId: "ib-register-form",
      successId: "ib-register-success",
      submitBtnId: "ib-register-submit",
      triggerSelector: "[data-ib-register]",
      paymentSectionId: "ib-payment-section",
      actionsSelector: ".ib-cta__actions, .ib-hero__actions",
      payButtonId: "ib-panel-pay-btn",
      payButtonClass: "ib-cta__btn ny-book-btn-primary event-pay-panel-btn",
      returnPath: "/events/ice-bath",
      retreatTypeKey: "events_ib_register_event",
      city: "Hofit",
      errorKey: "events_ib_register_error",
      successMessageKey: "events_ib_register_success",
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
