import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight, BadgeCheck, Banknote, CandlestickChart, CircleAlert, Eye, EyeOff, LayoutDashboard,
  LifeBuoy, LockKeyhole, LogOut, Mail, Menu, ScrollText, ShieldCheck, UserCog, Users, X,
} from "lucide-react";
import Logo from "../components/branding/Logo";
import AdminSetupPage from "./AdminSetupPage";
import { SESSION_KEY, SessionContext, adminRequest, initials, label } from "./admin/api";
import type { Admin, ApiError, Area } from "./admin/api";
import OverviewView from "./admin/OverviewView";
import UsersView from "./admin/UsersView";
import KycView from "./admin/KycView";
import FinanceView from "./admin/FinanceView";
import TradingView from "./admin/TradingView";
import SupportView from "./admin/SupportView";
import AuditView from "./admin/AuditView";
import TeamView from "./admin/TeamView";
import EmailsView from "./admin/EmailsView";
import "./admin/AdminConsole.css";

type NavItem = { area: Area; text: string; icon: ReactNode; group: "Operations" | "Compliance" | "Administration" };

const NAV: NavItem[] = [
  { area: "overview", text: "Overview", icon: <LayoutDashboard size={18} />, group: "Operations" },
  { area: "users", text: "Clients", icon: <Users size={18} />, group: "Operations" },
  { area: "trading", text: "Trading monitor", icon: <CandlestickChart size={18} />, group: "Operations" },
  { area: "finance", text: "Payments", icon: <Banknote size={18} />, group: "Operations" },
  { area: "support", text: "Support", icon: <LifeBuoy size={18} />, group: "Operations" },
  { area: "emails", text: "Email delivery", icon: <Mail size={18} />, group: "Operations" },
  { area: "kyc", text: "Verification", icon: <BadgeCheck size={18} />, group: "Compliance" },
  { area: "audit", text: "Audit log", icon: <ScrollText size={18} />, group: "Compliance" },
  { area: "team", text: "Team & roles", icon: <UserCog size={18} />, group: "Administration" },
];

function areaFromHash(): Area | null {
  const value = window.location.hash.replace("#", "");
  return NAV.some((item) => item.area === value) ? (value as Area) : null;
}

