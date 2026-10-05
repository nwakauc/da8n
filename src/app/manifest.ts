import type { MetadataRoute } from "next";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";

/**
 * Web app manifest.
 *
 * Without one, Android Chrome has no icon for "Add to Home Screen" and falls
 * back to a screenshot, and the browser chrome stays its default colour on a
 * cream site. `icon.svg` covers desktop tabs and `apple-icon.tsx` covers iOS;
 * this is the third of the three, and the one that is easiest to forget
 * because no desktop browser shows you it is missing.
 *
 * DELIBERATELY NOT A PWA. `display` is `browser`, not `standalone`. This is a
 * marketing site with no offline story, no service worker and no app shell;
 * claiming standalone display would hand someone a home-screen icon that
 * opens a chromeless window with no back button around what is still just a
 * website. The DA8N app that deserves `standalone` is the membership app, and
 * it lives on another host entirely — see README "The boundary".
 *
 * The SVG icon is declared with `sizes: "any"`, which Chrome has supported for
 * manifest icons for years and which avoids generating and shipping a pair of
 * PNGs that would then have to be kept in step with `icon.svg` by hand.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — pronounced dating`,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "browser",
    background_color: "#fbf4ea",
    theme_color: "#fbf4ea",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
