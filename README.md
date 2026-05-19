<div align="center">

# AgencyOS

**A frontend agency management platform built to solve a real problem.**

Track client projects · Audit Core Web Vitals · Showcase your component library · Generate performance reports

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=flat-square&logo=reactrouter)](https://reactrouter.com)
[![Zustand](https://img.shields.io/badge/Zustand-4.5-orange?style=flat-square)](https://zustand-demo.pmnd.rs)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-22B5BF?style=flat-square)](https://recharts.org)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## The Problem This Solves

After shipping 20+ client websites, tracking everything in spreadsheets and group chats became unsustainable. There was no single place to see project statuses, no way to quickly audit a client's Core Web Vitals, and no internal component library to reference when starting new work.

AgencyOS is the tool that should have existed. Built from real agency pain, not a tutorial.

---

## What's Inside

### Overview Dashboard
A live snapshot of the entire agency, active projects, client count, in-progress builds, and average performance scores. Includes a 6-month performance trend chart showing how Lighthouse scores have improved across the portfolio.

### Project Board
Full project management with two views:

- **List view** — sortable table with status, priority, progress bars, due dates, and live URL links
- **Kanban view** — drag-friendly column layout across Planned → In Progress → Live → Paused

Add projects via a modal form with full validation. All data persists across sessions via Zustand + localStorage.

### Client Directory
A card-based directory of all agency clients showing industry, contact, project count, and live project count. Add new clients with a single modal. Each card shows at-a-glance relationship health.

### Core Web Vitals Auditor
The standout feature. Enter any live public URL and get a real Lighthouse audit powered by the Google PageSpeed Insights API, no backend required.

Returns:
- Performance, Accessibility, Best Practices, and SEO scores for both **mobile and desktop**
- LCP, FCP, CLS, TTFB, and TBT metrics with pass/fail thresholds
- A radar chart showing the full score breakdown
- Top 6 improvement opportunities ranked by severity
- Full audit history persisted locally

Every score is colour-coded against Google's Good / Needs Improvement / Poor thresholds so the result is instantly readable.

### Component Library
A living reference of every reusable UI primitive in the codebase, interactive, copy-pasteable, and documented with code snippets. Buttons, badges, status indicators, score rings, progress bars, inputs, toggles, toasts, cards, and avatar groups. Built to prove UI architecture depth, not just visual skill.

### Performance Reports
Auto-generated per-client performance reports aggregated from live project data. Includes a bar chart of all scored projects, per-client average scores, Core Web Vitals breakdowns, and a full audit log table.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| UI Framework | React 18 | Industry standard, hooks-first |
| Routing | React Router v6 | Nested layouts, declarative routes |
| State Management | Zustand + persist middleware | Lightweight, no boilerplate, localStorage sync |
| Data Visualisation | Recharts | Composable, responsive, React-native |
| Icons | Lucide React | Consistent, tree-shakeable |
| API Integration | Google PageSpeed Insights v5 | Free, real data, no backend needed |
| Styling | CSS Modules (custom) | No utility class bloat, full design token system |
| Typography | Syne (display) + DM Sans (body) | Professional, modern pairing |

---

## Architecture Decisions

**CSS custom properties as a design token system** — every colour, spacing unit, radius, and font is defined once in `:root` and consumed everywhere. Changing the theme is one file edit.

**Zustand over Redux** — the app has shared state across 6 pages but doesn't need Redux's overhead. Zustand's `persist` middleware handles localStorage sync in 3 lines.

**Sequential API requests over parallel** — the PageSpeed API rate-limits burst requests. Mobile audits first, 1s delay, then desktop. Eliminates the most common failure mode without requiring an API key.

**Component co-location** — every component owns its CSS file. No global stylesheet growing unboundedly. Styles travel with the component.

**Single source of truth for UI primitives** — `UIComponents.jsx` exports every reusable primitive. Pages import from one place. No duplicated button styles across 6 files.

---

## Project Structure

```
agency-os/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx                        # Root — router + layout wiring
│   ├── index.js                       # Entry point
│   ├── index.css                      # Design tokens + global reset
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx/.css     # Shell — sidebar + topbar + outlet
│   │   │   ├── Sidebar.jsx/.css       # Nav links, mobile drawer, user info
│   │   │   └── TopBar.jsx/.css        # Page title, hamburger, notifications
│   │   └── ui/
│   │       └── UIComponents.jsx/.css  # All reusable primitives
│   │
│   ├── pages/
│   │   ├── Overview.jsx/.css          # Dashboard with charts
│   │   ├── Projects.jsx/.css          # List + kanban board
│   │   ├── Clients.jsx/.css           # Client directory
│   │   ├── Audit.jsx/.css             # Core Web Vitals auditor
│   │   ├── ComponentsShowcase.jsx/.css # UI component library
│   │   └── Reports.jsx/.css           # Performance reports
│   │
│   ├── hooks/
│   │   └── usePageSpeedAudit.js       # PageSpeed API — fetch, parse, error handling
│   │
│   ├── store/
│   │   └── useAppStore.js             # Zustand store — projects, clients, audits
│   │
│   ├── data/
│   │   └── mockData.js                # Seed data — real client names and metrics
│   │
│   └── utils/
│       └── helpers.js                 # Date formatting, score colours, metric thresholds
└── package.json
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/agency-os.git
cd agency-os

# Install dependencies
npm install

# Start dev server
npm start
# → http://localhost:3000
```

### Optional: Enable the PageSpeed Auditor

The auditor works without a key but is rate-limited. For unlimited audits:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → **APIs & Services → Library** → enable **PageSpeed Insights API**
3. **Credentials → Create Credentials → API Key**
4. Paste the key into `src/hooks/usePageSpeedAudit.js`:

```js
const API_KEY = 'AIzaSy...'; // your key here
```

For production (Vercel), store it as an environment variable instead:

```bash
# .env.local
REACT_APP_PAGESPEED_KEY=AIzaSy...
```

```js
// usePageSpeedAudit.js
const API_KEY = process.env.REACT_APP_PAGESPEED_KEY || '';
```

---

## Roadmap

AgencyOS v1 is a fully functional single-user React application. The roadmap below outlines the planned evolution into a multi-tenant SaaS platform.

### v1.0 — Current (Complete)
- [x] Overview dashboard with performance trend chart
- [x] Project board with list and kanban views
- [x] Client directory with project linking
- [x] Real Core Web Vitals auditor via PageSpeed Insights API
- [x] Interactive UI component library showcase
- [x] Per-client performance reports with data visualisation
- [x] Fully responsive across mobile, tablet, and desktop
- [x] Persistent state via Zustand + localStorage
- [x] Design token system with dark theme

### v2.0 — Multi-Tenant SaaS (In Planning)
- [ ] User authentication — email/password + Google OAuth (Supabase Auth)
- [ ] Role-based onboarding — Frontend Developer, Data Analyst, Product Manager, Designer, and other tech roles
- [ ] Personal dashboard scoped to logged-in user
- [ ] Cloud database replacing localStorage (Supabase Postgres)
- [ ] Per-user data isolation — row-level security so users only see their own data
- [ ] Team workspaces — invite collaborators to a shared agency account

### v2.1 — Notifications & Automation
- [ ] Deadline notifications — email alerts 7 days, 3 days, and 1 day before due dates
- [ ] Scheduled audit runs — automatic weekly Core Web Vitals checks on saved client URLs
- [ ] Audit regression alerts — email when a score drops below a threshold
- [ ] Weekly digest — performance summary email every Monday

### v2.2 — Reporting & Export
- [ ] PDF report export per client
- [ ] Shareable audit links — send a read-only report URL to a client
- [ ] CSV export for project and audit data
- [ ] Client-facing portal — a white-labelled view clients can log in to

### v3.0 — Platform
- [ ] Public profiles — share your agency portfolio publicly
- [ ] Component library publishing — export your component showcase as a standalone page
- [ ] Billing and subscriptions (Stripe) for team and agency tiers
- [ ] API — headless access to your project and audit data

---

## Screenshots

<img src="/.github/screenshots/screenshot-dashboard.png" width="49%" /> <img src="/.github/screenshots/screenshot-projects.png" width="49%" />
<img src="/.github/screenshots/screenshot-audit.png" width="49%" /> <img src="/.github/screenshots/screenshot-components.png" width="49%" />
<img src="/.github/screenshots/screenshot-reports.png" width="49%" />

---

## Author

**Eniola Omoniyi** — Frontend Engineer

Specialising in React, performance optimisation, and pixel-precise UI. Built AgencyOS to solve a real problem experienced across 20+ client projects.

[Portfolio](#) · [LinkedIn](#) · [GitHub](#)

---

## License

MIT — feel free to use this project as inspiration for your own tools.

---

<div align="center">
  <sub>Built with a real problem in mind. Not a tutorial project.</sub>
</div>