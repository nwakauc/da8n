import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  ALL_CITIES_FACES,
  CHAT_WARNING,
  CHECK_IN,
  CITIES_SECTION,
  COMPAT,
  FAQS,
  FAQ_SECTION,
  FEATURED_STORY,
  FOOTER_COLUMNS,
  GUIDES_CARD,
  LANDING_CITIES,
  MEMBERSHIP,
  HOW,
  PILLARS,
  PRIMARY_NAV,
  SAFETY,
  SAFETY_CARDS,
  SAFETY_PROFILE,
  STEPS,
  STORIES,
  STORIES_SECTION,
  TIERS,
  WHY,
} from "./landing";
import { findCity } from "./cities";
import { findGuide } from "./guides";
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
    ...STORIES.flatMap((story) => [story.quote, story.who, ...story.chips]),
    FEATURED_STORY.quote,
    FEATURED_STORY.who,
    FEATURED_STORY.route,
    ...FEATURED_STORY.milestones.flatMap((milestone) => [milestone.label, milestone.value]),
    ...COMPAT.reasons,
    COMPAT.partial.text,
    COMPAT.partial.verdict,
    ...GUIDES_CARD.slugs,
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
    ...SAFETY_CARDS.flatMap((card) => [card.kicker, card.title, card.body, card.cta]),
    CHAT_WARNING.label,
    CHAT_WARNING.flag,
    CHAT_WARNING.message,
    CHAT_WARNING.verdictLead,
    CHAT_WARNING.verdictRest,
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

  /*
   * v4 stopped advertising background checks as a safety feature. v3 listed them
   * as one of six, which is why the old version of this test required the words
   * "consent-based" in that copy — a promised capability needs its qualifier.
   *
   * The qualifier is not needed any more because the promise is gone: the only
   * place background checks now appear is a "Not completed" row on the example
   * Safety Profile, which states a fact about a record rather than offering
   * anything. This test holds that line. If background checks are ever sold as a
   * feature again, the consent qualifier has to come back with them.
   */
  it("offers no background-check capability, only an uncompleted status", () => {
    expect(SAFETY_PROFILE.backgroundCheck.status).toBe("Not completed");
    for (const card of SAFETY_CARDS) {
      expect(/background check/i.test(`${card.title} ${card.body}`)).toBe(false);
    }
  });

  /*
   * Every safety card's explainer is a label, not a link, because none of the
   * pages behind them (`/realme`, `/safety`, the Safety Centre) is built. This
   * fails the day someone sets an href without building the page — which is the
   * exact mistake the footer rule in `content/landing.ts` was written after.
   */
  it("links a safety explainer only when it has a destination", () => {
    for (const card of SAFETY_CARDS) {
      if (card.href === null) continue;
      expect(card.href).not.toBe("#");
      expect(card.href.startsWith("/") || card.href.startsWith("#")).toBe(true);
    }
  });
});

describe("stories", () => {
  it("has a quote and an attribution for every card", () => {
    for (const story of [...STORIES, FEATURED_STORY]) {
      expect(story.quote.length).toBeGreaterThan(20);
      expect(story.who.length).toBeGreaterThan(0);
    }
  });

  it("gives the featured story its three milestones", () => {
    expect(FEATURED_STORY.milestones).toHaveLength(3);
  });

  /*
   * These are testimonials about named people on a page with no DRAFT stamp,
   * which is the owner's decision and the right one for live marketing. What
   * must not creep back in is a CLAIM about outcomes at scale — "thousands of
   * couples", "most members marry within a year". One couple saying what
   * happened to them is a story; a number is a statistic, and a statistic
   * needs a dated source and its own decision.
   */
  it("states no outcome statistic in any story", () => {
    for (const story of [...STORIES, FEATURED_STORY]) {
      const text = [story.quote, story.who].join(" ");
      expect(/\b\d[\d,.]*\s*(couples|marriages|members|users|weddings)\b/i.test(text)).toBe(false);
      expect(/\b(most|majority of|\d+%)\s+(members|couples|users)\b/i.test(text)).toBe(false);
    }
  });
});

