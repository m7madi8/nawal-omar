import { BOOKING_STATUS } from './constants.js';
import { COMMERCE_WHATSAPP, paymentLabel } from './constants.js';
import { getCatalogItem } from './catalog/index.js';
import { getEventPriceTier } from './catalog/events.js';
import { getProductColor } from './catalog/products.js';
import { assertAvailability } from './capacity.js';
import { buildLegacyMirrorRow, mirrorOrderToLegacy } from './legacy.js';
import {
  buildOrder,
  buildOrderItem,
  insertOrder,
  insertOrderItem,
  siteUrlFromRequest,
  updateOrder,
} from './orders.js';
import { createPaymentSession } from './payment/index.js';
import { isCommerceType } from './types.js';

function clean(value) {
  return String(value || '').trim();
}

function validateCustomer(customer) {
  const fullName = clean(customer?.fullName);
  const phone = clean(customer?.phone);
  if (!fullName || fullName.length < 2) {
    const error = new Error('Please enter your name');
    error.code = 'INVALID_CUSTOMER';
    throw error;
  }
  if (!phone || phone.replace(/\D/g, '').length < 8) {
    const error = new Error('Please enter a valid phone number');
    error.code = 'INVALID_CUSTOMER';
    throw error;
  }
  return {
    fullName,
    phone,
    city: clean(customer?.city),
    email: clean(customer?.email),
  };
}

function resolveLineItem(commerceType, itemId, options = {}) {
  const catalogItem = getCatalogItem(commerceType, itemId);
  if (!catalogItem) {
    const error = new Error('Unknown item');
    error.code = 'UNKNOWN_ITEM';
    throw error;
  }

  const quantity = Math.max(1, Number(options.quantity) || 1);

  if (commerceType === 'event') {
    if (catalogItem.bookingStatus === BOOKING_STATUS.CLOSED) {
      const error = new Error('Registration is closed for this event');
      error.code = 'BOOKING_CLOSED';
      throw error;
    }

    const tier = getEventPriceTier(catalogItem, options.priceTier || 'member');
    const unitPrice = tier?.amount || 0;
    const currency = catalogItem.pricing?.currency || 'ILS';

    return {
      catalogItem,
      orderItem: {
        commerceType,
        itemId,
        title: catalogItem.title.en,
        quantity,
        unitPrice,
        currency,
        metadata: {
          eventId: itemId,
          eventDate: catalogItem.date,
          numberOfParticipants: quantity,
          priceTier: tier?.id || 'member',
          participants: options.participants || [],
          notes: clean(options.notes),
          options: options.selectedOptions || {},
        },
      },
    };
  }

  if (commerceType === 'product') {
    const color = getProductColor(options.colorId || 'black');
    const unitPrice = catalogItem.pricing?.amount || 0;
    const currency = catalogItem.pricing?.currency || 'USD';

    return {
      catalogItem,
      orderItem: {
        commerceType,
        itemId,
        title: catalogItem.title.en,
        quantity: Math.min(5, quantity),
        unitPrice,
        currency,
        metadata: {
          productId: itemId,
          productName: catalogItem.title.en,
          color: color.en,
          colorId: color.id,
          notes: clean(options.notes),
        },
      },
    };
  }

  if (commerceType === 'lesson') {
    const packageId = options.packageId || 'trial';
    const pkg = catalogItem.packages?.[packageId] || catalogItem.packages?.trial;
    return {
      catalogItem,
      orderItem: {
        commerceType,
        itemId,
        title: catalogItem.title.en,
        quantity: 1,
        unitPrice: pkg?.amount || 0,
        currency: pkg?.currency || 'ILS',
        metadata: {
          packageId,
          notes: clean(options.notes),
        },
      },
    };
  }

  if (commerceType === 'retreat') {
    return {
      catalogItem,
      orderItem: {
        commerceType,
        itemId,
        title: catalogItem.title.en,
        quantity: 1,
        unitPrice: catalogItem.pricing?.amount || 0,
        currency: catalogItem.pricing?.currency || 'ILS',
        metadata: {
          eventDate: catalogItem.date,
          notes: clean(options.notes),
        },
      },
    };
  }

  const error = new Error('Unsupported commerce type');
  error.code = 'UNSUPPORTED_TYPE';
  throw error;
}

