import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqJsonLd,
  toJsonLdScript,
  webPageJsonLd,
} from "@/lib/seo";
import { SeoPageView } from "@/components/SeoPageView";
import {
  COMPARE_DISCLAIMER,
  comparePagePath,
  comparePages,
  compareSeoPage,
} from "@/content/compare-pages";
import { findCompetitor } from "@/content/competitors";
import { isIndexable } from "@/lib/indexability";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return comparePages().map((page) => ({ slug: page.slug }));
}

/**
 * `/compare/{slug}` — DA8N against one named product.
 *
 * `claimsDecay: true`, which is the difference from `/audiences/{slug}` and
 * the reason this route needs the gate most. A claim about a third party's
 * product is true as of the date it was checked and not beyond it, so the gate
 * requires a `reviewedAt` inside `MAX_REVIEW_AGE_DAYS` and noindexes the page
 * once it falls outside. `reviewedAt` comes from the competitor record's
 * `factsVerifiedAt` and never from the build date — a page that re-dates
 * itself on every deploy is claiming a freshness nobody earned.
 *
 * Three of the eight records carry no verification date today, so three of
 * these pages serve, link and sit noindex by the gate's own arithmetic rather
 * than by anyone remembering to set a flag. Those pages also omit the category
 * section entirely; see the note at the top of `content/compare-pages.ts`.
 *
 * The disclaimer renders on every page here rather than on the index alone,
 * because this is where someone arrives from a search for another product's
 * name and it is this page that has to be unambiguous about affiliation.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = compareSeoPage(slug);
  const competitor = findCompetitor(slug);
  if (!page || !competitor) return { title: "Not found", robots: { index: false } };

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: comparePagePath(page.slug),
    indexable: isIndexable(page, {
      entityIndexable: competitor.indexable,
      entityExists: true,
      claimsDecay: true,
    }),
  });
}

export default async function ComparePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = compareSeoPage(slug);
  if (!page) notFound();

  const path = comparePagePath(page.slug);
  const jsonLd = toJsonLdScript([
    webPageJsonLd({ path, name: page.title, description: page.description }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "Compare", path: "/compare" },
      { name: page.title, path },
    ]),
    faqJsonLd(page.faqs),
  ]);

  return (
    <SeoPageView
      page={page}
      breadcrumb={{ label: "Compare", href: "/compare" }}
      jsonLd={jsonLd}
      relatedHeading="Other comparisons"
      footnote={COMPARE_DISCLAIMER}
    />
  );
}
