import Link from "next/link";
import type { Section } from "@/content/site-pages";
import { JOIN_CTA } from "@/content/route-copy";
import { JOIN_URL } from "@/lib/app-links";

/**
 * The shell every standalone product and company route renders into.
 *
 * Six routes — `/safety`, `/realme`, `/how-it-works`, `/about`, `/help`,
 * `/compare` — are the same page shape: breadcrumb, kicker, title, lede, a
 * list of sections, a CTA. Writing that six times would mean six places for
 * the heading hierarchy or the breadcrumb to drift out of step, so it is one
 * component and the difference between the pages is entirely their copy.
 *
 * `section.id` is rendered on the `<h2>` rather than on a wrapper, so a
 * deep link like `/safety#background-checks` lands on the heading a visitor
 * came to read. `scroll-margin-top` in CSS keeps it clear of the header.
 */
export function SitePage({
  kicker,
  title,
  lede,
  sections,
  breadcrumb,
  jsonLd,
  footnote,
  children,
}: {
  readonly kicker: string;
  readonly title: string;
  readonly lede: string;
  readonly sections: readonly Section[];
  readonly breadcrumb: string;
  /** Serialised WebPage + BreadcrumbList, from `toJsonLdScript`. */
  readonly jsonLd: string;
  /** Rendered under the sections, above the CTA. Used for legal disclaimers. */
  readonly footnote?: string;
  readonly children?: React.ReactNode;
}) {
  return (
    <div className="page">
      <div className="page__in page__in--prose">
        <header className="page__head">
          <nav aria-label="Breadcrumb" className="crumbs">
            <Link href="/">DA8N</Link>
            <span aria-hidden="true" className="crumbs__sep">
              /
            </span>
            <span aria-current="page">{breadcrumb}</span>
          </nav>

          <span className="page__kicker">{kicker}</span>
          <h1 className="page__title">{title}</h1>
          <p className="page__lede">{lede}</p>
        </header>

        <article className="prose">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 id={section.id}>{section.heading}</h2>
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

        {children}

        {footnote ? (
          <section className="page__section">
            <p className="notice">{footnote}</p>
          </section>
        ) : null}

        <section className="page__section" aria-label="Join DA8N">
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
        // Escaped by toJsonLdScript; every value is a literal from content/.
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
    </div>
  );
}
