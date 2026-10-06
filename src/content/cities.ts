/**
 * Canonical city catalog. Cities are entities, not strings scattered through
 * page copy — one record per city, referenced by slug everywhere.
 *
 * `aliases` exists because a city with two names in common use (Gqeberha /
 * Port Elizabeth) would otherwise produce two URLs competing for the same
 * intent. Aliases resolve by redirect to the canonical slug; they are never
 * served, never indexed and never appear in a sitemap.
 */

export type City = {
  /** Lowercase, hyphenated. Unique across the whole catalog, not per market. */
  readonly slug: string;
  readonly name: string;
  /** Lowercase ISO 3166-1 alpha-2. Must exist in `markets.ts`. */
  readonly countryCode: string;
  /** State, province or region, where it is part of how people name the place. */
  readonly region?: string;
  /**
   * How the region is LABELLED in a chip, where the full name is too long to
   * sit on one line beside the city — "NSW", not "New South Wales". Only set
   * it where the abbreviation is the form people actually use; most regions
   * are short enough and fall back to `region`.
   */
  readonly regionShort?: string;
  /** Alternative spellings/names that must redirect here. Never served. */
  readonly aliases?: readonly string[];
  /**
   * Whether this city's page may be indexed. Starts false for every city:
   * a city route existing is not evidence that there is anything worth
   * reading — or anyone to meet — there yet.
   */
  readonly indexable: boolean;
  /** Other city slugs worth linking to. Commute and travel corridors. */
  readonly relatedCitySlugs: readonly string[];
};

