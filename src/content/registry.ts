import type { MetadataRoute } from "next";
import { MARKETS, publicMarkets } from "./markets";
import { CITIES } from "./cities";
import { AUDIENCES } from "./audiences";
import { COMPETITORS } from "./competitors";
import { GUIDES, guidePath } from "./guides";
import { audiencePagePath, audienceSeoPage } from "./audience-pages";
import { comparePagePath, compareSeoPage } from "./compare-pages";
import { isIndexable } from "@/lib/indexability";
import { marketPath, cityPath } from "@/lib/routing";

/**
 * Every route this site can serve, in one list, with the inputs the
 * indexability engine needs. `sitemap.ts` reads only from here, so a sitemap
 * entry can never exist for a route the registry does not know about — the
 * failure mode where a sitemap 404s is structurally impossible.
 *
 * `entityIndexable` is the entity's own approval. It is NOT the final verdict:
 * a route is in a sitemap only if its entity is approved AND a content record
 * exists AND that record passes the quality floor. See `src/lib/indexability.ts`.
 */

export type RouteKind =
  | "static"
  | "market"
  | "city"
  | "audience"
  | "competitor"
  | "guide"
  | "diaspora";

export type RouteCandidate = {
  readonly path: string;
  readonly kind: RouteKind;
  /** Whether the underlying entity is approved for indexing. */
  readonly entityIndexable: boolean;
  readonly changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  readonly priority: number;
};

/**
 * Hand-written surfaces. Every one of these is now a built page — there are no
 * registered static routes without a page behind them, which is what lets the
 * landing page link them without risking a 404.
 *
 * `entityIndexable` is per page and gated on CONTENT, not on the route
 * existing. True where the copy is written and checkable:
 *
 *   `/`, `/how-it-works`, `/safety`, `/realme`, `/about`, `/guides`
 *       Written, specific, and describing shipped behaviour.
 *
 *   `/audiences`, `/compare`
 *       Were false; now true. Both were index pages for routes that did not
 *       exist, which is what made them thin. Both now head a set of written
 *       pages and link every one of them.
 *
 * False where the page is real and useful but its copy is still derived from
 * catalogs rather than written, or where it carries other people's words:
 *
 *   `/cities`, `/markets`                 catalog-derived, editorial pending
 *   `/stories`                            testimonials; gated on the consent
 *                                         register, see content/landing.ts
 *   `/help`, `/contact`, `/privacy`,
 *   `/terms`                              utility, deliberately never indexed
 *
 * Site-wide, `DA8N_SEO_ENABLED` still has to be true in robots.ts before any
 * of this is crawlable at all. That is the master switch and it is separate on
 * purpose: this list says what deserves indexing, the env var says when.
 */
