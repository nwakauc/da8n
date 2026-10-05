/**
 * Audience entities — the AUDIENCE axis of the search graph.
 *
 * These cover the real query classes DA8N needs to appear for: age cohorts
 * ("senior dating", "dating in your 50s"), cultural and diaspora communities
 * ("afro dating", "Nigerian dating"), faith, and relationship intent
 * ("marriage-minded", "serious relationships").
 *
 * The hard constraint is liquidity, not content. A "senior dating in
 * Manchester" page with nobody over 55 in Manchester is a thin page that also
 * misleads a real person about whether there is anyone there for them. So
 * `indexable` here is a per-audience default, and the market/city combination
 * gets its own check in `src/lib/indexability.ts` before anything is indexed.
 *
 * Phase 1 defines the model. The pages come later, market by market, as the
 * markets fill.
 */

export type AudienceKind =
  | "age-cohort"
  | "community"
  | "faith"
  | "intent"
  | "relationship-stage";

export type Audience = {
  readonly slug: string;
  readonly label: string;
  readonly kind: AudienceKind;
  /**
   * Markets where this audience is worth a page at all. Not a claim that the
   * inventory exists yet — that is measured, not declared.
   */
  readonly countryCodes: readonly string[];
  readonly indexable: boolean;
};

export const AUDIENCES: readonly Audience[] = [
  // Community / diaspora — DA8N's genuine strength, sitting on Date9ja's
  // existing equity rather than against an incumbent's.
  { slug: "afro-dating", label: "Afro dating", kind: "community", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: false },
  { slug: "nigerian-dating", label: "Nigerian dating", kind: "community", countryCodes: ["ng", "gb", "us", "ca"], indexable: false },
  { slug: "south-african-dating", label: "South African dating", kind: "community", countryCodes: ["za", "gb"], indexable: false },

  // Intent — the positioning DA8N actually differentiates on.
  { slug: "serious-relationships", label: "Serious relationships", kind: "intent", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: false },
  { slug: "marriage-minded", label: "Marriage-minded singles", kind: "intent", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: false },
  { slug: "intentional-dating", label: "Intentional dating", kind: "intent", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: false },

  // Age cohorts — high volume, and the cohort most poorly served by the
  // incumbents. Gated hardest on liquidity for exactly that reason.
  { slug: "dating-over-40", label: "Dating over 40", kind: "age-cohort", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: false },
  { slug: "dating-over-50", label: "Dating over 50", kind: "age-cohort", countryCodes: ["gb", "us", "ca", "za"], indexable: false },
  { slug: "senior-dating", label: "Senior dating", kind: "age-cohort", countryCodes: ["gb", "us", "ca"], indexable: false },

  // Long-distance and corridor intent.
  { slug: "long-distance", label: "Long-distance relationships", kind: "relationship-stage", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: false },
  { slug: "international-dating", label: "International dating", kind: "intent", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: false },
];

export function findAudience(slug: string): Audience | undefined {
  const wanted = slug.trim().toLowerCase();
  return AUDIENCES.find((audience) => audience.slug === wanted);
}

export function audiencesInMarket(countryCode: string): readonly Audience[] {
  const code = countryCode.trim().toLowerCase();
  return AUDIENCES.filter((audience) => audience.countryCodes.includes(code));
}
