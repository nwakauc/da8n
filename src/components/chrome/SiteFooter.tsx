import Link from "next/link";
import { Heart } from "../icons";
import {
  FOOTER_COLUMNS,
  FOOTER_TAGLINE,
  LANDING_CITIES,
  legalLine,
  type NavItem,
} from "@/content/landing";
import { findCity } from "@/content/cities";
import { cityPath } from "@/lib/routing";
import { navHref } from "@/lib/nav";

/**
 * Site footer.
 *
 * The CITIES column is generated from the catalog rather than hand-listed, so
 * a footer link can never point at a city that does not exist. The design's
 * footer listed Dubai, which was not a market — exactly the class of mistake a
 * derived list makes impossible.
 */

function FooterLink({ link }: { readonly link: NavItem }) {
  return <Link href={navHref(link.href)}>{link.label}</Link>;
}

export function SiteFooter() {
  const cityLinks = LANDING_CITIES.slice(0, 4).flatMap((entry) => {
    const city = findCity(entry.countryCode, entry.slug);
    return city ? [{ label: entry.label, href: cityPath(city) }] : [];
  });

  return (
    <footer className="site-foot">
      <div className="site-foot__in">
        <div className="site-foot__cols">
          <div className="site-foot__brand">
            <span>
              <span className="wordmark__text">
                da<span className="rose">8</span>n
              </span>
              <Heart size={12} className="wordmark__heart" />
            </span>
            <p>{FOOTER_TAGLINE}</p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading} className="site-foot__col">
              <b>{column.heading}</b>
              {column.links.map((link) => (
                <FooterLink key={`${column.heading}-${link.label}`} link={link} />
              ))}
            </div>
          ))}

          <div className="site-foot__col">
            <b>CITIES</b>
            {cityLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            {/* `#cities` is the grid on the landing page; there is no /cities
                index route yet. */}
            <Link href="/#cities">All cities</Link>
          </div>
        </div>

        <div className="site-foot__legal">
          <span>{legalLine()}</span>
          <span>
            Powered by <b>D8N</b>
          </span>
        </div>
      </div>
    </footer>
  );
}
