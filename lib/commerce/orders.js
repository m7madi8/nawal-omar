import { ORDER_STATUS, PAYMENT_STATUS } from './constants.js';
import {
  SUPABASE_TABLE_ORDER_ITEMS,
  SUPABASE_TABLE_ORDERS,
  supabaseGetById,
  supabaseInsert,
  supabaseSelect,
  supabaseUpdate,
} from './supabase.js';

export function createOrderId() {
  return `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createOrderItemId() {
  return `oi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function buildOrder({
  customer,
  paymentMethod = 'manual',
  currency = 'ILS',
  subtotal = 0,
  total = 0,
  metadata = {},
}) {
  const now = new Date().toISOString();
  return {
    id: createOrderId(),
    status: ORDER_STATUS.PENDING,
    payment_status: PAYMENT_STATUS.UNPAID,
    payment_method: paymentMethod,
    currency,
    subtotal,
    total,
    customer,
    metadata,
    created_at: now,
    updated_at: now,
  };
}

export function buildOrderItem({
  orderId,
  commerceType,
  itemId,
  title,
  quantity = 1,
  unitPrice = 0,
  currency = 'ILS',
  metadata = {},
}) {
  const now = new Date().toISOString();
  return {
    id: createOrderItemId(),
    order_id: orderId,
    commerce_type: commerceType,
    item_id: itemId,
    title,
    quantity: Math.max(1, Number(quantity) || 1),
    unit_price: unitPrice,
    currency,
    metadata,
    created_at: now,
  };
}

export function serializeOrderNote(order, items = []) {
  return JSON.stringify({
    commerceOrderId: order.id,
    commerceType: items[0]?.commerce_type || null,
    status: order.status,
    paymentStatus: order.payment_status,
    paymentMethod: order.payment_method,
    currency: order.currency,
    subtotal: order.subtotal,
    total: order.total,
    items: items.map((item) => ({
      commerceType: item.commerce_type,
      itemId: item.item_id,
      title: item.title,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      currency: item.currency,
      metadata: item.metadata,
    })),
  });
}

export function parseOrderNote(raw) {
  if (!raw || raw === '-') return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.commerceOrderId) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

export async function insertOrder(order) {
  return supabaseInsert(SUPABASE_TABLE_ORDERS, order);
}

export async function insertOrderItem(item) {
  return supabaseInsert(SUPABASE_TABLE_ORDER_ITEMS, item);
}

export async function getOrder(id) {
  return supabaseGetById(SUPABASE_TABLE_ORDERS, id);
}

export async function getOrderItems(orderId) {
  return supabaseSelect(
    SUPABASE_TABLE_ORDER_ITEMS,
    `order_id=eq.${encodeURIComponent(orderId)}&select=*`,
  );
}

export async function updateOrder(id, patch) {
  return supabaseUpdate(SUPABASE_TABLE_ORDERS, id, {
    ...patch,
    updated_at: new Date().toISOString(),
  });
}

export async function markOrderPaid(orderId, providerSessionId = '') {
  const order = await getOrder(orderId);
  if (!order) return null;

  const metadata = {
    ...(order.metadata || {}),
    providerSessionId: providerSessionId || order.metadata?.providerSessionId || '',
  };

  return updateOrder(orderId, {
    payment_status: PAYMENT_STATUS.PAID,
    status: ORDER_STATUS.CONFIRMED,
    metadata,
  });
}

export function siteUrlFromRequest(request) {
  const env = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (env) return env.startsWith('http') ? env.replace(/\/+$/, '') : `https://${env.replace(/\/+$/, '')}`;
  const origin = request.headers.get('origin');
  if (origin) return origin.replace(/\/+$/, '');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  return host ? `${proto}://${host}` : 'http://localhost:3000';
}
