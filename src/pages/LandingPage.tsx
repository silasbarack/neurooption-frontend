import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bitcoin,
  CandlestickChart,
  ChevronDown,
  Clock3,
  Gem,
  Globe2,
  KeyRound,
  LineChart,
  Lock,
  Menu,
  MonitorSmartphone,
  Radio,
  ShieldCheck,
  Smartphone,
  Trophy,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";

import BrandLogo from "../components/branding/BrandLogo";
import DeviceShowcase from "../components/landing/DeviceShowcase";
import AssetIcon from "../components/markets/AssetIcon";
import { formatChange, formatPrice, useQuotes } from "../components/markets/useQuotes";
import MenuDrawer from "../components/shell/MenuDrawer";
import { getToken } from "../utils/storage";
import "./LandingPage.css";

const NAV = [
  { label: "Trading", href: "#platform" },
  { label: "Markets", href: "#markets" },
  { label: "Platforms", href: "#anywhere" },
  { label: "About", href: "#about" },
  { label: "How it works", href: "#how" },
  { label: "Support", href: "#faq" },
];

const HERO_FEATURES = [
  { icon: ShieldCheck, title: "Secure & Trusted", text: "Encrypted, verified accounts" },
  { icon: Zap, title: "Fast Execution", text: "Trades open instantly" },
  { icon: BarChart3, title: "65+ Assets", text: "Forex, Crypto, Stocks, OTC" },
  { icon: Globe2, title: "Global Access", text: "Trade anytime, anywhere" },
];

const STATS = [
  { value: "65+", label: "Trading Assets" },
  { value: "92%", label: "Max Payout" },
  { value: "24/7", label: "OTC Markets" },
  { value: "5 sec", label: "Fastest Expiry" },
  { value: "13", label: "Account Currencies" },
  { value: "Free", label: "Demo Account" },
];

const MARKETS = [
  { key: "forex", title: "Forex", text: "Major, minor & exotic pairs", icon: WalletCards, tone: "blue" },
  { key: "crypto", title: "Cryptocurrencies", text: "Trade 24/7 with volatility", icon: Bitcoin, tone: "orange" },
  { key: "commodities", title: "Commodities", text: "Gold, oil and more", icon: Gem, tone: "gold" },
  { key: "stocks", title: "Stocks", text: "Top global companies", icon: LineChart, tone: "green" },
  { key: "indices", title: "Indices", text: "Popular global indices", icon: BarChart3, tone: "violet" },
  { key: "otc", title: "OTC Markets", text: "Realistic OTC trading", icon: Clock3, tone: "cyan" },
];

const FEATURES = [
  { icon: CandlestickChart, title: "Professional charts", text: "Candlesticks, Heiken Ashi, bars or line charts that update live, with drawing tools and a full-screen workspace." },
  { icon: LineChart, title: "Built-in indicators", text: "Moving averages, Bollinger Bands, RSI, MACD, Ichimoku, Alligator, ADX, ATR and more, each with adjustable settings." },
  { icon: Clock3, title: "Every timeframe", text: "Switch from 5-second candles for fast decisions to hourly and daily views for the bigger picture." },
  { icon: WalletCards, title: "Demo and real accounts", text: "Practise every feature with a demo balance before you trade with real money, and switch accounts in one tap." },
  { icon: Radio, title: "Signals and social trading", text: "Follow market signals and see what other traders are doing to inform your own decisions." },
  { icon: Trophy, title: "Tournaments and achievements", text: "Compete in trading tournaments and unlock achievements as you build experience on the platform." },
];

const STEPS = [
  { title: "Create your account", text: "Sign up with your name, email and a password. It takes less than a minute and you receive a welcome email." },
  { title: "Practise on demo", text: "Explore charts, indicators and order controls with a demo balance, with no money at risk." },
  { title: "Fund with M-Pesa", text: "Deposit from the Finance section. M-Pesa sends a prompt to your phone and your balance updates when you confirm." },
  { title: "Trade and track", text: "Pick an asset, amount and expiry, see the payout before you trade, and follow every result in your history." },
];

const SECURITY = [
  { icon: Lock, title: "Encrypted connections", text: "All traffic between your device and NeuroOption is encrypted, and sessions are protected with secure tokens." },
  { icon: KeyRound, title: "Safe password recovery", text: "Forgotten passwords are reset with a six-digit code sent to your registered email that expires in 10 minutes." },
  { icon: BadgeCheck, title: "Verified withdrawals", text: "KYC verification protects your account and keeps withdrawals going to the rightful owner." },
];

