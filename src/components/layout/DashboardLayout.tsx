import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../branding/Logo";
import "./DashboardLayout.css";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("neurooption_token");
    localStorage.removeItem("neurooption_user");
    navigate("/login");
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <NavLink to="/trading" className="dashboard-brand" aria-label="NeuroOption trading home">
          <Logo className="dashboard-brand-logo" />
        </NavLink>

        <nav className="dashboard-nav">
          <NavLink to="/trading">Trading</NavLink>
          <NavLink to="/finance">Finance</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/market">Market</NavLink>
          <NavLink to="/chat">Chat</NavLink>
          <NavLink to="/help">Help</NavLink>
        </nav>

        <button className="dashboard-logout" type="button" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">{children}</main>
    </div>
  );
}