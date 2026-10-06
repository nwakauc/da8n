import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { GUIDES, guidePath } from "@/content/guides";
import { JOIN_CTA } from "@/content/route-copy";
import { JOIN_URL } from "@/lib/app-links";

const DESCRIPTION =
  "Practical guides to dating well: first dates, profiles, distance, family and spotting a romance scam.";

/**
 * `/guides` — the editorial index.
 *
 * This is the one hub on the site whose value is the writing rather than the
 * catalog. It links every guide and nothing else, so the crawl path from the
 * landing page's guides card to each article is one hop.
 *
 * `indexable: true`. Every guide here is written, sourced and dated — which is
 * the bar the rest of the site has not cleared yet, not a relaxation of it.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Guides",
  description: DESCRIPTION,
  path: "/guides",
  indexable: true,
});

export default function GuidesIndexPage() {
  const jsonLd = [
    webPageJsonLd({ path: "/guides", name: "Guides", description: DESCRIPTION }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "Guides", path: "/guides" },
    ]),
  ];

  return (
    <div className="page">
      <div className="page__in">
        <header className="page__head">
          <nav aria-label="Breadcrumb" className="crumbs">
            <Link href="/">DA8N</Link>
            <span aria-hidden="true" className="crumbs__sep">
              /
            </span>
            <span aria-current="page">Guides</span>
          </nav>

          <span className="page__kicker">GUIDES</span>
          <h1 className="page__title">
            Learn how to <span className="rose">win</span> at this.
          </h1>
          <p className="page__lede">{DESCRIPTION}</p>
          <div className="page__cta">
            <a href={JOIN_URL()} className="btn btn--primary">
              {JOIN_CTA.label}
            </a>
            <span className="page__note">{JOIN_CTA.note}</span>
          </div>
        </header>

        <ul className="gcards">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link href={guidePath(guide.slug)} className="gcard">
                <span className="gcard__kicker">{guide.kicker}</span>
                <h2>{guide.title}</h2>
                <p>{guide.description}</p>
                <span className="gcard__more" aria-hidden="true">
                  Read the guide →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(jsonLd) }}
      />
    </div>
  );
}
