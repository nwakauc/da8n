/**
 * DA8N landing page content.
 *
 * Every string the landing page renders lives here, not inside JSX. Three
 * reasons, in order of how much they matter:
 *
 *   1. The FAQ copy is also the source for FAQPage structured data. Holding
 *      one copy means the markup can never describe something the page does
 *      not actually say — the rule is that structured data describes visible
 *      content truthfully, and the only way to guarantee that is to render
 *      both from the same array.
 *   2. It is assertable. `landing.test.ts` runs this through the content
 *      safety checks and the indexability quality floor, so a future copy
 *      edit that leaks a street address or drops the page under the body-text
 *      minimum fails CI rather than shipping.
 *   3. Localisation later becomes a data swap, not a component rewrite.
 *      Country is not language: this file is the `en` copy deck, nothing more.
 *
 * ---------------------------------------------------------------------------
 * CONTENT INTEGRITY — read before editing
 *
 * This page is live marketing for a product that exists: RealMe verification,
 * For You, Ready, Safety Profiles and Date Check-in are shipped and working,
 * and there are real members behind them. The page is written accordingly —
 * no DRAFT stamps, no "illustration" disclaimers, no "soon" chips. Owner's
 * call, 2026-10-05, and the reason the hedging that the v3 import carried was
 * removed rather than reworded.
 *
 * TWO RULES SURVIVE THAT DECISION, because they are not hedges:
 *
 *   `STORIES` / `FEATURED_STORY`
 *       Member stories are REAL PEOPLE. Every quote, name and date published
 *       here needs written consent from the couple before it ships, and the
 *       names below came from the design file. Replacing them with consented
 *       stories is a content task, not a code one — `who`, `quote`, `chips`
 *       and `photo` are the only fields involved. An invented testimonial is a
 *       misleading claim under the FTC endorsement rules and the UK CAP code
 *       whether or not anything on the card says so.
 *
 *   NO REVIEW OR AGGREGATERATING MARKUP, ever. DA8N publishes no ratings, and
 *       inventing that markup to chase a rich result is the thing the SEO
 *       rules forbid. The page emits WebPage and FAQPage only.
 *
 * Still forbidden everywhere on this page, unchanged: member counts, "N people
 * near you", local activity claims, marriage or outcome statistics, and any
 * price — there is no priced plan in this app.
 * ---------------------------------------------------------------------------
 */

export type NavItem = { readonly label: string; readonly href: string };

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "How it works", href: "#how" },
  { label: "Cities", href: "#cities" },
  { label: "Safety", href: "#safety" },
  { label: "Ready", href: "#ready" },
  { label: "Stories", href: "#stories" },
  { label: "Membership", href: "#membership" },
];

/* ------------------------------------------------------------------- hero */

export const HERO = {
  /**
   * NOTE FOR THE OWNER — the design's headline pair is
   * "Your person could be anywhere." / "We help you find him."
   *
   * The second line is written from one point of view (a woman looking for a
   * man). DA8N is one global network serving every market and every member,
   * and the `audiences.ts` catalog is built on intent, community, faith and
   * life stage — never gender — so this line narrows the product's own
   * positioning on its single most-read piece of copy. The design's SAFETY
   * headline does the same ("Built for the woman who's been catfished
   * before").
   *
   * Both are rendered exactly as designed, because the voice of the brand is
   * the owner's call and not an engineering one. Flagged here so the choice
   * is deliberate rather than inherited. `subTitle` is one string: change it
   * in one place.
   */
  title: "Your person could be ",
  titleAccent: "anywhere.",
  subTitle: "We help you find him.",
  /*
   * No arrow in the string. "→" is announced as "right arrow" by some screen
   * readers, and the glyph belongs to presentation rather than to copy — the
   * component renders a decorative, aria-hidden one. Same reason the
   * background-check label lost its arrow: on something inert, an arrow is a
   * promise of navigation.
   */
  cta: "Join da8n for free",
  note: "Free to join · verify in about four minutes",
} as const;

/* -------------------------------------------------------- example content */

/**
 * The two people shown in the product mockups — the hero card, the For You
 * pair and the phone screens. Models and photography supplied by the owner for
 * marketing use; they are what the interface looks like, which is what a
 * product page is for.
 */
export const EXAMPLE_PROFILES = {
  marcus: {
    name: "Marcus, 34",
    firstName: "Marcus",
    flag: "🇺🇸",
    where: "New York, USA",
    intent: "Looking for a serious relationship",
    photo: "/images/landing/hero-marcus.jpeg",
  },
  maya: {
    name: "Maya, 31",
    firstName: "Maya",
    where: "Manchester, UK",
    intent: "Looking for marriage",
    photo: "/images/landing/maya-1.jpeg",
  },
} as const;

