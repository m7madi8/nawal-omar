import { guardResponse, requireAdminAccess } from '@/lib/admin-auth';
import { PERMISSION } from '@/lib/admin/permissions';
import {
  RETREAT_CATALOG,
  getRetreat,
  listRetreats,
} from '@/lib/commerce/catalog/retreats.js';
import { EVENT_CATALOG, listEvents } from '@/lib/commerce/catalog/events.js';
import {
  readCatalogOverridesFile,
  setCatalogBookingStatusOverride,
} from '@/lib/commerce/catalog-overrides.js';
import { BOOKING_STATUS } from '@/lib/commerce/constants.js';

function catalogSnapshot() {
  const overrides = readCatalogOverridesFile();
  return {
    overrides,
    retreats: listRetreats().map((item) => ({
      id: item.id,
      title: item.title,
      source: item.source,
      bookingStatus: item.bookingStatus,
      pagePath: item.metadata?.pagePath || null,
      codeDefault: RETREAT_CATALOG[item.id]?.bookingStatus || null,
      override: overrides.retreats?.[item.id]?.bookingStatus || null,
    })),
    events: listEvents().map((item) => ({
      id: item.id,
      title: item.title,
      source: item.source,
      bookingStatus: item.bookingStatus,
      pagePath: item.metadata?.pagePath || null,
      codeDefault: EVENT_CATALOG[item.id]?.bookingStatus || null,
      override: overrides.events?.[item.id]?.bookingStatus || null,
    })),
    allowedBookingStatuses: Object.values(BOOKING_STATUS),
  };
}

export async function GET(request) {
  const guard = await requireAdminAccess(request, { permission: PERMISSION.CONTENT_READ });
  const denied = guardResponse(guard);
  if (denied) return denied;

  return Response.json({ ok: true, ...catalogSnapshot() });
}

export async function PATCH(request) {
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

  const commerceType = String(body.commerceType || body.type || '').trim();
  const id = String(body.id || '').trim();
  const bookingStatus = String(body.bookingStatus || '').trim();

  if (!id || (commerceType !== 'retreat' && commerceType !== 'event')) {
    return Response.json({ error: 'Invalid commerceType or id' }, { status: 400 });
  }

  const exists =
    commerceType === 'retreat' ? !!RETREAT_CATALOG[id] : !!EVENT_CATALOG[id];
  if (!exists) {
    return Response.json({ error: 'Unknown catalog item' }, { status: 404 });
  }

  try {
    setCatalogBookingStatusOverride(commerceType, id, bookingStatus);
  } catch (e) {
    return Response.json({ error: String(e.message || e) }, { status: 400 });
  }

  return Response.json({ ok: true, ...catalogSnapshot() });
}
