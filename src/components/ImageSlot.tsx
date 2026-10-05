import Image from "next/image";

/**
 * The design's <image-slot> element, as a React component.
 *
 * The design canvas uses image slots everywhere rather than bare <img>: a slot
 * that has no asset wired renders its own label instead of a broken image.
 * That behaviour is worth keeping rather than designing out, because several
 * of the design's photographs have not been exported into this repository
 * yet. A labelled slot reads as deliberate, keeps the layout stable, and is
 * honest about which imagery is still missing — all better than a grey box or
 * a 404.
 *
 * When `src` is null this renders the label. When it is set it renders
 * `next/image` with `fill`, so the parent's `aspect-ratio` governs the box and
 * the browser gets width/height before the bytes arrive (no layout shift).
 *
 * `sizes` is required whenever the slot is not a fixed-size avatar: without it
 * Next emits the largest candidate at every breakpoint, which on the city grid
 * means downloading seven full-width images to show seven thumbnails.
 */

export type ImageSlotProps = {
  /** Path under /public, or null to render the labelled placeholder. */
  readonly src: string | null;
  /**
   * Alternative text. Pass "" for imagery that is purely decorative and whose
   * meaning is already in adjacent text — a city card's photo under a visible
   * "London" heading, for instance. An empty alt is a decision, not an
   * omission; it tells a screen reader to skip the image rather than read a
   * filename.
   */
  readonly alt: string;
  /** Shown when there is no asset. Describes what belongs here. */
  readonly placeholder: string;
  readonly sizes?: string;
  readonly className?: string;
  /** Set only on the one above-the-fold image that is the LCP candidate. */
  readonly priority?: boolean;
  readonly objectPosition?: string;
};

export function ImageSlot({
  src,
  alt,
  placeholder,
  sizes = "100vw",
  className,
  priority = false,
  objectPosition,
}: ImageSlotProps) {
  const wrapClass = className ? `slot-wrap ${className}` : "slot-wrap";

  if (!src) {
    return (
      <span className={wrapClass}>
        <span className="slot" aria-hidden={alt === "" ? true : undefined}>
          {placeholder}
        </span>
      </span>
    );
  }

  return (
    <span className={wrapClass}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="slot__img"
        {...(objectPosition ? { style: { objectPosition } } : {})}
      />
    </span>
  );
}
