import Link from "next/link";
import { Check } from "../icons";
import { Eyebrow } from "./Eyebrow";
import { MEMBERSHIP, TIERS } from "@/content/landing";
import { appUrl } from "@/lib/app-links";

/**
 * Membership tiers.
 *
 * Every tier's CTA is a real link. Free goes to sign-up; da8n+ goes to the
 * membership screen in the member application, which is where plans and prices
 * live; VIP goes to the matchmaking page. Pricing is per-market and belongs to
 * the app that knows the visitor's market and currency — quoting a number on
 * this host would be an offer it cannot honour, and `landing.test.ts` fails the
 * build if one appears here.
 *
 * The VIP feature list carries the two claims on this page that cannot be
 * checked against the codebase — financial screening of members, and background
 * checks "included". Both are documented at the point of definition in
 * `content/landing.ts`; keep them consistent with `/safety#background-checks`.
 */
export function Membership() {
  return (
    <section id="membership" className="sec membership" aria-labelledby="membership-title">
      <div className="sec__in">
        <div className="sec__head">
          <Eyebrow num={MEMBERSHIP.num}>{MEMBERSHIP.eyebrow}</Eyebrow>
          <h2 id="membership-title" className="sec__title">
            {MEMBERSHIP.title}
            <span className="rose">{MEMBERSHIP.titleAccent}</span>
          </h2>
        </div>

        {/* Keyboard-scrollable: see the note in Stories.tsx. */}
        <div className="rail" tabIndex={0} role="group" aria-label="Membership tiers">
          {TIERS.map((tier) => (
            <div key={tier.id} className={`tier tier--${tier.id}`}>
              <div className="tier__top">
                <b>{tier.name}</b>
                <span className="tier__badge">
                  {tier.id === "vip" ? <i aria-hidden="true" /> : null}
                  {tier.badge}
                </span>
              </div>
              <span className="tier__blurb">{tier.blurb}</span>
              <ul>
                {tier.features.map((feature) => (
                  <li key={feature}>
                    <span className="tick">
                      <Check size={10} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              {tier.target === "app" ? (
                <a href={appUrl(tier.href)} className="tier__cta">
                  {tier.cta}
                </a>
              ) : (
                <Link href={tier.href} className="tier__cta">
                  {tier.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
