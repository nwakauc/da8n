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

/**
 * ---------------------------------------------------------------------------
 * HOW `factsVerifiedAt` WAS SET, AND WHY THREE RECORDS DO NOT HAVE IT
 *
 * On 2026-10-05 each product's category was checked against THE PRODUCT'S OWN
 * PUBLIC DESCRIPTION OF ITSELF — not against a review site, a comparison
 * article or anybody's recollection. That is the only source that can fairly
 * support a published claim about someone else's product, and the date below
 * means exactly that check and nothing more.
 *
 * VERIFIED (category supported by the product's own words):
 *
 *   tinder    "It starts with a swipe"; discovery described as swiping to like
 *             or pass. Verification offered as a feature, not required.
 *   hinge     "Go on your last first date"; prompt-based profiles, and an
 *             explicit aim to be "effective, not addictive".
 *   eharmony  Every member takes a "Compatibility Quiz" producing a
 *             compatibility score; tiered paid membership.
 *   zoosk     Behavioural matching that "gets smarter as you go"; positioned
 *             as "Designed for Serious Relationships".
 *   grindr    "The World's Largest Social Networking App for LGBTQ People" —
 *             community-specific by the product's own definition.
 *
 * NOT VERIFIED, DELIBERATELY LEFT UNDATED — these stay `indexable: false`, so
 * their pages are served and linked but never indexed, and the comparison
 * pages omit the category section entirely rather than guessing:
 *
 *   bumble    The homepage and help entry points do not describe the discovery
 *             mechanic at all. "swipe-first" is probably right and probably is
 *             not good enough to publish.
 *   match     Returned HTTP 403 to an automated request; not checkable this way.
 *   badoo     ⚠ THE CATEGORY HERE IS LIKELY WRONG. Badoo's own site leads on
 *             stated dating intentions — "Meet people who want the same
 *             thing", with members choosing whether they want to chat, date or
 *             settle down — which reads as intent-first, not swipe-first. It
 *             has NOT been re-categorised here, because re-categorising a
 *             competitor on the strength of their marketing copy is the same
 *             error in the other direction. A human should look at the product
 *             and either correct the category or confirm it.
 *
 * This is the gate doing its job. Had every record been stamped on trust, the
 * site would have published an unsupported category claim about Badoo on an
 * indexable page. Recorded for the owner in the README.
 * ---------------------------------------------------------------------------
 */
export const COMPETITORS: readonly Competitor[] = [
  { slug: "tinder", name: "Tinder", homepage: "https://tinder.com", category: "swipe-first", countryCodes: ["ng", "za", "gb", "us", "ca"], factsVerifiedAt: "2026-10-05", indexable: true },
  { slug: "hinge", name: "Hinge", homepage: "https://hinge.co", category: "intent-first", countryCodes: ["gb", "us", "ca", "za"], factsVerifiedAt: "2026-10-05", indexable: true },
  { slug: "bumble", name: "Bumble", homepage: "https://bumble.com", category: "swipe-first", countryCodes: ["ng", "za", "gb", "us", "ca"], indexable: false },
  { slug: "match", name: "Match", homepage: "https://match.com", category: "subscription-matchmaking", countryCodes: ["gb", "us", "ca"], indexable: false },
  { slug: "zoosk", name: "Zoosk", homepage: "https://zoosk.com", category: "subscription-matchmaking", countryCodes: ["gb", "us", "ca", "za"], factsVerifiedAt: "2026-10-05", indexable: true },
  { slug: "eharmony", name: "eharmony", homepage: "https://eharmony.com", category: "subscription-matchmaking", countryCodes: ["gb", "us", "ca"], factsVerifiedAt: "2026-10-05", indexable: true },
  { slug: "grindr", name: "Grindr", homepage: "https://grindr.com", category: "community-specific", countryCodes: ["za", "gb", "us", "ca"], factsVerifiedAt: "2026-10-05", indexable: true },
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
