import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  ArrowRight, BarChart3, ChevronDown, ChevronRight, CircleCheck, CircleHelp, Clock3, GraduationCap,
  LineChart, LoaderCircle, Mail, Menu, MonitorSmartphone, Plus, UserRound, X,
} from "lucide-react";

import Logo from "../components/branding/Logo";
import AssetIcon from "../components/markets/AssetIcon";
import PaymentLogo from "../components/finance/PaymentLogo";
import { formatChange, useQuotes } from "../components/markets/useQuotes";
import { api } from "../api/api";
import { getToken } from "../utils/storage";
import "./Home.css";

type NavLink = { label: string; to: string };
type NavItem = { label: string; to?: string; links?: NavLink[] };

const NAV: NavItem[] = [
  {
    label: "Platform",
    links: [
      { label: "Web trading platform", to: "/trading" },
      { label: "Demo account", to: "/trading" },
      { label: "Open trades", to: "/open-trades" },
      { label: "Trade history", to: "/history" },
    ],
  },
  {
    label: "Markets",
    links: [
      { label: "All markets", to: "/markets" },
      { label: "Currencies", to: "/markets?category=Currencies" },
      { label: "Cryptocurrencies", to: "/markets?category=Cryptocurrencies" },
      { label: "Commodities", to: "/markets?category=Commodities" },
      { label: "Stocks", to: "/markets?category=Stocks" },
    ],
  },
  { label: "Payments", to: "#payments" },
  { label: "Support", to: "/help" },
];

/** Hero highlights: only things the platform really does today. */
const HERO_POINTS = [
  { title: "Free demo account", text: "Practise with virtual funds on live-moving prices. No deposit needed." },
  { title: "M-Pesa deposits and withdrawals", text: "Fund your real account in KES and withdraw back to M-Pesa." },
  { title: "Payout locked when you trade", text: "See the payout before you open a trade; it stays fixed until it closes." },
  { title: "Charts in Kenya time (EAT)", text: "Chart times and your trade history follow East Africa Time." },
];

const HERO_MARKETS = ["Currencies", "Cryptocurrencies", "Commodities", "Stocks"];

const FEATURES = [
  { icon: <BarChart3 size={26} />, title: "Clear charting", text: "Clean, interactive charts with simple controls." },
  { icon: <GraduationCap size={26} />, title: "Demo practice", text: "Explore the markets risk-free with a demo account." },
  { icon: <MonitorSmartphone size={26} />, title: "Across your devices", text: "A seamless experience on desktop, tablet and mobile." },
];

const TOOLS = [
  { icon: <BarChart3 size={22} />, title: "Flexible chart views", text: "Choose from candlesticks, lines and more, with multiple time frames." },
  { icon: <LineChart size={22} />, title: "Technical indicators", text: "Apply popular indicators to support your analysis." },
  { icon: <Clock3 size={22} />, title: "Trade history", text: "View your past trades and learn from your experience." },
];

const STEPS = [
  { icon: <UserRound size={22} />, title: "Create your account", text: "Sign up in minutes and set up your demo account." },
  { icon: <BarChart3 size={22} />, title: "Explore the demo", text: "Try out the platform with virtual funds and explore the markets." },
  { icon: <MonitorSmartphone size={22} />, title: "Get familiar with the platform", text: "Practise placing trades, using chart tools and exploring features." },
];

const FAQ = [
  {
    q: "What is a demo account?",
    a: "A demo account lets you trade with virtual funds on live-moving prices. Nothing you do there uses real money, so it is the safest way to learn the platform.",
  },
  {
    q: "How do I add funds?",
    a: "Sign in, open Finance and choose a payment method. M-Pesa deposits are confirmed on your phone with your M-Pesa PIN. NeuroOption never asks for your PIN.",
  },
  {
    q: "Can I trade on mobile?",
    a: "Yes. NeuroOption works in the browser on any phone, tablet or computer, with a layout designed for each screen size. There is nothing to install.",
  },
  {
    q: "What risks should I understand?",
    a: "Trading involves significant risk and you may lose the money you invest. Prices move quickly, past results do not predict future results, and you should only trade with money you can afford to lose.",
  },
];

const CHART_ASSETS = ["EUR/USD OTC", "GBP/USD OTC", "USD/JPY OTC", "Gold OTC"];

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

function NavMenu({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  if (!item.links) {
    return item.to?.startsWith("#")
      ? <a href={item.to} className="ho-nav-link">{item.label}</a>
      : <Link to={item.to ?? "/"} className="ho-nav-link">{item.label}</Link>;
  }
  return (
    <div className="ho-nav-item" onMouseLeave={() => setOpen(false)}>
      <button type="button" className="ho-nav-link" aria-expanded={open} onClick={() => setOpen((v) => !v)} onMouseEnter={() => setOpen(true)}>
        {item.label} <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && (
        <div className="ho-nav-menu" role="menu">
          {item.links.map((link) => <Link key={link.label} to={link.to} role="menuitem" onClick={() => setOpen(false)}>{link.label}</Link>)}
        </div>
      )}
    </div>
  );
}

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="ho-section-head">
      <h2>{title}</h2>
      <p>{sub}</p>
    </div>
  );
}

