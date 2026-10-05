import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

/**
 * DA8N is noindex site-wide until SEO is deliberately switched on.
 *
 * `DA8N_SEO_ENABLED=true` is required to allow crawling, and it is set on the
 * production deployment only. The reasons this is the default:
 *
 *   - This is a shell awaiting design direction. An indexed placeholder is a
 *     real cost: it ranks for the brand, then has to be re-crawled and
 *     re-evaluated once the real pages land.
 *   - Preview deployments must never be crawlable. Vercel previews are public
 *     URLs, and a crawled preview is a duplicate of production.
 *   - Domain cutover has to stay reversible, which it is not once a half-built
 *     site is in the index.
 *
 * Even when enabled, the member application paths are disallowed. They are not
 * served by this app at all today — they live in the Date9ja app — but they
 * are reserved in the route grammar and will be served here eventually, and a
 * robots rule that predates the route is cheaper than one that follows it.
 */
const MEMBER_AND_PRIVATE_PATHS: readonly string[] = [
  "/sign-in",
  "/sign-up",
  "/onboarding",
  "/discover",
  "/likes",
  "/chats",
  "/profile",
  "/settings",
  "/notifications",
  "/api/",
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const enabled = process.env.DA8N_SEO_ENABLED === "true";

  if (!enabled) {
    return { rules: [{ userAgent: "*", disallow: "/" }], host: siteUrl };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...MEMBER_AND_PRIVATE_PATHS],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
