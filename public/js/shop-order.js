(function () {
  function boot() {
  var drawer = document.getElementById('shop-checkout');
  var form = document.getElementById('shop-checkout-form');
  var closeBtn = document.getElementById('shop-checkout-close');
  var backdrop = document.getElementById('shop-checkout-backdrop');
  var errorEl = document.getElementById('shop-checkout-error');
  var submitBtn = document.getElementById('shop-checkout-submit');
  var qtyInput = document.getElementById('shop-qty');
  if (!drawer || !form) return;

  var state = {
    productId: '',
    productEn: '',
    productAr: '',
    colorId: 'black',
    colorEn: 'Black',
    colorAr: 'أسود',
    price: 0,
  };

  function lang() {
    return document.documentElement.getAttribute('lang') || 'ar';
  }

  function isAr() {
    return lang() === 'ar';
  }

  function showError(message) {
    if (!errorEl) return;
    errorEl.hidden = !message;
    errorEl.textContent = message || '';
  }

  function selectedSwatch(section) {
    return section && section.querySelector('.shop-swatch.is-selected');
  }

  function fillSummary() {
    var nameEl = document.getElementById('shop-checkout-product');
    var colorEl = document.getElementById('shop-checkout-color');
    var totalEl = document.getElementById('shop-checkout-total');
    var qty = Math.min(5, Math.max(1, Number(qtyInput && qtyInput.value) || 1));
    if (nameEl) nameEl.textContent = isAr() ? state.productAr : state.productEn;
    if (colorEl) colorEl.textContent = isAr() ? state.colorAr : state.colorEn;
    if (totalEl) totalEl.textContent = '$' + state.price * qty;
  }

  function openDrawer(trigger) {
    var section = trigger.closest('.shop-product');
    var swatch = selectedSwatch(section);
    state.productId = trigger.getAttribute('data-product') || '';
    state.productEn = trigger.getAttribute('data-product-en') || '';
    state.productAr = trigger.getAttribute('data-product-ar') || '';
    state.price = Number(trigger.getAttribute('data-price')) || 0;
    state.colorId = (swatch && swatch.getAttribute('data-color')) || 'black';
    state.colorEn = (swatch && swatch.getAttribute('data-color-en')) || 'Black';
    state.colorAr = (swatch && swatch.getAttribute('data-color-ar')) || 'أسود';
    if (qtyInput) qtyInput.value = '1';
    showError('');
    fillSummary();
    drawer.hidden = false;
    document.body.style.overflow = 'hidden';
    var nameInput = form.querySelector('[name="fullName"]');
    if (nameInput) nameInput.focus();
  }

  function closeDrawer() {
    drawer.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-shop-order]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openDrawer(btn);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !drawer.hidden) closeDrawer();
  });

  document.querySelectorAll('[data-shop-qty]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!qtyInput) return;
      var next = Number(qtyInput.value || 1) + Number(btn.getAttribute('data-shop-qty'));
      qtyInput.value = String(Math.min(5, Math.max(1, next)));
      fillSummary();
    });
  });
  if (qtyInput) qtyInput.addEventListener('change', fillSummary);

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    showError('');
    var data = new FormData(form);
    var payload = {
      productId: state.productId,
      colorId: state.colorId,
      qty: Number(qtyInput && qtyInput.value) || 1,
      fullName: String(data.get('fullName') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      city: String(data.get('city') || '').trim(),
      payment: String(data.get('payment') || '').trim(),
    };

    if (!payload.fullName || payload.fullName.length < 2) {
      showError(isAr() ? 'اكتبي اسمك الكامل.' : 'Please enter your full name.');
      return;
    }
    if (!payload.phone || payload.phone.replace(/\D/g, '').length < 8) {
      showError(isAr() ? 'أدخلي رقم هاتف صحيح.' : 'Please enter a valid phone number.');
      return;
    }
    if (!payload.payment) {
      showError(isAr() ? 'اختاري طريقة الدفع.' : 'Please choose a payment method.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');

    try {
      var res = await fetch('/api/shop/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      var result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error || (isAr() ? 'تعذّر إتمام الطلب.' : 'Could not place the order.'));
      }
      closeDrawer();
      form.reset();
      if (result.via === 'stripe' && result.url) {
        window.location.href = result.url;
        return;
      }
      if (result.via === 'whatsapp' && result.waUrl) {
        window.open(result.waUrl, '_blank', 'noopener');
      }
      if (window.nawalThankYou && typeof window.nawalThankYou.show === 'function') {
        window.nawalThankYou.show({ name: payload.fullName });
        return;
      }
      window.location.href = '/shop/thanks?via=' + encodeURIComponent(result.via || 'cash');
    } catch (error) {
      showError(error.message || (isAr() ? 'تعذّر إتمام الطلب.' : 'Could not place the order.'));
    } finally {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
    }
  });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
