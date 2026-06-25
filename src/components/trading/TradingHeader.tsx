import type { AccountType, Currency } from "./trading.types";
import AccountBalanceSelector from "./AccountBalanceSelector";

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
        <span className="nt-brand-logo">N</span>
        <span className="nt-brand-text">NeuroOption</span>
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