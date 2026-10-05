import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

import AppShell from "../components/shell/AppShell";
import { fetchTradeHistory, type BackendTrade } from "../components/trading";
import "./CommunityPages.css";

const XP_PER_LEVEL = 300;

type Badge = {
  id: string;
  title: string;
  description: string;
  tone: "gold" | "silver" | "bronze" | "blue" | "green" | "violet";
  glyph: string;
  current: number;
  target: number;
};

function tradingDayStreak(trades: BackendTrade[]) {
  const days = new Set(trades.map((trade) => new Date(trade.entryTime).toDateString()));
  let streak = 0;
  const cursor = new Date();
  // Today counts if traded; otherwise start from yesterday.
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function buildStats(trades: BackendTrade[]) {
  const settled = trades.filter((trade) => trade.status !== "PENDING");
  const wins = settled.filter((trade) => trade.status === "WON").length;
  const biggestStakeUsd = Math.max(0, ...trades.map((trade) => trade.stakeUsd || 0));
  const profitUsd = settled.reduce((sum, trade) => sum + (trade.profitUsd ?? 0), 0);
  const streak = tradingDayStreak(trades);
  const xp = settled.length * 10 + wins * 15 + streak * 20;
  return { total: settled.length, wins, biggestStakeUsd, profitUsd, streak, xp };
}

function MedalArt({ badge, unlocked }: { badge: Badge; unlocked: boolean }) {
  return (
    <span className={`ach-medal tone-${badge.tone} ${unlocked ? "" : "is-locked"}`} aria-hidden="true">
      <svg viewBox="0 0 64 64">
        <path d="M32 3l24 10v19c0 15-10 25-24 29C18 57 8 47 8 32V13z" className="ach-medal-shield" />
        <path d="M32 9l19 8v15c0 12-8 20-19 23-11-3-19-11-19-23V17z" className="ach-medal-inner" />
      </svg>
      <b>{unlocked ? badge.glyph : <Lock size={18} />}</b>
    </span>
  );
}

export default function AchievementsPage() {
  const [trades, setTrades] = useState<BackendTrade[] | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"badges" | "tasks" | "rewards">("badges");

  useEffect(() => {
    const controller = new AbortController();
    fetchTradeHistory(controller.signal)
      .then(setTrades)
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Could not load your trades.");
          setTrades([]);
        }
      });
    return () => controller.abort();
  }, []);

  const stats = useMemo(() => buildStats(trades ?? []), [trades]);

  const badges: Badge[] = [
    { id: "first", title: "First Trade", description: "Complete your first trade", tone: "gold", glyph: "1", current: stats.total, target: 1 },
    { id: "ten", title: "10 Trades", description: "Complete 10 trades", tone: "silver", glyph: "10", current: stats.total, target: 10 },
    { id: "streak", title: "7 Day Streak", description: "Trade 7 days in a row", tone: "bronze", glyph: "7", current: stats.streak, target: 7 },
    { id: "roller", title: "High Roller", description: "Place a single $100+ trade", tone: "blue", glyph: "$", current: stats.biggestStakeUsd, target: 100 },
    { id: "profit", title: "Profit Master", description: "Win 25 trades", tone: "green", glyph: "★", current: stats.wins, target: 25 },
    { id: "century", title: "Century Club", description: "Complete 100 trades", tone: "violet", glyph: "100", current: stats.total, target: 100 },
    { id: "fifty-wins", title: "50 Wins", description: "Win 50 trades", tone: "gold", glyph: "50", current: stats.wins, target: 50 },
    { id: "month", title: "30 Day Streak", description: "Trade 30 days in a row", tone: "bronze", glyph: "30", current: stats.streak, target: 30 },
    { id: "thousand", title: "Veteran", description: "Complete 1,000 trades", tone: "violet", glyph: "1K", current: stats.total, target: 1000 },
  ];

  const level = Math.floor(stats.xp / XP_PER_LEVEL) + 1;
  const levelXp = stats.xp % XP_PER_LEVEL;
  const unlockedCount = badges.filter((badge) => badge.current >= badge.target).length;
  const tasks = badges.filter((badge) => badge.current < badge.target).slice(0, 5);
  const title = level >= 20 ? "Elite Trader" : level >= 10 ? "Advanced Trader" : level >= 4 ? "Active Trader" : "Rising Trader";

  return (
    <AppShell title="Achievements">
      <div className="ach">
        <section className="ach-hero neo-card">
          <div className="ach-level" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs>
                <linearGradient id="ach-gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffe08a" />
                  <stop offset="1" stopColor="#c98a0c" />
                </linearGradient>
              </defs>
              {Array.from({ length: 9 }, (_, i) => {
                const a = (-200 + i * 25) * (Math.PI / 180);
                const b = (-160 - i * 25) * (Math.PI / 180);
                return (
                  <g key={i}>
                    <ellipse cx={60 + Math.cos(a) * 46} cy={64 + Math.sin(a) * 46} rx="4" ry="9" fill="url(#ach-gold)" transform={`rotate(${(a * 180) / Math.PI + 90} ${60 + Math.cos(a) * 46} ${64 + Math.sin(a) * 46})`} />
                    <ellipse cx={60 + Math.cos(b) * 46} cy={64 + Math.sin(b) * 46} rx="4" ry="9" fill="url(#ach-gold)" transform={`rotate(${(b * 180) / Math.PI + 90} ${60 + Math.cos(b) * 46} ${64 + Math.sin(b) * 46})`} />
                  </g>
                );
              })}
              <circle cx="60" cy="62" r="36" fill="url(#ach-gold)" />
              <circle cx="60" cy="62" r="29" fill="#1a1405" />
            </svg>
            <b>{trades ? level : "–"}</b>
          </div>
          <h1>Level {trades ? level : "–"}</h1>
          <p>{title}</p>
          <div className="ach-xp">
            <span>
              <i style={{ width: `${(levelXp / XP_PER_LEVEL) * 100}%` }} />
            </span>
            <small>
              {levelXp.toLocaleString()} / {XP_PER_LEVEL.toLocaleString()} XP
            </small>
          </div>
          <dl className="ach-stats">
            <div>
              <dt>Trades</dt>
              <dd>{stats.total}</dd>
            </div>
            <div>
              <dt>Wins</dt>
              <dd>{stats.wins}</dd>
            </div>
            <div>
              <dt>Day streak</dt>
              <dd>{stats.streak}</dd>
            </div>
            <div>
              <dt>Badges</dt>
              <dd>
                {unlockedCount}/{badges.length}
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <div className="neo-tabs ach-tabs" role="tablist">
            {(["badges", "tasks", "rewards"] as const).map((key) => (
              <button key={key} type="button" role="tab" aria-selected={tab === key} className={tab === key ? "is-active" : ""} onClick={() => setTab(key)}>
                {key[0].toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          {error && <p className="ach-note">{error}</p>}

          {tab === "badges" && (
            <div className="ach-grid">
              {badges.map((badge) => {
                const unlocked = badge.current >= badge.target;
                return (
                  <article key={badge.id} className={`ach-badge neo-card ${unlocked ? "is-unlocked" : ""}`} title={badge.description}>
                    <MedalArt badge={badge} unlocked={unlocked} />
                    <b>{badge.title}</b>
                    <small>{unlocked ? "Unlocked" : `${Math.min(Math.floor(badge.current), badge.target)}/${badge.target}`}</small>
                  </article>
                );
              })}
            </div>
          )}

          {tab === "tasks" && (
            <ul className="ach-tasks">
              {tasks.length === 0 && <li className="neo-card">Every badge is unlocked. Impressive!</li>}
              {tasks.map((badge) => (
                <li key={badge.id} className="neo-card">
                  <div>
                    <b>{badge.description}</b>
                    <small>
                      {Math.min(Math.floor(badge.current), badge.target)} of {badge.target}
                    </small>
                  </div>
                  <span className="ach-task-bar">
                    <i style={{ width: `${Math.min(100, (badge.current / badge.target) * 100)}%` }} />
                  </span>
                </li>
              ))}
              <li className="ach-task-cta">
                <Link to="/trading" className="neo-btn neo-btn-primary">
                  Trade now to earn XP
                </Link>
              </li>
            </ul>
          )}

          {tab === "rewards" && (
            <div className="neo-card ach-rewards">
              <b>How XP works</b>
              <ul>
                <li>+10 XP for every completed trade</li>
                <li>+15 XP bonus for every winning trade</li>
                <li>+20 XP for each day in your current trading streak</li>
              </ul>
              <p>Every {XP_PER_LEVEL} XP takes you up a level. Badge rewards and tournament perks are coming soon.</p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
