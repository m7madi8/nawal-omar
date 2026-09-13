import { listCatalog, listAllCatalogItems } from '@/lib/commerce/catalog';
import { isCommerceType } from '@/lib/commerce/types';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const commerceType = searchParams.get('commerceType');

  if (commerceType) {
    if (!isCommerceType(commerceType)) {
      return Response.json({ error: 'Invalid commerce type' }, { status: 400 });
    }
    return Response.json({ items: listCatalog(commerceType) });
  }

  return Response.json({ items: listAllCatalogItems() });
}
