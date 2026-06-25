import { useNavigate } from "react-router-dom";

type TradingBottomNavProps = {
  onFullscreen: () => void;
};

const items: Array<{
  icon: string;
  label: string;
  path?: string;
  action?: "fullscreen";
}> = [
  { icon: "↻", label: "Open", path: "/open-trades" },
  { icon: "🕘", label: "History", path: "/history" },
  { icon: "📡", label: "Signals", path: "/signals" },
  { icon: "👥", label: "Social", path: "/social-trading" },
  { icon: "◎", label: "Express", path: "/express-trades" },
  { icon: "⌨", label: "Hotkeys" },
  { icon: "⛶", label: "Full screen", action: "fullscreen" },
];

export default function TradingBottomNav({ onFullscreen }: TradingBottomNavProps) {
  const navigate = useNavigate();

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

            if (item.path) {
              navigate(item.path);
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
