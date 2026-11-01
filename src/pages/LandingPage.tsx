import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Award, CircleCheck, CircleHelp, CreditCard, LoaderCircle, Lock, Mail, Menu, Plus,
  ShieldCheck, Smartphone, X,
} from "lucide-react";

import Logo from "../components/branding/Logo";
import AssetIcon from "../components/markets/AssetIcon";
import PaymentLogo, { type PaymentBrand } from "../components/finance/PaymentLogo";
import { formatChange, formatPrice, useQuotes } from "../components/markets/useQuotes";
import { api } from "../api/api";
import type { MarketQuote } from "../api";
import { getToken } from "../utils/storage";
import "./Home.css";

const NAV = [
  { label: "Platform", to: "#platform" },
  { label: "Markets", to: "#markets" },
  { label: "Demo", to: "#demo" },
  { label: "Payments", to: "#payments" },
  { label: "FAQ", to: "#faq" },
  { label: "Help", to: "/help" },
];

/* Every figure here matches the platform: 116 OTC assets in five markets,
   22 indicators, 14 timeframes from 5 seconds to 1 day, demo refills of
   $20,000 to $100,000 while the balance is under $10,000. */
const FACTS = [
  { value: "100+", label: "OTC assets" },
  { value: "22", label: "indicators" },
  { value: "5s–1D", label: "timeframes" },
  { value: "KES", label: "M-Pesa deposits" },
];

const FEATURES = [
  { title: "Charts that read clearly", text: "Candlestick, line and bar charts, drawing tools and a black or white canvas. Calm by design, so the price stays the focus." },
  { title: "22 indicators, tuned your way", text: "Moving averages, Bollinger Bands, Ichimoku, RSI, MACD, Stochastic and more, each with its own settings." },
  { title: "Fourteen timeframes", text: "From 5-second candles to the daily chart, switched in one tap." },
  { title: "The payout, before you trade", text: "Every asset shows its payout up front, and it stays locked until your trade closes." },
  { title: "Kenya time, everywhere", text: "Charts, trades and history all run on East Africa Time." },
  { title: "One account, every screen", text: "Desktop, tablet or phone in the browser, with nothing to install." },
];

const BADGES = [
  { glyph: "1", title: "First Trade", text: "Complete your first trade" },
  { glyph: "7", title: "7 Day Streak", text: "Trade 7 days in a row" },
  { glyph: "25", title: "Profit Master", text: "Win 25 trades" },
  { glyph: "100", title: "Century Club", text: "Complete 100 trades" },
];

const DEMO_REFILLS = ["$20,000", "$50,000", "$60,000", "$100,000"];

const STEPS = [
  { title: "Create your account", text: "Sign up and confirm your email address." },
  { title: "Practise on demo", text: "Trade live-moving prices with virtual funds." },
  { title: "Go real with M-Pesa", text: "Fund your real account in KES when you are ready." },
];

const SECURITY = [
  { icon: <Lock size={18} />, title: "Encrypted throughout", text: "HTTPS everywhere and passwords stored hashed." },
  { icon: <ShieldCheck size={18} />, title: "Verified accounts", text: "Email and identity (KYC) checks protect your account." },
  { icon: <Smartphone size={18} />, title: "You approve every deposit", text: "M-Pesa asks for your PIN on your own phone." },
  { icon: <CreditCard size={18} />, title: "Reviewed withdrawals", text: "Each withdrawal is checked before it is paid." },
];

/* Only M-Pesa is live; card payments are not built yet. */
const PAYMENTS: { brand: PaymentBrand; name: string; text: string; live: boolean }[] = [
  { brand: "mpesa", name: "M-Pesa", text: "Deposit in KES from your phone with an M-Pesa prompt, and withdraw back to your M-Pesa.", live: true },
  { brand: "visa", name: "Visa", text: "Visa debit and credit card deposits are on the way.", live: false },
  { brand: "mastercard", name: "Mastercard", text: "Mastercard debit and credit card deposits are on the way.", live: false },
];

const FAQ = [
  { q: "What is a demo account?", a: "A demo account lets you trade live-moving prices with virtual funds. Nothing there uses real money, and you can refill it whenever the balance runs low." },
  { q: "How do I deposit?", a: "Sign in, open Finance and choose M-Pesa. Enter your number and the amount, then confirm the prompt on your phone with your M-Pesa PIN. NeuroOption never asks for your PIN." },
  { q: "How do withdrawals work?", a: "Request a withdrawal from Finance. Each request is reviewed and then paid to your M-Pesa number." },
  { q: "What risks should I understand?", a: "Fixed-time trading carries a high risk and you can lose the money you invest. Prices move quickly, past results do not predict future ones, and you should only trade with money you can afford to lose." },
];

