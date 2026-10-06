import type { SeoFaq, SeoLink, SeoPage, SeoSection } from "./seo-page";
import {
  COMPETITORS,
  findCompetitor,
  type Competitor,
  type CompetitorCategory,
} from "./competitors";

/**
 * Written copy for `/compare/{slug}` — the COMPETITOR axis.
 *
 * ---------------------------------------------------------------------------
 * THE ONE RULE THIS FILE IS BUILT AROUND
 *
 * A page here may state exactly ONE fact about the other product: the category
 * it belongs to. Everything else on the page is about DA8N.
 *
 * That is not timidity, it is the only version of this page that stays true.
 * A feature table about someone else's product is false within a quarter and
 * nobody goes back to check — which is precisely how comparison content earns
 * its reputation. And the category claim itself is only rendered when the
 * competitor record carries a `factsVerifiedAt` date, set from the product's
 * own public description of itself. Where that date is absent, the category
 * section does not render at all: `CATEGORY_CONTRAST` is keyed by category and
 * only reached through a verified record.
 *
 * So three of the eight pages currently describe DA8N alone and name the other
 * product only to say which search brought you here. That is a less impressive
 * page and an honest one, and `competitors.ts` records exactly why for each.
 *
 * NEVER, on any of these pages:
 *
 *   NO Review or AggregateRating structured data. DA8N publishes no ratings,
 *   and rating a third party in schema is a fabricated claim about their
 *   product. `structuredData` below is WebPage, BreadcrumbList and FAQPage —
 *   enforced by `compare-pages.test.ts`.
 *
 *   NO claim of affiliation, endorsement or official relationship. The
 *   disclaimer renders on every page, not on the index only.
 *
 *   NO undated feature claim about anyone. No pricing for anyone, theirs or
 *   ours — ours is per-market and lives in the member application.
 *
 *   NO disparagement. Nominative use means naming a product to identify it.
 *   Every category below is written to say what that approach is GOOD at
 *   before it says what it costs, because that is both fairer and more
 *   persuasive than a hatchet job to the one reader who matters — the person
 *   who currently uses it.
 * ---------------------------------------------------------------------------
 */

/** The four dimensions DA8N actually differs on. Identical on every page. */
const DA8N_DIMENSIONS: readonly SeoSection[] = [
  {
    heading: "Verification is mandatory, not a badge",
    body:
      "RealMe runs before anyone can message you: a government ID, a liveness selfie and a verification video, checked together. It is not an optional badge that some members carry and others do not, which is the form verification usually takes and the form that does the least good — because the profiles you most want checked are exactly the ones that will not volunteer. A Safety Profile also states what has NOT been checked, since a missing check presented as a clean result is worse than no check at all. This is a statement about identity and nothing more: no verification system can tell you how a person will behave.",
  },
  {
    heading: "Intention is a field everyone fills in",
    body:
      "What you are dating for is part of your profile from the first day, rather than something another person infers from your photographs and then raises awkwardly in week three. So is faith, and so is how you think about distance. This costs some of the ambiguity that makes dating comfortable and returns the fortnight people otherwise spend discovering a mismatch neither of them declared.",
  },
  {
    heading: "Introductions that show their reasons",
    body:
      "For You explains itself. Every introduction shows the dimensions behind it, including the ones where two people do not already agree — because a difference you can see is information, while a difference hidden behind a compatibility percentage is a number you are asked to trust. Nobody is ranked by what they paid: membership changes what you can see and control, not where you appear.",
  },
  {
    heading: "Distance is a parameter, not an error",
    body:
      "Where you live, where you are from and where you are open to meeting are three separate fields doing three different jobs. That is what makes a corridor — Lagos to Manchester, Johannesburg to London, Abuja to Houston — an ordinary case rather than something you have to misstate your location to achieve. Other members see your city, never your precise position.",
  },
];

