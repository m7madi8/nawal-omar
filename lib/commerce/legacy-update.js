import { parseOrderNote } from './orders.js';
import { SUPABASE_TABLE_RETREAT_REQUESTS, supabaseGetById, supabaseUpdate } from './supabase.js';

export async function updateLegacyMirrorPaid(order, sessionId = '') {
  const legacyId = order?.metadata?.legacyMirrorId;
  if (!legacyId) return null;

  const row = await supabaseGetById(SUPABASE_TABLE_RETREAT_REQUESTS, legacyId);
  if (!row) return null;

  let note = parseOrderNote(row.freeNote) || {};
  if (!note.commerceOrderId) {
    try {
      note = { ...note, ...JSON.parse(row.freeNote || '{}') };
    } catch {
      /* ignore */
    }
  }

  note.paid = true;
  note.stripeSessionId = sessionId || note.stripeSessionId || '';
  note.paymentStatus = 'paid';

  return supabaseUpdate(SUPABASE_TABLE_RETREAT_REQUESTS, legacyId, {
    yogaExperience: 'paid',
    healthDetails: sessionId || row.healthDetails || '',
    freeNote: JSON.stringify(note),
  });
}
