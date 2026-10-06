import { MARQUEE_CITIES } from "@/content/landing";

/*
 * v4 inverts the band: dark ground, light type. The accents are therefore the
 * light set — cream, rose-lift and a warm gold — all of which clear 4.5:1 on
 * #231c17 at the band's size. The v3 trio (ink, rose, green) would have been
 * invisible to near-invisible on it.
 */
const ACCENTS = ["#ffffff", "var(--da8n-rose-lift)", "#f6c453"] as const;

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

  /*
   * The extra wrapper is structural, not decorative. The band is rotated and
   * bled past both gutters, and it is pulled up over the bottom of the hero —
   * so it needs an un-rotated, overflow-clipping parent, or the rotation
   * widens the document and the page scrolls sideways on every viewport.
   */
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__band">
        <div className="marquee__row">
          {row("a")}
          {row("b")}
        </div>
      </div>
    </div>
  );
}
