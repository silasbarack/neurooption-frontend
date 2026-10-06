import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, StatusBadge } from "../components/common";
import { CURRENCIES } from "../components/trading";
import type { Currency } from "../components/trading";
import { usersApi } from "../api";
import { useAccount } from "../components/shell/useAccount";
import { getUser, saveUser, clearToken, clearUser } from "../utils/storage";

type StoredUser = {
  id?: string;
  email?: string;
  fullName?: string;
  country?: string;
};

const SAMPLE_LOGIN_ACTIVITY = [
  { id: "log-1", device: "Chrome on Windows", location: "Nairobi, KE", time: "Today, 09:12" },
  { id: "log-2", device: "NeuroOption Android App", location: "Nairobi, KE", time: "Yesterday, 21:40" },
  { id: "log-3", device: "Chrome on Windows", location: "Nairobi, KE", time: "3 days ago, 14:05" },
];

export default function ProfilePage() {
  const navigate = useNavigate();

  const initialUser = getUser() as StoredUser | null;
  const { account, reload } = useAccount();

  const [fullNameDraft, setFullName] = React.useState<string | null>(null);
  const [emailDraft, setEmail] = React.useState<string | null>(null);
  const fullName = fullNameDraft ?? account?.fullName ?? initialUser?.fullName ?? "";
  const email = emailDraft ?? account?.email ?? initialUser?.email ?? "";
  const [country, setCountry] = React.useState(localStorage.getItem("neurooption_country_preference") || initialUser?.country || "");
  const [accountType, setAccountType] = React.useState<"QT Demo" | "QT Real">("QT Demo");
  const [currency, setCurrency] = React.useState<Currency>("USD");
  const [saved, setSaved] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState("");
  const kycStatus = !account ? "Unavailable" : account.kycStatus === "APPROVED" ? "Verified" : account.kycStatus === "PENDING" ? "Pending Review" : account.kycStatus === "REJECTED" ? "Review Required" : "Not Verified";

  const accountId = account?.accountNumber || account?.id || initialUser?.id || "—";
  const initials = (fullName || "NeuroOption User")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleLogout() {
    clearToken();
    clearUser();
    navigate("/login", { replace: true });
  }

  async function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault();
    setSaved(false); setSaveError(""); setSaving(true);
    try {
      const updated = await usersApi.updateProfile({ fullName, email });
      setFullName(updated.fullName || fullName); setEmail(updated.email || email);
      const stored = getUser();
      if (stored) saveUser({ ...stored, fullName: updated.fullName || fullName, email: updated.email });
      try { if (country) localStorage.setItem("neurooption_country_preference", country); } catch { /* The account update succeeded; local preferences are optional. */ }
      setSaved(true);
      await reload();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save your profile.");
    } finally { setSaving(false); }
  }

  return (
    <section className="np-page" aria-label="Profile settings">
      <div className="np-container">
        <PageHeader title="Profile" subtitle="Manage your account details, preferences, and security." />

        <section className="np-section np-card" style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <div className="np-avatar" style={{ width: 72, height: 72, fontSize: 24 }}>
            {initials}
          </div>

          <div style={{ flex: "1 1 220px" }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{fullName || "NeuroOption User"}</div>
            <div className="np-text-muted" style={{ fontSize: 13.5 }}>
              {email || "No email found"}
            </div>
            <div className="np-text-muted" style={{ fontSize: 12.5, marginTop: 4 }}>
              Account ID: {accountId}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <StatusBadge tone={kycStatus === "Pending Review" ? "info" : "warning"}>KYC {kycStatus}</StatusBadge>
            <StatusBadge tone="info">{accountType}</StatusBadge>
          </div>
        </section>

        <section className="np-section np-grid np-grid-2">
          <div className="np-card">
            <h3 className="np-card-title">Account Preferences</h3>

            <div className="np-field">
              <label htmlFor="account-type">Account Type</label>
              <select
                id="account-type"
                className="np-select"
                value={accountType}
                onChange={(event) => setAccountType(event.target.value as "QT Demo" | "QT Real")}
              >
                <option value="QT Demo">QT Demo</option>
                <option value="QT Real">QT Real</option>
              </select>
            </div>

            <div className="np-field">
              <label htmlFor="currency">Preferred Currency</label>
              <select
                id="currency"
                className="np-select"
                value={currency}
                onChange={(event) => setCurrency(event.target.value as Currency)}
              >
                {CURRENCIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="np-card" id="verification">
            <h3 className="np-card-title">Verification</h3>
            <p className="np-card-subtitle">
              Verify your identity to unlock higher withdrawal limits.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <StatusBadge tone={kycStatus === "Pending Review" ? "info" : "warning"}>{kycStatus}</StatusBadge>
            </div>
            <button
              type="button"
              className="np-btn np-btn-primary"
              style={{ marginTop: 16 }}
              disabled
              title="Identity submission is not available in this frontend yet"
            >
              {kycStatus === "Verified" ? "Identity Verified" : kycStatus === "Pending Review" ? "Under Review" : "Verification Submission Unavailable"}
            </button>
          </div>
        </section>

        <section className="np-section np-card">
          <h3 className="np-card-title">Edit Profile</h3>

          <form onSubmit={handleSaveProfile}>
            <div className="np-grid np-grid-2">
              <div className="np-field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  className="np-input"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="np-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="np-input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="np-field">
                <label htmlFor="country">Country (local preference)</label>
                <input
                  id="country"
                  className="np-input"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button type="submit" className="np-btn np-btn-success" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
              {saved && <span className="np-text-success" role="status" style={{ fontSize: 13 }}>Saved to your account.</span>}
              {saveError && <span className="np-text-danger" role="alert" style={{ fontSize: 13 }}>{saveError}</span>}
            </div>
          </form>
        </section>

        <section className="np-section np-grid np-grid-2">
          <div className="np-card" id="security">
            <h3 className="np-card-title">Security</h3>

            <div style={{ display: "grid", gap: 12 }}>
              <Link to="/forgot-password" className="np-btn np-btn-ghost" style={{ justifyContent: "flex-start" }}>
                🔑 Change Password
              </Link>

              <div className="np-btn np-btn-ghost" style={{ justifyContent: "space-between", cursor: "default" }}>
                <span>🛡️ Two-Factor Authentication</span>
                <StatusBadge tone="neutral">Coming soon</StatusBadge>
              </div>
            </div>
          </div>

          <div className="np-card">
            <h3 className="np-card-title">Login Activity Preview</h3>
            <p className="np-card-subtitle">Illustrative examples. Live security history is not available yet.</p>

            <div style={{ display: "grid", gap: 10 }}>
              {SAMPLE_LOGIN_ACTIVITY.map((entry) => (
                <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{entry.device}</div>
                    <div className="np-text-muted">{entry.location}</div>
                  </div>
                  <div className="np-text-muted" style={{ whiteSpace: "nowrap" }}>
                    {entry.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="np-section" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/delete-account" className="np-btn np-btn-danger">
            Delete Account
          </Link>
          <button type="button" className="np-btn" onClick={handleLogout}>
            Logout
          </button>
        </section>
      </div>
    </section>
  );
}
