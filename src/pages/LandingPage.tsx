import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, BookOpen, ChartColumnIncreasing, CircleCheck, CreditCard, Gauge, Layers, LineChart,
  LoaderCircle, Lock, Mail, Menu, Monitor, Play, ShieldCheck, ShieldHalf, Smartphone, Sparkles, UserRound, Wallet, X,
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
  { label: "Security", to: "#security" },
  { label: "Payments", to: "#payments" },
  { label: "Learn", to: "#learn" },
  { label: "Help", to: "/help" },
];

/* Figures match the platform: 116 OTC assets in five markets, 22
   indicators, 14 timeframes from 5 seconds to 1 day. */
const STATS = [
  { value: "100+", label: "OTC assets", note: "Across five markets" },
  { value: "22", label: "Indicators", note: "Overlays and oscillators" },
  { value: "14", label: "Timeframes", note: "From 5 seconds to 1 day" },
  { value: "24/7", label: "OTC trading", note: "Prices that never close" },
];

const TIMEFRAMES = ["S5", "S15", "S30", "M1", "M5", "M15", "M30", "H1", "H4", "D1"];

const MARKET_TABS = [
  { key: "All", label: "All markets" },
  { key: "Currencies", label: "Forex" },
  { key: "Cryptocurrencies", label: "Crypto" },
  { key: "Commodities", label: "Commodities" },
  { key: "Indices", label: "Indices" },
  { key: "Stocks", label: "Stocks" },
];

const STEPS = [
  { icon: <UserRound size={20} />, title: "Create your account", text: "Sign up in minutes and confirm your email address." },
  { icon: <Play size={20} />, title: "Practise on demo", text: "Trade live-moving prices with virtual funds, no deposit needed." },
  { icon: <Wallet size={20} />, title: "Go real with M-Pesa", text: "Fund your real account in KES when you are ready." },
];

const SECURITY = [
  { icon: <Lock size={20} />, title: "Encrypted end to end", text: "Your data travels over HTTPS and passwords are stored hashed." },
  { icon: <ShieldCheck size={20} />, title: "Verified accounts", text: "Email and identity (KYC) checks keep your account safe." },
  { icon: <Smartphone size={20} />, title: "Approve on your phone", text: "M-Pesa deposits are confirmed with your PIN on your own phone." },
  { icon: <CreditCard size={20} />, title: "Reviewed withdrawals", text: "Every withdrawal is checked before it is paid out." },
];

/* Only M-Pesa is live; card payments are not built yet. */
const PAYMENTS: { brand: PaymentBrand; name: string; text: string; live: boolean }[] = [
  {
    brand: "mpesa",
    name: "M-Pesa",
    text: "Deposit in KES straight from your phone: enter your number, then confirm the prompt with your M-Pesa PIN. Withdrawals are paid back to your M-Pesa.",
    live: true,
  },
  { brand: "visa", name: "Visa", text: "Deposits with Visa debit and credit cards are on the way.", live: false },
  { brand: "mastercard", name: "Mastercard", text: "Deposits with Mastercard debit and credit cards are on the way.", live: false },
];

