import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { FEATURED_STORY, STORIES } from "@/content/landing";
import { JOIN_CTA } from "@/content/route-copy";
import { JOIN_URL } from "@/lib/app-links";

const DESCRIPTION =
  "Couples who met on DA8N, in their own words — across cities, countries and time zones.";

/**
 * `/stories` — member stories.
 *
 * Renders the same `FEATURED_STORY` and `STORIES` the landing page does, from
 * the same file. That identity is deliberate: there is exactly one place a
 * story's wording lives, so a correction or a withdrawn consent cannot be
 * applied in one place and missed in the other.
 *
 * CONSENT. Every quote, name and date here is about real people and needs
 * their written consent on file before it ships. See CONTENT INTEGRITY in
 * `content/landing.ts`.
 *
 * NO REVIEW OR AGGREGATERATING MARKUP. A page of testimonials is the most
 * tempting place on a site to emit it, and it is a fabricated claim: DA8N
 * publishes no ratings and collects none. WebPage and BreadcrumbList only.
 *
 * `indexable: false` until the consent register is in place — this is the one
 * page whose entire content is other people's words.
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
      quote: FEATURED_STORY.quote,
      who: FEATURED_STORY.who,
      chips: [FEATURED_STORY.route, FEATURED_STORY.milestones[2].value] as const,
      photo: FEATURED_STORY.photo,
    },
    ...STORIES,
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

        <div className="stories__grid">
          {all.map((story) => (
            <figure key={story.who} className="story">
              <div className="story__media">
                <ImageSlot
                  src={story.photo}
                  alt=""
                  placeholder="Couple photo"
                  className="slot-fill"
                  sizes="(min-width: 1100px) 24vw, (min-width: 560px) 34vw, 100vw"
                />
              </div>
              <figcaption>
                <blockquote>{story.quote}</blockquote>
                <div className="story__who">
                  <b>{story.who}</b>
                  <span className="story__chips">
                    {story.chips.map((chip, position) => (
                      <span key={chip} className={position === 0 ? "chip chip--ink" : "chip"}>
                        {chip}
                      </span>
                    ))}
                  </span>
                </div>
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