describe("membership", () => {
  it("gives every tier a real destination", () => {
    // No bare "#", and nothing may be a dead end: every tier CTA is a live
    // link now that the "Soon" labels are gone, so a typo here ships a 404 on
    // the page's most commercial control.
    for (const tier of TIERS) {
      expect(tier.href).not.toBe("#");
      expect(tier.href.startsWith("/")).toBe(true);
      expect(["app", "site"]).toContain(tier.target);
    }
  });

  it("quotes no price on any tier", () => {
    // Pricing is per-market and lives in the member application, which is the
    // only host that knows the visitor's market and currency. A number here
    // would be an offer this host cannot honour.
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

describe("destinations", () => {
  /*
   * Every "Soon" label on this page was replaced with a live link on
   * 2026-10-05. These tests are what that decision is worth: each of those
   * destinations has to be a page that exists, checked at build time, or the
   * removal of the hedging just converts honest labels into 404s on the site's
   * highest-authority page.
   */
  it("points every safety card at a real page", () => {
    const built = new Set(["/realme", "/safety"]);
    for (const card of SAFETY_CARDS) {
      expect(card.href.startsWith("/")).toBe(true);
      if (card.href.startsWith("/guides/")) {
        const slug = card.href.slice("/guides/".length);
        expect(findGuide(slug), `${card.href} is not a guide`).toBeDefined();
        continue;
      }
      expect(built, `${card.href} has no page`).toContain(card.href);
    }
  });

  it("resolves every guide the FAQ card advertises", () => {
    for (const slug of GUIDES_CARD.slugs) {
      expect(findGuide(slug), `${slug} is not in guides.ts`).toBeDefined();
    }
  });

  it("points the background-check row at the section that explains it", () => {
    expect(SAFETY_PROFILE.backgroundCheck.href).toBe("/safety#background-checks");
  });
});

describe("section numbering", () => {
  /*
   * v4 numbers the eight sections and the numbers are visible, so a missing or
   * duplicated one is a visible defect. They are declared per section rather
   * than derived from render order, which is the only thing that makes them
   * assertable here — and the only thing that would catch two sections both
   * labelled "05" after a reorder.
   */
  it("numbers the sections 01-08 exactly once each, in page order", () => {
    const nums = [
      WHY.num,
      HOW.num,
      COMPAT.num,
      CITIES_SECTION.num,
      SAFETY.num,
      STORIES_SECTION.num,
      MEMBERSHIP.num,
      FAQ_SECTION.num,
    ];
    expect(nums).toEqual(["01", "02", "03", "04", "05", "06", "07", "08"]);
  });

  it("numbers the four how-it-works steps 01-04", () => {
    expect(STEPS.map((step) => step.num)).toEqual(["01", "02", "03", "04"]);
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

  /*
   * Every routed link in the header and footer must be a page that exists.
   * Before 2026-10-05 the footer pointed almost entirely at fragments on the
   * landing page, so this could not go wrong; now it points at eleven built
   * routes, and a typo would ship a 404 in the footer of all 60+ pages.
   *
   * CHECKED AGAINST THE FILESYSTEM, not against a list.
   *
   * This test used to hold a hand-written set of the routes that existed. That
   * is the same mistake one level up: a second list to keep in step, which
   * fails in the direction that hurts — a page is added, the footer links it,
   * the list is not updated, and the test rejects a link that is perfectly
   * fine. (It did exactly that when `/contact` was built.) Asking the
   * filesystem whether `src/app/<segment>/page.tsx` exists cannot drift,
   * because it is not a claim about the app; it is the app.
   */
  it("points every routed nav and footer link at a built page", () => {
    const appDir = path.resolve(import.meta.dirname, "../app");

    const paths = [...PRIMARY_NAV, ...FOOTER_COLUMNS.flatMap((column) => column.links)]
      .map((link) => link.href)
      // `navHref` resolves a bare fragment against `/`; those are the landing
      // page's own sections and have no route of their own.
      .filter((href) => href.startsWith("/"))
      // A deep link keeps its route and drops its anchor.
      .map((href) => href.split("#")[0] ?? "/");

    for (const routePath of paths) {
      const segments = routePath.split("/").filter(Boolean);
      const file = path.join(appDir, ...segments, "page.tsx");
      expect(existsSync(file), `${routePath} has no page at ${file}`).toBe(true);
    }
  });

  it("targets a section that exists for every in-page nav link", () => {
    // The ids rendered by the landing page's sections.
    const sectionIds = [
      "why",
      "how",
      // `#ready` is an anchor inside the how-it-works section (step 04), not a
      // section of its own — v4 dissolved the panel it used to sit on.
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
