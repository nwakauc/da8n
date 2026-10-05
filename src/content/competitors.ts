/**
 * Competitor entities — for comparison and "alternatives" content.
 *
 * Why this is an entity and not a string in page copy: competitor products
 * change, and an undated feature claim becomes false on its own. One record
 * per competitor with a dated `factsVerifiedAt` means a correction lands
 * everywhere at once, and the quality gate can pull a stale comparison out of
 * the sitemap instead of leaving it to rot in forty hand-written tables.
 *
 * What this content does and does not do:
 *
 *   DOES    name a competitor to compare DA8N against it (nominative use)
 *   DOES    answer the query behind the brand search ("serious alternative to…")
 *   NEVER   imply DA8N is, or is affiliated with, endorsed by, or official to
 *           any of these products
 *   NEVER   emit Review or AggregateRating schema about them — DA8N publishes
 *           no ratings, and rating a third party in schema is a fabricated
 *           claim about someone else's product
 *   NEVER   state a feature claim without a `factsVerifiedAt` date behind it
 *
 * Bare brand queries are navigational and belong to the brand; nobody
 * outranks a competitor for its own name. The winnable surface is the modified
 * query — "alternatives", "apps like", "vs", "best dating apps in {market}" —
 * and it is most winnable at market scope, where the incumbents publish no
 * local content at all.
 */

export type CompetitorCategory =
  | "swipe-first"
  | "intent-first"
  | "subscription-matchmaking"
  | "community-specific";

export type Competitor = {
  readonly slug: string;
  /** The product's own name, spelled as they spell it. */
  readonly name: string;
  /** Their canonical site. Linked with rel="nofollow" where linked at all. */
  readonly homepage: string;
  readonly category: CompetitorCategory;
  /** Markets where they have a meaningful presence. Checked, not assumed. */
  readonly countryCodes: readonly string[];
  /**
   * ISO date the factual claims about this competitor were last checked
   * against their live product. Past the max age in `indexability.ts`, every
   * page referencing this record stops being indexable. Absent = never
   * verified = never indexable.
   */
  readonly factsVerifiedAt?: string;
  readonly indexable: boolean;
};

export const COMPETITORS: readonly Competitor[] = [
  { slug: "tinder", name: "Tinder", homepage: "https://tinder.com", category: "swipe-first", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: false },
  { slug: "hinge", name: "Hinge", homepage: "https://hinge.co", category: "intent-first", countryCodes: ["gb", "us", "ca", "za"], indexable: false },
  { slug: "bumble", name: "Bumble", homepage: "https://bumble.com", category: "swipe-first", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: false },
  { slug: "match", name: "Match", homepage: "https://match.com", category: "subscription-matchmaking", countryCodes: ["gb", "us", "ca"], indexable: false },
  { slug: "zoosk", name: "Zoosk", homepage: "https://zoosk.com", category: "subscription-matchmaking", countryCodes: ["gb", "us", "ca", "za"], indexable: false },
  { slug: "eharmony", name: "eharmony", homepage: "https://eharmony.com", category: "subscription-matchmaking", countryCodes: ["gb", "us", "ca"], indexable: false },
  { slug: "grindr", name: "Grindr", homepage: "https://grindr.com", category: "community-specific", countryCodes: ["za", "gb", "us", "ca"], indexable: false },
  { slug: "badoo", name: "Badoo", homepage: "https://badoo.com", category: "swipe-first", countryCodes: ["ng", "za", "gb"], indexable: false },
];

export function findCompetitor(slug: string): Competitor | undefined {
  const wanted = slug.trim().toLowerCase();
  return COMPETITORS.find((competitor) => competitor.slug === wanted);
}

export function competitorsInMarket(countryCode: string): readonly Competitor[] {
  const code = countryCode.trim().toLowerCase();
  return COMPETITORS.filter((competitor) => competitor.countryCodes.includes(code));
}
