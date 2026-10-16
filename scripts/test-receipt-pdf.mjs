/**
 * Offline regression test for receipt PDF generation (real PDF bytes, no network, no database).
 *
 * Root cause covered: the generator used the built-in Helvetica font with a "₪" prefix, and
 * pdf-lib cannot encode U+20AA in WinAnsi, so every ILS receipt threw before producing bytes.
 *
 * Run: node scripts/test-receipt-pdf.mjs
 */
import assert from 'node:assert/strict';
import { inflateSync } from 'node:zlib';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { generateReceiptPdf } from '../lib/commerce/pdf/generate-receipt.js';

/** Decode drawn text from real PDF bytes (pdf-lib writes Helvetica text as hex strings). */
function extractPdfText(bytes) {
  const raw = Buffer.from(bytes).toString('latin1');
  const out = [];
  const streamRe = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match;
  while ((match = streamRe.exec(raw))) {
    const chunk = Buffer.from(match[1], 'latin1');
    let text;
    try {
      text = inflateSync(chunk).toString('latin1');
    } catch {
      text = chunk.toString('latin1');
    }
    const hexRe = /<([0-9A-Fa-f]+)>\s*Tj/g;
    let h;
    while ((h = hexRe.exec(text))) out.push(Buffer.from(h[1], 'hex').toString('latin1'));
  }
  return out;
}

function fixture({ roomId, roomLabel, total, deposit = 400, name = 'Test Customer', currency = 'ILS' }) {
  const order = {
    id: `ord-${roomId}`,
    total,
    currency,
    amount_paid: deposit,
    payment_method: 'hyp',
    customer: { fullName: name, phone: '+972501234567' },
    metadata: { itemId: 'wadi-rum', roomId, bookingReference: `NY-${roomId.toUpperCase()}` },
  };
  const items = [
    {
      title: `Wadi Rum Retreat - ${roomLabel}`,
      metadata: { roomId, roomLabel, eventDate: '2026-12-10' },
    },
  ];
  const receipt = {
    document_number: `NY-TEST-${roomId}`,
    document_type: 'deposit_receipt',
    currency,
    amount: deposit,
    created_at: '2026-10-16T10:00:00.000Z',
    metadata: {
      totalBooking: total,
      cumulativePaid: deposit,
      remainingAfter: total - deposit,
      paymentMethod: 'hyp',
      providerTransactionId: 'HYP-TXN-1',
      bookingReference: `NY-${roomId.toUpperCase()}`,
    },
  };
  return { order, items, receipt };
}

function assertValidPdf(bytes, label) {
  assert.ok(bytes instanceof Uint8Array, `${label}: bytes are a Uint8Array`);
  assert.ok(bytes.length > 1000, `${label}: PDF is not empty (${bytes.length} bytes)`);
  assert.equal(Buffer.from(bytes.slice(0, 5)).toString('latin1'), '%PDF-', `${label}: PDF header`);
  assert.ok(
    Buffer.from(bytes.slice(-32)).toString('latin1').includes('%%EOF'),
    `${label}: PDF trailer`,
  );
}

// ---- Root cause: Helvetica (WinAnsi) cannot encode the shekel sign -----------------------
{
  const doc = await PDFDocument.create();
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  assert.throws(() => helvetica.encodeText('₪3,650'), /WinAnsi cannot encode/);
  assert.doesNotThrow(() => helvetica.encodeText('ILS 3,650 - $ - \u2014'));
}

// ---- Panorama and Bubbles produce real, parseable PDFs with the right amounts -----------
for (const spec of [
  { roomId: 'panorama', roomLabel: 'Panorama Room', total: 3650, remaining: 3250 },
  { roomId: 'bubbles', roomLabel: 'Bubbles Room', total: 3850, remaining: 3450 },
]) {
  const bytes = await generateReceiptPdf(fixture(spec));
  assertValidPdf(bytes, spec.roomId);

  const reloaded = await PDFDocument.load(bytes);
  assert.equal(reloaded.getPageCount(), 1, `${spec.roomId}: one page, layout preserved`);

  const text = extractPdfText(bytes);
  const joined = text.join('\n');
  assert.ok(joined.includes(`Experience: Wadi Rum Retreat - ${spec.roomLabel}`), `${spec.roomId}: room label`);
  assert.ok(joined.includes(`Total booking price: ILS ${spec.total.toLocaleString('en-IL')}`), `${spec.roomId}: total`);
  assert.ok(joined.includes('Amount received (this payment): ILS 400'), `${spec.roomId}: deposit received`);
  assert.ok(joined.includes('Total paid to date: ILS 400'), `${spec.roomId}: paid to date`);
  assert.ok(
    joined.includes(`Remaining balance: ILS ${spec.remaining.toLocaleString('en-IL')}`),
    `${spec.roomId}: remaining balance`,
  );
  assert.ok(joined.includes('Deposit / partial payment receipt'), `${spec.roomId}: deposit doc type`);
  assert.ok(joined.includes('Payment reference: HYP-TXN-1'), `${spec.roomId}: payment reference kept`);
  assert.ok(!joined.includes('₪'), `${spec.roomId}: no unencodable shekel sign`);
}

// ---- Balance-settled receipt keeps the em dash (WinAnsi) and zero remaining --------------
{
  const f = fixture({ roomId: 'panorama', roomLabel: 'Panorama Room', total: 3650, deposit: 3650 });
  f.receipt.document_type = 'final_payment_receipt';
  const bytes = await generateReceiptPdf(f);
  assertValidPdf(bytes, 'final');
  const joined = extractPdfText(bytes).join('\n');
  // U+2014 is encoded by WinAnsi as byte 0x97.
  assert.ok(joined.includes('Payment receipt \x97 balance settled'), 'em dash preserved');
  assert.ok(joined.includes('Remaining balance: ILS 0'));
}

// ---- USD still uses "$" ------------------------------------------------------------------
{
  const bytes = await generateReceiptPdf(
    fixture({ roomId: 'panorama', roomLabel: 'Panorama Room', total: 900, deposit: 100, currency: 'USD' }),
  );
  assertValidPdf(bytes, 'usd');
  assert.ok(extractPdfText(bytes).join('\n').includes('Total booking price: $900'));
}

// ---- Free text that Helvetica cannot encode no longer aborts generation ------------------
{
  const f = fixture({
    roomId: 'bubbles',
    roomLabel: 'Bubbles Room',
    total: 3850,
    name: 'نوال Test\nLine',
  });
  const bytes = await generateReceiptPdf(f);
  assertValidPdf(bytes, 'arabic-name');
  const joined = extractPdfText(bytes).join('\n');
  // Known limitation: Arabic letters are printed as "?" (no Arabic font/shaping in the repo).
  assert.ok(joined.includes('Customer: ???? Test Line'), 'unencodable characters degrade to "?"');
  assert.ok(joined.includes('Total booking price: ILS 3,850'), 'amounts unaffected');
  assert.ok(joined.includes('Remaining balance: ILS 3,450'), 'balance unaffected');
}

console.log('test-receipt-pdf: all assertions passed (real PDF bytes; no network, database or payment)');
