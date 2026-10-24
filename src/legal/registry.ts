import { CATALOGUE } from "./catalogue";
import type { Policy } from "./types";

const modules = import.meta.glob<{ default: Policy }>("./policies/*.tsx", { eager: true });

const bySlug = new Map(Object.values(modules).map((mod) => [mod.default.slug, mod.default]));

/** Policies in catalogue order; a catalogue entry without a content file is skipped. */
export const POLICIES: Policy[] = CATALOGUE.map((entry) => bySlug.get(entry.slug)).filter((p): p is Policy => Boolean(p));

export const policyBySlug = (slug: string) => bySlug.get(slug);
export const groupOf = (slug: string) => CATALOGUE.find((entry) => entry.slug === slug)?.group ?? "";
