import { guardResponse, requireAdminAccess } from '@/lib/admin-auth';
import { PERMISSION } from '@/lib/admin/permissions';
import { getInvoiceById } from '@/lib/commerce/invoices';
import { generateReceiptPdf } from '@/lib/commerce/pdf/generate-receipt';

export async function GET(request, { params }) {
  const guard = await requireAdminAccess(request, { permission: PERMISSION.INVOICES_READ });
  const denied = guardResponse(guard);
  if (denied) return denied;

  const id = String(params.id || '').trim();
  const detail = await getInvoiceById(id);
  if (!detail?.receipt) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const pdfBytes = await generateReceiptPdf({
    order: detail.order,
    items: detail.items,
    receipt: detail.receipt,
  });

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${detail.receipt.document_number}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
