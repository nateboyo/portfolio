# TLOU-Inspired Portfolio Website — Design Spec

**Date:** 2026-05-12
**Owner:** Nathan Garrovillas
**Project codename:** `tlou-portfolio`

## 1. Overview

A personal portfolio website for Nathan Garrovillas (full-stack engineer) whose home screen mirrors the main menu of *The Last of Us* (Naughty Dog). A looping video of the game's window-plants scene plays full-bleed in the background. A left-aligned uniform-style vertical menu lists the site's sections. Clicking a menu item dims the background and fades in that section's content, mirroring the in-game sub-menu transition. The site is content-light and presentation-heavy: it should feel cinematic and intentional, not flashy.

## 2. Goals & Non-Goals

### Goals
- Showcase Nathan's 7 shipped projects in a way that signals taste, polish, and technical depth.
- Recreate the TLOU main-menu look and transition feel as faithfully as the web platform permits.
- Be deployable to Vercel with a single push.
- Load fast (< 3s LCP on broadband) despite a fullscreen video background.
- Work on desktop and mobile (responsive, not pixel-identical).

### Non-Goals (out of scope for v1)
- **Audio playback** of the TLOU theme — explicitly deferred. The mute/unmute toggle is removed from v1; can be added later.
- **Contact form** — methods list only (email, LinkedIn, GitHub, Creative Shore LI link).
- **Scrollable home screen** — the main menu is a fixed, single-viewport screen.
- **CMS / dynamic content** — all content is hard-coded in the repo for v1.
- **Light mode** — single dark cinematic theme only.
- **Animations beyond the dim/fade transition** — no parallax, no scroll-jacking.

## 3. Visual Design

