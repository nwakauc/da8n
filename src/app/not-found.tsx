import type { Metadata } from "next";
import Link from "next/link";
import { NOINDEX_METADATA } from "@/lib/seo";
import { publicMarkets } from "@/content/markets";
import { marketPath } from "@/lib/routing";
import { JOIN_CTA } from "@/content/route-copy";
import { JOIN_URL } from "@/lib/app-links";

export const metadata: Metadata = { title: "Not found", ...NOINDEX_METADATA };

/**
 * 404.
 *
 * A 404 on an acquisition site is usually someone who followed a stale link
 * or guessed a URL — a city DA8N has no page for, or a `/uk/...` path (the
 * route grammar is `gb`). So this offers the real front doors rather than a
 * bare apology: the markets that exist, and the one action the site is for.
 *
 * Still noindex, and still a genuine 404 status — nothing here is a soft 404.
 */
export default function NotFound() {
  const markets = publicMarkets();

  return (
    <div className="page">
      <div className="page__in page__in--prose">
        <header className="page__head">
          <span className="page__kicker">404</span>
          <h1 className="page__title">
            This page isn&apos;t <span className="rose">here.</span>
          </h1>
          <p className="page__lede">
            The link may be out of date, or the city may not have a DA8N page yet. Everything
            below does exist.
          </p>
          <div className="page__cta">
            <a href={JOIN_URL()} className="btn btn--primary">
              {JOIN_CTA.label}
            </a>
            <Link href="/" className="btn btn--ghost">
              Back to DA8N
            </Link>
          </div>
        </header>

        <section className="page__section" aria-labelledby="markets-heading">
          <h2 id="markets-heading">Where DA8N has pages</h2>
          <ul className="chipgrid">
            {markets.map((market) => (
              <li key={market.countryCode}>
                <Link href={marketPath(market.countryCode)} className="chip-link">
                  <b>{market.countryName}</b>
                  <span>{market.countryCode.toUpperCase()}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
