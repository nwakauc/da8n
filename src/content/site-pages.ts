/**
 * Copy for the standalone product and company routes.
 *
 * Same reason as `landing.ts` and `route-copy.ts`: every visible string in one
 * reviewable place, assertable by `site-pages.test.ts`, and localisable later
 * as a data swap rather than a component rewrite.
 *
 * ---------------------------------------------------------------------------
 * WHAT THESE PAGES MAY SAY
 *
 * These describe a product that exists. RealMe verification, For You, Ready,
 * Safety Profiles, reporting with human review and Date Check-in are shipped,
 * so they are described in the present tense without hedging.
 *
 * Still forbidden, and these are the rules that do not bend:
 *
 *   NO MEMBER COUNTS, no "N people near you", no local activity claims, no
 *   marriage or outcome statistics. If a real figure is ever published it
 *   needs a dated source and its own decision.
 *
 *   NO PRICES. Pricing is per-market and lives in the member application.
 *
 *   NO SAFETY GUARANTEE. "Verified" is a statement about a check that ran.
 *   "Safe" is a promise about a person that no platform can keep. Every line
 *   in `SAFETY_PAGE` is written to the first standard, and `site-pages.test.ts`
 *   fails the build on the second.
 * ---------------------------------------------------------------------------
 */

export type Section = {
  readonly heading: string;
  /** Anchor id, where another page links to this section directly. */
  readonly id?: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
};

/* ------------------------------------------------------------------ RealMe */

export const REALME_PAGE = {
  kicker: "REALME",
  title: "Know who you are talking to.",
  lede:
    "RealMe is DA8N's identity check. It confirms that a profile belongs to one real person who matches their photos — before they can message anyone.",
  sections: [
    {
      heading: "What the check actually does",
      paragraphs: [
        "Three things are compared against each other: a government ID document, a live selfie taken in the moment, and the photos on the profile. The ID establishes that the person exists and how old they are. The live selfie establishes that someone is physically present rather than uploading a saved image. The comparison establishes that all three are the same person.",
        "It takes about four minutes. Until it passes, an account cannot send a first message — which is the part that matters, because it moves verification from something you hope about a stranger to something that already happened before they reached you.",
      ],
      bullets: [
        "Government ID — the person exists, and is over 18",
        "Live selfie — someone is present, not replaying a photo",
        "Photo match — the profile is the same person",
      ],
    },
    {
      heading: "What is shown, and what is never shown",
      id: "what-is-shown",
      paragraphs: [
        "Other members see an outcome: a RealMe seal, and on the Safety Profile the fact that identity, liveness and age were confirmed. That is the whole of it.",
        "They never see your identity document, your date of birth, your legal name if it differs from your profile name, the selfie you took, or anything about the device you used. A verification outcome is a fact other people need in order to decide. The evidence behind it is yours.",
      ],
    },
    {
      heading: "What verification does not promise",
      paragraphs: [
        "RealMe confirms identity. It does not predict behaviour, and nobody should read a seal as a character reference. A verified person can still be rude, dishonest about their intentions, or someone you do not want to meet twice.",
        "That is why verification is one layer rather than the answer: fraud detection watches the conversation, reporting is reviewed by a person, the Safety Profile shows account standing as well as identity, and Date Check-in exists for the moment you actually meet. Meet in public, tell someone where you are going, and keep your own way home.",
      ],
    },
    {
      heading: "One person, one profile",
      paragraphs: [
        "Because the check is tied to a real identity document, the same person cannot quietly run several profiles. When an account is removed for a serious safety reason, it cannot simply be rebuilt under a new name and a new photo — which is the loophole that makes reporting feel pointless on platforms that only verify an email address.",
      ],
    },
  ] satisfies readonly Section[],
} as const;

/* ------------------------------------------------------------------ Safety */

