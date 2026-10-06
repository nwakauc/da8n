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
import { audiencePagePath, audienceSeoPage, audiencePages } from "@/content/audience-pages";
import { findAudience } from "@/content/audiences";
import { isIndexable } from "@/lib/indexability";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return audiencePages().map((page) => ({ slug: page.slug }));
}

/**
 * `/audiences/{slug}` — one audience.
 *
 * ---------------------------------------------------------------------------
 * THIS ROUTE IS WHERE THE INDEXABILITY ENGINE FINALLY RUNS.
 *
 * `src/lib/indexability.ts` has existed, been documented and been tested
 * since phase 1, and until this route NOTHING CALLED IT. Every `indexable:`
 * boolean on every page in this app was a hand-written claim that no quality
 * floor was ever applied to — the gate's whole purpose — and `SeoPage`, the
 * type it assesses, had no values of it anywhere in the app either. A tested
 * gate that nothing invokes is not a safeguard; it is a comment with a test
 * suite attached.
 *
 * So the verdict here is computed, not asserted. `isIndexable` checks both
 * halves: the editorial state on the record AND the measured floor — intro
 * length, section count, FAQ count, body characters, internal links, title and
 * description limits, and a scan for anything that looks like private data. If
 * a page is written too thin, it still serves (so no link breaks) and it is
 * noindex. Nobody has to remember the rule.
 *
 * `claimsDecay` is false here: these pages describe DA8N's own shipped
 * behaviour, which does not expire on a timetable the way a claim about a
 * third party's product does. `/compare/{slug}` sets it true.
 * ---------------------------------------------------------------------------
 *
 * WHY THIS EXISTS WHEN `/audiences/{slug}/{cc}` STILL DOES NOT. The stated
 * reason these pages were unbuilt was liquidity, and it is a good reason for
 * the AUDIENCE × MARKET page: "senior dating in Manchester" with nobody over
 * 55 in Manchester is a thin page that also misleads a real person. It is not
 * a reason for the audience page alone, which makes no claim about who is in
 * any particular city — it explains how the product works for a particular
 * person, which is checkable against shipped behaviour. See the long note at
 * the top of `content/audience-pages.ts`.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = audienceSeoPage(slug);
  const audience = findAudience(slug);
  if (!page || !audience) return { title: "Not found", robots: { index: false } };

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: audiencePagePath(page.slug),
    indexable: isIndexable(page, {
      entityIndexable: audience.indexable,
      entityExists: true,
    }),
  });
}

export default async function AudiencePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = audienceSeoPage(slug);
  if (!page) notFound();

  const path = audiencePagePath(page.slug);
  const jsonLd = toJsonLdScript([
    webPageJsonLd({ path, name: page.title, description: page.description }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "Audiences", path: "/audiences" },
      { name: page.title, path },
    ]),
    /*
     * FAQPage is emitted because every answer is in the served HTML — the
     * disclosures are native `<details>`, not a JS accordion. Markup for an
     * answer a reader cannot find on the page is the thing this schema is
     * most often abused for.
     */
    faqJsonLd(page.faqs),
  ]);

  return (
    <SeoPageView
      page={page}
      breadcrumb={{ label: "Audiences", href: "/audiences" }}
      jsonLd={jsonLd}
      relatedHeading="Read next"
    />
  );
}