### Palette
- **Background canvas:** `#0a0a0a` (near-black, behind the video).
- **Text — active:** `#ffffff` (pure white, used for the highlighted menu item and page headings).
- **Text — primary content:** `#e8dcc8` (warm off-white at ~85% opacity, used for body text).
- **Text — inactive menu:** `rgba(232,220,200,0.55)` (warm off-white at 55%).
- **Accent:** `rgba(210,140,40,0.85)` (TLOU sunset amber — used for breadcrumbs, link borders, the active project's left rail, and section labels).
- **Dividers / faint borders:** `rgba(255,255,255,0.08–0.12)`.

### Typography
- **Single typeface:** `Josefin Sans` (Google Fonts) at weights 300, 400, 500, 600.
- Menu items and page headings use uppercase with 3.5px letter-spacing.
- Body copy is sentence case at 13–14px, 1.6–1.7 line-height.
- Cinzel and other serifs were tested during brainstorming and rejected in favor of a uniform single-font look that matches the actual TLOU menu more closely.

### Layout
- **Home (main menu):** left-aligned, vertically centered, max-width ~380px, sitting 64px from the left edge.
- **Sub-pages:** content lives in a single padded region (top 60px, sides 64px) that fades in over the dimmed background. The menu fades out and slides slightly left during the transition.

### Background video
- Single asset: `assets/tlou-menu-bg.mp4` (already downloaded — 1080p60, silent, 30MB raw).
- Will be re-encoded to ~5–8MB H.264 720p for production (target bitrate ~1Mbps, 30fps acceptable).
- HTML5 `<video autoplay loop muted playsinline>`, `object-fit: cover`.
- **Home state:** video at 100% brightness with a left-side darkening gradient (`linear-gradient(90deg, rgba(0,0,0,0.85), transparent)`) so menu text is readable over bright window-light pixels.
- **Sub-page state:** video filter shifts to `brightness(0.4) saturate(0.85)` and a full-canvas `rgba(0,0,0,0.6)` overlay layers on top. Transitions via 0.7s ease.

### Footer credit
- One line, bottom-center: `INSPIRED BY THE MAIN MENU OF THE LAST OF US — NAUGHTY DOG` at 10px, 40% opacity. Sets the tone as homage, not knock-off.

### "Compiling Skills: 100%" easter egg
- Bottom-right corner. Mirrors the TLOU "Building Shaders" status indicator. Optional — can be removed if Nathan wants it cleaner.

## 4. Pages & Routes

### `/` — Home (main menu)
- Static tagline: "Full-stack engineer · React · TypeScript · Node.js" sits 20px below the menu.
- Menu items in uniform column (22px gap, 14px size, weight 400):
  1. **Nathan Garrovillas** (the title/home item — selected by default)
  2. **Projects**
  3. **About Me**
  4. **Resume**
  5. **Contact**
- Active item is weight 600, color `#ffffff`. Inactive items are weight 400, 55% opacity. Hover lifts to ~95% opacity.
- The tagline never changes on hover — earlier mockups updated it per-item but that was removed during brainstorming.

### `/projects` — Projects
- Side-by-side layout: 280px-wide left column (project list) + flexible right column (selected project detail).
- Left column: 7 projects, vertically listed. Active project gets a 2px amber left-border + white text.
- **In-progress projects** show "— IN PROGRESS" in small amber text appended to the project name in the list. In v1 this applies to **Prism** and **Solace**.
- Right column shows the selected project:
  - Screenshot/preview image at top (max ~600x280). For in-progress projects, the image area is replaced by a placeholder with a dashed amber border and the text "IN PROGRESS / Screenshot coming soon."
  - Project name (large uppercase, white)
  - Tech stack line (amber, uppercase)
  - Description paragraph
  - "View Live" + "GitHub" buttons (ghost-style, amber border on hover). In-progress projects hide the "View Live" button and may show "GitHub (Private)" or omit it.
- Default-selected project on entry: **Care Circle** (Nathan's flagship project).

### `/about` — About Me
- Single text column, max 720px wide.
- 3 short bio paragraphs (drawn from resume summary).
- Closing tag-cloud of 12 skill tags (React, TypeScript, Node.js, Python, PostgreSQL, Supabase, AWS, Vercel, Stripe, OAuth2, Docker, GraphQL).

### `/resume` — Resume
- Trimmed inline view: Experience (2 entries), Certifications.
- "↓ Download Full PDF" button linking to `Nathan_Garrovillas_Resume_2026.pdf` in `/public`.

### `/contact` — Contact
- Tagline: "Open to remote work, full-time or contract."
- 4 contact items — each with a small icon, label, and value:
  - Email — garrovillasnathan@gmail.com (mailto link)
  - LinkedIn — linkedin.com/in/nathan-garrovillas
  - GitHub — github.com/nateboyo
  - Creative Shore LI — creativeshoreli.com
- No message form in v1.

## 5. Interactions

### Menu navigation
- Click any menu item → navigates to that subpage. Uses Next.js client-side routing (no full reload).
- The home menu item ("Nathan Garrovillas") returns to `/`.

### Page transition (the TLOU dim)
- On route change away from `/`:
  1. Background `<video>` CSS filter transitions to `brightness(0.4) saturate(0.85)` over 0.7s.
  2. Full-canvas dark overlay opacity ramps from `rgba(0,0,0,0)` to `rgba(0,0,0,0.6)` over 0.7s.
  3. Main menu fades out + slides 30px left over 0.5s.
  4. Subpage content fades in over 0.5s, delayed 0.2s.
- On route change back to `/`: all of the above reverses.

### Sub-page navigation
- "← Back" link in the breadcrumb area returns to `/`.
- **ESC key** also returns to `/` (matches TLOU controller behavior).

### Project switcher (inside /projects only)
- Clicking a project name in the left list updates the right detail panel **without changing the route**. Smooth content swap (~150ms cross-fade).

## 6. Tech Stack

- **Framework:** Next.js 14+ (App Router) — chosen for file-based routing, smooth client transitions, image/video optimization, and zero-config Vercel deployment.
- **Language:** TypeScript (strict mode).
- **Styling:** Plain CSS modules (one `.module.css` per component). No Tailwind, no styled-components — kept simple because the design is fixed and we want zero build-time CSS overhead.
- **State management:** React local state only (`useState`/`useReducer`). No global store needed — the only cross-page state is the dimmed/undimmed background, which is driven by the current route.
- **Animations:** CSS transitions only. No Framer Motion or GSAP in v1.
- **Fonts:** `next/font/google` for Josefin Sans (self-hosts the font, avoids FOUC and external requests).
- **Video:** Native HTML5 `<video>` (not `next/video`). Encoded once at build prep time.
- **Hosting:** Vercel — push to GitHub, import to Vercel, deploy. Custom domain optional (Nathan can wire this up post-launch).

## 7. Repository Structure

```
portfolio/
├── public/
│   ├── tlou-menu-bg.mp4              # compressed background video
│   ├── Nathan_Garrovillas_Resume_2026.pdf
│   ├── profile.jpg                    # placeholder for About page
│   └── projects/                      # 7 project screenshots
│       ├── care-circle.png
│       ├── joblink-log.png
│       ├── obsession-studio.png
│       ├── prism.png
│       ├── solace.png
│       ├── creative-shore-li.png
│       └── dns-case-study.png
├── src/
│   ├── app/
│   │   ├── layout.tsx                # root layout — loads font, mounts video + overlay
│   │   ├── page.tsx                  # home (main menu)
│   │   ├── projects/page.tsx
│   │   ├── about/page.tsx
│   │   ├── resume/page.tsx
│   │   ├── contact/page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── BackgroundVideo.tsx       # client component — wraps video + overlay, reads pathname
│   │   ├── MainMenu.tsx              # the home-screen left-aligned menu
│   │   ├── PageFrame.tsx             # subpage shell (breadcrumb, heading, ESC handler)
│   │   ├── ProjectSwitcher.tsx       # the /projects side-by-side list+detail UI
│   │   ├── FooterCredit.tsx
│   │   └── CornerStatus.tsx          # "Compiling Skills: 100%" easter egg
│   └── content/
│       ├── projects.ts               # the 7-project array (name, stack, desc, links, image)
│       └── contact.ts                # the 4 contact items
├── next.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

### Key component boundaries
- **`BackgroundVideo`** owns the dim state. It reads `usePathname()` and toggles a class on the wrapping `<div>` (`subpage-active` when path !== `/`). All transition CSS keys off this single class. Means: no global state library needed.
- **`MainMenu`** is purely presentational. It renders 5 `<Link>` components.
- **`PageFrame`** is the shared wrapper for /projects, /about, /resume, /contact. Handles the ESC keyboard listener and renders the breadcrumb. Its `children` are the page-specific content.
- **`ProjectSwitcher`** is the only stateful subpage component (tracks selected project index).
- **`projects.ts`** is the single source of truth for project content. Adding a project = adding one object to this array.

## 8. Assets We Still Need

These don't block design approval, but the build will use placeholders until they arrive:

| Asset | Status | Notes |
|---|---|---|
| TLOU window video | ✅ have | `portfolio/assets/tlou-menu-bg.mp4`, will be compressed |
| Resume PDF | ✅ have | already in `OneDrive/Desktop/job stuff/Nathan_Garrovillas_Resume_2026.pdf` |
| Project screenshots (5 ready, 2 deferred) | ⚠️ partial | Need PNGs at `public/projects/{care-circle,joblink-log,obsession-studio,creative-shore-li,dns-case-study}.png`. **Prism** and **Solace** are explicitly marked "IN PROGRESS" in v1 — no screenshots needed yet. |
| Profile photo for About | ❌ none | Nathan provides — or use a stylized initial fallback |
| Project live URLs / GitHub links | ⚠️ partial | Nathan to supply per-project |

## 9. Performance Notes

- The 30MB raw video must be re-encoded before going live. Target: H.264 720p, ~1Mbps, ~5–8MB final. `ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 -preset slow -an output.mp4` is the rough recipe.
- All other assets are tiny — fonts via `next/font` (cached), no large JS libs, no images on home.
- Target Lighthouse Performance score: ≥ 90 on desktop, ≥ 75 on mobile (video backgrounds tax LCP — acceptable trade-off for the aesthetic).

## 10. Deployment Plan

1. Initialize the Next.js project in `portfolio/`.
2. Push to a new GitHub repo (e.g. `nateboyo/portfolio`).
3. Import the repo in Vercel; accept defaults.
4. Optionally point a custom domain at it (e.g. `nathangarrovillas.com`).

## 11. Open Questions Resolved During Brainstorming

- ~~Menu items: project names directly?~~ → No. Generic sections; Projects is its own page.
- ~~Title styled as Cinzel serif?~~ → No. Same font as menu items, just bolder.
- ~~Hover updates description text?~~ → No. Static tagline.
- ~~Audio playback?~~ → Deferred.
- ~~Contact form?~~ → Methods list only.
- ~~Tech stack?~~ → Next.js App Router + TypeScript + Vercel.

## 12. Out of Scope (explicit non-goals)

Reiterating from §2 — these are intentional v1 omissions, not oversights:
- Audio
- Contact form
- Scroll-driven animations
- Multi-theme (light mode)
- CMS / admin
- Analytics integration (can add post-launch)
- SEO beyond basic Next.js metadata defaults
