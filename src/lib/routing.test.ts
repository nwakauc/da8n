import { describe, expect, it } from "vitest";
import {
  cityPath,
  diasporaPath,
  isValidDiasporaCorridor,
  marketPath,
  resolveMarketSegment,
  resolveTopLevel,
} from "./routing";
import { CITIES } from "@/content/cities";
import { MARKETS, publicMarkets } from "@/content/markets";
import { MARKET_RESERVED, TOP_LEVEL_RESERVED } from "@/content/reserved-slugs";

describe("resolveTopLevel", () => {
  it("resolves a public market's country code to its market", () => {
    const resolved = resolveTopLevel("ng");
    expect(resolved.kind).toBe("market");
    if (resolved.kind === "market") expect(resolved.market.countryName).toBe("Nigeria");
  });

  it("gives reserved namespaces priority over any market lookup", () => {
    for (const segment of TOP_LEVEL_RESERVED) {
      expect(resolveTopLevel(segment).kind).toBe("reserved");
    }
  });

  it("resolves a market segment if and only if the market has a route", () => {
    /*
     * Stated over the whole catalog rather than against one hand-picked
     * `planned` market. The earlier version asserted a planned market existed,
     * so it broke the moment the last one was promoted — and worse, it would
     * have gone green again while saying nothing. This form holds whether or
     * not a non-public market exists today, and starts covering the next one
     * automatically.
     *
     * `generateStaticParams` builds from `publicMarkets()`, so this is the
     * invariant that keeps the resolver and the built routes in agreement.
     */
    const routable = new Set(publicMarkets().map((market) => market.countryCode));
    for (const market of MARKETS) {
      const expected = routable.has(market.countryCode) ? "market" : "not-found";
      expect(
        resolveTopLevel(market.countryCode).kind,
        `/${market.countryCode} is "${market.status}"`,
      ).toBe(expected);
    }
  });

  it("404s an unknown segment", () => {
    for (const segment of ["", "zz", "xx", "nigeria", "uk"]) {
      expect(resolveTopLevel(segment).kind).toBe("not-found");
    }
  });

  it("uses gb, not uk, as the United Kingdom's code", () => {
    expect(resolveTopLevel("gb").kind).toBe("market");
    expect(resolveTopLevel("uk").kind).toBe("not-found");
  });

  it("is case and whitespace insensitive", () => {
    expect(resolveTopLevel("  NG ").kind).toBe("market");
  });
});

describe("resolveMarketSegment", () => {
  it("resolves a canonical city", () => {
    const resolved = resolveMarketSegment("ng", "lagos");
    expect(resolved.kind).toBe("city");
    if (resolved.kind === "city") expect(resolved.city.name).toBe("Lagos");
  });

  it("gives reserved market segments priority over city lookup", () => {
    for (const segment of MARKET_RESERVED) {
      expect(resolveMarketSegment("gb", segment).kind).toBe("reserved");
    }
  });

  it("redirects an alias and never serves it", () => {
    const resolved = resolveMarketSegment("za", "port-elizabeth");
    expect(resolved).toEqual({ kind: "redirect", to: "/za/gqeberha" });
  });

  it("redirects every alias in the catalog to its canonical city", () => {
    for (const city of CITIES) {
      for (const alias of city.aliases ?? []) {
        const resolved = resolveMarketSegment(city.countryCode, alias);
        expect(resolved).toEqual({ kind: "redirect", to: cityPath(city) });
      }
    }
  });

  it("does not leak a city across markets", () => {
    expect(resolveMarketSegment("gb", "lagos").kind).toBe("not-found");
    expect(resolveMarketSegment("ng", "london").kind).toBe("not-found");
  });

  it("resolves a city if and only if its market has a route", () => {
    const routable = new Set(publicMarkets().map((market) => market.countryCode));
    for (const market of MARKETS) {
      for (const slug of market.citySlugs) {
        const expected = routable.has(market.countryCode) ? "city" : "not-found";
        expect(
          resolveMarketSegment(market.countryCode, slug).kind,
          `/${market.countryCode}/${slug} — market is "${market.status}"`,
        ).toBe(expected);
      }
    }
  });
});

/**
 * These are the invariants that keep the grammar unambiguous. They are the
 * reason the reserved registry exists, and they must hold as the catalogs
 * grow — which is the whole point of asserting them rather than documenting
 * them.
 */
describe("route grammar invariants", () => {
  it("has no country code that is also a top-level reserved word", () => {
    for (const market of MARKETS) {
      expect(TOP_LEVEL_RESERVED).not.toContain(market.countryCode);
    }
  });

  it("has no city slug that is also a market-reserved segment", () => {
    for (const city of CITIES) {
      expect(MARKET_RESERVED).not.toContain(city.slug);
      for (const alias of city.aliases ?? []) {
        expect(MARKET_RESERVED).not.toContain(alias);
      }
    }
  });

  it("has no duplicate city slug within a market", () => {
    const seen = new Set<string>();
    for (const city of CITIES) {
      const key = `${city.countryCode}/${city.slug}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it("has no alias that collides with a canonical slug in the same market", () => {
    for (const city of CITIES) {
      for (const alias of city.aliases ?? []) {
        const collision = CITIES.find(
          (other) => other.countryCode === city.countryCode && other.slug === alias,
        );
        expect(collision).toBeUndefined();
      }
    }
  });

  it("has no alias claimed by two cities in the same market", () => {
    const seen = new Set<string>();
    for (const city of CITIES) {
      for (const alias of city.aliases ?? []) {
        const key = `${city.countryCode}/${alias}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    }
  });

  it("builds every path through one function", () => {
    expect(marketPath("NG")).toBe("/ng");
    expect(cityPath(CITIES[0]!)).toBe(`/${CITIES[0]!.countryCode}/${CITIES[0]!.slug}`);
    expect(diasporaPath("GB", "NG")).toBe("/gb/diaspora/ng");
  });
});

describe("diaspora corridors", () => {
  it("accepts a real corridor in both directions of the relationship", () => {
    expect(isValidDiasporaCorridor("gb", "ng")).toBe(true);
    expect(isValidDiasporaCorridor("us", "ng")).toBe(true);
  });

  it("rejects a corridor to itself", () => {
    expect(isValidDiasporaCorridor("ng", "ng")).toBe(false);
  });

  it("rejects an unknown or unlaunched market", () => {
    expect(isValidDiasporaCorridor("zz", "ng")).toBe(false);
    expect(isValidDiasporaCorridor("au", "ng")).toBe(false);
  });

  it("only accepts corridors the origin market actually claims", () => {
    const origin = MARKETS.find((market) => market.countryCode === "ng")!;
    for (const market of publicMarkets()) {
      if (market.countryCode === "ng") continue;
      expect(isValidDiasporaCorridor(market.countryCode, "ng")).toBe(
        origin.relatedCountryCodes.includes(market.countryCode),
      );
    }
  });
});
