import React from "react";
import "./TradingPage.css";

import {
  ASSETS,
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
  DEFAULT_INDICATOR_SETTINGS,
  DEFAULT_INDICATOR_STYLES,
  type IndicatorSettingsMap,
  type IndicatorStylesMap,
  updateIndicatorSetting,
  updateIndicatorStyle,
} from "../components/trading/indicator-settings";

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
  volume?: number;
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

type BackendWalletResponse = {
  userId: string;
  accountType: AccountType;
  currency: Currency;
  balanceUsd: number;
  balance: number;
  updatedAt?: string;
};

type BackendTradeStatus = "PENDING" | "WON" | "LOST" | "DRAW";

type BackendTrade = {
  id: string;
  userId: string;
  asset: string;
  timeframe: string;
  side: TradeSide;
  accountType: AccountType;
  currency: Currency;

  stakeAmount: number;
  stakeUsd: number;

  payoutPercent: number;
  expectedProfitAmount: number;
  expectedProfitUsd: number;
  expectedReturnAmount: number;
  expectedReturnUsd: number;

  entryPrice: number;
  entryTime: number;
  expirySeconds: number;
  expiryTime: number;

  status: BackendTradeStatus;
  closePrice?: number;
  settledAt?: number;

  resultAmount?: number;
  resultUsd?: number;
  profitAmount?: number;
  profitUsd?: number;
};

type PlaceTradeResponse = {
  trade: BackendTrade;
  wallet: BackendWalletResponse;
};

const API_BASE_URL = (
  (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:4000"
).replace(/\/$/, "");

const USER_ID = "demo-user";

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

const DEFAULT_SELECTED_INDICATORS = ["Moving Average", "MACD"];

function timeframeToSeconds(timeframe: string) {
  const normalized = timeframe.trim().toUpperCase();
  const value = Number(normalized.slice(1)) || 1;

  if (normalized.startsWith("S")) return value;
  if (normalized.startsWith("M")) return value * 60;
  if (normalized.startsWith("H")) return value * 60 * 60;
  if (normalized.startsWith("D")) return value * 24 * 60 * 60;

  return 60;
}

function getBackendLimit(timeframe: string) {
  const seconds = timeframeToSeconds(timeframe);

  if (seconds <= 5) return 500;
  if (seconds <= 10) return 500;
  if (seconds <= 15) return 480;
  if (seconds <= 30) return 420;
  if (seconds <= 60) return 360;
  if (seconds <= 120) return 320;
  if (seconds <= 180) return 280;
  if (seconds <= 300) return 240;
  if (seconds <= 600) return 220;
  if (seconds <= 900) return 200;
  if (seconds <= 1800) return 160;
  if (seconds <= 3600) return 120;

  return 90;
}

function getBackendPollMs(timeframe: string) {
  const seconds = timeframeToSeconds(timeframe);

  if (seconds <= 5) return 450;
  if (seconds <= 10) return 550;
  if (seconds <= 15) return 650;
  if (seconds <= 30) return 850;
  if (seconds <= 60) return 1000;
  if (seconds <= 120) return 1300;
  if (seconds <= 180) return 1500;
  if (seconds <= 300) return 1900;
  if (seconds <= 600) return 2400;
  if (seconds <= 900) return 3000;
  if (seconds <= 1800) return 4000;
  if (seconds <= 3600) return 5500;

  return 7000;
}

function getTradingPollMs(timeframe: string) {
  const seconds = timeframeToSeconds(timeframe);

  if (seconds <= 15) return 900;
  if (seconds <= 60) return 1200;
  if (seconds <= 300) return 1600;

  return 2500;
}

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
    time: Number(candle.time ?? new Date(candle.openTime ?? Date.now()).getTime()),
  };
}

function candlesSignature(candles: Candle[]) {
  if (candles.length === 0) return "empty";

  const first = candles[0];
  const last = candles[candles.length - 1];

  return [
    candles.length,
    first.time,
    first.open,
    first.high,
    first.low,
    first.close,
    last.time,
    last.open,
    last.high,
    last.low,
    last.close,
  ].join("|");
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

  if (latestCandles.length < 2) return 50;

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

async function postJson<TResponse, TBody>(
  url: string,
  body: TBody,
  signal?: AbortSignal
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data.message === "string"
        ? data.message
        : `Request failed: ${response.status}`;

    throw new Error(message);
  }

  return data as TResponse;
}

