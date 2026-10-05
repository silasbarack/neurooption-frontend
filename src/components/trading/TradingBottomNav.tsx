import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  History,
  Keyboard,
  Maximize,
  Radio,
  RefreshCcw,
  Users,
  Zap,
} from "lucide-react";

type TradingBottomNavProps = {
  onFullscreen: () => void;
};

const items: Array<{
  icon: LucideIcon;
  label: string;
  path?: string;
  action?: "fullscreen";
}> = [
  { icon: RefreshCcw, label: "Open", path: "/open-trades" },
  { icon: History, label: "History", path: "/history" },
  { icon: Radio, label: "Signals", path: "/signals" },
  { icon: Users, label: "Social", path: "/social-trading" },
  { icon: Zap, label: "Express", path: "/express-trades" },
  { icon: Keyboard, label: "Hotkeys" },
  { icon: Maximize, label: "Full screen", action: "fullscreen" },
];

export default function TradingBottomNav({ onFullscreen }: TradingBottomNavProps) {
  const navigate = useNavigate();

  return (
    <nav className="nt-bottom-nav">
      {items.map(({ icon: Icon, ...item }) => (
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
          <span><Icon size={18} strokeWidth={1.9} aria-hidden="true" /></span>
          <small>{item.label}</small>
        </button>
      ))}
    </nav>
  );
}
