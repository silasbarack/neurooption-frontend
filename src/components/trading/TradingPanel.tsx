import { Link } from "react-router-dom";
import type { Currency, TradeSide } from "./trading.types";
import type { BackendTrade } from "./tradesApi";
import { formatMoney } from "./tradesApi";

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
  sentiment: number;
  openTrades: BackendTrade[];
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
  sentiment,
  openTrades,
  onAdjustExpiry,
  onAmountChange,
  onTrade,
}: TradingPanelProps) {
  const numericAmount = Number(amount || 0);
  const sellSentiment = 100 - sentiment;

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
          <small>{sentiment}%</small>
        </div>

        <div
          className="bar"
          style={{
            background: `linear-gradient(90deg, #1fdb8e 0 ${sentiment}%, #ff5b72 ${sentiment}% 100%)`,
          }}
        >
          <i style={{ left: `${sentiment}%` }} />
        </div>

        <small>{sellSentiment}%</small>
      </section>

      <p className="nt-white-return">Expected return: {expectedReturnText}</p>

      <section className="nt-open-trades">
        <div className="nt-open-trades-head">
          <h3>Open Trades ({openTrades.length})</h3>
          <Link to="/open-trades">View all →</Link>
        </div>

        {openTrades.length === 0 ? (
          <p className="nt-open-trades-empty">No open trades right now.</p>
        ) : (
          <ul className="nt-open-trades-list">
            {openTrades.slice(0, 4).map((trade) => (
              <li key={trade.id} className={trade.side === "BUY" ? "buy" : "sell"}>
                <span className="nt-open-trade-asset">{trade.asset}</span>
                <span className="nt-open-trade-side">{trade.side}</span>
                <span className="nt-open-trade-amount">{formatMoney(trade.stakeAmount, trade.currency)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
