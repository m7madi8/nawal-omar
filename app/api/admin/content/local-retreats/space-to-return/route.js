import { guardResponse, requireAdminAccess } from '@/lib/admin-auth';
import { PERMISSION } from '@/lib/admin/permissions';
import { validateSpaceToReturnContentPair } from '@/lib/localRetreats/validateSpaceToReturnContent.js';
import {
  readSpaceToReturnContentPair,
  writeSpaceToReturnContentPair,
} from '@/lib/localRetreats/spaceToReturnContentPaths.js';
import { isSpaceToReturnContentReady } from '@/lib/localRetreats/loadSpaceToReturnContent.js';

export async function GET(request) {
  const guard = await requireAdminAccess(request, { permission: PERMISSION.CONTENT_READ });
  const denied = guardResponse(guard);
  if (denied) return denied;

  const content = readSpaceToReturnContentPair();
  return Response.json({
    ok: true,
    content,
    ready: isSpaceToReturnContentReady(content),
    publicPath: '/local-retreats/a-space-to-return',
  });
}

export async function PUT(request) {
  const guard = await requireAdminAccess(request, {
    permission: PERMISSION.CONTENT_WRITE,
    mutation: true,
  });
  const denied = guardResponse(guard);
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const payload = { ar: body?.ar, en: body?.en };
  const validation = validateSpaceToReturnContentPair(payload);
  if (!validation.ok) {
    return Response.json({ error: validation.error, code: 'VALIDATION_FAILED' }, { status: 400 });
  }

  writeSpaceToReturnContentPair(payload);
  return Response.json({
    ok: true,
    ready: isSpaceToReturnContentReady(payload),
  });
}
