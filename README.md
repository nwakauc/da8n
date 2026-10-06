# DA8N — public site

- **Owner:** Uchechi Nwaka
- **Status:** Design landed (v4) and the full route set is built. 11 content
  routes, 5 guides, 66 pages. Home, how-it-works, safety, RealMe, about and the
  guides are approved for indexing; `DA8N_SEO_ENABLED` is still the site-wide
  switch.
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
| `src/app/icon.svg` | the DA8N mark — a heart with the 8 knocked out |
| `src/lib/mark.ts` | the same mark as a value, for the two generated PNGs |
| `src/app/apple-icon.tsx` | iOS home-screen PNG, 180x180, generated at build |
| `src/app/opengraph-image.tsx` | the share card, 1200x630 PNG, generated at build |
| `src/app/manifest.ts` | Android icon and theme colour. Deliberately not a PWA |
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

**Design direction has landed.** The landing page implements *DA8N Landing
v4.dc.html* from the Claude Design project
`e15220c2-3f0c-4891-92ff-47e4c0e202b2` ("DA8N combined website design"),
imported 2026-10-05. v3 (project `b10df277-be97-4da7-b046-5eb6e677f4b7`,
2026-10-04) is the version it replaced. The brand palette, type scale and
component system in `globals.css` and `landing.css` come from that file.

#### What v4 changed

The argument of the page, not its skin. In order down the page:

| | v3 | v4 |
|---|---|---|
| Sections | unnumbered | **numbered 01–08**, visibly |
| Hero | handwritten "Be the real you" over the photo | gone — unguaranteeable contrast, and the pillars below say it better |
| City band | pale strip, ink type | **dark rotated ribbon** overlapping the hero |
| How it works | five steps, coloured dots | **four steps, numbered**; "See who's For You" and "Send an introduction" left, **"Turn on Ready"** arrived with its own phone screen |
| Compatibility | one member + a list of reasons, after the city grid | **"03 For You"**: both members with the reasons between them, one **open question**, and it now sits **before** the city grid |
| Cities | a sentence explaining the three-place model | a headline, with **"From Melbourne"** added to the rows so the rows carry it |
| Safety | six one-line features, two of which named unbuilt things | **three capability cards** that exist, plus an **in-chat fraud warning** |
| Stories | three equal cards in a scrolling rail | **one featured story with three dated milestones** + two wide cards |
| FAQ | — | a **guides card** |
| Outro | — | **store badges** |

#### The hedging came off (2026-10-05)

The v3 import carried four kinds of placeholder: `SOON` chips, `DRAFT` stamps,
"Illustration — not yet a real member story" captions, and "Example profile"
labels. **All of them are gone.** Owner's decision, and the right one — the
product is live, RealMe works, and a marketing page that hedges every claim
reads as a product nobody believes in.

What that cost, and how it was paid:

| Was a label because… | Now |
|---|---|
| `/realme`, `/safety`, `/guides` did not exist | **Built.** Three safety cards and four guide titles are live links. |
| Membership had no destination | Free → sign-up, da8n+ → the app's membership screen, VIP → `/vip-matchmaking`. |
| Background-check CTA had no flow | Links to `/safety#background-checks`, which explains consent and per-market availability. |
| Stories were unconsented placeholders | Stamps removed. **Consent is now a content task**, tracked in `content/landing.ts` — see below. |

Removing a hedge is only safe if the thing it hedged is real, so three tests
now hold the line that the labels used to: `landing.test.ts` asserts every
safety card, guide slug, tier CTA and footer link resolves to a built page;
`site-pages.test.ts` asserts no page promises a member is "safe", quotes a
price, or publishes a numeric Trust Score; and a crawl from `/` reaches 59
internal pages with **zero 404s**.

**Two things still need the owner, and neither is a code change:**

1. **Written consent for each published story.** The three couples' quotes,
   names and dates came from the design file. One couple saying what happened
   to them is a story; publishing it without their agreement is a misleading
   claim under the FTC endorsement rules and the UK CAP code, and `/stories`
   stays `indexable: false` until the consent register exists.
