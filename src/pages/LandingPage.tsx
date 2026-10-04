import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  ChartCandlestick,
  CircleDollarSign,
  Clock,
  Gamepad2,
  Globe,
  Layers,
  LineChart,
  LogIn,
  MailCheck,
  ShieldCheck,
  TriangleAlert,
  Trophy,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import Logo from "../components/branding/Logo";
import "./LandingPage.css";

const STATS = [
  { value: "14", label: "Timeframes, 5 seconds to 1 day" },
  { value: "20+", label: "Technical indicators" },
  { value: "4", label: "Chart types" },
  { value: "24/7", label: "OTC markets" },
];

const FEATURES = [
  {
    icon: ChartCandlestick,
    title: "Real-time charts",
    text: "Candlesticks, Heiken Ashi, bars or line charts that update live, with drawing tools and a full-screen workspace.",
  },
  {
    icon: LineChart,
    title: "Professional indicators",
    text: "Moving averages, Bollinger Bands, RSI, MACD, Ichimoku, Alligator, ADX, ATR and more, each with adjustable settings.",
  },
  {
    icon: Clock,
    title: "Flexible timeframes",
    text: "Switch from 5-second candles for fast decisions to hourly and daily views for the bigger picture.",
  },
  {
    icon: Gamepad2,
    title: "Risk-free demo account",
    text: "Practise every feature with a demo balance before you trade with real money, and switch accounts in one tap.",
  },
  {
    icon: Users,
    title: "Signals & social trading",
    text: "Follow market signals and see what other traders are doing to inform your own decisions.",
  },
  {
    icon: Trophy,
    title: "Tournaments & achievements",
    text: "Compete in trading tournaments and unlock achievements as you build experience on the platform.",
  },
];

const MARKETS = [
  { name: "Forex", examples: "EUR/USD · USD/JPY · AUD/CAD" },
  { name: "Cryptocurrencies", examples: "BTC/USD · ETH/USD" },
  { name: "Commodities", examples: "XAU/USD (Gold)" },
  { name: "Indices", examples: "Major global indices" },
  { name: "Stocks", examples: "Leading listed companies" },
  { name: "OTC assets", examples: "Available on weekends and after hours" },
];

const STEPS = [
  {
    icon: UserPlus,
    title: "Create your account",
    text: "Sign up with your name, email and a password. It takes less than a minute and you receive a welcome email.",
  },
  {
    icon: Gamepad2,
    title: "Practise on demo",
    text: "Explore charts, indicators and order controls with a demo balance, with no money at risk.",
  },
  {
    icon: Wallet,
    title: "Fund your real account",
    text: "Deposit from the Finance section in your preferred currency whenever you feel ready.",
  },
  {
    icon: BarChart3,
    title: "Trade and track",
    text: "Pick an asset, amount and expiry, see the payout before you trade, and follow every result in your history.",
  },
];

const SECURITY = [
  {
    icon: ShieldCheck,
    title: "Encrypted connections",
    text: "All traffic between your device and NeuroOption is encrypted, and sessions are protected with secure tokens.",
  },
  {
    icon: MailCheck,
    title: "Verified password recovery",
    text: "Forgotten passwords are reset with a six-digit code sent to your registered email that expires in 10 minutes.",
  },
  {
    icon: BadgeCheck,
    title: "Identity verification",
    text: "KYC verification protects your account and keeps withdrawals going to the rightful owner.",
  },
];

