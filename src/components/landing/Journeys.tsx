import { ImageSlot } from "../ImageSlot";
import { Eyebrow } from "./Eyebrow";
import { FEATURED_JOURNEY, JOURNEYS, JOURNEYS_SECTION } from "@/content/landing";

const ACCENT: Record<string, string> = {
  rose: "var(--da8n-rose)",
  green: "var(--da8n-green)",
  gold: "var(--da8n-gold-ink)",
};

/**
 * Journeys — one featured, two beside it.
 *
 * WHAT v4 TOOK OUT, and why this is not a styling change. Through v3 this was a
 * testimonial section: a pull quote, a couple's names and three dated
 * milestones ("MARRIED — Lisbon, 2025"). All three are endorsements attributed
 * to identifiable people, and an endorsement needs that person's written
 * consent on file before it is published — the FTC endorsement rules and the UK
 * CAP code both treat an unconsented or invented testimonial as a misleading
 * claim. The consent was never obtained, so every ship of this page carried a
 * content debt the code could not discharge.
 *
 * v4 drops the attribution rather than the section. What remains is a route, a
 * situation and the product mechanics that carried it — "Both said marriage" is
 * a claim about how INTENTIONS works, not a sentence put in a stranger's mouth.
 * There is nobody to get consent from, which is the point.
 *
 * The section keeps `id="stories"`: it is a primary-nav target and an inbound
 * anchor, and renaming the fragment would break both for a word.
 *
 * No Review or AggregateRating structured data is emitted here, and adding any
 * would be a fabrication — there are no reviews behind it.
 */
export function Journeys() {
  return (
    <section id="stories" className="sec journeys" aria-labelledby="journeys-title">
      <div className="sec__in">
        <div className="sec__head">
          <Eyebrow num={JOURNEYS_SECTION.num}>{JOURNEYS_SECTION.eyebrow}</Eyebrow>
          <h2 id="journeys-title" className="sec__title">
            {JOURNEYS_SECTION.title}
            <span className="rose">{JOURNEYS_SECTION.titleAccent}</span>
          </h2>
        </div>

        <article className="feat">
          <div className="feat__media">
            <ImageSlot
              src={FEATURED_JOURNEY.photo}
              alt=""
              placeholder="Couple photo"
              className="slot-fill"
              sizes="(min-width: 860px) 46vw, 100vw"
            />
          </div>
          <div className="feat__body">
            <div className="feat__lead">
              <span className="chip chip--ink">{FEATURED_JOURNEY.route}</span>
              <h3>{FEATURED_JOURNEY.headline}</h3>
            </div>

            {/*
              An ordered list because the three are a sequence — you set
              intentions, you are introduced, you travel — and the order is the
              content. A row of three on wide viewports, stacked below.
            */}
            <ol className="feat__steps">
              {FEATURED_JOURNEY.facts.map((fact) => (
                <li key={fact.label} style={{ "--accent": ACCENT[fact.accent] } as React.CSSProperties}>
                  <span>{fact.label}</span>
                  <b>{fact.value}</b>
                </li>
              ))}
            </ol>
          </div>
        </article>

        <div className="journeys__grid">
          {JOURNEYS.map((journey) => (
            <figure key={journey.headline} className="journey">
              <div className="journey__media">
                <ImageSlot
                  src={journey.photo}
                  alt=""
                  placeholder="Couple photo"
                  className="slot-fill"
                  sizes="(min-width: 1100px) 24vw, (min-width: 560px) 34vw, 100vw"
                />
              </div>
              <figcaption>
                <h3>{journey.headline}</h3>
                <span className="journey__chips">
                  {journey.chips.map((chip, position) => (
                    <span key={chip} className={position === 0 ? "chip chip--ink" : "chip"}>
                      {chip}
                    </span>
                  ))}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