export const SAFETY_PAGE = {
  kicker: "SAFETY CENTRE",
  title: "How safety works here.",
  lede:
    "Identity checks, fraud detection in chat, reporting a person reviews, and a plan for the night you actually meet. What each one does, and what it does not.",
  sections: [
    {
      heading: "Identity: RealMe",
      id: "realme",
      paragraphs: [
        "Every member verifies with a government ID and a live selfie before they can send a first message, and the two are matched against the profile photos. It takes about four minutes.",
        "Members see the outcome, never the evidence — no documents, no date of birth, no selfie. The full explanation is on the RealMe page.",
      ],
    },
    {
      heading: "Fraud detection in chat",
      id: "fraud",
      paragraphs: [
        "Money requests, pressure to move off the platform, and scripted opening messages are flagged in the conversation where they happen, and reviewed by the safety team. When a message matches a known scam pattern you see a warning on it, with the option to report in one tap.",
        "No automated system catches everything, and a warning is a prompt to slow down rather than a verdict. The guide on romance-scam patterns is the one piece of reading on this site that is worth doing before you need it.",
      ],
      bullets: [
        "Never send money, gift cards, crypto or account access to someone you met online",
        "Stay in the app while trust is forming — that is where detection and reporting work",
        "Have a live video call before you plan travel",
        "Keep screenshots, usernames and payment requests if something goes wrong",
      ],
    },
    {
      heading: "Reporting, and the person who reads it",
      id: "reporting",
      paragraphs: [
        "You can block instantly and report in one tap, at any point, without having to explain yourself first. A person reviews every report. Your identity is not shown to the person you reported, and blocking takes effect immediately rather than when a review finishes.",
        "Reports are how a pattern across several people becomes visible. Reporting matters even when you have already blocked someone and moved on.",
      ],
    },
    {
      heading: "The Safety Profile and Trust Score",
      id: "safety-profile",
      paragraphs: [
        "Every member has a Safety Profile. It brings verified identity, account standing and profile-integrity checks into one place so trust is part of the decision rather than a guess from photographs.",
        "The Trust Score is shown as a band — Strong, and so on — and never as a number. A number invites people to reverse-engineer the model and reads as a verdict on a person, and a band is all anyone actually needs in order to decide.",
        "A Safety Profile never shows private documents, report history, who filed a report, moderation notes, or device and location data. Statements like “no confirmed serious safety violations” describe a record. They are not a promise about a person.",
      ],
    },
    {
      heading: "Background checks",
      id: "background-checks",
      paragraphs: [
        "Background checks are optional and consent-based. Nothing runs until the member agrees to it, and a member is told before any check begins.",
        "Availability depends on where you are: checks are provider-bound and legal in different ways market by market, so a check that is available in one country may not be offered in another. Where a check has not been completed, the Safety Profile says exactly that rather than implying a clean result.",
        "Requesting one happens inside the app, where the consent is captured and recorded.",
      ],
    },
    {
      heading: "Date Check-in",
      id: "date-check-in",
      paragraphs: [
        "Opt in when you are meeting someone. Share the plan — who, where, when — with people you trust, set a time to check in, and choose what happens if you do not reply.",
        "Location is shared only during the date, and only with the people you chose. It is deleted afterwards. The feature is opt-in per date, not a setting that quietly leaves tracking on.",
      ],
    },
    {
      heading: "Before you meet in person",
      id: "meeting",
      paragraphs: [
        "Verification changes who is on the other end of the conversation. It does not change the sensible things to do the first time you meet anyone.",
      ],
      bullets: [
        "Meet in a public, well-lit place that is easy for both of you to reach",
        "Tell someone you trust where you are going and when you expect to be back",
        "Arrange your own transport, both ways",
        "Keep your drink and your phone with you",
        "Leave whenever you want to, and without explaining why",
      ],
    },
  ] satisfies readonly Section[],
} as const;

/* ------------------------------------------------------------ How it works */

export const HOW_PAGE = {
  kicker: "HOW IT WORKS",
  title: "Tell us what you want. We'll take it from there.",
  lede:
    "Four steps to a profile that finds the right people, and the two features that make DA8N different once you are in.",
  sections: [
    {
      heading: "1. Create your profile",
      paragraphs: [
        "Photos and a few words about you. The strongest profiles are specific rather than impressive — a detail someone can reply to beats a list of adjectives. There is a guide on exactly this.",
      ],
    },
    {
      heading: "2. Set your intentions",
      paragraphs: [
        "Dating, love, a relationship or marriage — set on day one, as a field rather than a hint buried in a bio, so nobody has to guess and nobody wastes a month finding out.",
        "You also set three separate places: where you live, where you are from, and where you are open to meeting. They are different things, and treating them as one is why most apps cannot help someone whose life spans two countries.",
      ],
    },
    {
      heading: "3. Get RealMe verified",
      paragraphs: [
        "A government ID and a live selfie, matched against your photos. About four minutes, and nobody can message you until it is done — including you. Everyone you talk to has been through the same check.",
      ],
    },
    {
      heading: "4. Turn on Ready",
      id: "ready",
      paragraphs: [
        "Ready is how you say you are genuinely open to meeting someone right now, rather than browsing. It lasts seven days and then switches itself off unless you turn it on again.",
        "The expiry is the point. A permanent “looking for something serious” flag drifts out of date the moment life gets busy; a seven-day one is only ever on because someone actively said so this week.",
      ],
    },
    {
      heading: "For You",
      id: "for-you",
      paragraphs: [
        "Introductions are picked for compatibility and shown with the reasons attached — both want a serious relationship, similar family values, both open to distance — and with the dimensions where you do not already agree shown as open questions rather than hidden.",
        "There is no percentage and no ranking by who paid. A score implies a precision the model does not have, and it invites people to read a number as a verdict on a person.",
      ],
    },
    {
      heading: "Sending an introduction",
      paragraphs: [
        "You do not have to match before you can talk. Send an introduction: a short note saying why you would like to meet. If they are interested too, the conversation opens.",
      ],
    },
  ] satisfies readonly Section[],
} as const;

/* ------------------------------------------------------------------- About */

