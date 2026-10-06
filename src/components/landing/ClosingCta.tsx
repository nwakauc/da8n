import Image from "next/image";
import { OUTRO, STORE_BADGES } from "@/content/landing";
import { androidStoreUrl, JOIN_URL } from "@/lib/app-links";

/**
 * Closing CTA — full-bleed photograph with the final headline over it.
 *
 * `next/image` with `fill` rather than a CSS background, unlike the hero: this
 * one is a real content image at the bottom of the page, so it benefits from
 * the AVIF/WebP pipeline and from lazy loading (no `priority` — it is far
 * below the fold, and preloading it would compete with the hero).
 *
 * `alt=""` is deliberate. The photograph carries mood, not information; the
 * headline beside it says everything a screen-reader user needs, and
 * describing the picture would add noise before the one CTA that matters.
 */
export function ClosingCta() {
  return (
    <section className="outro" aria-labelledby="outro-title">
      <Image
        src={OUTRO.photo}
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "50% 30%" }}
      />
      <div aria-hidden="true" className="outro__veil" />
      <div className="outro__in">
        <h2 id="outro-title">{OUTRO.title}</h2>
        <p>{OUTRO.body}</p>
        <div className="outro__row">
          <a href={JOIN_URL()} className="btn btn--primary">
            {OUTRO.cta}
          </a>
          <span>{OUTRO.note}</span>
        </div>

        {/*
          Store badges. Android is a real link to a real listing — the Date9ja
          app, which is the member application this whole site hands people to;
          see `STORE_BADGES`. iOS has no listing, so it is a span, and
          "COMING SOON" says why rather than leaving a visitor to discover it.
        */}
        <div className="badges">
          <a
            href={androidStoreUrl()}
            className="badge badge--live"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{STORE_BADGES.android.kicker}</span>
            <b>{STORE_BADGES.android.name}</b>
          </a>
          <span className="badge badge--soon">
            <span>{STORE_BADGES.ios.kicker}</span>
            <b>{STORE_BADGES.ios.name}</b>
          </span>
        </div>
      </div>
    </section>
  );
}
