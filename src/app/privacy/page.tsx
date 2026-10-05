import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { Awaiting, LegalHeader, LegalReviewBanner } from "@/components/legal/LegalDoc";
import { appUrl } from "@/lib/app-links";

/**
 * Privacy notice for the DA8N public website.
 *
 * WHY THIS ROUTE NOW EXISTS
 *
 * The footer carried a link labelled "Privacy policy" pointing at `#safety` —
 * a fragment that scrolls to a marketing section. That is worse than no link:
 * DA8N's own pitch is ID documents and live selfies, which is biometric
 * processing under the UK/EU GDPR and Nigeria's NDPA, and a mislabelled link
 * reads as an attempt to appear compliant. `/privacy` and `/terms` are also
 * hard requirements for App Store and Play Store submission, so they were on
 * the critical path regardless of indexing.
 *
 * WHAT IS LOAD-BEARING HERE
 *
 * Every factual claim below was verified against this app's source, not
 * assumed:
 *
 *   no `fetch`/XHR anywhere          → `grep -rn 'fetch(' src/`     → none
 *   no cookies set or read           → `grep -rni cookie src/`      → comments only
 *   no analytics or tag manager      → no <Script>, no gtag/GTM/etc → none
 *   no localStorage/sessionStorage   → `grep -rn localStorage src/` → none
 *   fonts self-hosted                → next/font/google, build-time download
 *   images served from this origin   → /public, next/image
 *
 * That makes this notice genuinely short, and it must stay true. If anything
 * on this site ever gains analytics, a form, an embed or a cookie, this
 * document changes in the same slice — a privacy notice that lags the code is
 * the misrepresentation, not the feature.
 *
 * `indexable: false` like every other route while DA8N is pre-launch; the
 * site-wide switch is `DA8N_SEO_ENABLED` in `robots.ts`. A legal page is a
 * `noindex` "utility page" in the registry's own vocabulary even after launch.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Privacy",
  description:
    "How the DA8N website handles information. This site sets no cookies, runs no analytics and collects nothing you do not send.",
  path: "/privacy",
  indexable: false,
});

export default function PrivacyPage() {
  return (
    <div className="page">
      <div className="page__in page__in--prose">
        <LegalHeader
          kicker="LEGAL"
          title="Privacy"
          accent="notice"
          lede="This site sets no cookies, runs no analytics, and collects nothing you do not send it. Here is exactly what that means, and what happens when you leave for the app."
          effective="5 October 2026"
          updated="5 October 2026"
        />

        <LegalReviewBanner />

        <div className="prose">
          <h2>1. What this notice covers</h2>
          <p>
            This notice covers the DA8N public website at <code>www.da8n.com</code> — the pages
            describing DA8N, its markets and its cities.
          </p>
          <p>
            <strong>It does not cover the DA8N membership app.</strong> Joining, signing in,
            profiles, photos, messages and RealMe identity verification all happen in a separate
            application on a different host, which has its own privacy notice and its own
            controller relationship with you. When you select <em>Join</em> or <em>Log in</em>
            {" "}anywhere on this site you leave it, and that application&apos;s notice applies
            from that point. Its notice is at{" "}
            <a href={appUrl("/privacy")} rel="noopener noreferrer">
              the membership app
            </a>
            .
          </p>
          <p>
            The controller for this website is <Awaiting>legal entity name</Awaiting>, registered
            at <Awaiting>registered address</Awaiting>.
          </p>

          <h2>2. What this site collects from you</h2>
          <p>
            <strong>Nothing.</strong> There is no account area, no sign-in, no contact form, no
            newsletter field and no comment box anywhere on this site. There is nothing here for
            you to submit, so there is nothing submitted.
          </p>
          <p>Specifically, and verified against this site&apos;s source code:</p>
          <ul>
            <li>
              <strong>No cookies.</strong> This site sets no cookies of any kind — not necessary
              ones, not preference ones, not advertising ones. This is why you are not asked for
              cookie consent: there is nothing to consent to.
            </li>
            <li>
              <strong>No analytics.</strong> No Google Analytics, no tag manager, no
              privacy-preserving analytics, no server-side event collection. Page views are not
              counted.
            </li>
            <li>
              <strong>No tracking pixels, no advertising or social media trackers, no
              fingerprinting.</strong>
            </li>
            <li>
              <strong>No browser storage.</strong> Nothing is written to local storage, session
              storage or IndexedDB.
            </li>
            <li>
              <strong>No third-party requests.</strong> Typefaces are downloaded at build time and
              served from this domain rather than from a font service, and every image comes from
              this domain. Loading a page here contacts no other company&apos;s servers.
            </li>
            <li>
              <strong>No calls to the DA8N platform.</strong> This site is prerendered. It makes
              no request to any DA8N backend and holds no credential that would let it.
            </li>
          </ul>

          <h2>3. What our hosting provider records</h2>
          <p>
            Serving a web page requires receiving a request, and a request carries technical
            information. Our hosting provider, acting as our processor, records standard server
            log data for each request: your IP address, the page requested, the time, the HTTP
            status, your browser&apos;s user-agent string and the referring page if your browser
            sends one.
          </p>
          <p>
            An IP address is personal data. We use these logs only to serve the site, keep it
            available and defend it against abuse and denial-of-service attacks. We do not use
            them to build a profile of you, we do not combine them with anything else, and we do
            not try to identify you from them.
          </p>
          <p>
            <strong>Legal basis:</strong> our legitimate interests in operating and securing the
            service (UK/EU GDPR Article 6(1)(f)). Because this processing is strictly necessary
            to deliver a page you asked for and involves no cookie or similar technology, it does
            not require consent.
          </p>
          <p>
            <strong>Retention:</strong> <Awaiting>log retention period</Awaiting>, after which
            logs are deleted by the provider on a rolling basis.
          </p>
          <p>
            <strong>Processor and location:</strong> <Awaiting>hosting provider and region</Awaiting>.
          </p>

          <h2>4. When you follow a link away from this site</h2>
          <p>
            Some pages link elsewhere — to the DA8N membership app, to the D8N platform site, and
            on comparison pages to other dating services so you can check what we say about them.
            Following any such link takes you to a site we do not control, which will have its own
            privacy notice and may set its own cookies. We do not share anything about you with
            those sites; your browser simply makes a request to them as it would to any site you
            visit.
          </p>

          <h2>5. Special category and children&apos;s data</h2>
          <p>
            Information about who someone dates can reveal sexual orientation, and in some
            contexts religion or ethnicity. That is special category data under UK/EU data
            protection law and is handled with corresponding care — but{" "}
            <strong>none of it is processed by this website.</strong> It arises only inside the
            membership app, under that app&apos;s notice.
          </p>
          <p>
            DA8N is for adults aged 18 and over. This site is not directed at children and
            contains nothing aimed at them. We do not knowingly process any child&apos;s personal
            data here, and there is no mechanism by which we could collect it.
          </p>

          <h2>6. Your rights</h2>
          <p>
            Depending on where you live you have rights over your personal data — to access it,
            to have it corrected or erased, to restrict or object to its processing, to data
            portability, and to withdraw consent where consent was the basis. These rights apply
            under the UK GDPR, the EU GDPR, Nigeria&apos;s Data Protection Act, South Africa&apos;s
            POPIA, and applicable state privacy laws in the United States and Canada.
          </p>
          <p>
            In practice there is very little this website holds that a request could reach: the
            server logs described in section 3, identifiable only by IP address. A request about
            your membership account, profile, photos, messages or RealMe verification needs to go
            to the membership app, because that is where the data is.
          </p>
          <p>
            To exercise a right, or to ask a question about this notice, contact{" "}
            <Awaiting>privacy contact route</Awaiting>. Our data protection representative is{" "}
            <Awaiting>DPO or representative, where required</Awaiting>.
          </p>
          <p>
            You also have the right to complain to a supervisory authority: the ICO in the United
            Kingdom, your national authority in the EU, the NDPC in Nigeria, or the Information
            Regulator in South Africa. You are welcome to raise it with us first, but you do not
            have to.
          </p>

          <h2>7. International transfers</h2>
          <p>
            DA8N is one global network, and this site is served from a content delivery network
            with points of presence in many countries, so a request may be handled outside the
            country you are in. Where personal data moves out of the UK or EEA it is covered by{" "}
            <Awaiting>transfer mechanism — adequacy decision or standard contractual clauses</Awaiting>.
          </p>

          <h2>8. Security</h2>
          <p>
            This site is served over HTTPS only. It holds no database, no credentials and no
            member data, which is a deliberate design choice rather than a happy accident: the
            most reliable way to protect information on a public marketing surface is for that
            surface to never have it.
          </p>

          <h2>9. Changes to this notice</h2>
          <p>
            If this site ever gains a form, an analytics tool, an embed or a cookie, this notice
            is updated in the same change that introduces it, and the &quot;last updated&quot;
            date above changes. Material changes will be signposted on the site rather than made
            quietly.
          </p>

          <h2>10. Related</h2>
          <p>
            See also our <Link href="/terms">terms of use</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
