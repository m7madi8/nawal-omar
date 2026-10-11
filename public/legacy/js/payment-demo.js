(function () {
  var params = new URLSearchParams(window.location.search);
  var orderId = params.get('order') || '';
  var token = params.get('token') || '';
  var btn = document.getElementById('demo-pay-btn');
  var status = document.getElementById('demo-status');

  function t(key) {
    if (window.nawalI18n && typeof window.nawalI18n.t === 'function') {
      return window.nawalI18n.t(key) || key;
    }
    return key;
  }

  function redirectAfterSuccess(data) {
    var type = data && data.commerceType;
    var qs = new URLSearchParams({ order: orderId });
    if (token) qs.set('token', token);
    if (type === 'retreat') {
      window.location.href = '/register/wadi-rum/thanks?' + qs.toString();
      return;
    }
    window.location.href = '/payment/thanks?' + qs.toString();
  }

  if (!orderId || !token) {
    if (status) {
      status.hidden = false;
      status.textContent = t('payment_demo_missing');
    }
    if (btn) btn.disabled = true;
    return;
  }

  if (btn) {
    btn.addEventListener('click', async function () {
      btn.disabled = true;
      if (status) {
        status.hidden = false;
        status.textContent = t('payment_demo_processing');
      }
      try {
        var res = await fetch('/api/payment/demo/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ orderId: orderId, token: token }),
        });
        var data = await res.json().catch(function () {
          return {};
        });
        if (!res.ok || !data.paid) {
          throw new Error(data.error || 'Failed');
        }
        redirectAfterSuccess(data);
      } catch (_e) {
        if (status) status.textContent = t('payment_demo_error');
        btn.disabled = false;
      }
    });
  }
})();
