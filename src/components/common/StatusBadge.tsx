import type { ReactNode } from "react";

export type BadgeTone = "success" | "danger" | "warning" | "info" | "neutral";

type StatusBadgeProps = {
  tone: BadgeTone;
  children: ReactNode;
};

export default function StatusBadge({ tone, children }: StatusBadgeProps) {
  return <span className={`np-badge np-badge-${tone}`}>{children}</span>;
}