export const ABOUT_PAGE = {
  kicker: "ABOUT",
  title: "One network, many front doors.",
  lede:
    "DA8N is a dating product for people who actually want to meet — verified, clear about intention, and built for lives that cross borders.",
  sections: [
    {
      heading: "What DA8N is",
      paragraphs: [
        "DA8N is one global network with localized entry points, not a set of country-specific apps and not a second dating product. A member joins one account. The city pages, market pages and guides are the front doors; behind all of them is the same network and the same people.",
        "The name is pronounced “dating”. That is the joke, and it is also the reason the pronunciation is written next to the logo on every page.",
      ],
    },
    {
      heading: "Why it exists",
      paragraphs: [
        "Most dating products optimise for how long you stay. That produces an interface built around volume: endless profiles, hidden intentions, and reach you can buy. It works commercially and it wastes people's time.",
        "DA8N is built on the opposite assumption — that the goal is to leave. Identity is verified before anyone can message you. Intentions are a field, not a guess. Introductions come with their reasons shown. Ready expires, because a stale signal is worse than no signal.",
      ],
    },
    {
      heading: "Built for distance",
      paragraphs: [
        "Where you live, where you are from and where you would meet someone are three different things, and for anyone with family in one country and a life in another they are rarely the same. DA8N treats them as three separate fields, which is what makes “Melbourne to London” a corridor rather than an obstacle.",
      ],
    },
    {
      heading: "Powered by D8N",
      paragraphs: [
        "DA8N runs on D8N, the platform behind the group's dating products. RealMe verification, the Trust Score and the safety review process are D8N's, which is why the same identity and safety standard applies across every brand on it rather than being rebuilt per product.",
      ],
    },
  ] satisfies readonly Section[],
} as const;

/* -------------------------------------------------------------------- Help */

export const HELP_PAGE = {
  kicker: "HELP",
  title: "Need a hand?",
  lede: "Where to go for account questions, safety concerns and everything in between.",
  sections: [
    {
      heading: "Safety concerns",
      paragraphs: [
        "If something has happened in a conversation — a money request, pressure, threats, or a profile that is not who it says it is — report it from inside the app. Block first, report second; blocking takes effect immediately. A person reviews every report.",
        "If you are in immediate danger, contact your local emergency services first. If money or identity details were shared, contact your bank or payment provider straight away.",
      ],
    },
    {
      heading: "Account and membership",
      paragraphs: [
        "Signing in, your profile, verification status and your membership all live in the app. Plans and prices are shown there because they depend on your market.",
      ],
    },
    {
      heading: "Deleting your account",
      paragraphs: [
        "You can delete your account from the app at any time. Deletion removes your profile from the network; it is not the same as turning Ready off or hiding your profile, both of which are reversible.",
      ],
    },
    {
      heading: "Data and privacy",
      paragraphs: [
        "What is collected, how long it is kept and what is never shown to other members is set out in the privacy policy. The short version for the part people ask about most: other members see your city, never your exact location.",
      ],
    },
  ] satisfies readonly Section[],
} as const;

/* ------------------------------------------------------------------ Compare */

export const COMPARE_PAGE = {
  kicker: "COMPARE",
  title: "How DA8N is different.",
  lede:
    "Compared by category rather than feature-by-feature, because a feature table about someone else's product goes stale the week after it is written.",
  /**
   * NOMINATIVE USE ONLY. Competitors are named to identify them and nothing
   * else. No feature claim is made about any of them here, and none can be
   * until `competitors.ts` carries a `factsVerifiedAt` date — today not one
   * record does, which is exactly why this page compares approaches rather
   * than products. No Review or AggregateRating markup, ever: DA8N publishes
   * no ratings, and rating someone else's product in schema is a fabricated
   * claim about a third party.
   */
  disclaimer:
    "Product names are used to identify the products they belong to. DA8N is not affiliated with, endorsed by or official to any of them.",
  sections: [
    {
      heading: "Swipe-first apps",
      paragraphs: [
        "Built around volume and speed. They are good at showing you a lot of people quickly, which is genuinely useful if you want exactly that. The cost is that intention is invisible until you ask, and identity usually is not checked at all.",
        "DA8N makes both explicit before a first message: verification is mandatory, and intention is a field everyone fills in.",
      ],
    },
    {
      heading: "Intent-first apps",
      paragraphs: [
        "Closer to DA8N in philosophy — prompts, slower pacing, an emphasis on what someone is actually like. The gap is identity and distance: an unverified thoughtful profile is still unverified, and most of these products assume both people are in one city.",
      ],
    },
    {
      heading: "Subscription matchmaking",
      paragraphs: [
        "Long questionnaires and an algorithm behind a paywall. The usual complaint is that it is impossible to tell what the matching is doing or why a given person was suggested.",
        "DA8N shows the reasons on every introduction, including the dimensions where two people do not already agree, and does not rank anyone by what they paid.",
      ],
    },
    {
      heading: "Community-specific apps",
      paragraphs: [
        "Strong where they are strong, and often thin everywhere else — which matters most for diaspora dating, where the people you want to meet are split across several countries.",
        "DA8N is one network with localized entry points, so a corridor like Lagos to Manchester is the normal case rather than the edge one.",
      ],
    },
  ] satisfies readonly Section[],
} as const;
