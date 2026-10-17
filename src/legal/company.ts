/**
 * Company and regulatory details used by every policy page.
 *
 * Leave a field as null until the real value is confirmed: the pages then
 * show a clearly marked placeholder instead of an invented value. Fill these
 * in (and have the policies reviewed by a qualified lawyer) before relying on
 * them.
 */
export const COMPANY = {
  brand: "NeuroOption",
  website: "https://neurooption.com",
  /** Registered legal name of the operating company, e.g. "NeuroOption Limited". */
  legalName: null as string | null,
  registrationNumber: null as string | null,
  registeredAddress: null as string | null,
  /** Country where the operating company is incorporated. */
  jurisdiction: null as string | null,
  /** Law that governs the client agreement, e.g. "the laws of the Republic of Kenya". */
  governingLaw: null as string | null,
  /** Financial regulator that licenses the company, if any. */
  regulator: null as string | null,
  licence: null as string | null,
  supportEmail: null as string | null,
  supportPhone: null as string | null,
  complaintsEmail: null as string | null,
  /** Contact for data-protection requests (Data Protection Officer or privacy team). */
  privacyEmail: null as string | null,
  dataProtectionOfficer: null as string | null,
  /** Registration with Kenya's Office of the Data Protection Commissioner. */
  odpcRegistration: null as string | null,
  /** How long financial, KYC and AML records are kept after an account closes, e.g. "seven (7) years". */
  retentionPeriod: null as string | null,
  /** Minimum age to open an account (matches the sign-up checkbox). */
  minimumAge: 21,
  /** Real-money deposits, withdrawals and trading are switched off in the platform today. */
  realMoneyAvailable: false,
  realCurrency: "KES",
  demoCurrency: "USD",
} as const;

export const COMPANY_FIELD_LABELS = {
  legalName: "registered company name",
  registrationNumber: "company registration number",
  registeredAddress: "registered office address",
  jurisdiction: "country of incorporation",
  governingLaw: "governing law",
  regulator: "licensing regulator",
  licence: "licence number",
  supportEmail: "support email address",
  supportPhone: "support phone number",
  complaintsEmail: "complaints email address",
  privacyEmail: "data protection contact email",
  dataProtectionOfficer: "Data Protection Officer",
  odpcRegistration: "ODPC registration number",
  retentionPeriod: "record retention period",
} as const;

export type CompanyField = keyof typeof COMPANY_FIELD_LABELS;

export const missingCompanyFields = (Object.keys(COMPANY_FIELD_LABELS) as CompanyField[]).filter((field) => !COMPANY[field]);
