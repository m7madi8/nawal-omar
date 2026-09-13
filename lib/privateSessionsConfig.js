// lib/privateSessionsConfig.js
//
// Mirrors the existing pattern in lib/feedbackConfig.js: static CSS as a
// string constant, and a vanilla-JS inline script (no framework) that runs
// after the legacy HTML for /private-sessions is mounted by LegacyPage.

export const PS_STYLES = `/* see private-sessions.css */`;

export const PS_INLINE_SCRIPT = `(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var form = document.getElementById('psRequestForm');
    if (!form) return;

    var successEl = form.parentElement.querySelector('[data-form-success]');
    var statusEl = form.querySelector('[data-form-status]');

    function setError(field, message) {
      var el = form.querySelector('[data-field="' + field + '"]');
      if (!el) return;
      if (!message) {
        el.hidden = true;
        el.textContent = '';
        var input = form.querySelector('[name="' + field + '"], #' + field);
        if (input) input.removeAttribute('aria-invalid');
        return;
      }
      el.hidden = false;
      el.textContent = message;
      var named = form.querySelector('[name="' + field + '"]');
      if (named) named.setAttribute('aria-invalid', 'true');
    }

    function clearErrors() {
      form.querySelectorAll('[data-field]').forEach(function (el) {
        el.hidden = true;
        el.textContent = '';
      });
      form.querySelectorAll('[aria-invalid]').forEach(function (el) {
        el.removeAttribute('aria-invalid');
      });
    }

    function currentLang() {
      return document.documentElement.lang === 'ar' ? 'ar' : 'en';
    }

    function msg(key) {
      var lang = currentLang();
      var COPY = {
        required: { en: 'This field is required.', ar: 'لازم تعبّي هالحقل.' },
        participants: { en: 'Enter a number from 1 to 10.', ar: 'اكتبي رقم بين ١ و١٠.' },
        phone: { en: 'Enter a valid phone number.', ar: 'اكتبي رقم موبايل/واتساب صح.' },
        sending: { en: 'Sending your request…', ar: 'عم نبعت طلبك…' },
        error: { en: 'Something went wrong. Please try again, or message Nawal on WhatsApp.', ar: 'صار في مشكلة. جرّبي مرة ثانية، أو تواصلي مع نوال على واتساب.' },
      };
      return (COPY[key] && COPY[key][lang]) || '';
    }

    function selectedSession() {
      var checked = form.querySelector('input[name="sessionType"]:checked');
      return checked ? checked.value : '';
    }

    document.querySelectorAll('[data-select-session]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-select-session');
        var radio = form.querySelector('input[name="sessionType"][value="' + value + '"]');
        if (radio) radio.checked = true;
        var target = document.getElementById('ps-request');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    function validate(data) {
      var ok = true;
      clearErrors();

      if (!data.sessionType) {
        setError('sessionType', msg('required'));
        ok = false;
      }

      var participants = parseInt(String(data.participants).trim(), 10);
      if (!participants || participants < 1 || participants > 10) {
        setError('participants', msg('participants'));
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

      return ok;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var data = {
        sessionType: selectedSession(),
        participants: document.getElementById('psParticipants').value,
        fullName: document.getElementById('psName').value,
        phone: document.getElementById('psPhone').value,
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

      var SESSION_LABELS = {
        yoga: 'Private Yoga',
        sound: 'Sound Healing',
        ice: 'Ice Bath',
      };
      var participants = parseInt(String(data.participants).trim(), 10);
      var now = new Date().toISOString();
      var sessionKey = data.sessionType;
      var sessionLabel = SESSION_LABELS[sessionKey] || sessionKey || 'Private Session';

      var payload = {
        id: 'req-ps-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        source: 'private-sessions-page',
        retreatType: sessionLabel,
        submittedAt: now,
        createdAt: now,
        fullName: data.fullName.trim(),
        phone: data.phone.trim(),
        age: String(participants),
        city: '',
        reason: 'Private session request',
        expectation: '',
        yogaExperience: sessionKey,
        healthStatus: '',
        healthDetails: '',
        activities: [],
        freeNote: data.message ? data.message.trim() : '',
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
