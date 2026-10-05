/**
 * Legacy SEO migration map: Date9ja and DateZA → DA8N.
 *
 * Both brands collapse into DA8N eventually (owner decision 2026-10-04), so
 * the map is keyed by **source host plus path** rather than path alone — the
 * two legacy sites share slugs (`/dating/johannesburg` exists on DateZA;
 * `/johannesburg` exists on Date9ja) and a path-only map would silently
 * mis-route one of them.
 *
 * The rule that matters: PRESERVE SEARCH INTENT, do not collapse to the
 * nearest market. A Nigerian-diaspora page targeting the UK must land on the
 * diaspora corridor, not on `/gb` — a UK-general dating page answers a
 * different question and would lose the ranking the old page earned.
 *
 * NOTHING HERE IS WIRED UP YET. This is the map, with its gaps identified.
 * Cutover is a separate approved step: these redirects go live only after the
 * destination pages exist, are indexable, and parity has been verified. A 301
 * to a thin page is worse than no redirect at all.
 */

export type LegacyHost = "www.date9ja.love" | "date9ja.love" | "www.date-za.com" | "date-za.com";

export type LegacyRedirect = {
  readonly host: LegacyHost;
  /** Source path, normalized: lowercase, leading slash, no trailing slash. */
  readonly from: string;
  /** DA8N destination path. Must resolve under the route grammar. */
  readonly to: string;
  /** 301 unless there is a specific reason for 302. Default permanent. */
  readonly permanent?: boolean;
  /**
   * False where the destination does not fully carry the source's intent.
   * Every `false` is an open decision, not an accepted loss — see the
   * "Unresolved" note at the bottom of this file.
   */
  readonly intentPreserved: boolean;
  readonly note?: string;
};

/**
 * Date9ja — 17 hand-written landing pages at `/dating/<slug>` and `/<topic>`,
 * plus 4 guides. Source: `apps/date9ja/web/src/content/landing.ts`.
 *
 * Note what the "country" pages actually are: per Stage 0 §AD-5, the UK, US,
 * Canada and South Africa pages are **Nigerian-diaspora** pages, not general
 * country pages. They map to diaspora corridors.
 */
export const DATE9JA_REDIRECTS: readonly LegacyRedirect[] = [
  // Audience and intent pages.
  { host: "www.date9ja.love", from: "/nigerian-singles", to: "/ng", intentPreserved: true },
  { host: "www.date9ja.love", from: "/nigerian-marriage", to: "/audiences/marriage-minded", intentPreserved: true },
  { host: "www.date9ja.love", from: "/nigerian-diaspora-dating", to: "/audiences/nigerian-dating", intentPreserved: true },
  { host: "www.date9ja.love", from: "/meet-nigerians-abroad", to: "/audiences/nigerian-dating", intentPreserved: false, note: "Two legacy pages converge on one destination. Confirm they are genuine duplicates before cutover; if not, one needs its own page." },

  // Markets. Nigeria is the only general country page of the five.
  { host: "www.date9ja.love", from: "/nigeria", to: "/ng", intentPreserved: true },
  { host: "www.date9ja.love", from: "/united-kingdom", to: "/gb/diaspora/ng", intentPreserved: true, note: "Diaspora page, not a UK-general page. Mapping to /gb would lose the Nigerians-in-the-UK intent." },
  { host: "www.date9ja.love", from: "/united-states", to: "/us/diaspora/ng", intentPreserved: true },
  { host: "www.date9ja.love", from: "/canada", to: "/ca/diaspora/ng", intentPreserved: true },
  { host: "www.date9ja.love", from: "/south-africa", to: "/za/diaspora/ng", intentPreserved: true },

  // Nigerian cities.
  { host: "www.date9ja.love", from: "/lagos", to: "/ng/lagos", intentPreserved: true },
  { host: "www.date9ja.love", from: "/abuja", to: "/ng/abuja", intentPreserved: true },
  { host: "www.date9ja.love", from: "/port-harcourt", to: "/ng/port-harcourt", intentPreserved: true },
  { host: "www.date9ja.love", from: "/enugu", to: "/ng/enugu", intentPreserved: true },

  // Diaspora cities. THE ROUTE GRAMMAR HAS NO CITY-LEVEL DIASPORA SEGMENT, so
  // these four currently lose their qualifier. See "Unresolved" below.
  { host: "www.date9ja.love", from: "/london", to: "/gb/london", intentPreserved: false, note: "Legacy page is Nigerians-in-London. /gb/london is London-general. Needs /gb/diaspora/ng/london or equivalent." },
  { host: "www.date9ja.love", from: "/toronto", to: "/ca/toronto", intentPreserved: false, note: "As /london." },
  { host: "www.date9ja.love", from: "/houston", to: "/us/houston", intentPreserved: false, note: "As /london." },
  { host: "www.date9ja.love", from: "/johannesburg", to: "/za/johannesburg", intentPreserved: false, note: "As /london." },

  // Guides. Source: apps/date9ja/web/src/content/guides.ts
  { host: "www.date9ja.love", from: "/guides/better-first-date", to: "/guides/better-first-date", intentPreserved: true },
  { host: "www.date9ja.love", from: "/guides/profile-people-remember", to: "/guides/profile-people-remember", intentPreserved: true },
  { host: "www.date9ja.love", from: "/guides/meeting-the-family-for-the-first-time", to: "/guides/meeting-the-family-for-the-first-time", intentPreserved: true },
  { host: "www.date9ja.love", from: "/guides/recognise-romance-scam-patterns", to: "/guides/recognise-romance-scam-patterns", intentPreserved: true },
];

