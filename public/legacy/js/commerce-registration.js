/**
 * Back-compat alias — requires retreat-request-submit.js loaded first.
 */
(function (global) {
  if (global.nawalRetreatRequest) {
    if (!global.nawalCommerceRegistration) {
      global.nawalCommerceRegistration = {
        submitEventRegistration: global.nawalRetreatRequest.submitEventRegistration.bind(
          global.nawalRetreatRequest,
        ),
      };
    }
    return;
  }
  console.error(
    '[nawalCommerceRegistration] Load /legacy/js/retreat-request-submit.js before commerce-registration.js',
  );
})(window);
