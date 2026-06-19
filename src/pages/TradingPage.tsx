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

import {
  LIVE_TICK_MS,
  MAX_EXPIRY_SECONDS,
  MIN_EXPIRY_SECONDS,
  createInitialCandles,
  updateLiveM1Candle,
} from "../components/trading/chartEngine";

type BalancesUsd = Record<AccountType, number>;
type EmptyPanel = "openTrades" | "history" | "signals" | null;

const DEFAULT_ASSET = ASSETS.find((asset) => asset.symbol === "EUR/USD OTC") ?? ASSETS[0];

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

function getEmptyPanelTitle(panel: EmptyPanel) {
  if (panel === "openTrades") return "Open trades";
  if (panel === "history") return "Trades history";
  if (panel === "signals") return "Signals";
  return "";
}

export default function TradingPage() {
  const candlesRef = React.useRef<Candle[]>(createInitialCandles(DEFAULT_ASSET));
  const expirySecondsRef = React.useRef(45);

  const [accountType, setAccountType] = React.useState<AccountType>("QT Demo");
  const [currency, setCurrency] = React.useState<Currency>("USD");

  const [balancesUsd, setBalancesUsd] = React.useState<BalancesUsd>({
    "QT Demo": 70000,
    "QT Real": 0,
  });

  const [selectedAsset, setSelectedAsset] = React.useState<Asset>(DEFAULT_ASSET);
  const [activeCategory, setActiveCategory] = React.useState<AssetCategory>(
    DEFAULT_ASSET.category
  );
  const [assetMenuOpen, setAssetMenuOpen] = React.useState(false);

  const [chartType, setChartType] = React.useState<ChartType>("Candlesticks");
  const [timeframe, setTimeframe] = React.useState("M1");
  const [timeframeOpen, setTimeframeOpen] = React.useState(false);

  const [indicatorOpen, setIndicatorOpen] = React.useState(false);
  const [selectedIndicators, setSelectedIndicators] = React.useState<string[]>([
    "Moving Average",
    "Exponential MA",
    "Weighted MA",
    "RSI",
  ]);

  const [drawingOpen, setDrawingOpen] = React.useState(false);
  const [selectedTool, setSelectedTool] = React.useState("Cursor");

  const [expirySeconds, setExpirySeconds] = React.useState(45);
  const [amount, setAmount] = React.useState("100");
  const [payout, setPayout] = React.useState(92);

  const [candles, setCandles] = React.useState<Candle[]>(candlesRef.current);
  const [activeTrades, setActiveTrades] = React.useState<TradeMarker[]>([]);
  const [resultMarkers, setResultMarkers] = React.useState<ResultMarker[]>([]);

  const [nowMs, setNowMs] = React.useState(Date.now());
  const [sentiment, setSentiment] = React.useState(50);
  const [emptyPanel, setEmptyPanel] = React.useState<EmptyPanel>(null);

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

    setCandles(freshCandles);
    setActiveTrades([]);
    setResultMarkers([]);
    setActiveCategory(selectedAsset.category);
  }, [selectedAsset]);

  React.useEffect(() => {
    let frameId = 0;
    let lastTick = 0;

    const runMarket = (time: number) => {
      if (time - lastTick >= LIVE_TICK_MS) {
        const nextCandles = updateLiveM1Candle(candlesRef.current, selectedAsset);

        candlesRef.current = nextCandles;

        setCandles(nextCandles);
        lastTick = time;
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

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      const latestCandles = candlesRef.current.slice(-24);

      if (latestCandles.length < 2) {
        setNowMs(Date.now());
        return;
      }

      const firstClose = latestCandles[0].close;
      const lastClose = latestCandles[latestCandles.length - 1].close;
      const bullishCandles = latestCandles.filter(
        (candle) => candle.close >= candle.open
      ).length;

      const bullishRatio = bullishCandles / latestCandles.length;
      const trendPressure = ((lastClose - firstClose) / firstClose) * 9000;

      const nextSentiment = clamp(40 + bullishRatio * 18 + trendPressure, 20, 60);

      setSentiment(Math.round(nextSentiment));
      setNowMs(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  function handleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
      return;
    }

    document.documentElement.requestFullscreen().catch(() => undefined);
  }

  function handleTopUp() {
    window.alert("Deposit placeholder: connect this button to your NeuroOption deposit flow.");
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
      [capturedAccountType]: Math.max(
        0,
        current[capturedAccountType] - capturedStakeUsd
      ),
    }));

    setActiveTrades((current) => [...current, marker]);

    window.setTimeout(() => {
      const closePrice =
        candlesRef.current[candlesRef.current.length - 1]?.close ?? entryPrice;

      const won = side === "BUY" ? closePrice > entryPrice : closePrice < entryPrice;

      setActiveTrades((current) =>
        current.filter((trade) => trade.id !== tradeId)
      );

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
        setResultMarkers((current) =>
          current.filter((item) => item.id !== resultId)
        );
      }, 10000);
    }, expirySecondsRef.current * 1000);
  }

  return (
    <main className="nt-page nt-light-page">
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
            expirySeconds={expirySeconds}
            nowMs={nowMs}
            selectedIndicators={selectedIndicators}
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
          sentiment={sentiment}
          onAdjustExpiry={handleAdjustExpiry}
          onAmountChange={setAmount}
          onTrade={handleTrade}
        />

        <TradingQuickMenu
          onFullscreen={handleFullscreen}
          onPanelOpen={setEmptyPanel}
        />
      </section>

      <TradingBottomNav onPanelOpen={setEmptyPanel} />

      {emptyPanel && (
        <section className="nt-empty-panel">
          <div className="nt-empty-card">
            <button
              type="button"
              className="nt-empty-close"
              onClick={() => setEmptyPanel(null)}
            >
              ×
            </button>

            <h2>{getEmptyPanelTitle(emptyPanel)}</h2>
            <p>No records yet.</p>

            <small>
              {emptyPanel === "signals"
                ? "Signals will appear here when your signal service is connected."
                : "Your data will appear here after users start trading."}
            </small>
          </div>
        </section>
      )}
    </main>
  );
}