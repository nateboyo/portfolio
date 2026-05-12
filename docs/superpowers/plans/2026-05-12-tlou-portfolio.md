# TLOU-Inspired Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Next.js + TypeScript portfolio site whose home screen mirrors *The Last of Us* main menu, with a video background, dim-on-navigation transition, and 5 routes (home / projects / about / resume / contact), deployed to Vercel.

**Architecture:** Single-page application built on Next.js 14 App Router. Background video lives in the root layout and reads `usePathname()` to toggle a `subpage-active` class — all dim/fade transitions key off that single class. Each route is a focused page component wrapped in a shared `PageFrame` (breadcrumb + ESC handler). Project content is hard-coded in a single typed data file. CSS Modules per component, no UI library. The repo already contains an approved spec at `docs/superpowers/specs/2026-05-12-tlou-portfolio-design.md` and a working HTML prototype at `full-prototype.html` — port the prototype's behavior, do not redesign.

**Tech Stack:** Next.js 14 (App Router), TypeScript (strict), React 18, CSS Modules, `next/font` (Josefin Sans), Playwright (smoke tests), Vitest + React Testing Library (component logic tests), ffmpeg (one-time video re-encode), Vercel (hosting).

**Important file references:**
- Spec: `docs/superpowers/specs/2026-05-12-tlou-portfolio-design.md`
- Working HTML prototype to port: `full-prototype.html`
- Source video (uncompressed): `assets/tlou-menu-bg.mp4` (30 MB)
- Source project screenshots: `assets/projects/{care-circle.png, joblink-log.png, obsession-studio.png, creative-shore-li.png, dns-case-study.jpg}`
- Source resume PDF: `C:\Users\darth\OneDrive\Desktop\job stuff\Nathan_Garrovillas_Resume_2026.pdf`

---

## File Structure (planned)

```
portfolio/
├── public/
│   ├── tlou-menu-bg.mp4              # encoded ~5–8 MB
│   ├── Nathan_Garrovillas_Resume_2026.pdf
│   └── projects/
│       ├── care-circle.png
│       ├── joblink-log.png
│       ├── obsession-studio.png
│       ├── creative-shore-li.png
│       └── dns-case-study.jpg
├── src/
│   ├── app/
│   │   ├── layout.tsx                # font, BackgroundVideo, FooterCredit, CornerStatus
│   │   ├── page.tsx                  # home — renders MainMenu
│   │   ├── projects/page.tsx
│   │   ├── about/page.tsx
│   │   ├── resume/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── globals.css               # palette CSS variables + resets
│   │   └── page.module.css           # home-specific
│   ├── components/
│   │   ├── BackgroundVideo.tsx + .module.css   # client; reads pathname; owns dim state
│   │   ├── MainMenu.tsx + .module.css          # client; the 5-item vertical list
│   │   ├── PageFrame.tsx + .module.css         # subpage shell (breadcrumb, ESC)
│   │   ├── ProjectSwitcher.tsx + .module.css   # client; list + detail with active state
│   │   ├── FooterCredit.tsx + .module.css      # server; static "Inspired by..." line
│   │   └── CornerStatus.tsx + .module.css      # server; "Compiling Skills: 100%"
│   └── content/
│       ├── projects.ts               # typed array of 7 projects
│       └── contact.ts                # typed array of 4 contact methods
├── tests/
│   ├── e2e/                          # Playwright
│   │   ├── routes.spec.ts
│   │   └── navigation.spec.ts
│   └── unit/                         # Vitest
│       ├── BackgroundVideo.test.tsx
│       ├── PageFrame.test.tsx
│       ├── ProjectSwitcher.test.tsx
│       └── projects-data.test.ts
├── playwright.config.ts
├── vitest.config.ts
├── next.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## Task 1: Scaffold Next.js project + tooling

**Files:**
- Create: `portfolio/package.json`, `tsconfig.json`, `next.config.mjs`, `vitest.config.ts`, `playwright.config.ts`
- Create: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`
- Modify: `.gitignore`

- [ ] **Step 1: Run Next.js scaffolder in the existing portfolio folder**

```bash
cd C:\Users\darth\portfolio
npx create-next-app@14.2 . --typescript --eslint --app --src-dir --import-alias "@/*" --no-tailwind --use-npm
```

Expected: scaffolder asks no questions (all flags supplied), creates `src/app/`, `package.json`, etc. When it asks about overwriting existing files, say no — we want it to merge. If it refuses to install into a non-empty directory, run it in a temp dir then copy the relevant generated files: `src/`, `next.config.mjs`, `tsconfig.json`, `next-env.d.ts`, `package.json`.

- [ ] **Step 2: Install testing + tooling dependencies**

```bash
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test
npx playwright install chromium
```

- [ ] **Step 3: Configure TypeScript strict mode**

Open `tsconfig.json` and ensure these flags are in `compilerOptions`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

- [ ] **Step 5: Create `tests/setup.ts`**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 6: Create `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
```

- [ ] **Step 7: Add npm scripts to `package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 8: Verify everything is wired**

```bash
npm run dev
```
Expected: server starts on port 3000, opens to the default Next.js welcome page (we'll replace it).

Stop the server (Ctrl+C).

```bash
npm run test -- --run
```
Expected: "No test files found" (this is fine — no tests yet).

```bash
npx tsc --noEmit
```
Expected: exits cleanly, no errors.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "chore: scaffold Next.js 14 + TypeScript + testing tools"
```

---

## Task 2: Define palette + global CSS

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Overwrite `src/app/globals.css` with our palette**

