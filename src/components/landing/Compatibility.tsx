import { ImageSlot } from "../ImageSlot";
import { Check, RealMeSeal } from "../icons";
import { Eyebrow } from "./Eyebrow";
import { COMPAT, EXAMPLE_PROFILES } from "@/content/landing";
import { JOIN_URL } from "@/lib/app-links";

/**
 * "For You" — two members and the reasons between them.
 *
 * WHY THE SHAPE CHANGED. v3 put one photograph beside a list of five reasons,
 * which reads as a profile with annotations: the list looks like an assessment
 * OF that person. Compatibility is a statement about a pair, so v4 shows both
 * people and puts the reasons in the middle, which is the only arrangement
 * where "both want a serious relationship" is obviously about the two of them.
 *
 * Still no percentage and still no ranking. Five plain statements — a number
 * implies a precision the model does not have and invites a member to treat it
 * as a verdict on a person.
 *
 * `COMPAT.partial` is the half of this the design gets right and most products
 * hide: one dimension where the two have NOT already agreed, shown as an open
 * question with a ring instead of a tick. A list of five ticks and nothing else
 * is a sales pitch; the sixth row is what makes the other five believable.
 *
 */
export function Compatibility() {
  const { maya, marcus } = EXAMPLE_PROFILES;

  return (
    <section id="compatibility" className="sec compat" aria-labelledby="compat-title">
      <div className="sec__in">
        <div className="compat__head">
          <Eyebrow num={COMPAT.num}>{COMPAT.eyebrow}</Eyebrow>
          <h2 id="compat-title" className="compat__title">
            {COMPAT.title}
            <span className="rose">{COMPAT.titleAccent}</span>
          </h2>
        </div>

        <div className="match">
          <Polaroid
            className="match__card match__card--left"
            photo={maya.photo}
            name={maya.name}
            where={maya.where}
          />

          <div className="match__why">
            <span className="match__pair">
              {maya.firstName}
              <span className="match__heart" aria-hidden="true">
                ♥
              </span>
              {marcus.firstName}
            </span>
            <b className="match__h">{COMPAT.panelTitle}</b>

            <ul className="match__list">
              {COMPAT.reasons.map((reason) => (
                <li key={reason}>
                  <span className="tick">
                    <Check size={12} />
                  </span>
                  {reason}
                </li>
              ))}
            </ul>

            <div className="match__open">
              <span className="ring ring--gold" aria-hidden="true" />
              <span>{COMPAT.partial.text}</span>
              <b>{COMPAT.partial.verdict}</b>
            </div>

            <a href={JOIN_URL()} className="match__cta">
              {COMPAT.cta}
            </a>
          </div>

          <Polaroid
            className="match__card match__card--right"
            photo={marcus.photo}
            name={marcus.name}
            where={marcus.where}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * The tilted member card. `rotate` lives in CSS per side, not here, so the
 * component has no opinion about which way it leans.
 */
function Polaroid({
  className,
  photo,
  name,
  where,
}: {
  readonly className: string;
  readonly photo: string;
  readonly name: string;
  readonly where: string;
}) {
  return (
    <figure className={className}>
      <div className="match__media">
        <ImageSlot
          src={photo}
          alt=""
          placeholder="Member photo"
          className="slot-fill"
          sizes="(min-width: 1000px) 300px, 45vw"
        />
      </div>
      <figcaption>
        <b>
          {name}
          <RealMeSeal size={20} label="RealMe verified" />
        </b>
        <span>{where}</span>
      </figcaption>
    </figure>
  );
}
