(function () {
  var params = new URLSearchParams(window.location.search);
  var orderId = params.get('order') || '';
  var token = params.get('token') || '';
  var paymentFlag = params.get('payment') || '';

  var pending = document.getElementById('pay-thanks-pending');
  var failed = document.getElementById('pay-thanks-failed');
  var title = document.getElementById('pay-thanks-title');
  var body = document.getElementById('pay-thanks-body');
  var ref = document.getElementById('pay-thanks-ref');
  var summary = document.getElementById('pay-thanks-summary');
  var pdfBtn = document.getElementById('pay-thanks-pdf');
  var waBtn = document.getElementById('pay-thanks-wa');
  var waHint = document.getElementById('pay-thanks-wa-hint');
  var back = document.getElementById('pay-thanks-back');

  function lang() {
    if (window.nawalI18n && typeof window.nawalI18n.getLang === 'function') {
      return window.nawalI18n.getLang() || 'ar';
    }
    return 'ar';
  }

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

  function downloadPdf(url, filename) {
    if (!url) return;
    var a = document.createElement('a');
    a.href = url;
    a.download = filename || 'payment-receipt.pdf';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function openWhatsApp(url) {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function autoActionsKey() {
    return 'nawal.thanks.done.' + orderId;
  }

  function runAutoActions(data) {
    if (!data.pdfUrl || !data.whatsappUrl) return;
    try {
      if (sessionStorage.getItem(autoActionsKey()) === '1') return;
      sessionStorage.setItem(autoActionsKey(), '1');
    } catch (_e) {
      /* continue */
    }
    var docName =
      (data.receipts && data.receipts.length && data.receipts[data.receipts.length - 1].documentNumber) ||
      'receipt';
    downloadPdf(data.pdfUrl, docName + '.pdf');
    window.setTimeout(function () {
      openWhatsApp(data.whatsappUrl);
    }, 900);
  }

  function showFailed() {
    if (pending) pending.hidden = true;
    if (failed) failed.hidden = false;
    if (title) title.textContent = t('payment_thanks_failed_title');
    if (body) body.textContent = t('payment_thanks_failed');
    if (pdfBtn) pdfBtn.hidden = true;
    if (waBtn) waBtn.hidden = true;
    if (waHint) waHint.hidden = true;
  }

  function showSuccess(data) {
    if (pending) pending.hidden = true;
    if (failed) failed.hidden = true;
    if (title) title.textContent = t('payment_thanks_title');
    if (body) {
      body.textContent = t('payment_thanks_body_dynamic', {
        experience: data.experience || '',
        paid: formatMoney(data.amountPaid, data.currency),
      });
    }
    if (ref) {
      ref.hidden = false;
      ref.textContent =
        t('payment_thanks_ref') + ': ' + (data.bookingReference || data.orderId);
    }
    if (summary) {
      summary.hidden = false;
      summary.innerHTML =
        '<div class="wrc-row"><span>' +
        t('payment_thanks_total') +
        '</span><strong dir="ltr">' +
        formatMoney(data.total, data.currency) +
        '</strong></div>' +
        '<div class="wrc-row"><span>' +
        t('payment_thanks_paid') +
        '</span><strong dir="ltr">' +
        formatMoney(data.amountPaid, data.currency) +
        '</strong></div>' +
        (Number(data.remaining) > 0
          ? '<div class="wrc-row"><span>' +
            t('retreat_wadi_thanks_remaining') +
            '</span><strong dir="ltr">' +
            formatMoney(data.remaining, data.currency) +
            '</strong></div>'
          : '');
    }
    if (back && data.backPath) back.href = data.backPath;

    if (pdfBtn && data.pdfUrl) {
      pdfBtn.hidden = false;
      pdfBtn.href = data.pdfUrl;
    }
    if (waBtn && data.whatsappUrl) {
      waBtn.hidden = false;
      waBtn.href = data.whatsappUrl;
    }
    if (waHint) waHint.hidden = false;

    runAutoActions(data);
  }

  async function load() {
    if (paymentFlag === 'failed') {
      showFailed();
      return;
    }
    if (!orderId) {
      if (pending) pending.hidden = false;
      return;
    }

    if (pending) pending.hidden = false;
    try {
      var bookingUrl =
        '/api/commerce/booking/' +
        encodeURIComponent(orderId) +
        '?lang=' +
        encodeURIComponent(lang());
      if (token) {
        bookingUrl += '&token=' + encodeURIComponent(token);
      }
      var res = await fetch(bookingUrl, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      });
      var data = await res.json();
      if (!res.ok || !data.paymentVerified) {
        if (pending) pending.hidden = false;
        return;
      }
      showSuccess(data);
    } catch (_e) {
      if (pending) pending.hidden = false;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
