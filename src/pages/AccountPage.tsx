import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  Fingerprint,
  Settings,
  ShieldCheck,
  Trophy,
  Award,
} from "lucide-react";

import AppShell from "../components/shell/AppShell";
import Avatar from "../components/shell/Avatar";
import { useAccount } from "../components/shell/useAccount";
import { convertFromUsd, convertToUsd, formatCurrency } from "../utils/currency";
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

const KYC_LABEL: Record<string, string> = {
  APPROVED: "Verified",
  PENDING: "Under review",
  REJECTED: "Verification failed",
  NOT_SUBMITTED: "Not verified",
};

export default function AccountPage() {
  const { account, error, displayName } = useAccount();
  const [mode, setMode] = useState<Mode>("real");
  const [hidden, setHidden] = useState(false);

  const mask = (text: string) => (hidden ? "••••••" : text);

  const main =
    mode === "real"
      ? formatCurrency(account?.real.balance ?? 0, "KES")
      : formatCurrency(account?.demo.balance ?? 0, "USD");
  const secondary =
    mode === "real"
      ? `≈ ${formatCurrency(convertToUsd(account?.real.balance ?? 0, "KES"), "USD")}`
      : `≈ ${formatCurrency(convertFromUsd(account?.demo.balance ?? 0, "KES"), "KES")}`;

  const completion = account?.profile.completion ?? 0;
  const nextStep = account?.profile.checklist.find((item) => !item.done);

  return (
    <AppShell title="My Account">
      <div className="ac">
        <section className="ac-col">
          <h1 className="ac-title">My Account</h1>

          <Link to="/settings" className="ac-user neo-card">
            <Avatar name={displayName} size={56} />
            <span className="ac-user-text">
              <b>{displayName}</b>
              {account ? (
                <span className={`neo-badge ${account.verified ? "neo-badge-green" : "neo-badge-muted"}`}>
                  {account.verified && <BadgeCheck size={12} aria-hidden="true" />}
                  {KYC_LABEL[account.kycStatus] ?? "Not verified"}
                </span>
              ) : (
                <span className="neo-skeleton" style={{ width: 80, height: 18 }} />
              )}
              <small>ID: {account?.accountNumber ?? "—"}</small>
            </span>
            <ChevronRight size={18} className="ac-chev" aria-hidden="true" />
          </Link>

          {error && <p className="ac-error">{error}</p>}

          <div className="ac-switch" role="tablist" aria-label="Account">
            {(["real", "demo"] as Mode[]).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                className={mode === value ? "is-active" : ""}
                onClick={() => setMode(value)}
              >
                {value === "real" ? "Real" : "Demo"}
              </button>
            ))}
          </div>

          <div className="ac-balance neo-card">
            <div className="ac-balance-head">
              <span>{mode === "real" ? "Real balance" : "Demo balance"}</span>
              <button type="button" onClick={() => setHidden((value) => !value)} aria-label={hidden ? "Show balance" : "Hide balance"}>
                {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {account ? (
              <>
                <strong>{mask(main)}</strong>
                <small>{mask(secondary)}</small>
              </>
            ) : (
              <>
                <span className="neo-skeleton" style={{ width: 200, height: 34 }} />
                <span className="neo-skeleton" style={{ width: 120, height: 14, marginTop: 8 }} />
              </>
            )}
          </div>

          {mode === "real" ? (
            <div className="ac-actions">
              <Link to="/finance" className="neo-btn neo-btn-gold neo-btn-lg">
                Deposit
              </Link>
              <Link to="/finance?tab=withdraw" className="neo-btn neo-btn-outline neo-btn-lg">
                Withdraw
              </Link>
            </div>
          ) : (
            <div className="ac-actions">
              <Link to="/trading" className="neo-btn neo-btn-gold neo-btn-lg">
                Practise now
              </Link>
              <Link to="/finance" className="neo-btn neo-btn-outline neo-btn-lg">
                Go real
              </Link>
            </div>
          )}
        </section>

        <section className="ac-col">
          <div className="ac-tiles">
            {TILES.map(({ label, to, icon: Icon }) => (
              <Link key={label} to={to} className="ac-tile neo-card">
                <Icon size={24} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <Link to="/settings" className="ac-progress neo-card">
            <span className="ac-progress-icon">
              <ShieldCheck size={20} aria-hidden="true" />
            </span>
            <span className="ac-progress-text">
              <b>{completion >= 100 ? "Your profile is complete" : "Complete your profile"}</b>
              <small>
                {completion >= 100
                  ? "Your account is verified and ready for withdrawals."
                  : `Next: ${nextStep?.label.toLowerCase() ?? "verify your identity"} to unlock all features.`}
              </small>
            </span>
            <ChevronRight size={18} className="ac-chev" aria-hidden="true" />
            <span className="ac-progress-bar" aria-label={`Profile ${completion}% complete`}>
              <i style={{ width: `${completion}%` }} />
            </span>
            <em>{completion}%</em>
          </Link>

          {account && (
            <dl className="ac-details neo-card">
              <div>
                <dt>Email</dt>
                <dd>{account.email}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{account.phone || "Not added"}</dd>
              </div>
              <div>
                <dt>Member since</dt>
                <dd>{new Date(account.memberSince).toLocaleDateString("en-KE", { month: "long", year: "numeric" })}</dd>
              </div>
            </dl>
          )}
        </section>
      </div>
    </AppShell>
  );
}
