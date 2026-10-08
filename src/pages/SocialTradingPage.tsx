import { useEffect, useRef, useState } from "react";
import { BookmarkCheck, ChevronRight, Crown, Info, ShieldCheck, UsersRound, X } from "lucide-react";
import AppShell from "../components/shell/AppShell";
import Avatar from "../components/shell/Avatar";
import "./CommunityPages.css";
type Trader = { id: string; name: string; gain: number; copiers: number; winRate: number; risk: "Low" | "Medium" | "High"; top?: boolean; seed: number };
// Explicit examples only: no live social trading API is available.
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
  const rand = () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
  let y = 30; const points: string[] = [];
  for (let i = 0; i <= 30; i++) { y = Math.max(4, Math.min(34, y - .7 + (rand() - .45) * 6)); points.push((i / 30) * 300+","+y.toFixed(1)); }
  return "M"+points.join(" L");
}
const TABS = [{ key: "top", label: "Top Traders" }, { key: "following", label: "My Following" }, { key: "leaderboard", label: "Leaderboard" }] as const;
type SocialTab = typeof TABS[number]["key"];
export default function SocialTradingPage() {
  const [tab, setTab] = useState<SocialTab>("top");
  const [following, setFollowing] = useState<string[]>([]);
  const [previewTrader, setPreviewTrader] = useState<Trader | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const list = tab === "following" ? TRADERS.filter(trader => following.includes(trader.id)) : tab === "leaderboard" ? [...TRADERS].sort((a, b) => b.winRate - a.winRate) : TRADERS;
  useEffect(() => { if (previewTrader && !dialogRef.current?.open) dialogRef.current?.showModal(); }, [previewTrader]);
  function openPreview(trader: Trader) { setPreviewTrader(trader); }
  function closePreview() { dialogRef.current?.close(); setPreviewTrader(null); }
  function toggle(id: string) { setFollowing(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]); closePreview(); }
  return <AppShell title="Social Trading"><div className="soc">
    <header className="soc-head"><div><span className="soc-eyebrow">DISCOVER & LEARN</span><h1>Social Trading</h1><p>A new way to explore trading strategies.</p></div><span className="soc-coming"><span /> Coming soon</span></header>
    <div className="neo-tabs soc-tabs" role="tablist" aria-label="Trader profiles">{TABS.map(({key, label}, index) => <button key={key} id={"soc-tab-"+key} type="button" role="tab" aria-selected={tab === key} aria-controls="soc-panel" tabIndex={tab === key ? 0 : -1} className={tab === key ? "is-active" : ""} onClick={() => setTab(key)} onKeyDown={event => { let next: number; if (event.key === "ArrowRight") next = (index + 1) % TABS.length; else if (event.key === "ArrowLeft") next = (index + TABS.length - 1) % TABS.length; else if (event.key === "Home") next = 0; else if (event.key === "End") next = TABS.length - 1; else return; event.preventDefault(); setTab(TABS[next].key); document.getElementById("soc-tab-"+TABS[next].key)?.focus(); }}>{label}{key === "following" && following.length > 0 && <span className="soc-follow-count">{following.length}</span>}</button>)}</div>
    <div className="soc-preview"><Info size={16} aria-hidden="true" /><p><b>Explore the preview.</b> These profiles, performance figures and copier counts are illustrative. Live copy trading is not yet available.</p></div>
    <section id="soc-panel" role="tabpanel" aria-labelledby={"soc-tab-"+tab}>
      <div className="soc-collection-head"><h2>{tab === "following" ? "Your local following" : tab === "leaderboard" ? "Example leaderboard" : "Meet the example traders"}</h2><span>{list.length} {list.length === 1 ? "profile" : "profiles"}</span></div>
      {list.length === 0 ? <div className="neo-card soc-empty"><span className="soc-empty-icon"><UsersRound size={28} strokeWidth={1.4} aria-hidden="true" /></span><h2>Your following list starts here</h2><p>Add an example trader to compare their illustrative profile during this visit.</p><button type="button" className="neo-btn neo-btn-primary" onClick={() => setTab("top")}>Explore traders <ChevronRight size={15} aria-hidden="true" /></button></div> : <div className="soc-grid">{list.map((trader, index) => {
        const active = following.includes(trader.id); const path = sparkPath(trader.seed);
        return <article key={trader.id} className={"soc-card neo-card "+(trader.top ? "is-featured" : "")}>
          <div className="soc-card-top">{tab === "leaderboard" && <span className="soc-rank">#{index + 1}</span>}<Avatar name={trader.name} size={44} /><div className="soc-name"><b>{trader.name}{trader.top && <Crown size={14} className="neo-accent-text" aria-label="Featured example" />}</b><small>{trader.top ? "Featured strategy" : "Strategy profile"}</small></div><span className="soc-sample-tag">Example</span></div>
          <div className="soc-performance"><div><span className="soc-gain">+{trader.gain.toFixed(1)}<small>%</small></span><small>Illustrative 30-day return</small></div><div className="soc-copiers"><b><UsersRound size={13} aria-hidden="true" />{trader.copiers.toLocaleString()}</b><small>Example copiers</small></div></div>
          <svg viewBox="0 0 300 44" preserveAspectRatio="none" className="soc-spark" aria-hidden="true"><defs><linearGradient id={"soc-area-"+trader.id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" style={{ stopColor: "var(--positive)" }} stopOpacity=".16" /><stop offset="100%" style={{ stopColor: "var(--positive)" }} stopOpacity="0" /></linearGradient></defs><path className="soc-spark-area" d={path+" L300,44 L0,44 Z"} fill={"url(#soc-area-"+trader.id+")"} /><path className="soc-spark-line" d={path} /></svg>
          <div className="soc-card-foot"><div className="soc-meta"><span>Win rate <b>{trader.winRate}%</b></span><span>Risk <b className={"soc-risk is-"+trader.risk.toLowerCase()}><i />{trader.risk}</b></span></div><button type="button" className={"neo-btn neo-btn-sm soc-copy "+(active ? "neo-btn-outline" : "neo-btn-primary")} onClick={() => openPreview(trader)} aria-label={active ? "Manage local following for "+trader.name : "Preview copy trading for "+trader.name}>{active && <BookmarkCheck size={13} aria-hidden="true" />}{active ? "Following" : "Copy"}</button></div>
        </article>;
      })}</div>}
    </section>
    <p className="soc-local-note"><ShieldCheck size={14} aria-hidden="true" />Copy opens a preview. Following lasts for this visit and does not place trades.</p>
    <dialog ref={dialogRef} className="soc-dialog" aria-labelledby="soc-dialog-title" aria-describedby="soc-dialog-description" onCancel={() => setPreviewTrader(null)} onClose={() => setPreviewTrader(null)} onClick={event => { if (event.target === event.currentTarget) closePreview(); }}>
      {previewTrader && <><button type="button" className="soc-dialog-close" onClick={closePreview} aria-label="Close copy trading preview"><X size={19} /></button><span className="soc-dialog-icon"><UsersRound size={28} strokeWidth={1.4} aria-hidden="true" /></span><span className="soc-eyebrow">A LOOK AT WHAT’S NEXT</span><h2 id="soc-dialog-title">Copy trading is coming soon</h2><p id="soc-dialog-description">This profile and its performance are examples. No orders will be copied and no funds will be moved.</p><div className="soc-dialog-trader"><Avatar name={previewTrader.name} size={42} /><div><b>{previewTrader.name}</b><small>Illustrative strategy profile</small></div><span className="soc-sample-tag">Example</span></div><p className="soc-dialog-local">Save this example to My Following for this visit.</p><button type="button" className="neo-btn neo-btn-primary soc-dialog-save" onClick={() => toggle(previewTrader.id)}>{following.includes(previewTrader.id) ? "Remove from local following" : "Add to local following"}</button><button type="button" className="soc-dialog-dismiss" onClick={closePreview}>Back to traders</button></>}
    </dialog>
  </div></AppShell>;
}
