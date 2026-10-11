/**
 * Sound Healing booking — commerce checkout + admin dashboard
 */
(function () {
  function init() {
    if (!window.nawalEventCheckout) return;
    window.nawalEventCheckout.boot({
      eventId: "sound-healing",
      modalId: "sh-register-modal",
      closeId: "sh-register-close",
      formId: "sh-register-form",
      successId: "sh-register-success",
      submitBtnId: "sh-register-submit",
      triggerSelector: "[data-sh-register]",
      paymentSectionId: "sh-payment-section",
      actionsSelector: ".event-sh-actions",
      payButtonId: "sh-panel-pay-btn",
      payButtonClass: "event-sh-btn event-sh-btn--primary ny-book-btn-primary event-pay-panel-btn",
      returnPath: "/events/sound-healing",
      retreatTypeKey: "events_sh_register_event",
      city: "Haifa, Atlit",
      errorKey: "events_sh_register_error",
      successMessageKey: "events_sh_register_success",
      submitLabelKey: "events_sh_register_confirm",
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
