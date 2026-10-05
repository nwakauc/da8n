"use client";

import { useEffect, useRef, useState } from "react";
import { ImageSlot } from "../ImageSlot";
import { Check, RealMeSeal } from "../icons";
import { EXAMPLE_PROFILES, HOW, MAYA_PHOTOS, STEPS } from "@/content/landing";

const ACCENT: Record<string, string> = {
  ink: "var(--da8n-ink)",
  rose: "var(--da8n-rose)",
  green: "var(--da8n-green)",
  gold: "var(--da8n-gold)",
};

const ADVANCE_MS = 4500;

/**
 * "How it works" — five steps, each with a phone screen.
 *
 * ACCESSIBILITY DECISIONS, because this is the one component where they are
 * not obvious:
 *
 *   Tabs, not buttons. The steps select among sibling panels, which is the
 *   tab pattern, so they get `role="tab"` inside a `role="tablist"` with
 *   arrow-key, Home and End navigation. Without that a keyboard user can
 *   reach the steps but has no idea they control anything.
 *
 *   Auto-advance stops permanently on the first interaction — click, focus or
 *   pointer-enter. WCAG 2.2.2 requires a way to pause moving content, and a
 *   rotation that resumes after you have taken control is worse than none: it
 *   yanks the panel out from under someone mid-read.
 *
 *   Auto-advance never starts for `prefers-reduced-motion: reduce`. The media
 *   query is read in an effect rather than CSS because this is a state
 *   machine, not a transition — CSS can stop the crossfade but not the timer.
 *
 *   Inactive panels are `aria-hidden` and `inert`-equivalent (pointer-events
 *   off in CSS, tabIndex -1 on nothing focusable inside). All five stay in the
 *   DOM so the crossfade has something to cross to, and so the content is in
 *   the HTML for crawlers.
 */
export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (held) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      setActive((step) => (step + 1) % STEPS.length);
    }, ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [held]);

  const select = (index: number) => {
    setHeld(true);
    setActive(index);
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = STEPS.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    select(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <section id="how" className="sec how" aria-labelledby="how-title">
      <div className="sec__in">
        <div className="how__col">
          <span className="eyebrow">{HOW.eyebrow}</span>
          <h2 id="how-title" className="how__title">
            {HOW.title}
            <span className="rose">{HOW.titleAccent}</span>
          </h2>

          <div className="steps" role="tablist" aria-orientation="vertical" aria-label="How DA8N works">
            {STEPS.map((step, index) => (
              <button
                key={step.label}
                ref={(node) => {
                  tabsRef.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`step-tab-${index}`}
                aria-selected={index === active}
                aria-controls={`step-panel-${index}`}
                tabIndex={index === active ? 0 : -1}
                className="step"
                style={{ "--accent": ACCENT[step.accent] } as React.CSSProperties}
                onClick={() => select(index)}
                onFocus={() => setHeld(true)}
                onPointerEnter={() => setHeld(true)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                <span className="step__dot" aria-hidden="true" />
                <span className="step__body">
                  <b className="step__label">{step.label}</b>
                  <span className="step__detail">
                    <span>{step.detail}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="how__stage">
          {STEPS.map((step, index) => (
            <div
              key={step.label}
              id={`step-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`step-tab-${index}`}
              aria-hidden={index !== active}
              data-on={index === active}
              className="how__panel"
            >
              <PhoneScreen index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ phones */

function PhoneFrame({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="phone">
      <div className="phone__screen">
        <div className="phone__status" aria-hidden="true">
          <span>9:41</span>
          <span className="phone__notch" />
          <span className="phone__batt" />
        </div>
        <div className="phone__view">{children}</div>
      </div>
    </div>
  );
}

const { maya, marcus } = EXAMPLE_PROFILES;

function MayaAvatar({ className }: { readonly className?: string }) {
  return <ImageSlot src={maya.photo} alt="" placeholder="Photo" className={className} sizes="44px" />;
}

function PhoneScreen({ index }: { readonly index: number }) {
  if (index === 0) {
    return (
      <PhoneFrame>
        <b className="phone__h">Your photos</b>
        <div className="phone__grid3">
          {MAYA_PHOTOS.map((photo) => (
            <div key={photo} className="phone__thumb">
              <ImageSlot src={photo} alt="" placeholder="Photo" className="slot-fill" sizes="80px" />
            </div>
          ))}
          {[3, 4, 5].map((slot) => (
            <div key={slot} className="phone__thumb phone__thumb--empty" aria-hidden="true">
              +
            </div>
          ))}
        </div>
        <div className="phone__field">
          <span>NAME</span>
          <span>{maya.name}</span>
        </div>
        <div className="phone__field">
          <span>ABOUT YOU</span>
          <span>Architect. Always planning the next trip.</span>
        </div>
        <div className="phone__cta">Next</div>
      </PhoneFrame>
    );
  }

  if (index === 1) {
    const intents: ReadonlyArray<readonly [string, boolean]> = [
      ["Dating", false],
      ["Love", false],
      ["A relationship", false],
      ["Marriage", true],
    ];
    return (
      <PhoneFrame>
        <b className="phone__h">I&apos;m looking for</b>
        {intents.map(([label, on]) => (
          <div key={label} className={on ? "phone__opt phone__opt--on" : "phone__opt"}>
            {label}
            <i />
          </div>
        ))}
        <b className="phone__sub">Open to meeting people in</b>
        <div className="chips">
          <span className="chip">London</span>
          <span className="chip">Toronto</span>
          <span className="chip chip--off">Worldwide</span>
        </div>
        <div className="phone__cta">Continue</div>
      </PhoneFrame>
    );
  }

  if (index === 2) {
    return (
      <PhoneFrame>
        <div className="phone__rowhead">
          <b>For you</b>
          <span>Picked for you</span>
        </div>
        <div className="phone__hero">
          <ImageSlot
            src={marcus.photo}
            alt=""
            placeholder={marcus.name}
            className="slot-fill"
            sizes="272px"
          />
          <div className="phone__heroCap">
            <b>
              {marcus.name}
              <RealMeSeal size={18} />
            </b>
            <span>New York · open to London</span>
          </div>
        </div>
        <div className="phone__why">
          <b>Why you may connect</b>
          <span>Both want marriage · Both open to distance</span>
        </div>
      </PhoneFrame>
    );
  }

  if (index === 3) {
    return (
      <PhoneFrame>
        <b className="phone__h">RealMe</b>
        <span className="phone__note">Verify before you send your first message.</span>
        <div className="phone__id">
          <MayaAvatar />
          <span className="phone__avatarRow">
            <b>
              {maya.name}
              <RealMeSeal size={18} />
            </b>
          </span>
        </div>
        {["Government ID", "Live selfie", "Photos match"].map((label) => (
          <div key={label} className="phone__check">
            {label}
            <span className="tick" style={{ width: 16, height: 16 }}>
              <Check size={10} />
            </span>
          </div>
        ))}
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="phone__avatarRow">
        <MayaAvatar />
        <b>
          {maya.firstName}
          <RealMeSeal size={15} />
        </b>
      </div>
      <div className="phone__msg">
        Your photo from the Lisbon bookshop got me. I&apos;d love to hear the story over coffee
        sometime.
      </div>
      <span className="phone__sent">Introduction sent</span>
      <div className="phone__open">
        <b>{maya.firstName} would like to meet you too</b>
        <span>Your conversation is open.</span>
      </div>
      <div className="phone__cta">Say hello</div>
    </PhoneFrame>
  );
}
