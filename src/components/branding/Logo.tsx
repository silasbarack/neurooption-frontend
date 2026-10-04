type LogoProps = {
  className?: string;
  loading?: "eager" | "lazy";
  /** Show only the square "N" mark at or below this viewport width (px). */
  markOnlyBelow?: number;
};

export default function Logo({
  className = "",
  loading = "eager",
  markOnlyBelow,
}: LogoProps) {
  const classes = ["neurooption-logo", className].filter(Boolean).join(" ");

  const img = (
    <img
      src="/neurooption-logo.png"
      alt="NeuroOption"
      className={classes}
      loading={loading}
      decoding="async"
      draggable={false}
    />
  );

  if (!markOnlyBelow) return img;

  return (
    <picture>
      <source media={`(max-width: ${markOnlyBelow}px)`} srcSet="/apple-touch-icon.png" />
      {img}
    </picture>
  );
}
