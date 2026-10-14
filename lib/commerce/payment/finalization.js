import { PAYMENT_STATUS } from '../constants.js';
import { createPaymentReceipt, findReceiptByTransaction } from '../receipts.js';
import { getOrder, getOrderItems, updateOrder } from '../orders.js';

export const FINALIZATION_STATE = {
  COMPLETE: 'complete',
  RECEIPT_PENDING: 'receipt_pending',
};

/**
 * Idempotent receipt creation for an order already marked paid (retry / duplicate return).
 */
export async function ensureReceiptForPaidOrder(
  order,
  hypTransactionId,
  {
    getOrderItems: getOrderItemsFn,
    createPaymentReceipt: createPaymentReceiptFn,
    updateOrder: updateOrderFn,
    findReceiptByTransaction: findReceiptFn,
  } = {},
) {
  const patchOrder = updateOrderFn || updateOrder;
  const findReceipt = findReceiptFn || findReceiptByTransaction;
  if (!order?.id || !hypTransactionId) {
    return { ok: false, code: 'MISSING_CONTEXT' };
  }
  const getItems = getOrderItemsFn || getOrderItems;
  const createReceipt = createPaymentReceiptFn || createPaymentReceipt;

  const existingReceipt = await findReceipt(order.id, hypTransactionId);
  if (existingReceipt) {
    if (order.metadata?.paymentFinalizationState === FINALIZATION_STATE.RECEIPT_PENDING) {
      await patchOrder(order.id, {
        metadata: {
          ...(order.metadata || {}),
          paymentFinalizationState: FINALIZATION_STATE.COMPLETE,
          paymentFinalizationError: null,
          paymentFinalizationRecoveredAt: new Date().toISOString(),
        },
      });
    }
    return { ok: true, receipt: existingReceipt, recovered: true };
  }

  if (
    order.payment_status !== PAYMENT_STATUS.PAID &&
    order.payment_status !== PAYMENT_STATUS.PARTIALLY_PAID
  ) {
    return { ok: false, code: 'ORDER_NOT_PAID' };
  }

  const items = await getItems(order.id);
  const chargeAmount =
    order.metadata?.chargeAmount != null ? Number(order.metadata.chargeAmount) : Number(order.total);

  try {
    const receipt = await createReceipt({
      order,
      items,
      amount: chargeAmount,
      paymentTransactionId: hypTransactionId,
      method: order.payment_method || 'hyp',
      metadata: { providerTransactionId: hypTransactionId, source: 'online', recovery: true },
    });
    await patchOrder(order.id, {
      metadata: {
        ...(order.metadata || {}),
        paymentFinalizationState: FINALIZATION_STATE.COMPLETE,
        paymentFinalizationError: null,
        paymentFinalizationRecoveredAt: new Date().toISOString(),
      },
    });
    return { ok: true, receipt, recovered: true };
  } catch (error) {
    await patchOrder(order.id, {
      metadata: {
        ...(order.metadata || {}),
        paymentFinalizationState: FINALIZATION_STATE.RECEIPT_PENDING,
        paymentFinalizationError: 'receipt_create_failed',
        paymentFinalizationLastErrorAt: new Date().toISOString(),
      },
    });
    return { ok: false, code: 'RECEIPT_CREATE_FAILED', error };
  }
}

export async function markReceiptFinalizationFailed(orderId, priorMetadata = {}, { updateOrder: updateOrderFn } = {}) {
  const patchOrder = updateOrderFn || updateOrder;
  await patchOrder(orderId, {
    metadata: {
      ...priorMetadata,
      paymentFinalizationState: FINALIZATION_STATE.RECEIPT_PENDING,
      paymentFinalizationError: 'receipt_create_failed',
      paymentFinalizationLastErrorAt: new Date().toISOString(),
    },
  });
}