export default function LandingPage() {
  const { hash } = useLocation();

  // Links like "/#features" from other pages land at the top of a fresh
  // render, so scroll to the requested section once it exists.
  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <main className="lnd">
      <header className="lnd-header">
        <div className="lnd-header-inner">
          <Link to="/" className="lnd-brand" aria-label="NeuroOption home">
            <Logo className="lnd-logo" />
          </Link>

          <nav className="lnd-nav" aria-label="Primary navigation">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#markets">Markets</a>
            <a href="#how-it-works">How it works</a>
            <a href="#security">Security</a>
          </nav>

          <div className="lnd-header-actions">
            <Link to="/login" className="lnd-btn lnd-btn-ghost">
              Log in
            </Link>
            <Link to="/register" className="lnd-btn lnd-btn-primary">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <section className="lnd-hero">
        <div className="lnd-hero-bg" aria-hidden="true" />
        <div className="lnd-hero-inner">
          <span className="lnd-pill">
            <i aria-hidden="true" />
            Live OTC &amp; multi-asset trading platform
          </span>
          <h1>
            Trade the markets with
            <span> clarity and speed.</span>
          </h1>
          <p>
            NeuroOption is an online trading platform built for fast, informed
            decisions. Follow live prices on professional charts, analyse them
            with 20+ indicators and place short-term trades on currencies,
            crypto, commodities and more, all from one clean workspace on your
            phone or computer.
          </p>
          <div className="lnd-hero-cta">
            <Link to="/register" className="lnd-btn lnd-btn-primary lnd-btn-lg">
              Create free account
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/login" className="lnd-btn lnd-btn-glass lnd-btn-lg">
              Log in
            </Link>
          </div>
          <ul className="lnd-hero-notes">
            <li><BadgeCheck size={16} aria-hidden="true" /> Free demo account</li>
            <li><Globe size={16} aria-hidden="true" /> 15 languages</li>
            <li><CircleDollarSign size={16} aria-hidden="true" /> 13 account currencies</li>
          </ul>
        </div>

        <div className="lnd-stats">
          {STATS.map((stat) => (
            <div key={stat.value + stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="lnd-section" id="about">
        <div className="lnd-about">
          <div>
            <span className="lnd-kicker">What is NeuroOption?</span>
            <h2>A complete trading workspace, designed to be simple.</h2>
          </div>
          <div className="lnd-about-copy">
            <p>
              NeuroOption gives you everything you need to follow the markets and
              act on your ideas. Prices stream to your screen in real time and
              are drawn as clear candlestick charts, so you can see momentum,
              trends and reversals as they happen.
            </p>
            <p>
              Each trade is straightforward: choose an asset, set your amount
              and expiry time, and decide whether the price will finish higher
              or lower. The potential payout is shown before you confirm, so you
              always know what is at stake.
            </p>
            <p>
              New traders can learn on a free demo account, while experienced
              traders get advanced indicators, multiple chart types, signals and
              social trading tools. Your account works in your own language and
              currency, from Kenyan shillings and Naira to US dollars and euros.
            </p>
          </div>
        </div>
      </section>

      <section className="lnd-section lnd-section-tint" id="features">
        <div className="lnd-section-head">
          <span className="lnd-kicker">Features</span>
          <h2>Built for traders at every level</h2>
          <p>Powerful analysis tools and a fast interface, without the clutter.</p>
        </div>
        <div className="lnd-grid lnd-grid-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="lnd-card">
              <span className="lnd-card-icon"><Icon size={22} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lnd-section" id="markets">
        <div className="lnd-section-head">
          <span className="lnd-kicker">Markets</span>
          <h2>Trade the assets you follow</h2>
          <p>Access popular instruments across several asset classes, including OTC assets outside regular hours.</p>
        </div>
        <div className="lnd-grid lnd-grid-3">
          {MARKETS.map((market) => (
            <div key={market.name} className="lnd-market">
              <span className="lnd-market-icon"><Layers size={18} aria-hidden="true" /></span>
              <div>
                <strong>{market.name}</strong>
                <small>{market.examples}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lnd-section lnd-section-tint" id="how-it-works">
        <div className="lnd-section-head">
          <span className="lnd-kicker">How it works</span>
          <h2>Start trading in four steps</h2>
        </div>
        <ol className="lnd-steps">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title}>
              <span className="lnd-step-num">{index + 1}</span>
              <span className="lnd-card-icon"><Icon size={22} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="lnd-section" id="security">
        <div className="lnd-section-head">
          <span className="lnd-kicker">Security</span>
          <h2>Your account, protected</h2>
        </div>
        <div className="lnd-grid lnd-grid-3">
          {SECURITY.map(({ icon: Icon, title, text }) => (
            <article key={title} className="lnd-card">
              <span className="lnd-card-icon"><Icon size={22} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <aside className="lnd-risk" role="note">
          <TriangleAlert size={20} aria-hidden="true" />
          <p>
            <strong>Risk warning:</strong> Trading financial instruments
            involves a high level of risk and may not be suitable for everyone.
            You can lose some or all of the money you invest. Only trade with
            money you can afford to lose, and use the demo account to learn
            first. Services are for users aged 21 and over.
          </p>
        </aside>
      </section>

      <section className="lnd-cta" id="get-started">
        <div className="lnd-cta-inner">
          <h2>Ready to get started?</h2>
          <p>Sign in to continue trading, or create your free account in under a minute.</p>
          <div className="lnd-cta-cards">
            <div className="lnd-cta-card">
              <span className="lnd-card-icon"><LogIn size={22} aria-hidden="true" /></span>
              <h3>Have an account already?</h3>
              <p>Log in to pick up where you left off, with your charts, balance and history.</p>
              <Link to="/login" className="lnd-btn lnd-btn-outline lnd-btn-lg">
                Log in
              </Link>
            </div>
            <div className="lnd-cta-card is-featured">
              <span className="lnd-card-icon"><UserPlus size={22} aria-hidden="true" /></span>
              <h3>New to NeuroOption?</h3>
              <p>Sign up for free and start practising on a demo account straight away.</p>
              <Link to="/register" className="lnd-btn lnd-btn-primary lnd-btn-lg">
                Sign up
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="lnd-footer">
        <div className="lnd-footer-inner">
          <Logo className="lnd-footer-logo" loading="lazy" />
          <nav aria-label="Legal">
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy policy</a>
            <a href="#contacts">Contacts</a>
          </nav>
          <span>&copy; 2026 NeuroOption &middot; 21+</span>
        </div>
      </footer>
    </main>
  );
}
