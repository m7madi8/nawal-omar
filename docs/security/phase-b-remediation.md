# Phase B — Hyp payment correctness

## Authoritative confirmation

Only **Hyp APISign VERIFY** (`verifyHypRedirect`) determines paid vs declined. Browser `CCode` on the redirect is not used to mark orders failed before VERIFY.

If VERIFY is unreachable (`outcome: unavailable`), the order stays **`processing`** with `paymentOutcomeUnknown` (attempt `outcome_unknown`). Orders are not auto-cancelled when the customer never returns.

## Transaction binding

Before reusing a `payment_transactions` row, `validateTransactionBinding` checks `order_id`, amount, currency, and attempt `hyp_transaction_id`. Cross-order reuse returns `TRANSACTION_ORDER_MISMATCH` without updating the wrong order.

## POST `/api/commerce/confirm` (Hyp)

Requires `bookingAccess` / `accessToken` verified with `BOOKING_ACCESS_SECRET` via `verifyBookingAccessLoose(orderId, token)`. Primary customer flow remains `GET /api/payment/hyp/return`.

## Stored gateway data

Full `redirect_query` is no longer stored on new transactions. `metadata.redirectAudit` holds non-sensitive fields only; VERIFY response is truncated (≤500 chars) in `verify_response`.

## Reconciliation

No undocumented Hyp webhook or server poll was added. Unresolved attempts remain visible via `payment_attempts` and admin commerce order detail.

## Tests

`npm run test:security-phase-b` — in-memory mocks only. Staging must run real VERIFY against Hyp test terminal.
