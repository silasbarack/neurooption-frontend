// frontend/src/pages/TradingPage.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import './TradingPage.css';

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type Trade = {
  id: string;
  direction: 'BUY' | 'SELL';
  amount: number;
  entry: number;
  expiryAt: number;
  status: 'OPEN' | 'WON' | 'LOST';
  profit: number;
};

const pairs = ['EUR/USD OTC', 'CAD/JPY OTC', 'GBP/USD OTC', 'USD/JPY OTC', 'AUD/USD OTC'];
const timeframes = ['S5', 'S10', 'S15', 'S30', 'M1', 'M2', 'M3', 'M5', 'M10', 'M15', 'M30', 'H1'];
const chartTypes = ['Candles', 'Line', 'Bars', 'Heikin Ashi'];
const indicators = [
  'Alligator', 'Moving Average', 'Bollinger Bands', 'RSI', 'MACD', 'ADX', 'CCI', 'Aroon',
  'ATR', 'Awesome Oscillator', 'Bears Power', 'Bulls Power', 'DeMarker', 'Fractal',
  'Ichimoku Kinko Hyo', 'Momentum', 'Parabolic SAR', 'Stochastic Oscillator', 'SuperTrend',
  'Volume', 'ZigZag', 'Williams %R', 'Rate of Change', 'OsMA', 'Envelopes',
  'Donchian Channel', 'Keltner Channel', 'Vortex', 'Fractal Chaos Bands',
  'Bollinger Bands Width', 'Schaff Trend Cycle', 'Accelerator Oscillator',
];

const currencies: Record<string, number> = {
  USD: 1,
  KES: 130,
  EUR: 0.92,
  GBP: 0.78,
  NGN: 1500,
  ZAR: 18.4,
  UGX: 3800,
  TZS: 2600,
  RWF: 1300,
  GHS: 15,
  EGP: 48,
};

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function secondsFromTimeframe(tf: string) {
  if (tf.startsWith('S')) return Number(tf.slice(1));
  if (tf.startsWith('M')) return Number(tf.slice(1)) * 60;
  if (tf.startsWith('H')) return Number(tf.slice(1)) * 3600;
  return 60;
}

function makeCandles(count = 120): Candle[] {
  const candles: Candle[] = [];
  let price = 1.2;

  for (let i = 0; i < count; i++) {
    const open = price;
    const drift = Math.sin(i / 9) * 0.00025;
    const noise = (Math.random() - 0.5) * 0.0011;
    const close = open + drift + noise;
    const high = Math.max(open, close) + Math.random() * 0.00055;
    const low = Math.min(open, close) - Math.random() * 0.00055;

    candles.push({
      time: Date.now() - (count - i) * 1000,
      open,
      high,
      low,
      close,
    });

    price = close;
  }

  return candles;
}

// Performance optimization: Memoized Moving Average calculation
function calculateMovingAverages(candles: Candle[]) {
  const ma5: number[] = [];
  const ma13: number[] = [];
  const ma21: number[] = [];
  let sum5 = 0, sum13 = 0, sum21 = 0;

  candles.forEach((candle, i) => {
    sum5 += candle.close;
    sum13 += candle.close;
    sum21 += candle.close;

    if (i >= 5) sum5 -= candles[i - 5].close;
    if (i >= 13) sum13 -= candles[i - 13].close;
    if (i >= 21) sum21 -= candles[i - 21].close;

    ma5[i] = sum5 / Math.min(i + 1, 5);
    ma13[i] = sum13 / Math.min(i + 1, 13);
    ma21[i] = sum21 / Math.min(i + 1, 21);
  });

  return { ma5, ma13, ma21 };
}

