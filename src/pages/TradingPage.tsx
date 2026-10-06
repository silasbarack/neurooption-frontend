import React from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, Star, X } from "lucide-react";
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
  authHeaders,
} from "../components/trading";

import {
  DEFAULT_INDICATOR_SETTINGS,
  DEFAULT_INDICATOR_STYLES,
  type IndicatorSettingsMap,
  type IndicatorStylesMap,
  updateIndicatorSetting,
  updateIndicatorStyle,
} from "../components/trading/indicator-settings";
import {
  getMarketSocket,
  MARKET_SOCKET_EVENTS,
  type MarketCandleUpdate,
  type MarketPriceUpdate,
  type MarketResyncResponse,
  type ServerTimeResponse,
} from "../components/trading/marketSocket";
import "./TradingPremium.css";
import { useQuotes } from "../components/markets/useQuotes";

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

const INITIAL_CANDLES: Candle[] = [];

const VALID_CATEGORIES: AssetCategory[] = [
  "Currencies",
  "Cryptocurrencies",
  "Stocks",
  "Indices",
  "Commodities",
];

// RSI starts visible; the existing toolbar can toggle or configure indicators.
const DEFAULT_SELECTED_INDICATORS: string[] = ["RSI"];

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
      ...authHeaders(),
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
    expiryTime: Number(trade.expiryTime),
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

function toWalletBalance(value: unknown, fallback: number | null): number | null {
  if ((typeof value !== "number" && typeof value !== "string") || (typeof value === "string" && !value.trim())) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}
