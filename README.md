# DA8N — public site

- **Owner:** Uchechi Nwaka
- **Status:** Phase 1 in progress — technical shell. **Not** the final DA8N product or design.
- **Last verified:** 2026-10-05

The public, server-rendered acquisition surface for DA8N: markets, cities,
guides, comparisons and product explainers.

DA8N is the global evolution of Date9ja — **one global network with localized
entry points**, not a set of country-specific applications, and not a second
dating product. See `docs/product/plans/2026-10-04-da8n-stage-0-architecture.md`
in the `d8n-monorepo` repository for the approved architecture.

---

## The boundary

This app is the **public SEO surface only**.

| Owns | Does not own |
|---|---|
| home, markets, cities, guides, comparisons, audiences | sign-up, sign-in, onboarding |
| safety and RealMe explainers, about, stories | Discover, Likes, Chats, Profile |
| robots, sitemap, canonicals, structured data | any API call, any member data, any credential |

**It makes no API calls and has no authenticated area.** Member CTAs point at
`NEXT_PUBLIC_APP_ORIGIN` — the existing Date9ja application — while DA8N is
being proven.

### Why the boundary exists, and when it moves

Date9ja and DA8N run side by side until DA8N is proven, then Date9ja traffic
redirects here. DateZA collapses in the same way. **There is no second member
database and no data migration:** `BrandDomain` resolves on the *API* host, and
the member app's BFF sets that `Host` itself, so both consumer hosts resolve the
same brand row and the same `users`. A member who joins on DA8N has a Date9ja
account, because it is the same account.

Keeping the member screens out of this app for now avoids maintaining two
copies of Discover, Likes, Chats and Profile while both brands are live. When
auth and onboarding move here (the planned next step), the shared-backend
picture does not change — only where the screens live.

One real constraint: the D8N session cookie is **host-only** by design
(`Identity::BrowserSession` never sets `Domain=`). A session on `www.da8n.com`
is not a session on `www.date9ja.love`, so a member using both signs in on
both. Cross-host single sign-on would need new authentication machinery and its
own approval.

---

## Running it

```bash
npm ci
npm run check   # lint + typecheck + test
npm run build
npm run dev     # port 3006
```

`npm run check` must be green before anything is merged. This app is **not**
covered by the `d8n-monorepo` CI workflows — it is a separate repository and
needs its own.

---

## Architecture

### Route grammar

```
/                        home
/{cc}                    market          /ng, /za, /gb, /us, /ca
/{cc}/{city}             city            /ng/lagos, /za/cape-town
/{cc}/diaspora/{origin}  corridor        /gb/diaspora/ng  (not built)
/cities                  city index
/privacy, /terms         legal
/guides/{slug}           editorial        (not built)
/audiences/{slug}        audience
/compare/{slug}          comparison
```

`gb`, never `uk`. Resolution order is defined once in `src/lib/routing.ts` and
asserted by `routing.test.ts` — reserved namespaces always win, then aliases
redirect, then canonical cities serve. URL semantics are durable SEO contracts;
a slug that changes meaning after it is indexed is a real cost.

### What is where

| | |
|---|---|
| `src/lib/seo.ts` | canonical origin, path normalization, metadata, JSON-LD |
| `src/lib/routing.ts` | deterministic route resolution |
| `src/lib/indexability.ts` | the quality gate — thin-page floor, staleness, private-content check |
| `src/content/markets.ts` | market catalog (country ≠ language ≠ currency ≠ place) |
| `src/content/cities.ts` | canonical cities, with aliases that redirect |
| `src/content/audiences.ts` | age cohorts, communities, intent |
| `src/content/competitors.ts` | comparison entities, with dated facts |
| `src/content/reserved-slugs.ts` | the namespaces that prevent collisions |
| `src/content/registry.ts` | every route, and what may enter a sitemap |
| `src/content/legacy-redirects.ts` | Date9ja + DateZA → DA8N map (not yet wired up) |
| `src/content/landing.ts` | every string the landing page renders, and the content-integrity flags |
| `src/lib/app-links.ts` | where member CTAs point while the member app lives elsewhere |
| `src/app/globals.css` | DA8N design tokens, keyframes, accessibility baseline |
| `src/app/landing.css` | landing page component styles |
| `src/components/landing/` | one component per landing section |
| `src/app/chrome.css` | the header and footer. **Imported by `layout.tsx`, not by a page** |
| `src/content/route-copy.ts` | market/city/index copy, and the availability vocabulary |
| `src/lib/nav.ts` | resolves a section fragment so nav works off the landing page |

### Indexability

