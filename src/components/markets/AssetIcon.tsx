import type { ReactElement } from "react";
import "./AssetIcon.css";

// Simplified, hand-drawn flag artwork (24x24, clipped to a circle) so every
// platform shows the same thing; emoji flags do not render on Windows.
const FLAGS: Record<string, ReactElement> = {
  USD: (
    <>
      <rect width="24" height="24" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 24) / 13} width="24" height={24 / 13} fill="#c8102e" />
      ))}
      <rect width="11" height={(7 * 24) / 13} fill="#1f3a93" />
    </>
  ),
  EUR: (
    <>
      <rect width="24" height="24" fill="#1d4fb8" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={12 + Math.cos(a) * 6.4} cy={12 + Math.sin(a) * 6.4} r="1" fill="#ffcc00" />;
      })}
    </>
  ),
  GBP: (
    <>
      <rect width="24" height="24" fill="#1f3a93" />
      <path d="M0 0L24 24M24 0L0 24" stroke="#fff" strokeWidth="4.5" />
      <path d="M0 0L24 24M24 0L0 24" stroke="#c8102e" strokeWidth="1.6" />
      <path d="M12 0V24M0 12H24" stroke="#fff" strokeWidth="7" />
      <path d="M12 0V24M0 12H24" stroke="#c8102e" strokeWidth="4" />
    </>
  ),
  JPY: (
    <>
      <rect width="24" height="24" fill="#fff" />
      <circle cx="12" cy="12" r="5.4" fill="#bc002d" />
    </>
  ),
  AUD: (
    <>
      <rect width="24" height="24" fill="#1f3a93" />
      <path d="M2 2L11 11M11 2L2 11" stroke="#fff" strokeWidth="2" />
      <path d="M6.5 0V13M0 6.5H13" stroke="#fff" strokeWidth="3" />
      <path d="M6.5 0V13M0 6.5H13" stroke="#c8102e" strokeWidth="1.5" />
      <circle cx="17" cy="9" r="1.1" fill="#fff" />
      <circle cx="19.5" cy="14" r="1.1" fill="#fff" />
      <circle cx="15.5" cy="18" r="1.1" fill="#fff" />
      <circle cx="7" cy="18" r="1.6" fill="#fff" />
    </>
  ),
  NZD: (
    <>
      <rect width="24" height="24" fill="#1f3a93" />
      <path d="M6.5 0V13M0 6.5H13" stroke="#fff" strokeWidth="3" />
      <path d="M6.5 0V13M0 6.5H13" stroke="#c8102e" strokeWidth="1.5" />
      <circle cx="17" cy="9" r="1.2" fill="#c8102e" stroke="#fff" strokeWidth="0.5" />
      <circle cx="20" cy="13" r="1.2" fill="#c8102e" stroke="#fff" strokeWidth="0.5" />
      <circle cx="16" cy="17" r="1.2" fill="#c8102e" stroke="#fff" strokeWidth="0.5" />
    </>
  ),
  CAD: (
    <>
      <rect width="24" height="24" fill="#fff" />
      <rect width="6" height="24" fill="#d52b1e" />
      <rect x="18" width="6" height="24" fill="#d52b1e" />
      <path d="M12 6l1.4 3 2.4-1-1 4 2-1-.6 2.6-3.2.4v3h-2v-3l-3.2-.4L7.2 11l2 1-1-4 2.4 1z" fill="#d52b1e" />
    </>
  ),
  CHF: (
    <>
      <rect width="24" height="24" fill="#d52b1e" />
      <path d="M10 5h4v5h5v4h-5v5h-4v-5H5v-4h5z" fill="#fff" />
    </>
  ),
  ZAR: (
    <>
      <rect width="24" height="12" fill="#e03c31" />
      <rect y="12" width="24" height="12" fill="#001489" />
      <path d="M0 0L12 12L0 24" fill="#000" stroke="#ffb612" strokeWidth="1.4" />
      <path d="M0 4L8 12L0 20M10 12H24" stroke="#fff" strokeWidth="5" fill="none" />
      <path d="M0 4L8 12L0 20M10 12H24" stroke="#007749" strokeWidth="3" fill="none" />
      <path d="M0 6L6 12L0 18Z" fill="#000" />
    </>
  ),
};

type Glyph = { text: string; bg: string; fg?: string };

