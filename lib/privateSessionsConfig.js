// lib/privateSessionsConfig.js
//
// Mirrors the existing pattern in lib/feedbackConfig.js: static CSS as a
// string constant, and a vanilla-JS inline script (no framework) that runs
// after the legacy HTML for /private-sessions is mounted by LegacyPage.
//
// Merge PS_STYLES into your compiled stylesheet (public/legacy/css/input.css)
// rather than injecting a <style> tag, if that's how the rest of the site's
// CSS is delivered — kept here as a single exported string so it's easy to
// paste in wherever your build expects it.

export const PS_STYLES = `/* see private-sessions.css */`;

export const PS_INLINE_SCRIPT = `(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var form = document.getElementById('psRequestForm');
    if (!form) return;

    var LOCATION_FIELDS = ['yoga', 'sound', 'ice'];
    var STATIC_LOCATION_VALUE = { sound: 'sea', ice: 'ice-guru-haifa' };

    var successEl = form.parentElement.querySelector('[data-form-success]');
    var statusEl = form.querySelector('[data-form-status]');

    function setError(field, message) {
      var el = form.querySelector('[data-field="' + field + '"]');
      if (!el) return;
      if (!message) {
        el.hidden = true;
        el.textContent = '';
        return;
      }
      el.hidden = false;
      el.textContent = message;
    }

    function clearErrors() {
      form.querySelectorAll('[data-field]').forEach(function (el) {
        el.hidden = true;
        el.textContent = '';
      });
    }

    function currentLang() {
      return document.documentElement.lang === 'ar' ? 'ar' : 'en';
    }

    function msg(key) {
      var lang = currentLang();
      var COPY = {
        required: { en: 'This field is required.', ar: 'هذا الحقل مطلوب.' },
        participants: { en: 'Choose a number between 1 and 10.', ar: 'اختاروا رقماً بين ١ و١٠.' },
        phone: { en: 'Enter a valid phone number.', ar: 'أدخلوا رقم هاتف صحيح.' },
        email: { en: 'Enter a valid email address.', ar: 'أدخلوا بريداً إلكترونياً صحيحاً.' },
        sending: { en: 'Sending your request…', ar: 'جارٍ إرسال طلبكم…' },
        error: { en: 'Something went wrong. Please try again, or reach out on WhatsApp.', ar: 'حدث خطأ ما. حاولوا مرة أخرى، أو تواصلوا معنا عبر واتساب.' },
      };
      return (COPY[key] && COPY[key][lang]) || '';
    }

    function selectedSession() {
      var checked = form.querySelector('input[name="sessionType"]:checked');
      return checked ? checked.value : '';
    }

    function syncLocationFields() {
      var session = selectedSession();
      LOCATION_FIELDS.forEach(function (key) {
        var field = form.querySelector('[data-location-field="' + key + '"]');
        if (!field) return;
        var isActive = key === session;
        field.hidden = !isActive;
        var select = field.querySelector('select');
        if (select) select.required = isActive;
      });
    }

    // Pre-select a session type from a card's "Request this experience" button
    document.querySelectorAll('[data-select-session]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-select-session');
        var radio = form.querySelector('input[name="sessionType"][value="' + value + '"]');
        if (radio) {
          radio.checked = true;
          syncLocationFields();
        }
        var target = document.getElementById('ps-request');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    form.querySelectorAll('input[name="sessionType"]').forEach(function (radio) {
      radio.addEventListener('change', syncLocationFields);
    });
    syncLocationFields();

    function resolveLocation(session) {
      if (session === 'yoga') {
        var el = document.getElementById('psLocationYoga');
        return el ? el.value : '';
      }
      return STATIC_LOCATION_VALUE[session] || '';
    }

    function validate(data) {
      var ok = true;
      clearErrors();

      if (!data.sessionType) {
        setError('sessionType', msg('required'));
        ok = false;
      }

      var participants = parseInt(data.participants, 10);
      if (!participants || participants < 1 || participants > 10) {
        setError('participants', msg('participants'));
        ok = false;
      }

      if (data.sessionType === 'yoga' && !data.location) {
        setError('location', msg('required'));
        ok = false;
      }

      if (!data.preferredDate) {
        setError('preferredDate', msg('required'));
        ok = false;
      }

      if (!data.preferredTime) {
        setError('preferredTime', msg('required'));
        ok = false;
      }

      if (!data.fullName || !data.fullName.trim()) {
        setError('fullName', msg('required'));
        ok = false;
      }

      var phoneDigits = (data.phone || '').replace(/[^\\d+]/g, '');
      if (!phoneDigits || phoneDigits.replace(/\\D/g, '').length < 7) {
        setError('phone', msg('phone'));
        ok = false;
      }

      if (data.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email)) {
        setError('email', msg('email'));
        ok = false;
      }

      return ok;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var session = selectedSession();
      var data = {
        sessionType: session,
        participants: document.getElementById('psParticipants').value,
        location: resolveLocation(session),
        preferredDate: document.getElementById('psDate').value,
        preferredTime: document.getElementById('psTime').value,
        fullName: document.getElementById('psName').value,
        phone: document.getElementById('psPhone').value,
        email: document.getElementById('psEmail').value,
        message: document.getElementById('psMessage').value,
      };

      if (!validate(data)) return;

      var submitBtn = form.querySelector('.ps-form__submit');
      submitBtn.disabled = true;
      statusEl.hidden = false;
      statusEl.textContent = msg('sending');

      var supabaseUrl = form.getAttribute('data-supabase-url');
      var supabaseKey = form.getAttribute('data-supabase-anon-key');
      var supabaseTable = form.getAttribute('data-supabase-table');

      var payload = {
        id:
          (window.crypto && window.crypto.randomUUID)
            ? window.crypto.randomUUID()
            : String(Date.now()) + Math.random().toString(16).slice(2),
        source: 'private-sessions-page',
        sessionType: data.sessionType,
        participants: parseInt(data.participants, 10),
        location: data.location,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        submittedAt: new Date().toISOString(),
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        message: data.message || null,
        status: 'pending',
      };

      fetch(supabaseUrl + '/rest/v1/' + supabaseTable, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: 'Bearer ' + supabaseKey,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed: ' + res.status);
          form.hidden = true;
          statusEl.hidden = true;
          if (successEl) {
            successEl.hidden = false;
            successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        })
        .catch(function () {
          statusEl.hidden = false;
          statusEl.textContent = msg('error');
          submitBtn.disabled = false;
        });
    });
  });
})();`;