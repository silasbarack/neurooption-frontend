type EmptyPanel = "openTrades" | "history" | "signals" | null;

type TradingBottomNavProps = {
  onPanelOpen: (panel: EmptyPanel) => void;
};

const items: Array<{
  icon: string;
  label: string;
  action: EmptyPanel;
}> = [
  { icon: "↻", label: "Open", action: "openTrades" },
  { icon: "🕘", label: "History", action: "history" },
  { icon: "📡", label: "Signals", action: "signals" },
  { icon: "👥", label: "Social", action: null },
  { icon: "◎", label: "Express", action: null },
];

export default function TradingBottomNav({ onPanelOpen }: TradingBottomNavProps) {
  return (
    <nav className="nt-bottom-nav">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => {
            if (item.action) {
              onPanelOpen(item.action);
            }
          }}
        >
          <span>{item.icon}</span>
          <small>{item.label}</small>
        </button>
      ))}
    </nav>
  );
}