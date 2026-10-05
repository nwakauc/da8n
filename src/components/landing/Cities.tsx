import Link from "next/link";
import { ImageSlot } from "../ImageSlot";
import { ALL_CITIES_FACES, CITIES_SECTION, EXAMPLE_PROFILES, LANDING_CITIES } from "@/content/landing";
import { findCity } from "@/content/cities";
import { cityPath } from "@/lib/routing";

/**
 * City grid.
 *
 * Every card's href comes from `cityPath(findCity(...))`, never from a string
 * in the content file. A card whose city is not in the catalog is dropped
 * rather than rendered as a dead link — the homepage is the highest-authority
 * page on the site and the last place that should leak 404s into a crawl.
 *
 * `sizes` matters here: seven cards at up to 280px in a `auto-fill` grid. Left
 * at the default `100vw`, Next would serve each one a viewport-width image.
 */
export function Cities() {
  const cards = LANDING_CITIES.flatMap((entry) => {
    const city = findCity(entry.countryCode, entry.slug);
    return city ? [{ ...entry, href: cityPath(city) }] : [];
  });

  return (
    <section id="cities" className="sec cities" aria-labelledby="cities-title">
      <div className="sec__in">
        <div className="cities__head">
          <span className="eyebrow">{CITIES_SECTION.eyebrow}</span>
          <h2 id="cities-title" className="cities__title">
            {CITIES_SECTION.title}
            <span className="rose">{CITIES_SECTION.titleAccent}</span>
          </h2>
          <p className="cities__lede">{CITIES_SECTION.lede}</p>
        </div>

        <div className="cities__grid">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="ccard">
              <ImageSlot
                src={card.photo}
                alt=""
                placeholder={card.label}
                className="slot-fill"
                sizes="(min-width: 560px) 280px, 50vw"
              />
              <div className="ccard__veil">
                <div className="ccard__text">
                  <span className="ccard__country">
                    <span aria-hidden="true">{card.flag}</span> {card.countryLabel}
                  </span>
                  <h3>{card.label}</h3>
                </div>
                <span className="ccard__arrow" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          ))}

          {/*
            Not a link. There is no city-index route yet — `/cities` is a
            reserved slug with nothing served at it — and a prominent tile
            pointing at a 404 from the highest-authority page on the site is
            worse than a tile that is plainly informational. Becomes an <a>
            the moment the index route lands.
          */}
          <div className="ccard ccard--all">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span className="ccard__country">{CITIES_SECTION.allKicker}</span>
              <h3>{CITIES_SECTION.allLabel}</h3>
            </div>
            <div className="ccard__stack">
              <span className="ccard__faces">
                {ALL_CITIES_FACES.map((face) => (
                  <ImageSlot key={face} src={face} alt="" placeholder="" sizes="34px" />
                ))}
              </span>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>

        <div className="places">
          <p>{CITIES_SECTION.note}</p>
          <div className="places__who">
            <ImageSlot
              src={EXAMPLE_PROFILES.maya.photo}
              alt=""
              placeholder="Photo"
              sizes="64px"
            />
            {/*
              A definition list, not a grid of spans: these are label/value
              pairs, and <dl> is what says so to anything that is not a
              browser. The design renders the same four cells.
            */}
            <dl className="places__kv">
              <dt>Lives in</dt>
              <dd>Manchester</dd>
              <dt>Open to</dt>
              <dd className="green">London · Toronto · Worldwide</dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
