import React from "react";
import { ensureServerClock, isServerClockSynced, serverNow, subscribeServerClock } from "./serverClock";
import { formatKenyaClock, formatKenyaOffset, KENYA_ZONE_LABEL } from "../../utils/kenyaTime";

/**
 * Live Kenya time from the server's clock, advancing once a second on the
 * second boundary. Only this component re-renders each second.
 */
export default function KenyaClock({ className = "nt-chart-clock", compact = false }: { className?: string; compact?: boolean }) {
  const [now, setNow] = React.useState(() => serverNow());
  const [synced, setSynced] = React.useState(() => isServerClockSynced());

  React.useEffect(() => {
    ensureServerClock();
    let timer = 0;
    const tick = () => {
      const current = serverNow();
      setNow(current);
      setSynced(isServerClockSynced());
      // Wake just after the next whole second, so the display never lags.
      timer = window.setTimeout(tick, 1000 - (current % 1000) + 5);
    };
    tick();
    const unsubscribe = subscribeServerClock(() => {
      window.clearTimeout(timer);
      tick();
    });
    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  if (compact) {
    return (
      <time className={className} dateTime={new Date(now).toISOString()} title={`Kenya time (${formatKenyaOffset(now)})`}>
        {formatKenyaClock(now)} {KENYA_ZONE_LABEL}
      </time>
    );
  }

  return (
    <div className={className} aria-label="Kenya time">
      <span className="nt-chart-clock-label">Kenya Time:</span>{" "}
      <time dateTime={new Date(now).toISOString()}>{formatKenyaClock(now)}</time>{" "}
      <span>
        {KENYA_ZONE_LABEL} ({formatKenyaOffset(now)})
      </span>
      {!synced && (
        <span className="nt-chart-clock-sync" title="Synchronising with the trading server">
          {" "}· syncing
        </span>
      )}
    </div>
  );
}
