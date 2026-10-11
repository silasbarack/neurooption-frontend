import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import AdminSetupPage from "./AdminSetupPage";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3,
  CircleAlert, Clock3, Eye, EyeOff, Filter, LayoutDashboard,
  LockKeyhole, LogOut, RefreshCw, Search, ShieldCheck, Users, Wallet,
} from "lucide-react";
import Logo from "../components/branding/Logo";
import "./AdminPage.css";

const API = (import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com").replace(/\/$/, "");
const SESSION_KEY = "neurooption_admin_session";
const ROLES = ["SUPER_ADMIN", "RISK_ADMIN", "COMPLIANCE_ADMIN", "FINANCE_ADMIN"];

type Admin = { id: string; fullName: string; email: string; role: string };
type Trade = {
  id: string; userId: string; clientName: string; clientEmail: string | null;
  asset: string; side: string; status: string; accountType: string;
  currency: string; stakeAmount: number; stakeUsd: number; payoutPercent: number;
  profitUsd: number | null; entryTime: string; expiryTime: string;
};
type Data = {
  generatedAt: string; period: string; account: string;
  stats: {
    trades24: number; openTrades: number; volumeUsd24: number;
    wins24: number; losses24: number; winRate24: number | null; activeClients24: number;
  };
  activity: { hour: string; trades: number; volumeUsd: number }[];
  activitySampled: boolean;
  trades: { total: number; page: number; limit: number; pages: number; items: Trade[] };
};

const money = (value: number) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 2,
}).format(value);
const compact = (value: number) => new Intl.NumberFormat("en-US", {
  notation: "compact", maximumFractionDigits: 1,
}).format(value);
const kenyaDate = (value: string) => new Intl.DateTimeFormat("en-KE", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Nairobi",
}).format(new Date(value));
const kenyaClock = (value: string) => new Intl.DateTimeFormat("en-KE", {
  hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi",
}).format(new Date(value));
const errorMessage = (value: unknown) => value instanceof Error ? value.message : "Request failed.";

async function adminRequest<T>(path: string, token: string, options?: RequestInit, signal?: AbortSignal): Promise<T> {
  const response = await fetch(API + path, {
    ...options,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...options?.headers,
    },
    cache: "no-store",
  });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const msg = data && typeof data === "object" && "message" in data ? (data as { message: unknown }).message : null;
    const error = new Error(typeof msg === "string" ? msg : "Unable to complete request.");
    Object.assign(error, { status: response.status });
    throw error;
  }
  return data as T;
}

