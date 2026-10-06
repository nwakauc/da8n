import type { SeoFaq, SeoLink, SeoPage, SeoSection } from "./seo-page";
import { AUDIENCES, findAudience, type Audience } from "./audiences";
import { findMarket, marketInProse } from "./markets";
import { marketPath } from "@/lib/routing";

/**
 * Written copy for `/audiences/{slug}` — the AUDIENCE axis of the search graph.
 *
 * ---------------------------------------------------------------------------
 * WHY THESE PAGES EXIST NOW, AND WHAT CHANGED
 *
 * `audiences.ts` has modelled these entities since phase 1 and the pages were
 * deliberately not built, on one stated ground: liquidity. A "senior dating in
 * Manchester" page with nobody over 55 in Manchester is a thin page that also
 * misleads a real person about whether there is anyone there for them.
 *
 * That reasoning is sound and it still holds — for the AUDIENCE × MARKET
 * combination. It does not hold for the audience alone, which is a different
 * page answering a different question. `/audiences/senior-dating` does not
 * claim anyone is in Manchester; it explains how DA8N works for someone over
 * sixty, which is checkable against shipped behaviour and true everywhere the
 * product runs. So the global audience page is built and indexable, and
 * `/audiences/{slug}/{cc}` remains unbuilt and gated on measured liquidity.
 *
 * Nothing here is generated from a template with the audience name swapped in.
 * Eleven pages that differ only by a noun are one page with eleven URLs, and a
 * search engine treats them accordingly. Every record below is written to the
 * concern that actually brings that person here: diaspora readers are split
 * across countries, readers over fifty are the ones scam operations target,
 * long-distance readers want logistics rather than reassurance.
 *
 * ---------------------------------------------------------------------------
 * THE RULES, WHICH DO NOT BEND — asserted in `audience-pages.test.ts`
 *
 *   NO MEMBER COUNTS. No "N verified members over 50", no "a thriving
 *   community in Lagos", no local activity claim of any kind. This is the
 *   single easiest lie for an audience page to tell and the one that makes it
 *   worthless to the reader.
 *
 *   NO OUTCOME STATISTICS. No marriage rates, no success rates, no
 *   testimonials. Member stories live on `/stories` under consent.
 *
 *   NO PRICES. Pricing is per-market and lives in the member application.
 *
 *   NO SAFETY GUARANTEE. "Verified" is a statement about a check that ran.
 *   "Safe" is a promise about another person that no platform can keep.
 *
 *   NO DEMOGRAPHIC CLAIM ABOUT WHO IS HERE. "Dating over 50" describes who
 *   the page is FOR, never who is already on the network.
 *
 * `related` is derived from the catalog rather than hand-listed, so a link
 * from one of these pages cannot point at a market that has no route.
 * ---------------------------------------------------------------------------
 */

/** The hand-written half. The rest of the `SeoPage` is assembled below. */
type AudienceCopy = {
  readonly kicker: string;
  readonly title: string;
  readonly h1: string;
  readonly description: string;
  readonly intro: string;
  readonly sections: readonly SeoSection[];
  readonly faqs: readonly SeoFaq[];
  /** Site links beyond the derived market list. Guides, product pages. */
  readonly alsoRead: readonly SeoLink[];
  readonly publishedAt: string;
  readonly reviewedAt: string;
};

const PUBLISHED = "2026-10-05";

