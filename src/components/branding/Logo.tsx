type LogoProps = {
  className?: string;
  loading?: "eager" | "lazy";
  /** Show only the square "N" mark at or below this viewport width (px). */
  markOnlyBelow?: number;
  /**
   * "clear" is the gold artwork without its dark background, for placing
   * straight onto a dark UI (the trading header) instead of on a plate.
   */
  variant?: "plate" | "clear";
};

export default function Logo({
  className = "",
  loading = "eager",
  markOnlyBelow,
  variant = "plate",
}: LogoProps) {
  const classes = ["neurooption-logo", className].filter(Boolean).join(" ");

  const img = (
    <img
      src="/neurooption-logo.jpg"
      alt="NeuroOption"
      className={classes}
      loading={loading}
      decoding="async"
      draggable={false}
    />
  );

  if (variant === "clear") {
    return (
      <picture>
        <source type="image/webp" srcSet="/neurooption-logo-clear.webp" />
        <img
          src="/neurooption-logo-clear.png"
          alt="NeuroOption"
          className={classes}
          loading={loading}
          decoding="async"
          draggable={false}
        />
      </picture>
    );
  }

  if (!markOnlyBelow) return img;

  return (
    <picture>
      <source media={`(max-width: ${markOnlyBelow}px)`} srcSet="/apple-touch-icon.png" />
      {img}
    </picture>
  );
}
