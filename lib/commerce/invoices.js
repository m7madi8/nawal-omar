import { GATEWAY_PAYMENT_METHODS, paymentLabel } from './constants.js';
import { getOrder, getOrderItems } from './orders.js';
import { listReceiptsForOrder } from './receipts.js';
import {
  SUPABASE_TABLE_PAYMENT_RECEIPTS,
  supabaseGetById,
  supabaseHeaders,
  SUPABASE_URL,
} from './supabase.js';

const ONLINE_METHODS = new Set(['hyp', 'stripe', 'grow']);

function parseContentRange(header) {
  if (!header) return null;
  const match = String(header).match(/\/(\d+|\*)$/);
  if (!match || match[1] === '*') return null;
  return Number(match[1]);
}

function escapeIlike(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}

/** PostgREST splits filter values on `.` — ISO timestamps must be quoted. */
function postgrestFilterValue(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return encodeURIComponent(`"${raw.replace(/"/g, '\\"')}"`);
}

function isMissingReceiptsTable(message) {
  const text = String(message || '');
  return text.includes('PGRST205') || text.includes('Could not find the table');
}

export function mapReceiptToInvoice(receipt, order = null) {
  const meta = receipt?.metadata || {};
  const method = meta.paymentMethod || meta.payment_method || '';
  const source = meta.source || (ONLINE_METHODS.has(String(method).toLowerCase()) ? 'online' : 'manual');
  const currency = receipt.currency || meta.currency || order?.currency || 'ILS';
  return {
    id: receipt.id,
    documentNumber: receipt.document_number,
    documentType: receipt.document_type,
    orderId: receipt.order_id,
    bookingReference: meta.bookingReference || order?.booking_reference || order?.metadata?.bookingReference || '',
    customerName: meta.customerName || order?.customer?.fullName || '',
    customerPhone: meta.customerPhone || order?.customer?.phone || '',
    customerEmail: meta.customerEmail || order?.customer?.email || '',
    experienceName: meta.experienceName || '',
    paymentDate: meta.paymentDate || receipt.created_at,
    createdAt: receipt.created_at,
    method,
    methodLabel: meta.paymentMethodLabel || paymentLabel(method),
    paymentReference: meta.providerTransactionId || meta.reference || receipt.payment_transaction_id || '',
    currency,
    totalBooking: Number(meta.totalBooking ?? meta.total ?? order?.total ?? 0),
    transactionAmount: Number(receipt.amount ?? meta.transactionAmount ?? 0),
    previousPaid: Number(meta.previousPaid ?? 0),
    cumulativePaid: Number(meta.cumulativePaid ?? meta.amountPaid ?? 0),
    remainingAfter: Number(meta.remainingAfter ?? meta.remaining ?? 0),
    documentStatus: meta.documentStatus || 'paid',
    bookingPaymentStatus: order?.payment_status || meta.bookingPaymentStatus || '',
    source,
    recordedBy: meta.recordedBy || '',
    paymentTransactionId: receipt.payment_transaction_id || '',
  };
}

export async function getInvoiceById(receiptId) {
  const receipt = await supabaseGetById(SUPABASE_TABLE_PAYMENT_RECEIPTS, receiptId);
  if (!receipt) return null;
  const order = receipt.order_id ? await getOrder(receipt.order_id) : null;
  const items = receipt.order_id ? await getOrderItems(receipt.order_id) : [];
  const invoice = mapReceiptToInvoice(receipt, order);
  const history = receipt.order_id ? await listReceiptsForOrder(receipt.order_id) : [];
  return {
    invoice,
    receipt,
    order,
    items,
    paymentHistory: history.map((row) => mapReceiptToInvoice(row, order)),
  };
}

