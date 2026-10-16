/**
 * Admin list integrity: one logical booking must count once.
 *
 * Wadi Rum creates two `retreat_requests` rows per paid registration:
 *   1. the original registration request (intake answers, id `req-<timestamp>`), and
 *   2. the legacy commerce mirror written at checkout (its `freeNote` is the order note JSON
 *      with `commerceOrderId`; payment/booking state is kept there).
 *
 * The link between them is the original request id the checkout was started with:
 *   - new mirrors carry it explicitly as `retreatRequestId` in the note;
 *   - older mirrors only have it in `reason` as "Registration request <id>".
 *
 * A mirror is only collapsed into an original when ALL of these hold: the original row exists with
 * exactly that id, is not itself a mirror, has the same source, and the same phone number. A phone
 * number or name alone never links two rows. Nothing is deleted, merged in the database or
 * rewritten: the admin API simply returns one row per logical booking, carrying the mirror's order
 * note as `commerceNote` and the mirror's workflow status.
 *
 * Standalone requests (no linked mirror) and standalone mirrors (events, lessons, shop, or a mirror
 * whose original is missing) are returned unchanged.
 */

const REASON_LINK = /^Registration request (req-[A-Za-z0-9-]+)$/;

function parseOrderNote(freeNote) {
  if (typeof freeNote !== 'string' || !freeNote || freeNote === '-') return null;
  try {
    const parsed = JSON.parse(freeNote);
    if (parsed && typeof parsed === 'object' && typeof parsed.commerceOrderId === 'string') {
      return parsed;
    }
  } catch {
    /* not a mirror note */
  }
  return null;
}

function phoneKey(phone) {
  return String(phone || '')
    .replace(/\D/g, '')
    .slice(-8);
}

function linkedRequestId(mirror, note) {
  if (typeof note.retreatRequestId === 'string' && note.retreatRequestId.trim()) {
    return note.retreatRequestId.trim();
  }
  const match = REASON_LINK.exec(String(mirror.reason || '').trim());
  return match ? match[1] : '';
}

function timeOf(row) {
  const t = new Date(row.submittedAt || row.createdAt || 0).getTime();
  return Number.isFinite(t) ? t : 0;
}

function isPaidMirror(mirror, note) {
  return (
    Number(note.amountPaid) > 0 ||
    note.paymentStatus === 'paid' ||
    note.paymentStatus === 'partially_paid'
  );
}

/**
 * @param {Array<object>} rows raw retreat_requests rows
 * @returns {Array<object>} rows with each linked request/mirror pair collapsed into the request
 */
export function collapseLinkedBookingRows(rows) {
  if (!Array.isArray(rows) || rows.length < 2) return rows || [];

  const notes = new Map();
  const originals = new Map();
  for (const row of rows) {
    const note = parseOrderNote(row?.freeNote);
    if (note) notes.set(row, note);
    else if (row && typeof row.id === 'string') originals.set(row.id, row);
  }
  if (!notes.size) return rows;

  // Candidate mirrors per original request id.
  const candidates = new Map();
  for (const [mirror, note] of notes) {
    const requestId = linkedRequestId(mirror, note);
    const original = requestId ? originals.get(requestId) : null;
    if (
      !original ||
      original.source !== mirror.source ||
      !phoneKey(original.phone) ||
      phoneKey(original.phone) !== phoneKey(mirror.phone)
    ) {
      continue;
    }
    if (!candidates.has(requestId)) candidates.set(requestId, []);
    candidates.get(requestId).push({ mirror, note });
  }
  if (!candidates.size) return rows;

  // One mirror per original: a paid one wins, then the most recent. Any other mirror for the same
  // request stays visible as its own row so no payment record is ever hidden.
  const chosen = new Map();
  const hidden = new Set();
  for (const [requestId, list] of candidates) {
    const best = [...list].sort((a, b) => {
      const paid = Number(isPaidMirror(b.mirror, b.note)) - Number(isPaidMirror(a.mirror, a.note));
      return paid || timeOf(b.mirror) - timeOf(a.mirror);
    })[0];
    chosen.set(requestId, best);
    hidden.add(best.mirror);
  }

  const out = [];
  for (const row of rows) {
    if (hidden.has(row)) continue;
    const link = chosen.get(row?.id);
    if (!link || notes.has(row)) {
      out.push(row);
      continue;
    }
    const mirrorStatus = link.mirror.status;
    out.push({
      ...row,
      status: mirrorStatus && mirrorStatus !== 'pending' ? mirrorStatus : row.status,
      commerceNote: link.mirror.freeNote,
      mirrorId: link.mirror.id,
    });
  }
  return out;
}
