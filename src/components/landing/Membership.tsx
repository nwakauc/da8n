import { Check } from "../icons";
import { MEMBERSHIP, TIERS } from "@/content/landing";
import { JOIN_URL } from "@/lib/app-links";

/**
 * Membership tiers.
 *
 * There is no payments implementation, no priced plan and no subscription
 * state anywhere in this product. So:
 *
 *   - The section keeps the design's DRAFT stamp.
 *   - Only `purchasable: true` renders an anchor. That is the free tier, and
 *     it points at sign-up, which is a thing that works today. The paid tiers
 *     render as non-interactive labels, because a button marked "Go VIP" that
 *     leads nowhere is a worse experience than a card that is plainly
 *     informational — and because a live-looking checkout entry for a product
 *     with no checkout is the kind of thing that gets read as an offer.
 *
 * The VIP feature list contains two claims that need a decision before this
 * is public: financial screening of members, and background checks
 * "included". Both are documented at the point of definition in
 * `content/landing.ts`.
 */
export function Membership() {
  return (
    <section id="membership" className="sec membership" aria-labelledby="membership-title">
      <div className="sec__in">
        <div className="sec__head">
          <span className="eyebrow">{MEMBERSHIP.eyebrow}</span>
          <h2 id="membership-title" className="sec__title">
            {MEMBERSHIP.title}
            <span className="rose">{MEMBERSHIP.titleAccent}</span>
          </h2>
          <p className="sec__lede">
            {MEMBERSHIP.lede}
            {MEMBERSHIP.draft ? <span className="draft">DRAFT</span> : null}
          </p>
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
              {tier.purchasable ? (
                <a href={JOIN_URL()} className="tier__cta">
                  {tier.cta}
                </a>
              ) : (
                <span className="tier__cta">{tier.cta}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
