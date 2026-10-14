# Phase D — final payment remediation

## Summary

Closes audit items P0–P2: ice-bath feedback isolation, removal of public Hyp SIGN, server-authoritative checkout amounts, DB-backed duplicate-SIGN protection (migration + claim), fail-closed feedback UX, legacy HTML credential strip (scoped), and receipt recovery documentation.

## Changes

| Area | Files |
|------|--------|
| Ice-bath feedback | `lib/feedbackConfig.js` (`ice-bath` standard page), `feedback/feedback-ice.html` (REST stripped) |
| Hyp SIGN route | **Removed** `app/api/commerce/hyp/sign/route.js`; internal `startHypSignForPersistedOrder` retained for unit tests only |
| Charge authority | `lib/commerce/resolve-checkout-charge.js`, `lib/commerce/checkout.js` |
| Duplicate SIGN | `supabase/migrations/010_payment_attempts_active_unique.sql`, `lib/commerce/payment/attempts.js`, `lib/commerce/supabase.js` (23505 → `PAYMENT_SIGN_IN_PROGRESS`), `lib/commerce/payment/hyp-pay/provider.js` (claim + rethrow) |
| Feedback UX | `public/js/feedback-form.js` → `POST /api/retreat-request`, `fbSubmitError` in `renderStandardFeedbackForm` |
| Legacy HTML | `register/*.html`, `retreats/dahab.html`, `retreats/zanzibar.html`, `feedback/*.html` (credentials removed; HTML comment added) |
| Tests | `scripts/test-security-phase-d.mjs`, `npm run test:security-phase-d` |
| Ops | `docs/security/receipt-recovery-ops.md` |

## Hyp idempotency

No Hyp provider idempotency key is documented in this repository. Duplicate SIGN prevention is **application + DB**: partial unique index on `payment_attempts(order_id)` for statuses `created` and `awaiting_customer`, and `claimPaymentAttemptForSign` before `requestPaymentPageSign`.

## Deployment notes

- Migration **010** is forward-only; resolve any duplicate active rows before apply (see comment in migration file).
- Root static HTML is **not** the default handler when Next.js redirects are active; embedded credentials were removed to reduce risk if files are served elsewhere.
- Wadi Rum **online Hyp** remains **deposit-only** (`WADI_RUM_DEPOSIT_ILS`); full retreat payment online is rejected.

## Tests (local, no remote I/O)

```bash
npm run test:security-phase-a
npm run test:security-phase-a1
npm run test:security-phase-a2
npm run test:security-phase-a3
npm run test:security-phase-b
npm run test:security-phase-b1
npm run test:security-phase-c
npm run test:security-phase-c2
npm run test:security-phase-d
npm run build
```

**Not run:** `audit-hyp-checkout`, `verify-commerce`, or any live Supabase/Hyp calls.

## Final implementation report

### 1. Root causes

- Legacy ice-bath path loaded HTML with hardcoded Supabase REST.
- Public Hyp SIGN allowed unauthenticated session creation for known `orderId`.
- Checkout trusted client `depositAmount` / `chargeAmount`.
- Multiple concurrent SIGN calls could insert multiple active `payment_attempts`.
- Feedback form showed success without a successful API response.
- Legacy register/retreat/feedback HTML still contained project URLs/keys.

### 2. Before / after

- **Before:** Browser could write feedback to production REST; alternate SIGN API; client could lower deposit; parallel Hyp sessions possible; false-positive feedback success.
- **After:** Feedback via server API; SIGN only through checkout + provider claim; amounts from catalog/rules; unique active attempt per order (when migration applied); errors surfaced to user; legacy HTML stripped in scoped paths.

### 3. Unresolved assumptions

- PostgREST must surface unique violations as messages containing `23505` or index name (mapped in `lib/commerce/supabase.js`).
- Migration 010 not applied in this task to any remote project.
- Staging E2E still requires correct env, Hyp test terminal, and applied migrations 004–010.

### 4. Verdict

**Ready for isolated staging E2E** after migration 010 is applied on staging and env is configured per `phase-c2-remediation.md`. **Not** production-ready without operator validation and E2E payment tests.

### 5. No remote access

This remediation was implemented and verified with local scripts only; no Supabase or Hyp production/staging APIs were called from the implementation session.
