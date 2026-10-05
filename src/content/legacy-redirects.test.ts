import { describe, expect, it } from "vitest";
import {
  DATE9JA_REDIRECTS,
  DATEZA_REDIRECTS,
  LEGACY_REDIRECTS,
  findLegacyRedirect,
  lossyRedirects,
} from "./legacy-redirects";
import { resolveMarketSegment, resolveTopLevel } from "@/lib/routing";
import { isTopLevelReserved } from "./reserved-slugs";
import { normalizePath } from "@/lib/seo";

describe("legacy map shape", () => {
  it("covers both legacy brands", () => {
    expect(DATE9JA_REDIRECTS.length).toBeGreaterThan(0);
    expect(DATEZA_REDIRECTS.length).toBeGreaterThan(0);
    expect(LEGACY_REDIRECTS.length).toBe(DATE9JA_REDIRECTS.length + DATEZA_REDIRECTS.length);
  });

  it("stores every source path already normalized", () => {
    for (const entry of LEGACY_REDIRECTS) {
      expect(entry.from).toBe(normalizePath(entry.from));
    }
  });

  it("stores every destination already normalized", () => {
    for (const entry of LEGACY_REDIRECTS) {
      expect(entry.to).toBe(normalizePath(entry.to));
    }
  });

  /**
   * Keyed by host AND path, because both legacy sites use slugs the other also
   * uses — `/johannesburg` on Date9ja and `/dating/johannesburg` on DateZA
   * target different intents. A path-only map would silently mis-route one.
   */
  it("has no duplicate host+path key", () => {
    const seen = new Set<string>();
    for (const entry of LEGACY_REDIRECTS) {
      const key = `${entry.host}${entry.from}`;
      expect(seen.has(key), `duplicate legacy key ${key}`).toBe(false);
      seen.add(key);
    }
  });
});

describe("redirect safety", () => {
  it("never redirects a path to itself", () => {
    for (const entry of LEGACY_REDIRECTS) {
      // Same path across different hosts is fine and expected (/about → /about).
      // Same host and same path is a loop.
      if (entry.from === entry.to) {
        expect(entry.host.replace(/^www\./, "")).not.toBe("da8n.com");
      }
    }
  });

  /**
   * No chains: a destination must be a final DA8N URL, never another entry's
   * source. A chain costs a hop of link equity and a redirect loop costs the
   * page entirely.
   */
  it("has no redirect chains", () => {
    const sources = new Set(LEGACY_REDIRECTS.map((entry) => entry.from));
    for (const entry of LEGACY_REDIRECTS) {
      // A destination may coincide with a legacy source path only if it is a
      // genuinely different host's page (e.g. /about on both). What must never
      // happen is a DA8N destination that is itself remapped onward.
      if (sources.has(entry.to)) {
        const onward = LEGACY_REDIRECTS.filter((other) => other.from === entry.to);
        for (const next of onward) {
          expect(next.to, `chain: ${entry.from} -> ${entry.to} -> ${next.to}`).toBe(entry.to);
        }
      }
    }
  });

  it("resolves every destination under the DA8N route grammar", () => {
    for (const entry of LEGACY_REDIRECTS) {
      const segments = entry.to.split("/").filter(Boolean);
      if (segments.length === 0) continue; // root

      const [first, second] = segments;
      if (isTopLevelReserved(first!)) continue; // /guides/..., /safety, /audiences/...

      const top = resolveTopLevel(first!);
      expect(top.kind, `legacy destination ${entry.to} has no market or reserved namespace`).toBe("market");

      if (second) {
        const resolved = resolveMarketSegment(first!, second);
        expect(
          ["city", "reserved"].includes(resolved.kind),
          `legacy destination ${entry.to} does not resolve: ${resolved.kind}`,
        ).toBe(true);
        // A destination must never be an alias — that would be a chain.
        expect(resolved.kind).not.toBe("redirect");
      }
    }
  });
});

describe("findLegacyRedirect", () => {
  it("finds an entry by host and path", () => {
    expect(findLegacyRedirect("www.date9ja.love", "/lagos")?.to).toBe("/ng/lagos");
  });

  it("treats the apex and www of a legacy brand as the same map", () => {
    expect(findLegacyRedirect("date9ja.love", "/lagos")?.to).toBe("/ng/lagos");
    expect(findLegacyRedirect("date-za.com", "/dating/durban")?.to).toBe("/za/durban");
  });

  it("normalizes case, trailing slashes and query strings", () => {
    expect(findLegacyRedirect("WWW.Date9ja.Love", "/Lagos/?utm_source=x")?.to).toBe("/ng/lagos");
  });

  it("does not match a path from the other brand's map", () => {
    expect(findLegacyRedirect("www.date-za.com", "/lagos")).toBeUndefined();
    expect(findLegacyRedirect("www.date9ja.love", "/dating/durban")).toBeUndefined();
  });

  it("returns nothing for an unmapped path", () => {
    expect(findLegacyRedirect("www.date9ja.love", "/not-a-page")).toBeUndefined();
  });
});

describe("intent preservation", () => {
  /**
   * Stage 0 §Y: do NOT collapse a diaspora page to its destination market. A
   * Nigerian-diaspora page targeting the UK answers a different question than
   * a UK-general dating page, and collapsing it throws away the ranking the
   * old page earned.
   */
  it("maps Date9ja's diaspora country pages to diaspora corridors, not to the market", () => {
    const corridors: Array<[string, string]> = [
      ["/united-kingdom", "/gb/diaspora/ng"],
      ["/united-states", "/us/diaspora/ng"],
      ["/canada", "/ca/diaspora/ng"],
      ["/south-africa", "/za/diaspora/ng"],
    ];
    for (const [from, to] of corridors) {
      const entry = findLegacyRedirect("www.date9ja.love", from);
      expect(entry?.to, `${from} must preserve diaspora intent`).toBe(to);
    }
  });

  it("maps Nigeria's general country page to the market itself", () => {
    expect(findLegacyRedirect("www.date9ja.love", "/nigeria")?.to).toBe("/ng");
  });

  it("maps DateZA city pages to the matching DA8N city", () => {
    const cities = ["cape-town", "johannesburg", "pretoria", "durban", "gqeberha", "bloemfontein"];
    for (const slug of cities) {
      expect(findLegacyRedirect("www.date-za.com", `/dating/${slug}`)?.to).toBe(`/za/${slug}`);
    }
  });

  /**
   * Every lossy mapping is an open decision, not an accepted loss. This test
   * pins the known set so a new one cannot be added silently — adding one
   * means updating this list, which means somebody noticed.
   */
  it("has exactly the known set of lossy mappings", () => {
    const lossy = lossyRedirects().map((entry) => `${entry.host}${entry.from}`);
    expect(lossy.sort()).toEqual(
      [
        "www.date-za.com/lifestyle",
        "www.date-za.com/singles",
        "www.date9ja.love/houston",
        "www.date9ja.love/johannesburg",
        "www.date9ja.love/london",
        "www.date9ja.love/meet-nigerians-abroad",
        "www.date9ja.love/toronto",
      ].sort(),
    );
  });

  it("gives every lossy mapping a note explaining what is lost", () => {
    for (const entry of lossyRedirects()) {
      expect(entry.note, `${entry.from} is lossy with no note`).toBeTruthy();
    }
  });
});
