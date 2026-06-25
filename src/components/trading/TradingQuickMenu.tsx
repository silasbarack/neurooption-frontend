import { useNavigate } from "react-router-dom";

type TradingQuickMenuProps = {
  onFullscreen: () => void;
};

const items: Array<{
  icon: string;
  label: string;
  path?: string;
  action?: "fullscreen";
}> = [
  { icon: "↻", label: "Open trades", path: "/open-trades" },
  { icon: "🕘", label: "History", path: "/history" },
  { icon: "📡", label: "Signals", path: "/signals" },
  { icon: "👥", label: "Social Trading", path: "/social-trading" },
  { icon: "◎", label: "Express Trades", path: "/express-trades" },
  { icon: "⌨", label: "Hotkeys" },
  { icon: "⛶", label: "Full screen", action: "fullscreen" },
];

export default function TradingQuickMenu({ onFullscreen }: TradingQuickMenuProps) {
  const navigate = useNavigate();

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

            if (item.path) {
              navigate(item.path);
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
