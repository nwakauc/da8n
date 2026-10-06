import type { Metadata } from "next";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { SitePage } from "@/components/SitePage";
import { REALME_PAGE } from "@/content/site-pages";

const PATH = "/realme";
const DESCRIPTION =
  "RealMe confirms a profile belongs to one real person who matches their photos, before they can message anyone. What it checks, and what it never shows.";

export const metadata: Metadata = buildPageMetadata({
  title: "RealMe verification",
  description: DESCRIPTION,
  path: PATH,
  indexable: true,
});

export default function Page() {
  const jsonLd = toJsonLdScript([
    webPageJsonLd({ path: PATH, name: "RealMe verification", description: DESCRIPTION }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "RealMe", path: PATH },
    ]),
  ]);

  return (
    <SitePage
      kicker={REALME_PAGE.kicker}
      title={REALME_PAGE.title}
      lede={REALME_PAGE.lede}
      sections={REALME_PAGE.sections}
      breadcrumb="RealMe"
      jsonLd={jsonLd}
    />
  );
}