function tradeToMarker(trade: BackendTrade): TradeMarker {
  return {
    id: trade.id,
    side: trade.side,
    entryPrice: Number(trade.entryPrice),
    label: `${trade.side} ${formatMoney(
      Number(trade.stakeAmount),
      trade.currency
    )}`,
  };
}

function tradeToResultMarker(trade: BackendTrade): ResultMarker {
  const won = trade.status === "WON";
  const draw = trade.status === "DRAW";
  const price = Number(trade.closePrice ?? trade.entryPrice);

  let label = `✕ ${formatMoney(0, trade.currency)}`;

  if (won) {
    label = `✓ ${formatMoney(Number(trade.resultAmount ?? 0), trade.currency)}`;
  }

  if (draw) {
    label = `↔ ${formatMoney(Number(trade.resultAmount ?? 0), trade.currency)}`;
  }

  return {
    id: `${trade.id}-result`,
    price,
    won,
    label,
  };
}

export default function TradingPage() {
  const candlesRef = React.useRef<Candle[]>([]);
  const candlesSignatureRef = React.useRef("");
  const expirySecondsRef = React.useRef(45);
  const fetchingCandlesRef = React.useRef(false);
  const fetchingTradingStateRef = React.useRef(false);

  const [accountType, setAccountType] = React.useState<AccountType>("QT Demo");
  const [currency, setCurrency] = React.useState<Currency>("USD");

  const [walletBalance, setWalletBalance] = React.useState(70000);
  const [walletLoading, setWalletLoading] = React.useState(false);
  const [tradeSubmitting, setTradeSubmitting] = React.useState(false);
  const [tradeError, setTradeError] = React.useState<string | null>(null);

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
  const [selectedIndicators, setSelectedIndicators] = React.useState<string[]>(
    DEFAULT_SELECTED_INDICATORS
  );

  const [indicatorSettings, setIndicatorSettings] =
    React.useState<IndicatorSettingsMap>(DEFAULT_INDICATOR_SETTINGS);

  const [indicatorStyles, setIndicatorStyles] =
    React.useState<IndicatorStylesMap>(DEFAULT_INDICATOR_STYLES);

  const [drawingOpen, setDrawingOpen] = React.useState(false);
  const [selectedTool, setSelectedTool] = React.useState("Cursor");

  const [expirySeconds, setExpirySeconds] = React.useState(45);
  const [amount, setAmount] = React.useState("100");
  const [payout, setPayout] = React.useState(91);

  const [candles, setCandles] = React.useState<Candle[]>([]);
  const [activeTrades, setActiveTrades] = React.useState<TradeMarker[]>([]);
  const [resultMarkers, setResultMarkers] = React.useState<ResultMarker[]>([]);

  const [openTrades, setOpenTrades] = React.useState<BackendTrade[]>([]);
  const [tradeHistory, setTradeHistory] = React.useState<BackendTrade[]>([]);

  const [nowMs, setNowMs] = React.useState(Date.now());
  const [sentiment, setSentiment] = React.useState(50);
  const [emptyPanel, setEmptyPanel] = React.useState<EmptyPanel>(null);

  const stakeAmount = Number(amount);
  const safeStakeAmount = Number.isFinite(stakeAmount)
    ? Math.max(0, stakeAmount)
    : 0;

  const expectedProfit = safeStakeAmount * (payout / 100);
  const expectedReturn = safeStakeAmount + expectedProfit;

  const canTrade =
    safeStakeAmount > 0 &&
    safeStakeAmount <= walletBalance &&
    !tradeSubmitting &&
    !walletLoading;

  const expiryParts = splitExpiry(expirySeconds);

  const assetCategories = Array.from(
    new Set(availableAssets.map((asset) => asset.category))
  ) as AssetCategory[];

  const filteredAssets = availableAssets.filter(
    (asset) => asset.category === activeCategory
  );

  const loadBackendCandles = React.useCallback(
    async (asset: Asset, signal?: AbortSignal) => {
      if (fetchingCandlesRef.current || document.hidden) return;

      fetchingCandlesRef.current = true;

      try {
        const encodedAsset = encodeURIComponent(asset.symbol);
        const limit = getBackendLimit(timeframe);

        const data = await fetchJson<BackendCandlesResponse>(
          `${API_BASE_URL}/market-data/candles?asset=${encodedAsset}&timeframe=${timeframe}&limit=${limit}`,
          signal
        );

        const nextCandles = data.candles.map(normalizeCandle);
        const nextSignature = candlesSignature(nextCandles);

        if (nextCandles.length < 2) return;

        if (nextSignature !== candlesSignatureRef.current) {
          candlesSignatureRef.current = nextSignature;
          candlesRef.current = nextCandles;
          setCandles(nextCandles);
          setSentiment(calculateSentiment(nextCandles));
        }

        setNowMs(data.serverTime ? new Date(data.serverTime).getTime() : Date.now());
      } finally {
        fetchingCandlesRef.current = false;
      }
    },
    [timeframe]
  );

  const loadWallet = React.useCallback(
    async (signal?: AbortSignal) => {
      setWalletLoading(true);

      try {
        const data = await fetchJson<BackendWalletResponse>(
          `${API_BASE_URL}/trading-engine/wallet?userId=${encodeURIComponent(
            USER_ID
          )}&accountType=${encodeURIComponent(
            accountType
          )}&currency=${encodeURIComponent(currency)}`,
          signal
        );

        setWalletBalance(Number(data.balance));
      } finally {
        setWalletLoading(false);
      }
    },
    [accountType, currency]
  );

  const loadTradingState = React.useCallback(
    async (signal?: AbortSignal) => {
      if (fetchingTradingStateRef.current || document.hidden) return;

      fetchingTradingStateRef.current = true;

      try {
        const [open, history, wallet] = await Promise.all([
          fetchJson<BackendTrade[]>(
            `${API_BASE_URL}/trading-engine/trades/open?userId=${encodeURIComponent(
              USER_ID
            )}`,
            signal
          ),
          fetchJson<BackendTrade[]>(
            `${API_BASE_URL}/trading-engine/trades/history?userId=${encodeURIComponent(
              USER_ID
            )}`,
            signal
          ),
          fetchJson<BackendWalletResponse>(
            `${API_BASE_URL}/trading-engine/wallet?userId=${encodeURIComponent(
              USER_ID
            )}&accountType=${encodeURIComponent(
              accountType
            )}&currency=${encodeURIComponent(currency)}`,
            signal
          ),
        ]);

        setOpenTrades(open);
        setTradeHistory(history);
        setWalletBalance(Number(wallet.balance));
        setActiveTrades(open.map(tradeToMarker));

        setResultMarkers(
          history
            .filter((trade) => trade.status !== "PENDING")
            .slice(0, 12)
            .map(tradeToResultMarker)
        );
      } finally {
        fetchingTradingStateRef.current = false;
      }
    },
    [accountType, currency]
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
    candlesSignatureRef.current = "";
    candlesRef.current = [];
    setCandles([]);
    setActiveTrades([]);
    setResultMarkers([]);
    setActiveCategory(selectedAsset.category);
  }, [selectedAsset, timeframe]);

  React.useEffect(() => {
    let stopped = false;
    let controller: AbortController | null = null;

    const run = async () => {
      if (stopped || document.hidden || fetchingCandlesRef.current) return;

      controller = new AbortController();

      try {
        await loadBackendCandles(selectedAsset, controller.signal);
      } catch {
        // Keep latest valid candles during temporary backend delay.
      }
    };

    run();

    const intervalId = window.setInterval(run, getBackendPollMs(timeframe));

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
      controller?.abort();
      fetchingCandlesRef.current = false;
    };
  }, [selectedAsset, timeframe, loadBackendCandles]);

  React.useEffect(() => {
    const controller = new AbortController();

    loadWallet(controller.signal).catch(() => undefined);

    return () => {
      controller.abort();
    };
  }, [loadWallet]);

  React.useEffect(() => {
    let stopped = false;
    let controller: AbortController | null = null;

    const run = async () => {
      if (stopped || document.hidden || fetchingTradingStateRef.current) return;

      controller = new AbortController();

      try {
        await loadTradingState(controller.signal);
      } catch {
        // Keep current wallet/trade state during temporary backend delay.
      }
    };

    run();

    const intervalId = window.setInterval(run, getTradingPollMs(timeframe));

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
      controller?.abort();
      fetchingTradingStateRef.current = false;
    };
  }, [timeframe, loadTradingState]);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      const pulse = Math.floor(Math.random() * 5);
      const nextPayout = clamp(84 + selectedAsset.payoutBoost + pulse, 20, 92);

      setPayout(nextPayout);
    }, 8000);

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
    window.alert(
      "Deposit placeholder: connect this button to your NeuroOption deposit flow."
    );
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

  function handleIndicatorSettingChange(
    indicator: string,
    key: string,
    value: number
  ) {
    setIndicatorSettings((current) =>
      updateIndicatorSetting(current, indicator, key, value)
    );
  }

  function handleIndicatorStyleChange(
    indicator: string,
    key: string,
    value: string | number | boolean
  ) {
    setIndicatorStyles((current) =>
      updateIndicatorStyle(current, indicator, key, value)
    );
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

  async function handleTrade(side: TradeSide) {
    if (!canTrade) return;

    setTradeSubmitting(true);
    setTradeError(null);

    try {
      const response = await postJson<
        PlaceTradeResponse,
        {
          userId: string;
          asset: string;
          timeframe: string;
          side: TradeSide;
          accountType: AccountType;
          currency: Currency;
          amount: number;
          expirySeconds: number;
        }
      >(`${API_BASE_URL}/trading-engine/trades`, {
        userId: USER_ID,
        asset: selectedAsset.symbol,
        timeframe,
        side,
        accountType,
        currency,
        amount: safeStakeAmount,
        expirySeconds: expirySecondsRef.current,
      });

      setPayout(Number(response.trade.payoutPercent));
      setWalletBalance(Number(response.wallet.balance));

      setOpenTrades((current) => [response.trade, ...current]);
      setActiveTrades((current) => [tradeToMarker(response.trade), ...current]);

      await loadTradingState();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not place trade.";

      setTradeError(message);
      window.alert(message);
    } finally {
      setTradeSubmitting(false);
    }
  }

  return (
    <main className="nt-page nt-light-page">
      <TradingHeader
        accountType={accountType}
        currency={currency}
        balanceText={formatMoney(walletBalance, currency)}
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
            indicatorSettings={indicatorSettings}
            indicatorStyles={indicatorStyles}
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
            onIndicatorSettingChange={handleIndicatorSettingChange}
            onIndicatorStyleChange={handleIndicatorStyleChange}
          />

          <TradingChart
            asset={selectedAsset}
            candles={candles}
            chartType={chartType}
            timeframe={timeframe}
            expirySeconds={expirySeconds}
            nowMs={nowMs}
            selectedIndicators={selectedIndicators}
            indicatorSettings={indicatorSettings}
            indicatorStyles={indicatorStyles}
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

      {tradeError && <div className="nt-trade-error">{tradeError}</div>}

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

            {emptyPanel === "openTrades" && (
              <>
                {openTrades.length === 0 ? (
                  <p>No open trades yet.</p>
                ) : (
                  <div className="nt-panel-list">
                    {openTrades.map((trade) => (
                      <div key={trade.id} className="nt-panel-row">
                        <strong>
                          {trade.side} {trade.asset}
                        </strong>
                        <span>
                          {formatMoney(trade.stakeAmount, trade.currency)} •{" "}
                          {trade.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {emptyPanel === "history" && (
              <>
                {tradeHistory.length === 0 ? (
                  <p>No closed trades yet.</p>
                ) : (
                  <div className="nt-panel-list">
                    {tradeHistory.slice(0, 20).map((trade) => (
                      <div key={trade.id} className="nt-panel-row">
                        <strong>
                          {trade.status} • {trade.side} {trade.asset}
                        </strong>
                        <span>
                          Entry {trade.entryPrice} → Close{" "}
                          {trade.closePrice ?? "-"} • Profit{" "}
                          {formatMoney(trade.profitAmount ?? 0, trade.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {emptyPanel === "signals" && (
              <>
                <p>No signals yet.</p>
                <small>
                  Signals will appear here when your signal service is connected.
                </small>
              </>
            )}
          </div>
        </section>
      )}
    </main>
  );
}