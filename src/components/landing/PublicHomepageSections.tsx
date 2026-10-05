import { Link } from "react-router-dom";
import {
  Bitcoin,
  Building2,
  ChartNoAxesCombined,
  Clock3,
  Coins,
  Gem,
  Globe2,
} from "lucide-react";

import type { MarketQuote } from "../../api/account.api";
import AssetIcon from "../markets/AssetIcon";
import { FALLBACK_QUOTES, formatChange, formatPrice } from "../markets/useQuotes";

const TICKER_SYMBOLS = [
  "EUR/USD OTC",
  "GBP/USD OTC",
  "BTC/USD OTC",
  "ETH/USD OTC",
  "US100 OTC",
  "Gold OTC",
  "Apple OTC",
  "Tesla OTC",
];

function quoteFor(quotes: MarketQuote[], symbol: string) {
  return quotes.find((quote) => quote.symbol === symbol) ?? FALLBACK_QUOTES.find((quote) => quote.symbol === symbol);
}

export function MarketTicker({ quotes }: { quotes: MarketQuote[] }) {
  return (
    <section className="hp-ticker" aria-label="Market prices">
      <div className="hp-wrap hp-ticker-track">
        {TICKER_SYMBOLS.map((symbol) => {
          const quote = quoteFor(quotes, symbol);
          if (!quote) return null;
          return (
            <Link key={symbol} to="/trading" state={{ symbol }} className="hp-ticker-item">
              <AssetIcon symbol={symbol} category={quote.category} size={26} />
              <span>
                <b>{symbol.replace(/ OTC$/, "")}</b>
                <small>{formatPrice(quote)}</small>
              </span>
              <em className={quote.changePercent >= 0 ? "is-up" : "is-down"}>{formatChange(quote.changePercent)}</em>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const STATS = [
  ["100+", "Trading Assets"],
  ["92%", "Max Payout"],
  ["24/7", "Global Markets"],
  ["< 100ms", "Execution Speed"],
  ["Multiple", "Account Currencies"],
  ["Award-Winning", "Trading Experience"],
];

export function PlatformStats() {
  return (
    <section className="hp-stats-strip" aria-label="Platform highlights">
      <div className="hp-wrap hp-stats-grid">
        {STATS.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

const CATEGORIES = [
  { title: "Forex", text: "Major, minor & exotic pairs", icon: Globe2, tone: "forex" },
  { title: "Cryptocurrencies", text: "Trade 24/7 with volatility", icon: Bitcoin, tone: "crypto" },
  { title: "Commodities", text: "Gold, oil and more", icon: Gem, tone: "commodities" },
  { title: "Stocks", text: "Top global companies", icon: Building2, tone: "stocks" },
  { title: "Indices", text: "Popular global indices", icon: ChartNoAxesCombined, tone: "indices" },
  { title: "OTC Markets", text: "Flexible OTC trading", icon: Clock3, tone: "otc" },
];

export function GlobalMarketsSection() {
  return (
    <section id="markets" className="hp-section hp-global-markets">
      <div className="hp-wrap">
        <div className="hp-global-head">
          <div>
            <p className="hp-eyebrow">Endless possibilities</p>
            <h2>Trade Global Markets</h2>
          </div>
          <p>
            Access a broad range of market opportunities from one NeuroOption workspace, with clear pricing,
            responsive tools and an interface built for fast decisions.
          </p>
        </div>

        <div className="hp-category-grid">
          {CATEGORIES.map(({ title, text, icon: Icon, tone }) => (
            <Link key={title} to="/markets" className={`hp-category-card is-${tone}`}>
              <span className="hp-category-icon">
                <Icon size={30} aria-hidden="true" />
              </span>
              <span className="hp-category-copy">
                <b>{title}</b>
                <small>{text}</small>
              </span>
              <span className="hp-category-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>

        <div className="hp-markets-note">
          <Coins size={17} aria-hidden="true" />
          <span>Live prices and payouts continue to come from the existing NeuroOption market-data service.</span>
        </div>
      </div>
    </section>
  );
}
