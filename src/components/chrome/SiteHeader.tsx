"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Burger, Heart } from "../icons";
import { PRIMARY_NAV } from "@/content/landing";
import { JOIN_URL, SIGN_IN_URL } from "@/lib/app-links";
import { navHref } from "@/lib/nav";

/**
 * Site header.
 *
 * This is the only client component in the chrome, and it is a client
 * component for exactly one reason: the mobile menu needs open/closed state.
 * Everything else — the wordmark, the links, the CTAs — renders on the server
 * and is in the HTML before hydration.
 *
 * The menu's visibility is driven by the `hidden` attribute rather than a
 * conditional render, so the links exist in the DOM for crawlers and for
 * users on a wide viewport where the sheet is never shown. `hidden` plus the
 * CSS `[hidden] { display: none }` is honoured even before hydration, and
 * `aria-expanded` keeps the button's state announced.
 *
 * DISMISSAL. An expanded disclosure has to be escapable, and closing it has to
 * put focus back where it came from — otherwise focus is left on an element
 * that is now `hidden`, and the next Tab restarts from the top of the
 * document. Three ways out, all of them returning focus to the button:
 * Escape, a pointer press outside, and following a link. There is no focus
 * trap, deliberately: this is a disclosure, not a modal dialog, and the page
 * behind it is not inert.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  /** Close, and hand focus back to the control that opened it. */
  const close = () => {
    setOpen(false);
    burgerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    // `pointerdown`, not `click`: a press outside should dismiss before the
    // target handles it, which is what a sheet is expected to do.
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header className="site-head">
      <nav aria-label="Primary" ref={navRef}>
        <div className="site-head__bar">
          <Link href="/" className="wordmark">
            <span className="wordmark__text">
              da<span className="rose">8</span>n
            </span>
            <Heart size={12} className="wordmark__heart" />
            <span className="wordmark__tag">pronounced dating</span>
          </Link>

          {/*
            `navHref` resolves a section fragment against `/`. These links
            pointed at bare `#how`, `#cities`, … which exist only on the
            landing page, so on all 43 market and city routes clicking a
            primary nav item did nothing at all.
          */}
          <div className="nav-links">
            {PRIMARY_NAV.map((item) => (
              <Link key={item.href} href={navHref(item.href)}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            {/*
              Language switcher. There is one locale today, so this is a
              static label rather than a control: a menu that cannot change
              anything is worse than no menu. It becomes a real <select> when
              the locale segment lands — see the i18n TODO in layout.tsx.
            */}
            <span className="nav-pill" aria-label="Language: English">
              EN
            </span>
            <a href={SIGN_IN_URL()} className="nav-login">
              Log in
            </a>
            <a href={JOIN_URL()} className="nav-join">
              Join da8n
            </a>
            <button
              ref={burgerRef}
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              aria-controls="nav-sheet"
              onClick={() => setOpen((value) => !value)}
              className="burger"
            >
              <Burger open={open} />
            </button>
          </div>
        </div>

        <div id="nav-sheet" className="nav-sheet" hidden={!open}>
          {PRIMARY_NAV.map((item) => (
            <Link key={item.href} href={navHref(item.href)} onClick={close}>
              {item.label}
            </Link>
          ))}
          <div className="nav-sheet__actions">
            <a href={SIGN_IN_URL()}>Log in</a>
            {/* Not a link: one locale, nothing to switch to yet. */}
            <span aria-label="Language: English">EN</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