/** The three filled slots on the profile-builder phone screen. */
export const MAYA_PHOTOS: readonly string[] = [
  "/images/landing/maya-1.jpeg",
  "/images/landing/maya-2.jpeg",
  "/images/landing/maya-3.jpeg",
];

/* ---------------------------------------------------------------- marquee */

/**
 * Decorative city ticker. These are place names in a scrolling band, not a
 * claim that DA8N operates in each one — the band carries no links and no
 * counts. The routable city set is `cities.ts`; the two are allowed to differ
 * and `LANDING_CITIES` below is the one that must resolve.
 */
export const MARQUEE_CITIES: readonly string[] = [
  "London",
  "New York",
  "Toronto",
  "Sydney",
  "Dubai",
  "Paris",
  "Cape Town",
  "Berlin",
  "Lagos",
  "Singapore",
  "Lisbon",
  "Atlanta",
];

/* --------------------------------------------------------------- why da8n */

export type Pillar = {
  readonly num: string;
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
  /** CSS colour token name, so the palette stays in one place. */
  readonly accent: "gold" | "rose" | "green" | "ink";
  readonly icon: "seal" | "heart" | "rings" | "globe";
};

export const WHY = {
  num: "01",
  eyebrow: "WHY DA8N",
  title: "Other apps made it easy to meet anyone. ",
  titleAccent: "We make it easier to meet someone real.",
} as const;

export const PILLARS: readonly Pillar[] = [
  {
    num: "01",
    kicker: "REALME",
    title: "Know who’s behind the profile.",
    body: "ID and a live selfie before anyone can message you. One person, one profile.",
    accent: "gold",
    icon: "seal",
  },
  {
    num: "02",
    kicker: "INTENTIONS",
    title: "Know what they’re here for.",
    body: "Dating, love, a relationship or marriage, set on day one so nobody has to guess.",
    accent: "rose",
    icon: "heart",
  },
  {
    num: "03",
    kicker: "FOR YOU",
    title: "Meet people worth meeting.",
    body:
      "Introductions picked for compatibility, with the reasons shown. Not ranked by who paid for reach.",
    accent: "green",
    icon: "rings",
  },
  {
    num: "04",
    kicker: "OPEN TO",
    title: "Date who you want, how you want.",
    body:
      "Choose the race, ethnicity, cities and regions you’re open to. Only people who fit your choices appear for you.",
    accent: "ink",
    icon: "globe",
  },
];

/* ----------------------------------------------------------- how it works */

export type Step = {
  /** The visible "01"–"04". The design numbers the steps; the number IS the rail. */
  readonly num: string;
  readonly label: string;
  readonly detail: string;
  readonly accent: "ink" | "rose" | "gold" | "rose-ink";
};

export const HOW = {
  num: "02",
  eyebrow: "HOW IT WORKS",
  title: "Tell us what you want. ",
  titleAccent: "We’ll take it from there.",
} as const;

/**
 * FOUR steps, and the count is the design decision — v3 had five.
 *
 * "See who’s For You" and "Send an introduction" both left this list. They did
 * not get deleted from the page: For You became its own section (`COMPAT`,
 * "03 FOR YOU") where the reasons behind an introduction are the whole subject,
 * and the introduction itself is the CTA that section ends on. A step that only
 * says "we will show you people" was carrying a section's worth of meaning in
 * one line.
 *
 * What replaced them is "Turn on Ready", which is the one thing a visitor has
 * to understand to use the product correctly and which v3 explained in a panel
 * most people never scrolled to.
 */
export const STEPS: readonly Step[] = [
  {
    num: "01",
    label: "Create your profile",
    detail: "Photos and a few words about you.",
    accent: "ink",
  },
  {
    num: "02",
    label: "Set your intentions",
    detail:
      "Dating, love, a relationship or marriage. Then the cities, regions and backgrounds you’re open to.",
    accent: "rose",
  },
  {
    num: "03",
    label: "Get RealMe verified",
    detail:
      "RealMe verifies you’re a real person and helps confirm you are who you say you are. About four minutes.",
    accent: "gold",
  },
  {
    num: "04",
    label: "Turn on Ready",
    detail: "When you’re genuinely open to meeting someone, say so. It lasts seven days.",
    accent: "rose-ink",
  },
];

