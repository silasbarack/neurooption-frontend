import React from "react";
import { PageHeader, StatusBadge, EmptyState } from "../components/common";
import type { BadgeTone } from "../components/common";
import { ASSETS } from "../components/trading";
import { MOCK_EXPRESS_TRADES, type ExpressTradeRecord, type ExpressTradeStatus } from "../data/mockData";

const EXPIRY_OPTIONS = ["M1", "M5", "M15", "M30"];

const STATUS_TONE: Record<ExpressTradeStatus, BadgeTone> = {
  WON: "success",
  LOST: "danger",
  PENDING: "info",
};

const QUICK_ASSETS = ASSETS.slice(0, 8);

export default function ExpressTradesPage() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set([QUICK_ASSETS[0].symbol]));
  const [amount, setAmount] = React.useState("25");
  const [expiry, setExpiry] = React.useState("M1");
  const [recent, setRecent] = React.useState<ExpressTradeRecord[]>(MOCK_EXPRESS_TRADES);

  function toggleAsset(symbol: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }
      return next;
    });
  }

  const numericAmount = Number(amount || 0);
  const avgPayout =
    QUICK_ASSETS.filter((a) => selected.has(a.symbol)).reduce((sum, a) => sum + 85 + a.payoutBoost, 0) /
      Math.max(1, selected.size) || 85;
  const expectedPayout = numericAmount * selected.size * (avgPayout / 100);

  function handleConfirm() {
    if (selected.size === 0 || numericAmount <= 0) return;

    const record: ExpressTradeRecord = {
      id: `exp-${Date.now()}`,
      assets: Array.from(selected),
      amount: numericAmount,
      expiry,
      status: "PENDING",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };

    setRecent((current) => [record, ...current]);
  }

  return (
    <main className="np-page">
      <div className="np-container">
        <PageHeader title="ExpressTrades" subtitle="Place faster, grouped trades across multiple assets at once." />

        <div className="np-card" style={{ marginBottom: 20, borderLeft: "3px solid var(--np-warning)" }}>
          <strong>⚠️ Note:</strong>{" "}
          <span className="np-text-muted">
            Express trading places one grouped trade across all assets you select below, with a shared amount
            and expiry. It executes faster than placing trades individually.
          </span>
        </div>

        <section className="np-section np-card">
          <h3 className="np-card-title">Select Assets</h3>

          <div className="np-grid np-grid-4">
            {QUICK_ASSETS.map((asset) => {
              const isSelected = selected.has(asset.symbol);
              return (
                <button
                  key={asset.symbol}
                  type="button"
                  onClick={() => toggleAsset(asset.symbol)}
                  className="np-card"
                  style={{
                    textAlign: "left",
                    cursor: "pointer",
                    border: isSelected ? "1px solid var(--np-accent)" : undefined,
                    background: isSelected ? "var(--np-accent-soft)" : undefined,
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 13.5 }}>{asset.symbol}</div>
                  <div className="np-text-muted" style={{ fontSize: 11.5 }}>
                    +{85 + asset.payoutBoost}%
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="np-section np-grid np-grid-2">
          <div className="np-card">
            <div className="np-field">
              <label htmlFor="express-amount">Investment Amount (USD)</label>
              <input
                id="express-amount"
                className="np-input"
                type="number"
                min={1}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>

            <div className="np-field">
              <label>Expiry</label>
              <div className="np-tabs" style={{ marginBottom: 0 }}>
                {EXPIRY_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`np-tab ${expiry === option ? "active" : ""}`}
                    onClick={() => setExpiry(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="np-card">
            <h3 className="np-card-title">Expected Payout Preview</h3>
            <div className="np-grid np-grid-2" style={{ marginBottom: 16 }}>
              <div>
                <div className="np-text-muted" style={{ fontSize: 11 }}>
                  Assets Selected
                </div>
                <div style={{ fontWeight: 800 }}>{selected.size}</div>
              </div>
              <div>
                <div className="np-text-muted" style={{ fontSize: 11 }}>
                  Total Stake
                </div>
                <div style={{ fontWeight: 800 }}>${(numericAmount * selected.size).toFixed(2)}</div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div className="np-text-muted" style={{ fontSize: 11 }}>
                Expected Profit
              </div>
              <div className="np-text-success" style={{ fontWeight: 900, fontSize: 22 }}>
                +${expectedPayout.toFixed(2)}
              </div>
            </div>

            <button
              type="button"
              className="np-btn np-btn-success"
              style={{ width: "100%" }}
              disabled={selected.size === 0 || numericAmount <= 0}
              onClick={handleConfirm}
            >
              Confirm Express Trade
            </button>
          </div>
        </section>

        <section className="np-section">
          <div className="np-section-head">
            <h2>Recent Express Trades</h2>
          </div>

          {recent.length === 0 ? (
            <EmptyState icon="⚡" title="No express trades yet" description="Your express trades will appear here." />
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {recent.map((trade) => (
                <div key={trade.id} className="np-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{trade.assets.join(", ")}</div>
                    <div className="np-text-muted" style={{ fontSize: 12 }}>
                      ${trade.amount} · {trade.expiry} · {trade.time}
                    </div>
                  </div>
                  <StatusBadge tone={STATUS_TONE[trade.status]}>{trade.status}</StatusBadge>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
