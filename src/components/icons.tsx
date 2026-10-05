/**
 * Inline SVG from the design, as components.
 *
 * Inline rather than sprite or <img> for three reasons: these marks sit in the
 * critical paint path (the wordmark heart and the RealMe seal are above the
 * fold), they inherit `currentColor` so one icon serves four accent colours,
 * and an SVG file would be a second request for ~400 bytes of path data.
 *
 * Every icon is `aria-hidden` by default. The exceptions are the RealMe seal
 * and the D8N mark, which carry meaning on their own and take a label.
 */

type IconProps = { readonly size?: number; readonly className?: string };

export function Heart({ size = 12, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.2 0 3.6 1.2 5.2 3 1.6-1.8 3-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z"
        fill="#ff4d6d"
      />
    </svg>
  );
}

/** The gold RealMe seal: a notched ring with a check. */
export function RealMeSeal({ size = 24, label }: IconProps & { readonly label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="rm-seal"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <path
        className="rm-seal__ring"
        pathLength={1}
        d="M12 3.3 14 5l2.6-.2 1 2.4 2.4 1-.2 2.6 1.7 2.2-1.7 2.2.2 2.6-2.4 1-1 2.4-2.6-.2-2 1.7-2-1.7-2.6.2-1-2.4-2.4-1 .2-2.6L2.5 13l1.7-2.2L4 8.2l2.4-1 1-2.4L10 5Z"
        fill="#f8e3a6"
        stroke="#c99433"
        strokeWidth={2.1}
      />
      <path
        className="rm-seal__check"
        pathLength={1}
        d="m8.8 12.2 2.1 2.1 4.3-5"
        stroke="#a87718"
        strokeWidth={2.4}
      />
    </svg>
  );
}

/** Outline variant of the seal, used inside the accent orbs. */
export function SealOutline({ size = 22 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.3 14 5l2.6-.2 1 2.4 2.4 1-.2 2.6 1.7 2.2-1.7 2.2.2 2.6-2.4 1-1 2.4-2.6-.2-2 1.7-2-1.7-2.6.2-1-2.4-2.4-1 .2-2.6L2.5 13l1.7-2.2L4 8.2l2.4-1 1-2.4L10 5Z" />
      <path d="m8.8 12.2 2.1 2.1 4.3-5" />
    </svg>
  );
}

export function HeartSolid({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M12 20s-7-4.4-9-8.8C1.6 8 3.6 4.8 7 4.8c2 0 3.4 1.1 5 2.8 1.6-1.7 3-2.8 5-2.8 3.4 0 5.4 3.2 4 6.4C19 15.6 12 20 12 20z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Rings({ size = 22 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.5 7.5C8.2 5.9 5.7 6 4.6 7.7c-1 1.7-.1 3.6 4.9 7.1M14.5 7.5c1.3-1.6 3.8-1.5 4.9.2 1 1.7.1 3.6-4.9 7.1" />
      <path d="m12 20.5-2.5-2.9m2.5 2.9 2.5-2.9" />
    </svg>
  );
}

export function Globe({ size = 22 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" />
      <ellipse cx="12" cy="12" rx="3.6" ry="8.5" />
      <path d="M3.8 9.5h16.4M3.8 14.5h16.4" />
    </svg>
  );
}

/**
 * `stroke="currentColor"`, not a hardcoded white. The tick sits on a green
 * circle in the free tier, a GOLD one in VIP and a WHITE one in da8n+ — a
 * white check is invisible on the third. Each context sets `color` on `.tick`.
 */
export function Check({ size = 11, stroke = 4 }: IconProps & { readonly stroke?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function Bolt({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
      <path d="M13.5 2.5 5 13.5h6l-1 8 8.5-11h-6z" />
    </svg>
  );
}

export function Burger({ open }: { readonly open: boolean }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#231c17"
      strokeWidth={2.2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d={open ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} />
    </svg>
  );
}

/** The D8N platform mark. */
export function D8nMark({ size = 28 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      width={size}
      height={size}
      style={{
        fill: "#0d7a43",
        stroke: "#fff",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        flex: "none",
      }}
    >
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 4.5v7.2" />
      <path d="M7.5 7.2a6.8 6.8 0 1 0 9 0" />
    </svg>
  );
}

/* Safety feature glyphs. */

export function Shield({ size = 18 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 5 5.8v5.4c0 4.2 2.9 7.5 7 9.8 4.1-2.3 7-5.6 7-9.8V5.8z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  );
}

export function Doc({ size = 18 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 3.5h7l4 4v13H7z" />
      <path d="M13.5 3.8V8h4.2M10 13h5M10 16.5h4" />
    </svg>
  );
}

export function Alert({ size = 18 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4 3 19.5h18z" />
      <path d="M12 9.5v4.2M12 16.6v.2" />
    </svg>
  );
}

export function Block({ size = 18 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="m6.2 6.2 11.6 11.6" />
    </svg>
  );
}

export function Book({ size = 18 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 5.2c2.8-1.2 5.3-1.2 8 .4v13c-2.7-1.6-5.2-1.6-8-.4z" />
      <path d="M20 5.2c-2.8-1.2-5.3-1.2-8 .4v13c2.7-1.6 5.2-1.6 8-.4z" />
    </svg>
  );
}

export function Pin({ size = 18 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s6-5.6 6-10a6 6 0 1 0-12 0c0 4.4 6 10 6 10z" />
      <circle cx="12" cy="10.8" r="2.3" />
    </svg>
  );
}

const SAFETY_GLYPHS = {
  shield: Shield,
  doc: Doc,
  alert: Alert,
  block: Block,
  book: Book,
  pin: Pin,
} as const;

export type SafetyGlyphName = keyof typeof SAFETY_GLYPHS;

export function SafetyGlyph({ name }: { readonly name: SafetyGlyphName }) {
  const Glyph = SAFETY_GLYPHS[name];
  return <Glyph size={18} />;
}

const PILLAR_GLYPHS = {
  seal: SealOutline,
  heart: HeartSolid,
  rings: Rings,
  globe: Globe,
} as const;

export type PillarGlyphName = keyof typeof PILLAR_GLYPHS;

export function PillarGlyph({ name }: { readonly name: PillarGlyphName }) {
  const Glyph = PILLAR_GLYPHS[name];
  return <Glyph size={22} />;
}