const BOARD_TABS = [
  { key: "All", label: "All" },
  { key: "Currencies", label: "Forex" },
  { key: "Cryptocurrencies", label: "Crypto" },
  { key: "Commodities", label: "Commodities" },
  { key: "Indices", label: "Indices" },
  { key: "Stocks", label: "Stocks" },
];

/** A small deterministic sparkline for an asset, so it looks the same on every visit. */
function sparkPath(seed: string, up: boolean) {
  let value = 0;
  for (const char of seed) value = (value * 31 + char.charCodeAt(0)) % 9973;
  const points: number[] = [];
  let y = 50;
  for (let i = 0; i < 24; i++) {
    value = (value * 1103515245 + 12345) % 2147483647;
    y += ((value % 1000) / 1000 - 0.5) * 18 + (up ? -1.1 : 1.1);
    y = Math.max(8, Math.min(92, y));
    points.push(y);
  }
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${(i / 23) * 100},${p.toFixed(1)}`).join(" ");
}

function Spark({ quote }: { quote: MarketQuote }) {
  const up = quote.changePercent >= 0;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className={`ho-spark ${up ? "is-up" : "is-down"}`}>
      <path d={sparkPath(quote.symbol, up)} />
    </svg>
  );
}

function NavLinkItem({ to, label, className, onClick }: { to: string; label: ReactNode; className?: string; onClick?: () => void }) {
  return to.startsWith("#")
    ? <a href={to} className={className} onClick={onClick}>{label}</a>
    : <Link to={to} className={className} onClick={onClick}>{label}</Link>;
}

function PrimaryLink({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) {
  return <Link to={to} className={`ho-btn ho-btn-primary ${className}`}>{children}</Link>;
}

/** Section heading with a running number, in the editorial style. */
function SectionHead({ index, label, title, children }: { index: string; label: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="ho-head">
      <p className="ho-kicker"><span>{index}</span>{label}</p>
      <h2>{title}</h2>
      {children}
    </header>
  );
}

function shortName(symbol: string) {
  return symbol.replace(/\s*OTC$/i, "");
}

/** The real trading screen in a browser window, with the phone screen beside it. */
function HeroScreens() {
  return (
    <div className="ho-screens" aria-label="The NeuroOption trading screen in a browser and on a phone">
      <figure className="ho-window">
        <div className="ho-window-bar" aria-hidden="true">
          <span /><span /><span />
          <em>neurooption.com/trading</em>
        </div>
        <img
          src="/landing/screens/trading-desktop.webp"
          srcSet="/landing/screens/trading-desktop-960.webp 960w, /landing/screens/trading-desktop.webp 1600w"
          sizes="(max-width: 900px) 92vw, 700px"
          alt="NeuroOption trading screen on desktop: EUR/USD OTC candlestick chart with the trade panel"
          width={1600}
          height={1000}
          fetchPriority="high"
          decoding="async"
        />
      </figure>
      <figure className="ho-handset">
        <img
          src="/landing/screens/trading-mobile.webp"
          alt="NeuroOption trading screen on a phone: live chart with BUY and SELL buttons"
          width={585}
          height={1266}
          decoding="async"
        />
      </figure>
    </div>
  );
}

/** Live prices as a market board: one row per asset. */
function MarketBoard() {
  const { quotes, live } = useQuotes();
  const [tab, setTab] = useState("All");
  const rows = useMemo(() => {
    if (tab !== "All") return quotes.filter((q) => q.category === tab).slice(0, 8);
    // A mix across markets, then the rest of the feed.
    const wanted = ["EUR/USD OTC", "BTC/USD OTC", "Gold OTC", "US100 OTC", "Tesla OTC", "GBP/JPY OTC", "ETH/USD OTC", "Apple OTC"];
    const picked = wanted.map((s) => quotes.find((q) => q.symbol === s)).filter((q): q is MarketQuote => Boolean(q));
    return [...picked, ...quotes.filter((q) => !picked.includes(q))].slice(0, 8);
  }, [quotes, tab]);
  return (
    <div className="ho-board">
      <div className="ho-board-top">
        <div className="ho-board-tabs" role="tablist" aria-label="Market categories">
          {BOARD_TABS.map((t) => (
            <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} className={tab === t.key ? "is-active" : ""} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
        <span className={`ho-board-state ${live ? "is-live" : ""}`}><i aria-hidden="true" />{live ? "Live" : "Connecting…"}</span>
      </div>
      <table className="ho-board-table">
        <thead>
          <tr><th scope="col">Asset</th><th scope="col">Price</th><th scope="col">Change</th><th scope="col" className="ho-col-trend">Trend</th><th scope="col">Payout</th><th scope="col"><span className="ho-sr-only">Trade</span></th></tr>
        </thead>
        <tbody>
          {rows.map((q) => (
            <tr key={q.symbol}>
              <th scope="row">
                <span className="ho-board-asset">
                  <AssetIcon symbol={q.symbol} size={30} />
                  <span><b>{shortName(q.symbol)}</b><small>{q.label}</small></span>
                </span>
              </th>
              <td className="ho-num">{formatPrice(q)}</td>
              <td className={`ho-num ${q.changePercent >= 0 ? "is-up" : "is-down"}`}>{formatChange(q.changePercent)}</td>
              <td className="ho-col-trend"><Spark quote={q} /></td>
              <td><span className="ho-payout">{q.payout}%</span></td>
              <td><Link to="/trading" className="ho-board-go" aria-label={`Trade ${shortName(q.symbol)}`}><ArrowUpRight size={16} /></Link></td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={6} className="ho-empty">No markets in this category right now.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setState("busy");
    setMessage("");
    try {
      const result = await api.post<{ message: string }>("/newsletter/subscribe", { email: email.trim(), source: "homepage" }, false);
      setState("done");
      setMessage(result.message);
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Could not subscribe right now. Please try again.");
    }
  }

  return (
    <section className="ho-news" aria-labelledby="ho-news-title">
      <div className="ho-news-icon"><Mail size={22} aria-hidden="true" /></div>
      <div className="ho-news-copy">
        <h2 id="ho-news-title">Stay updated</h2>
        <p>Platform news, new markets and product improvements. A few emails a month, unsubscribe any time.</p>
      </div>
      <form className="ho-news-form" onSubmit={submit} noValidate>
        <label htmlFor="ho-news-email" className="ho-sr-only">Email address</label>
        <input
          id="ho-news-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="ho-btn ho-btn-primary" disabled={state === "busy" || !email.trim()}>
          {state === "busy" ? <><LoaderCircle size={16} className="ho-spin" aria-hidden="true" /> Subscribing…</> : <>Subscribe <ArrowRight size={16} aria-hidden="true" /></>}
        </button>
        {message && (
          <p className={`ho-news-note ${state === "error" ? "is-error" : "is-ok"}`} role={state === "error" ? "alert" : "status"}>
            {state === "done" && <CircleCheck size={15} aria-hidden="true" />} {message}
          </p>
        )}
      </form>
    </section>
  );
}

/** Mobile menu as a real modal: focus moves in and is trapped, the page behind is inert, Escape closes. */
function MobileMenu({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const portalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const siblings = Array.from(document.body.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement && node !== portalRef.current,
    );
    const previousInert = siblings.map((node) => node.inert);
    siblings.forEach((node) => { node.inert = true; });
    document.body.style.overflow = "hidden";
    const focusables = () => Array.from(portalRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
    ) ?? []).filter((node) => node.getClientRects().length > 0);
    const frame = requestAnimationFrame(() => portalRef.current?.querySelector<HTMLElement>(".ho-menu-close")?.focus({ preventScroll: true }));
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      const inside = portalRef.current?.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || !inside)) { event.preventDefault(); last.focus({ preventScroll: true }); }
      else if (!event.shiftKey && (document.activeElement === last || !inside)) { event.preventDefault(); first.focus({ preventScroll: true }); }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      siblings.forEach((node, index) => { node.inert = previousInert[index]; });
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [onClose]);
  return createPortal(
    <div ref={portalRef} className="ho ho-mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">{children}</div>,
    document.body,
  );
}

export default function LandingPage() {
  const signedIn = Boolean(getToken());
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    document.title = "NeuroOption | Trade with clarity, not noise";
  }, []);

  return (
    <div className="ho">
      <header className="ho-header">
        <div className="ho-container ho-header-inner">
          <Link to="/" className="ho-logo" aria-label="NeuroOption home"><Logo /></Link>
          <nav className="ho-nav" aria-label="Main">
            {NAV.map((item) => <NavLinkItem key={item.label} to={item.to} label={item.label} className="ho-nav-link" />)}
          </nav>
          <div className="ho-header-actions">
            {signedIn ? (
              <PrimaryLink to="/trading" className="ho-btn-sm">Open platform <ArrowRight size={15} aria-hidden="true" /></PrimaryLink>
            ) : (
              <>
                <Link to="/login" className="ho-text-link">Sign in</Link>
                <PrimaryLink to="/register" className="ho-btn-sm">Create account</PrimaryLink>
              </>
            )}
          </div>
          <button type="button" className="ho-menu-btn" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <MobileMenu onClose={closeMenu}>
          <div className="ho-mobile-head">
            <Link to="/" className="ho-logo" onClick={() => setMenuOpen(false)}><Logo /></Link>
            <button type="button" className="ho-menu-btn ho-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={22} /></button>
          </div>
          <nav aria-label="Mobile">
            {NAV.map((item) => <NavLinkItem key={item.label} to={item.to} label={item.label} onClick={() => setMenuOpen(false)} />)}
          </nav>
          <div className="ho-mobile-actions">
            {signedIn ? <PrimaryLink to="/trading">Open platform</PrimaryLink> : <>
              <PrimaryLink to="/register">Create account</PrimaryLink>
              <Link to="/login" className="ho-btn ho-btn-outline">Sign in</Link>
            </>}
          </div>
        </MobileMenu>
      )}

      <main>
        <section className="ho-hero">
          <div className="ho-container">
            <div className="ho-hero-grid">
              <div className="ho-hero-copy">
                <p className="ho-kicker">Fixed-time trading platform</p>
                <h1>Trade with <em>clarity,</em> not noise.</h1>
                <p className="ho-lead">
                  A calm, fast trading platform for 100+ global markets. Learn on a free demo account,
                  then trade for real with <span className="ho-nowrap">M-Pesa</span> when you are ready.
                </p>
                <div className="ho-hero-cta">
                  <PrimaryLink to="/trading">Start on demo <ArrowRight size={17} aria-hidden="true" /></PrimaryLink>
                  <Link to="/register" className="ho-btn ho-btn-outline">Open an account</Link>
                </div>
              </div>
              <HeroScreens />
            </div>
            <dl className="ho-facts">
              {FACTS.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
            </dl>
          </div>
        </section>

        <section className="ho-section" id="markets">
          <div className="ho-container">
            <SectionHead index="01" label="Markets" title={<>The market, <em>at a glance.</em></>}>
              <p className="ho-intro">Live prices and the payout for every asset, before you open a single trade. <Link to="/markets" className="ho-inline-link">See all markets <ArrowRight size={14} aria-hidden="true" /></Link></p>
            </SectionHead>
            <MarketBoard />
          </div>
        </section>

        <section className="ho-section ho-section-sand" id="platform">
          <div className="ho-container ho-split">
            <SectionHead index="02" label="Platform" title={<>Built to be <em>read,</em> not decoded.</>}>
              <p className="ho-intro">Every tool a fixed-time trader needs, arranged so the price always comes first.</p>
              <PrimaryLink to="/trading" className="ho-head-cta">Open the platform <ArrowRight size={17} aria-hidden="true" /></PrimaryLink>
            </SectionHead>
            <ol className="ho-features">
              {FEATURES.map((f, i) => (
                <li key={f.title}>
                  <span className="ho-feature-num">{String(i + 1).padStart(2, "0")}</span>
                  <div><h3>{f.title}</h3><p>{f.text}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ho-section" id="demo">
          <div className="ho-container ho-duo">
            <article className="ho-panel ho-panel-ink">
              <p className="ho-kicker"><span>03</span>Demo</p>
              <h2>A demo that <em>never runs dry.</em></h2>
              <p>Practise on live-moving prices with virtual funds. When your balance drops below $10,000, refill it in one tap.</p>
              <div className="ho-refills" aria-label="Demo refill amounts">
                {DEMO_REFILLS.map((amount) => <span key={amount}>{amount}</span>)}
              </div>
              <Link to="/trading" className="ho-btn ho-btn-light">Try the demo <ArrowRight size={17} aria-hidden="true" /></Link>
            </article>
            <article className="ho-panel">
              <p className="ho-kicker"><span>04</span>Achievements</p>
              <h2>Progress you <em>can see.</em></h2>
              <p>Earn badges as you trade, from your first trade to the Veteran badge at 1,000 trades.</p>
              <ul className="ho-badges">
                {BADGES.map((b) => (
                  <li key={b.title}>
                    <span className="ho-badge-medal" aria-hidden="true"><Award size={16} /><b>{b.glyph}</b></span>
                    <span><b>{b.title}</b><small>{b.text}</small></span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="ho-section ho-section-sand" id="start">
          <div className="ho-container">
            <SectionHead index="05" label="Get started" title={<>Three steps to <em>your first trade.</em></>} />
            <ol className="ho-steps">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="ho-step-num">Step {i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ho-section" id="security">
          <div className="ho-container ho-security">
            <img className="ho-shield" src="/landing/security-emblem.svg" alt="" width={600} height={440} loading="lazy" decoding="async" />
            <div>
              <SectionHead index="06" label="Security" title={<>Your security <em>comes first.</em></>} />
              <ul className="ho-rules">
                {SECURITY.map((item) => (
                  <li key={item.title}>
                    <span className="ho-rule-icon" aria-hidden="true">{item.icon}</span>
                    <div><h3>{item.title}</h3><p>{item.text}</p></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="ho-section ho-section-sand" id="payments">
          <div className="ho-container">
            <SectionHead index="07" label="Payments" title={<>Money in, money out, <em>simply.</em></>} />
            <ul className="ho-pay">
              {PAYMENTS.map((p) => (
                <li key={p.brand}>
                  <span className="ho-pay-logo"><PaymentLogo brand={p.brand} label={p.name} /></span>
                  <div><h3>{p.name}</h3><p>{p.text}</p></div>
                  <span className={`ho-pay-status ${p.live ? "is-live" : ""}`}>{p.live ? <><CircleCheck size={14} aria-hidden="true" /> Available</> : "Coming soon"}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ho-section" id="faq">
          <div className="ho-container ho-split">
            <SectionHead index="08" label="FAQ" title={<>Questions, <em>answered.</em></>}>
              <p className="ho-intro">Anything else? <Link to="/help" className="ho-inline-link">Visit the Help Center <ArrowRight size={14} aria-hidden="true" /></Link></p>
            </SectionHead>
            <div className="ho-faq">
              {FAQ.map((item) => (
                <details key={item.q}>
                  <summary><CircleHelp size={18} aria-hidden="true" /><span>{item.q}</span><Plus size={18} className="ho-faq-plus" aria-hidden="true" /></summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="ho-cta">
          <div className="ho-container ho-cta-inner">
            <h2>Clarity is one <em>click away.</em></h2>
            <div className="ho-hero-cta">
              <Link to="/trading" className="ho-btn ho-btn-light">Start on demo <ArrowRight size={17} aria-hidden="true" /></Link>
              {!signedIn && <Link to="/register" className="ho-btn ho-btn-line">Create account</Link>}
            </div>
          </div>
        </section>
      </main>

      <footer className="ho-footer">
        <div className="ho-container">
          <div className="ho-footer-grid">
            <div className="ho-footer-brand">
              <Link to="/" className="ho-logo" aria-label="NeuroOption home"><Logo loading="lazy" /></Link>
              <p>Trade with clarity, not noise.</p>
              <Newsletter />
            </div>
            <div className="ho-footer-col">
              <h3>Trading</h3>
              <Link to="/trading">Trading platform</Link>
              <Link to="/markets">Markets</Link>
              <Link to="/trading">Demo account</Link>
              <Link to="/achievements">Achievements</Link>
              <Link to="/history">Trade history</Link>
            </div>
            <div className="ho-footer-col">
              <h3>Account</h3>
              <Link to="/finance">Deposits</Link>
              <Link to="/finance?tab=withdraw">Withdrawals</Link>
              <Link to="/settings#verification">Verification</Link>
              <Link to="/support">Contact support</Link>
            </div>
            <div className="ho-footer-col">
              <h3>Legal</h3>
              <Link to="/legal/terms">Terms and conditions</Link>
              <Link to="/legal/privacy">Privacy policy</Link>
              <Link to="/legal/risk-disclosure">Risk disclosure</Link>
              <Link to="/legal/aml-kyc">AML and KYC policy</Link>
              <Link to="/legal">All policies</Link>
            </div>
          </div>
          <p className="ho-risk"><ShieldCheck size={16} aria-hidden="true" /><span><b>Risk warning.</b> Fixed-time trading involves a high risk of losing the money you invest, and you may lose your full stake. Only trade with money you can afford to lose.</span></p>
          <div className="ho-footer-bottom">
            <p>© {new Date().getFullYear()} NeuroOption. All rights reserved.</p>
            <p>Prices shown are OTC quotes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
