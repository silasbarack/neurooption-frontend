import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  AppWindow, ArrowRight, BookOpen, Camera, ChartColumn, ChartColumnIncreasing, ChartLine, ChartNoAxesColumn,
  CircleCheck, CircleDot, Clock3, CreditCard, LoaderCircle, Lock, Mail, Menu, Monitor, Network, Play, Rocket,
  Shield, ShieldCheck, ShieldHalf, Smartphone, SquareActivity, UserRound, Wallet, X,
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
  { label: "Trading", to: "/trading" },
  { label: "Markets", to: "/markets" },
  { label: "Platform", to: "#platform" },
  { label: "Education", to: "#learn" },
  { label: "About Us", to: "/help" },
  { label: "Help Center", to: "/help" },
];

/* Figures below match the platform: 116 OTC assets in five markets, 22
   indicators, 14 timeframes from 5 seconds to 1 day. Icons follow the
   approved reference design. */
const HERO_BADGES = [
  { icon: <Wallet size={18} />, label: "100+ trading assets" },
  { icon: <ChartLine size={18} />, label: "Advanced charting" },
  { icon: <AppWindow size={18} />, label: "Free demo account" },
  { icon: <ShieldCheck size={18} />, label: "Secure & reliable" },
];

const WHY = [
  { icon: <ChartColumn size={23} />, title: "Advanced charts", text: "Candlestick, line and bar charts with 22 technical indicators." },
  { icon: <Network size={23} />, title: "Wide asset selection", text: "Trade currencies, crypto, commodities, indices and stocks." },
  { icon: <CircleDot size={23} />, title: "Real-time prices", text: "Live prices and instant trade execution, shown in Kenya time." },
  { icon: <AppWindow size={23} />, title: "Customisable workspace", text: "Pick your chart type, background, timeframe and indicators." },
  { icon: <Camera size={23} />, title: "Demo trading", text: "Practise with virtual funds, risk-free." },
  { icon: <SquareActivity size={23} />, title: "Trade history", text: "Review every trade with its open price, result and payout." },
  { icon: <Monitor size={23} />, title: "Multi-device access", text: "The same account in the browser on desktop, tablet and phone." },
  { icon: <Shield size={23} fill="currentColor" />, title: "Secure account management", text: "Email and identity verification, and full control of your account." },
];

const PLATFORM_POINTS = [
  "Interactive charts with 22 indicators",
  "14 timeframes, from 5 seconds to 1 day",
  "100+ assets across five markets",
  "Payout shown and locked before you trade",
  "Seamless desktop and mobile experience",
];

const MARKET_TABS = [
  { key: "All", label: "All markets" },
  { key: "Currencies", label: "Forex" },
  { key: "Commodities", label: "Commodities" },
  { key: "Indices", label: "Indices" },
  { key: "Stocks", label: "Stocks" },
  { key: "Cryptocurrencies", label: "Crypto" },
];

const STEPS = [
  { icon: <UserRound size={22} />, title: "Create your account", text: "Sign up in minutes and confirm your email address." },
  { icon: <ChartNoAxesColumn size={22} />, title: "Explore the demo platform", text: "Practise with virtual funds and learn the platform." },
  { icon: <Rocket size={22} />, title: "Choose how you want to trade", text: "Stay on demo, or fund a real account with M-Pesa." },
];

const SECURITY = [
  { icon: <Lock size={25} />, title: "Secure data encryption", text: "Your data travels over HTTPS and passwords are stored hashed." },
  { icon: <ShieldCheck size={25} />, title: "Account verification", text: "Email and identity (KYC) checks keep your account safe.", tone: "green" },
  { icon: <Smartphone size={25} />, title: "Approve on your phone", text: "M-Pesa deposits are confirmed with your PIN on your own phone." },
  { icon: <CreditCard size={25} />, title: "Secure transactions", text: "Every withdrawal is reviewed before it is paid out." },
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
  { icon: <BookOpen size={25} />, title: "Trading basics", text: "How fixed-time trades, payouts and expiry work.", to: "/help" },
  { icon: <ShieldHalf size={25} />, title: "Risk management", text: "Understand the risks before you trade real money.", to: "/legal/risk-disclosure" },
  { icon: <Play size={25} />, title: "Platform guides", text: "Step-by-step help with the trading screen.", to: "/help" },
  { icon: <ChartColumnIncreasing size={25} />, title: "Market overview", text: "Browse every market with live prices and payouts.", to: "/markets" },
];

