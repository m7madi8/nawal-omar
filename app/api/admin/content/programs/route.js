import { guardResponse, requireAdminAccess } from '@/lib/admin-auth';
import { buildAdminProgramRegistry } from '@/lib/admin/program-registry.js';
import { PERMISSION } from '@/lib/admin/permissions';

export async function GET(request) {
  const guard = await requireAdminAccess(request, { permission: PERMISSION.CONTENT_READ });
  const denied = guardResponse(guard);
  if (denied) return denied;

  return Response.json({
    ok: true,
    programs: buildAdminProgramRegistry(),
  });
}
