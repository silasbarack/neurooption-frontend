import { Link } from "react-router-dom";
import Logo from "./Logo";

type BrandLogoProps = {
  to?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** The approved NeuroOption logo with text, linking home. */
export default function BrandLogo({ to = "/", size = "md", className = "" }: BrandLogoProps) {
  const classes = ["neo-brand", size !== "md" ? `neo-brand-${size}` : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Link to={to} className={classes} aria-label="NeuroOption home">
      <Logo />
      <span className="neo-brand-text">NeuroOption</span>
    </Link>
  );
}
