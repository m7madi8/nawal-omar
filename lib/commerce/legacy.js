import { paymentLabel } from './constants.js';
import { getProductColor } from './catalog/products.js';
import { serializeOrderNote } from './orders.js';
import { SUPABASE_TABLE_RETREAT_REQUESTS, supabaseInsert } from './supabase.js';

function legacyRequestId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function buildLegacyMirrorRow({ order, items, catalogItem, customer, notes = '' }) {
  const now = new Date().toISOString();
  const item = items[0];
  const commerceType = item?.commerce_type;
  const source = catalogItem?.source || 'commerce-order';
  const retreatType =
    catalogItem?.metadata?.retreatTypeLabel ||
    item?.title ||
    catalogItem?.title?.en ||
    'Commerce order';

  const note = serializeOrderNote(order, items);
  const payment = order.payment_method;

  if (commerceType === 'product') {
    const meta = item?.metadata || {};
    const productName = meta.productName || item?.title || 'Shop order';
    const color = meta.color || '';
    const qty = item?.quantity || 1;
    const amountUsd = order.total;

    return {
      id: legacyRequestId('req-shop'),
      source: 'shop-order',
      retreatType: color ? `${productName} · ${color}` : productName,
      submittedAt: now,
      fullName: customer.fullName,
      phone: customer.phone,
      city: customer.city || '',
      age: '',
      reason: `${paymentLabel(payment)} · $${amountUsd} · ${productName}${color ? ` · ${color}` : ''} × ${qty}`,
      expectation: '',
      yogaExperience: order.payment_status === 'paid' ? 'paid' : 'unpaid',
      healthStatus: payment,
      healthDetails: order.metadata?.providerSessionId || '',
      activities: [],
      freeNote: JSON.stringify({
        commerceOrderId: order.id,
        productId: item.item_id,
        productName,
        color,
        colorId: meta.colorId || '',
        qty,
        priceUsd: item.unit_price,
        amountUsd,
        payment,
        paid: order.payment_status === 'paid',
        stripeSessionId: order.metadata?.providerSessionId || '',
      }),
      status: order.status === 'confirmed' ? 'completed' : 'pending',
      createdAt: now,
    };
  }

  const prefixBySource = {
    'sound-healing-registration': 'req-sh',
    'ice-bath-registration': 'req-ice-book',
    'nature-chocolate-registration': 'req-nc',
    'yoga-class-registration': 'req-haifa',
    'dahab-retreat-reserve': 'req-dahab',
    'wadi-rum-registration': 'req-wadi',
    'zanzibar-retreat-reserve': 'req-zanzibar',
  };

  const prefix = prefixBySource[source] || 'req-commerce';

  return {
    id: legacyRequestId(prefix),
    source,
    retreatType,
    submittedAt: now,
    fullName: customer.fullName,
    phone: customer.phone,
    age: '',
    city: customer.city || catalogItem?.location?.en || '',
    reason: notes || item?.metadata?.notes || retreatType,
    expectation: '',
    yogaExperience: order.payment_status === 'paid' ? 'paid' : '',
    healthStatus: payment === 'manual' ? '' : payment,
    healthDetails: order.metadata?.providerSessionId || '',
    activities: [],
    freeNote: note,
    status: 'pending',
    createdAt: now,
  };
}

export async function mirrorOrderToLegacy(row) {
  return supabaseInsert(SUPABASE_TABLE_RETREAT_REQUESTS, row);
}

export function buildProductLegacyNote({ order, item, product, color, qty }) {
  const quantity = Math.min(5, Math.max(1, Number(qty) || 1));
  const amountUsd = product.pricing.amount * quantity;
  const colorVariant = color || getProductColor('black');

  return {
    commerceOrderId: order.id,
    productId: product.id,
    productName: product.title.en,
    color: colorVariant.en,
    colorId: colorVariant.id,
    qty: quantity,
    priceUsd: product.pricing.amount,
    amountUsd,
    payment: order.payment_method,
    paid: order.payment_status === 'paid',
    stripeSessionId: order.metadata?.providerSessionId || '',
  };
}