export default function TradingPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dataUpdateQueueRef = useRef<boolean>(false);
  
  const [candles, setCandles] = useState<Candle[]>(() => makeCandles());
  const [pair, setPair] = useState('EUR/USD OTC');
  const [timeframe, setTimeframe] = useState('M1');
  const [chartType, setChartType] = useState('Candles');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['Alligator']);
  const [currency, setCurrency] = useState('USD');
  const [accountType, setAccountType] = useState<'DEMO' | 'REAL'>('DEMO');
  const [demoUsd, setDemoUsd] = useState(70000);
  const [realUsd, setRealUsd] = useState(0);
  const [amount, setAmount] = useState(100);
  const [expirySeconds, setExpirySeconds] = useState(60);
  const [activeTool, setActiveTool] = useState<'charts' | 'indicators' | 'drawings' | null>(null);
  const [zoom, setZoom] = useState(1);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [recentResults, setRecentResults] = useState<Trade[]>([]);
  const payout = 0.85;

  const balanceUsd = accountType === 'DEMO' ? demoUsd : realUsd;
  const displayBalance = balanceUsd * currencies[currency];

  const lastPrice = candles[candles.length - 1]?.close ?? 1.2;

  // Memoize moving averages instead of recalculating every render
  const mas = useMemo(() => 
    calculateMovingAverages(candles),
    [candles]
  );

  const currentAmountUsd = useMemo(() => {
    return amount / currencies[currency];
  }, [amount, currency]);

  // Consolidate data updates into a single interval and use RAF for rendering
  useEffect(() => {
    let candleInterval: number;

    // Update candles less frequently - every 650ms
    candleInterval = window.setInterval(() => {
      setCandles(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        const open = last.close;
        const move = Math.sin(Date.now() / 1800) * 0.00012 + (Math.random() - 0.5) * 0.00055;
        const close = open + move;
        const high = Math.max(open, close) + Math.random() * 0.00025;
        const low = Math.min(open, close) - Math.random() * 0.00025;

        next.push({
          time: Date.now(),
          open,
          high,
          low,
          close,
        });

        return next.slice(-160);
      });
      dataUpdateQueueRef.current = true;
    }, 650);

    return () => window.clearInterval(candleInterval);
  }, []);

  // Trade settlement check - separate from candle updates
  useEffect(() => {
    const timer = window.setInterval(() => {
      setTrades(prev => {
        const now = Date.now();
        const updated: Trade[] = [];

        for (const trade of prev) {
          if (trade.status !== 'OPEN' || now < trade.expiryAt) {
            updated.push(trade);
            continue;
          }

          const won =
            trade.direction === 'BUY'
              ? lastPrice > trade.entry
              : lastPrice < trade.entry;

          const profit = won ? trade.amount * payout : 0;

          const closed: Trade = {
            ...trade,
            status: won ? 'WON' : 'LOST',
            profit,
          };

          if (won) {
            if (accountType === 'DEMO') setDemoUsd(v => v + trade.amount + profit);
            else setRealUsd(v => v + trade.amount + profit);
          }

          setRecentResults(r => [...r, closed]);
          setTimeout(() => {
            setRecentResults(r => r.filter(x => x.id !== closed.id));
          }, 10000);
        }

        return updated;
      });
    }, 300);

    return () => window.clearInterval(timer);
  }, [lastPrice, accountType]);

  // Canvas rendering with requestAnimationFrame - optimized draw function
  const drawChart = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number
  ) => {
    ctx.clearRect(0, 0, w, h);

    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#0b1223');
    gradient.addColorStop(0.5, '#07101f');
    gradient.addColorStop(1, '#030713');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#4da3ff';
    ctx.beginPath();
    ctx.arc(w * 0.35, h * 0.2, 180, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    const visibleCount = Math.max(16, Math.round(95 / zoom));
    const visible = candles.slice(-visibleCount);
    const highs = visible.map(c => c.high);
    const lows = visible.map(c => c.low);
    const max = Math.max(...highs);
    const min = Math.min(...lows);
    const range = max - min || 1;
    const pad = 48;

    const y = (price: number) => h - pad - ((price - min) / range) * (h - pad * 2);
    const candleW = Math.max(4, (w - 110) / visible.length * 0.58);

    // Draw grid - optimized
    ctx.strokeStyle = 'rgba(255,255,255,.07)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const x = 50 + (i * (w - 100)) / 9;
      ctx.beginPath();
      ctx.moveTo(x, 30);
      ctx.lineTo(x, h - 40);
      ctx.stroke();
    }

    for (let i = 0; i < 7; i++) {
      const gy = 35 + (i * (h - 70)) / 6;
      ctx.beginPath();
      ctx.moveTo(45, gy);
      ctx.lineTo(w - 45, gy);
      ctx.stroke();
    }

    // Draw chart type
    if (chartType === 'Line') {
      ctx.strokeStyle = '#65e4c0';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      visible.forEach((c, i) => {
        const x = 55 + (i * (w - 110)) / visible.length;
        const yy = y(c.close);
        if (i === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      });
      ctx.stroke();
    } else {
      visible.forEach((c, i) => {
        const x = 55 + (i * (w - 110)) / visible.length;
        const up = c.close >= c.open;
        const color = up ? '#63f2c6' : '#ff735f';

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.4;

        ctx.beginPath();
        ctx.moveTo(x, y(c.high));
        ctx.lineTo(x, y(c.low));
        ctx.stroke();

        if (chartType === 'Bars') {
          ctx.beginPath();
          ctx.moveTo(x - candleW / 2, y(c.open));
          ctx.lineTo(x, y(c.open));
          ctx.moveTo(x, y(c.close));
          ctx.lineTo(x + candleW / 2, y(c.close));
          ctx.stroke();
        } else {
          const top = y(Math.max(c.open, c.close));
          const bottom = y(Math.min(c.open, c.close));
          ctx.fillRect(x - candleW / 2, top, candleW, Math.max(2, bottom - top));
        }
      });
    }

    // Draw indicators using pre-calculated moving averages
    if (selectedIndicators.includes('Alligator') || selectedIndicators.includes('Moving Average')) {
      const drawMA = (ma: number[], color: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const startIdx = Math.max(0, candles.length - visibleCount);
        ma.slice(startIdx).forEach((avg, i) => {
          const x = 55 + (i * (w - 110)) / visible.length;
          const yy = y(avg);
          if (i === 0) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        });

        ctx.stroke();
      };

      drawMA(mas.ma5, '#9be15d');
      drawMA(mas.ma13, '#ff8a4c');
      drawMA(mas.ma21, '#4da3ff');
    }

    // Draw price line
    const priceY = y(lastPrice);
    ctx.strokeStyle = '#5fb5ff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(45, priceY);
    ctx.lineTo(w - 45, priceY);
    ctx.stroke();

    ctx.fillStyle = '#5fb5ff';
    ctx.fillRect(w - 96, priceY - 15, 84, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Roboto, sans-serif';
    ctx.fillText(lastPrice.toFixed(5), w - 88, priceY + 5);

    // Draw expiration line
    const expiryX = w * 0.74;
    ctx.strokeStyle = '#9fd6ff';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(expiryX, 22);
    ctx.lineTo(expiryX, h - 40);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '13px Roboto, sans-serif';
    ctx.fillText('Expiration', expiryX + 10, 44);

    // Draw open trades
    trades.forEach(trade => {
      if (trade.status !== 'OPEN') return;
      const secondsLeft = Math.max(0, Math.ceil((trade.expiryAt - Date.now()) / 1000));
      const boxY = y(trade.entry) - 24;
      const color = trade.direction === 'BUY' ? '#2fca73' : '#ff5b4f';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(expiryX - 92, boxY, 82, 42, 10);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Roboto, sans-serif';
      ctx.fillText(`${trade.direction === 'BUY' ? '▲' : '▼'} ${formatMoney(trade.amount * currencies[currency], currency)}`, expiryX - 80, boxY + 18);
      ctx.font = '12px Roboto, sans-serif';
      ctx.fillText(`00:${String(secondsLeft).padStart(2, '0')}`, expiryX - 70, boxY + 35);
    });

    // Draw recent results
    recentResults.forEach((trade, index) => {
      const boxY = 72 + index * 42;
      const won = trade.status === 'WON';

      ctx.fillStyle = won ? '#19c875' : '#ff554d';
      ctx.beginPath();
      ctx.roundRect(w - 180, boxY, 140, 38, 18);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Roboto, sans-serif';
      ctx.fillText(won ? `+${formatMoney(trade.profit * currencies[currency], currency)}` : `${formatMoney(0, currency)}`, w - 168, boxY + 24);
      ctx.fillText('✓✓', w - 72, boxY + 24);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const w = rect.width;
      const h = rect.height;

      drawChart(ctx, w, h);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [candles, chartType, selectedIndicators, trades, recentResults, zoom, currency, lastPrice, mas]);

  function placeTrade(direction: 'BUY' | 'SELL') {
    if (currentAmountUsd <= 0 || currentAmountUsd > balanceUsd) return;

    const trade: Trade = {
      id: crypto.randomUUID(),
      direction,
      amount: currentAmountUsd,
      entry: lastPrice,
      expiryAt: Date.now() + expirySeconds * 1000,
      status: 'OPEN',
      profit: 0,
    };

    if (accountType === 'DEMO') setDemoUsd(v => v - currentAmountUsd);
    else setRealUsd(v => v - currentAmountUsd);

    setTrades(prev => [...prev, trade]);
  }

  function changeExpiry(delta: number) {
    setExpirySeconds(prev => Math.min(18000, Math.max(5, prev + delta)));
  }

  function formatExpiry(sec: number) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  return (
    <main className="trading-page">
      <aside className="side-nav">
        <div className="brand-badge">N</div>
        <button>📈<span>Trading</span></button>
        <button>💵<span>Finance</span></button>
        <button>👤<span>Profile</span></button>
        <button>🛒<span>Market</span></button>
        <button>💬<span>Chat</span></button>
        <button>❔<span>Help</span></button>
      </aside>

      <section className="trade-shell">
        <header className="trade-header">
          <div className="brand-title">NeuroOption</div>
          <div className="balance-pill">
            QT {accountType === 'DEMO' ? 'Demo' : 'Real'} {formatMoney(displayBalance, currency)}
          </div>
          <button className="topup">TOP UP</button>
        </header>

        <div className="toolbar">
          <select value={pair} onChange={e => setPair(e.target.value)}>
            {pairs.map(p => <option key={p}>{p}</option>)}
          </select>

          <button onClick={() => setActiveTool(activeTool === 'charts' ? null : 'charts')}>▥</button>
          <button onClick={() => setActiveTool(activeTool === 'indicators' ? null : 'indicators')}>☷</button>
          <button onClick={() => setActiveTool(activeTool === 'drawings' ? null : 'drawings')}>✎</button>

          {timeframes.map(t => (
            <button
              key={t}
              className={timeframe === t ? 'active' : ''}
              onClick={() => {
                setTimeframe(t);
                setExpirySeconds(secondsFromTimeframe(t));
              }}
            >
              {t}
            </button>
          ))}

          <button onClick={() => setZoom(z => Math.min(2.4, z + 0.15))}>＋</button>
          <button onClick={() => setZoom(z => Math.max(0.65, z - 0.15))}>－</button>
          <button onClick={() => document.documentElement.requestFullscreen()}>⛶</button>
        </div>

        <div className="chart-area">
          {activeTool === 'charts' && (
            <div className="floating-panel charts-panel">
              <h3>Chart types</h3>
              <div className="grid-four">
                {chartTypes.map(type => (
                  <button
                    key={type}
                    className={chartType === type ? 'active' : ''}
                    onClick={() => setChartType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTool === 'indicators' && (
            <div className="floating-panel indicators-panel">
              <h3>Indicators</h3>
              <div className="indicator-grid">
                {indicators.map(ind => (
                  <button
                    key={ind}
                    className={selectedIndicators.includes(ind) ? 'active' : ''}
                    onClick={() =>
                      setSelectedIndicators(prev =>
                        prev.includes(ind)
                          ? prev.filter(x => x !== ind)
                          : [...prev, ind],
                      )
                    }
                  >
                    ☆ {ind}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTool === 'drawings' && (
            <div className="floating-panel drawings-panel">
              {['Horizontal Line', 'Vertical Line', 'Ray', 'Trend Line', 'Fibonacci Retracement', 'Rectangle', 'Parallel Channel'].map(d => (
                <button key={d}>{d}</button>
              ))}
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="trading-canvas"
            onWheel={e => {
              e.preventDefault();
              setZoom(z => e.deltaY < 0 ? Math.min(2.4, z + 0.08) : Math.max(0.65, z - 0.08));
            }}
          />
        </div>
      </section>

      <aside className="trade-panel">
        <div className="account-tabs">
          <button className={accountType === 'DEMO' ? 'active' : ''} onClick={() => setAccountType('DEMO')}>Demo</button>
          <button className={accountType === 'REAL' ? 'active' : ''} onClick={() => setAccountType('REAL')}>Real</button>
        </div>

        <label>Currency</label>
        <select value={currency} onChange={e => setCurrency(e.target.value)}>
          {Object.keys(currencies).map(c => <option key={c}>{c}</option>)}
        </select>

        <label>Time</label>
        <div className="time-tabs">
          <button onClick={() => changeExpiry(1)}>Seconds</button>
          <button onClick={() => changeExpiry(60)}>Minutes</button>
          <button onClick={() => changeExpiry(3600)}>Hours</button>
        </div>

        <div className="stepper">
          <button onClick={() => changeExpiry(-1)}>-</button>
          <strong>{formatExpiry(expirySeconds)}</strong>
          <button onClick={() => changeExpiry(1)}>+</button>
        </div>

        <label>Amount</label>
        <input
          value={amount}
          type="number"
          min={1}
          onChange={e => setAmount(Number(e.target.value))}
        />

        <div className="payout-box">
          <p><span>Payout</span><b>+85%</b></p>
          <p><span>Profit</span><b>{formatMoney(amount * payout, currency)}</b></p>
          <p><span>Return if won</span><b>{formatMoney(amount + amount * payout, currency)}</b></p>
        </div>

        <button className="buy" onClick={() => placeTrade('BUY')}>↑ BUY</button>
        <button className="sell" onClick={() => placeTrade('SELL')}>↓ SELL</button>
      </aside>
    </main>
  );
}