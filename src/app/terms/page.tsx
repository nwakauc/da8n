import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { Awaiting, LegalHeader, LegalReviewBanner } from "@/components/legal/LegalDoc";

/**
 * Terms of use for the DA8N public website.
 *
 * Scope note: these are terms for reading THIS SITE. The membership
 * agreement — the contract that governs having a DA8N account, a profile and
 * conversations with other members — belongs to the membership app and is
 * agreed at sign-up. Conflating the two would be the common and expensive
 * mistake: it would imply this site can bind someone to member obligations
 * they have not seen, and it would leave the actual membership contract
 * undisplayed at the point it is entered.
 *
 * Section 4 is the one that is doing real work. The landing page shows
 * membership tiers with prices absent, feature lists that include unbuilt
 * capabilities, example profiles of people who do not exist, and placeholder
 * couple stories. Each of those is already labelled in the interface — DRAFT
 * stamps, "Example profile", "Illustration — not yet a real member story" —
 * and section 4 is the matching statement in the terms, so the position is
 * consistent in both places rather than only in the one a regulator is less
 * likely to read.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Terms",
  description:
    "The terms for using the DA8N website. Membership of DA8N is governed by a separate agreement in the app.",
  path: "/terms",
  indexable: false,
});

export default function TermsPage() {
  return (
    <div className="page">
      <div className="page__in page__in--prose">
        <LegalHeader
          kicker="LEGAL"
          title="Terms of"
          accent="use"
          lede="These terms cover reading this website. Membership of DA8N is a separate agreement you enter in the app."
          effective="5 October 2026"
          updated="5 October 2026"
        />

        <LegalReviewBanner />

        <div className="prose">
          <h2>1. Who we are, and what these terms cover</h2>
          <p>
            This website is operated by <Awaiting>legal entity name</Awaiting>, registered at{" "}
            <Awaiting>registered address</Awaiting> (&quot;we&quot;, &quot;us&quot;). These terms
            apply to your use of the DA8N public website at <code>www.da8n.com</code>.
          </p>
          <p>
            <strong>They are not the DA8N membership agreement.</strong> Having a DA8N account,
            creating a profile, verifying your identity and contacting other members are governed
            by separate terms that you are shown and accept inside the app. Nothing on this site
            creates a membership, and nothing here overrides those terms.
          </p>
          <p>By using this site you accept these terms. If you do not accept them, do not use it.</p>

          <h2>2. What this site is</h2>
          <p>
            An informational site. It describes what DA8N is, how it works, the safety features it
            offers and the markets and cities it has pages for. It has no account area and no
            member features. Every page is published generally; none of it is advice directed at
            your particular situation.
          </p>

          <h2>3. Age</h2>
          <p>
            DA8N is for adults aged 18 and over, and so is this site. Do not use it if you are
            under 18.
          </p>

          <h2>4. Illustrative content, and what is not an offer</h2>
          <p>This is the most important section on the page, so it is stated plainly.</p>
          <ul>
            <li>
              <strong>Example profiles are not real people.</strong> The profile cards and in-app
              screens shown on this site depict the interface. The names, ages, photographs,
              locations and stated intentions in them are illustrations. They are labelled as
              such where they appear.
            </li>
            <li>
              <strong>The member stories are placeholders.</strong> The couples, quotes and dates
              in the stories section are written illustrations, not testimonials from real
              members, and every card carries a visible DRAFT stamp while that is the case. They
              will only be replaced by real stories with the written consent of the people in
              them.
            </li>
            <li>
              <strong>Membership tiers are not an offer.</strong> The paid tiers described on this
              site are positioning, not a product you can buy. There is no price, no checkout and
              no subscription available, and the controls for them are deliberately not
              interactive. No contract for a paid service can be formed through this site.
            </li>
            <li>
              <strong>Some described features are not built yet.</strong> This site describes DA8N
              as it is intended to work. Features not yet available are marked where we know of
              them, but you should not make a decision on the basis that any particular feature
              exists today.
            </li>
            <li>
              <strong>Safety features reduce risk; they do not remove it.</strong> Identity
              verification, safety profiles, platform monitoring and date check-in are designed to
              help you make better-informed decisions. No platform can guarantee the conduct,
              honesty or safety of another person, and we do not. Use your own judgement when
              meeting anyone.
            </li>
          </ul>

          <h2>5. Acceptable use</h2>
          <p>You may read, link to and share these pages. You may not:</p>
          <ul>
            <li>
              scrape, crawl or harvest this site other than as a well-behaved search engine
              respecting our <code>robots.txt</code>;
            </li>
            <li>
              attempt to gain unauthorised access to the site, any server behind it, or any
              related system;
            </li>
            <li>
              interfere with the site&apos;s availability, including by denial-of-service or by
              introducing malicious code;
            </li>
            <li>reproduce substantial parts of its content commercially without our permission;</li>
            <li>
              use our name, wordmark or branding in a way that suggests an endorsement,
              partnership or affiliation that does not exist.
            </li>
          </ul>

          <h2>6. Intellectual property</h2>
          <p>
            The content, design, wordmark and software of this site belong to us or our licensors
            and are protected by copyright and trade mark law. You may quote short extracts with
            attribution and a link. Nothing here transfers any right in our intellectual property
            to you.
          </p>
          <p>
            Other companies&apos; names and marks appear on our comparison pages for the purpose of
            identifying and comparing their services, which is fair use for that purpose. We claim
            no affiliation with, endorsement by, or official relationship to any of them.
          </p>

          <h2>7. Links to other sites</h2>
          <p>
            We link to sites we do not control, including the DA8N membership app, the D8N
            platform site, and other dating services on our comparison pages. We are not
            responsible for their content, their accuracy or their practices, and a link is not an
            endorsement.
          </p>

          <h2>8. Accuracy, and comparison claims</h2>
          <p>
            We take care that this site is accurate, and comparison claims about other services
            carry the date we last verified them. Facts about third parties change; a claim is
            accurate as of its stated date and not beyond it. If you believe something here is
            wrong, tell us at <Awaiting>contact route</Awaiting> and we will check it.
          </p>

          <h2>9. Availability and disclaimers</h2>
          <p>
            This site is provided &quot;as is&quot;. We do not warrant that it will be
            uninterrupted, error-free or free of harmful components, and we may change, suspend or
            withdraw any part of it at any time without notice.
          </p>

          <h2>10. Liability</h2>
          <p>
            Nothing in these terms limits any liability that cannot lawfully be limited —
            including liability for death or personal injury caused by negligence, and for fraud
            or fraudulent misrepresentation. Nothing in them affects the statutory rights of a
            consumer, which vary by country and which these terms do not displace.
          </p>
          <p>
            Subject to that, we are not liable for indirect or consequential loss, loss of profit,
            or loss arising from your reliance on information published on this site. The precise
            limits are <Awaiting>liability cap, to be set with counsel per market</Awaiting>.
          </p>

          <h2>11. Governing law</h2>
          <p>
            These terms are governed by <Awaiting>governing law</Awaiting> and disputes are
            subject to <Awaiting>jurisdiction</Awaiting>. If you are a consumer, you keep the
            benefit of any mandatory protections of the law of the country you live in, and you
            may be able to bring proceedings there.
          </p>

          <h2>12. Changes to these terms</h2>
          <p>
            We may update these terms. The &quot;last updated&quot; date above will change, and
            continuing to use the site after a change means you accept the updated terms.
          </p>

          <h2>13. Related</h2>
          <p>
            See also our <Link href="/privacy">privacy notice</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
