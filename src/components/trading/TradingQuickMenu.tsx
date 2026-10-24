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

type TradingQuickMenuProps = {
  onFullscreen: () => void;
};

const items: Array<{
  icon: LucideIcon;
  label: string;
  path?: string;
  action?: "fullscreen";
}> = [
  { icon: RefreshCcw, label: "Open trades", path: "/open-trades" },
  { icon: History, label: "History", path: "/history" },
  { icon: Radio, label: "Signals", path: "/signals" },
  { icon: Users, label: "Social Trading", path: "/social-trading" },
  { icon: Zap, label: "Express Trades", path: "/express-trades" },
  { icon: Keyboard, label: "Hotkeys" },
  { icon: Maximize, label: "Full screen", action: "fullscreen" },
];

export default function TradingQuickMenu({ onFullscreen }: TradingQuickMenuProps) {
  const navigate = useNavigate();

  return (
    <aside className="nt-quick-menu">
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
    </aside>
  );
}
