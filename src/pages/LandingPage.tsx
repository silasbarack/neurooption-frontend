import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  ChartCandlestick,
  ChevronDown,
  Clock,
  Gamepad2,
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
  Zap,
} from "lucide-react";
import Logo from "../components/branding/Logo";
import HeroDashboard from "../components/landing/HeroDashboard";
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

const FAQ = [
  {
    q: "Is it free to open a NeuroOption account?",
    a: "Yes. Registration is free and takes less than a minute. Every account includes a demo account with a practice balance, so you can learn the platform before depositing any money.",
  },
  {
    q: "What is the minimum amount I can trade?",
    a: "You choose the amount for each trade in the trade panel. Start small while you learn, and never trade money you cannot afford to lose.",
  },
  {
    q: "Which markets can I trade?",
    a: "Forex pairs such as EUR/USD and USD/JPY, cryptocurrencies such as BTC/USD and ETH/USD, gold (XAU/USD), indices, stocks and OTC assets that remain available on weekends and outside regular market hours.",
  },
  {
    q: "Can I use NeuroOption on my phone?",
    a: "Yes. NeuroOption runs in your browser and adapts to phones, tablets and computers, so there is nothing to install.",
  },
  {
    q: "How do I recover my password?",
    a: "Choose \u201cPassword recovery\u201d on the sign-in page and enter your email. We send a six-digit verification code that is valid for 10 minutes, which you use to set a new password.",
  },
  {
    q: "Why do I need to verify my identity?",
    a: "Identity verification (KYC) protects your account and makes sure withdrawals are paid only to the rightful owner.",
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
            <a href="#features">Trading</a>
            <a href="#markets">Markets</a>
            <a href="#how-it-works">Platform</a>
            <a href="#security">Security</a>
            <a href="#about">About</a>
          </nav>

          <div className="lnd-header-actions">
            <Link to="/login" className="lnd-btn lnd-btn-dark-outline">
              Sign in
            </Link>
            <Link to="/register" className="lnd-btn lnd-btn-blue">
              Register
            </Link>
          </div>
        </div>
      </header>

      <section className="lnd-hero">
        <div className="lnd-hero-bg" aria-hidden="true" />
        <div className="lnd-hero-inner">
          <div className="lnd-hero-copy">
            <span className="lnd-eyebrow-dark">
              Smart trading <i aria-hidden="true">&bull;</i> Brighter possibilities
            </span>
            <h1>
              Trade Smarter
              <br />
              With <span>NeuroOption</span>
            </h1>
            <p>
              A modern trading platform for a smarter tomorrow. Access global
              markets, powerful tools and real opportunities, all in one place.
            </p>
            <div className="lnd-hero-cta">
              <Link to="/register" className="lnd-btn lnd-btn-blue lnd-btn-lg">
                Start Trading
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/register" className="lnd-btn lnd-btn-dark-outline lnd-btn-lg">
                <BarChart3 size={18} aria-hidden="true" />
                Try Demo
              </Link>
            </div>
            <ul className="lnd-trust">
              <li>
                <ShieldCheck size={20} aria-hidden="true" />
                <span><strong>Secure &amp; encrypted</strong>Protected sessions</span>
              </li>
              <li>
                <Zap size={20} aria-hidden="true" />
                <span><strong>Fast execution</strong>Real-time quotes</span>
              </li>
              <li>
                <BarChart3 size={20} aria-hidden="true" />
                <span><strong>Global markets</strong>24/7 OTC access</span>
              </li>
            </ul>
          </div>

          <p className="lnd-motto" aria-hidden="true">
            Discipline
            <br />
            creates
            <br />
            freedom
          </p>
        </div>

        <div className="lnd-dashboard">
          <HeroDashboard />
        </div>
      </section>

      <section className="lnd-section" id="about">
        <div className="lnd-about">
          <div className="lnd-about-side">
            <span className="lnd-kicker">What is NeuroOption?</span>
            <h2>A complete trading workspace, designed to be simple.</h2>
            <div className="lnd-about-stats">
              {STATS.map((stat) => (
                <div key={stat.value + stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lnd-about-copy">
            <p className="lnd-about-lead">
              NeuroOption is an online trading platform that brings live
              market prices, professional charting and simple, fixed-time
              trades together in one clean workspace that runs in your browser
              on a phone, tablet or computer.
            </p>
            <h3>How trading on NeuroOption works</h3>
            <p>
              Every trade starts with a simple question: will the price of an
              asset be higher or lower when the timer runs out? You choose the
              asset, the amount you want to invest and an expiry time, from a
              few seconds to several hours. Before you confirm, NeuroOption
              shows the exact payout you will receive if your forecast is
              correct. If the price moves the other way, you lose the amount you
              invested in that trade, so you always know your maximum risk up
              front.
            </p>
            <h3>Professional tools without the clutter</h3>
            <p>
              Prices stream to your screen in real time and are drawn as
              candlesticks, Heiken Ashi, bars or a simple line. Switch between
              14 timeframes, from 5-second candles for fast decisions to hourly
              and daily views for the bigger picture. More than 20 technical
              indicators, including moving averages, Bollinger Bands, RSI, MACD,
              Ichimoku, Alligator, ADX and ATR, can be added and tuned with a
              few taps, and drawing tools help you mark trends, support and
              resistance.
            </p>
            <h3>Learn first, then trade for real</h3>
            <p>
              Every new account includes a demo account with a practice
              balance, so you can explore every feature and test your strategy
              without risking money. When you feel ready, switch to your real
              account in one tap. Deposits and withdrawals are handled from the
              Finance section, and identity verification (KYC) keeps your
              withdrawals going only to you.
            </p>
            <h3>Built for traders everywhere</h3>
            <p>
              NeuroOption speaks your language, with 15 languages including
              English, Kiswahili, French, Arabic, Hausa, Yor&ugrave;b&aacute;
              and Chinese, and lets you hold your balance in 13 currencies,
              from Kenyan shillings, Ugandan shillings and Naira to US dollars,
              euros and rand. OTC markets stay open around the clock, including
              weekends, so you can trade when it suits you.
            </p>
            <h3>More than a chart</h3>
            <p>
              Follow trading signals, see what other traders are doing through
              social trading, compete in tournaments and unlock achievements
              as you grow. Your full trade history is always available, so you
              can review every decision and keep improving.
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

      <section className="lnd-section lnd-section-tint" id="faq">
        <div className="lnd-section-head">
          <span className="lnd-kicker">FAQ</span>
          <h2>Questions traders often ask</h2>
        </div>
        <div className="lnd-faq">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
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
