# SideQuest — Design Tokens & System ("Nocturne")

Source of truth as it ships today, pulled directly from `src/app/globals.css`. Hand this to a designer to rebuild the palette in Figma, or use it as the contract for further work.

The current direction is **"Nocturne"** — a calm, editorial dark theme: warm charcoal background, **solid** cards with soft shadows (no glass-morphism), a single **teal** accent, and **serif headings**. It replaced the previous "Obsidian" system (near-black + glass + copper + pixel font) in the redesign of May 2026. The retro pixel-art era and the Obsidian glass era both live only in `mockups/` now.

---

## Color tokens

### Core surface & background
| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#14161B` | Page background (warm charcoal) |
| `--surface` | `#1B1E26` | Raised surface (inputs, secondary buttons) |
| `--card` | `#1A1D24` | Card fill (solid) |
| `--card-hover` | `#1F232B` | Card hover / active fill |
| `--border` | `rgba(255,255,255,0.09)` | Card + control borders |
| `--line` | `rgba(255,255,255,0.06)` | Hairline dividers |

### Accent (single brand color — teal)
| Token | Value | Use |
|-------|-------|-----|
| `--accent` | `#2FA89B` | Primary accent — CTAs, eyebrows, active states, viral dots |
| `--accent-soft` | `rgba(47,168,155,0.14)` | Soft fills, featured-card wash, active nav bg |
| `--accent-glow` | `rgba(47,168,155,0.08)` | Subtle glow |
| `--on-accent` | `#14161B` | Text/icons on top of accent |

> The prototype shipped three directions (Paper, Studio, Nocturne) and several accent options. **Nocturne + teal** is the locked production choice. Violet `#9A8CF0` is Nocturne's original default accent if ever needed.

### Text (warm off-white ramp)
| Token | Value | Use |
|-------|-------|-----|
| `--text` | `#ECEAE4` | Headlines, primary text, big numbers |
| `--dim` | `#9DA0A8` | Body / secondary text |
| `--mute` | `#6B6E76` | Labels, captions, meta |

### Difficulty / status
| Token | Value | Use |
|-------|-------|-----|
| `--diff-weekend` / `--success` | `#6FCF97` (green) | Weekend difficulty |
| `--diff-week` / `--warning` | `#E0B15B` (amber) | Week difficulty |
| `--diff-month` / `--danger` | `#E07A8B` (rose) | Month difficulty |

> Difficulty is shown as a **colored dot + label** (e.g. ● Weekend), not a bordered pill.

---

## Typography

| Role | Font | Where | Notes |
|------|------|-------|-------|
| Headings / wordmark | **Instrument Serif** (`--font-head`, weight 400) | `.font-head`, `.font-display`, hero, card names, section H2s, big numbers | Elegant serif; loaded via `next/font` |
| Body | **Hanken Grotesk** (`--font-body`, 400–700) | default `body` | Clean grotesque |
| Eyebrows / labels | **Hanken Grotesk 600**, uppercase | `.font-label`, eyebrows | `letter-spacing: 0.16em`, ~11–12px, teal |
| Code / prompt box | system mono (`ui-monospace`) | `.prompt-box` | 12.5px |

**Type scale:** hero wordmark `clamp(50px,9vw,98px)`; section H2 `clamp(28px,4vw,40px)`; card name `25px`; step numbers `34px`; body `15–21px`; eyebrows `11–12px` uppercase.

---

## Spacing, radius, motion

- **Radius:** `--radius: 14px` (cards, modals); buttons `10px`; pills/nav `999px`.
- **Card padding:** `26px 28px`. **Page max-width:** `1080px`, `32px` side padding.
- **Section rhythm:** `py-11` (44px), divided by `1px` `--line`.
- **Shadows:** `--shadow` (resting) and `--shadow-hover` — soft, layered, no colored glow.
- **Easing:** signature `cubic-bezier(0.22, 0.7, 0.3, 1)`; card hover lifts `-3px`.
- **Reduced motion:** global `@media (prefers-reduced-motion: reduce)` kills animation/transition.

---

## Signature components & effects

1. **Card** (`.glass-card` — name kept for compatibility, now solid)
   - `var(--card)` fill, 1px `--border`, 14px radius, `--shadow`.
   - Hover: lifts `-3px`, `--shadow-hover`, border tints teal.
   - **Active (expanded):** spans full grid width (`grid-column: 1 / -1`), teal-tinted border, chevron rotates 180°; detail reveals with staggered `.panel-item` fade-up.
   - **Featured** (`.featured`): top-down `--accent-soft` gradient wash — used for "Idea of the day" (first card).

2. **Idea card anatomy:** index `01`–`10` (serif) · category/"Idea of the day" eyebrow (teal) · serif name · one-liner · footer = difficulty dot+label + 5 viral dots + chevron. Expanded: 3-col detail (Pain point / Who needs it / Monetization) + mono build-prompt box + Copy / Save / View source.

3. **Prompt box** (`.prompt-box`): `--bg` fill, `--line` border, mono 12.5px, teal nothing — quiet.

4. **Modal** (`.modal-overlay` / `.modal-card`): `rgba(0,0,0,0.7)` + 8px blur backdrop; card scales `0.96 → 1`. Has `role="dialog"` + `aria-modal`.

5. **Header:** sticky, `color-mix` translucent bg + 12px blur, serif "SideQuest" wordmark, pill nav (active = teal text on `--accent-soft`).

> **Removed in the Nocturne redesign:** glass blur, ambient glow blobs, rotating spotlight border, hero scan-sweep, marquee ticker, the fake live-stats scanner ribbon, and the Doto pixel font.

---

## Accessibility baked in

- Idea cards are keyboard-operable (`role="button"`, `tabIndex=0`, Enter/Space toggles).
- Modal has `role="dialog"` + `aria-modal` + Esc-to-close.
- `prefers-reduced-motion` respected globally.
- Text ramp meets contrast on `#14161B` (`--mute` is the lightest "quiet" tone; avoid going dimmer for meaningful text).

---

## Mockup library (design exploration history)

`mockups/` holds standalone HTML explorations (reference / moodboard only — not the build). `5-obsidian.html` is the previous shipped look; the others are earlier directions. The Nocturne prototype itself lives in `~/Downloads/SideQuest Nocturne/` (three switchable directions + a tweaks panel).

---

## Tech notes for implementation

- **Tailwind v4** (CSS-first `@theme inline` in `globals.css`) + **shadcn/ui** on base-ui primitives. Tokens exposed as raw CSS vars (`var(--accent)`) and shadcn semantic names (`--primary`, `--card`, …), kept in sync. App is **dark-only** (`.dark` mirrors `:root`).
- **Legacy aliases** remain in `globals.css` (`--copper → --accent`, `--text-display → --text`, `--glass → --card`, etc.) so any not-yet-refactored markup still renders in Nocturne. New work should use the canonical Nocturne tokens.
- Fonts via `next/font/google`: Instrument Serif + Hanken Grotesk. Icons: `lucide-react`. Share images: `html2canvas-pro`. Sounds: Web Audio (`src/lib/sounds.ts`).
