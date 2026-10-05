import type { Metadata } from "next";
import { Bricolage_Grotesque, Caveat, Manrope } from "next/font/google";
import "./globals.css";
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  getSiteUrl,
  organizationJsonLd,
  toJsonLdScript,
  websiteJsonLd,
} from "@/lib/seo";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";

/**
 * Typefaces, self-hosted via `next/font/google`.
 *
 * The design loads these from fonts.googleapis.com with a <link>. Doing that
 * here would cost two extra connections on the critical path and hand a
 * third party a request from every visitor. `next/font` downloads the files at
 * build time, serves them from this origin, and inlines a `@font-face` with a
 * size-adjusted local fallback, which removes the layout shift when the web
 * font swaps in. It also means no cookie-less-domain exception to argue about
 * in a privacy review.
 *
 * Weights are pinned to exactly what the design uses — nothing is loaded
 * speculatively. Bricolage Grotesque is a variable font, so `weight` takes a
 * range and one file covers 500/700/800.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-caveat",
  display: "swap",
});

/**
 * Root layout.
 *
 * What is deliberate here and should survive future redesigns:
 *   - semantic landmarks (banner / navigation / main / contentinfo)
 *   - a skip link as the first focusable element
 *   - `lang` on <html>, so screen readers and translation both work
 *   - sitewide Organization + WebSite JSON-LD, emitted once
 *   - metadataBase, so every relative canonical resolves to the right origin
 *   - `robots: { index: false }` as the SITE-WIDE DEFAULT. Pages opt in via
 *     buildPageMetadata({ indexable: true }), never the other way round.
 */
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // TODO(i18n): `lang` is hardcoded until the locale segment lands. The market
  // catalog already models defaultLocale/supportedLocales per market, so this
  // becomes a lookup rather than a rewrite. Country != language.
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${manrope.variable} ${caveat.variable}`}
    >
      <body>
        {/* In-page fragment, not navigation: a plain anchor is correct here. */}
        <a className="da8n-skip" href="#main">
          Skip to content
        </a>

        <SiteHeader />

        <main id="main">{children}</main>

        <SiteFooter />

        <script
          type="application/ld+json"
          // Escaped by toJsonLdScript; no user input reaches this.
          dangerouslySetInnerHTML={{
            __html: toJsonLdScript([organizationJsonLd(), websiteJsonLd()]),
          }}
        />
      </body>
    </html>
  );
}
