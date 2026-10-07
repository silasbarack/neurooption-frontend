import "./AssetIcon.css";

// Artwork lives in public/asset-logos: flags (flag-icons, MIT), coin logos
// (cryptocurrency-icons, CC0), company marks (simple-icons, CC0) and drawn
// commodity icons. Static files, so the browser caches them across pages.
const LOGO_ROOT = "/asset-logos";

const CURRENCY_FLAGS: Record<string, string> = {
  EUR: "eu",
  USD: "us",
  GBP: "gb",
  JPY: "jp",
  AUD: "au",
  CAD: "ca",
  CHF: "ch",
  NZD: "nz",
  ZAR: "za",
};

const COINS = new Set(["BTC", "ETH", "BNB", "SOL", "XRP", "ADA", "DOGE", "LTC", "DOT", "AVAX", "LINK"]);

// Keyed by the asset name with spaces and punctuation removed.
const NAMED_LOGOS: Record<string, string> = {
  apple: "stocks/apple",
  tesla: "stocks/tesla",
  amazon: "stocks/amazon",
  microsoft: "stocks/microsoft",
  meta: "stocks/meta",
  google: "stocks/google",
  nvidia: "stocks/nvidia",
  netflix: "stocks/netflix",
  amd: "stocks/amd",
  intel: "stocks/intel",
  jpmorgan: "stocks/jpmorgan",
  visa: "stocks/visa",
  cocacola: "stocks/cocacola",
  mcdonalds: "stocks/mcdonalds",
  boeing: "stocks/boeing",
  toyota: "stocks/toyota",
  us500: "flags/us",
  us100: "flags/us",
  dowjones: "flags/us",
  uk100: "flags/gb",
  germany40: "flags/de",
  france40: "flags/fr",
  japan225: "flags/jp",
  hongkong50: "flags/hk",
  australia200: "flags/au",
  eu50: "flags/eu",
  gold: "commodities/gold",
  silver: "commodities/silver",
  platinum: "commodities/platinum",
  copper: "commodities/copper",
  brent: "commodities/brent",
  wtioil: "commodities/wtioil",
  naturalgas: "commodities/naturalgas",
  coffee: "commodities/coffee",
  sugar: "commodities/sugar",
  cocoa: "commodities/cocoa",
};

function baseSymbol(symbol: string) {
  return symbol.replace(/\s*OTC$/i, "").trim();
}

/** Logo paths for an asset: two flags for a currency pair, one image otherwise. */
function assetLogos(symbol: string): string[] {
  const base = baseSymbol(symbol);
  const [left, right] = base.toUpperCase().split("/");

  if (right && CURRENCY_FLAGS[left] && CURRENCY_FLAGS[right]) {
    return [`${LOGO_ROOT}/flags/${CURRENCY_FLAGS[left]}.svg`, `${LOGO_ROOT}/flags/${CURRENCY_FLAGS[right]}.svg`];
  }
  if (COINS.has(left)) return [`${LOGO_ROOT}/crypto/${left.toLowerCase()}.svg`];

  const named = NAMED_LOGOS[base.toLowerCase().replace(/[^a-z0-9]/g, "")];
  return named ? [`${LOGO_ROOT}/${named}.svg`] : [];
}

type AssetIconProps = {
  symbol: string;
  category?: string;
  size?: number;
  className?: string;
};

/** Round logo shown to the left of an asset's name. */
export default function AssetIcon({ symbol, size = 32, className = "" }: AssetIconProps) {
  const logos = assetLogos(symbol);
  const classes = (kind: string) => ["asset-icon", kind, className].filter(Boolean).join(" ");

  if (logos.length === 2) {
    const inner = Math.round(size * 0.72);
    return (
      <span className={classes("asset-icon-pair")} style={{ width: size, height: size }} aria-hidden="true">
        {logos.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            width={inner}
            height={inner}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={index === 0 ? "is-back" : "is-front"}
          />
        ))}
      </span>
    );
  }

  if (logos.length === 1) {
    return (
      <img
        className={classes("asset-icon-single")}
        src={logos[0]}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    );
  }

  // Unknown asset: its initial on a neutral disc.
  return (
    <span
      className={classes("asset-icon-glyph")}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.46) }}
      aria-hidden="true"
    >
      {baseSymbol(symbol).slice(0, 1).toUpperCase()}
    </span>
  );
}
