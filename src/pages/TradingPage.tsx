import React from "react";
import "./TradingPage.css";

import {
  ASSETS,
  EXCHANGE_RATES,
  AssetSelector,
  TradingBottomNav,
  TradingChart,
  TradingHeader,
  TradingPanel,
  TradingQuickMenu,
  TradingSidebar,
  TradingToolbar,
} from "../components/trading";

import type {
  AccountType,
  Asset,
  AssetCategory,
  Candle,
  ChartType,
  Currency,
  ResultMarker,
  TradeMarker,
  TradeSide,
} from "../components/trading";

type BalancesUsd = Record<AccountType, number>;

const MIN_EXPIRY_SECONDS = 5;
const MAX_EXPIRY_SECONDS = 5 * 60 * 60;

/**
 * Moderate latency:
 * PocketOption-style OTC candles should not jump every few milliseconds.
 * This updates price smoothly about once per second.
 */
const FX_TICK_MS = 950;

/**
 * Realistic M1 candle formation:
 * one candle opens every 60 seconds.
 */
const M1_CANDLE_MS = 60_000;

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  KES: "KES",
  UGX: "UGX",
  TZS: "TZS",
  NGN: "NGN",
  XOF: "XOF",
  EUR: "€",
  CAD: "CAD",
  JPY: "¥",
  CNY: "¥",
  AOA: "AOA",
  ZAR: "R",
  BRL: "R$",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getFxVolatility(asset: Asset) {
  if (asset.basePrice < 3) return asset.basePrice * 0.00022;
  if (asset.basePrice < 200) return asset.basePrice * 0.00032;
  if (asset.basePrice < 5000) return asset.basePrice * 0.0002;
  return asset.basePrice * 0.00016;
}

function formatMoney(value: number, currency: Currency) {
  const symbol = CURRENCY_SYMBOLS[currency];

  const decimals =
    currency === "JPY" ||
    currency === "UGX" ||
    currency === "TZS" ||
    currency === "XOF"
      ? 0
      : 2;

  const safeValue = Number.isFinite(value) ? value : 0;

  const formatted = safeValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (
    currency === "USD" ||
    currency === "EUR" ||
    currency === "JPY" ||
    currency === "ZAR" ||
    currency === "BRL"
  ) {
    return `${symbol}${formatted}`;
  }

  return `${currency} ${formatted}`;
}

