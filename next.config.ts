import type { NextConfig } from "next";
import path from "path";

/**
 * DA8N public site. This app is the public, server-rendered acquisition
 * surface: markets, cities, guides, comparisons and product explainers.
 *
 * It deliberately has NO authenticated area, NO API proxy and makes NO calls
 * to the D8N backend. The member application (sign-in, Discover, Likes, Chats,
 * Profile) stays in the existing Date9ja app until DA8N is proven; CTAs here
 * point at NEXT_PUBLIC_APP_ORIGIN. See README.md "The boundary".
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname),
  images: { formats: ["image/avif", "image/webp"] },
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
