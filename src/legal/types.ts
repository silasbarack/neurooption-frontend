import type { ReactNode } from "react";

export type PolicySection = {
  /** Anchor id, kebab-case, unique within the policy (used for #links and the contents list). */
  id: string;
  /** Numbered heading, e.g. "1. Who we are". */
  title: string;
  body: ReactNode;
};

export type Policy = {
  slug: string;
  title: string;
  /** One or two sentences shown under the title and on the index card. */
  summary: string;
  /** ISO date, e.g. "2026-10-16". */
  updated: string;
  sections: PolicySection[];
};
