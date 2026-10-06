import { describe, expect, it } from "vitest";
import type { SeoPage } from "./seo-page";
import { AUDIENCES } from "./audiences";
import { COMPETITORS } from "./competitors";
import { audiencePagePath, audiencePages, audienceSeoPage } from "./audience-pages";
import { COMPARE_DISCLAIMER, comparePagePath, comparePages, compareSeoPage } from "./compare-pages";
import { routeCandidates } from "./registry";
import {
  FORBIDDEN_CONTENT_PATTERNS,
  MAX_DESCRIPTION_CHARS,
  MAX_TITLE_CHARS,
  assessIndexability,
} from "@/lib/indexability";

/**
 * Guards for the programmatic surface — `/audiences/{slug}` and
 * `/compare/{slug}`, nineteen pages generated from two content catalogs.
 *
 * This is the part of the site that can do real damage at speed. Nineteen
 * pages written by one hand on one afternoon can share a claim, share an H1,
 * link at a route that does not exist, or quietly invent a member count, and
 * no reviewer reads all nineteen twice. These tests are the review that
 * happens every time.
 *
 * The content rules are the same ones `landing.test.ts` and
 * `site-pages.test.ts` enforce on the hand-written routes, restated here
 * because these pages are assembled rather than written out: no member counts,
 * no outcome statistics, no prices, no safety guarantee, no rating of any
 * product including DA8N's own, and nothing that looks like private data.
 */

function allPages(): readonly SeoPage[] {
  return [...audiencePages(), ...comparePages()];
}

function textOf(page: SeoPage): string[] {
  return [
    page.kicker,
    page.title,
    page.h1,
    page.description,
    page.intro,
    ...page.sections.flatMap((section) => [
      section.heading,
      section.body,
      ...(section.bullets ?? []),
    ]),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ];
}

/** Every path this app will actually serve, for link checking. */
function servablePaths(): Set<string> {
  const paths = new Set(routeCandidates().map((candidate) => candidate.path));
  /*
   * `/guides/{slug}` routes are registry entries already. Market and city
   * routes too. What the registry does NOT model is the member application,
   * which is a different host — so an href into it is not checkable here and
   * must not be written as a site-relative path. `cta.href` is the one
   * deliberate exception: it is resolved through `appUrl()` at render time,
   * never linked raw.
   */
  return paths;
}

describe("catalog and copy agree", () => {
  /*
   * Both directions. A catalog entry with no copy yields no page, which is
   * handled gracefully everywhere — but silently, and a silently missing page
   * is a silently missing route. Copy with no catalog entry is worse: it is
   * content that can never be served.
   */
  it("has written copy for every audience in the catalog", () => {
    for (const audience of AUDIENCES) {
      expect(
        audienceSeoPage(audience.slug),
        `audience ${audience.slug} has no copy in audience-pages.ts`,
      ).toBeDefined();
    }
    expect(audiencePages().length).toBe(AUDIENCES.length);
  });

  it("has written copy for every competitor in the catalog", () => {
    for (const competitor of COMPETITORS) {
      expect(
        compareSeoPage(competitor.slug),
        `competitor ${competitor.slug} has no copy in compare-pages.ts`,
      ).toBeDefined();
    }
    expect(comparePages().length).toBe(COMPETITORS.length);
  });

  it("builds no page for an unknown slug", () => {
    expect(audienceSeoPage("not-an-audience")).toBeUndefined();
    expect(compareSeoPage("not-a-competitor")).toBeUndefined();
    // Trimming and casing are handled by the catalog finders, not the route.
    expect(audienceSeoPage("  SENIOR-DATING  ")).toBeDefined();
  });
});

