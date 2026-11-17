# Portfolio (React + Vite, deployed to GitHub Pages)

**neuefische bootcamp projects are added automatically.** `~/Projects/project-notes/collect.py`
(run whenever project notes change) writes `src/data/journey.generated.json` and the decks in
`public/decks/`. They feed the "My bootcamp journey" section (`src/components/NeuefischeJourney.tsx`)
and the project cards (`src/data/journey.ts` merges them into `PROJECTS_DATA`). Never edit the
generated file by hand: change the project's `run-info/<project>.json` "portfolio" block instead.
When those files change: branch, `npm run lint`, `npm run build`, commit, open a PR. The user merges;
a push to `main` deploys the site.

Hand-written cards (other work, or a bootcamp project that deserves screenshots) still follow
[ADDING_PROJECTS.md](ADDING_PROJECTS.md).

Security: the production build adds a Content-Security-Policy meta tag (vite.config.ts); keep new
external resources out, or add them to the policy deliberately. `dist/server.js` is not deployed.