/**
 * The Ready phone screen (step 04).
 *
 * `#ready` is a primary-nav target and now lives on this step, because this is
 * where the page explains Ready. The seven-day expiry is the load-bearing fact
 * and it is stated in `STEPS` and in the FAQ, not only in the mockup — a
 * visitor who never reaches the fourth panel still reads it.
 */
export const READY_SCREEN = {
  heading: "Ready",
  title: "You’re Ready",
  sub: "6 days left",
  tags: ["Marriage", "Open to distance"],
  toggleLabel: "Ready",
} as const;

/** The three RealMe rows on the step-03 screen, ticked in sequence. */
export const REALME_CHECKS: readonly string[] = [
  "Government ID",
  "Live selfie",
  "Photos match",
];

/* ----------------------------------------------------------------- cities */

export type LandingCity = {
  /** Must exist in `cities.ts`. The href is derived, never hand-written. */
  readonly slug: string;
  readonly countryCode: string;
  /**
   * What the card says. Currently always the city's own name — v4 settled the
   * one place it did not: v3 labelled the Houston card "Texas", which named a
   * state in a grid of cities. The field stays because the design's label and
   * the catalog's entity are separate things, and the next market may need the
   * distinction back.
   */
  readonly label: string;
  readonly countryLabel: string;
  readonly flag: string;
  /** Path under /public, or null to render the design's labelled slot. */
  readonly photo: string | null;
};

export const CITIES_SECTION = {
  num: "04",
  eyebrow: "DA8N CITIES",
  title: "Your city. ",
  titleAccent: "Or theirs.",
  lede: "Meet someone around the corner, back home, or somewhere you plan to be.",
  allLabel: "Explore all cities",
  allKicker: "EVERYWHERE ELSE",
  /*
   * v3 explained the three-place model in a sentence ("where you live, where
   * you're from and where you're open to meeting are three different things").
   * v4 shows it instead: a headline that only makes sense if you already read
   * the three rows beside it, and the rows carry the explanation. Same idea,
   * one fewer paragraph of product theory on a marketing page.
   */
  noteTitle: "Melbourne to London is not long distance. ",
  noteAccent: "It is family.",
} as const;

/**
 * The example member beside that headline. Three rows, and the middle one is
 * the point: "From" is a separate field from "Lives in", which is the whole
 * claim the headline makes.
 */
export const PLACES_EXAMPLE = {
  livesIn: "Manchester",
  from: "Melbourne",
  openTo: "London · Toronto · Worldwide",
} as const;

/**
 * The design's grid, exactly: London, Houston, Toronto, Sydney, Dubai, Paris,
 * Cape Town. Seven cards plus the "all cities" tile is eight, which fills two
 * clean rows of four at desktop — owner's call, 2026-10-04, and the reason
 * the list is capped here rather than grown.
 *
 * NOTE: Nigeria is the only market with status "live" and holds the entire
 * existing member base, and it is NOT on this grid. Lagos appears on the page
 * only in the decorative marquee; `/ng` and `/ng/lagos` are still built and
 * still reachable, just not linked from here. That was a deliberate layout
 * decision, not an oversight — recorded so it is not "fixed" by someone
 * assuming the live market was forgotten.
 *
 * Dubai, Paris and Sydney required catalog work before they could appear:
 * `ae` and `fr` did not exist as markets, and `au` was "planned", which means
 * no route is generated at all. All three are now "acquisition" — see
 * `markets.ts`. Every card here links to a page that is actually built, and
 * `landing.test.ts` asserts it against `publicMarkets()` rather than merely
 * checking the market exists.
 */
export const LANDING_CITIES: readonly LandingCity[] = [
  {
    slug: "london",
    countryCode: "gb",
    label: "London",
    countryLabel: "UNITED KINGDOM",
    flag: "🇬🇧",
    photo: "/images/cities/london.jpg",
  },
  {
    slug: "houston",
    countryCode: "us",
    label: "Houston",
    countryLabel: "UNITED STATES",
    flag: "🇺🇸",
    photo: "/images/cities/houston.webp",
  },
  {
    slug: "toronto",
    countryCode: "ca",
    label: "Toronto",
    countryLabel: "CANADA",
    flag: "🇨🇦",
    photo: "/images/cities/toronto.jpg",
  },
  {
    slug: "sydney",
    countryCode: "au",
    label: "Sydney",
    countryLabel: "AUSTRALIA",
    flag: "🇦🇺",
    photo: "/images/cities/sydney.jpg",
  },
  {
    slug: "dubai",
    countryCode: "ae",
    label: "Dubai",
    countryLabel: "UAE",
    flag: "🇦🇪",
    photo: "/images/cities/dubai.jpg",
  },
  {
    slug: "paris",
    countryCode: "fr",
    label: "Paris",
    countryLabel: "FRANCE",
    flag: "🇫🇷",
    photo: "/images/cities/paris.jpg",
  },
  {
    slug: "cape-town",
    countryCode: "za",
    label: "Cape Town",
    countryLabel: "SOUTH AFRICA",
    flag: "🇿🇦",
    photo: "/images/cities/capetown.jpg",
  },
];