export async function queryInvoices({
  page = 1,
  limit = 25,
  q = '',
  method = '',
  status = '',
  source = '',
  dateFrom = '',
  dateTo = '',
  sort = 'desc',
} = {}) {
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 25));
  const safePage = Math.max(1, Number(page) || 1);
  const offset = (safePage - 1) * safeLimit;

  const parts = ['select=*'];
  const term = String(q || '').trim();
  if (term) {
    const pattern = `%${escapeIlike(term)}%`;
    const enc = encodeURIComponent(pattern);
    parts.push(
      `or=(document_number.ilike.${enc},metadata->>customerName.ilike.${enc},metadata->>bookingReference.ilike.${enc})`,
    );
  }
  if (method && method !== 'all') {
    parts.push(`metadata->>paymentMethod=eq.${encodeURIComponent(method)}`);
  }
  if (status && status !== 'all') {
    parts.push(`metadata->>documentStatus=eq.${encodeURIComponent(status)}`);
  }
  if (source && source !== 'all') {
    parts.push(`metadata->>source=eq.${encodeURIComponent(source)}`);
  }
  if (dateFrom) {
    parts.push(`created_at=gte.${postgrestFilterValue(dateFrom)}`);
  }
  if (dateTo) {
    parts.push(`created_at=lte.${postgrestFilterValue(dateTo)}`);
  }
  parts.push(`order=created_at.${sort === 'asc' ? 'asc' : 'desc'}`);
  parts.push(`limit=${safeLimit}`);
  parts.push(`offset=${offset}`);

  const query = parts.join('&');
  const url = `${SUPABASE_URL}/rest/v1/${encodeURIComponent(SUPABASE_TABLE_PAYMENT_RECEIPTS)}?${query}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...supabaseHeaders('return=representation'),
      Prefer: 'count=exact',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    if (isMissingReceiptsTable(text)) {
      return {
        invoices: [],
        page: safePage,
        limit: safeLimit,
        total: 0,
        hasMore: false,
        code: 'TABLE_MISSING',
        setupHint: 'Run supabase/migrations/004_booking_payments.sql in Supabase SQL editor.',
      };
    }
    const error = new Error(text || 'Failed to load invoices');
    error.code = 'INVOICES_LOAD_FAILED';
    throw error;
  }
  const rows = await res.json();
  const total = parseContentRange(res.headers.get('content-range')) ?? (Array.isArray(rows) ? rows.length : 0);
  const invoices = (Array.isArray(rows) ? rows : []).map((row) => mapReceiptToInvoice(row));

  return {
    invoices,
    page: safePage,
    limit: safeLimit,
    total,
    hasMore: offset + invoices.length < total,
  };
}

export async function summarizeInvoices({ dateFrom = '', dateTo = '' } = {}) {
  const parts = ['select=amount,currency,metadata,created_at'];
  if (dateFrom) parts.push(`created_at=gte.${postgrestFilterValue(dateFrom)}`);
  if (dateTo) parts.push(`created_at=lte.${postgrestFilterValue(dateTo)}`);
  parts.push('order=created_at.desc');
  parts.push('limit=500');

  const url = `${SUPABASE_URL}/rest/v1/${encodeURIComponent(SUPABASE_TABLE_PAYMENT_RECEIPTS)}?${parts.join('&')}`;
  const res = await fetch(url, { method: 'GET', headers: supabaseHeaders() });
  if (!res.ok) {
    return {
      transactionCount: 0,
      totalsByCurrency: {},
      onlineByCurrency: {},
      offlineByCurrency: {},
    };
  }
  const rows = await res.json();
  const list = Array.isArray(rows) ? rows : [];

  const totalsByCurrency = {};
  const onlineByCurrency = {};
  const offlineByCurrency = {};

  list.forEach((row) => {
    const meta = row.metadata || {};
    const currency = row.currency || meta.currency || 'ILS';
    const amount = Number(row.amount) || 0;
    const method = String(meta.paymentMethod || '').toLowerCase();
    const isOnline = meta.source === 'online' || GATEWAY_PAYMENT_METHODS.has(method) || ONLINE_METHODS.has(method);

    totalsByCurrency[currency] = (totalsByCurrency[currency] || 0) + amount;
    if (isOnline) {
      onlineByCurrency[currency] = (onlineByCurrency[currency] || 0) + amount;
    } else {
      offlineByCurrency[currency] = (offlineByCurrency[currency] || 0) + amount;
    }
  });

  return {
    transactionCount: list.length,
    totalsByCurrency,
    onlineByCurrency,
    offlineByCurrency,
    capped: list.length >= 500,
  };
}