Nothing is indexable yet, and the tests enforce that. Two independent gates
must both pass:

- **editorial** — a human set the page's `indexability` to `indexable`
- **measured** — the page clears the quality floor in `src/lib/indexability.ts`

They are separate so an editor cannot override a measured failure and a
measured pass cannot publish something unreviewed. Site-wide, `robots.txt`
serves `Disallow: /` until `DA8N_SEO_ENABLED=true`.

An empty sitemap on a shell is the correct state. `registry.test.ts` fails the
moment something becomes indexable, so the first indexed page is a decision
somebody makes rather than a side effect.

---

## Content rules

These are not stylistic preferences. They are the constraints the product is
built under, and they are enforced by tests where a test can enforce them.

**Never:**

- fabricate member counts, local activity, reviews, testimonials, marriage
  statistics or relationship outcomes
- publish or index a member profile, message, private photo, precise location,
  identity document, report, block or internal trust signal
- emit `Review` or `AggregateRating` schema — for DA8N or for any competitor
- keyword stuff, cloak, build doorway pages, or mass-generate thin pages
- claim a competitor affiliation, endorsement, or official status
- state a competitor feature claim without a dated `factsVerifiedAt` behind it
- make unsupported "#1" or "best" claims
- machine-translate a page and index it

**Privacy wins over SEO, every time.** Aggregates, when they arrive, are
bucketed with a minimum-count floor — a page says there is an active community
in a city, never how many people are within three kilometres of the reader.

---

## Presentation

**Design direction has landed.** The landing page implements *DA8N Landing v3*
from the Claude Design project `b10df277-be97-4da7-b046-5eb6e677f4b7`, imported
2026-10-04. The brand palette, type scale and component system in
`globals.css` and `landing.css` come from that file.

The accessibility baseline that predated the design survives it unchanged:
semantic landmarks, a skip link as the first focusable element, a visible focus
ring on everything, reduced-motion support. **Do not remove those when the
design next changes.**

The market, city, `/cities`, 404 and legal routes now share a second, quieter
system — `.page`, `.chipgrid`, `.prose`, `.notice` in `globals.css` — built on
the same tokens as the landing page. It is not a second design language; it is
the brand's type and ground applied to pages whose editorial copy is still
pending. They were `INTENTIONALLY NEUTRAL` scaffolding until 2026-10-05; see
"Fixed after the design import" below for what that was costing.

### What changed in translation, and why

The design is a canvas file: inline styles, with every responsive value
computed in JavaScript from `window.innerWidth`. Five things were done
differently on purpose, each documented at the point of change:

1. **Responsive values became media queries.** JS-computed breakpoints would
   paint a guessed viewport and then reflow, which costs CLS and makes the
   layout depend on JS running. The breakpoints are the design's own numbers —
   420 / 560 / 640 / 760 / 860 / 960 / 1000 / 1100 / 1180 / 1240.
2. **Fonts are self-hosted** via `next/font/google` instead of a
   `fonts.googleapis.com` link: two fewer connections on the critical path, no
   third-party request per visitor, and no font-swap layout shift.
3. **Decorative animations are opt-in** under `prefers-reduced-motion:
   no-preference`, so the RealMe seal's resting state is its finished state.
   The usual `animation: none` under `reduce` would have left it invisible,
   because the animation is what draws it.
4. **The step list became a tab pattern** with arrow-key navigation, and the
   auto-advance stops permanently on first interaction and never starts under
   reduced motion (WCAG 2.2.2).
5. **No link points at `href="#"`.** The design used it throughout. Anything
   without a destination renders as a label instead — the paid tiers, the
   background-check CTA, the all-cities tile. A test enforces it.

### Content integrity

Two kinds of content on this page are illustrations, not claims, and both are
flagged in `src/content/landing.ts` so the components can label them:

- **`EXAMPLE_PROFILES`** — the hero card and the in-app screens. The hero card
  renders a visible "Example profile" label, because a named person with an
  age, a city, an online dot and a verification seal otherwise reads as a
  member.
- **`STORIES`** — `consented: false` on every entry, so every card carries the
  design's own DRAFT stamp. A quoted couple with a wedding year reads as a
  testimonial whether or not it is labelled one, and an invented testimonial is
  a misleading claim under both the FTC endorsement rules and the UK CAP code.
  Replace with real consented stories and flip the flag; `landing.test.ts`
  fails if the flag is flipped while the placeholder copy is still there.

Neither gets `Review` or `AggregateRating` markup, now or later. The only
structured data the page emits is `WebPage` and `FAQPage`, and the FAQ markup
is generated from the same array the FAQ section renders, so it cannot describe
a question the page does not visibly answer.

