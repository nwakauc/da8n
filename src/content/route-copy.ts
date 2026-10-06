import type { Market, MarketStatus } from "./markets";
import { marketInProse } from "./markets";

/**
 * Copy for the market and city routes.
 *
 * Why this file exists, and not strings inside the page components: the same
 * reason as `landing.ts`. These are the destination of the landing page's city
 * grid, so their wording is product voice, it has to be reviewable in one
 * place, and localisation later is a data swap rather than a component
 * rewrite.
 *
 * ---------------------------------------------------------------------------
 * WHAT THESE PAGES MAY AND MAY NOT SAY — read before editing
 *
 * These routes previously rendered developer scaffolding straight at
 * visitors: "Market status: acquisition. Default locale: en-AE." and "Market
 * page content is not written yet. This route exists to prove the grammar and
 * the entity model." Both are internal vocabulary, and the second is a dead
 * end on the highest-intent click the site has.
 *
 * Designing them does NOT license inventing content. Still forbidden, per the
 * README's content rules:
 *
 *   - member counts, "N people near you", local activity, how busy a city is
 *   - reviews, testimonials, marriage or outcome statistics
 *   - claiming the product is live somewhere it is not
 *
 * What is left is plenty: what DA8N is, how it works, what the city or market
 * is an entry point to, honest availability, and a route onward.
 * ---------------------------------------------------------------------------
 */

/**
 * Availability, in product voice rather than in the catalog's vocabulary.
 *
 * `MarketStatus` is an internal lifecycle value — `live`, `acquisition`,
 * `planned`, `retired`. Rendering it raw told a visitor in Dubai that their
 * country's "status" was "acquisition", which means nothing to them and
 * reveals how the catalog is modelled. This maps it to something true and
 * readable instead.
 *
 * `planned` and `retired` are included for completeness only: neither gets a
 * route (`publicMarkets()` filters them out, and `resolveTopLevel` 404s), so
 * these two strings are unreachable today. They exist so that promoting or
 * retiring a market is a catalog edit and not also a copy emergency.
 */
export const AVAILABILITY: Readonly<Record<MarketStatus, string>> = {
  live: "DA8N is open here.",
  acquisition: "DA8N is not open here yet.",
  planned: "DA8N is not open here yet.",
  retired: "DA8N is no longer operating here.",
};

/**
 * OWNER DECISION NEEDED — the join CTA on a market where the product is not
 * live.
 *
 * DA8N is one global network: a member joins one account, not a country
 * edition, so joining from an `acquisition` market is technically valid and
 * the sign-up flow works. Whether it is the right thing to *offer* is a
 * product call, not an engineering one — it sets an expectation about who the
 * person will find once they are in.
 *
 * Rendered today for every market that has a route, with availability stated
 * plainly above it so the offer is not silently overselling. Recorded in
 * `docs/HUMAN-TODO.md`. To restrict it to live markets, return
 * `market.status === "live"` here — one line, one place.
 *
 * `retired` is excluded on principle rather than for effect: a withdrawn
 * market has no route today (`publicMarkets()` filters it out), so this
 * changes nothing now and is correct if that ever stops being true.
 */
export function showJoinCta(market: Market): boolean {
  return market.status !== "retired";
}

export const MARKET_COPY = {
  kicker: "MARKET",
  /** `intro(market)` is the page lede. Availability is appended by the page. */
  intro: (market: Market) =>
    `DA8N is one global network with a local front door. ${marketInProse(market)} is one of them — ` +
    `meet people here, back home, or anywhere you are open to.`,
  citiesHeading: "Cities",
  /*
   * The demonym, not the country name. This read "The Australia cities DA8N
   * has a page for", because a country name cannot be used attributively in
   * English. `markets.ts` carries a `demonym` for exactly this and nothing was
   * using it.
   */
  citiesLede: (market: Market) =>
    `${market.demonym} cities DA8N has a page for. Where you live, where you are from ` +
    `and where you are open to meeting are three different things, and DA8N treats them that way.`,
  elsewhereHeading: "Somewhere else",
  elsewhereLede: "DA8N is one network. These are its other front doors.",
} as const;

export const CITY_COPY = {
  kicker: "CITY",
  intro: (cityName: string, countryName: string | undefined) =>
    countryName
      ? `Dating in ${cityName}, ${countryName} — and anywhere else you are open to. ` +
        `DA8N is one global network, so a profile here is a profile everywhere.`
      : `Dating in ${cityName} — and anywhere else you are open to. DA8N is one global ` +
        `network, so a profile here is a profile everywhere.`,
  nearbyHeading: "Nearby",
  nearbyLede: (countryName: string | undefined) =>
    countryName
      ? `Other ${countryName} cities worth looking at.`
      : "Other cities worth looking at.",
} as const;

/** Shared CTA copy, so the landing page and these routes do not drift. */
export const JOIN_CTA = {
  label: "Join da8n for free",
  note: "Free to join · verify in about four minutes · Adults 18+",
} as const;
