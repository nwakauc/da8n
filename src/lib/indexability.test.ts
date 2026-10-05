import { describe, expect, it } from "vitest";
import type { SeoPage } from "@/content/seo-page";
import {
  MAX_REVIEW_AGE_DAYS,
  assessIndexability,
  findDuplicates,
  isIndexable,
} from "./indexability";

const PARAGRAPH =
  "Lagos is big enough that where you are matters. Mainland and island are two different evenings, and a date that is easy from Yaba is an hour and a half from Lekki on a Friday. Agreeing on a side of the bridge before anything else saves the first plan from collapsing.";

function page(overrides: Partial<SeoPage> = {}): SeoPage {
  return {
    slug: "lagos",
    kicker: "Nigeria",
    title: "Dating in Lagos",
    h1: "Dating in Lagos",
    description: "Meet people in Lagos on DA8N. See who is around and start a conversation.",
    intro:
      "Lagos is not one dating market. It is several, separated by a bridge and by traffic, and knowing which one you are in changes how you plan a first date.",
    sections: [
      { heading: "Where people actually meet", body: PARAGRAPH },
      { heading: "Getting from the app to a real date", body: PARAGRAPH },
      { heading: "Staying sensible about it", body: PARAGRAPH, bullets: ["Public first", "Own transport"] },
    ],
    faqs: [
      { question: "Is DA8N free in Lagos?", answer: PARAGRAPH },
      { question: "Where should a first date be?", answer: PARAGRAPH },
    ],
    related: [
      { label: "Abuja", href: "/ng/abuja" },
      { label: "Nigeria", href: "/ng" },
    ],
    cta: { label: "Join DA8N", href: "/sign-up" },
    indexability: "indexable",
    structuredData: ["WebPage", "BreadcrumbList", "FAQPage"],
    locale: "en-NG",
    publishedAt: "2026-10-01",
    reviewedAt: "2026-10-01",
    ...overrides,
  };
}

const approved = { entityExists: true, entityIndexable: true };

