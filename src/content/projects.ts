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
