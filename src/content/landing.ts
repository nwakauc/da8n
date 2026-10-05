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
 * Two kinds of content here are NOT claims of fact, and both are flagged in
 * the data so the components can label them:
 *
 *   `EXAMPLE_PROFILES`  Illustrative member cards and in-app screens. These
 *                       are depictions of the interface, not real members.
 *                       `isExample: true` makes the components render a label.
 *
 *   `STORIES`           `consented: false` on every entry. These are written
 *                       placeholders, not testimonials from real couples, and
 *                       the component stamps them DRAFT while that holds.
 *                       Replace with real, written-consent testimonials and
 *                       flip the flag — do not flip the flag first.
 *
 * Neither gets Review or AggregateRating structured data. Not now, not when
 * the stories become real: that markup belongs on a page about a reviewed
 * product, and inventing it to chase a rich result is exactly the thing the
 * SEO rules forbid.
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
  cta: "Join da8n for free →",
  note: "Free to join · verify in about four minutes",
  script: ["Be the real you.", "Your person wants the authentic you."],
} as const;

/* -------------------------------------------------------- example content */

/**
 * Illustrative interface content. Named people, ages, cities and states shown
 * inside product mockups. Not real members; see CONTENT INTEGRITY above.
 */
export const EXAMPLE_PROFILES = {
  isExample: true,
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
  eyebrow: "WHY DA8N",
  title: "Other apps made it easy to meet anyone. ",
  titleAccent: "We make it easier to meet someone real.",
} as const;

export const PILLARS: readonly Pillar[] = [
  {
    num: "01",
    kicker: "REAL PEOPLE",
    title: "Know who’s behind the profile.",
    body: "Verified with RealMe. No mystery profiles.",
    accent: "gold",
    icon: "seal",
  },
  {
    num: "02",
    kicker: "CLEAR INTENTIONS",
    title: "Know what they’re here for.",
    body: "Dating, love, a relationship or marriage. Clear from the start.",
    accent: "rose",
    icon: "heart",
  },
  {
    num: "03",
    kicker: "BETTER POSSIBILITIES",
    title: "Meet people worth meeting.",
    body: "People who fit what you’re looking for, not just more profiles.",
    accent: "green",
    icon: "rings",
  },
  {
    num: "04",
    kicker: "YOUR WORLD, YOUR CHOICE",
    title: "Date who you want, how you want.",
    body: "Close to home or far away. You choose who finds you.",
    accent: "ink",
    icon: "globe",
  },
];

/* ----------------------------------------------------------- how it works */

export type Step = {
  readonly label: string;
  readonly detail: string;
  readonly accent: "ink" | "rose" | "green" | "gold";
};

export const HOW = {
  eyebrow: "HOW IT WORKS",
  title: "Less swiping. ",
  titleAccent: "More meaning.",
} as const;

export const STEPS: readonly Step[] = [
  { label: "Create your profile", detail: "Photos and a few words about you.", accent: "ink" },
  {
    label: "Set your intentions",
    detail: "Dating, love, a relationship or marriage.",
    accent: "rose",
  },
  { label: "See who’s For You", detail: "People who fit what matters to you.", accent: "green" },
  {
    label: "Get RealMe verified",
    detail: "ID and a live selfie before your first message.",
    accent: "gold",
  },
  { label: "Send an introduction", detail: "Say why you’d like to meet.", accent: "rose" },
];

/* ----------------------------------------------------------------- cities */

export type LandingCity = {
  /** Must exist in `cities.ts`. The href is derived, never hand-written. */
  readonly slug: string;
  readonly countryCode: string;
  /**
   * What the card says. Usually the city's own name — but the design labels
   * the Houston card "Texas", and a state is a broader intent than a city.
   * Kept as designed; see the open question in the README.
   */
  readonly label: string;
  readonly countryLabel: string;
  readonly flag: string;
  /** Path under /public, or null to render the design's labelled slot. */
  readonly photo: string | null;
};

export const CITIES_SECTION = {
  eyebrow: "CITIES",
  title: "Your city. ",
  titleAccent: "Or theirs.",
  lede: "Meet someone around the corner, back home, or somewhere you haven't been yet.",
  allLabel: "Explore all cities",
  allKicker: "EVERYWHERE ELSE",
  note: "Where you live, where you're from and where you're open to meeting are three different things. da8n treats them that way.",
} as const;

