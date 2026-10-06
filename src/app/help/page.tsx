import type { Metadata } from "next";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { SitePage } from "@/components/SitePage";
import { HELP_PAGE } from "@/content/site-pages";

const PATH = "/help";
const DESCRIPTION =
  "Where to go for safety concerns, account and membership questions, deleting your account, and data and privacy.";

export const metadata: Metadata = buildPageMetadata({
  title: "Help",
  description: DESCRIPTION,
  path: PATH,
  indexable: false,
});

export default function Page() {
  const jsonLd = toJsonLdScript([
    webPageJsonLd({ path: PATH, name: "Help", description: DESCRIPTION }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "Help", path: PATH },
    ]),
  ]);

  return (
    <SitePage
      kicker={HELP_PAGE.kicker}
      title={HELP_PAGE.title}
      lede={HELP_PAGE.lede}
      sections={HELP_PAGE.sections}
      breadcrumb="Help"
      jsonLd={jsonLd}
    />
  );
}