/**
 * The category contrast. Reached ONLY through a competitor record carrying a
 * `factsVerifiedAt` date, which is why this is keyed by category rather than
 * written per competitor: the claim is about the approach, and the approach is
 * the thing that was verified.
 */
const CATEGORY_CONTRAST: Readonly<Record<CompetitorCategory, SeoSection>> = {
  "swipe-first": {
    heading: "What a swipe-first app is good at, and what it costs",
    body:
      "Swipe-first products are genuinely good at one thing: showing you a great many people very quickly. If what you want is volume and speed, that is not a flaw to be corrected and DA8N is not a better version of it. The cost is that the two facts which decide whether a conversation is worth having — who this person actually is, and what they are here for — are both invisible until you ask. DA8N makes both explicit before the first message instead, which is slower at the top of the funnel and considerably faster overall.",
  },
  "intent-first": {
    heading: "Closer in philosophy, and the gap that remains",
    body:
      "Intent-first products are the closest thing to DA8N in outlook: prompts rather than one-line bios, slower pacing, an emphasis on what someone is actually like. The remaining gap is not philosophy, it is identity and distance. A thoughtful unverified profile is still an unverified profile, and most products in this category assume both people are in one city — which quietly removes most of the options for anyone whose community is spread across several. DA8N makes verification mandatory and treats distance as something you set.",
  },
  "subscription-matchmaking": {
    heading: "An algorithm you can see the workings of",
    body:
      "Questionnaire-and-algorithm products take the question seriously, and a long compatibility quiz does gather real signal. The usual complaint is not that the matching is bad but that it is unreadable: a score arrives, a person is suggested, and there is no way to tell what drove it or which differences were smoothed over. DA8N shows the reasons on every introduction, including the dimensions where two people do not agree, and does not rank anyone by what they paid.",
  },
  "community-specific": {
    heading: "Strong in one place, thin everywhere else",
    body:
      "Community-specific products are often the best option within the community they serve, and that is a real achievement rather than a niche. Where they tend to be thin is reach — which matters most for diaspora dating, where the people you would want to meet are distributed across several countries by work, study and family. DA8N is one network with localized front doors, so a corridor between two cities is the normal case rather than the edge one.",
  },
};

type CompareCopy = {
  readonly title: string;
  readonly h1: string;
  readonly description: string;
  readonly intro: string;
  /** Written for this product's own search intent. Rendered after the contrast. */
  readonly whyPeopleSearch: SeoSection;
  readonly faqs: readonly SeoFaq[];
};

