type EmptyPanel = "openTrades" | "history" | "signals" | null;

type TradingQuickMenuProps = {
  onFullscreen: () => void;
  onPanelOpen: (panel: EmptyPanel) => void;
};

const items: Array<{
  icon: string;
  label: string;
  action?: EmptyPanel | "fullscreen";
}> = [
  { icon: "↻", label: "Open trades", action: "openTrades" },
  { icon: "🕘", label: "History", action: "history" },
  { icon: "📡", label: "Signals", action: "signals" },
  { icon: "👥", label: "Social Trading" },
  { icon: "◎", label: "Express Trades" },
  { icon: "⌨", label: "Hotkeys" },
  { icon: "⛶", label: "Full screen", action: "fullscreen" },
];

export default function TradingQuickMenu({
  onFullscreen,
  onPanelOpen,
}: TradingQuickMenuProps) {
  return (
    <aside className="nt-quick-menu">
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
    </aside>
  );
}