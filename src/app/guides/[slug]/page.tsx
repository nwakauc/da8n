import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
  toJsonLdScript,
} from "@/lib/seo";
import { GUIDES, findGuide, guidePath } from "@/content/guides";
import { JOIN_CTA } from "@/content/route-copy";
import { JOIN_URL } from "@/lib/app-links";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) return { title: "Not found", robots: { index: false } };

  return buildPageMetadata({
    title: guide.title,
    description: guide.description,
    path: guidePath(guide.slug),
    ogType: "article",
    indexable: true,
  });
}

/**
 * `/guides/{slug}` — one guide.
 *
 * TWO THINGS HERE ARE LOAD-BEARING, not formatting:
 *
 *   `sources` renders at the foot of every guide. The scam guide tells people
 *   what to do about financial fraud and the distance guide tells them not to
 *   wire money — advice like that is only worth publishing if a reader can
 *   check where it came from. External sources get `rel="nofollow noopener"`;
 *   internal ones stay plain links so they pass equity inside the site.
 *
 *   `dateModified` in the Article markup comes from `reviewedAt`, never from
 *   the build date. A guide that quietly re-dates itself on every deploy is
 *   claiming freshness it has not earned.
 */
export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) notFound();

  const path = guidePath(guide.slug);
  const jsonLd = [
    articleJsonLd({
      path,
      headline: guide.title,
      description: guide.description,
      publishedAt: guide.reviewedAt,
      reviewedAt: guide.reviewedAt,
    }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: guide.title, path },
    ]),
  ];

  return (
    <div className="page">
      <div className="page__in page__in--prose">
        <header className="page__head">
          <nav aria-label="Breadcrumb" className="crumbs">
            <Link href="/">DA8N</Link>
            <span aria-hidden="true" className="crumbs__sep">
              /
            </span>
            <Link href="/guides">Guides</Link>
            <span aria-hidden="true" className="crumbs__sep">
              /
            </span>
            <span aria-current="page">{guide.title}</span>
          </nav>

          <span className="page__kicker">{guide.kicker}</span>
          <h1 className="page__title">{guide.title}</h1>
          <p className="page__lede">{guide.intro}</p>
        </header>

        <article className="prose">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>

        <aside className="page__section" aria-labelledby="sources">
          <h2 id="sources">Sources</h2>
          <ul className="sources">
            {guide.sources.map((source) => {
              const external = source.href.startsWith("http");
              return (
                <li key={source.href}>
                  {external ? (
                    <a href={source.href} rel="nofollow noopener" target="_blank">
                      {source.label}
                    </a>
                  ) : (
                    <Link href={source.href}>{source.label}</Link>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="prose__meta">Last reviewed {guide.reviewedAt}.</p>
        </aside>

        <section className="page__section">
          <div className="page__cta">
            <a href={JOIN_URL()} className="btn btn--primary">
              {JOIN_CTA.label}
            </a>
            <span className="page__note">{JOIN_CTA.note}</span>
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(jsonLd) }}
      />
    </div>
  );
}
