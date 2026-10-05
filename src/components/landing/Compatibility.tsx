import { ImageSlot } from "../ImageSlot";
import { Bolt, Check, RealMeSeal } from "../icons";
import { COMPAT, EXAMPLE_PROFILES, READY } from "@/content/landing";

/**
 * Compatibility, with the Ready panel alongside it.
 *
 * `#ready` is an anchor the primary nav links to, so it has to be an id on
 * something real — it lives on the Ready panel rather than on a wrapper, so
 * the jump lands on the heading a visitor came to read.
 *
 * The "Why you may connect" list is signal, not score: five plain statements,
 * no percentage, no ranking. That is the honest shape for compatibility — a
 * number implies a precision the model does not have, and invites members to
 * treat it as a verdict on a person.
 */
export function Compatibility() {
  const { maya } = EXAMPLE_PROFILES;

  return (
    <section id="compatibility" className="sec compat" aria-labelledby="compat-title">
      <div className="sec__in">
        <div className="compat__shot">
          <ImageSlot
            src={maya.photo}
            alt=""
            placeholder="Member photo"
            className="slot-fill"
            sizes="(min-width: 1100px) 400px, (min-width: 760px) 50vw, 100vw"
          />
          <span className="compat__online">
            <span className="dot dot--ring" />
            Online now
          </span>
          <div className="compat__who">
            <b>
              {maya.name}
              <RealMeSeal size={20} label="RealMe verified" />
            </b>
            <span>{maya.where}</span>
            <span className="green">{maya.intent}</span>
          </div>
        </div>

        <div className="compat__col">
          <span className="eyebrow">{COMPAT.eyebrow}</span>
          <h2 id="compat-title" className="compat__title">
            {COMPAT.title}
            <span className="rose">{COMPAT.titleAccent}</span>
          </h2>
          <p>{COMPAT.lede}</p>

          <div className="panel">
            <b>{COMPAT.panelTitle}</b>
            <ul className="ticks">
              {COMPAT.reasons.map((reason) => (
                <li key={reason}>
                  <span className="tick tick--sm">
                    <Check size={11} />
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div id="ready" className="ready">
          <h3>
            {READY.title}
            <span className="rose">{READY.titleAccent}</span>
          </h3>
          <p>{READY.body}</p>

          <div className="ready__state">
            <span className="ready__bolt">
              <Bolt size={22} />
            </span>
            <span className="ready__meta">
              <b>{READY.stateLabel}</b>
              <span className="ready__left">{READY.stateLeft}</span>
            </span>
          </div>

          <div className="ready__tags">
            {READY.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
