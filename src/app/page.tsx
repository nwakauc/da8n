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
 * `indexable: true` as of 2026-10-05. It was false while three things were
 * outstanding; two of them are now decided and the third is unchanged:
 *
 *   1. STORIES — the owner confirms these are real members. Consent for each
 *      published quote is a content task tracked in `content/landing.ts`, not
 *      a code gate.
 *   2. MEMBERSHIP — the tiers are real and every CTA now goes to a real page.
 *      Two VIP lines still cannot be checked from this codebase (financial
 *      screening, background checks "included") and are flagged at the point
 *      of definition; they are claims, not placeholders.
 *   3. `DA8N_SEO_ENABLED=true` on production is STILL REQUIRED, and it is the
 *      site-wide switch in `robots.ts`. Nothing here is crawlable until it is
 *      set — this flag says the page deserves indexing, that one says when.
 *
 * Every link on this page resolves to a page that exists; `landing.test.ts`
 * asserts it, because an indexable page that links to 404s is worse than a
 * noindex one that does not.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "DA8N — meet someone real, anywhere",
  description: DESCRIPTION,
  path: "/",
  absoluteTitle: true,
  indexable: true,
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
      {/*
        Compatibility before Cities, which is v4's order and not an accident.
        "For You" finishes the argument How-it-works starts — you set
        intentions, you get verified, here is what an introduction actually
        looks like — and the city grid is the next question, not part of that
        answer. v3 had the grid cutting between the two.
      */}
      <Compatibility />
      <Cities />
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
