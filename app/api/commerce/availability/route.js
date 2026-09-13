import { getCapacityState } from '@/lib/commerce/capacity';
import { getCatalogItem } from '@/lib/commerce/catalog';
import { isCommerceType } from '@/lib/commerce/types';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const commerceType = searchParams.get('commerceType') || 'event';
  const itemId = searchParams.get('itemId') || searchParams.get('eventId');

  if (!isCommerceType(commerceType) || !itemId) {
    return Response.json({ error: 'Missing commerceType or itemId' }, { status: 400 });
  }

  const item = getCatalogItem(commerceType, itemId);
  if (!item) {
    return Response.json({ error: 'Unknown item' }, { status: 404 });
  }

  if (commerceType !== 'event') {
    return Response.json({
      commerceType,
      itemId,
      capacity: item.capacity ?? null,
      reservedSeats: 0,
      availableSeats: item.capacity ?? null,
      bookingStatus: item.bookingStatus || 'open',
    });
  }

  const state = await getCapacityState(itemId);
  return Response.json({
    commerceType,
    itemId,
    ...state,
  });
}
