/**
 * Back-compat alias — same module as retreat-request-submit.js for older built pages.
 */
(function (global) {
  if (global.nawalRetreatRequest) {
    if (!global.nawalCommerceRegistration) {
      global.nawalCommerceRegistration = {
        submitEventRegistration: global.nawalRetreatRequest.submitEventRegistration.bind(global.nawalRetreatRequest)
      };
    }
    return;
  }

  var SUPABASE_URL = "https://xzxyskufrqansbhsbdkt.supabase.co";
  var SUPABASE_ANON_KEY = "sb_publishable_V9_4QWGDFv6Vm-4DQifYGA_1xdoKkph";
  var SUPABASE_TABLE = "retreat_requests";

  var EVENTS = {
    "ice-bath": {
      source: "ice-bath-registration",
      idPrefix: "req-ice-book",
      retreatTypeKey: "events_ib_register_event",
      city: "Hofit",
      defaultReason: "Ice bath day retreat booking",
      freeNote: "Booking from events/ice-bath"
    },
    "sound-healing": {
      source: "sound-healing-registration",
      idPrefix: "req-sh",
      retreatTypeKey: "events_sh_register_event",
      city: "Haifa, Atlit",
      defaultReason: "Sound Healing registration",
      freeNote: "Booking from events/sound-healing"
    },
    "nature-chocolate": {
      source: "nature-chocolate-registration",
      idPrefix: "req-nc",
      retreatTypeKey: "events_nc_register_event",
      city: "Al-Bqeia",
      defaultReason: "Nature & Chocolate booking",
      freeNote: "Booking from events/nature-chocolate"
    }
  };

  function t(key) {
    var lang = (global.nawalI18n && global.nawalI18n.getLang && global.nawalI18n.getLang()) || "ar";
    if (global.nawalI18n && global.nawalI18n.t) return global.nawalI18n.t(lang, key);
    return key;
  }

  function buildPayload(options) {
    var now = new Date();
    var idPrefix = options.idPrefix || "req";
    return {
      id: options.id || idPrefix + "-" + now.getTime(),
      source: options.source,
      retreatType: options.retreatType || "",
      submittedAt: now.toISOString(),
      fullName: options.fullName,
      phone: options.phone,
      age: options.age || "",
      city: options.city || "",
      reason: options.reason || "",
      expectation: options.expectation || "",
      yogaExperience: options.yogaExperience || "",
      healthStatus: options.healthStatus || "",
      healthDetails: options.healthDetails || "",
      activities: options.activities || [],
      freeNote: options.freeNote || "",
      status: "pending",
      createdAt: now.toISOString()
    };
  }

  async function submitDirect(payload) {
    var res = await fetch(SUPABASE_URL + "/rest/v1/" + encodeURIComponent(SUPABASE_TABLE), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: "Bearer " + SUPABASE_ANON_KEY,
        Prefer: "return=minimal"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      var detail = await res.text().catch(function () {
        return "";
      });
      var err = new Error(detail || "Registration submit failed");
      err.code = "SUBMIT_FAILED";
      err.status = res.status;
      throw err;
    }

    return { ok: true, id: payload.id };
  }

  async function submitViaApi(payload) {
    var res = await fetch("/api/retreat-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    var data = await res.json().catch(function () {
      return {};
    });

    if (!res.ok) {
      var err = new Error(data.error || "Registration submit failed");
      err.code = data.code || "SUBMIT_FAILED";
      err.status = res.status;
      throw err;
    }

    return data;
  }

  async function submit(payload) {
    try {
      var result = await submitViaApi(payload);
      notifySuccess(payload);
      return result;
    } catch (apiErr) {
      console.warn("[nawalRetreatRequest] API submit failed, trying direct Supabase", apiErr);
      var fallback = await submitDirect(payload);
      notifySuccess(payload);
      return fallback;
    }
  }

  function notifySuccess(payload) {
    if (global.nawalThankYou && typeof global.nawalThankYou.show === "function") {
      global.nawalThankYou.show({ name: payload && payload.fullName });
    }
  }

  async function submitEventRegistration(options) {
    var eventId = options.eventId;
    var config = EVENTS[eventId];
    if (!config) {
      var unknown = new Error("Unknown event");
      unknown.code = "UNKNOWN_EVENT";
      throw unknown;
    }

    return submit(
      buildPayload({
        idPrefix: config.idPrefix,
        source: config.source,
        retreatType: t(config.retreatTypeKey),
        fullName: options.fullName,
        phone: options.phone,
        city: config.city,
        reason: options.notes || config.defaultReason,
        freeNote: options.notes || config.freeNote
      })
    );
  }

  global.nawalRetreatRequest = {
    submit: submit,
    buildPayload: buildPayload,
    submitEventRegistration: submitEventRegistration
  };

  global.nawalCommerceRegistration = {
    submitEventRegistration: submitEventRegistration
  };
})(window);
