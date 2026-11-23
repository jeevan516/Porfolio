# Jeevan Dutta: portfolio

My personal portfolio site: projects, skills, CV and the "My bootcamp journey" section with my
neuefische bootcamp projects. Built with React 19, TypeScript, Vite and Tailwind CSS.

**Live:** https://jeevan516.github.io/jeevan-Dutta/

## Run it

```bash
npm ci --legacy-peer-deps   # install
npm run dev                 # dev server (server.ts + Vite) on http://localhost:3000
npm run lint                # type check (tsc --noEmit)
npm run build               # production build into dist/
npm run preview             # serve the built site locally
```

## Where the content comes from

- `src/data/portfolioData.ts`: hand-written project cards, skills and profile
  (see [ADDING_PROJECTS.md](ADDING_PROJECTS.md)).
- `src/data/journey.generated.json`: **generated, do not edit by hand.** It is written by
  `~/Projects/project-notes/export_portfolio.py` (run by `collect.py`) from each project's
  notes and `run-info/<project>.json` "portfolio" block, together with the decks in
  `public/decks/`. `src/data/journey.ts` merges it into the project cards.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) runs the type check and build on every pull
request, and deploys `dist/` to GitHub Pages on every push to `main`. `dist/server.js` is
removed before upload, so only the static site is published.
