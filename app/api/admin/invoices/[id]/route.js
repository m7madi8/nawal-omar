import { authorizeAdminRequest, adminUnauthorizedResponse } from '@/lib/admin-auth';
import { getInvoiceById } from '@/lib/commerce/invoices';

export async function GET(request, { params }) {
  if (!authorizeAdminRequest(request)) {
    return adminUnauthorizedResponse();
  }

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
