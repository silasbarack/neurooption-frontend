import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, StatusBadge } from "../components/common";
import { CURRENCIES } from "../components/trading";
import type { Currency } from "../components/trading";

type StoredUser = {
  id?: string;
  email?: string;
  fullName?: string;
  country?: string;
};

const MOCK_LOGIN_ACTIVITY = [
  { id: "log-1", device: "Chrome on Windows", location: "Nairobi, KE", time: "Today, 09:12" },
  { id: "log-2", device: "NeuroOption Android App", location: "Nairobi, KE", time: "Yesterday, 21:40" },
  { id: "log-3", device: "Chrome on Windows", location: "Nairobi, KE", time: "3 days ago, 14:05" },
];

export default function ProfilePage() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("neurooption_user");
  const initialUser: StoredUser | null = storedUser ? JSON.parse(storedUser) : null;

  const [fullName, setFullName] = React.useState(initialUser?.fullName || "");
  const [email, setEmail] = React.useState(initialUser?.email || "");
  const [country, setCountry] = React.useState(initialUser?.country || "Kenya");
  const [accountType, setAccountType] = React.useState<"QT Demo" | "QT Real">("QT Demo");
  const [currency, setCurrency] = React.useState<Currency>("USD");
  const [saved, setSaved] = React.useState(false);
  const [kycStatus, setKycStatus] = React.useState<"Not Verified" | "Pending Review">("Not Verified");

  const accountId = initialUser?.id || "—";
  const initials = (fullName || "NeuroOption User")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleLogout() {
    localStorage.removeItem("neurooption_token");
    localStorage.removeItem("neurooption_user");
    navigate("/login", { replace: true });
  }

  function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault();

    const updated: StoredUser = { ...initialUser, fullName, email, country };
    localStorage.setItem("neurooption_user", JSON.stringify(updated));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <main className="np-page">
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

          <div className="np-card">
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
              disabled={kycStatus === "Pending Review"}
              onClick={() => setKycStatus("Pending Review")}
            >
              {kycStatus === "Pending Review" ? "Submitted for Review" : "Start Verification"}
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
                <label htmlFor="country">Country</label>
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
              <button type="submit" className="np-btn np-btn-success">
                Save Changes
              </button>
              {saved && <span className="np-text-success" style={{ fontSize: 13 }}>Saved!</span>}
            </div>
          </form>
        </section>

        <section className="np-section np-grid np-grid-2">
          <div className="np-card">
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
            <h3 className="np-card-title">Recent Login Activity</h3>

            <div style={{ display: "grid", gap: 10 }}>
              {MOCK_LOGIN_ACTIVITY.map((entry) => (
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
    </main>
  );
}
