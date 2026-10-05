import type { SeoPage } from "@/content/seo-page";

/**
 * The indexability engine.
 *
 * A route existing does not mean the route should be indexed. Every candidate
 * page passes through `assessIndexability` and only a verdict of "indexable"
 * may emit `index,follow` or enter a sitemap. Everything else is served (so a
 * link is never broken) and noindexed (so it never dilutes the site).
 *
 * Two independent gates, and both must pass:
 *
 *   EDITORIAL  — a human marked the page `indexable` in its content record
 *   MEASURED   — the page clears the quality floor below
 *
 * They are separate so that an editor marking a page ready cannot override a
 * measured failure, and a measured pass cannot publish something unreviewed.
 *
 * Generalized from `apps/d8n/web`'s test-enforced thin-page floor, which this
 * replaces with a runtime function so the sitemap and the metadata agree by
 * construction instead of by two people remembering the same rule.
 */

/** Minimum real content. Below any of these, the page is thin. */
export const MIN_SECTIONS = 2;
export const MIN_FAQS = 2;
export const MIN_INTRO_CHARS = 120;
export const MIN_BODY_CHARS = 900;
export const MIN_RELATED_LINKS = 2;
export const MAX_TITLE_CHARS = 60;
export const MAX_DESCRIPTION_CHARS = 160;

/**
 * How long a dated factual claim stays credible. Comparison pages and market
 * availability claims decay; past this the page is pulled from the index until
 * someone re-checks it. 180 days is deliberately shorter than a year — a
 * competitor can change its pricing model in a quarter.
 */
export const MAX_REVIEW_AGE_DAYS = 180;

/**
 * Substrings that must never appear in public page content. This is a blunt
 * instrument and not the primary defence — the real defence is that this app
 * makes no API calls and has no access to member data at all — but it catches
 * the case where someone pastes a real record into page copy.
 */
export const FORBIDDEN_CONTENT_PATTERNS: readonly RegExp[] = [
  /\b\d{1,5}\s+[A-Z][a-z]+\s+(Street|Road|Avenue|Close|Crescent)\b/, // street address
  /\b[\w.+-]+@[\w-]+\.[\w.]{2,}\b/, // email address
  /\btrust[_ ]score\b/i, // internal risk signal
  /\b(latitude|longitude|lat|lng)\s*[:=]/i, // precise coordinates
  /\b\+?\d[\d\s()-]{8,}\d\b/, // phone number
];

export type IndexabilityReason =
  | "editorial_state_not_indexable"
  | "entity_not_indexable"
  | "entity_missing"
  | "never_published"
  | "review_stale"
  | "title_missing"
  | "title_too_long"
  | "description_missing"
  | "description_too_long"
  | "h1_missing"
  | "intro_too_short"
  | "too_few_sections"
  | "too_few_faqs"
  | "body_too_thin"
  | "too_few_internal_links"
  | "duplicate_title"
  | "duplicate_h1"
  | "duplicate_canonical"
  | "private_content_detected";

export type IndexabilityVerdict =
  | { readonly verdict: "indexable" }
  | { readonly verdict: "blocked"; readonly reasons: readonly IndexabilityReason[] };

export type IndexabilityContext = {
  /**
   * Whether the entity the page is about is itself approved for indexing — the
   * market, city, audience or competitor record. A page cannot be more
   * indexable than its subject.
   */
  readonly entityIndexable: boolean;
  /** False when the referenced entity is not in the catalog at all. */
  readonly entityExists: boolean;
  /**
   * True for pages whose factual claims decay — comparisons, market
   * availability. These require a fresh `reviewedAt`.
   */
  readonly claimsDecay?: boolean;
  /** Injected so the function stays pure and testable. */
  readonly now?: Date;
};

function bodyCharCount(page: SeoPage): number {
  const sections = page.sections.reduce(
    (total, section) =>
      total +
      section.heading.length +
      section.body.length +
      (section.bullets ?? []).reduce((sum, bullet) => sum + bullet.length, 0),
    0,
  );
  const faqs = page.faqs.reduce(
    (total, faq) => total + faq.question.length + faq.answer.length,
    0,
  );
  return page.intro.length + sections + faqs;
}

function containsPrivateContent(page: SeoPage): boolean {
  const haystack = [
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
  ].join("\n");
  return FORBIDDEN_CONTENT_PATTERNS.some((pattern) => pattern.test(haystack));
}

function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / 86_400_000);
}

/**
 * Pure. Returns every reason a page is blocked, not just the first — an
 * operator fixing a page wants the whole list, and HQ wants to aggregate them.
 */
export function assessIndexability(
  page: SeoPage,
  context: IndexabilityContext,
): IndexabilityVerdict {
  const now = context.now ?? new Date();
  const reasons: IndexabilityReason[] = [];

  if (!context.entityExists) reasons.push("entity_missing");
  if (page.indexability !== "indexable") reasons.push("editorial_state_not_indexable");
  if (!context.entityIndexable) reasons.push("entity_not_indexable");

  if (!page.publishedAt) reasons.push("never_published");

  if (context.claimsDecay) {
    const reviewed = page.reviewedAt ? new Date(page.reviewedAt) : null;
    if (!reviewed || Number.isNaN(reviewed.getTime())) {
      reasons.push("review_stale");
    } else if (daysBetween(reviewed, now) > MAX_REVIEW_AGE_DAYS) {
      reasons.push("review_stale");
    }
  }

  if (!page.title.trim()) reasons.push("title_missing");
  if (page.title.length > MAX_TITLE_CHARS) reasons.push("title_too_long");
  if (!page.description.trim()) reasons.push("description_missing");
  if (page.description.length > MAX_DESCRIPTION_CHARS) reasons.push("description_too_long");
  if (!page.h1.trim()) reasons.push("h1_missing");

  if (page.intro.trim().length < MIN_INTRO_CHARS) reasons.push("intro_too_short");
  if (page.sections.length < MIN_SECTIONS) reasons.push("too_few_sections");
  if (page.faqs.length < MIN_FAQS) reasons.push("too_few_faqs");
  if (bodyCharCount(page) < MIN_BODY_CHARS) reasons.push("body_too_thin");
  if (page.related.length < MIN_RELATED_LINKS) reasons.push("too_few_internal_links");

  if (containsPrivateContent(page)) reasons.push("private_content_detected");

  return reasons.length === 0 ? { verdict: "indexable" } : { verdict: "blocked", reasons };
}

export function isIndexable(page: SeoPage, context: IndexabilityContext): boolean {
  return assessIndexability(page, context).verdict === "indexable";
}

/**
 * Site-wide uniqueness. Two indexable pages sharing a title, an H1 or a
 * canonical are competing with each other, which is the most common way a
 * programmatic surface damages itself. Returns the offending values.
 */
export function findDuplicates(
  pages: ReadonlyArray<{ title: string; h1: string; canonical: string }>,
): {
  readonly titles: readonly string[];
  readonly h1s: readonly string[];
  readonly canonicals: readonly string[];
} {
  const collect = (values: readonly string[]): readonly string[] => {
    const seen = new Set<string>();
    const duplicated = new Set<string>();
    for (const value of values) {
      const key = value.trim().toLowerCase();
      if (seen.has(key)) duplicated.add(key);
      seen.add(key);
    }
    return [...duplicated];
  };
  return {
    titles: collect(pages.map((page) => page.title)),
    h1s: collect(pages.map((page) => page.h1)),
    canonicals: collect(pages.map((page) => page.canonical)),
  };
}
