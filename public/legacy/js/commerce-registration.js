/**
 * Shared helper for event registration via unified commerce checkout.
 */
(function (global) {
  async function submitEventRegistration({ eventId, fullName, phone, notes, quantity, priceTier }) {
    var res = await fetch("/api/commerce/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        commerceType: "event",
        itemId: eventId,
        eventId: eventId,
        quantity: quantity || 1,
        priceTier: priceTier || "member",
        payment: "manual",
        customer: {
          fullName: fullName,
          phone: phone
        },
        notes: notes || ""
      })
    });

    var data = {};
    try {
      data = await res.json();
    } catch (_err) {
      data = {};
    }

    if (!res.ok) {
      var err = new Error(data.error || "Registration failed");
      err.code = data.code || "CHECKOUT_FAILED";
      throw err;
    }

    return data;
  }

  global.nawalCommerceRegistration = {
    submitEventRegistration: submitEventRegistration
  };
})(window);
