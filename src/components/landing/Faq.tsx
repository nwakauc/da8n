import Link from "next/link";
import { Eyebrow } from "./Eyebrow";
import { FAQS, FAQ_SECTION, GUIDES_CARD } from "@/content/landing";
import { findGuide, guidePath } from "@/content/guides";

/**
 * FAQ.
 *
 * Native `<details>`/`<summary>`. No JS, no ARIA bolted on: the element is
 * already a disclosure widget with correct keyboard behaviour and correct
 * expanded-state announcement, and every answer is in the HTML whether or not
 * it is open — which is what makes the FAQPage structured data in `page.tsx`
 * truthful. Content hidden behind a JS accordion would still be indexable,
 * but it would not be in the document for a reader with JS off.
 *
 * The "+" marker is a decorative `<i>` rotated 45° when open. `list-style:
 * none` plus the `::-webkit-details-marker` reset removes the native triangle.
 */
export function Faq() {
  return (
    <section id="faq" className="sec faq" aria-labelledby="faq-title">
      <div className="sec__in">
        <div className="faq__intro">
          <Eyebrow num={FAQ_SECTION.num}>{FAQ_SECTION.eyebrow}</Eyebrow>
          <h2 id="faq-title">{FAQ_SECTION.title}</h2>

          {/*
            The guides card. Titles come from `content/guides.ts` by slug
            rather than being written here, so the card can never advertise a
            guide that does not exist — a missing slug is dropped, and
            `landing.test.ts` fails first.
          */}
          <div className="guides">
            <span className="guides__kicker">{GUIDES_CARD.kicker}</span>
            <b className="guides__title">
              {GUIDES_CARD.title}
              <span className="rose">{GUIDES_CARD.titleAccent}</span>
              {GUIDES_CARD.titleTail}
            </b>
            <ul className="guides__list">
              {GUIDES_CARD.slugs.flatMap((slug) => {
                const guide = findGuide(slug);
                if (!guide) return [];
                return [
                  <li key={slug}>
                    <Link href={guidePath(slug)}>
                      {guide.title}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>,
                ];
              })}
            </ul>
            <Link href="/guides" className="guides__all">
              All guides
            </Link>
          </div>
        </div>

        {/*
          Two columns of questions, split where the design splits them: five
          then four. Source order is reading order, so the split is a slice
          rather than a column-count — CSS `columns` would reflow the nine into
          an order that does not match the DOM, and a keyboard user tabbing
          through a disclosure list would jump around the page.
        */}
        {[FAQS.slice(0, 5), FAQS.slice(5)].map((column) => (
          <div key={column[0].question} className="faq__col">
            {column.map((faq) => (
              <details key={faq.question} className="faq__item">
                <summary className="faq__q">
                  {faq.question}
                  <i aria-hidden="true">+</i>
                </summary>
                <p className="faq__a">{faq.answer}</p>
              </details>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
