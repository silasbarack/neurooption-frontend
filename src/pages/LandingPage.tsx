import { useCallback, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CandlestickChart,
  ChevronDown,
  ClipboardList,
  Gem,
  Globe,
  GraduationCap,
  Headset,
  History,
  Languages,
  Menu,
  ShieldCheck,
  SlidersHorizontal,
  Timer,
  Trophy,
  UserRound,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import BrandLogo from "../components/branding/BrandLogo";
import AssetIcon from "../components/markets/AssetIcon";
import { FALLBACK_QUOTES, formatChange, useQuotes } from "../components/markets/useQuotes";
import MenuDrawer from "../components/shell/MenuDrawer";
import { GlobalMarketsSection, MarketTicker, PlatformStats } from "../components/landing/PublicHomepageSections";
import type { MarketQuote } from "../api/account.api";
import { getToken } from "../utils/storage";
import "./LandingPage.css";
import "./LandingReference.css";

type NavGroup = { label: string; links: Array<{ label: string; to: string }> };

const NAV: NavGroup[] = [
  {
    label: "Trading",
    links: [
      { label: "Trade now", to: "/trading" },
      { label: "Open trades", to: "/open-trades" },
      { label: "Trading history", to: "/history" },
    ],
  },
  {
    label: "Markets",
    links: [
      { label: "All markets", to: "/markets" },
      { label: "Forex", to: "/markets" },
      { label: "Crypto", to: "/markets" },
      { label: "Stocks", to: "/markets" },
      { label: "OTC markets", to: "/markets" },
    ],
  },
  {
    label: "Platforms",
    links: [
      { label: "Web platform", to: "/trading" },
      { label: "Mobile experience", to: "/#devices" },
    ],
  },
  {
    label: "About",
    links: [
      { label: "Why NeuroOption", to: "/#why" },
      { label: "Global community", to: "/#community" },
    ],
  },
  {
    label: "Promotions",
    links: [
      { label: "Tournaments", to: "/tournaments" },
      { label: "Achievements", to: "/achievements" },
    ],
  },
  {
    label: "Learn",
    links: [
      { label: "Practise on demo", to: "/trading" },
      { label: "Help centre", to: "/help" },
    ],
  },
  {
    label: "Support",
    links: [
      { label: "Help centre", to: "/help" },
      { label: "Contact support", to: "/help" },
    ],
  },
];

const EXPERIENCE = [
  { icon: BarChart3, title: "Diverse markets", text: "Trade forex, commodities, indices, shares and more.", to: "/markets", art: "wave", dark: true },
  { icon: Zap, title: "Intuitive platform", text: "A clean and powerful interface for all traders.", to: "/trading", art: "panes", dark: false },
  { icon: ShieldCheck, title: "Built for security", text: "Your funds and data are always protected.", to: "/register", art: "shield", dark: true },
  { icon: GraduationCap, title: "Learn and grow", text: "Educational resources to support your journey.", to: "/help", art: "books", dark: false },
] as const;

// Symbols as the backend names them; quotes fall back to built-in samples offline.
const POPULAR = [
  { symbol: "EUR/USD OTC", name: "EUR/USD", color: "#3b82f6" },
  { symbol: "BTC/USD OTC", name: "BTC/USD", color: "#f59e0b" },
  { symbol: "Gold OTC", name: "Gold", color: "#eab308" },
  { symbol: "Tesla OTC", name: "Tesla", color: "#ef4444" },
  { symbol: "US 500 OTC", name: "US 500", color: "#3b82f6" },
  { symbol: "WTI Oil OTC", name: "Oil", color: "#ef4444" },
];

const WHY = [
  { icon: Globe, title: "Worldwide access", text: "Trade from anywhere, anytime." },
  { icon: SlidersHorizontal, title: "Flexible trading", text: "Multiple asset classes and strategies." },
  { icon: Users, title: "Trader support", text: "A dedicated team whenever you need help." },
  { icon: Gem, title: "A trusted platform", text: "Transparent, fair and built for the long term." },
];

const COMMUNITY = [
  { icon: Languages, text: "Multiple languages" },
  { icon: Wallet, text: "Local payment methods" },
  { icon: Headset, text: "A growing global community" },
];

const RAIL_ICONS = [CandlestickChart, BarChart3, Wallet, ClipboardList, Trophy, Users, UserRound];
const PHONE_TABS = [
  { icon: CandlestickChart, label: "Trade" },
  { icon: BarChart3, label: "Markets" },
  { icon: ClipboardList, label: "Open" },
  { icon: History, label: "History" },
  { icon: UserRound, label: "Profile" },
];

const FOOTER = [
  {
    title: "Markets",
    links: [
      ["Forex", "/markets"],
      ["Commodities", "/markets"],
      ["Indices", "/markets"],
      ["Shares", "/markets"],
      ["Cryptocurrencies", "/markets"],
    ],
  },
  {
    title: "Platform",
    links: [
      ["Web Platform", "/trading"],
      ["Mobile App", "/#devices"],
      ["Features", "/#experience"],
      ["Security", "/#why"],
      ["Help Centre", "/help"],
    ],
  },
  {
    title: "About",
    links: [
      ["Our Company", "/#community"],
      ["Why NeuroOption", "/#why"],
      ["Contact Us", "/help"],
    ],
  },
];

/** Same-page anchors ("/#why") need a plain link so the browser scrolls to them. */
function SiteLink({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  if (to.startsWith("/#")) {
    return (
      <a href={to.slice(1)} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

function quoteFor(quotes: MarketQuote[], symbol: string) {
  return quotes.find((quote) => quote.symbol === symbol) ?? FALLBACK_QUOTES.find((quote) => quote.symbol === symbol);
}

/** Deterministic sparkline that rises or falls with the day's change. */
function sparkline(seed: number, change: number, width = 120, height = 40) {
  let state = seed * 7919 + 17;
  const rand = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const points = 28;
  const drift = (change >= 0 ? -1 : 1) * 0.9;
  let y = change >= 0 ? height * 0.72 : height * 0.3;
  const out: string[] = [];
  for (let i = 0; i <= points; i++) {
    y = Math.min(height - 3, Math.max(3, y + drift + (rand() - 0.5) * 7));
    out.push(`${((i / points) * width).toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${out.join(" L")}`;
}

function Sparkline({ seed, change, color }: { seed: number; change: number; color: string }) {
  const line = sparkline(seed, change);
  const id = `hp-spark-${seed}`;
  return (
    <svg viewBox="0 0 120 40" preserveAspectRatio="none" className="hp-spark" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L120,40 L0,40 Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

type Candle = { o: number; c: number; h: number; l: number };

/** Deterministic candle series, so the mockups look the same on every render. */
function buildCandles(count: number, seed: number, trend: number): Candle[] {
  let state = seed * 2654435761;
  const rand = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const out: Candle[] = [];
  let price = 100;
  for (let i = 0; i < count; i++) {
    const swing = Math.sin(i / 5.5) * 1.1 + Math.sin(i / 13) * 0.7;
    const open = price;
    const close = open + trend + swing * 0.4 + (rand() - 0.5) * 2.4;
    out.push({
      o: open,
      c: close,
      h: Math.max(open, close) + rand() * 1.3,
      l: Math.min(open, close) - rand() * 1.3,
    });
    price = close;
  }
  return out;
}

function CandleChart({
  count,
  seed,
  trend,
  width,
  height,
  showGrid = true,
}: {
  count: number;
  seed: number;
  trend: number;
  width: number;
  height: number;
  showGrid?: boolean;
}) {
  const candles = buildCandles(count, seed, trend);
  const high = Math.max(...candles.map((k) => k.h));
  const low = Math.min(...candles.map((k) => k.l));
  const pad = height * 0.08;
  const y = (value: number) => pad + ((high - value) / (high - low || 1)) * (height - pad * 2);
  const step = width / count;
  const body = Math.max(1.6, step * 0.58);
  const last = candles[candles.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="hp-candles" aria-hidden="true">
      {showGrid &&
        [0.2, 0.4, 0.6, 0.8].map((fraction) => (
          <line key={fraction} x1="0" x2={width} y1={height * fraction} y2={height * fraction} className="hp-candle-grid" />
        ))}
      {candles.map((candle, index) => {
        const x = index * step + step / 2;
        const up = candle.c >= candle.o;
        const top = y(Math.max(candle.o, candle.c));
        return (
          <g key={index} className={up ? "is-up" : "is-down"}>
            <line x1={x} x2={x} y1={y(candle.h)} y2={y(candle.l)} strokeWidth={Math.max(0.7, step * 0.1)} />
            <rect x={x - body / 2} width={body} y={top} height={Math.max(1, Math.abs(y(candle.o) - y(candle.c)))} />
          </g>
        );
      })}
      <line x1="0" x2={width} y1={y(last.c)} y2={y(last.c)} className="hp-candle-last" />
    </svg>
  );
}

/** Laptop running the trading workspace, for the hero. */
function HeroArt({ quotes }: { quotes: MarketQuote[] }) {
  const eur = quoteFor(quotes, "EUR/USD OTC");
  const price = eur?.price ?? 1.06942;
  const change = eur?.changePercent ?? 0;
  const payout = eur?.payout ?? 92;
  const ticks = Array.from({ length: 5 }, (_, i) => (price + (2 - i) * 0.0012).toFixed(4));

  return (
    <div className="hp-stage" aria-hidden="true">
      <div className="hp-glow" />
      <div className="hp-laptop">
        <div className="hp-lid">
          <div className="hp-screen">
            <div className="hp-app-top">
              <img src="/neurooption-mark.svg" alt="" className="hp-app-mark" />
              <span className="hp-app-pair">
                EUR/USD OTC <ChevronDown size={9} aria-hidden="true" />
              </span>
              <span className="hp-app-tabs">
                <i className="is-on">Trade</i>
                <i>Markets</i>
                <i>Finance</i>
              </span>
              <span className="hp-app-balance">
                <small>Demo</small>
                $70,000.00
              </span>
              <span className="hp-app-deposit">Deposit</span>
            </div>

            <div className="hp-app-body">
              <div className="hp-app-rail">
                {RAIL_ICONS.map((Icon, index) => (
                  <Icon key={index} size={11} strokeWidth={1.9} className={index === 0 ? "is-on" : ""} />
                ))}
              </div>

              <div className="hp-app-chart">
                <CandleChart count={54} seed={9} trend={0.4} width={520} height={250} />
                <div className="hp-app-axis">
                  {ticks.map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>
                <div className="hp-app-timer">00:28</div>
                <div className="hp-app-volume">
                  {Array.from({ length: 54 }, (_, i) => (
                    <i key={i} style={{ height: `${18 + ((i * 41) % 72)}%` }} className={i % 3 === 1 ? "is-down" : ""} />
                  ))}
                </div>
              </div>

              <div className="hp-app-panel">
                <span className="hp-app-field">
                  <small>Amount</small>
                  <b>$100</b>
                </span>
                <span className="hp-app-field">
                  <small>Expiration</small>
                  <b>1 min</b>
                </span>
                <span className="hp-app-payout">
                  <small>Payout</small>
                  <b>+{payout}%</b>
                  <em>${(100 + payout).toFixed(2)}</em>
                </span>
                <span className="hp-app-buy">BUY</span>
                <span className="hp-app-sell">SELL</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hp-laptop-base" />
      </div>
      <div className="hp-hero-phone">
        <div className="hp-hero-phone-notch" />
        <div className="hp-hero-phone-head">
          <img src="/neurooption-mark.svg" alt="" />
          <span>EUR/USD OTC</span>
          <b>{price.toFixed(5)}</b>
        </div>
        <div className="hp-hero-phone-chart">
          <CandleChart count={25} seed={31} trend={0.45} width={220} height={180} showGrid={false} />
          <span className="hp-hero-phone-expiry">00:28</span>
        </div>
        <div className="hp-hero-phone-fields">
          <span><small>Time</small><b>1 min</b></span>
          <span><small>Amount</small><b>$100</b></span>
        </div>
        <div className="hp-hero-phone-profit">
          <span><small>Payout</small><b>+{payout}%</b></span>
          <span><small>Profit</small><b>{"$"}{(100 + payout).toFixed(2)}</b></span>
        </div>
        <div className="hp-hero-phone-actions"><span>BUY</span><span>SELL</span></div>
      </div>
      <span className="hp-float is-price">
        <b>{price.toFixed(5)}</b>
        <em className={change >= 0 ? "is-up" : "is-down"}>{formatChange(change)}</em>
      </span>
    </div>
  );
}

function CardArt({ kind }: { kind: (typeof EXPERIENCE)[number]["art"] }) {
  if (kind === "wave") {
    return (
      <svg className="hp-card-art" viewBox="0 0 220 140" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <path
            key={i}
            d={`M0 ${120 - i * 3} C 60 ${60 + i * 4}, 120 ${140 - i * 6}, 220 ${30 + i * 5}`}
            stroke="#60a5fa"
            strokeOpacity={0.15 + i * 0.06}
            fill="none"
          />
        ))}
      </svg>
    );
  }
  if (kind === "shield") {
    return (
      <svg className="hp-card-art" viewBox="0 0 220 140" aria-hidden="true">
        <defs>
          <linearGradient id="hp-shield" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#93c5fd" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <ellipse cx="150" cy="128" rx="54" ry="8" fill="#3b82f6" opacity="0.35" />
        <path d="M150 20 l44 16 v34 c0 30 -20 48 -44 58 c-24 -10 -44 -28 -44 -58 v-34 z" fill="url(#hp-shield)" opacity="0.9" />
        <path d="M150 32 l32 12 v26 c0 22 -14 36 -32 44 c-18 -8 -32 -22 -32 -44 v-26 z" fill="#0b1630" opacity="0.35" />
      </svg>
    );
  }
  if (kind === "books") {
    return (
      <svg className="hp-card-art" viewBox="0 0 220 140" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={110 + i * 4} y={112 - i * 14} width="90" height="12" rx="3" fill="#bfdbfe" opacity={0.55 + i * 0.15} />
        ))}
        {[0, 1, 2].map((i) => (
          <rect key={`p${i}`} x={130 + i * 18} y={20 + i * 6} width="14" height={52 - i * 6} rx="2" fill="#dbeafe" stroke="#93c5fd" opacity="0.8" />
        ))}
      </svg>
    );
  }
  return (
    <svg className="hp-card-art" viewBox="0 0 220 140" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={110 + i * 26}
          y={30 - i * 6}
          width="62"
          height="92"
          rx="8"
          fill="#dbeafe"
          stroke="#93c5fd"
          opacity={0.45 + i * 0.18}
          transform={`skewY(-12) translate(0 ${30 + i * 4})`}
        />
      ))}
    </svg>
  );
}

function Globe3D() {
  const lights = Array.from({ length: 70 }, (_, i) => {
    const a = (i * 137.5 * Math.PI) / 180;
    const r = 18 + ((i * 37) % 100) * 0.95;
    return { x: 150 + Math.cos(a) * r * 0.95, y: 150 + Math.sin(a) * r * 0.85, o: 0.4 + ((i * 13) % 10) / 16 };
  }).filter((p) => (p.x - 150) ** 2 + (p.y - 150) ** 2 < 112 ** 2);
  return (
    <svg className="hp-globe" viewBox="0 0 300 300" aria-hidden="true">
      <defs>
        <radialGradient id="hp-globe-fill" cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#1e3a8a" />
          <stop offset="0.6" stopColor="#0b1a3f" />
          <stop offset="1" stopColor="#050a18" />
        </radialGradient>
        <radialGradient id="hp-globe-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.75" stopColor="#3b82f6" stopOpacity="0" />
          <stop offset="0.9" stopColor="#3b82f6" stopOpacity="0.45" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="150" r="140" fill="url(#hp-globe-halo)" />
      <circle cx="150" cy="150" r="118" fill="url(#hp-globe-fill)" stroke="#60a5fa" strokeOpacity="0.5" />
      {[-60, -30, 0, 30, 60].map((lat) => (
        <ellipse key={lat} cx="150" cy={150 + lat * 1.3} rx={118 * Math.cos((lat * Math.PI) / 180)} ry="10" fill="none" stroke="#60a5fa" strokeOpacity="0.16" />
      ))}
      {[20, 50, 80].map((rx) => (
        <ellipse key={rx} cx="150" cy="150" rx={rx} ry="118" fill="none" stroke="#60a5fa" strokeOpacity="0.14" />
      ))}
      {lights.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i % 5 === 0 ? 1.8 : 1.1} fill="#fde68a" opacity={p.o} />
      ))}
      <ellipse cx="150" cy="150" rx="146" ry="44" fill="none" stroke="#93c5fd" strokeOpacity="0.35" transform="rotate(-18 150 150)" />
      <ellipse cx="150" cy="150" rx="140" ry="64" fill="none" stroke="#a78bfa" strokeOpacity="0.25" transform="rotate(22 150 150)" />
    </svg>
  );
}

