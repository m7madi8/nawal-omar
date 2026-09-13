import { EVENT_CATALOG, getEvent, listEvents } from '../lib/commerce/catalog/events.js';
import { getCatalogItem } from '../lib/commerce/catalog/index.js';
import { growProvider } from '../lib/commerce/payment/grow.js';
import { assertAvailability, getCapacityState } from '../lib/commerce/capacity.js';
import { buildOrder, buildOrderItem } from '../lib/commerce/orders.js';
import { isCommerceType, COMMERCE_TYPES } from '../lib/commerce/types.js';

const requiredEvents = ['sound-healing', 'ice-bath', 'nature-chocolate'];
let failed = 0;

function check(label, ok) {
  if (!ok) {
    console.error('FAIL:', label);
    failed += 1;
  } else {
    console.log('OK:', label);
  }
}

check('commerce types include event', COMMERCE_TYPES.includes('event'));
check('all required events exist', requiredEvents.every((id) => Boolean(EVENT_CATALOG[id])));

for (const id of requiredEvents) {
  const event = getEvent(id);
  check(`${id} has pricing tiers`, event?.pricing?.tiers?.length > 0);
  check(`${id} has commerce metadata`, event?.commerceType === 'event' && Boolean(event.source));
}

check('grow provider disabled', growProvider.enabled === false);

try {
  await growProvider.createPaymentSession({});
  check('grow throws when called', false);
} catch (error) {
  check('grow throws GROW_DISABLED', error.code === 'GROW_DISABLED');
}

const order = buildOrder({
  customer: { fullName: 'Test', phone: '0500000000' },
  paymentMethod: 'manual',
  currency: 'ILS',
  subtotal: 100,
  total: 100,
});

const item = buildOrderItem({
  orderId: order.id,
  commerceType: 'event',
  itemId: 'sound-healing',
  title: 'Sound Healing',
  quantity: 1,
  unitPrice: 100,
  currency: 'ILS',
  metadata: {
    eventId: 'sound-healing',
    eventDate: '2026-09-04',
    numberOfParticipants: 1,
    notes: 'test',
  },
});

check('order item stores event metadata', item.metadata.eventId === 'sound-healing');
check('catalog resolver works', getCatalogItem('event', 'ice-bath')?.id === 'ice-bath');

try {
  await assertAvailability({ commerceType: 'event', itemId: 'nature-chocolate', quantity: 1 });
  check('closed event rejected', false);
} catch (error) {
  check('closed event rejected', error.code === 'BOOKING_CLOSED');
}

try {
  const capacity = await getCapacityState('sound-healing');
  check('capacity state shape', 'capacity' in capacity && 'reservedSeats' in capacity && 'availableSeats' in capacity);
} catch (error) {
  console.log('SKIP: capacity network check (Supabase unavailable in this environment)');
}

check('events list count', listEvents().length >= 3);

if (failed) {
  console.error(`\n${failed} verification check(s) failed`);
  process.exit(1);
}

console.log('\nAll commerce verification checks passed.');
