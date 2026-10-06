import { ImageSlot } from "../ImageSlot";
import { Eyebrow } from "./Eyebrow";
import { FEATURED_STORY, STORIES, STORIES_SECTION } from "@/content/landing";

const ACCENT: Record<string, string> = {
  rose: "var(--da8n-rose)",
  green: "var(--da8n-green)",
  gold: "var(--da8n-gold-ink)",
};

/**
 * Member stories — one featured, two beside it.
 *
 * WHY THE RAIL WENT. v3 ran three equal cards in a horizontally scrolling rail.
 * Equal weight was the problem: it gave a two-year cross-border relationship
 * the same twenty words as the other two, and the scroll meant the third card
 * was never seen on a phone. v4 gives one story the full width with three dated
 * milestones, and the other two become wide cards that both fit on screen. No
 * rail, so no hidden content and no keyboard-scroll workaround.
 *
 * CONSENT IS A CONTENT TASK, NOT A CODE ONE. These cards name real couples and
 * state real dates, so every quote published here needs the couple's written
 * consent on file — the FTC endorsement rules and the UK CAP code both treat an
 * invented testimonial as a misleading claim, and the featured card's timeline
 * is the strongest endorsement claim on the page. Swapping in a consented story
 * touches `who`, `quote`, `chips` and `photo` in `content/landing.ts` and
 * nothing here.
 *
 * No Review or AggregateRating structured data is emitted for this section.
 */
export function Stories() {
  return (
    <section id="stories" className="sec stories" aria-labelledby="stories-title">
      <div className="sec__in">
        <div className="sec__head">
          <Eyebrow num={STORIES_SECTION.num}>{STORIES_SECTION.eyebrow}</Eyebrow>
          <h2 id="stories-title" className="sec__title">
            {STORIES_SECTION.title}
            <span className="rose">{STORIES_SECTION.titleAccent}</span>
          </h2>
        </div>

        <article className="feat">
          <div className="feat__media">
            <ImageSlot
              src={FEATURED_STORY.photo}
              alt=""
              placeholder="Couple photo"
              className="slot-fill"
              sizes="(min-width: 860px) 46vw, 100vw"
            />
          </div>
          <div className="feat__body">
            <blockquote>{FEATURED_STORY.quote}</blockquote>
            <div className="feat__who">
              <b>{FEATURED_STORY.who}</b>
              <span>{FEATURED_STORY.route}</span>
            </div>

            {/*
              An ordered list: these are three points on one timeline and the
              order is the content. Rendered as a row of three on wide
              viewports, stacked below.
            */}
            <ol className="feat__steps">
              {FEATURED_STORY.milestones.map((milestone) => (
                <li
                  key={milestone.label}
                  style={{ "--accent": ACCENT[milestone.accent] } as React.CSSProperties}
                >
                  <span>{milestone.label}</span>
                  <b>{milestone.value}</b>
                </li>
              ))}
            </ol>
          </div>
        </article>

        <div className="stories__grid">
          {STORIES.map((story) => (
            <figure key={story.who} className="story">
              <div className="story__media">
                <ImageSlot
                  src={story.photo}
                  alt=""
                  placeholder="Couple photo"
                  className="slot-fill"
                  sizes="(min-width: 1100px) 24vw, (min-width: 560px) 34vw, 100vw"
                />
              </div>
              <figcaption>
                <blockquote>{story.quote}</blockquote>
                <div className="story__who">
                  <b>{story.who}</b>
                  <span className="story__chips">
                    {story.chips.map((chip, position) => (
                      <span key={chip} className={position === 0 ? "chip chip--ink" : "chip"}>
                        {chip}
                      </span>
                    ))}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
