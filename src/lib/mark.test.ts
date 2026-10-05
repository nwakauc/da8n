import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { EIGHT, HEART_PATH, HEART_TRANSFORM, markDataUri, markSvg, ROSE, CREAM } from "./mark";

/**
 * The favicon and the generated PNGs must be the same mark.
 *
 * `src/app/icon.svg` has to be a static file — that is Next's convention for a
 * favicon — while `apple-icon.tsx` and `opengraph-image.tsx` render through
 * Satori and need the artwork as a value. So it exists twice, which is the
 * standard way a logo ends up updated in one place with a stale copy still
 * shipping somewhere nobody looks.
 *
 * These assert the two agree. They are cheap, they are the only thing standing
 * between a redraw and a mismatched set, and they run in the existing node
 * environment with no new dependency.
 */
const iconSvg = readFileSync(
  path.join(import.meta.dirname, "..", "app", "icon.svg"),
  "utf8",
);

describe("the DA8N mark", () => {
  it("uses the same heart path in icon.svg as in mark.ts", () => {
    expect(iconSvg).toContain(HEART_PATH);
  });

  it("positions the heart identically in both", () => {
    expect(iconSvg).toContain(`transform="${HEART_TRANSFORM}"`);
  });

  it("draws the same 8 in both", () => {
    expect(iconSvg).toContain(`stroke-width="${EIGHT.stroke}"`);
    // SVG drops a trailing ".0"; compare on Number so 3 and 3.0 both pass.
    for (const ring of [EIGHT.top, EIGHT.bottom]) {
      const match = iconSvg.match(new RegExp(`cy="${ring.cy}" r="([\\d.]+)"`));
      expect(match, `no circle at cy=${ring.cy} in icon.svg`).not.toBeNull();
      expect(Number(match![1])).toBe(ring.r);
    }
  });

  it("uses the brand colours in both", () => {
    expect(iconSvg).toContain(ROSE);
    expect(iconSvg).toContain(CREAM);
    expect(markSvg()).toContain(ROSE);
    expect(markSvg()).toContain(CREAM);
  });

  it("leaves the favicon transparent and tiles only when asked", () => {
    // Full-bleed is the whole reason the 8 fits; a stray background rect would
    // shrink nothing but would break the silhouette the favicon relies on.
    expect(iconSvg).not.toContain("<rect");
    expect(markSvg()).not.toContain("<rect");
    expect(markSvg({ background: "#fbf4ea" })).toContain("<rect");
  });

  it("keeps the 8 inside the heart", () => {
    /*
     * The failure this catches is real and happened three times while the mark
     * was being drawn: a heart tapers to a point, so an 8 sized by its own
     * geometry pokes out through the bottom. The heart's lowest point is y=53
     * in its own 64-space; transformed, that is where the silhouette ends.
     */
    const scale = Number(HEART_TRANSFORM.match(/scale\(([\d.]+)\)/)![1]);
    const ty = Number(HEART_TRANSFORM.match(/translate\([-\d.]+,([-\d.]+)\)/)![1]);
    const heartBottom = scale * 53 + ty;
    const eightBottom = EIGHT.bottom.cy + EIGHT.bottom.r + EIGHT.stroke / 2;
    expect(eightBottom).toBeLessThan(heartBottom);

    const heartTop = scale * 10.2 + ty;
    const eightTop = EIGHT.top.cy - EIGHT.top.r - EIGHT.stroke / 2;
    expect(eightTop).toBeGreaterThan(heartTop);
  });

  it("keeps the 8 readable: the rings overlap rather than stack", () => {
    const gap = EIGHT.bottom.cy - EIGHT.top.cy;
    const radii = EIGHT.top.r + EIGHT.bottom.r;
    expect(gap).toBeLessThan(radii); // they intersect, so it reads as one glyph
    expect(gap).toBeGreaterThan(radii * 0.5); // but are not concentric
  });

  it("produces a base64 SVG data URI for Satori", () => {
    const uri = markDataUri();
    expect(uri.startsWith("data:image/svg+xml;base64,")).toBe(true);
    const decoded = Buffer.from(uri.split(",")[1]!, "base64").toString("utf8");
    expect(decoded).toBe(markSvg());
  });
});