function formatExpiry(totalSeconds: number) {
  const safeSeconds = clamp(totalSeconds, MIN_EXPIRY_SECONDS, MAX_EXPIRY_SECONDS);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

function splitExpiry(totalSeconds: number) {
  const safeSeconds = clamp(totalSeconds, MIN_EXPIRY_SECONDS, MAX_EXPIRY_SECONDS);

  return {
    hours: Math.floor(safeSeconds / 3600),
    minutes: Math.floor((safeSeconds % 3600) / 60),
    seconds: safeSeconds % 60,
  };
}

function createInitialCandles(asset: Asset) {
  const candles: Candle[] = [];
  const volatility = getFxVolatility(asset);
  const now = Date.now();

  let price = asset.basePrice;
  let trend = 0;

  for (let index = 0; index < 96; index += 1) {
    if (index % 12 === 0) {
      trend = (Math.random() - 0.5) * volatility * 3.5;
    }

    const open = price;
    const bodyMove =
      trend +
      Math.sin(index / 8) * volatility * 2.4 +
      (Math.random() - 0.5) * volatility * 3.2;

    const close = Math.max(0.00001, open + bodyMove);
    const wickSize = volatility * (1.2 + Math.random() * 3.2);

    const high = Math.max(open, close) + wickSize;
    const low = Math.max(0.00001, Math.min(open, close) - wickSize);

    candles.push({
      open,
      high,
      low,
      close,
      time: now - (96 - index) * M1_CANDLE_MS,
    });

    price = close;
  }

  return candles;
}

function updateRealisticM1Candle(
  currentCandles: Candle[],
  asset: Asset,
  trendRef: React.MutableRefObject<number>,
  tickCounterRef: React.MutableRefObject<number>
) {
  const candles =
    currentCandles.length > 0 ? currentCandles.slice() : createInitialCandles(asset);

  const latest = candles[candles.length - 1];
  const volatility = getFxVolatility(asset);
  const now = Date.now();

  tickCounterRef.current += 1;

  /**
   * Change market tone slowly, not on every tick.
   * This creates more natural OTC movement instead of artificial spikes.
   */
  if (tickCounterRef.current % 16 === 0) {
    trendRef.current = (Math.random() - 0.5) * volatility * 0.55;
  }

  /**
   * Open a new M1 candle every 60 seconds.
   */
  if (now - latest.time >= M1_CANDLE_MS) {
    const tinyGap = (Math.random() - 0.5) * volatility * 0.35;
    const open = Math.max(0.00001, latest.close + tinyGap);

    candles.push({
      open,
      high: open,
      low: open,
      close: open,
      time: now,
    });

    return candles.slice(-110);
  }

  const candleAge = clamp((now - latest.time) / M1_CANDLE_MS, 0, 1);

  /**
   * FX-style tick:
   * - small random movement
   * - soft trend
   * - slight mean reversion
   * - tiny candle-age expansion
   */
  const microNoise = (Math.random() - 0.5) * volatility * 0.42;
  const slowWave = Math.sin(now / 9500) * volatility * 0.18;
  const meanReversion = (latest.open - latest.close) * 0.018 * candleAge;
  const ageExpansion = (Math.random() - 0.48) * volatility * 0.18 * candleAge;

  const nextClose = Math.max(
    0.00001,
    latest.close + trendRef.current + microNoise + slowWave + meanReversion + ageExpansion
  );

  candles[candles.length - 1] = {
    ...latest,
    close: nextClose,
    high: Math.max(latest.high, nextClose),
    low: Math.max(0.00001, Math.min(latest.low, nextClose)),
  };

  return candles.slice(-110);
}

export default function TradingPage() {
  const candlesRef = React.useRef<Candle[]>(createInitialCandles(ASSETS[0]));
  const expirySecondsRef = React.useRef(30 * 60);
  const marketTrendRef = React.useRef(0);
  const tickCounterRef = React.useRef(0);

  const [accountType, setAccountType] = React.useState<AccountType>("QT Demo");
  const [currency, setCurrency] = React.useState<Currency>("USD");

  const [balancesUsd, setBalancesUsd] = React.useState<BalancesUsd>({
    "QT Demo": 70000,
    "QT Real": 0,
  });

  const [selectedAsset, setSelectedAsset] = React.useState<Asset>(ASSETS[0]);
  const [activeCategory, setActiveCategory] =
    React.useState<AssetCategory>("Currencies");
  const [assetMenuOpen, setAssetMenuOpen] = React.useState(false);

  const [chartType, setChartType] = React.useState<ChartType>("Candlesticks");
  const [timeframe, setTimeframe] = React.useState("M1");
  const [timeframeOpen, setTimeframeOpen] = React.useState(false);

  const [indicatorOpen, setIndicatorOpen] = React.useState(false);
  const [selectedIndicators, setSelectedIndicators] = React.useState<string[]>([]);
  const [drawingOpen, setDrawingOpen] = React.useState(false);
  const [selectedTool, setSelectedTool] = React.useState("Cursor");

  const [expirySeconds, setExpirySeconds] = React.useState(30 * 60);
  const [amount, setAmount] = React.useState("100");
  const [payout, setPayout] = React.useState(92);

  const [candles, setCandles] = React.useState<Candle[]>(candlesRef.current);
  const [activeTrades, setActiveTrades] = React.useState<TradeMarker[]>([]);
  const [resultMarkers, setResultMarkers] = React.useState<ResultMarker[]>([]);

  const exchangeRate = EXCHANGE_RATES[currency];
  const displayedBalance = balancesUsd[accountType] * exchangeRate;

  const stakeAmount = Number(amount);
  const safeStakeAmount = Number.isFinite(stakeAmount) ? Math.max(0, stakeAmount) : 0;
  const stakeUsd = safeStakeAmount / exchangeRate;

  const expectedProfit = safeStakeAmount * (payout / 100);
  const expectedReturn = safeStakeAmount + expectedProfit;
  const canTrade = safeStakeAmount > 0 && stakeUsd <= balancesUsd[accountType];

  const expiryParts = splitExpiry(expirySeconds);

  React.useEffect(() => {
    expirySecondsRef.current = expirySeconds;
  }, [expirySeconds]);

  React.useEffect(() => {
    const freshCandles = createInitialCandles(selectedAsset);

    candlesRef.current = freshCandles;
    marketTrendRef.current = 0;
    tickCounterRef.current = 0;

    setCandles(freshCandles);
    setActiveTrades([]);
    setResultMarkers([]);
  }, [selectedAsset]);

  React.useEffect(() => {
    let frameId = 0;
    let lastUpdate = 0;

    const runMarket = (time: number) => {
      if (time - lastUpdate >= FX_TICK_MS) {
        const nextCandles = updateRealisticM1Candle(
          candlesRef.current,
          selectedAsset,
          marketTrendRef,
          tickCounterRef
        );

        candlesRef.current = nextCandles;
        setCandles(nextCandles);
        lastUpdate = time;
      }

      frameId = window.requestAnimationFrame(runMarket);
    };

    frameId = window.requestAnimationFrame(runMarket);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [selectedAsset]);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      const stablePulse = Math.floor(Math.random() * 5);
      const nextPayout = clamp(84 + selectedAsset.payoutBoost + stablePulse, 20, 92);
      setPayout(nextPayout);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [selectedAsset]);

  function handleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
      return;
    }

    document.documentElement.requestFullscreen().catch(() => undefined);
  }

  function handleTopUp() {
    window.alert("Top Up placeholder: connect this button to your NeuroOption deposit flow.");
  }

  function handleAssetChange(asset: Asset) {
    setSelectedAsset(asset);
    setActiveCategory(asset.category);
    setAssetMenuOpen(false);
  }

  function handleTimeframeChange(nextTimeframe: string) {
    setTimeframe(nextTimeframe);
    setTimeframeOpen(false);
  }

  function handleToolChange(tool: string) {
    setSelectedTool(tool);
    setDrawingOpen(false);
  }

  function handleIndicatorToggle(indicator: string) {
    setSelectedIndicators((current) => {
      if (current.includes(indicator)) {
        return current.filter((item) => item !== indicator);
      }

      return [...current, indicator];
    });
  }

  function handleAdjustExpiry(unit: "hours" | "minutes" | "seconds", delta: number) {
    const unitSeconds = unit === "hours" ? 3600 : unit === "minutes" ? 60 : 1;

    setExpirySeconds((current) => {
      const nextValue = clamp(
        current + unitSeconds * delta,
        MIN_EXPIRY_SECONDS,
        MAX_EXPIRY_SECONDS
      );

      expirySecondsRef.current = nextValue;
      return nextValue;
    });
  }

  function handleTrade(side: TradeSide) {
    if (!canTrade) return;

    const latestCandle = candlesRef.current[candlesRef.current.length - 1];
    if (!latestCandle) return;

    const tradeId = `${side}-${Date.now()}-${Math.random()}`;
    const capturedAccountType = accountType;
    const capturedCurrency = currency;
    const capturedExchangeRate = EXCHANGE_RATES[capturedCurrency];

    const capturedStakeAmount = safeStakeAmount;
    const capturedStakeUsd = capturedStakeAmount / capturedExchangeRate;
    const capturedProfitAmount = capturedStakeAmount * (payout / 100);
    const capturedReturnAmount = capturedStakeAmount + capturedProfitAmount;
    const capturedReturnUsd = capturedReturnAmount / capturedExchangeRate;

    const entryPrice = latestCandle.close;

    const marker: TradeMarker = {
      id: tradeId,
      side,
      entryPrice,
      label: `${side} ${formatMoney(capturedStakeAmount, capturedCurrency)}`,
    };

    setBalancesUsd((current) => ({
      ...current,
      [capturedAccountType]: Math.max(0, current[capturedAccountType] - capturedStakeUsd),
    }));

    setActiveTrades((current) => [...current, marker]);

    window.setTimeout(() => {
      const closePrice =
        candlesRef.current[candlesRef.current.length - 1]?.close ?? entryPrice;

      const won = side === "BUY" ? closePrice > entryPrice : closePrice < entryPrice;

      setActiveTrades((current) => current.filter((trade) => trade.id !== tradeId));

      if (won) {
        setBalancesUsd((current) => ({
          ...current,
          [capturedAccountType]: current[capturedAccountType] + capturedReturnUsd,
        }));
      }

      const resultId = `${tradeId}-result`;

      const resultMarker: ResultMarker = {
        id: resultId,
        price: closePrice,
        won,
        label: won
          ? `✓ ${formatMoney(capturedReturnAmount, capturedCurrency)}`
          : `✕ ${formatMoney(0, capturedCurrency)}`,
      };

      setResultMarkers((current) => [...current, resultMarker]);

      window.setTimeout(() => {
        setResultMarkers((current) => current.filter((item) => item.id !== resultId));
      }, 10000);
    }, expirySecondsRef.current * 1000);
  }

  return (
    <main className="nt-page">
      <TradingHeader
        accountType={accountType}
        currency={currency}
        balanceText={formatMoney(displayedBalance, currency)}
        onAccountChange={setAccountType}
        onCurrencyChange={setCurrency}
        onTopUp={handleTopUp}
        onFullscreen={handleFullscreen}
      />

      <section className="nt-page-body">
        <TradingSidebar />

        <section className="nt-main-chart">
          <div className="nt-page-asset">
            <AssetSelector
              selectedAsset={selectedAsset}
              activeCategory={activeCategory}
              open={assetMenuOpen}
              onToggle={() => setAssetMenuOpen((current) => !current)}
              onCategoryChange={setActiveCategory}
              onAssetChange={handleAssetChange}
            />
          </div>

          <TradingToolbar
            timeframe={timeframe}
            chartType={chartType}
            selectedTool={selectedTool}
            selectedIndicators={selectedIndicators}
            timeframeOpen={timeframeOpen}
            indicatorsOpen={indicatorOpen}
            drawingOpen={drawingOpen}
            onTimeframeToggle={() => setTimeframeOpen((current) => !current)}
            onIndicatorsToggle={() => setIndicatorOpen((current) => !current)}
            onDrawingToggle={() => setDrawingOpen((current) => !current)}
            onTimeframeChange={handleTimeframeChange}
            onChartTypeChange={setChartType}
            onToolChange={handleToolChange}
            onIndicatorToggle={handleIndicatorToggle}
          />

          <TradingChart
            asset={selectedAsset}
            candles={candles}
            chartType={chartType}
            timeframe={timeframe}
            activeTrades={activeTrades}
            resultMarkers={resultMarkers}
          />

          <div className="nt-chart-footer">
            <button type="button">←</button>
            <button type="button">{timeframe} ▴</button>
            <strong>{selectedAsset.label}</strong>
          </div>
        </section>

        <TradingPanel
          expiryText={formatExpiry(expirySeconds)}
          expiryParts={expiryParts}
          amount={amount}
          currency={currency}
          payout={payout}
          expectedProfitText={formatMoney(expectedProfit, currency)}
          expectedReturnText={formatMoney(expectedReturn, currency)}
          canTrade={canTrade}
          onAdjustExpiry={handleAdjustExpiry}
          onAmountChange={setAmount}
          onTrade={handleTrade}
        />

        <TradingQuickMenu onFullscreen={handleFullscreen} />
      </section>

      <TradingBottomNav />
    </main>
  );
}