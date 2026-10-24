import PaymentLogo from "./PaymentLogo";

type MpesaLogoProps = {
  className?: string;
};

/** The M-Pesa mark. Thin wrapper so existing call sites keep working. */
export default function MpesaLogo({ className = "" }: MpesaLogoProps) {
  return <PaymentLogo brand="mpesa" label="M-Pesa" className={className} />;
}
