/**
 * Reserved route namespaces.
 *
 * The route grammar is `/{cc}` and `/{cc}/{city}`, which means two collisions
 * are possible and both are silent:
 *
 *   1. A top-level product concept that happens to be two letters, or a
 *      country code we later want as a product word.
 *   2. A city slug that collides with a market-level concept — `/gb/diaspora`
 *      must be the diaspora hub, not a city called "diaspora".
 *
 * Reserving the names up front and asserting the disjointness in tests is the
 * only way this stays true as the catalogs grow. URL semantics are durable SEO
 * contracts; a slug that changes meaning after it is indexed is a real cost.
 */

/**
 * Top-level segments that are never a country code. Includes the framework
 * and file-serving paths, because `/{cc}` is a catch-all and would otherwise
 * swallow them.
 */
export const TOP_LEVEL_RESERVED: readonly string[] = [
  // Product and content concepts
  "guides",
  "safety",
  "realme",
  "about",
  "membership",
  "stories",
  "markets",
  // The city index. Reserved top-level as well as per-market: `cities` was
  // only in MARKET_RESERVED (guarding `/gb/cities`), so a top-level `/cities`
  // fell through to the `/{cc}` catch-all and 404'd as an unknown market —
  // while `Cities.tsx` carried a comment asserting it was already reserved.
  "cities",
  "compare",
  "audiences",
  "how-it-works",
  // Utility and legal
  "help",
  "privacy",
  "terms",
  "cookies",
  "contact",
  // Member application — lives in the Date9ja app today; reserved so these
  // paths can never be claimed by a market or city page.
  "sign-in",
  "sign-up",
  "onboarding",
  "discover",
  "likes",
  "chats",
  "profile",
  "settings",
  "notifications",
  // Infrastructure
  "api",
  "assets",
  "images",
  "_next",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "favicon.ico",
];

/**
 * Second-level segments reserved inside a market, i.e. `/{cc}/{segment}`.
 * No city slug may ever equal one of these.
 *
 * `diaspora` is the one that carries real SEO weight: `/gb/diaspora/ng` is the
 * canonical home for "Nigerians dating in the UK", which is where the existing
 * Date9ja diaspora pages' search intent has to land.
 */
export const MARKET_RESERVED: readonly string[] = [
  "diaspora",
  "guides",
  "audiences",
  "compare",
  "cities",
  "safety",
];

export function isTopLevelReserved(segment: string): boolean {
  return TOP_LEVEL_RESERVED.includes(segment.trim().toLowerCase());
}

export function isMarketReserved(segment: string): boolean {
  return MARKET_RESERVED.includes(segment.trim().toLowerCase());
}
