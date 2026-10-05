import type { MetadataRoute } from "next";
import { MARKETS, publicMarkets } from "./markets";
import { CITIES } from "./cities";
import { AUDIENCES } from "./audiences";
import { COMPETITORS } from "./competitors";
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
 * Hand-written surfaces. All `entityIndexable: false` for now — this is a
 * shell awaiting design direction, and indexing a placeholder is worse than
 * not being indexed at all. Flip these as each page gets real content.
 */
const STATIC_ROUTES: readonly RouteCandidate[] = [
  { path: "/", kind: "static", entityIndexable: false, changeFrequency: "weekly", priority: 1 },
  { path: "/how-it-works", kind: "static", entityIndexable: false, changeFrequency: "monthly", priority: 0.8 },
  { path: "/safety", kind: "static", entityIndexable: false, changeFrequency: "monthly", priority: 0.8 },
  { path: "/realme", kind: "static", entityIndexable: false, changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", kind: "static", entityIndexable: false, changeFrequency: "monthly", priority: 0.6 },
  { path: "/markets", kind: "static", entityIndexable: false, changeFrequency: "weekly", priority: 0.7 },
  { path: "/guides", kind: "static", entityIndexable: false, changeFrequency: "weekly", priority: 0.7 },
  { path: "/audiences", kind: "static", entityIndexable: false, changeFrequency: "monthly", priority: 0.6 },
  { path: "/compare", kind: "static", entityIndexable: false, changeFrequency: "monthly", priority: 0.6 },
  { path: "/stories", kind: "static", entityIndexable: false, changeFrequency: "monthly", priority: 0.5 },
  // Utility pages: deliberately public, deliberately never indexed.
  { path: "/help", kind: "static", entityIndexable: false, changeFrequency: "monthly", priority: 0.3 },
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

  const audiences: RouteCandidate[] = AUDIENCES.map((audience) => ({
    path: `/audiences/${audience.slug}`,
    kind: "audience",
    entityIndexable: audience.indexable,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const competitors: RouteCandidate[] = COMPETITORS.map((competitor) => ({
    path: `/compare/${competitor.slug}`,
    kind: "competitor",
    entityIndexable: competitor.indexable,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...STATIC_ROUTES, ...markets, ...cities, ...audiences, ...competitors];
}

/**
 * Routes eligible for the sitemap today.
 *
 * Currently EMPTY by design: no entity is approved and no page has content
 * yet. An empty sitemap on a shell is the correct state — it says "nothing
 * here deserves indexing", which is true. `registry.test.ts` asserts this
 * stays empty until something is deliberately approved, so the first indexable
 * page is a decision somebody makes rather than a side effect.
 */
export function sitemapCandidates(): readonly RouteCandidate[] {
  return routeCandidates().filter((candidate) => candidate.entityIndexable);
}
