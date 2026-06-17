import React from "react";

const items = [
  ["📈", "Trading"],
  ["💵", "Finance"],
  ["👤", "Profile"],
  ["🛒", "Market"],
  ["💎", "Achievements"],
  ["🏆", "Tournaments"],
  ["💬", "Chat"],
  ["?", "Help"],
  ["🎁", "Promo"],
  ["🤖", "Autotrading"],
];

export default function TradingSidebar() {
  return (
    <aside className="nt-sidebar">
      {items.map(([icon, label]) => (
        <button
          key={label}
          type="button"
          className={label === "Trading" ? "active" : ""}
        >
          <span>{icon}</span>
          <small>{label}</small>
        </button>
      ))}
    </aside>
  );
}