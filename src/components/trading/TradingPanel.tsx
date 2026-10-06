import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Coins,
  Minus,
  Plus,
} from "lucide-react";
import type { Currency, TradeSide } from "./trading.types";
import type { BackendTrade } from "./tradesApi";
import { formatMoney } from "./tradesApi";

type ExpiryParts = {
  hours: number;
  minutes: number;
  seconds: number;
};

type TradingPanelProps = {
  assetSymbol?: string;
  priceText?: string;
  changePercent?: number;
  expiryText: string;
  expiryParts: ExpiryParts;
  amount: string;
  currency: Currency;
  payout: number | null;
  expectedProfitText: string;
  expectedReturnText: string;
  canTrade: boolean;
  tradeDisabledReason?: string;
  sentiment: number;
  openTrades: BackendTrade[];
  onAdjustExpiry: (unit: "hours" | "minutes" | "seconds", delta: number) => void;
  onAmountChange: (amount: string) => void;
  onTrade: (side: TradeSide) => void;
};

export default function TradingPanel({
  assetSymbol,
  priceText,
  changePercent = 0,
  expiryText,
  expiryParts,
  amount,
  currency,
  payout,
  expectedProfitText,
  expectedReturnText,
  canTrade,
  tradeDisabledReason,
  sentiment,
  openTrades,
  onAdjustExpiry,
  onAmountChange,
  onTrade,
}: TradingPanelProps) {
  const numericAmount = Number(amount || 0);
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency;
  const sellSentiment = 100 - sentiment;
  const totalSeconds = expiryParts.hours * 3600 + expiryParts.minutes * 60 + expiryParts.seconds;
  const durationLabel = totalSeconds % 60 === 0 ? `${totalSeconds / 60} min` : `${totalSeconds} sec`;

  return (
    <aside className="nt-trade-panel nt-white-panel">
      {assetSymbol && priceText && (
        <section className="nt-panel-ticker" aria-label="Selected asset">
          <div>
            <small>{assetSymbol}</small>
            <strong>{priceText}</strong>
          </div>
          <span className={changePercent >= 0 ? "is-up" : "is-down"}>
            {changePercent >= 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </span>
        </section>
      )}

      <section className="nt-white-field nt-field-time">
        <h3><Clock size={14} aria-hidden="true" /> Time</h3>

        <div className="nt-white-input">
          <strong>{durationLabel}</strong>
          <div>
            <button type="button" onClick={() => onAdjustExpiry("seconds", -1)} aria-label="Decrease expiration">
              <Minus size={14} />
            </button>
            <button type="button" onClick={() => onAdjustExpiry("seconds", 1)} aria-label="Increase expiration">
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="nt-white-expiry" aria-label={`Expiration ${expiryText}`}>
          <span>{String(expiryParts.hours).padStart(2, "0")}h</span>
          <span>{String(expiryParts.minutes).padStart(2, "0")}m</span>
          <span>{String(expiryParts.seconds).padStart(2, "0")}s</span>
        </div>
      </section>

      <section className="nt-white-field nt-field-amount">
        <h3><Coins size={14} aria-hidden="true" /> Amount</h3>

        <label className="nt-white-input">
          <span className="nt-amount-currency" aria-hidden="true">{currencySymbol}</span>
          <input
            type="number"
            min="1"
            inputMode="decimal"
            aria-label={`Trade amount in ${currency}`}
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
          />
          <div>
            <button
              type="button"
              onClick={() => onAmountChange(String(Math.max(1, numericAmount - 1)))}
              aria-label="Decrease amount"
            >
              <Minus size={14} />
            </button>
            <button type="button" onClick={() => onAmountChange(String(numericAmount + 1))} aria-label="Increase amount">
              <Plus size={14} />
            </button>
          </div>
        </label>

        <small>{currency}</small>
      </section>

      <section className="nt-white-payout" aria-label="Trade payout and potential profit">
        <div><span>Payout</span><strong>{payout === null ? "Unavailable" : `+${payout}%`}</strong></div>
        <div><span>Profit</span><small>{expectedProfitText}</small></div>
      </section>

      <button
        type="button"
        className="nt-buy"
        disabled={!canTrade}
        onClick={() => onTrade("BUY")}
      >
        <span>Buy</span>
        <ArrowUpRight size={20} aria-hidden="true" />
      </button>

      <button
        type="button"
        className="nt-sell"
        disabled={!canTrade}
        onClick={() => onTrade("SELL")}
      >
        <span>Sell</span>
        <ArrowDownRight size={20} aria-hidden="true" />
      </button>

      {tradeDisabledReason && <p className="nt-trade-status" role="status">{tradeDisabledReason}</p>}
      <section className="nt-white-sentiment">
        <div>
          <span>Sentiment</span>
          <small>{sentiment}%</small>
        </div>

        <div
          className="bar"
          style={{
            background: `linear-gradient(90deg, var(--positive) 0 ${sentiment}%, var(--negative) ${sentiment}% 100%)`,
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
          <Link to="/open-trades">View all <ArrowRight size={13} aria-hidden="true" /></Link>
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
