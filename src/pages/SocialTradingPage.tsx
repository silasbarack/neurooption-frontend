import { useState } from "react";
import { Crown, Info } from "lucide-react";

import AppShell from "../components/shell/AppShell";
import Avatar from "../components/shell/Avatar";
import "./CommunityPages.css";

type Trader = {
  id: string;
  name: string;
  gain: number;
  copiers: number;
  winRate: number;
  risk: "Low" | "Medium" | "High";
  top?: boolean;
  seed: number;
};

// Preview data until copy trading goes live.
const TRADERS: Trader[] = [
  { id: "t1", name: "ProFX Ken", gain: 342.6, copiers: 1245, winRate: 78, risk: "Medium", top: true, seed: 3 },
  { id: "t2", name: "GlobalTrader", gain: 278.1, copiers: 980, winRate: 74, risk: "Low", seed: 11 },
  { id: "t3", name: "Nairobi Trader", gain: 215.4, copiers: 642, winRate: 71, risk: "Medium", seed: 23 },
  { id: "t4", name: "AlphaInvest", gain: 198.7, copiers: 411, winRate: 69, risk: "Low", seed: 31 },
  { id: "t5", name: "PipHunter", gain: 156.2, copiers: 388, winRate: 67, risk: "High", seed: 47 },
  { id: "t6", name: "CandleQueen", gain: 131.9, copiers: 301, winRate: 66, risk: "Medium", seed: 59 },
];

function sparkPath(seed: number) {
  let state = seed;
  const rand = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
  let y = 30;
  const points: string[] = [];
  for (let i = 0; i <= 30; i++) {
    y = Math.max(4, Math.min(34, y - 0.7 + (rand() - 0.45) * 6));
    points.push(`${(i / 30) * 300},${y.toFixed(1)}`);
  }
  return `M${points.join(" L")}`;
}

export default function SocialTradingPage() {
  const [tab, setTab] = useState<"top" | "following" | "leaderboard">("top");
  const [following, setFollowing] = useState<string[]>([]);

  const list =
    tab === "following"
      ? TRADERS.filter((trader) => following.includes(trader.id))
      : tab === "leaderboard"
        ? [...TRADERS].sort((a, b) => b.winRate - a.winRate)
        : TRADERS;

  function toggle(id: string) {
    setFollowing((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <AppShell title="Social Trading">
      <div className="soc">
        <div className="soc-head">
          <h1>Social Trading</h1>
          <p>Follow top traders and see how they perform. One-tap copy trading is launching soon.</p>
        </div>

        <div className="neo-tabs soc-tabs" role="tablist">
          {[
            ["top", "Top Traders"],
            ["following", `My Following${following.length ? ` (${following.length})` : ""}`],
            ["leaderboard", "Leaderboard"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={tab === key ? "is-active" : ""}
              onClick={() => setTab(key as typeof tab)}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="soc-preview">
          <Info size={15} aria-hidden="true" />
          Preview: these trader profiles are illustrative while copy trading is being launched. Past performance does
          not guarantee future results.
        </p>

        {list.length === 0 ? (
          <div className="neo-card soc-empty">You are not following anyone yet. Tap Copy on a trader to follow them.</div>
        ) : (
          <div className="soc-grid">
            {list.map((trader, index) => {
              const active = following.includes(trader.id);
              return (
                <article key={trader.id} className="soc-card neo-card">
                  <div className="soc-card-top">
                    {tab === "leaderboard" && <span className="soc-rank">#{index + 1}</span>}
                    <Avatar name={trader.name} size={44} />
                    <div className="soc-name">
                      <b>
                        {trader.name}
                        {trader.top && <Crown size={14} className="neo-gold-text" aria-label="Top trader" />}
                      </b>
                      <span className="soc-gain">+{trader.gain.toFixed(1)}%</span>
                      <small>Last 30 days</small>
                    </div>
                    <div className="soc-copiers">
                      <b>{trader.copiers.toLocaleString()}</b>
                      <small>Copiers</small>
                    </div>
                    <button
                      type="button"
                      className={`neo-btn neo-btn-sm ${active ? "neo-btn-outline" : "neo-btn-gold"}`}
                      onClick={() => toggle(trader.id)}
                      aria-pressed={active}
                    >
                      {active ? "Following" : "Copy"}
                    </button>
                  </div>
                  <svg viewBox="0 0 300 38" preserveAspectRatio="none" className="soc-spark" aria-hidden="true">
                    <path d={sparkPath(trader.seed)} />
                  </svg>
                  <div className="soc-meta">
                    <span>
                      Win rate <b>{trader.winRate}%</b>
                    </span>
                    <span>
                      Risk <b className={`soc-risk is-${trader.risk.toLowerCase()}`}>{trader.risk}</b>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
