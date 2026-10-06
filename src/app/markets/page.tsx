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
  "Every market DA8N has a front door for. One global network, localized — a member joins once, not per country.";

/**
 * `/markets` — the market index.
 *
 * Distinct from `/cities`, which leads with the city grid. This one leads with
 * the market and states availability per market in product voice, because the
 * question it answers is "is DA8N open where I am", not "which cities are
 * there". Both are derived from the same catalogs, so neither can list a place
 * that has no route.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Markets",
  description: DESCRIPTION,
  path: "/markets",
  indexable: false,
});

export default function MarketsIndexPage() {
  const markets = publicMarkets();
  const jsonLd = [
    webPageJsonLd({ path: "/markets", name: "Markets", description: DESCRIPTION }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "Markets", path: "/markets" },
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
            <span aria-current="page">Markets</span>
          </nav>

          <span className="page__kicker">MARKETS</span>
          <h1 className="page__title">
            {markets.length} markets, <span className="rose">one network.</span>
          </h1>
          <p className="page__lede">{DESCRIPTION}</p>
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
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(jsonLd) }}
      />
    </div>
  );
}
