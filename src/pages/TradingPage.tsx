import React from "react";
import "./TradingPage.css";

import {
  ASSETS,
  EXCHANGE_RATES,
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
  buildTimeframeCandles,
  TIMEFRAME_SECONDS,
} from "../components/trading/timeframeEngine";

type BalancesUsd = Record<AccountType, number>;
type EmptyPanel = "openTrades" | "history" | "signals" | null;

type BackendAsset = {
  symbol: string;
  label: string;
  category: string;
  basePrice: number;
  precision: number;
  payoutBoost: number;
  isActive?: boolean;
};

type BackendCandle = {
  open: number;
  high: number;
  low: number;
  close: number;
  time?: number;
  openTime?: string;
  closeTime?: string;
};

type BackendAssetsResponse = {
  assets: BackendAsset[];
};

type BackendCandlesResponse = {
  asset?: BackendAsset;
  timeframe?: string;
  serverTime?: string;
  candles: BackendCandle[];
};

const API_BASE_URL = (
  (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:4000"
).replace(/\/$/, "");

const BACKEND_POLL_MS = 500;
const VISUAL_REFRESH_MS = 500;

const MIN_EXPIRY_SECONDS = 5;
const MAX_EXPIRY_SECONDS = 5 * 60 * 60;

const DEFAULT_ASSET =
  ASSETS.find((asset) => asset.symbol === "EUR/USD OTC") ?? ASSETS[0];

const VALID_CATEGORIES: AssetCategory[] = [
  "Currencies",
  "Cryptocurrencies",
  "Stocks",
  "Indices",
  "Commodities",
];

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

function normalizeCategory(category: string): AssetCategory {
  const found = VALID_CATEGORIES.find(
    (item) => item.toLowerCase() === category.toLowerCase()
  );

  return found ?? "Currencies";
}

function normalizeAsset(asset: BackendAsset): Asset {
  return {
    symbol: asset.symbol,
    label: asset.label,
    category: normalizeCategory(asset.category),
    basePrice: Number(asset.basePrice),
    precision: Number(asset.precision),
    payoutBoost: Number(asset.payoutBoost),
  };
}

function normalizeCandle(candle: BackendCandle): Candle {
  return {
    open: Number(candle.open),
    high: Number(candle.high),
    low: Number(candle.low),
    close: Number(candle.close),
    time: Number(
      candle.time ?? new Date(candle.openTime ?? Date.now()).getTime()
    ),
  };
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
  const safeSeconds = clamp(
    totalSeconds,
    MIN_EXPIRY_SECONDS,
    MAX_EXPIRY_SECONDS
  );

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

function splitExpiry(totalSeconds: number) {
  const safeSeconds = clamp(
    totalSeconds,
    MIN_EXPIRY_SECONDS,
    MAX_EXPIRY_SECONDS
  );

  return {
    hours: Math.floor(safeSeconds / 3600),
    minutes: Math.floor((safeSeconds % 3600) / 60),
    seconds: safeSeconds % 60,
  };
}

function calculateSentiment(candles: Candle[]) {
  const latestCandles = candles.slice(-24);

  if (latestCandles.length < 2) {
    return 50;
  }

  const firstClose = latestCandles[0].close;
  const lastClose = latestCandles[latestCandles.length - 1].close;

  const bullishCandles = latestCandles.filter(
    (candle) => candle.close >= candle.open
  ).length;

  const bullishRatio = bullishCandles / latestCandles.length;
  const trendPressure = ((lastClose - firstClose) / firstClose) * 9000;

  return Math.round(clamp(40 + bullishRatio * 18 + trendPressure, 20, 60));
}

function getEmptyPanelTitle(panel: EmptyPanel) {
  if (panel === "openTrades") return "Open trades";
  if (panel === "history") return "Trades history";
  if (panel === "signals") return "Signals";
  return "";
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export default function TradingPage() {
  const backendM1CandlesRef = React.useRef<Candle[]>([]);
  const candlesRef = React.useRef<Candle[]>([]);
  const expirySecondsRef = React.useRef(45);

  const [accountType, setAccountType] = React.useState<AccountType>("QT Demo");
  const [currency, setCurrency] = React.useState<Currency>("USD");

  const [balancesUsd, setBalancesUsd] = React.useState<BalancesUsd>({
    "QT Demo": 70000,
    "QT Real": 0,
  });

  const [availableAssets, setAvailableAssets] = React.useState<Asset[]>(ASSETS);
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
  const [payout, setPayout] = React.useState(91);

  const [candles, setCandles] = React.useState<Candle[]>([]);
  const [activeTrades, setActiveTrades] = React.useState<TradeMarker[]>([]);
  const [resultMarkers, setResultMarkers] = React.useState<ResultMarker[]>([]);

  const [nowMs, setNowMs] = React.useState(Date.now());
  const [sentiment, setSentiment] = React.useState(50);
  const [emptyPanel, setEmptyPanel] = React.useState<EmptyPanel>(null);

  const exchangeRate = EXCHANGE_RATES[currency];
  const displayedBalance = balancesUsd[accountType] * exchangeRate;

  const stakeAmount = Number(amount);
  const safeStakeAmount = Number.isFinite(stakeAmount)
    ? Math.max(0, stakeAmount)
    : 0;

  const stakeUsd = safeStakeAmount / exchangeRate;
  const expectedProfit = safeStakeAmount * (payout / 100);
  const expectedReturn = safeStakeAmount + expectedProfit;
  const canTrade = safeStakeAmount > 0 && stakeUsd <= balancesUsd[accountType];

  const expiryParts = splitExpiry(expirySeconds);

  const assetCategories = Array.from(
    new Set(availableAssets.map((asset) => asset.category))
  ) as AssetCategory[];

  const filteredAssets = availableAssets.filter(
    (asset) => asset.category === activeCategory
  );

  const rebuildDisplayCandles = React.useCallback(
    (asset: Asset, nextTimeframe: string, backendCandles: Candle[]) => {
      const nextCandles = buildTimeframeCandles(
        asset,
        nextTimeframe,
        backendCandles,
        Date.now()
      );

      candlesRef.current = nextCandles;

      setCandles(nextCandles);
      setSentiment(calculateSentiment(nextCandles));

      return nextCandles;
    },
    []
  );

  const loadBackendCandles = React.useCallback(
    async (asset: Asset, signal?: AbortSignal) => {
      const encodedAsset = encodeURIComponent(asset.symbol);

      const data = await fetchJson<BackendCandlesResponse>(
        `${API_BASE_URL}/market-data/candles?asset=${encodedAsset}&timeframe=M1&limit=120`,
        signal
      );

      const nextBackendCandles = data.candles.map(normalizeCandle);

      if (nextBackendCandles.length < 2) {
        rebuildDisplayCandles(asset, timeframe, []);
        return;
      }

      backendM1CandlesRef.current = nextBackendCandles;

      rebuildDisplayCandles(asset, timeframe, nextBackendCandles);

      setNowMs(data.serverTime ? new Date(data.serverTime).getTime() : Date.now());
    },
    [rebuildDisplayCandles, timeframe]
  );

  React.useEffect(() => {
    expirySecondsRef.current = expirySeconds;
  }, [expirySeconds]);

  React.useEffect(() => {
    let cancelled = false;

    const loadAssets = async () => {
      try {
        const data = await fetchJson<BackendAssetsResponse>(
          `${API_BASE_URL}/market-data/assets`
        );

        if (cancelled) return;

        const nextAssets = data.assets.map(normalizeAsset);

        if (nextAssets.length > 0) {
          setAvailableAssets(nextAssets);

          const preferred =
            nextAssets.find((asset) => asset.symbol === selectedAsset.symbol) ??
            nextAssets.find((asset) => asset.symbol === "EUR/USD OTC") ??
            nextAssets[0];

          setSelectedAsset(preferred);
          setActiveCategory(preferred.category);
        }
      } catch {
        if (!cancelled) {
          setAvailableAssets(ASSETS);
        }
      }
    };

    loadAssets();

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    backendM1CandlesRef.current = [];

    rebuildDisplayCandles(selectedAsset, timeframe, []);
    setActiveTrades([]);
    setResultMarkers([]);
    setActiveCategory(selectedAsset.category);
  }, [selectedAsset, timeframe, rebuildDisplayCandles]);

  React.useEffect(() => {
    let stopped = false;
    let controller: AbortController | null = null;

    const run = async () => {
      controller?.abort();
      controller = new AbortController();

      try {
        await loadBackendCandles(selectedAsset, controller.signal);
      } catch {
        if (!stopped) {
          rebuildDisplayCandles(
            selectedAsset,
            timeframe,
            backendM1CandlesRef.current
          );
        }
      }
    };

    run();

    const intervalId = window.setInterval(run, BACKEND_POLL_MS);

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
      controller?.abort();
    };
  }, [selectedAsset, timeframe, loadBackendCandles, rebuildDisplayCandles]);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      const timeframeSeconds = TIMEFRAME_SECONDS[timeframe] ?? 60;

      if (timeframeSeconds === 60 && backendM1CandlesRef.current.length >= 5) {
        return;
      }

      rebuildDisplayCandles(
        selectedAsset,
        timeframe,
        backendM1CandlesRef.current
      );
    }, VISUAL_REFRESH_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [selectedAsset, timeframe, rebuildDisplayCandles]);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowMs((current) => current + 1000);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      const pulse = Math.floor(Math.random() * 5);
      const nextPayout = clamp(84 + selectedAsset.payoutBoost + pulse, 20, 92);

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

    rebuildDisplayCandles(
      selectedAsset,
      nextTimeframe,
      backendM1CandlesRef.current
    );
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

  function handleAdjustExpiry(
    unit: "hours" | "minutes" | "seconds",
    delta: number
  ) {
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

      const won =
        side === "BUY" ? closePrice > entryPrice : closePrice < entryPrice;

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
            <div className="nt-asset-selector">
              <button
                type="button"
                className="nt-asset-trigger"
                onClick={() => setAssetMenuOpen((current) => !current)}
              >
                <span>{selectedAsset.symbol}</span>
                <b>⌄</b>
              </button>

              {assetMenuOpen && (
                <div className="nt-asset-menu">
                  <div className="nt-asset-tabs">
                    {assetCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        className={category === activeCategory ? "active" : ""}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  <div className="nt-asset-list">
                    {filteredAssets.map((asset) => (
                      <button
                        key={asset.symbol}
                        type="button"
                        className={
                          asset.symbol === selectedAsset.symbol ? "active" : ""
                        }
                        onClick={() => handleAssetChange(asset)}
                      >
                        <strong>{asset.symbol}</strong>
                        <span>
                          {asset.label} • Payout boost {asset.payoutBoost}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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