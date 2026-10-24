# NeuroOption responsive redesign

The supplied desktop and mobile references guide the existing React/TypeScript UI.
Gold controls and deep navy surfaces preserve green/red trading states. The official
production logo, public/neurooption-logo.png, retains its original bytes and proportions.

## Preserved services
- Authentication: shared Bearer token and existing login/register/reset forms.
- Account: /account/me with session-scoped cache, versioned requests and forced post-payment refresh.
- Markets: /market-data/quotes, historical candles and the existing Socket.IO feed.
- Trading: existing engine wallet/open/history/trade endpoints, validations, chart types and indicators.
- Finance: /finance/me, actual M-Pesa STK submission/status polling and withdrawals.
- Profile: existing users/profile save endpoint; actual account KYC status.
- Achievements: calculations from actual trade history.

Trade controls require genuine candles, a valid wallet and a current authoritative payout.
No synthetic chart or random payout is used for execution. Browsing fallback quotes are labelled.
Existing unimplemented drawing overlays are explicitly marked coming soon.
Social profiles are labelled examples; local following and preview Copy controls submit no orders.
Unavailable payment methods stay disabled. No payment, withdrawal, KYC or trade success is fabricated.

## Components and routes
Reusable AssetRow, PaymentMethodCard, PaymentLogo, MarketCategoryArt, MarketTicker,
PlatformStats and GlobalMarketsSection join the existing logo, shell, drawer,
homepage device preview, canvas chart and trading controls. Existing routes and
aliases remain. Market categories use query parameters. Page modules load on demand.

## Verification and deployment
The managed execution environment failed to start. GitHub Actions provides isolated
npm ci, ESLint, TypeScript/build, interaction regressions and browser checks.
Coverage spans 1920, 1440, 1366, 1280, 1024, 768, 430, 412, 390, 375 and 360 pixels.
Browser fixtures are test-only and block financial mutations. Separate real public
backend checks validate quote/asset contracts and unauthenticated account rejection.
Production checks wait for the exact commit through build-info.json, then check the deployed UI.
Workflow shell pipefail makes every failed check block the release.

Render automatically deploys main to https://neurooption-frontend.onrender.com.
No secrets, backend schemas, environment values or Render service settings are changed.

## Live payouts and Kenya time
- Payouts come from the backend payout engine: `/market-data/payouts` on load,
  then the market socket (`asset:payout-snapshot` on every connection,
  `asset:payout-updated` per change, applied in version order). See
  `src/components/trading/payoutStore.ts`. Each badge subscribes to one asset,
  so a payout change never re-renders the chart.
- Orders send the payout shown (`quotedPayoutPercent`, `payoutVersion`). If it
  changed, the backend refuses with 409 `PAYOUT_CHANGED`; the screen shows the
  new payout and no trade is placed.
- All times are UTC instants shown in Africa/Nairobi (EAT, UTC+3):
  `src/utils/kenyaTime.ts`. The clock under the chart and every countdown use
  the server clock (`serverClock.ts`): sampled over the socket, advanced with
  a monotonic timer, re-synced on reconnect, wake-up and clock jumps.
- The chart axis labels real candle opening times on round EAT boundaries and
  shows the date at Kenya midnight. `node scripts/kenya-time.test.mjs` checks
  the conversions.
