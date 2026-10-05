import { PillarGlyph } from "../icons";
import { PILLARS, WHY } from "@/content/landing";

/** Maps the data's accent name onto the palette. One place, four colours. */
const ACCENT: Record<string, { bg: string; ink: string }> = {
  gold: { bg: "var(--da8n-gold)", ink: "var(--da8n-gold-ink)" },
  rose: { bg: "var(--da8n-rose)", ink: "var(--da8n-rose-ink)" },
  green: { bg: "var(--da8n-green)", ink: "var(--da8n-green)" },
  ink: { bg: "var(--da8n-ink)", ink: "var(--da8n-ink)" },
};

/**
 * "Why DA8N" — four numbered pillars.
 *
 * An ordered list, because the design numbers them 01–04 and the numbers are
 * the structure, not decoration. The visible "01" is `aria-hidden`: a list
 * item already announces its position, so reading it would double up.
 *
 * `--accent` and `--accent-ink` are set per card, which is what lets one set
 * of rules in `landing.css` serve all four colourways — including the offset
 * shadow, which is the signature of the design's card treatment.
 */
export function WhyDa8n() {
  return (
    <section id="why" className="sec why" aria-labelledby="why-title">
      <div className="sec__in">
        <div className="why__head">
          <span className="eyebrow">{WHY.eyebrow}</span>
          <h2 id="why-title" className="why__title">
            {WHY.title}
            <span className="rose">{WHY.titleAccent}</span>
          </h2>
        </div>

        <ol className="pillars">
          {PILLARS.map((pillar) => {
            const accent = ACCENT[pillar.accent] ?? ACCENT.ink;
            return (
              <li
                key={pillar.num}
                className="pillar"
                style={
                  {
                    "--accent": accent?.bg,
                    "--accent-ink": accent?.ink,
                  } as React.CSSProperties
                }
              >
                <div className="pillar__top">
                  <span className="pillar__num" aria-hidden="true">
                    {pillar.num}
                  </span>
                  <i className="orb">
                    <PillarGlyph name={pillar.icon} />
                  </i>
                </div>
                <span className="pillar__kicker">{pillar.kicker}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
