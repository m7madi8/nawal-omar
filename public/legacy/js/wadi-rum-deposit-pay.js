(function () {
  var DEPOSIT_ILS = 400;
  var ITEM_ID = 'wadi-rum';
  var STORAGE_KEY = 'nawal.wadiRum.depositCustomer';

  var paymentState = {
    hypLive: false,
    loaded: false,
  };

  function t(key) {
    if (window.nawalI18n && typeof window.nawalI18n.t === 'function') {
      var text = window.nawalI18n.t(key);
      if (text) return text;
    }
    return key;
  }

  function normalizePhone(value) {
    var phone = String(value || '')
      .replace(/[\u0660-\u0669]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
      .replace(/[\u06F0-\u06F9]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); })
      .trim()
      .replace(/[\s\-().\/\u200e\u200f]/g, '');
    if (phone.indexOf('00') === 0) phone = '+' + phone.slice(2);
    return phone;
  }

  function readSessionCustomer() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_e) {
      return null;
    }
  }

  function setStatus(el, message, isError) {
    if (!el) return;
    el.textContent = message || '';
    el.hidden = !message;
    el.classList.toggle('is-error', !!isError);
  }

  function validateCustomer(customer) {
    if (!customer.fullName || customer.fullName.length < 2) {
      return t('retreat_wadi_deposit_err_name');
    }
    if (!customer.phone || customer.phone.replace(/\D/g, '').length < 8) {
      return t('retreat_wadi_deposit_err_phone');
    }
    return '';
  }

  function readCheckoutCustomer() {
    var stored = readSessionCustomer();
    var nameEl = document.getElementById('wrc-fullName');
    var phoneEl = document.getElementById('wrc-phone');
    var emailEl = document.getElementById('wrc-email');

    if (nameEl && phoneEl) {
      return {
        fullName: (nameEl.value || '').trim(),
        phone: normalizePhone(phoneEl.value),
        email: emailEl ? (emailEl.value || '').trim() : '',
        requestId: stored && stored.requestId ? stored.requestId : '',
      };
    }

    if (stored) {
      return {
        fullName: stored.fullName || '',
        phone: normalizePhone(stored.phone),
        email: stored.email || '',
        requestId: stored.requestId || '',
      };
    }
    return null;
  }

  function mapApiError(data, resOk) {
    var code = data && data.code ? data.code : '';
    if (code === 'HYP_DISABLED' || code === 'PAYMENT_NOT_CONFIGURED') {
      return t('retreat_wadi_checkout_hyp_off');
    }
    if (code === 'COMMERCE_DB_NOT_READY' || code === 'COMMERCE_DB_SCHEMA') {
      return t('retreat_wadi_checkout_db_setup');
    }
    if (code === 'COMMERCE_DB_NETWORK') {
      return t('retreat_wadi_checkout_network_error');
    }
    if (code === 'HYP_NETWORK' || code === 'HYP_SIGN_FAILED') {
      return t('retreat_wadi_checkout_gateway_error');
    }
    if (data && data.error) return data.error;
    if (!resOk) return t('retreat_wadi_deposit_error_generic');
    return t('retreat_wadi_deposit_error_generic');
  }

  function cardCheckoutAvailable() {
    return paymentState.loaded && paymentState.hypLive;
  }

  async function loadPaymentOptions() {
    if (paymentState.loaded) return paymentState;
    try {
      var res = await fetch('/api/commerce/payment-options', {
        headers: { Accept: 'application/json' },
      });
      var data = await res.json().catch(function () { return {}; });
      paymentState.hypLive = !!data.hypLive;
    } catch (_e) {
      paymentState.hypLive = false;
    }
    paymentState.loaded = true;
    refreshRegistrationSubmitLabel();
    return paymentState;
  }

  function refreshRegistrationSubmitLabel() {
    var submitBtn = document.querySelector('#wadiRegForm [data-submit]');
    if (!submitBtn || submitBtn.getAttribute('data-t') === 'sending') return;
    submitBtn.setAttribute('data-t', cardCheckoutAvailable() ? 'submitWithPay' : 'submitClosed');
    submitBtn.disabled = !cardCheckoutAvailable();
    if (typeof window.wadiRumRegRefreshSubmit === 'function') {
      window.wadiRumRegRefreshSubmit();
    }
  }

  /**
   * @returns {Promise<boolean>} true when redirecting to payment gateway
   */
  async function startCheckout(customer, statusEl, btn) {
    var errMsg = validateCustomer(customer);
    if (errMsg) {
      setStatus(statusEl, errMsg, true);
      return false;
    }

    await loadPaymentOptions();
    if (!cardCheckoutAvailable()) {
      setStatus(statusEl, t('retreat_wadi_checkout_hyp_off'), true);
      return false;
    }

    setStatus(statusEl, t('retreat_wadi_deposit_processing'), false);
    if (btn) {
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
    }

    try {
      var notes = customer.requestId ? 'Registration request ' + customer.requestId : '';
      var res = await fetch('/api/commerce/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          commerceType: 'retreat',
          itemId: ITEM_ID,
          payment: 'hyp',
          depositAmount: DEPOSIT_ILS,
          retreatRequestId: customer.requestId || '',
          notes: notes,
          customer: {
            fullName: customer.fullName,
            phone: customer.phone,
            email: customer.email || '',
            city: '',
          },
          cancelUrl: '/register/wadi-rum?payment=failed',
        }),
      });

      var data = await res.json().catch(function () { return {}; });
      if (!res.ok || !data.url) {
        setStatus(statusEl, mapApiError(data, res.ok), true);
        return false;
      }
      window.location.href = data.url;
      return true;
    } catch (_e) {
      setStatus(statusEl, t('retreat_wadi_checkout_network_error'), true);
      return false;
    } finally {
      if (btn && !document.hidden) {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
      }
    }
  }

  function setupCheckoutPage() {
    var banner = document.getElementById('wrc-banner');
    var params = new URLSearchParams(window.location.search);
    if (params.get('registered') === '1' && banner) {
      banner.hidden = false;
      banner.textContent = t('retreat_wadi_checkout_registered_banner');
    }
    if (params.get('payment') === 'failed' && banner) {
      banner.hidden = false;
      banner.classList.add('is-error');
      banner.textContent = t('retreat_wadi_checkout_failed_banner');
    }

    var stored = readSessionCustomer();
    var readonly = document.getElementById('wrc-customer-readonly');
    var formWrap = document.getElementById('wrc-customer-form');
    var nameEl = document.getElementById('wrc-fullName');
    var phoneEl = document.getElementById('wrc-phone');
    var emailEl = document.getElementById('wrc-email');

    if (stored && stored.fullName && stored.phone) {
      if (readonly) {
        readonly.hidden = false;
        readonly.innerHTML =
          '<p><strong>' +
          escapeHtml(stored.fullName) +
          '</strong></p><p dir="ltr">' +
          escapeHtml(stored.phone) +
          '</p>';
      }
      if (formWrap) formWrap.hidden = true;
      if (nameEl) nameEl.value = stored.fullName;
      if (phoneEl) phoneEl.value = stored.phone;
      if (emailEl && stored.email) emailEl.value = stored.email;
    } else if (formWrap) {
      formWrap.hidden = false;
    }

    var btn = document.getElementById('wrc-pay-btn');
    var statusEl = document.getElementById('wrc-pay-status');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var customer = readCheckoutCustomer();
      if (!customer) return;
      startCheckout(customer, statusEl, btn);
    });

    loadPaymentOptions().then(function () {
      if (!cardCheckoutAvailable() && btn) {
        btn.disabled = true;
        setStatus(statusEl, t('retreat_wadi_checkout_hyp_off'), true);
      }
    });
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function initRegisterPage() {
    var regStatus = document.getElementById('regFormStatus');
    var params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'failed' && regStatus) {
      setStatus(regStatus, t('retreat_wadi_checkout_failed_banner'), true);
    }
  }

  function init() {
    loadPaymentOptions();
    if (document.getElementById('wadiRegForm')) {
      initRegisterPage();
    }
    if (document.getElementById('wrc-pay-btn')) {
      setupCheckoutPage();
    }
    document.querySelectorAll('[data-wadi-deposit-pay]').forEach(function (btn) {
      if (btn.getAttribute('data-bound') === '1') return;
      btn.setAttribute('data-bound', '1');
      btn.addEventListener('click', function () {
        window.location.href = '/register/wadi-rum';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.wadiRumDepositPay = {
    saveCustomer: function (customer) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(customer || {}));
      } catch (_e) {}
    },
    goToCheckout: function () {
      window.location.href = '/register/wadi-rum';
    },
    startCheckout: startCheckout,
    isCardCheckoutAvailable: cardCheckoutAvailable,
    loadPaymentOptions: loadPaymentOptions,
  };
})();
