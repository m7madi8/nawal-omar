const SUPABASE_URL = (process.env.SUPABASE_URL || 'https://xzxyskufrqansbhsbdkt.supabase.co').replace(/\/+$/, '');
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || 'sb_publishable_V9_4QWGDFv6Vm-4DQifYGA_1xdoKkph';

export const SUPABASE_TABLE_RETREAT_REQUESTS = process.env.SUPABASE_TABLE || 'retreat_requests';
export const SUPABASE_TABLE_ORDERS = process.env.SUPABASE_COMMERCE_ORDERS_TABLE || 'commerce_orders';
export const SUPABASE_TABLE_ORDER_ITEMS =
  process.env.SUPABASE_COMMERCE_ORDER_ITEMS_TABLE || 'commerce_order_items';

export function supabaseHeaders(prefer = 'return=representation') {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    Prefer: prefer,
  };
}

export async function supabaseInsert(table, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${encodeURIComponent(table)}`, {
    method: 'POST',
    headers: supabaseHeaders('return=representation'),
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to insert into ${table}`);
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