const STATIC_ROUTES: readonly RouteCandidate[] = [
  { path: "/", kind: "static", entityIndexable: true, changeFrequency: "weekly", priority: 1 },
  { path: "/how-it-works", kind: "static", entityIndexable: true, changeFrequency: "monthly", priority: 0.8 },
  { path: "/safety", kind: "static", entityIndexable: true, changeFrequency: "monthly", priority: 0.8 },
  { path: "/realme", kind: "static", entityIndexable: true, changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", kind: "static", entityIndexable: true, changeFrequency: "monthly", priority: 0.6 },
  { path: "/markets", kind: "static", entityIndexable: false, changeFrequency: "weekly", priority: 0.7 },
  { path: "/cities", kind: "static", entityIndexable: false, changeFrequency: "weekly", priority: 0.7 },
  { path: "/guides", kind: "static", entityIndexable: true, changeFrequency: "weekly", priority: 0.7 },
  { path: "/audiences", kind: "static", entityIndexable: true, changeFrequency: "monthly", priority: 0.6 },
  { path: "/compare", kind: "static", entityIndexable: true, changeFrequency: "monthly", priority: 0.6 },
  { path: "/stories", kind: "static", entityIndexable: false, changeFrequency: "monthly", priority: 0.5 },
  // Utility pages: deliberately public, deliberately never indexed.
  { path: "/help", kind: "static", entityIndexable: false, changeFrequency: "monthly", priority: 0.3 },
  { path: "/contact", kind: "static", entityIndexable: false, changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", kind: "static", entityIndexable: false, changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", kind: "static", entityIndexable: false, changeFrequency: "yearly", priority: 0.3 },
];

export function routeCandidates(): readonly RouteCandidate[] {
  const markets: RouteCandidate[] = publicMarkets().map((market) => ({
    path: marketPath(market.countryCode),
    kind: "market",
    entityIndexable: market.indexable,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const publicCodes = new Set(publicMarkets().map((market) => market.countryCode));
  const cities: RouteCandidate[] = CITIES.filter((city) =>
    publicCodes.has(city.countryCode),
  ).map((city) => ({
    path: cityPath(city),
    kind: "city",
    // A city page is capped by its market: an unpublished market cannot have
    // an indexable city under it.
    entityIndexable:
      city.indexable &&
      (MARKETS.find((market) => market.countryCode === city.countryCode)?.indexable ?? false),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  /*
   * One candidate per written guide. These are the only entity routes whose
   * pages are built AND whose content is written, which is why they are the
   * only ones that reach the sitemap today.
   */
  const guides: RouteCandidate[] = GUIDES.map((guide) => ({
    path: guidePath(guide.slug),
    kind: "guide",
    entityIndexable: true,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  /*
   * BOTH ARE NOW BUILT AND BOTH RUN THE QUALITY GATE.
   *
   * These were entity-model entries with `entityIndexable` hardcoded false and
   * no page behind them. They now have written pages, and — more importantly —
   * their sitemap eligibility is COMPUTED by `isIndexable` from the same
   * `SeoPage` record the route renders, with the same context the route
   * passes. That is what makes the sitemap and the page's own robots meta
   * agree by construction instead of by two people remembering one rule.
   *
   * An audience or competitor whose copy has not been written yields no page
   * (`audienceSeoPage` returns undefined), so it is dropped from the registry
   * too — the registry cannot list a route whose page would 404.
   *
   * `claimsDecay` is true for comparisons and false for audiences: a claim
   * about a third party's product expires, a description of DA8N's own shipped
   * behaviour does not.
   *
   * Still not built, and still deliberately not linked: `/audiences/{slug}/{cc}`.
   * That one is gated on measured liquidity, which is the thing liquidity
   * should gate — see the note at the top of `content/audiences.ts`.
   */
  const audiences: RouteCandidate[] = AUDIENCES.flatMap((audience) => {
    const page = audienceSeoPage(audience.slug);
    if (!page) return [];
    return [
      {
        path: audiencePagePath(audience.slug),
        kind: "audience" as const,
        entityIndexable: isIndexable(page, {
          entityIndexable: audience.indexable,
          entityExists: true,
        }),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
    ];
  });

  const competitors: RouteCandidate[] = COMPETITORS.flatMap((competitor) => {
    const page = compareSeoPage(competitor.slug);
    if (!page) return [];
    return [
      {
        path: comparePagePath(competitor.slug),
        kind: "competitor" as const,
        entityIndexable: isIndexable(page, {
          entityIndexable: competitor.indexable,
          entityExists: true,
          claimsDecay: true,
        }),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
    ];
  });

  return [...STATIC_ROUTES, ...markets, ...cities, ...guides, ...audiences, ...competitors];
}

/**
 * Routes eligible for the sitemap today.
 *
 * No longer empty. It is the six written product pages plus the five guides —
 * every one of them a built page with written copy, which is the bar, and
 * nothing that is merely catalog-derived.
 *
 * `registry.test.ts` asserts the shape of this rather than its emptiness: a
 * route reaches the sitemap only if some human set `entityIndexable: true`, and
 * nothing in a member or authenticated namespace can ever appear.
 */
export function sitemapCandidates(): readonly RouteCandidate[] {
  return routeCandidates().filter((candidate) => candidate.entityIndexable);
}
