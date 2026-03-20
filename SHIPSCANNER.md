# ShipScanner

## What it is
ShipScanner is a daily app idea generator for indie hackers and vibe coders. It scans Reddit, Hacker News, and Product Hunt every morning for real pain points people are complaining about, then uses AI to distill them into actionable app ideas — complete with target audience, monetization strategy, difficulty level, and viral potential.

## The vibe
Retro pixel-art game aesthetic. The whole experience is framed as a quest/RPG — ideas are "quests", browsing is "scouting", building is "shipping". Dark mode, pixel borders, 8-bit sound effects, Press Start 2P font, scanline overlays, amber/cyan/emerald color palette.

## Core value prop
- **For who**: Indie hackers, solo developers, vibe coders who want to build something but don't know what
- **The problem it solves**: Finding validated app ideas is hard. Most people build things nobody wants. ShipScanner surfaces real problems real people are posting about right now.
- **The hook**: Fresh ideas every morning in your inbox. Zero friction — no account needed. Browse, save, share.

## How it works
1. Bots scrape Reddit/HN/Product Hunt daily for complaints, frustrations, "why doesn't this exist" posts
2. AI analyzes and packages them into 10 structured app ideas (name, one-liner, description, pain point, audience, monetization, difficulty, viral potential)
3. Users browse ideas on the site or get them via daily email digest

## Key features
- **Idea cards**: Each idea has category, difficulty (Weekend Quest / Week-long Raid / Epic Campaign), viral potential (1-5 flames), source links
- **Save/bookmark**: localStorage-based, no account needed
- **"Build with Claude" button**: Generates a copy-paste-ready prompt from idea data with category-specific stack suggestions
- **Share cards**: Generates shareable social images (the viral loop)
- **Spotlight**: "Idea of the Day" featured on landing page when 4+ ideas exist
- **Categories page**: Browse ideas by category with counts
- **Sound effects**: 8-bit Web Audio API sounds on interactions (click, save, ship) with mute toggle
- **Daily email digest**: Game-themed HTML email ("DAILY LOOT DROP", quest difficulty labels)
- **Typewriter hero**: Animated h1 cycling between "your next / idea / awaits" and "find. / build. / ship."

## Design philosophy
- **Simple, valuable, hyper-sharable**: No accounts, no gamification complexity (XP/levels were removed). The viral loop is: land → browse → "oh this is cool" → share card → their followers click → repeat
- **Game feel without game mechanics**: The aesthetic and copy create the game vibe, not points systems. RPG framing (quests, loot drops, scouting) makes browsing ideas feel fun without adding friction.
- **Zero friction**: Everything works immediately. No signup walls. localStorage for persistence. The sharing cards are the growth engine.

## Tech stack
- Next.js 16 + React 19 + TypeScript
- Tailwind v4 + shadcn/ui (base-ui primitives)
- Supabase (database, with seed data fallback)
- Anthropic Claude API (idea analysis)
- Web Audio API (sound effects)
- html2canvas-pro (share card generation)
- Resend (email delivery)
- Vercel (deployment target)

## Content tone
Game-themed copy throughout: "DAILY LOOT DROP", "QUEST AVAILABLE", "Weekend Quest / Week-long Raid / Epic Campaign", "THE PROBLEM", "WHO NEEDS IT", "GOLD POTENTIAL". Casual, energetic, speaks directly to builders.
