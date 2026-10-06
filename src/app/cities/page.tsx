import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { publicMarkets } from "@/content/markets";
import { citiesInMarket } from "@/content/cities";
import { marketPath } from "@/lib/routing";
import { CityChip } from "@/components/CityChip";
import { AVAILABILITY, JOIN_CTA } from "@/content/route-copy";
import { JOIN_URL } from "@/lib/app-links";

const DESCRIPTION =
  "Every city DA8N has a page for, grouped by market. One global network with a local front door.";

/**
 * `/cities` — the city index.
 *
 * WHY THIS ROUTE EXISTS NOW
 *
 * The landing page's city grid ended with an "Explore all cities" tile: a rose
 * gradient card, the most visually prominent thing in a grid of seven real
 * links, carrying an arrow — and rendered as an inert `<div>`, because there
 * was nowhere for it to go. The comment explaining that said `/cities` was "a
 * reserved slug with nothing served at it", which was not quite true either:
 * `cities` was reserved only at market level (`/gb/cities`), so a top-level
 * `/cities` fell through to the `/{cc}` catch-all and 404'd as an unknown
 * market.
 *
 * Both halves are fixed by building the page rather than by demoting the tile.
 * The alternative — styling the tile as plainly non-interactive — would have
 * been honest but would have thrown away the one navigational hub this site
 * actually wants: a single page that links every market and every city, which
 * is exactly the internal-linking surface a programmatic SEO site needs, and
 * which is wholly derivable from catalogs that already exist.
 *
 * It invents nothing. Every market, city and region on this page comes from
 * `markets.ts` and `cities.ts`, so it cannot list a place that has no route —
 * the same guarantee the landing grid gets from `findCity`.
 *
 * Availability is stated per market in product voice, never as the catalog's
 * `status` enum. `indexable: false` like everything else pre-launch.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "All cities",
  description: DESCRIPTION,
  path: "/cities",
  indexable: false,
});

export default function CitiesIndexPage() {
  const markets = publicMarkets();
  const cityCount = markets.reduce(
    (total, market) => total + citiesInMarket(market.countryCode).length,
    0,
  );

  const jsonLd = [
    webPageJsonLd({ path: "/cities", name: "All cities", description: DESCRIPTION }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "All cities", path: "/cities" },
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
            <span aria-current="page">All cities</span>
          </nav>

          <span className="page__kicker">CITIES</span>
          <h1 className="page__title">
            Every city, <span className="rose">every market.</span>
          </h1>
          <p className="page__lede">
            {/*
              A count of cities and markets is a fact about this catalog, so it
              is safe to state. A count of PEOPLE would not be — see the content
              rules in `content/route-copy.ts`.
            */}
            {cityCount} cities across {markets.length} markets. DA8N is one global network with a
            local front door: where you live, where you are from and where you are open to
            meeting are three different things.
          </p>
          <div className="page__cta">
            <a href={JOIN_URL()} className="btn btn--primary">
              {JOIN_CTA.label}
            </a>
            <span className="page__note">{JOIN_CTA.note}</span>
          </div>
        </header>

        {markets.map((market) => {
          const cities = citiesInMarket(market.countryCode);
          const headingId = `market-${market.countryCode}`;
          return (
            <section key={market.countryCode} className="page__section" aria-labelledby={headingId}>
              <h2 id={headingId}>
                <Link href={marketPath(market.countryCode)}>{market.shortName}</Link>
              </h2>
              <p>{AVAILABILITY[market.status]}</p>
              <ul className="chipgrid">
                {cities.map((city) => (
                  <li key={city.slug}>
                    <CityChip city={city} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

      </div>

      <script
        type="application/ld+json"
        // Escaped by toJsonLdScript; every value is a literal from the catalog.
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(jsonLd) }}
      />
    </div>
  );
}