/** The four faces stacked on the "all cities" tile. Places, not people. */
export const ALL_CITIES_FACES: readonly string[] = [
  "/images/cities/toronto.jpg",
  "/images/cities/newyork.jpg",
  "/images/cities/dubai.jpg",
  "/images/cities/paris.jpg",
];

/* ---------------------------------------------------------- compatibility */

/**
 * "For You" — the section v3 called COMPATIBILITY.
 *
 * The rename is not cosmetic. v3 showed one member and a list of reasons, which
 * read as a profile with annotations. v4 shows BOTH people with the reasons
 * between them, because compatibility is a statement about a pair and a
 * one-sided panel quietly implied the model scores a person.
 *
 * Still no percentage and still no ranking — see `reasons`. `partial` is the
 * honest half of that: one dimension where the two do not already agree,
 * shown as an open question rather than hidden to make the match look cleaner.
 */
export const COMPAT = {
  num: "03",
  eyebrow: "FOR YOU",
  title: "Not more people. ",
  titleAccent: "Better possibilities.",
  panelTitle: "Why you may connect",
  reasons: [
    "Both want a serious relationship",
    "Similar family values",
    "Both love travelling",
    "Open to long distance",
    "You both enjoy good food",
  ],
  /** Not a reason. An open one — deliberately not styled as a tick. */
  partial: { text: "Where you’d both live", verdict: "Worth a conversation" },
  cta: "Send an introduction",
} as const;

/* ----------------------------------------------------------------- safety */

export const SAFETY = {
  num: "05",
  eyebrow: "SAFETY",
  /** See the note on HERO about point of view. Rendered as designed. */
  title: "Built for the woman who's been ",
  titleAccent: "catfished",
  titleTail: " before.",
  /**
   * The disclosure line. This is load-bearing, not decoration: it is the
   * page's statement that a Safety Profile shows verified facts and never
   * private documents, reports or internal risk data. Do not shorten it, and
   * do not move it above the fold where it reads as a boast rather than a
   * limit.
   */
  disclosure:
    "D8N combines verified information and relevant platform signals to help you decide. Private documents, reports and sensitive details are never shown.",
} as const;

export type SafetyGroup = {
  readonly label: string;
  readonly items: readonly {
    readonly text: string;
    readonly state: "verified" | "pending" | "plain";
    /**
     * An optional qualifier pill at the end of the row. v4 adds exactly one,
     * "Not AI" on the liveness row, because that is the distinction a liveness
     * check actually establishes and the one a reader will otherwise assume
     * "Live person verified" does not cover.
     */
    readonly badge?: string;
  }[];
};

/*
 * Declared separately and annotated rather than inferred: the `as const` on
 * SAFETY_PROFILE below would otherwise narrow each row to its own literal
 * shape, and a row written without `badge` would not have the property at all
 * — so the one row that does have it could not be read generically.
 */
const SAFETY_PROFILE_GROUPS: readonly SafetyGroup[] = [
  {
    label: "IDENTITY",
    items: [
      { text: "RealMe verified", state: "verified" },
      { text: "Live person verified", state: "verified", badge: "Not AI" },
      { text: "Age verified", state: "verified" },
    ],
  },
  {
    label: "ACCOUNT AND PROFILE",
    items: [
      { text: "Account in good standing", state: "verified" },
      { text: "Profile integrity checks complete", state: "verified" },
      { text: "Member since March 2025", state: "plain" },
    ],
  },
];

/**
 * The example Safety Profile. Note what it deliberately does NOT show, and
 * keep it that way: no identity-document images, no report history, no
 * reporter identity, no numeric trust score, no device or location
 * intelligence. The Trust Score is a qualitative band ("Strong") because a
 * number invites members to reverse-engineer the model, and because a band is
 * all a person actually needs to make a decision.
 */