2. **Two VIP claims** — "Verified, financially stable members" and "Background
   checks included" — cannot be checked from this codebase, and the home page
   is now indexable. Both are flagged at the point of definition in
   `content/landing.ts`.

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
5. **No link points at `href="#"`, and nothing renders as a label instead.**
   The design used `#` throughout. The first translation turned those into
   non-interactive labels; the second built the pages. Every control on the
   landing page is now a live link to a route that exists, and
   `landing.test.ts` asserts each destination resolves.

### Content integrity

The page is live marketing for a product that exists, so it is written without
hedging. Two rules survive that, because they are not hedges:

- **`STORIES` and `FEATURED_STORY` are real people.** Every quote, name and
  date needs written consent on file before it ships. A quoted couple with a
  wedding year reads as a testimonial whether or not it is labelled one, and an invented testimonial is
  a misleading claim under both the FTC endorsement rules and the UK CAP code.
  Replace with real consented stories and flip the flag; `landing.test.ts`
  fails if the flag is flipped while the placeholder copy is still there.

- **No `Review` or `AggregateRating` markup, ever.** DA8N publishes no ratings
  and collects none; `/stories` is the most tempting place on the site to emit
  it and the one place it would most clearly be fabricated. The structured data
  this site emits is `WebPage`, `BreadcrumbList`, `FAQPage` and `Article`. The
  FAQ markup is generated from the same array the FAQ section renders, so it
  cannot describe a question the page does not visibly answer.

Still forbidden on every route, unchanged: member counts, "N people near you",
local activity claims, marriage or outcome statistics, and any price — pricing
is per-market and lives in the member application. Three test files assert it.

### The route set

Every registered static route is built; nothing in the registry 404s.

| Route | What it is | Indexed |
|---|---|---|
| `/` | the landing page | yes |
| `/how-it-works` | the four steps, For You, Ready | yes |
| `/safety` | Safety Centre — RealMe, fraud, reporting, Trust Score, background checks, Date Check-in, meeting | yes |
| `/realme` | what verification checks, what is never shown, what it does not promise | yes |
| `/about` | the one-network model, why it exists, powered by D8N | yes |
| `/guides` + `/guides/{slug}` | five written, sourced, dated guides | yes |
| `/cities`, `/markets`, `/audiences` | catalog-derived indexes | no — editorial pending |
| `/compare` | by approach, not feature table | no — no competitor record is fact-verified |
| `/stories` | member stories | no — gated on the consent register |
| `/help`, `/privacy`, `/terms` | utility | no — deliberately never indexed |

Four guides were ported from Date9ja (the advice is about dating, not about a
brand, and splitting it across two hosts left both thin).
**`dating-someone-in-another-city` is new** — the design asked for it, nothing
equivalent existed, and distance is the thing this product is actually for.

`/audiences/{slug}` and `/compare/{slug}` are deliberately **not** built. They
are the entity model, not pages: an audience page for a market with nobody in
it is a thin page that also misleads a real person. Nothing links them and
`entityIndexable` is false on every one, so none can reach a sitemap.

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

### Brand assets (2026-10-05)

The site had **no icon and no share card at all**. A tab showed a blank page
glyph, an iOS shortcut showed a screenshot, Android had no home-screen icon,
and — because `buildPageMetadata` sets `twitter: { card: "summary_large_image" }`
on every page while supplying no image — every shared link rendered as an empty
grey box with a domain under it. On a product whose acquisition model is people
sending each other links, that was the most-seen unbuilt design on the site.

| File | What it is |
|---|---|
| `src/app/icon.svg` | Browser tab mark, full-bleed heart |
| `src/lib/mark.ts` | The same mark as a value + `mark.test.ts` holding them in step |
| `src/app/apple-icon.tsx` | 180x180 PNG for iOS "Add to Home Screen" |
| `src/app/opengraph-image.tsx` | 1200x630 share card, applies to every route |
| `src/app/manifest.ts` | Android icon + `theme_color`; `display: browser` |

