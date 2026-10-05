import { describe, expect, it } from "vitest";
import {
  ALIAS_HOSTS,
  CANONICAL_HOST,
  PRODUCTION_SITE_URL,
  buildPageMetadata,
  canonicalUrl,
  faqJsonLd,
  normalizePath,
  organizationJsonLd,
  toJsonLdScript,
  websiteJsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
  webPageJsonLd,
} from "./seo";

const SITE = "https://www.da8n.com";

describe("canonical origin", () => {
  it("canonicalizes on www, with the apex as an alias that must redirect", () => {
    expect(CANONICAL_HOST).toBe("www.da8n.com");
    expect(PRODUCTION_SITE_URL).toBe(SITE);
    expect(ALIAS_HOSTS).toContain("da8n.com");
    expect(ALIAS_HOSTS).not.toContain(CANONICAL_HOST);
  });
});

describe("normalizePath", () => {
  it("produces one form for every equivalent path", () => {
    const equivalent = [
      "/ng/lagos",
      "/ng/lagos/",
      "/NG/Lagos",
      "/ng/lagos?utm_source=google",
      "/ng/lagos#section",
      "/ng//lagos",
      "ng/lagos",
    ];
    for (const path of equivalent) {
      expect(normalizePath(path)).toBe("/ng/lagos");
    }
  });

  it("keeps the root as a single slash", () => {
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("")).toBe("/");
  });

  it("strips tracking parameters so a shared link cannot create a second canonical", () => {
    expect(normalizePath("/ng?utm_source=x&utm_medium=y&gclid=z")).toBe("/ng");
  });
});

describe("canonicalUrl", () => {
  it("is deterministic and absolute", () => {
    expect(canonicalUrl("/ng/lagos", SITE)).toBe(`${SITE}/ng/lagos`);
    expect(canonicalUrl("/", SITE)).toBe(SITE);
  });

  it("gives equivalent paths one canonical", () => {
    expect(canonicalUrl("/NG/Lagos/?utm_source=x", SITE)).toBe(canonicalUrl("/ng/lagos", SITE));
  });
});

describe("buildPageMetadata", () => {
  it("is noindex unless indexability is explicitly proven", () => {
    const metadata = buildPageMetadata({
      title: "Dating in Lagos",
      description: "Meet people in Lagos.",
      path: "/ng/lagos",
    });
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it("indexes only when told to", () => {
    const metadata = buildPageMetadata({
      title: "Dating in Lagos",
      description: "Meet people in Lagos.",
      path: "/ng/lagos",
      indexable: true,
    });
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
  });

  it("sets a canonical for every page", () => {
    const metadata = buildPageMetadata({
      title: "T",
      description: "D",
      path: "/ng/lagos/",
    });
    expect(metadata.alternates?.canonical).toBe(`${SITE}/ng/lagos`);
  });

  it("maps hreflang alternates through the same canonicalizer", () => {
    const metadata = buildPageMetadata({
      title: "T",
      description: "D",
      path: "/ca",
      languageAlternates: { "en-CA": "/ca", "fr-CA": "/fr/ca" },
    });
    expect(metadata.alternates?.languages).toEqual({
      "en-CA": `${SITE}/ca`,
      "fr-CA": `${SITE}/fr/ca`,
    });
  });
});

describe("structured data", () => {
  const everyBuilder = [
    organizationJsonLd(SITE),
    websiteJsonLd(SITE),
    webPageJsonLd({ path: "/ng", name: "N", description: "D", siteUrl: SITE }),
    breadcrumbJsonLd([{ name: "DA8N", path: "/" }], SITE),
    faqJsonLd([{ question: "Q", answer: "A" }]),
    articleJsonLd({
      path: "/guides/x",
      headline: "H",
      description: "D",
      publishedAt: "2026-10-01",
      siteUrl: SITE,
    }),
  ];

  /**
   * DA8N publishes no ratings, and rating a third party in schema is a
   * fabricated claim about someone else's product. This must hold for every
   * builder, forever — including the competitor comparison pages.
   */
  it("never emits Review or AggregateRating", () => {
    const serialized = JSON.stringify(everyBuilder);
    expect(serialized).not.toMatch(/AggregateRating/i);
    expect(serialized).not.toMatch(/"@type"\s*:\s*"Review"/i);
    expect(serialized).not.toMatch(/ratingValue/i);
    expect(serialized).not.toMatch(/reviewCount/i);
  });

  it("points every url at the canonical origin", () => {
    for (const node of everyBuilder) {
      const url = node.url;
      if (typeof url === "string") expect(url.startsWith(SITE)).toBe(true);
    }
  });

  it("defaults an unreviewed article's dateModified to its publication date", () => {
    const node = articleJsonLd({
      path: "/guides/x",
      headline: "H",
      description: "D",
      publishedAt: "2026-10-01",
      siteUrl: SITE,
    });
    expect(node.dateModified).toBe("2026-10-01");
  });

  it("escapes < so a value cannot close the script tag", () => {
    const script = toJsonLdScript({ name: "</script><script>alert(1)</script>" });
    expect(script).not.toContain("</script>");
    expect(script).toContain("\\u003c");
  });
});