export const CITIES: readonly City[] = [
  // Nigeria — the markets with real existing member distribution and SEO equity.
  { slug: "lagos", name: "Lagos", countryCode: "ng", region: "Lagos State", indexable: false, relatedCitySlugs: ["abuja", "ibadan", "benin-city"] },
  { slug: "abuja", name: "Abuja", countryCode: "ng", region: "FCT", aliases: ["fct"], indexable: false, relatedCitySlugs: ["lagos", "kano"] },
  { slug: "port-harcourt", name: "Port Harcourt", countryCode: "ng", region: "Rivers State", indexable: false, relatedCitySlugs: ["lagos", "benin-city"] },
  { slug: "ibadan", name: "Ibadan", countryCode: "ng", region: "Oyo State", indexable: false, relatedCitySlugs: ["lagos", "abuja"] },
  { slug: "benin-city", name: "Benin City", countryCode: "ng", region: "Edo State", indexable: false, relatedCitySlugs: ["lagos", "port-harcourt"] },
  { slug: "kano", name: "Kano", countryCode: "ng", region: "Kano State", indexable: false, relatedCitySlugs: ["abuja", "lagos"] },
  { slug: "enugu", name: "Enugu", countryCode: "ng", region: "Enugu State", indexable: false, relatedCitySlugs: ["port-harcourt", "lagos"] },

  // South Africa — mirrors the existing DateZA city pages, which redirect here.
  { slug: "cape-town", name: "Cape Town", countryCode: "za", region: "Western Cape", indexable: false, relatedCitySlugs: ["johannesburg", "gqeberha"] },
  { slug: "johannesburg", name: "Johannesburg", countryCode: "za", region: "Gauteng", aliases: ["joburg", "jozi"], indexable: false, relatedCitySlugs: ["pretoria", "cape-town"] },
  { slug: "pretoria", name: "Pretoria", countryCode: "za", region: "Gauteng", aliases: ["tshwane"], indexable: false, relatedCitySlugs: ["johannesburg"] },
  { slug: "durban", name: "Durban", countryCode: "za", region: "KwaZulu-Natal", regionShort: "KZN", indexable: false, relatedCitySlugs: ["johannesburg", "cape-town"] },
  { slug: "gqeberha", name: "Gqeberha", countryCode: "za", region: "Eastern Cape", aliases: ["port-elizabeth"], indexable: false, relatedCitySlugs: ["cape-town", "durban"] },
  { slug: "bloemfontein", name: "Bloemfontein", countryCode: "za", region: "Free State", aliases: ["mangaung"], indexable: false, relatedCitySlugs: ["johannesburg"] },

  // United Kingdom
  { slug: "london", name: "London", countryCode: "gb", indexable: false, relatedCitySlugs: ["birmingham", "manchester"] },
  { slug: "manchester", name: "Manchester", countryCode: "gb", indexable: false, relatedCitySlugs: ["leeds", "birmingham"] },
  { slug: "birmingham", name: "Birmingham", countryCode: "gb", indexable: false, relatedCitySlugs: ["london", "manchester"] },
  { slug: "leeds", name: "Leeds", countryCode: "gb", indexable: false, relatedCitySlugs: ["manchester"] },

  // United States
  { slug: "new-york", name: "New York", countryCode: "us", region: "New York", aliases: ["nyc"], indexable: false, relatedCitySlugs: ["atlanta", "chicago"] },
  { slug: "atlanta", name: "Atlanta", countryCode: "us", region: "Georgia", indexable: false, relatedCitySlugs: ["houston", "new-york"] },
  { slug: "houston", name: "Houston", countryCode: "us", region: "Texas", indexable: false, relatedCitySlugs: ["atlanta", "chicago"] },
  { slug: "chicago", name: "Chicago", countryCode: "us", region: "Illinois", indexable: false, relatedCitySlugs: ["new-york", "houston"] },

  // Canada
  { slug: "toronto", name: "Toronto", countryCode: "ca", region: "Ontario", indexable: false, relatedCitySlugs: ["ottawa", "vancouver"] },
  { slug: "vancouver", name: "Vancouver", countryCode: "ca", region: "British Columbia", regionShort: "BC", indexable: false, relatedCitySlugs: ["calgary", "toronto"] },
  { slug: "calgary", name: "Calgary", countryCode: "ca", region: "Alberta", indexable: false, relatedCitySlugs: ["vancouver", "toronto"] },
  { slug: "ottawa", name: "Ottawa", countryCode: "ca", region: "Ontario", indexable: false, relatedCitySlugs: ["toronto"] },

  // Australia — promoted to `acquisition` in markets.ts when the approved
  // landing design put Sydney on the city grid, so both of these are routed
  // and in the build. (This comment said `planned` long after that stopped
  // being true.)
  { slug: "sydney", name: "Sydney", countryCode: "au", region: "New South Wales", regionShort: "NSW", indexable: false, relatedCitySlugs: ["melbourne"] },
  { slug: "melbourne", name: "Melbourne", countryCode: "au", region: "Victoria", indexable: false, relatedCitySlugs: ["sydney"] },

  // UAE and France. Added because the approved landing design puts Dubai and
  // Paris on the city grid; a card that links nowhere is worse than no card.
  { slug: "dubai", name: "Dubai", countryCode: "ae", region: "Dubai", indexable: false, relatedCitySlugs: ["abu-dhabi"] },
  { slug: "abu-dhabi", name: "Abu Dhabi", countryCode: "ae", region: "Abu Dhabi", indexable: false, relatedCitySlugs: ["dubai"] },
  { slug: "paris", name: "Paris", countryCode: "fr", region: "Île-de-France", indexable: false, relatedCitySlugs: ["lyon"] },
  { slug: "lyon", name: "Lyon", countryCode: "fr", region: "Auvergne-Rhône-Alpes", regionShort: "Auvergne", indexable: false, relatedCitySlugs: ["paris"] },
];

export function findCity(countryCode: string, slug: string): City | undefined {
  const code = countryCode.trim().toLowerCase();
  const wanted = slug.trim().toLowerCase();
  return CITIES.find((city) => city.countryCode === code && city.slug === wanted);
}

/** The canonical city an alias points at, if the given slug is an alias. */
export function findCityByAlias(countryCode: string, slug: string): City | undefined {
  const code = countryCode.trim().toLowerCase();
  const wanted = slug.trim().toLowerCase();
  return CITIES.find(
    (city) => city.countryCode === code && (city.aliases ?? []).includes(wanted),
  );
}

export function citiesInMarket(countryCode: string): readonly City[] {
  const code = countryCode.trim().toLowerCase();
  return CITIES.filter((city) => city.countryCode === code);
}