/**
 * DateZA — 25 URLs. Source: `apps/dateza/web/public/sitemap.xml`.
 *
 * The SEO collapse is safe and reversible. The **member** consolidation is
 * not, and is explicitly not part of this: `profiles` is unique on
 * `(user_id, brand_id)` and conversations only survive if both parties move.
 * Redirecting date-za.com traffic does not move a single account.
 */
export const DATEZA_REDIRECTS: readonly LegacyRedirect[] = [
  { host: "www.date-za.com", from: "/", to: "/za", intentPreserved: true },
  { host: "www.date-za.com", from: "/south-african-dating", to: "/za", intentPreserved: true },
  { host: "www.date-za.com", from: "/singles", to: "/za", intentPreserved: false, note: "Three legacy pages converge on /za. Confirm before cutover." },
  { host: "www.date-za.com", from: "/dating", to: "/za/cities", intentPreserved: true },

  { host: "www.date-za.com", from: "/dating/cape-town", to: "/za/cape-town", intentPreserved: true },
  { host: "www.date-za.com", from: "/dating/johannesburg", to: "/za/johannesburg", intentPreserved: true },
  { host: "www.date-za.com", from: "/dating/pretoria", to: "/za/pretoria", intentPreserved: true },
  { host: "www.date-za.com", from: "/dating/durban", to: "/za/durban", intentPreserved: true },
  { host: "www.date-za.com", from: "/dating/gqeberha", to: "/za/gqeberha", intentPreserved: true },
  { host: "www.date-za.com", from: "/dating/bloemfontein", to: "/za/bloemfontein", intentPreserved: true },

  { host: "www.date-za.com", from: "/how-it-works", to: "/how-it-works", intentPreserved: true },
  { host: "www.date-za.com", from: "/dating-safely", to: "/safety", intentPreserved: true },
  { host: "www.date-za.com", from: "/about", to: "/about", intentPreserved: true },
  { host: "www.date-za.com", from: "/stories", to: "/stories", intentPreserved: true },
  { host: "www.date-za.com", from: "/privacy", to: "/privacy", intentPreserved: true },
  { host: "www.date-za.com", from: "/help", to: "/help", intentPreserved: true },
  { host: "www.date-za.com", from: "/lifestyle", to: "/za", intentPreserved: false, note: "No DA8N equivalent. Either build one or accept the loss deliberately." },

  // Dating advice cluster → guides.
  { host: "www.date-za.com", from: "/dating-advice", to: "/guides", intentPreserved: true },
  { host: "www.date-za.com", from: "/dating-advice/online-dating-south-africa", to: "/guides/online-dating-south-africa", intentPreserved: true },
  { host: "www.date-za.com", from: "/dating-advice/first-date-ideas-south-africa", to: "/guides/first-date-ideas-south-africa", intentPreserved: true },
  { host: "www.date-za.com", from: "/dating-advice/online-dating-safety", to: "/guides/online-dating-safety", intentPreserved: true },
  { host: "www.date-za.com", from: "/dating-advice/dating-profile-tips", to: "/guides/dating-profile-tips", intentPreserved: true },
  { host: "www.date-za.com", from: "/dating-advice/how-to-start-a-conversation", to: "/guides/how-to-start-a-conversation", intentPreserved: true },
  { host: "www.date-za.com", from: "/dating-advice/first-date-safety", to: "/guides/first-date-safety", intentPreserved: true },
  { host: "www.date-za.com", from: "/dating-advice/long-distance-dating-south-africa", to: "/guides/long-distance-dating-south-africa", intentPreserved: true },
];

export const LEGACY_REDIRECTS: readonly LegacyRedirect[] = [
  ...DATE9JA_REDIRECTS,
  ...DATEZA_REDIRECTS,
];

export function findLegacyRedirect(host: string, path: string): LegacyRedirect | undefined {
  const wantedHost = host.trim().toLowerCase().replace(/\.$/, "");
  // Apex and www of the same brand share one map; normalize to the www key.
  const normalizedHost = wantedHost.startsWith("www.") ? wantedHost : `www.${wantedHost}`;
  const wantedPath = path.split("?")[0]?.split("#")[0] ?? "/";
  const normalizedPath =
    wantedPath.length > 1 ? wantedPath.replace(/\/+$/, "").toLowerCase() : "/";
  return LEGACY_REDIRECTS.find(
    (entry) => entry.host === normalizedHost && entry.from === normalizedPath,
  );
}

/** Entries whose destination does not carry the source's full intent. */
export function lossyRedirects(): readonly LegacyRedirect[] {
  return LEGACY_REDIRECTS.filter((entry) => !entry.intentPreserved);
}

/**
 * Unresolved, and needing a decision before any cutover:
 *
 * 1. CITY-LEVEL DIASPORA. Four Date9ja pages (/london, /toronto, /houston,
 *    /johannesburg) are "Nigerians in <city>", and the grammar has no segment
 *    for that. Either extend it to `/{cc}/diaspora/{origin}/{city}` or accept
 *    that these four lose their qualifier. They are among Date9ja's
 *    highest-intent pages, so this is not a detail.
 *
 * 2. CONVERGING SOURCES. Two Date9ja pages and three DateZA pages each
 *    converge on a single DA8N destination. Converging genuine duplicates is
 *    correct; converging two pages that answered different questions throws
 *    away one of them.
 *
 * 3. NO DA8N EQUIVALENT. DateZA's /lifestyle has no destination. Build or
 *    deliberately drop.
 */
