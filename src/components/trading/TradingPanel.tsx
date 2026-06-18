import type { Currency, TradeSide } from "./trading.types";

type ExpiryParts = {
  hours: number;
  minutes: number;
  seconds: number;
};

type TradingPanelProps = {
  expiryText: string;
  expiryParts: ExpiryParts;
  amount: string;
  currency: Currency;
  payout: number;
  expectedProfitText: string;
  expectedReturnText: string;
  canTrade: boolean;
  onAdjustExpiry: (unit: "hours" | "minutes" | "seconds", delta: number) => void;
  onAmountChange: (amount: string) => void;
  onTrade: (side: TradeSide) => void;
};

export default function TradingPanel({
  expiryText,
  expiryParts,
  amount,
  currency,
  payout,
  expectedProfitText,
  expectedReturnText,
  canTrade,
  onAdjustExpiry,
  onAmountChange,
  onTrade,
}: TradingPanelProps) {
  return (
    <aside className="nt-trade-panel nt-pocket-panel">
      <div className="nt-pocket-sentiment">
        <span>50%</span>
        <div>
          <i />
        </div>
        <span>50%</span>
      </div>

      <section className="nt-pocket-field">
        <h3>Time ⓘ</h3>

        <div className="nt-pocket-input">
          <button type="button" onClick={() => onAdjustExpiry("seconds", -1)}>
            -
          </button>

          <strong>{expiryText}</strong>

          <button type="button" onClick={() => onAdjustExpiry("seconds", 1)}>
            +
          </button>
        </div>

        <div className="nt-pocket-expiry-line">
          <button type="button" onClick={() => onAdjustExpiry("hours", -1)}>
            H-
          </button>
          <span>{String(expiryParts.hours).padStart(2, "0")}h</span>
          <button type="button" onClick={() => onAdjustExpiry("hours", 1)}>
            H+
          </button>

          <button type="button" onClick={() => onAdjustExpiry("minutes", -1)}>
            M-
          </button>
          <span>{String(expiryParts.minutes).padStart(2, "0")}m</span>
          <button type="button" onClick={() => onAdjustExpiry("minutes", 1)}>
            M+
          </button>

          <button type="button" onClick={() => onAdjustExpiry("seconds", -1)}>
            S-
          </button>
          <span>{String(expiryParts.seconds).padStart(2, "0")}s</span>
          <button type="button" onClick={() => onAdjustExpiry("seconds", 1)}>
            S+
          </button>
        </div>
      </section>

      <section className="nt-pocket-field">
        <h3>Amount ⓘ</h3>

        <label className="nt-pocket-amount">
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
          />
          <span>{currency}</span>
        </label>
      </section>

      <section className="nt-pocket-payout">
        <div>
          <span>Payout</span>
          <strong>{expectedReturnText}</strong>
        </div>

        <div className="center">
          <strong>+{payout}%</strong>
        </div>

        <div>
          <span>Profit</span>
          <strong>{expectedProfitText}</strong>
        </div>
      </section>

      <div className="nt-pocket-actions">
        <button
          type="button"
          className="buy"
          disabled={!canTrade}
          onClick={() => onTrade("BUY")}
        >
          ↗ BUY
        </button>

        <button type="button" className="ai">
          <span>AI</span>
          TRADING
        </button>

        <button
          type="button"
          className="sell"
          disabled={!canTrade}
          onClick={() => onTrade("SELL")}
        >
          ↘ SELL
        </button>
      </div>
    </aside>
  );
}