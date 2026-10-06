import type { Metadata } from "next";
import Link from "next/link";
import "../landing.css";
import { ImageSlot } from "@/components/ImageSlot";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { FEATURED_JOURNEY, JOURNEYS } from "@/content/landing";
import { JOIN_CTA } from "@/content/route-copy";
import { JOIN_URL } from "@/lib/app-links";

const DESCRIPTION =
  "How people have met on DA8N — across cities, countries and time zones.";

/**
 * `/stories` — member stories.
 *
 * Renders the same `FEATURED_JOURNEY` and `JOURNEYS` the landing page does,
 * from the same file. That identity is deliberate: there is exactly one place
 * this wording lives, so a correction cannot be applied in one place and
 * missed in the other.
 *
 * NO NAMES AND NO QUOTES, since v4. Through v3 this page carried testimonials
 * attributed to named couples, which needed each couple's written consent on
 * file and never had it. v4 removed the attribution from the section rather
 * than shipping the claim and tracking the paperwork — see the note on
 * `JOURNEYS` in `content/landing.ts`. If consented stories are ever collected,
 * this is the page they belong on, with names and quotes restored.
 *
 * NO REVIEW OR AGGREGATERATING MARKUP. A page like this is the most tempting
 * place on a site to emit it, and it is a fabricated claim: DA8N publishes no
 * ratings and collects none. WebPage and BreadcrumbList only.
 *
 * `indexable: false` while the page has this little on it.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Stories",
  description: DESCRIPTION,
  path: "/stories",
  indexable: false,
});

export default function StoriesPage() {
  const jsonLd = [
    webPageJsonLd({ path: "/stories", name: "Stories", description: DESCRIPTION }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "Stories", path: "/stories" },
    ]),
  ];

  const all = [
    {
      headline: FEATURED_JOURNEY.headline,
      chips: [FEATURED_JOURNEY.route, FEATURED_JOURNEY.facts[2].value] as const,
      photo: FEATURED_JOURNEY.photo,
    },
    ...JOURNEYS,
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
            <span aria-current="page">Stories</span>
          </nav>

          <span className="page__kicker">STORIES</span>
          <h1 className="page__title">
            This is what <span className="rose">we&apos;re here for.</span>
          </h1>
          <p className="page__lede">{DESCRIPTION}</p>
          <div className="page__cta">
            <a href={JOIN_URL()} className="btn btn--primary">
              {JOIN_CTA.label}
            </a>
            <span className="page__note">{JOIN_CTA.note}</span>
          </div>
        </header>

        <div className="journeys__grid">
          {all.map((journey) => (
            <figure key={journey.headline} className="journey">
              <div className="journey__media">
                <ImageSlot
                  src={journey.photo}
                  alt=""
                  placeholder="Couple photo"
                  className="slot-fill"
                  sizes="(min-width: 1100px) 24vw, (min-width: 560px) 34vw, 100vw"
                />
              </div>
              <figcaption>
                <h2>{journey.headline}</h2>
                <span className="journey__chips">
                  {journey.chips.map((chip, position) => (
                    <span key={chip} className={position === 0 ? "chip chip--ink" : "chip"}>
                      {chip}
                    </span>
                  ))}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(jsonLd) }}
      />
    </div>
  );
}
