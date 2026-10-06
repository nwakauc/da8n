import type { Metadata } from "next";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { SitePage } from "@/components/SitePage";
import { ABOUT_PAGE } from "@/content/site-pages";

const PATH = "/about";
const DESCRIPTION =
  "DA8N is one global network with localized entry points — verified, clear about intention, and built for lives that cross borders.";

export const metadata: Metadata = buildPageMetadata({
  title: "About DA8N",
  description: DESCRIPTION,
  path: PATH,
  indexable: true,
});

export default function Page() {
  const jsonLd = toJsonLdScript([
    webPageJsonLd({ path: PATH, name: "About DA8N", description: DESCRIPTION }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "About", path: PATH },
    ]),
  ]);

  return (
    <SitePage
      kicker={ABOUT_PAGE.kicker}
      title={ABOUT_PAGE.title}
      lede={ABOUT_PAGE.lede}
      sections={ABOUT_PAGE.sections}
      breadcrumb="About"
      jsonLd={jsonLd}
    />
  );
}