export function whatsappOrderUrl({ title, quantity, amount, currency, customer }) {
  const symbol = currency === 'USD' ? '$' : '₪';
  const lines = [
    "Hi Nawal, I'd like to place an order.",
    '',
    `${title} × ${quantity}`,
    `Total: ${symbol}${amount}`,
    `Name: ${customer.fullName}`,
    `Phone: ${customer.phone}`,
    customer.city ? `City: ${customer.city}` : '',
    'Payment: WhatsApp',
  ].filter(Boolean);
  return `https://wa.me/${COMMERCE_WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export async function processCheckout(body, request) {
  const commerceType = clean(body.commerceType);
  const itemId = clean(body.itemId || body.eventId || body.productId);
  const paymentMethod = clean(body.payment || body.paymentMethod) || 'manual';

  if (!isCommerceType(commerceType)) {
    const error = new Error('Invalid commerce type');
    error.code = 'INVALID_TYPE';
    throw error;
  }

  const customer = validateCustomer(body.customer || body);
  const { catalogItem, orderItem: line } = resolveLineItem(commerceType, itemId, {
    quantity: body.quantity || body.qty,
    priceTier: body.priceTier,
    colorId: body.colorId,
    packageId: body.packageId,
    notes: body.notes,
    participants: body.participants,
    selectedOptions: body.selectedOptions,
  });

  await assertAvailability({
    commerceType,
    itemId,
    quantity: line.quantity,
  });

  const subtotal = line.unitPrice * line.quantity;
  const order = buildOrder({
    customer,
    paymentMethod,
    currency: line.currency,
    subtotal,
    total: subtotal,
    metadata: {
      commerceType,
      itemId,
      legacySource: catalogItem.source,
    },
  });

  const savedOrder = await insertOrder(order);
  const orderId = savedOrder?.id || order.id;

  const item = buildOrderItem({
    orderId,
    commerceType: line.commerceType,
    itemId: line.itemId,
    title: line.title,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    currency: line.currency,
    metadata: line.metadata,
  });

  const savedItem = await insertOrderItem(item);
  const items = [savedItem || item];

  const legacyRow = buildLegacyMirrorRow({
    order: { ...order, id: orderId },
    items,
    catalogItem,
    customer,
    notes: clean(body.notes),
  });
  const mirrored = await mirrorOrderToLegacy(legacyRow);
  const legacyId = mirrored?.id || legacyRow.id;

  await updateOrder(orderId, {
    metadata: {
      ...order.metadata,
      legacyMirrorId: legacyId,
      providerSessionId: order.metadata?.providerSessionId || '',
    },
  });

  if (paymentMethod === 'whatsapp') {
    const waUrl = whatsappOrderUrl({
      title: line.title,
      quantity: line.quantity,
      amount: subtotal,
      currency: line.currency,
      customer,
    });
    return { ok: true, orderId, via: 'whatsapp', waUrl, legacyId };
  }

  if (paymentMethod === 'cash' || paymentMethod === 'paypal' || paymentMethod === 'manual') {
    return { ok: true, orderId, via: paymentMethod, legacyId };
  }

  if (paymentMethod === 'grow') {
    const error = new Error('Grow payments are not enabled');
    error.code = 'GROW_DISABLED';
    throw error;
  }

  if (paymentMethod === 'stripe') {
    const origin = siteUrlFromRequest(request);
    const session = await createPaymentSession({
      method: 'stripe',
      order: { ...order, id: orderId },
      items,
      successUrl: `${origin}/shop/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/shop?checkout=cancelled`,
    });

    await updateOrder(orderId, {
      metadata: {
        ...order.metadata,
        legacyMirrorId: legacyId,
        providerSessionId: session.sessionId,
      },
    });

    return {
      ok: true,
      orderId,
      via: 'stripe',
      url: session.url,
      legacyId,
    };
  }

  return { ok: true, orderId, via: paymentMethod, legacyId };
}

export function buildShopCheckoutBody(body) {
  return {
    commerceType: 'product',
    itemId: clean(body.productId),
    quantity: body.qty,
    payment: clean(body.payment),
    customer: {
      fullName: clean(body.fullName),
      phone: clean(body.phone),
      city: clean(body.city),
    },
    colorId: clean(body.colorId),
    notes: clean(body.notes),
  };
}

export function buildEventCheckoutBody({ eventId, customer, notes, quantity, priceTier }) {
  return {
    commerceType: 'event',
    itemId: eventId,
    quantity: quantity || 1,
    payment: 'manual',
    customer,
    notes,
    priceTier: priceTier || 'member',
  };
}
