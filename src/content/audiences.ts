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
 * misleads a real person about whether there is anyone there for them.
 *
 * THAT CONSTRAINT BINDS THE AUDIENCE x MARKET PAGE, NOT THE AUDIENCE PAGE.
 * `/audiences/senior-dating` makes no claim about who is in Manchester or
 * anywhere else; it explains how DA8N works for someone dating in their
 * sixties, which is checkable against shipped behaviour and true in every
 * market the product runs in. That page is now written and built, so
 * `indexable` is true here. `/audiences/{slug}/{cc}` remains unbuilt and
 * gated on measured liquidity, which is the thing liquidity should gate.
 *
 * `indexable` is still only the EDITORIAL half of the decision. The measured
 * half — intro length, section and FAQ counts, body size, internal links, a
 * scan for anything resembling private data — is applied by
 * `src/lib/indexability.ts` at render time, so an audience approved here with
 * copy written too thin is served and noindexed rather than indexed on trust.
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
  { slug: "afro-dating", label: "Afro dating", kind: "community", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: true },
  { slug: "nigerian-dating", label: "Nigerian dating", kind: "community", countryCodes: ["ng", "gb", "us", "ca"], indexable: true },
  { slug: "south-african-dating", label: "South African dating", kind: "community", countryCodes: ["za", "gb"], indexable: true },

  // Intent — the positioning DA8N actually differentiates on.
  { slug: "serious-relationships", label: "Serious relationships", kind: "intent", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: true },
  { slug: "marriage-minded", label: "Marriage-minded singles", kind: "intent", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: true },
  { slug: "intentional-dating", label: "Intentional dating", kind: "intent", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: true },

  // Age cohorts — high volume, and the cohort most poorly served by the
  // incumbents. Also the cohort romance fraud targets most deliberately, which
  // is why both of these pages lead on verification rather than on warmth.
  { slug: "dating-over-40", label: "Dating over 40", kind: "age-cohort", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: true },
  { slug: "dating-over-50", label: "Dating over 50", kind: "age-cohort", countryCodes: ["gb", "us", "ca", "za"], indexable: true },
  { slug: "senior-dating", label: "Senior dating", kind: "age-cohort", countryCodes: ["gb", "us", "ca"], indexable: true },

  // Long-distance and corridor intent.
  { slug: "long-distance", label: "Long-distance relationships", kind: "relationship-stage", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: true },
  { slug: "international-dating", label: "International dating", kind: "intent", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: true },
];

export function findAudience(slug: string): Audience | undefined {
  const wanted = slug.trim().toLowerCase();
  return AUDIENCES.find((audience) => audience.slug === wanted);
}

export function audiencesInMarket(countryCode: string): readonly Audience[] {
  const code = countryCode.trim().toLowerCase();
  return AUDIENCES.filter((audience) => audience.countryCodes.includes(code));
}
