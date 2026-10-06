import { ImageSlot } from "../ImageSlot";
import { PoweredByD8n } from "../PoweredByD8n";
import { RealMeBadge } from "../RealMeBadge";
import { RealMeSeal } from "../icons";
import { EXAMPLE_PROFILES, HERO } from "@/content/landing";
import { JOIN_URL } from "@/lib/app-links";

/**
 * Hero.
 *
 * v4 removed the handwritten line under the card ("Be the real you. / Your
 * person wants the authentic you."). It sat in Caveat over the photograph at
 * white-on-variable-photo, which is the one piece of text on the page whose
 * contrast could not be guaranteed, and it said something the four pillars
 * directly below say better. Nothing replaced it: the card is the subject.
 *
 * The photograph is the design's own `hero-waterfront` (1536x1024), supplied
 * by the owner and re-encoded to JPEG. It is landscape, which matters: the
 * earlier stand-in was a 654x956 portrait and `cover` had to upscale it ~2.2x
 * across a full-bleed hero, which looked exactly as bad as that sounds.
 *
 * `--hero-img` has a `none` fallback with a warm background colour behind it,
 * so a missing or mistyped path degrades to a flat tone rather than a hole.
 *
 * It is a CSS background rather than `next/image` because on wide viewports it
 * is a full-bleed bleed behind a scrim with no intrinsic box — and because at
 * that size it sits under a 96%-opaque gradient, so it is decoration, not the
 * LCP element.
 *
 * Below 1000px the photo becomes a stacked band under the copy and the profile
 * card is hidden, which is the design's own behaviour: at that width the card
 * would cover the headline.
 */
export function Hero() {
  const { marcus } = EXAMPLE_PROFILES;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div
        className="hero__photo"
        aria-hidden="true"
        style={{ "--hero-img": "url('/images/landing/hero-waterfront.jpg')" } as React.CSSProperties}
      />
      <div aria-hidden="true" className="hero__scrim" />
      <div aria-hidden="true" className="hero__fade" />

      <div className="hero__body">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            {HERO.title}
            <span className="rose">{HERO.titleAccent}</span>
          </h1>
          <p className="hero__sub">{HERO.subTitle}</p>

          <div className="hero__cta">
            <a href={JOIN_URL()} className="btn btn--primary">
              {HERO.cta}
              {/* Decorative. `.btn` already reserves the gap for it. */}
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="hero__trust">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <RealMeBadge />
              <PoweredByD8n />
            </div>
            <span className="hero__note">{HERO.note}</span>
          </div>
        </div>

        <div className="hero__aside">
          <figure className="pcard hero__card">
            <div className="pcard__media">
              {/*
                `priority` — this is the only above-the-fold raster image on
                the site and the LCP candidate on wide viewports, where the
                hero backdrop is a CSS background under a 96%-opaque gradient
                and the headline is text. `ImageSlot` has had the prop since it
                was written and nothing set it, so this card lazy-loaded and
                popped in after first paint.
              */}
              <ImageSlot
                src={marcus.photo}
                alt=""
                placeholder={`${marcus.name} · New York`}
                className="slot-fill"
                sizes="270px"
                priority
              />
              <span className="pcard__online">
                <span className="dot" />
                Online
              </span>
            </div>
            <figcaption className="pcard__cap">
              {/*
                Decorative in this context: the card is a depiction of the
                interface, so the heart is not an action a visitor can take.
                Rendered as a <span>, not an <a>, so it is not a dead link and
                not in the tab order.
              */}
              <span className="pcard__like" aria-hidden="true">
                ♥
              </span>
              <span className="pcard__name">
                {marcus.name}
                <RealMeSeal size={24} label="RealMe verified" />
              </span>
              <span className="pcard__where">
                <span aria-hidden="true">{marcus.flag}</span>
                {marcus.where}
              </span>
              <span className="pcard__intent">{marcus.intent}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