**The mark is a heart with the 8 knocked out of it**, and the heart is the
exact path from `apps/d8n/web/public/brands/dateza-mark.svg` — DA8N wears the
family's heart rather than a near-miss of it. The family already has a grammar:
DateZA is the heart alone, Date9ja is the heart with "9ja" knocked out, HookUs
is a flame with a heart cut from it. DA8N is the heart with its own character
in it, which also reads as continuity to the Date9ja members this product is
the evolution of.

The first version of this mark was the 8 alone, as two rings on a rose square.
It was legible and it was wrong: **an 8 in a square says "eight", not
"dating"** — it placed the product in no category and connected it to none of
its siblings, and a mark that needs the wordmark beside it to be understood is
not doing its job in a 16px tab.

The heart is full-bleed rather than sitting inside a rounded square, and that
was tested rather than assumed — six constructions rendered at 16/24/32/96 and
compared. A square costs the heart about 20% of its height and the 8 shrinks
with it, at which point the counters close below 32px and the 8 reads as a
snowman. Full-bleed buys back exactly the room the 8 needs. A solid 8 with
punched counters was tried as an alternative and read worse, because the
counters are what make an 8 an 8 and they are the first thing to close.

The 8 sits high in the heart, centred near y 14 of 32 rather than on the
heart's own centre. A heart tapers to a point, so an 8 placed by its own
geometry pushes out through the bottom — which the first three attempts did.
It is fitted to the wide band, the same place Date9ja puts "9ja". Stroke
2.8/32 is ~1.4px at 16px, the floor before the rings grey out.

**One source, three assets.** `icon.svg` has to be a static file because that
is Next's favicon convention, while `apple-icon.tsx` and `opengraph-image.tsx`
render through Satori and need the artwork as a value, so it necessarily
exists twice — in `icon.svg` and in `src/lib/mark.ts`. `src/lib/mark.test.ts`
asserts the two agree, and additionally that the 8 stays inside the heart's
silhouette and that its rings overlap rather than stack. That is the usual way
a logo rots: updated in one place, with a stale copy still shipping somewhere
nobody looks.

The iOS icon is the only opaque one. Apple composites home-screen icons on
black, so the transparent corners that make the favicon a silhouette would put
a rose heart on a black tile; it gets the page's cream ground instead, which
is what the favicon looks like on any light tab strip anyway.