const COPY: Readonly<Record<string, CompareCopy>> = {
  tinder: {
    title: "DA8N and Tinder, compared",
    h1: "Looking for something slower than a swipe.",
    description:
      "How DA8N differs from swipe-first dating: verification required before messaging, intention on the profile, and distance you set yourself.",
    intro:
      "People who search for an alternative to a swipe-first app have usually not run out of matches. They have run out of patience with conversations that go nowhere because neither person ever said what they were there for. That is the specific problem DA8N is built around, and it is worth being clear that it is a different product rather than a better one.",
    whyPeopleSearch: {
      heading: "If volume is working for you, keep it",
      body:
        "This is worth saying plainly on a page like this. If fast, high-volume discovery suits what you want from dating right now, a swipe-first app does it better than DA8N will, and swapping to a product built around stated intention and mandatory verification will feel like friction rather than relief. DA8N is for the point at which you would trade reach for knowing who you are talking to.",
    },
    faqs: [
      {
        question: "Is DA8N just a slower swipe app?",
        answer:
          "No. The difference is what is known before the first message rather than how fast the interface moves. Identity is verified, intention is stated, and every introduction shows the reasons behind it — including where two people differ.",
      },
      {
        question: "Do I have to verify my identity to use DA8N?",
        answer:
          "Yes. A government ID, a liveness selfie and a verification video are checked together before you can message anyone. It takes about four minutes and joining is free.",
      },
      {
        question: "Can I still meet people nearby?",
        answer:
          "Yes. Distance is a preference you set rather than a mode. Most people keep a local radius and add one or two places that matter to them.",
      },
      {
        question: "Does DA8N have swiping?",
        answer:
          "Discovery is built around introductions that explain themselves rather than a stack to clear. You decide on each one with the reasons visible.",
      },
    ],
  },

  hinge: {
    title: "DA8N and Hinge, compared",
    h1: "Prompts are a good start. Identity is the rest.",
    description:
      "DA8N compared with intent-first dating apps: the same seriousness about intention, plus mandatory verification and distance as a real field.",
    intro:
      "If you have been using an intent-first app, DA8N will feel familiar in outlook and different in two specific places. The shared premise is that dating works better when people say what they want. The departures are that DA8N verifies identity before anyone can message you, and that it does not assume the person who fits is in your city.",
    whyPeopleSearch: {
      heading: "The two places DA8N departs",
      body:
        "First, verification: prompts tell you what someone is like, and nothing in a thoughtful profile tells you whether the person exists as described. RealMe is mandatory rather than a badge, which is the only version that helps — the profiles most worth checking are the ones least likely to volunteer. Second, distance: being open to meeting someone in another city is a field here rather than a workaround, which matters enormously if your community is spread across several countries.",
    },
    faqs: [
      {
        question: "If both products care about intention, what actually differs?",
        answer:
          "Identity and distance. Verification is required before messaging on DA8N, and where you live, where you are from and where you are open to meeting are three separate fields rather than one location.",
      },
      {
        question: "Does DA8N use prompts?",
        answer:
          "Intention, faith and openness to distance are structured fields rather than open prompts, because they are the answers that decide whether a conversation is worth either person's time. Every introduction then shows which of them it was based on.",
      },
      {
        question: "Is there a compatibility score?",
        answer:
          "No score. Each introduction lists its reasons, including the dimensions where two people do not already agree, so you can weigh them yourself rather than defer to a percentage.",
      },
      {
        question: "Does paying change who sees me?",
        answer:
          "No. Membership changes what you can see and control. It does not rank you above anyone, and pricing is per-market and shown in the app rather than here.",
      },
    ],
  },

  bumble: {
    title: "DA8N and Bumble, compared",
    h1: "What DA8N does differently.",
    description:
      "What DA8N does: verification required before messaging, intention stated on the profile, explained introductions, and distance you set.",
    intro:
      "You have arrived here from a search for an alternative, so the useful thing this page can do is describe DA8N precisely rather than characterise another product. What follows is what DA8N does, in enough detail that you can judge whether it is what you were looking for.",
    whyPeopleSearch: {
      heading: "Why this page does not describe Bumble",
      body:
        "Because we have not verified how it works today, and this site does not publish an undated claim about anybody else's product. Comparison pages go stale quietly — a feature table written this quarter is wrong by the next and nobody returns to check — so the rule here is that a claim about another product is published only with the date it was checked against that product's own description of itself. Bumble's category has not been checked to that standard, so nothing is asserted about it. For what it offers today, their own site is the authority.",
    },
    faqs: [
      {
        question: "Why is there no comparison table on this page?",
        answer:
          "Because a feature table about another company's product is out of date within a quarter and nobody goes back to correct it. This site publishes a claim about a third party only alongside the date it was verified against their own description of themselves.",
      },
      {
        question: "What does DA8N require before someone can message me?",
        answer:
          "Verification. A government ID, a liveness selfie and a verification video are checked together, for every member, before any message can be sent.",
      },
      {
        question: "Is DA8N available where I live?",
        answer:
          "DA8N opens market by market and says so. Each market page states plainly whether the product is open there yet rather than implying it by existing.",
      },
      {
        question: "What does membership change?",
        answer:
          "What you can see and control — not where you rank. Nobody is ordered by what they paid, and pricing is per-market and shown in the app.",
      },
    ],
  },

  match: {
    title: "DA8N and Match, compared",
    h1: "What DA8N does differently.",
    description:
      "What DA8N does: mandatory identity verification, stated intention, introductions that show their reasons, and distance as a real setting.",
    intro:
      "This page describes DA8N rather than the product you searched for, deliberately and for a stated reason. What follows is specific enough to decide on: what is checked, what is stated, how introductions are made and how distance is handled.",
    whyPeopleSearch: {
      heading: "Why this page does not describe Match",
      body:
        "Because it has not been verified to the standard this site requires. A claim about another product is published only with the date it was checked against that product's own public description of itself, and an automated check of Match's site was refused, which is their right and not a criticism. Rather than fill the gap with a recollection or someone else's comparison article, the gap stays visible. Their own site is the authority on what they offer.",
    },
    faqs: [
      {
        question: "Why does this page not compare features?",
        answer:
          "Because the facts have not been verified to a standard that can be dated, and an undated claim about someone else's product becomes false on its own. The page says what DA8N does instead.",
      },
      {
        question: "Does DA8N use a compatibility questionnaire?",
        answer:
          "There is no long quiz and no score. Intention, faith and openness to distance are profile fields, and every introduction shows which of them it was based on, including where two people differ.",
      },
      {
        question: "Is identity verification optional?",
        answer:
          "No. It is required for every member before messaging: a government ID, a liveness selfie and a verification video, checked together.",
      },
      {
        question: "How much does DA8N cost?",
        answer:
          "Joining is free. Paid membership is priced per market and shown in the app, which is the only place that knows your market and currency — no price is quoted on this site.",
      },
    ],
  },

  zoosk: {
    title: "DA8N and Zoosk, compared",
    h1: "An algorithm you can read the reasons from.",
    description:
      "DA8N compared with algorithmic subscription matching: explained introductions instead of a score, and verification required before messaging.",
    intro:
      "Behavioural matching gathers real signal, and the common frustration with it is not that it is wrong but that it is unreadable. A person is suggested and there is no way to see what drove it or which differences were smoothed over. DA8N takes the opposite approach to the same problem.",
    whyPeopleSearch: {
      heading: "Reasons instead of a score",
      body:
        "Every introduction DA8N makes lists the dimensions behind it, including the ones where two people do not already agree. Some of those differences will not matter to you at all; one of them might be the entire question. Either way you are better placed to tell which than an algorithm is, and a visible difference is information in a way that a percentage never is. Nobody is ranked by what they paid.",
    },
    faqs: [
      {
        question: "Does DA8N learn from what I like?",
        answer:
          "Introductions are made on stated preferences and profile fields, and they show their reasons. The design principle is that you should be able to see why someone was suggested rather than trust that the system knows.",
      },
      {
        question: "Is there a long questionnaire to complete?",
        answer:
          "No. Verification takes about four minutes and the profile fields that do the work — intention, faith, where you live and where you are open to meeting — are short because they are specific.",
      },
      {
        question: "Do I need to subscribe to message anyone?",
        answer:
          "Joining is free and includes meeting people, browsing, chat and verification. Paid tiers add visibility and control, and are priced per market in the app.",
      },
      {
        question: "Is everyone verified?",
        answer:
          "Yes — a government ID, a liveness selfie and a verification video, checked together, before anyone can message you.",
      },
    ],
  },

  eharmony: {
    title: "DA8N and eharmony, compared",
    h1: "Serious about the same thing, differently.",
    description:
      "DA8N compared with compatibility-quiz matching: intention as a short stated field, explained introductions, and mandatory verification.",
    intro:
      "Quiz-and-algorithm products and DA8N agree on the premise — that dating works better when the decisive questions are asked before two people invest months — and disagree about where the answers should live. One puts them inside a compatibility engine. DA8N puts them on the profile, where you can read them.",
    whyPeopleSearch: {
      heading: "On the profile rather than inside the engine",
      body:
        "A long questionnaire produces a score, and a score asks for trust while giving nothing back. The same information stated on a profile — intention, faith, how involved family is, whether you would move — is something both people can see, discuss and change their mind about. DA8N's introductions then show which of those dimensions they rested on, including the ones where two people do not agree, which is the part a compatibility percentage necessarily hides.",
    },
    faqs: [
      {
        question: "Is there a compatibility quiz on DA8N?",
        answer:
          "No. The fields that matter are stated on the profile and visible to the people you are matched with, rather than consumed by a scoring engine.",
      },
      {
        question: "Is DA8N for people looking for marriage?",
        answer:
          "It is for people who state what they are looking for, and marriage is one of the things you can state. So is a serious relationship, companionship, or working out what you want.",
      },
      {
        question: "Does DA8N publish success statistics?",
        answer:
          "No. No marriage rates, no success rates, no outcome claims of any kind. What is described here is how the product works, which you can check; what happens between two people is not something a network can promise.",
      },
      {
        question: "What is verified, exactly?",
        answer:
          "That you are a real person who matches your photographs — a government ID, a liveness selfie and a verification video, checked together, before anyone can message you. It is a check about identity, not about character.",
      },
    ],
  },

  grindr: {
    title: "DA8N and Grindr, compared",
    h1: "One network, several front doors.",
    description:
      "DA8N compared with community-specific dating apps: the same local depth, with reach across every market DA8N has opened.",
    intro:
      "A community-specific app is often the best option inside the community it serves, and that is a genuine achievement rather than a limitation. Where the model strains is reach — which is exactly the problem for anyone whose community is spread across several countries by work, study or family.",
    whyPeopleSearch: {
      heading: "Local depth without the country boundary",
      body:
        "DA8N is one network with a localized front door in each market it has opened, so a profile in Cape Town and a profile in London belong to the same pool rather than two products that never meet. Community, faith, intention and life stage are fields on the profile rather than separate apps to choose between, and openness to meeting somewhere else is its own field — which is what makes a corridor between two cities ordinary here.",
    },
    faqs: [
      {
        question: "Is DA8N aimed at one community?",
        answer:
          "No. It is one network, and community is one of the axes a profile can state — alongside intention, faith and life stage — rather than the thing that defines a separate product.",
      },
      {
        question: "Can I meet people in another country?",
        answer:
          "Yes. Where you live, where you are from and where you are open to meeting are three separate fields, so a cross-border match does not require anyone to misstate their location.",
      },
      {
        question: "Do other members see where I am?",
        answer:
          "They see your city, never your precise location. What is and is not shown to other members is set out in the privacy notice.",
      },
      {
        question: "Is DA8N open everywhere?",
        answer:
          "No, and each market page says so plainly. DA8N opens market by market; having a page for a place is an entry point rather than a claim that the product is live there.",
      },
    ],
  },

  badoo: {
    title: "DA8N and Badoo, compared",
    h1: "What DA8N does differently.",
    description:
      "What DA8N does: identity verified before messaging, intention on the profile, explained introductions, and distance as a setting you own.",
    intro:
      "This page describes DA8N and makes no claim about the product you searched for, which is a deliberate choice with a stated reason below. What follows is specific: what gets checked, what gets stated, how introductions are made, and how distance is handled.",
    whyPeopleSearch: {
      heading: "Why this page does not describe Badoo",
      body:
        "Because our own record of how it works does not match what Badoo's site says about itself, and the right response to that is to publish nothing until a person has looked rather than to pick whichever version is handier. This site attaches a verification date to every claim it makes about a third party, and there is no date here to attach. Their own site is the authority on what they offer.",
    },
    faqs: [
      {
        question: "Why is there no comparison on this page?",
        answer:
          "Because the facts behind one have not been verified, and this site does not publish an undated claim about another company's product. The honest version of this page is a precise description of DA8N.",
      },
      {
        question: "What does DA8N check before someone can contact me?",
        answer:
          "Identity. A government ID, a liveness selfie and a verification video, checked together, for every member, before any message is sent.",
      },
      {
        question: "Can I say what I am looking for?",
        answer:
          "Yes, and it is a profile field rather than a line in a bio. So are faith and how you think about distance, and introductions show which of them they rested on.",
      },
      {
        question: "Does DA8N charge to send messages?",
        answer:
          "No. There are no per-message charges and no paid introductions. Paid membership changes what you can see and control, and is priced per market in the app.",
      },
    ],
  },
};

