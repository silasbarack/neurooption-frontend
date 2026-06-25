import { PageHeader, StatCard, StatusBadge } from "../components/common";
import { MOCK_ACHIEVEMENTS } from "../data/mockData";

export default function AchievementsPage() {
  const unlockedCount = MOCK_ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const totalProgress = Math.round(
    MOCK_ACHIEVEMENTS.reduce((sum, a) => sum + a.progress, 0) / MOCK_ACHIEVEMENTS.length
  );

  return (
    <main className="np-page">
      <div className="np-container">
        <PageHeader title="Achievements" subtitle="Trading milestones, badges, and rewards." />

        <section className="np-section np-grid np-grid-3">
          <StatCard label="Unlocked" value={`${unlockedCount} / ${MOCK_ACHIEVEMENTS.length}`} hint="Badges earned" tone="success" />
          <StatCard label="Overall Progress" value={`${totalProgress}%`} hint="Across all achievements" />
          <StatCard label="Next Reward" value="Weekly Streak" hint="57% complete" tone="warning" />
        </section>

        <section className="np-section np-grid np-grid-3">
          {MOCK_ACHIEVEMENTS.map((achievement) => (
            <div
              key={achievement.id}
              className="np-card"
              style={{ opacity: achievement.unlocked ? 1 : 0.75 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 30 }}>{achievement.icon}</div>
                <StatusBadge tone={achievement.unlocked ? "success" : "neutral"}>
                  {achievement.unlocked ? "Unlocked" : "Locked"}
                </StatusBadge>
              </div>

              <div style={{ fontWeight: 800, marginTop: 10 }}>{achievement.title}</div>
              <div className="np-text-muted" style={{ fontSize: 13, marginBottom: 12 }}>
                {achievement.description}
              </div>

              <div className="np-progress">
                <div className="np-progress-fill" style={{ width: `${achievement.progress}%` }} />
              </div>
              <div className="np-text-muted" style={{ fontSize: 12, marginTop: 6, textAlign: "right" }}>
                {achievement.progress}%
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