```css
:root {
  --color-bg: #0a0a0a;
  --color-text-active: #ffffff;
  --color-text-primary: rgba(232, 220, 200, 0.85);
  --color-text-inactive: rgba(232, 220, 200, 0.55);
  --color-text-faint: rgba(232, 220, 200, 0.4);
  --color-accent: rgba(210, 140, 40, 0.85);
  --color-accent-soft: rgba(210, 140, 40, 0.5);
  --color-divider: rgba(255, 255, 255, 0.08);
  --color-divider-strong: rgba(255, 255, 255, 0.12);

  --letter-spacing-menu: 3.5px;
  --letter-spacing-label: 3px;

  --transition-dim: 0.7s ease;
  --transition-fade: 0.5s ease;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { height: 100%; overflow: hidden; }

body {
  background: var(--color-bg);
  color: #e8dcc8;
  font-family: var(--font-josefin), 'Josefin Sans', sans-serif;
  font-weight: 300;
}

a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; }
ul { list-style: none; }
```

- [ ] **Step 2: Verify it loads without breaking the page**

```bash
npm run dev
```
Open http://localhost:3000 — should show the default page with a black background now. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add palette CSS variables and base resets"
```

---

## Task 3: Wire Josefin Sans font + root layout shell

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Overwrite `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import './globals.css';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-josefin',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nathan Garrovillas — Full-Stack Engineer',
  description: 'Portfolio of Nathan Garrovillas, full-stack software engineer based in Bay Shore, NY.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={josefin.variable}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Verify font loads**

```bash
npm run dev
```
Open http://localhost:3000. Open DevTools → Network → filter by "font". Confirm a `josefin-sans-*.woff2` request returns 200 (or is served from cache).

Stop the server.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: wire Josefin Sans via next/font and root metadata"
```

---

## Task 4: Encode background video to web-optimized size

**Files:**
- Create: `public/tlou-menu-bg.mp4`

- [ ] **Step 1: Check if ffmpeg is installed**

```bash
ffmpeg -version
```
If "not recognized", install it: `winget install ffmpeg` or download from https://www.gyan.dev/ffmpeg/builds/ and add to PATH. Re-open terminal afterward.

- [ ] **Step 2: Encode the source video**

```bash
ffmpeg -i assets/tlou-menu-bg.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 -preset slow -movflags +faststart -an public/tlou-menu-bg.mp4
```

Flags explained:
- `-vf scale=1280:720` → downscale to 720p
- `-crf 28` → quality (lower=better, 28 is web-acceptable)
- `-preset slow` → better compression for one-time encode
- `-movflags +faststart` → metadata at front so streaming starts immediately
- `-an` → strip audio

- [ ] **Step 3: Verify output size**

```bash
ls -lh public/tlou-menu-bg.mp4
```
Expected: ~5–10 MB (down from 30 MB). If significantly larger, retry with `-crf 30`.

- [ ] **Step 4: Commit (or add to .gitignore if too large)**

Git is fine with files under ~50 MB. If your encoded file is under 10 MB, commit it. Otherwise, add `public/tlou-menu-bg.mp4` to `.gitignore` and note in the README that the video must be re-encoded post-clone.

```bash
git add public/tlou-menu-bg.mp4
git commit -m "feat: add compressed 720p background video"
```

---

## Task 5: BackgroundVideo component (the dim-state owner)

**Files:**
- Create: `src/components/BackgroundVideo.tsx`
- Create: `src/components/BackgroundVideo.module.css`
- Create: `tests/unit/BackgroundVideo.test.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// tests/unit/BackgroundVideo.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BackgroundVideo from '@/components/BackgroundVideo';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

import { usePathname } from 'next/navigation';

describe('BackgroundVideo', () => {
  it('renders without dim class on the home route', () => {
    vi.mocked(usePathname).mockReturnValue('/');
    render(<BackgroundVideo />);
    const container = screen.getByTestId('bg-container');
    expect(container.className).not.toContain('subpageActive');
  });

  it('renders with dim class on subpage routes', () => {
    vi.mocked(usePathname).mockReturnValue('/projects');
    render(<BackgroundVideo />);
    const container = screen.getByTestId('bg-container');
    expect(container.className).toContain('subpageActive');
  });
});
```

- [ ] **Step 2: Run the test — confirm it fails**

```bash
npm run test -- --run BackgroundVideo
```
Expected: FAIL with `Cannot find module '@/components/BackgroundVideo'`.

- [ ] **Step 3: Create `src/components/BackgroundVideo.module.css`**

```css
.container { position: fixed; inset: 0; z-index: 0; pointer-events: none; }

.video {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  transition: filter var(--transition-dim);
}

.overlay {
  position: absolute; inset: 0;
  transition: background var(--transition-dim);
  background: linear-gradient(
    90deg,
    rgba(0,0,0,0.85) 0%,
    rgba(0,0,0,0.55) 30%,
    rgba(0,0,0,0.15) 60%,
    transparent 100%
  );
}

.subpageActive .video { filter: brightness(0.4) saturate(0.85); }
.subpageActive .overlay { background: rgba(0, 0, 0, 0.6); }
```

- [ ] **Step 4: Create `src/components/BackgroundVideo.tsx`**

```tsx
'use client';

import { usePathname } from 'next/navigation';
import styles from './BackgroundVideo.module.css';

export default function BackgroundVideo() {
  const pathname = usePathname();
  const isSubpage = pathname !== '/';

  return (
    <div
      data-testid="bg-container"
      className={`${styles.container} ${isSubpage ? styles.subpageActive : ''}`}
    >
      <video
        className={styles.video}
        src="/tlou-menu-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.overlay} />
    </div>
  );
}
```

- [ ] **Step 5: Run the test — confirm it passes**

```bash
npm run test -- --run BackgroundVideo
```
Expected: 2 tests pass.

- [ ] **Step 6: Wire `BackgroundVideo` into the root layout**

Modify `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import BackgroundVideo from '@/components/BackgroundVideo';
import './globals.css';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-josefin',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nathan Garrovillas — Full-Stack Engineer',
  description: 'Portfolio of Nathan Garrovillas, full-stack software engineer based in Bay Shore, NY.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={josefin.variable}>
      <body>
        <BackgroundVideo />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Visual check**

```bash
npm run dev
```
Open http://localhost:3000 — confirm video plays in background. Stop the server.

