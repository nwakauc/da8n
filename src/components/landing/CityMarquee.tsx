import { MARQUEE_CITIES } from "@/content/landing";

const ACCENTS = ["var(--da8n-ink)", "var(--da8n-rose)", "var(--da8n-green)"] as const;

/**
 * Scrolling city band.
 *
 * The row is rendered twice and translated -50%, which is what makes the loop
 * seamless: at the end of the animation the second copy sits exactly where the
 * first started. The duplicate is therefore structural, not content — the
 * whole strip takes a single `aria-label` and the text inside is hidden from
 * assistive tech, so nobody hears twelve city names twice.
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
    <div className="marquee" role="img" aria-label={`Cities on DA8N: ${MARQUEE_CITIES.join(", ")}`}>
      <div className="marquee__row" aria-hidden="true">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
