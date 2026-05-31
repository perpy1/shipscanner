# SideQuest — How It All Works (Flows)

Two flows matter: the **daily content pipeline** (how ideas get made, runs on a schedule, no user present) and the **visitor journey** (what a person does on the site). A designer mostly cares about the second, but the first explains why the data looks how it does.

---

## Flow 1 — Daily content pipeline (automated, no user)

Runs twice a day via Vercel Cron (`vercel.json`): **13:00 UTC** and **23:00 UTC** (≈ 8am & 6pm EST). Hits `GET /api/scan` with a secret bearer token.

```
┌─────────────┐
│ Vercel Cron │  2×/day → GET /api/scan  (Bearer CRON_SECRET)
└──────┬──────┘
       ▼
┌──────────────────────────────────────────────┐
│ 1. SCRAPE   src/lib/scrapers/                 │
│    • Reddit  — r/SaaS, SideProject,           │
│      Entrepreneur, startups, programming,     │
│      webdev  (filtered by "pain" keywords)    │
│    • Hacker News                              │
│    • Product Hunt                             │
│    → dedupe by URL, sort by score             │
└──────┬───────────────────────────────────────┘
       ▼
┌──────────────────────────────────────────────┐
│ 2. ANALYZE  src/lib/ai/analyze.ts             │
│    • Take top 100 posts                       │
│    • Pull last 14 days of ideas (dedup guard) │
│    • Claude (claude-sonnet-4-6) → 10 ideas    │
│      as strict JSON, validated + clamped      │
└──────┬───────────────────────────────────────┘
       ▼
┌──────────────────────────────────────────────┐
│ 3. STORE    Supabase (admin client)           │
│    • insert 10 rows into `ideas`              │
│    • log a `daily_scans` row (counts)         │
└──────┬───────────────────────────────────────┘
       ▼
┌──────────────────────────────────────────────┐
│ 4. (DIGEST) src/lib/email/ — game-themed HTML │
│    sent to subscribers via Resend             │
└──────────────────────────────────────────────┘
```

**Key rule for designers:** the AI is told to spread across **≥6 categories** and **mix difficulties** (some Weekend, some Week, some Month), and to never repeat a pain point from the last 14 days. So a daily drop is intentionally varied — the grid should look heterogeneous, never 10 of the same category.

**Resilience:** if Supabase isn't configured (or empty), the site silently falls back to **seed data** (`src/lib/seed-data.ts`). That's why the site always renders something, even with no DB.

---

## Flow 2 — Visitor journey (on the site)

```
                         LANDS ON HOME ( / )
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
   reads HERO + value    sees SPOTLIGHT idea   scrolls TODAY'S GRID
   prop, scan ribbon     (top viral_potential)  (10 glass cards)
                                                       │
                                          clicks a card → EXPANDS IN PLACE
                                          (copper border, siblings dim,
                                           reveals pain/audience/$$)
                                                       │
                        ┌──────────────────────────────┼───────────────────────┐
                        ▼                               ▼                        ▼
              "GENERATE BUILD PROMPT"          SAVE / bookmark            SHARE CARD
              → category-specific prompt        → localStorage            → social image
                copy → paste into Claude        (no account)              (html2canvas)
                /Cursor → start building                                   → friend clicks → loop
                        │
                        ▼
                  USER LEAVES TO BUILD  ✅ (success = they ship)

   Secondary paths:
   • CATEGORIES → /ideas?category=X    (filtered browse)
   • ARCHIVE    → /ideas/[date]        (past daily drops)
   • /ideas                            (full filterable + sortable list)
```

### The "aha" moment
It's the **card expand** → seeing a real pain point with real source links → realizing it's legit → hitting **Generate Build Prompt**. Everything visual should funnel attention toward that expand + prompt action. The spotlight exists to manufacture that aha before the user even scrolls.

### Build-prompt flow (the conversion event)
`src/lib/generate-prompt.ts` maps each idea into a structured prompt:
> "I want to build an app called *{name}*… ## The Problem {pain_point} … ## Requirements — Suggested stack: {category-specific stack} … MVP first, ship fast."

Category → stack examples: SaaS → *Next.js + Supabase + Stripe*; AI/ML → *Next.js + Claude API + Vercel AI SDK*; Fintech → *Next.js + Plaid + Stripe*.

---

## Where each thing lives (for when you need a screen)

| Screen / element | File |
|------------------|------|
| Home (all sections) | `src/app/page.tsx` |
| Idea card (grid + expand) | `src/components/ideas/idea-card.tsx` |
| Idea modal | `src/components/ideas/idea-card-modal.tsx` |
| Spotlight | `src/components/ideas/spotlight-card.tsx` |
| Share/social card | `src/components/ideas/social-card.tsx` |
| Header / footer / ticker | `src/components/layout/` |
| Scanner ribbon (live counts) | `src/components/scanner-ribbon.tsx` |
| Full list + filters | `src/app/ideas/page.tsx`, `src/components/ideas/idea-filters.tsx` |
| Slot-machine (⚠️ built, not wired in) | `src/components/slot-machine/` |
| Email digest (⚠️ old theme) | `src/lib/email/daily-digest.tsx` |
| Design tokens | `src/app/globals.css` |
