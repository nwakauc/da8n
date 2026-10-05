import { MARQUEE_CITIES } from "@/content/landing";

const ACCENTS = ["var(--da8n-ink)", "var(--da8n-rose)", "var(--da8n-green)"] as const;

/**
 * Scrolling city band.
 *
 * The row is rendered twice and translated -50%, which is what makes the loop
 * seamless: at the end of the animation the second copy sits exactly where the
 * first started. The duplicate is therefore structural, not content, and the
 * text inside is hidden from assistive tech so nobody hears twelve city names
 * twice.
 *
 * THE WHOLE STRIP IS NOW `aria-hidden`, and that is the point of this note.
 * It previously carried `role="img"` with the label "Cities on DA8N: London,
 * New York, … Berlin, Lagos, Singapore, Lisbon, Atlanta". Berlin, Singapore
 * and Lisbon are not markets, and `content/landing.ts` is explicit that this
 * band "is not a claim that DA8N operates in each one — the band carries no
 * links and no counts". The label broke exactly that rule for exactly the
 * users who could not see the band was decorative: a sighted visitor saw an
 * unlinked ticker, a screen-reader user heard a sentence asserting DA8N
 * operates in all twelve.
 *
 * Decorative content gets hidden, not narrated. The routable city set is
 * reachable from the grid below and from `/cities`.
 *
 * The animation itself only runs under `prefers-reduced-motion:
 * no-preference`; otherwise the band sits still and reads as a static list.
 */
export function CityMarquee() {
  const row = (key: string) =>
    MARQUEE_CITIES.flatMap((city, index) => [
      <span
        key={`${key}-${city}`}
        className="marquee__city"
        style={{ color: ACCENTS[index % 3] }}
      >
        {city}
      </span>,
      <span key={`${key}-${city}-star`} className="marquee__star">
        ✦
      </span>,
    ]);

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__row">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
