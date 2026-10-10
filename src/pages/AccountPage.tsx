import { useState } from "react";
import { authApi } from "../api/auth.api";
import { Link } from "react-router-dom";
import { ArrowDownToLine, ArrowUpFromLine, Award, BadgeCheck, ChevronRight, Eye, EyeOff, FileText, Fingerprint, Settings, ShieldCheck, Trophy, Wallet } from "lucide-react";
import AppShell from "../components/shell/AppShell";
import Avatar from "../components/shell/Avatar";
import { useAccount } from "../components/shell/useAccount";
import { LOCAL_EXCHANGE_RATES, convertToUsd, formatCurrency } from "../utils/currency";
import type { AccountCurrency } from "../types/auth.types";
import "./AccountPage.css";
type Mode = "real" | "demo";
const TILES = [
  { label: "Transactions", to: "/finance?tab=history", icon: FileText },
  { label: "KYC", to: "/settings#verification", icon: Fingerprint },
  { label: "Security", to: "/settings#security", icon: ShieldCheck },
  { label: "Achievements", to: "/achievements", icon: Award },
  { label: "Tournaments", to: "/tournaments", icon: Trophy },
  { label: "Settings", to: "/settings", icon: Settings },
];
const KYC_LABEL: Record<string, string> = { APPROVED: "Verified", PENDING: "Under review", REJECTED: "Verification failed", NOT_SUBMITTED: "Not verified" };
function formatAccountMoney(balance: number, currency: string) {
  try { return new Intl.NumberFormat("en-US", {style:"currency",currency,maximumFractionDigits:2}).format(balance); }
  catch { return currency+" "+balance.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}); }
}
export default function AccountPage() {
  const { account, error, displayName } = useAccount();
  const [mode, setMode] = useState<Mode>("real");
  const [hidden, setHidden] = useState(false);
  const [welcomeStatus, setWelcomeStatus] = useState("");
  const [resendingWelcome, setResendingWelcome] = useState(false);
  async function resendWelcome() {
    setResendingWelcome(true);
    setWelcomeStatus("");
    try {
      const response = await authApi.resendWelcomeEmail();
      setWelcomeStatus(response.message);
    } catch (error) {
      setWelcomeStatus(error instanceof Error ? error.message : "Unable to send the welcome email.");
    } finally {
      setResendingWelcome(false);
    }
  }
  const mask = (text: string) => (hidden ? "••••••" : text);
  const selected = account?.[mode];
  const balanceValid = typeof selected?.balance === "number" && Number.isFinite(selected.balance) && selected.balance >= 0;
  const main = selected && balanceValid ? formatAccountMoney(selected.balance, selected.currency) : "Balance unavailable";
  const supportedCurrency = selected && Object.hasOwn(LOCAL_EXCHANGE_RATES,selected.currency) ? selected.currency as AccountCurrency : null;
  const secondary = selected && balanceValid && supportedCurrency && supportedCurrency!=="USD" ? "≈ "+formatCurrency(convertToUsd(selected.balance,supportedCurrency),"USD") : "";
  const completion = Math.max(0, Math.min(100, account?.profile.completion ?? 0));
  const nextStep = account?.profile.checklist.find((item) => !item.done);
  return <AppShell title="My Account"><div className="ac">
    <header className="ac-heading"><span className="ac-eyebrow">YOUR PERSONAL SPACE</span><h1 className="ac-title">My Account</h1><p>Everything you need to manage your account.</p></header>
    <section className="ac-col" aria-label="Profile and balance">
      <Link to="/settings" className="ac-user neo-card">
        <span className="ac-avatar-wrap"><Avatar name={displayName} size={62} />{account?.verified && <span className="ac-avatar-verified"><BadgeCheck size={15} aria-hidden="true" /></span>}</span>
        <span className="ac-user-text"><b>{displayName}</b>{account ? <span className={"neo-badge "+(account.verified ? "neo-badge-green" : "neo-badge-muted")}>{account.verified && <BadgeCheck size={12} aria-hidden="true" />}{KYC_LABEL[account.kycStatus] ?? "Not verified"}</span> : <span className="neo-skeleton" style={{ width: 80, height: 18 }} />}<small>User ID <span>{account?.accountNumber ?? "—"}</span></small></span><ChevronRight size={18} className="ac-chev" aria-hidden="true" />
      </Link>
      {error && <p className="ac-error" role="alert">{error}</p>}
      <section className="ac-wallet neo-card" aria-label={mode === "real" ? "Real account" : "Demo account"}>
        <div className="ac-switch" role="tablist" aria-label="Account type">{(["real", "demo"] as Mode[]).map(value => <button key={value} id={"ac-tab-"+value} type="button" role="tab" aria-selected={mode === value} aria-controls="ac-balance-panel" tabIndex={mode===value?0:-1} className={mode === value ? "is-active" : ""} onClick={() => setMode(value)} onKeyDown={event=>{if(["ArrowLeft","ArrowRight","Home","End"].includes(event.key)){event.preventDefault();const next=event.key==="Home"?"real":event.key==="End"?"demo":mode==="real"?"demo":"real";setMode(next);document.getElementById("ac-tab-"+next)?.focus();}}}><span className={"ac-mode-dot is-"+value} />{value === "real" ? "Real account" : "Demo account"}</button>)}</div>
        <div className="ac-balance" id="ac-balance-panel" role="tabpanel" aria-labelledby={"ac-tab-"+mode}>
          <div className="ac-balance-head"><span><Wallet size={14} aria-hidden="true" /> Total balance</span><button type="button" onClick={() => setHidden(value => !value)} aria-label={hidden ? "Show balance" : "Hide balance"} aria-pressed={hidden}>{hidden ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
          {account ? <><strong>{mask(main)}</strong>{secondary && <small>{mask(secondary)} <span>estimated equivalent</span></small>}</> : error ? <strong className="ac-balance-unavailable">Balance unavailable</strong> : <div className="ac-balance-loading" role="status" aria-label="Loading balance"><span className="neo-skeleton" style={{ width: "75%", height: 38 }} /><span className="neo-skeleton" style={{ width: "45%", height: 14 }} /></div>}
          {mode === "real" ? <div className="ac-actions"><Link to="/finance" className="neo-btn neo-btn-primary neo-btn-lg"><ArrowDownToLine size={17} aria-hidden="true" /> Deposit</Link><Link to="/finance?tab=withdraw" className="neo-btn neo-btn-outline neo-btn-lg"><ArrowUpFromLine size={17} aria-hidden="true" /> Withdraw</Link></div> : <><div className="ac-actions"><Link to="/trading" className="neo-btn neo-btn-primary neo-btn-lg">Practise now</Link><Link to="/finance" className="neo-btn neo-btn-outline neo-btn-lg">Go real</Link></div><p className="ac-demo-note">Demo funds are for practice and cannot be withdrawn.</p></>}
        </div>
      </section>

    </section>
    <section className="ac-col" aria-label="Account tools"><div className="ac-section-heading"><h2>Account tools</h2><span>Made for your next move</span></div><div className="ac-tiles">{TILES.map(({ label, to, icon: Icon }) => <Link key={label} to={to} className="ac-tile neo-card"><span className="ac-tile-icon"><Icon size={23} strokeWidth={1.6} aria-hidden="true" /></span><span>{label}</span><ChevronRight className="ac-tile-chevron" size={13} aria-hidden="true" /></Link>)}</div>
      <Link to="/settings" className="ac-progress neo-card"><span className="ac-progress-icon"><ShieldCheck size={23} strokeWidth={1.6} aria-hidden="true" /></span><span className="ac-progress-text"><b>{account ? completion >= 100 ? "Your profile is complete" : "Complete your profile" : "Your profile"}</b><small>{account ? completion >= 100 ? "All your profile steps are complete." : "Next step: "+(nextStep?.label ?? "Review your profile")+"." : error ? "Profile status is currently unavailable." : "Loading your profile progress…"}</small></span><ChevronRight size={18} className="ac-chev" aria-hidden="true" />{account ? <><span className="ac-progress-bar" role="progressbar" aria-label="Profile completeness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion}><i style={{ width: completion+"%" }} /></span><em>{completion}%</em></> : !error && <span className="neo-skeleton ac-progress-loading" style={{ height: 6 }} />}</Link>
      {account && <section className="ac-details neo-card" aria-label="Personal information"><h2>Personal information <Link to="/settings">Edit <ChevronRight size={13} aria-hidden="true" /></Link></h2><dl><div><dt>Email address</dt><dd>{account.email}</dd></div><div><dt>Phone number</dt><dd>{account.phone || "Not added"}</dd></div><div><dt>Member since</dt><dd>{new Date(account.memberSince).toLocaleDateString("en-KE", { month: "long", year: "numeric" })}</dd></div></dl></section>}
      <div className="neo-card" style={{ padding: 18, display: "grid", gap: 10 }}><strong>Welcome email</strong><p style={{ margin: 0, fontSize: 13 }}>Did not receive your registration confirmation? Request another copy.</p><button type="button" className="neo-btn neo-btn-outline" onClick={resendWelcome} disabled={resendingWelcome}>{resendingWelcome ? "Sending…" : "Resend welcome email"}</button>{welcomeStatus && <p role="status" style={{ margin: 0, fontSize: 12 }}>{welcomeStatus}</p>}</div>
      <div className="ac-security-note"><ShieldCheck size={16} aria-hidden="true" /><p>Keep your details up to date and review your security settings regularly.</p></div>
    </section>
  </div></AppShell>;
}