export const COMPARE_DISCLAIMER =
  "Product names are used only to identify the products they belong to. DA8N is not affiliated with, " +
  "endorsed by or official to any of them, and publishes no ratings of any product including its own.";

export function comparePagePath(slug: string): string {
  return `/compare/${slug}`;
}

function relatedLinks(competitor: Competitor): readonly SeoLink[] {
  /*
   * Other comparisons, then the product pages. Derived from the catalog so a
   * related link cannot point at a comparison that has no page: the filter is
   * on copy existing, not on the record existing.
   */
  const siblings: SeoLink[] = COMPETITORS.flatMap((other) => {
    if (other.slug === competitor.slug || !COPY[other.slug]) return [];
    return [{ label: `DA8N and ${other.name}`, href: comparePagePath(other.slug) }];
  }).slice(0, 3);

  return [
    { label: "How DA8N compares, by category", href: "/compare" },
    { label: "How DA8N works", href: "/how-it-works" },
    { label: "RealMe verification", href: "/realme" },
    ...siblings,
  ];
}

/**
 * Assemble the `SeoPage` for one competitor comparison.
 *
 * The category contrast section is included ONLY when the record carries a
 * `factsVerifiedAt` date. That is the mechanism described at the top of this
 * file: no verification date, no claim about the other product, and the page
 * falls back to describing DA8N and saying why.
 */
