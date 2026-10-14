import {
  adminRuntimeUnavailableResponse,
  adminUnauthorizedResponse,
  getAdminSession,
} from '@/lib/admin-auth';
import { getAdminRuntimeConfigIssue } from '@/lib/admin/admin-runtime';
import { apiPermissionsToViewIds } from '@/lib/admin/permissions';

export async function GET(request) {
  const configIssue = getAdminRuntimeConfigIssue();
  if (configIssue) {
    return adminRuntimeUnavailableResponse(configIssue);
  }
  const session = await getAdminSession(request);
  if (!session) {
    return adminUnauthorizedResponse();
  }
  return Response.json({
    ok: true,
    user: {
      username: session.username,
      name: session.name,
      role: session.role,
      staffId: session.staffId,
      viewOnly: session.viewOnly,
      permissions: apiPermissionsToViewIds(session.apiPermissions),
      locked: session.locked,
    },
  });
}