const FAQ = [
  { q: "Is it free to open a NeuroOption account?", a: "Yes. Registration is free and takes less than a minute. Every account includes a demo account with a practice balance, so you can learn the platform before depositing any money." },
  { q: "How do I deposit money?", a: "Open Finance, choose M-Pesa, enter your Safaricom number and the amount. You receive an M-Pesa prompt on your phone; enter your PIN and your real balance updates as soon as M-Pesa confirms. NeuroOption never asks for your PIN." },
  { q: "How much do I need to start trading?", a: "You choose the amount for each trade in the trade panel. Start small while you learn, and never trade money you cannot afford to lose." },
  { q: "Which markets can I trade?", a: "Forex pairs such as EUR/USD and USD/JPY, cryptocurrencies such as BTC/USD and ETH/USD, gold and oil, indices, stocks and OTC assets that remain available on weekends and outside regular market hours." },
  { q: "Can I trade on my phone?", a: "Yes. NeuroOption runs in your browser and adapts to phones, tablets and computers, so there is nothing to install." },
  { q: "What if I forget my password?", a: "Choose “Password recovery” on the sign-in page and enter your email. We send a six-digit verification code that is valid for 10 minutes, which you use to set a new password." },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { quotes } = useQuotes();
  const signedIn = Boolean(getToken());
  const tickerQuotes = quotes.slice(0, 12);

  return (
    <div className="lp">
      <header className="lp-header">
        <div className="lp-wrap lp-header-inner">
          <BrandLogo size="sm" />
          <nav className="lp-nav" aria-label="Home sections">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="lp-header-actions">
            <span className="lp-lang">
              <Globe2 size={15} aria-hidden="true" /> EN
            </span>
            {signedIn ? (
              <Link to="/trading" className="neo-btn neo-btn-gold neo-btn-sm">
                Open platform
              </Link>
            ) : (
              <>
                <Link to="/login" className="neo-btn neo-btn-outline neo-btn-sm lp-login">
                  Log in
                </Link>
                <Link to="/register" className="neo-btn neo-btn-gold neo-btn-sm lp-create">
                  Create Account
                </Link>
              </>
            )}
            <button type="button" className="neo-icon-btn lp-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <section className="lp-hero">
        <div className="lp-hero-bg" aria-hidden="true" />
        <div className="lp-wrap lp-hero-inner">
          <div className="lp-hero-copy">
            <p className="neo-eyebrow">
              <span className="lp-desk">Turn insight into opportunity</span>
              <span className="lp-mob">Global markets, real opportunities</span>
            </p>
            <h1>
              Trade Smarter <br />
              with <span className="neo-gold-text">NeuroOption</span>
            </h1>
            <p className="lp-lead">
              Access global markets with a modern trading platform, real market conditions and powerful tools,
              designed for traders of all levels. Practise free on demo, fund instantly with M-Pesa and trade
              forex, crypto, stocks and OTC assets from your phone or computer.
            </p>
            <div className="lp-hero-cta">
              <Link to={signedIn ? "/trading" : "/register"} className="neo-btn neo-btn-gold neo-btn-lg">
                <span className="lp-desk">Start Trading</span>
                <span className="lp-mob">Create Free Account</span>
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link to={signedIn ? "/trading" : "/login"} className="neo-btn neo-btn-outline neo-btn-lg">
                Try Demo
                <span className="lp-desk">Free</span>
                <span className="lp-mob">Trading</span>
              </Link>
            </div>
            <ul className="lp-hero-stats">
              <li>
                <ShieldCheck size={22} aria-hidden="true" />
                <strong>65+</strong>
                <small>Trading Assets</small>
              </li>
              <li>
                <Zap size={22} aria-hidden="true" />
                <strong>92%</strong>
                <small>Max Payout</small>
              </li>
              <li>
                <BarChart3 size={22} aria-hidden="true" />
                <strong>24/7</strong>
                <small>Global Markets</small>
              </li>
            </ul>
          </div>
          <div className="lp-hero-visual">
            <DeviceShowcase />
          </div>
          <ul className="lp-hero-features">
            {HERO_FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Icon size={22} aria-hidden="true" />
                <div>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="lp-ticker" aria-label="Live prices">
        <div className="lp-ticker-track">
          {[...tickerQuotes, ...tickerQuotes].map((quote, index) => (
            <Link
              key={`${quote.symbol}-${index}`}
              to={signedIn ? "/trading" : "/login"}
              state={{ symbol: quote.symbol }}
              className="lp-tick"
              aria-hidden={index >= tickerQuotes.length}
              tabIndex={index >= tickerQuotes.length ? -1 : undefined}
            >
              <AssetIcon symbol={quote.symbol} category={quote.category} size={26} />
              <span>
                <b>{quote.symbol.replace(/ OTC$/, "")}</b>
                <small>
                  {formatPrice(quote)}
                  <em className={quote.changePercent >= 0 ? "neo-up" : "neo-down"}>{formatChange(quote.changePercent)}</em>
                </small>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <section className="lp-stats" aria-label="NeuroOption in numbers">
        <div className="lp-wrap lp-stats-grid">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section lp-markets" id="markets">
        <div className="lp-wrap lp-markets-inner">
          <div className="lp-markets-copy">
            <p className="neo-eyebrow">Endless possibilities</p>
            <h2>Trade Global Markets</h2>
            <p>
              Explore a wide range of assets and take advantage of opportunities across different markets, including
              OTC assets that stay open on weekends and outside regular market hours.
            </p>
            <Link to={signedIn ? "/markets" : "/login"} className="lp-link">
              View all markets <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="lp-market-cards">
            {MARKETS.map(({ key, title, text, icon: Icon, tone }) => (
              <article key={key} className={`lp-market-card tone-${tone}`}>
                <div className="lp-market-art" aria-hidden="true">
                  <Icon size={42} strokeWidth={1.6} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section" id="platform">
        <div className="lp-wrap">
          <div className="lp-heading">
            <p className="neo-eyebrow">The platform</p>
            <h2>Everything you need in one trading workspace</h2>
            <p>Live charts, a clear trade panel and every market at a glance, on desktop and mobile.</p>
          </div>
          <div className="lp-feature-grid">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <article key={title} className="neo-card lp-feature">
                <span className="lp-feature-icon">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section" id="anywhere">
        <div className="lp-wrap">
          <div className="lp-anywhere neo-card">
            <div>
              <p className="neo-eyebrow">Web, tablet and phone</p>
              <h2>Trade Anytime, Anywhere</h2>
              <p>
                Fully optimised for mobile, tablet and desktop. Open NeuroOption in your browser and your charts,
                balances and trade history are waiting, with nothing to install.
              </p>
              <ul>
                <li>
                  <MonitorSmartphone size={18} aria-hidden="true" /> One account on every device
                </li>
                <li>
                  <Smartphone size={18} aria-hidden="true" /> Thumb-friendly trade panel on phones
                </li>
                <li>
                  <Users size={18} aria-hidden="true" /> Social trading and tournaments built in
                </li>
              </ul>
            </div>
            <div className="lp-anywhere-visual" aria-hidden="true">
              <DeviceShowcase />
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-about" id="about">
        <div className="lp-wrap lp-about-inner">
          <div>
            <p className="neo-eyebrow">About NeuroOption</p>
            <h2>Built for traders at every level</h2>
          </div>
          <div className="lp-about-text">
            <p>
              NeuroOption is a fixed-time trading platform. For every trade you choose an asset, an amount and an
              expiry, then decide whether the price will finish higher (Buy) or lower (Sell). The payout is shown
              before you confirm, so you always know what a winning trade returns and what is at risk.
            </p>
            <p>
              Beginners can learn on a free demo account with a practice balance. Experienced traders get
              professional charting, more than a dozen indicators, timeframes from 5 seconds to a day, and fast
              switching between demo and real accounts. Deposits in Kenya are made with M-Pesa straight from your
              phone, and your Finance page shows every deposit and withdrawal as it happens.
            </p>
          </div>
        </div>
      </section>

      <section className="lp-section" id="how">
        <div className="lp-wrap">
          <div className="lp-heading">
            <p className="neo-eyebrow">Getting started</p>
            <h2>Start trading in four steps</h2>
          </div>
          <ol className="lp-steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className="neo-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-wrap">
          <div className="lp-heading">
            <p className="neo-eyebrow">Security</p>
            <h2>Your account, protected</h2>
          </div>
          <div className="lp-security">
            {SECURITY.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <Icon size={24} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section" id="faq">
        <div className="lp-wrap lp-faq-wrap">
          <div className="lp-heading">
            <p className="neo-eyebrow">FAQ</p>
            <h2>Questions traders often ask</h2>
          </div>
          <div className="lp-faq">
            {FAQ.map((item, index) => {
              const open = openFaq === index;
              return (
                <div key={item.q} className={`lp-faq-item ${open ? "is-open" : ""}`}>
                  <button type="button" onClick={() => setOpenFaq(open ? null : index)} aria-expanded={open}>
                    {item.q}
                    <ChevronDown size={18} aria-hidden="true" />
                  </button>
                  {open && <p>{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="lp-section lp-cta">
        <div className="lp-wrap">
          <div className="lp-cta-card">
            <div className="lp-cta-bg" aria-hidden="true" />
            <h2>Ready to trade smarter?</h2>
            <p>Sign in to continue trading, or create your free account in under a minute.</p>
            <div className="lp-cta-grid">
              <div>
                <strong>Have an account already?</strong>
                <span>Log in to pick up where you left off, with your charts, balance and history.</span>
                <Link to="/login" className="neo-btn neo-btn-outline neo-btn-lg">
                  Log in
                </Link>
              </div>
              <div>
                <strong>New to NeuroOption?</strong>
                <span>Sign up for free and start practising on a demo account straight away.</span>
                <Link to="/register" className="neo-btn neo-btn-gold neo-btn-lg">
                  Sign up free <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="lp-footer" id="risk">
        <div className="lp-wrap">
          <div className="lp-footer-top">
            <BrandLogo size="sm" />
            <nav>
              <a href="#about">About</a>
              <a href="#markets">Markets</a>
              <a href="#faq">Support</a>
              <Link to="/login">Log in</Link>
              <Link to="/register">Create Account</Link>
            </nav>
          </div>
          <p className="lp-risk">
            <strong>Risk warning:</strong> Trading involves significant risk and you can lose the money you invest.
            Only trade with money you can afford to lose, and use the demo account to learn before trading for real.
          </p>
          <small>&copy; {new Date().getFullYear()} NeuroOption &middot; 21+</small>
        </div>
      </footer>

      <MenuDrawer open={menuOpen} onClose={closeMenu} />
    </div>
  );
}
