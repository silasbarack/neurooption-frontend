import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Maximize, Menu } from "lucide-react";
import type { AccountType, Currency } from "./trading.types";
import AccountBalanceSelector from "./AccountBalanceSelector";
import Logo from "../branding/Logo";
import MenuDrawer from "../shell/MenuDrawer";
import KenyaClock from "./KenyaClock";

type TradingHeaderProps = {
  accountType: AccountType;
  currency: Currency;
  balance: number | null;
  balanceLoading?: boolean;
  onAccountChange: (value: AccountType) => void;
  onCurrencyChange: (value: Currency) => void;
  onFullscreen: () => void;
  onAddDemoFunds?: () => void;
};

// Sign-in keeps the user in localStorage ("remember me") or sessionStorage.
function readUserInitials(): string {
  for (const storage of [localStorage, sessionStorage]) {
    try {
      const user = JSON.parse(storage.getItem("neurooption_user") || "null");
      const name: string = (user?.fullName || user?.name || user?.email || "").trim();
      if (name) {
        const parts = name.split(/[\s@._-]+/).filter(Boolean);
        return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "NO";
      }
    } catch {
      // Ignore malformed stored data and fall through to the default.
    }
  }
  return "NO";
}

export default function TradingHeader({
  accountType,
  currency,
  balance,
  balanceLoading = false,
  onAccountChange,
  onCurrencyChange,
  onFullscreen,
  onAddDemoFunds,
}: TradingHeaderProps) {
  const [initials] = useState(readUserInitials);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className="nt-header">
      <div className="nt-brand">
        <Link to="/" className="nt-brand-plate" aria-label="NeuroOption home">
          <Logo className="nt-brand-approved-logo" />
        </Link>
        <div className="nt-market-status" aria-label="Trading clock">
          <i aria-hidden="true" />
          <span>Trading workspace</span>
          <KenyaClock className="nt-header-clock" compact />
        </div>
      </div>

      <div className="nt-account-bar">
        <AccountBalanceSelector
          accountType={accountType}
          currency={currency}
          balance={balance}
          loading={balanceLoading}
          onAccountTypeChange={onAccountChange}
          onCurrencyChange={onCurrencyChange}
          depositPath="/finance"
          onAddDemoFunds={onAddDemoFunds}
        />

        <button type="button" className="nt-fullscreen" onClick={onFullscreen} aria-label="Full screen">
          <Maximize size={17} aria-hidden="true" />
        </button>

        <Link to="/profile" className="nt-avatar" aria-label="Profile">
          {initials}
        </Link>

        <button type="button" className="nt-fullscreen nt-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-haspopup="dialog" aria-expanded={menuOpen}>
          <Menu size={18} aria-hidden="true" />
        </button>
      </div>

      <MenuDrawer open={menuOpen} onClose={closeMenu} />
    </header>
  );
}
