import type { Metadata } from "next";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { SitePage } from "@/components/SitePage";
import { HOW_PAGE } from "@/content/site-pages";

const PATH = "/how-it-works";
const DESCRIPTION =
  "Four steps to a profile that finds the right people, plus For You and Ready — the two features that make DA8N different once you are in.";

export const metadata: Metadata = buildPageMetadata({
  title: "How DA8N works",
  description: DESCRIPTION,
  path: PATH,
  indexable: true,
});

export default function Page() {
  const jsonLd = toJsonLdScript([
    webPageJsonLd({ path: PATH, name: "How DA8N works", description: DESCRIPTION }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "How it works", path: PATH },
    ]),
  ]);

  return (
    <SitePage
      kicker={HOW_PAGE.kicker}
      title={HOW_PAGE.title}
      lede={HOW_PAGE.lede}
      sections={HOW_PAGE.sections}
      breadcrumb="How it works"
      jsonLd={jsonLd}
    />
  );
}