const STATS = [
  { icon: <Rocket size={22} />, value: "100+", label: "Trading assets" },
  { icon: <Clock3 size={22} />, value: "24/7", label: "OTC markets", tone: "green" },
  { icon: <Smartphone size={22} />, value: "M-Pesa", label: "Deposits & withdrawals", tone: "green" },
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

function SectionHead({ title, sub, center = true, action }: { title: string; sub: string; center?: boolean; action?: ReactNode }) {
  return (
    <div className={`ho-section-head ${center ? "is-center" : ""}`}>
      <div>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
      {action}
    </div>
  );
}

/** The real NeuroOption trading screen inside a laptop and a phone. */
function Devices({ priority = false }: { priority?: boolean }) {
  return (
    <div className="ho-devices" aria-label="The NeuroOption trading screen on a laptop and a phone">
      <figure className="ho-laptop">
        <div className="ho-laptop-lid">
          <span className="ho-laptop-cam" aria-hidden="true" />
          <div className="ho-laptop-screen">
            <img
              src="/landing/screens/trading-desktop.webp"
              srcSet="/landing/screens/trading-desktop-960.webp 960w, /landing/screens/trading-desktop.webp 1600w"
              sizes="(max-width: 900px) 92vw, 640px"
              alt="NeuroOption trading screen on desktop: EUR/USD OTC candlestick chart with the trade panel"
              width={1600}
              height={1000}
              fetchPriority={priority ? "high" : undefined}
              loading={priority ? undefined : "lazy"}
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
              loading={priority ? undefined : "lazy"}
              decoding="async"
            />
          </div>
        </div>
      </figure>
    </div>
  );
}

/** Six live quotes under the hero. */
function TickerCards() {
  const { quotes } = useQuotes();
  const items = useMemo(() => {
    const wanted = ["EUR/USD OTC", "GBP/USD OTC", "BTC/USD OTC", "ETH/USD OTC", "Gold OTC", "US100 OTC"];
    const picked = wanted.map((s) => quotes.find((q) => q.symbol === s)).filter((q): q is MarketQuote => Boolean(q));
    return picked.length >= 6 ? picked : quotes.slice(0, 6);
  }, [quotes]);
  return (
    <section className="ho-container ho-ticker" aria-label="Live prices">
      {items.map((q) => (
        <Link key={q.symbol} to="/markets" className="ho-ticker-card">
          <span className="ho-ticker-text">
            <b>{q.symbol.replace(/\s*OTC$/i, "")}</b>
            <span>{formatPrice(q)}</span>
            <em className={q.changePercent >= 0 ? "is-up" : "is-down"}>{formatChange(q.changePercent)}</em>
          </span>
          <Spark quote={q} />
        </Link>
      ))}
    </section>
  );
}

function MarketsSection() {
  const { quotes } = useQuotes();
  const [tab, setTab] = useState("All");
  const items = useMemo(() => {
    if (tab !== "All") return quotes.filter((q) => q.category === tab).slice(0, 6);
    // One from each market, then another currency pair, so "All" shows the range.
    const wanted = ["EUR/USD OTC", "Gold OTC", "US100 OTC", "BTC/USD OTC", "Tesla OTC", "GBP/JPY OTC"];
    const picked = wanted.map((s) => quotes.find((q) => q.symbol === s)).filter((q): q is MarketQuote => Boolean(q));
    const rest = quotes.filter((q) => !picked.includes(q));
    return [...picked, ...rest].slice(0, 6);
  }, [quotes, tab]);
  return (
    <section className="ho-section" id="markets">
      <div className="ho-container">
        <SectionHead
          center={false}
          title="Trade global markets"
          sub="Access a wide range of trading instruments from around the world."
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
                <AssetIcon symbol={q.symbol} size={38} />
                <span><b>{q.symbol.replace(/\s*OTC$/i, "")}</b><small>{q.category}</small></span>
              </span>
              <span className="ho-market-foot">
                <span><b>{formatPrice(q)}</b><em className={q.changePercent >= 0 ? "is-up" : "is-down"}>{formatChange(q.changePercent)}</em></span>
                <Spark quote={q} area />
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
    document.title = "NeuroOption | A smarter way to experience the markets";
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
                <Link to="/login" className="ho-btn ho-btn-outline ho-btn-sm">Sign in</Link>
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
          <div className="ho-container ho-hero-inner">
            <div className="ho-hero-copy">
              <p className="ho-eyebrow">The modern trading platform</p>
              <h1>A smarter way to experience <span>the markets.</span></h1>
              <p className="ho-lead">
                Explore global markets through an intuitive trading platform built for speed, clarity and control.
                Practise on a free demo account, then fund a real account with <span className="ho-nowrap">M-Pesa</span> when you are ready.
              </p>
              <div className="ho-hero-cta">
                <PrimaryLink to="/trading">Start trading <ArrowRight size={17} aria-hidden="true" /></PrimaryLink>
                <a href="#platform" className="ho-btn ho-btn-outline">Explore the platform</a>
              </div>
              <ul className="ho-hero-badges">
                {HERO_BADGES.map((b) => (
                  <li key={b.label}><span aria-hidden="true">{b.icon}</span>{b.label}</li>
                ))}
              </ul>
            </div>
            <Devices priority />
          </div>
        </section>

        <TickerCards />

        <section className="ho-section">
          <div className="ho-container">
            <SectionHead title="Why traders choose NeuroOption" sub="A powerful trading experience designed for traders of all levels." />
            <div className="ho-why">
              {WHY.map((f) => (
                <article key={f.title} className="ho-card">
                  <span className="ho-icon" aria-hidden="true">{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ho-section ho-section-tint" id="platform">
          <div className="ho-container ho-split">
            <Devices />
            <div className="ho-split-copy">
              <p className="ho-eyebrow">The NeuroOption platform</p>
              <h2>A trading terminal built for modern traders</h2>
              <p className="ho-split-lead">
                A fast, intuitive trading screen with professional charting, real-time prices and easy trade execution.
                Available on all your devices.
              </p>
              <ul className="ho-checks">
                {PLATFORM_POINTS.map((point) => <li key={point}><CircleCheck size={18} aria-hidden="true" />{point}</li>)}
              </ul>
              <PrimaryLink to="/trading">Explore the platform <ArrowRight size={17} aria-hidden="true" /></PrimaryLink>
            </div>
          </div>
        </section>

        <MarketsSection />

        <section className="ho-section ho-section-tint">
          <div className="ho-container">
            <SectionHead center={false} title="Get started in minutes" sub="Start your trading journey with a simple and straightforward process." />
            <ol className="ho-steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="ho-step">
                  <div><span className="ho-step-num">{i + 1}</span><h3>{s.title}</h3><p>{s.text}</p></div>
                  <span className="ho-step-icon" aria-hidden="true">{s.icon}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ho-section">
          <div className="ho-container ho-security">
            <img
              className="ho-shield"
              src="/landing/security-shield.webp"
              alt=""
              width={600}
              height={424}
              loading="lazy"
              decoding="async"
            />
            <div>
              <SectionHead
                center={false}
                title="Your security comes first"
                sub="We take the security of your account and personal information seriously."
              />
              <div className="ho-security-grid">
                {SECURITY.map((item) => (
                  <article key={item.title} className="ho-card ho-card-row">
                    <span className={`ho-icon ho-icon-square ${item.tone === "green" ? "is-green" : ""}`} aria-hidden="true">{item.icon}</span>
                    <div><h3>{item.title}</h3><p>{item.text}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="ho-section ho-section-tint" id="payments">
          <div className="ho-container">
            <SectionHead title="Payment options" sub="Fund your account and withdraw your money with methods you already use." />
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

        <section className="ho-section" id="learn">
          <div className="ho-container">
            <SectionHead
              center={false}
              title="Learn. Practise. Improve."
              sub="Resources to build your trading knowledge and skills."
              action={<Link to="/help" className="ho-link">Visit the Help Center <ArrowRight size={15} aria-hidden="true" /></Link>}
            />
            <div className="ho-learn">
              {LEARN.map((item) => (
                <Link key={item.title} to={item.to} className="ho-card ho-card-row">
                  <span className="ho-icon ho-icon-square" aria-hidden="true">{item.icon}</span>
                  <div><h3>{item.title}</h3><p>{item.text}</p></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="ho-container ho-cta-wrap">
          <div className="ho-cta-band">
            <div>
              <h2>Ready to experience a smarter way to trade?</h2>
              <p>Start on a free demo account and get to know the platform at your own pace.</p>
            </div>
            <div className="ho-cta-actions">
              <PrimaryLink to="/trading">Start trading now <ArrowRight size={17} aria-hidden="true" /></PrimaryLink>
              <a href="#platform" className="ho-cta-sub">Or explore the platform first</a>
            </div>
          </div>
          <ul className="ho-stats">
            {STATS.map((s) => (
              <li key={s.label}><span className={`ho-icon ${s.tone === "green" ? "is-green" : ""}`} aria-hidden="true">{s.icon}</span><span><b>{s.value}</b>{s.label}</span></li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="ho-footer">
        <div className="ho-container">
          <div className="ho-footer-grid">
            <div className="ho-footer-brand">
              <Link to="/" className="ho-footer-logo" aria-label="NeuroOption home"><Logo loading="lazy" /></Link>
              <p>A smarter way to experience the markets.</p>
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
          <div className="ho-footer-bottom">
            <p>© {new Date().getFullYear()} NeuroOption. All rights reserved.</p>
          </div>
          <p className="ho-risk">
            <ShieldCheck size={18} aria-hidden="true" />
            <span><b>Risk warning:</b> Fixed-time trading involves a high risk of losing the money you invest. You may lose your full stake.
            Only trade with money you can afford to lose, and make sure you understand the risks involved.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
