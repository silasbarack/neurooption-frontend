type LogoProps = {
  className?: string;
  loading?: "eager" | "lazy";
};

export default function Logo({
  className = "",
  loading = "eager",
}: LogoProps) {
  const classes = ["neurooption-logo", className].filter(Boolean).join(" ");

  return (
    <img
      src="/neurooption-logo-v2.jpg"
      alt="NeuroOption"
      className={classes}
      loading={loading}
      decoding="async"
      draggable={false}
    />
  );
}
