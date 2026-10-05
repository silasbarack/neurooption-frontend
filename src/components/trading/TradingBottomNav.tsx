import { useLocation, useNavigate } from "react-router-dom";
import { BOTTOM_NAV, isActivePath } from "../shell/navItems";

/** Phone bottom bar on the trading screen; same items as every other page. */
export default function TradingBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="nt-bottom-nav" aria-label="Main">
      {BOTTOM_NAV.map(({ icon: Icon, label, path }) => (
        <button
          key={path}
          type="button"
          className={isActivePath(pathname, path) ? "active" : ""}
          onClick={() => navigate(path)}
          aria-current={isActivePath(pathname, path) ? "page" : undefined}
        >
          <span>
            <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
          </span>
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}
