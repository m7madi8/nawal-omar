/**
 * Event booking: price tier + card (Hyp/demo) or manual + WhatsApp.
 * Call nawalEventCheckout.boot({ ... }) from each event page script.
 */
(function (global) {
  var WA = "972522496366";

  var EVENT_TIERS = {
    "sound-healing": [
      { id: "member", labelKey: "events_sh_price_member_label", amount: 100 },
      { id: "guest", labelKey: "events_sh_price_guest_label", amount: 130 },
    ],
    "ice-bath": [
      { id: "member", labelKey: "events_ib_price_member_label", amount: 650 },
      { id: "guest", labelKey: "events_ib_price_guest_label", amount: 680 },
    ],
    "nature-chocolate": [
      { id: "member", labelKey: "events_nc_price_member_label", amount: 360 },
      { id: "guest", labelKey: "events_nc_price_guest_label", amount: 400 },
    ],
  };

  var paymentOptions = { hyp: false, demo: false };

  function t(key) {
    if (global.nawalI18n && typeof global.nawalI18n.t === "function") {
      var text = global.nawalI18n.t(key);
      if (text) return text;
    }
    var lang = (global.nawalI18n && global.nawalI18n.getLang && global.nawalI18n.getLang()) || "ar";
    if (global.nawalI18n && global.nawalI18n.t) return global.nawalI18n.t(lang, key);
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
        paymentOptions = { hyp: false, manual: true };
      });
  }

  function tierAmount(eventId, tierId) {
    var tiers = EVENT_TIERS[eventId] || [];
    for (var i = 0; i < tiers.length; i++) {
      if (tiers[i].id === tierId) return tiers[i].amount;
    }
    return tiers[0] ? tiers[0].amount : 0;
  }

  function boot(cfg) {
    var modal = document.getElementById(cfg.modalId);
    var closeBtn = document.getElementById(cfg.closeId);
    var form = document.getElementById(cfg.formId);
    var success = cfg.successId ? document.getElementById(cfg.successId) : null;
    var submitBtn = cfg.submitBtnId ? document.getElementById(cfg.submitBtnId) : form && form.querySelector("button[type=submit]");
    var triggers = document.querySelectorAll(cfg.triggerSelector);
    if (!modal || !closeBtn || !form || !triggers.length) return;

    var eventId = cfg.eventId;
    var tiers = EVENT_TIERS[eventId] || [];
    var selectedTier = tiers[0] ? tiers[0].id : "member";
    var preferCard = false;

    var paymentSection = document.getElementById(cfg.paymentSectionId);
    if (!paymentSection) {
      paymentSection = document.createElement("div");
      paymentSection.id = cfg.paymentSectionId;
      paymentSection.className = "event-pay-section";
      if (submitBtn) form.insertBefore(paymentSection, submitBtn);
      else form.appendChild(paymentSection);
    }

    loadPaymentOptions().then(function () {
      renderPaymentChoices();
      ensurePanelPayButton();
      refreshPanelCopy();
      if (global.nawalI18n && typeof global.nawalI18n.apply === "function") {
        global.nawalI18n.apply(document);
      }
    });

    function refreshPanelCopy() {
      var notice = document.querySelector("[data-i18n='events_sh_booking_notice']");
      if (notice && paymentOptions.hypLive) {
        notice.setAttribute("data-i18n", "events_sh_booking_notice_card");
        notice.textContent = t("events_sh_booking_notice_card");
      }
    }

    function updateSubmitLabel() {
      if (!submitBtn) return;
      var span = submitBtn.querySelector("span") || submitBtn;
      var payEl = form.querySelector('input[name="eventPayment"]:checked');
      var payMethod = payEl ? payEl.value : "manual";
      var key = payMethod === "hyp" && paymentOptions.hyp ? "event_pay_submit" : cfg.submitLabelKey || "events_sh_register_confirm";
      span.setAttribute("data-i18n", key);
      span.textContent = t(key);
    }

    function renderPaymentChoices() {
      var amount = tierAmount(eventId, selectedTier);
      var cardDefault = amount > 0 && paymentOptions.hyp && (preferCard || paymentOptions.hypLive);
      var html = "";
      if (tiers.length > 1) {
        html += '<p class="event-pay-label">' + t("event_pay_tier_label") + "</p>";
        tiers.forEach(function (tier, idx) {
          html +=
            '<label class="event-pay-option"><input type="radio" name="eventPriceTier" value="' +
            tier.id +
            '"' +
            (idx === 0 ? " checked" : "") +
            "> " +
            t(tier.labelKey) +
            " — <strong dir=\"ltr\">" +
            formatMoney(tier.amount) +
            "</strong></label>";
        });
      } else if (amount > 0) {
        html +=
          '<p class="event-pay-amount">' +
          t("haifa_pay_amount_label") +
          ': <strong dir="ltr">' +
          formatMoney(amount) +
          "</strong></p>";
      }

      if (amount > 0 && paymentOptions.hyp) {
        html += '<p class="event-pay-label">' + t("haifa_pay_title") + "</p>";
        html +=
          '<label class="event-pay-option"><input type="radio" name="eventPayment" value="hyp"' +
          (cardDefault ? " checked" : "") +
          "> " +
          t(paymentOptions.demo ? "haifa_pay_card_demo" : "haifa_pay_card") +
          "</label>";
      }

      html +=
        '<label class="event-pay-option"><input type="radio" name="eventPayment" value="manual"' +
        (cardDefault ? "" : " checked") +
        "> " +
        t("haifa_pay_manual") +
        "</label>";
      html +=
        '<p class="event-pay-hint">' +
        t(paymentOptions.hypLive ? "haifa_pay_online_hint" : "haifa_pay_manual_hint") +
        "</p>";
      paymentSection.innerHTML = html;

      paymentSection.querySelectorAll('input[name="eventPayment"]').forEach(function (input) {
        input.addEventListener("change", updateSubmitLabel);
      });
      updateSubmitLabel();

      paymentSection.querySelectorAll('input[name="eventPriceTier"]').forEach(function (input) {
        input.addEventListener("change", function () {
          if (input.checked) {
            selectedTier = input.value;
            renderPaymentChoices();
          }
        });
      });
    }

    function ensurePanelPayButton() {
      if (!paymentOptions.hyp || !cfg.actionsSelector) return;
      var anchor = document.querySelector(cfg.actionsSelector);
      if (!anchor) return;
      var existing = document.getElementById(cfg.payButtonId);
      if (existing) {
        existing.hidden = false;
        return;
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.id = cfg.payButtonId;
      btn.className = cfg.payButtonClass || "ny-book-btn-primary event-pay-panel-btn";
      btn.setAttribute("data-i18n", paymentOptions.demo ? "event_pay_btn_demo" : "event_pay_btn");
      btn.textContent = t(paymentOptions.demo ? "event_pay_btn_demo" : "event_pay_btn");
      var registerBtn = anchor.querySelector(cfg.triggerSelector.split(",")[0].trim()) || triggers[0];
      if (registerBtn && registerBtn.parentNode === anchor) {
        registerBtn.insertAdjacentElement("beforebegin", btn);
      } else {
        anchor.insertBefore(btn, anchor.firstChild);
      }
      if (paymentOptions.hypLive && registerBtn) {
        registerBtn.classList.add("ny-book-btn-secondary");
      }
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        preferCard = true;
        renderPaymentChoices();
        openModal();
      });
    }

    function openModal() {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      var nameInput = form.querySelector('[name="fullName"]');
      if (nameInput) nameInput.focus();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
      preferCard = false;
    }

    function showSuccess(message) {
      if (global.nawalThankYou && typeof global.nawalThankYou.show === "function") {
        global.nawalThankYou.show({ name: message });
        return;
      }
      if (!success) return;
      if (message) success.textContent = message;
      success.hidden = false;
      success.classList.remove("is-show");
      global.requestAnimationFrame(function () {
        success.classList.add("is-show");
      });
      global.setTimeout(function () {
        success.classList.remove("is-show");
        success.hidden = true;
      }, 4500);
    }

    function whatsappManualUrl(fullName, phone, amount) {
      var lines = [
        "Hello Nawal,",
        "",
        t(cfg.retreatTypeKey),
        "Name: " + fullName,
        "Phone: " + phone,
        amount > 0 ? "Amount: " + formatMoney(amount) : "",
        "",
        "I will pay via Bit or bank transfer as discussed.",
        "Thank you.",
      ].filter(Boolean);
      return "https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n"));
    }

    async function submitManual(fullName, phone, notes) {
      var api =
        global.nawalRetreatRequest && global.nawalRetreatRequest.submitEventRegistration;
      if (!api) throw new Error("Registration unavailable");
      await api({
        eventId: eventId,
        fullName: fullName,
        phone: phone,
        notes: notes,
      });
    }

    async function startOnlineCheckout(fullName, phone, notes) {
      var tierInput = form.querySelector('input[name="eventPriceTier"]:checked');
      var priceTier = tierInput ? tierInput.value : selectedTier;
      var res = await fetch("/api/commerce/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          commerceType: "event",
          itemId: eventId,
          priceTier: priceTier,
          payment: "hyp",
          customer: { fullName: fullName, phone: phone, city: cfg.city || "" },
          notes: notes,
          cancelUrl: cfg.returnPath || global.location.pathname,
        }),
      });
      var data = await res.json().catch(function () {
        return {};
      });
      if (!res.ok || !data.url) {
        var err = new Error(data.error || "Checkout failed");
        err.code = data.code || (res.status === 503 ? "COMMERCE_DB_NETWORK" : undefined);
        throw err;
      }
      global.location.href = data.url;
    }

    function handleReturnQuery() {
      var params = new URLSearchParams(global.location.search);
      if (params.get("payment") === "success" && params.get("order")) {
        showSuccess(t("event_register_paid_success"));
        if (global.history && global.history.replaceState) {
          global.history.replaceState({}, "", cfg.returnPath || global.location.pathname);
        }
      } else if (params.get("payment") === "failed") {
        showSuccess(t("event_register_payment_failed"));
      }
    }

    triggers.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        preferCard = !!paymentOptions.hypLive;
        renderPaymentChoices();
        openModal();
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
      var fullName = String((form.fullName && form.fullName.value) || "").trim();
      var phone = String((form.phone && form.phone.value) || "").trim();
      var notes = String((form.notes && form.notes.value) || "").trim();
      if (!fullName || !phone) return;

      var tierInput = form.querySelector('input[name="eventPriceTier"]:checked');
      selectedTier = tierInput ? tierInput.value : selectedTier;
      var amount = tierAmount(eventId, selectedTier);
      var payEl = form.querySelector('input[name="eventPayment"]:checked');
      var payMethod = payEl ? payEl.value : "manual";

      if (submitBtn) submitBtn.disabled = true;
      try {
        if (payMethod === "hyp" && amount > 0 && paymentOptions.hyp) {
          await startOnlineCheckout(fullName, phone, notes);
          return;
        }

        await submitManual(fullName, phone, notes);
        form.reset();
        closeModal();
        showSuccess(t(cfg.successMessageKey || "events_sh_register_success"));

        if (amount > 0) {
          var openWa = global.confirm(t("haifa_pay_open_whatsapp_confirm"));
          if (openWa) {
            global.open(whatsappManualUrl(fullName, phone, amount), "_blank", "noopener,noreferrer");
          }
        }
      } catch (err) {
        console.error(err);
        if (err.code === "COMMERCE_DB_NOT_READY") {
          alert(t("event_checkout_db_not_ready"));
        } else if (err.code === "COMMERCE_DB_SCHEMA") {
          alert(t("event_checkout_db_schema"));
        } else if (err.code === "COMMERCE_DB_NETWORK") {
          alert(t("event_checkout_server_error"));
        } else if (err.code === "HYP_DISABLED" || err.code === "BOOKING_CLOSED") {
          alert(t("haifa_pay_card_unavailable"));
        } else {
          alert(t(cfg.errorKey || "events_sh_register_error"));
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });

    handleReturnQuery();
  }

  global.nawalEventCheckout = { boot: boot, loadPaymentOptions: loadPaymentOptions };
})(window);