describe("assessIndexability", () => {
  it("passes a complete, approved, published page", () => {
    expect(assessIndexability(page(), approved)).toEqual({ verdict: "indexable" });
  });

  it("blocks a page whose editorial state is not indexable", () => {
    for (const state of ["draft", "review", "noindex", "archived"] as const) {
      const verdict = assessIndexability(page({ indexability: state }), approved);
      expect(verdict.verdict).toBe("blocked");
      if (verdict.verdict === "blocked") {
        expect(verdict.reasons).toContain("editorial_state_not_indexable");
      }
    }
  });

  /**
   * The two gates are independent on purpose: an editor marking a page ready
   * must not be able to override a measured quality failure, and vice versa.
   */
  it("blocks an editorially-approved page whose entity is not approved", () => {
    const verdict = assessIndexability(page(), { entityExists: true, entityIndexable: false });
    expect(verdict.verdict).toBe("blocked");
    if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("entity_not_indexable");
  });

  it("blocks a page whose entity is not in the catalog", () => {
    const verdict = assessIndexability(page(), { entityExists: false, entityIndexable: true });
    expect(verdict.verdict).toBe("blocked");
    if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("entity_missing");
  });

  it("blocks a never-published page", () => {
    const verdict = assessIndexability(page({ publishedAt: undefined }), approved);
    expect(verdict.verdict).toBe("blocked");
    if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("never_published");
  });

  describe("thin-page floor", () => {
    it("blocks too few sections", () => {
      const verdict = assessIndexability(page({ sections: [{ heading: "H", body: PARAGRAPH }] }), approved);
      expect(verdict.verdict).toBe("blocked");
      if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("too_few_sections");
    });

    it("blocks too few FAQs", () => {
      const verdict = assessIndexability(page({ faqs: [{ question: "Q", answer: PARAGRAPH }] }), approved);
      expect(verdict.verdict).toBe("blocked");
      if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("too_few_faqs");
    });

    it("blocks a short intro", () => {
      const verdict = assessIndexability(page({ intro: "Dating in Lagos." }), approved);
      expect(verdict.verdict).toBe("blocked");
      if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("intro_too_short");
    });

    it("blocks a page with no real body content", () => {
      const verdict = assessIndexability(
        page({
          sections: [
            { heading: "A", body: "Short." },
            { heading: "B", body: "Short." },
          ],
          faqs: [
            { question: "Q1", answer: "A." },
            { question: "Q2", answer: "A." },
          ],
        }),
        approved,
      );
      expect(verdict.verdict).toBe("blocked");
      if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("body_too_thin");
    });

    it("blocks a page with no internal links out", () => {
      const verdict = assessIndexability(page({ related: [] }), approved);
      expect(verdict.verdict).toBe("blocked");
      if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("too_few_internal_links");
    });

    it("blocks an over-long title or description", () => {
      const verdict = assessIndexability(
        page({ title: "D".repeat(80), description: "D".repeat(200) }),
        approved,
      );
      expect(verdict.verdict).toBe("blocked");
      if (verdict.verdict === "blocked") {
        expect(verdict.reasons).toContain("title_too_long");
        expect(verdict.reasons).toContain("description_too_long");
      }
    });
  });

  describe("decaying claims", () => {
    const now = new Date("2026-10-04T00:00:00Z");

    it("accepts a freshly reviewed page", () => {
      expect(
        isIndexable(page({ reviewedAt: "2026-09-01" }), { ...approved, claimsDecay: true, now }),
      ).toBe(true);
    });

    it("blocks a review older than the maximum age", () => {
      const stale = new Date(now.getTime() - (MAX_REVIEW_AGE_DAYS + 1) * 86_400_000)
        .toISOString()
        .slice(0, 10);
      const verdict = assessIndexability(page({ reviewedAt: stale }), {
        ...approved,
        claimsDecay: true,
        now,
      });
      expect(verdict.verdict).toBe("blocked");
      if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("review_stale");
    });

    it("blocks a decaying page that was never reviewed", () => {
      const verdict = assessIndexability(page({ reviewedAt: undefined }), {
        ...approved,
        claimsDecay: true,
        now,
      });
      expect(verdict.verdict).toBe("blocked");
      if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("review_stale");
    });

    it("ignores review age for pages whose claims do not decay", () => {
      expect(isIndexable(page({ reviewedAt: "2019-01-01" }), { ...approved, now })).toBe(true);
    });
  });

  describe("private content", () => {
    it("blocks an email address in page copy", () => {
      const verdict = assessIndexability(
        page({ sections: [{ heading: "H", body: `${PARAGRAPH} Reach her at amaka@example.com` }, { heading: "H2", body: PARAGRAPH }] }),
        approved,
      );
      expect(verdict.verdict).toBe("blocked");
      if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("private_content_detected");
    });

    it("blocks a phone number", () => {
      const verdict = assessIndexability(
        page({ intro: `${PARAGRAPH} Call +234 801 234 5678 to reach us.` }),
        approved,
      );
      expect(verdict.verdict).toBe("blocked");
      if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("private_content_detected");
    });

    it("blocks an internal risk signal leaking into public copy", () => {
      const verdict = assessIndexability(
        page({ faqs: [{ question: "What is her trust score?", answer: PARAGRAPH }, { question: "Q", answer: PARAGRAPH }] }),
        approved,
      );
      expect(verdict.verdict).toBe("blocked");
      if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("private_content_detected");
    });

    it("blocks precise coordinates", () => {
      const verdict = assessIndexability(
        page({ intro: `${PARAGRAPH} latitude: 6.5244, longitude: 3.3792` }),
        approved,
      );
      expect(verdict.verdict).toBe("blocked");
      if (verdict.verdict === "blocked") expect(verdict.reasons).toContain("private_content_detected");
    });
  });

  it("reports every reason, not just the first", () => {
    const verdict = assessIndexability(
      page({ indexability: "draft", sections: [], faqs: [], related: [], publishedAt: undefined }),
      approved,
    );
    expect(verdict.verdict).toBe("blocked");
    if (verdict.verdict === "blocked") {
      expect(verdict.reasons.length).toBeGreaterThan(4);
    }
  });
});

describe("findDuplicates", () => {
  it("finds nothing when every page is distinct", () => {
    const duplicates = findDuplicates([
      { title: "Dating in Lagos", h1: "Dating in Lagos", canonical: "https://www.da8n.com/ng/lagos" },
      { title: "Dating in Abuja", h1: "Dating in Abuja", canonical: "https://www.da8n.com/ng/abuja" },
    ]);
    expect(duplicates.titles).toEqual([]);
    expect(duplicates.h1s).toEqual([]);
    expect(duplicates.canonicals).toEqual([]);
  });

  it("catches two pages competing for the same query", () => {
    const duplicates = findDuplicates([
      { title: "Dating in Lagos", h1: "Dating in Lagos", canonical: "https://www.da8n.com/ng/lagos" },
      { title: "dating in lagos", h1: "Dating in Lagos", canonical: "https://www.da8n.com/ng/lagos-city" },
    ]);
    expect(duplicates.titles).toEqual(["dating in lagos"]);
    expect(duplicates.h1s).toEqual(["dating in lagos"]);
  });

  it("catches a duplicate canonical", () => {
    const duplicates = findDuplicates([
      { title: "A", h1: "A", canonical: "https://www.da8n.com/ng" },
      { title: "B", h1: "B", canonical: "https://www.da8n.com/ng" },
    ]);
    expect(duplicates.canonicals).toEqual(["https://www.da8n.com/ng"]);
  });
});
