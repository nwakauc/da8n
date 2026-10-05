import { ImageResponse } from "next/og";
import { HERO, SHARE_SUBLINE } from "@/content/landing";

/**
 * The share card: what a DA8N link renders as in a message, a post or a
 * preview. Generated once at build time as a real PNG, and because it sits at
 * the root of the app directory it applies to every route.
 *
 * This site previously had none at all. `buildPageMetadata` sets
 * `twitter: { card: "summary_large_image" }` on every page, so every shared
 * link was requesting a large image card and supplying no image — which
 * renders as a bare grey box with a domain under it. For a product whose
 * entire acquisition model is people sending each other links, that is the
 * single most-seen piece of unbuilt design on the site.
 *
 * COPY lives in `content/landing.ts` like every other string, so the card
 * cannot drift from the page it links to. See `SHARE_SUBLINE` there for why
 * the subline is its own string rather than the footer tagline or
 * `HERO.subTitle`.
 *
 * No web font is loaded. Fetching one at build time would make the build
 * depend on a third-party host — the same reason the site self-hosts its
 * typefaces — so the card is set in what the renderer already has. It is the
 * one DA8N surface that is not Bricolage and Manrope.
 *
 * SATORI CONSTRAINTS, because they shape the markup below and look arbitrary
 * otherwise. ImageResponse renders through Satori, not a browser: any element
 * with more than one child needs an explicit `display`, and there is no inline
 * layout — a `<span>` inside a run of text does not flow, it becomes a flex
 * item. So the headline is two stacked rows rather than one sentence with a
 * coloured span, and the wordmark is three boxes in a row. The headline reads
 * better stacked on a 1200x630 card anyway.
 */
export const alt = `DA8N — ${HERO.title}${HERO.titleAccent}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbf4ea",
          color: "#231c17",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* The mark — icon.svg geometry scaled 76/32. See apple-icon.tsx
              for why the box is the outer diameter and not 2r. */}
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 22,
              background: "#ff4d6d",
              display: "flex",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 13.7,
                left: 24.1,
                width: 27.8,
                height: 27.8,
                borderRadius: 27.8,
                border: "7.8px solid #fff7f8",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 29.6,
                left: 21.5,
                width: 33,
                height: 33,
                borderRadius: 33,
                border: "7.8px solid #fff7f8",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 800, letterSpacing: -2 }}>
              <div style={{ display: "flex" }}>da</div>
              <div style={{ display: "flex", color: "#ff4d6d" }}>8</div>
              <div style={{ display: "flex" }}>n</div>
            </div>
            <div style={{ display: "flex", fontSize: 24, color: "#5d5348" }}>
              pronounced dating
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 78,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1.06,
            }}
          >
            <div style={{ display: "flex" }}>{HERO.title.trim()}</div>
            <div style={{ display: "flex", color: "#ff4d6d" }}>{HERO.titleAccent}</div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 29,
              color: "#5d5348",
              lineHeight: 1.35,
              maxWidth: 940,
            }}
          >
            {SHARE_SUBLINE}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 23,
            color: "#5d5348",
          }}
        >
          <div style={{ display: "flex", color: "#0d7a43", fontWeight: 700 }}>
            Powered by D8N
          </div>
          <div style={{ display: "flex" }}>·</div>
          <div style={{ display: "flex" }}>Adults 18+</div>
        </div>
      </div>
    ),
    size,
  );
}
