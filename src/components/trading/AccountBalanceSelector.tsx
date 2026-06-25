import React from "react";
import { useNavigate } from "react-router-dom";
import type { AccountType, Currency } from "./trading.types";
import { CURRENCIES } from "./trading.constants";

const ACCOUNT_TYPES: AccountType[] = ["QT Demo", "QT Real"];

type AccountBalanceSelectorProps = {
  accountType: AccountType;
  currency: Currency;
  balance: number;
  onAccountTypeChange: (value: AccountType) => void;
  onCurrencyChange: (value: Currency) => void;
  depositPath?: string;
};

export default function AccountBalanceSelector({
  accountType,
  currency,
  balance,
  onAccountTypeChange,
  onCurrencyChange,
  depositPath = "/finance",
}: AccountBalanceSelectorProps) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const balanceText = balance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="account-balance-selector" ref={rootRef}>
      <div
        className="balance-info"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
      >
        <div className="balance-top-row">
          <span>{accountType}</span>
          <span>{currency}</span>
        </div>

        <div className="balance-main-row">
          <span className="balance-amount">{balanceText}</span>
          <span className="balance-arrow">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      <button
        type="button"
        className="deposit-shortcut-btn"
        aria-label="Deposit funds"
        onClick={() => navigate(depositPath)}
      >
        +
      </button>

      {open && (
        <div className="balance-dropdown">
          <div className="balance-dropdown-group">
            <span className="balance-dropdown-label">Account</span>
            <div className="balance-dropdown-options">
              {ACCOUNT_TYPES.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`balance-dropdown-option ${option === accountType ? "active" : ""}`}
                  onClick={() => {
                    onAccountTypeChange(option);
                    setOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="balance-dropdown-group">
            <span className="balance-dropdown-label">Currency</span>
            <div className="balance-dropdown-options balance-dropdown-currencies">
              {CURRENCIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`balance-dropdown-option ${item === currency ? "active" : ""}`}
                  onClick={() => {
                    onCurrencyChange(item);
                    setOpen(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
