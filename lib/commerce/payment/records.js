import {
  SUPABASE_TABLE_PAYMENT_TRANSACTIONS,
  supabaseGetById,
  supabaseInsert,
  supabaseSelect,
  supabaseUpdate,
} from '../supabase.js';

export function createPaymentTransactionId() {
  return `ptx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function insertPaymentTransaction(row) {
  const id = row.id || createPaymentTransactionId();
  const now = new Date().toISOString();
  return supabaseInsert(SUPABASE_TABLE_PAYMENT_TRANSACTIONS, {
    ...row,
    id,
    created_at: now,
    updated_at: now,
  });
}

export async function updatePaymentTransaction(id, patch) {
  return supabaseUpdate(SUPABASE_TABLE_PAYMENT_TRANSACTIONS, id, {
    ...patch,
    updated_at: new Date().toISOString(),
  });
}

export async function getPaymentTransactionByHypId(hypTransactionId) {
  if (!hypTransactionId) return null;
  const rows = await supabaseSelect(
    SUPABASE_TABLE_PAYMENT_TRANSACTIONS,
    `hyp_transaction_id=eq.${encodeURIComponent(hypTransactionId)}&select=*&limit=1`,
  );
  return rows?.[0] || null;
}

export async function getPaymentTransaction(id) {
  return supabaseGetById(SUPABASE_TABLE_PAYMENT_TRANSACTIONS, id);
}
