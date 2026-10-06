import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { AUDIENCES, type AudienceKind } from "@/content/audiences";
import { marketInProse, findMarket } from "@/content/markets";
import { marketPath } from "@/lib/routing";
import { audiencePagePath, audienceSeoPage } from "@/content/audience-pages";
import { JOIN_CTA } from "@/content/route-copy";
import { JOIN_URL } from "@/lib/app-links";

const DESCRIPTION =
  "The communities, intentions and life stages DA8N is built around — and the markets each one spans.";

/**
 * `/audiences` — who DA8N is for, by axis.
 *
 * NOW A REAL INDEX. Every audience below has a written page at
 * `/audiences/{slug}`, so these are links rather than the dashed, static,
 * unclickable chips they used to be — a card styled as a card that does
 * nothing is the worst of both readings, and `.chip-link--static` existed
 * solely to make that state look deliberate. The class is gone with them.
 *
 * What is still unbuilt is the AUDIENCE x MARKET page, `/audiences/{slug}/{cc}`,
 * and for the original reason: a "senior dating in Manchester" page with
 * nobody over 55 in Manchester is a thin page that also misleads a real
 * person. The audience page alone claims nothing about any city. See the note
 * at the top of `content/audience-pages.ts`.
 *
 * Audiences with no copy written are dropped rather than linked, so this index
 * cannot advertise a page that does not exist — the same rule as the footer's
 * city column. `audience-pages.test.ts` fails the build if the catalog and the
 * copy diverge, so the drop is a safety net and not the expected path.
 */
const GROUPS: ReadonlyArray<{ readonly kind: AudienceKind; readonly label: string; readonly blurb: string }> = [
  {
    kind: "community",
    label: "Community",
    blurb:
      "Dating within a community that spans several countries at once. The case DA8N is built for: one network, so the people you are looking for are not split across four apps.",
  },
  {
    kind: "intent",
    label: "Intention",
    blurb:
      "What you are here for is a field on your profile, set on day one, rather than something a stranger has to infer from your photos.",
  },
  {
    kind: "age-cohort",
    label: "Life stage",
    blurb:
      "Dating at forty, fifty or later is not dating at twenty-five with different photos. Clear intentions and verified identity matter more, not less.",
  },
  {
    kind: "relationship-stage",
    label: "Distance",
    blurb:
      "Where you live, where you are from and where you would meet someone are three separate fields, which is what makes a corridor between two cities workable.",
  },
  {
    kind: "faith",
    label: "Faith",
    blurb: "Faith as something you can state plainly rather than raise awkwardly in week three.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Who DA8N is for",
  description: DESCRIPTION,
  path: "/audiences",
  indexable: true,
});

export default function AudiencesIndexPage() {
  const jsonLd = [
    webPageJsonLd({ path: "/audiences", name: "Who DA8N is for", description: DESCRIPTION }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "Audiences", path: "/audiences" },
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
            <span aria-current="page">Audiences</span>
          </nav>

          <span className="page__kicker">AUDIENCES</span>
          <h1 className="page__title">
            Who DA8N is <span className="rose">for.</span>
          </h1>
          <p className="page__lede">{DESCRIPTION}</p>
          <div className="page__cta">
            <a href={JOIN_URL()} className="btn btn--primary">
              {JOIN_CTA.label}
            </a>
            <span className="page__note">{JOIN_CTA.note}</span>
          </div>
        </header>

        {GROUPS.flatMap((group) => {
          const audiences = AUDIENCES.filter((audience) => audience.kind === group.kind);
          if (audiences.length === 0) return [];
          const headingId = `audience-${group.kind}`;
          return [
            <section key={group.kind} className="page__section" aria-labelledby={headingId}>
              <h2 id={headingId}>{group.label}</h2>
              <p>{group.blurb}</p>
              <ul className="chipgrid">
                {audiences.flatMap((audience) => {
                  if (!audienceSeoPage(audience.slug)) return [];
                  return [
                    <li key={audience.slug}>
                      <Link href={audiencePagePath(audience.slug)} className="chip-link">
                        <b>{audience.label}</b>
                        <span>
                          {audience.countryCodes
                            .flatMap((code) => {
                              const market = findMarket(code);
                              return market ? [market.shortName] : [];
                            })
                            .join(" · ")}
                        </span>
                      </Link>
                    </li>,
                  ];
                })}
              </ul>
            </section>,
          ];
        })}

        <section className="page__section" aria-labelledby="audience-markets">
          <h2 id="audience-markets">Start from a market</h2>
          <p>
            Each audience above has a page of its own. If you would rather start from where you
            are, every market DA8N has opened has one too.
          </p>
          <p>
            The audience-by-market pages &mdash; &ldquo;senior dating in Manchester&rdquo; and its kind &mdash; are written
            market by market as each market fills, because a page claiming people are somewhere
            they are not is worse than no page.
          </p>
          <ul className="chipgrid">
            {["ng", "za", "gb", "us", "ca"].flatMap((code) => {
              const market = findMarket(code);
              if (!market) return [];
              return [
                <li key={code}>
                  <Link href={marketPath(code)} className="chip-link">
                    <b>{market.shortName}</b>
                    <span>Dating in {marketInProse(market)}</span>
                  </Link>
                </li>,
              ];
            })}
          </ul>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(jsonLd) }}
      />
    </div>
  );
}
