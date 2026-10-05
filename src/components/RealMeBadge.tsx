import { RealMeSeal } from "./icons";

const LABEL = "RealMe Verified";

/**
 * The animated RealMe badge from the hero.
 *
 * The design animates this in JavaScript on a 6s loop: the seal's ring draws,
 * the check draws, a highlight sweeps the border, and the letters shimmer one
 * by one. All of it is expressible in CSS keyframes, so none of it needs JS —
 * see `globals.css` for the keyframes and `landing.css` for the bindings.
 *
 * Two things here are deliberate and should not be "simplified":
 *
 *   - The resting state is the FINISHED state. The animation only plays under
 *     `prefers-reduced-motion: no-preference`. Done the other way round — the
 *     usual `animation: none` under `reduce` — the seal would be permanently
 *     invisible for those users, because the animation is what draws it.
 *
 *   - The per-letter shimmer splits the label into one <span> per character,
 *     which would make a screen reader spell it out. So the whole badge takes
 *     `role="img"` with an `aria-label`, and the split text is `aria-hidden`.
 *     Assistive tech hears "RealMe Verified" once.
 */
export function RealMeBadge() {
  return (
    <span role="img" aria-label={LABEL} className="rm-badge">
      <RealMeSeal size={24} />
      <span aria-hidden="true" style={{ display: "inline-flex", whiteSpace: "pre" }}>
        {LABEL.split("").map((char, index) => (
          <span
            key={`${char}-${index}`}
            className="rm-badge__letter"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {char}
          </span>
        ))}
      </span>
      <span aria-hidden="true" className="rm-badge__sweep rm-badge__sweep--blur" />
      <span aria-hidden="true" className="rm-badge__sweep" />
    </span>
  );
}
