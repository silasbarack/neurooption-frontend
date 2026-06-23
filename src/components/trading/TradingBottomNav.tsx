type EmptyPanel = "openTrades" | "history" | "signals" | null;

type TradingBottomNavProps = {
  onPanelOpen: (panel: EmptyPanel) => void;
  onFullscreen: () => void;
};

const items: Array<{
  icon: string;
  label: string;
  action?: EmptyPanel | "fullscreen";
}> = [
  { icon: "↻", label: "Open", action: "openTrades" },
  { icon: "🕘", label: "History", action: "history" },
  { icon: "📡", label: "Signals", action: "signals" },
  { icon: "👥", label: "Social" },
  { icon: "◎", label: "Express" },
  { icon: "⌨", label: "Hotkeys" },
  { icon: "⛶", label: "Full screen", action: "fullscreen" },
];

export default function TradingBottomNav({
  onPanelOpen,
  onFullscreen,
}: TradingBottomNavProps) {
  return (
    <nav className="nt-bottom-nav">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => {
            if (item.action === "fullscreen") {
              onFullscreen();
              return;
            }

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
