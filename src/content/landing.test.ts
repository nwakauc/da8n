import { describe, expect, it } from "vitest";
import {
  ALL_CITIES_FACES,
  CHECK_IN,
  FAQS,
  FOOTER_COLUMNS,
  LANDING_CITIES,
  MEMBERSHIP,
  PILLARS,
  PRIMARY_NAV,
  SAFETY,
  SAFETY_FEATURES,
  SAFETY_PROFILE,
  STEPS,
  STORIES,
  TIERS,
} from "./landing";
import { findCity } from "./cities";
import { findMarket, publicMarkets } from "./markets";
import { FORBIDDEN_CONTENT_PATTERNS } from "@/lib/indexability";

/**
 * Landing page content guards.
 *
 * These are not "does it render" tests — the build covers that. They are the
 * assertions that stop a future copy edit from quietly breaking something that
 * matters: a city link that 404s, a private detail in public copy, a
 * placeholder testimonial marked as consented, or a paid tier wired to a
 * checkout that does not exist.
 */

/**
 * `FORBIDDEN_CONTENT_PATTERNS` includes /\btrust[_ ]score\b/i, which exists to
 * catch the internal field name `trust_score` leaking into a public page. It
 * also matches "Trust Score" — the product's own name for the thing, which is
 * legitimately visible on the Safety Profile and in the FAQ. So every scan
 * below skips that one pattern and the numeric-score tests do the real work:
 * naming the Trust Score is fine, publishing a number is not.
 */
const TRUST_SCORE_NAME = /\btrust[_ ]score\b/i;

function expectNoForbiddenPatterns(texts: readonly string[]): void {
  for (const text of texts) {
    for (const pattern of FORBIDDEN_CONTENT_PATTERNS) {
      if (pattern.source === TRUST_SCORE_NAME.source) continue;
      expect(pattern.test(text), `"${text.slice(0, 60)}" matches ${pattern}`).toBe(false);
    }
  }
}

/** Every visible string the page renders, flattened once for the scanners. */
function allCopy(): string[] {
  return [
    ...PRIMARY_NAV.map((item) => item.label),
    ...PILLARS.flatMap((pillar) => [pillar.kicker, pillar.title, pillar.body]),
    ...STEPS.flatMap((step) => [step.label, step.detail]),
    ...LANDING_CITIES.flatMap((city) => [city.label, city.countryLabel]),
    ...STORIES.flatMap((story) => [story.quote, story.who, story.meta]),
    ...TIERS.flatMap((tier) => [tier.name, tier.badge, tier.blurb, tier.cta, ...tier.features]),
    ...FAQS.flatMap((faq) => [faq.question, faq.answer]),
    ...FOOTER_COLUMNS.flatMap((column) => column.links.map((link) => link.label)),
  ];
}

