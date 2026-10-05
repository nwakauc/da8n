import { describe, expect, it } from "vitest";
import { routeCandidates, sitemapCandidates } from "./registry";
import { resolveMarketSegment, resolveTopLevel } from "@/lib/routing";
import { isTopLevelReserved } from "./reserved-slugs";
import { canonicalUrl, normalizePath } from "@/lib/seo";
import { MARKETS } from "./markets";

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
   * An empty sitemap is the correct state for a shell: it says "nothing here
   * deserves indexing", which is true. The first entry must be a deliberate
   * approval, and this test is what forces that — it fails the moment
   * something becomes indexable, so somebody has to look.
   */
  it("is empty until an entity is deliberately approved", () => {
    expect(sitemapCandidates()).toEqual([]);
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
