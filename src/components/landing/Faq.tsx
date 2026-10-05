import { FAQS, FAQ_SECTION } from "@/content/landing";

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
          <span className="eyebrow">{FAQ_SECTION.eyebrow}</span>
          <h2 id="faq-title">{FAQ_SECTION.title}</h2>
          <p>{FAQ_SECTION.lede}</p>
        </div>

        <div className="faq__list">
          {FAQS.map((faq) => (
            <details key={faq.question} className="faq__item">
              <summary className="faq__q">
                {faq.question}
                <i aria-hidden="true">+</i>
              </summary>
              <p className="faq__a">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