export function compareSeoPage(slug: string): SeoPage | undefined {
  const competitor = findCompetitor(slug);
  if (!competitor) return undefined;
  const copy = COPY[competitor.slug];
  if (!copy) return undefined;

  const verified = Boolean(competitor.factsVerifiedAt);
  const sections: SeoSection[] = [
    ...(verified ? [CATEGORY_CONTRAST[competitor.category]] : []),
    copy.whyPeopleSearch,
    ...DA8N_DIMENSIONS,
  ];

  return {
    slug: competitor.slug,
    kicker: "COMPARE",
    title: copy.title,
    h1: copy.h1,
    description: copy.description,
    intro: copy.intro,
    sections,
    faqs: copy.faqs,
    related: relatedLinks(competitor),
    cta: { label: "Join da8n for free", href: "/sign-up" },
    indexability: "indexable",
    /*
     * No Review, no AggregateRating, ever. DA8N publishes no ratings, and
     * rating a third party in schema is a fabricated claim about their
     * product. Asserted in `compare-pages.test.ts`.
     */
    structuredData: ["WebPage", "BreadcrumbList", "FAQPage"],
    locale: "en",
    publishedAt: "2026-10-05",
    /*
     * `reviewedAt` is the competitor's own verification date, NOT today's and
     * NOT the build date. These pages have `claimsDecay` set, so the gate
     * pulls one from the index once its verification passes the staleness
     * window — which is the entire point of dating the record rather than the
     * deploy. An unverified record has no date, so it is never indexable.
     */
    ...(competitor.factsVerifiedAt ? { reviewedAt: competitor.factsVerifiedAt } : {}),
  };
}

/** Every competitor that has copy written. Drives `generateStaticParams`. */
export function comparePages(): readonly SeoPage[] {
  return COMPETITORS.flatMap((competitor) => {
    const page = compareSeoPage(competitor.slug);
    return page ? [page] : [];
  });
}
