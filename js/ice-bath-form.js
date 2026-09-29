/**
 * Ice Bath health declaration form (events.html)
 */
(function () {
  var form = document.getElementById("iceBathForm");
  if (!form) return;

  var steps = Array.prototype.slice.call(document.querySelectorAll(".ib-step-panel"));
  var progressFill = document.getElementById("ib-progress-fill");
  var progressText = document.getElementById("ib-progress-text");
  var progressPercent = document.getElementById("ib-progress-percent");
  var prevBtn = document.getElementById("ib-prev-btn");
  var nextBtn = document.getElementById("ib-next-btn");
  var submitBtn = document.getElementById("ib-submit-btn");
  var draftStatus = document.getElementById("ib-draft-status");
  var successState = document.getElementById("ib-success-state");
  var drawWrap = document.getElementById("ib-draw-wrap");
  var typeWrap = document.getElementById("ib-type-wrap");
  var typedSignature = document.getElementById("ib-typed-signature");
  var signatureCanvas = document.getElementById("ib-signature-canvas");
  var clearSign = document.getElementById("ib-clear-sign");
  var signModeButtons = document.querySelectorAll("[data-ib-sign-mode]");
  var storageKey = "ice-bath-health-draft-v2";

  var currentStep = 1;
  var signMode = "type";
  var drawing = false;
  var hasDrawn = false;
  var canDraw = false;

  var SCREENING_QUESTIONS = [
    "Heart disease / arrhythmia / chest pain / catheterization / heart surgery / previous clot",
    "Uncontrolled high or low blood pressure",
    "Fainting (especially during exercise, breathing, heat, or cold)",
    "Epilepsy / seizures / stroke / aneurysm / neurological injury",
    "Uncontrolled asthma / lung disease / shortness of breath / recent respiratory attack",
    "Raynaud’s / poor circulation / neuropathy / reduced extremity sensation",
    "Pregnant / possibly pregnant / early postpartum",
    "Diabetes / kidney disease / thyroid disorder / temperature regulation issue",
    "Recent surgery / open wound / infection / fever / acute illness",
    "Medication affecting heart, BP, alertness, clotting, or temperature regulation",
    "Alcohol or sedative in the last few hours",
    "Severe panic attacks / trauma / difficult water or choking experience",
    "Slept, eaten, and hydrated appropriately today",
    "Any reason unsure about safety of participation"
  ];

  function getLang() {
    return document.documentElement.lang === "ar" ? "ar" : "en";
  }

  function i18nText(key, fallback) {
    if (window.nawalI18n && typeof window.nawalI18n.t === "function") {
      var value = window.nawalI18n.t(getLang(), key);
      if (value && value !== key) return value;
    }
    var el = document.querySelector('[data-i18n="' + key + '"]');
    if (el && el.textContent) return el.textContent;
    return fallback || key;
  }

  function fieldValue(name) {
    var el = form.elements[name];
    if (!el) return "";
    return String(el.value || "").trim();
  }

  function yesNo(name) {
    var checked = form.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : "";
  }

  function buildScreeningNoteLines() {
    var lines = [];
    SCREENING_QUESTIONS.forEach(function (label, index) {
      var n = index + 1;
      var answer = yesNo("sq" + n) || "-";
      var details = fieldValue("sq" + n + "Details") || "-";
      lines.push("Q" + n + " (" + label + "): " + answer);
      lines.push("Q" + n + " Details: " + details);
    });
    return lines;
  }

  async function submitToSupabase() {
    var supabaseUrl = (form.getAttribute("data-supabase-url") || "").trim().replace(/\/+$/, "");
    var supabaseKey = (form.getAttribute("data-supabase-anon-key") || "").trim();
    var table = (form.getAttribute("data-supabase-table") || "retreat_requests").trim();
    if (!supabaseUrl || !supabaseKey || !table) return false;

    var now = new Date();
    var yesFlags = SCREENING_QUESTIONS.map(function (_label, index) {
      return yesNo("sq" + (index + 1));
    }).filter(function (v) {
      return v === "yes";
    }).length;

    var payload = {
      id: "ice-" + now.getTime(),
      source: "ice-bath-health",
      retreatType: "Ice Bath Health Declaration",
      submittedAt: now.toISOString(),
      fullName: fieldValue("fullName"),
      phone: fieldValue("phone"),
      age: "",
      city: "",
      reason: "",
      expectation: "",
      yogaExperience: "",
      healthStatus: yesFlags > 0 ? "yes" : "no",
      healthDetails: yesFlags + " yes answer(s) in screening",
      activities: [],
      freeNote: [
        "Birth Date: " + (fieldValue("birthDate") || "-"),
        "Emergency Contact: " + (fieldValue("emergencyContact") || "-"),
        "Form Date: " + (fieldValue("formDate") || "-"),
        "Declaration Confirmed: " + (form.consentDeclaration && form.consentDeclaration.checked ? "yes" : "no")
      ]
        .concat(buildScreeningNoteLines())
        .concat([
          "Signature Mode: " + signMode,
          "Typed Signature: " + ((typedSignature && typedSignature.value.trim()) || "-")
        ])
        .join("\n"),
      status: "pending",
      createdAt: now.toISOString()
    };

    var response = await fetch(supabaseUrl + "/rest/v1/" + encodeURIComponent(table), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        apikey: supabaseKey,
        Authorization: "Bearer " + supabaseKey,
        Prefer: "return=representation"
      },
      body: JSON.stringify([payload])
    });

    return response.ok;
  }

  function resizeCanvas() {
    if (!signatureCanvas) return;
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    var rect = signatureCanvas.getBoundingClientRect();
    signatureCanvas.width = rect.width * ratio;
    signatureCanvas.height = rect.height * ratio;
    var ctx = signatureCanvas.getContext("2d");
    ctx.scale(ratio, ratio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#2a555f";
  }

  function getPoint(e) {
    var rect = signatureCanvas.getBoundingClientRect();
    var source = e.touches ? e.touches[0] : e;
    return { x: source.clientX - rect.left, y: source.clientY - rect.top };
  }

  function drawStart(e) {
    drawing = true;
    var p = getPoint(e);
    var ctx = signatureCanvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function drawMove(e) {
    if (!drawing) return;
    var p = getPoint(e);
    var ctx = signatureCanvas.getContext("2d");
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    hasDrawn = true;
  }

  function drawEnd() {
    drawing = false;
  }

  function setSignMode(mode) {
    if (mode === "draw" && !canDraw) mode = "type";
    signMode = mode;
    Array.prototype.forEach.call(signModeButtons, function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-ib-sign-mode") === mode);
    });
    if (drawWrap) drawWrap.style.display = mode === "draw" ? "block" : "none";
    if (typeWrap) typeWrap.style.display = mode === "type" ? "block" : "none";
    updateNextState();
  }

  function getStepElement(stepNumber) {
    return steps.find(function (step) {
      return Number(step.getAttribute("data-step")) === stepNumber;
    });
  }

  function updateProgress() {
    var total = steps.length;
    var percent = Math.round((currentStep / total) * 100);
    var label = i18nText("events_ib_step_label", "Step {current} of {total}")
      .replace("{current}", String(currentStep))
      .replace("{total}", String(total));
    if (progressText) progressText.textContent = label;
    if (progressPercent) progressPercent.textContent = percent + "%";
    if (progressFill) progressFill.style.width = percent + "%";
  }

  function markInvalid(input, withShake) {
    input.classList.add("error");
    if (withShake) {
      input.classList.add("ib-shake");
      setTimeout(function () {
        input.classList.remove("ib-shake");
      }, 360);
    }
  }

  function validateStep(stepNumber, withShake) {
    var stepEl = getStepElement(stepNumber);
    if (!stepEl) return false;
    var inputs = Array.prototype.slice.call(stepEl.querySelectorAll("input, textarea, select"));
    var valid = true;
    var seenRadios = {};

    inputs.forEach(function (input) {
      input.classList.remove("error", "ib-shake");

      if (input.type === "radio") {
        if (!input.required || seenRadios[input.name]) return;
        seenRadios[input.name] = true;
        var group = form.querySelectorAll('input[name="' + input.name + '"]');
        var checked = Array.prototype.some.call(group, function (r) {
          return r.checked;
        });
        if (!checked) {
          valid = false;
          var groupCard = group[0] && group[0].closest(".ib-radio-group");
          if (groupCard) {
            groupCard.classList.add("error");
            if (withShake) {
              groupCard.classList.add("ib-shake");
              setTimeout(function () {
                groupCard.classList.remove("ib-shake");
              }, 360);
            }
          }
        } else if (group[0]) {
          var okGroup = group[0].closest(".ib-radio-group");
          if (okGroup) okGroup.classList.remove("error");
        }
        return;
      }

      if (input.type === "checkbox") {
        if (input.required && !input.checked) {
          valid = false;
          markInvalid(input.closest("label") || input, withShake);
        }
        return;
      }

      if (input.required && !String(input.value || "").trim()) {
        valid = false;
        markInvalid(input, withShake);
      }
    });

    if (stepNumber === steps.length) {
      var signatureValid = signMode === "draw" ? hasDrawn : typedSignature && typedSignature.value.trim().length > 1;
      if (!signatureValid) {
        valid = false;
        markInvalid(signMode === "draw" ? signatureCanvas : typedSignature, withShake);
      }
    }

    if (!valid && withShake && "vibrate" in navigator) {
      navigator.vibrate(35);
    }

    return valid;
  }

  function updateNextState() {
    var valid = validateStep(currentStep, false);
    if (nextBtn) nextBtn.disabled = !valid;
    if (submitBtn) submitBtn.disabled = !valid;
  }

  function updateButtons() {
    if (prevBtn) prevBtn.style.visibility = currentStep === 1 ? "hidden" : "visible";
    var isLast = currentStep === steps.length;
    if (nextBtn) nextBtn.style.display = isLast ? "none" : "inline-block";
    if (submitBtn) submitBtn.style.display = isLast ? "inline-block" : "none";
  }

  function switchStep(nextStep) {
    if (nextStep < 1 || nextStep > steps.length || nextStep === currentStep) return;
    var currentEl = getStepElement(currentStep);
    var nextEl = getStepElement(nextStep);
    currentEl.classList.remove("active");
    currentEl.classList.add("leaving");

    setTimeout(function () {
      currentEl.classList.remove("leaving");
      nextEl.classList.add("active");
      currentStep = nextStep;
      updateProgress();
      updateButtons();
      updateNextState();
      saveDraft();
      var formTop = document.querySelector(".ice-bath-form-card") || document.getElementById("ice-bath-form");
      if (formTop) formTop.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  }

  function saveDraft() {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      if (el.type === "checkbox") data[el.name] = el.checked;
      else if (el.type === "radio") {
        if (el.checked) data[el.name] = el.value;
      } else data[el.name] = el.value;
    });
    data.__step = currentStep;
    data.__signMode = signMode;
    data.__hasDrawn = hasDrawn;
    localStorage.setItem(storageKey, JSON.stringify(data));
    if (draftStatus) {
      draftStatus.textContent = i18nText("events_ib_draft_saved", "Draft saved");
      setTimeout(function () {
        draftStatus.textContent = i18nText("events_ib_draft_idle", "Auto-save enabled");
      }, 1200);
    }
  }

  function loadDraft() {
    var raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      var data = JSON.parse(raw);
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || !(el.name in data)) return;
        if (el.type === "checkbox") el.checked = Boolean(data[el.name]);
        else if (el.type === "radio") el.checked = data[el.name] === el.value;
        else el.value = data[el.name] || "";
      });
      setSignMode(data.__signMode || "type");
      hasDrawn = Boolean(data.__hasDrawn);
      var step = Number(data.__step || 1);
      getStepElement(currentStep).classList.remove("active");
      currentStep = Math.max(1, Math.min(steps.length, step));
      getStepElement(currentStep).classList.add("active");
    } catch (_err) {}
  }

  form.addEventListener("input", function () {
    updateNextState();
    saveDraft();
  });

  form.addEventListener("change", function () {
    updateNextState();
    saveDraft();
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (!validateStep(currentStep, true)) return;
      switchStep(currentStep + 1);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      switchStep(currentStep - 1);
    });
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validateStep(currentStep, true)) return;
    if (submitBtn) submitBtn.disabled = true;
    try {
      var sent = await submitToSupabase();
      if (!sent) {
        alert(getLang() === "ar" ? "تعذّر إرسال الاستمارة. حاولي مرة أخرى." : "Failed to send form. Please try again.");
        return;
      }
      form.style.display = "none";
      if (draftStatus) draftStatus.style.display = "none";
      if (successState) successState.classList.add("visible");
      localStorage.removeItem(storageKey);
    } catch (_err) {
      alert(getLang() === "ar" ? "تعذّر إرسال الاستمارة. حاولي مرة أخرى." : "Failed to send form. Please try again.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  Array.prototype.forEach.call(signModeButtons, function (btn) {
    btn.addEventListener("click", function () {
      setSignMode(btn.getAttribute("data-ib-sign-mode"));
    });
  });

  if (clearSign) {
    clearSign.addEventListener("click", function () {
      var ctx = signatureCanvas.getContext("2d");
      ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
      hasDrawn = false;
      updateNextState();
      saveDraft();
    });
  }

  if (signatureCanvas) {
    signatureCanvas.addEventListener("mousedown", drawStart);
    signatureCanvas.addEventListener("mousemove", drawMove);
    window.addEventListener("mouseup", drawEnd);
    signatureCanvas.addEventListener("touchstart", drawStart, { passive: true });
    signatureCanvas.addEventListener("touchmove", drawMove, { passive: true });
    window.addEventListener("touchend", drawEnd, { passive: true });
    window.addEventListener("resize", resizeCanvas);
    canDraw =
      Boolean(signatureCanvas.getContext) &&
      ("PointerEvent" in window || "ontouchstart" in window || "onmousedown" in window);
    if (canDraw) {
      resizeCanvas();
    } else {
      var drawBtn = document.querySelector('[data-ib-sign-mode="draw"]');
      if (drawBtn) drawBtn.style.display = "none";
      if (drawWrap) drawWrap.style.display = "none";
    }
  }

  document.addEventListener("nawal-lang-change", function () {
    updateProgress();
    if (draftStatus) draftStatus.textContent = i18nText("events_ib_draft_idle", "Auto-save enabled");
    document.title = i18nText("events_ib_form_title", "Ice Bath Health Declaration");
  });

  loadDraft();
  if (form.formDate && !form.formDate.value) {
    form.formDate.value = new Date().toISOString().slice(0, 10);
  }
  setSignMode(signMode);
  updateProgress();
  updateButtons();
  updateNextState();
})();
