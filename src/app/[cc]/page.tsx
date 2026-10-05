import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";
import { publicMarkets } from "@/content/markets";
import { citiesInMarket } from "@/content/cities";
import { cityPath, marketPath, resolveTopLevel } from "@/lib/routing";
import Link from "next/link";

/**
 * `/{cc}` — a market, i.e. a localized entry point into the one global DA8N
 * network. Not a country-specific application.
 *
 * INTENTIONALLY NEUTRAL presentation. Market page content is Stage 1G.
 *
 * `generateStaticParams` returns only public markets, so a `planned` market
 * has no route at all rather than an empty one.
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
    title: `Dating in ${market.countryName}`,
    description: `Meet people in ${market.countryName} on DA8N. One global network, localized for ${market.countryName}.`,
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

  return (
    <div className="da8n-shell">
      <nav aria-label="Breadcrumb">
        <Link href="/">DA8N</Link> / <span aria-current="page">{market.countryName}</span>
      </nav>

      <h1>Dating in {market.countryName}</h1>
      <p className="da8n-muted">
        Market status: {market.status}. Default locale: {market.defaultLocale}.
      </p>
      <p>
        {/* Content awaiting Stage 1G. No fabricated member counts or local
            activity — see the content rules in README.md. */}
        Market page content is not written yet. This route exists to prove the
        grammar and the entity model.
      </p>

      <hr className="da8n-rule" />

      <h2>Cities</h2>
      <ul>
        {cities.map((city) => (
          <li key={city.slug}>
            <Link href={cityPath(city)}>{city.name}</Link>
            {city.region ? <span className="da8n-muted"> — {city.region}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
