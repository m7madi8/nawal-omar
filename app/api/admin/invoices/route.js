import { guardResponse, requireAdminAccess } from '@/lib/admin-auth';
import { PERMISSION } from '@/lib/admin/permissions';
import { queryInvoices, summarizeInvoices } from '@/lib/commerce/invoices';

export async function GET(request) {
  const guard = await requireAdminAccess(request, { permission: PERMISSION.INVOICES_READ });
  const denied = guardResponse(guard);
  if (denied) return denied;

  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '25';
  const q = url.searchParams.get('q') || '';
  const method = url.searchParams.get('method') || 'all';
  const status = url.searchParams.get('status') || 'all';
  const source = url.searchParams.get('source') || 'all';
  const sort = url.searchParams.get('sort') || 'desc';
  const dateFrom = url.searchParams.get('dateFrom') || '';
  const dateTo = url.searchParams.get('dateTo') || '';
  const includeSummary = url.searchParams.get('summary') !== '0';

  try {
    const result = await queryInvoices({
      page,
      limit,
      q,
      method,
      status,
      source,
      dateFrom,
      dateTo,
      sort,
    });
    const summary = includeSummary
      ? await summarizeInvoices({ dateFrom, dateTo })
      : null;
    return Response.json({ ok: true, ...result, summary });
  } catch (error) {
    const message = error.message || 'Could not load invoices';
    return Response.json(
      {
        error: message,
        code: error.code || 'FAILED',
        hint: message.includes('PGRST205') || message.includes('Could not find the table')
          ? 'Apply migration 004_booking_payments.sql in Supabase.'
          : undefined,
      },
      { status: 500 },
    );
  }
}
