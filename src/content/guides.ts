/**
 * DA8N guides — the EDITORIAL axis of the site.
 *
 * Four of these were written for Date9ja and are ported here: the advice is
 * about dating, not about a brand, and splitting one body of guidance across
 * two hosts would have left both thin. What changed in the port is scope — the
 * Date9ja originals are written for Nigerian and Nigerian-diaspora readers,
 * and DA8N is one global network, so the examples keep their specificity while
 * the framing stops assuming every reader shares one background.
 *
 * `dating-someone-in-another-city` is new. The v4 design asks for it, nothing
 * equivalent existed on Date9ja, and it is the guide this product most needs:
 * distance is the thing DA8N is for, and "how do we actually do this" is the
 * question every cross-border match asks in week three.
 *
 * ---------------------------------------------------------------------------
 * RULES FOR THIS FILE
 *
 *   EVERY FACTUAL SAFETY CLAIM CARRIES A SOURCE. `sources` is rendered at the
 *   foot of each guide and it is not decoration — the scam guide tells people
 *   what to do about financial fraud, and advice like that is only worth
 *   publishing if a reader can check it.
 *
 *   NO MEMBER COUNTS, no local activity claims, no outcome statistics. Same
 *   rule as every other route; see `content/route-copy.ts`.
 *
 *   `reviewedAt` gates indexing. A guide that has not been checked inside the
 *   staleness window in `lib/indexability.ts` drops out of the sitemap rather
 *   than rotting in place.
 * ---------------------------------------------------------------------------
 */

export type GuideSection = {
  readonly heading: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
};

export type Guide = {
  readonly slug: string;
  readonly kicker: string;
  readonly title: string;
  readonly description: string;
  readonly intro: string;
  readonly sections: readonly GuideSection[];
  /** Where the claims come from. Rendered; `rel="nofollow"` on external links. */
  readonly sources: readonly { readonly label: string; readonly href: string }[];
  /** ISO date the guide was last checked. Feeds the indexability gate. */
  readonly reviewedAt: string;
};

