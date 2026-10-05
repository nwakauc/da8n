/**
 * The DA8N market catalog.
 *
 * A market is NOT a country, a language, a currency or a physical place — it
 * is a dating market DA8N chooses to operate and publish in. Those four things
 * are modelled separately here precisely because conflating them is the usual
 * way a global product ends up assuming everyone in Canada speaks English or
 * that a country code picks a currency.
 *
 * One global network. These are localized entry points into it, never
 * separate applications.
 */

export type MarketStatus =
  /** Not launched. No public route, no sitemap entry. */
  | "planned"
  /** Public content exists; product is live. */
  | "live"
  /** Public content exists; product not yet live here. Acquisition only. */
  | "acquisition"
  /** Was live, withdrawn. Routes redirect; nothing new is indexed. */
  | "retired";

export type Market = {
  /** ISO 3166-1 alpha-2, lowercase. `gb`, never `uk` — see ROUTING.md. */
  readonly countryCode: string;
  readonly countryName: string;
  /** Demonym used in copy, e.g. "Nigerian". Not derivable from the code. */
  readonly demonym: string;
  readonly status: MarketStatus;
  /**
   * Whether this market's own pages may be indexed. Independent of `status`:
   * an `acquisition` market can be indexable, and a `live` market whose
   * content is not written yet must not be.
   */
  readonly indexable: boolean;
  /** BCP-47. The market's own default, not a language guessed from the country. */
  readonly defaultLocale: string;
  readonly supportedLocales: readonly string[];
  /** ISO 4217. Present only where DA8N actually transacts — nothing does yet. */
  readonly currency?: string;
  /** IANA. Markets spanning zones list the one used for scheduling copy. */
  readonly timezone: string;
  /** City slugs, in display order. Must exist in `cities.ts`. */
  readonly citySlugs: readonly string[];
  /** Other market codes worth linking to — diaspora and travel corridors. */
  readonly relatedCountryCodes: readonly string[];
};

export const MARKETS: readonly Market[] = [
  {
    countryCode: "ng",
    countryName: "Nigeria",
    demonym: "Nigerian",
    status: "live",
    indexable: false,
    defaultLocale: "en-NG",
    supportedLocales: ["en-NG"],
    timezone: "Africa/Lagos",
    citySlugs: ["lagos", "abuja", "port-harcourt", "ibadan", "benin-city", "kano", "enugu"],
    relatedCountryCodes: ["gb", "us", "ca", "za"],
  },
  {
    countryCode: "za",
    countryName: "South Africa",
    demonym: "South African",
    status: "acquisition",
    indexable: false,
    defaultLocale: "en-ZA",
    supportedLocales: ["en-ZA"],
    timezone: "Africa/Johannesburg",
    citySlugs: ["cape-town", "johannesburg", "pretoria", "durban", "gqeberha", "bloemfontein"],
    relatedCountryCodes: ["ng", "gb"],
  },
  {
    countryCode: "gb",
    countryName: "United Kingdom",
    demonym: "British",
    status: "acquisition",
    indexable: false,
    defaultLocale: "en-GB",
    supportedLocales: ["en-GB"],
    timezone: "Europe/London",
    citySlugs: ["london", "manchester", "birmingham", "leeds"],
    relatedCountryCodes: ["ng", "za", "us"],
  },
  {
    countryCode: "us",
    countryName: "United States",
    demonym: "American",
    status: "acquisition",
    indexable: false,
    defaultLocale: "en-US",
    supportedLocales: ["en-US"],
    timezone: "America/New_York",
    citySlugs: ["new-york", "atlanta", "houston", "chicago"],
    relatedCountryCodes: ["ng", "ca", "gb"],
  },
  {
    countryCode: "ca",
    countryName: "Canada",
    demonym: "Canadian",
    status: "acquisition",
    indexable: false,
    defaultLocale: "en-CA",
    // Canada is the standing reminder that country != language.
    supportedLocales: ["en-CA", "fr-CA"],
    timezone: "America/Toronto",
    citySlugs: ["toronto", "vancouver", "calgary", "ottawa"],
    relatedCountryCodes: ["ng", "us", "gb"],
  },
  {
    countryCode: "au",
    countryName: "Australia",
    demonym: "Australian",
    /*
     * Promoted from "planned" to "acquisition" because the approved landing
     * design puts Sydney on the city grid. `planned` markets get NO route at
     * all — generateStaticParams filters them out — so a Sydney card against a
     * planned market linked to a 404. Acquisition is the honest status for a
     * market that has public content but no live product, which is exactly
     * what a landing-page city card is.
     */
    status: "acquisition",
    indexable: false,
    defaultLocale: "en-AU",
    supportedLocales: ["en-AU"],
    timezone: "Australia/Sydney",
    citySlugs: ["sydney", "melbourne"],
    relatedCountryCodes: ["gb", "za"],
  },
  {
    countryCode: "ae",
    countryName: "United Arab Emirates",
    demonym: "Emirati",
    status: "acquisition",
    indexable: false,
    // The UAE's working lingua franca for this audience is English; Arabic is
    // the official language. Both are declared — country is not language.
    defaultLocale: "en-AE",
    supportedLocales: ["en-AE", "ar-AE"],
    timezone: "Asia/Dubai",
    citySlugs: ["dubai", "abu-dhabi"],
    relatedCountryCodes: ["gb", "ng"],
  },
  {
    countryCode: "fr",
    countryName: "France",
    demonym: "French",
    status: "acquisition",
    indexable: false,
    // The first market whose default locale is not English. Declarative only
    // for now: there is no locale segment and the copy deck is `en`. Nothing
    // here is indexable, so no machine-translated page can leak out.
    defaultLocale: "fr-FR",
    supportedLocales: ["fr-FR", "en-GB"],
    timezone: "Europe/Paris",
    citySlugs: ["paris", "lyon"],
    relatedCountryCodes: ["gb", "ca"],
  },
];

export function findMarket(countryCode: string): Market | undefined {
  const code = countryCode.trim().toLowerCase();
  return MARKETS.find((market) => market.countryCode === code);
}

/** Markets with a public route. `planned` markets have none at all. */
export function publicMarkets(): readonly Market[] {
  return MARKETS.filter((market) => market.status !== "planned" && market.status !== "retired");
}
