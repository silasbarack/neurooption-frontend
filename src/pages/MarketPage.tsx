import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatusBadge, EmptyState } from "../components/common";
import { ASSETS, ASSET_CATEGORIES } from "../components/trading";
import type { Asset, AssetCategory } from "../components/trading";

// Deterministic mock price-change % derived from the symbol, so it doesn't
// jump around on every re-render until a real ticker feed is wired in.
function mockChangePercent(symbol: string) {
  let hash = 0;
  for (let i = 0; i < symbol.length; i += 1) {
    hash = (hash * 31 + symbol.charCodeAt(i)) % 1000;
  }
  return Number((((hash % 400) - 200) / 50).toFixed(2));
}

export default function MarketPage() {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<AssetCategory | "All">("All");
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

  function toggleFavorite(symbol: string) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }
      return next;
    });
  }

  const filteredAssets = ASSETS.filter((asset) => {
    const matchesCategory = category === "All" || asset.category === category;
    const matchesQuery =
      query.trim().length === 0 ||
      asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
      asset.label.toLowerCase().includes(query.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  function goTrade(asset: Asset) {
    navigate("/trading", { state: { symbol: asset.symbol } });
  }

  return (
    <main className="np-page">
      <div className="np-container np-container-wide">
        <PageHeader title="Market" subtitle="Browse assets, payouts, and market status across every category." />

        <div className="np-search">
          <span className="np-search-icon">🔍</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search assets, e.g. EUR/USD"
          />
        </div>

        <div className="np-tabs">
          <button
            type="button"
            className={`np-tab ${category === "All" ? "active" : ""}`}
            onClick={() => setCategory("All")}
          >
            All
          </button>
          {ASSET_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={`np-tab ${category === item ? "active" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredAssets.length === 0 ? (
          <EmptyState icon="🔎" title="No assets found" description="Try a different search term or category." />
        ) : (
          <div className="np-table-wrap">
            <table className="np-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Asset</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Payout</th>
                  <th style={{ textAlign: "right" }}>24h Change</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => {
                  const change = mockChangePercent(asset.symbol);
                  const isOtc = asset.symbol.includes("OTC");
                  const isFavorite = favorites.has(asset.symbol);

                  return (
                    <tr key={asset.symbol}>
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(asset.symbol)}
                          aria-label="Toggle favorite"
                          style={{
                            border: 0,
                            background: "transparent",
                            color: isFavorite ? "#ffd34d" : "var(--np-text-faint)",
                            fontSize: 17,
                            cursor: "pointer",
                          }}
                        >
                          {isFavorite ? "★" : "☆"}
                        </button>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800 }}>{asset.symbol}</div>
                        <div className="np-text-muted" style={{ fontSize: 12 }}>
                          {asset.label}
                        </div>
                      </td>
                      <td>{asset.category}</td>
                      <td>
                        <StatusBadge tone={isOtc ? "info" : "success"}>{isOtc ? "OTC" : "Open"}</StatusBadge>
                      </td>
                      <td style={{ textAlign: "right" }} className="np-text-success">
                        +{asset.payoutBoost + 85}%
                      </td>
                      <td style={{ textAlign: "right" }} className={change >= 0 ? "np-text-success" : "np-text-danger"}>
                        {change >= 0 ? "+" : ""}
                        {change}%
                      </td>
                      <td>
                        <button type="button" className="np-btn np-btn-sm np-btn-primary" onClick={() => goTrade(asset)}>
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
