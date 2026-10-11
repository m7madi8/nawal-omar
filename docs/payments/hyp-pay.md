# Hyp Pay (YaadPay) integration

This project prepares [Hyp Pay](https://developers.hyp.co.il/pay) for hosted payment pages. **Live charges stay off** until the merchant sets credentials and `HYP_PAYMENTS_ENABLED=true`.

## Where the code lives

| Area | Path |
|------|------|
| Provider + registry | `lib/commerce/payment/index.js` |
| Hyp Pay module | `lib/commerce/payment/hyp-pay/` |
| Idempotent confirmation | `lib/commerce/payment/confirmation.js` |
| Transaction log (Supabase) | `lib/commerce/payment/records.js` |
| Checkout wiring | `lib/commerce/checkout.js` |
| Success redirect (VERIFY) | `app/api/payment/hyp/return/route.js` |
| Programmatic confirm | `app/api/commerce/confirm/route.js` (`method: "hyp"`) |
| DB migration | `supabase/migrations/003_payment_transactions.sql` |

## Environment variables

Official Hyp Pay API credentials (from Hyp Portal → Payment Page and API):

| Variable | Maps to Hyp Pay | Required |
|----------|-----------------|----------|
| `HYP_TERMINAL_ID` | `Masof` (terminal number) | Yes |
| `HYP_API_KEY` | `KEY` | Yes |
| `HYP_API_PASSP` | `PassP` (API password; not portal login password) | Yes |
| `HYP_PAYMENTS_ENABLED` | — | Yes (`true` to create live sign requests) |
| `HYP_ENVIRONMENT` | `test` or `production` (informational; test terminals start with `00100`) | Recommended |
| `HYP_RETURN_URL` | Success URL in Hyp Portal (defaults to `{site}/api/payment/hyp/return`) | Recommended |
| `HYP_PAGE_LANG` | `HEB` or `ENG` | Optional |
| `HYP_PAGE_TEMPLATE` | `tmp` template id | Optional |

Aliases supported for compatibility: `HYP_PASSWORD`, `HYP_PASSP`, `HYP_TERMINAL_MASOF`.

**Not used by Hyp Pay Pay API:** separate merchant ID, portal username, or server webhook URL. Confirmation is via customer redirect + server `APISign` `VERIFY` ([transaction validation](https://developers.hyp.co.il/pay/security/transaction-validation.md)).

Also set `NEXT_PUBLIC_SITE_URL` (or deploy host) so return URLs resolve correctly.

## Payment flow

1. Client calls `POST /api/commerce/checkout` with `payment: "hyp"` and optional `depositAmount` / `chargeAmount`.
2. Server creates `commerce_orders` row (`payment_status` pending/unpaid, metadata includes `chargeAmount`, `paymentKind`).
3. Server calls Hyp `GET https://pay.hyp.co.il/p/?action=APISign&What=SIGN&...` and receives a signed query string.
4. Client redirects the customer to `https://pay.hyp.co.il/p/?{signed params}`.
5. After payment, Hyp redirects to your success URL with query parameters (`Id`, `CCode`, `Amount`, `Order`, `Sign`, …).
6. `GET /api/payment/hyp/return` forwards the **raw** query string to Hyp `APISign` `VERIFY`, checks `CCode=0`, matches amount to `chargeAmount`, then marks the order paid (idempotent by `Id`).
7. Event capacity counts gateway orders only when `payment_status` is `paid`.

## Deposits

Send `depositAmount` (or `chargeAmount`) less than line total. Metadata stores `paymentKind: "deposit"` and `amountDue` (full total). Booking is not capacity-secured until the deposit payment verifies.

## Yoga & events (primary card flow)

| Surface | Path | Checkout |
|---------|------|----------|
| Haifa Yoga | `/workshops/haifa` | `commerceType: lesson`, `itemId: haifa-yoga` |
| Events | `/events/sound-healing`, etc. | `commerceType: event`, `itemId` from catalog |
| Wadi Rum retreat | `/register/wadi-rum` | `commerceType: retreat`, `itemId: wadi-rum`, `depositAmount: 400` |

When `HYP_PAYMENTS_ENABLED=true` and terminal credentials are set, `GET /api/commerce/payment-options` returns `hypLive: true` and the UI defaults to **secure card payment** (Bit/bank remains secondary).

**`.env.local` checklist**

1. `HYP_PAYMENTS_ENABLED=true`
2. `HYP_TERMINAL_ID`, `HYP_API_KEY`, `HYP_API_PASSP` from Hyp Portal
3. `HYP_RETURN_URL=https://<your-domain>/api/payment/hyp/return` (same URL in Hyp Portal success page)
4. `NEXT_PUBLIC_SITE_URL=https://<your-domain>`
5. `BOOKING_ACCESS_SECRET` — long random string (signed return links)

Supabase: run migrations `001`, `003`, `004` (minimum for checkout + receipts).

## Switching test → production

Per [Safe Testing & Environments](https://developers.hyp.co.il/pay/getting-started/testing-environments.md):

1. Use test terminal (`Masof` starting with `00100`) and test card during integration.
2. Configure the same success URL in Hyp Portal.
3. For production: replace `HYP_TERMINAL_ID`, `HYP_API_KEY`, `HYP_API_PASSP`, set `HYP_ENVIRONMENT=production`, keep `HYP_PAYMENTS_ENABLED=true` only when ready.

API base URL stays `https://pay.hyp.co.il/p/`.

## Merchant still needs to provide

- Signed Hyp service agreement and acquiring setup
- Test and production terminal numbers (`Masof`)
- API key and `PassP` from Hyp Portal
- Success page URL configured in portal (must match `HYP_RETURN_URL` or default return route)
- Optional: page template, 3DS / Bit / wallet settings in portal

## Development without Hyp

Default checkout methods (`manual`, `whatsapp`, `cash`) are unchanged. Card checkout (`payment: hyp`) requires live Hyp credentials; otherwise the API returns `503` / `HYP_DISABLED`. There is no demo or mock card charge in this project.
