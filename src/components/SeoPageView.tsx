import Link from "next/link";
import type { SeoPage } from "@/content/seo-page";
import { JOIN_CTA } from "@/content/route-copy";
import { JOIN_URL } from "@/lib/app-links";

/**
 * The renderer for every page held as an `SeoPage` record — the programmatic
 * surfaces, `/audiences/{slug}` and `/compare/{slug}`.
 *
 * `SitePage` renders the hand-written routes and this renders the generated
 * ones. They are deliberately separate components rather than one with a flag:
 * these pages carry furniture the hand-written ones do not (FAQs with
 * FAQPage structured data behind them, a derived related-links block, a
 * review date) and merging them would mean six optional props and a component
 * that is hard to reason about.
 *
 * FAQs are native `<details>`/`<summary>`, same as the landing page's FAQ, and
 * for the same reason: every answer is in the HTML whether or not it is open,
 * which is what makes the FAQPage structured data truthful. An accordion built
 * in JavaScript would still be indexable but would not be in the document for
 * a reader with JavaScript off.
 *
 * The related-links block is not decoration. It is the internal linking that
 * makes a programmatic surface navigable at all, for a reader and a crawler
 * alike, and `MIN_RELATED_LINKS` in the indexability gate means a page cannot
 * be indexed without it.
 */
export function SeoPageView({
  page,
  breadcrumb,
  jsonLd,
  relatedHeading = "Related",
  footnote,
}: {
  readonly page: SeoPage;
  /** The index this page sits under, e.g. `{ label: "Audiences", href: "/audiences" }`. */
  readonly breadcrumb: { readonly label: string; readonly href: string };
  /** Serialised JSON-LD, from `toJsonLdScript`. */
  readonly jsonLd: string;
  readonly relatedHeading?: string;
  /** Rendered above the CTA. Used for the comparison pages' legal disclaimer. */
  readonly footnote?: string;
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
            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            <span aria-hidden="true" className="crumbs__sep">
              /
            </span>
            {/*
              The page title, not the H1. An H1 here is a sentence — "Dating
              over 50, with identity checked first." — and a breadcrumb is a
              location label, so it gets the short form.
            */}
            <span aria-current="page">{page.title}</span>
          </nav>

          <span className="page__kicker">{page.kicker}</span>
          <h1 className="page__title">{page.h1}</h1>
          <p className="page__lede">{page.intro}</p>
        </header>

        <article className="prose">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
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

        {page.faqs.length > 0 ? (
          <section className="page__section" aria-labelledby="page-faqs">
            <h2 id="page-faqs">Questions</h2>
            <div className="qa">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="qa__item">
                  <summary className="qa__q">
                    {faq.question}
                    <i aria-hidden="true">+</i>
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <section className="page__section" aria-labelledby="page-related">
          <h2 id="page-related">{relatedHeading}</h2>
          <ul className="chipgrid">
            {page.related.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <Link href={link.href} className="chip-link">
                  <b>{link.label}</b>
                </Link>
              </li>
            ))}
          </ul>
        </section>

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
          {page.reviewedAt ? (
            <p className="prose__meta">Last reviewed {page.reviewedAt}.</p>
          ) : null}
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
