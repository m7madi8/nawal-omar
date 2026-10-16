# In-site campaigns

A small, calm system for announcing something (a retreat, an event) inside the site. It is separate from
analytics consent: it never sends anything anywhere, so rejecting analytics does not disable it.

**State of this release: no campaign is active.** The only entry is a draft test fixture, so nothing is
rendered, nothing is stored and no campaign code or CSS is downloaded.

## Where things live

| File | Role |
|---|---|
| `lib/campaigns/campaigns.js` | The list of campaigns. The only file you edit to add or change one. |
| `lib/campaigns/engine.js` | Schema validation, rules, storage, overlay guard. Pure functions, unit-tested. |
| `lib/campaigns/resolve.js` | Server side: keeps only `active` campaigns, links `eventRef` to the catalog. |
| `components/CampaignLoader.jsx` | Lazy loader. Rendered only if at least one campaign is active. |
| `components/CampaignHost.jsx` | Browser side: timing, rendering, focus, dismiss. |
| `public/css/campaigns.css` | Flat styles. Loaded only when a campaign is about to show. |
| `scripts/test-campaigns.mjs` | `npm run test:campaigns` |

## Adding a campaign

Copy the fixture, give it a new unique lowercase `id`, fill in `ar` and `en` (both are required), keep it
`draft`, and run `npm run test:campaigns`. A campaign that fails validation is dropped (and reported in
development); it never breaks a page. Field reference: header comment of `campaigns.js`.

Rules the schema enforces: unknown fields are rejected; dates need an explicit offset
(`2026-11-01T09:00:00+02:00`); text is plain (no HTML, no direction-control characters); links are internal
paths or `https` on an allow-listed host (no `javascript:`, no unknown external hosts); images are local
`/media/*` files with width, height and AR/EN alt text.

## When a campaign may show

All of these must hold, otherwise nothing is shown:

- `status` is `active`, and now is inside `[startsAt, endsAt)`.
- The page is listed in `pages` and is not hard-excluded (booking, payment, registration, health, thank-you,
  admin, shop, API and similar paths) and is not the campaign's own destination.
- The browser has not exceeded `maxImpressions`, the `cooldownDays` have passed since it was last shown or
  closed, and no other campaign was shown in the last 24 hours.
- Browser storage works (read-back verified). If it does not, nothing is shown: failing storage can never
  cause a repeat loop.
- No other dialog or bar is on screen: consent banner or dialog, thank-you dialog, open mobile menu,
  registration dialogs, the Wadi Rum sticky booking bar. If one appears later, the campaign hides and
  does not come back in that page view.
- With `eventRef`: the catalog item is `open`, and the campaign ends when the item starts. The catalog
  status is static data, not live seat availability.

Timing: a strip appears after 8 seconds on the page, a modal after 20 seconds plus a real action (scroll,
tap, key). Only visible-tab time counts. At most one campaign per page view. Never on load, no exit-intent,
no mouse tracking. Reduced motion is respected. Closing is always one click or Esc.

## What is stored (browser only)

Key `ny-campaigns` in `localStorage`: per campaign id, a count of impressions, the time last shown and the
time it was closed or its link used. Entries older than 90 days are dropped. No personal, health or booking
data, no identifiers, nothing is sent to any server. The key is only written once a campaign is actually
shown or dismissed.

## Before activating a real campaign

1. Owner confirms that the event is really open and approves copy, claims, dates and image.
2. `ny-campaigns` is listed on the draft privacy page (`app/privacy/page.jsx`) as a "site feature". Its legal
   classification (necessary or not, and whether it needs consent) is NOT decided: that is a human/legal
   decision to make at the privacy review, before any campaign goes live. This system makes no claim that it is
   exempt from consent.
3. Review on real phones and desktop, in Arabic (RTL) and English: copy length, strip position next to the
   scroll rail, the modal with and without an image.
4. Update the test "no campaign is active in this release" in `scripts/test-campaigns.mjs` deliberately.
5. Run `npm run test:campaigns` and `npm run test:consent`, then do a real browser pass.
