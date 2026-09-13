/* Nawal Yoga — shared feedback form engine */
(function () {
  var CONFIG = window.FEEDBACK_PAGE_CONFIG;
  var SUPABASE = window.FEEDBACK_SUPABASE || {};
  if (!CONFIG) return;

  var TOTAL_STEPS = 4;
  var currentStep = 1;
  var overallRating = 0;
  var subRatings = {};

  CONFIG.ratings.forEach(function (row) {
    subRatings[row.key] = 0;
  });

  function qs(id) {
    return document.getElementById(id);
  }

  function setupStarBox(box, onSelect) {
    if (!box) return;
    box.querySelectorAll('.fb-star').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = parseInt(btn.getAttribute('data-val'), 10);
        onSelect(val);
        box.querySelectorAll('.fb-star').forEach(function (star) {
          star.classList.toggle('is-active', parseInt(star.getAttribute('data-val'), 10) <= val);
        });
      });
    });
  }

  setupStarBox(qs('overallStarBox'), function (val) {
    overallRating = val;
  });

  document.querySelectorAll('.fb-stars--sub').forEach(function (box) {
    var key = box.getAttribute('data-category');
    setupStarBox(box, function (val) {
      subRatings[key] = val;
    });
  });

  document.querySelectorAll('.fb-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var input = chip.querySelector('input');
      if (!input) return;
      if (input.type === 'radio') {
        document.querySelectorAll('input[name="' + input.name + '"]').forEach(function (radio) {
          var parent = radio.closest('.fb-chip');
          if (parent) parent.classList.remove('is-selected');
        });
        chip.classList.add('is-selected');
      } else {
        setTimeout(function () {
          chip.classList.toggle('is-selected', input.checked);
        }, 0);
      }
    });
  });

  function updateProgress() {
    var pct = Math.round((currentStep / TOTAL_STEPS) * 100);
    var label = qs('fbStepLabel');
    var percent = qs('fbStepPercent');
    var fill = qs('fbProgressFill');
    if (label) label.textContent = 'الخطوة ' + currentStep + ' من ' + TOTAL_STEPS;
    if (percent) percent.textContent = pct + '%';
    if (fill) fill.style.width = pct + '%';

    var prev = qs('fbPrevBtn');
    var next = qs('fbNextBtn');
    var submit = qs('fbSubmitBtn');
    if (prev) prev.hidden = currentStep === 1;
    if (next) next.hidden = currentStep === TOTAL_STEPS;
    if (submit) submit.hidden = currentStep !== TOTAL_STEPS;
  }

  function changeStep(delta) {
    var next = currentStep + delta;
    if (next < 1 || next > TOTAL_STEPS) return;
    var current = document.querySelector('.fb-step[data-step="' + currentStep + '"]');
    var target = document.querySelector('.fb-step[data-step="' + next + '"]');
    if (current) current.classList.remove('is-active');
    if (target) target.classList.add('is-active');
    currentStep = next;
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function buildFreeNote(data) {
    var ratingParts = CONFIG.ratings.map(function (row) {
      var label = (CONFIG.ratingLabels && CONFIG.ratingLabels[row.key]) || row.label;
      return label + ' (' + (subRatings[row.key] || 0) + '/5)';
    }).join('، ');

    return [
      '⭐ التقييم الإجمالي: ' + (overallRating ? overallRating + '/5' : 'لم يُحدد'),
      '💖 المشاعر والأثر: ' + (data.feelings.join('، ') || 'لم تُحدد'),
      '📍 التقييمات التفصيلية: ' + ratingParts,
      '🌅 أجمل لحظة: ' + (data.bestMoment || '-'),
      '✈️ الرغبة بالانضمام مجدداً: ' + (data.againChoice || '-'),
      '💬 رسالة ختامية: ' + (data.finalNotes || '-'),
    ].join('\n');
  }

  async function submitFeedback() {
    var submitBtn = qs('fbSubmitBtn');
    var name = (qs('participantName') && qs('participantName').value.trim()) || CONFIG.defaultName;
    var phone = (qs('participantPhone') && qs('participantPhone').value.trim()) || '-';
    var feelings = Array.prototype.slice
      .call(document.querySelectorAll('#feelingsGrid input:checked'))
      .map(function (input) {
        return input.value;
      });
    var bestMoment = qs('bestMoment') ? qs('bestMoment').value.trim() : '';
    var againChoice =
      (document.querySelector('input[name="againChoice"]:checked') || {}).value || '-';
    var finalNotes = qs('finalNotes') ? qs('finalNotes').value.trim() : '';

    var payload = {
      id: 'fb-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      source: CONFIG.sourceKey,
      fullName: name,
      phone: phone,
      retreatType: CONFIG.retreatTitle,
      freeNote: buildFreeNote({
        feelings: feelings,
        bestMoment: bestMoment,
        againChoice: againChoice,
        finalNotes: finalNotes,
      }),
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'جاري الإرسال...';
    }

    try {
      if (SUPABASE.url && SUPABASE.key && SUPABASE.table) {
        await fetch(SUPABASE.url + '/rest/v1/' + encodeURIComponent(SUPABASE.table), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE.key,
            Authorization: 'Bearer ' + SUPABASE.key,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      console.error(err);
    }

    try {
      var saved = JSON.parse(localStorage.getItem('yogaFeedbackResponses') || '[]');
      saved.unshift(payload);
      localStorage.setItem('yogaFeedbackResponses', JSON.stringify(saved));
    } catch (_) {}

    var progress = qs('fbProgress');
    var shell = qs('fbFormShell');
    var success = qs('fbSuccessBox');
    if (progress) progress.hidden = true;
    if (shell) shell.hidden = true;
    if (success) success.hidden = false;
    if (window.nawalThankYou && typeof window.nawalThankYou.show === 'function') {
      window.nawalThankYou.show({ name: name });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  var prevBtn = qs('fbPrevBtn');
  var nextBtn = qs('fbNextBtn');
  var submitBtn = qs('fbSubmitBtn');
  if (prevBtn) prevBtn.addEventListener('click', function () { changeStep(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { changeStep(1); });
  if (submitBtn) submitBtn.addEventListener('click', submitFeedback);

  updateProgress();
})();
