import React from "react";
import "./TradingPage.css";

import {
  ASSETS,
  BOTTOM_INDICATORS,
  TradeResultPopup,
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
  BackendTrade,
  Candle,
  ChartType,
  Currency,
  ResultMarker,
  TradeMarker,
  TradeResultPopupItem,
  TradeSide,
} from "../components/trading";

import {
  API_BASE_URL,
  fetchJson,
  formatMoney,
  USER_ID,
} from "../components/trading";

import {
  DEFAULT_INDICATOR_SETTINGS,
  DEFAULT_INDICATOR_STYLES,
  type IndicatorSettingsMap,
  type IndicatorStylesMap,
  updateIndicatorSetting,
  updateIndicatorStyle,
} from "../components/trading/indicator-settings";
import { buildTimeframeCandles } from "../components/trading/timeframeEngine";
import {
  getMarketSocket,
  MARKET_SOCKET_EVENTS,
  type MarketCandleUpdate,
  type MarketPriceUpdate,
} from "../components/trading/marketSocket";

type BackendAsset = {
  symbol: string;
  label: string;
  category: string;
  basePrice: number;
  precision: number;
  payoutBoost: number;
  isActive?: boolean;
};

type BackendAssetsResponse = {
  assets: BackendAsset[];
};

type BackendCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type BackendCandlesResponse = {
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

type PlaceTradeResponse = {
  trade: BackendTrade;
  wallet: BackendWalletResponse;
};

const MIN_EXPIRY_SECONDS = 5;
const MAX_EXPIRY_SECONDS = 5 * 60 * 60;
const TRADE_RESULT_DISPLAY_MS = 10000;

const DEFAULT_ASSET =
  ASSETS.find((asset) => asset.symbol === "EUR/USD OTC") ?? ASSETS[0];

const INITIAL_NOW_MS = Date.now();
const INITIAL_CANDLES = buildTimeframeCandles(
  DEFAULT_ASSET,
  "M1",
  [],
  INITIAL_NOW_MS
);

const VALID_CATEGORIES: AssetCategory[] = [
  "Currencies",
  "Cryptocurrencies",
  "Stocks",
  "Indices",
  "Commodities",
];

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

function getTradingPollMs(timeframe: string) {
  const seconds = timeframeToSeconds(timeframe);

  if (seconds <= 15) return 1200;
  if (seconds <= 60) return 1500;
  if (seconds <= 300) return 2000;
  if (seconds <= 900) return 3000;
  if (seconds <= 3600) return 5000;

  return 8000;
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

function tradeToResultPopupItem(trade: BackendTrade): TradeResultPopupItem {
  const outcome =
    trade.status === "WON" ? "won" : trade.status === "DRAW" ? "draw" : "lost";

  const amount =
    outcome === "lost"
      ? -Number(trade.stakeAmount)
      : Number(trade.resultAmount ?? 0);

  const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";

  return {
    id: trade.id,
    outcome,
    side: trade.side,
    asset: trade.asset,
    amountText: `${sign}${formatMoney(Math.abs(amount), trade.currency)}`,
  };
}

export default function TradingPage() {
  const candlesRef = React.useRef<Candle[]>(INITIAL_CANDLES);
  const expirySecondsRef = React.useRef(45);
  const fetchingTradingStateRef = React.useRef(false);
  const serverOffsetRef = React.useRef(0);
  const seenSettledTradeIdsRef = React.useRef<Set<string> | null>(null);
  const resultMarkerTimersRef = React.useRef<Map<string, number>>(new Map());

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

  const [candles, setCandles] = React.useState<Candle[]>(INITIAL_CANDLES);
  const [activeTrades, setActiveTrades] = React.useState<TradeMarker[]>([]);
  const [resultMarkers, setResultMarkers] = React.useState<ResultMarker[]>([]);
  const [resultPopups, setResultPopups] = React.useState<TradeResultPopupItem[]>([]);

  const [nowMs, setNowMs] = React.useState(INITIAL_NOW_MS);
  const [sentiment, setSentiment] = React.useState(50);

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

  const clearResultMarkers = React.useCallback(() => {
    resultMarkerTimersRef.current.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    resultMarkerTimersRef.current.clear();
    setResultMarkers([]);
  }, []);

  const showTemporaryResultMarkers = React.useCallback(
    (markers: ResultMarker[]) => {
      if (markers.length === 0) return;

      setResultMarkers((current) => {
        const nextById = new Map(current.map((marker) => [marker.id, marker]));

        for (const marker of markers) {
          nextById.set(marker.id, marker);
        }

        return Array.from(nextById.values()).slice(-12);
      });

      for (const marker of markers) {
        const currentTimerId = resultMarkerTimersRef.current.get(marker.id);

        if (currentTimerId !== undefined) {
          window.clearTimeout(currentTimerId);
        }

        const timerId = window.setTimeout(() => {
          resultMarkerTimersRef.current.delete(marker.id);
          setResultMarkers((current) =>
            current.filter((item) => item.id !== marker.id)
          );
        }, TRADE_RESULT_DISPLAY_MS);

        resultMarkerTimersRef.current.set(marker.id, timerId);
      }
    },
    []
  );

  const showSyntheticMarket = React.useCallback(
    (asset: Asset, nextTimeframe: string, atMs = Date.now()) => {
      const nextCandles = buildTimeframeCandles(
        asset,
        nextTimeframe,
        [],
        atMs
      );

      candlesRef.current = nextCandles;
      serverOffsetRef.current = atMs - Date.now();
      setCandles(nextCandles);
      setSentiment(calculateSentiment(nextCandles));
      setNowMs(atMs);
      setActiveTrades([]);
      clearResultMarkers();
    },
    [clearResultMarkers]
  );

  // Replaces the instant local placeholder with the backend's authoritative
  // (settlement-accurate) candle history once it arrives.
  const loadHistoricalCandles = React.useCallback(
    async (asset: Asset, nextTimeframe: string, signal?: AbortSignal) => {
      const encodedAsset = encodeURIComponent(asset.symbol);
      const data = await fetchJson<BackendCandlesResponse>(
        `${API_BASE_URL}/market-data/candles?asset=${encodedAsset}&timeframe=${nextTimeframe}`,
        signal
      );

      if (data.candles.length === 0) return;

      const nextCandles: Candle[] = data.candles.map((candle) => ({
        time: candle.time,
        open: Number(candle.open),
        high: Number(candle.high),
        low: Number(candle.low),
        close: Number(candle.close),
      }));

      candlesRef.current = nextCandles;
      setCandles(nextCandles);
      setSentiment(calculateSentiment(nextCandles));
    },
    []
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

        setWalletBalance(Number(wallet.balance));
        setActiveTrades(open.map(tradeToMarker));

        const settled = history.filter((trade) => trade.status !== "PENDING");

        if (seenSettledTradeIdsRef.current === null) {
          // First load: just remember what's already settled, don't pop up
          // a result for trades that finished before this page was opened.
          seenSettledTradeIdsRef.current = new Set(
            settled.map((trade) => trade.id)
          );
        } else {
          const newlySettled = settled.filter(
            (trade) => !seenSettledTradeIdsRef.current!.has(trade.id)
          );

          if (newlySettled.length > 0) {
            for (const trade of newlySettled) {
              seenSettledTradeIdsRef.current.add(trade.id);
            }

            showTemporaryResultMarkers(
              newlySettled.slice(0, 12).map(tradeToResultMarker)
            );

            setResultPopups((current) => [
              ...current,
              ...newlySettled.map(tradeToResultPopupItem),
            ]);
          }
        }
      } finally {
        fetchingTradingStateRef.current = false;
      }
    },
    [accountType, currency, showTemporaryResultMarkers]
  );

  React.useEffect(() => {
    const resultMarkerTimers = resultMarkerTimersRef.current;

    return () => {
      resultMarkerTimers.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      resultMarkerTimers.clear();
    };
  }, []);

  React.useEffect(() => {
    expirySecondsRef.current = expirySeconds;
  }, [expirySeconds]);

  // Candle data now arrives authoritatively from the backend over the market
  // WebSocket; this just keeps the on-screen clock (and expiry countdown)
  // ticking in between pushes.
  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowMs(Date.now() + serverOffsetRef.current);
    }, 250);

    return () => window.clearInterval(intervalId);
  }, []);

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
            nextAssets.find((asset) => asset.symbol === DEFAULT_ASSET.symbol) ??
            nextAssets.find((asset) => asset.symbol === "EUR/USD OTC") ??
            nextAssets[0];

          showSyntheticMarket(preferred, timeframe);
          setSelectedAsset(preferred);
          setActiveCategory(preferred.category);
          loadHistoricalCandles(preferred, timeframe).catch(() => undefined);
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
  }, [showSyntheticMarket, loadHistoricalCandles, timeframe]);

  // Live price/candle feed: subscribe to this asset+timeframe room on the
  // backend's market WebSocket, which ticks continuously regardless of
  // whether anyone is watching, and is the same price feed trade settlement
  // uses — so the chart can never drift from what actually decides trades.
  React.useEffect(() => {
    const socket = getMarketSocket(API_BASE_URL);
    const symbol = selectedAsset.symbol;

    const handlePriceUpdate = (data: MarketPriceUpdate) => {
      if (data.symbol !== symbol) return;
      serverOffsetRef.current = new Date(data.serverTime).getTime() - Date.now();
    };

    const handleCandleUpdate = (data: MarketCandleUpdate) => {
      if (data.symbol !== symbol || data.timeframe !== timeframe) return;

      const nextCandle: Candle = {
        time: data.candle.time,
        open: data.candle.open,
        high: data.candle.high,
        low: data.candle.low,
        close: data.candle.close,
      };

      const current = candlesRef.current;
      const lastIndex = current.length - 1;

      const nextCandles =
        lastIndex >= 0 && current[lastIndex].time === nextCandle.time
          ? [...current.slice(0, lastIndex), nextCandle]
          : [...current.slice(-419), nextCandle];

      candlesRef.current = nextCandles;
      setCandles(nextCandles);
      setSentiment(calculateSentiment(nextCandles));
    };

    socket.on(MARKET_SOCKET_EVENTS.PRICE_UPDATE, handlePriceUpdate);
    socket.on(MARKET_SOCKET_EVENTS.CANDLE_UPDATE, handleCandleUpdate);
    socket.emit(MARKET_SOCKET_EVENTS.SUBSCRIBE_SYMBOL, { symbol, timeframe });

    return () => {
      socket.emit(MARKET_SOCKET_EVENTS.UNSUBSCRIBE_SYMBOL, { symbol, timeframe });
      socket.off(MARKET_SOCKET_EVENTS.PRICE_UPDATE, handlePriceUpdate);
      socket.off(MARKET_SOCKET_EVENTS.CANDLE_UPDATE, handleCandleUpdate);
    };
  }, [selectedAsset, timeframe]);

  React.useEffect(() => {
    const controller = new AbortController();
    const timerId = window.setTimeout(() => {
      loadWallet(controller.signal).catch(() => undefined);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
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
    const handleVisibilityChange = () => {
      if (!document.hidden) run();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
    showSyntheticMarket(asset, timeframe);
    setSelectedAsset(asset);
    setActiveCategory(asset.category);
    setAssetMenuOpen(false);
    loadHistoricalCandles(asset, timeframe).catch(() => undefined);
  }

  function handleTimeframeChange(nextTimeframe: string) {
    showSyntheticMarket(selectedAsset, nextTimeframe);
    setTimeframe(nextTimeframe);
    setTimeframeOpen(false);
    loadHistoricalCandles(selectedAsset, nextTimeframe).catch(() => undefined);
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

  const handleDismissResultPopup = React.useCallback((id: string) => {
    setResultPopups((current) => current.filter((item) => item.id !== id));
  }, []);

  const bottomIndicatorCount = Math.min(
    4,
    selectedIndicators.filter((indicator) =>
      BOTTOM_INDICATORS.includes(indicator)
    ).length
  );
  const chartLayoutStyle = {
    "--nt-indicator-space": `${bottomIndicatorCount * 100}px`,
  } as React.CSSProperties;

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

        <section className="nt-main-chart" style={chartLayoutStyle}>
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
                  <button
                    type="button"
                    className="nt-floating-close"
                    onClick={() => setAssetMenuOpen(false)}
                    aria-label="Close"
                  >
                    ✕
                  </button>

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

        <TradingQuickMenu onFullscreen={handleFullscreen} />
      </section>

      <TradingBottomNav onFullscreen={handleFullscreen} />

      <TradeResultPopup items={resultPopups} onDismiss={handleDismissResultPopup} />

      {tradeError && <div className="nt-trade-error">{tradeError}</div>}
    </main>
  );
}
