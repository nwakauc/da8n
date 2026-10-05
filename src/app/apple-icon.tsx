import { ImageResponse } from "next/og";
import { GROUND, markDataUri } from "@/lib/mark";

/**
 * iOS home-screen icon, generated once at build time as a real PNG.
 *
 * Safari does not use an SVG favicon for "Add to Home Screen", so `icon.svg`
 * alone leaves an iOS shortcut showing a screenshot of the page instead of a
 * mark. That matters more here than on most sites: DA8N is a dating product
 * whose whole acquisition path ends on a phone.
 *
 * Two differences from the favicon, both forced by the platform:
 *
 *   - It is opaque. iOS composites a home-screen icon on black, so the
 *     transparent corners that make the favicon a heart silhouette would put
 *     a rose heart on a black tile. It gets the page's own cream ground —
 *     which is also what the favicon looks like on any light tab strip, so
 *     the two read as the same mark.
 *   - No corner radius of its own. iOS masks with its own squircle, so
 *     rounding here would be clipped or show as a double edge.
 *
 * The artwork is the favicon's, rasterised from `lib/mark.ts` as an image
 * rather than rebuilt out of divs. Rebuilding it was the previous approach and
 * it shipped a mark a third too small, because an SVG stroke is centred on the
 * radius while a CSS border is drawn inside the box. `mark.test.ts` holds the
 * SVG and `icon.svg` in step.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: GROUND,
        }}
      >
        {/*
          Inset so the heart is not flush to the tile edge, and so the corners
          iOS rounds away contain ground rather than artwork.
        */}
        <img src={markDataUri()} width={140} height={140} alt="" />
      </div>
    ),
    size,
  );
}
