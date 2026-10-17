import { guardResponse, requireAdminAccess } from '@/lib/admin-auth';
import { collapseLinkedBookingRows } from '@/lib/commerce/admin-booking-rows';
import { filterRegistrationRowsForSession } from '@/lib/admin/source-scope';
import { PERMISSION } from '@/lib/admin/permissions';
import { SUPABASE_TABLE_RETREAT_REQUESTS, supabaseSelect } from '@/lib/commerce/supabase';

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

  const collapsed = collapseLinkedBookingRows(rows);
  const scoped = filterRegistrationRowsForSession(collapsed, guard.session);
  return Response.json({ ok: true, rows: scoped });
}
