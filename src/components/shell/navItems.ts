import type { LucideIcon } from "lucide-react";
import {
  CandlestickChart,
  ChartNoAxesColumn,
  CircleHelp,
  ClipboardList,
  History,
  Settings,
  Trophy,
  UserRound,
  Users,
  Wallet,
  Award,
} from "lucide-react";

export type NavItem = { label: string; path: string; icon: LucideIcon };

/** Phone bottom bar, as in the mockups. */
export const BOTTOM_NAV: NavItem[] = [
  { label: "Trade", path: "/trading", icon: CandlestickChart },
  { label: "Markets", path: "/markets", icon: ChartNoAxesColumn },
  { label: "Open", path: "/open-trades", icon: ClipboardList },
  { label: "History", path: "/history", icon: History },
  { label: "Profile", path: "/profile", icon: UserRound },
];

/** Desktop header links. */
export const TOP_NAV: NavItem[] = [
  { label: "Trade", path: "/trading", icon: CandlestickChart },
  { label: "Markets", path: "/markets", icon: ChartNoAxesColumn },
  { label: "Finance", path: "/finance", icon: Wallet },
  { label: "Social Trading", path: "/social-trading", icon: Users },
  { label: "Tournaments", path: "/tournaments", icon: Trophy },
  { label: "Achievements", path: "/achievements", icon: Award },
];

/** Slide-out menu. */
export const MENU_NAV: NavItem[] = [
  { label: "Trading", path: "/trading", icon: CandlestickChart },
  { label: "Markets", path: "/markets", icon: ChartNoAxesColumn },
  { label: "Finance", path: "/finance", icon: Wallet },
  { label: "Social Trading", path: "/social-trading", icon: Users },
  { label: "Tournaments", path: "/tournaments", icon: Trophy },
  { label: "Achievements", path: "/achievements", icon: Award },
  { label: "Profile", path: "/profile", icon: UserRound },
  { label: "Support", path: "/help", icon: CircleHelp },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function isActivePath(pathname: string, path: string) {
  if (path === "/markets") return pathname === "/markets" || pathname === "/market";
  return pathname === path || pathname.startsWith(`${path}/`);
}
