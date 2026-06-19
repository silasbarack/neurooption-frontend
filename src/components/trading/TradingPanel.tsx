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
  const numericAmount = Number(amount || 0);

  return (
    <aside className="nt-trade-panel nt-white-panel">
      <section className="nt-white-field">
        <h3>Time ⓘ</h3>

        <div className="nt-white-input">
          <strong>{expiryText}</strong>
          <div>
            <button type="button" onClick={() => onAdjustExpiry("seconds", -1)}>
              −
            </button>
            <button type="button" onClick={() => onAdjustExpiry("seconds", 1)}>
              +
            </button>
          </div>
        </div>

        <div className="nt-white-expiry">
          <span>{String(expiryParts.hours).padStart(2, "0")}h</span>
          <span>{String(expiryParts.minutes).padStart(2, "0")}m</span>
          <span>{String(expiryParts.seconds).padStart(2, "0")}s</span>
        </div>
      </section>

      <section className="nt-white-field">
        <h3>Amount ⓘ</h3>

        <label className="nt-white-input">
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
          />
          <div>
            <button
              type="button"
              onClick={() => onAmountChange(String(Math.max(1, numericAmount - 1)))}
            >
              −
            </button>
            <button type="button" onClick={() => onAmountChange(String(numericAmount + 1))}>
              +
            </button>
          </div>
        </label>

        <small>{currency}</small>
      </section>

      <section className="nt-white-payout">
        <span>Payout</span>
        <strong>+{payout}%</strong>
        <small>{expectedProfitText}</small>
      </section>

      <button
        type="button"
        className="nt-buy"
        disabled={!canTrade}
        onClick={() => onTrade("BUY")}
      >
        ↗ BUY
      </button>

      <button type="button" className="nt-ai">
        AI TRADING
      </button>

      <button
        type="button"
        className="nt-sell"
        disabled={!canTrade}
        onClick={() => onTrade("SELL")}
      >
        ↘ SELL
      </button>

      <section className="nt-white-sentiment">
        <div>
          <span>Sentiment</span>
          <small>62%</small>
        </div>
        <div className="bar">
          <i />
        </div>
        <small>38%</small>
      </section>

      <p className="nt-white-return">Expected return: {expectedReturnText}</p>
    </aside>
  );
}