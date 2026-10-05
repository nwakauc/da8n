import { findMarket, publicMarkets, type Market } from "@/content/markets";
import { findCity, findCityByAlias, type City } from "@/content/cities";
import { isMarketReserved, isTopLevelReserved } from "@/content/reserved-slugs";

/**
 * Deterministic route resolution for the `/{cc}` and `/{cc}/{slug}` grammar.
 *
 * The order below is the contract, and `routing.test.ts` asserts it. Two
 * segments can be ambiguous — a country code could be a product word, a city
 * slug could be a market concept — and the resolution must never depend on
 * catalog ordering or on which file happened to be imported first.
 *
 * Reserved always wins. That is the safe direction: a product concept
 * shadowed by a city is a broken product surface, whereas a city shadowed by
 * a reserved word is caught immediately by the disjointness test.
 */

export type TopLevelResolution =
  | { readonly kind: "reserved"; readonly segment: string }
  | { readonly kind: "market"; readonly market: Market }
  | { readonly kind: "not-found" };

/**
 * `/{segment}`
 *
 *   1. reserved top-level namespace  → that product surface
 *   2. a public market's country code → the market page
 *   3. otherwise                      → 404
 *
 * A `planned` or `retired` market resolves to 404 rather than an empty page:
 * a route that exists but has nothing in it is a thin page waiting to happen.
 */
export function resolveTopLevel(segment: string): TopLevelResolution {
  const value = segment.trim().toLowerCase();
  if (!value) return { kind: "not-found" };
  if (isTopLevelReserved(value)) return { kind: "reserved", segment: value };

  const market = publicMarkets().find((candidate) => candidate.countryCode === value);
  return market ? { kind: "market", market } : { kind: "not-found" };
}

export type MarketSegmentResolution =
  | { readonly kind: "reserved"; readonly segment: string }
  | { readonly kind: "city"; readonly city: City }
  /** An alias was requested. Serve a 301 to `to`, never the content. */
  | { readonly kind: "redirect"; readonly to: string }
  | { readonly kind: "not-found" };

/**
 * `/{cc}/{slug}`
 *
 *   1. `cc` must be a public market        → else 404
 *   2. reserved market segment             → that surface (`/gb/diaspora`)
 *   3. a known alias of a city             → 301 to the canonical city
 *   4. a canonical city in this market     → the city page
 *   5. otherwise                           → 404
 *
 * Step 3 before step 4 matters: aliases are never served, so an alias and its
 * canonical can never both return 200 and split the page's equity.
 */
export function resolveMarketSegment(
  countryCode: string,
  slug: string,
): MarketSegmentResolution {
  const code = countryCode.trim().toLowerCase();
  const value = slug.trim().toLowerCase();
  if (!code || !value) return { kind: "not-found" };

  const market = publicMarkets().find((candidate) => candidate.countryCode === code);
  if (!market) return { kind: "not-found" };

  if (isMarketReserved(value)) return { kind: "reserved", segment: value };

  const aliased = findCityByAlias(code, value);
  if (aliased) return { kind: "redirect", to: `/${code}/${aliased.slug}` };

  const city = findCity(code, value);
  return city ? { kind: "city", city } : { kind: "not-found" };
}

/** The canonical path for a market. One function, so nothing hand-builds it. */
export function marketPath(countryCode: string): string {
  return `/${countryCode.trim().toLowerCase()}`;
}

/** The canonical path for a city. */
export function cityPath(city: City): string {
  return `/${city.countryCode}/${city.slug}`;
}

/**
 * `/{destination}/diaspora/{origin}` — e.g. `/gb/diaspora/ng` for "Nigerians
 * dating in the UK". Destination first because that is where the person is
 * and what they are searching from.
 */
export function diasporaPath(destinationCode: string, originCode: string): string {
  return `/${destinationCode.trim().toLowerCase()}/diaspora/${originCode.trim().toLowerCase()}`;
}

/** Whether both ends of a diaspora corridor are real, public markets. */
export function isValidDiasporaCorridor(destinationCode: string, originCode: string): boolean {
  const destination = findMarket(destinationCode);
  const origin = findMarket(originCode);
  if (!destination || !origin) return false;
  if (destination.countryCode === origin.countryCode) return false;
  return (
    destination.status !== "planned" &&
    destination.status !== "retired" &&
    origin.relatedCountryCodes.includes(destination.countryCode)
  );
}