describe("landing city links", () => {
  it("resolves every city card to a real catalog city", () => {
    for (const entry of LANDING_CITIES) {
      const city = findCity(entry.countryCode, entry.slug);
      expect(city, `${entry.countryCode}/${entry.slug} is not in cities.ts`).toBeDefined();
    }
  });

  it("links every city card to a route that is actually generated", () => {
    /*
     * This is the test that matters, and the weaker version of it shipped a
     * dead link. Checking `findMarket` only proves the market is in the
     * catalog — but `generateStaticParams` builds from `publicMarkets()`,
     * which excludes "planned" and "retired". A card against a planned market
     * therefore points at a page that does not exist. Sydney did exactly that
     * until Australia was promoted to "acquisition".
     */
    const routable = new Set(publicMarkets().map((market) => market.countryCode));
    for (const entry of LANDING_CITIES) {
      const market = findMarket(entry.countryCode);
      expect(market, `${entry.countryCode} is not in markets.ts`).toBeDefined();
      expect(
        routable.has(entry.countryCode),
        `${entry.countryCode} is "${market?.status}" — no route is generated, so /${entry.countryCode}/${entry.slug} would 404`,
      ).toBe(true);
    }
  });

  it("keeps the city grid to the approved design's seven, in order", () => {
    /*
     * Seven cards plus the "all cities" tile is eight, which fills two clean
     * rows of four at desktop. Adding or reordering is a design change, not a
     * refactor, so this fails loudly rather than drifting.
     *
     * Nigeria — the only "live" market — is deliberately absent; see the note
     * on LANDING_CITIES. Do not "fix" that by appending Lagos: it would push
     * the grid to nine tiles and strand the tile on a row of its own.
     */
    expect(LANDING_CITIES.map((entry) => entry.label)).toEqual([
      "London",
      "Texas",
      "Toronto",
      "Sydney",
      "Dubai",
      "Paris",
      "Cape Town",
    ]);
  });

  it("has no duplicate city cards", () => {
    const keys = LANDING_CITIES.map((entry) => `${entry.countryCode}/${entry.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("points the stacked face images at local assets, not remote hosts", () => {
    for (const face of ALL_CITIES_FACES) {
      expect(face.startsWith("/")).toBe(true);
    }
  });
});

describe("landing content safety", () => {
  it("leaks no private or forbidden detail into public copy", () => {
    // The same patterns the indexability gate applies: street addresses, email
    // addresses, phone numbers, coordinates. Public marketing copy is the
    // easiest place for one of these to slip in.
    expectNoForbiddenPatterns(allCopy());
  });

  it("publishes no numeric trust score", () => {
    // The Safety Profile shows a qualitative band. A number invites members to
    // reverse-engineer the model and reads as a verdict on a person.
    for (const text of allCopy()) {
      expect(/trust\s*score\s*[:=]?\s*\d/i.test(text)).toBe(false);
    }
  });

  it("never claims a member is universally safe", () => {
    // "No confirmed violations" is a true statement about a record.
    // "Safe" or "guaranteed" is a promise no platform can keep.
    for (const text of allCopy()) {
      expect(/\b(guaranteed safe|100% safe|certified safe|verified safe)\b/i.test(text)).toBe(
        false,
      );
    }
  });

  it("states no member count, match count or success statistic", () => {
    // Do not fabricate statistics. If a real figure is ever published it needs
    // a dated source, and this test should be updated to allow that one claim
    // explicitly rather than widened.
    for (const text of allCopy()) {
      expect(/\b\d[\d,.]*\s*(million|thousand|k\+|m\+)\s+(members|users|singles|matches)\b/i.test(text)).toBe(
        false,
      );
    }
  });
});

/**
 * Safety copy is scanned on its own, with stricter rules than the rest of the
 * page: no numeric score, no identity-document references, no report or
 * moderation detail, no device or network intelligence.
 */
function safetyCopy(): string[] {
  return [
    SAFETY.title,
    SAFETY.titleAccent,
    SAFETY.titleTail,
    SAFETY.claim,
    SAFETY.body,
    SAFETY.disclosure,
    SAFETY_PROFILE.trust.label,
    SAFETY_PROFILE.trust.band,
    SAFETY_PROFILE.trust.safetyLabel,
    SAFETY_PROFILE.backgroundCheck.status,
    SAFETY_PROFILE.backgroundCheck.cta,
    ...SAFETY_PROFILE.groups.flatMap((group) => [
      group.label,
      ...group.items.map((item) => item.text),
    ]),
    ...SAFETY_PROFILE.trust.items.map((item) => item.text),
    ...SAFETY_FEATURES.flatMap((feature) => [feature.title, feature.body]),
    CHECK_IN.label,
    CHECK_IN.live,
    CHECK_IN.plan,
    CHECK_IN.planMeta,
    CHECK_IN.rule,
  ];
}

describe("safety copy", () => {
  it("leaks no private detail, allowing only the Trust Score product name", () => {
    expectNoForbiddenPatterns(safetyCopy());
  });

  it("publishes a Trust Score band, never a number", () => {
    expect(SAFETY_PROFILE.trust.band).toBe("Strong");
    for (const text of safetyCopy()) {
      expect(/trust\s*score\D{0,12}\d/i.test(text)).toBe(false);
    }
  });

  it("shows no identity document, report or moderation detail", () => {
    // The binding rule: never expose raw ID documents, reporter identity, raw
    // reports, unproven allegations, internal moderation notes, or device and
    // IP intelligence. "RealMe verified" states an outcome; a document
    // reference would state the evidence.
    for (const text of safetyCopy()) {
      expect(/\b(passport|driver'?s licen[cs]e|national id (number|card)|id number)\b/i.test(text)).toBe(
        false,
      );
      expect(/\b(reported by|reporter|moderation note|complainant|allegation)\b/i.test(text)).toBe(
        false,
      );
      expect(/\b(ip address|device id|device fingerprint)\b/i.test(text)).toBe(false);
    }
  });

  it("keeps the disclosure that private detail is never shown", () => {
    // This line is the page's own statement of the limit. Losing it turns the
    // Safety Profile from a bounded disclosure into an open-ended boast.
    expect(SAFETY.disclosure).toMatch(/never shown/i);
    expect(SAFETY.disclosure).toMatch(/private documents/i);
  });

  it("describes background checks as consent-based", () => {
    const feature = SAFETY_FEATURES.find((entry) => /background check/i.test(entry.title));
    expect(feature).toBeDefined();
    expect(feature?.body).toMatch(/consent-based/i);
  });
});

describe("stories", () => {
  it("marks every unconsented story so it cannot read as a testimonial", () => {
    // While `consented` is false the component stamps the card DRAFT. This
    // test exists so that flipping the flag to clear the stamp — rather than
    // because a real couple agreed — fails here.
    const placeholders = [
      "I had left every app",
      "Two continents, one matchmaker",
      "My mother's first question",
    ];
    for (const story of STORIES) {
      if (!story.consented) continue;
      for (const placeholder of placeholders) {
        expect(
          story.quote.includes(placeholder),
          `"${story.who}" is marked consented but still carries placeholder copy`,
        ).toBe(false);
      }
    }
  });

  it("has a quote and an attribution for every card", () => {
    for (const story of STORIES) {
      expect(story.quote.length).toBeGreaterThan(20);
      expect(story.who.length).toBeGreaterThan(0);
    }
  });
});

describe("membership", () => {
  it("keeps the DRAFT stamp while there is no payments implementation", () => {
    expect(MEMBERSHIP.draft).toBe(true);
  });

  it("marks only the free tier as purchasable", () => {
    // `purchasable` is what decides whether a tier renders a live anchor.
    // Nothing paid may link anywhere until payments exist.
    const purchasable = TIERS.filter((tier) => tier.purchasable).map((tier) => tier.id);
    expect(purchasable).toEqual(["free"]);
  });

  it("quotes no price on any tier", () => {
    // There is no priced plan. A number here would be an offer.
    for (const tier of TIERS) {
      const text = [tier.name, tier.badge, tier.blurb, tier.cta, ...tier.features].join(" ");
      expect(/[$£€₦R]\s?\d/.test(text)).toBe(false);
      expect(/\bper (month|year)\b/i.test(text)).toBe(false);
    }
  });
});

describe("FAQ structured data source", () => {
  it("has a question and a substantive answer for every entry", () => {
    // These render visibly AND become FAQPage markup. An empty or
    // near-empty answer would make the markup describe nothing.
    for (const faq of FAQS) {
      expect(faq.question.endsWith("?")).toBe(true);
      expect(faq.answer.length).toBeGreaterThan(40);
    }
  });

  it("asks each question once", () => {
    const questions = FAQS.map((faq) => faq.question.toLowerCase());
    expect(new Set(questions).size).toBe(questions.length);
  });

  it("answers the privacy question with a limit, not a reassurance", () => {
    const locationFaq = FAQS.find((faq) => /exact location/i.test(faq.question));
    expect(locationFaq).toBeDefined();
    expect(locationFaq?.answer).toMatch(/never your exact location/i);
  });
});

describe("navigation", () => {
  it("points every nav and footer link at a fragment or an internal path", () => {
    // No bare "#" placeholders: on a sitewide footer they are a crawl trap and
    // a dead end for keyboard users.
    const links = [...PRIMARY_NAV, ...FOOTER_COLUMNS.flatMap((column) => column.links)];
    for (const link of links) {
      expect(link.href).not.toBe("#");
      expect(link.href.startsWith("#") || link.href.startsWith("/")).toBe(true);
    }
  });

  it("targets a section that exists for every in-page nav link", () => {
    // The ids rendered by the landing page's sections.
    const sectionIds = [
      "why",
      "how",
      "cities",
      "compatibility",
      "ready",
      "safety",
      "stories",
      "membership",
      "faq",
    ];
    const fragments = [...PRIMARY_NAV, ...FOOTER_COLUMNS.flatMap((column) => column.links)]
      .map((link) => link.href)
      .filter((href) => href.startsWith("#"))
      .map((href) => href.slice(1));
    for (const fragment of fragments) {
      expect(sectionIds, `#${fragment} has no matching section`).toContain(fragment);
    }
  });
});
