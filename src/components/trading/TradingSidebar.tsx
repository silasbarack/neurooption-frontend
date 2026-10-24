import { useNavigate, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  CandlestickChart,
  ChartNoAxesColumn,
  CircleHelp,
  ClipboardList,
  History,
  Trophy,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

const items: Array<[LucideIcon, string, string?]> = [
  [CandlestickChart, "Trade", "/trading"],
  [ChartNoAxesColumn, "Markets", "/markets"],
  [Wallet, "Finance", "/finance"],
  [ClipboardList, "Open", "/open-trades"],
  [History, "History", "/history"],
  [Users, "Social", "/social-trading"],
  [Trophy, "Tournaments", "/tournaments"],
  [Award, "Achievements", "/achievements"],
  [UserRound, "Profile", "/profile"],
  [CircleHelp, "Support", "/help"],
];

export default function TradingSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="nt-sidebar">
      {items.map(([Icon, label, path]) => (
        <button
          key={label}
          type="button"
          className={path && location.pathname === path ? "active" : ""}
          onClick={path ? () => navigate(path) : undefined}
          disabled={!path}
          title={path ? label : `${label} (coming soon)`}
        >
          <span><Icon size={19} strokeWidth={1.9} aria-hidden="true" /></span>
          <small>{label}</small>
        </button>
      ))}
    </aside>
  );
}