export default function AdminPage() {
  const location = useLocation();
  const [showSetup, setShowSetup] = useState(false);
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_KEY) || "");
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [permissions, setPermissions] = useState<Area[]>([]);
  const [authError, setAuthError] = useState("");
  const [area, setArea] = useState<Area>(() => areaFromHash() ?? "overview");
  const [menuOpen, setMenuOpen] = useState(false);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setToken("");
    setAdmin(null);
    setPermissions([]);
  }, []);

  const onExpired = useCallback(() => {
    signOut();
    setAuthError("Your session expired. Please sign in again.");
  }, [signOut]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    adminRequest<{ admin: Admin; permissions?: Area[] }>("/admin/session", token)
      .then((result) => {
        if (cancelled) return;
        setAdmin(result.admin);
        setPermissions(result.permissions ?? []);
      })
      .catch((err: ApiError) => { if (!cancelled) { setAuthError(err.message); signOut(); } });
    return () => { cancelled = true; };
  }, [token, signOut]);

  const nav = useMemo(() => NAV.filter((item) => permissions.includes(item.area)), [permissions]);
  const current = nav.some((item) => item.area === area) ? area : nav[0]?.area;

  useEffect(() => {
    const onHash = () => { const next = areaFromHash(); if (next) setArea(next); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = useCallback((next: Area) => {
    setArea(next);
    setMenuOpen(false);
    if (window.location.hash !== `#${next}`) window.history.replaceState(null, "", `#${next}`);
    window.scrollTo({ top: 0 });
  }, []);

  const session = useMemo(() => (admin ? { token, admin, permissions, onExpired } : null), [token, admin, permissions, onExpired]);

  if (showSetup || new URLSearchParams(location.search).get("mode") === "setup") return <AdminSetupPage />;

  if (!session) {
    return <SignIn checking={Boolean(token)} initialError={authError} onSetup={() => setShowSetup(true)} onSignedIn={(t) => { setAuthError(""); setToken(t); }} />;
  }

  const groups = (["Operations", "Compliance", "Administration"] as const).map((g) => [g, nav.filter((item) => item.group === g)] as const).filter(([, items]) => items.length);

  return (
    <SessionContext.Provider value={session}>
      <div className="nx-shell">
        <aside className={`nx-sidebar ${menuOpen ? "is-open" : ""}`} aria-label="Admin navigation">
          <div className="nx-brand">
            <Link to="/" aria-label="NeuroOption home"><Logo variant="emblem" /></Link>
            <div><strong>NeuroOption</strong><small>Admin console</small></div>
            <button type="button" className="nx-icon-btn nx-close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={18} /></button>
          </div>
          <nav>
            {groups.map(([group, items]) => (
              <div key={group} className="nx-nav-group">
                <p>{group}</p>
                {items.map((item) => (
                  <button key={item.area} type="button" className={`nx-nav-item ${current === item.area ? "is-active" : ""}`} aria-current={current === item.area ? "page" : undefined} onClick={() => go(item.area)}>
                    {item.icon}<span>{item.text}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="nx-sidebar-foot">
            <div className="nx-me">
              <span className="nx-avatar is-lg" aria-hidden="true">{initials(session.admin.fullName)}</span>
              <span><strong>{session.admin.fullName}</strong><small>{label(session.admin.role)}</small></span>
            </div>
            <button type="button" className="nx-signout" onClick={signOut}><LogOut size={16} /> Sign out</button>
          </div>
        </aside>
        {menuOpen && <div className="nx-scrim" onClick={() => setMenuOpen(false)} />}

        <div className="nx-main">
          <header className="nx-topbar">
            <button type="button" className="nx-icon-btn nx-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
            <div className="nx-topbar-title">{nav.find((item) => item.area === current)?.text}</div>
            <div className="nx-topbar-right">
              <span className="nx-secure"><ShieldCheck size={15} aria-hidden="true" /> Secure session</span>
              <span className="nx-avatar" title={session.admin.email} aria-hidden="true">{initials(session.admin.fullName)}</span>
            </div>
          </header>
          <main className="nx-content">
            {!current && <p className="nx-muted">Your role has no console areas yet. Ask a Super Administrator to change your role.</p>}
            {current === "overview" && <OverviewView go={go} />}
            {current === "users" && <UsersView />}
            {current === "trading" && <TradingView />}
            {current === "finance" && <FinanceView />}
            {current === "support" && <SupportView />}
            {current === "emails" && <EmailsView />}
            {current === "kyc" && <KycView />}
            {current === "audit" && <AuditView />}
            {current === "team" && <TeamView />}
          </main>
        </div>
      </div>
    </SessionContext.Provider>
  );
}

function SignIn({ checking, initialError, onSetup, onSignedIn }: { checking: boolean; initialError: string; onSetup: () => void; onSignedIn: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const shown = error || initialError;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await adminRequest<{ token: string }>("/admin/login", "", { method: "POST", body: JSON.stringify({ email: email.trim().toLowerCase(), password }) });
      if (!result.token) throw new Error("No administrator session returned.");
      sessionStorage.setItem(SESSION_KEY, result.token);
      setPassword("");
      onSignedIn(result.token);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="nx-auth">
      <section className="nx-auth-art" aria-hidden="true">
        <div className="nx-auth-brand"><Logo variant="emblem" /><span>NeuroOption</span></div>
        <div>
          <p className="nx-eyebrow">ADMIN CONSOLE</p>
          <h2>Run the platform with clarity.</h2>
          <ul>
            <li><Users size={16} /> Clients, verification and support in one place</li>
            <li><CandlestickChart size={16} /> Live trading and payment surveillance</li>
            <li><ScrollText size={16} /> Every sensitive action audited</li>
          </ul>
        </div>
        <small>Restricted to authorized NeuroOption staff.</small>
      </section>
      <section className="nx-auth-card">
        <div className="nx-auth-icon"><LockKeyhole size={22} aria-hidden="true" /></div>
        <h1>Administrator sign in</h1>
        <p className="nx-muted">Use your administrator email and password. Client accounts cannot sign in here.</p>
        {checking ? <p className="nx-loading" role="status">Checking your session…</p> : (
          <form className="nx-form" onSubmit={submit}>
            {shown && <p className="nx-alert" role="alert"><CircleAlert size={16} aria-hidden="true" /> {shown}</p>}
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required placeholder="you@neurooption.com" /></label>
            <label>Password
              <span className="nx-password"><input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></span>
            </label>
            <button type="submit" className="nx-btn nx-btn-primary nx-btn-block" disabled={busy}>{busy ? "Signing in…" : "Sign in"} <ArrowRight size={16} aria-hidden="true" /></button>
          </form>
        )}
        <button type="button" className="nx-link nx-setup-link" onClick={onSetup}>First-time setup or forgotten Super Administrator password →</button>
        <Link to="/" className="nx-back-home">← Back to NeuroOption</Link>
      </section>
    </main>
  );
}
