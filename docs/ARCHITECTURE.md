# SideQuest — Architecture (for engineers / technical designers)

A Next.js 16 app on Vercel. Two halves: a **public read-only site** (server components rendering ideas) and a **scheduled write pipeline** (cron → scrape → AI → DB). Supabase is the store, with a **seed-data fallback** so the site never breaks when the DB is empty.

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind v4 + shadcn/ui (base-ui primitives) |
| Database | Supabase (Postgres) — `ideas`, `daily_scans` tables |
| AI | Anthropic Claude (`claude-sonnet-4-6`) via `@anthropic-ai/sdk` |
| Newsletter | Substack (signups forwarded server-side from the site) |
| Scheduling | Vercel Cron |
| Share images | `html2canvas-pro` |
| Deploy | Vercel |

---

## Directory map

```
src/
├── app/
│   ├── page.tsx              # Home — renders all sections (server component)
│   ├── ideas/page.tsx        # Full filterable/sortable list
│   ├── ideas/[date]/         # A past daily drop
│   ├── categories/page.tsx   # Browse by category
│   ├── dashboard/page.tsx    # Dashboard view
│   ├── api/scan/route.ts     # ⭐ The pipeline endpoint (GET cron / POST manual)
│   ├── actions/ideas.ts      # Server actions
│   ├── auth/callback/route.ts# Supabase auth callback
│   ├── layout.tsx, globals.css, error.tsx, not-found.tsx, sitemap.ts
│
├── components/
│   ├── ideas/                # idea-card, idea-card-modal, spotlight-card,
│   │                         #   social-card, idea-filters
│   ├── layout/               # header, footer, marquee-ticker
│   ├── slot-machine/         # ⚠️ built, NOT wired into any page
│   ├── auth/                 # user-menu, sign-in-button
│   ├── ui/                   # shadcn primitives
│   ├── scanner-ribbon.tsx, archive-section.tsx, subscribe-form.tsx
│
├── lib/
│   ├── queries.ts            # All DB reads (+ seed fallback)
│   ├── seed-data.ts          # Fallback ideas/scans when no DB
│   ├── generate-prompt.ts    # Idea → Claude build prompt (+ stack map)
│   ├── sounds.ts             # Web Audio 8-bit SFX
│   ├── ai/analyze.ts         # ⭐ Claude call: posts → 10 ideas (+ dedup)
│   ├── scrapers/             # reddit, hackernews, producthunt, index (scrapeAll)
│   ├── substack.ts           # Substack URL/handle config
│   └── supabase/             # client, server, admin
│
└── types/index.ts            # Idea, DailyScan, User, ScrapedPost, etc.
```

---

## Data model (core tables)

**`ideas`** — one row per generated idea (see `types/index.ts` → `Idea`):
`id, name, one_liner, description, category, difficulty, viral_potential (1–5), pain_point, target_audience, monetization, source_urls[], source_platform, upvotes, created_at, scan_date`

**`daily_scans`** — one row per pipeline run:
`id, scan_date, ideas_count, sources_scraped, posts_analyzed, created_at`

Schema lives in `supabase-schema.sql`.

---

## Read path (rendering the site)

All reads go through **`src/lib/queries.ts`**. Each function:
1. Tries Supabase (if env vars present).
2. If no DB / no rows → falls back to **`seed-data.ts`**.

Key functions: `getTodayIdeas()`, `getIdeasByDate(date)`, `getAllIdeas(filters)`, `getScanByDate(date)`, `getAvailableDates()`, `getIdeaById(id)`. "Today" = `new Date().toISOString().split("T")[0]`, sorted by `viral_potential` desc (so the spotlight = highest viral idea).

> **Implication:** you can run the whole frontend with **no Supabase configured** — it'll serve seed data. Great for design work.

---

## Write path (the pipeline) — `src/app/api/scan/route.ts`

Auth: bearer token check against `CRON_SECRET`.
- `GET` → Vercel Cron entry point.
- `POST` → manual trigger.

```
runScan():
  1. scrapeAll()                       → posts[], sourcesScraped
  2. analyzePostsAndGenerateIdeas()    → 10 validated ideas (Claude)
  3. supabase.insert(ideas)            (admin client, upvotes=0, scan_date=today)
  4. supabase.insert(daily_scans log)
  5. return JSON summary
```

**Scrapers** (`src/lib/scrapers/`): run in parallel via `Promise.allSettled`, so one source failing doesn't kill the run. Reddit pulls `hot.json` from r/SaaS, SideProject, Entrepreneur, startups, programming, webdev and keeps only posts matching pain-signal keywords ("frustrated", "wish there was", "would pay for", …). Results deduped by URL, sorted by score.

**AI** (`src/lib/ai/analyze.ts`): top 100 posts + last-14-days idea list (dedup guard) → Claude → strict JSON array of 10. Output is validated field-by-field, `viral_potential` clamped to 1–5, `source_urls` coerced to array. Throws on malformed output (no silent bad data).

---

## Environment variables

| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (read path) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (read path) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin writes + dedup query (pipeline) |
| `ANTHROPIC_API_KEY` | Claude (read by the SDK automatically) |
| `CRON_SECRET` | Bearer token guarding `/api/scan` |
| *(none for newsletter)* | The Substack URL lives in `src/lib/substack.ts` — no env var or API route needed |

See `.env.local.example`. **Without Supabase vars, the site runs on seed data.**

---

## Scheduling

`vercel.json` → two crons hitting `/api/scan`: `0 13 * * *` and `0 23 * * *` (UTC) ≈ 8am & 6pm EST.

---

## ⚠️ Loose ends a designer/eng should know about

1. **`src/components/slot-machine/`** — a full slot-machine UI (reel, lever-button, jackpot-animation, slot-machine; ~281 lines) that is **not imported anywhere**. Decide: wire it into a "spin for a random idea" feature, or delete it.
2. **Newsletter = Substack.** The old homegrown email system (`src/lib/email/` digest + Resend) was removed. The site's subscribe form (`subscribe-form.tsx`) hands off to Substack's **hosted** subscribe page with the email prefilled (`gabevibes.substack.com/subscribe?email=…`), opened in a new tab. We do **not** POST to Substack's API — it's behind a captcha that 403s server-side requests. No API route, no env var; the URL lives in `src/lib/substack.ts`.
3. **Uncommitted `analyze.ts` change** (+116 lines) — adds the 14-day dedup context. Working but unpushed as of this writing.
4. **`mockups/`** — 8 standalone HTML design explorations, not part of the build. Reference only.
