# Receipt recovery (operators)

Paid Hyp orders must **not** be reversed when receipt generation fails. The app records payment success first; receipts are created idempotently afterward.

## Symptoms

- Order shows **paid** (or partially paid for deposits) in admin, but customer did not receive a PDF/receipt email.
- `payment_receipts` row missing or admin shows a **receipt pending** style outcome (see `deriveAdminPaymentOutcome` in `lib/commerce/admin-payment-outcome.js`).
- Customer returns to the success URL more than once (duplicate redirect).

## What the code does today

1. **Confirmation** (`lib/commerce/payment/confirmation.js`) verifies Hyp redirect, updates order payment status, and persists the transaction.
2. **Finalization** (`lib/commerce/payment/finalization.js`) calls `ensureReceiptForPaidOrder`, which is idempotent via the `payment_receipts_idempotency_idx` constraint (`supabase/migrations/004_booking_payments.sql`).
3. Receipt failure is logged; the order remains paid.

There is **no** background worker in this repo. Recovery is manual or by re-triggering existing code paths.

## Operator steps

1. Open **Admin → Orders** and locate the order by `orderId` or customer phone.
2. Confirm **payment status** is `paid` (or `partially_paid` for Wadi deposit) and note the Hyp transaction id if shown.
3. If the customer reports a missing receipt but payment is confirmed, do **not** refund or cancel the order solely for receipt failure.
4. For duplicate return visits: confirmation/finalization paths are designed to be safe on repeat; verify no duplicate charges in Hyp terminal reports.
5. To retry receipt creation in staging/production, use the same server environment that has `SUPABASE_SERVICE_ROLE_KEY` and PDF dependencies configured, and invoke the existing finalization path (e.g. re-run confirmation/finalization from a controlled admin or script in that environment). Do not run `audit-hyp-checkout` or other audit scripts against production from a developer machine.

## Escalation

- Schema errors (`COMMERCE_DB_SCHEMA`): apply pending migrations in order.
- Persistent receipt errors: capture server logs around `ensureReceiptForPaidOrder` and Hyp verify success for that `orderId`.
