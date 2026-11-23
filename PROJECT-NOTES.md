# Personal Portfolio Website: project notes

_Last updated: 23 Nov 2026_

## Project
**Personal Portfolio Website.** Recruiters need one place to see my projects, experience and
certifications. The goal was a single-page portfolio that is easy to update when a project
finishes and deploys itself on every push.

- **Content:** `src/data/portfolioData.ts`: profile, master thesis, projects, skills,
  certifications, education, experience; screenshots under `public/projects/`.
- **Design:** the shared JD design system (`src/styles/jd.css`, copied from `project-notes/design/`):
  navy ink, amber and teal; Plus Jakarta Sans, Source Serif 4, JetBrains Mono; light and dark themes.
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
6. **Bootcamp journey** (17 Nov): generated from `project-notes`; voice interviewer and video pitch removed;
   one panel lists every slide deck.
7. **JD design system redesign** (22-23 Nov): replaced the neon emerald/cyan-on-black look with the
   shared JD tokens. Tailwind 4 theme colours map to `--jd-*` tokens (`bg-surface`, `text-muted`,
   `bg-accent`, `text-accent-fg` ...), so components carry no palette colours or hex values and follow
   the theme; the theme follows the OS and the sun/moon toggle sets `<html data-theme>`.
   UX fixes from a desktop/phone audit: the hero is one message (name once, value line, location,
   one primary CTA "Bootcamp projects & slides", Download CV / Get in touch, four headline facts with
   count-up); the VLSI/LSTM/IoT visualisations and thesis facts moved to a new "From silicon to the
   factory floor" section; the role filter moved directly above Projects and Skills; "My bootcamp
   journey" has stage headers, three-column cards with readable titles, metric tiles, equal
   Slides/Source buttons and a tool filter row. Accessibility: skip link to `#main`, one h1 and ordered
   headings, visible focus, 40 px touch targets, no text under 12 px, no horizontal scroll at 390 px.
   Motion kept and recoloured (aurora backdrop, mesh canvas, section reveals, card hover lift, filter
   layout animations); everything calms down under `prefers-reduced-motion`.
8. **Problem -> solution -> result template** (23 Nov): every project card (bootcamp journey and Projects)
   shows a three-step case rail (`src/components/ui/CaseSteps.tsx`) from `src/data/projectCases.ts`:
   one-sentence problem and solution per project id (bootcamp copy from each project's notes, other
   projects only from facts already on their cards); the result is the generated headline or the card's
   impact, left out where nothing was measured. The long description moved behind "More detail".
   Template and motion pass (layout patterns studied on a reference portfolio, no content copied): the
   section links highlight the section in view (scroll-spy, `aria-current`), an aurora reading-progress
   hairline under the header, larger section headings with one spacing rhythm, staggered card and step
   reveals, button press and arrow micro-interactions; all calm under `prefers-reduced-motion`.
   Fixed: on phones the Projects section never appeared (`Reveal` waited for 8% of a section taller
   than 12 screens); it now uses a fixed pixel margin.
9. **Build and deploy:** a workflow runs `npm ci`, `npm audit --audit-level=high`, a type check
   and the build, then deploys `dist/` to GitHub Pages from `main`.

## Results
| Check | Result |
|---|---|
| Live site | https://jeevan516.github.io/jeevan-Dutta/ (GitHub Pages; repo renamed from Porfolio) |
| Project cards | **28**: 19 hand-written + 9 generated bootcamp projects; all 18 bootcamp projects in "My bootcamp journey" |
| Bootcamp journey | 19 projects in 5 stages, 19 slide decks served from `public/decks/`, all listed in one download panel (click "Slide decks"); built from `project-notes` run-info, updates automatically |
| Links to private repos | **0** (were on some cards before: GitHub returned 404 to visitors); public bootcamp repos get a GitHub link, e.g. github-actions-and-cicd since 22 Nov |
| Security | production CSP meta tag; `server.js` no longer deployed; all new-tab links `rel=noopener` |
| Certifications listed | 21 |
| React components | 25 in `src/components/` (+ `ui/CountUp`, `ui/Reveal`, `ui/SpotlightCard`) |
| Screenshots | 1 project so far (Batch & Stream, 4 WebP images) |
| CI "Build & Deploy" | last 4 runs passed (31 Oct–3 Nov); first 4 failed. The 31 Oct failure was "Get Pages site failed: Not Found" (Pages not yet enabled) |
| Automated tests | none; CI checks security audit, type check and build only |
| Case-study template (23 Nov) | every project card and all 19 journey cards show problem -> solution (-> result); `npm run lint` and `npm run build` pass; Playwright 1440 and 390 px, light and dark: no horizontal scroll; reduced motion: all steps visible |
| Redesign checks (23 Nov) | `npm run lint` and `npm run build` pass; Playwright at 1440x900, 390x844 and 360 px, light and dark: `scrollWidth == innerWidth`; showcase view:, 1 h1, no heading-level jumps, 0 images without alt, 0 visible text under 12 px, 0 buttons/links under 32 px (phone) |

