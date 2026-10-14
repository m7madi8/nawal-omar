(function () {
  var LESSON_ID = "haifa-yoga";
  var WA = "972522496366";

  var packageLabelKeys = {
    trial: "haifa_pkg_trial",
    paytest: "haifa_pkg_paytest",
    pack4: "haifa_pkg_pack4",
    pack5: "haifa_pkg_pack5",
    single: "haifa_pkg_single",
    private1: "haifa_pkg_private1",
    private2: "haifa_pkg_private2",
    gift: "haifa_pkg_gift",
  };

  var packageAmounts = {
    trial: 65,
    paytest: 3,
    pack4: 260,
    pack5: 300,
    single: 75,
    private1: 200,
    private2: 300,
    gift: 0,
  };

  var paymentOptions = { hyp: false, online: false };

  function t(key) {
    if (window.nawalI18n && typeof window.nawalI18n.t === "function") {
      var text = window.nawalI18n.t(key);
      if (text) return text;
    }
    return key;
  }

  function formatMoney(amount) {
    return "₪" + (Number(amount) || 0);
  }

  function loadPaymentOptions() {
    return fetch("/api/commerce/payment-options", { headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        paymentOptions = data || paymentOptions;
      })
      .catch(function () {
        paymentOptions = { hyp: false, online: false, manual: true };
      });
  }

  function init() {
    var modal = document.getElementById("haifa-register-modal");
    var closeBtn = document.getElementById("haifa-register-close");
    var selectedEl = document.getElementById("haifa-register-selected");
    var form = document.getElementById("haifa-register-form");
    var success = document.getElementById("haifa-register-success");
    var triggers = document.querySelectorAll("[data-register-btn]");
    if (!modal || !closeBtn || !selectedEl || !form || !triggers.length) return;

    var selectedPackageKey = "trial";
    var paymentSection = document.getElementById("haifa-payment-section");
    if (!paymentSection) {
      paymentSection = document.createElement("div");
      paymentSection.id = "haifa-payment-section";
      paymentSection.className = "haifa-payment-section";
      var submitBtn = form.querySelector(".haifa-submit-btn");
      if (submitBtn) form.insertBefore(paymentSection, submitBtn);
    }

    loadPaymentOptions().then(function () {
      refreshPricingUi();
    });

    function refreshPricingUi() {
      var payP = document.querySelector('[data-i18n="jiva_payment_methods"]');
      if (payP) {
        var key =
          paymentOptions.hypLive ? "jiva_payment_methods_online" : paymentOptions.hyp ? "jiva_payment_methods_mixed" : "jiva_payment_methods";
        payP.setAttribute("data-i18n", key);
        payP.textContent = t(key);
      }
      document.querySelectorAll("[data-register-btn]").forEach(function (btn) {
        var span = btn.querySelector("span");
        var key = btn.getAttribute("data-package-key");
        var amount = packageAmounts[key] || 0;
        if (!span || amount <= 0) return;
        if (paymentOptions.hyp) {
          span.setAttribute("data-i18n", paymentOptions.hypLive ? "jiva_card_register_pay" : "jiva_card_register");
          span.textContent = t(paymentOptions.hypLive ? "jiva_card_register_pay" : "jiva_card_register");
        }
      });
      if (window.nawalI18n && typeof window.nawalI18n.apply === "function") {
        window.nawalI18n.apply(document);
      }
    }

    function updateSubmitLabel() {
      var submitSpan = form.querySelector(".haifa-submit-btn span");
      if (!submitSpan) return;
      var amount = packageAmounts[selectedPackageKey] || 0;
      var key =
        amount > 0 && paymentOptions.hyp ? "haifa_pay_submit" : "haifa_register_confirm";
      submitSpan.setAttribute("data-i18n", key);
      submitSpan.textContent = t(key);
    }

    function renderPaymentChoices() {
      var amount = packageAmounts[selectedPackageKey] || 0;
      var html = '<p class="haifa-field-label">' + t("haifa_pay_title") + "</p>";
      if (amount > 0) {
        html += '<p class="haifa-pay-amount">' + t("haifa_pay_amount_label") + ": <strong dir=\"ltr\">" + formatMoney(amount) + "</strong></p>";
      }
      if (amount > 0) {
        if (paymentOptions.hyp) {
          html += '<input type="hidden" name="haifaPayment" value="hyp">';
          html += '<div id="haifaHypPayMethodsMount"></div>';
        } else {
          html += '<p class="haifa-pay-hint is-error">' + t("haifa_pay_card_unavailable") + "</p>";
        }
      }
      paymentSection.innerHTML = html;
      if (amount > 0 && paymentOptions.hyp && window.nawalHypPayMethods) {
        var mount = document.getElementById("haifaHypPayMethodsMount");
        if (mount) window.nawalHypPayMethods.mount(mount);
      }
      updateSubmitLabel();
    }

    function portalModal(el) {
      if (el && el.parentElement && el.parentElement !== document.body) {
        document.body.appendChild(el);
      }
    }

    function openModal(pkgKey) {
      selectedPackageKey = pkgKey || "trial";
      selectedEl.textContent = t(packageLabelKeys[selectedPackageKey] || packageLabelKeys.trial);
      renderPaymentChoices();
      portalModal(modal);
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }

    function showSuccess(message) {
      success.textContent = message || t("haifa_register_success");
      success.hidden = false;
      success.classList.remove("is-show");
      window.requestAnimationFrame(function () {
        success.classList.add("is-show");
      });
      window.setTimeout(function () {
        success.classList.remove("is-show");
        success.hidden = true;
      }, 4500);
    }

    function whatsappManualUrl(fullName, phone, pkgLabel, amount) {
      var lines = [
        "Hello Nawal,",
        "",
        "I registered for Haifa Yoga:",
        pkgLabel,
        amount > 0 ? "Amount: " + formatMoney(amount) : "",
        "Name: " + fullName,
        "Phone: " + phone,
        "",
        "I will pay via Bit or bank transfer as discussed.",
        "Thank you.",
      ].filter(Boolean);
      return "https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n"));
    }

    async function submitRegistrationOnly(fullName, phone, pkgLabel) {
      var now = new Date();
      var payload = {
        id: "req-haifa-" + now.getTime(),
        source: "yoga-class-registration",
        retreatType: pkgLabel,
        submittedAt: now.toISOString(),
        fullName: fullName,
        phone: phone,
        age: "",
        city: "Haifa",
        reason: "Haifa yoga class registration",
        expectation: "",
        yogaExperience: "",
        healthStatus: "manual",
        healthDetails: "",
        activities: [],
        freeNote: JSON.stringify({
          packageId: selectedPackageKey,
          paymentMethod: "manual",
          bookingStatus: "new_request",
        }),
        status: "pending",
        bookingStatus: "new_request",
        createdAt: now.toISOString(),
      };

      var res = await fetch("/api/retreat-request", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        var errBody = await res.json().catch(function () {
          return {};
        });
        throw new Error(errBody.error || "Registration submit failed");
      }
    }

    async function startOnlineCheckout(fullName, phone, hypPayMethod) {
      var res = await fetch("/api/commerce/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          commerceType: "lesson",
          itemId: LESSON_ID,
          packageId: selectedPackageKey,
          payment: "hyp",
          hypPayMethod: hypPayMethod || "card",
          customer: { fullName: fullName, phone: phone, city: "Haifa" },
          notes: "Haifa yoga — " + t(packageLabelKeys[selectedPackageKey]),
        }),
      });
      var data = await res.json().catch(function () {
        return {};
      });
      if (!res.ok || !data.url) {
        var err = new Error(data.error || "Checkout failed");
        err.code = data.code;
        throw err;
      }
      window.location.href = data.url;
    }

    function handleReturnQuery() {
      var params = new URLSearchParams(window.location.search);
      if (params.get("order") && params.get("token")) {
        window.location.replace("/payment/thanks?" + params.toString());
        return;
      }
      if (params.get("payment") === "failed") {
        showSuccess(t("haifa_register_payment_failed"));
      }
    }

    triggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        openModal(btn.getAttribute("data-package-key") || "trial");
      });
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var fullName = String(form.fullName.value || "").trim();
      var phone = String(form.phone.value || "").trim();
      if (!fullName || !phone) return;

      var pkgLabel = t(packageLabelKeys[selectedPackageKey] || packageLabelKeys.trial);
      var amount = packageAmounts[selectedPackageKey] || 0;
      var submitBtn = form.querySelector(".haifa-submit-btn");
      if (submitBtn) submitBtn.disabled = true;

      try {
        if (amount > 0) {
          if (!paymentOptions.hyp) {
            alert(t("haifa_pay_card_unavailable"));
            return;
          }
          var hypPayMethod =
            window.nawalHypPayMethods && window.nawalHypPayMethods.getSelected(form);
          await startOnlineCheckout(fullName, phone, hypPayMethod);
          return;
        }

        await submitRegistrationOnly(fullName, phone, pkgLabel);
        form.reset();
        closeModal();
        showSuccess(t("haifa_register_success"));
      } catch (err) {
        console.error(err);
        if (
          err.code === "HYP_DISABLED" ||
          err.code === "HYP_NOT_CONFIGURED" ||
          err.code === "HYP_LIVE_TERMINAL_FORBIDDEN" ||
          err.code === "HYP_TEST_TERMINAL_IN_PRODUCTION" ||
          err.code === "DEPLOYMENT_MODE_REQUIRED" ||
          err.code === "DEPLOYMENT_MODE_INVALID"
        ) {
          alert(t("haifa_pay_card_unavailable"));
        } else {
          alert(t("haifa_register_error"));
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });

    handleReturnQuery();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
