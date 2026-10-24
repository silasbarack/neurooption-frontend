import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { MarketQuote } from "../../api/account.api";
import AssetIcon from "./AssetIcon";
import { formatChange, formatPrice } from "./useQuotes";
type AssetRowProps = { quote: MarketQuote; favorite: boolean; onToggleFavorite: (symbol: string) => void };
export default function AssetRow({ quote, favorite, onToggleFavorite }: AssetRowProps) {
  return (
    <li className="mk-row">
      <Link to="/trading" state={{ symbol: quote.symbol }} className="mk-asset-link" aria-label={`Trade ${quote.symbol}`}>
        <span className="mk-asset">
          <AssetIcon symbol={quote.symbol} category={quote.category} size={34} />
          <span><b>{quote.symbol}</b><small>{quote.label}</small>
            <small className="mk-mobile-price">{formatPrice(quote)} <em className={quote.changePercent >= 0 ? "neo-up" : "neo-down"}>{formatChange(quote.changePercent)}</em></small>
          </span>
        </span>
        <span className="mk-price">{formatPrice(quote)}</span>
        <span className={`mk-change ${quote.changePercent >= 0 ? "neo-up" : "neo-down"}`}>{formatChange(quote.changePercent)}</span>
        <span className="mk-payout">{quote.payout}%</span>
      </Link>
      <button type="button" className={`mk-star ${favorite ? "is-on" : ""}`}
        aria-label={favorite ? `Remove ${quote.symbol} from favourites` : `Add ${quote.symbol} to favourites`}
        aria-pressed={favorite} onClick={() => onToggleFavorite(quote.symbol)}>
        <Star size={18} aria-hidden="true" fill={favorite ? "currentColor" : "none"} />
      </button>
    </li>
  );
}
