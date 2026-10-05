import type { Metadata } from "next";
import "./landing.css";
import { SITE_NAME, buildPageMetadata, faqJsonLd, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { FAQS } from "@/content/landing";
import { Hero } from "@/components/landing/Hero";
import { CityMarquee } from "@/components/landing/CityMarquee";
import { WhyDa8n } from "@/components/landing/WhyDa8n";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Cities } from "@/components/landing/Cities";
import { Compatibility } from "@/components/landing/Compatibility";
import { Safety } from "@/components/landing/Safety";
import { Stories } from "@/components/landing/Stories";
import { Membership } from "@/components/landing/Membership";
import { Faq } from "@/components/landing/Faq";
import { ClosingCta } from "@/components/landing/ClosingCta";

const DESCRIPTION =
  "DA8N is dating for people who actually want to meet. Verified with RealMe, clear intentions, and one global network — meet someone in your city or across borders.";

/**
 * DA8N home.
 *
 * `indexable: false`, still. The design has landed, but three things have to
 * be true before this page is allowed into an index, and none of them is a
 * code change:
 *
 *   1. `STORIES` carries real, consented testimonials instead of placeholders.
 *   2. The membership section's DRAFT claims are resolved — in particular the
 *      VIP tier's financial-screening and background-check promises.
 *   3. `DA8N_SEO_ENABLED=true` is set on production, which is the site-wide
 *      switch in `robots.ts`.
 *
 * Until then the page renders in full, is fast, is accessible, and is not
 * indexed. Those are not in tension: the fail-closed default means shipping
 * the design costs nothing in indexation risk.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "DA8N — meet someone real, anywhere",
  description: DESCRIPTION,
  path: "/",
  absoluteTitle: true,
  indexable: false,
});

export default function HomePage() {
  /*
   * FAQPage structured data, generated from the same `FAQS` array the FAQ
   * section renders. That identity is the point: the markup cannot describe a
   * question the page does not visibly answer, which is the one rule that
   * makes FAQ markup legitimate rather than a rich-result grab.
   *
   * Deliberately NOT emitted: Review, AggregateRating, or any Offer for the
   * membership tiers. There are no reviews, no ratings and no prices — markup
   * for them would be a fabrication regardless of how it rendered.
   */
  const jsonLd = [
    webPageJsonLd({
      path: "/",
      name: `${SITE_NAME} — meet someone real, anywhere`,
      description: DESCRIPTION,
    }),
    faqJsonLd(FAQS.map((faq) => ({ question: faq.question, answer: faq.answer }))),
  ];

  return (
    <>
      <Hero />
      <CityMarquee />
      <WhyDa8n />
      <HowItWorks />
      <Cities />
      <Compatibility />
      <Safety />
      <Stories />
      <Membership />
      <Faq />
      <ClosingCta />

      <script
        type="application/ld+json"
        // Escaped by toJsonLdScript; every value is a literal from content/.
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(jsonLd) }}
      />
    </>
  );
}
