import type { MetadataRoute } from "next";
import { sitemapCandidates } from "@/content/registry";
import { canonicalUrl, getSiteUrl } from "@/lib/seo";

/**
 * Only approved, quality-gated routes. Reads exclusively from the registry, so
 * a sitemap entry for an unknown route is impossible by construction.
 *
 * Empty while the shell has no approved content — see `sitemapCandidates`.
 * An empty sitemap is correct here; a sitemap full of placeholders is not.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();
  return sitemapCandidates().map((candidate) => ({
    url: canonicalUrl(candidate.path, siteUrl),
    lastModified,
    changeFrequency: candidate.changeFrequency,
    priority: candidate.priority,
  }));
}
