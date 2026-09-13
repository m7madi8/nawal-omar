/**
 * Event registration alias — uses retreat-request-submit.js (direct Supabase).
 * Load /legacy/js/retreat-request-submit.js before this file.
 */
(function (global) {
  if (!global.nawalCommerceRegistration && global.nawalRetreatRequest) {
    global.nawalCommerceRegistration = {
      submitEventRegistration: global.nawalRetreatRequest.submitEventRegistration.bind(global.nawalRetreatRequest)
    };
  }
})(window);
