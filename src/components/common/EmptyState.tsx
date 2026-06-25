import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function EmptyState({ icon = "📭", title, description, action }: EmptyStateProps) {
  return (
    <div className="np-empty">
      <div className="np-empty-icon">{icon}</div>
      <div className="np-empty-title">{title}</div>
      {description && <p className="np-empty-desc">{description}</p>}
      {action}
    </div>
  );
}
