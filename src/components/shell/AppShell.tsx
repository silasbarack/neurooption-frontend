import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Menu, Plus } from "lucide-react";

import BrandLogo from "../branding/BrandLogo";
import Avatar from "./Avatar";
import MenuDrawer from "./MenuDrawer";
import { BOTTOM_NAV, TOP_NAV, isActivePath } from "./navItems";
import { useAccount } from "./useAccount";
import "./AppShell.css";

type AppShellProps = {
  children: ReactNode;
  /** Phone header title; when set the phone header shows a back button. */
  title?: string;
  /** Where the back button goes (defaults to the previous page). */
  backTo?: string;
  /** Let the page use the full content width on desktop. */
  wide?: boolean;
};

function formatKes(value: number) {
  return `KES ${value.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AppShell({ children, title, backTo, wide }: AppShellProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { account, displayName } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  function goBack() {
    if (backTo) navigate(backTo);
    else if (window.history.length > 1) navigate(-1);
    else navigate("/profile");
  }

  return (
    <div className={`neo-shell ${title ? "has-title" : ""}`}>
      <header className="neo-topbar">
        <div className="neo-topbar-inner">
          {title && (
            <button type="button" className="neo-topbar-back" onClick={goBack} aria-label="Back">
              <ChevronLeft size={22} />
            </button>
          )}
          <BrandLogo to="/trading" size="sm" className="neo-topbar-brand" />
          {title && <h1 className="neo-topbar-title">{title}</h1>}

          <nav className="neo-topnav" aria-label="Main">
            {TOP_NAV.map(({ label, path }) => (
              <Link key={path} to={path} className={isActivePath(pathname, path) ? "is-active" : ""}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="neo-topbar-right">
            {account && (
              <Link to="/finance" className="neo-balance-chip" title="Real account balance">
                <small>Real</small>
                <strong>{formatKes(account.real.balance)}</strong>
              </Link>
            )}
            <Link to="/finance" className="neo-btn neo-btn-primary neo-btn-sm neo-topbar-deposit">
              <Plus size={15} aria-hidden="true" />
              Deposit
            </Link>
            <Link to="/profile" className="neo-topbar-avatar" aria-label="Your account">
              <Avatar name={displayName} size={34} />
            </Link>
            <button type="button" className="neo-icon-btn neo-topbar-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={19} />
            </button>
          </div>
        </div>
      </header>

      <main className={`neo-shell-main ${wide ? "is-wide" : ""}`}>{children}</main>

      <nav className="neo-bottomnav" aria-label="Main">
        {BOTTOM_NAV.map(({ label, path, icon: Icon }) => (
          <Link key={path} to={path} className={isActivePath(pathname, path) ? "is-active" : ""}>
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <MenuDrawer open={menuOpen} onClose={closeMenu} />
    </div>
  );
}