function StatusBar() {
  return (
    <div className="hp-status" aria-hidden="true">
      <span>9:41</span>
      <span className="hp-status-icons">
        <svg viewBox="0 0 18 12" width="11" height="8" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.6" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="0.6" />
          <rect x="10" y="3" width="3" height="9" rx="0.6" />
          <rect x="15" y="0" width="3" height="12" rx="0.6" opacity="0.45" />
        </svg>
        <svg viewBox="0 0 16 12" width="10" height="8" fill="currentColor">
          <path d="M8 11.4 5.6 8.8a3.4 3.4 0 0 1 4.8 0zM3.3 6.5a6.9 6.9 0 0 1 9.4 0l1.5-1.6a9.1 9.1 0 0 0-12.4 0z" />
        </svg>
        <svg viewBox="0 0 26 12" width="16" height="8" fill="none">
          <rect x="0.6" y="0.6" width="21" height="10.8" rx="3" stroke="currentColor" strokeOpacity="0.5" />
          <rect x="2.2" y="2.2" width="15" height="7.6" rx="1.8" fill="currentColor" />
          <path d="M23.4 4.2v3.6a2 2 0 0 0 0-3.6" fill="currentColor" fillOpacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

function PhoneTabs({ active }: { active: number }) {
  return (
    <div className="hp-tabbar" aria-hidden="true">
      {PHONE_TABS.map(({ icon: Icon, label }, index) => (
        <span key={label} className={index === active ? "is-on" : ""}>
          <Icon size={11} strokeWidth={2} />
          <small>{label}</small>
        </span>
      ))}
    </div>
  );
}

function PhoneMockups({ quotes }: { quotes: MarketQuote[] }) {
  const rows = ["Gold OTC", "Tesla OTC", "Apple OTC", "EUR/USD OTC", "BTC/USD OTC"].map((symbol) => ({
    symbol,
    quote: quoteFor(quotes, symbol),
  }));
  const eur = quoteFor(quotes, "EUR/USD OTC");
  const change = eur?.changePercent ?? 0;

  return (
    <div className="hp-phones" aria-hidden="true">
      <div className="hp-swoosh" />

      <div className="hp-phone is-back">
        <span className="hp-phone-btn is-power" />
        <div className="hp-phone-screen">
          <span className="hp-notch" />
          <StatusBar />
          <div className="hp-phone-head">
            <img src="/neurooption-mark.svg" alt="" />
            <b>Markets</b>
          </div>
          <div className="hp-phone-chips">
            <i className="is-on">All</i>
            <i>Forex</i>
            <i>Crypto</i>
            <i>Stocks</i>
          </div>
          <div className="hp-phone-list">
            {rows.map(({ symbol, quote }) => (
              <div key={symbol} className="hp-phone-row">
                <AssetIcon symbol={symbol} category={quote?.category} size={15} />
                <span>
                  <b>{symbol.replace(/ OTC$/, "")}</b>
                  <small>{quote ? quote.price.toLocaleString("en-US", { maximumFractionDigits: quote.precision }) : "—"}</small>
                </span>
                <em className={(quote?.changePercent ?? 0) >= 0 ? "is-up" : "is-down"}>
                  {formatChange(quote?.changePercent ?? 0)}
                </em>
              </div>
            ))}
          </div>
          <PhoneTabs active={1} />
          <span className="hp-home-bar" />
        </div>
      </div>

      <div className="hp-phone is-front">
        <span className="hp-phone-btn is-power" />
        <span className="hp-phone-btn is-vol" />
        <div className="hp-phone-screen">
          <span className="hp-notch" />
          <StatusBar />
          <div className="hp-phone-head">
            <img src="/neurooption-mark.svg" alt="" />
            <b>EUR/USD OTC</b>
            <em className={change >= 0 ? "is-up" : "is-down"}>{formatChange(change)}</em>
          </div>
          <div className="hp-phone-quote">
            <b>{(eur?.price ?? 1.06942).toFixed(5)}</b>
            <span className="hp-phone-timer">00:28</span>
          </div>
          <div className="hp-phone-chart">
            <CandleChart count={26} seed={21} trend={0.5} width={200} height={150} showGrid={false} />
          </div>
          <div className="hp-phone-controls">
            <span>
              <small>Time</small>
              <b>1 min</b>
            </span>
            <span>
              <small>Amount</small>
              <b>$100</b>
            </span>
          </div>
          <div className="hp-phone-actions">
            <span className="is-buy">Buy</span>
            <span className="is-sell">Sell</span>
          </div>
          <PhoneTabs active={0} />
          <span className="hp-home-bar" />
        </div>
      </div>
    </div>
  );
}

function SocialIcons() {
  const icons: Array<[string, string]> = [
    ["YouTube", "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"],
    ["X", "M17.8 3h3.1l-6.8 7.7 8 10.3h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"],
    ["Telegram", "M21.5 4.2 2.9 11.4c-1.3.5-1.2 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.5-1.4zM9.6 14.6l8.5-7.7c.4-.3-.1-.5-.6-.2L7.8 13.4z"],
    ["Instagram", "M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21 8c-.1-1.5-.4-2.8-1.5-3.9S17.1 2.7 15.6 2.6c-1.6-.1-6.2-.1-7.8 0-1.5.1-2.8.4-3.9 1.5S2.5 6.5 2.4 8c-.1 1.6-.1 6.2 0 7.8.1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.6.1 6.2.1 7.8 0 1.5-.1 2.8-.4 3.9-1.5s1.4-2.4 1.5-3.9c.1-1.6.1-6.2 0-7.8zm-2 9.6a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.3.4s-4.1.1-5.3-.4a3 3 0 0 1-1.7-1.7c-.5-1.2-.4-4-.4-5.3s-.1-4.1.4-5.3A3 3 0 0 1 6.7 5c1.2-.5 4-.4 5.3-.4s4.1-.1 5.3.4a3 3 0 0 1 1.7 1.7c.5 1.2.4 4 .4 5.3s.1 4.1-.4 5.3z"],
    ["LinkedIn", "M6.9 21H3V9h3.9zM5 7.3a2.2 2.2 0 1 1 0-4.5 2.2 2.2 0 0 1 0 4.5zM21 21h-3.9v-5.8c0-1.4 0-3.2-2-3.2s-2.2 1.5-2.2 3.1V21H9V9h3.7v1.6h.1a4.1 4.1 0 0 1 3.7-2c3.9 0 4.6 2.6 4.6 5.9z"],
  ];
  return (
    <div className="hp-social">
      {icons.map(([label, d]) => (
        <span key={label} title={label}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-label={label} role="img">
            <path d={d} />
          </svg>
        </span>
      ))}
    </div>
  );
}

function StoreBadges() {
  return (
    <div className="hp-stores">
      <span className="hp-store">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.8-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 2.9-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.7 1.3-2.8 0 0-2.4-.9-2.4-3.8zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.3z" />
        </svg>
        <span>
          <small>Download on the</small>
          <b>App Store</b>
        </span>
      </span>
      <span className="hp-store">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M3.6 2.3 13.4 12l-9.8 9.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1z" fill="#00d7fe" />
          <path d="m16.6 15.2-3.2-3.2 3.2-3.2 3.7 2.1c1 .6 1 1.6 0 2.2z" fill="#ffce00" />
          <path d="M13.4 12 3.6 21.7c.3.2.8.2 1.3-.1l11.7-6.4z" fill="#ff3a44" />
          <path d="M13.4 12 16.6 8.8 4.9 2.4c-.5-.3-1-.3-1.3-.1z" fill="#00f076" />
        </svg>
        <span>
          <small>Get it on</small>
          <b>Google Play</b>
        </span>
      </span>
    </div>
  );
}

export default function LandingPage() {
  const { quotes } = useQuotes();
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsletterNote, setNewsletterNote] = useState("");
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const signedIn = Boolean(getToken());
  const startPath = signedIn ? "/trading" : "/register";

  function handleNewsletter(event: FormEvent) {
    event.preventDefault();
    setNewsletterNote("Our newsletter is launching soon. Thanks for your interest!");
  }

  return (
    <div className="hp">
      <header className="hp-header">
        <div className="hp-wrap hp-header-inner">
          <BrandLogo />
          <nav className="hp-nav" aria-label="Main">
            {NAV.map((group) => (
              <div key={group.label} className="hp-nav-item">
                <button type="button" aria-haspopup="true">
                  {group.label}
                  <ChevronDown size={14} aria-hidden="true" />
                </button>
                <div className="hp-nav-menu">
                  {group.links.map((link) => (
                    <SiteLink key={link.label} to={link.to}>
                      {link.label}
                    </SiteLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="hp-header-actions">
            <span className="hp-lang">
              <Globe size={15} aria-hidden="true" /> EN
            </span>
            {signedIn ? (
              <Link to="/trading" className="hp-btn hp-btn-primary hp-btn-sm">
                Open platform
              </Link>
            ) : (
              <>
                <Link to="/login" className="hp-btn hp-btn-ghost hp-btn-sm">
                  Log in
                </Link>
                <Link to="/register" className="hp-btn hp-btn-primary hp-btn-sm">
                  Create account
                </Link>
              </>
            )}
            <button type="button" className="hp-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>
      <MenuDrawer open={menuOpen} onClose={closeMenu} />

      <main>
        <section className="hp-hero">
          <div className="hp-wrap hp-hero-inner">
            <div className="hp-hero-copy">
              <p className="hp-eyebrow">Turn insight into opportunity</p>
              <h1>
                Trade Smarter
                <span>with NeuroOption</span>
              </h1>
              <p className="hp-lead">
                Access global markets with a modern trading platform, real market conditions and powerful tools —
                designed for traders of all levels.
              </p>
              <div className="hp-hero-cta">
                <Link to={startPath} className="hp-btn hp-btn-primary hp-btn-lg">
                  <span className="hp-cta-desktop">Start Trading</span>
                  <span className="hp-cta-mobile">{signedIn ? "Start Trading" : "Create Free Account"}</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <Link to="/trading" className="hp-btn hp-btn-ghost hp-btn-lg">
                  <span className="hp-cta-desktop">Try Demo Free</span>
                  <span className="hp-cta-mobile">Try Demo Trading</span>
                </Link>
              </div>
              <ul className="hp-hero-points">
                <li>
                  <ShieldCheck size={17} aria-hidden="true" /> Secure &amp; Trusted
                </li>
                <li>
                  <Timer size={17} aria-hidden="true" /> Fast Execution
                </li>
                <li>
                  <BarChart3 size={17} aria-hidden="true" /> 100+ Assets
                </li>
                <li>
                  <Globe size={17} aria-hidden="true" /> Global Access
                </li>
              </ul>
            </div>
            <HeroArt quotes={quotes} />
          </div>
        </section>

        <MarketTicker quotes={quotes} />
        <PlatformStats />
        <GlobalMarketsSection />

        <section id="experience" className="hp-section hp-light">
          <div className="hp-wrap">
            <div className="hp-section-head">
              <div>
                <p className="hp-eyebrow">Trade your way</p>
                <h2>A complete trading experience</h2>
              </div>
              <div className="hp-section-aside">
                <p>Powerful tools, real-time insights and a seamless platform — everything you need in one place.</p>
                <Link to="/markets" className="hp-btn hp-btn-outline hp-btn-sm">
                  See all markets <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="hp-exp-grid">
              {EXPERIENCE.map(({ icon: Icon, title, text, to, art, dark }) => (
                <Link key={title} to={to} className={`hp-exp-card ${dark ? "is-dark" : ""}`}>
                  <CardArt kind={art} />
                  <Icon size={26} className="hp-exp-icon" aria-hidden="true" />
                  <b>{title}</b>
                  <p>{text}</p>
                  <span className="hp-round-arrow" aria-hidden="true">
                    <ArrowRight size={15} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="markets" className="hp-section hp-dark">
          <div className="hp-wrap">
            <div className="hp-section-head">
              <div>
                <p className="hp-eyebrow">Popular markets</p>
                <h2>Trade the world’s most popular assets</h2>
              </div>
              <Link to="/markets" className="hp-text-link">
                View all markets <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="hp-market-grid">
              {POPULAR.map((asset, index) => {
                const quote = quoteFor(quotes, asset.symbol);
                const change = quote?.changePercent ?? 0;
                return (
                  <Link key={asset.symbol} to="/trading" state={{ symbol: asset.symbol }} className="hp-market-card">
                    <div className="hp-market-head">
                      <AssetIcon symbol={asset.symbol} category={quote?.category} size={30} />
                      <span>
                        <b>{asset.name}</b>
                        <em className={change >= 0 ? "is-up" : "is-down"}>{formatChange(change)}</em>
                      </span>
                    </div>
                    <Sparkline seed={index + 3} change={change} color={asset.color} />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section id="why" className="hp-section hp-light">
          <div className="hp-wrap">
            <div className="hp-section-head">
              <div>
                <p className="hp-eyebrow">Why NeuroOption</p>
                <h2>
                  More opportunities.
                  <br />
                  Greater control.
                </h2>
              </div>
              <div className="hp-section-aside">
                <p>
                  We combine advanced technology with a trader-first approach, giving you the tools, flexibility and
                  support to trade with confidence.
                </p>
                <Link to="/register" className="hp-btn hp-btn-outline hp-btn-sm">
                  Our advantages <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <ul className="hp-why-grid">
              {WHY.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <span className="hp-why-icon">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <span>
                    <b>{title}</b>
                    <small>{text}</small>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="community" className="hp-community">
          <div className="hp-wrap hp-community-inner">
            <Globe3D />
            <div className="hp-community-copy">
              <p className="hp-eyebrow">A global trading community</p>
              <h2>Traders in over 180 countries</h2>
              <p>
                NeuroOption connects people worldwide to the global financial markets with a platform designed for
                everyone, from beginners to experienced traders.
              </p>
              <ul>
                {COMMUNITY.map(({ icon: Icon, text }) => (
                  <li key={text}>
                    <span>
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="devices" className="hp-section hp-light hp-devices">
          <div className="hp-wrap hp-devices-inner">
            <div className="hp-devices-copy">
              <p className="hp-eyebrow">Trade anytime, anywhere</p>
              <h2>
                A seamless experience
                <br />
                on every device
              </h2>
              <p>
                Access your account, analyse the markets and place trades wherever you are. NeuroOption is built for a
                smooth and consistent experience across web, iOS and Android.
              </p>
              <StoreBadges />
              <small className="hp-stores-note">Native apps are coming soon. The web platform works on any phone today.</small>
            </div>
            <PhoneMockups quotes={quotes} />
          </div>
        </section>
      </main>

      <footer className="hp-footer">
        <div className="hp-wrap">
          <div className="hp-footer-grid">
            <div className="hp-footer-brand">
              <BrandLogo size="sm" />
              <p>
                Trade global markets with confidence.
                <br />A smarter way to trade.
              </p>
              <SocialIcons />
            </div>
            {FOOTER.map((column) => (
              <div key={column.title} className="hp-footer-col">
                <b>{column.title}</b>
                {column.links.map(([label, to]) => (
                  <SiteLink key={label} to={to}>
                    {label}
                  </SiteLink>
                ))}
              </div>
            ))}
            <form className="hp-footer-news" onSubmit={handleNewsletter}>
              <b>Stay updated</b>
              <p>Get the latest news, market insights and platform updates.</p>
              <div className="hp-news-field">
                <input type="email" placeholder="Your email address" aria-label="Your email address" required />
                <button type="submit" aria-label="Subscribe">
                  <ArrowRight size={16} />
                </button>
              </div>
              {newsletterNote && <small role="status">{newsletterNote}</small>}
            </form>
          </div>
          <div className="hp-footer-bottom">
            <span>© {new Date().getFullYear()} NeuroOption. All rights reserved.</span>
            <nav aria-label="Legal">
              <Link to="/help">Privacy Policy</Link>
              <Link to="/help">Terms of Service</Link>
              <Link to="/help">Risk Disclosure</Link>
            </nav>
          </div>
          <p className="hp-risk">
            Risk warning: trading financial instruments involves significant risk and may not be suitable for every
            investor. Only trade with money you can afford to lose.
          </p>
        </div>
      </footer>
    </div>
  );
}
