import React from "react";

export type TradeOutcome = "won" | "lost" | "draw";

export type TradeResultPopupItem = {
  id: string;
  outcome: TradeOutcome;
  side: string;
  asset: string;
  amountText: string;
};

type TradeResultPopupProps = {
  items: TradeResultPopupItem[];
  onDismiss: (id: string) => void;
};

const DISPLAY_MS = 10000;

const OUTCOME_ICON: Record<TradeOutcome, string> = {
  won: "✓",
  lost: "✕",
  draw: "↔",
};

const OUTCOME_LABEL: Record<TradeOutcome, string> = {
  won: "WON",
  lost: "LOST",
  draw: "DRAW",
};

function ResultToast({
  item,
  onDismiss,
}: {
  item: TradeResultPopupItem;
  onDismiss: (id: string) => void;
}) {
  React.useEffect(() => {
    const timerId = window.setTimeout(() => onDismiss(item.id), DISPLAY_MS);
    return () => window.clearTimeout(timerId);
  }, [item.id, onDismiss]);

  return (
    <div className={`nt-result-toast nt-result-toast-${item.outcome}`}>
      <span className="nt-result-toast-icon">{OUTCOME_ICON[item.outcome]}</span>
      <span className="nt-result-toast-outcome">{OUTCOME_LABEL[item.outcome]}</span>
      <span className="nt-result-toast-meta">
        {item.side} {item.asset}
      </span>
      <span className="nt-result-toast-amount">{item.amountText}</span>
    </div>
  );
}

export default function TradeResultPopup({ items, onDismiss }: TradeResultPopupProps) {
  if (items.length === 0) return null;

  return (
    <div className="nt-result-toast-stack">
      {items.map((item) => (
        <ResultToast key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
