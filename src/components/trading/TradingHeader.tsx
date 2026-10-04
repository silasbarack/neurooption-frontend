import type { AccountType, Currency } from "./trading.types";
import AccountBalanceSelector from "./AccountBalanceSelector";
import Logo from "../branding/Logo";

type TradingHeaderProps = {
  accountType: AccountType;
  currency: Currency;
  balance: number;
  onAccountChange: (value: AccountType) => void;
  onCurrencyChange: (value: Currency) => void;
  onFullscreen: () => void;
};

export default function TradingHeader({
  accountType,
  currency,
  balance,
  onAccountChange,
  onCurrencyChange,
  onFullscreen,
}: TradingHeaderProps) {
  return (
    <header className="nt-header">
      <div className="nt-brand">
        <Logo className="nt-brand-approved-logo" />
        <button type="button" className="nt-star">
          ★
        </button>
      </div>

      <div className="nt-account-bar">
        <AccountBalanceSelector
          accountType={accountType}
          currency={currency}
          balance={balance}
          onAccountTypeChange={onAccountChange}
          onCurrencyChange={onCurrencyChange}
          depositPath="/finance"
        />

        <button type="button" className="nt-fullscreen" onClick={onFullscreen}>
          ⛶
        </button>

        <span className="nt-avatar">SM</span>
      </div>
    </header>
  );
}