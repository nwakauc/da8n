import Link from "next/link";
import { ImageSlot } from "../ImageSlot";
import { Check, Flag, RealMeSeal, SealOutline, Shield } from "../icons";
import { Eyebrow } from "./Eyebrow";
import {
  CHECK_IN,
  EXAMPLE_PROFILES,
  PROFILE_CHECK,
  SAFETY,
  SAFETY_CARDS,
  SAFETY_PROFILE,
} from "@/content/landing";

const ACCENT: Record<string, string> = {
  green: "var(--da8n-green)",
  gold: "var(--da8n-gold)",
  rose: "var(--da8n-rose)",
};

const CARD_GLYPH = {
  seal: SealOutline,
  shield: Shield,
  block: Flag,
} as const;

/**
 * Safety: three capability cards, the example Safety Profile, the profile-review
 * panel and Date Check-in.
 *
 * WHAT THIS CARD MUST NEVER SHOW, and does not:
 *   identity documents or their images; report history; who filed a report;
 *   moderation notes; a numeric Trust Score; device, IP or location
 *   intelligence; background-check findings.
 *
 * What it does show is verified facts and absences of facts — "RealMe
 * verified", "no confirmed serious safety violations". The distinction
 * matters: an absence of confirmed violations is a true statement about the
 * record, whereas "safe" would be a guarantee about a person that no platform
 * can make. The Trust Score is a band, not a number, for the same reason the
 * compatibility panel has no percentage.
 *
 * `SAFETY.disclosure` renders at the foot of the card and is load-bearing. It
 * is the page's own statement of those limits.
 */
