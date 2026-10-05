import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, LogOut, X } from "lucide-react";

import BrandLogo from "../branding/BrandLogo";
import { clearToken, getToken } from "../../utils/storage";
import { MENU_NAV, isActivePath } from "./navItems";

type MenuDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const signedIn = Boolean(getToken());

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  function signOut() {
    clearToken();
    localStorage.removeItem("neurooption_user");
    onClose();
    navigate("/login");
  }

  // Portalled so a blurred/transformed parent (e.g. a header) can't trap it.
  return createPortal(
    <div className={`neo-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button type="button" className="neo-drawer-scrim" onClick={onClose} aria-label="Close menu" tabIndex={-1} />
      <aside className="neo-drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="neo-drawer-head">
          <BrandLogo size="sm" />
          <button type="button" className="neo-icon-btn" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="neo-drawer-nav">
          {MENU_NAV.map(({ label, path, icon: Icon }) => {
            const target = signedIn || path === "/markets" ? path : "/login";
            return (
              <Link
                key={path}
                to={target}
                onClick={onClose}
                className={isActivePath(pathname, path) ? "is-active" : ""}
              >
                <Icon size={19} aria-hidden="true" />
                <span>{label}</span>
                <ChevronRight size={16} className="neo-drawer-chev" aria-hidden="true" />
              </Link>
            );
          })}
        </nav>

        <div className="neo-drawer-actions">
          {signedIn ? (
            <button type="button" className="neo-btn neo-btn-outline neo-btn-block" onClick={signOut}>
              <LogOut size={16} aria-hidden="true" />
              Log out
            </button>
          ) : (
            <>
              <Link to="/register" className="neo-btn neo-btn-gold neo-btn-block" onClick={onClose}>
                Create Account
              </Link>
              <Link to="/login" className="neo-btn neo-btn-outline neo-btn-block" onClick={onClose}>
                Log in
              </Link>
            </>
          )}
        </div>

        <footer className="neo-drawer-foot">
          <div>
            <Link to="/#about" onClick={onClose}>About</Link>
            <Link to="/#faq" onClick={onClose}>Terms</Link>
            <Link to="/#faq" onClick={onClose}>Privacy</Link>
            <Link to="/#risk" onClick={onClose}>Risk Disclosure</Link>
          </div>
          <small>© {new Date().getFullYear()} NeuroOption. All rights reserved.</small>
        </footer>
      </aside>
    </div>,
    document.body,
  );
}
