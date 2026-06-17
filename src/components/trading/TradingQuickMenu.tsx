type TradingQuickMenuProps = {
  onFullscreen: () => void;
};

const items = [
  ["↻", "Trades"],
  ["📡", "Signals"],
  ["👥", "Social Trading"],
  ["◎", "Express Trades"],
  ["⏳", "Pending Trades"],
  ["⌨", "Hotkeys"],
  ["⛶", "Full Screen"],
];

export default function TradingQuickMenu({ onFullscreen }: TradingQuickMenuProps) {
  return (
    <aside className="nt-quick-menu">
      {items.map(([icon, label]) => (
        <button
          key={label}
          type="button"
          className={label === "Hotkeys" || label === "Full Screen" ? "desktop-only" : ""}
          onClick={label === "Full Screen" ? onFullscreen : undefined}
        >
          <span>{icon}</span>
          <small>{label}</small>
        </button>
      ))}
    </aside>
  );
}