import React, { useState, useEffect, useRef, useCallback } from 'react';
import CandlestickChart from '../components/CandlestickChart';
import OrderPanel from '../components/OrderPanel';
import PositionsPanel from '../components/PositionsPanel';
import TopBar from '../components/TopBar';
import AISignalPanel from '../components/AISignalPanel';
import Sidebar from '../components/Sidebar';

// ── Market data generator ──────────────────────────────────────────────────
function generateCandles(n = 120, base = 1.0854, vol = 0.0015) {
  let price = base;
  return Array.from({ length: n }, (_, i) => {
    const open = price;
    const move = (Math.random() - 0.499) * vol * 2;
    const close = open + move;
    const high = Math.max(open, close) + Math.random() * vol * 0.5;
    const low = Math.min(open, close) - Math.random() * vol * 0.5;
    const volume = Math.floor(Math.random() * 1000 + 200);
    price = close;
    return { time: Date.now() - (n - i) * 60000, open, high, low, close, volume };
  });
}

const OTC_ASSETS = [
  { id: 'EURUSD_OTC', name: 'EUR/USD OTC', category: 'Forex OTC', payout: 92, base: 1.0854, vol: 0.0012, icon: '🇪🇺' },
  { id: 'GBPUSD_OTC', name: 'GBP/USD OTC', category: 'Forex OTC', payout: 89, base: 1.2678, vol: 0.0015, icon: '🇬🇧' },
  { id: 'USDJPY_OTC', name: 'USD/JPY OTC', category: 'Forex OTC', payout: 91, base: 151.34, vol: 0.08, icon: '🇯🇵' },
  { id: 'AUDUSD_OTC', name: 'AUD/USD OTC', category: 'Forex OTC', payout: 88, base: 0.6523, vol: 0.001, icon: '🇦🇺' },
  { id: 'AUDJPY_OTC', name: 'AUD/JPY OTC', category: 'Forex OTC', payout: 87, base: 98.23, vol: 0.06, icon: '🇦🇺' },
  { id: 'EURJPY_OTC', name: 'EUR/JPY OTC', category: 'Forex OTC', payout: 90, base: 163.42, vol: 0.07, icon: '🇪🇺' },
  { id: 'NZDUSD_OTC', name: 'NZD/USD OTC', category: 'Forex OTC', payout: 86, base: 0.5987, vol: 0.0009, icon: '🇳🇿' },
  { id: 'USDCAD_OTC', name: 'USD/CAD OTC', category: 'Forex OTC', payout: 88, base: 1.3612, vol: 0.0011, icon: '🇨🇦' },
  { id: 'BTCUSD_OTC', name: 'BTC/USD OTC', category: 'Crypto OTC', payout: 85, base: 67234, vol: 450, icon: '₿' },
  { id: 'ETHUSD_OTC', name: 'ETH/USD OTC', category: 'Crypto OTC', payout: 84, base: 3421, vol: 55, icon: 'Ξ' },
  { id: 'XRPUSD_OTC', name: 'XRP/USD OTC', category: 'Crypto OTC', payout: 83, base: 0.5234, vol: 0.008, icon: '✦' },
  { id: 'BNBUSD_OTC', name: 'BNB/USD OTC', category: 'Crypto OTC', payout: 82, base: 412.5, vol: 6, icon: '⬡' },
  { id: 'SOLUSD_OTC', name: 'SOL/USD OTC', category: 'Crypto OTC', payout: 84, base: 178.3, vol: 3.2, icon: '◎' },
  { id: 'GOLD_OTC', name: 'GOLD OTC', category: 'Commodities OTC', payout: 90, base: 2341.5, vol: 8, icon: '🥇' },
  { id: 'SILVER_OTC', name: 'SILVER OTC', category: 'Commodities OTC', payout: 87, base: 29.42, vol: 0.3, icon: '🥈' },
  { id: 'OIL_OTC', name: 'OIL/USD OTC', category: 'Commodities OTC', payout: 88, base: 78.34, vol: 0.8, icon: '🛢️' },
  { id: 'SPX500_OTC', name: 'S&P 500 OTC', category: 'Indices OTC', payout: 91, base: 5203.4, vol: 22, icon: '📈' },
  { id: 'NDX100_OTC', name: 'NASDAQ 100 OTC', category: 'Indices OTC', payout: 89, base: 18234.5, vol: 88, icon: '📊' },
  { id: 'DJI_OTC', name: 'Dow Jones OTC', category: 'Indices OTC', payout: 88, base: 39421.3, vol: 120, icon: '🏛️' },
  { id: 'TSLA_OTC', name: 'TSLA OTC', category: 'Stocks OTC', payout: 85, base: 182.44, vol: 3.5, icon: '🚗' },
  { id: 'AAPL_OTC', name: 'AAPL OTC', category: 'Stocks OTC', payout: 87, base: 189.34, vol: 2.8, icon: '🍎' },
  { id: 'AMZN_OTC', name: 'AMZN OTC', category: 'Stocks OTC', payout: 86, base: 178.92, vol: 3.1, icon: '📦' },
  { id: 'GOOGL_OTC', name: 'GOOGL OTC', category: 'Stocks OTC', payout: 85, base: 157.43, vol: 2.4, icon: '🔍' },
  { id: 'META_OTC', name: 'META OTC', category: 'Stocks OTC', payout: 84, base: 494.32, vol: 6.2, icon: '👤' },
  { id: 'MSFT_OTC', name: 'MSFT OTC', category: 'Stocks OTC', payout: 87, base: 419.56, vol: 4.8, icon: '🪟' },
  // Real market assets
  { id: 'EURUSD', name: 'EUR/USD', category: 'Forex', payout: 82, base: 1.0851, vol: 0.0012, icon: '🇪🇺' },
  { id: 'BTCUSD', name: 'BTC/USD', category: 'Crypto', payout: 78, base: 67180, vol: 480, icon: '₿' },
  { id: 'GOLD', name: 'XAU/USD', category: 'Commodities', payout: 80, base: 2339.8, vol: 9, icon: '🥇' },
];

