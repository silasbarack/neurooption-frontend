import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, LogOut, X } from "lucide-react";
import BrandLogo from "../branding/BrandLogo";
import { clearToken, clearUser, getToken } from "../../utils/storage";
import { MENU_NAV, isActivePath } from "./navItems";

type MenuDrawerProps = { open: boolean; onClose: () => void };

export default function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const signedIn = Boolean(getToken());
  const portalRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const siblings = Array.from(document.body.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement && node !== portalRef.current,
    );
    const previousInert = siblings.map((node) => node.inert);
    siblings.forEach((node) => { node.inert = true; });
    document.body.style.overflow = "hidden";
    let frame = 0;
    let attempts = 0;
    function focusPanel() {
      closeRef.current?.focus({ preventScroll: true });
      attempts += 1;
      if (!panelRef.current?.contains(document.activeElement) && attempts < 32) frame = requestAnimationFrame(focusPanel);
    }
    frame = requestAnimationFrame(focusPanel);
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab") return;
      const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
      ) ?? []).filter((node) => node.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && (document.activeElement === first || !panelRef.current?.contains(document.activeElement))) {
        event.preventDefault(); last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus({ preventScroll: true });
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      siblings.forEach((node, index) => { node.inert = previousInert[index]; });
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  function signOut() {
    clearToken();
    clearUser();
    onClose();
    navigate("/login");
  }

  return createPortal(
    <div ref={portalRef} className={`neo-drawer ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
      <button type="button" className="neo-drawer-scrim" onClick={onClose} aria-label="Close menu" tabIndex={-1} />
      <aside ref={panelRef} className="neo-drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="neo-drawer-head">
          <BrandLogo size="sm" />
          <button ref={closeRef} type="button" className="neo-icon-btn" onClick={onClose} aria-label="Close menu">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <nav className="neo-drawer-nav" aria-label="Application">
          {MENU_NAV.map(({ label, path, icon: Icon }) => (
            <Link key={path} to={signedIn || path === "/markets" ? path : "/login"} onClick={onClose}
              className={isActivePath(pathname, path) ? "is-active" : ""} aria-current={isActivePath(pathname, path) ? "page" : undefined}>
              <Icon size={19} aria-hidden="true" /><span>{label}</span>
              <ChevronRight size={16} className="neo-drawer-chev" aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <div className="neo-drawer-actions">
          {signedIn ? (
            <button type="button" className="neo-btn neo-btn-outline neo-btn-block" onClick={signOut}>
              <LogOut size={16} aria-hidden="true" />Log out
            </button>
          ) : (<>
            <Link to="/register" className="neo-btn neo-btn-primary neo-btn-block" onClick={onClose}>Create Account</Link>
            <Link to="/login" className="neo-btn neo-btn-outline neo-btn-block" onClick={onClose}>Log in</Link>
          </>)}
        </div>
        <footer className="neo-drawer-foot">
          <div>
            <Link to="/#why" onClick={onClose}>About</Link>
            <Link to="/help" onClick={onClose}>Terms</Link>
            <Link to="/help" onClick={onClose}>Privacy</Link>
            <Link to="/#risk" onClick={onClose}>Risk Disclosure</Link>
          </div>
          <small>© {new Date().getFullYear()} NeuroOption. All rights reserved.</small>
        </footer>
      </aside>
    </div>, document.body,
  );
}