export default function TradingPage() {
  const location = useLocation();
  const candlesRef = React.useRef<Candle[]>(INITIAL_CANDLES);
  const expirySecondsRef = React.useRef(60);
  const fetchingTradingStateRef = React.useRef(false);
  const serverOffsetRef = React.useRef(0);
  const marketFrameVersionRef = React.useRef(0);
  const lastMarketSequenceRef = React.useRef(0);
  const lastClientTickAgeRef = React.useRef(0);
  const lastClientTickReceivedAtRef = React.useRef(0);
  const lastClientMarketReceivedAtRef = React.useRef(0);
  const lastRenderedMarketReceivedAtRef = React.useRef(0);
  const lastServerBroadcastRef = React.useRef(0);
  const lastRenderDelayRef = React.useRef(0);
  const seenSettledTradeIdsRef = React.useRef<Set<string> | null>(null);
  const resultMarkerTimersRef = React.useRef<Map<string, number>>(new Map());

  const [accountType, setAccountType] = React.useState<AccountType>("QT Demo");
  const [currency, setCurrency] = React.useState<Currency>("USD");
  const walletScopeRef = React.useRef(accountType+"|"+currency);
  const walletVersionRef = React.useRef(0);

  const [walletBalance, setWalletBalance] = React.useState<number | null>(null);
  const [walletLoading, setWalletLoading] = React.useState(true);
  const [tradeSubmitting, setTradeSubmitting] = React.useState(false);
  const [tradeError, setTradeError] = React.useState<string | null>(null);

  // Other pages deep-link into an asset via navigate("/trading", { state: { symbol } }).
  const requestedSymbol = (location.state as { symbol?: string } | null)?.symbol;
  const initialAsset =
    ASSETS.find((asset) => asset.symbol === requestedSymbol) ?? DEFAULT_ASSET;
  const marketSelectionRef = React.useRef(initialAsset.symbol+"|M1");
  const marketVersionRef = React.useRef(0);

  const [availableAssets, setAvailableAssets] = React.useState<Asset[]>(ASSETS);
  const [selectedAsset, setSelectedAsset] = React.useState<Asset>(initialAsset);
  const [activeCategory, setActiveCategory] = React.useState<AssetCategory>(
    initialAsset.category
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

  const [expirySeconds, setExpirySeconds] = React.useState(60);
  const [amount, setAmount] = React.useState("100");
  const { quotes, live, updatedAt } = useQuotes();
  const payoutQuote = live && updatedAt > 0 ? quotes.find((quote) => quote.symbol === selectedAsset.symbol) : undefined;
  const payout = payoutQuote && typeof payoutQuote.payout === "number" && Number.isFinite(payoutQuote.payout) && payoutQuote.payout > 0 && payoutQuote.payout <= 100 ? payoutQuote.payout : null;
  const [favorites, setFavorites] = React.useState<string[]>(() => {
    try { const value: unknown = JSON.parse(localStorage.getItem("neurooption_favorite_assets") || "[]"); return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; } catch { return []; }
  });
  function toggleFavorite() {
    setFavorites((current) => {
      const next = current.includes(selectedAsset.symbol) ? current.filter((symbol) => symbol !== selectedAsset.symbol) : [...current, selectedAsset.symbol];
      try { localStorage.setItem("neurooption_favorite_assets", JSON.stringify(next)); } catch { /* Session-only when storage is unavailable. */ }
      return next;
    });
  }

  const [candles, setCandles] = React.useState<Candle[]>(INITIAL_CANDLES);
  const [marketReady, setMarketReady] = React.useState(false);
  const [activeTrades, setActiveTrades] = React.useState<TradeMarker[]>([]);
  const [openTrades, setOpenTrades] = React.useState<BackendTrade[]>([]);
  const [resultMarkers, setResultMarkers] = React.useState<ResultMarker[]>([]);
  const [resultPopups, setResultPopups] = React.useState<TradeResultPopupItem[]>([]);

  const [sentiment, setSentiment] = React.useState(50);

  const stakeAmount = Number(amount);
  const safeStakeAmount = Number.isFinite(stakeAmount)
    ? Math.max(0, stakeAmount)
    : 0;

  const expectedProfit = payout === null ? null : safeStakeAmount * (payout / 100);
  const expectedReturn = expectedProfit === null ? null : safeStakeAmount + expectedProfit;

  const canTrade =
    marketReady && payout !== null && walletBalance !== null && safeStakeAmount > 0 &&
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

  const handleChartFrameRendered = React.useCallback(() => {
    const receivedAt = lastClientMarketReceivedAtRef.current;
    if (
      !receivedAt ||
      receivedAt === lastRenderedMarketReceivedAtRef.current
    ) return;

    lastRenderDelayRef.current = Math.max(0, Date.now() - receivedAt);
    lastRenderedMarketReceivedAtRef.current = receivedAt;
  }, []);

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

  const resetMarket = React.useCallback(
    (asset: Asset, nextTimeframe: string, atMs = Date.now()) => {
      marketSelectionRef.current = asset.symbol+"|"+nextTimeframe;
      marketVersionRef.current += 1;
      candlesRef.current = [];
      serverOffsetRef.current = atMs - Date.now();
      setCandles([]);
      setMarketReady(false);
      setSentiment(50);
      lastMarketSequenceRef.current = 0;
      marketFrameVersionRef.current += 1;
      setActiveTrades([]);
      clearResultMarkers();
    },
    [clearResultMarkers]
  );

  // Replaces the instant local placeholder with the backend's authoritative
  // (settlement-accurate) candle history once it arrives.
  const loadHistoricalCandles = React.useCallback(
    async (asset: Asset, nextTimeframe: string, signal?: AbortSignal) => {
      const requestVersion = marketVersionRef.current;
      const encodedAsset = encodeURIComponent(asset.symbol);
      const data = await fetchJson<BackendCandlesResponse>(
        `${API_BASE_URL}/market-data/candles?asset=${encodedAsset}&timeframe=${nextTimeframe}`,
        signal
      );

      if (signal?.aborted || requestVersion !== marketVersionRef.current || marketSelectionRef.current !== asset.symbol+"|"+nextTimeframe || !Array.isArray(data.candles) || data.candles.length === 0) return;

      const nextCandles: Candle[] = data.candles.map((candle) => ({
        time: candle.time,
        open: Number(candle.open),
        high: Number(candle.high),
        low: Number(candle.low),
        close: Number(candle.close),
      }));

      const validCandles = nextCandles.filter((candle) =>
        [candle.time,candle.open,candle.high,candle.low,candle.close].every(Number.isFinite) && candle.time > 0 &&
        [candle.open,candle.high,candle.low,candle.close].every(value => value > 0) &&
        candle.high >= Math.max(candle.open,candle.close) && candle.low <= Math.min(candle.open,candle.close)
      );
      if (!validCandles.length) return;
      candlesRef.current = validCandles;
      setCandles(validCandles);
      setSentiment(calculateSentiment(validCandles));
      setMarketReady(validCandles.length >= 2);
    },
    []
  );

  const loadWallet = React.useCallback(
    async (signal?: AbortSignal) => {
      const requestScope=accountType+"|"+currency;
      const requestVersion=walletVersionRef.current;
      if (signal?.aborted || walletScopeRef.current!==requestScope) return;
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

        if (signal?.aborted || walletScopeRef.current!==requestScope || requestVersion!==walletVersionRef.current) return;
        setWalletBalance((previous) => toWalletBalance(data.balance, previous));
      } finally {
        if (!signal?.aborted && walletScopeRef.current===requestScope && requestVersion===walletVersionRef.current) setWalletLoading(false);
      }
    },
    [accountType, currency]
  );

  const loadTradingState = React.useCallback(
    async (signal?: AbortSignal) => {
      const requestScope=accountType+"|"+currency;
      const requestVersion=walletVersionRef.current;
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

        if (!signal?.aborted && walletScopeRef.current===requestScope && requestVersion===walletVersionRef.current) setWalletBalance((previous) => toWalletBalance(wallet.balance, previous));
        setActiveTrades(open.map(tradeToMarker));
        setOpenTrades(open);

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

          // The backend list is much larger than the built-in fallback, so a
          // deep-linked symbol may only become available here.
          const preferred =
            nextAssets.find((asset) => asset.symbol === requestedSymbol) ??
            nextAssets.find((asset) => asset.symbol === DEFAULT_ASSET.symbol) ??
            nextAssets.find((asset) => asset.symbol === "EUR/USD OTC") ??
            nextAssets[0];

          resetMarket(preferred, timeframe);
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
  }, [resetMarket, loadHistoricalCandles, timeframe, requestedSymbol]);

  // Market ticks stay off React state. The Canvas reads candlesRef directly,
  // while React state is updated only when a new candle bucket is created or
  // when history must be reconciled after a reconnect/sequence gap.
  React.useEffect(() => {
    const socket = getMarketSocket(API_BASE_URL);
    const symbol = selectedAsset.symbol;
    const requestResync = () => {
      const current = candlesRef.current;
      const since = current[Math.max(0, current.length - 3)]?.time ?? 0;

      socket.emit(
        MARKET_SOCKET_EVENTS.RESYNC_REQUEST,
        {
          symbol,
          timeframe,
          since,
          limit: 320,
          lastSequence: lastMarketSequenceRef.current,
        },
        (response: MarketResyncResponse) => {
          if (
            response?.symbol !== symbol ||
            response?.timeframe !== timeframe ||
            marketSelectionRef.current !== symbol+"|"+timeframe ||
            !Array.isArray(response?.candles)
          ) return;

          const byTime = new Map<number, Candle>();
          for (const candle of candlesRef.current) byTime.set(candle.time, candle);
          for (const candle of response.candles) {
            if (
              [candle.time, candle.open, candle.high, candle.low, candle.close].every(Number.isFinite) &&
              candle.time > 0 &&
              candle.high >= Math.max(candle.open, candle.close) &&
              candle.low <= Math.min(candle.open, candle.close)
            ) {
              byTime.set(candle.time, {
                time: candle.time,
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close,
              });
            }
          }

          const reconciled = Array.from(byTime.values())
            .sort((a, b) => a.time - b.time)
            .slice(-420);

          if (reconciled.length > 0) {
            candlesRef.current = reconciled;
            marketFrameVersionRef.current += 1;
            lastMarketSequenceRef.current = Math.max(
              lastMarketSequenceRef.current,
              Number(response.lastSequence || 0),
            );
            setCandles(reconciled);
            setMarketReady(reconciled.length >= 2);
            setSentiment(calculateSentiment(reconciled));
          }
        },
      );
    };

    const syncClock = () => {
      const clientSentAt = Date.now();
      socket.emit(
        MARKET_SOCKET_EVENTS.SERVER_TIME,
        { clientSentAt },
        (response: ServerTimeResponse) => {
          if (!response || !Number.isFinite(response.serverTimestamp)) return;
          const clientReceivedAt = Date.now();
          const midpoint = clientSentAt + (clientReceivedAt - clientSentAt) / 2;
          serverOffsetRef.current = response.serverTimestamp - midpoint;
        },
      );
    };

    let lastRecoveryAt = 0;

    const subscribe = () => {
      // Start stale detection immediately. A connected socket that receives
      // no first market packet should not leave the chart looking healthy.
      lastClientTickReceivedAtRef.current = Date.now();
      socket.emit(MARKET_SOCKET_EVENTS.SUBSCRIBE_SYMBOL, { symbol, timeframe });
      syncClock();
      if (lastMarketSequenceRef.current > 0) requestResync();
    };

    const handleReconnect = () => {
      socket.emit(MARKET_SOCKET_EVENTS.CLIENT_METRICS, {
        reconnect: true,
        tickAgeMs: lastClientTickAgeRef.current,
        renderDelayMs: lastRenderDelayRef.current,
      });
    };

    const handlePriceUpdate = (data: MarketPriceUpdate) => {
      if (data.symbol !== symbol || !Number.isFinite(data.sequence)) return;

      const previousSequence = lastMarketSequenceRef.current;
      if (previousSequence > 0 && data.sequence > previousSequence + 1) {
        requestResync();
      }
      if (data.sequence <= previousSequence) return;

      lastMarketSequenceRef.current = data.sequence;
      const clientReceiveTimestamp = Date.now();
      lastClientTickReceivedAtRef.current = clientReceiveTimestamp;
      lastClientMarketReceivedAtRef.current = clientReceiveTimestamp;
      const estimatedServerNow = clientReceiveTimestamp + serverOffsetRef.current;
      lastClientTickAgeRef.current = Math.max(
        0,
        estimatedServerNow - data.timestamp,
      );
      lastServerBroadcastRef.current = data.serverBroadcastTimestamp;
    };

    const handleCandleUpdate = (data: MarketCandleUpdate) => {
      if (
        data.symbol !== symbol ||
        data.timeframe !== timeframe ||
        marketSelectionRef.current !== symbol+"|"+timeframe
      ) return;

      if (
        lastMarketSequenceRef.current > 0 &&
        data.sequence < lastMarketSequenceRef.current - 1
      ) return;

      lastClientMarketReceivedAtRef.current = Date.now();
      lastServerBroadcastRef.current = data.serverBroadcastTimestamp;

      const nextCandle: Candle = {
        time: data.candle.time,
        open: data.candle.open,
        high: data.candle.high,
        low: data.candle.low,
        close: data.candle.close,
      };

      if (
        ![nextCandle.time,nextCandle.open,nextCandle.high,nextCandle.low,nextCandle.close].every(Number.isFinite) ||
        nextCandle.time <= 0 ||
        ![nextCandle.open,nextCandle.high,nextCandle.low,nextCandle.close].every(value => value > 0) ||
        nextCandle.high < Math.max(nextCandle.open,nextCandle.close) ||
        nextCandle.low > Math.min(nextCandle.open,nextCandle.close)
      ) return;

      const current = candlesRef.current;
      const lastIndex = current.length - 1;
      const isSameBucket =
        lastIndex >= 0 && current[lastIndex].time === nextCandle.time;

      if (isSameBucket) {
        current[lastIndex] = nextCandle;
        marketFrameVersionRef.current += 1;
        return;
      }

      const nextCandles = [...current.slice(-419), nextCandle];
      candlesRef.current = nextCandles;
      marketFrameVersionRef.current += 1;
      setCandles(nextCandles);
      setMarketReady(nextCandles.length >= 2);
      setSentiment(calculateSentiment(nextCandles));
    };

    socket.on("connect", subscribe);
    socket.io.on("reconnect", handleReconnect);
    socket.on(MARKET_SOCKET_EVENTS.PRICE_UPDATE, handlePriceUpdate);
    socket.on(MARKET_SOCKET_EVENTS.CANDLE_UPDATE, handleCandleUpdate);

    if (socket.connected) subscribe();

    const clockTimer = window.setInterval(syncClock, 30_000);
    const metricsTimer = window.setInterval(() => {
      socket.emit(MARKET_SOCKET_EVENTS.CLIENT_METRICS, {
        tickAgeMs: lastClientTickAgeRef.current,
        renderDelayMs: lastRenderDelayRef.current,
      });
    }, 5_000);

    const staleTimer = window.setInterval(() => {
      const now = Date.now();
      const lastReceivedAt = lastClientTickReceivedAtRef.current;
      const staleFor = lastReceivedAt > 0 ? now - lastReceivedAt : 0;

      if (socket.connected && staleFor > 3_000) {
        requestResync();

        if (staleFor > 6_000 && now - lastRecoveryAt > 6_000) {
          lastRecoveryAt = now;
          socket.disconnect();
          socket.connect();
        }
      }
    }, 1_000);

    return () => {
      window.clearInterval(clockTimer);
      window.clearInterval(metricsTimer);
      window.clearInterval(staleTimer);
      socket.emit(MARKET_SOCKET_EVENTS.UNSUBSCRIBE_SYMBOL, { symbol, timeframe });
      socket.off("connect", subscribe);
      socket.io.off("reconnect", handleReconnect);
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


  function handleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
      return;
    }

    document.documentElement.requestFullscreen().catch(() => undefined);
  }

  function handleAssetChange(asset: Asset) {
    resetMarket(asset, timeframe);
    setSelectedAsset(asset);
    setActiveCategory(asset.category);
    setAssetMenuOpen(false);
    loadHistoricalCandles(asset, timeframe).catch(() => undefined);
  }

  function handleTimeframeChange(nextTimeframe: string) {
    resetMarket(selectedAsset, nextTimeframe);
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
    if (!canTrade || Date.now() - updatedAt > 20000) return;
    const requestScope=accountType+"|"+currency;
    const requestVersion=walletVersionRef.current;

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

      if (walletScopeRef.current===requestScope && requestVersion===walletVersionRef.current) setWalletBalance((previous) => toWalletBalance(response.wallet.balance, previous));

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
  // Live price and change across the loaded candles for the asset bar.
  const lastCandle = candles[candles.length - 1];
  const firstCandle = candles[0];
  const lastPrice = lastCandle?.close;
  const changePercent =
    lastCandle && firstCandle && firstCandle.open
      ? ((lastCandle.close - firstCandle.open) / firstCandle.open) * 100
      : 0;

  const chartLayoutStyle = {
    "--nt-indicator-space": `${bottomIndicatorCount * 72}px`,
  } as React.CSSProperties;

  return (
    <main className="nt-page nt-premium">
      <TradingHeader
        accountType={accountType}
        currency={currency}
        balance={walletBalance}
        balanceLoading={walletLoading}
        onAccountChange={(next) => { if (next !== accountType) { walletScopeRef.current=next+"|"+currency; walletVersionRef.current+=1; setWalletBalance(null); setWalletLoading(true); setAccountType(next); } }}
        onCurrencyChange={(next) => { if (next !== currency) { walletScopeRef.current=accountType+"|"+next; walletVersionRef.current+=1; setWalletBalance(null); setWalletLoading(true); setCurrency(next); } }}
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
                aria-expanded={assetMenuOpen}
                aria-label="Select trading asset"
                onClick={() => setAssetMenuOpen((current) => !current)}
              >
                <span>{selectedAsset.symbol}</span>
                <ChevronDown size={16} aria-hidden="true" />
              </button>

              {assetMenuOpen && (
                <div className="nt-asset-menu">
                  <button
                    type="button"
                    className="nt-floating-close"
                    onClick={() => setAssetMenuOpen(false)}
                    aria-label="Close"
                  >
                    <X size={16} />
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
                          {asset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button type="button" className={favorites.includes(selectedAsset.symbol) ? "nt-asset-favorite is-active" : "nt-asset-favorite"} onClick={toggleFavorite} aria-pressed={favorites.includes(selectedAsset.symbol)} aria-label={`${favorites.includes(selectedAsset.symbol) ? "Remove" : "Add"} ${selectedAsset.symbol} ${favorites.includes(selectedAsset.symbol) ? "from" : "to"} favorites`}>
              <Star size={16} aria-hidden="true" fill={favorites.includes(selectedAsset.symbol) ? "currentColor" : "none"} />
            </button>
            <div className="nt-asset-live-quote" aria-label="Current market price"><strong>{lastPrice !== undefined ? lastPrice.toFixed(selectedAsset.precision) : "—"}</strong>{marketReady && <small className={changePercent >= 0 ? "is-up" : "is-down"}>{changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%</small>}</div>
          </div>

          <div className="nt-chart-toolbar" aria-label="Chart tools">
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
          </div>

          <TradingChart
            asset={selectedAsset}
            candles={candles}
            candlesRef={candlesRef}
            marketFrameVersionRef={marketFrameVersionRef}
            serverOffsetRef={serverOffsetRef}
            marketReceivedAtRef={lastClientMarketReceivedAtRef}
            onFrameRendered={handleChartFrameRendered}
            chartType={chartType}
            timeframe={timeframe}
            expirySeconds={expirySeconds}
            selectedIndicators={selectedIndicators}
            indicatorSettings={indicatorSettings}
            indicatorStyles={indicatorStyles}
            activeTrades={activeTrades}
            resultMarkers={resultMarkers}
          />


        </section>

        <TradingPanel
          assetSymbol={selectedAsset.symbol}
          priceText={lastPrice !== undefined ? lastPrice.toFixed(selectedAsset.precision) : undefined}
          changePercent={changePercent}
          expiryText={formatExpiry(expirySeconds)}
          expiryParts={expiryParts}
          amount={amount}
          currency={currency}
          payout={payout}
          expectedProfitText={expectedProfit === null ? "—" : formatMoney(expectedProfit, currency)}
          expectedReturnText={expectedReturn === null ? "—" : formatMoney(expectedReturn, currency)}
          canTrade={canTrade}
          tradeDisabledReason={!marketReady ? "Waiting for market prices…" : payout === null ? "Waiting for current payout…" : walletBalance === null ? walletLoading ? "Loading account balance…" : "Account balance unavailable" : tradeSubmitting ? "Submitting trade…" : safeStakeAmount <= 0 ? "Enter an amount greater than zero" : safeStakeAmount > walletBalance ? "Amount exceeds available balance" : walletLoading ? "Updating account balance…" : undefined}
          sentiment={sentiment}
          openTrades={openTrades}
          onAdjustExpiry={handleAdjustExpiry}
          onAmountChange={setAmount}
          onTrade={handleTrade}
        />

        <TradingQuickMenu onFullscreen={handleFullscreen} />
      </section>

      <TradingBottomNav />

      <TradeResultPopup items={resultPopups} onDismiss={handleDismissResultPopup} />

      {tradeError && <div className="nt-trade-error">{tradeError}</div>}
    </main>
  );
}
