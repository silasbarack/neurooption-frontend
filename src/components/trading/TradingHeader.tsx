import React from "react";
import type { AccountType, Currency } from "./trading.types";
import { CURRENCIES } from "./trading.constants";

type TradingHeaderProps = {
  accountType: AccountType;
  currency: Currency;
  balanceText: string;
  onAccountChange: (value: AccountType) => void;
  onCurrencyChange: (value: Currency) => void;
  onTopUp: () => void;
  onFullscreen: () => void;
};

export default function TradingHeader({
  accountType,
  currency,
  balanceText,
  onAccountChange,
  onCurrencyChange,
  onTopUp,
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
        <select
          value={accountType}
          onChange={(event) => onAccountChange(event.target.value as AccountType)}
        >
          <option value="QT Demo">QT Demo</option>
          <option value="QT Real">QT Real</option>
        </select>

        <select
          value={currency}
          onChange={(event) => onCurrencyChange(event.target.value as Currency)}
        >
          {CURRENCIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <strong className="nt-balance">{balanceText}</strong>

        <button type="button" className="nt-top-up" onClick={onTopUp}>
          TOP UP
        </button>

        <button type="button" className="nt-fullscreen" onClick={onFullscreen}>
          ⛶
        </button>

        <span className="nt-avatar">SM</span>
      </div>
    </header>
  );
}