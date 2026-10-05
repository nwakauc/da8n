import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";
import { publicMarkets, findMarket } from "@/content/markets";
import { citiesInMarket } from "@/content/cities";
import { cityPath, marketPath, resolveMarketSegment } from "@/lib/routing";
import Link from "next/link";

/**
 * `/{cc}/{slug}` — a city, or a market-level reserved concept.
 *
 * The resolution order lives in `@/lib/routing` and is asserted by tests, not
 * reimplemented here: reserved wins, then aliases redirect, then canonical
 * cities serve. This file only renders the city case; reserved segments get
 * their own routes as they are built, and until then they 404 rather than
 * being swallowed by a city lookup.
 *
 * INTENTIONALLY NEUTRAL presentation. City content is Stage 1G.
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

  return (
    <div className="da8n-shell">
      <nav aria-label="Breadcrumb">
        <Link href="/">DA8N</Link> /{" "}
        <Link href={marketPath(city.countryCode)}>{market?.countryName ?? city.countryCode}</Link> /{" "}
        <span aria-current="page">{city.name}</span>
      </nav>

      <h1>Dating in {city.name}</h1>
      {city.region ? <p className="da8n-muted">{city.region}</p> : null}
      <p>
        {/* No member counts, no local activity claims, no fabricated
            inventory. Aggregates, when they arrive, are bucketed with a
            minimum-count floor — see Stage 0 §J-4. */}
        City page content is not written yet. This route exists to prove the
        grammar and the entity model.
      </p>

      <hr className="da8n-rule" />

      {related.length > 0 ? (
        <>
          <h2>Nearby</h2>
          <ul>
            {related.map((candidate) => (
              <li key={candidate.slug}>
                <Link href={cityPath(candidate)}>{candidate.name}</Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