export default function TradingDashboard({ user, onLogout }) {
  const [selectedAsset, setSelectedAsset] = useState(OTC_ASSETS[0]);
  const [candles, setCandles] = useState(() => generateCandles(120, OTC_ASSETS[0].base, OTC_ASSETS[0].vol));
  const [currentPrice, setCurrentPrice] = useState(OTC_ASSETS[0].base);
  const [positions, setPositions] = useState([]);
  const [balance, setBalance] = useState(user?.balance || 10000);
  const [activeView, setActiveView] = useState('trade');
  const [timeframe, setTimeframe] = useState('1m');
  const [sidebarTab, setSidebarTab] = useState('assets');
  const priceRef = useRef(OTC_ASSETS[0].base);

  // Live price simulation
  useEffect(() => {
    priceRef.current = selectedAsset.base;
    setCandles(generateCandles(120, selectedAsset.base, selectedAsset.vol));
    setCurrentPrice(selectedAsset.base);
  }, [selectedAsset]);

  useEffect(() => {
    const interval = setInterval(() => {
      const move = (Math.random() - 0.499) * selectedAsset.vol * 2;
      const newPrice = Math.max(0.0001, priceRef.current + move);
      priceRef.current = newPrice;
      setCurrentPrice(newPrice);

      setCandles(prev => {
        const last = prev[prev.length - 1];
        const newCandle = {
          ...last,
          close: newPrice,
          high: Math.max(last.high, newPrice),
          low: Math.min(last.low, newPrice),
          volume: last.volume + Math.floor(Math.random() * 10),
        };
        return [...prev.slice(0, -1), newCandle];
      });

      // New candle every minute (simulated: every 6s)
      if (Math.random() < 0.08) {
        setCandles(prev => [
          ...prev.slice(1),
          { time: Date.now(), open: newPrice, high: newPrice, low: newPrice, close: newPrice, volume: 0 }
        ]);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [selectedAsset]);

  // Resolve open positions
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setPositions(prev => {
        let balanceDelta = 0;
        const updated = prev.map(p => {
          if (p.status !== 'open' || now < p.expiresAt) return p;
          const win = (p.direction === 'CALL' && currentPrice > p.openPrice) ||
                      (p.direction === 'PUT' && currentPrice < p.openPrice);
          const profit = win ? p.amount * (p.payout / 100) : -p.amount;
          balanceDelta += profit;
          return { ...p, status: win ? 'win' : 'loss', closePrice: currentPrice, profit };
        });
        if (balanceDelta !== 0) setBalance(b => +(b + balanceDelta).toFixed(2));
        return updated;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [currentPrice]);

  const placeTrade = useCallback((direction, amount, duration) => {
    if (amount > balance) return;
    setBalance(b => +(b - amount).toFixed(2));
    const newPos = {
      id: Date.now(),
      asset: selectedAsset.name,
      direction,
      amount,
      payout: selectedAsset.payout,
      openPrice: priceRef.current,
      openTime: Date.now(),
      expiresAt: Date.now() + duration * 1000,
      duration,
      status: 'open',
      profit: 0,
      closePrice: null,
    };
    setPositions(prev => [newPos, ...prev]);
  }, [balance, selectedAsset]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg-void)' }}>
      <TopBar user={user} balance={balance} onLogout={onLogout} currentPrice={currentPrice} selectedAsset={selectedAsset} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left sidebar — asset list */}
        <Sidebar
          assets={OTC_ASSETS}
          selectedAsset={selectedAsset}
          onSelect={setSelectedAsset}
          tab={sidebarTab}
          onTabChange={setSidebarTab}
          currentPrice={currentPrice}
        />

        {/* Main chart area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* Chart header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-deep)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{selectedAsset.name}</span>
              <PriceDisplay price={currentPrice} asset={selectedAsset} />
              <span style={{ background: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)', border: '1px solid var(--border-accent)', padding: '2px 10px', borderRadius: 100, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                {selectedAsset.payout}% payout
              </span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['1m', '5m', '15m', '30m', '1h', '4h', '1d'].map(tf => (
                <button key={tf} onClick={() => setTimeframe(tf)} style={{
                  padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: 'none', fontSize: 11, fontFamily: 'var(--font-mono)', cursor: 'pointer',
                  background: timeframe === tf ? 'var(--accent-cyan)' : 'var(--bg-elevated)',
                  color: timeframe === tf ? '#000' : 'var(--text-secondary)',
                  fontWeight: timeframe === tf ? 700 : 400,
                }}>{tf}</button>
              ))}
            </div>
          </div>

          <CandlestickChart candles={candles} currentPrice={currentPrice} asset={selectedAsset} />
        </div>

        {/* Right panel */}
        <div style={{ width: 300, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <AISignalPanel asset={selectedAsset} currentPrice={currentPrice} />
          <OrderPanel asset={selectedAsset} balance={balance} onTrade={placeTrade} currentPrice={currentPrice} />
        </div>
      </div>

      {/* Bottom positions panel */}
      <PositionsPanel positions={positions} currentPrice={currentPrice} />
    </div>
  );
}

function PriceDisplay({ price, asset }) {
  const [prev, setPrev] = useState(price);
  const [dir, setDir] = useState(null);

  useEffect(() => {
    if (price !== prev) {
      setDir(price > prev ? 'up' : 'down');
      setPrev(price);
      const t = setTimeout(() => setDir(null), 500);
      return () => clearTimeout(t);
    }
  }, [price, prev]);

  const decimals = asset.base > 100 ? 2 : asset.base > 1 ? 4 : 5;

  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 18,
      color: dir === 'up' ? 'var(--accent-green)' : dir === 'down' ? 'var(--accent-red)' : 'var(--text-primary)',
      transition: 'color 0.3s',
    }}>
      {price.toFixed(decimals)}
    </span>
  );
}