The share card's subline is `SHARE_SUBLINE` in `content/landing.ts`, and
deliberately neither `FOOTER_TAGLINE` (which opens "Pronounced dating." and
would print that phrase on the card twice) nor `HERO.subTitle` ("We help you
find him.") — a share card travels without its page to people who did not ask
for it, so putting the one line that narrows a global product to a single
gender on every shared link is a separate decision rather than an inherited
one. It is flagged as question 3 below and unchanged on the page itself.

### The programmatic surface, and the gate that was never running (2026-10-05)

Nineteen new pages — `/audiences/{slug}` x 11 and `/compare/{slug}` x 8 — plus
`/contact`. The site went from 66 routes to 86. But the pages are not the
important part of this slice.

**`src/lib/indexability.ts` was dead code.** It was written, documented and
covered by its own test file, and **nothing in the application ever called
it.** `SeoPage`, the type it assesses, had no values anywhere either. Every
`indexable:` boolean on every route was a hand-written claim that no quality
floor had ever been applied to — which is precisely what that module exists to
prevent. A tested gate that nothing invokes is not a safeguard; it is a comment
with a test suite attached.

It runs now. `/audiences/{slug}` and `/compare/{slug}` compute their robots
meta through `isIndexable`, and `registry.ts` computes each candidate's sitemap
eligibility from the same record with the same context — so the sitemap and the
page's own meta tag cannot disagree, by construction rather than by two people
remembering one rule. Verified end to end: `/compare/tinder` serves
`index, follow` and `/compare/bumble` serves `noindex, nofollow` without anyone
setting a flag on either.

#### What the gate caught, which is the point

Five of the eight competitor records were verified on 2026-10-05 **against each
product's own public description of itself** — not a review site, not a
comparison article, not recollection. That is the only source that fairly
supports a published claim about someone else's product. Three were not, and
all three are blocked from the index automatically:

| Record | Outcome |
|---|---|
| `tinder`, `hinge`, `eharmony`, `zoosk`, `grindr` | Category confirmed from the product's own words. Dated, indexable. |
| `bumble` | Homepage and help entry points do not describe the discovery mechanic at all. "swipe-first" is probably right and probably is not good enough to publish. |
| `match` | Returned HTTP 403 to an automated request — their right, not a criticism. Not checkable this way. |
| `badoo` | **⚠ The catalog's category is likely wrong.** Badoo's own site leads on stated dating intentions — members choose whether they want to chat, date or settle down — which reads as intent-first, not swipe-first. |

Badoo is the one worth dwelling on. Had every record been stamped on trust,
this site would have published an unsupported category claim about a named
third party on an indexable page. It has **not** been re-categorised, because
re-categorising a competitor on the strength of their marketing copy is the
same error facing the other way. A human should look at the product and either
correct the category or confirm it.

So a comparison page states the other product's category **only** when the
record carries a verification date. Without one the category section does not
render at all, and the page says plainly why it is not describing that product.
Three pages therefore describe DA8N alone. That is a less impressive page and
an honest one.

`reviewedAt` comes from the competitor record, never from the build date, and
these routes set `claimsDecay`. A verified comparison drops out of the index on
its own once the check passes `MAX_REVIEW_AGE_DAYS`, with nobody noticing —
which is the entire reason for dating the record rather than the deploy.
`seo-pages.test.ts` asserts that by advancing the clock.

#### Why audience pages exist now when they were deliberately held back

The stated reason was liquidity: a "senior dating in Manchester" page with
nobody over 55 in Manchester is a thin page that also misleads a real person.
That reasoning is sound and it still binds — for the AUDIENCE x MARKET page,
which remains unbuilt and gated on measured liquidity.

It never bound the audience page alone. `/audiences/senior-dating` claims
nothing about who is in any city; it explains how the product works for someone
dating in their sixties, which is checkable against shipped behaviour and true
in every market DA8N runs in. Eleven written records, no two alike — the
diaspora pages lead on fragmentation, the over-50 pages lead on fraud because
that is the cohort it targets, the distance pages lead on logistics.

#### Tests

`seo-pages.test.ts` is new and enforces on all nineteen pages: no member
counts, no local activity claims, no outcome statistics, no prices in any
currency, no safety guarantee, no `Review` or `AggregateRating` schema ever,
every FAQ answered substantively, titles and descriptions inside their limits,
and **every related link resolving to a route that exists** — which immediately
caught two links to `/guides/staying-safe-when-you-meet`, a guide that does not
exist and that I had invented while writing.

Four existing tests asserted a phase rather than a rule and were rewritten as
rules, not weakened to pass:

- "has no indexable audience yet" → *never marks an audience indexable without
  a written page*
- "has no indexable competitor yet" → *never marks a competitor indexable
  without a written page*, alongside the existing and untouched *never without a
  verification date*
- "admits no catalog-derived route" → *keeps catalog-derived copy out of the
  sitemap*. The old test judged a route by its `kind`, which conflated where a
  route comes from with how its copy was made: an audience route is
  catalog-derived in origin and hand-written in substance. Market and city
  routes stay out, as intended.
- The compare page's "no record is verified yet" assertion was an explicit
  tripwire — *"the day a record is verified, this test is what says the rules
  changed"*. It fired. The snapshot went; the rule it guarded did not.

`landing.test.ts` no longer keeps its own list of which routes exist. It asks
the filesystem whether `src/app/<segment>/page.tsx` is there, because a second
list to maintain fails in the direction that hurts — and it did, rejecting
`/contact` the moment it was built.

#### Placeholders removed

- `.chip-link--static` — the dashed, unclickable audience chips. A card styled
  as a card that does nothing is the worst of both readings; the class is gone
  along with the state it existed to dress up.
- The footer's "All cities" → `/#cities`, correct when written and wrong once
  `/cities` existed, because it sent anyone wanting the full list back to the
  marketing page to scroll.
- The `Awaiting` contact brackets in `/terms` and `/privacy`, replaced by a
  real route.

`ImageSlot`'s labelled fallback stays. Every slot has a real asset today, so it
renders nothing — it is a defence against a missing export, not a placeholder
in the product.

### Awaiting legal review

`/privacy` and `/terms` are published as **drafts**, with a banner saying so.
Everything technical in the privacy notice was verified against this app's
source — no `fetch`, no cookies, no analytics, no browser storage, no
third-party requests, fonts self-hosted — and it must stay true: if this site
ever gains a form, an embed, an analytics tool or a cookie, that notice changes
in the same slice.

What cannot be inferred from a repository is bracketed in the documents and
needs the founder: legal entity name, registered address, DPO or
representative where required, log retention period, hosting processor and
region, international transfer mechanism, liability cap, governing law and
jurisdiction. **A privacy notice without a controller identity and a contact
route is not compliant**, so these are blocking for launch rather than
cosmetic.

**The contact route half of that is now resolved.** `/contact` is built, linked
from the footer's LEGAL column, and both legal documents point at it instead of
carrying a bracket. Every address on it already exists and is already
monitored — they are the D8N platform mailboxes, and DA8N is a D8N product. A
plausible `hello@da8n.com` would have read better and been the worst kind of
placeholder: one that looks finished, passes review, and silently drops a data
subject's access request. The one address still genuinely missing is the
controller's own privacy mailbox on the DA8N domain, and it is held as a single
visible bracket on `/contact` rather than guessed.

Two of the remaining brackets were checked rather than assumed: there is no
deploy configuration for this app anywhere in the monorepo — no `vercel.json`,
no Dockerfile, no Kamal target, no workflow — so **hosting processor, region
and log retention are genuinely undecided**, not merely unrecorded.

### Next (not done here)

1. **Component tests.** `vitest.config.mts` is `environment: "node"` and
   `include: ["src/**/*.test.ts"]`, so a `.test.tsx` would not even match. All
   133 tests are catalog and library tests, and every accessibility decision
   documented in the components is unenforced — nothing fails if `role="tab"`
   disappears, if `RealMeBadge` loses its `aria-label`, or if a tier CTA
   becomes a live `<a href="#">`. That is what let all five defects above ship
   green. It needs `jsdom` and a render library, which is a dependency change
   and therefore its own slice.
2. ~~The 11 remaining `STATIC_ROUTES` in `registry.ts` that have no page.~~
   **Done.** Every registered route is now a built page, and `landing.test.ts`
   checks each nav and footer link against the filesystem rather than against a
   hand-kept list, so the registry and the app cannot drift apart silently.
   `/cookies` was dropped rather than built: this site sets no cookies, and a
   cookie page would have been a document about something that does not happen.
3. `isValidDiasporaCorridor` checks `destination.status` and never
   `origin.status`, and is unreferenced; no diaspora route is built yet.
4. ~~`findDuplicates` is not wired into any verdict.~~ **Done**, for the
   programmatic surface: `registry.test.ts` runs it across all nineteen
   audience and comparison pages, so two of them cannot ship with the same
   title or canonical. The three `IndexabilityReason` values
   (`duplicate_title`, `duplicate_h1`, `duplicate_canonical`) remain
   unreachable from `assessIndexability` itself, because uniqueness is a
   property of a SET of pages and that function judges one page at a time.
   Wiring them would mean giving it the whole corpus; the test does that job
   today and fails the build, which is the outcome that matters.
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
| 6 | ~~**No city-index route**~~ — resolved. `/cities` is built and the footer's "All cities" link points at it instead of `/#cities`. | Was: a reserved slug with nothing served at it. |

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
