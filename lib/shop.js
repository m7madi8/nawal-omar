import { COMMERCE_WHATSAPP, PAYMENT_METHODS, paymentLabel } from '@/lib/commerce/constants';
import {
  PRODUCT_CATALOG,
  SHOP_COLORS,
  getProduct,
  getProductColor,
} from '@/lib/commerce/catalog/products';
import { parseOrderNote, siteUrlFromRequest } from '@/lib/commerce/orders';
import { retrieveStripeSession, stripeProvider } from '@/lib/commerce/payment/stripe';
import { whatsappOrderUrl } from '@/lib/commerce/checkout';
import {
  SUPABASE_TABLE_RETREAT_REQUESTS,
  supabaseGetById,
  supabaseInsert,
  supabaseUpdate,
} from '@/lib/commerce/supabase';

export const SHOP_WHATSAPP = COMMERCE_WHATSAPP;
export const SHOP_PRODUCTS = Object.fromEntries(
  Object.entries(PRODUCT_CATALOG).map(([id, product]) => [
    id,
    {
      id: product.id,
      nameEn: product.title.en,
      nameAr: product.title.ar,
      priceUsd: product.pricing.amount,
      priceCents: product.pricing.amountCents,
    },
  ]),
);
export { SHOP_COLORS, PAYMENT_METHODS, paymentLabel };

export function getShopProduct(id) {
  const product = getProduct(id);
  if (!product) return null;
  return {
    id: product.id,
    nameEn: product.title.en,
    nameAr: product.title.ar,
    priceUsd: product.pricing.amount,
    priceCents: product.pricing.amountCents,
  };
}

export function getShopColor(id) {
  return getProductColor(id);
}

export { siteUrlFromRequest, retrieveStripeSession };

export async function insertShopOrder(row) {
  return supabaseInsert(SUPABASE_TABLE_RETREAT_REQUESTS, row);
}

export async function updateShopOrder(id, patch) {
  return supabaseUpdate(SUPABASE_TABLE_RETREAT_REQUESTS, id, patch);
}

export async function getShopOrder(id) {
  return supabaseGetById(SUPABASE_TABLE_RETREAT_REQUESTS, id);
}

export function parseShopNote(row) {
  const note = parseOrderNote(row?.freeNote);
  if (note) return note;

  const raw = row?.freeNote;
  if (raw && raw !== '-') {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {
      /* ignore */
    }
  }
  return {};
}

export function markOrderPaid(row, stripeSessionId) {
  const note = parseShopNote(row);
  note.paid = true;
  note.stripeSessionId = stripeSessionId || note.stripeSessionId || '';
  return {
    yogaExperience: 'paid',
    healthDetails: stripeSessionId || row.healthDetails || '',
    freeNote: JSON.stringify(note),
  };
}

export function buildShopOrderRow({
  product,
  color,
  qty,
  fullName,
  phone,
  city,
  payment,
  stripeSessionId,
}) {
  const now = new Date().toISOString();
  const quantity = Math.min(5, Math.max(1, Number(qty) || 1));
  const amountUsd = product.priceUsd * quantity;
  const note = {
    productId: product.id,
    productName: product.nameEn,
    color: color.en,
    colorId: color.id,
    qty: quantity,
    priceUsd: product.priceUsd,
    amountUsd,
    payment,
    paid: false,
    stripeSessionId: stripeSessionId || '',
  };

  return {
    id: `req-shop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    source: 'shop-order',
    retreatType: `${product.nameEn} · ${color.en}`,
    submittedAt: now,
    fullName,
    phone,
    city: city || '',
    age: '',
    reason: `${paymentLabel(payment)} · $${amountUsd} · ${product.nameEn} · ${color.en} × ${quantity}`,
    expectation: '',
    yogaExperience: 'unpaid',
    healthStatus: payment,
    healthDetails: stripeSessionId || '',
    activities: [],
    freeNote: JSON.stringify(note),
    status: 'pending',
    createdAt: now,
  };
}

export { whatsappOrderUrl };

export async function createStripeCheckoutSession({
  product,
  color,
  qty,
  orderId,
  successUrl,
  cancelUrl,
}) {
  const order = { id: orderId, payment_method: 'stripe' };
  const items = [
    {
      commerce_type: 'product',
      item_id: product.id,
      title: product.nameEn,
      quantity: qty,
      unit_price: product.priceUsd,
      currency: 'USD',
      metadata: {
        color: color.en,
        colorId: color.id,
        productName: product.nameEn,
      },
    },
  ];
  return stripeProvider.createPaymentSession({ order, items, successUrl, cancelUrl });
}