const GLYPHS: Record<string, Glyph> = {
  BTC: { text: "₿", bg: "#f7931a" },
  ETH: { text: "Ξ", bg: "#627eea" },
  BNB: { text: "B", bg: "#f3ba2f", fg: "#1a1200" },
  SOL: { text: "S", bg: "linear-gradient(135deg,#9945ff,#14f195)" },
  XRP: { text: "X", bg: "#23292f" },
  ADA: { text: "A", bg: "#0033ad" },
  DOGE: { text: "Ð", bg: "#c2a633" },
  LTC: { text: "Ł", bg: "#345d9d" },
  DOT: { text: "●", bg: "#e6007a" },
  AVAX: { text: "A", bg: "#e84142" },
  LINK: { text: "⬡", bg: "#2a5ada" },
  XAU: { text: "Au", bg: "linear-gradient(135deg,#ffd76a,#c8961e)", fg: "#2a1c00" },
  XAG: { text: "Ag", bg: "linear-gradient(135deg,#f1f5f9,#94a3b8)", fg: "#1e293b" },
  GOLD: { text: "Au", bg: "linear-gradient(135deg,#ffd76a,#c8961e)", fg: "#2a1c00" },
  BRENT: { text: "Oil", bg: "#1f2937" },
  WTI: { text: "Oil", bg: "#1f2937" },
  OIL: { text: "Oil", bg: "#1f2937" },
  APPLE: { text: "A", bg: "#e5e7eb", fg: "#111" },
  TESLA: { text: "T", bg: "#cc0000" },
  AMAZON: { text: "a", bg: "#ff9900", fg: "#111" },
  MICROSOFT: { text: "M", bg: "#00a4ef" },
  META: { text: "M", bg: "#0866ff" },
  GOOGLE: { text: "G", bg: "#4285f4" },
  NVIDIA: { text: "N", bg: "#76b900" },
  NETFLIX: { text: "N", bg: "#e50914" },
};

// Index symbols ("US 500", "UK100", "JP225") show their country's flag.
const INDEX_FLAGS: Record<string, string> = { US: "USD", UK: "GBP", JP: "JPY", AU: "AUD", EU: "EUR" };

function baseSymbol(symbol: string) {
  return symbol.replace(/\s*OTC$/i, "").trim();
}

function glyphFor(symbol: string, category?: string): Glyph {
  const base = baseSymbol(symbol).toUpperCase();
  const first = base.split(/[/\s]/)[0];
  if (GLYPHS[first]) return GLYPHS[first];
  if (category === "Indices" || /^(US|UK|DE|JP|HK|EU)\d+/.test(first)) {
    return { text: first.replace(/^[A-Z]+/, "") || first.slice(0, 3), bg: "#1d4ed8" };
  }
  if (category === "Commodities") return { text: first.slice(0, 2), bg: "linear-gradient(135deg,#ffd76a,#c8961e)", fg: "#2a1c00" };
  return { text: first.slice(0, 1), bg: "#334155" };
}

type AssetIconProps = {
  symbol: string;
  category?: string;
  size?: number;
};

/** Round icon for an asset: overlapping flags for currency pairs, a coloured glyph otherwise. */
export default function AssetIcon({ symbol, category, size = 32 }: AssetIconProps) {
  const [left, right] = baseSymbol(symbol).toUpperCase().split("/");

  if (left && right && FLAGS[left] && FLAGS[right]) {
    const inner = Math.round(size * 0.72);
    return (
      <span className="asset-icon asset-icon-pair" style={{ width: size, height: size }} aria-hidden="true">
        {[left, right].map((code, index) => (
          <svg
            key={code}
            viewBox="0 0 24 24"
            width={inner}
            height={inner}
            className={index === 0 ? "is-back" : "is-front"}
          >
            <defs>
              <clipPath id={`flag-clip-${code}`}>
                <circle cx="12" cy="12" r="12" />
              </clipPath>
            </defs>
            <g clipPath={`url(#flag-clip-${code})`}>{FLAGS[code]}</g>
          </svg>
        ))}
      </span>
    );
  }

  const indexFlag = category === "Indices" ? INDEX_FLAGS[baseSymbol(symbol).toUpperCase().slice(0, 2)] : undefined;
  if (indexFlag && FLAGS[indexFlag]) {
    return (
      <span className="asset-icon asset-icon-pair" style={{ width: size, height: size }} aria-hidden="true">
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <defs>
            <clipPath id={`flag-clip-index-${indexFlag}`}>
              <circle cx="12" cy="12" r="12" />
            </clipPath>
          </defs>
          <g clipPath={`url(#flag-clip-index-${indexFlag})`}>{FLAGS[indexFlag]}</g>
        </svg>
      </span>
    );
  }

  const glyph = glyphFor(symbol, category);
  return (
    <span
      className="asset-icon asset-icon-glyph"
      style={{
        width: size,
        height: size,
        background: glyph.bg,
        color: glyph.fg ?? "#fff",
        fontSize: Math.round(size * (glyph.text.length > 2 ? 0.3 : glyph.text.length > 1 ? 0.36 : 0.46)),
      }}
      aria-hidden="true"
    >
      {glyph.text}
    </span>
  );
}