function PrimaryLink({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) {
  return <Link to={to} className={`ho-btn ho-btn-primary ${className}`}>{children}</Link>;
}

/** The real NeuroOption trading screen inside a laptop and a phone. */
function Devices() {
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
            <AssetIcon symbol={q.symbol} category={q.category} size={34} />
            <span className="ho-marquee-name">
              <b>{q.symbol.replace(/\s*OTC$/i, "")}</b>
              <small>{q.price.toLocaleString("en-US", { minimumFractionDigits: q.precision, maximumFractionDigits: q.precision })}</small>
            </span>
            <em className={q.changePercent >= 0 ? "is-up" : "is-down"}>{formatChange(q.changePercent)}</em>
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <section className="ho-marquee" aria-label="Markets you can trade">
      <div className="ho-marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}

function ChartShowcase() {
  const { quotes } = useQuotes();
  const chips = CHART_ASSETS.map((symbol) => quotes.find((q) => q.symbol === symbol) ?? { symbol, changePercent: 0 });
  return (
    <div className="ho-chart-card">
      <img
        src="/landing/screens/trading-chart.webp"
        alt="EUR/USD OTC one-minute candlestick chart on NeuroOption"
        width={1200}
        height={970}
        loading="lazy"
        decoding="async"
      />
      <div className="ho-chart-chips">
        {chips.map((chip, index) => {
          const up = chip.changePercent >= 0;
          return (
            <Link key={chip.symbol} to="/markets" className={`ho-chip ${index === 0 ? "is-active" : ""}`}>
              <span className="ho-chip-head"><AssetIcon symbol={chip.symbol} size={18} /> {chip.symbol}</span>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className={up ? "is-up" : "is-down"}>
                <path d={sparkPath(chip.symbol, up)} />
              </svg>
            </Link>
          );
        })}
        <Link to="/markets" className="ho-chip-more" aria-label="See all markets"><ChevronRight size={18} /></Link>
      </div>
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
    document.title = "NeuroOption | Trade with clarity";
  }, []);

  return (
    <div className="ho">
      <header className="ho-header">
        <div className="ho-container ho-header-inner">
          <Link to="/" className="ho-logo" aria-label="NeuroOption home"><Logo /></Link>
          <nav className="ho-nav" aria-label="Main">
            {NAV.map((item) => <NavMenu key={item.label} item={item} />)}
          </nav>
          <div className="ho-header-actions">
            {signedIn ? (
              <PrimaryLink to="/trading" className="ho-btn-sm">Open platform <ArrowRight size={15} aria-hidden="true" /></PrimaryLink>
            ) : (
              <>
                <Link to="/login" className="ho-btn ho-btn-outline ho-btn-sm">Log in</Link>
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
            {NAV.flatMap((item) => item.links ? item.links.map((l) => ({ ...l, group: item.label })) : [{ label: item.label, to: item.to ?? "/", group: "" }]).map((link) => (
              link.to.startsWith("#")
                ? <a key={link.group + link.label} href={link.to} onClick={() => setMenuOpen(false)}>{link.label}</a>
                : <Link key={link.group + link.label} to={link.to} onClick={() => setMenuOpen(false)}>{link.group ? <small>{link.group}</small> : null}{link.label}</Link>
            ))}
          </nav>
          <div className="ho-mobile-actions">
            {signedIn ? <PrimaryLink to="/trading">Open platform</PrimaryLink> : <>
              <PrimaryLink to="/register">Create account</PrimaryLink>
              <Link to="/login" className="ho-btn ho-btn-outline">Log in</Link>
            </>}
          </div>
        </MobileMenu>
      )}

      <main>
        <section className="ho-hero">
          <div className="ho-container ho-hero-inner">
            <div className="ho-hero-copy">
              <p className="ho-eyebrow">NeuroOption trading platform</p>
              <h1>Trade with <span>clarity.</span></h1>
              <p className="ho-lead">
                NeuroOption is a fixed-time trading platform for the global markets. Learn on a free demo account,
                follow live charts, and move to a real account funded with <span className="ho-nowrap">M-Pesa</span> when you feel ready.
              </p>
              <div className="ho-hero-cta">
                <PrimaryLink to="/trading">Try free demo <ArrowRight size={17} aria-hidden="true" /></PrimaryLink>
                <Link to="/register" className="ho-btn ho-btn-outline">Create account</Link>
              </div>
              <ul className="ho-hero-points">
                {HERO_POINTS.map((point) => (
                  <li key={point.title}>
                    <CircleCheck size={19} aria-hidden="true" />
                    <span><b>{point.title}</b>{point.text}</span>
                  </li>
                ))}
              </ul>
              <div className="ho-hero-markets" aria-label="Markets available">
                <span>Markets</span>
                {HERO_MARKETS.map((market) => (
                  <Link key={market} to={`/markets?category=${market}`}>{market}</Link>
                ))}
              </div>
              <p className="ho-hero-note">
                Practice first. Trading involves risk: only trade with money you can afford to lose.
              </p>
            </div>
            <Devices />
          </div>
        </section>

        <AssetMarquee />

        <section className="ho-section">
          <div className="ho-container">
            <SectionHead title="Built around your trading experience" sub="Simple. Intuitive. Designed to help you trade with confidence." />
            <div className="ho-features">
              {FEATURES.map((f) => (
                <article key={f.title} className="ho-feature">
                  <span className="ho-feature-icon" aria-hidden="true">{f.icon}</span>
                  <div><h3>{f.title}</h3><p>{f.text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ho-section ho-section-tint">
          <div className="ho-container ho-split">
            <ChartShowcase />
            <div className="ho-split-copy">
              <h2>A clearer view of the markets</h2>
              <p className="ho-split-lead">Powerful tools and a clean interface to help you analyse opportunities and trade with confidence.</p>
              <ul className="ho-tools">
                {TOOLS.map((t) => (
                  <li key={t.title}>
                    <span className="ho-tool-icon" aria-hidden="true">{t.icon}</span>
                    <div><h3>{t.title}</h3><p>{t.text}</p></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="ho-section">
          <div className="ho-container">
            <SectionHead title="Start with a demo" sub="Get familiar with the platform in just a few simple steps." />
            <ol className="ho-steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="ho-step">
                  <span className="ho-step-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ho-step-icon" aria-hidden="true">{s.icon}</span>
                  <div><h3>{s.title}</h3><p>{s.text}</p></div>
                  {i < STEPS.length - 1 && <ChevronRight className="ho-step-arrow" size={20} aria-hidden="true" />}
                </li>
              ))}
            </ol>
            <div className="ho-center"><PrimaryLink to="/trading">Try free demo <ArrowRight size={17} aria-hidden="true" /></PrimaryLink></div>
          </div>
        </section>

        <section className="ho-section ho-section-tint ho-payments" id="payments">
          <div className="ho-container">
            <SectionHead title="Payment options" sub="Fund your account using a range of convenient payment methods." />
            <div className="ho-pay-logos">
              <PaymentLogo brand="mpesa" label="M-Pesa" />
              <span className="ho-pay-divider" aria-hidden="true" />
              <PaymentLogo brand="visa" label="Visa" />
              <span className="ho-pay-divider" aria-hidden="true" />
              <PaymentLogo brand="mastercard" label="Mastercard" />
            </div>
            <p className="ho-pay-note">Review available methods in your account.</p>
          </div>
        </section>

        <section className="ho-section">
          <div className="ho-container">
            <SectionHead title="Questions before you begin?" sub="Find quick answers to common questions about NeuroOption." />
            <div className="ho-faq">
              {FAQ.map((item) => (
                <details key={item.q} className="ho-faq-item">
                  <summary><CircleHelp size={18} aria-hidden="true" /><span>{item.q}</span><Plus size={18} className="ho-faq-plus" aria-hidden="true" /></summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="ho-container">
          <div className="ho-cta-band">
            <div>
              <h2>Explore Neuro<span>Option</span> at your own pace.</h2>
              <p>Start with a demo and get to know the platform.</p>
            </div>
            <div className="ho-cta-actions">
              <PrimaryLink to="/trading" className="ho-btn-bright">Try free demo <ArrowRight size={17} aria-hidden="true" /></PrimaryLink>
              {!signedIn && <Link to="/login" className="ho-cta-login">Log in</Link>}
            </div>
          </div>
        </section>

        <div className="ho-container"><Newsletter /></div>
      </main>

      <footer className="ho-footer">
        <div className="ho-container">
          <div className="ho-footer-grid">
            <div className="ho-footer-brand">
              <Link to="/" className="ho-logo" aria-label="NeuroOption home"><Logo loading="lazy" /></Link>
              <p>A clear, connected trading experience.</p>
            </div>
            <div className="ho-footer-col">
              <h3>Platform</h3>
              <Link to="/trading">Demo account</Link>
              <Link to="/markets">Markets</Link>
              <Link to="/trading">Chart tools</Link>
            </div>
            <div className="ho-footer-col">
              <h3>Company</h3>
              <Link to="/help">About</Link>
              <Link to="/help">Contact</Link>
              <Link to="/help">Support</Link>
            </div>
            <div className="ho-footer-col">
              <h3>Legal</h3>
              <Link to="/help">Terms of use</Link>
              <Link to="/help">Privacy policy</Link>
              <Link to="/help">Risk disclosure</Link>
            </div>
          </div>
          <div className="ho-footer-bottom">
            <p>Trading involves risk. You may lose the amount invested.</p>
            <p>© {new Date().getFullYear()} NeuroOption. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
