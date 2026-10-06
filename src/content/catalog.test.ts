import { describe, expect, it } from "vitest";
import { CITIES } from "./cities";
import { MARKETS, findMarket, publicMarkets } from "./markets";
import { AUDIENCES } from "./audiences";
import { COMPETITORS } from "./competitors";
import { audienceSeoPage } from "./audience-pages";
import { compareSeoPage } from "./compare-pages";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const COUNTRY_CODE = /^[a-z]{2}$/;
const BCP47 = /^[a-z]{2}(-[A-Z]{2})?$/;

describe("market catalog", () => {
  it("uses lowercase ISO 3166-1 alpha-2 codes", () => {
    for (const market of MARKETS) {
      expect(market.countryCode).toMatch(COUNTRY_CODE);
    }
  });

  it("has no duplicate country code", () => {
    const codes = MARKETS.map((market) => market.countryCode);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("declares a default locale that is one of its supported locales", () => {
    for (const market of MARKETS) {
      expect(market.defaultLocale).toMatch(BCP47);
      expect(market.supportedLocales).toContain(market.defaultLocale);
    }
  });

  /**
   * Country is not language. Canada is the catalog's standing proof that the
   * model does not collapse the two — if this ever becomes a single-locale
   * market the separation has quietly been lost.
   */
  it("keeps country separate from language", () => {
    const canada = findMarket("ca");
    expect(canada?.supportedLocales.length).toBeGreaterThan(1);
  });

  it("declares a currency only where DA8N actually transacts", () => {
    // Nothing transacts yet: there is no billing backend (Stage 0 §AD-2).
    for (const market of MARKETS) {
      expect(market.currency).toBeUndefined();
    }
  });

  it("references only cities that exist, in its own country", () => {
    for (const market of MARKETS) {
      for (const slug of market.citySlugs) {
        const city = CITIES.find((candidate) => candidate.slug === slug);
        expect(city, `market ${market.countryCode} references unknown city ${slug}`).toBeDefined();
        expect(city!.countryCode).toBe(market.countryCode);
      }
    }
  });

  it("references only real markets as related", () => {
    for (const market of MARKETS) {
      for (const code of market.relatedCountryCodes) {
        expect(findMarket(code), `unknown related market ${code}`).toBeDefined();
        expect(code).not.toBe(market.countryCode);
      }
    }
  });

  /**
   * Nothing is indexable yet, and that is the correct state for a shell. The
   * first indexable entity must be somebody's deliberate decision, which this
   * test forces by failing when one appears.
   */
  it("has no indexable market yet", () => {
    expect(MARKETS.filter((market) => market.indexable)).toEqual([]);
  });
});

describe("city catalog", () => {
  it("uses hyphenated lowercase slugs", () => {
    for (const city of CITIES) {
      expect(city.slug).toMatch(SLUG);
      for (const alias of city.aliases ?? []) expect(alias).toMatch(SLUG);
    }
  });

  it("has no duplicate slug anywhere in the catalog", () => {
    const slugs = CITIES.map((city) => city.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("belongs to a market that exists", () => {
    for (const city of CITIES) {
      expect(findMarket(city.countryCode), `city ${city.slug} has no market`).toBeDefined();
    }
  });

  it("relates only to cities in the same market", () => {
    for (const city of CITIES) {
      for (const slug of city.relatedCitySlugs) {
        const related = CITIES.find((candidate) => candidate.slug === slug);
        expect(related, `city ${city.slug} relates to unknown ${slug}`).toBeDefined();
        expect(related!.countryCode).toBe(city.countryCode);
        expect(slug).not.toBe(city.slug);
      }
    }
  });

  it("is listed by its own market", () => {
    for (const city of CITIES) {
      const market = findMarket(city.countryCode)!;
      expect(market.citySlugs, `${city.slug} missing from ${market.countryCode}`).toContain(city.slug);
    }
  });

  it("has no indexable city yet", () => {
    expect(CITIES.filter((city) => city.indexable)).toEqual([]);
  });
});

describe("audience catalog", () => {
  it("uses valid slugs and real markets", () => {
    for (const audience of AUDIENCES) {
      expect(audience.slug).toMatch(SLUG);
      expect(audience.countryCodes.length).toBeGreaterThan(0);
      for (const code of audience.countryCodes) {
        expect(findMarket(code), `audience ${audience.slug} names unknown market ${code}`).toBeDefined();
      }
    }
  });

  it("has no duplicate slug", () => {
    const slugs = AUDIENCES.map((audience) => audience.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  /**
   * REPLACES "has no indexable audience yet", which asserted a phase rather
   * than a rule. The phase ended when `/audiences/{slug}` was built, and a
   * test that only describes a moment stops protecting anything the moment it
   * is edited to pass.
   *
   * The durable rule is the one that was underneath it: editorial approval is
   * never permission to index a page that does not exist or has not been
   * written. `audienceSeoPage` returns undefined for an audience with no copy,
   * so this fails the build if someone approves an audience and forgets the
   * writing — which is exactly the mistake the old test was aimed at.
   *
   * What still gates the AUDIENCE x MARKET page is measured liquidity, and
   * that page is not built. See the note at the top of `content/audiences.ts`.
   */
  it("never marks an audience indexable without a written page", () => {
    for (const audience of AUDIENCES) {
      if (!audience.indexable) continue;
      expect(
        audienceSeoPage(audience.slug),
        `audience ${audience.slug} is indexable but has no written page`,
      ).toBeDefined();
    }
  });
});

describe("competitor catalog", () => {
  it("uses valid slugs, https homepages and real markets", () => {
    for (const competitor of COMPETITORS) {
      expect(competitor.slug).toMatch(SLUG);
      expect(competitor.homepage.startsWith("https://")).toBe(true);
      for (const code of competitor.countryCodes) {
        expect(findMarket(code), `competitor ${competitor.slug} names unknown market ${code}`).toBeDefined();
      }
    }
  });

  it("has no duplicate slug", () => {
    const slugs = COMPETITORS.map((competitor) => competitor.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  /**
   * A comparison page is only as honest as the date behind its claims. An
   * indexable competitor with no verification date would be publishing
   * unchecked assertions about someone else's product.
   */
  it("never marks a competitor indexable without a verification date", () => {
    for (const competitor of COMPETITORS) {
      if (competitor.indexable) expect(competitor.factsVerifiedAt).toBeDefined();
    }
  });

  /**
   * REPLACES "has no indexable competitor yet", for the same reason as the
   * audience case above: it asserted a phase, not a rule.
   *
   * The rules that matter are both still here and both still fail closed — a
   * competitor cannot be indexable without a verification date (the test
   * directly above) and cannot be indexable without a written page (this one).
   * Three of the eight records are undated on purpose and are therefore not
   * indexable; `competitors.ts` records which and why.
   */
  it("never marks a competitor indexable without a written page", () => {
    for (const competitor of COMPETITORS) {
      if (!competitor.indexable) continue;
      expect(
        compareSeoPage(competitor.slug),
        `competitor ${competitor.slug} is indexable but has no written page`,
      ).toBeDefined();
    }
  });

  /**
   * The converse, and the one that actually prevented a bad publish here: a
   * comparison page may state the other product's category ONLY when the
   * record carries a verification date. Without one, `compareSeoPage` must
   * omit the category section entirely rather than fall back to the catalog's
   * unverified guess.
   */
  it("omits the category contrast on an unverified comparison page", () => {
    const CATEGORY_HEADINGS = [
      "What a swipe-first app is good at, and what it costs",
      "Closer in philosophy, and the gap that remains",
      "An algorithm you can see the workings of",
      "Strong in one place, thin everywhere else",
    ];
    for (const competitor of COMPETITORS) {
      const page = compareSeoPage(competitor.slug);
      if (!page) continue;
      const headings = page.sections.map((section) => section.heading);
      const statesCategory = headings.some((heading) => CATEGORY_HEADINGS.includes(heading));
      expect(
        statesCategory,
        `${competitor.slug}: category claim must appear only with a verification date`,
      ).toBe(Boolean(competitor.factsVerifiedAt));
    }
  });
});

describe("catalog cross-checks", () => {
  it("gives every public market at least one city to link to", () => {
    for (const market of publicMarkets()) {
      expect(market.citySlugs.length, `${market.countryCode} has no cities`).toBeGreaterThan(0);
    }
  });

  it("does not use a market code as an audience or competitor slug", () => {
    const codes = new Set(MARKETS.map((market) => market.countryCode));
    for (const audience of AUDIENCES) expect(codes.has(audience.slug)).toBe(false);
    for (const competitor of COMPETITORS) expect(codes.has(competitor.slug)).toBe(false);
  });
});
