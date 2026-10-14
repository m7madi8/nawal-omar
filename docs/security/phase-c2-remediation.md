# Phase C.2 security remediation

## Hyp SIGN entry point

- **Removed** public `POST /api/commerce/hyp/sign` (Phase D). Hyp hosted payment sessions are created only via `POST /api/commerce/checkout` → `createPaymentSession` → `hypPayProvider.createPaymentSession` (with `claimPaymentAttemptForSign` before SIGN).
- `startHypSignForPersistedOrder` remains in the codebase for **unit tests** only; it is not exposed as a public API route.

## Browser Supabase destination

- `GET /api/public/site-config` injects `window.NAWAL_PUBLIC_SUPABASE` from server env (no hardcoded project).
- Legacy registrations use `POST /api/retreat-request` (server service role) instead of direct REST with embedded URLs.
- Feedback pages use `buildFeedbackSupabaseInline()` from env.
- Admin dashboard uses `buildAdminInlineScript()`; missing `SUPABASE_URL` sets `YOGA_DASHBOARD_CONFIG.error = "SUPABASE_URL_MISSING"`.

## Staging operator requirements

1. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or project anon env used by `getPublicSupabaseAnonKey`) to the **staging** project only.
2. Set **one** explicit mode: `NAWAL_DEPLOYMENT_MODE` or `DEPLOYMENT_MODE` to `staging` (both must match if both are set).
3. Use a Hyp **test** terminal (`00100…` prefix per existing `isHypTestTerminal`) on staging.
4. On production-like hosts (`NODE_ENV=production` without unambiguous `VERCEL_ENV`), set explicit deployment mode or checkout/Hyp SIGN fails with `DEPLOYMENT_MODE_REQUIRED`.

## Legacy static HTML (Phase D follow-up)

Scoped root `register/*.html`, `retreats/dahab.html`, `retreats/zanzibar.html`, and `feedback/*.html` had embedded Supabase attributes/keys removed. `docs/inventory/*` backups may still contain old strings for reference only.

## Idempotency (Phase D)

Apply `supabase/migrations/010_payment_attempts_active_unique.sql` on the target database. The Hyp provider claims an active attempt before SIGN; duplicate claims return `PAYMENT_SIGN_IN_PROGRESS` (HTTP 409 on checkout). See `docs/security/phase-d-remediation.md`.
