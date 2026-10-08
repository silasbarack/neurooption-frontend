/**
 * The official NeuroOption logo (neural-network emblem, growth chart and
 * wordmark), from the supplied artwork in public/brand. Never recoloured or
 * stretched: size it by height only and the width follows the artwork's
 * 1019:760 proportions.
 */
type LogoProps = {
  className?: string;
  loading?: "eager" | "lazy";
  /** "full" is emblem + wordmark; "emblem" is a faithful crop of the emblem. */
  variant?: "full" | "emblem";
  /** Show only the emblem at or below this viewport width (px). */
  markOnlyBelow?: number;
};

const FULL = {
  webp: "/brand/neurooption-logo-transparent-480.webp 480w, /brand/neurooption-logo-transparent-960.webp 960w",
  png: "/brand/neurooption-logo-transparent-480.png",
  width: 1019,
  height: 760,
};

const EMBLEM = {
  webp: "/brand/neurooption-emblem-transparent-128.webp 128w, /brand/neurooption-emblem-transparent-256.webp 256w",
  png: "/brand/neurooption-emblem-transparent-128.png",
  width: 660,
  height: 544,
};

export default function Logo({
  className = "",
  loading = "eager",
  variant = "full",
  markOnlyBelow,
}: LogoProps) {
  const art = variant === "emblem" ? EMBLEM : FULL;
  const classes = ["neurooption-logo", variant === "emblem" ? "is-emblem" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <picture className="neurooption-logo-picture">
      {markOnlyBelow && variant === "full" && (
        <source media={`(max-width: ${markOnlyBelow}px)`} type="image/webp" srcSet={EMBLEM.webp} sizes="64px" />
      )}
      <source type="image/webp" srcSet={art.webp} sizes="(max-width: 600px) 160px, 240px" />
      <img
        src={art.png}
        alt="NeuroOption"
        className={classes}
        width={art.width}
        height={art.height}
        loading={loading}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}

export { Logo as NeuroOptionLogo };