## Future engineering
- Screenshots for the generated bootcamp cards (the journey shows metrics and slides already).
- Add screenshots for the other neuefische projects (only one has images).
- Add tests: a type-safe data check for `PROJECTS_DATA` and a few component tests (Vitest).
- GitHub Pages serves only static files: confirm which features need the Express server
  (Gemini news, visitor tracker, GitHub sync) and host it or remove those calls.
- Visitor numbers come from a committed file (`data/visitor-stats.json`), not live analytics; switch to a real analytics source.
- Rename the package from `react-example`.
- Lighthouse check for performance and accessibility in CI.
- The Projects section is still one long grid; group it (work, research, personal, bootcamp) and finish moving
  older sections to `.jd-*` components.
- German versions of the problem/solution lines (they are English only, like the card descriptions; under the German UI they carry `lang="en"` so screen readers pronounce them correctly).
- Confirm the WaDaCon result figures shown on three cards (-60% response time, 99.99% availability at 50k+ req/s, wear predicted up to 72 h ahead); no project notes cover them.
- The Classic and Pipeline views were recoloured with the tokens but not redesigned.

## Update log
- 8 Oct 2026: repository created; project structure and base app.
- 11 Oct 2026: career visualization added.
- 31 Oct 2026: chatbot update; neuefische bootcamp details and projects; UI and security fixes;
  contact form with confirmation email; cleaner showcase layout. Deploy passes from here on.
- 3 Nov 2026: ProjectGallery for full-screen screenshots.
- 15 Nov 2026: project notes created.
- 16 Nov 2026: presentation deck added: presentation/portfolio-website.pptx (9 slides).
- 17 Nov 2026: removed the voice interviewer (VideoPortfolioSection and avatar components); added "My bootcamp journey" (5 stages, 18 projects, skills chart, filters, animations) generated automatically from project-notes; 9 new bootcamp cards; private-repo links removed; CSP for production builds; server.js kept off GitHub Pages.
- 17 Nov 2026: web-service-deployment deck updated with the real GCP results; leftover video-pitch text and styles removed; "Slide decks" tile opens a list of all 18 decks; slide buttons labelled ".pptx"; hero button "Bootcamp projects & slides".
- 18-22 Nov 2026: model-deployment-project deck updated three times (redesign, 'more time' answers, data-rule count fix; PRs #5-#7); new bootcamp project card and deck for github-actions-and-cicd (19 projects in the journey).
- 22 Nov 2026: github-actions-and-cicd card now links its GitHub repo (repo made public) and serves the updated deck (5517f83).
- 22-23 Nov 2026: redesigned with the JD design system (navy/amber/teal, light + dark), decluttered hero, research visuals section, scannable bootcamp journey, accessibility fixes (skip link, focus, 40 px targets, min 12 px text, no 390 px overflow), recoloured animations that respect reduced motion.
- 23 Nov 2026: problem -> solution -> result on every project card; scroll-spy section nav, reading progress, heading rhythm and staggered reveals; fixed the Projects section staying invisible on phones.
- 23 Nov 2026: review fixes: model-deployment solution names the served HistGradientBoosting model instead of calling it the winner; four cards whose impact is not a measurement no longer show a Result line; case rail marked lang="en" in German mode.
