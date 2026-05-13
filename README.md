# Nathan Garrovillas — Portfolio

A portfolio site inspired by the main menu of *The Last of Us*.

**Stack:** Next.js 14 (App Router) · TypeScript (strict) · CSS Modules · Vercel

## Live

_Live URL will be added after Vercel deployment._

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Tests

```bash
npm run test       # Vitest unit tests (14 tests)
npm run test:e2e   # Playwright e2e tests (9 tests)
```

## Project structure

- `src/app/` — Next.js App Router pages (home, projects, about, resume, contact)
- `src/components/` — Shared components (BackgroundVideo, MainMenu, PageFrame, ProjectSwitcher, FooterCredit, CornerStatus)
- `src/content/` — Typed content data (projects, contact methods)
- `public/` — Static assets (background video, resume PDF, project screenshots)
- `tests/` — Unit and e2e tests

## Credits

The window-and-plants background and visual design language are inspired by the main menu of *The Last of Us* (Naughty Dog). All other content, code, and screenshots are original work by Nathan Garrovillas.
