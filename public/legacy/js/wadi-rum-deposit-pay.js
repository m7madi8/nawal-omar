(function () {
  var DEPOSIT_ILS = 400;
  var ITEM_ID = 'wadi-rum';
  var STORAGE_KEY = 'nawal.wadiRum.depositCustomer';

  function t(key) {
    if (window.nawalI18n && typeof window.nawalI18n.t === 'function') {
      var text = window.nawalI18n.t(key);
      if (text) return text;
    }
    return key;
  }

  function supabaseConfig() {
    var el = document.getElementById('wrc-supabase-config');
    if (!el) return null;
    return {
      url: (el.getAttribute('data-url') || '').replace(/\/+$/, ''),
      key: (el.getAttribute('data-key') || '').trim(),
      ordersTable: el.getAttribute('data-orders-table') || 'commerce_orders',
      itemsTable: el.getAttribute('data-items-table') || 'commerce_order_items',
    };
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
    if (code === 'COMMERCE_DB_NOT_READY') {
      return t('retreat_wadi_checkout_db_setup');
    }
    if (code === 'HYP_NETWORK' || code === 'HYP_SIGN_FAILED') {
      return t('retreat_wadi_checkout_gateway_error');
    }
    if (data && data.error) return data.error;
    if (!resOk) return t('retreat_wadi_deposit_error_generic');
    return t('retreat_wadi_deposit_error_generic');
  }

  async function supabasePost(cfg, table, rows) {
    var res = await fetch(cfg.url + '/rest/v1/' + encodeURIComponent(table), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        apikey: cfg.key,
        Authorization: 'Bearer ' + cfg.key,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(rows),
    });
    var text = await res.text();
    var data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (_e) {
      data = { message: text };
    }
    if (!res.ok) {
      var msg = (data && data.message) || text || 'Database error';
      if (String(msg).indexOf('PGRST205') !== -1 || String(msg).indexOf('Could not find the table') !== -1) {
        var err = new Error('COMMERCE_DB_NOT_READY');
        err.code = 'COMMERCE_DB_NOT_READY';
        throw err;
      }
      throw new Error(msg);
    }
    return Array.isArray(data) ? data[0] : data;
  }

  async function createOrderInBrowser(customer) {
    var cfg = supabaseConfig();
    if (!cfg || !cfg.url || !cfg.key) {
      throw new Error('Missing Supabase config');
    }
    var now = new Date().toISOString();
    var orderId = 'ord-wadi-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    var order = {
      id: orderId,
      status: 'pending',
      payment_status: 'pending',
      payment_method: 'hyp',
      currency: 'ILS',
      subtotal: 3650,
      total: 3650,
      customer: {
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email || '',
        city: '',
      },
      metadata: {
        commerceType: 'retreat',
        itemId: ITEM_ID,
        paymentKind: 'deposit',
        chargeAmount: DEPOSIT_ILS,
        amountDue: 3650,
        retreatRequestId: customer.requestId || '',
        legacySource: 'wadi-rum-registration',
      },
      created_at: now,
      updated_at: now,
    };
    var item = {
      id: 'oi-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      order_id: orderId,
      commerce_type: 'retreat',
      item_id: ITEM_ID,
      title: 'Wadi Rum Desert Retreat',
      quantity: 1,
      unit_price: 3650,
      currency: 'ILS',
      metadata: { paymentKind: 'deposit', chargeAmount: DEPOSIT_ILS },
      created_at: now,
    };
    await supabasePost(cfg, cfg.ordersTable, [order]);
    await supabasePost(cfg, cfg.itemsTable, [item]);
    return orderId;
  }

  async function startCheckout(customer, statusEl, btn) {
    var errMsg = validateCustomer(customer);
    if (errMsg) {
      setStatus(statusEl, errMsg, true);
      return;
    }

    setStatus(statusEl, t('retreat_wadi_deposit_processing'), false);
    if (btn) {
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
    }

    try {
      var orderId;
      try {
        orderId = await createOrderInBrowser(customer);
      } catch (dbErr) {
        if (dbErr.code === 'COMMERCE_DB_NOT_READY') {
          setStatus(statusEl, t('retreat_wadi_checkout_db_setup'), true);
          return;
        }
        setStatus(statusEl, t('retreat_wadi_checkout_db_error'), true);
        return;
      }

      var res = await fetch('/api/commerce/hyp/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          commerceType: 'retreat',
          itemId: ITEM_ID,
          orderId: orderId,
          depositAmount: DEPOSIT_ILS,
          chargeAmount: DEPOSIT_ILS,
          paymentKind: 'deposit',
          retreatRequestId: customer.requestId || '',
          customer: {
            fullName: customer.fullName,
            phone: customer.phone,
            email: customer.email || '',
          },
        }),
      });

      var data = await res.json().catch(function () { return {}; });
      if (!res.ok || !data.url) {
        setStatus(statusEl, mapApiError(data, res.ok), true);
        return;
      }
      window.location.href = data.url;
    } catch (_e) {
      setStatus(statusEl, t('retreat_wadi_checkout_network_error'), true);
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
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function init() {
    if (document.getElementById('wrc-pay-btn')) {
      setupCheckoutPage();
    }
    document.querySelectorAll('[data-wadi-deposit-pay]').forEach(function (btn) {
      if (btn.getAttribute('data-bound') === '1') return;
      btn.setAttribute('data-bound', '1');
      btn.addEventListener('click', function () {
        window.location.href = '/register/wadi-rum/pay';
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
      window.location.href = '/register/wadi-rum/pay?registered=1';
    },
  };
})();
