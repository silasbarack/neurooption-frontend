import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">N</div>
          <span>NeuroOption</span>
        </div>

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