export const GUIDES: readonly Guide[] = [
  {
    slug: "better-first-date",
    kicker: "FIRST DATES",
    title: "How to have a better first date",
    description:
      "Where to go, what to ask and how to keep a first date honest, relaxed and safe.",
    intro:
      "A good first date is not an audition. It is a short, real chance to notice how conversation feels when two people have left the app. The best plan gives both people enough structure to relax, enough time to talk and an easy way to leave if the connection is not there.",
    sections: [
      {
        heading: "Choose a place that helps you talk",
        paragraphs: [
          "Pick a public, well-lit place that is easy for both people to reach: a café, restaurant, gallery, bookshop or daytime activity. For a first meeting, avoid making either person depend on the other for transport, and avoid going straight to a private home. A simple plan is considerate, not unromantic.",
          "Agree the meeting point, time and rough length before the day. Share the plan with someone you trust and arrange your own way home — Date Check-in does both in one step if you would rather not do it by hand. If either person wants to change the venue, check that the new place still feels comfortable to both of you.",
        ],
      },
      {
        heading: "Ask questions that open a door",
        paragraphs: [
          "Skip the interview rhythm of question, answer, question, answer. Offer a little of yourself, then ask something open enough to invite a story. Listen for curiosity, kindness and whether the person can disagree without turning the conversation into a contest.",
        ],
        bullets: [
          "What has been giving you energy lately?",
          "What does a peaceful weekend look like for you?",
          "What are you hoping dating becomes this year?",
          "What role do family, faith or community play in your life?",
          "What is something you have changed your mind about?",
          "What would make a relationship feel supportive to you?",
        ],
      },
      {
        heading: "Talk about intention without making it heavy",
        paragraphs: [
          "You do not need to plan a wedding on date one. You do need to be honest about the kind of connection you are open to. Saying that you are dating for a serious relationship, marriage, companionship or to work out what you want is kinder than performing a certainty you do not feel.",
          "If you met across cities or countries, ask the practical questions early but gently: where each of you expects to live, how you think about distance, and how involved family is likely to be. The goal is context, not a test.",
        ],
      },
      {
        heading: "Notice how the date ends",
        paragraphs: [
          "A good date can end with interest, uncertainty or a clear no. All three are useful. Thank the person, say what you genuinely enjoyed, and do not promise a second date just to avoid an awkward moment. If you want to meet again, suggest a simple next step. If you do not, be brief and respectful.",
        ],
      },
    ],
    sources: [
      {
        label: "CDC Dating Matters: communication and listening",
        href: "https://vetoviolence.cdc.gov/apps/datingmatters/training/assets/files/DM_Tips_508.pdf",
      },
      { label: "How DA8N handles safety", href: "/safety" },
    ],
    reviewedAt: "2026-10-05",
  },

  {
    slug: "profile-people-remember",
    kicker: "PROFILES",
    title: "Build a profile people remember",
    description:
      "Choose photos and words that communicate intention without sounding stiff or trying too hard.",
    intro:
      "Your profile is not a CV and it is not a brand campaign. It is an invitation into a real conversation. The strongest profiles make it easy for the right person to recognise your life, your warmth and what you are ready for.",
    sections: [
      {
        heading: "Start with photos that tell the truth",
        paragraphs: [
          "Use a recent, clear face photo first, then add a small range: one that shows your everyday style, one doing something you enjoy, one that gives a sense of your world. Natural light usually beats heavy filters. If every photo is a group shot, a logo, sunglasses or an old version of you, people have to guess before they can connect.",
          "Choose photos you would be comfortable explaining on a first date. Do not use someone else’s image, misleading edits, or pictures that show another person without their permission. RealMe checks that your photos are of you, so a profile that does not match is caught before anyone can message you.",
        ],
      },
      {
        heading: "Write like a person, not a checklist",
        paragraphs: [
          "Replace broad claims like “I love fun” with a detail someone can respond to: “I will cross the city for good suya and a playlist I can defend.” Specificity creates an opening. Keep the jokes, but let people see your values too.",
        ],
        bullets: [
          "One detail about your everyday life",
          "One thing you are curious about",
          "One quality you appreciate in a partner",
          "One sentence about what you are looking for",
          "One easy question someone can answer",
        ],
      },
      {
        heading: "Make your intention visible",
        paragraphs: [
          "If you are dating with marriage in mind, say so in your own voice. That is not a promise to a stranger. It helps people who want the same pace find you, and it gives people who want something different permission to move on. On DA8N your intention is a field, not a hint buried in a bio — which is the point.",
          "You can name the conversations that matter to you — faith, family, language, children, relocation, community — without turning your culture into a set of assumptions about every person who reads it.",
        ],
      },
      {
        heading: "Edit for warmth and clarity",
        paragraphs: [
          "Read your profile aloud once. Remove long disclaimers, bitterness about past dates, and demands that leave no room for a person to be human. Keep the boundaries that matter, but phrase them as what you value. “I like direct communication” invites more connection than a list of everything you refuse to tolerate.",
        ],
      },
    ],
    sources: [
      { label: "What RealMe verification checks", href: "/realme" },
      {
        label: "CDC Dating Matters: communication and listening",
        href: "https://vetoviolence.cdc.gov/apps/datingmatters/training/assets/files/DM_Tips_508.pdf",
      },
    ],
    reviewedAt: "2026-10-05",
  },

  {
    slug: "dating-someone-in-another-city",
    kicker: "DISTANCE",
    title: "Dating someone in another city",
    description:
      "How to make a long-distance match real: pacing, the first visit, money, family and the question you have to answer eventually.",
    intro:
      "Most advice about long distance assumes two people who already shared a city and then lost it. Meeting at distance is a different thing: there is no shared past to live on, so the relationship has to be built out of attention, honesty about logistics, and a plan you both actually agree to. That is harder than it sounds and more ordinary than it looks.",
    sections: [
      {
        heading: "Get on video early, then keep a rhythm",
        paragraphs: [
          "Have a live video call before you invest months. It is the fastest way to learn how someone actually talks, and it closes off the one gap every impostor depends on. On DA8N both people are RealMe verified before a first message, so you are not verifying whether they are real — you are finding out whether you like them.",
          "Then pick a rhythm you can keep on a bad week, not your best one. Two good calls a week beats a daily call that becomes an obligation. Say when you are busy instead of going quiet; at distance, silence gets read as meaning, and it usually means nothing.",
        ],
      },
      {
        heading: "Plan the first visit like adults",
        paragraphs: [
          "Decide early who travels, who pays for what, and where each person stays. Book your own accommodation for a first visit even if you expect not to use it — having your own door is not a statement about trust, it is a sensible default, and anyone worth visiting will understand that.",
          "Check the boring things before you book: visa requirements for your passport, how long the trip really takes door to door, and what it costs to change the dates. Tell someone you trust where you are going and when you land.",
        ],
        bullets: [
          "Agree the dates, the budget and the sleeping arrangements in writing",
          "Book refundable where you can for a first trip",
          "Keep your own return ticket and your own money",
          "Share the itinerary with a friend or family member",
          "Plan one ordinary day, not five days of highlights",
        ],
      },
      {
        heading: "Never send money",
        paragraphs: [
          "This is the one rule with no exceptions, and it is not about the person you are talking to — it is about the pattern. A request for money, a loan, gift cards, crypto, an investment, travel fees, medical bills or help with a frozen account is the single most reliable sign of a romance scam, and it almost always arrives wrapped in an emergency.",
          "Pay for your own ticket. Let them pay for theirs. If someone cannot visit without your money, the honest answer is that the visit is not possible yet, and a genuine person can hear that. See the romance-scam guide for what the full pattern looks like.",
        ],
      },
      {
        heading: "Answer the “where would we live” question out loud",
        paragraphs: [
          "Every distance relationship eventually resolves into one city, and the couples who do well are the ones who name that early instead of discovering at eighteen months that neither of them was ever going to move. You do not need the answer in month one. You need to know whether the other person has one in principle.",
          "Talk about what is actually fixed: a child in school, a parent being cared for, a licence that does not transfer, a visa that depends on a job. These are facts, not a lack of commitment, and they are much easier to plan around than to be disappointed by later.",
          "On DA8N this is a field rather than a conversation you have to start cold. Where you live, where you are from and where you are open to meeting are three separate things, and For You shows you where two people already agree — and where they do not.",
        ],
      },
      {
        heading: "Involve family at your pace, not theirs",
        paragraphs: [
          "Distance tends to compress the family question: a visit often means meeting everyone at once, because there will not be a casual second chance next Sunday. Decide together what the trip is before you arrive — a casual hello or a serious introduction — so one of you is not quietly in a different conversation.",
          "Agree what you will each say about marriage, children and relocation if you are asked, and agree a private signal for needing a break. Afterwards, talk as a couple about what felt welcoming and what did not. Family matters; the couple still needs boundaries and decisions of its own.",
        ],
      },
    ],
    sources: [
      { label: "Recognise romance-scam patterns", href: "/guides/recognise-romance-scam-patterns" },
      {
        label: "FTC: what romance scams look like and how to report them",
        href: "https://consumer.ftc.gov/articles/what-know-about-romance-scams?m=y",
      },
      { label: "How DA8N handles safety", href: "/safety" },
    ],
    reviewedAt: "2026-10-05",
  },

  {
    slug: "meeting-the-family-for-the-first-time",
    kicker: "FAMILY",
    title: "Meeting the family for the first time",
    description:
      "What to expect, what to ask and how to make a first meeting with a partner’s family feel respectful and relaxed.",
    intro:
      "Meeting a partner’s family can feel like a big step, especially when the relationship crosses generations, countries or cultures. There is no single script, but there are good ways to arrive prepared: ask your partner what the invitation means, show genuine respect, and let the family be themselves.",
    sections: [
      {
        heading: "Ask your partner what the invitation means",
        paragraphs: [
          "Before the visit, ask whether this is a casual hello, a special introduction, or a conversation about the future. Some families treat bringing someone home as a serious milestone; others are relaxed about it. Your partner can tell you who will be there, what to wear, how people greet elders, and whether gifts or food are customary.",
          "Do not walk in assuming every relative holds the same opinion. Ask your partner what support they need from you, and agree a private signal if either of you needs a break.",
        ],
      },
      {
        heading: "Questions people genuinely worry about",
        paragraphs: [
          "Will they like me? Should I greet every elder first? Should I bring a gift? What if I do not speak the language? Is this already a marriage conversation? These are good questions to ask your partner before you arrive — not questions to solve by guessing in the room.",
        ],
        bullets: [
          "Who is likely to be there, and how should I address them?",
          "Is there a faith, food or dress expectation I should know about?",
          "Should I bring something for the host or the family?",
          "What topics should we avoid for now?",
          "How will we handle questions about marriage, children or relocation?",
          "What does respect look like in your family — and what crosses a line?",
        ],
      },
      {
        heading: "Be warm, present and curious",
        paragraphs: [
          "Greet people properly, put your phone away, accept hospitality graciously, and ask about the family’s life. You do not need to perform an identity that is not yours. If you are learning a greeting or a phrase, make the effort and laugh at small mistakes without making the whole visit about them.",
          "Answer personal questions with honesty and a little privacy. “We are getting to know each other seriously, and we are taking it one step at a time” is a complete answer when you are not ready to discuss every detail.",
        ],
      },
      {
        heading: "Debrief as a couple afterwards",
        paragraphs: [
          "Do not judge the whole relationship by one nervous afternoon. Talk privately about what felt welcoming, what felt uncomfortable, and what you both want to do next. Family respect matters, but the couple still needs boundaries, shared decisions, and a way to disagree without recruiting an audience.",
        ],
      },
    ],
    sources: [
      { label: "Dating someone in another city", href: "/guides/dating-someone-in-another-city" },
    ],
    reviewedAt: "2026-10-05",
  },

  {
    slug: "recognise-romance-scam-patterns",
    kicker: "SAFETY",
    title: "Recognise romance-scam patterns",
    description: "Warning signs to notice, and what to do the moment something feels wrong.",
    intro:
      "A romance scam is not a failure of intelligence. It is a deliberate attempt to build trust and then use that trust to get money, personal access or control. The safest response is to slow the situation down, protect your information, and ask for help early.",
    sections: [
      {
        heading: "Notice the pattern, not one odd message",
        paragraphs: [
          "One awkward message proves very little. A pattern matters: intense affection very early, a story that always prevents a video call or a meeting, pressure to move off the app immediately, details that do not stay consistent, or a request to keep the relationship secret. Someone can be charming and still be unsafe.",
          "Be especially careful when a new romantic connection asks for money, gift cards, crypto, investment help, account access, a loan, travel fees, medical bills or an emergency payment. Never send money to prove love.",
        ],
      },
      {
        heading: "Keep your safety in your hands",
        paragraphs: [
          "Stay on the platform while trust is still forming — that is where fraud detection can see the conversation, and where reporting works. Do not share passwords, one-time codes, banking details, identity documents, your home address or intimate images with someone you have not independently verified. Do not let a dramatic story rush your decision.",
        ],
        bullets: [
          "Have a live video call before planning travel or intimacy",
          "Tell someone you trust what is happening",
          "Meet in a public place and arrange your own transport",
          "Keep screenshots, usernames, numbers and payment requests",
          "Pause before clicking links or sending documents",
        ],
      },
      {
        heading: "What to do when something feels wrong",
        paragraphs: [
          "Stop sending money and stop negotiating. Save the evidence, block the account, and report the profile. A person reviews every report on DA8N, and your details are not shown to the person you reported.",
          "If money or identity information was shared, contact your bank or payment provider immediately and report the fraud to the relevant authority in your country. If someone threatens, blackmails or stalks you, do not meet them to “sort it out” — preserve the messages and contact local emergency or victim-support services.",
        ],
      },
      {
        heading: "Trust should survive a pause",
        paragraphs: [
          "A genuine person may be disappointed by a boundary, but they can respect it. A scammer escalates: guilt, urgency, anger, a new emergency, or promises that disappear if you do not pay. You are allowed to pause a relationship while you check the facts. Your heart and your bank account both deserve protection.",
        ],
      },
    ],
    sources: [
      {
        label: "FTC: what romance scams look like and how to report them",
        href: "https://consumer.ftc.gov/articles/what-know-about-romance-scams?m=y",
      },
      {
        label: "CFTC: warning signs of financial romance fraud",
        href: "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/RomanceScam.html",
      },
      { label: "How DA8N handles safety", href: "/safety" },
    ],
    reviewedAt: "2026-10-05",
  },
];

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug.trim().toLowerCase());
}

/** The canonical path for a guide. One function, so nothing hand-builds it. */
export function guidePath(slug: string): string {
  return `/guides/${slug}`;
}
