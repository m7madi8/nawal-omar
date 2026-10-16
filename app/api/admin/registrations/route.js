import { guardResponse, requireAdminAccess } from '@/lib/admin-auth';
import { PERMISSION } from '@/lib/admin/permissions';
import { SUPABASE_TABLE_RETREAT_REQUESTS, supabaseSelect } from '@/lib/commerce/supabase';
import { collapseLinkedBookingRows } from '@/lib/commerce/admin-booking-rows';

export async function GET(request) {
  const guard = await requireAdminAccess(request, { permission: PERMISSION.REGISTRATIONS_READ });
  const denied = guardResponse(guard);
  if (denied) return denied;

  const limit = Math.min(5000, Math.max(1, Number(request.nextUrl.searchParams.get('limit')) || 5000));
  const rows =
    (await supabaseSelect(
      SUPABASE_TABLE_RETREAT_REQUESTS,
      `select=*&order=submittedAt.desc.nullslast,createdAt.desc.nullslast&limit=${limit}`,
    )) || [];

  // One logical booking = one row (request + its checkout mirror are collapsed; nothing is deleted).
  return Response.json({ ok: true, rows: collapseLinkedBookingRows(rows) });
}
