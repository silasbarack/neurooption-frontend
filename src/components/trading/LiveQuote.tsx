import React from "react";
import type { Candle } from "./trading.types";

type LiveQuoteProps = {
  candlesRef: React.MutableRefObject<Candle[]>;
  marketFrameVersionRef: React.MutableRefObject<number>;
  precision: number;
  showChange?: boolean;
  priceClassName?: string;
  changeTag?: "small" | "span";
  /** Render the price, the change, or both. */
  part?: "both" | "price" | "change";
};

function readQuote(candles: Candle[]) {
  const last = candles[candles.length - 1];
  const first = candles[0];
  if (!last) return null;
  const change = first?.open ? ((last.close - first.open) / first.open) * 100 : 0;
  return { price: last.close, change };
}

/**
 * Current price and session change, kept in step with the chart.
 * Same-minute ticks mutate the candle array without a React render, so this
 * writes straight to its own DOM nodes whenever the market version moves.
 */
export default function LiveQuote({
  candlesRef,
  marketFrameVersionRef,
  precision,
  showChange = true,
  priceClassName,
  changeTag = "small",
  part = "both",
}: LiveQuoteProps) {
  const priceRef = React.useRef<HTMLElement | null>(null);
  const changeRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    let frame = 0;
    let seenVersion = -1;

    const paint = () => {
      const version = marketFrameVersionRef.current;
      if (version !== seenVersion) {
        seenVersion = version;
        const quote = readQuote(candlesRef.current);
        if (priceRef.current) {
          priceRef.current.textContent = quote ? quote.price.toFixed(precision) : "—";
        }
        if (changeRef.current && quote) {
          changeRef.current.textContent = `${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)}%`;
          changeRef.current.className = quote.change >= 0 ? "is-up" : "is-down";
        }
      }
      frame = window.requestAnimationFrame(paint);
    };

    frame = window.requestAnimationFrame(paint);
    return () => window.cancelAnimationFrame(frame);
  }, [candlesRef, marketFrameVersionRef, precision]);

  const ChangeTag = changeTag;

  return (
    <>
      {part !== "change" && (
        <strong ref={(node) => { priceRef.current = node; }} className={priceClassName} />
      )}
      {showChange && part !== "price" && (
        <ChangeTag ref={(node: HTMLElement | null) => { changeRef.current = node; }} />
      )}
    </>
  );
}
