# SideQuest — UX Audit & Feature Roadmap

> Grounded in the actual codebase (May 2026). Every finding cites the file it came from.

## ✅ Chosen priorities (this cycle) — STATUS

1. **Fix the fake / inaccurate data** — ✅ mostly done. The fake scanner ribbon (hardcoded `847`, wrong countdown, static "LIVE") was **removed** in the Nocturne redesign; the hero now shows a **real** `posts_analyzed` figure from the latest `daily_scans` row.
2. **Wire up the dead features** — ✅ done. Email signup, Save/bookmark, and Share cards are now connected (details below).

### What got wired (commit `91c2c4a`)
- **Newsletter signup** — `SubscribeForm` (Nocturne) mounts on the homepage as a "build → grow" band; on submit it hands off to the **Substack** hosted subscribe page (`gabevibes.substack.com`, email prefilled). Substack's API blocks server-side subscribes (403/captcha), so there's no API route. The old homegrown daily-digest + Resend were removed.
- **Save** — localStorage-backed `useSavedIdeas` hook; every card's Save button toggles + reflects saved state, syncing across components/tabs. *(No account needed.)*
- **Share** — `SocialCard` share-image restyled to Nocturne; a Share button on every card opens it.

### Still open (next follow-ups)
- **Dashboard "Saved ideas" count** still renders static `0` — not yet reading from `localStorage` (dashboard is a server component + auth-gated).
- **Per-idea pages** (`/ideas/[id]`) + dynamic OG images — not started.
- **Slot machine** (`src/components/slot-machine/`) — still unused.
- **Sound mute toggle** (default-off) — not started.

Other tiers are kept here for later.

---

## 🔴 Critical — built but disconnected (highest ROI)

These components already exist in the repo and are imported **nowhere**. The fix is wiring, not building.

| Feature | Status | Why it matters |
|---|---|---|
| **Email signup** (`src/components/subscribe-form.tsx`) | Defined, rendered nowhere | The daily email is the #1 retention loop — yet there's no way to subscribe on the site. Every visitor leaves and never returns. |
| **Share card** (`src/components/ideas/social-card.tsx`) | Defined, imported nowhere | ABOUT calls share cards "the growth engine." Currently unreachable → zero viral loop. |
| **Save / bookmark** | `saved_ideas` table + server actions exist (`src/app/actions/ideas.ts`); no save button on any card | `/dashboard` literally says *"Click the bookmark on any card"* — but no card has one. Dead-end instruction. |
| **Slot machine** (`src/components/slot-machine/`) | Full component (4 files), used nowhere | A fun "spin for a random idea" hook sitting idle. |

---

## 🟠 Trust & data integrity (the live dashboard is partly fake)

The hero "live scanner" (`src/components/scanner-ribbon.tsx`) — meant to build credibility — shows hardcoded/inaccurate numbers:

- **`postsAnalyzed={847}`** is a literal constant in `src/app/page.tsx:68`. "SCANNED" is identical every day.
- **"SOURCES: 3"** is hardcoded text (`scanner-ribbon.tsx:90`), not derived from real scrape results.
- **Countdown targets 6am local** (`scanner-ribbon.tsx:30`), but the real cron runs **13:00 & 23:00 UTC** (`vercel.json`). "NEXT SCAN" is wrong.
- **"LIVE" pulse** implies real-time; it's a static animation.

**Fix:** read `posts_analyzed` / `sources_scraped` from the latest `daily_scans` row (query exists pattern in `src/lib/queries.ts`), and base the countdown on the actual cron schedule. Savvy indie hackers will notice an unchanging "847" and lose trust.

---

## 🟡 Conversion funnel gaps

- **No per-idea URL / page.** Routes are `/ideas/[date]` only — can't link to or share a single idea, no per-idea OG metadata. Kills sharing + SEO.
- **Highest-intent action is two clicks deep** — expand card → Generate Prompt → Copy.
- **Empty-state has no CTA** — when today's drop is empty, the message is "check back soon" with no email capture to bring them back (`src/app/page.tsx:104`).

---

## ♿ Accessibility (failing basics)

- **Cards are `<div onClick>`** (`idea-card-modal.tsx:155`) — not keyboard-focusable, no `role`/`aria`. Can't expand without a mouse.
- **Modal lacks focus trap, `role="dialog"`, `aria-modal`** (`idea-card-modal.tsx:59`). Esc works; focus management doesn't.
- **No `prefers-reduced-motion`** — sweep, 6s border-spin, pulse, marquee all run regardless (vestibular issue).
- **Contrast:** `--text-disabled #4A453E` on `#0A0A0C` fails WCAG AA; `--text-secondary #7A746C` is borderline — and both are used widely for labels.

---

## 🔊 Sound UX

- `playTap()` fires on every nav click + page interaction (`header.tsx`, throughout) with **no global mute and no off-by-default**. Audio without consent is jarring. Needs a persistent mute toggle, default muted.

---

## 📱 Mobile / responsive

- **Scanner ribbon** is a single-row flex with 4 stats + dividers + `whitespace-nowrap`, max-width 900px (`scanner-ribbon.tsx:62`) — overflows/cramps under ~600px. Needs a wrap/stack layout.

---

## Feature roadmap (prioritized)

**Tier 1 — finish what's started (chosen):**
1. Wire up email capture — `SubscribeForm` into hero + empty state + footer.
2. Wire up save + share — bookmark + share-card buttons on every card; make `/dashboard` real.
3. Make the live dashboard honest — real `posts_analyzed` / `sources_scraped`; fix countdown.

**Tier 2 — unlock distribution:**
4. Per-idea pages (`/ideas/[id]`) with dynamic OG images.
5. "Ideas you saved" / lightweight retention surface (localStorage, no login).
6. Slot-machine "Spin for an idea" homepage module.

**Tier 3 — depth & stickiness:**
7. Idea voting / "I'm building this" signal → social proof feed.
8. Search + "this week" / trending views.
9. Accessibility + reduced-motion pass (also helps Lighthouse/SEO).

---

## Note for the redesign

A visual redesign is in progress. Several issues above are **structural, not cosmetic** (disconnected features, fake data, no per-idea URLs, a11y). The redesign should assume these get wired up — e.g. leave room in the card for **save + share** affordances, and design a real **email-capture** moment and **empty state**.