const COPY: Readonly<Record<string, AudienceCopy>> = {
  /* ------------------------------------------------- community / diaspora */

  "afro-dating": {
    kicker: "COMMUNITY",
    title: "Afro dating across borders",
    h1: "Afro dating, on one network instead of four.",
    description:
      "Dating within the African and Afro-diaspora community without your options being split across a different app in every country.",
    intro:
      "The practical problem with Afro dating is not interest. It is fragmentation. The people you would most want to meet are in Lagos and London and Houston and Johannesburg, and they are on four different apps, each of which only shows you whoever happens to be within forty kilometres. DA8N is built the other way round: one network, local front doors, and distance as something you set rather than something imposed on you.",
    sections: [
      {
        heading: "Why community dating breaks on a local app",
        body:
          "Almost every dating product assumes the person you are looking for is nearby. For a community spread across continents by work, study and family, that assumption quietly removes most of the people who would actually fit. You end up with the choice between a general app in your own city, where community is a filter applied to a thin pool, and a community app in your parents' country, where everyone is in a city you do not live in.",
        bullets: [
          "One profile that is visible across every market DA8N has opened, not one per country",
          "Where you live, where you are from, and where you are open to meeting are three separate fields",
          "Corridors — Lagos to Manchester, Johannesburg to London — are the ordinary case here, not an edge case",
        ],
      },
      {
        heading: "Identity, checked before the first message",
        body:
          "Diaspora dating carries a specific risk: a long-distance conversation with someone you cannot easily verify in person. RealMe handles that at the front door rather than as an optional badge. A government ID, a liveness selfie and a verification video are checked together, so the person in the conversation is the person in the photographs. It is not a character reference and it is not a promise about how someone will behave. It is the difference between talking to a verified stranger and talking to nobody in particular.",
      },
      {
        heading: "Saying what you are here for, in a field rather than a hint",
        body:
          "Intention is part of your profile from the first day, not something another person has to infer from your photographs and then ask about awkwardly in week three. Family involvement, faith, whether you would relocate, what kind of relationship you are open to — these are the questions that decide whether a cross-border match is worth either person's time, and they are better answered up front than discovered late.",
      },
      {
        heading: "Where DA8N has a front door",
        body:
          "DA8N opens market by market rather than claiming to be everywhere. Each market page states plainly whether the product is open there yet, and each city page is an entry point rather than a claim about how busy that city is. You join once; the markets you can meet across are the ones that exist.",
      },
    ],
    faqs: [
      {
        question: "Is this only for people living in Africa?",
        answer:
          "No. It is for the community, wherever its members live. A profile on DA8N is visible across every market the product has opened, and the field for where you are open to meeting is separate from the field for where you live — so someone in Birmingham and someone in Abuja can find each other without either of them lying about their location.",
      },
      {
        question: "Can I meet people in my own city as well?",
        answer:
          "Yes. Distance is a preference you set, not a mode you switch into. Most people set a local radius and one or two places further afield that matter to them, and see both.",
      },
      {
        question: "Is everyone on DA8N verified?",
        answer:
          "RealMe verification is required, not optional. An ID check and a live selfie confirm you are a real person who matches your photographs before you can message anyone. That is a check about identity; it is not a judgement about character, and no verification system can be.",
      },
      {
        question: "How does DA8N handle family and faith?",
        answer:
          "As profile fields rather than as a conversation you have to steer towards. Faith and how involved family is in your dating are things you can state plainly, which saves both people the week it usually takes to find out there was never a match on either.",
      },
    ],
    alsoRead: [
      { label: "How DA8N works", href: "/how-it-works" },
      { label: "RealMe verification", href: "/realme" },
      { label: "Dating someone in another city", href: "/guides/dating-someone-in-another-city" },
    ],
    publishedAt: PUBLISHED,
    reviewedAt: PUBLISHED,
  },

  "nigerian-dating": {
    kicker: "COMMUNITY",
    title: "Nigerian dating, home and abroad",
    h1: "Nigerian dating, without picking a country first.",
    description:
      "For Nigerians at home and in the diaspora: one verified network across Nigeria, the UK, the US and Canada, with intention stated up front.",
    intro:
      "A Nigerian looking for a serious relationship is usually looking in more than one place at once — in Lagos or Abuja, and in whichever city the rest of the family ended up in. Most apps force a choice between the two. DA8N does not: one profile covers every market it has opened, and the question of where you would actually live is a field you fill in rather than an argument in month four.",
    sections: [
      {
        heading: "The corridor is the normal case",
        body:
          "Nigerian dating has shape to it. There are real corridors — Lagos to London, Abuja to Houston, Port Harcourt to Toronto — along which people already move for work, study and family. A dating product that only shows you people within commuting distance is blind to all of them. DA8N treats a corridor as ordinary: you set where you live, where you are from, and where you are open to meeting, and those three answers do different work.",
      },
      {
        heading: "Verification, because distance makes it matter more",
        body:
          "The further apart two people are, the longer it takes to find out whether someone is who they said they were. RealMe closes that gap before the first message rather than after the third month. Government ID, a liveness selfie and a verification video are checked together. Where a Safety Profile has not completed a particular check, it says so rather than implying a result — an absent check is reported as absent, never as a pass.",
      },
      {
        heading: "Intention, family and the questions that decide it",
        body:
          "The conversations that actually determine whether a Nigerian match works are about intention, family involvement, faith and relocation. On most apps all four are discovered late, after both people are already invested. Here they are profile fields set on day one, which is less romantic and considerably kinder. Every introduction DA8N makes also shows its reasons, including the dimensions where two people do not already agree.",
      },
      {
        heading: "Scams, and why this community is targeted",
        body:
          "Romance fraud disproportionately targets cross-border conversations, and Nigerian dating carries the additional burden of a stereotype that makes honest people suspect by association. The practical response is the same for everyone: mandatory identity verification, platform monitoring for the message patterns fraud actually uses, human review of every report, and a written guide on recognising the patterns. No money request from someone you have not met is ever legitimate.",
      },
    ],
    faqs: [
      {
        question: "Does DA8N work inside Nigeria, or only for the diaspora?",
        answer:
          "Both, from one profile. Nigeria has its own market page and city pages, and so do the UK, the US and Canada. Whether the product is open in a given market is stated plainly on that market's page rather than assumed.",
      },
      {
        question: "Can I set that I am only open to meeting someone who would relocate?",
        answer:
          "Where you live and where you are open to meeting are separate fields, and intention is explicit on every profile. That makes the relocation question answerable before either person has spent three months on it.",
      },
      {
        question: "How does DA8N reduce the risk of romance fraud?",
        answer:
          "Identity verification is mandatory before messaging, conversations are monitored for the patterns financial fraud actually uses, and every report is reviewed by a person. None of that removes the risk. The rule that does most of the work is yours to keep: never send money to someone you have not met.",
      },
      {
        question: "Is DA8N the same as Date9ja?",
        answer:
          "They are separate products on the same platform. Date9ja is a Nigerian brand; DA8N is the global network. Membership, sign-in and pricing live in the member application, which is where any account action happens.",
      },
    ],
    alsoRead: [
      { label: "Recognise romance scam patterns", href: "/guides/recognise-romance-scam-patterns" },
      { label: "RealMe verification", href: "/realme" },
      { label: "Safety at DA8N", href: "/safety" },
    ],
    publishedAt: PUBLISHED,
    reviewedAt: PUBLISHED,
  },

  "south-african-dating": {
    kicker: "COMMUNITY",
    title: "South African dating",
    h1: "South African dating, locally and across the diaspora.",
    description:
      "Dating in Johannesburg, Cape Town and Durban, and across the South African diaspora in the UK — verified identity, stated intention.",
    intro:
      "South African dating happens in two places at once: in Johannesburg, Cape Town and Durban, and in the cities the diaspora moved to. DA8N is one network with a front door in each, so a profile in Cape Town and a profile in London are part of the same pool rather than two separate products that never meet.",
    sections: [
      {
        heading: "Three cities, one network, and the UK corridor",
        body:
          "South Africa's dating markets are distinctly local — Johannesburg does not behave like Cape Town, and Durban behaves like neither — while the diaspora corridor to the UK is strong enough that ignoring it removes a real share of anyone's options. DA8N holds both: city pages for each local market, and a profile that is visible wherever else you say you are open to meeting.",
        bullets: [
          "City entry points for Johannesburg, Cape Town and Durban",
          "One profile visible across every market DA8N has opened, including the UK",
          "Distance set by you, rather than a fixed radius decided by the app",
        ],
      },
      {
        heading: "Meeting someone when safety is a real consideration",
        body:
          "Safety is not an abstraction in South African dating, and a product that treats it as a badge is not much use. What DA8N actually does: identity verification is mandatory before anyone can message you; Safety Profiles state what has been checked and, just as importantly, what has not; Date Check-in shares your plan and your own route home with someone you trust in a single step. Reporting is reviewed by a person, and blocking takes effect immediately.",
      },
      {
        heading: "What verification does and does not tell you",
        body:
          "RealMe confirms that the person you are talking to is a real person who matches their photographs, using a government ID, a liveness selfie and a verification video together. That is a statement about a check that ran. It is not a statement about whether someone is kind, honest or safe to meet, and we do not present it as one. Where a background check is available at all it depends on the market and on consent, and an uncompleted check is reported as uncompleted.",
      },
      {
        heading: "Intention as a field, not a guess",
        body:
          "What you are dating for is part of your profile from the start. So is faith, and so is how you think about distance. Every introduction shows the reasons behind it, including where two people differ, which is more useful than a score and considerably more honest than silence.",
      },
    ],
    faqs: [
      {
        question: "Which South African cities does DA8N have pages for?",
        answer:
          "Johannesburg, Cape Town and Durban today, with the market page listing whatever the catalog holds at the time you read it. A city having a page is an entry point into the network, not a claim about how busy that city is.",
      },
      {
        question: "Can I meet South Africans living in the UK?",
        answer:
          "Yes, if that is what you set. Where you live, where you are from and where you are open to meeting are three separate fields, so a Durban-to-London match does not require either person to misstate their location.",
      },
      {
        question: "What happens when I report someone?",
        answer:
          "Blocking takes effect immediately and does not wait for a review. The report itself is read by a person, not closed by an automated rule. If money or identity details were shared, contact your bank or payment provider straight away as well.",
      },
      {
        question: "Does DA8N run background checks in South Africa?",
        answer:
          "Background check availability depends on the market and on the provider, and it always depends on consent. Where a check has not been completed, the Safety Profile says so rather than implying a result.",
      },
    ],
    alsoRead: [
      { label: "Safety at DA8N", href: "/safety" },
      { label: "How to have a better first date", href: "/guides/better-first-date" },
      { label: "How DA8N works", href: "/how-it-works" },
    ],
    publishedAt: PUBLISHED,
    reviewedAt: PUBLISHED,
  },

  /* ------------------------------------------------------------- intention */

  "serious-relationships": {
    kicker: "INTENTION",
    title: "Dating for a serious relationship",
    h1: "For people who are dating for something serious.",
    description:
      "A dating network where intention is a profile field, identity is verified before the first message, and introductions explain themselves.",
    intro:
      "Most dating apps are not against serious relationships; they are simply indifferent to them. Intention is invisible, so two people can exchange messages for a fortnight before discovering they wanted completely different things. DA8N makes the question answerable before the first message, because the alternative is that everyone spends their time finding out late.",
    sections: [
      {
        heading: "Intention is a field, not something to be inferred",
        body:
          "On DA8N what you are dating for is part of your profile from day one. Not a hint in a bio, not a prompt you can answer obliquely — a stated field, visible to the people you are matched with. This costs a little of the ambiguity that makes casual dating comfortable, and it buys back the weeks people otherwise lose to a mismatch neither of them declared.",
      },
      {
        heading: "Ready, so interest means something",
        body:
          "Ready is a state you turn on when you actually have the time and attention for dating, and off when you do not. It is reversible and it is not the same as deleting your account. The point is that a match with someone who is Ready is a match with someone who meant it this week, rather than with a profile that has been sitting untouched since March.",
      },
      {
        heading: "Introductions that show their reasons",
        body:
          "For You explains itself. Every introduction shows the dimensions behind it, including the ones where two people do not already agree — because a difference you can see is information, and a difference hidden behind a compatibility score is just a number you are asked to trust. Nobody is ranked by what they paid.",
      },
      {
        heading: "Verification as the floor, not a badge",
        body:
          "RealMe is mandatory before anyone can message you: a government ID, a liveness selfie and a verification video, checked together. Serious dating is the context where this matters most, because the people most willing to invest months are the people with most to lose from a fiction. Verification is a statement about identity and nothing more; judgement about a person remains yours.",
      },
    ],
    faqs: [
      {
        question: "What stops people saying they want something serious when they do not?",
        answer:
          "Nothing can make a stated intention true, and we do not claim otherwise. What a stated field does is make the mismatch visible and early rather than invisible and late — and it makes the conversation about it a normal one rather than an accusation.",
      },
      {
        question: "Is DA8N only for people who want marriage?",
        answer:
          "No. Intention is a spectrum and the field reflects that: a serious relationship, marriage, companionship, or working out what you want. Stating the last one honestly is more useful to everyone than performing a certainty you do not feel.",
      },
      {
        question: "How is this different from a compatibility quiz?",
        answer:
          "A quiz produces a score you cannot interrogate. DA8N shows the reasons on each introduction, including the points of difference, so you can decide what matters to you rather than deferring to a percentage.",
      },
      {
        question: "Does paying move me up anyone's list?",
        answer:
          "No. Membership changes what you can see and control; it does not rank you above anyone else. Pricing is per-market and shown in the app, not here.",
      },
    ],
    alsoRead: [
      { label: "How DA8N works", href: "/how-it-works" },
      { label: "Build a profile people remember", href: "/guides/profile-people-remember" },
      { label: "RealMe verification", href: "/realme" },
    ],
    publishedAt: PUBLISHED,
    reviewedAt: PUBLISHED,
  },

  "marriage-minded": {
    kicker: "INTENTION",
    title: "Marriage-minded dating",
    h1: "Dating when marriage is the point.",
    description:
      "For people dating towards marriage: stated intention, verified identity, and the family, faith and distance questions answered up front.",
    intro:
      "Dating towards marriage is a different activity from dating, and most apps are built for the second one. The questions that decide it — family, faith, where you would live, how soon, children — are the ones a general app leaves you to raise at some tactful moment that never arrives. DA8N puts them where they belong: on the profile, before anyone has invested a year.",
    sections: [
      {
        heading: "The questions that actually decide it, asked first",
        body:
          "Two people can be genuinely compatible in conversation and completely incompatible in life, and the usual way to discover this is slowly and expensively. The fields that prevent it are unglamorous: what kind of relationship you are open to, how involved family is in your decisions, faith, where you live and where you would be willing to live. None of them is a filter imposed on you. All of them are better stated than guessed.",
        bullets: [
          "Intention stated on the profile, set on day one rather than negotiated later",
          "Faith as something you can state plainly rather than raise in week three",
          "Where you live, where you are from and where you are open to meeting, as three separate fields",
        ],
      },
      {
        heading: "Family, without pretending it is not involved",
        body:
          "In large parts of the world — and in most of the communities DA8N serves — marriage involves two families and not only two people. Treating that as an awkward complication is a design choice, and a poor one. How involved your family is in your dating is a thing you can say, which saves the conversation where one person assumed privacy and the other assumed introductions by month two.",
      },
      {
        heading: "Verification, because the stakes are the whole point",
        body:
          "RealMe is required before anyone can message you: government ID, liveness selfie and verification video, checked together. Where a Safety Profile has not completed a check it says so rather than implying a result, and background check availability depends on the market, the provider and consent. This reduces a specific risk — talking to someone who is not who they said they were. It does not and cannot vouch for a person's character.",
      },
      {
        heading: "Distance, when the right person is in another country",
        body:
          "Marriage-minded dating across borders needs logistics, not reassurance: who moves, what the visa position is, how long the distance phase lasts, how often you will actually see each other. DA8N is built for corridors rather than radii, and the guide on dating someone in another city covers the practical version of these questions rather than the romantic one.",
      },
    ],
    faqs: [
      {
        question: "Is this an arranged-marriage service or a matchmaking agency?",
        answer:
          "Neither. It is a dating network where marriage is a stated intention you can set and search on. Introductions are made to you with their reasons shown; the decisions are entirely yours.",
      },
      {
        question: "Can I say that I want my family involved?",
        answer:
          "Yes. How involved family is in your dating is a field rather than a disclosure you have to time carefully, and it is one of the dimensions an introduction can be explained by.",
      },
      {
        question: "What if the person I match with is in another country?",
        answer:
          "That is the ordinary case here rather than the exception. Where you live and where you are open to meeting are separate fields, so a cross-border match does not require either person to misstate anything.",
      },
      {
        question: "Does DA8N promise an outcome?",
        answer:
          "No. We publish no marriage rates, no success statistics and no outcome claims of any kind. What is described here is how the product works, which is checkable; what happens between two people is not something a network can promise.",
      },
    ],
    alsoRead: [
      { label: "Dating someone in another city", href: "/guides/dating-someone-in-another-city" },
      { label: "How DA8N works", href: "/how-it-works" },
      { label: "Member stories", href: "/stories" },
    ],
    publishedAt: PUBLISHED,
    reviewedAt: PUBLISHED,
  },

  "intentional-dating": {
    kicker: "INTENTION",
    title: "Intentional dating, in practice",
    h1: "Intentional dating, with the vague parts removed.",
    description:
      "What intentional dating means once it stops being a slogan: stated intention, verified identity, explained introductions, reversible pacing.",
    intro:
      "Intentional dating has become a marketing word, which is a shame, because the underlying idea is simply sound: decide what you are looking for, say it, and spend your attention accordingly. The difference between a product that means it and one that borrowed the phrase is whether any of that is built into the thing or merely written on the front of it.",
    sections: [
      {
        heading: "What it means here, concretely",
        body:
          "Four mechanisms rather than a tone of voice. Intention is a profile field everyone fills in, so a mismatch surfaces before the conversation does. Ready is a state you control, so interest means someone meant it this week. For You shows the reasons behind every introduction, including points of difference. And verification is mandatory, so the person is at least the person.",
        bullets: [
          "Intention stated on the profile, not inferred from photographs",
          "Ready turned on when you have attention for dating and off when you do not",
          "Introductions that show their reasons, including where two people differ",
          "RealMe verification required before anyone can message you",
        ],
      },
      {
        heading: "Pacing you control, and can reverse",
        body:
          "Being intentional sometimes means stopping. Ready is reversible and is not the same as deleting an account: turning it off takes you out of circulation without destroying your profile, your conversations or your verification status. A product that makes pausing feel like quitting pushes people into dating while distracted, which serves nobody.",
      },
      {
        heading: "Why an explained introduction beats a score",
        body:
          "A compatibility percentage asks for trust and gives nothing back. A list of reasons — including the dimensions on which two people do not agree — gives you something to think with. You may decide a stated difference does not matter, or that it is the whole question. Either way the decision is informed, and nobody is ranked by what they paid.",
      },
      {
        heading: "Deciding what you are looking for, which is the hard part",
        body:
          "No product can do this bit for you, and any that claims to is selling something. What a product can do is stop punishing honesty: let you say you are working out what you want without that reading as evasion, and let you change the answer when it changes. The guides cover the practical side — what to ask on a first date, how to write a profile that sounds like a person.",
      },
    ],
    faqs: [
      {
        question: "Is intentional dating just slower dating?",
        answer:
          "Not really. It is dating with the decisive information available early rather than late. That often feels slower at the start and is considerably faster overall, because the mismatches end in week one instead of month four.",
      },
      {
        question: "What if I genuinely do not know what I want yet?",
        answer:
          "That is a valid answer and the intention field accommodates it. Saying you are working out what you are looking for is more useful to the people you meet than performing a certainty you do not have.",
      },
      {
        question: "Can I pause without losing my profile?",
        answer:
          "Yes. Turning Ready off takes you out of circulation and is fully reversible. Deleting your account is a separate, permanent action you take in the app.",
      },
      {
        question: "Why show me the ways two people are different?",
        answer:
          "Because a difference you can see is information and a difference hidden behind a score is not. Some differences do not matter at all; some are the entire question. You are better placed than an algorithm to tell which is which.",
      },
    ],
    alsoRead: [
      { label: "How DA8N works", href: "/how-it-works" },
      { label: "How to have a better first date", href: "/guides/better-first-date" },
      { label: "Build a profile people remember", href: "/guides/profile-people-remember" },
    ],
    publishedAt: PUBLISHED,
    reviewedAt: PUBLISHED,
  },

  /* ----------------------------------------------------------- age cohorts */

  "dating-over-40": {
    kicker: "LIFE STAGE",
    title: "Dating over 40",
    h1: "Dating over 40, without starting from scratch.",
    description:
      "Dating in your forties with verified identity, stated intention and the practical questions — children, time, distance — treated as normal.",
    intro:
      "Dating at forty is not dating at twenty-five with different photographs. There is usually more context to account for and less patience available for wasting, and the things that were optional the first time round — knowing what you want, knowing who you are talking to — have become the whole point. DA8N is built for the second version rather than the first.",
    sections: [
      {
        heading: "Less time to waste, so the decisive questions come first",
        body:
          "At forty the mismatch you want to find out about in week one is not taste in films. It is children, how much time you actually have, whether either of you would move, and what kind of relationship is on offer. On DA8N those are stated fields rather than conversational landmines, which means the week you would have spent circling them is simply yours.",
        bullets: [
          "Intention stated on the profile from the first day",
          "Ready as a state you turn on when you have the attention for dating",
          "Where you live, where you are from and where you are open to meeting as separate fields",
        ],
      },
      {
        heading: "Verification matters more, not less",
        body:
          "People dating in their forties are more likely to be targeted by someone looking for money rather than a relationship, and more likely to have something worth targeting. RealMe is mandatory before anyone can message you — government ID, liveness selfie and verification video, checked together. Safety Profiles state what has been checked and what has not; an uncompleted check is reported as uncompleted rather than dressed up as a pass.",
      },
      {
        heading: "Coming back after a long relationship",
        body:
          "If the last time you dated there were no apps, the main shock is volume and the main risk is treating it as a numbers exercise. The guides are written for exactly this: how to put a profile together that sounds like you, what to ask on a first date, and how to end one honestly. None of it requires you to perform a version of yourself from fifteen years ago.",
      },
      {
        heading: "Meeting safely, as a matter of logistics",
        body:
          "Date Check-in shares your plan and your own route home with someone you trust in one step, which is a practical measure rather than a statement about how dangerous dating is. Blocking takes effect immediately and does not wait for a review; every report is read by a person. Safety features reduce risk. They do not remove it, and we will not tell you they do.",
      },
    ],
    faqs: [
      {
        question: "Are there people my age on DA8N?",
        answer:
          "We do not publish member counts or demographic breakdowns for any market, because an unverifiable number is worse than no number. What this page describes is how the product works for someone dating in their forties. Each market page states plainly whether DA8N is open there.",
      },
      {
        question: "Can I say I have children, or that I do not want more?",
        answer:
          "Yes. This is exactly the kind of context that is better stated than discovered, and it is one of the dimensions an introduction can be explained by.",
      },
      {
        question: "I have not dated in fifteen years. Where do I start?",
        answer:
          "With a profile that sounds like you rather than like a listing, and one clear statement of what you are looking for. The guides on profiles and first dates cover the rest, and Ready lets you take yourself out of circulation whenever you need to without losing anything.",
      },
      {
        question: "How do I avoid someone who is after money?",
        answer:
          "Verification makes identity fraud much harder and platform monitoring looks for the message patterns financial fraud actually uses. The rule that does most of the work is still yours: never send money to someone you have not met, however convincing the reason.",
      },
    ],
    alsoRead: [
      { label: "Recognise romance scam patterns", href: "/guides/recognise-romance-scam-patterns" },
      { label: "How to have a better first date", href: "/guides/better-first-date" },
      { label: "Safety at DA8N", href: "/safety" },
    ],
    publishedAt: PUBLISHED,
    reviewedAt: PUBLISHED,
  },

  "dating-over-50": {
    kicker: "LIFE STAGE",
    title: "Dating over 50",
    h1: "Dating over 50, with identity checked first.",
    description:
      "Dating in your fifties and beyond: mandatory identity verification, honest safety profiles, and intention stated before the first message.",
    intro:
      "Two things are true about dating over fifty. It is a perfectly ordinary thing that a great many people are doing, and it is the cohort romance fraud operations target most deliberately. A product that is serious about this audience has to take the second fact seriously without insulting the first, which mostly means checking identity properly and then getting out of the way.",
    sections: [
      {
        heading: "Why identity verification is the first thing on this page",
        body:
          "Romance fraud concentrates on people over fifty, and it works through a fabricated identity sustained over weeks. RealMe attacks that at the root: a government ID, a liveness selfie and a verification video are checked together, and verification is required before anyone can message you rather than offered as a badge some members have. The person in the conversation is the person in the photographs. That is the specific claim, and it is the one worth making.",
      },
      {
        heading: "Safety Profiles that say what has not been checked",
        body:
          "A Safety Profile shows what has been verified. Just as importantly, it shows what has not — because a missing check presented as a clean result is worse than no check at all. Background check availability depends on the market, on the provider and always on consent, so a profile in one country may carry a check that is simply not offered in another. Where it has not been completed, it says so.",
        bullets: [
          "Identity verification required before anyone can message you",
          "An uncompleted check reported as uncompleted, never implied as a pass",
          "Platform monitoring for the message patterns financial fraud actually uses",
          "Every report read by a person; blocking effective immediately",
        ],
      },
      {
        heading: "Companionship, marriage, or neither, stated plainly",
        body:
          "What you are looking for after fifty varies enormously and is nobody's business to assume. Companionship, a serious relationship, marriage, or working out what you want after a long time not thinking about it — all of these are statable, and stating one saves the conversation where two people turn out to have meant different things by the same word.",
      },
      {
        heading: "The one rule no product can enforce for you",
        body:
          "Never send money to someone you have not met in person. Not for a flight, not for a medical emergency, not for a customs fee, not as a loan to be repaid when the contract clears. Every variation of this story is a script, and the scripts are good. The guide on recognising romance scam patterns sets out what they look like and what to do if money has already changed hands.",
      },
    ],
    faqs: [
      {
        question: "Is DA8N busy in my area?",
        answer:
          "We publish no member counts or local activity claims for any market, because we will not put a number in front of you that you cannot check. Each market page states plainly whether the product is open there, and each city page is an entry point rather than a claim about volume.",
      },
      {
        question: "How do I know the person I am talking to is real?",
        answer:
          "Verification is mandatory before messaging: government ID, a liveness selfie and a verification video, checked together. That confirms identity. It is not a judgement about character, and no verification system can be.",
      },
      {
        question: "What should I do if someone asks me for money?",
        answer:
          "Stop, do not send it, and report the conversation. Blocking takes effect immediately. If money or bank details have already been shared, contact your bank or payment provider straight away — that is more urgent than the report.",
      },
      {
        question: "Can I take a break without deleting my account?",
        answer:
          "Yes. Turning Ready off removes you from circulation and is fully reversible. Deleting your account is a separate and permanent action taken in the app.",
      },
    ],
    alsoRead: [
      { label: "Recognise romance scam patterns", href: "/guides/recognise-romance-scam-patterns" },
      { label: "RealMe verification", href: "/realme" },
      { label: "Safety at DA8N", href: "/safety" },
    ],
    publishedAt: PUBLISHED,
    reviewedAt: PUBLISHED,
  },

  "senior-dating": {
    kicker: "LIFE STAGE",
    title: "Senior dating",
    h1: "Senior dating, built around verified identity.",
    description:
      "Senior dating with mandatory identity verification, plain safety information and a profile that states what you are looking for.",
    intro:
      "Senior dating gets written about either as a novelty or as a warning, and it is neither. It is a large number of adults looking for companionship or a relationship, in a context where two things genuinely matter more than they did at twenty-five: knowing who you are actually talking to, and not having to decode what anyone meant.",
    sections: [
      {
        heading: "Identity first, because it is the load-bearing part",
        body:
          "RealMe verification is required before anyone can message you. A government ID, a liveness selfie and a verification video are checked together, which means a fabricated identity cannot get as far as your inbox. This is the single most useful thing a dating product can do for an older member, and it is the reason it is mandatory here rather than an optional badge.",
      },
      {
        heading: "Companionship is a complete answer",
        body:
          "Not everyone dating later in life is looking for marriage, and not everyone is looking for something casual. Companionship — someone to share time with, without either person reorganising their life around it — is a legitimate intention and one you can state. Saying it plainly prevents the common and dispiriting situation where two people spend a month at cross purposes because neither wanted to ask.",
      },
      {
        heading: "Fraud, and what the platform does about it",
        body:
          "Older adults are targeted deliberately by romance fraud, and the approach is always the same: a sustained fictional identity, then a reason to send money. Verification removes the first part. Monitoring looks for the message patterns the second part uses. Every report is read by a person and blocking takes effect immediately. The rule that remains yours is simple and absolute: never send money to someone you have not met.",
        bullets: [
          "Verification required before messaging, not offered as a badge",
          "A Safety Profile states what has not been checked as well as what has",
          "Reports reviewed by a person; blocking immediate and not subject to review",
          "A written guide on the patterns fraud uses, with sources",
        ],
      },
      {
        heading: "Meeting someone, practically",
        body:
          "Choose somewhere public and easy for both of you to reach, arrange your own way home, and tell someone where you are going. Date Check-in does all three in one step. None of this is a statement about how dangerous dating is; it is the same sensible preparation you would make for any meeting with someone new, done once rather than improvised.",
      },
    ],
    faqs: [
      {
        question: "How many older members are on DA8N?",
        answer:
          "We do not publish member counts, for any cohort or any market. A number you cannot verify is not information. This page describes how the product works; the market pages state plainly where DA8N is open.",
      },
      {
        question: "Is the app difficult to use?",
        answer:
          "Verification takes about four minutes and the rest is a profile and conversations. Joining is free, and membership tiers — which change what you can see and control, not where you rank — are shown in the app where pricing depends on your market.",
      },
      {
        question: "What if someone asks me to move the conversation off the app?",
        answer:
          "Treat it as a signal worth noticing, particularly if it comes early and comes with a reason. Monitoring and reporting only work where the conversation is, and the usual purpose of moving it is to get away from both.",
      },
      {
        question: "Can I share my plans with family before a date?",
        answer:
          "Yes, and Date Check-in is built for it: your plan and your own route home, shared with someone you trust, in one step rather than by hand.",
      },
    ],
    alsoRead: [
      { label: "Recognise romance scam patterns", href: "/guides/recognise-romance-scam-patterns" },
      { label: "How to have a better first date", href: "/guides/better-first-date" },
      { label: "RealMe verification", href: "/realme" },
    ],
    publishedAt: PUBLISHED,
    reviewedAt: PUBLISHED,
  },

  /* ------------------------------------------------- distance and corridors */

  "long-distance": {
    kicker: "DISTANCE",
    title: "Long-distance relationships",
    h1: "Long distance, treated as normal rather than as a problem.",
    description:
      "How DA8N handles distance: separate fields for where you live, where you are from and where you are open to meeting, plus practical guidance.",
    intro:
      "Nearly every dating product treats distance as an error to be minimised. For a great many people it is simply the shape of their life — work moved, family is elsewhere, the person who fits is two time zones away. DA8N is built on the assumption that distance is a parameter you set rather than a problem the app solves by hiding anyone far away.",
    sections: [
      {
        heading: "Three fields that do three different jobs",
        body:
          "Where you live, where you are from, and where you are open to meeting are not the same question, and collapsing them into one location field is what breaks long-distance dating on most apps. Keeping them separate is what makes a corridor workable: you can be in Toronto, from Lagos, and open to meeting in London, and all three of those facts can be true on your profile without any of them being a lie.",
        bullets: [
          "Where you live — your actual city, shown to other members as a city and never as coordinates",
          "Where you are from — context that matters to a great many people and is invisible on most apps",
          "Where you are open to meeting — one or several places, set by you",
        ],
      },
      {
        heading: "Verification does more work at a distance",
        body:
          "The further apart two people are, the longer a fiction can survive. RealMe is mandatory before anyone can message you — government ID, liveness selfie and verification video, checked together — which collapses the window in which someone can be a different person entirely. It is a check about identity, not a character reference, and at distance that distinction is worth keeping clear in your own mind.",
      },
      {
        heading: "The practical questions, early",
        body:
          "Long-distance works or fails on logistics rather than on feeling: how often you will actually see each other, who travels, who would eventually move, what the visa position is, and how long the distance phase is expected to last. These are better asked in month one than in year two. The guide on dating someone in another city covers them in the order they actually come up.",
      },
      {
        heading: "What never to do at distance",
        body:
          "Do not send money to someone you have not met in person. This is the single rule that would prevent most of the harm in long-distance dating, and distance is precisely the condition every variation of the script depends on. The guide on recognising romance scam patterns sets out the patterns, with sources, and what to do if money has already gone.",
      },
    ],
    faqs: [
      {
        question: "Will DA8N show me people far away by default?",
        answer:
          "It shows you what you have set. Most people keep a local radius and add one or two places that matter to them, and see both. Distance is a preference rather than a mode you have to switch into.",
      },
      {
        question: "Do other members see exactly where I am?",
        answer:
          "No. Other members see your city, never your precise location. That is set out in the privacy notice along with everything else that is and is not shown.",
      },
      {
        question: "How soon should we talk about who would move?",
        answer:
          "Sooner than feels comfortable. It is the question that decides whether the relationship has a shape, and discovering the answer late is how long-distance relationships end badly rather than merely sadly.",
      },
      {
        question: "Is a video call before meeting worth it?",
        answer:
          "Yes, and it is worth doing early. Verification confirms identity; a conversation on video tells you how someone actually is, which is a different and equally necessary thing.",
      },
    ],
    alsoRead: [
      { label: "Dating someone in another city", href: "/guides/dating-someone-in-another-city" },
      { label: "Recognise romance scam patterns", href: "/guides/recognise-romance-scam-patterns" },
      { label: "How DA8N works", href: "/how-it-works" },
    ],
    publishedAt: PUBLISHED,
    reviewedAt: PUBLISHED,
  },

  "international-dating": {
    kicker: "INTENTION",
    title: "International dating",
    h1: "International dating, with the hard questions on the profile.",
    description:
      "One verified network across every market DA8N has opened, with relocation, family and intention stated before anyone invests a year.",
    intro:
      "International dating has a reputation problem it mostly earned, because the category has historically been built around people in one country paying to write to people in another. DA8N is not that. It is one network with a front door in each market it has opened, where members join on the same terms wherever they are and nobody is a product being introduced to anybody.",
    sections: [
      {
        heading: "One network, not an introduction service",
        body:
          "Everyone on DA8N joined the same way, verified the same way and sees the same thing. There is no tier of members who are written to and another tier who write, no per-message charge and no translation of a relationship into a transaction. Membership changes what you can see and control; it does not rank you above anyone and it does not buy access to a person.",
      },
      {
        heading: "Relocation, visas and the questions that decide it",
        body:
          "Cross-border dating runs into practical constraints that no amount of compatibility resolves: who would move, whether they legally can, how long the distance phase lasts, and what both families expect. Putting intention, origin and openness to meeting on the profile means these are answerable in week one. It is far better to find out early that neither of you would ever move than to find out after two years.",
      },
      {
        heading: "Verification, and the specific fraud this category attracts",
        body:
          "International dating is the natural habitat of romance fraud, because distance is what makes a sustained fiction possible. RealMe is required before anyone can message you: government ID, a liveness selfie and a verification video, checked together. Monitoring looks for the message patterns fraud actually uses, every report is read by a person, and blocking is immediate. The absolute rule remains yours — never send money to someone you have not met.",
        bullets: [
          "Identity verification required before messaging, for every member in every market",
          "No per-message charges and no paid introductions to anybody",
          "Safety Profiles that state what has not been checked as well as what has",
          "Reports reviewed by a person rather than closed by a rule",
        ],
      },
      {
        heading: "Where DA8N is actually open",
        body:
          "DA8N opens market by market and says so. Each market page states plainly whether the product is open there yet rather than implying availability by having a page at all, and the city pages underneath are entry points rather than claims about how busy anywhere is. If it is not open where you are, the page says that.",
      },
    ],
    faqs: [
      {
        question: "Do I pay per message or per introduction?",
        answer:
          "No. There are no per-message charges and no paid introductions. Membership tiers change what you can see and control; pricing is per-market and shown in the app rather than here.",
      },
      {
        question: "Which countries can I meet people in?",
        answer:
          "The markets DA8N has opened, each of which has a page stating plainly whether the product is open there. One profile is visible across all of them — you join once rather than per country.",
      },
      {
        question: "How is this different from a mail-order introduction site?",
        answer:
          "Everyone here is a member on identical terms: same verification, same visibility, same ability to initiate. Nobody is listed for anybody and nobody is paid for. That is a structural difference rather than a matter of tone.",
      },
      {
        question: "What is the biggest risk in international dating?",
        answer:
          "Financial fraud, by a wide margin, and it depends entirely on distance. Never send money to someone you have not met in person, regardless of how long you have been talking or how good the reason sounds.",
      },
    ],
    alsoRead: [
      { label: "Dating someone in another city", href: "/guides/dating-someone-in-another-city" },
      { label: "Recognise romance scam patterns", href: "/guides/recognise-romance-scam-patterns" },
      { label: "Markets DA8N has opened", href: "/markets" },
    ],
    publishedAt: PUBLISHED,
    reviewedAt: PUBLISHED,
  },
};

