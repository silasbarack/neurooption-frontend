import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Flame, Lock, Target, TrendingUp, Trophy } from "lucide-react";
import AppShell from "../components/shell/AppShell";
import { fetchTradeHistory, type BackendTrade } from "../components/trading/tradesApi";
import "./CommunityPages.css";

const XP_PER_LEVEL = 300;
const ACHIEVEMENT_TABS = ["badges", "tasks", "rewards"] as const;
type AchievementTab = (typeof ACHIEVEMENT_TABS)[number];
type Badge = {
  id: string; title: string; description: string;
  tone: "gold" | "silver" | "bronze" | "blue" | "green" | "violet";
  glyph: string; current: number; target: number;
};
function tradingDayStreak(trades: BackendTrade[]) {
  const days = new Set(trades.map((trade) => new Date(trade.entryTime).toDateString()));
  let streak = 0;
  const cursor = new Date();
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toDateString())) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
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
function formatBadgeProgress(badge: Badge) {
  const current = Math.min(Math.floor(badge.current), badge.target).toLocaleString();
  const target = badge.target.toLocaleString();
  if (badge.id === "roller") return "$" + current + " of $" + target + " staked";
  const unit = badge.id === "streak" || badge.id === "month" ? "days" : badge.id === "profit" || badge.id === "fifty-wins" ? "wins" : "trades";
  return current + " of " + target + " " + unit;
}
function MedalArt({ badge, unlocked }: { badge: Badge; unlocked: boolean }) {
  return (
    <span className={"ach-medal tone-" + badge.tone + (unlocked ? "" : " is-locked")} aria-hidden="true">
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
  const [tab, setTab] = useState<AchievementTab>("badges");
  useEffect(() => {
    const controller = new AbortController();
    fetchTradeHistory(controller.signal).then((history) => {
      if (!controller.signal.aborted) setTrades(history);
    }).catch((err: unknown) => {
      if (!controller.signal.aborted) setError(err instanceof Error && err.message ? err.message : "Could not load your trades.");
    });
    return () => controller.abort();
  }, []);
  const stats = useMemo(() => (trades === null ? null : buildStats(trades)), [trades]);
  const loading = trades === null && !error;
  const badges: Badge[] = stats ? [
    { id: "first", title: "First Trade", description: "Complete your first trade", tone: "gold", glyph: "1", current: stats.total, target: 1 },
    { id: "ten", title: "10 Trades", description: "Complete 10 trades", tone: "silver", glyph: "10", current: stats.total, target: 10 },
    { id: "streak", title: "7 Day Streak", description: "Trade 7 days in a row", tone: "bronze", glyph: "7", current: stats.streak, target: 7 },
    { id: "roller", title: "High Roller", description: "Place a single $100+ trade", tone: "blue", glyph: "$", current: stats.biggestStakeUsd, target: 100 },
    { id: "profit", title: "Profit Master", description: "Win 25 trades", tone: "green", glyph: "★", current: stats.wins, target: 25 },
    { id: "century", title: "Century Club", description: "Complete 100 trades", tone: "violet", glyph: "100", current: stats.total, target: 100 },
    { id: "fifty-wins", title: "50 Wins", description: "Win 50 trades", tone: "gold", glyph: "50", current: stats.wins, target: 50 },
    { id: "month", title: "30 Day Streak", description: "Trade 30 days in a row", tone: "bronze", glyph: "30", current: stats.streak, target: 30 },
    { id: "thousand", title: "Veteran", description: "Complete 1,000 trades", tone: "violet", glyph: "1K", current: stats.total, target: 1000 },
  ] : [];
  const level = stats ? Math.floor(stats.xp / XP_PER_LEVEL) + 1 : null;
  const levelXp = stats ? stats.xp % XP_PER_LEVEL : 0;
  const unlockedCount = badges.filter((badge) => badge.current >= badge.target).length;
  const tasks = badges.filter((badge) => badge.current < badge.target).slice(0, 5);
  const title = level === null ? "" : level >= 20 ? "Elite Trader" : level >= 10 ? "Advanced Trader" : level >= 4 ? "Active Trader" : "Rising Trader";
  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = ACHIEVEMENT_TABS.indexOf(tab);
    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight": nextIndex = (index + 1) % ACHIEVEMENT_TABS.length; break;
      case "ArrowLeft": nextIndex = (index + ACHIEVEMENT_TABS.length - 1) % ACHIEVEMENT_TABS.length; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = ACHIEVEMENT_TABS.length - 1; break;
      default: return;
    }
    event.preventDefault();
    const nextTab = ACHIEVEMENT_TABS[nextIndex];
    setTab(nextTab);
    event.currentTarget.parentElement?.querySelector<HTMLButtonElement>("#ach-tab-" + nextTab)?.focus();
  }
  return (
    <AppShell title="Achievements">
      <div className="ach">
        <header className="ach-heading"><h1>Achievements</h1><p>Your progress, one milestone at a time.</p></header>
        <section className="ach-hero neo-card" aria-labelledby="ach-level-title" aria-busy={loading}>
          <div className="ach-level" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs><linearGradient id="ach-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe08a" /><stop offset="1" stopColor="#c98a0c" /></linearGradient></defs>
              {Array.from({ length: 9 }, (_, i) => {
                const a = (-200 + i * 25) * (Math.PI / 180);
                const b = (-160 - i * 25) * (Math.PI / 180);
                return <g key={i}>
                  <ellipse cx={60 + Math.cos(a) * 46} cy={64 + Math.sin(a) * 46} rx="4" ry="9" fill="url(#ach-gold)" transform={"rotate(" + ((a * 180) / Math.PI + 90) + " " + (60 + Math.cos(a) * 46) + " " + (64 + Math.sin(a) * 46) + ")"} />
                  <ellipse cx={60 + Math.cos(b) * 46} cy={64 + Math.sin(b) * 46} rx="4" ry="9" fill="url(#ach-gold)" transform={"rotate(" + ((b * 180) / Math.PI + 90) + " " + (60 + Math.cos(b) * 46) + " " + (64 + Math.sin(b) * 46) + ")"} />
                </g>;
              })}
              <circle cx="60" cy="62" r="36" fill="url(#ach-gold)" /><circle cx="60" cy="62" r="29" fill="#171d2c" />
            </svg>
            <b>{level ?? "–"}</b>
          </div>
          <h2 id="ach-level-title">{level === null ? "Your level" : "Level " + level.toLocaleString()}</h2>
          <p>{stats ? title : loading ? "Loading your progress" : "Progress unavailable"}</p>
          {stats && <>
            <div className="ach-xp">
              <div className="ach-xp-label"><small id="ach-xp-label">Level progress</small><small>{levelXp.toLocaleString()} / {XP_PER_LEVEL.toLocaleString()} XP</small></div>
              <span role="progressbar" aria-labelledby="ach-xp-label" aria-valuemin={0} aria-valuemax={XP_PER_LEVEL} aria-valuenow={levelXp} aria-valuetext={levelXp.toLocaleString() + " of " + XP_PER_LEVEL.toLocaleString() + " XP toward level " + ((level ?? 0) + 1)}>
                <i style={{ width: (levelXp / XP_PER_LEVEL) * 100 + "%" }} />
              </span>
              <small className="ach-xp-next">{(XP_PER_LEVEL - levelXp).toLocaleString()} XP to level {(level ?? 0) + 1}</small>
            </div>
            <dl className="ach-stats">
              <div><dt>Trades</dt><dd>{stats.total.toLocaleString()}</dd></div><div><dt>Wins</dt><dd>{stats.wins.toLocaleString()}</dd></div>
              <div><dt>Day streak</dt><dd>{stats.streak.toLocaleString()}</dd></div><div><dt>Badges</dt><dd>{unlockedCount}/{badges.length}</dd></div>
            </dl>
          </>}
          {loading && <p className="ach-loading" role="status">Syncing your trade history…</p>}
          {error && <p className="ach-note" role="alert">{error} Refresh the page to try again.</p>}
        </section>
        <section aria-label="Achievement collection">
          <div className="neo-tabs ach-tabs" role="tablist" aria-label="Achievement sections">
            {ACHIEVEMENT_TABS.map((key) => <button key={key} id={"ach-tab-" + key} type="button" role="tab" aria-selected={tab === key} aria-controls={"ach-panel-" + key} tabIndex={tab === key ? 0 : -1} className={tab === key ? "is-active" : ""} onClick={() => setTab(key)} onKeyDown={handleTabKeyDown}>{key[0].toUpperCase() + key.slice(1)}</button>)}
          </div>
          <div id="ach-panel-badges" role="tabpanel" aria-labelledby="ach-tab-badges" tabIndex={0} hidden={tab !== "badges"}>
            <div className="ach-collection-head"><div><h2>Your collection</h2><p>Milestones earned from your trading history.</p></div>{stats && <small>{unlockedCount} of {badges.length} unlocked</small>}</div>
            {stats ? <div className="ach-grid">
              {badges.map((badge) => {
                const unlocked = badge.current >= badge.target;
                const progress = Math.min(badge.current, badge.target);
                return <article key={badge.id} className={"ach-badge neo-card" + (unlocked ? " is-unlocked" : "")} aria-labelledby={"ach-badge-" + badge.id}>
                  <MedalArt badge={badge} unlocked={unlocked} /><b id={"ach-badge-" + badge.id}>{badge.title}</b><small>{badge.description}</small>
                  <small className="ach-badge-status">{unlocked ? <Check size={12} aria-hidden="true" /> : <Lock size={12} aria-hidden="true" />}{unlocked ? "Unlocked" : "Locked"}</small>
                  <span className="ach-badge-progress" role="progressbar" aria-label={badge.title + " progress"} aria-valuemin={0} aria-valuemax={badge.target} aria-valuenow={progress} aria-valuetext={formatBadgeProgress(badge)}><i style={{ width: (progress / badge.target) * 100 + "%" }} /></span>
                  <small>{formatBadgeProgress(badge)}</small>
                </article>;
              })}
            </div> : <div className={"neo-card " + (loading ? "ach-loading" : "ach-empty")}><Trophy size={28} aria-hidden="true" /><p>{loading ? "Loading your badge collection…" : "Your badge collection is unavailable while your trade history cannot be loaded."}</p></div>}
          </div>
          <div id="ach-panel-tasks" role="tabpanel" aria-labelledby="ach-tab-tasks" tabIndex={0} hidden={tab !== "tasks"}>
            <div className="ach-collection-head"><div><h2>Your next milestones</h2><p>Follow your progress toward the next badge.</p></div>{stats && <small>{tasks.length} {tasks.length === 1 ? "milestone" : "milestones"}</small>}</div>
            {stats ? <ul className="ach-tasks">
              {tasks.length === 0 && <li className="neo-card ach-empty"><Trophy size={28} aria-hidden="true" /><b>Every badge is unlocked</b><small>You've completed every milestone in this collection.</small></li>}
              {tasks.map((badge) => <li key={badge.id} className="neo-card"><div><Target size={18} className="ach-task-icon" aria-hidden="true" /><b>{badge.description}</b><small>{formatBadgeProgress(badge)}</small></div><span className="ach-task-bar" role="progressbar" aria-label={badge.title + " progress"} aria-valuemin={0} aria-valuemax={badge.target} aria-valuenow={Math.min(badge.current, badge.target)} aria-valuetext={formatBadgeProgress(badge)}><i style={{ width: Math.min(100, (badge.current / badge.target) * 100) + "%" }} /></span></li>)}
              <li className="ach-task-cta"><Link to="/trading" className="neo-btn neo-btn-primary">Go to trading<ArrowRight size={16} aria-hidden="true" /></Link></li>
            </ul> : <div className={"neo-card " + (loading ? "ach-loading" : "ach-empty")}><Target size={28} aria-hidden="true" /><p>{loading ? "Loading your milestones…" : "Your milestones will be available when your trade history can be loaded."}</p></div>}
          </div>
          <div id="ach-panel-rewards" role="tabpanel" aria-labelledby="ach-tab-rewards" tabIndex={0} hidden={tab !== "rewards"}>
            <div className="ach-collection-head"><div><h2>Make every milestone count</h2><p>How your trading activity contributes to XP.</p></div></div>
            <div className="neo-card ach-rewards"><b>How XP works</b>
              <ul className="ach-reward-list">
                <li><span className="ach-reward-icon"><Check size={18} aria-hidden="true" /></span><span><b>+10 XP</b> for every completed trade</span></li>
                <li><span className="ach-reward-icon"><TrendingUp size={18} aria-hidden="true" /></span><span><b>+15 XP</b> bonus for every winning trade</span></li>
                <li><span className="ach-reward-icon"><Flame size={18} aria-hidden="true" /></span><span><b>+20 XP</b> for each day in your current trading streak</span></li>
              </ul><p>Every {XP_PER_LEVEL} XP takes you up a level. Badge rewards and tournament perks are coming soon.</p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
