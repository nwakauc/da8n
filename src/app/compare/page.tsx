import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { SitePage } from "@/components/SitePage";
import { COMPARE_PAGE } from "@/content/site-pages";
import { comparePagePath, comparePages } from "@/content/compare-pages";
import { findCompetitor } from "@/content/competitors";

const PATH = "/compare";
const DESCRIPTION =
  "How DA8N differs from swipe-first, intent-first, subscription-matchmaking and community-specific dating apps — compared by approach, not by feature table.";

/**
 * `indexable: true` as of 2026-10-05, and the reason it was false is worth
 * keeping: no competitor record carried a `factsVerifiedAt` date, so this
 * page's category framing rested on nothing checkable. Five of the eight
 * records are now dated against each product's own description of itself, and
 * the three that are not are stated as not — on this page, in the catalog, and
 * on their own comparison pages. The page describes DA8N's approach either
 * way, which is the part that was always safe to index.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "How DA8N compares",
  description: DESCRIPTION,
  path: PATH,
  indexable: true,
});

export default function Page() {
  const jsonLd = toJsonLdScript([
    webPageJsonLd({ path: PATH, name: "How DA8N compares", description: DESCRIPTION }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "Compare", path: PATH },
    ]),
  ]);

  /*
   * One chip per comparison that has a page. Built from `comparePages()`
   * rather than from `COMPETITORS`, so the index lists what is actually
   * rendered — a competitor record with no copy written is not advertised
   * here, and cannot be.
   */
  const comparisons = comparePages().flatMap((page) => {
    const competitor = findCompetitor(page.slug);
    if (!competitor) return [];
    return [{ slug: page.slug, name: competitor.name, href: comparePagePath(page.slug) }];
  });

  return (
    <SitePage
      kicker={COMPARE_PAGE.kicker}
      title={COMPARE_PAGE.title}
      lede={COMPARE_PAGE.lede}
      sections={COMPARE_PAGE.sections}
      breadcrumb="Compare"
      jsonLd={jsonLd}
      footnote={COMPARE_PAGE.disclaimer}
    >
      <section className="page__section" aria-labelledby="compare-each">
        <h2 id="compare-each">Compared one by one</h2>
        <p>
          Each page below describes what DA8N does. Where we have checked a product&apos;s
          category against its own public description of itself, the page says so and carries the
          date; where we have not, it says that instead of guessing.
        </p>
        <ul className="chipgrid">
          {comparisons.map((item) => (
            <li key={item.slug}>
              <Link href={item.href} className="chip-link">
                <b>DA8N and {item.name}</b>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SitePage>
  );
}
