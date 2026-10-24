import { useEffect, useState } from "react";
import { marketQuotesApi, type MarketQuote } from "../../api";

const POLL_MS = 5000;

/** Shown only until the live feed answers (or if the server is asleep). */
export const FALLBACK_QUOTES: MarketQuote[] = [
  { symbol: "EUR/USD OTC", label: "Euro / US Dollar", category: "Currencies", precision: 5, price: 1.06942, changePercent: 0.23, payout: 92 },
  { symbol: "GBP/USD OTC", label: "British Pound / US Dollar", category: "Currencies", precision: 5, price: 1.24561, changePercent: -0.11, payout: 87 },
  { symbol: "BTC/USD OTC", label: "Bitcoin / US Dollar", category: "Cryptocurrencies", precision: 2, price: 68432.1, changePercent: 1.42, payout: 85 },
  { symbol: "ETH/USD OTC", label: "Ethereum / US Dollar", category: "Cryptocurrencies", precision: 2, price: 3842.21, changePercent: 0.63, payout: 85 },
  { symbol: "USD/JPY OTC", label: "US Dollar / Japanese Yen", category: "Currencies", precision: 3, price: 148.321, changePercent: -0.21, payout: 82 },
  { symbol: "AUD/USD OTC", label: "Australian Dollar / US Dollar", category: "Currencies", precision: 5, price: 0.66312, changePercent: 0.18, payout: 80 },
  { symbol: "Gold OTC", label: "Gold", category: "Commodities", precision: 2, price: 2657.84, changePercent: 0.42, payout: 80 },
  { symbol: "US 500 OTC", label: "US 500", category: "Indices", precision: 1, price: 5862.4, changePercent: 0.38, payout: 80 },
  { symbol: "WTI Oil OTC", label: "WTI Crude Oil", category: "Commodities", precision: 2, price: 71.84, changePercent: -0.21, payout: 79 },
  { symbol: "Tesla OTC", label: "Tesla", category: "Stocks", precision: 2, price: 249.38, changePercent: 1.18, payout: 78 },
  { symbol: "Apple OTC", label: "Apple", category: "Stocks", precision: 2, price: 182.16, changePercent: -0.12, payout: 78 },
  { symbol: "US100 OTC", label: "US Tech 100", category: "Indices", precision: 1, price: 19421.5, changePercent: 0.27, payout: 80 },
  { symbol: "EUR/GBP OTC", label: "Euro / British Pound", category: "Currencies", precision: 5, price: 0.85921, changePercent: 0.09, payout: 76 },
];

export function formatPrice(quote: Pick<MarketQuote, "price" | "precision">) {
  return quote.price.toLocaleString("en-US", {
    minimumFractionDigits: quote.precision,
    maximumFractionDigits: quote.precision,
  });
}

export function formatChange(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

/** Live quotes from the backend, refreshed every few seconds while visible. */
export function useQuotes() {
  const [quotes, setQuotes] = useState<MarketQuote[]>(FALLBACK_QUOTES);
  const [live, setLive] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(0);

  useEffect(() => {
    let active = true;
    let timer: number | undefined;

    const load = async () => {
      if (!document.hidden) {
        try {
          const data = await marketQuotesApi.quotes();
          const validQuotes = Array.isArray(data.quotes) ? data.quotes.filter((quote) =>
            typeof quote.symbol === "string" && typeof quote.label === "string" && typeof quote.category === "string" &&
            Number.isFinite(quote.price) && quote.price > 0 && Number.isInteger(quote.precision) && quote.precision >= 0 && quote.precision <= 8 &&
            Number.isFinite(quote.changePercent) && Number.isFinite(quote.payout) && quote.payout >= 0 && quote.payout <= 100
          ) : [];
          if (active) {
            if (validQuotes.length) { setQuotes(validQuotes); setUpdatedAt(Date.now()); setLive(true); }
            else setLive(false);
          }
        } catch {
          // Retain the last list for browsing, but never mark an unavailable feed live.
          if (active) setLive(false);
        }
      }
      if (active) timer = window.setTimeout(load, POLL_MS);
    };

    load();
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  return { quotes, live, updatedAt };
}
