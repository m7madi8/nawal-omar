(function () {
  var form = document.getElementById("wadiRegForm");
  if (!form || form.getAttribute("data-bound") === "1") return;
  form.setAttribute("data-bound", "1");

  var okMsg = document.getElementById("okMsg");
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
      badge: "🌙 Wadi Rum Retreat",
      backLink: "Back to retreat",
      title: "Initial Registration | Wadi Rum Desert Retreat",
      lead1: "This form is for initial registration. Seats are limited (up to 20 participants), and we will contact you after submission to confirm details.",
      lead2: "Wadi Rum retreat is a return path: to your body, your breath, and your inner calm. Full details are in the retreat page.",
      note: "Wadi Rum Retreat – SHARAZAD CAMP",
      noteDuration: "5 days - 4 nights",
      pricesAria: "Prices",
      pricePanorama: "Panorama Room — 3,650 ₪",
      priceBubbles: "Bubbles Room — 3,850 ₪",
      stepName1: "Contact",
      stepName2: "About you",
      stepName3: "Your experience",
      stepOf: "Step {n} of {total} · {name}",
      requiredNote: "All fields are required unless marked optional.",
      optional: "(optional)",
      secBasic: "Basic Information",
      fullName: "Full Name",
      phone: "Phone Number (WhatsApp)",
      phoneHint: "With country code, e.g. +972 or +970",
      secAbout: "A little about you",
      age: "Age",
      city: "City",
      secIntent: "Your Intention",
      secIntentSub: "Write freely. There is no right or wrong answer.",
      reason: "What made you interested in this retreat?",
      expectation: "What do you hope to receive from this experience?",
      secHealth: "Physical & Mental Background",
      yogaExp: "Do you have previous experience with yoga or meditation?",
      y1: "No, this is my first time",
      y2: "Yes, basic experience",
      y3: "Yes, I practice regularly",
      healthQ: "Do you currently have a physical condition we should know about?",
      no: "No",
      yes: "Yes",
      healthDetails: "Additional details",
      secActivities: "Activities & Experience",
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
      nextTitle: "What happens next?",
      nextText: "We'll have a short getting-to-know-you call, then you secure your place with a first deposit of 400 ₪ (bank transfer or Bit).",
      riskText: "Sending a request is free and non-binding.",
      policyLink: "Payment & cancellation terms",
      privacy: "We only use your details to contact you about the retreat.",
      prev: "Back",
      next: "Next",
      submit: "Send my request — free, no commitment",
      sending: "Sending…",
      failTitle: "The request didn't go through this time",
      failText: "Your details are still here. Try again, or message us on WhatsApp and we'll continue from there.",
      failRetry: "Try again",
      failWhatsapp: "Message us on WhatsApp",
      waFail: "Hi Nawal, I'm {name}. I tried to register for the Wadi Rum retreat (22–26.10) but the form didn't go through.",
      successTitle: "Your request arrived, thank you",
      successTitleNamed: "Your request arrived, thank you {name}",
      successText: "We'll get in touch soon for a short getting-to-know-you call. After that, you secure your place with a first deposit of 400 ₪.",
      successBack: "Back to the retreat page",
      successWhatsapp: "Questions? Message us on WhatsApp",
      waOk: "Hi Nawal, I'm {name}. I just sent a registration request for the Wadi Rum retreat (22–26.10).",
      contactLead: "For questions:",
      errName: "Please write your name.",
      errPhone: "We need your number so we can call you.",
      errPhoneFormat: "This number doesn't look right — try writing it with the country code.",
      errAge: "Please write your age.",
      errAgeFormat: "Age must be a number, 16 or above.",
      errYoga: "Please pick one of the options.",
      errHealth: "Please choose No or Yes.",
      errActivities: "Please choose at least one activity.",
      errSummaryOne: "One field needs your attention.",
      errSummaryMany: "{n} fields need your attention.",
      docTitle: "Initial Registration | Wadi Rum Desert Retreat"
    },
    ar: {
      badge: "🌙 ريتريت وادي رم",
      backLink: "الرجوع للريتريت",
      title: "التسجيل الأوّلي | ريتريت الصحراء – وادي رم",
      lead1: "هاي استمارة تسجيل أوّلي. العدد محدود (لحد 20 مشاركة)، وبعد ما تبعتيها منحكي معكِ لنأكّد التفاصيل.",
      lead2: "ريتريت وادي رم هو طريق رجوع: لجسمك، لنَفَسك، وللمساحة الهادية جوّاكِ. كل التفاصيل موجودة بصفحة الريتريت.",
      note: "ريتريت وادي رم – SHARAZAD CAMP",
      noteDuration: "5 أيام - 4 ليالي",
      pricesAria: "الأسعار",
      pricePanorama: "غرفة بانوراما — 3,650 ₪",
      priceBubbles: "غرفة بابلز — 3,850 ₪",
      stepName1: "التواصل",
      stepName2: "عنكِ",
      stepName3: "تجربتك",
      stepOf: "خطوة {n} من {total} · {name}",
      requiredNote: "كل الحقول مطلوبة إلا اللي مكتوب جنبها اختياري.",
      optional: "(اختياري)",
      secBasic: "البيانات الأساسية",
      fullName: "الاسم الكامل",
      phone: "رقم التلفون (واتساب)",
      phoneHint: "مع رمز الدولة، مثلاً ‎+972 أو ‎+970",
      secAbout: "شوي عنكِ",
      age: "العمر",
      city: "مكان السكن",
      secIntent: "الهدف من المشاركة",
      secIntentSub: "اكتبي على راحتك، ما في جواب صح أو غلط.",
      reason: "شو اللي شدّك لهاد الريتريت؟",
      expectation: "شو بتتمنّي تاخدي من هالتجربة؟",
      secHealth: "الخلفية الجسدية والنفسية",
      yogaExp: "في عندك تجربة قبل هيك باليوغا أو التأمّل؟",
      y1: "لا، هاي أول مرة",
      y2: "آه، تجربة بسيطة",
      y3: "آه، بمارس بشكل منتظم",
      healthQ: "في عندك حالة صحية جسدية لازم نعرف عنها؟",
      no: "لا",
      yes: "آه",
      healthDetails: "تفاصيل إضافية",
      secActivities: "الأنشطة والتجربة",
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
      nextTitle: "شو بصير بعد ما تبعتي؟",
      nextText: "منحكي معكِ مكالمة تعارف قصيرة، وبعدها بتثبّتي مكانك بدفعة أولى 400 ₪ (تحويل بنكي أو Bit).",
      riskText: "إرسال الطلب مجاني وبدون التزام.",
      policyLink: "شروط الدفع والإلغاء",
      privacy: "منستعمل معلوماتك بس عشان نتواصل معكِ بخصوص الريتريت.",
      prev: "رجوع",
      next: "التالي",
      submit: "ابعتي الطلب — مجاني وبدون التزام",
      sending: "عم نبعت…",
      failTitle: "الطلب ما وصل هالمرة",
      failText: "معلوماتك لسّا محفوظة هون. جرّبي كمان مرة، أو ابعتيلنا واتساب ومنكمّل من هناك.",
      failRetry: "جرّبي كمان مرة",
      failWhatsapp: "ابعتيلنا واتساب",
      waFail: "مرحبا نوال، أنا {name}. حاولت أسجّل لريتريت وادي رم (22–26.10) بس الاستمارة ما زبطت.",
      successTitle: "وصل طلبك، شكرًا إلك",
      successTitleNamed: "وصل طلبك، شكرًا إلك يا {name}",
      successText: "رح نحكي معكِ قريب لمكالمة تعارف قصيرة، وبعدها بتثبّتي مكانك بدفعة أولى 400 ₪.",
      successBack: "الرجوع لصفحة الريتريت",
      successWhatsapp: "عندك سؤال؟ ابعتيلنا واتساب",
      waOk: "مرحبا نوال، أنا {name}. هلّأ بعتت طلب تسجيل لريتريت وادي رم (22–26.10).",
      contactLead: "لأي سؤال أو استفسار:",
      errName: "اكتبي اسمك لو سمحتي.",
      errPhone: "محتاجين رقمك عشان نحكي معكِ.",
      errPhoneFormat: "الرقم مش واضح، جرّبي تكتبيه مع رمز الدولة.",
      errAge: "اكتبي عمرك لو سمحتي.",
      errAgeFormat: "العمر لازم يكون رقم، 16 أو أكتر.",
      errYoga: "اختاري وحدة من الخيارات.",
      errHealth: "اختاري لا أو آه.",
      errActivities: "اختاري نشاط واحد على الأقل.",
      errSummaryOne: "في حقل محتاج تكمّليه.",
      errSummaryMany: "في {n} حقول محتاجة تكمّليها.",
      docTitle: "التسجيل الأوّلي | ريتريت وادي رم"
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

  function firstName() {
    var name = (form.querySelector("#fullName").value || "").replace(/\s+/g, " ").trim();
    return name ? name.split(" ")[0] : "";
  }

  function renderStepLabel() {
    stepLabel.textContent = t("stepOf", { n: current, total: TOTAL, name: t("stepName" + current) });
  }

  function applyLang() {
    var root = document.documentElement;
    root.lang = currentLang;
    root.dir = currentLang === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("nawal-lang", currentLang); } catch (_e) {}
    document.title = t("docTitle");
    document.querySelectorAll(".wadi-reg [data-t]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-t"));
    });
    document.querySelectorAll(".wadi-reg [data-t-attr]").forEach(function (el) {
      var pair = el.getAttribute("data-t-attr").split(":");
      el.setAttribute(pair[0], t(pair[1]));
    });
    renderStepLabel();
    document.dispatchEvent(new CustomEvent("wr-reg:lang"));
  }

  function setLang(lang) {
    if (lang !== "ar" && lang !== "en") return;
    currentLang = lang;
    applyLang();
  }

  /* ---------- Steps ---------- */
  function scrollToForm() {
    var header = document.querySelector(".site-header");
    var offset = (header ? header.getBoundingClientRect().height : 0) + 16;
    var top = progress.getBoundingClientRect().top + window.pageYOffset - offset;
    if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: "auto" });
  }

  function showStep(n, moveFocus) {
    current = n;
    steps.forEach(function (step) {
      step.hidden = Number(step.getAttribute("data-step")) !== n;
    });
    progress.querySelectorAll("[data-step-dot]").forEach(function (dot) {
      var i = Number(dot.getAttribute("data-step-dot"));
      dot.classList.toggle("is-done", i < n);
      dot.classList.toggle("is-active", i === n);
      if (i === n) dot.setAttribute("aria-current", "step");
      else dot.removeAttribute("aria-current");
    });
    prevBtn.hidden = n === 1;
    nextBtn.hidden = n === TOTAL;
    submitBtn.hidden = n !== TOTAL;
    renderStepLabel();
    if (moveFocus) {
      scrollToForm();
      var heading = document.getElementById("stepTitle" + n);
      if (heading) heading.focus({ preventScroll: true });
    }
  }

  /* ---------- Validation ---------- */
  var statusEl = document.getElementById("regFormStatus");

  function value(id) {
    return (form.querySelector("#" + id).value || "").trim();
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
      step: 2,
      check: function () {
        var raw = toLatinDigits(value("age"));
        if (!raw) return "errAge";
        var age = Number(raw);
        var min = Number(form.querySelector("#age").getAttribute("data-min")) || 0;
        return /^\d{1,3}$/.test(raw) && age >= min && age <= 120 ? "" : "errAgeFormat";
      }
    },
    yoga: { step: 3, group: "خبرة يوغا/تأمل", check: function () { return groupChecked("خبرة يوغا/تأمل") ? "" : "errYoga"; } },
    health: { step: 3, group: "حالة صحية حالية", check: function () { return groupChecked("حالة صحية حالية") ? "" : "errHealth"; } },
    activities: { step: 3, group: "اهتمامات الأنشطة", check: function () { return groupChecked("اهتمامات الأنشطة") ? "" : "errActivities"; } }
  };

  function focusTarget(key) {
    var rule = RULES[key];
    return rule.group ? groupInputs(rule.group)[0] : form.querySelector("#" + key);
  }

  function setFieldError(key, errKey) {
    var rule = RULES[key];
    var errEl = document.getElementById("err-" + key);
    var invalid = errKey ? "true" : null;
    var targets = rule.group ? groupInputs(rule.group).concat(document.getElementById("grp-" + key)) : [form.querySelector("#" + key)];
    targets.forEach(function (el) {
      if (invalid) el.setAttribute("aria-invalid", invalid);
      else el.removeAttribute("aria-invalid");
    });
    errEl.setAttribute("data-msg", errKey || "");
    var text = errKey ? t(errKey) : "";
    if (errEl.textContent !== text) errEl.textContent = text;
  }

  function validateField(key) {
    var errKey = RULES[key].check();
    setFieldError(key, errKey);
    if (!errKey && statusEl.getAttribute("data-msg") && !Object.keys(RULES).some(hasError)) setStatus("");
    return !errKey;
  }

  function hasError(key) {
    return !!document.getElementById("err-" + key).getAttribute("data-msg");
  }

  function setStatus(msgKey, vars) {
    statusEl.setAttribute("data-msg", msgKey || "");
    statusEl.setAttribute("data-vars", vars ? JSON.stringify(vars) : "");
    statusEl.textContent = msgKey ? t(msgKey, vars) : "";
  }

  function validateSteps(upTo) {
    var invalid = Object.keys(RULES).filter(function (key) {
      return RULES[key].step <= upTo && !validateField(key);
    });
    if (!invalid.length) {
      setStatus("");
      return true;
    }
    var firstStep = RULES[invalid[0]].step;
    var onStep = invalid.filter(function (key) { return RULES[key].step === firstStep; });
    if (firstStep !== current) showStep(firstStep, false);
    setStatus(onStep.length === 1 ? "errSummaryOne" : "errSummaryMany", { n: onStep.length });
    var target = focusTarget(onStep[0]);
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "center" });
    return false;
  }

  Object.keys(RULES).forEach(function (key) {
    var rule = RULES[key];
    if (rule.group) {
      groupInputs(rule.group).forEach(function (input) {
        input.addEventListener("change", function () { if (hasError(key)) validateField(key); });
      });
      return;
    }
    var input = form.querySelector("#" + key);
    input.addEventListener("blur", function () {
      if (value(key) || hasError(key)) validateField(key);
    });
    input.addEventListener("input", function () {
      if (hasError(key)) validateField(key);
    });
  });

  document.addEventListener("wr-reg:lang", function () {
    form.querySelectorAll(".field-error[data-msg]").forEach(function (el) {
      var msg = el.getAttribute("data-msg");
      el.textContent = msg ? t(msg) : "";
    });
    var statusMsg = statusEl.getAttribute("data-msg");
    if (statusMsg) statusEl.textContent = t(statusMsg, JSON.parse(statusEl.getAttribute("data-vars") || "null"));
  });

  function goNext() {
    if (!validateSteps(current)) return;
    showStep(Math.min(current + 1, TOTAL), true);
  }

  prevBtn.addEventListener("click", function () { showStep(Math.max(current - 1, 1), true); });
  nextBtn.addEventListener("click", goNext);

  /* ---------- Submit (payload shape must stay identical: admin dashboard + Supabase columns depend on it) ---------- */
  function toLatinDigits(value) {
    return String(value || "")
      .replace(/[\u0660-\u0669]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
      .replace(/[\u06F0-\u06F9]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); });
  }

  function normalizePhone(value) {
    var phone = toLatinDigits(value).trim().replace(/[\s\-().\/\u200e\u200f]/g, "");
    if (phone.indexOf("00") === 0) phone = "+" + phone.slice(2);
    return phone;
  }

  async function sendToSupabase() {
    var supabaseUrl = (form.getAttribute("data-supabase-url") || "").trim().replace(/\/+$/, "");
    var supabaseKey = (form.getAttribute("data-supabase-anon-key") || "").trim();
    var table = (form.getAttribute("data-supabase-table") || "retreat_requests").trim();
    if (!supabaseUrl || !supabaseKey || !table) throw new Error("Missing Supabase config");

    var now = new Date();
    var payload = {
      id: "req-" + now.getTime(),
      source: "wadi-rum-registration",
      retreatType: "Initial Registration | Wadi Rum Desert Retreat",
      submittedAt: now.toISOString(),
      fullName: (form.querySelector("#fullName").value || "").trim(),
      phone: normalizePhone(form.querySelector("#phone").value),
      age: toLatinDigits(form.querySelector("#age").value).trim(),
      city: (form.querySelector("#city").value || "").trim(),
      reason: (form.querySelector("#reason").value || "").trim(),
      expectation: (form.querySelector("#expectation").value || "").trim(),
      yogaExperience: (form.querySelector('input[name="خبرة يوغا/تأمل"]:checked') || {}).value || "",
      healthStatus: (form.querySelector('input[name="حالة صحية حالية"]:checked') || {}).value || "",
      healthDetails: (form.querySelector("#healthDetails").value || "").trim(),
      activities: Array.prototype.map.call(form.querySelectorAll('input[name="اهتمامات الأنشطة"]:checked'), function (x) { return x.value; }),
      freeNote: (form.querySelector("#freeNote").value || "").trim(),
      status: "pending",
      createdAt: now.toISOString()
    };

    var res = await fetch(supabaseUrl + "/rest/v1/" + encodeURIComponent(table), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": supabaseKey,
        "Authorization": "Bearer " + supabaseKey,
        "Prefer": "return=representation"
      },
      body: JSON.stringify([payload])
    });
    if (!res.ok) {
      var errTxt = await res.text().catch(function () { return ""; });
      throw new Error(errTxt || "Supabase request failed");
    }
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (current < TOTAL) { goNext(); return; }
    if (!validateSteps(TOTAL)) return;
    try {
      await sendToSupabase();
      form.hidden = true;
      progress.hidden = true;
      okMsg.hidden = false;
      form.reset();
    } catch (_err) {
      document.getElementById("regFail").hidden = false;
    }
  });

  /* ---------- Language ---------- */
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
  progress.hidden = false;
  showStep(1, false);
  applyLang();
})();
