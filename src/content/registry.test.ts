import { describe, expect, it } from "vitest";
import { routeCandidates, sitemapCandidates } from "./registry";
import { resolveMarketSegment, resolveTopLevel } from "@/lib/routing";
import { isTopLevelReserved } from "./reserved-slugs";
import { canonicalUrl, normalizePath } from "@/lib/seo";
import { MARKETS } from "./markets";
import { findAudience } from "./audiences";
import { findCompetitor } from "./competitors";
import { audiencePagePath, audiencePages } from "./audience-pages";
import { comparePagePath, comparePages } from "./compare-pages";
import { assessIndexability, findDuplicates } from "@/lib/indexability";

describe("route registry", () => {
  it("stores every path normalized", () => {
    for (const candidate of routeCandidates()) {
      expect(candidate.path).toBe(normalizePath(candidate.path));
    }
  });

  it("has no duplicate path", () => {
    const paths = routeCandidates().map((candidate) => candidate.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("produces a unique canonical URL for every route", () => {
    const canonicals = routeCandidates().map((candidate) => canonicalUrl(candidate.path));
    expect(new Set(canonicals).size).toBe(canonicals.length);
  });

  it("resolves every market and city route under the grammar", () => {
    for (const candidate of routeCandidates()) {
      if (candidate.kind !== "market" && candidate.kind !== "city") continue;
      const [first, second] = candidate.path.split("/").filter(Boolean);
      expect(resolveTopLevel(first!).kind).toBe("market");
      if (second) expect(resolveMarketSegment(first!, second).kind).toBe("city");
    }
  });

  it("keeps every static route inside a reserved namespace or the root", () => {
    for (const candidate of routeCandidates()) {
      if (candidate.kind !== "static") continue;
      if (candidate.path === "/") continue;
      const [first] = candidate.path.split("/").filter(Boolean);
      expect(isTopLevelReserved(first!), `static route ${candidate.path} is not reserved`).toBe(true);
    }
  });

  it("gives no route to a planned market", () => {
    const planned = MARKETS.filter((market) => market.status === "planned").map(
      (market) => market.countryCode,
    );
    for (const code of planned) {
      const leaked = routeCandidates().filter((candidate) =>
        candidate.path === `/${code}` || candidate.path.startsWith(`/${code}/`),
      );
      expect(leaked, `planned market ${code} has public routes`).toEqual([]);
    }
  });
});

describe("sitemap", () => {
  /**
   * This used to assert the sitemap was EMPTY, which was right while nothing
   * was written: the first entry had to be a deliberate approval, and the test
   * was what forced somebody to look. On 2026-10-05 somebody looked — the
   * product pages and the guides were written — and the assertion changed from
   * "nothing" to "exactly these".
   *
   * It does the same job either way. Adding a route to the sitemap still fails
   * this test until a human adds it here too, which is the point: an indexable
   * page is a decision, never a side effect of adding a file.
   *
   * SECOND EXPANSION, same date: the eleven audience pages and five of the
   * eight comparison pages. Two things about that five are worth reading off
   * this list rather than from a comment, because this list is the thing that
   * cannot drift:
   *
   *   `/compare/bumble`, `/compare/match` and `/compare/badoo` are ABSENT.
   *   All three are built, served and linked from `/compare`. None carries a
   *   `factsVerifiedAt` date, so `isIndexable` refuses them — nobody had to
   *   remember to exclude them, and nobody can include them by editing a
   *   boolean. See `content/competitors.ts` for what was checked and what
   *   was not.
   *
   *   Every path here was COMPUTED by the indexability gate, not asserted by
   *   hand. Before this change `src/lib/indexability.ts` was tested and
   *   called by nothing; the audience and comparison routes are the first
   *   consumers, and the registry now shares their verdict so the sitemap and
   *   each page's robots meta cannot disagree.
   */
  it("contains exactly the routes a human has approved", () => {
    expect(sitemapCandidates().map((candidate) => candidate.path).sort()).toEqual([
      "/",
      "/about",
      "/audiences",
      "/audiences/afro-dating",
      "/audiences/dating-over-40",
      "/audiences/dating-over-50",
      "/audiences/intentional-dating",
      "/audiences/international-dating",
      "/audiences/long-distance",
      "/audiences/marriage-minded",
      "/audiences/nigerian-dating",
      "/audiences/senior-dating",
      "/audiences/serious-relationships",
      "/audiences/south-african-dating",
      "/compare",
      "/compare/eharmony",
      "/compare/grindr",
      "/compare/hinge",
      "/compare/tinder",
      "/compare/zoosk",
      "/guides",
      "/guides/better-first-date",
      "/guides/dating-someone-in-another-city",
      "/guides/meeting-the-family-for-the-first-time",
      "/guides/profile-people-remember",
      "/guides/recognise-romance-scam-patterns",
      "/how-it-works",
      "/realme",
      "/safety",
    ]);
  });

  /**
   * REPLACES "admits no catalog-derived route".
   *
   * The old test said: nothing whose copy comes from a catalog may be
   * indexed, because catalog-derived copy is thin copy and thin pages at scale
   * are the specific failure mode a programmatic SEO site dies of. That
   * reasoning is right and it is the reason `/cities`, `/markets` and every
   * market and city route are still absent from the sitemap.
   *
   * What it conflated is WHERE A ROUTE COMES FROM with HOW ITS COPY WAS MADE.
   * An audience route is catalog-derived in origin and hand-written in
   * substance — eleven records of written prose in `content/audience-pages.ts`,
   * each with its own sections and FAQs. Judging it by its `kind` would keep
   * out written pages while, in principle, letting a thin `static` one in.
   *
   * So the rule is enforced where it belongs: on the content. Market and city
   * routes stay out, and everything that is in cleared the measured floor —
   * intro length, section and FAQ counts, body size, internal links, title and
   * description limits, and the private-data scan.
   */
  it("keeps catalog-derived copy out of the sitemap", () => {
    for (const candidate of sitemapCandidates()) {
      expect(
        ["market", "city", "diaspora"],
        `${candidate.path} is catalog-derived copy and must not be indexable`,
      ).not.toContain(candidate.kind);
    }
  });

  /**
   * The measured floor, re-checked here against the assembled records rather
   * than trusting that the registry called the gate. If `routeCandidates`
   * were ever changed back to reading a raw boolean, this fails.
   */
  it("admits no page that fails the quality floor", () => {
    const paths = new Set(sitemapCandidates().map((candidate) => candidate.path));

    for (const page of audiencePages()) {
      const audience = findAudience(page.slug);
      const verdict = assessIndexability(page, {
        entityIndexable: audience?.indexable ?? false,
        entityExists: Boolean(audience),
      });
      expect(
        paths.has(audiencePagePath(page.slug)),
        `/audiences/${page.slug}: sitemap and gate disagree (${JSON.stringify(verdict)})`,
      ).toBe(verdict.verdict === "indexable");
    }

    for (const page of comparePages()) {
      const competitor = findCompetitor(page.slug);
      const verdict = assessIndexability(page, {
        entityIndexable: competitor?.indexable ?? false,
        entityExists: Boolean(competitor),
        claimsDecay: true,
      });
      expect(
        paths.has(comparePagePath(page.slug)),
        `/compare/${page.slug}: sitemap and gate disagree (${JSON.stringify(verdict)})`,
      ).toBe(verdict.verdict === "indexable");
    }
  });

  /**
   * Site-wide uniqueness across the programmatic surface. Two indexable pages
   * sharing a title, an H1 or a canonical compete with each other, which is
   * the most common way a page set like this damages itself — and the most
   * likely outcome of writing nineteen pages about one product. `findDuplicates`
   * existed for this and, like the rest of the engine, had no caller.
   */
  it("gives every programmatic page a unique title, h1 and canonical", () => {
    const pages = [...audiencePages(), ...comparePages()].map((page) => ({
      title: page.title,
      h1: page.h1,
      canonical: page.slug,
    }));
    const duplicates = findDuplicates(pages);
    expect(duplicates.titles).toEqual([]);
    expect(duplicates.canonicals).toEqual([]);
    /*
     * H1s are allowed to repeat ONLY across the comparison pages that describe
     * DA8N alone — the three with no verification date share "What DA8N does
     * differently." deliberately, because they are the same page with a
     * different name in the breadcrumb. They are not indexable, so they cannot
     * compete with each other in a search index. Titles and canonicals still
     * have to be unique, which is what the two assertions above cover.
     */
    const indexablePaths = new Set(sitemapCandidates().map((candidate) => candidate.path));
    const indexableH1s = [
      ...audiencePages().filter((page) => indexablePaths.has(audiencePagePath(page.slug))),
      ...comparePages().filter((page) => indexablePaths.has(comparePagePath(page.slug))),
    ].map((page) => page.h1);
    expect(new Set(indexableH1s).size).toBe(indexableH1s.length);
  });

  it("only ever contains entity-approved routes", () => {
    for (const candidate of sitemapCandidates()) {
      expect(candidate.entityIndexable).toBe(true);
    }
  });

  /**
   * The invariant that matters most: no member or authenticated surface can
   * ever reach a public sitemap. These paths are not even served by this app,
   * but they are reserved in the grammar and will be eventually.
   */
  it("never contains a member or authenticated path", () => {
    const forbidden = [
      "/sign-in",
      "/sign-up",
      "/onboarding",
      "/discover",
      "/likes",
      "/chats",
      "/profile",
      "/settings",
      "/notifications",
      "/api",
    ];
    for (const candidate of sitemapCandidates()) {
      for (const path of forbidden) {
        expect(candidate.path === path || candidate.path.startsWith(`${path}/`)).toBe(false);
      }
    }
  });

  it("never contains a utility page that is deliberately unindexed", () => {
    const utility = ["/help", "/privacy", "/terms"];
    const paths = sitemapCandidates().map((candidate) => candidate.path);
    for (const path of utility) expect(paths).not.toContain(path);
  });
});
