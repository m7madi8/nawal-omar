/**
 * On-site payment method chips (card / Apple Pay / bit). Checkout still opens Hyp hosted page.
 */
(function (global) {
  var METHODS = [
    { id: "card", key: "hyp_pay_option_card", hintKey: "hyp_pay_hint_card", mod: "card" },
    { id: "apple_pay", key: "hyp_pay_option_apple", hintKey: "hyp_pay_hint_apple", mod: "apple" },
    { id: "bit", key: "hyp_pay_option_bit", hintKey: "hyp_pay_hint_bit", mod: "bit" },
  ];

  var HINT_KEYS = {
    card: "hyp_pay_hint_card",
    apple_pay: "hyp_pay_hint_apple",
    bit: "hyp_pay_hint_bit",
  };

  function t(key) {
    if (global.nawalI18n && typeof global.nawalI18n.t === "function") {
      var lang =
        (global.nawalI18n.getLang && global.nawalI18n.getLang()) || "ar";
      return global.nawalI18n.t(lang, key) || key;
    }
    return key;
  }

  function mount(container, options) {
    if (!container) return;
    var inputName = (options && options.inputName) || "hypPayMethod";
    var defaultId = (options && options.defaultMethod) || "card";
    var labelId = "hyp-pay-methods-label-" + inputName;

    var html =
      '<div class="hyp-pay-methods" role="radiogroup" aria-labelledby="' +
      labelId +
      '">';
    html +=
      '<p id="' +
      labelId +
      '" class="hyp-pay-methods__title" data-i18n="hyp_pay_choose">' +
      t("hyp_pay_choose") +
      "</p>";
    html += '<div class="hyp-pay-methods__grid">';

    METHODS.forEach(function (m) {
      var checked = m.id === defaultId ? " checked" : "";
      html +=
        '<label class="hyp-pay-methods__chip hyp-pay-methods__chip--' +
        m.mod +
        '">' +
        '<input type="radio" name="' +
        inputName +
        '" value="' +
        m.id +
        '"' +
        checked +
        ">" +
        '<span class="hyp-pay-methods__label" data-i18n="' +
        m.key +
        '">' +
        t(m.key) +
        "</span></label>";
    });

    html += "</div>";
    html +=
      '<p class="hyp-pay-methods__hint hyp-pay-methods__hint--dynamic" role="status">' +
      t(HINT_KEYS[defaultId] || "hyp_pay_option_hyp_hint") +
      "</p>";
    html +=
      '<p class="hyp-pay-methods__hint hyp-pay-methods__hint--secondary" data-i18n="hyp_pay_option_hyp_hint">' +
      t("hyp_pay_option_hyp_hint") +
      "</p></div>";

    container.innerHTML = html;

    var hintEl = container.querySelector(".hyp-pay-methods__hint--dynamic");
    container.querySelectorAll('input[name="' + inputName + '"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (!hintEl || !radio.checked) return;
        var key = HINT_KEYS[radio.value] || "hyp_pay_option_hyp_hint";
        hintEl.textContent = t(key);
      });
    });
  }

  function getSelected(root, inputName) {
    var name = inputName || "hypPayMethod";
    var scope = root && root.querySelector ? root : document;
    var el = scope.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : "card";
  }

  global.nawalHypPayMethods = { mount: mount, getSelected: getSelected };
})(window);
