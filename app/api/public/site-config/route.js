import { getPublicSupabaseBrowserConfig } from '@/lib/publicSupabaseConfig';

/**
 * Public runtime config for legacy browser scripts (anon key only, no secrets).
 */
export async function GET() {
  const supabase = getPublicSupabaseBrowserConfig();
  const body = `window.NAWAL_PUBLIC_SUPABASE=${JSON.stringify(supabase)};`;
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
