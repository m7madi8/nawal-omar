import { guardResponse, requireAdminAccess } from '@/lib/admin-auth';
import { PERMISSION } from '@/lib/admin/permissions';
import {
  SUPABASE_TABLE_RETREAT_REQUESTS,
  supabaseDelete,
  supabaseGetById,
  supabaseUpdate,
} from '@/lib/commerce/supabase';

export async function PATCH(request, context) {
  const guard = await requireAdminAccess(request, {
    permission: PERMISSION.REGISTRATIONS_UPDATE,
    mutation: true,
  });
  const denied = guardResponse(guard);
  if (denied) return denied;

  const params = await context.params;
  const id = String(params?.id || '').trim();
  if (!id) {
    return Response.json({ error: 'Missing id' }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const status = String(body.status || '').trim();
  if (!status) {
    return Response.json({ error: 'Missing status' }, { status: 400 });
  }

  const existing = await supabaseGetById(SUPABASE_TABLE_RETREAT_REQUESTS, id);
  if (!existing) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const updated = await supabaseUpdate(SUPABASE_TABLE_RETREAT_REQUESTS, id, { status });
  return Response.json({ ok: true, row: updated });
}

export async function DELETE(request, context) {
  const guard = await requireAdminAccess(request, {
    permission: PERMISSION.REGISTRATIONS_DELETE,
    mutation: true,
  });
  const denied = guardResponse(guard);
  if (denied) return denied;

  const params = await context.params;
  const id = String(params?.id || '').trim();
  if (!id) {
    return Response.json({ error: 'Missing id' }, { status: 400 });
  }

  const ok = await supabaseDelete(SUPABASE_TABLE_RETREAT_REQUESTS, id);
  if (!ok) {
    return Response.json({ error: 'Delete failed' }, { status: 500 });
  }
  return Response.json({ ok: true });
}
