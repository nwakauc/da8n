import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { publicMarkets, findMarket } from "@/content/markets";
import { citiesInMarket } from "@/content/cities";
import { cityPath, marketPath, resolveMarketSegment } from "@/lib/routing";
import { CityChip, regionLabel } from "@/components/CityChip";
import { AVAILABILITY, CITY_COPY, EDITORIAL_PENDING, JOIN_CTA, showJoinCta } from "@/content/route-copy";
import { JOIN_URL } from "@/lib/app-links";

/**
 * `/{cc}/{slug}` — a city, or a market-level reserved concept.
 *
 * The resolution order lives in `@/lib/routing` and is asserted by tests, not
 * reimplemented here: reserved wins, then aliases redirect, then canonical
 * cities serve. This file only renders the city case; reserved segments get
 * their own routes as they are built, and until then they 404 rather than
 * being swallowed by a city lookup.
 *
 * PRESENTATION — see the note on the market page. This was dev scaffolding
 * ending in "City page content is not written yet", which is where every card
 * on the landing page's city grid landed. It is now a designed page that is
 * still honest about its unwritten copy, and it offers somewhere to go: join,
 * the parent market, or a nearby city.
 *
 * It asserts nothing about who is in the city. No counts, no activity, no
 * distances — those are forbidden here and would also be unknowable, since
 * this app makes no API calls at all.
 */
type Params = { cc: string; slug: string };

export function generateStaticParams(): Params[] {
  return publicMarkets().flatMap((market) =>
    citiesInMarket(market.countryCode).map((city) => ({
      cc: market.countryCode,
      slug: city.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { cc, slug } = await params;
  const resolved = resolveMarketSegment(cc, slug);
  if (resolved.kind !== "city") return { title: "Not found", robots: { index: false } };

  const { city } = resolved;
  const market = findMarket(city.countryCode);
  return buildPageMetadata({
    title: `Dating in ${city.name}`,
    description: `Meet people in ${city.name}${
      market ? `, ${market.countryName}` : ""
    } on DA8N. See who is around and start a conversation.`,
    path: cityPath(city),
    // A city is capped by its market: both must be approved.
    indexable: city.indexable && (market?.indexable ?? false),
  });
}

export default async function MarketSlugPage({ params }: { params: Promise<Params> }) {
  const { cc, slug } = await params;
  const resolved = resolveMarketSegment(cc, slug);

  // An alias is never served — it redirects, so an alias and its canonical can
  // never both return 200 and split the page's equity.
  if (resolved.kind === "redirect") permanentRedirect(resolved.to);
  if (resolved.kind !== "city") notFound();

  const { city } = resolved;
  const market = findMarket(city.countryCode);
  const related = citiesInMarket(city.countryCode).filter((candidate) =>
    city.relatedCitySlugs.includes(candidate.slug),
  );

  const jsonLd = [
    webPageJsonLd({
      path: cityPath(city),
      name: `Dating in ${city.name}`,
      description: CITY_COPY.intro(city.name, market?.countryName),
    }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: market?.countryName ?? city.countryCode, path: marketPath(city.countryCode) },
      { name: city.name, path: cityPath(city) },
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
            <Link href={marketPath(city.countryCode)}>
              {market?.countryName ?? city.countryCode}
            </Link>
            <span aria-hidden="true" className="crumbs__sep">
              /
            </span>
            <span aria-current="page">{city.name}</span>
          </nav>

          {/* Same rule as the chips: "CITY · Dubai" on the Dubai page is noise. */}
          <span className="page__kicker">
            {regionLabel(city) ? `${CITY_COPY.kicker} · ${regionLabel(city)}` : CITY_COPY.kicker}
          </span>
          <h1 className="page__title">
            Dating in <span className="rose">{city.name}</span>
          </h1>
          <p className="page__lede">
            {CITY_COPY.intro(city.name, market?.countryName)}
            {market ? ` ${AVAILABILITY[market.status]}` : null}
          </p>

          {market && showJoinCta(market) ? (
            <div className="page__cta">
              <a href={JOIN_URL()} className="btn btn--primary">
                {JOIN_CTA.label}
              </a>
              <Link href={marketPath(city.countryCode)} className="btn btn--ghost">
                All of {market.countryName}
              </Link>
              <span className="page__note">{JOIN_CTA.note}</span>
            </div>
          ) : null}
        </header>

        {related.length > 0 ? (
          <section className="page__section" aria-labelledby="nearby-heading">
            <h2 id="nearby-heading">{CITY_COPY.nearbyHeading}</h2>
            <p>{CITY_COPY.nearbyLede(market?.countryName)}</p>
            <ul className="chipgrid">
              {related.map((candidate) => (
                <li key={candidate.slug}>
                  <CityChip city={candidate} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="page__section">
          <p className="notice">{EDITORIAL_PENDING}</p>
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
