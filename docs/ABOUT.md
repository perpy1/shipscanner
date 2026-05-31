# SideQuest — Product Overview

> A daily app-idea generator for indie hackers and "vibe coders." Every morning it scans the internet's complaints, distills them with AI, and serves up **10 buildable app ideas** — each with the pain point, audience, monetization, difficulty, and a copy-paste build prompt.

**Live site:** https://sidequest-gray.vercel.app
**Local dev:** http://localhost:3000 (`npm run dev`)
**Repo:** github.com/perpy1/shipscanner

---

## The one-liner

> The internet's pain points, distilled into 10 buildable ideas every morning. No noise. Just signal.

## Who it's for

- **Indie hackers / solo developers** who want to build something but don't know *what*.
- **Vibe coders** who'll happily ship an app in a weekend if handed a validated idea + a prompt.
- Secondary: anyone who likes a daily "what should I build?" dopamine hit.

## The problem it solves

Finding a *validated* app idea is hard. Most people build things nobody wants. SideQuest surfaces problems **real people are posting about right now** — then removes every excuse not to start by generating the build prompt for you.

## The core loop (why it grows)

```
Land → browse today's 10 → "oh, this is actually good" → generate build prompt / share card → friends see it → repeat
```

Zero friction is the design religion: **no signup wall**, saves live in `localStorage`, and the share cards are the growth engine.

---

## What's on the page (sections, in order)

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero** | Serif "SideQuest" wordmark, eyebrow (Today · date), value prop, two CTAs (See today's drop / How it works), one honest stat line (real posts-scanned from `daily_scans`) |
| 2 | **Today's Ideas grid** | All 10 ideas as expandable cards (2-up on desktop); the **first card is the "Idea of the day"** (highest viral potential), given a teal wash |
| 3 | **Categories** | Count per category, links to filtered `/ideas` view |
| 4 | **Archive** | Past daily drops, organized by date |
| 5 | **How It Works** | 3 steps: Scan the noise → Distill the signal → Pick and ship |

Other routes: `/ideas` (full filterable list), `/ideas/[date]` (a past drop), `/categories`, `/dashboard`.

---

## What an idea *is* (the core object)

Every idea card carries:

- **name** — catchy product name
- **one_liner** — one-sentence pitch
- **description** — 2–3 sentences
- **category** — one of 10 (SaaS, Developer Tool, Marketplace, AI/ML, Productivity, Social, Fintech, Health, Education, E-commerce)
- **difficulty** — `Weekend` / `Week` / `Month`
- **viral_potential** — 1–5 (drives spotlight + sort order)
- **pain_point** — the specific problem found in the source posts
- **target_audience** — who needs it
- **monetization** — pricing strategy
- **source_urls** — the real posts that inspired it
- **source_platform** — reddit / hackernews / producthunt

## Key interactions a designer should know

- **Expand-in-place card:** clicking an idea card expands it inline (copper border, scale up, siblings dim to 45%), revealing pain point / audience / monetization with a staggered reveal.
- **"Generate Build Prompt":** turns the idea into a ready-to-paste prompt for Claude/Cursor, with a category-specific suggested stack.
- **Share card:** renders the idea as a shareable social image (`html2canvas-pro`).
- **Save / bookmark:** `localStorage`, no account needed.
- **Sound design:** 8-bit Web Audio sounds on interactions, with a mute toggle (legacy from the pixel-art era — verify it still fits the current aesthetic).

---

## Current visual identity ("Nocturne")

A calm, editorial dark aesthetic — **not** the old retro pixel game look, and no longer the glass-morphism "Obsidian" look either (both live in `mockups/` now).

- **Background:** warm charcoal `#14161B` — flat, no ambient glows.
- **Accent:** teal `#2FA89B` — the single hero color, used sparingly.
- **Surfaces:** **solid** cards `#1A1D24` with soft layered shadows (no blur).
- **Type:** `Instrument Serif` (headings/wordmark/big numbers), `Hanken Grotesk` (body + eyebrows).
- **Feel:** quiet and content-first — removed the marquee, rotating spotlight, scan-sweep, and the fake live-stats ribbon.

> Full tokens in **DESIGN.md**. System architecture and data flows in **ARCHITECTURE.md** + **FLOWS.md**. Outstanding work in **AUDIT.md**.

The **daily email digest** (`src/lib/email/daily-digest.tsx`) now matches the Nocturne palette (dark + teal, serif headings) — the old amber/emoji "WEEKEND QUEST / GOLD POTENTIAL" game theme has been removed.