export const SAFETY_PROFILE = {
  owner: "Marcus",
  protectedBy: "Protected by D8N",
  groups: SAFETY_PROFILE_GROUPS,
  trust: {
    label: "Trust Score",
    band: "Strong",
    /** Visual fill only. No numeric score is published. */
    fillPercent: 86,
    safetyLabel: "D8N SAFETY",
    items: [
      { text: "No current safety restrictions", state: "verified" },
      { text: "No confirmed serious safety violations", state: "verified" },
    ],
  },
  backgroundCheck: {
    label: "BACKGROUND CHECK",
    status: "Not completed",
    cta: "How background checks work",
    /*
     * Links to the explainer, not to a flow. Background checks are
     * consent-based, provider-bound and legal in different ways market by
     * market, so what a visitor needs here is the explanation — the request
     * itself belongs inside the member app, where the consent is captured.
     */
    href: "/safety#background-checks",
  },
} as const;

export type SafetyCard = {
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
  readonly cta: string;
  /** A page on this site. `landing.test.ts` asserts every one of them resolves. */
  readonly href: string;
  readonly accent: "gold" | "rose" | "green";
  readonly icon: "seal" | "shield" | "block";
};

/**
 * Three safety cards, replacing v3's six-row list.
 *
 * v3 listed every safety capability at one line each, which made six
 * equal-weight rows. v4 names the three that carry the decision and says what
 * each actually does, which is both shorter and more defensible.
 *
 * Each links to its own explainer on this site — `/realme`, the romance-scam
 * guide and `/safety`. All three are built.
 */
export const SAFETY_CARDS: readonly SafetyCard[] = [
  {
    kicker: "IDENTITY",
    title: "RealMe identity verification",
    body:
      "A liveness selfie, verification video and government ID work together to help confirm you’re a real person, not an AI-generated identity, and that you’re the person shown in your photos.",
    cta: "How verification works",
    href: "/realme",
    accent: "gold",
    icon: "seal",
  },
  {
    kicker: "FRAUD",
    title: "Active fraud protection",
    body:
      "Money requests, off-platform pressure and scripted openers are flagged in chat and reviewed by the safety team.",
    cta: "How we detect fraud",
    href: "/guides/recognise-romance-scam-patterns",
    accent: "rose",
    icon: "shield",
  },
  {
    kicker: "REPORTING",
    title: "Reporting with human review",
    body:
      "Block instantly and report in one tap. A person reviews every report, and your details stay private.",
    cta: "Visit the Safety Centre",
    href: "/safety",
    accent: "green",
    icon: "block",
  },
];

/**
 * The profile-review mockup, which is what v4 puts where v3 had the in-chat
 * money-request warning.
 *
 * The swap is the point. The fraud claim already has a card of its own in
 * `SAFETY_CARDS` and a guide behind it; what had no illustration was the claim
 * the three cards all rest on — that a person's face is checked before anyone
 * sees it. So the panel shows three profiles going through review: two pass,
 * one is blocked as an impersonation.
 *
 * The blocked tile deliberately reuses a photo that appears elsewhere on this
 * page as Maya's. That is not an asset mistake. An impersonation is someone
 * else's real photograph, and a stock "fake-looking" face would have taught
 * the opposite lesson.
 *
 * Nothing here is a real member, a real report or a real moderation decision.
 */
export const PROFILE_CHECK = {
  label: "PROFILE CHECK",
  flag: "Every profile reviewed",
  tiles: [
    { photo: "/images/landing/real-person-1.jpeg", verdict: "Real person", blocked: false },
    { photo: "/images/landing/real-person-2.jpeg", verdict: "Real person", blocked: false },
    { photo: "/images/landing/maya-3.jpeg", verdict: "Impersonation · Blocked", blocked: true },
  ],
  body: "AI-generated profile images and impersonation attempts are detected and blocked.",
  /*
   * The handwritten-feeling line v3 carried under the hero card. v4 moves it
   * here, where it lands as the consequence of the panel above it rather than
   * as an unearned aside beside the first CTA.
   */
  line: "Be the real you. ",
  lineAccent: "Your person wants the authentic you.",
} as const;

export const CHECK_IN = {
  label: "DATE CHECK-IN",
  live: "Active until 11pm",
  plan: "Dinner with Marcus",
  planMeta: "Tonight, 8pm · Shared with Ada",
  rule: "Check in at 9:30. If I don’t reply in 15 minutes, call Ada and share my location.",
  ok: "I’m OK",
  out: "Get me out",
} as const;

/* --------------------------------------------------------------- journeys */

