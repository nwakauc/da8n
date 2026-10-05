import Link from "next/link";

/**
 * Shared furniture for the legal routes.
 *
 * WHY THE LEGAL TEXT IS JSX AND NOT IN `content/`
 *
 * Everything the landing page renders lives in `content/landing.ts`, for three
 * reasons: FAQ copy doubles as structured data, the copy is assertable, and
 * localisation becomes a data swap. None of the three applies here. A privacy
 * notice and a set of terms are jurisdiction-specific legal instruments that
 * counsel will replace wholesale rather than edit string by string, they emit
 * no structured data, and they are not translated — they are re-drafted per
 * jurisdiction. Holding them as paragraph arrays would add indirection and buy
 * nothing. They are documents, so they are written as documents.
 */

/**
 * An inline fact that only the founder can supply. Rendered visibly rather
 * than guessed — see the note on `.legal-banner` in `globals.css`.
 */
export function Awaiting({ children }: { readonly children: React.ReactNode }) {
  return <span className="awaiting">[{children}]</span>;
}

/**
 * The review banner. A reader must be able to tell at a glance that this is a
 * draft; a document that looks finished and is not is the actual hazard.
 */
export function LegalReviewBanner() {
  return (
    <div className="legal-banner" role="note">
      <b>Draft — awaiting legal review</b>
      <p>
        The technical description below is accurate and has been checked against this
        site&apos;s source. The items marked in brackets are legal identity facts that have not
        been supplied yet, and this document has not been reviewed by a qualified adviser. It is
        published so the information is available, not as a final notice.
      </p>
    </div>
  );
}

export function LegalHeader({
  kicker,
  title,
  accent,
  lede,
  effective,
  updated,
}: {
  readonly kicker: string;
  readonly title: string;
  readonly accent: string;
  readonly lede: string;
  readonly effective: string;
  readonly updated: string;
}) {
  return (
    <header className="page__head">
      <nav aria-label="Breadcrumb" className="crumbs">
        <Link href="/">DA8N</Link>
        <span aria-hidden="true" className="crumbs__sep">
          /
        </span>
        <span aria-current="page">{title}</span>
      </nav>

      <span className="page__kicker">{kicker}</span>
      <h1 className="page__title">
        {title} <span className="rose">{accent}</span>
      </h1>
      <p className="page__lede">{lede}</p>
      <p className="prose__meta" style={{ marginTop: 18 }}>
        <span>Effective {effective}</span>
        <span>Last updated {updated}</span>
      </p>
    </header>
  );
}
