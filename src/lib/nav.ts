/**
 * Where a navigation target actually points.
 *
 * Every section id on this site lives on the landing page (`#how`, `#cities`,
 * `#safety`, `#ready`, `#stories`, `#membership`, `#compatibility`, `#faq`,
 * `#why`). The header and footer are rendered by `layout.tsx` on all 44
 * routes, so a bare fragment was dead on the 43 that are not the landing
 * page: the browser looked for the id, found nothing, and stayed put. No
 * error, no feedback, no navigation — the worst kind of broken, because it
 * looks like the page simply ignored you.
 *
 * Resolving against `/` makes a link mean what its label says from anywhere.
 * Paired with `next/link` it stays a client-side navigation, so landing-to
 * -landing is still just a scroll.
 */
export function navHref(href: string): string {
  return href.startsWith("#") ? `/${href}` : href;
}
