import { EVENT_CATALOG, getEvent, listEvents } from './events.js';
import { LESSON_CATALOG, getLesson, listLessons } from './lessons.js';
import { PRODUCT_CATALOG, getProduct, listProducts } from './products.js';
import { RETREAT_CATALOG, getRetreat, listRetreats } from './retreats.js';
import { isCommerceType } from '../types.js';

const CATALOGS = {
  product: PRODUCT_CATALOG,
  lesson: LESSON_CATALOG,
  retreat: RETREAT_CATALOG,
  event: EVENT_CATALOG,
};

export function getCatalogItem(commerceType, id) {
  if (!isCommerceType(commerceType) || !id) return null;
  const catalog = CATALOGS[commerceType];
  return catalog?.[id] || null;
}

export function listCatalog(commerceType) {
  if (!isCommerceType(commerceType)) return [];
  return Object.values(CATALOGS[commerceType] || {});
}

export function listAllCatalogItems() {
  return [
    ...listProducts(),
    ...listLessons(),
    ...listRetreats(),
    ...listEvents(),
  ];
}

export {
  EVENT_CATALOG,
  getEvent,
  listEvents,
  LESSON_CATALOG,
  getLesson,
  listLessons,
  PRODUCT_CATALOG,
  getProduct,
  listProducts,
  RETREAT_CATALOG,
  getRetreat,
  listRetreats,
};
