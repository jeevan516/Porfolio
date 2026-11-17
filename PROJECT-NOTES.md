# Personal Portfolio Website: project notes

_Last updated: 17 Nov 2026_

## Project
**Personal Portfolio Website.** Recruiters need one place to see my projects, experience and
certifications. The goal was a single-page portfolio that is easy to update when a project
finishes and deploys itself on every push.

- **Content:** `src/data/portfolioData.ts`: profile, master thesis, projects, skills,
  certifications, education, experience; screenshots under `public/projects/`.
- **Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, Recharts, Framer Motion;
  an Express server (`server.ts`) with a Gemini proxy for local/AI Studio use;
  GitHub Actions → GitHub Pages.

## Approach
1. **Base app** (8 Oct): project structure and React + Vite app.
2. **Career view** (11 Oct): career visualization (career trajectory chart).
3. **neuefische projects** (31 Oct): added the bootcamp projects, fixed buttons, UI polish and
   security fixes; updated the chatbot; cleaner contact form with a sender confirmation email.
4. **Gallery** (3 Nov): `ProjectGallery` component for full-screen screenshots with navigation.
5. **Repeatable updates:** `ADDING_PROJECTS.md` defines the steps (WebP screenshots, a
   `PROJECTS_DATA` entry, `npm run lint`, `npm run build`, push).
6. **Build and deploy:** a workflow runs `npm ci`, `npm audit --audit-level=high`, a type check
   and the build, then deploys `dist/` to GitHub Pages from `main`.

## Results
| Check | Result |
|---|---|
| Live site | https://jeevan516.github.io/Porfolio/ (GitHub Pages) |
| Project cards | **28**: 19 hand-written + 9 generated bootcamp projects; all 18 bootcamp projects in "My bootcamp journey" |
| Bootcamp journey | 18 projects in 5 stages, 18 slide decks served from `public/decks/`; built from `project-notes` run-info, updates automatically |
| Links to private repos | **0** (were on some cards before: GitHub returned 404 to visitors) |
| Security | production CSP meta tag; `server.js` no longer deployed; all new-tab links `rel=noopener` |
| Certifications listed | 21 |
| React components | 22 in `src/components/` |
| Screenshots | 1 project so far (Batch & Stream, 4 WebP images) |
| CI "Build & Deploy" | last 4 runs passed (31 Oct–3 Nov); first 4 failed. The 31 Oct failure was "Get Pages site failed: Not Found" (Pages not yet enabled) |
| Automated tests | none; CI checks security audit, type check and build only |

## Future engineering
- Screenshots for the generated bootcamp cards (the journey shows metrics and slides already).
- Add screenshots for the other neuefische projects (only one has images).
- Add tests: a type-safe data check for `PROJECTS_DATA` and a few component tests (Vitest).
- GitHub Pages serves only static files: confirm which features need the Express server
  (Gemini news, visitor tracker, GitHub sync) and host it or remove those calls.
- Visitor numbers come from a committed file (`data/visitor-stats.json`), not live analytics; switch to a real analytics source.
- Rename the package from `react-example` and fix the repo name spelling ("Porfolio").
- Lighthouse check for performance and accessibility in CI.

## Update log
- 8 Oct 2026: repository created; project structure and base app.
- 11 Oct 2026: career visualization added.
- 31 Oct 2026: chatbot update; neuefische bootcamp details and projects; UI and security fixes;
  contact form with confirmation email; cleaner showcase layout. Deploy passes from here on.
- 3 Nov 2026: ProjectGallery for full-screen screenshots.
- 15 Nov 2026: project notes created.
- 16 Nov 2026: presentation deck added: presentation/portfolio-website.pptx (9 slides).
- 17 Nov 2026: removed the voice interviewer (VideoPortfolioSection and avatar components); added "My bootcamp journey" (5 stages, 18 projects, skills chart, filters, animations) generated automatically from project-notes; 9 new bootcamp cards; private-repo links removed; CSP for production builds; server.js kept off GitHub Pages.
