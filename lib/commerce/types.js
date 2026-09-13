/** @typedef {'product' | 'lesson' | 'retreat' | 'event'} CommerceType */

/** @typedef {'pending' | 'confirmed' | 'cancelled'} OrderStatus */

/** @typedef {'unpaid' | 'paid' | 'failed' | 'cancelled'} PaymentStatus */

/** @typedef {'manual' | 'whatsapp' | 'cash' | 'stripe' | 'paypal' | 'grow'} PaymentMethod */

/** @typedef {'open' | 'sold_out' | 'closed'} BookingStatus */

/**
 * @typedef {Object} CommerceCustomer
 * @property {string} fullName
 * @property {string} phone
 * @property {string} [city]
 * @property {string} [email]
 */

/**
 * @typedef {Object} EventOrderItemMetadata
 * @property {string} eventId
 * @property {string} eventDate
 * @property {number} numberOfParticipants
 * @property {string} [priceTier]
 * @property {Array<{ name?: string }>} [participants]
 * @property {string} [notes]
 * @property {Record<string, unknown>} [options]
 */

/**
 * @typedef {Object} CommerceOrderItem
 * @property {string} id
 * @property {string} orderId
 * @property {CommerceType} commerceType
 * @property {string} itemId
 * @property {string} title
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {string} currency
 * @property {Record<string, unknown>} metadata
 */

/**
 * @typedef {Object} CommerceOrder
 * @property {string} id
 * @property {OrderStatus} status
 * @property {PaymentStatus} paymentStatus
 * @property {PaymentMethod} paymentMethod
 * @property {string} currency
 * @property {number} subtotal
 * @property {number} total
 * @property {CommerceCustomer} customer
 * @property {Record<string, unknown>} metadata
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} CommercePayment
 * @property {string} orderId
 * @property {PaymentMethod} method
 * @property {PaymentStatus} status
 * @property {string} [providerSessionId]
 * @property {number} amount
 * @property {string} currency
 */

/**
 * @typedef {Object} CapacityState
 * @property {number|null} capacity
 * @property {number} reservedSeats
 * @property {number|null} availableSeats
 * @property {BookingStatus} bookingStatus
 */

export const COMMERCE_TYPES = ['product', 'lesson', 'retreat', 'event'];

export function isCommerceType(value) {
  return COMMERCE_TYPES.includes(value);
}
