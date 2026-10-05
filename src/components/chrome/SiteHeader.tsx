"use client";

import { useState } from "react";
import Link from "next/link";
import { Burger, Heart } from "../icons";
import { PRIMARY_NAV } from "@/content/landing";
import { JOIN_URL, SIGN_IN_URL } from "@/lib/app-links";

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
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-head">
      <nav aria-label="Primary">
        <div className="site-head__bar">
          <Link href="/" className="wordmark">
            <span className="wordmark__text">
              da<span className="rose">8</span>n
            </span>
            <Heart size={12} className="wordmark__heart" />
            <span className="wordmark__tag">pronounced dating</span>
          </Link>

          <div className="nav-links">
            {PRIMARY_NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
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
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
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
