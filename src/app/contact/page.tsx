import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, buildPageMetadata, toJsonLdScript, webPageJsonLd } from "@/lib/seo";
import { CONTACT_PAGE, CONTACT_ROUTES, mailto } from "@/content/contact";
import { Awaiting } from "@/components/legal/LegalDoc";
import { appUrl } from "@/lib/app-links";

const PATH = "/contact";
const DESCRIPTION =
  "How to reach DA8N: safety concerns, data requests, press and partnerships, and where account questions are handled.";

/**
 * `/contact`.
 *
 * The segment was reserved in `reserved-slugs.ts` from the start and the page
 * was never built, which left `/terms` and `/privacy` instructing readers to
 * get in touch via a bracketed placeholder. See the long note at the top of
 * `content/contact.ts` for why every address here is an existing, monitored
 * platform mailbox rather than a plausible invention.
 *
 * `indexable: false`, with the other utility routes. A contact page is for
 * someone who is already here and looking for it; it wins nothing in search
 * and it is the page most attractive to address harvesters. The addresses are
 * published as `mailto:` either way — obfuscating them with JavaScript defeats
 * a reader using a keyboard or a screen reader more reliably than it defeats a
 * crawler, so it is not done.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: DESCRIPTION,
  path: PATH,
  indexable: false,
});

export default function ContactPage() {
  const jsonLd = toJsonLdScript([
    webPageJsonLd({ path: PATH, name: "Contact", description: DESCRIPTION }),
    breadcrumbJsonLd([
      { name: "DA8N", path: "/" },
      { name: "Contact", path: PATH },
    ]),
  ]);

  return (
    <div className="page">
      <div className="page__in page__in--prose">
        <header className="page__head">
          <nav aria-label="Breadcrumb" className="crumbs">
            <Link href="/">DA8N</Link>
            <span aria-hidden="true" className="crumbs__sep">
              /
            </span>
            <span aria-current="page">Contact</span>
          </nav>

          <span className="page__kicker">{CONTACT_PAGE.kicker}</span>
          <h1 className="page__title">
            Getting in <span className="rose">touch.</span>
          </h1>
          <p className="page__lede">{CONTACT_PAGE.lede}</p>
        </header>

        <div className="routes">
          {CONTACT_ROUTES.map((route) => {
            const href = mailto(route);
            return (
              <section key={route.slug} className="route" aria-labelledby={`route-${route.slug}`}>
                <span className="route__kicker">{route.audience}</span>
                <h2 id={`route-${route.slug}`}>{route.heading}</h2>
                <p>{route.body}</p>

                {route.destination.kind === "email" && href ? (
                  <a className="route__to" href={href}>
                    {route.destination.address}
                  </a>
                ) : null}

                {route.destination.kind === "app" ? (
                  <a className="route__to" href={appUrl(route.destination.path)}>
                    {route.destination.label}
                  </a>
                ) : null}

                {route.destination.kind === "page" ? (
                  <Link className="route__to" href={route.destination.path}>
                    {route.destination.label}
                  </Link>
                ) : null}

                {/*
                  The one address this site still needs and does not have. It
                  is shown rather than hidden, because a data subject reading
                  this page is entitled to know that the route is not yet
                  published — and because a bracket on the page is the only
                  kind of placeholder that cannot be forgotten.
                */}
                {route.slug === "privacy" ? (
                  <p className="route__pending">
                    Website privacy requests: <Awaiting>privacy mailbox on the DA8N domain</Awaiting>
                    . Until it is published, requests about the member application are handled in
                    the app, and anything urgent can go to the platform trust team above.
                  </p>
                ) : null}
              </section>
            );
          })}
        </div>

        <section className="page__section">
          <p className="notice">
            DA8N is a product of the D8N platform, and the mailboxes above are the platform&apos;s.
            Nothing on this site can access your account, and nobody here will ever ask you for your
            password, a verification code or a payment.
          </p>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    </div>
  );
}
