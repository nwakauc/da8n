import { describe, expect, it } from "vitest";
import {
  ABOUT_PAGE,
  COMPARE_PAGE,
  HELP_PAGE,
  HOW_PAGE,
  REALME_PAGE,
  SAFETY_PAGE,
  type Section,
} from "./site-pages";
import { GUIDES } from "./guides";
import { COMPETITORS } from "./competitors";
import { FORBIDDEN_CONTENT_PATTERNS } from "@/lib/indexability";

/**
 * Guards for the standalone product and company routes.
 *
 * These pages are now indexable and linked from the footer of every route on
 * the site, so a claim that slips in here is seen everywhere. The three rules
 * below are the ones that cannot be left to review.
 */

const PAGES = [SAFETY_PAGE, REALME_PAGE, HOW_PAGE, ABOUT_PAGE, HELP_PAGE, COMPARE_PAGE];

function textOf(sections: readonly Section[]): string[] {
  return sections.flatMap((section) => [
    section.heading,
    ...section.paragraphs,
    ...(section.bullets ?? []),
  ]);
}

function allCopy(): string[] {
  return PAGES.flatMap((page) => [page.kicker, page.title, page.lede, ...textOf(page.sections)]);
}

function allGuideCopy(): string[] {
  return GUIDES.flatMap((guide) => [
    guide.kicker,
    guide.title,
    guide.description,
    guide.intro,
    ...textOf(guide.sections),
  ]);
}

const TRUST_SCORE_NAME = /\btrust[_ ]score\b/i;

describe("site page content safety", () => {
  it("leaks no private or forbidden detail", () => {
    for (const text of [...allCopy(), ...allGuideCopy()]) {
      for (const pattern of FORBIDDEN_CONTENT_PATTERNS) {
        // The Trust Score is the product's own name for a thing these pages
        // legitimately explain; the numeric test below does the real work.
        if (pattern.source === TRUST_SCORE_NAME.source) continue;
        expect(pattern.test(text), `"${text.slice(0, 60)}" matches ${pattern}`).toBe(false);
      }
    }
  });

  it("never promises that a member is safe", () => {
    /*
     * THE RULE THAT MATTERS MOST ON THESE PAGES. "Verified" is a statement
     * about a check that ran. "Safe" is a promise about a person, and no
     * platform can keep it — making it is both a lie and, after something goes
     * wrong, the sentence that gets quoted back.
     */
    for (const text of [...allCopy(), ...allGuideCopy()]) {
      expect(/\b(guaranteed safe|100% safe|completely safe|certified safe|verified safe)\b/i.test(text)).toBe(
        false,
      );
      expect(/\bwe (guarantee|ensure) (your )?safety\b/i.test(text)).toBe(false);
    }
  });

  it("publishes no numeric trust score", () => {
    for (const text of allCopy()) {
      expect(/trust\s*score\D{0,16}\d/i.test(text)).toBe(false);
    }
  });

  it("states no member count or outcome statistic", () => {
    for (const text of [...allCopy(), ...allGuideCopy()]) {
      expect(
        /\b\d[\d,.]*\s*(million|thousand|k\+|m\+)?\s*(members|users|singles|matches|couples)\b/i.test(
          text,
        ),
      ).toBe(false);
    }
  });

  it("quotes no price anywhere", () => {
    // Pricing is per-market and lives in the member application.
    for (const text of allCopy()) {
      expect(/[$£€₦]\s?\d/.test(text)).toBe(false);
      expect(/\bper (month|year)\b/i.test(text)).toBe(false);
    }
  });
});

describe("safety page", () => {
  it("keeps the section ids other pages deep-link to", () => {
    // `/safety#background-checks` is linked from the landing page's Safety
    // Profile card. Renaming the id silently breaks that link.
    const ids = SAFETY_PAGE.sections.flatMap((section) => (section.id ? [section.id] : []));
    expect(ids).toContain("background-checks");
  });

  it("describes background checks as consent-based and not universal", () => {
    const section = SAFETY_PAGE.sections.find((entry) => entry.id === "background-checks");
    expect(section).toBeDefined();
    const text = section!.paragraphs.join(" ");
    expect(text).toMatch(/consent-based/i);
    // Coverage is provider-bound and market-by-market. Saying so is the
    // difference between a feature and a promise that cannot be kept.
    expect(text).toMatch(/depends on where you are|market by market/i);
  });

  it("says what a Safety Profile never shows", () => {
    const section = SAFETY_PAGE.sections.find((entry) => entry.id === "safety-profile");
    expect(section?.paragraphs.join(" ")).toMatch(/never shows/i);
  });
});

describe("realme page", () => {
  it("states that the evidence is never shown to other members", () => {
    const section = REALME_PAGE.sections.find((entry) => entry.id === "what-is-shown");
    expect(section?.paragraphs.join(" ")).toMatch(/never see/i);
  });

  it("states the limit of what verification proves", () => {
    const text = REALME_PAGE.sections.flatMap((section) => section.paragraphs).join(" ");
    expect(text).toMatch(/does not predict behaviour|not the answer/i);
  });
});

describe("compare page", () => {
  it("carries the nominative-use disclaimer", () => {
    expect(COMPARE_PAGE.disclaimer).toMatch(/not affiliated with/i);
  });

  it("makes no feature claim about a competitor that has not been verified", () => {
    /*
     * `/compare` is the CATEGORY index: it compares approaches, so it must not
     * name a product whose facts have not been verified, whatever the state of
     * the rest of the catalog.
     *
     * This test used to additionally assert that NO record was verified, with
     * the note "the day a record is verified, this test is what says the rules
     * changed". On 2026-10-05 five records were verified against each
     * product's own public description of itself, and the tripwire fired as
     * designed. That snapshot assertion is gone; the rule it guarded is not.
     * Three records remain unverified on purpose and none of the three may be
     * named here — see `content/competitors.ts`.
     */
    const unverified = COMPETITORS.filter((competitor) => !competitor.factsVerifiedAt);
    expect(unverified.length, "expected some records still unverified").toBeGreaterThan(0);

    const body = textOf(COMPARE_PAGE.sections).join(" ");
    for (const competitor of unverified) {
      expect(
        new RegExp(`\\b${competitor.name}\\b`, "i").test(body),
        `${competitor.name} is named in body copy with no verified facts behind it`,
      ).toBe(false);
    }
  });
});

describe("guides", () => {
  it("gives every guide a source and a review date", () => {
    for (const guide of GUIDES) {
      expect(guide.sources.length, `${guide.slug} has no sources`).toBeGreaterThan(0);
      expect(guide.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("has a unique slug for every guide", () => {
    const slugs = GUIDES.map((guide) => guide.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps every internal source pointing at a path, never a bare fragment", () => {
    for (const guide of GUIDES) {
      for (const source of guide.sources) {
        expect(source.href).not.toBe("#");
        expect(source.href.startsWith("/") || source.href.startsWith("https://")).toBe(true);
      }
    }
  });

  it("tells people never to send money, in the two guides that must", () => {
    // The scam guide and the distance guide are the two places someone is
    // actually at risk of being asked. This is the single most load-bearing
    // sentence on the site.
    for (const slug of ["recognise-romance-scam-patterns", "dating-someone-in-another-city"]) {
      const guide = GUIDES.find((entry) => entry.slug === slug);
      const text = textOf(guide!.sections).join(" ");
      expect(text, `${slug} must warn against sending money`).toMatch(/never send money/i);
    }
  });
});
