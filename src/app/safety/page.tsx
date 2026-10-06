import type { Metadata } from "next";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { SitePage } from "@/components/SitePage";
import { SAFETY_PAGE } from "@/content/site-pages";

const PATH = "/safety";
const DESCRIPTION =
  "How DA8N keeps dating safe: RealMe identity checks, fraud detection in chat, reporting reviewed by a person, and Date Check-in.";

export const metadata: Metadata = buildPageMetadata({
  title: "Safety Centre",
  description: DESCRIPTION,
  path: PATH,
  indexable: true,
});

export default function Page() {
  const jsonLd = toJsonLdScript([
    webPageJsonLd({ path: PATH, name: "Safety Centre", description: DESCRIPTION }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "Safety", path: PATH },
    ]),
  ]);

  return (
    <SitePage
      kicker={SAFETY_PAGE.kicker}
      title={SAFETY_PAGE.title}
      lede={SAFETY_PAGE.lede}
      sections={SAFETY_PAGE.sections}
      breadcrumb="Safety"
      jsonLd={jsonLd}
    />
  );
}
