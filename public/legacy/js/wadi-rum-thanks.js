(function () {
  var params = new URLSearchParams(window.location.search);
  var orderId = params.get('order') || '';
  var token = params.get('token') || '';
  var main = document.querySelector('.wrc-thanks');
  var title = main && main.querySelector('h1');
  var body = main && main.querySelector('p');
  var ref = document.getElementById('wrc-order-ref');
  var pdfBtn = document.getElementById('wrc-pdf-btn');
  var waBtn = document.getElementById('wrc-wa-btn');
  var waHint = document.getElementById('wrc-wa-hint');
  var summary = document.getElementById('wrc-payment-summary');
  var pending = document.getElementById('wrc-pending-verify');

  function t(key, vars) {
    var text = key;
    if (window.nawalI18n && typeof window.nawalI18n.t === 'function') {
      text = window.nawalI18n.t(key) || key;
    }
    if (vars && typeof vars === 'object') {
      Object.keys(vars).forEach(function (k) {
        text = String(text).replace('{' + k + '}', vars[k]);
      });
    }
    return text;
  }

  function formatMoney(amount, currency) {
    var symbol = currency === 'USD' ? '$' : '₪';
    return symbol + (Number(amount) || 0).toLocaleString();
  }

  function showPending() {
    if (pending) pending.hidden = false;
    if (title) title.textContent = t('retreat_wadi_thanks_verify_title');
    if (body) body.textContent = t('retreat_wadi_thanks_verify_body');
    if (pdfBtn) pdfBtn.hidden = true;
    if (waBtn) waBtn.hidden = true;
  }

  function showSuccess(data) {
    if (pending) pending.hidden = true;
    if (title) title.textContent = t('retreat_wadi_thanks_title');
    if (body) {
      body.textContent = t('retreat_wadi_thanks_body_dynamic', {
        paid: formatMoney(data.amountPaid, data.currency),
        remaining: formatMoney(data.remaining, data.currency),
      });
    }
    if (ref) {
      ref.hidden = false;
      ref.textContent =
        t('retreat_wadi_thanks_ref') + ': ' + (data.bookingReference || data.orderId);
    }
    if (summary) {
      summary.hidden = false;
      summary.innerHTML =
        '<div class="wrc-row"><span>' +
        t('retreat_wadi_thanks_total') +
        '</span><strong dir="ltr">' +
        formatMoney(data.total, data.currency) +
        '</strong></div>' +
        '<div class="wrc-row"><span>' +
        t('retreat_wadi_thanks_paid') +
        '</span><strong dir="ltr">' +
        formatMoney(data.amountPaid, data.currency) +
        '</strong></div>' +
        '<div class="wrc-row"><span>' +
        t('retreat_wadi_thanks_remaining') +
        '</span><strong dir="ltr">' +
        formatMoney(data.remaining, data.currency) +
        '</strong></div>';
    }
    if (pdfBtn && token) {
      pdfBtn.hidden = false;
      pdfBtn.href =
        '/api/commerce/receipt/' +
        encodeURIComponent(data.orderId) +
        '?token=' +
        encodeURIComponent(token);
    }
    if (waBtn && data.whatsappUrl) {
      waBtn.hidden = false;
      waBtn.href = data.whatsappUrl;
    }
    if (waHint) waHint.hidden = false;

    try {
      var autoKey = 'nawal.thanks.done.' + data.orderId;
      if (sessionStorage.getItem(autoKey) !== '1' && pdfBtn && pdfBtn.href && data.whatsappUrl) {
        sessionStorage.setItem(autoKey, '1');
        pdfBtn.click();
        window.setTimeout(function () {
          window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
        }, 900);
      }
    } catch (_e) {}
  }

  async function load() {
    if (!orderId || !token) {
      showPending();
      return;
    }
    try {
      var res = await fetch(
        '/api/commerce/booking/' +
          encodeURIComponent(orderId) +
          '?token=' +
          encodeURIComponent(token),
        { headers: { Accept: 'application/json' } },
      );
      var data = await res.json();
      if (!res.ok || !data.paymentVerified) {
        showPending();
        return;
      }
      showSuccess(data);
    } catch (_e) {
      showPending();
    }
  }

  try {
    sessionStorage.removeItem('nawal.wadiRum.depositCustomer');
  } catch (_e) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
