import { getPublicSupabaseAnonKey } from './commerce/supabase.js';

/**
 * Browser-safe Supabase destination (anon key only). Never includes service role.
 * @returns {{ url: string, key: string, table: string } | null}
 */
export function getPublicSupabaseBrowserConfig() {
  const url = String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const key = getPublicSupabaseAnonKey();
  const table = String(process.env.SUPABASE_TABLE || 'retreat_requests').trim();
  if (!url || !key) return null;
  return { url, key, table };
}
