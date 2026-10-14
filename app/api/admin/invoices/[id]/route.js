import { guardResponse, requireAdminAccess } from '@/lib/admin-auth';
import { PERMISSION } from '@/lib/admin/permissions';
import { getInvoiceById } from '@/lib/commerce/invoices';

export async function GET(request, { params }) {
  const guard = await requireAdminAccess(request, { permission: PERMISSION.INVOICES_READ });
  const denied = guardResponse(guard);
  if (denied) return denied;

  const id = String(params.id || '').trim();
  if (!id) {
    return Response.json({ error: 'Missing invoice id' }, { status: 400 });
  }

  const detail = await getInvoiceById(id);
  if (!detail) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json({ ok: true, ...detail });
}