- [ ] **Step 8: Commit**

```bash
git add src/components/BackgroundVideo.tsx src/components/BackgroundVideo.module.css tests/unit/BackgroundVideo.test.tsx src/app/layout.tsx
git commit -m "feat: BackgroundVideo component with pathname-driven dim state"
```

---

## Task 6: MainMenu component + home page

**Files:**
- Create: `src/components/MainMenu.tsx`
- Create: `src/components/MainMenu.module.css`
- Modify: `src/app/page.tsx`
- Create: `src/app/page.module.css`

- [ ] **Step 1: Create `src/components/MainMenu.module.css`**

```css
.menu {
  position: fixed;
  left: 64px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  max-width: 380px;
  transition: opacity var(--transition-fade), transform var(--transition-fade);
}

.item {
  display: block;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: var(--letter-spacing-menu);
  text-transform: uppercase;
  color: var(--color-text-inactive);
  margin-bottom: 22px;
  line-height: 1.2;
  cursor: pointer;
  transition: color 0.2s;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
}

.item:hover { color: rgba(255, 255, 255, 0.95); }

.item.active {
  color: var(--color-text-active);
  font-weight: 600;
}

.tagline {
  margin-top: 20px;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.3px;
  color: var(--color-text-primary);
  max-width: 320px;
  line-height: 1.5;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
}
```

- [ ] **Step 2: Create `src/components/MainMenu.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MainMenu.module.css';

const items = [
  { href: '/', label: 'Nathan Garrovillas' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About Me' },
  { href: '/resume', label: 'Resume' },
  { href: '/contact', label: 'Contact' },
] as const;

export default function MainMenu() {
  const pathname = usePathname();

  return (
    <nav className={styles.menu}>
      {items.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`${styles.item} ${isActive ? styles.active : ''}`}
          >
            {label}
          </Link>
        );
      })}
      <p className={styles.tagline}>
        Full-stack engineer · React · TypeScript · Node.js
      </p>
    </nav>
  );
}
```

- [ ] **Step 3: Create `src/app/page.module.css`** (empty for now — placeholder for future home-only styles)

```css
/* home page styles — currently empty, MainMenu handles its own */
```

- [ ] **Step 4: Replace `src/app/page.tsx`**

```tsx
import MainMenu from '@/components/MainMenu';

export default function HomePage() {
  return <MainMenu />;
}
```

- [ ] **Step 5: Visual check**

```bash
npm run dev
```
Open http://localhost:3000 — see the video background with the 5-item menu left-aligned. Hover over items to see opacity change. The first item ("Nathan Garrovillas") should be bolder/whiter because it's active.

