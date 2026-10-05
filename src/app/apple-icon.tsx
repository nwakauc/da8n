import { ImageResponse } from "next/og";

/**
 * iOS home-screen icon, generated once at build time as a real PNG.
 *
 * Safari does not use an SVG favicon for "Add to Home Screen", so `icon.svg`
 * alone leaves an iOS shortcut showing a screenshot of the page instead of a
 * mark. That matters more here than on most sites: DA8N is a dating product
 * whose whole acquisition path ends on a phone.
 *
 * Two differences from `icon.svg`, both deliberate:
 *
 *   - No corner radius. iOS masks the icon with its own squircle, so rounding
 *     it here would either be clipped or show as a double-rounded edge with
 *     rose corners outside a lighter shape.
 *   - No transparency. Apple composites an opaque icon; a transparent PNG
 *     gets a black ground.
 *
 * The 8 is built from two bordered divs rather than inline SVG because Satori
 * (what ImageResponse renders with) handles box model and border-radius
 * reliably and SVG support is narrower.
 *
 * CAREFUL WITH THE SCALING, because the two models are not the same: an SVG
 * stroke is centred ON the radius, so a circle r=4.2 with stroke 3.3 has an
 * outer diameter of 11.7, not 8.4. A CSS border is drawn INSIDE the box. So
 * each ring's box is the SVG's OUTER diameter and the border is the stroke,
 * both scaled 180/32. Getting this wrong (box = 2r) silently produces a mark
 * that is a third too small and visibly chunkier than the favicon.
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
          background: "#ff4d6d",
          position: "relative",
        }}
      >
        {/* Upper ring. icon.svg r 4.2 + stroke 3.3 → outer 11.7, ×5.625. */}
        <div
          style={{
            position: "absolute",
            top: 32.3,
            left: 57.1,
            width: 65.8,
            height: 65.8,
            borderRadius: 65.8,
            border: "18.6px solid #fff7f8",
          }}
        />
        {/* Lower ring. r 5.3 + stroke 3.3 → outer 13.9, ×5.625. */}
        <div
          style={{
            position: "absolute",
            top: 70,
            left: 50.9,
            width: 78.2,
            height: 78.2,
            borderRadius: 78.2,
            border: "18.6px solid #fff7f8",
          }}
        />
      </div>
    ),
    size,
  );
}
