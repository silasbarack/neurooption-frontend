import {
  CandlestickChart,
  ChartNoAxesColumn,
  ClipboardList,
  History,
  Trophy,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import Logo from "../branding/Logo";
import "./DeviceShowcase.css";

function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

type Candle = { o: number; c: number; h: number; l: number };

function buildCandles(count: number, seed: number, trend: number): Candle[] {
  const rand = seeded(seed);
  const out: Candle[] = [];
  let price = 100;
  for (let i = 0; i < count; i++) {
    const swing = Math.sin(i / 6) * 0.9 + Math.sin(i / 15) * 0.6;
    const o = price;
    const c = o + trend + swing * 0.35 + (rand() - 0.5) * 2.2;
    out.push({ o, c, h: Math.max(o, c) + rand() * 1.1, l: Math.min(o, c) - rand() * 1.1 });
    price = c;
  }
  return out;
}

function CandleChart({ count, seed, trend, width, height }: { count: number; seed: number; trend: number; width: number; height: number }) {
  const candles = buildCandles(count, seed, trend);
  const max = Math.max(...candles.map((k) => k.h));
  const min = Math.min(...candles.map((k) => k.l));
  const pad = 8;
  const y = (v: number) => pad + ((max - v) / (max - min)) * (height - pad * 2);
  const step = width / count;
  const last = candles[candles.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="ds-chart-svg" aria-hidden="true">
      {[0.2, 0.4, 0.6, 0.8].map((f) => (
        <line key={f} x1="0" x2={width} y1={height * f} y2={height * f} className="ds-grid" />
      ))}
      {candles.map((k, i) => {
        const x = i * step + step / 2;
        const up = k.c >= k.o;
        return (
          <g key={i} className={up ? "ds-up" : "ds-down"}>
            <line x1={x} x2={x} y1={y(k.h)} y2={y(k.l)} strokeWidth="1" />
            <rect
              x={x - step * 0.32}
              width={step * 0.64}
              y={y(Math.max(k.o, k.c))}
              height={Math.max(1.2, Math.abs(y(k.o) - y(k.c)))}
              rx="0.6"
            />
          </g>
        );
      })}
      <line x1="0" x2={width} y1={y(last.c)} y2={y(last.c)} className="ds-last" />
    </svg>
  );
}

const SIDE_ICONS = [CandlestickChart, ChartNoAxesColumn, Wallet, UserRound, Trophy, Users];

/** Laptop and phone showing the NeuroOption trading screen, for the home page hero. */
export default function DeviceShowcase() {
  return (
    <div className="ds">
      <div className="ds-laptop">
        <div className="ds-screen">
          <div className="ds-topbar">
            <span className="ds-logo">
              <Logo loading="eager" />
            </span>
            <span className="ds-pair">EUR/USD OTC ▾</span>
            <span className="ds-tabs">
              <i>Trade</i>
              <i>Finance</i>
              <i>Markets</i>
            </span>
            <span className="ds-balance">
              <small>Demo</small>
              $70,000.00
            </span>
            <span className="ds-deposit">Deposit</span>
          </div>
          <div className="ds-body">
            <div className="ds-side">
              {SIDE_ICONS.map((Icon, i) => (
                <Icon key={i} size={11} className={i === 0 ? "is-active" : ""} />
              ))}
            </div>
            <div className="ds-chart">
              <CandleChart count={46} seed={7} trend={0.42} width={460} height={190} />
              <div className="ds-axis">
                <span>1.0890</span>
                <span>1.0880</span>
                <span>1.0870</span>
                <span>1.0860</span>
              </div>
              <div className="ds-volume">
                {Array.from({ length: 46 }, (_, i) => (
                  <i key={i} style={{ height: `${20 + ((i * 37) % 70)}%` }} className={i % 3 === 0 ? "is-down" : ""} />
                ))}
              </div>
            </div>
            <div className="ds-panel">
              <label>
                Amount
                <b>$100</b>
              </label>
              <label>
                Expiration
                <b>1 min</b>
              </label>
              <div className="ds-payout">
                <small>Payout</small>
                <b>+92%</b>
                <span>$192.00</span>
              </div>
              <span className="ds-buy">▲ BUY</span>
              <span className="ds-sell">▼ SELL</span>
            </div>
          </div>
        </div>
        <div className="ds-base" />
      </div>

      <div className="ds-phone">
        <div className="ds-phone-screen">
          <div className="ds-phone-head">
            <span>EUR/USD OTC</span>
            <b>+92%</b>
          </div>
          <CandleChart count={26} seed={19} trend={0.5} width={160} height={120} />
          <div className="ds-phone-actions">
            <span className="ds-buy">BUY</span>
            <span className="ds-sell">SELL</span>
          </div>
          <div className="ds-phone-nav">
            {[CandlestickChart, ChartNoAxesColumn, ClipboardList, History, UserRound].map((Icon, i) => (
              <Icon key={i} size={9} className={i === 0 ? "is-active" : ""} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
