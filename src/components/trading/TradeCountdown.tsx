import React from "react";
import { ensureServerClock, serverNow } from "./serverClock";
import { formatKenyaTime, KENYA_ZONE_LABEL } from "../../utils/kenyaTime";

/**
 * Time left until a trade's expiry. Counts against the backend's expiry
 * instant on the server clock, so reconnects and latency never shift it.
 */
export default function TradeCountdown({ expiryTime, showExpiry = false }: { expiryTime: number; showExpiry?: boolean }) {
  const [now, setNow] = React.useState(() => serverNow());

  React.useEffect(() => {
    ensureServerClock();
    let timer = 0;
    const tick = () => {
      const current = serverNow();
      setNow(current);
      if (current < expiryTime) timer = window.setTimeout(tick, 1000 - (current % 1000) + 5);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [expiryTime]);

  const remaining = Math.max(0, Math.ceil((expiryTime - now) / 1000));
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const text = remaining <= 0 ? "Expired" : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <span className="nt-trade-countdown" title={`Expires ${formatKenyaTime(expiryTime, true)} ${KENYA_ZONE_LABEL}`}>
      {text}
      {showExpiry && (
        <small>
          {" "}· {formatKenyaTime(expiryTime, true)} {KENYA_ZONE_LABEL}
        </small>
      )}
    </span>
  );
}