Click "Projects" — page navigates to /projects (which is a 404 page right now, that's fine — we'll build it next). Click back. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add src/components/MainMenu.tsx src/components/MainMenu.module.css src/app/page.tsx src/app/page.module.css
git commit -m "feat: MainMenu component with active-route detection + home page"
```

---

## Task 7: PageFrame shared subpage shell

**Files:**
- Create: `src/components/PageFrame.tsx`
- Create: `src/components/PageFrame.module.css`
- Create: `tests/unit/PageFrame.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// tests/unit/PageFrame.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import PageFrame from '@/components/PageFrame';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe('PageFrame', () => {
  it('renders the heading and breadcrumb label', () => {
    render(<PageFrame title="Projects">content</PageFrame>);
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByText(/back/i)).toBeInTheDocument();
  });

  it('navigates home when ESC is pressed', async () => {
    const user = userEvent.setup();
    render(<PageFrame title="About">content</PageFrame>);
    await user.keyboard('{Escape}');
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
```

- [ ] **Step 2: Run the test — confirm it fails**

```bash
npm run test -- --run PageFrame
```
Expected: FAIL with module not found.

- [ ] **Step 3: Create `src/components/PageFrame.module.css`**

```css
.frame {
  position: fixed;
  inset: 0;
  z-index: 15;
  padding: 60px 64px;
  overflow-y: auto;
  animation: fadeIn var(--transition-fade) 0.2s both;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 10px;
  letter-spacing: var(--letter-spacing-label);
  text-transform: uppercase;
  color: var(--color-text-inactive);
  margin-bottom: 8px;
}

.back {
  cursor: pointer;
  color: var(--color-text-primary);
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
}

.back:hover { color: var(--color-text-active); }

.sep { color: var(--color-text-faint); }
.current { color: var(--color-accent); }

.title {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: #f4ead8;
  margin-bottom: 28px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
}
```

- [ ] **Step 4: Create `src/components/PageFrame.tsx`**

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PageFrame.module.css';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function PageFrame({ title, children }: Props) {
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') router.push('/');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

  return (
    <section className={styles.frame}>
      <div className={styles.breadcrumb}>
        <button className={styles.back} onClick={() => router.push('/')}>
          ← Back
        </button>
        <span className={styles.sep}>·</span>
        <span className={styles.current}>{title}</span>
      </div>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </section>
  );
}
```

- [ ] **Step 5: Run the test — confirm it passes**

```bash
npm run test -- --run PageFrame
```
Expected: 2 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/PageFrame.tsx src/components/PageFrame.module.css tests/unit/PageFrame.test.tsx
git commit -m "feat: PageFrame shell with breadcrumb and ESC handler"
```

---

## Task 8: Projects data file

**Files:**
- Create: `src/content/projects.ts`
- Create: `tests/unit/projects-data.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/projects-data.test.ts
import { describe, it, expect } from 'vitest';
import { projects } from '@/content/projects';

describe('projects data', () => {
  it('contains 7 projects', () => {
    expect(projects).toHaveLength(7);
  });

  it('marks Prism and Solace as in-progress', () => {
    const prism = projects.find(p => p.name === 'Prism');
    const solace = projects.find(p => p.name === 'Solace');
    expect(prism?.inProgress).toBe(true);
    expect(solace?.inProgress).toBe(true);
  });

  it('hides View Live for Prism, Solace, and DNS Case Study', () => {
    const hidden = projects.filter(p => p.noLive).map(p => p.name);
    expect(hidden).toEqual(['Prism', 'Solace', 'DNS Case Study']);
  });

  it('non-in-progress projects have an image path', () => {
    projects.filter(p => !p.inProgress).forEach(p => {
      expect(p.image).toMatch(/\/projects\/.+\.(png|jpg|webp)$/);
    });
  });
});
```

- [ ] **Step 2: Run — confirm it fails**

```bash
npm run test -- --run projects-data
```
Expected: FAIL with module not found.

- [ ] **Step 3: Create `src/content/projects.ts`**

```ts
export interface Project {
  name: string;
  stack: string;
  desc: string;
  image?: string;          // path under /public; required unless inProgress
  liveUrl?: string;        // omit when noLive
  githubUrl?: string;      // user adds later
  inProgress?: boolean;    // shows IN PROGRESS placeholder
  noLive?: boolean;        // hides View Live button
}

export const projects: Project[] = [
  {
    name: 'Care Circle',
    stack: 'Node.js · PWA · SSE · JavaScript',
    desc: 'Full-featured caregiving coordination app for families managing elder care. Tasks, medications, appointments, shared notes, real-time family group chat via Server-Sent Events. Shipped as a PWA with offline support.',
    image: '/projects/care-circle.png',
  },
  {
    name: 'JobLink Log',
    stack: 'Node.js · Vercel · Vanilla JS',
    desc: 'Job application tracker. Paste a job link → auto-fills company and position from page metadata. Status tracking (Pending/Denied/Interview/Hired), search/sort/filter, CSV export, light/dark mode, fully responsive.',
    image: '/projects/joblink-log.png',
  },
  {
    name: 'Obsession Studio',
    stack: 'HTML · CSS · JavaScript',
    desc: 'Luxury med spa client website. Full-screen video hero, treatment showcase, testimonial slider, multi-field contact form. Delivered as a Creative Shore LI client product.',
    image: '/projects/obsession-studio.png',
  },
  {
    name: 'Prism',
    stack: 'Electron · Chrome MV3 · Service Workers',
    desc: 'Multi-surface AI application shipped across web, Electron desktop, and Chrome MV3 extension. Debugged live CSP, off-screen rendering, and service worker lifecycle issues.',
    inProgress: true,
    noLive: true,
  },
  {
    name: 'Solace',
    stack: 'React · Supabase · PostgreSQL · Claude API',
    desc: 'Full-stack React mobile app with real-time data, Supabase auth (JWT/OAuth2), row-level security, mood analytics dashboard, and AI-powered chat.',
    inProgress: true,
    noLive: true,
  },
  {
    name: 'Creative Shore LI',
    stack: 'Vercel · GitHub Actions · Client Work',
    desc: 'Personal freelance brand and client showcase. Multiple shipped client deliverables. End-to-end ownership: scoping, architecture, development, deployment, post-launch iteration.',
    image: '/projects/creative-shore-li.png',
    liveUrl: 'https://creativeshoreli.com',
  },
  {
    name: 'DNS Case Study',
    stack: 'PowerShell · Bash · Infrastructure',
    desc: 'End-to-end DNS troubleshooting framework with automated diagnostic workflows isolating local cache, ISP, and public endpoint faults. Reproducible documented diagnostic steps.',
    image: '/projects/dns-case-study.jpg',
    noLive: true,
  },
];
```

- [ ] **Step 4: Run — confirm tests pass**

```bash
npm run test -- --run projects-data
```
Expected: 4 tests pass.

- [ ] **Step 5: Copy screenshots into `public/projects/`**

```bash
mkdir -p public/projects
cp assets/projects/care-circle.png public/projects/
cp assets/projects/joblink-log.png public/projects/
cp assets/projects/obsession-studio.png public/projects/
cp assets/projects/creative-shore-li.png public/projects/
cp assets/projects/dns-case-study.jpg public/projects/
```

- [ ] **Step 6: Commit**

```bash
git add src/content/projects.ts tests/unit/projects-data.test.ts public/projects/
git commit -m "feat: typed projects data + 5 screenshots in public/"
```

---

## Task 9: ProjectSwitcher component

**Files:**
- Create: `src/components/ProjectSwitcher.tsx`
- Create: `src/components/ProjectSwitcher.module.css`
- Create: `tests/unit/ProjectSwitcher.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// tests/unit/ProjectSwitcher.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import ProjectSwitcher from '@/components/ProjectSwitcher';

describe('ProjectSwitcher', () => {
  it('renders all project names in the list', () => {
    render(<ProjectSwitcher />);
    expect(screen.getByText('Care Circle')).toBeInTheDocument();
    expect(screen.getByText('Prism')).toBeInTheDocument();
    expect(screen.getByText('DNS Case Study')).toBeInTheDocument();
  });

  it('marks Prism with "IN PROGRESS" suffix in the list', () => {
    render(<ProjectSwitcher />);
    const prismItem = screen.getByText('Prism').closest('li');
    expect(prismItem).toHaveTextContent(/in progress/i);
  });

  it('selects Care Circle by default and shows its details', () => {
    render(<ProjectSwitcher />);
    expect(screen.getByRole('heading', { name: /care circle/i })).toBeInTheDocument();
    expect(screen.getByText(/caregiving coordination app/i)).toBeInTheDocument();
  });

  it('clicking JobLink Log swaps the detail panel', async () => {
    const user = userEvent.setup();
    render(<ProjectSwitcher />);
    await user.click(screen.getByText('JobLink Log'));
    expect(screen.getByRole('heading', { name: /joblink log/i })).toBeInTheDocument();
    expect(screen.getByText(/job application tracker/i)).toBeInTheDocument();
  });

  it('hides View Live button on in-progress projects', async () => {
    const user = userEvent.setup();
    render(<ProjectSwitcher />);
    await user.click(screen.getByText('Prism'));
    expect(screen.queryByRole('link', { name: /view live/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });

  it('shows IN PROGRESS placeholder for in-progress projects', async () => {
    const user = userEvent.setup();
    render(<ProjectSwitcher />);
    await user.click(screen.getByText('Solace'));
    expect(screen.getByText(/^in progress$/i)).toBeInTheDocument();
    expect(screen.getByText(/screenshot coming soon/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — confirm it fails**

```bash
npm run test -- --run ProjectSwitcher
```
Expected: FAIL with module not found.

- [ ] **Step 3: Create `src/components/ProjectSwitcher.module.css`**

```css
.grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 48px;
  max-width: 1200px;
}

.list { padding: 0; margin: 0; }

.listItem {
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-text-inactive);
  margin-bottom: 14px;
  cursor: pointer;
  border-left: 2px solid transparent;
  padding-left: 14px;
  transition: all 0.2s;
}

.listItem:hover { color: rgba(255, 255, 255, 0.9); }
.listItem.active { color: var(--color-text-active); border-left-color: var(--color-accent); }

.wip {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--color-accent);
  margin-left: 8px;
  font-weight: 400;
}

.detail {
  border-left: 1px solid var(--color-divider-strong);
  padding-left: 40px;
}

.image {
  width: 100%;
  max-width: 600px;
  height: 280px;
  background: linear-gradient(135deg, #1a2a18 0%, #3a2a18 100%);
  border: 1px solid var(--color-divider-strong);
  margin-bottom: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image img { width: 100%; height: 100%; object-fit: cover; display: block; }

.imageInProgress {
  background: linear-gradient(135deg, #1a1410 0%, #2a1810 100%);
  border: 1px dashed var(--color-accent-soft);
  flex-direction: column;
  gap: 6px;
}

.wipLabel { font-size: 14px; letter-spacing: 5px; color: var(--color-accent); font-weight: 500; }
.wipSub { font-size: 10px; letter-spacing: 2px; color: var(--color-text-faint); }

.name {
  font-size: 20px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 8px;
  font-weight: 500;
}

.stack {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 16px;
}

.desc {
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-primary);
  margin-bottom: 20px;
  max-width: 580px;
}

.links { display: flex; gap: 10px; }

.linkButton {
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-text-primary);
  border: 1px solid var(--color-divider-strong);
  padding: 8px 16px;
  transition: all 0.2s;
}

.linkButton:hover {
  border-color: var(--color-accent);
  color: #fff;
  background: rgba(210, 140, 40, 0.12);
}
```

- [ ] **Step 4: Create `src/components/ProjectSwitcher.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { projects, type Project } from '@/content/projects';
import styles from './ProjectSwitcher.module.css';

export default function ProjectSwitcher() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = projects[selectedIdx]!;

  return (
    <div className={styles.grid}>
      <ul className={styles.list}>
        {projects.map((p, i) => (
          <li
            key={p.name}
            className={`${styles.listItem} ${i === selectedIdx ? styles.active : ''}`}
            onClick={() => setSelectedIdx(i)}
          >
            {p.name}
            {p.inProgress && <span className={styles.wip}>— IN PROGRESS</span>}
          </li>
        ))}
      </ul>
      <ProjectDetail project={selected} />
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className={styles.detail}>
      <div className={`${styles.image} ${project.inProgress ? styles.imageInProgress : ''}`}>
        {project.inProgress ? (
          <>
            <div className={styles.wipLabel}>IN PROGRESS</div>
            <div className={styles.wipSub}>Screenshot coming soon</div>
          </>
        ) : (
          <img src={project.image} alt={project.name} />
        )}
      </div>
      <h2 className={styles.name}>{project.name}</h2>
      <div className={styles.stack}>{project.stack}</div>
      <p className={styles.desc}>{project.desc}</p>
      <div className={styles.links}>
        {!project.noLive && (
          <a className={styles.linkButton} href={project.liveUrl ?? '#'} target="_blank" rel="noopener noreferrer">
            View Live
          </a>
        )}
        <a className={styles.linkButton} href={project.githubUrl ?? '#'} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run — confirm tests pass**

```bash
npm run test -- --run ProjectSwitcher
```
Expected: 6 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProjectSwitcher.tsx src/components/ProjectSwitcher.module.css tests/unit/ProjectSwitcher.test.tsx
git commit -m "feat: ProjectSwitcher with in-progress and noLive handling"
```

---

## Task 10: Projects page route

**Files:**
- Create: `src/app/projects/page.tsx`

- [ ] **Step 1: Create `src/app/projects/page.tsx`**

```tsx
import PageFrame from '@/components/PageFrame';
import ProjectSwitcher from '@/components/ProjectSwitcher';

export default function ProjectsPage() {
  return (
    <PageFrame title="Projects">
      <ProjectSwitcher />
    </PageFrame>
  );
}
```

- [ ] **Step 2: Visual check**

```bash
npm run dev
```
Open http://localhost:3000 → click "Projects" → see the dimmed background, project list on the left, Care Circle detail on the right. Click other projects to switch. Click Prism to see the IN PROGRESS placeholder. Press ESC to return home.

Stop the server.

- [ ] **Step 3: Commit**

```bash
git add src/app/projects/page.tsx
git commit -m "feat: /projects route wired with PageFrame + ProjectSwitcher"
```

---

## Task 11: About page

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `src/app/about/page.module.css`

- [ ] **Step 1: Create `src/app/about/page.module.css`**

```css
.content {
  max-width: 720px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-primary);
}

.content p { margin-bottom: 16px; }

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.skill {
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(232, 220, 200, 0.75);
  border: 1px solid rgba(232, 220, 200, 0.25);
  padding: 5px 10px;
}
```

- [ ] **Step 2: Create `src/app/about/page.tsx`**

```tsx
import PageFrame from '@/components/PageFrame';
import styles from './page.module.css';

const SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Supabase',
  'AWS', 'Vercel', 'Stripe', 'OAuth2', 'Docker', 'GraphQL',
] as const;

export default function AboutPage() {
  return (
    <PageFrame title="About">
      <div className={styles.content}>
        <p>
          Full-stack engineer who builds and ships real products end-to-end — from React frontends and REST/GraphQL APIs to PostgreSQL backends, auth systems, and CI/CD deployments.
        </p>
        <p>
          Background in enterprise-scale data engineering at Jefferies Group and direct client product delivery through Creative Shore LI. Comfortable in fast-moving environments, remote workflows, and communicating clearly across technical and non-technical stakeholders.
        </p>
        <p>Based in Bay Shore, NY. Available immediately. Open to remote.</p>
        <div className={styles.skills}>
          {SKILLS.map(s => <span key={s} className={styles.skill}>{s}</span>)}
        </div>
      </div>
    </PageFrame>
  );
}
```

- [ ] **Step 3: Visual check**

```bash
npm run dev
```
Open http://localhost:3000 → click "About Me" → see bio + skill tags over the dimmed background. Press ESC to return.

Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/app/about/page.tsx src/app/about/page.module.css
git commit -m "feat: /about page with bio and skill tags"
```

---

## Task 12: Resume page + PDF asset

**Files:**
- Create: `public/Nathan_Garrovillas_Resume_2026.pdf`
- Create: `src/app/resume/page.tsx`
- Create: `src/app/resume/page.module.css`

- [ ] **Step 1: Copy resume PDF into public/**

```bash
cp "C:/Users/darth/OneDrive/Desktop/job stuff/Nathan_Garrovillas_Resume_2026.pdf" public/Nathan_Garrovillas_Resume_2026.pdf
```

Verify it copied: `ls -lh public/Nathan_Garrovillas_Resume_2026.pdf`

- [ ] **Step 2: Create `src/app/resume/page.module.css`**

```css
.content {
  max-width: 720px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-primary);
}

.content p { margin-bottom: 16px; }

.sectionHeader {
  margin-top: 24px;
  margin-bottom: 8px;
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--color-accent);
  text-transform: uppercase;
}

.jobTitle { color: #fff; font-weight: 600; }
.expected { color: var(--color-accent); }

.downloadButton {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-text-primary);
  border: 1px solid var(--color-accent-soft);
  padding: 10px 18px;
  margin-top: 16px;
}

.downloadButton:hover { background: rgba(210, 140, 40, 0.15); color: #fff; }
```

- [ ] **Step 3: Create `src/app/resume/page.tsx`**

```tsx
import PageFrame from '@/components/PageFrame';
import styles from './page.module.css';

export default function ResumePage() {
  return (
    <PageFrame title="Resume">
      <div className={styles.content}>
        <p>Highlights below — full PDF available for download.</p>

        <h3 className={styles.sectionHeader}>Experience</h3>
        <p>
          <span className={styles.jobTitle}>Founder · Creative Shore LI</span> · 2025–Present
          <br />
          Full-stack React/Node products for multiple concurrent clients. Stripe, Supabase, OAuth2, CI/CD.
        </p>
        <p>
          <span className={styles.jobTitle}>IT Analyst Intern · Jefferies Group</span> · 2023–2024
          <br />
          Enterprise data pipelines in Python/SQL — 50% productivity gain, 92% reliability.
        </p>

        <h3 className={styles.sectionHeader}>Certifications</h3>
        <p>
          <span className={styles.jobTitle}>AWS Cloud Practitioner</span> · <span className={styles.expected}>Expected 2026</span>
        </p>
        <p>
          <span className={styles.jobTitle}>Microsoft Azure Fundamentals</span> · <span className={styles.expected}>Expected 2026</span>
        </p>
        <p>
          <span className={styles.jobTitle}>YearUp</span> · Software Engineering &amp; Business Communications
        </p>

        <a
          className={styles.downloadButton}
          href="/Nathan_Garrovillas_Resume_2026.pdf"
          download
        >
          ↓ Download Full PDF
        </a>
      </div>
    </PageFrame>
  );
}
```

- [ ] **Step 4: Visual check**

```bash
npm run dev
```
Open http://localhost:3000 → click "Resume". Verify content shows + the "↓ Download Full PDF" button actually downloads the PDF when clicked.

Stop the server.

- [ ] **Step 5: Commit**

```bash
git add public/Nathan_Garrovillas_Resume_2026.pdf src/app/resume/page.tsx src/app/resume/page.module.css
git commit -m "feat: /resume page with inline highlights and PDF download"
```

---

## Task 13: Contact page

**Files:**
- Create: `src/content/contact.ts`
- Create: `src/app/contact/page.tsx`
- Create: `src/app/contact/page.module.css`

- [ ] **Step 1: Create `src/content/contact.ts`**

```ts
export interface ContactMethod {
  label: string;
  value: string;
  href: string;
  icon: string; // short text label rendered inside the icon circle
}

export const contactMethods: ContactMethod[] = [
  {
    label: 'Email',
    value: 'garrovillasnathan@gmail.com',
    href: 'mailto:garrovillasnathan@gmail.com',
    icon: '@',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/nathan-garrovillas',
    href: 'https://www.linkedin.com/in/nathan-garrovillas/',
    icon: 'in',
  },
  {
    label: 'GitHub',
    value: 'github.com/nateboyo',
    href: 'https://github.com/nateboyo',
    icon: '{ }',
  },
  {
    label: 'Studio',
    value: 'creativeshoreli.com',
    href: 'https://creativeshoreli.com',
    icon: 'CS',
  },
];
```

- [ ] **Step 2: Create `src/app/contact/page.module.css`**

```css
.content { max-width: 720px; }

.tagline {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-primary);
  margin-bottom: 20px;
}

.list { max-width: 500px; padding: 0; margin: 0; }

.item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-divider);
  cursor: pointer;
  transition: padding 0.2s;
}

.item:hover { padding-left: 8px; }

.icon {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(232, 220, 200, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--color-accent);
}

.text { flex: 1; }

.label {
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 2px;
}

.value {
  font-size: 13px;
  color: rgba(232, 220, 200, 0.95);
}
```

- [ ] **Step 3: Create `src/app/contact/page.tsx`**

```tsx
import PageFrame from '@/components/PageFrame';
import { contactMethods } from '@/content/contact';
import styles from './page.module.css';

export default function ContactPage() {
  return (
    <PageFrame title="Contact">
      <div className={styles.content}>
        <p className={styles.tagline}>
          Open to remote work, full-time or contract. Reach out about a role, a project, or anything else.
        </p>
        <ul className={styles.list}>
          {contactMethods.map(m => (
            <li key={m.label} className={styles.item}>
              <a href={m.href} target="_blank" rel="noopener noreferrer" style={{ display: 'contents' }}>
                <div className={styles.icon}>{m.icon}</div>
                <div className={styles.text}>
                  <div className={styles.label}>{m.label}</div>
                  <div className={styles.value}>{m.value}</div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </PageFrame>
  );
}
```

- [ ] **Step 4: Visual check**

```bash
npm run dev
```
Open http://localhost:3000 → click "Contact" → see 4 contact methods. Click "Email" to verify mailto opens. Press ESC.

Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/content/contact.ts src/app/contact/page.tsx src/app/contact/page.module.css
git commit -m "feat: /contact page with 4 contact methods"
```

---

## Task 14: FooterCredit + CornerStatus

**Files:**
- Create: `src/components/FooterCredit.tsx`
- Create: `src/components/FooterCredit.module.css`
- Create: `src/components/CornerStatus.tsx`
- Create: `src/components/CornerStatus.module.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create `src/components/FooterCredit.module.css`**

```css
.credit {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--color-text-faint);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.95);
  z-index: 10;
  white-space: nowrap;
  pointer-events: none;
}
```

- [ ] **Step 2: Create `src/components/FooterCredit.tsx`**

```tsx
import styles from './FooterCredit.module.css';

export default function FooterCredit() {
  return (
    <div className={styles.credit}>
      Inspired by the main menu of The Last of Us — Naughty Dog
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/CornerStatus.module.css`**

```css
.status {
  position: fixed;
  bottom: 52px;
  right: 32px;
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(232, 220, 200, 0.75);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.95);
  z-index: 10;
}
```

- [ ] **Step 4: Create `src/components/CornerStatus.tsx`**

```tsx
import styles from './CornerStatus.module.css';

export default function CornerStatus() {
  return <div className={styles.status}>Compiling Skills: 100%</div>;
}
```

- [ ] **Step 5: Modify `src/app/layout.tsx` to mount them**

Update the layout to include both new components:

```tsx
import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import BackgroundVideo from '@/components/BackgroundVideo';
import FooterCredit from '@/components/FooterCredit';
import CornerStatus from '@/components/CornerStatus';
import './globals.css';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-josefin',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nathan Garrovillas — Full-Stack Engineer',
  description: 'Portfolio of Nathan Garrovillas, full-stack software engineer based in Bay Shore, NY.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={josefin.variable}>
      <body>
        <BackgroundVideo />
        {children}
        <CornerStatus />
        <FooterCredit />
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Visual check**

```bash
npm run dev
```
Open http://localhost:3000 → see "Inspired by the main menu of The Last of Us — Naughty Dog" at bottom center and "Compiling Skills: 100%" at bottom-right.

Stop the server.

- [ ] **Step 7: Commit**

```bash
git add src/components/FooterCredit.tsx src/components/FooterCredit.module.css src/components/CornerStatus.tsx src/components/CornerStatus.module.css src/app/layout.tsx
git commit -m "feat: FooterCredit attribution and CornerStatus easter egg"
```

---

## Task 15: Playwright route + navigation smoke tests

**Files:**
- Create: `tests/e2e/routes.spec.ts`
- Create: `tests/e2e/navigation.spec.ts`

- [ ] **Step 1: Create `tests/e2e/routes.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', heading: null, menuItem: 'Nathan Garrovillas' },
  { path: '/projects', heading: 'Projects' },
  { path: '/about', heading: 'About' },
  { path: '/resume', heading: 'Resume' },
  { path: '/contact', heading: 'Contact' },
];

for (const { path, heading, menuItem } of routes) {
  test(`route ${path} loads without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(path);
    await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/') + '$'));

    if (heading) {
      await expect(page.getByRole('heading', { name: new RegExp(heading, 'i') })).toBeVisible();
    } else if (menuItem) {
      await expect(page.getByText(menuItem)).toBeVisible();
    }

    expect(errors).toEqual([]);
  });
}
```

- [ ] **Step 2: Create `tests/e2e/navigation.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('clicking Projects from home navigates to /projects and dims background', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Projects', { exact: true }).click();
  await expect(page).toHaveURL(/\/projects$/);

  const bg = page.getByTestId('bg-container');
  await expect(bg).toHaveClass(/subpageActive/);
});

test('ESC key returns to home', async ({ page }) => {
  await page.goto('/about');
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/$/);
});

test('Project switcher updates detail panel without changing the route', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('heading', { name: /care circle/i })).toBeVisible();

  await page.getByText('JobLink Log', { exact: true }).click();
  await expect(page.getByRole('heading', { name: /joblink log/i })).toBeVisible();
  await expect(page).toHaveURL(/\/projects$/);
});

test('In-progress projects hide the View Live button', async ({ page }) => {
  await page.goto('/projects');
  await page.getByText('Prism', { exact: false }).click();
  await expect(page.getByRole('link', { name: /view live/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /github/i })).toBeVisible();
});
```

- [ ] **Step 3: Run e2e tests**

```bash
npm run test:e2e
```
Expected: all tests pass. Playwright will build and start the prod server automatically per the config.

If any test fails, read the trace via `npx playwright show-trace test-results/...zip` and fix the underlying component/page.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/
git commit -m "test(e2e): Playwright smoke tests for routes and navigation"
```

---

## Task 16: Responsive pass (mobile + tablet)

**Files:**
- Modify: `src/components/MainMenu.module.css`
- Modify: `src/components/PageFrame.module.css`
- Modify: `src/components/ProjectSwitcher.module.css`

- [ ] **Step 1: Add a mobile breakpoint to MainMenu**

Append to `src/components/MainMenu.module.css`:

```css
@media (max-width: 640px) {
  .menu { left: 24px; right: 24px; max-width: none; }
  .item { font-size: 13px; margin-bottom: 18px; letter-spacing: 3px; }
  .tagline { font-size: 11px; }
}
```

- [ ] **Step 2: Add a mobile breakpoint to PageFrame**

Append to `src/components/PageFrame.module.css`:

```css
@media (max-width: 640px) {
  .frame { padding: 40px 24px; }
  .title { font-size: 18px; letter-spacing: 3px; margin-bottom: 20px; }
}
```

- [ ] **Step 3: Stack the project switcher on mobile**

Append to `src/components/ProjectSwitcher.module.css`:

```css
@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; gap: 24px; }
  .detail { border-left: none; border-top: 1px solid var(--color-divider-strong); padding-left: 0; padding-top: 24px; }
  .image { height: 180px; }
}
```

- [ ] **Step 4: Manually verify in DevTools responsive mode**

```bash
npm run dev
```
Open http://localhost:3000 → DevTools → toggle device toolbar → check at 375px (iPhone SE), 768px (iPad), 1440px (desktop). All 5 routes should remain readable and not break.

Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/components/MainMenu.module.css src/components/PageFrame.module.css src/components/ProjectSwitcher.module.css
git commit -m "feat: responsive breakpoints for mobile and tablet"
```

---

## Task 17: Production build + Lighthouse check

**Files:** none (verification only)

- [ ] **Step 1: Run production build**

```bash
npm run build
```
Expected: build succeeds, prints route sizes. Each route should be small (< 100kB).

If TypeScript errors appear, fix them. If lint errors appear, fix them or override per-line.

- [ ] **Step 2: Start prod server**

```bash
npm run start
```

- [ ] **Step 3: Run Lighthouse**

Open http://localhost:3000 in Chrome → DevTools → Lighthouse → "Analyze page load" (Desktop). Record scores:

- Performance: target ≥ 85 (the video drags LCP — acceptable)
- Accessibility: target ≥ 95
- Best Practices: target ≥ 95
- SEO: target ≥ 90

If Performance < 85, check if the video is the culprit; consider lowering its CRF further or adding `preload="metadata"` to the `<video>` tag.

Stop the server (Ctrl+C).

- [ ] **Step 4: Run full test suite once more**

```bash
npm run test -- --run
npm run test:e2e
```
Both should pass.

- [ ] **Step 5: Commit any tweaks made to hit Lighthouse targets**

```bash
git add -A
git commit -m "perf: optimize for Lighthouse targets"
```
(Skip the commit if no changes.)

---

## Task 18: Push to GitHub + deploy to Vercel

**Files:** none (deployment)

- [ ] **Step 1: Create a public GitHub repo**

Go to https://github.com/new → name it `portfolio` (or `tlou-portfolio`) under the `nateboyo` account → Public → no template → Create.

- [ ] **Step 2: Push the local repo**

```bash
git remote add origin https://github.com/nateboyo/portfolio.git
git branch -M main
git push -u origin main
```

If the local branch is `master`, the `-M main` flag will rename it for the push.

- [ ] **Step 3: Import the repo into Vercel**

Go to https://vercel.com/new → Import the `portfolio` repo → Vercel auto-detects Next.js → keep defaults → Deploy.

First deploy takes ~2 minutes. When complete, Vercel gives a URL like `portfolio-nateboyo.vercel.app`.

- [ ] **Step 4: Smoke-check the deployed site**

Open the Vercel URL. Verify:
- Video plays in background
- All 5 menu items navigate correctly
- Dim transition fires on navigation
- ESC returns home
- Resume PDF downloads
- Project screenshots all load

- [ ] **Step 5: (Optional) Custom domain**

In Vercel → Project → Settings → Domains → add a domain (e.g. `nathangarrovillas.com` if owned). Follow DNS instructions.

- [ ] **Step 6: Update README with the live URL**

Create or modify `README.md`:

```markdown
# Nathan Garrovillas — Portfolio

A portfolio site inspired by the main menu of *The Last of Us*.

**Live:** https://portfolio-nateboyo.vercel.app

## Stack
- Next.js 14 (App Router)
- TypeScript (strict)
- CSS Modules
- Deployed to Vercel

## Local development
\`\`\`bash
npm install
npm run dev
\`\`\`

## Tests
\`\`\`bash
npm run test       # Vitest unit tests
npm run test:e2e   # Playwright e2e
\`\`\`
```

- [ ] **Step 7: Commit and push**

```bash
git add README.md
git commit -m "docs: add README with live URL and dev instructions"
git push
```

- [ ] **Step 8: Verify deploy succeeded after the push**

Vercel auto-redeploys on push. Wait 1–2 minutes, refresh the live URL, confirm the site still works.

---

## Done

The site is live, all routes work, tests pass, Lighthouse targets hit. From this point, future updates (new projects, content edits) are commits to `main` that Vercel auto-deploys.

### Post-launch checklist (not part of v1)

- Get the 2 in-progress project screenshots (Prism, Solace) when those projects ship and replace the `inProgress: true` flags with image paths in `src/content/projects.ts`.
- Add real GitHub URLs to each project entry as repos are made public.
- (Optional) Add a profile photo for the About page.
- (Optional) Wire up audio toggle if Nathan changes his mind on music.
- (Optional) Add a contact form via Formspree or Resend.
