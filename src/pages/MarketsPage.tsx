import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import AppShell from "../components/shell/AppShell";
import AssetRow from "../components/markets/AssetRow";
import { useQuotes } from "../components/markets/useQuotes";
import "./MarketsPage.css";
const TABS = [
  { key: "All", label: "All" }, { key: "Currencies", label: "Forex" },
  { key: "Cryptocurrencies", label: "Crypto" }, { key: "Stocks", label: "Stocks" },
  { key: "OTC", label: "OTC" }, { key: "Favorites", label: "Favorites" },
  { key: "Indices", label: "Indices" }, { key: "Commodities", label: "Commodities" },
];
const FAVORITES_KEY = "neurooption_favorite_assets";
function readFavorites(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch { return []; }
}
export default function MarketsPage() {
  const { quotes, live } = useQuotes();
  const [params, setParams] = useSearchParams();
  const requested = params.get("category")?.toLowerCase();
  const tab = TABS.find((item) => item.key.toLowerCase() === requested || item.label.toLowerCase() === requested)?.key ?? "All";
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(readFavorites);
  function selectTab(key: string) {
    const next = new URLSearchParams(params);
    if (key === "All") next.delete("category"); else next.set("category", key);
    setParams(next, { replace: true });
  }
  function toggleFavorite(symbol: string) {
    setFavorites((current) => {
      const next = current.includes(symbol) ? current.filter((item) => item !== symbol) : [...current, symbol];
      try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); } catch { /* Session-only preference when storage is unavailable. */ }
      return next;
    });
  }
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return quotes.filter((quote) => {
      if (tab === "Favorites") return favorites.includes(quote.symbol);
      if (tab === "OTC") return quote.symbol.endsWith(" OTC");
      return tab === "All" || quote.category === tab;
    }).filter((quote) => !needle || quote.symbol.toLowerCase().includes(needle) || quote.label.toLowerCase().includes(needle))
      .sort((a, b) => b.payout - a.payout);
  }, [quotes, tab, query, favorites]);
  return (
    <AppShell wide>
      <div className="mk-head">
        <div><h1>Markets</h1><p role="status">
          <span className={`mk-live ${live ? "" : "is-off"}`}>{live ? "Live prices" : "Sample prices · connecting"}</span>
          <span>{quotes.length} assets</span>
        </p></div>
        <label className="mk-search"><Search size={17} aria-hidden="true" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assets..." aria-label="Search assets" />
        </label>
      </div>
      <div className="neo-tabs mk-tabs" role="tablist" aria-label="Market categories">
        {TABS.map((item, index) => (
          <button key={item.key} type="button" role="tab" aria-selected={tab === item.key}
            aria-controls="market-results" tabIndex={tab === item.key ? 0 : -1}
            className={tab === item.key ? "is-active" : ""} onClick={() => selectTab(item.key)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
              else if (event.key === "ArrowLeft") next = (index + TABS.length - 1) % TABS.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = TABS.length - 1;
              else return;
              event.preventDefault(); selectTab(TABS[next].key);
              (event.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
            }}>{item.label}</button>
        ))}
      </div>
      <section id="market-results" className="mk-table neo-card" role="tabpanel" aria-label={`${TABS.find((item) => item.key === tab)?.label} assets`}>
        <div className="mk-row-head" aria-hidden="true"><span>Asset</span><span>Price</span><span>24h change</span><span>Payout</span><span /></div>
        <ul className="mk-asset-list">
          {rows.map((quote) => <AssetRow key={quote.symbol} quote={quote} favorite={favorites.includes(quote.symbol)} onToggleFavorite={toggleFavorite} />)}
        </ul>
        {rows.length === 0 && <p className="mk-empty">{tab === "Favorites" ? "Tap the star next to an asset to add it to your favourites." : "No assets match your search."}</p>}
      </section>
      <p className="mk-feed-note">{live ? "Prices and payouts update from the market feed. Final payout is confirmed in the trading terminal." : "Illustrative quotes are shown while the market feed connects. Open the terminal for executable prices and payouts."}</p>
    </AppShell>
  );
}
