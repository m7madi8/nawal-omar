(function () {
  var form = document.getElementById("wadiHealthForm");
  if (!form || form.getAttribute("data-bound") === "1") return;
  form.setAttribute("data-bound", "1");

  var okMsg = document.getElementById("healthOkMsg");
  var contactBox = document.getElementById("healthContactBox");
  var progress = document.getElementById("regProgress");
  var stepLabel = document.getElementById("regStepLabel");
  var prevBtn = form.querySelector("[data-step-prev]");
  var nextBtn = form.querySelector("[data-step-next]");
  var submitBtn = form.querySelector("[data-submit]");
  var steps = Array.prototype.slice.call(form.querySelectorAll(".reg-step"));
  var TOTAL = steps.length;
  var current = 1;

  var translations = {
    en: {
      backLink: "Back to Wellbeing",
      registrationLink: "Wadi Rum registration & deposit",
      retreatLink: "Retreat page",
      title: "Wadi Rum Health Form",
      lead1: "These questions help us care for you during the desert retreat. Complete this after you register and pay your deposit — use the same name and phone as on your booking.",
      stepName1: "About you",
      stepName2: "Your experience",
      stepOf: "Step {n} of {total} · {name}",
      requiredNote: "Required fields are marked; other fields are optional unless noted.",
      optional: "(optional)",
      secContact: "Your details",
      fullName: "Full name",
      phone: "Phone (WhatsApp)",
      phoneHint: "Same number as on your registration.",
      age: "Age",
      city: "City",
      secExperience: "Intention & wellbeing",
      secIntentSub: "Write freely — there is no right or wrong answer.",
      reason: "What drew you to this retreat?",
      expectation: "What do you hope to receive?",
      yogaExp: "Yoga or meditation experience",
      y1: "No, this is my first time",
      y2: "Yes, basic experience",
      y3: "Yes, I practice regularly",
      healthQ: "Do you have a physical condition we should know about?",
      no: "No",
      yes: "Yes",
      healthDetails: "Additional health details",
      activitiesLabel: "Which activities interest you most?",
      activitiesHint: "You can choose more than one.",
      a1: "Yoga & breathwork",
      a2: "Reflective writing",
      a3: "Sound Healing",
      a4: "Desert & fire rituals",
      a5: "Meditative walk",
      a6: "Sharing circles",
      a7: "Nights under stars",
      freeNote: "Anything else you would like to share?",
      prev: "Back",
      next: "Next",
      submit: "Submit health form",
      sending: "Sending…",
      failTitle: "The form did not send this time",
      failText: "Your answers are still here. Try again, or message us on WhatsApp.",
      failRetry: "Try again",
      failWhatsapp: "Message us on WhatsApp",
      waFail: "Hi Nawal, I'm {name}. I tried to submit the Wadi Rum health form but it didn't work.",
      successTitle: "Thank you — your health form was received",
      successText: "We will contact you if we need any clarification before the retreat.",
      successBack: "Back to retreat page",
      contactLead: "For questions:",
      errName: "Please write your name.",
      errPhone: "We need your phone number.",
      errPhoneFormat: "This number doesn't look right — include the country code.",
      errAge: "Please write your age.",
      errAgeFormat: "Age must be a number, 16 or above.",
      errReason: "Please share what drew you to the retreat.",
      errYoga: "Please pick one option.",
      errHealth: "Please choose No or Yes.",
      errActivities: "Please choose at least one activity.",
      errSummaryOne: "One field needs your attention.",
      errSummaryMany: "{n} fields need your attention.",
      docTitle: "Wadi Rum Health Form | Desert Retreat"
    },
    ar: {
      backLink: "الرجوع لقسم العناية",
      registrationLink: "تسجيل وادي رم والعربون",
      retreatLink: "صفحة الريتريت",
      title: "الاستمارة الصحية | ريتريت وادي رم",
      lead1: "هالأسئلة بتساعدنا نعتني فيكِ خلال ريتريت الصحراء. كمّليها بعد التسجيل ودفع العربون — بنفس الاسم ورقم التلفون اللي سجّيتيهم.",
      stepName1: "عنكِ",
      stepName2: "تجربتك",
      stepOf: "خطوة {n} من {total} · {name}",
      requiredNote: "الحقول المطلوبة واضحة؛ الباقي اختياري إلا إذا مذكور.",
      optional: "(اختياري)",
      secContact: "بياناتك",
      fullName: "الاسم الكامل",
      phone: "رقم التلفون (واتساب)",
      phoneHint: "نفس الرقم اللي في استمارة التسجيل.",
      age: "العمر",
      city: "مكان السكن",
      secExperience: "الهدف والعناية",
      secIntentSub: "اكتبي على راحتك، ما في جواب صح أو غلط.",
      reason: "شو اللي شدّك لهاد الريتريت؟",
      expectation: "شو بتتمنّي تاخدي من هالتجربة؟",
      yogaExp: "في عندك تجربة قبل هيك باليوغا أو التأمّل؟",
      y1: "لا، هاي أول مرة",
      y2: "آه، تجربة بسيطة",
      y3: "آه، بمارس بشكل منتظم",
      healthQ: "في عندك حالة صحية جسدية لازم نعرف عنها؟",
      no: "لا",
      yes: "آه",
      healthDetails: "تفاصيل صحية إضافية",
      activitiesLabel: "أي أنشطة بتشدّك أكتر؟",
      activitiesHint: "فيكِ تختاري أكتر من وحدة.",
      a1: "يوغا وتنفّس",
      a2: "كتابة تأمّلية",
      a3: "Sound Healing",
      a4: "طقوس الصحراء والنار",
      a5: "المشي التأمّلي",
      a6: "دوائر مشاركة",
      a7: "السهرات تحت النجوم",
      freeNote: "في إشي كمان حابّة تشاركينا فيه؟",
      prev: "رجوع",
      next: "التالي",
      submit: "إرسال الاستمارة الصحية",
      sending: "عم نبعت…",
      failTitle: "الاستمارة ما وصلت هالمرة",
      failText: "إجاباتك لسّا هون. جرّبي كمان مرة، أو ابعتيلنا واتساب.",
      failRetry: "جرّبي كمان مرة",
      failWhatsapp: "ابعتيلنا واتساب",
      waFail: "مرحبا نوال، أنا {name}. حاولت أبعت الاستمارة الصحية لوادي رم بس ما زبطت.",
      successTitle: "وصلت الاستمارة، شكرًا إلك",
      successText: "رح نتواصل معكِ إذا احتجنا أي توضيح قبل الريتريت.",
      successBack: "الرجوع لصفحة الريتريت",
      contactLead: "لأي سؤال:",
      errName: "اكتبي اسمك لو سمحتي.",
      errPhone: "محتاجين رقمك.",
      errPhoneFormat: "الرقم مش واضح، جرّبي مع رمز الدولة.",
      errAge: "اكتبي عمرك.",
      errAgeFormat: "العمر لازم يكون رقم، 16 أو أكتر.",
      errReason: "شاركينا شو شدّك للريتريت.",
      errYoga: "اختاري وحدة من الخيارات.",
      errHealth: "اختاري لا أو آه.",
      errActivities: "اختاري نشاط واحد على الأقل.",
      errSummaryOne: "في حقل محتاج تكمّليه.",
      errSummaryMany: "في {n} حقول محتاجة تكمّليها.",
      docTitle: "الاستمارة الصحية | ريتريت وادي رم"
    }
  };

  function readLang() {
    try {
      var stored = localStorage.getItem("nawal-lang");
      if (stored === "ar" || stored === "en") return stored;
    } catch (_e) {}
    return document.documentElement.getAttribute("lang") === "en" ? "en" : "ar";
  }
  var currentLang = readLang();

  function t(key, vars) {
    var text = translations[currentLang][key];
    if (text == null) text = translations.en[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { text = text.split("{" + k + "}").join(vars[k]); });
    return text;
  }

  function toLatinDigits(value) {
    return String(value || "").replace(/[\u0660-\u0669\u06F0-\u06F9]/g, function (d) {
      return String("٠١٢٣٤٥٦٧٨٩".indexOf(d));
    });
  }

  function normalizePhone(value) {
    var phone = toLatinDigits(value).trim().replace(/[\s\-().\/\u200e\u200f]/g, "");
    if (phone.indexOf("00") === 0) phone = "+" + phone.slice(2);
    return phone;
  }

  function renderStepLabel() {
    if (stepLabel) stepLabel.textContent = t("stepOf", { n: current, total: TOTAL, name: t("stepName" + current) });
  }

  function applyLang() {
    var root = document.documentElement;
    root.lang = currentLang;
    root.dir = currentLang === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("nawal-lang", currentLang); } catch (_e) {}
    document.title = t("docTitle");
    document.querySelectorAll(".wadi-health [data-t]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-t"));
    });
    renderStepLabel();
    if (!sending) {
      submitBtn.textContent = t(submitBtn.hidden ? "next" : "submit");
      if (!submitBtn.hidden) submitBtn.textContent = t("submit");
      nextBtn.textContent = t("next");
      prevBtn.textContent = t("prev");
    }
  }

  function setLang(lang) {
    if (lang !== "ar" && lang !== "en") return;
    currentLang = lang;
    applyLang();
  }

  function showStep(n, moveFocus) {
    current = n;
    steps.forEach(function (step) {
      step.hidden = Number(step.getAttribute("data-step")) !== n;
    });
    if (progress) {
      progress.querySelectorAll("[data-step-dot]").forEach(function (dot) {
        var i = Number(dot.getAttribute("data-step-dot"));
        dot.classList.toggle("is-done", i < n);
        dot.classList.toggle("is-active", i === n);
        if (i === n) dot.setAttribute("aria-current", "step");
        else dot.removeAttribute("aria-current");
      });
    }
    prevBtn.hidden = n === 1;
    nextBtn.hidden = n === TOTAL;
    submitBtn.hidden = n !== TOTAL;
    renderStepLabel();
    if (moveFocus) {
      var heading = document.getElementById("healthStepTitle" + n);
      if (heading) heading.focus({ preventScroll: true });
    }
  }

  var statusEl = document.getElementById("healthFormStatus");

  function value(id) {
    var el = form.querySelector("#" + id);
    return el ? (el.value || "").trim() : "";
  }
  function groupInputs(name) {
    return Array.prototype.slice.call(form.querySelectorAll('input[name="' + name + '"]'));
  }
  function groupChecked(name) {
    return groupInputs(name).some(function (input) { return input.checked; });
  }

  var RULES = {
    fullName: { step: 1, check: function () { return value("fullName") ? "" : "errName"; } },
    phone: {
      step: 1,
      check: function () {
        if (!value("phone")) return "errPhone";
        return /^\+?\d{9,15}$/.test(normalizePhone(value("phone"))) ? "" : "errPhoneFormat";
      }
    },
    age: {
      step: 1,
      check: function () {
        var raw = toLatinDigits(value("age"));
        if (!raw) return "errAge";
        var ageEl = form.querySelector("#age");
        var min = ageEl ? Number(ageEl.getAttribute("data-min")) || 16 : 16;
        var age = Number(raw);
        return /^\d{1,3}$/.test(raw) && age >= min && age <= 120 ? "" : "errAgeFormat";
      }
    },
    reason: { step: 2, check: function () { return value("reason") ? "" : "errReason"; } },
    yoga: { step: 2, group: "خبرة يوغا/تأمل", check: function () { return groupChecked("خبرة يوغا/تأمل") ? "" : "errYoga"; } },
    health: { step: 2, group: "حالة صحية حالية", check: function () { return groupChecked("حالة صحية حالية") ? "" : "errHealth"; } },
    activities: { step: 2, group: "اهتمامات الأنشطة", check: function () { return groupChecked("اهتمامات الأنشطة") ? "" : "errActivities"; } }
  };

  function focusTarget(key) {
    var rule = RULES[key];
    return rule.group ? groupInputs(rule.group)[0] : form.querySelector("#" + key);
  }

  function setFieldError(key, errKey) {
    var rule = RULES[key];
    var errEl = document.getElementById("err-" + key);
    if (errEl) errEl.textContent = errKey ? t(errKey) : "";
    var target = focusTarget(key);
    if (target) {
      var field = target.closest(".field, .choice-group, fieldset");
      if (field) field.classList.toggle("has-error", !!errKey);
      target.setAttribute("aria-invalid", errKey ? "true" : "false");
    }
  }

  function validateSteps(upToStep) {
    var errors = [];
    Object.keys(RULES).forEach(function (key) {
      var rule = RULES[key];
      if (rule.step > upToStep) return;
      var errKey = rule.check();
      setFieldError(key, errKey);
      if (errKey) errors.push(key);
    });
    if (errors.length && statusEl) {
      statusEl.textContent = t(errors.length === 1 ? "errSummaryOne" : "errSummaryMany", { n: errors.length });
    } else if (statusEl) statusEl.textContent = "";
    if (errors.length) {
      var first = focusTarget(errors[0]);
      if (first) first.focus({ preventScroll: true });
      return false;
    }
    return true;
  }

  function goNext() {
    if (!validateSteps(current)) return;
    showStep(Math.min(current + 1, TOTAL), true);
  }

  function goPrev() {
    showStep(Math.max(current - 1, 1), true);
  }

  nextBtn.addEventListener("click", goNext);
  prevBtn.addEventListener("click", goPrev);

  var failEl = document.getElementById("healthFail");
  var failWa = document.getElementById("healthFailWa");
  var honeypot = document.getElementById("healthWebsite");
  var sending = false;
  var MIN_FILL_MS = 2500;
  var viewedAt = Date.now();
  var WA_BASE = failWa ? failWa.getAttribute("href").split("?")[0] : "";

  function looksLikeBot() {
    return !!(honeypot && honeypot.value) || Date.now() - viewedAt < MIN_FILL_MS;
  }

  function waHref(msgKey, name) {
    return WA_BASE + "?text=" + encodeURIComponent(t(msgKey, { name: name }));
  }

  async function sendHealthForm() {
    var now = new Date();
    var payload = {
      id: "wr-health-" + now.getTime(),
      source: "wadi-rum-health",
      retreatType: "Wadi Rum Health Form",
      submittedAt: now.toISOString(),
      fullName: value("fullName"),
      phone: normalizePhone(value("phone")),
      age: toLatinDigits(value("age")),
      city: value("city"),
      reason: value("reason"),
      expectation: value("expectation"),
      yogaExperience: (form.querySelector('input[name="خبرة يوغا/تأمل"]:checked') || {}).value || "",
      healthStatus: (form.querySelector('input[name="حالة صحية حالية"]:checked') || {}).value || "",
      healthDetails: value("healthDetails"),
      activities: Array.prototype.map.call(
        form.querySelectorAll('input[name="اهتمامات الأنشطة"]:checked'),
        function (x) { return x.value; }
      ),
      freeNote: value("freeNote"),
      status: "pending",
      createdAt: now.toISOString()
    };

    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 20000) : 0;
    var res = await fetch("/api/retreat-request", {
      method: "POST",
      signal: controller ? controller.signal : undefined,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    }).finally(function () { clearTimeout(timer); });
    if (!res.ok) {
      var errBody = await res.json().catch(function () { return {}; });
      throw new Error(errBody.error || "Health form submit failed");
    }
    return payload;
  }

  function showSuccess() {
    form.hidden = true;
    if (contactBox) contactBox.hidden = true;
    if (progress) progress.hidden = true;
    okMsg.hidden = false;
    okMsg.scrollIntoView({ block: "center" });
    okMsg.focus({ preventScroll: true });
  }

  function showFail() {
    if (failWa) failWa.setAttribute("href", waHref("waFail", value("fullName")));
    failEl.hidden = false;
    failEl.scrollIntoView({ block: "center" });
    failEl.focus({ preventScroll: true });
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (sending) return;
    if (current < TOTAL) {
      goNext();
      return;
    }
    if (!validateSteps(TOTAL)) return;
    if (looksLikeBot()) return;
    failEl.hidden = true;
    sending = true;
    submitBtn.textContent = t("sending");
    submitBtn.setAttribute("aria-disabled", "true");
    try {
      await sendHealthForm();
      if (window.nawalAnalytics && typeof window.nawalAnalytics.markComplete === "function") {
        window.nawalAnalytics.markComplete("wadi-rum-health");
      }
      showSuccess();
    } catch (_err) {
      showFail();
    } finally {
      sending = false;
      submitBtn.removeAttribute("aria-disabled");
      submitBtn.textContent = t("submit");
    }
  });

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-lang-set]");
    if (btn) setLang(btn.getAttribute("data-lang-set") === "ar" ? "ar" : "en");
  });
  document.addEventListener("nawal:langchange", function (e) {
    if (e.detail && e.detail.lang) setLang(e.detail.lang);
  });
  window.addEventListener("nawal-lang-change", function (e) {
    if (e.detail && e.detail.lang) setLang(e.detail.lang);
  });

  form.classList.add("is-stepped");
  if (progress) progress.hidden = false;
  showStep(1, false);
  applyLang();
})();
