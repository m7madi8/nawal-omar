export const SUPABASE_URL = (process.env.SUPABASE_URL || 'https://xzxyskufrqansbhsbdkt.supabase.co').replace(/\/+$/, '');
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || 'sb_publishable_V9_4QWGDFv6Vm-4DQifYGA_1xdoKkph';

export const SUPABASE_TABLE_RETREAT_REQUESTS = process.env.SUPABASE_TABLE || 'retreat_requests';
export const SUPABASE_TABLE_ORDERS = process.env.SUPABASE_COMMERCE_ORDERS_TABLE || 'commerce_orders';
export const SUPABASE_TABLE_ORDER_ITEMS =
  process.env.SUPABASE_COMMERCE_ORDER_ITEMS_TABLE || 'commerce_order_items';
export const SUPABASE_TABLE_ANALYTICS = process.env.SUPABASE_ANALYTICS_TABLE || 'site_analytics';
export const SUPABASE_TABLE_PAYMENT_TRANSACTIONS =
  process.env.SUPABASE_PAYMENT_TRANSACTIONS_TABLE || 'payment_transactions';
export const SUPABASE_TABLE_PAYMENT_RECEIPTS =
  process.env.SUPABASE_PAYMENT_RECEIPTS_TABLE || 'payment_receipts';
export const SUPABASE_TABLE_PAYMENT_LEDGER =
  process.env.SUPABASE_PAYMENT_LEDGER_TABLE || 'payment_ledger';
export const SUPABASE_TABLE_BOOKING_AUDIT =
  process.env.SUPABASE_BOOKING_AUDIT_TABLE || 'booking_audit_log';

export function supabaseHeaders(prefer = 'return=representation') {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    Prefer: prefer,
  };
}

function enrichDataError(error, table) {
  const message = error?.message || '';
  if (message.includes('PGRST205') || message.includes('Could not find the table')) {
    const err = new Error(`Database table "${table}" is not set up yet`);
    err.code = 'COMMERCE_DB_NOT_READY';
    return err;
  }
  if (message.includes('PGRST204') || (message.includes('Could not find the') && message.includes('column'))) {
    const err = new Error(
      'Database schema is outdated. Run supabase/migrations/004_booking_payments.sql in Supabase SQL Editor.',
    );
    err.code = 'COMMERCE_DB_SCHEMA';
    return err;
  }
  if (message === 'fetch failed' || error?.cause?.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
    const err = new Error('Could not reach the database from the server');
    err.code = 'COMMERCE_DB_NETWORK';
    return err;
  }
  return error;
}

export async function supabaseInsert(table, row) {
  let res;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/${encodeURIComponent(table)}`, {
      method: 'POST',
      headers: supabaseHeaders('return=representation'),
      body: JSON.stringify(row),
    });
  } catch (error) {
    throw enrichDataError(error, table);
  }
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(text || `Failed to insert into ${table}`);
    throw enrichDataError(err, table);
  }
  const list = await res.json();
  return Array.isArray(list) ? list[0] : list;
}

export async function supabaseUpdate(table, id, patch) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${encodeURIComponent(table)}?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: supabaseHeaders('return=representation'),
      body: JSON.stringify(patch),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to update ${table}`);
  }
  const list = await res.json();
  return Array.isArray(list) ? list[0] : list;
}

export async function supabaseSelect(table, query = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${encodeURIComponent(table)}?${query}`, {
    method: 'GET',
    headers: supabaseHeaders('return=representation'),
  });
  if (!res.ok) return null;
  const list = await res.json();
  return Array.isArray(list) ? list : [];
}

export async function supabaseGetById(table, id) {
  const rows = await supabaseSelect(table, `id=eq.${encodeURIComponent(id)}&select=*`);
  return rows?.[0] || null;
}