export type Journey = {
  /**
   * The headline. v4 writes these in the third person about a situation, not
   * in the first person about a named couple — see the note on the section
   * below for why that is the whole change.
   */
  readonly headline: string;
  /**
   * The two chips. The first is the route the pair met across, which is what
   * this section is actually about; the second is the DA8N feature that made
   * it possible.
   */
  readonly chips: readonly [string, string];
  readonly photo: string | null;
};

export const JOURNEYS_SECTION = {
  num: "06",
  eyebrow: "JOURNEYS",
  title: "This is what ",
  titleAccent: "we're here for.",
} as const;

/**
 * JOURNEYS, and v4's rename is the smallest part of the change.
 *
 * v3 and the first v4 import ran testimonials: a quotation, a couple's names
 * ("Ana & Luca", "Grace & Daniel", "Leila & Sam") and dated milestones
 * ("MARRIED — Lisbon, 2025"). Every one of those is an endorsement attributed
 * to an identifiable person, which needs that person's written consent on file
 * before it can ship — and the consent was never obtained, so the section was
 * the one thing keeping an otherwise shippable page honest only by footnote.
 *
 * v4 removes the attribution instead of chasing the paperwork. What is left
 * says the same thing without putting words in anyone's mouth: a route, a
 * situation, and the product mechanics that carried it. "Both said marriage"
 * is a statement about how INTENTIONS works. "Toronto, with Date Check-in" is
 * a statement about Date Check-in. Neither is a promise made on behalf of a
 * member who cannot be reached to confirm it.
 *
 * If real, consented stories are ever collected, they belong in `/stories`
 * with names and quotes. Do not reintroduce them here without the consent.
 */
export const FEATURED_JOURNEY = {
  route: "Lisbon ↔ Toronto",
  headline: "Two cities. One honest conversation about where to build a life.",
  photo: "/images/landing/story-wedding.jpg",
  /** Three product facts, not three dates. See the note above. */
  facts: [
    { label: "INTENTIONS", value: "Both said marriage", accent: "rose" },
    { label: "FOR YOU", value: "Introduced, with reasons", accent: "green" },
    { label: "FIRST VISIT", value: "Toronto, with Date Check-in", accent: "gold" },
  ],
} as const;

export const JOURNEYS: readonly Journey[] = [
  {
    headline:
      "For the woman who left every app because nobody was who they said they were.",
    chips: ["Cape Town → London", "RealMe verified"],
    photo: "/images/landing/story-golden.jpg",
  },
  {
    headline:
      "Two continents, one matchmaker, asking the questions you’d both rather avoid.",
    chips: ["Lagos → Manchester", "VIP introduction"],
    photo: "/images/landing/halima-mark.jpeg",
  },
];

/* ------------------------------------------------------------- membership */

export type Tier = {
  readonly id: "free" | "plus" | "vip";
  readonly name: string;
  readonly badge: string;
  readonly blurb: string;
  readonly features: readonly string[];
  readonly cta: string;
  /**
   * Where the CTA goes. `app` routes through `appUrl()` into the member
   * application, which is where membership lives; `site` is a page here.
   */
  readonly href: string;
  readonly target: "app" | "site";
};

export const MEMBERSHIP = {
  num: "07",
  eyebrow: "MEMBERSHIP",
  title: "Dating shouldn't need a subscription ",
  titleAccent: "to work.",
  /**
   * NO PRICE APPEARS ON THIS PAGE, and that is not a hedge — it is correct.
   * Pricing is per-market and lives in the member application, which is the
   * only place that knows the visitor's market and currency. Quoting a number
   * here would be an offer this host cannot honour, and `landing.test.ts`
   * fails the build if one appears.
   *
   * Every tier's CTA goes to a real destination: Free to sign-up, da8n+ to the
   * membership screen in the app, VIP to the matchmaking page.
   */
} as const;

