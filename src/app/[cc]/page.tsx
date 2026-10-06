import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { publicMarkets, marketInProse } from "@/content/markets";
import { citiesInMarket } from "@/content/cities";
import { marketPath, resolveTopLevel } from "@/lib/routing";
import { CityChip } from "@/components/CityChip";
import { MarketChip } from "@/components/MarketChip";
import { AVAILABILITY, JOIN_CTA, MARKET_COPY, showJoinCta } from "@/content/route-copy";
import { JOIN_URL } from "@/lib/app-links";

/**
 * `/{cc}` — a market, i.e. a localized entry point into the one global DA8N
 * network. Not a country-specific application.
 *
 * `generateStaticParams` returns only public markets, so a `planned` market
 * has no route at all rather than an empty one.
 *
 * PRESENTATION — this page used to be `INTENTIONALLY NEUTRAL` dev scaffolding
 * that printed `Market status: acquisition. Default locale: en-AE.` and "this
 * route exists to prove the grammar" at visitors. It is the destination of the
 * landing page's city grid, so it now carries the brand's own type, ground and
 * rhythm, states availability in product voice, and ends on a real CTA.
 *
 * It still asserts nothing about who is here: no member counts, no local
 * activity, no "N people near you". See the content rules in
 * `content/route-copy.ts`. Editorial copy is still pending and the page says
 * so, which is also why `indexable` stays gated on the catalog.
 */
type Params = { cc: string };

export function generateStaticParams(): Params[] {
  return publicMarkets().map((market) => ({ cc: market.countryCode }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { cc } = await params;
  const resolved = resolveTopLevel(cc);
  if (resolved.kind !== "market") return { title: "Not found", robots: { index: false } };

  const { market } = resolved;
  return buildPageMetadata({
    title: `Dating in ${marketInProse(market)}`,
    description: `Meet people in ${marketInProse(market)} on DA8N. One global network, localized for ${marketInProse(market)}.`,
    path: marketPath(market.countryCode),
    // Gated on the market's own approval. No market is approved yet.
    indexable: market.indexable,
  });
}

export default async function MarketPage({ params }: { params: Promise<Params> }) {
  const { cc } = await params;
  const resolved = resolveTopLevel(cc);
  if (resolved.kind !== "market") notFound();

  const { market } = resolved;
  const cities = citiesInMarket(market.countryCode);
  const elsewhere = publicMarkets().filter(
    (candidate) => candidate.countryCode !== market.countryCode,
  );

  /*
   * BreadcrumbList, matching the breadcrumb the page visibly renders. The
   * builder already existed in `lib/seo.ts` and was unused — a page showing a
   * trail to a reader and not to a crawler is leaving the cheapest structured
   * data on the site unclaimed.
   */
  const jsonLd = [
    webPageJsonLd({
      path: marketPath(market.countryCode),
      name: `Dating in ${marketInProse(market)}`,
      description: MARKET_COPY.intro(market),
    }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: market.shortName, path: marketPath(market.countryCode) },
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
            <span aria-current="page">{market.shortName}</span>
          </nav>

          <span className="page__kicker">{MARKET_COPY.kicker}</span>
          <h1 className="page__title">
            Dating in <span className="rose">{marketInProse(market)}</span>
          </h1>
          <p className="page__lede">
            {MARKET_COPY.intro(market)} {AVAILABILITY[market.status]}
          </p>

          {showJoinCta(market) ? (
            <div className="page__cta">
              <a href={JOIN_URL()} className="btn btn--primary">
                {JOIN_CTA.label}
              </a>
              <span className="page__note">{JOIN_CTA.note}</span>
            </div>
          ) : null}
        </header>

        {cities.length > 0 ? (
          <section className="page__section" aria-labelledby="cities-heading">
            <h2 id="cities-heading">{MARKET_COPY.citiesHeading}</h2>
            <p>{MARKET_COPY.citiesLede(market)}</p>
            <ul className="chipgrid">
              {cities.map((city) => (
                <li key={city.slug}>
                  <CityChip city={city} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="page__section" aria-labelledby="elsewhere-heading">
          <h2 id="elsewhere-heading">{MARKET_COPY.elsewhereHeading}</h2>
          <p>{MARKET_COPY.elsewhereLede}</p>
          <ul className="chipgrid">
            {elsewhere.map((candidate) => (
              <li key={candidate.countryCode}>
                <MarketChip market={candidate} />
              </li>
            ))}
          </ul>
        </section>

      </div>

      <script
        type="application/ld+json"
        // Escaped by toJsonLdScript; every value is a literal from the catalog.
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(jsonLd) }}
      />
    </div>
  );
}
