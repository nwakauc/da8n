import type { Metadata } from "next";

/**
 * DA8N SEO core: one source for the canonical origin, path normalization,
 * per-page metadata and the JSON-LD builders.
 *
 * Two rules are enforced by `seo.test.ts` rather than left to discipline:
 *
 * 1. There is exactly ONE canonical URL for any entity. Every link, canonical
 *    tag, sitemap entry and JSON-LD `url` goes through `canonicalUrl`.
 * 2. No `Review` or `AggregateRating` schema is emitted anywhere, for DA8N or
 *    for any competitor. DA8N publishes no ratings, and rating a third party
 *    in schema is a fabricated claim about someone else's product.
 */

export const SITE_NAME = "DA8N";

/**
 * Canonical consumer host. Owner decision 2026-10-04: DA8N canonicalizes on
 * `www`, overriding the Stage 0 §AA recommendation of the apex. The apex
 * redirects here. Changing this after the first sitemap submission moves every
 * canonical on the site, so it is a deliberate, owner-level change.
 */
export const CANONICAL_HOST = "www.da8n.com";
export const PRODUCTION_SITE_URL = `https://${CANONICAL_HOST}`;

/**
 * Hosts that must redirect to CANONICAL_HOST rather than serve content. The
 * apex is here because serving both would split every page's equity in two.
 */
export const ALIAS_HOSTS: readonly string[] = ["da8n.com"];

export const DEFAULT_DESCRIPTION =
  "DA8N is a dating app for people who actually want to meet. Create a profile, see who is around, and start a conversation — in Nigeria, South Africa, the UK, the US, Canada and beyond.";

/**
 * Per-environment origin. MUST be set on every deployment: an unset value on a
 * preview deployment emits production canonicals from a preview URL, which is
 * a live indexation hazard (the same failure is already recorded against the
 * D8N marketing site).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  return fromEnv || PRODUCTION_SITE_URL;
}

/**
 * Lowercase, leading slash, no trailing slash (except root), no query, no
 * hash. Tracking parameters are stripped here so a shared `?utm_source=…` link
 * can never produce a second canonical for the same page.
 */
export function normalizePath(path: string): string {
  const withoutQuery = path.split("?")[0]?.split("#")[0] ?? "/";
  let result = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  result = result.replace(/\/{2,}/g, "/");
  if (result.length > 1 && result.endsWith("/")) result = result.slice(0, -1);
  return result.toLowerCase();
}

export function canonicalUrl(path: string, siteUrl = getSiteUrl()): string {
  const cleaned = normalizePath(path);
  return cleaned === "/" ? siteUrl : `${siteUrl}${cleaned}`;
}

export type PageSeoInput = {
  /** Title without the brand suffix; the root template appends " | DA8N". */
  title: string;
  description: string;
  path: string;
  /** Default false. A page is noindex until something proves it earned it. */
  indexable?: boolean;
  ogType?: "website" | "article";
  /** Skip the " | DA8N" suffix — for the homepage and titles starting "DA8N". */
  absoluteTitle?: boolean;
  /** hreflang alternates, locale → path. Omitted while a page is single-locale. */
  languageAlternates?: Readonly<Record<string, string>>;
};

/**
 * Per-page metadata.
 *
 * `indexable` defaults to **false**. A route existing is not a reason to index
 * it; the page must come through `assessIndexability` with a verdict of
 * "indexable" before anything sets this true. Fail-closed is the only safe
 * default for a programmatic surface.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  indexable = false,
  ogType = "website",
  absoluteTitle = false,
  languageAlternates,
}: PageSeoInput): Metadata {
  const url = canonicalUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      ...(languageAlternates
        ? {
            languages: Object.fromEntries(
              Object.entries(languageAlternates).map(([locale, localePath]) => [
                locale,
                canonicalUrl(localePath),
              ]),
            ),
          }
        : {}),
    },
    openGraph: { title: fullTitle, description, url, siteName: SITE_NAME, type: ogType },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  };
}

/** For 404s and anything that must never be indexed under any circumstances. */
export const NOINDEX_METADATA: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

// ───────────────────────────── JSON-LD ─────────────────────────────

export type JsonLd = Record<string, unknown>;

export function organizationJsonLd(siteUrl = getSiteUrl()): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    description: DEFAULT_DESCRIPTION,
  };
}

export function websiteJsonLd(siteUrl = getSiteUrl()): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@type": "Organization", name: SITE_NAME, url: siteUrl },
  };
}

export function webPageJsonLd({
  path,
  name,
  description,
  siteUrl = getSiteUrl(),
}: {
  path: string;
  name: string;
  description: string;
  siteUrl?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: canonicalUrl(path, siteUrl),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: siteUrl },
  };
}

export function breadcrumbJsonLd(
  items: ReadonlyArray<{ name: string; path: string }>,
  siteUrl = getSiteUrl(),
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path, siteUrl),
    })),
  };
}

/**
 * FAQPage. Answer engines lift Q&A pairs from this reliably, which is most of
 * the GEO/AEO story. Only emit it where the questions and answers are both
 * actually visible on the page — schema that describes invisible content is a
 * structured-data violation, not a growth hack.
 */
export function faqJsonLd(faqs: ReadonlyArray<{ question: string; answer: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** Editorial guides only. `dateModified` is what keeps a guide credible. */
export function articleJsonLd({
  path,
  headline,
  description,
  publishedAt,
  reviewedAt,
  siteUrl = getSiteUrl(),
}: {
  path: string;
  headline: string;
  description: string;
  publishedAt: string;
  reviewedAt?: string;
  siteUrl?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: canonicalUrl(path, siteUrl),
    datePublished: publishedAt,
    dateModified: reviewedAt ?? publishedAt,
    publisher: { "@type": "Organization", name: SITE_NAME, url: siteUrl },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: siteUrl },
  };
}

/** Escape `<` so no value can close the surrounding <script>. */
export function toJsonLdScript(data: JsonLd | readonly JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
