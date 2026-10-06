import Link from "next/link";
import type { Market } from "@/content/markets";
import { marketPath } from "@/lib/routing";

/**
 * A market as a navigation chip. Used by the market page's "Somewhere else"
 * list, the `/cities` index and the 404, so the rules below exist once.
 *
 * TWO THINGS THAT USED TO BE WRONG HERE
 *
 * The label was `countryName`, so "United Kingdom" and "United Arab Emirates"
 * wrapped onto two lines and made those cards visibly taller than the rest of
 * the row. It is `shortName` now — "UK", "UAE" — which is also the form people
 * use.
 *
 * The chip also carried the ISO country code in the right-hand slot. That is
 * routing vocabulary, not information a visitor needs, and it actively
 * misread: "United Kingdom" beside "GB" looks like a contradiction unless you
 * happen to know ISO 3166 reserves `uk` for something else. It is gone, for
 * the same reason the market page no longer prints `Market status:
 * acquisition` — the catalog's internal vocabulary is not the interface.
 *
 * The right-hand slot stays empty rather than being filled with something
 * else. `CityChip` uses it for a region, which disambiguates; nothing about a
 * country needs disambiguating.
 */
export function MarketChip({ market }: { readonly market: Market }) {
  return (
    <Link href={marketPath(market.countryCode)} className="chip-link">
      <b>{market.shortName}</b>
    </Link>
  );
}
