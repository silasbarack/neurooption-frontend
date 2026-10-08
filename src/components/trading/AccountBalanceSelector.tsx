import { ChevronDown, Plus } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import type { AccountType, Currency } from "./trading.types";
import { CURRENCIES } from "./trading.constants";
import AnimatedBalance from "./AnimatedBalance";

const ACCOUNT_TYPES: AccountType[] = ["QT Demo", "QT Real"];

type AccountBalanceSelectorProps = {
  accountType: AccountType;
  currency: Currency;
  balance: number | null;
  loading?: boolean;
  onAccountTypeChange: (value: AccountType) => void;
  onCurrencyChange: (value: Currency) => void;
  depositPath?: string;
  /** Opens the add-demo-funds dialog; the "+" uses it on the demo account. */
  onAddDemoFunds?: () => void;
};

export default function AccountBalanceSelector({
  accountType,
  currency,
  balance,
  loading = false,
  onAccountTypeChange,
  onCurrencyChange,
  depositPath = "/finance",
  onAddDemoFunds,
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

    function handleEscape(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const balanceText = balance === null ? (loading ? "Loading…" : "Unavailable") : balance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="account-balance-selector" ref={rootRef}>
      <button
        type="button"
        className="balance-info"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Select account and currency. ${accountType}, ${currency}, balance ${balanceText}`}
        onClick={() => setOpen((value) => !value)}
      >
        <div className="balance-top-row">
          <span>{accountType === "QT Demo" ? "Demo" : "Real"}</span>
          <span>{currency}</span>
        </div>

        <div className="balance-main-row">
          {balance === null ? (
            <span className="balance-amount">{balanceText}</span>
          ) : (
            <AnimatedBalance className="balance-amount" value={balance} scopeKey={`${accountType}|${currency}`} />
          )}
          <ChevronDown size={16} className={`balance-arrow${open ? " is-open" : ""}`} aria-hidden="true" />
        </div>
      </button>

      {accountType === "QT Demo" && onAddDemoFunds ? (
        <button
          type="button"
          className="deposit-shortcut-btn"
          aria-label="Add demo funds"
          aria-haspopup="dialog"
          onClick={onAddDemoFunds}
        >
          <Plus size={18} aria-hidden="true" />
          <span>Add funds</span>
        </button>
      ) : (
        <button
          type="button"
          className="deposit-shortcut-btn"
          aria-label="Deposit funds"
          onClick={() => navigate(depositPath)}
        >
          <Plus size={18} aria-hidden="true" />
          <span>Deposit</span>
        </button>
      )}

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
                  {option === "QT Demo" ? "Demo" : "Real"}
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
