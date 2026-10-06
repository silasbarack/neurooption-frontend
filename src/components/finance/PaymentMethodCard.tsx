import { ChevronRight } from "lucide-react";
import PaymentLogo, { type PaymentBrand } from "./PaymentLogo";
type PaymentMethodCardProps = {
  name: string; detail: string; currencies: string; brand: PaymentBrand;
  available?: boolean; status?: string; onSelect?: () => void;
};
export default function PaymentMethodCard({ name, detail, currencies, brand, available = false, status = "Coming soon", onSelect }: PaymentMethodCardProps) {
  return (
    <button type="button" className={`fin-pay fin-pay-${brand}`} disabled={!available} onClick={onSelect}>
      <span className="fin-pay-tile"><PaymentLogo brand={brand} label={name} /></span>
      <span className="fin-pay-text"><b>{name}</b><small>{detail}</small><small>{currencies}</small></span>
      {available ? <ChevronRight size={18} className="fin-pay-chev" aria-hidden="true" /> :
        <span className="fin-method-status">{status}</span>}
    </button>
  );
}