export function Safety() {
  const { marcus } = EXAMPLE_PROFILES;

  return (
    <section id="safety" className="sec safety" aria-labelledby="safety-title">
      <div className="sec__in">
        <div className="safety__head">
          <Eyebrow num={SAFETY.num}>{SAFETY.eyebrow}</Eyebrow>
          <h2 id="safety-title" className="safety__title">
            {SAFETY.title}
            <span className="rose">{SAFETY.titleAccent}</span>
            {SAFETY.titleTail}
          </h2>
        </div>

        {/*
          Three cards where v3 had a six-row list, and the two lines of
          "powered by D8N Safety" prose above it. Three capabilities that exist,
          described in a sentence each, beats six one-liners of which two named
          things that are not built.

          Each card links to its own explainer on this site — `/realme`, the
          romance-scam guide and `/safety`. `landing.test.ts` asserts all three
          resolve, so a renamed route fails the build rather than the page.
        */}
        <ol className="scards">
          {SAFETY_CARDS.map((card) => {
            const Glyph = CARD_GLYPH[card.icon];
            return (
              <li
                key={card.title}
                className="scard"
                style={{ "--accent": ACCENT[card.accent] } as React.CSSProperties}
              >
                <div className="scard__top">
                  <span className="scard__kicker">{card.kicker}</span>
                  <i className="orb orb--md">
                    <Glyph size={22} />
                  </i>
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <Link href={card.href} className="scard__link">
                  {card.cta} <span aria-hidden="true">→</span>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="safety__split">
          <div className="sprofile">
            <div className="sprofile__top">
              <ImageSlot src={marcus.photo} alt="" placeholder="Photo" sizes="56px" />
              <div className="sprofile__id">
                <b>
                  {SAFETY_PROFILE.owner}&apos;s Safety Profile
                  <RealMeSeal size={18} />
                </b>
                <span>{SAFETY_PROFILE.protectedBy}</span>
              </div>
            </div>

            {SAFETY_PROFILE.groups.map((group) => (
              <div key={group.label} className="sgroup">
                <span className="sgroup__label">{group.label}</span>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.text} className={item.state === "plain" ? "plain" : undefined}>
                      {item.state === "verified" ? (
                        <span className="tick">
                          <Check size={10} />
                        </span>
                      ) : null}
                      {item.text}
                      {item.badge ? <span className="sbadge">{item.badge}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="sgroup">
              <span className="sgroup__label">REPUTATION</span>
              <div className="trust">
                <b>
                  <span className="orb orb--sm" style={{ "--accent": "var(--da8n-green)" } as React.CSSProperties}>
                    <Shield size={11} />
                  </span>
                  {SAFETY_PROFILE.trust.label}
                </b>
                {/*
                  A bar, not a number. `aria-hidden` because the band below it
                  is the accessible value — a progressbar announcing "86" would
                  publish the score the design deliberately withholds.
                */}
                <span className="trust__bar" aria-hidden="true">
                  <i style={{ width: `${SAFETY_PROFILE.trust.fillPercent}%` }} />
                </span>
                <b className="trust__band">{SAFETY_PROFILE.trust.band}</b>
              </div>

              <span className="sgroup__label" style={{ margin: "6px 0 4px" }}>
                {SAFETY_PROFILE.trust.safetyLabel}
              </span>
              <ul>
                {SAFETY_PROFILE.trust.items.map((item) => (
                  <li key={item.text}>
                    <span className="tick">
                      <Check size={10} />
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="sgroup">
              <span className="sgroup__label">{SAFETY_PROFILE.backgroundCheck.label}</span>
              <ul>
                <li className="pending">
                  <span className="ring" />
                  {SAFETY_PROFILE.backgroundCheck.status}
                </li>
                <li className="link">
                  {/*
                    Points at the explainer, not at a flow. Background checks
                    are consent-based, provider-bound and available in
                    different ways market by market, so what a visitor needs
                    from this row is the explanation; the request itself lives
                    in the member app, where the consent is captured.
                  */}
                  <Link href={SAFETY_PROFILE.backgroundCheck.href}>
                    {SAFETY_PROFILE.backgroundCheck.cta}
                    <span aria-hidden="true"> →</span>
                  </Link>
                </li>
              </ul>
            </div>

            <p className="sprofile__foot">{SAFETY.disclosure}</p>
          </div>

          <div className="safety__col">
            {/*
              Profile review, shown rather than asserted — v4 puts this where
              v3 had the in-chat money-request mockup. Fraud already has a card
              above with a guide behind it; what had no illustration was the
              claim those cards rest on, that a face is checked before anyone
              sees it.

              The three tiles are decorative in the accessibility sense: the
              paragraph below them states the claim in full, so the verdict
              pills are `aria-hidden` rather than read out as a list of
              fragments. Nothing here is a real member or a real decision.
            */}
            <div className="pcheck">
              <div className="pcheck__top">
                <span className="pcheck__label">{PROFILE_CHECK.label}</span>
                <span className="pcheck__flag">
                  <span className="dot dot--gold" />
                  {PROFILE_CHECK.flag}
                </span>
              </div>
              <div className="pcheck__grid" aria-hidden="true">
                {PROFILE_CHECK.tiles.map((tile) => (
                  <div
                    key={tile.photo}
                    className={tile.blocked ? "pcheck__tile pcheck__tile--blocked" : "pcheck__tile"}
                  >
                    <ImageSlot
                      src={tile.photo}
                      alt=""
                      placeholder="Profile photo"
                      className="slot-fill"
                      sizes="(min-width: 980px) 10vw, 28vw"
                    />
                    <span className="pcheck__verdict">
                      {tile.blocked ? null : <span aria-hidden="true">✓ </span>}
                      {tile.verdict}
                    </span>
                  </div>
                ))}
              </div>
              <p className="pcheck__body">{PROFILE_CHECK.body}</p>
              <p className="pcheck__line">
                {PROFILE_CHECK.line}
                <span className="rose">{PROFILE_CHECK.lineAccent}</span>
              </p>
            </div>

            <div className="checkin">
              <div className="checkin__top">
                <span>{CHECK_IN.label}</span>
                <span className="checkin__live">
                  <span className="dot dot--ring" />
                  {CHECK_IN.live}
                </span>
              </div>
              <div className="checkin__plan">
                <ImageSlot src={marcus.photo} alt="" placeholder="Photo" sizes="44px" />
                <div>
                  <b>{CHECK_IN.plan}</b>
                  <span>{CHECK_IN.planMeta}</span>
                </div>
              </div>
              <div className="checkin__rule">{CHECK_IN.rule}</div>
              <div className="checkin__acts" aria-hidden="true">
                <span>{CHECK_IN.ok}</span>
                <span>{CHECK_IN.out}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
