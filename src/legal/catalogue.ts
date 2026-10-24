/** Every policy page, in display order. Content lives in ./policies/<slug>.tsx. */
export const CATALOGUE = [
  { slug: "terms", title: "Terms and Conditions", group: "Agreement" },
  { slug: "risk-disclosure", title: "Risk Disclosure", group: "Agreement" },
  { slug: "trading-rules", title: "Trading Rules and Execution Policy", group: "Trading" },
  { slug: "conflicts-of-interest", title: "Conflicts of Interest Policy", group: "Trading" },
  { slug: "responsible-trading", title: "Responsible Trading Policy", group: "Trading" },
  { slug: "deposits-withdrawals", title: "Deposit, Withdrawal and Refund Policy", group: "Money" },
  { slug: "aml-kyc", title: "AML, CTF and KYC Policy", group: "Money" },
  { slug: "privacy", title: "Privacy Policy", group: "Your data" },
  { slug: "cookies", title: "Cookie and Browser Storage Policy", group: "Your data" },
  { slug: "account-closure", title: "Account Closure and Data Retention Policy", group: "Your data" },
  { slug: "complaints", title: "Complaints Handling Policy", group: "Support" },
] as const;

export type PolicySlug = (typeof CATALOGUE)[number]["slug"];
