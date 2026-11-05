(function () {
  var DEPOSIT_ILS = 500;
  var ITEM_ID = 'space-to-return';
  var VALID_ROOMS = ['double', 'triple', 'suite-four'];
  var STORAGE_KEY = 'nawal.spaceToReturn.depositCustomer';

  var paymentState = { hypLive: false, loaded: false };

  function lang() {
    return document.documentElement.lang === 'ar' ? 'ar' : 'en';
  }

  function t(key) {
    var COPY = {
      processing: {
        en: 'Redirecting to secure payment…',
        ar: 'عم نحوّلكي للدفع الآمن…',
      },
      hyp_off: {
        en: 'Online card payment is not active yet. Please pay 500 ₪ by bank transfer or Bit and send us proof, or contact Nawal on WhatsApp.',
        ar: 'الدفع بالبطاقة غير مفعّل حالياً. ادفعي عربون 500 ₪ بحوالة أو Bit وأرسلي إثبات، أو تواصلي مع نوال على واتساب.',
      },
      room_invalid: {
        en: 'Please choose one of the three room options before continuing.',
        ar: 'اختاري أحد أنواع الغرف الثلاثة قبل المتابعة.',
      },
      gateway_error: {
        en: 'Payment could not be started. Try again or contact us on WhatsApp.',
        ar: 'ما قدرنا نفتح الدفع. جرّبي مرة ثانية أو تواصلي على واتساب.',
      },
      network_error: {
        en: 'Connection problem. Check your network and try again.',
        ar: 'في مشكلة بالاتصال. تأكدي من الشبكة وجربي مرة ثانية.',
      },
      db_setup: {
        en: 'Booking system is being set up. Please try again shortly or message us on WhatsApp.',
        ar: 'نظام الحجز قيد الإعداد. جربي بعد شوي أو راسلينا على واتساب.',
      },
      name: {
        en: 'Please enter your full name.',
        ar: 'اكتبي اسمك الكامل.',
      },
      phone: {
        en: 'Enter a valid phone number (WhatsApp).',
        ar: 'اكتبي رقم موبايل/واتساب صح.',
      },
    };
    var l = lang();
    return (COPY[key] && COPY[key][l]) || '';
  }

  function normalizePhone(value) {
    var phone = String(value || '')
      .replace(/[\u0660-\u0669]/g, function (d) {
        return String(d.charCodeAt(0) - 0x0660);
      })
      .replace(/[\u06F0-\u06F9]/g, function (d) {
        return String(d.charCodeAt(0) - 0x06f0);
      })
      .trim()
      .replace(/[\s\-().\/\u200e\u200f]/g, '');
    if (phone.indexOf('00') === 0) phone = '+' + phone.slice(2);
    return phone;
  }

  function setStatus(el, message, isError) {
    if (!el) return;
    el.textContent = message || '';
    el.hidden = !message;
    el.classList.toggle('is-error', !!isError);
  }

  function validateCustomer(customer) {
    if (!customer.fullName || customer.fullName.length < 2) return t('name');
    if (!customer.phone || customer.phone.replace(/\D/g, '').length < 8) return t('phone');
    if (VALID_ROOMS.indexOf(customer.roomId) === -1) return t('room_invalid');
    return '';
  }

  function mapApiError(data, resOk) {
    var code = data && data.code ? data.code : '';
    if (code === 'HYP_DISABLED' || code === 'PAYMENT_NOT_CONFIGURED') return t('hyp_off');
    if (code === 'COMMERCE_DB_NOT_READY' || code === 'COMMERCE_DB_SCHEMA') return t('db_setup');
    if (code === 'INVALID_ROOM') return t('room_invalid');
    if (code === 'BOOKING_CLOSED') {
      return lang() === 'ar' ? 'التسجيل مغلق حالياً.' : 'Registration is currently closed.';
    }
    if (code === 'COMMERCE_DB_NETWORK' || code === 'HYP_NETWORK' || code === 'HYP_SIGN_FAILED') {
      return t('gateway_error');
    }
    if (data && data.error) return data.error;
    if (!resOk) return t('gateway_error');
    return t('gateway_error');
  }

  async function loadPaymentOptions() {
    if (paymentState.loaded) return paymentState;
    try {
      var res = await fetch('/api/commerce/payment-options', {
        headers: { Accept: 'application/json' },
      });
      var data = await res.json().catch(function () {
        return {};
      });
      paymentState.hypLive = !!data.hypLive;
    } catch (_e) {
      paymentState.hypLive = false;
    }
    paymentState.loaded = true;
    refreshSubmitState();
    return paymentState;
  }

  function cardCheckoutAvailable() {
    return paymentState.loaded && paymentState.hypLive;
  }

  function mountPayMethodPicker() {
    var mount = document.getElementById('hypPayMethodsMount');
    if (!mount || !cardCheckoutAvailable() || !window.nawalHypPayMethods) return;
    window.nawalHypPayMethods.mount(mount);
  }

  function refreshSubmitState() {
    var btn = document.querySelector('#strRegisterForm .str-form__submit');
    if (!btn || btn.getAttribute('data-str-sending') === '1') return;
    mountPayMethodPicker();
    if (!cardCheckoutAvailable()) {
      btn.disabled = true;
      btn.setAttribute(
        'data-en',
        'Payment unavailable — contact Nawal',
      );
      btn.setAttribute('data-ar', 'الدفع غير متاح — تواصلي مع نوال');
      btn.textContent = lang() === 'ar' ? 'الدفع غير متاح — تواصلي مع نوال' : 'Payment unavailable — contact Nawal';
    }
  }

  /**
   * @returns {Promise<boolean>} true when redirecting to Hyp
   */
  async function startCheckout(customer, statusEl, btn) {
    var errMsg = validateCustomer(customer);
    if (errMsg) {
      setStatus(statusEl, errMsg, true);
      return false;
    }

    await loadPaymentOptions();
    if (!cardCheckoutAvailable()) {
      setStatus(statusEl, t('hyp_off'), true);
      return false;
    }

    setStatus(statusEl, t('processing'), false);
    if (btn) {
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
    }

    try {
      var notes = customer.requestId ? 'Registration request ' + customer.requestId : '';
      if (customer.note) notes = (notes ? notes + ' · ' : '') + customer.note;
      var res = await fetch('/api/commerce/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          commerceType: 'retreat',
          itemId: ITEM_ID,
          roomId: customer.roomId,
          payment: 'hyp',
          depositAmount: DEPOSIT_ILS,
          retreatRequestId: customer.requestId || '',
          hypPayMethod:
            (window.nawalHypPayMethods && window.nawalHypPayMethods.getSelected(document)) ||
            'card',
          notes: notes,
          customer: {
            fullName: customer.fullName,
            phone: customer.phone,
            email: customer.email || '',
            city: '',
          },
          cancelUrl: '/local-retreats/a-space-to-return?payment=failed',
        }),
      });

      var data = await res.json().catch(function () {
        return {};
      });
      if (!res.ok || !data.url) {
        setStatus(statusEl, mapApiError(data, res.ok), true);
        return false;
      }
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            fullName: customer.fullName,
            phone: customer.phone,
            roomId: customer.roomId,
            requestId: customer.requestId,
          }),
        );
      } catch (_e) {}
      window.location.href = data.url;
      return true;
    } catch (_e) {
      setStatus(statusEl, t('network_error'), true);
      return false;
    } finally {
      if (btn && !document.hidden) {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        refreshSubmitState();
      }
    }
  }

  function initPageBanner() {
    var statusEl = document.querySelector('#strRegisterForm [data-form-status]');
    var params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'failed' && statusEl) {
      setStatus(
        statusEl,
        lang() === 'ar'
          ? 'لم يكتمل الدفع. يمكنك المحاولة مرة أخرى أو التواصل معنا على واتساب.'
          : 'Payment was not completed. You can try again or contact us on WhatsApp.',
        true,
      );
      statusEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  function remountHypPicker() {
    if (cardCheckoutAvailable()) mountPayMethodPicker();
  }

  function init() {
    loadPaymentOptions();
    initPageBanner();
    document.addEventListener('nawal:langchange', remountHypPicker);
    window.addEventListener('nawal-lang-change', remountHypPicker);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.strSpaceToReturnDepositPay = {
    DEPOSIT_ILS: DEPOSIT_ILS,
    VALID_ROOMS: VALID_ROOMS,
    loadPaymentOptions: loadPaymentOptions,
    isCardCheckoutAvailable: cardCheckoutAvailable,
    startCheckout: startCheckout,
    refreshSubmitState: refreshSubmitState,
  };
})();
