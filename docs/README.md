# SideQuest — Docs

Designer & contributor handoff. Read in this order:

1. **[ABOUT.md](./ABOUT.md)** — what SideQuest is, who it's for, the page sections, the core loop. Start here.
2. **[FLOWS.md](./FLOWS.md)** — how it all works: the daily content pipeline + the visitor journey, with diagrams.
3. **[DESIGN.md](./DESIGN.md)** — the "Obsidian" design system: color tokens, type, signature components/effects, mockup library.
4. **[ARCHITECTURE.md](./ARCHITECTURE.md)** — stack, directory map, data model, read/write paths, env vars (for engineers).
5. **[AUDIT.md](./AUDIT.md)** — UX audit + prioritized feature roadmap. Flags built-but-disconnected features, fake dashboard data, a11y gaps.

## Run it locally

```bash
npm install
npm run dev          # → http://localhost:3000
```

No Supabase needed — the site falls back to **seed data** (`src/lib/seed-data.ts`), so you get a full, populated UI for design work out of the box.

## Quick facts

- **Live:** https://sidequest-gray.vercel.app
- **Stack:** Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · Supabase · Claude · Vercel
- **Aesthetic:** "Obsidian" — dark, glass-morphism, single copper accent (`#C4956A`)
- **Design moodboard:** `mockups/*.html` (open in a browser)

## ⚠️ Open items (see ARCHITECTURE.md for detail)

- `src/components/slot-machine/` is built but **not wired into the site**.
- The **newsletter** is a Substack (`gabevibes.substack.com`); the site's signup form forwards to it via `/api/subscribe`. The old homegrown email digest was removed.
- An uncommitted `analyze.ts` change adds 14-day idea de-duplication.