### Fixed after the design import (2026-10-05)

A review of the imported shell found five defects that the green check suite
could not see, because nothing in this app renders a component in a test. All
five are fixed; the gap that hid them is the top item under "Next" below.

| | What was wrong | Fix |
|---|---|---|
| 1 | **The header and footer were unstyled on all 43 non-landing routes.** `layout.tsx` renders both on every route; their rules lived in `landing.css`, which only `app/page.tsx` imports. The bar sat in normal flow while `.da8n-shell` still reserved `--head-h` above it, every nav link showed at every width, and the burger showed on desktop | Chrome moved to `src/app/chrome.css`, imported by `layout.tsx`. Shared primitives (`.rose`, `.btn`, `.draft`) moved to `globals.css`. `landing.css` keeps only landing styles, so a city route still does not download them |
| 2 | **"Privacy policy" in the footer pointed at `#safety`** — a marketing section. For a product whose pitch is ID documents and live selfies, that is a misrepresentation about compliance, and `/privacy` + `/terms` are App Store and Play Store requirements regardless | `/privacy` and `/terms` built. Both are drafts carrying a visible review banner, and the legal identity facts are bracketed rather than invented — see "Awaiting legal review" below |
| 3 | **Every header and footer fragment link was dead on non-landing routes.** `#how`, `#cities`, … exist only on the landing page, so on 43 routes clicking a nav item did nothing — no error, no navigation | `src/lib/nav.ts` resolves a fragment against `/`. Footer columns also de-duplicated: five of ten links previously shared a destination with another link |
| 4 | **Three controls looked interactive and were not** — the da8n+ and VIP tier CTAs (same `.tier__cta` pill as the working "Join free"), the "Explore all cities" tile (the most prominent card in the grid, an inert `<div>`), and the background-check request (bold rose text with an arrow). Each absorbed a click and gave no feedback | Tier CTAs and the background-check label take `.is-soon`: flat, muted, dashed, default cursor, "Soon" chip. The cities tile became a **real link** — `/cities` is now built (see below), which was the better fix than demoting the one navigational hub the site wants |
| 5 | **The primary CTA failed WCAG AA.** `globals.css` justified white-on-rose at 3.21:1 as "large text", but `.btn--primary` was 18px/800 and WCAG's large-bold threshold is 14pt = 18.66px, so it was held to the 4.5:1 normal-text bar and failed it | `font-size: 19px` (14.25pt bold) — now genuinely large-scale, so 3.21:1 is compliant, and the approved brand rose is untouched. A deeper fill (`#d92e54`, 4.70:1) is noted in the CSS as the stronger option if the owner wants it |

Smaller items in the same pass: the skip link now moves focus (`<main tabIndex={-1}>` — it previously scrolled but left focus in the header); the city marquee is `aria-hidden` instead of announcing "Cities on DA8N: … Berlin, Singapore, Lisbon", which contradicted this file's own rule that the band claims no operation; the hero profile card is `priority` (it was the only above-the-fold image and was lazy-loaded); the mobile menu closes on Escape and on an outside press, returning focus to the button; `/cities` was reserved only at market level, so `Cities.tsx`'s comment claiming otherwise was wrong and a top-level `/cities` 404'd; `cities.ts` still described `au` as `planned` long after it was promoted; the copyright year is computed; market and city pages emit the `BreadcrumbList` they visibly render.

**Market and city pages have a design now.** They previously printed `Market
status: acquisition. Default locale: en-AE.` and "content is not written yet.
This route exists to prove the grammar and the entity model" — internal
vocabulary, and a dead end on the highest-intent click the site has. They now
carry the brand's type and rhythm, state availability in product voice
(`AVAILABILITY` in `route-copy.ts`, never the raw `status` enum), link onward,
and end on the join CTA. **They still invent nothing**: no member counts, no
local activity, no inventory. The honest-state `.notice` is how a page says its
editorial copy is unwritten, and it is deleted at the same time as that copy is
written, not before.

### Awaiting legal review

`/privacy` and `/terms` are published as **drafts**, with a banner saying so.
Everything technical in the privacy notice was verified against this app's
source — no `fetch`, no cookies, no analytics, no browser storage, no
third-party requests, fonts self-hosted — and it must stay true: if this site
ever gains a form, an embed, an analytics tool or a cookie, that notice changes
in the same slice.

What cannot be inferred from a repository is bracketed in the documents and
needs the founder: legal entity name, registered address, privacy contact
route, DPO or representative where required, log retention period, hosting
processor and region, international transfer mechanism, liability cap,
governing law and jurisdiction. **A privacy notice without a controller
identity and a contact route is not compliant**, so these are blocking for
launch rather than cosmetic.

