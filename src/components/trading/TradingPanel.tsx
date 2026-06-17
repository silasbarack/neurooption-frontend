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
    <aside className="nt-trade-panel">
      <div className="nt-sentiment">
        <span>50%</span>
        <div>
          <i />
        </div>
        <span>50%</span>
      </div>

      <section className="nt-time-card">
        <h3>Time ⓘ</h3>

        <div className="nt-time-main">
          <button type="button" onClick={() => onAdjustExpiry("seconds", -1)}>
            -
          </button>

          <strong>{expiryText}</strong>

          <button type="button" onClick={() => onAdjustExpiry("seconds", 1)}>
            +
          </button>
        </div>

        <p>Min 00:00:05 · Max 05:00:00</p>

        <div className="nt-expiry-grid">
          <div>
            <button type="button" onClick={() => onAdjustExpiry("hours", 1)}>
              +
            </button>
            <strong>{String(expiryParts.hours).padStart(2, "0")}</strong>
            <button type="button" onClick={() => onAdjustExpiry("hours", -1)}>
              -
            </button>
            <small>Hours</small>
          </div>

          <div>
            <button type="button" onClick={() => onAdjustExpiry("minutes", 1)}>
              +
            </button>
            <strong>{String(expiryParts.minutes).padStart(2, "0")}</strong>
            <button type="button" onClick={() => onAdjustExpiry("minutes", -1)}>
              -
            </button>
            <small>Minutes</small>
          </div>

          <div>
            <button type="button" onClick={() => onAdjustExpiry("seconds", 1)}>
              +
            </button>
            <strong>{String(expiryParts.seconds).padStart(2, "0")}</strong>
            <button type="button" onClick={() => onAdjustExpiry("seconds", -1)}>
              -
            </button>
            <small>Seconds</small>
          </div>
        </div>
      </section>

      <section className="nt-amount-card">
        <h3>Amount ⓘ</h3>

        <label>
          <input
            type="number"
            min="1"
            inputMode="decimal"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
          />
          <span>{currency}</span>
        </label>
      </section>

      <section className="nt-payout-card">
        <div>
          <span>Rate</span>
          <strong>+{payout}%</strong>
        </div>

        <div>
          <span>Expected profit</span>
          <strong>{expectedProfitText}</strong>
        </div>

        <div>
          <span>Expected return</span>
          <strong>{expectedReturnText}</strong>
        </div>
      </section>

      {!canTrade && (
        <p className="nt-trade-warning">
          Enter a valid amount within your account balance.
        </p>
      )}

      <div className="nt-trade-actions">
        <button
          type="button"
          className="buy"
          disabled={!canTrade}
          onClick={() => onTrade("BUY")}
        >
          ↗ BUY
        </button>

        <button type="button" className="ai">
          AI TRADING
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