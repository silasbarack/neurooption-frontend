# NeuroOption — Premium frontend UI/UX redesign

## Audit (31 October 2026)

Existing frontend is **React 19 + TypeScript 6 + Vite 8 + React Router 7**, with Lucide icons and conventional CSS. There is no Tailwind or shadcn/ui in the current package manifest. Phase 1 therefore extends the existing CSS and shared React components rather than introducing a potentially disruptive styling migration.

- Real routes and access control: `src/App.tsx`; landing is `/`, user authentication is `/login`, `/register`, and protected trading is `/trading`.
- Public site: `src/pages/LandingPage.tsx` and `src/pages/Home.css`.
- Branding: `src/components/branding/Logo.tsx` uses the existing transparent NeuroOption artwork in `public/brand/`. The original image is retained with no logo re-rendering or colour changes.
- Market access: `src/components/markets/useQuotes.ts` feeds the public markets section. Fallback market prices exist in the code but **must not be presented to visitors as live**.
- Frontend already includes the trading terminal, indicators, account and wallet/finance pages, KYC/account management, admin console, and customer-community pages. Those were **not** redesigned in Phase 1.
- The landing page currently offers M-Pesa as an integrated method; other payment rails are described as coming soon. Never imply unsupported payment options are available.

## Phase 1 implementation — branch `design/premium-phase1-2026`

- Added `HomePremium.css` as an isolated brand-token and responsive presentation layer using deep navy `#0B2346`, blue `#086DA8`, turquoise `#13B8B6`, white and Noto Sans.
- Updated the hero to **Trade with Clarity. Navigate Every Opportunity.** with Explore Platform and Try Demo CTAs, preserving the embedded screenshot assets of the existing trading interface.
- Expanded the navigation with a How It Works anchor and improved its About anchor.
- Added five FAQ disclosures covering the platform, demo experience, OTC pricing, payments and risks.
- Added explicit speculative-risk microcopy and changed the homepage quote panels to **hide** fallback prices unless a genuinely live market feed has responded.
- Preserved the existing newsletter form, responsive accessible mobile modal, platform showcase, education, markets, payment and security sections, and established link routes.

## Route/page inventory (existing — not newly implemented)

Public: `/`, `/markets`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/account-deleted`, `/newsletter/unsubscribe`, `/legal`, `/legal/:slug`.

Protected/customer: `/trading`, `/finance`, `/profile`, `/settings`, `/support`, `/help`, `/achievements`, `/tournaments`, `/open-trades`, `/history`, `/signals`, `/social-trading`, `/express-trades`, `/delete-account`.

Admin: `/admin`, `/admin/setup`. Additional aliases exist in `src/App.tsx`; this list is not a claim of complete backend feature readiness.

## Validation and next phases

Changes are isolated to `src/pages/` and this documentation. No backend endpoints, DB schemas, role checks, financial calculations or secrets were modified. Automated build and real-browser QA **have not been executed in this environment**. Before merging to `main`, run `npm ci && npm run lint && npm run build`; check real desktop/mobile layouts at 360, 390, 768, 1024, 1440; verify internal anchors, keyboard navigation, menu focus, live quotes, reduced motion and all CTA paths.

- Phase 2: visual authentication and customer dashboard update while preserving reCAPTCHA.
- Phase 3: trading terminal visual rework while retaining server-authoritative settlement and market feeds.
- Phase 4: payments and KYC.
- Phase 5: social features, signals, tournaments and support.
- Phase 6: role-protected admin views, accessibility and responsive QA.

Do not merge or deploy until the application's actual build, tests and product-owner review succeed.
