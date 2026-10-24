import React from "react";

const DURATION_MS = 900;

function formatMoney(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Fast at first, settling into the final value (about 30% of the gap per 66 ms). */
function easeOutExpo(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

type AnimatedBalanceProps = {
  value: number;
  /** A change of account or currency jumps instead of counting. */
  scopeKey: string;
  className?: string;
};

/**
 * Balance that counts to each new value, so a trade or payout runs through the
 * in-between amounts instead of snapping. Writes the text directly on each
 * animation frame; the page does not re-render while it counts.
 */
export default function AnimatedBalance({ value, scopeKey, className }: AnimatedBalanceProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const shownRef = React.useRef<number | null>(null);
  const scopeRef = React.useRef(scopeKey);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const from = shownRef.current;
    const sameScope = scopeRef.current === scopeKey;
    scopeRef.current = scopeKey;

    if (from === null || !sameScope || from === value || prefersReducedMotion()) {
      shownRef.current = value;
      node.textContent = formatMoney(value);
      return;
    }

    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      const shown = progress >= 1 ? value : from + (value - from) * easeOutExpo(progress);
      shownRef.current = shown;
      node.textContent = formatMoney(shown);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    // A newer value cancels this one and counts on from wherever it got to.
    return () => cancelAnimationFrame(frame);
  }, [value, scopeKey]);

  return <span ref={ref} className={className} />;
}
