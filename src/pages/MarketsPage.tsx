import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star } from "lucide-react";

import AppShell from "../components/shell/AppShell";
import AssetIcon from "../components/markets/AssetIcon";
import { formatChange, formatPrice, useQuotes } from "../components/markets/useQuotes";
import "./MarketsPage.css";

const TABS = [
  { key: "All", label: "All" },
  { key: "Favorites", label: "Favorites" },
  { key: "Currencies", label: "Forex" },
  { key: "Cryptocurrencies", label: "Crypto" },
  { key: "Stocks", label: "Stocks" },
  { key: "Indices", label: "Indices" },
  { key: "Commodities", label: "Commodities" },
];

const FAVORITES_KEY = "neurooption_favorite_assets";

function readFavorites(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function MarketsPage() {
  const navigate = useNavigate();
  const { quotes, live } = useQuotes();
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(readFavorites);

  function toggleFavorite(symbol: string) {
    setFavorites((current) => {
      const next = current.includes(symbol) ? current.filter((item) => item !== symbol) : [...current, symbol];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // Favourites just won't persist.
      }
      return next;
    });
  }

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return quotes
      .filter((quote) => {
        if (tab === "Favorites") return favorites.includes(quote.symbol);
        return tab === "All" || quote.category === tab;
      })
      .filter(
        (quote) =>
          !needle || quote.symbol.toLowerCase().includes(needle) || quote.label.toLowerCase().includes(needle),
      )
      .sort((a, b) => b.payout - a.payout);
  }, [quotes, tab, query, favorites]);

  function trade(symbol: string) {
    navigate("/trading", { state: { symbol } });
  }

  return (
    <AppShell wide>
      <div className="mk-head">
        <div>
          <h1>Markets</h1>
          <p>
            {live ? <span className="mk-live">Live</span> : <span className="mk-live is-off">Connecting</span>}
            {quotes.length} assets · payouts for a 1-minute trade
          </p>
        </div>
        <label className="mk-search">
          <Search size={16} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search assets..."
            aria-label="Search assets"
          />
        </label>
      </div>

      <div className="neo-tabs mk-tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            className={tab === item.key ? "is-active" : ""}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mk-table neo-card">
        <div className="mk-row mk-row-head" aria-hidden="true">
          <span>Asset</span>
          <span>Price</span>
          <span>24h change</span>
          <span>Payout</span>
          <span />
        </div>

        {rows.length === 0 && (
          <p className="mk-empty">
            {tab === "Favorites" ? "Tap the star next to an asset to add it to your favourites." : "No assets match your search."}
          </p>
        )}

        {rows.map((quote) => {
          const favorite = favorites.includes(quote.symbol);
          return (
            <div
              key={quote.symbol}
              className="mk-row"
              role="button"
              tabIndex={0}
              onClick={() => trade(quote.symbol)}
              onKeyDown={(event) => event.key === "Enter" && trade(quote.symbol)}
            >
              <span className="mk-asset">
                <AssetIcon symbol={quote.symbol} category={quote.category} size={34} />
                <span>
                  <b>{quote.symbol}</b>
                  <small>{quote.label}</small>
                  <small className="mk-mobile-price">
                    {formatPrice(quote)}{" "}
                    <em className={quote.changePercent >= 0 ? "neo-up" : "neo-down"}>{formatChange(quote.changePercent)}</em>
                  </small>
                </span>
              </span>
              <span className="mk-price">{formatPrice(quote)}</span>
              <span className={`mk-change ${quote.changePercent >= 0 ? "neo-up" : "neo-down"}`}>
                {formatChange(quote.changePercent)}
              </span>
              <span className="mk-payout">{quote.payout}%</span>
              <span className="mk-actions">
                <button
                  type="button"
                  className={`mk-star ${favorite ? "is-on" : ""}`}
                  aria-label={favorite ? `Remove ${quote.symbol} from favourites` : `Add ${quote.symbol} to favourites`}
                  aria-pressed={favorite}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite(quote.symbol);
                  }}
                >
                  <Star size={17} fill={favorite ? "currentColor" : "none"} />
                </button>
                <span className="neo-btn neo-btn-primary neo-btn-sm mk-trade">Trade</span>
              </span>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
