import { useNavigate, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  CandlestickChart,
  CircleHelp,
  Gem,
  Gift,
  MessageCircle,
  ShoppingBag,
  Trophy,
  UserRound,
  Wallet,
} from "lucide-react";

const items: Array<[LucideIcon, string, string?]> = [
  [CandlestickChart, "Trading", "/trading"],
  [Wallet, "Finance", "/finance"],
  [UserRound, "Profile", "/profile"],
  [ShoppingBag, "Market", "/market"],
  [Gem, "Achievements", "/achievements"],
  [Trophy, "Tournaments", "/tournaments"],
  [MessageCircle, "Chat", "/chat"],
  [CircleHelp, "Help", "/help"],
  [Gift, "Promo"],
  [Bot, "Autotrading"],
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