### Next (not done here)

1. **Component tests.** `vitest.config.mts` is `environment: "node"` and
   `include: ["src/**/*.test.ts"]`, so a `.test.tsx` would not even match. All
   133 tests are catalog and library tests, and every accessibility decision
   documented in the components is unenforced — nothing fails if `role="tab"`
   disappears, if `RealMeBadge` loses its `aria-label`, or if a tier CTA
   becomes a live `<a href="#">`. That is what let all five defects above ship
   green. It needs `jsdom` and a render library, which is a dependency change
   and therefore its own slice.
2. The 11 remaining `STATIC_ROUTES` in `registry.ts` that have no page:
   `/how-it-works`, `/safety`, `/realme`, `/about`, `/markets`, `/guides`,
   `/audiences`, `/compare`, `/stories`, `/help`, `/cookies`. Nothing leaks —
   every one is `entityIndexable: false`, so the sitemap stays empty — but the
   registry currently describes more than the site serves.
3. `isValidDiasporaCorridor` checks `destination.status` and never
   `origin.status`, and is unreferenced; no diaspora route is built yet.
4. `findDuplicates` is not wired into any verdict, so the site-wide
   title/H1/canonical uniqueness rule is defined but not enforced — and three
   `IndexabilityReason` values (`duplicate_title`, `duplicate_h1`,
   `duplicate_canonical`) are consequently unreachable.
5. The split `title` / `titleAccent` copy pattern, with a load-bearing
   trailing space, cannot survive translation now that `fr` is a market with
   `defaultLocale: fr-FR`.

### Open decisions from the import

None of these is a code problem. Each needs an owner's call.

| # | Question | Why it is blocking |
|---|---|---|
| 1 | **`ae`, `fr` added and `au` promoted** so the design's city grid can link anywhere. | The design puts Dubai, Paris and Sydney on the grid. UAE and France were not markets at all, and Australia was `planned` — and a `planned` market gets **no route**, so the Sydney card linked to a 404. All three are now `acquisition`, `indexable: false`. Revert by demoting them, but then drop the matching cards. |
| 2 | **"Texas"** labels a card whose asset and catalog entry are Houston. | A state is a broader intent than a city and would be a different entity type. Rendered as designed, linked to `/us/houston`. |
| 2b | **France is the first market whose default locale is not English** (`fr-FR`). | Declarative only: there is no locale segment and the copy deck is `en`. Nothing is indexable, so no machine-translated page can leak out — but the i18n TODO in `layout.tsx` now has a real market behind it. |
| 3 | **"We help you find him."** (hero) and **"Built for the woman who's been catfished before."** (safety) are written from one point of view. | Both are rendered as designed — brand voice is not an engineering call. But they narrow the positioning of a global product on its two most-read lines, and `audiences.ts` is built on intent, community, faith and life stage rather than gender. |
| 4 | **"Verified, financially stable members"** (VIP tier). | Promises financial screening: needs a provider that can do it, a lawful basis per market, a published definition, and a view on the discrimination exposure of a wealth filter. |
| 5 | **"Background checks included"** (VIP tier). | Coverage is country-by-country and provider-bound. "Included" cannot be true in every market DA8N sells in. |
| 6 | **No city-index route**, so the "Explore all cities" tile is a label. | `/cities` is a reserved slug with nothing served at it. |

All imagery is now the design's own, supplied by the owner from the Claude
Design export: `hero-waterfront`, the city portraits, `hero-marcus`, the three
Maya uploads, and the two couple photographs. No image slot renders a
placeholder any more. The one exception is the Texas card, which keeps
`houston.webp` — the design referenced that exact Date9ja file.

**The city grid is the design's seven, and is capped there** (owner's call,
2026-10-04): seven cards plus the "all cities" tile fills two clean rows of
four at desktop. Nigeria — the only `live` market — is therefore not on the
grid; Lagos appears only in the decorative marquee. `/ng` and `/ng/lagos` are
still built and still reachable, just not linked from the homepage. Recorded
here and in `landing.ts` so it is not "fixed" later by someone assuming the
live market was forgotten.

### Before this page may be indexed

It is `indexable: false` today, and three things have to become true — none of
them a code change:

1. `STORIES` carries real consented testimonials.
2. The membership section's DRAFT claims are resolved (4 and 5 above).
3. `DA8N_SEO_ENABLED=true` on production.

Shipping the design costs nothing in indexation risk, because the fail-closed
default holds regardless.