const LEARN = [
  { icon: <BookOpen size={20} />, title: "Trading basics", text: "How fixed-time trades, payouts and expiry work.", to: "/help" },
  { icon: <ShieldHalf size={20} />, title: "Risk management", text: "Understand the risks before you trade real money.", to: "/legal/risk-disclosure" },
  { icon: <Play size={20} />, title: "Platform guides", text: "Step-by-step help with the trading screen.", to: "/help" },
  { icon: <ChartColumnIncreasing size={20} />, title: "Market overview", text: "Every market with live prices and payouts.", to: "/markets" },
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

function Spark({ quote, area = false }: { quote: MarketQuote; area?: boolean }) {
  const up = quote.changePercent >= 0;
  const line = sparkPath(quote.symbol, up);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className={`ho-spark ${up ? "is-up" : "is-down"}`}>
      {area && <path className="ho-spark-area" d={`${line} L100,100 L0,100 Z`} />}
      <path d={line} />
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

function SectionHead({ eyebrow, title, sub, center = true, action }: { eyebrow: string; title: ReactNode; sub: string; center?: boolean; action?: ReactNode }) {
  return (
    <div className={`ho-section-head ${center ? "is-center" : ""}`}>
      <div>
        <p className="ho-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="ho-sub">{sub}</p>
      </div>
      {action}
    </div>
  );
}

function shortName(symbol: string) {
  return symbol.replace(/\s*OTC$/i, "");
}

/** The real NeuroOption trading screen on a laptop and a phone, with live quote chips. */
function HeroDevices() {
  const { quotes } = useQuotes();
  const eur = quotes.find((q) => q.symbol === "EUR/USD OTC") ?? quotes[0];
  const btc = quotes.find((q) => q.symbol === "BTC/USD OTC") ?? quotes[1];
  const topPayout = quotes.reduce((max, q) => Math.max(max, q.payout || 0), 0);
  return (
    <div className="ho-devices" aria-label="The NeuroOption trading screen on a laptop and a phone">
      <span className="ho-devices-glow" aria-hidden="true" />
      <figure className="ho-laptop">
        <div className="ho-laptop-lid">
          <span className="ho-laptop-cam" aria-hidden="true" />
          <div className="ho-laptop-screen">
            <img
              src="/landing/screens/trading-desktop.webp"
              srcSet="/landing/screens/trading-desktop-960.webp 960w, /landing/screens/trading-desktop.webp 1600w"
              sizes="(max-width: 900px) 92vw, 680px"
              alt="NeuroOption trading screen on desktop: EUR/USD OTC candlestick chart with the trade panel"
              width={1600}
              height={1000}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
        <div className="ho-laptop-base" aria-hidden="true"><span /></div>
      </figure>
      <figure className="ho-phone">
        <div className="ho-phone-body">
          <span className="ho-phone-island" aria-hidden="true" />
          <div className="ho-phone-screen">
            <img
              src="/landing/screens/trading-mobile.webp"
              alt="NeuroOption trading screen on a phone: live chart with BUY and SELL buttons"
              width={585}
              height={1266}
              decoding="async"
            />
          </div>
        </div>
      </figure>
      {eur && (
        <div className="ho-chip ho-chip-a" aria-hidden="true">
          <AssetIcon symbol={eur.symbol} size={30} />
          <span><small>{shortName(eur.symbol)}</small><b>{formatPrice(eur)}</b></span>
          <em className={eur.changePercent >= 0 ? "is-up" : "is-down"}>{formatChange(eur.changePercent)}</em>
        </div>
      )}
      {btc && (
        <div className="ho-chip ho-chip-b" aria-hidden="true">
          <AssetIcon symbol={btc.symbol} size={30} />
          <span><small>{shortName(btc.symbol)}</small><b>{formatPrice(btc)}</b></span>
          <Spark quote={btc} />
        </div>
      )}
      {topPayout > 0 && (
        <div className="ho-chip ho-chip-c" aria-hidden="true">
          <span className="ho-chip-icon"><Gauge size={16} /></span>
          <span><small>Payout up to</small><b>{topPayout}%</b></span>
        </div>
      )}
    </div>
  );
}

/** Asset logos with live prices, gliding from right to left. */
function AssetMarquee() {
  const { quotes } = useQuotes();
  const items = useMemo(() => quotes.slice(0, 14), [quotes]);
  if (!items.length) return null;
  const row = (hidden: boolean) => (
    <ul className="ho-marquee-row" aria-hidden={hidden || undefined}>
      {items.map((q) => (
        <li key={q.symbol}>
          <Link to="/markets" tabIndex={hidden ? -1 : undefined} className="ho-marquee-item">
            <AssetIcon symbol={q.symbol} size={28} />
            <b>{shortName(q.symbol)}</b>
            <span>{formatPrice(q)}</span>
            <em className={q.changePercent >= 0 ? "is-up" : "is-down"}>{formatChange(q.changePercent)}</em>
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <section className="ho-marquee" aria-label="Live prices">
      <div className="ho-marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}

function MarketsSection() {
  const { quotes } = useQuotes();
  const [tab, setTab] = useState("All");
  const items = useMemo(() => {
    if (tab !== "All") return quotes.filter((q) => q.category === tab).slice(0, 8);
    const wanted = ["EUR/USD OTC", "BTC/USD OTC", "Gold OTC", "US100 OTC", "Tesla OTC", "GBP/JPY OTC", "ETH/USD OTC", "Apple OTC"];
    const picked = wanted.map((s) => quotes.find((q) => q.symbol === s)).filter((q): q is MarketQuote => Boolean(q));
    const rest = quotes.filter((q) => !picked.includes(q));
    return [...picked, ...rest].slice(0, 8);
  }, [quotes, tab]);
  return (
    <section className="ho-section" id="markets">
      <div className="ho-container">
        <SectionHead
          center={false}
          eyebrow="Markets"
          title={<>Global markets, <span>one account.</span></>}
          sub="Currencies, crypto, commodities, indices and stocks, with live prices and the payout shown up front."
          action={<Link to="/markets" className="ho-link">View all markets <ArrowRight size={15} aria-hidden="true" /></Link>}
        />
        <div className="ho-tabs" role="tablist" aria-label="Market categories">
          {MARKET_TABS.map((t) => (
            <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} className={tab === t.key ? "is-active" : ""} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="ho-market-grid">
          {items.map((q) => (
            <Link key={q.symbol} to={`/markets?category=${encodeURIComponent(q.category)}`} className="ho-market-card">
              <span className="ho-market-head">
                <AssetIcon symbol={q.symbol} size={36} />
                <span><b>{shortName(q.symbol)}</b><small>{q.category}</small></span>
                {q.payout > 0 && <span className="ho-payout">{q.payout}%</span>}
              </span>
              <Spark quote={q} area />
              <span className="ho-market-foot">
                <b>{formatPrice(q)}</b>
                <em className={q.changePercent >= 0 ? "is-up" : "is-down"}>{formatChange(q.changePercent)}</em>
              </span>
            </Link>
          ))}
          {!items.length && <p className="ho-empty">No markets in this category right now.</p>}
        </div>
      </div>
    </section>
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
    document.title = "NeuroOption | Trade the markets with precision";
  }, []);

  return (
    <div className="ho">
      <header className="ho-header">
        <div className="ho-container">
          <div className="ho-header-bar">
            <Link to="/" className="ho-logo" aria-label="NeuroOption home"><Logo /></Link>
            <nav className="ho-nav" aria-label="Main">
              {NAV.map((item) => <NavLinkItem key={item.label} to={item.to} label={item.label} className="ho-nav-link" />)}
            </nav>
            <div className="ho-header-actions">
              {signedIn ? (
                <PrimaryLink to="/trading" className="ho-btn-sm">Open platform <ArrowRight size={15} aria-hidden="true" /></PrimaryLink>
              ) : (
                <>
                  <Link to="/login" className="ho-btn ho-btn-ghost ho-btn-sm">Sign in</Link>
                  <PrimaryLink to="/register" className="ho-btn-sm">Create account</PrimaryLink>
                </>
              )}
            </div>
            <button type="button" className="ho-menu-btn" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
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
          <div className="ho-container ho-hero-inner">
            <div className="ho-hero-copy">
              <p className="ho-pill"><span className="ho-live-dot" aria-hidden="true" /> Live prices on 100+ OTC assets</p>
              <h1>Trade the markets with <span>precision.</span></h1>
              <p className="ho-lead">
                Professional charts, live prices and a payout you see before every trade. Practise free on demo,
                then fund a real account with <span className="ho-nowrap">M-Pesa</span> when you are ready.
              </p>
              <div className="ho-hero-cta">
                <PrimaryLink to="/trading">Start trading free <ArrowRight size={17} aria-hidden="true" /></PrimaryLink>
                <Link to="/register" className="ho-btn ho-btn-glass">Open a real account</Link>
              </div>
              <ul className="ho-trust">
                <li><CircleCheck size={16} aria-hidden="true" /> Free demo account</li>
                <li><CircleCheck size={16} aria-hidden="true" /> M-Pesa deposits</li>
                <li><CircleCheck size={16} aria-hidden="true" /> Charts in Kenya time</li>
              </ul>
            </div>
            <HeroDevices />
          </div>
        </section>

        <AssetMarquee />

        <section className="ho-section" id="platform">
          <div className="ho-container">
            <SectionHead
              eyebrow="The platform"
              title={<>Built for traders who <span>expect more.</span></>}
              sub="Everything you need to read the market and act on it, on one clear screen."
            />
            <div className="ho-bento">
              <article className="ho-tile ho-tile-chart">
                <div className="ho-tile-copy">
                  <span className="ho-icon" aria-hidden="true"><LineChart size={20} /></span>
                  <h3>Professional charting</h3>
                  <p>Candlestick, line and bar charts with drawing tools, a black or white canvas and every timeframe a click away.</p>
                </div>
                <img src="/landing/screens/trading-chart.webp" alt="EUR/USD OTC one-minute candlestick chart on NeuroOption" width={1200} height={970} loading="lazy" decoding="async" />
              </article>
              <article className="ho-tile">
                <span className="ho-tile-num">22</span>
                <h3>Technical indicators</h3>
                <p>Moving averages, Bollinger Bands, RSI, MACD and more, each with its own settings.</p>
              </article>
              <article className="ho-tile">
                <h3>14 timeframes</h3>
                <p>From 5-second candles to the daily chart.</p>
                <div className="ho-tf" aria-hidden="true">{TIMEFRAMES.map((tf) => <span key={tf} className={tf === "M1" ? "is-on" : ""}>{tf}</span>)}</div>
              </article>
              <article className="ho-tile">
                <span className="ho-icon" aria-hidden="true"><Lock size={20} /></span>
                <h3>Payout locked in</h3>
                <p>See your payout before you trade. It stays fixed until the trade closes.</p>
              </article>
              <article className="ho-tile">
                <span className="ho-icon" aria-hidden="true"><Monitor size={20} /></span>
                <h3>Every device</h3>
                <p>The same account in the browser on desktop, tablet and phone. Nothing to install.</p>
              </article>
              <article className="ho-tile ho-tile-accent">
                <span className="ho-icon" aria-hidden="true"><Sparkles size={20} /></span>
                <h3>Free demo account</h3>
                <p>Practise on live-moving prices with virtual funds, as long as you like.</p>
                <Link to="/trading" className="ho-link">Try the demo <ArrowUpRight size={15} aria-hidden="true" /></Link>
              </article>
            </div>
          </div>
        </section>

        <section className="ho-band" aria-label="NeuroOption in numbers">
          <div className="ho-container ho-stats">
            {STATS.map((s) => (
              <div key={s.label} className="ho-stat">
                <b>{s.value}</b>
                <span>{s.label}</span>
                <small>{s.note}</small>
              </div>
            ))}
          </div>
        </section>

        <MarketsSection />

        <section className="ho-section ho-section-tint">
          <div className="ho-container">
            <SectionHead eyebrow="Get started" title={<>From sign-up to first trade <span>in minutes.</span></>} sub="Three simple steps, at your own pace." />
            <ol className="ho-steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="ho-step">
                  <span className="ho-step-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ho-icon" aria-hidden="true">{s.icon}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
            <div className="ho-center"><PrimaryLink to="/register">Create your free account <ArrowRight size={17} aria-hidden="true" /></PrimaryLink></div>
          </div>
        </section>

        <section className="ho-section ho-dark" id="security">
          <div className="ho-container ho-security">
            <img className="ho-shield" src="/landing/security-shield.webp" alt="" width={600} height={424} loading="lazy" decoding="async" />
            <div>
              <SectionHead
                center={false}
                eyebrow="Security"
                title={<>Your security <span>comes first.</span></>}
                sub="Protection built into every step, from sign-in to withdrawal."
              />
              <div className="ho-security-grid">
                {SECURITY.map((item) => (
                  <article key={item.title} className="ho-glass">
                    <span className="ho-icon" aria-hidden="true">{item.icon}</span>
                    <div><h3>{item.title}</h3><p>{item.text}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="ho-section" id="payments">
          <div className="ho-container">
            <SectionHead eyebrow="Payments" title={<>Fund your account <span>your way.</span></>} sub="Deposit and withdraw with methods you already use." />
            <div className="ho-pay">
              {PAYMENTS.map((p) => (
                <article key={p.brand} className="ho-card ho-pay-card">
                  <div className="ho-pay-logo"><PaymentLogo brand={p.brand} label={p.name} /></div>
                  <h3>{p.name} <span className={`ho-pay-status ${p.live ? "is-live" : ""}`}>{p.live ? "Available" : "Coming soon"}</span></h3>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ho-section ho-section-tint" id="learn">
          <div className="ho-container">
            <SectionHead
              center={false}
              eyebrow="Learn"
              title={<>Learn. Practise. <span>Improve.</span></>}
              sub="Resources to build your trading knowledge and skills."
              action={<Link to="/help" className="ho-link">Visit the Help Center <ArrowRight size={15} aria-hidden="true" /></Link>}
            />
            <div className="ho-learn">
              {LEARN.map((item) => (
                <Link key={item.title} to={item.to} className="ho-card ho-learn-card">
                  <span className="ho-icon" aria-hidden="true">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <ArrowUpRight className="ho-learn-arrow" size={18} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="ho-container ho-cta-wrap">
          <div className="ho-cta">
            <p className="ho-pill"><Layers size={14} aria-hidden="true" /> 100+ assets · 22 indicators · M-Pesa</p>
            <h2>Your next trade <span>starts here.</span></h2>
            <p>Open a free demo account in minutes and trade live-moving prices risk-free.</p>
            <div className="ho-hero-cta">
              <PrimaryLink to="/trading">Start trading free <ArrowRight size={17} aria-hidden="true" /></PrimaryLink>
              {!signedIn && <Link to="/login" className="ho-btn ho-btn-glass">Sign in</Link>}
            </div>
          </div>
        </section>
      </main>

      <footer className="ho-footer">
        <div className="ho-container">
          <div className="ho-footer-grid">
            <div className="ho-footer-brand">
              <Link to="/" className="ho-footer-logo" aria-label="NeuroOption home"><Logo loading="lazy" /></Link>
              <p>Trade the markets with precision.</p>
              <Newsletter />
            </div>
            <div className="ho-footer-col">
              <h3>Trading</h3>
              <Link to="/trading">Trading platform</Link>
              <Link to="/markets">Markets</Link>
              <Link to="/trading">Demo account</Link>
              <Link to="/open-trades">Open trades</Link>
              <Link to="/history">Trade history</Link>
            </div>
            <div className="ho-footer-col">
              <h3>Company</h3>
              <Link to="/help">About us</Link>
              <Link to="/support">Contact</Link>
            </div>
            <div className="ho-footer-col">
              <h3>Help Center</h3>
              <Link to="/help">FAQ</Link>
              <Link to="/finance">Deposits</Link>
              <Link to="/finance?tab=withdraw">Withdrawals</Link>
              <Link to="/settings#verification">Account verification</Link>
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
          <p className="ho-risk">
            <ShieldCheck size={18} aria-hidden="true" />
            <span><b>Risk warning:</b> Fixed-time trading involves a high risk of losing the money you invest. You may lose your full stake.
            Only trade with money you can afford to lose, and make sure you understand the risks involved.</span>
          </p>
          <div className="ho-footer-bottom">
            <p>© {new Date().getFullYear()} NeuroOption. All rights reserved.</p>
            <p>Prices shown are OTC quotes and may differ from other markets.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
