/**
 * Dormant cart module — ready for future multi-item checkout.
 * Not wired to public CTAs yet.
 */
(function (global) {
  var STORAGE_KEY = "nawal-commerce-cart";

  function readCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { items: [], updatedAt: null };
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.items)) return { items: [], updatedAt: null };
      return parsed;
    } catch (_err) {
      return { items: [], updatedAt: null };
    }
  }

  function writeCart(cart) {
    cart.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    return cart;
  }

  function normalizeItem(input) {
    return {
      commerceType: String(input.commerceType || ""),
      itemId: String(input.itemId || ""),
      quantity: Math.max(1, Number(input.quantity) || 1),
      options: input.options && typeof input.options === "object" ? input.options : {}
    };
  }

  function itemKey(item) {
    return [item.commerceType, item.itemId, JSON.stringify(item.options || {})].join("::");
  }

  function addItem(input) {
    var item = normalizeItem(input);
    if (!item.commerceType || !item.itemId) {
      throw new Error("commerceType and itemId are required");
    }

    var cart = readCart();
    var key = itemKey(item);
    var existing = cart.items.find(function (entry) {
      return itemKey(entry) === key;
    });

    if (existing) {
      existing.quantity = Math.max(1, Number(existing.quantity) + item.quantity);
    } else {
      cart.items.push(item);
    }

    return writeCart(cart);
  }

  function getCart() {
    return readCart();
  }

  function clearCart() {
    return writeCart({ items: [], updatedAt: new Date().toISOString() });
  }

  function removeItem(commerceType, itemId, options) {
    var cart = readCart();
    var key = itemKey(normalizeItem({ commerceType: commerceType, itemId: itemId, options: options }));
    cart.items = cart.items.filter(function (entry) {
      return itemKey(entry) !== key;
    });
    return writeCart(cart);
  }

  global.nawalCommerceCart = {
    addItem: addItem,
    getCart: getCart,
    clearCart: clearCart,
    removeItem: removeItem,
    STORAGE_KEY: STORAGE_KEY
  };
})(window);
