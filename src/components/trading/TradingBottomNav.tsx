import React from "react";

const items = [
  ["↻", "Trades"],
  ["📡", "Signals"],
  ["👥", "Social Trading"],
  ["◎", "Express Trades"],
  ["⏳", "Pending Trades"],
];

export default function TradingBottomNav() {
  return (
    <nav className="nt-bottom-nav">
      {items.map(([icon, label]) => (
        <button key={label} type="button">
          <span>{icon}</span>
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}