export const TIERS: readonly Tier[] = [
  {
    id: "free",
    name: "da8n Free",
    badge: "FREE",
    blurb: "Everything you need to meet someone.",
    features: ["Meet people", "Browse locally", "Chat", "RealMe verification", "For You"],
    cta: "Join free",
    href: "/sign-up",
    target: "app",
  },
  {
    id: "plus",
    name: "da8n+",
    badge: "PREMIUM",
    blurb: "More control, more introductions.",
    features: [
      "See who likes you",
      "See Safety Profiles",
      "Advanced preferences",
      "More introductions",
      "Incognito",
      "Travel and dating-market controls",
      "Priority introductions",
    ],
    cta: "See da8n+",
    href: "/member/membership",
    target: "app",
  },
  {
    id: "vip",
    name: "da8n VIP",
    badge: "MATCHMAKER",
    blurb: "More control, better standards.",
    /**
     * v4 rewrote the two lines that were the only unverifiable claims on this
     * page, and both rewrites are substantive rather than cosmetic.
     *
     * "Verified, financially stable members" → "Enhanced identity and
     * eligibility checks". The old line promised financial screening: a
     * different category from identity verification, needing a provider that
     * can do it, a lawful basis per market and a published definition of
     * "financially stable" — and it read as a wealth filter, which carries
     * discrimination exposure in several of the listed markets. "Eligibility"
     * is what the tier actually gates and is defensible as written.
     *
     * "Background checks included" → "Consent-based background checks". The
     * old line promised a capability in every jurisdiction; coverage is
     * country-by-country and provider-bound, so "included" could not be true
     * everywhere DA8N sells. The new line names the thing that IS universally
     * true about them — they require the subject's consent — and matches the
     * limits set out at `/safety#background-checks`. Keep the two consistent.
     */
    features: [
      "Everything in da8n+",
      "Enhanced identity and eligibility checks",
      "More control over who sees you",
      "Consent-based background checks",
      "A personal concierge, if you want one",
    ],
    cta: "Go VIP",
    href: "/vip-matchmaking",
    target: "app",
  },
];

/* -------------------------------------------------------------------- FAQ */

export type Faq = { readonly question: string; readonly answer: string };

export const FAQ_SECTION = {
  num: "08",
  eyebrow: "QUESTIONS",
  title: "Still wondering?",
} as const;

/**
 * The guides card in the FAQ column.
 *
 * Four real links to four written guides. The slugs are the source of truth in
 * `content/guides.ts`, and `landing.test.ts` asserts each one resolves to a
 * guide that exists — so a renamed slug fails the build rather than shipping a
 * 404 from the site's highest-authority page.
 */
export const GUIDES_CARD = {
  kicker: "GUIDES",
  title: "Learn how to ",
  titleAccent: "win",
  titleTail: " at this.",
  slugs: [
    "better-first-date",
    "profile-people-remember",
    "dating-someone-in-another-city",
    "recognise-romance-scam-patterns",
  ],
} as const;

/**
 * Rendered visibly AND emitted as FAQPage structured data from the same
 * array. Every answer here describes behaviour the product actually has, or
 * states a limit — none of them describes something unbuilt.
 */
export const FAQS: readonly Faq[] = [
  {
    question: "Is da8n free?",
    answer:
      "Yes. Creating a profile, RealMe verification, For You, browsing and chatting are all free. da8n+ adds optional extras.",
  },
  {
    question: "Can I use da8n outside my country?",
    answer:
      "Yes. da8n is one global network. Set where you live and where you are open to meeting people.",
  },
  {
    question: "Can I date people back home?",
    answer:
      "Yes. Add where you are from and the places you are open to, and da8n will include people there.",
  },
  {
    question: "What is RealMe?",
    answer:
      "RealMe is our verification. An ID check and a live selfie confirm you are a real person who matches your photos.",
  },
  {
    question: "What is a Safety Profile?",
    answer:
      "Every member has one. It shows verified facts, like RealMe status and account standing, so you can make an informed decision. It combines identity from RealMe and reputation from your Trust Score, and never shows private documents.",
  },
  {
    question: "How does Ready work?",
    answer:
      "Turn on Ready when you are actively dating. It lasts seven days, then switches off unless you turn it on again.",
  },
  {
    question: "What is Date Check-in?",
    answer:
      "An optional safety plan for in-person dates. Share who you are meeting with people you trust, set check-in times, and choose what happens if you don’t reply. Location is shared only during the date and deleted afterwards.",
  },
  {
    question: "Do I need to match before talking?",
    answer:
      "You can send an introduction: a short note on why you would like to meet. If they are interested too, the conversation opens.",
  },
  {
    question: "Can people see my exact location?",
    answer: "No. Other members see your city, never your exact location.",
  },
];

/* ------------------------------------------------------------ closing CTA */

export const OUTRO = {
  title: "Your person is out there.",
  body: "Maybe closer than you think. Maybe a flight away.",
  cta: "Join da8n for free",
  note: "Verified in about four minutes. Adults 18+.",
  photo: "/images/landing/hero-home.jpeg",
} as const;

