import { ImageSlot } from "../ImageSlot";
import { STORIES, STORIES_SECTION } from "@/content/landing";

/**
 * Member stories.
 *
 * Every entry in `STORIES` currently has `consented: false`, so every card
 * carries a visible DRAFT stamp. That is not a hedge — it is the difference
 * between a design placeholder and a fabricated testimonial. A quoted couple
 * with a name and a wedding year is read as a real endorsement by visitors and
 * by regulators (the FTC's endorsement rules and the UK CAP code both treat an
 * invented testimonial as a misleading claim), and nothing on the card itself
 * would tell a reader otherwise.
 *
 * The stamp is the design's own DRAFT idiom, already used on the membership
 * section, rather than a new visual invention.
 *
 * To publish real stories: get written consent, replace the quote, name and
 * date, set `consented: true`. The stamp disappears on its own. Do not flip
 * the flag to clear the stamp — `landing.test.ts` asserts that a consented
 * story is not one of the placeholder quotes.
 *
 * No Review or AggregateRating structured data is emitted for this section,
 * now or after the stories are real.
 */
export function Stories() {
  return (
    <section id="stories" className="sec stories" aria-labelledby="stories-title">
      <div className="sec__in">
        <div className="sec__head">
          <span className="eyebrow">{STORIES_SECTION.eyebrow}</span>
          <h2 id="stories-title" className="sec__title">
            {STORIES_SECTION.title}
            <span className="rose">{STORIES_SECTION.titleAccent}</span>
          </h2>
          <p className="sec__lede">{STORIES_SECTION.lede}</p>
        </div>

        {/*
          tabIndex + role: below 560px this rail scrolls horizontally with the
          scrollbar hidden, so without a tab stop the off-screen cards are
          unreachable without a pointer. One stop makes the region
          keyboard-scrollable (WCAG 2.1.1).
        */}
        <div className="rail" tabIndex={0} role="group" aria-label="Member stories">
          {STORIES.map((story) => (
            <figure key={story.who} className="story">
              <div className="story__media">
                <ImageSlot
                  src={story.photo}
                  alt=""
                  placeholder="Couple photo"
                  className="slot-fill"
                  sizes="(min-width: 860px) 400px, (min-width: 560px) 100vw, 84vw"
                />
              </div>
              <blockquote>{story.quote}</blockquote>
              <figcaption>
                <b>
                  {story.who}
                  {story.consented ? null : <span className="draft">DRAFT</span>}
                </b>
                <span>
                  {story.consented
                    ? story.meta
                    : "Illustration — not yet a real member story"}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
