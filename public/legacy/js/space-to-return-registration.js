(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var form = document.getElementById('strRegisterForm');
    if (!form || form.getAttribute('data-bound') === '1') return;
    form.setAttribute('data-bound', '1');

    var statusEl = form.querySelector('[data-form-status]');
    var successEl = document.querySelector('[data-form-success]');
    var submitBtn = form.querySelector('.str-form__submit');

    function lang() {
      return document.documentElement.lang === 'ar' ? 'ar' : 'en';
    }

    function msg(key) {
      var COPY = {
        required: { en: 'This field is required.', ar: 'لازم تعبّي هالحقل.' },
        phone: { en: 'Enter a valid phone number.', ar: 'اكتبي رقم موبايل/واتساب صح.' },
        room: {
          en: 'Please choose an available room option.',
          ar: 'اختاري نوع غرفة متاح.',
        },
        room_sold_out: {
          en: 'This room option is sold out.',
          ar: 'هذا الخيار مكتمل.',
        },
        sending: { en: 'Saving & opening payment…', ar: 'عم نحفظ ونفتح الدفع…' },
        payment_retry: {
          en: 'Registration saved — tap again to retry secure payment.',
          ar: 'انحفظ التسجيل — اضغطي مرة ثانية لإعادة محاولة الدفع.',
        },
        error: {
          en: 'Something went wrong. Please try again or message Nawal on WhatsApp.',
          ar: 'صار في مشكلة. جرّبي مرة ثانية أو تواصلي مع نوال على واتساب.',
        },
        pay_unavailable: {
          en: 'Card payment is temporarily unavailable. Please contact Nawal on WhatsApp.',
          ar: 'الدفع بالبطاقة غير متاح حالياً. تواصلي مع نوال على واتساب.',
        },
      };
      var l = lang();
      return (COPY[key] && COPY[key][l]) || '';
    }

    function setError(field, message) {
      var el = form.querySelector('[data-field="' + field + '"]');
      if (!el) return;
      el.hidden = !message;
      el.textContent = message || '';
      var input =
        field === 'roomId'
          ? form.querySelector('input[name="roomId"]:checked') ||
            form.querySelector('input[name="roomId"]')
          : form.querySelector('[name="' + field + '"], #' + field);
      if (input && field !== 'roomId') {
        if (message) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      }
      var grp = document.getElementById('grp-str-room');
      if (grp && field === 'roomId') {
        grp.classList.toggle('str-form__field--invalid', !!message);
      }
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

    function openRoomIds() {
      var raw = form.getAttribute('data-str-open-rooms');
      if (!raw) return ['double', 'triple'];
      return raw
        .split(',')
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);
    }

    function selectedRoomId() {
      var checked = form.querySelector('input[name="roomId"]:checked:not(:disabled)');
      return checked ? checked.value : '';
    }

    function roomLabel(roomId) {
      var input = form.querySelector('input[name="roomId"][value="' + roomId + '"]');
      if (!input) return roomId;
      var label = input.closest('label');
      if (!label) return roomId;
      var textEl = label.querySelector('[data-room-label]');
      return textEl ? textEl.textContent.trim() : roomId;
    }

    async function sendRegistration(fullName, phone, roomId, note) {
      var now = new Date();
      var retreatLabel = lang() === 'ar' ? 'مساحة للعودة' : 'A Space to Return';
      var payload = {
        id: 'req-str-' + now.getTime(),
        source: 'space-to-return-registration',
        retreatType: retreatLabel,
        submittedAt: now.toISOString(),
        fullName: fullName,
        phone: phone,
        age: '',
        city: 'Slowness — Kibbutz Moran',
        reason: 'Room: ' + roomLabel(roomId),
        expectation: '',
        yogaExperience: '',
        healthStatus: '',
        healthDetails: '',
        activities: [],
        freeNote: note || 'Local retreat registration · roomId=' + roomId,
        status: 'pending',
        createdAt: now.toISOString(),
      };

      var res = await fetch('/api/retreat-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        var errBody = await res.json().catch(function () {
          return {};
        });
        throw new Error(errBody.error || 'Registration submit failed');
      }
      return payload;
    }

    if (window.strSpaceToReturnDepositPay) {
      window.strSpaceToReturnDepositPay.loadPaymentOptions();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setError('fullName', '');
      setError('phone', '');
      setError('roomId', '');

      var fullName = document.getElementById('strName').value.trim();
      var phone = normalizePhone(document.getElementById('strPhone').value);
      var note = document.getElementById('strNote').value.trim();
      var roomId = selectedRoomId();
      var ok = true;
      if (!fullName) {
        setError('fullName', msg('required'));
        ok = false;
      }
      if (!phone || phone.replace(/\D/g, '').length < 7) {
        setError('phone', msg('phone'));
        ok = false;
      }
      if (!roomId) {
        setError('roomId', msg('room'));
        ok = false;
      } else if (openRoomIds().indexOf(roomId) === -1) {
        setError('roomId', msg('room_sold_out'));
        ok = false;
      }
      if (!ok) return;

      var pay = window.strSpaceToReturnDepositPay;
      if (!pay) {
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = msg('error');
        }
        return;
      }

      submitBtn.disabled = true;
      submitBtn.setAttribute('data-str-sending', '1');
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = msg('sending');
        statusEl.classList.remove('is-error');
      }

      pay
        .loadPaymentOptions()
        .then(function () {
          if (!pay.isCardCheckoutAvailable()) {
            if (statusEl) statusEl.textContent = msg('pay_unavailable');
            submitBtn.disabled = false;
            submitBtn.removeAttribute('data-str-sending');
            return null;
          }
          return sendRegistration(fullName, phone, roomId, note);
        })
        .then(function (saved) {
          if (!saved) return;
          return pay.startCheckout(
            {
              fullName: fullName,
              phone: phone,
              email: '',
              roomId: roomId,
              requestId: saved.id,
              note: note,
            },
            statusEl,
            submitBtn,
          );
        })
        .then(function (redirected) {
          if (redirected) return;
          if (statusEl && statusEl.textContent === msg('sending')) {
            statusEl.textContent = msg('payment_retry');
            statusEl.classList.add('is-error');
          }
        })
        .catch(function () {
          if (statusEl) {
            statusEl.textContent = msg('error');
            statusEl.classList.add('is-error');
          }
        })
        .finally(function () {
          submitBtn.removeAttribute('data-str-sending');
          if (window.strSpaceToReturnDepositPay) {
            window.strSpaceToReturnDepositPay.refreshSubmitState();
          } else {
            submitBtn.disabled = false;
          }
        });
    });
  });
})();
