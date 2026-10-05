import { ImageSlot } from "../ImageSlot";
import { Check, RealMeSeal, SafetyGlyph, Shield } from "../icons";
import {
  CHECK_IN,
  EXAMPLE_PROFILES,
  SAFETY,
  SAFETY_FEATURES,
  SAFETY_PROFILE,
} from "@/content/landing";

const ACCENT: Record<string, string> = {
  green: "var(--da8n-green)",
  gold: "var(--da8n-gold-ink)",
  ink: "var(--da8n-ink)",
  rose: "var(--da8n-rose)",
};

/**
 * Safety, including the example Safety Profile card.
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
          <span className="eyebrow">{SAFETY.eyebrow}</span>
          <h2 id="safety-title" className="safety__title">
            {SAFETY.title}
            <span className="rose">{SAFETY.titleAccent}</span>
            {SAFETY.titleTail}
          </h2>
          <p className="safety__claim">{SAFETY.claim}</p>
          <p className="safety__body">{SAFETY.body}</p>
        </div>

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
                    Not a link. Background checks are consent-based, bound to a
                    provider and legal in different ways market by market;
                    there is no flow behind this yet.

                    It was styled as bold rose text with a trailing arrow,
                    i.e. exactly like every real link on the page, so it read
                    as a live control that silently did nothing. `.is-soon
                    --inline` keeps it as a label but makes that legible, and
                    the arrow is gone from the copy because an arrow is a
                    promise of navigation.
                  */}
                  <span className="is-soon is-soon--inline">
                    {SAFETY_PROFILE.backgroundCheck.cta}
                  </span>
                </li>
              </ul>
            </div>

            <p className="sprofile__foot">{SAFETY.disclosure}</p>
          </div>

          <div className="safety__col">
            <div className="sfeatures">
              {SAFETY_FEATURES.map((feature) => (
                <div key={feature.title} className="sfeature">
                  <i
                    className="orb orb--md"
                    style={{ "--accent": ACCENT[feature.accent] } as React.CSSProperties}
                  >
                    <SafetyGlyph name={feature.icon} />
                  </i>
                  <div>
                    <b>{feature.title}</b>
                    <span>{feature.body}</span>
                  </div>
                </div>
              ))}
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