/**
 * The design's grid, exactly: London, Texas, Toronto, Sydney, Dubai, Paris,
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
    label: "Texas",
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

export const COMPAT = {
  eyebrow: "COMPATIBILITY",
  title: "Not more people. ",
  titleAccent: "Better possibilities.",
  lede: "da8n looks beyond photos to understand what might actually bring two people together.",
  panelTitle: "Why you may connect",
  reasons: [
    "Both want a serious relationship",
    "Similar family values",
    "Both love travelling",
    "Open to long distance",
    "You both enjoy good food",
  ],
} as const;

export const READY = {
  title: "Some people are browsing. ",
  titleAccent: "Some are Ready.",
  body: "Turn on Ready when you are genuinely open to meeting someone. Find other people who feel the same.",
  stateLabel: "Ready",
  stateLeft: "6 days left",
  tags: ["Relationship", "Marriage", "Dating", "Open to distance"],
} as const;

/* ----------------------------------------------------------------- safety */

export const SAFETY = {
  eyebrow: "SAFETY",
  /** See the note on HERO about point of view. Rendered as designed. */
  title: "Built for the woman who's been ",
  titleAccent: "catfished",
  titleTail: " before.",
  claim: "Real people, backed by better safety.",
  body: "Every da8n member has a Safety Profile powered by D8N Safety. It brings together RealMe verification, account integrity and available safety information in one place, before you decide to meet.",
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
  readonly items: readonly { readonly text: string; readonly state: "verified" | "pending" | "plain" }[];
};

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
  groups: [
    {
      label: "IDENTITY",
      items: [
        { text: "RealMe verified", state: "verified" },
        { text: "Live person verified", state: "verified" },
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
  ] satisfies readonly SafetyGroup[],
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
    cta: "Request a background check →",
  },
} as const;

export type SafetyFeature = {
  readonly title: string;
  readonly body: string;
  readonly accent: "green" | "gold" | "ink" | "rose";
  readonly icon: "shield" | "doc" | "alert" | "block" | "book" | "pin";
};

export const SAFETY_FEATURES: readonly SafetyFeature[] = [
  {
    title: "Safety Profile",
    body: "On every profile, so trust is part of the decision.",
    accent: "green",
    icon: "shield",
  },
  {
    title: "Background checks",
    body: "Optional and consent-based. They ask before any check begins.",
    accent: "gold",
    icon: "doc",
  },
  {
    title: "Platform protection",
    body: "Fraud, scripted openers and money requests are flagged.",
    accent: "ink",
    icon: "alert",
  },
  {
    title: "Reporting and blocking",
    body: "One tap, any time, reviewed by a person.",
    accent: "rose",
    icon: "block",
  },
  {
    title: "Safety Centre",
    body: "Guidance for meeting in person, and help when you need it.",
    accent: "gold",
    icon: "book",
  },
  {
    title: "Date Check-in",
    body: "Opt in when you meet someone. Share your plan with people you trust, check in on your terms, and choose what happens if we don’t hear from you.",
    accent: "rose",
    icon: "pin",
  },
];

export const CHECK_IN = {
  label: "DATE CHECK-IN",
  live: "Active until 11pm",
  plan: "Dinner with Marcus",
  planMeta: "Tonight, 8pm · Shared with Ada",
  rule: "Check in at 9:30. If I don’t reply in 15 minutes, call Ada and share my location.",
  ok: "I’m OK",
  out: "Get me out",
} as const;

/* ---------------------------------------------------------------- stories */

export type Story = {
  readonly quote: string;
  readonly who: string;
  readonly meta: string;
  readonly photo: string | null;
  /**
   * Whether this is a real member story with written consent to publish.
   * FALSE on every entry today — see CONTENT INTEGRITY at the top of this
   * file. While false the component stamps the card DRAFT, because a quoted
   * couple with a wedding year reads as a testimonial whether or not it is
   * labelled one.
   */
  readonly consented: boolean;
};

export const STORIES_SECTION = {
  eyebrow: "STORIES",
  title: "This is what ",
  titleAccent: "we're here for.",
  lede: "Real people who found someone real.",
} as const;