export default function AdminPage() {
  const location = useLocation();
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_KEY) || "");
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [authChecking, setAuthChecking] = useState(Boolean(token));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [account, setAccount] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setToken("");
    setAdmin(null);
    setData(null);
  }, []);

  useEffect(() => {
    if (!token) { setAuthChecking(false); return; }
    let cancelled = false;
    setAuthChecking(true);
    adminRequest<{ admin: Admin }>("/admin/session", token)
      .then(result => {
        if (cancelled) return;
        if (!ROLES.includes(result.admin.role)) {
          setAuthError("Your administrator role cannot access trading monitoring.");
          signOut();
        } else {
          setAdmin(result.admin);
        }
      })
      .catch(err => {
        if (!cancelled) { setAuthError(errorMessage(err)); signOut(); }
      })
      .finally(() => { if (!cancelled) setAuthChecking(false); });
    return () => { cancelled = true; };
  }, [token, signOut]);

  useEffect(() => {
    if (!admin || !token) return;
    const controller = new AbortController();
    let active = true;
    const refresh = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const params = new URLSearchParams({
          account, status, search, page: String(page), limit: "20",
        });
        const result = await adminRequest<Data>("/admin/trading-monitor?" + params.toString(), token, undefined, controller.signal);
        if (active) { setData(result); setError(""); }
      } catch (err) {
        if (!active) return;
        if ((err as Error).name === "AbortError") return;
        if ((err as Error & { status?: number }).status === 401) {
          signOut();
          setAuthError("Session expired. Please sign in again.");
        } else {
          setError(errorMessage(err));
        }
      } finally {
        if (active && !silent) setLoading(false);
      }
    };
    void refresh();
    const interval = window.setInterval(() => { void refresh(true); }, 15000);
    return () => { active = false; controller.abort(); window.clearInterval(interval); };
  }, [admin, token, account, status, search, page, refreshCount, signOut]);

  const maxActivity = useMemo(() => Math.max(1, ...(data?.activity.map(item => item.trades) || [])), [data]);
  const access = admin && ROLES.includes(admin.role);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSigningIn(true);
    setAuthError("");
    try {
      const result = await adminRequest<{ token: string }>("/admin/login", "", {
        method: "POST", body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      if (!result.token) throw new Error("No administrator session returned.");
      sessionStorage.setItem(SESSION_KEY, result.token);
      setPassword("");
      setToken(result.token);
    } catch (err) {
      setAuthError(errorMessage(err));
    } finally {
      setSigningIn(false);
    }
  }

  // Serve initial provisioning on the stable /admin path as a CDN-safe fallback.
  if (new URLSearchParams(location.search).get("mode") === "setup") {
    return <AdminSetupPage />;
  }

  if (!access) {
    return (
      <main className="na-auth">
        <div className="na-login-card">
          <div className="na-login-brand"><Logo /><span>ADMIN CONSOLE</span></div>
          <div className="na-login-icon"><ShieldCheck size={25} /></div>
          <p className="na-eyebrow">NEUROOPTION · SECURE OPERATIONS</p>
          <h1>Administrator access</h1>
          <p className="na-muted">Sign in with an authorized administrator account to monitor trading activity. Client accounts cannot access this console.</p>
          {authChecking ? <p className="na-alert" role="status">Checking administrator session…</p> : (
            <form onSubmit={signIn} className="na-login-form">
              {authError && <p className="na-alert error" role="alert"><CircleAlert size={16}/>{authError}</p>}
              <label htmlFor="admin-email">Administrator email</label>
              <input id="admin-email" type="email" value={email} autoComplete="username" onChange={e => setEmail(e.target.value)} required placeholder="admin@neurooption.com" />
              <label htmlFor="admin-password">Password</label>
              <div className="na-password-wrap">
                <input id="admin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="Enter admin password" />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
              </div>
              <button className="na-primary" type="submit" disabled={signingIn}>{signingIn ? "Verifying…" : "Sign in to dashboard"}<ArrowRight size={17}/></button>
            </form>
          )}
          <div className="na-initial-setup"><Link to="/admin?mode=setup">First-time setup: Create Super Administrator →</Link></div>
          <div className="na-auth-footer"><LockKeyhole size={15}/> Protected administrator workspace <Link to="/">Return to NeuroOption</Link></div>
        </div>
      </main>
    );
  }

  return (
    <main className="na-shell">
      <aside className="na-sidebar">
        <Link to="/" className="na-sidebar-brand"><Logo /><span>ADMIN</span></Link>
        <div className="na-sidebar-section">OPERATIONS</div>
        <div className="na-nav-item active"><LayoutDashboard size={19}/> Trading overview</div>
        <div className="na-sidebar-spacer"/>
        <div className="na-admin-profile">
          <div className="na-profile-circle">{(admin?.fullName || "A").slice(0,1).toUpperCase()}</div>
          <div><strong>{admin?.fullName}</strong><small>{admin?.role.replaceAll("_", " ")}</small></div>
        </div>
        <button className="na-logout" onClick={signOut}><LogOut size={17}/> Sign out</button>
      </aside>
      <section className="na-main">
        <header className="na-topbar">
          <div className="na-topbar-left"><ShieldCheck size={17}/><span>Restricted admin workspace</span><span className="na-pill">AUTHORIZED</span></div>
          <div className="na-topbar-right"><span className="na-live-dot"/> Auto-refresh: 15 sec <button onClick={() => setRefreshCount(n => n + 1)} aria-label="Refresh now" title="Refresh now"><RefreshCw size={18}/></button></div>
        </header>
        <div className="na-content">
          <div className="na-heading-row">
            <div>
              <div className="na-breadcrumb">OPERATIONS / TRADING ACTIVITY</div>
              <h1>Trading command center</h1>
              <p className="na-muted">Monitor client positions, trading volume, settlements and platform activity.</p>
            </div>
            <div className="na-update"><Clock3 size={16}/> {data ? "Updated " + kenyaDate(data.generatedAt) : "Awaiting data"} EAT</div>
          </div>

          {error && <div className="na-alert error" role="alert"><CircleAlert size={18}/>{error}<button onClick={() => setRefreshCount(n => n + 1)}>Retry</button></div>}

          <div className="na-filters-top">
            <div className="na-filter-title"><Filter size={17}/> Account type</div>
            <div className="na-tabs" aria-label="Account type filter">
              {([["all","All accounts"],["demo","Demo only"],["real","Real only"]] as const).map(([value,label]) =>
                <button key={value} className={account===value?"selected":""} onClick={() => { setAccount(value); setPage(1); }}>{label}</button>
              )}
            </div>
            <div className="na-filter-note">{account==="all"?"Demo and real stakes are combined below; this is not company revenue.":account==="demo"?"Only simulated demo-account activity is displayed.":"Only real-account trades are displayed."}</div>
          </div>

          <div className="na-stats">
            <div className="na-stat">
              <div className="na-stat-top"><span>Trades · last 24h</span><div className="na-stat-icon"><Activity size={19}/></div></div>
              <strong>{data ? compact(data.stats.trades24) : "—"}</strong>
              <small>Trade orders recorded</small>
            </div>
            <div className="na-stat">
              <div className="na-stat-top"><span>Open positions</span><div className="na-stat-icon"><Clock3 size={19}/></div></div>
              <strong>{data ? compact(data.stats.openTrades) : "—"}</strong>
              <small>Pending settlement</small>
            </div>
            <div className="na-stat">
              <div className="na-stat-top"><span>Staked volume · 24h</span><div className="na-stat-icon"><Wallet size={19}/></div></div>
              <strong>{data ? money(data.stats.volumeUsd24) : "—"}</strong>
              <small>USD-equivalent stake, not revenue</small>
            </div>
            <div className="na-stat">
              <div className="na-stat-top"><span>Win rate · last 24h</span><div className="na-stat-icon"><BarChart3 size={19}/></div></div>
              <strong>{data?.stats.winRate24 == null ? "—" : data.stats.winRate24 + "%"}</strong>
              <small>{data ? data.stats.wins24 + " wins / " + data.stats.losses24 + " losses" : "Settled trades only"}</small>
            </div>
          </div>

          <div className="na-analysis-grid">
            <section className="na-panel na-activity-panel">
              <div className="na-panel-heading"><div><h2>Trading activity</h2><p>Trades per 2-hour interval · rolling 24 hours</p></div><span className="na-data-caption">EAT (Kenya)</span></div>
              <div className="na-chart" role="img" aria-label="Trade activity in two-hour intervals over the last 24 hours">
                {data?.activity.map((item, index) => (
                  <div className="na-bar-column" key={item.hour}>
                    <span className="na-bar-value">{item.trades || ""}</span>
                    <div className="na-bar-track"><div style={{ height: (item.trades / maxActivity * 100) + "%" }} className={"na-bar " + (index===data.activity.length-1?"last":"")}/></div>
                    <span className="na-bar-label">{kenyaClock(item.hour)}</span>
                  </div>
                )) || <div className="na-loading-chart">{loading?"Loading activity…":"Activity unavailable"}</div>}
              </div>
              <p className="na-panel-footer">{data?.activitySampled ? "Chart is sampled from the 2,500 most recent trades; KPIs use full counts." : "Activity reflects recorded trades. Empty periods appear at zero."}</p>
            </section>
            <section className="na-panel na-outcome-panel">
              <div className="na-panel-heading"><div><h2>Settlement outcomes</h2><p>Last 24h · wins versus losses</p></div></div>
              <div className="na-outcomes">
                <div className="na-outcome-row"><span className="na-outcome-symbol positive"><ArrowUpRight size={19}/></span><div><small>Winning trades</small><strong>{data ? compact(data.stats.wins24) : "—"}</strong></div></div>
                <div className="na-outcome-row"><span className="na-outcome-symbol negative"><ArrowDownRight size={19}/></span><div><small>Losing trades</small><strong>{data ? compact(data.stats.losses24) : "—"}</strong></div></div>
                <div className="na-outcome-row"><span className="na-outcome-symbol neutral"><Users size={19}/></span><div><small>Active trading accounts / users</small><strong>{data ? compact(data.stats.activeClients24) : "—"}</strong></div></div>
              </div>
              <p className="na-panel-footer">Active count includes the shared guest demo identity when used.</p>
            </section>
          </div>

          <section className="na-panel na-trades-panel">
            <div className="na-panel-heading na-table-title"><div><h2>Client trading ledger</h2><p>Recent trades with recorded outcome and exposure</p></div><span className="na-count">{data?.trades.total ?? "—"} matching trades</span></div>
            <div className="na-table-controls">
              <form onSubmit={e => {e.preventDefault();setSearch(searchInput.trim());setPage(1);}} className="na-search">
                <Search size={17}/><input aria-label="Search trades, assets or clients" placeholder="Search trade ID, asset or client…" value={searchInput} onChange={e=>setSearchInput(e.target.value)}/><button type="submit">Search</button>
              </form>
              <select value={status} aria-label="Filter trade status" onChange={e=>{setStatus(e.target.value);setPage(1);}}>
                <option value="all">All statuses</option><option value="PENDING">Open / pending</option>
                <option value="WON">Won</option><option value="LOST">Lost</option><option value="DRAW">Draw</option>
              </select>
            </div>
            <div className="na-table-scroll">
              <table className="na-table"><thead><tr><th>CLIENT</th><th>ASSET / TRADE</th><th>DIRECTION</th><th>ACCOUNT</th><th>STAKE</th><th>PAYOUT</th><th>CLIENT P&L</th><th>STATUS</th><th>OPENED (EAT)</th></tr></thead>
                <tbody>
                  {data?.trades.items.map(trade => <tr key={trade.id}>
                    <td><strong>{trade.clientName}</strong><small>{trade.clientEmail || trade.userId.slice(0,13)}</small></td>
                    <td><strong>{trade.asset}</strong><small title={trade.id}>{trade.id.slice(0,11)}…</small></td>
                    <td><span className={"na-side "+(trade.side==="BUY"?"buy":"sell")}>{trade.side==="BUY"?<ArrowUpRight size={14}/>:<ArrowDownRight size={14}/>} {trade.side}</span></td>
                    <td><span className={"na-account-type "+(trade.accountType==="QT Demo"?"demo":"real")}>{trade.accountType==="QT Demo"?"Demo":"Real"}</span></td>
                    <td><strong>{new Intl.NumberFormat("en-US",{maximumFractionDigits:2}).format(trade.stakeAmount)} {trade.currency}</strong><small>{money(trade.stakeUsd)}</small></td>
                    <td>{trade.payoutPercent}%</td>
                    <td className={trade.profitUsd===null?"":trade.profitUsd>=0?"na-positive":"na-negative"}>{trade.profitUsd==null?"—":money(trade.profitUsd)}</td>
                    <td><span className={"na-status "+trade.status.toLowerCase()}>{trade.status}</span></td>
                    <td>{kenyaDate(trade.entryTime)}</td>
                  </tr>)}
                  {!loading && data?.trades.items.length===0 && <tr><td className="na-empty" colSpan={9}>No trades match these filters. Try another account type, status, or search term.</td></tr>}
                  {loading && !data && <tr><td className="na-empty" colSpan={9}>Loading authorized trading records…</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="na-table-footer">
              <span>Page {data?.trades.page ?? page} of {Math.max(1,data?.trades.pages??1)} · {data?.trades.total ?? 0} results</span>
              <div><button disabled={page<=1} onClick={()=>setPage(x=>x-1)}>Previous</button><button disabled={!data||page>=data.trades.pages} onClick={()=>setPage(x=>x+1)}>Next <ArrowRight size={14}/></button></div>
            </div>
          </section>

          <div className="na-disclaimer"><ShieldCheck size={16}/> Read-only trading surveillance. Figures are derived from stored orders; trade outcomes and account balances cannot be altered here.</div>
        </div>
      </section>
    </main>
  );
}
