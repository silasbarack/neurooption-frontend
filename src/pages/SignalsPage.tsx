import React from "react";
import { PageHeader, StatusBadge, EmptyState } from "../components/common";
import type { BadgeTone } from "../components/common";
import { ASSET_CATEGORIES } from "../components/trading";
import { MOCK_SIGNALS, type SignalStrength } from "../data/mockData";

const STRENGTH_TONE: Record<SignalStrength, BadgeTone> = {
  Strong: "success",
  Moderate: "warning",
  Weak: "neutral",
};

export default function SignalsPage() {
  const [filter, setFilter] = React.useState<string>("All");

  const filtered = MOCK_SIGNALS.filter((signal) => {
    if (filter === "All") return true;
    return signal.asset.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <main className="np-page">
      <div className="np-container">
        <PageHeader title="Signals" subtitle="Informational trading signals to support your own analysis." />

        <div className="np-card" style={{ marginBottom: 20, borderLeft: "3px solid var(--np-warning)" }}>
          <strong>⚠️ Demo notice:</strong>{" "}
          <span className="np-text-muted">
            These signals are informational/demo only and are not financial advice. Always confirm with your
            own analysis before trading.
          </span>
        </div>

        <div className="np-tabs">
          <button type="button" className={`np-tab ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")}>
            All
          </button>
          {ASSET_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`np-tab ${filter === category ? "active" : ""}`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="📡" title="No signals right now" description="Check back soon for new signals." />
        ) : (
          <div className="np-grid np-grid-3">
            {filtered.map((signal) => (
              <div key={signal.id} className="np-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 800 }}>{signal.asset}</div>
                  <StatusBadge tone={signal.direction === "BUY" ? "success" : "danger"}>{signal.direction}</StatusBadge>
                </div>

                <div className="np-text-muted" style={{ fontSize: 12, margin: "6px 0 14px" }}>
                  Generated {signal.generatedAt} · Suggested expiry {signal.suggestedExpiry}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div className="np-text-muted" style={{ fontSize: 11 }}>
                      Confidence
                    </div>
                    <div style={{ fontWeight: 800 }}>{signal.confidence}%</div>
                  </div>
                  <StatusBadge tone={STRENGTH_TONE[signal.strength]}>{signal.strength}</StatusBadge>
                </div>

                <div className="np-progress" style={{ marginTop: 10 }}>
                  <div className="np-progress-fill" style={{ width: `${signal.confidence}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
