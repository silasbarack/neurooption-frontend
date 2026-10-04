import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CandlestickChart,
  ChevronDown,
  CircleUserRound,
  Clock,
  History,
  LayoutGrid,
  LineChart,
  Minus,
  MoreVertical,
  Plus,
  Radio,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";

// Deterministic market data so the showcase looks the same on every load.
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

type Candle = { open: number; close: number; high: number; low: number };

function buildCandles(count: number): Candle[] {
  const rand = seededRandom(20261004);
  const candles: Candle[] = [];
  let price = 1.0812;
  for (let i = 0; i < count; i++) {
    const wave = Math.sin(i / 7) * 0.00034 + Math.sin(i / 19) * 0.00022;
    const drift = 0.00001 + wave * 0.45;
    const vol = 0.00022 + rand() * 0.00026;
    const open = price;
    const close = open + drift + (rand() - 0.5) * vol * 2;
    const high = Math.max(open, close) + rand() * vol * 0.8;
    const low = Math.min(open, close) - rand() * vol * 0.8;
    candles.push({ open, close, high, low });
    price = close;
  }
  return candles;
}

function sparkline(seed: number, trendUp: boolean): string {
  const rand = seededRandom(seed);
  let y = 14;
  const points: string[] = [];
  for (let i = 0; i <= 16; i++) {
    y += (rand() - 0.5) * 6 + (trendUp ? -0.45 : 0.45);
    y = Math.max(3, Math.min(25, y));
    points.push(`${(i * 60) / 16},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

const CANDLES = buildCandles(62);
const CHART = { width: 760, height: 300, padTop: 18, padBottom: 26, padRight: 64 };
const MIN = Math.min(...CANDLES.map((c) => c.low)) - 0.00008;
const MAX = Math.max(...CANDLES.map((c) => c.high)) + 0.00008;
const plotW = CHART.width - CHART.padRight;
const plotH = CHART.height - CHART.padTop - CHART.padBottom;
const step = plotW / CANDLES.length;
const y = (price: number) => CHART.padTop + (1 - (price - MIN) / (MAX - MIN)) * plotH;
const LAST = CANDLES[CANDLES.length - 1].close;
const EXPIRY_X = step * (CANDLES.length - 6);
const AXIS = Array.from({ length: 6 }, (_, i) => MIN + ((MAX - MIN) * (i + 0.5)) / 6);
const TIMES = ["11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30"];

const TICKERS = [
  { pair: "EUR/USD OTC", price: "1.08231", change: "+0.12%", up: true },
  { pair: "USD/JPY OTC", price: "149.321", change: "+0.21%", up: true },
  { pair: "AUD/CAD OTC", price: "0.90812", change: "-0.08%", up: false },
  { pair: "BTC/USD OTC", price: "64,218.40", change: "+0.64%", up: true },
  { pair: "ETH/USD OTC", price: "3,184.25", change: "-0.14%", up: false },
  { pair: "XAU/USD OTC", price: "2,341.26", change: "+0.37%", up: true },
];

const MENU = [
  { icon: CandlestickChart, label: "Trading", active: true },
  { icon: LayoutGrid, label: "Markets" },
  { icon: Radio, label: "Signals" },
  { icon: Users, label: "Social trading" },
  { icon: Trophy, label: "Tournaments" },
  { icon: History, label: "History" },
  { icon: Wallet, label: "Finance" },
];

export default function HeroDashboard() {
  return (
    <div className="hd" aria-label="NeuroOption trading workspace preview" role="img">
      <div className="hd-top">
        <div className="hd-brand">
          <img src="/apple-touch-icon.png" alt="" width="26" height="26" />
          <span>Trading workspace</span>
        </div>
        <div className="hd-top-right">
          <div className="hd-account">
            <small>Demo account</small>
            <strong>$10,000.00</strong>
            <ChevronDown size={14} />
          </div>
          <span className="hd-topup"><Plus size={14} /> Top up</span>
          <CircleUserRound size={22} className="hd-icon" />
          <MoreVertical size={18} className="hd-icon" />
        </div>
      </div>

      <div className="hd-body">
        <aside className="hd-menu">
          {MENU.map(({ icon: Icon, label, active }) => (
            <span key={label} className={active ? "is-active" : undefined}>
              <Icon size={16} />
              {label}
            </span>
          ))}
        </aside>

        <div className="hd-chart-area">
          <div className="hd-toolbar">
            <span className="hd-pair">EUR/USD OTC <ChevronDown size={14} /></span>
            <span className="hd-square"><Plus size={14} /></span>
            <span className="hd-time"><Clock size={12} /> 12:24:17 UTC</span>
            <span className="hd-tf">M1</span>
          </div>

          <div className="hd-chart">
            <div className="hd-tools">
              <LineChart size={15} />
              <BarChart3 size={15} />
              <CandlestickChart size={15} />
              <span>5m</span>
            </div>

            <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} preserveAspectRatio="none">
              {AXIS.map((price) => (
                <g key={price}>
                  <line x1="0" x2={plotW} y1={y(price)} y2={y(price)} className="hd-grid" />
                  {Math.abs(y(price) - y(LAST)) > 14 && (
                    <text x={plotW + 8} y={y(price) + 4} className="hd-axis">{price.toFixed(5)}</text>
                  )}
                </g>
              ))}
              {TIMES.map((time, i) => (
                <text key={time} x={(plotW / (TIMES.length - 1)) * i} y={CHART.height - 6} className="hd-axis" textAnchor={i === 0 ? "start" : "middle"}>
                  {time}
                </text>
              ))}

              <line x1={EXPIRY_X} x2={EXPIRY_X} y1={CHART.padTop - 8} y2={CHART.height - CHART.padBottom} className="hd-expiry" />
              <text x={EXPIRY_X - 6} y={CHART.padTop - 2} textAnchor="end" className="hd-expiry-caption">Expiration</text>
              <text x={EXPIRY_X - 6} y={CHART.padTop + 11} textAnchor="end" className="hd-expiry-text">00:00:43</text>

              {CANDLES.map((c, i) => {
                const x = i * step + step / 2;
                const up = c.close >= c.open;
                const top = y(Math.max(c.open, c.close));
                const bodyH = Math.max(1.5, y(Math.min(c.open, c.close)) - top);
                return (
                  <g key={i} className={up ? "hd-up" : "hd-down"}>
                    <line x1={x} x2={x} y1={y(c.high)} y2={y(c.low)} />
                    <rect x={x - step * 0.32} y={top} width={step * 0.64} height={bodyH} rx="0.6" />
                  </g>
                );
              })}

              <line x1="0" x2={plotW} y1={y(LAST)} y2={y(LAST)} className="hd-last" />
              <rect x={plotW + 2} y={y(LAST) - 9} width={CHART.padRight - 4} height="18" rx="3" className="hd-last-tag" />
              <text x={plotW + 8} y={y(LAST) + 4} className="hd-last-text">{LAST.toFixed(5)}</text>
            </svg>

            <div className="hd-quote">
              <small>EUR/USD OTC</small>
              <strong>{LAST.toFixed(5)}</strong>
              <em>+0.12%</em>
            </div>
          </div>
        </div>

        <aside className="hd-trade">
          <div className="hd-tabs">
            <span className="is-active">Trade</span>
            <span>Pending</span>
          </div>
          <label>Amount</label>
          <div className="hd-stepper">
            <span>$ 100</span>
            <i><Minus size={12} /></i>
            <i><Plus size={12} /></i>
          </div>
          <label>Expiration</label>
          <div className="hd-stepper">
            <span><Clock size={12} /> 1 min</span>
            <i><Minus size={12} /></i>
            <i><Plus size={12} /></i>
          </div>
          <label>Payout</label>
          <div className="hd-payout">
            <strong>+92%</strong>
            <span>$192.00</span>
          </div>
          <span className="hd-buy">Buy <ArrowUpRight size={16} /></span>
          <span className="hd-sell">Sell <ArrowDownRight size={16} /></span>
        </aside>
      </div>

      <div className="hd-tickers">
        {TICKERS.map((t, i) => (
          <div key={t.pair} className="hd-ticker">
            <div>
              <small>{t.pair}</small>
              <strong>{t.price}</strong>
              <em className={t.up ? "is-up" : "is-down"}>{t.change}</em>
            </div>
            <svg viewBox="0 0 60 28" className={t.up ? "is-up" : "is-down"}>
              <polyline points={sparkline(100 + i * 17, t.up)} />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
