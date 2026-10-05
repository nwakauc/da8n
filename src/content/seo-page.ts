/**
 * The shape every DA8N public page shares — hand-written and generated alike —
 * so one template renders them all and every page is guaranteed the same SEO
 * furniture: a unique H1, an intro, real sections, FAQs for FAQPage schema,
 * and internal links out to related entities.
 *
 * Generalized from `apps/d8n/web/src/content/seo-page.ts`. What DA8N adds:
 * explicit indexability, editorial review dates, locale, and typed references
 * to the entities a page is about, so a page can never claim to be about a
 * market or city that does not exist in the catalog.
 *
 * The thin-page floor in `src/lib/indexability.ts` is enforced by tests. A
 * page below it can exist and be served; it just cannot be indexed or enter a
 * sitemap.
 */

export type SeoSection = {
  readonly heading: string;
  readonly body: string;
  readonly bullets?: readonly string[];
};

export type SeoFaq = {
  readonly question: string;
  readonly answer: string;
};

export type SeoLink = {
  readonly label: string;
  readonly href: string;
};

/**
 * Where a page sits in its lifecycle. Only `indexable` can reach a sitemap or
 * emit `index,follow` — and only if it also passes the quality gate. These are
 * two independent checks on purpose: an editor marking a page ready does not
 * override a measured quality failure.
 *
 *   draft      — being written; served in non-production only
 *   review     — written, awaiting editorial sign-off
 *   indexable  — signed off; eligible for indexing IF the quality gate passes
 *   noindex    — deliberately public but not for search (legal, utility pages)
 *   archived   — withdrawn; must 410 or redirect, never silently 200
 */
export type IndexabilityState = "draft" | "review" | "indexable" | "noindex" | "archived";

/** Which JSON-LD a page is allowed to emit. Never includes Review/Rating. */
export type StructuredDataKind = "WebPage" | "BreadcrumbList" | "FAQPage" | "Article";

export type SeoPage = {
  /** Path-final segment. Lowercase, hyphenated, no locale or country prefix. */
  readonly slug: string;
  /** Small label above the H1. */
  readonly kicker: string;
  /** <title>, without the " | DA8N" suffix the root template appends. */
  readonly title: string;
  readonly h1: string;
  readonly description: string;
  /** Lead paragraph under the H1. */
  readonly intro: string;
  readonly sections: readonly SeoSection[];
  readonly faqs: readonly SeoFaq[];
  readonly related: readonly SeoLink[];
  readonly cta: SeoLink;

  readonly indexability: IndexabilityState;
  readonly structuredData: readonly StructuredDataKind[];
  /** BCP-47. Defaults to the market's locale; never inferred from the country. */
  readonly locale: string;
  /** ISO date. Absent means never published. */
  readonly publishedAt?: string;
  /**
   * ISO date of the last editorial fact-check. Pages making claims that decay
   * — competitor features, market availability — go stale and get pulled from
   * the sitemap by the quality gate once past their max age.
   */
  readonly reviewedAt?: string;
};