describe("programmatic content safety", () => {
  it("leaks no private or forbidden detail", () => {
    for (const page of allPages()) {
      for (const text of textOf(page)) {
        for (const pattern of FORBIDDEN_CONTENT_PATTERNS) {
          expect(
            pattern.test(text),
            `${page.slug}: "${text.slice(0, 60)}" matches ${pattern}`,
          ).toBe(false);
        }
      }
    }
  });

  /**
   * The single easiest lie an audience page can tell, and the one that makes
   * it worthless: "2,000 verified singles over 50 in Manchester". Nothing in
   * this app can know that, so nothing in this app may say it.
   */
  it("states no member count, activity claim or outcome statistic", () => {
    for (const page of allPages()) {
      for (const text of textOf(page)) {
        const where = `${page.slug}: "${text.slice(0, 70)}"`;
        expect(
          /\b\d[\d,.]*\s*(million|thousand|k\+|m\+)?\s*(members|users|singles|matches|couples|marriages|weddings)\b/i.test(
            text,
          ),
          where,
        ).toBe(false);
        expect(/\b(most|majority of|\d+%)\s+(members|couples|users|singles)\b/i.test(text), where).toBe(
          false,
        );
        expect(/\b(people|members|singles)\s+(near|around|in)\s+you\b/i.test(text), where).toBe(false);
      }
    }
  });

  it("quotes no price, in any currency, for any product", () => {
    for (const page of allPages()) {
      for (const text of textOf(page)) {
        const where = `${page.slug}: "${text.slice(0, 70)}"`;
        expect(/[$£€₦]\s?\d/.test(text), where).toBe(false);
        /*
         * A quoted price, not the words. "no per-message charges" is a
         * statement about how DA8N is NOT priced and belongs on these pages;
         * "4.99 per month" is an offer this host cannot honour. The
         * distinction is a number adjacent to the period.
         */
        expect(/\d[\d.,]*\s*(a|per)\s+(month|year|week)\b/i.test(text), where).toBe(false);
        expect(/\b(a|per)\s+(month|year|week)\s+for\s+[^.]*\d/i.test(text), where).toBe(false);
      }
    }
  });

  /**
   * "Verified" is a statement about a check that ran. "Safe" is a promise
   * about another person that no platform can keep. Nineteen pages that all
   * lead on verification are nineteen chances to slip from the first into the
   * second.
   */
  it("promises no safety outcome", () => {
    for (const page of allPages()) {
      for (const text of textOf(page)) {
        const where = `${page.slug}: "${text.slice(0, 70)}"`;
        expect(/\b(guarantee|guaranteed|guarantees)\b/i.test(text), where).toBe(false);
        expect(/\b(completely|totally|100%)\s+safe\b/i.test(text), where).toBe(false);
        expect(/\brisk[- ]free\b/i.test(text), where).toBe(false);
      }
    }
  });
});

describe("comparison pages and third-party fairness", () => {
  /**
   * NO Review, NO AggregateRating, ever — on any page, not only the
   * comparisons. DA8N publishes no ratings, and rating a third party in
   * structured data is a fabricated claim about their product that search
   * engines will happily surface as a star count.
   */
  it("declares no rating or review structured data anywhere", () => {
    for (const page of allPages()) {
      for (const kind of page.structuredData) {
        expect(["WebPage", "BreadcrumbList", "FAQPage", "Article"]).toContain(kind);
      }
      expect(page.structuredData).not.toContain("Review" as never);
      expect(page.structuredData).not.toContain("AggregateRating" as never);
    }
  });

  it("carries the nominative-use disclaimer on every comparison", () => {
    expect(COMPARE_DISCLAIMER).toMatch(/not affiliated with/i);
    expect(COMPARE_DISCLAIMER).toMatch(/endorsed by/i);
  });

  /**
   * The rule this whole file exists to protect. A comparison page may make
   * exactly one factual claim about the other product — its category — and
   * only when the record carries the date that claim was checked against the
   * product's own description of itself.
   *
   * Three of the eight records are undated on purpose. Their pages must name
   * the product (people arrive from searching it) and must say nothing about
   * how it works.
   */
  it("never states a category for an unverified competitor", () => {
    const CATEGORY_WORDS = /\b(swipe-first|intent-first|subscription matchmaking|community-specific)\b/i;
    for (const competitor of COMPETITORS) {
      if (competitor.factsVerifiedAt) continue;
      const page = compareSeoPage(competitor.slug);
      expect(page).toBeDefined();
      for (const text of textOf(page!)) {
        expect(
          CATEGORY_WORDS.test(text),
          `${competitor.slug} is unverified; "${text.slice(0, 70)}" characterises it`,
        ).toBe(false);
      }
    }
  });

  it("dates a comparison from the competitor record, never from today", () => {
    for (const competitor of COMPETITORS) {
      const page = compareSeoPage(competitor.slug);
      expect(page?.reviewedAt).toBe(competitor.factsVerifiedAt);
    }
  });

  /**
   * Fairness, and self-interest: the reader who matters most on a comparison
   * page is the one who currently uses the other product. Every verified
   * comparison has to say what that approach is good at, not only what it
   * costs.
   */
  it("credits the other approach on every verified comparison", () => {
    for (const competitor of COMPETITORS) {
      if (!competitor.factsVerifiedAt) continue;
      const page = compareSeoPage(competitor.slug);
      const body = textOf(page!).join(" ");
      expect(
        /\b(good at|genuinely|closest|take the question seriously|best option|real achievement|real signal)\b/i.test(
          body,
        ),
        `${competitor.slug} criticises an approach without crediting it`,
      ).toBe(true);
    }
  });
});

