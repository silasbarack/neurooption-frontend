import { useState } from "react";

type MpesaLogoProps = {
  className?: string;
};

// Official M-Pesa artwork goes in public/payments/mpesa-logo.svg (or .png).
// Until that file exists, a plain "M-PESA" label is shown instead.
const LOGO_SOURCES = ["/payments/mpesa-logo.svg", "/payments/mpesa-logo.png"];

export default function MpesaLogo({ className = "" }: MpesaLogoProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const src = LOGO_SOURCES[sourceIndex];

  if (!src) {
    return (
      <span className={`mpesa-wordmark ${className}`} aria-label="M-Pesa">
        M-PESA
      </span>
    );
  }

  return (
    <img
      className={`mpesa-logo ${className}`}
      src={src}
      alt="M-Pesa"
      onError={() => setSourceIndex((index) => index + 1)}
    />
  );
}
