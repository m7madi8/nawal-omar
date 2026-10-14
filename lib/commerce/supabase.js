function trimUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

/**
 * Server-side Supabase URL — must be set explicitly (no embedded project fallback).
 */
export function getServerSupabaseUrl() {
  const url = trimUrl(process.env.SUPABASE_URL);
  if (!url) {
    const err = new Error('SUPABASE_URL is not configured');
    err.code = 'SUPABASE_URL_MISSING';
    throw err;
  }
  return url;
}

/** @deprecated Prefer getServerSupabaseUrl() — throws when unset. */
export function getSupabaseUrl() {
  return getServerSupabaseUrl();
}

function resolveServerSupabaseKey() {
  const service = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!service) {
    const err = new Error('SUPABASE_SERVICE_ROLE_KEY is required for server database access');
    err.code = 'SUPABASE_SERVICE_ROLE_MISSING';
    throw err;
  }
  return { key: service, role: 'service' };
}

/**
 * Fail closed before commerce/payment/admin server writes.
 */
export function assertServerCommerceDatabaseConfigured() {
  getServerSupabaseUrl();
  resolveServerSupabaseKey();
}

export const SUPABASE_TABLE_RETREAT_REQUESTS = process.env.SUPABASE_TABLE || 'retreat_requests';
export const SUPABASE_TABLE_ORDERS = process.env.SUPABASE_COMMERCE_ORDERS_TABLE || 'commerce_orders';
export const SUPABASE_TABLE_ORDER_ITEMS =
  process.env.SUPABASE_COMMERCE_ORDER_ITEMS_TABLE || 'commerce_order_items';
export const SUPABASE_TABLE_ANALYTICS = process.env.SUPABASE_ANALYTICS_TABLE || 'site_analytics';
export const SUPABASE_TABLE_PAYMENT_TRANSACTIONS =
  process.env.SUPABASE_PAYMENT_TRANSACTIONS_TABLE || 'payment_transactions';
export const SUPABASE_TABLE_PAYMENT_ATTEMPTS =
  process.env.SUPABASE_PAYMENT_ATTEMPTS_TABLE || 'payment_attempts';
export const SUPABASE_TABLE_PAYMENT_RECEIPTS =
  process.env.SUPABASE_PAYMENT_RECEIPTS_TABLE || 'payment_receipts';
export const SUPABASE_TABLE_PAYMENT_LEDGER =
  process.env.SUPABASE_PAYMENT_LEDGER_TABLE || 'payment_ledger';
export const SUPABASE_TABLE_BOOKING_AUDIT =
  process.env.SUPABASE_BOOKING_AUDIT_TABLE || 'booking_audit_log';

/** Public anon key for browser registration forms only (env-only; never a server write key). */
export function getPublicSupabaseAnonKey() {
  return String(process.env.SUPABASE_ANON_KEY || '').trim();
}

export function supabaseHeaders(prefer = 'return=representation') {
  assertServerCommerceDatabaseConfigured();
  const { key } = resolveServerSupabaseKey();
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    apikey: key,
    Authorization: `Bearer ${key}`,
    Prefer: prefer,
  };
}

function serverRestBase(table) {
  return `${getServerSupabaseUrl()}/rest/v1/${encodeURIComponent(table)}`;
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
  if (
    message.includes('23505') ||
    message.includes('duplicate key') ||
    message.includes('payment_attempts_one_active_per_order')
  ) {
    const err = new Error('An active payment attempt already exists for this order');
    err.code = 'PAYMENT_SIGN_IN_PROGRESS';
    return err;
  }
  return error;
}

export async function supabaseInsert(table, row) {
  let res;
  const url = serverRestBase(table);
  const headers = supabaseHeaders('return=representation');
  try {
    res = await fetch(url, {
      method: 'POST',
      headers,
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
  const url = serverRestBase(table);
  const headers = supabaseHeaders('return=representation');
  const res = await fetch(`${url}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to update ${table}`);
  }
  const list = await res.json();
  return Array.isArray(list) ? list[0] : list;
}

export async function supabaseDelete(table, id) {
  const url = serverRestBase(table);
  const headers = supabaseHeaders('return=minimal');
  const res = await fetch(`${url}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers,
  });
  return res.ok;
}

export async function supabaseSelect(table, query = '') {
  const url = serverRestBase(table);
  const headers = supabaseHeaders('return=representation');
  const res = await fetch(`${url}?${query}`, {
    method: 'GET',
    headers,
  });
  if (!res.ok) return null;
  const list = await res.json();
  return Array.isArray(list) ? list : [];
}

export async function supabaseGetById(table, id) {
  const rows = await supabaseSelect(table, `id=eq.${encodeURIComponent(id)}&select=*`);
  return rows?.[0] || null;
}