describe("programmatic SEO hygiene", () => {
  it("keeps every title and description inside its limit", () => {
    for (const page of allPages()) {
      expect(page.title.length, `${page.slug} title is ${page.title.length}`).toBeLessThanOrEqual(
        MAX_TITLE_CHARS,
      );
      expect(
        page.description.length,
        `${page.slug} description is ${page.description.length}`,
      ).toBeLessThanOrEqual(MAX_DESCRIPTION_CHARS);
    }
  });

  /**
   * Every internal link on a programmatic page resolves to a route this app
   * serves. This is the failure mode a generated page set produces most often
   * and that a human reviewer catches least often: nineteen pages' worth of
   * related links, each plausible, one of them pointing at a guide slug that
   * was renamed.
   */
  it("points every related link at a route that exists", () => {
    const paths = servablePaths();
    for (const page of allPages()) {
      for (const link of page.related) {
        expect(link.href.startsWith("/"), `${page.slug} link ${link.href} is not site-relative`).toBe(
          true,
        );
        expect(link.href).not.toContain("#");
        expect(paths.has(link.href), `${page.slug} links at ${link.href}, which has no route`).toBe(
          true,
        );
      }
    }
  });

  it("gives every page enough internal links to be navigable", () => {
    for (const page of allPages()) {
      expect(page.related.length, `${page.slug} has ${page.related.length} links`).toBeGreaterThanOrEqual(
        3,
      );
      // No link repeated: a duplicated related link is a wasted slot and reads
      // as a mistake, which it is.
      const hrefs = page.related.map((link) => link.href);
      expect(new Set(hrefs).size, `${page.slug} repeats a related link`).toBe(hrefs.length);
      // And never a link to itself.
      const self =
        audienceSeoPage(page.slug) === page ? audiencePagePath(page.slug) : comparePagePath(page.slug);
      expect(hrefs, `${page.slug} links to itself`).not.toContain(self);
    }
  });

  it("ends every FAQ question with a question mark and answers it substantively", () => {
    for (const page of allPages()) {
      expect(page.faqs.length, `${page.slug} has too few FAQs for FAQPage markup`).toBeGreaterThanOrEqual(
        2,
      );
      for (const faq of page.faqs) {
        expect(faq.question.endsWith("?"), `${page.slug}: "${faq.question}"`).toBe(true);
        expect(faq.answer.length, `${page.slug}: "${faq.question}" is answered too thinly`).toBeGreaterThan(
          80,
        );
      }
    }
  });

  /**
   * The measured floor, applied to the records themselves. An audience whose
   * entity is approved but whose copy is thin must fail here rather than be
   * discovered after it is indexed — which is the whole reason
   * `assessIndexability` exists, and the reason it is now called.
   */
  it("clears the quality floor on every editorially approved page", () => {
    for (const audience of AUDIENCES) {
      if (!audience.indexable) continue;
      const page = audienceSeoPage(audience.slug)!;
      expect(
        assessIndexability(page, { entityIndexable: true, entityExists: true }),
        `/audiences/${audience.slug} is approved but fails the floor`,
      ).toEqual({ verdict: "indexable" });
    }

    for (const competitor of COMPETITORS) {
      if (!competitor.indexable) continue;
      const page = compareSeoPage(competitor.slug)!;
      expect(
        assessIndexability(page, {
          entityIndexable: true,
          entityExists: true,
          claimsDecay: true,
          // Pinned: this assertion is about the copy clearing the floor, not
          // about the clock. Staleness has its own test below.
          now: new Date(`${competitor.factsVerifiedAt}T00:00:00Z`),
        }),
        `/compare/${competitor.slug} is approved but fails the floor`,
      ).toEqual({ verdict: "indexable" });
    }
  });

  /**
   * And the clock. A verified comparison goes noindex on its own once the
   * verification passes the staleness window — nobody has to notice. This is
   * the behaviour that makes dating the record worth anything.
   */
  it("drops a verified comparison from the index once its check goes stale", () => {
    const tinder = compareSeoPage("tinder")!;
    const longAfter = new Date("2028-01-01T00:00:00Z");
    const verdict = assessIndexability(tinder, {
      entityIndexable: true,
      entityExists: true,
      claimsDecay: true,
      now: longAfter,
    });
    expect(verdict.verdict).toBe("blocked");
    expect(verdict.verdict === "blocked" ? verdict.reasons : []).toContain("review_stale");
  });
});
