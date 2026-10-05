/**
 * The DA8N mark, in one place.
 *
 * WHAT IT IS
 * A heart with the 8 knocked out of it.
 *
 * The heart is not a new drawing — it is the exact path from
 * `apps/d8n/web/public/brands/dateza-mark.svg`, so DA8N wears the same heart
 * as its siblings rather than a near-miss of it. The family already has a
 * grammar: DateZA is the heart alone, Date9ja is the heart with "9ja" knocked
 * out, HookUs is a flame with a heart cut from it. DA8N is the heart with its
 * own character in it, which also reads as continuity for the Date9ja members
 * this product is the evolution of.
 *
 * WHY NOT THE 8 ALONE
 * The first version of this mark was the 8 as two rings on a rose square. It
 * was legible and it was wrong: an 8 in a square says "eight", not "dating".
 * Nothing about it placed the product in its category, and nothing connected
 * it to the three brands it sits beside. A mark that needs the wordmark next
 * to it to be understood is not doing its job in a 16px tab.
 *
 * WHY THE HEART IS FULL-BLEED AND NOT IN A ROUNDED SQUARE
 * Tested, not assumed — rendered at 16/24/32/96 and compared. Putting the
 * heart inside a square costs about 20% of its height, and the 8 inside it
 * shrinks by the same amount, at which point the counters close up below 32px
 * and the 8 reads as a snowman. Full-bleed buys back exactly the room the 8
 * needs. A shaped, transparent-cornered favicon is also simply how most
 * brands ship one.
 *
 * GEOMETRY NOTES
 * The 8 sits high in the heart, centred around y 14 of 32, not on the heart's
 * own centre. A heart tapers to a point, so a vertically stacked 8 placed by
 * its own geometry pushes out through the bottom — which is what the first
 * three attempts did. It is fitted to the wide band instead, the same place
 * Date9ja puts "9ja".
 *
 * Stroke 2.8/32 is ~1.4px at 16px. Below that the rings grey out; a solid 8
 * with punched counters was tried instead and read worse, because the
 * counters are what make an 8 an 8 and they are the first thing to close.
 *
 * ONE SOURCE, THREE ASSETS
 * `src/app/icon.svg` is a static file because that is Next's convention for a
 * favicon, so the artwork necessarily exists twice: there, and here for
 * `apple-icon.tsx` and `opengraph-image.tsx`, which render through Satori and
 * take it as an image. `mark.test.ts` asserts the two agree, so they cannot
 * drift — the usual failure where a logo is updated in one place and a stale
 * copy ships somewhere nobody looks.
 */

/** The DateZA heart, in its own 64x64 space. Shared across the brand family. */
export const HEART_PATH =
  "M32 53S10 39.6 10 24.8C10 16 16.8 10.2 24 10.2c3.4 0 6.4 1.4 8 3.6" +
  "1.6-2.2 4.6-3.6 8-3.6 7.2 0 14 5.8 14 14.6C54 39.6 32 53 32 53Z";

export const ROSE = "#ff4d6d";
export const CREAM = "#fff7f8";
/** The page ground, used where the mark needs an opaque tile (iOS). */
export const GROUND = "#fbf4ea";

/**
 * Heart scaled from its 64-space into the 32-space viewBox, filling it.
 * 44 and 42.8 are the heart's own width and height in 64-space; deriving the
 * transform from them rather than hardcoding it means the heart stays centred
 * if the path is ever replaced.
 */
const HEART_W = 44;
const HEART_H = 42.8;
const SCALE = 32 / HEART_W;
const TX = 16 - SCALE * 32;
const TY = (32 - SCALE * HEART_H) / 2 - SCALE * 10.2;

/** The 8, fitted to the heart's wide band. */
export const EIGHT = {
  cx: 16,
  top: { cy: 11.4, r: 3.0 },
  bottom: { cy: 16.6, r: 3.7 },
  stroke: 2.8,
} as const;

export const HEART_TRANSFORM = `translate(${round(TX)},${round(TY)}) scale(${round(SCALE)})`;

function round(value: number): number {
  return Math.round(value * 10000) / 10000;
}

/**
 * The mark as standalone SVG markup.
 *
 * `background` paints an opaque rounded tile behind the heart — iOS composites
 * home-screen icons on black, so a transparent PNG there is not an option.
 * Omit it for the favicon and the share card, where the heart's own silhouette
 * is the shape.
 */
export function markSvg({ background }: { background?: string } = {}): string {
  const tile = background
    ? `<rect width="32" height="32" rx="9" fill="${background}"/>`
    : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    tile +
    `<g transform="${HEART_TRANSFORM}"><path d="${HEART_PATH}" fill="${ROSE}"/></g>` +
    `<g fill="none" stroke="${CREAM}" stroke-width="${EIGHT.stroke}">` +
    `<circle cx="${EIGHT.cx}" cy="${EIGHT.top.cy}" r="${EIGHT.top.r}"/>` +
    `<circle cx="${EIGHT.cx}" cy="${EIGHT.bottom.cy}" r="${EIGHT.bottom.r}"/>` +
    `</g></svg>`
  );
}

/**
 * A data URI for the mark. Satori renders `opengraph-image.tsx` and
 * `apple-icon.tsx`, and its SVG support is narrower than a browser's — an
 * `<img>` with a base64 data URI is the path it handles reliably, and it means
 * both PNGs are rasterised from the same artwork as the favicon rather than
 * rebuilt out of divs, which is how the first cut of `apple-icon.tsx` ended up
 * a third too small.
 */
export function markDataUri(options?: { background?: string }): string {
  const encoded = Buffer.from(markSvg(options), "utf8").toString("base64");
  return `data:image/svg+xml;base64,${encoded}`;
}