export const STORIES: readonly Story[] = [
  {
    quote:
      "I had left every app. Here nobody could hide who they were, and that alone changed the conversations.",
    who: "Grace & Daniel",
    meta: "Married in 2024",
    photo: "/images/landing/story-golden.jpg",
    consented: false,
  },
  {
    quote: "Two continents, one matchmaker. She asked the questions we were both avoiding.",
    who: "Leila & Sam",
    meta: "Together since 2025",
    photo: "/images/landing/halima-mark.jpeg",
    consented: false,
  },
  {
    quote: "My mother's first question was about his family. We had already talked it through.",
    who: "Ana & Luca",
    meta: "Married in 2025",
    photo: "/images/landing/story-wedding.jpg",
    consented: false,
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
  /** True only for the tier that can actually be started today. */
  readonly purchasable: boolean;
};

export const MEMBERSHIP = {
  eyebrow: "MEMBERSHIP",
  title: "Dating shouldn't need a subscription ",
  titleAccent: "to work.",
  lede: "Everything you need to meet someone is free. da8n+ adds more control.",
  /**
   * The design stamps this section DRAFT and it stays stamped. There is no
   * payments implementation, no subscription state and no priced plan — so
   * the paid tiers are positioning, not an offer, and the CTAs below must not
   * lead to a checkout. `purchasable: false` is what enforces that.
   */
  draft: true,
} as const;

export const TIERS: readonly Tier[] = [
  {
    id: "free",
    name: "da8n Free",
    badge: "FREE",
    blurb: "Everything you need to meet someone.",
    features: ["Meet people", "Browse locally", "Chat", "RealMe verification", "For You"],
    cta: "Join free",
    purchasable: true,
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
    purchasable: false,
  },
  {
    id: "vip",
    name: "da8n VIP",
    badge: "MATCHMAKER",
    blurb: "More control, better standards.",
    /**
     * TWO ITEMS HERE NEED A DECISION BEFORE THIS SECTION GOES PUBLIC.
     *
     * "Verified, financially stable members" promises financial screening of
     * members. That is a different category from identity verification: it
     * needs a provider that can do it, a lawful basis in every market, and a
     * published definition of what "financially stable" means. It also reads
     * as a wealth filter, which carries discrimination exposure in several of
     * the listed markets.
     *
     * "Background checks included" promises a capability per jurisdiction.
     * Background-check coverage is country-by-country and provider-bound;
     * "included" cannot be true everywhere DA8N sells.
     *
     * Both are rendered as designed, behind the section's DRAFT stamp and on
     * a page that is noindex. Neither should survive to launch unchanged.
     */
    features: [
      "Everything in da8n+",
      "Verified, financially stable members",
      "More control over who sees you",
      "Background checks included",
      "A personal concierge, if you want one",
    ],
    cta: "Go VIP",
    purchasable: false,
  },
];

/* -------------------------------------------------------------------- FAQ */

export type Faq = { readonly question: string; readonly answer: string };

export const FAQ_SECTION = {
  eyebrow: "QUESTIONS",
  title: "Still wondering?",
  lede: "Short answers to what people ask before they join.",
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
  cta: "Start your story, free",
  note: "Verified in about four minutes. Adults 18+.",
  photo: "/images/landing/hero-home.jpeg",
} as const;

/* ----------------------------------------------------------------- footer */

export type FooterColumn = {
  readonly heading: string;
  readonly links: readonly NavItem[];
};

export const FOOTER_TAGLINE =
  "Pronounced dating. Real people looking for something real, at home and across borders.";

/**
 * Footer links point at in-page anchors or routable paths only. The design
 * had every link as `href="#"`; a placeholder href on a sitewide footer is a
 * crawl trap, so anything without a real destination yet points at the
 * section that explains it instead.
 */
export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: "PRODUCT",
    links: [
      { label: "How it works", href: "#how" },
      { label: "Compatibility", href: "#compatibility" },
      { label: "VIP matchmaking", href: "#membership" },
      { label: "Membership", href: "#membership" },
    ],
  },
  {
    heading: "SAFETY",
    links: [
      { label: "Safety & verification", href: "#safety" },
      { label: "Romance-scam prevention", href: "#safety" },
      { label: "Privacy policy", href: "#safety" },
    ],
  },
  {
    heading: "COMPANY",
    links: [
      { label: "About", href: "#why" },
      { label: "Stories", href: "#stories" },
      { label: "Questions", href: "#faq" },
    ],
  },
];

export const LEGAL_LINE = "© 2026 da8n. Adults 18+ only.";