export function audiencePagePath(slug: string): string {
  return `/audiences/${slug}`;
}

/**
 * Market links for an audience, derived from the catalog.
 *
 * Derived rather than hand-listed for the same reason the footer's city column
 * is: a hand-listed link can point at a market that was never opened or has
 * since been withdrawn, and nobody re-reads a related-links block. Markets
 * absent from the catalog are dropped silently, which is the correct failure —
 * a missing link beats a 404.
 */
function marketLinks(audience: Audience): readonly SeoLink[] {
  return audience.countryCodes.flatMap((code) => {
    const market = findMarket(code);
    if (!market) return [];
    return [
      {
        label: `Dating in ${marketInProse(market)}`,
        href: marketPath(market.countryCode),
      },
    ];
  });
}

/**
 * Assemble the full `SeoPage` for one audience.
 *
 * Returns undefined when the slug is not in `AUDIENCES` — so the route 404s on
 * an unknown audience rather than rendering a shell — and also when the
 * catalog has an audience with no copy written for it, which is the case this
 * design is most likely to hit next. An audience without copy has no page;
 * `audience-pages.test.ts` fails the build if the two ever diverge, so the
 * failure is caught in CI rather than by a visitor.
 */
export function audienceSeoPage(slug: string): SeoPage | undefined {
  const audience = findAudience(slug);
  if (!audience) return undefined;
  const copy = COPY[audience.slug];
  if (!copy) return undefined;

  return {
    slug: audience.slug,
    kicker: copy.kicker,
    title: copy.title,
    h1: copy.h1,
    description: copy.description,
    intro: copy.intro,
    sections: copy.sections,
    faqs: copy.faqs,
    related: [...copy.alsoRead, ...marketLinks(audience)],
    cta: { label: "Join da8n for free", href: "/sign-up" },
    indexability: "indexable",
    structuredData: ["WebPage", "BreadcrumbList", "FAQPage"],
    locale: "en",
    publishedAt: copy.publishedAt,
    reviewedAt: copy.reviewedAt,
  };
}

/** Every audience that has copy written. Drives `generateStaticParams`. */
export function audiencePages(): readonly SeoPage[] {
  return AUDIENCES.flatMap((audience) => {
    const page = audienceSeoPage(audience.slug);
    return page ? [page] : [];
  });
}