/**
 * Store badges under the closing CTA.
 *
 * READ THIS BEFORE CHANGING THE ANDROID LINK. There is no DA8N app. The badge
 * points at the DATE9JA Android app, because that is the member application
 * this site already hands people to — see README "The boundary" and
 * `lib/app-links.ts`, where every member CTA on the page goes to the same
 * place. A visitor who taps it lands on a listing with a different name on it,
 * which is the same seam the Join button already has and is the owner's call to
 * resolve when DA8N ships its own build.
 *
 * iOS has no listing at all, so it is a label and not a link. "COMING SOON" is
 * the design's own copy, and it is accurate.
 */
export const STORE_BADGES = {
  android: { kicker: "GET IT ON", name: "Google Play" },
  ios: { kicker: "COMING SOON", name: "iOS" },
} as const;

/* ----------------------------------------------------------------- footer */

export type FooterColumn = {
  readonly heading: string;
  readonly links: readonly NavItem[];
};

/**
 * The share card's subline (`app/opengraph-image.tsx`).
 *
 * It is NOT `FOOTER_TAGLINE`. That string opens "Pronounced dating.", and the
 * card already carries "pronounced dating" next to the wordmark — which is
 * the one piece of copy on it that has to stay, because the whole point of
 * the name is that people cannot guess how to say it. Reusing the tagline put
 * the same phrase on the card twice.
 *
 * It is also not `HERO.subTitle` ("We help you find him."). The headline pair
 * is rendered as designed on the page and that is the owner's call, but a
 * share card travels without its page to people who did not ask for it;
 * putting the one line that narrows a global product to a single gender on
 * every link anyone shares is a separate decision, not an inherited one.
 */
export const SHARE_SUBLINE =
  "Real people, clear intentions, and one global network — meet someone in your city or across borders.";

export const FOOTER_TAGLINE =
  "Pronounced dating. Real people looking for something real, at home and across borders.";

/**
 * Footer links.
 *
 * Two rules, both learned the hard way:
 *
 * 1. EVERY LINK HAS A UNIQUE DESTINATION. The design had every link as
 *    `href="#"`; the first translation replaced those with the section that
 *    explains each one, which removed the crawl trap but left five of ten
 *    links pointing somewhere another link already went. Most are now real
 *    pages rather than fragments — `/safety`, `/realme`, `/guides`, `/about`,
 *    `/how-it-works`, `/markets`, `/audiences`, `/compare`, `/help` — which is
 *    both unique and a far better internal-linking surface than nine anchors
 *    into one document. `#membership` and `#faq` stay fragments because the
 *    landing page is genuinely where those live.
 *
 * 2. A LINK'S LABEL IS A PROMISE ABOUT ITS DESTINATION. "Privacy policy"
 *    pointed at `#safety` — a marketing section, not a policy. For a product
 *    whose pitch is ID documents and live selfies, that is not a tidy
 *    placeholder; it is a misrepresentation about compliance. It now points
 *    at `/privacy`, which exists.
 *
 * Anchors are checked against the rendered section ids by `landing.test.ts`,
 * and routed paths must resolve through the registry.
 */
export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: "PRODUCT",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Membership", href: "#membership" },
      { label: "Cities", href: "/cities" },
      { label: "Markets", href: "/markets" },
      { label: "Who it's for", href: "/audiences" },
    ],
  },
  {
    heading: "SAFETY",
    links: [
      { label: "Safety Centre", href: "/safety" },
      { label: "RealMe verification", href: "/realme" },
      { label: "Questions", href: "#faq" },
    ],
  },
  {
    heading: "COMPANY",
    links: [
      { label: "About", href: "/about" },
      { label: "Stories", href: "/stories" },
      { label: "Guides", href: "/guides" },
      { label: "Compare", href: "/compare" },
      { label: "Help", href: "/help" },
    ],
  },
  {
    heading: "LEGAL",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      /*
       * `/contact` belongs in the footer and not only in the legal pages.
       * A privacy notice has to name a contact route to be compliant at all,
       * and a reader looking for one looks in the footer first — which is
       * where it was missing. Reserved in `reserved-slugs.ts` from the start;
       * the page just had not been built.
       */
      { label: "Contact", href: "/contact" },
    ],
  },
];

/*
 * The copyright year is computed, not written. A hardcoded "© 2026" is wrong
 * from 1 January and nobody notices, because nobody re-reads a footer.
 */
export const legalLine = (now: Date = new Date()) =>
  `© ${now.getUTCFullYear()} da8n. Adults 18+ only.`;
