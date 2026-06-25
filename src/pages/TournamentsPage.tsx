import React from "react";
import { PageHeader, StatusBadge, EmptyState } from "../components/common";
import type { BadgeTone } from "../components/common";
import { MOCK_TOURNAMENTS, MOCK_LEADERBOARD, type TournamentStatus } from "../data/mockData";

const STATUS_TONE: Record<TournamentStatus, BadgeTone> = {
  active: "success",
  upcoming: "info",
  completed: "neutral",
};

const TABS: Array<{ id: TournamentStatus; label: string }> = [
  { id: "active", label: "Active" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
];

function formatDateRange(start: string, end: string) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function TournamentsPage() {
  const [tab, setTab] = React.useState<TournamentStatus>("active");

  const tournaments = MOCK_TOURNAMENTS.filter((t) => t.status === tab);

  return (
    <main className="np-page">
      <div className="np-container">
        <PageHeader title="Tournaments" subtitle="Compete against other traders for cash prizes." />

        <div className="np-tabs">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`np-tab ${tab === item.id ? "active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <section className="np-section">
          {tournaments.length === 0 ? (
            <EmptyState icon="🏆" title={`No ${tab} tournaments`} description="Check back soon for new tournaments." />
          ) : (
            <div className="np-grid np-grid-2">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="np-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{tournament.name}</div>
                    <StatusBadge tone={STATUS_TONE[tournament.status]}>{tournament.status}</StatusBadge>
                  </div>

                  <div className="np-text-muted" style={{ fontSize: 13, margin: "6px 0 14px" }}>
                    {formatDateRange(tournament.startTime, tournament.endTime)}
                  </div>

                  <div className="np-grid np-grid-3" style={{ gap: 10, marginBottom: 14 }}>
                    <div>
                      <div className="np-text-muted" style={{ fontSize: 11 }}>
                        Prize Pool
                      </div>
                      <div style={{ fontWeight: 800 }}>${tournament.prizePool.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="np-text-muted" style={{ fontSize: 11 }}>
                        Entry Fee
                      </div>
                      <div style={{ fontWeight: 800 }}>
                        {tournament.entryFee === 0 ? "Free" : `$${tournament.entryFee}`}
                      </div>
                    </div>
                    <div>
                      <div className="np-text-muted" style={{ fontSize: 11 }}>
                        Participants
                      </div>
                      <div style={{ fontWeight: 800 }}>{tournament.participants}</div>
                    </div>
                  </div>

                  <button type="button" className="np-btn np-btn-primary" disabled={tournament.status === "completed"}>
                    {tournament.status === "completed" ? "Finished" : tournament.status === "active" ? "Join Now" : "Register"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="np-section">
          <div className="np-section-head">
            <h2>Leaderboard Preview</h2>
            <span className="np-text-muted" style={{ fontSize: 12 }}>
              Weekend Sprint
            </span>
          </div>

          <div className="np-table-wrap">
            <table className="np-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Trader</th>
                  <th style={{ textAlign: "right" }}>Profit</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEADERBOARD.map((entry) => (
                  <tr key={entry.rank}>
                    <td>#{entry.rank}</td>
                    <td style={{ fontWeight: 700 }}>{entry.name}</td>
                    <td style={{ textAlign: "right" }} className="np-text-success">
                      +${entry.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
