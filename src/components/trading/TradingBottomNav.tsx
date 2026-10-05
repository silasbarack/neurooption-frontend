import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpDown,
  CandlestickChart,
  CircleHelp,
  Ellipsis,
  Gem,
  History,
  Maximize,
  MessageCircle,
  Radio,
  ShoppingBag,
  Trophy,
  UserRound,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";

type TradingBottomNavProps = {
  onFullscreen: () => void;
};

type NavItem = {
  icon: LucideIcon;
  label: string;
  path?: string;
  action?: "fullscreen";
};

const MAIN_ITEMS: Array<NavItem & { center?: boolean }> = [
  { icon: ArrowUpDown, label: "Trades", path: "/open-trades" },
  { icon: Radio, label: "Signals", path: "/signals" },
  { icon: CandlestickChart, label: "Trade", path: "/trading", center: true },
  { icon: Users, label: "Social", path: "/social-trading" },
];

const MORE_ITEMS: NavItem[] = [
  { icon: Wallet, label: "Finance", path: "/finance" },
  { icon: History, label: "History", path: "/history" },
  { icon: Zap, label: "Express trades", path: "/express-trades" },
  { icon: UserRound, label: "Profile", path: "/profile" },
  { icon: ShoppingBag, label: "Market", path: "/market" },
  { icon: Gem, label: "Achievements", path: "/achievements" },
  { icon: Trophy, label: "Tournaments", path: "/tournaments" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: CircleHelp, label: "Help", path: "/help" },
  { icon: Maximize, label: "Full screen", action: "fullscreen" },
];

export default function TradingBottomNav({ onFullscreen }: TradingBottomNavProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  function run(item: NavItem) {
    setMoreOpen(false);
    if (item.action === "fullscreen") {
      onFullscreen();
      return;
    }
    if (item.path) navigate(item.path);
  }

  return (
    <>
      {moreOpen && (
        <div className="nt-more-sheet" role="dialog" aria-label="More" onClick={() => setMoreOpen(false)}>
          <div className="nt-more-panel" onClick={(event) => event.stopPropagation()}>
            <div className="nt-more-head">
              <strong>More</strong>
              <button type="button" onClick={() => setMoreOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="nt-more-grid">
              {MORE_ITEMS.map(({ icon: Icon, ...item }) => (
                <button key={item.label} type="button" onClick={() => run({ icon: Icon, ...item })}>
                  <span><Icon size={20} strokeWidth={1.9} aria-hidden="true" /></span>
                  <small>{item.label}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="nt-bottom-nav">
        {MAIN_ITEMS.map(({ icon: Icon, center, ...item }) => (
          <button
            key={item.label}
            type="button"
            className={`${center ? "is-center" : ""}${item.path === pathname ? " active" : ""}`}
            onClick={() => run({ icon: Icon, ...item })}
          >
            <span><Icon size={20} strokeWidth={1.9} aria-hidden="true" /></span>
            <small>{item.label}</small>
          </button>
        ))}
        <button
          type="button"
          className={moreOpen ? "active" : ""}
          onClick={() => setMoreOpen((current) => !current)}
          aria-expanded={moreOpen}
        >
          <span><Ellipsis size={20} strokeWidth={1.9} aria-hidden="true" /></span>
          <small>More</small>
        </button>
      </nav>
    </>
  );
}
