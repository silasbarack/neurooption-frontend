import { useState, type ReactElement } from "react";
import "./PaymentLogo.css";

export type PaymentBrand =
  | "mpesa"
  | "airtel"
  | "equitel"
  | "binance"
  | "mastercard"
  | "visa";

// Drop official artwork in public/payments/<brand>.svg (or .png) and it is used
// in place of the built-in mark below — no code change needed.
const OVERRIDE_SOURCES = (brand: PaymentBrand) => [
  `/payments/${brand}.svg`,
  `/payments/${brand}.png`,
  // Legacy filenames kept so existing drop-ins still resolve.
  ...(brand === "mpesa" ? ["/payments/mpesa-logo.svg", "/payments/mpesa-logo.png"] : []),
];

const ART: Record<PaymentBrand, ReactElement> = {
  mpesa: (
    <svg viewBox="0 0 120 40" role="img" aria-label="M-Pesa">
      <rect width="120" height="40" rx="5" fill="#ffffff" />
      <text
        x="60"
        y="27.5"
        textAnchor="middle"
        fontFamily="'Noto Sans', Arial, sans-serif"
        fontSize="19"
        fontWeight="800"
        letterSpacing="-0.5"
      >
        <tspan fill="#e60000">M-</tspan>
        <tspan fill="#3fa535">PESA</tspan>
      </text>
    </svg>
  ),
  airtel: (
    <svg viewBox="0 0 120 40" role="img" aria-label="Airtel Money">
      <rect width="120" height="40" rx="5" fill="#e40000" />
      {/* The brand's open-arc motif, left of the wordmark. */}
      <path
        d="M30 29c-7 0-12-5-12-11S23 7 30 7c5 0 9 3 11 7"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5.4"
        strokeLinecap="round"
      />
      <text
        x="48"
        y="27"
        fontFamily="'Noto Sans', Arial, sans-serif"
        fontSize="17"
        fontWeight="700"
        fill="#ffffff"
        letterSpacing="-0.3"
      >
        airtel
      </text>
    </svg>
  ),
  equitel: (
    <svg viewBox="0 0 120 40" role="img" aria-label="Equitel">
      <rect width="120" height="40" rx="5" fill="#ffffff" />
      <circle cx="24" cy="20" r="10" fill="none" stroke="#a32a29" strokeWidth="4.5" />
      <rect x="22" y="17.5" width="14" height="4.6" fill="#a32a29" />
      <text
        x="43"
        y="26.5"
        fontFamily="'Noto Sans', Arial, sans-serif"
        fontSize="16"
        fontWeight="700"
        fill="#a32a29"
        letterSpacing="-0.2"
      >
        equitel
      </text>
    </svg>
  ),
  binance: (
    <svg viewBox="0 0 120 40" role="img" aria-label="Binance Pay">
      <rect width="120" height="40" rx="5" fill="#14151a" />
      {/* Centre square with four satellites, the whole set rotated 45°. */}
      <g fill="#f3ba2f" transform="translate(24 20) rotate(45)">
        <rect x="-4.6" y="-4.6" width="9.2" height="9.2" />
        <rect x="-3.2" y="-13.6" width="6.4" height="6.4" />
        <rect x="-3.2" y="7.2" width="6.4" height="6.4" />
        <rect x="-13.6" y="-3.2" width="6.4" height="6.4" />
        <rect x="7.2" y="-3.2" width="6.4" height="6.4" />
      </g>
      <text
        x="45"
        y="26"
        fontFamily="'Noto Sans', Arial, sans-serif"
        fontSize="14"
        fontWeight="700"
        fill="#ffffff"
      >
        BINANCE
      </text>
    </svg>
  ),
  mastercard: (
    <svg viewBox="0 0 120 40" role="img" aria-label="Mastercard">
      <rect width="120" height="40" rx="5" fill="#ffffff" />
      <defs>
        <clipPath id="pay-mc-right">
          <circle cx="68" cy="20" r="13" />
        </clipPath>
      </defs>
      <circle cx="52" cy="20" r="13" fill="#eb001b" />
      <circle cx="68" cy="20" r="13" fill="#f79e1b" />
      {/* The overlap reads as a third colour in the official mark. */}
      <g clipPath="url(#pay-mc-right)">
        <circle cx="52" cy="20" r="13" fill="#ff5f00" />
      </g>
    </svg>
  ),
  visa: (
    <svg viewBox="0 0 120 40" role="img" aria-label="Visa">
      <rect width="120" height="40" rx="5" fill="#ffffff" />
      <text
        x="60"
        y="27"
        textAnchor="middle"
        fontFamily="'Noto Sans', Arial, sans-serif"
        fontSize="23"
        fontWeight="800"
        fontStyle="italic"
        fill="#1a1f71"
        letterSpacing="0.5"
      >
        VISA
      </text>
    </svg>
  ),
};

type PaymentLogoProps = {
  brand: PaymentBrand;
  label: string;
  className?: string;
};

/** A payment brand mark: official artwork when supplied, else a built-in vector. */
export default function PaymentLogo({ brand, label, className = "" }: PaymentLogoProps) {
  const sources = OVERRIDE_SOURCES(brand);
  const [sourceIndex, setSourceIndex] = useState(0);
  const src = sources[sourceIndex];

  if (src) {
    return (
      <img
        className={`pay-logo ${className}`}
        src={src}
        alt={label}
        onError={() => setSourceIndex((index) => index + 1)}
      />
    );
  }

  return <span className={`pay-logo pay-logo-art ${className}`}>{ART[brand]}</span>;
}
