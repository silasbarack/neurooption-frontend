import { useNavigate, useLocation } from "react-router-dom";

const items: Array<[string, string, string?]> = [
  ["📈", "Trading", "/trading"],
  ["💵", "Finance", "/finance"],
  ["👤", "Profile", "/profile"],
  ["🛒", "Market", "/market"],
  ["💎", "Achievements", "/achievements"],
  ["🏆", "Tournaments", "/tournaments"],
  ["💬", "Chat", "/chat"],
  ["?", "Help", "/help"],
  ["🎁", "Promo"],
  ["🤖", "Autotrading"],
];

export default function TradingSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="nt-sidebar">
      {items.map(([icon, label, path]) => (
        <button
          key={label}
          type="button"
          className={path && location.pathname === path ? "active" : ""}
          onClick={path ? () => navigate(path) : undefined}
          disabled={!path}
        >
          <span>{icon}</span>
          <small>{label}</small>
        </button>
      ))}
    </aside>
  );
}
