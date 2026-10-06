/**
 * A numbered section label — "01  WHY DA8N".
 *
 * The numbers are v4's one structural addition to the page: eight sections,
 * counted, so a reader always knows where they are in the argument. They are
 * `aria-hidden` because the count is a wayfinding device for the eye — a
 * screen-reader user navigating by heading gets position from the heading
 * outline, and hearing "zero one" before every label is noise.
 */
export function Eyebrow({ num, children }: { readonly num: string; readonly children: React.ReactNode }) {
  return (
    <span className="eyebrow">
      <b className="eyebrow__num" aria-hidden="true">
        {num}
      </b>
      {children}
    </span>
  );
}
