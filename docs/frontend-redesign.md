# NeuroOption responsive redesign

The user's supplied desktop and mobile references are the approved design brief.
The implementation enhances existing React/TypeScript components and routes.
Gold controls and deep navy surfaces preserve green/red trade states.
The production logo is public/neurooption-logo.png; its bytes and proportions are unchanged.

## Preserved services
- Authentication: shared API/Bearer token and existing login/register/reset forms.
- Account: /account/me, with session-scoped cache and synchronized refresh.
- Markets: /market-data/quotes, historical candles and existing Socket.IO feed.
- Trading: existing engine wallet/open/history/trade endpoints, validations, chart,
  timeframe aggregation, drawing tools and indicators.
- Finance: /finance/me, M-Pesa STK submission/status polling, withdrawals.
- Achievements: calculations from actual trade history.

Social trading has no operational backend integration. Its illustrative profiles
and local following controls are explicitly labeled; no copy orders are submitted.
Unavailable payment methods remain disabled. No payment, withdrawal or trade success
is fabricated. Existing fallback quote data is labeled when displayed.

## Components and routes
Reusable AssetRow and PaymentMethodCard join existing logo, shell, drawer, chart,
trading controls and public homepage components. Existing routes and aliases remain.
Market category links use the category query parameter, preserving asset selection.
Page modules load on demand so the canvas/chart bundle does not delay the homepage.

## Verification and deployment
The managed execution environment failed to start. The isolated GitHub branch is
codex/neurooption-responsive-redesign. The frontend QA workflow installs dependencies,
runs TypeScript/build/ESLint, then browser checks at 1920, 1440, 1366, 1280, 1024,
768, 430, 412, 390, 375 and 360 pixels. Browser fixtures are isolated in the test
script and do not replace production APIs. Financial POSTs are blocked during QA.

The existing Render static site serves dist and automatically deploys main:
https://neurooption-frontend.onrender.com
Only verified source changes are published to main. No environment values, secrets,
backend schema or Render service settings are modified.
