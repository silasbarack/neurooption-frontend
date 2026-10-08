import { useAssetPayout } from "./payoutStore";
import { formatKenyaDateTime } from "../../utils/kenyaTime";

/** An asset's live payout (60-second trade). Re-renders only for that asset. */
export default function AssetPayoutBadge({ symbol, className }: { symbol: string; className?: string }) {
  const payout = useAssetPayout(symbol);
  if (!payout) return null;
  return (
    <span
      key={payout.version}
      className={className ? `nt-payout-badge ${className}` : "nt-payout-badge"}
      title={`Payout for a 1-minute ${payout.marketType} trade · updated ${formatKenyaDateTime(Date.parse(payout.updatedAt))}`}
    >
      +{payout.payoutPercent}%
    </span>
  );
}
