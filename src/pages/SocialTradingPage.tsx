import React from "react";
import { PageHeader, StatusBadge } from "../components/common";
import type { BadgeTone } from "../components/common";
import { MOCK_TRADERS, type RiskScore } from "../data/mockData";

const RISK_TONE: Record<RiskScore, BadgeTone> = {
  Low: "success",
  Medium: "warning",
  High: "danger",
};

export default function SocialTradingPage() {
  const [following, setFollowing] = React.useState<Set<string>>(new Set());

  function toggleFollow(id: string) {
    setFollowing((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <main className="np-page">
      <div className="np-container">
        <PageHeader title="Social Trading" subtitle="Follow and copy strategies from top performing traders." />

        <div className="np-card" style={{ marginBottom: 20, borderLeft: "3px solid var(--np-warning)" }}>
          <strong>⚠️ Risk warning:</strong>{" "}
          <span className="np-text-muted">
            Copying other traders does not guarantee profits. Past performance is not indicative of future
            results.
          </span>
        </div>

        <section className="np-section np-grid np-grid-3">
          {MOCK_TRADERS.map((trader) => {
            const isFollowing = following.has(trader.id);
            return (
              <div key={trader.id} className="np-card">
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="np-avatar" style={{ width: 46, height: 46, fontSize: 15 }}>
                    {trader.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800 }}>{trader.name}</div>
                    <div className="np-text-muted" style={{ fontSize: 12 }}>
                      #{trader.rank} · {trader.followers.toLocaleString()} followers
                    </div>
                  </div>
                </div>

                <div className="np-grid np-grid-3" style={{ gap: 8, margin: "14px 0" }}>
                  <div>
                    <div className="np-text-muted" style={{ fontSize: 11 }}>
                      Win Rate
                    </div>
                    <div style={{ fontWeight: 800 }}>{trader.winRate}%</div>
                  </div>
                  <div>
                    <div className="np-text-muted" style={{ fontSize: 11 }}>
                      Profit
                    </div>
                    <div className="np-text-success" style={{ fontWeight: 800 }}>
                      +{trader.profitPercent}%
                    </div>
                  </div>
                  <div>
                    <div className="np-text-muted" style={{ fontSize: 11 }}>
                      Risk
                    </div>
                    <StatusBadge tone={RISK_TONE[trader.riskScore]}>{trader.riskScore}</StatusBadge>
                  </div>
                </div>

                <button
                  type="button"
                  className={isFollowing ? "np-btn" : "np-btn np-btn-primary"}
                  style={{ width: "100%" }}
                  onClick={() => toggleFollow(trader.id)}
                >
                  {isFollowing ? "Following" : "Follow / Copy"}
                </button>
              </div>
            );
          })}
        </section>

        <section className="np-section">
          <div className="np-section-head">
            <h2>Leaderboard</h2>
          </div>

          <div className="np-table-wrap">
            <table className="np-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Trader</th>
                  <th style={{ textAlign: "right" }}>Win Rate</th>
                  <th style={{ textAlign: "right" }}>Profit</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRADERS.map((trader) => (
                  <tr key={trader.id}>
                    <td>#{trader.rank}</td>
                    <td style={{ fontWeight: 700 }}>{trader.name}</td>
                    <td style={{ textAlign: "right" }}>{trader.winRate}%</td>
                    <td style={{ textAlign: "right" }} className="np-text-success">
                      +{trader.profitPercent}%
                    </td>
                    <td>
                      <StatusBadge tone={RISK_TONE[trader.riskScore]}>{trader.riskScore}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
