type StatCardTone = "default" | "success" | "danger" | "warning";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  tone?: StatCardTone;
};

export default function StatCard({ label, value, hint, tone = "default" }: StatCardProps) {
  const toneClass = tone !== "default" ? ` np-tone-${tone}` : "";

  return (
    <div className={`np-stat-card${toneClass}`}>
      <div className="np-stat-card-label">{label}</div>
      <div className="np-stat-card-value">{value}</div>
      {hint && <div className="np-stat-card-hint">{hint}</div>}
    </div>
  );
}
