# Phase B.1 — Hyp finalization hardening

## VERIFY classification

`classifyHypVerifyOutcome` (`lib/commerce/payment/hyp-pay/verify-outcome.js`):

- **paid** — HTTP OK and `CCode=0` (per `docs/payments/hyp-pay.md`).
- **declined** — HTTP OK and numeric non-zero `CCode`.
- **unavailable** — empty body, HTTP error, missing `CCode`, or non-numeric unknown codes. Never treated as definitive decline.

Network errors during VERIFY return **unavailable**.

## Binding

- Paid path requires redirect `Id` (Hyp transaction id).
- Charge amount recorded from server `expectedChargeAmount(order)` after redirect amount matches.
- Amount on redirect is still checked against the order; VERIFY authenticates the signed redirect string (Hyp contract — confirm in sandbox).

## Finalization recovery

Order → transaction → receipt remain separate REST writes (not atomic).

- Receipt failure after paid: `metadata.paymentFinalizationState = receipt_pending` (no re-charge, no auto-cancel).
- Duplicate return or `ensureReceiptForPaidOrder` retries idempotent receipt creation.

## Booking access

Hyp return sets HttpOnly `nawal_bk_view` cookie; thanks URL omits `token` when `bookingViewCookie` is used. Legacy `?token=` still works.

## Admin

`adminPaymentOutcome` on sanitized commerce order detail (`deriveAdminPaymentOutcome`).

## Tests

`npm run test:security-phase-b1` — mocks only. Staging still required for live VERIFY.
