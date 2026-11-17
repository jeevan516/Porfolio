# Adding a finished project to the portfolio

## Automatic: neuefische bootcamp projects

Bootcamp projects need no manual step. When a project's notes are collected
(`cd ~/Projects/project-notes && python3 collect.py`), its `run-info/<project>.json` "portfolio"
block becomes an entry in `src/data/journey.generated.json` and its deck is copied to
`public/decks/`. The project then shows up in "My bootcamp journey" and as a project card.
Commit those changes on a branch and merge the PR to publish.

## Manual: hand-written cards with screenshots

Do this every time a project in the Projects folder is finished (on Windows or the Mac).

## 1. Screenshots → `public/projects/<project-id>/`

- 2–4 images that show the project working: the running app or dashboard first (it becomes the card thumbnail), then architecture, monitoring, results.
- Save them as **WebP, ~1400 px wide, under ~100 KB each**. Any converter works; with Node and sharp:

  ```bash
  node -e "require('sharp')('shot.png').resize({width:1400}).webp({quality:80}).toFile('public/projects/<project-id>/dashboard.webp')"
  ```

- Dark screenshots suit the site best as the thumbnail.

## 2. Entry → `src/data/portfolioData.ts` (`PROJECTS_DATA`)

```ts
{
  id: 'nf-my-project',                       // also the folder name in public/projects/
  title: 'Short, concrete title',
  tagline: 'neuefische project · what it is about',
  description: 'What it does and how, in 2–3 sentences.',
  category: 'data-eng',                      // 'ai-ml' | 'it-devops' | 'observability' | 'data-eng'
  tags: ['Python', 'Docker'],
  impact: 'One measurable result.',
  metrics: [{ label: 'Tests', value: '23 · CI' }],          // optional, 2–4 items
  githubUrl: 'https://github.com/jeevan516/<repo>',
  images: [                                                  // optional; first = thumbnail
    { src: 'projects/nf-my-project/dashboard.webp', alt: 'What the image shows', caption: 'Dashboard' },
  ],
  docs: [                                                    // optional: slides, write-ups
    { label: 'Slides', url: 'https://github.com/jeevan516/<repo>/blob/main/docs/<deck>.pptx' },
  ],
  featured: true,
  status: 'neuefische Course Project',
  viewsCount: 0,
},
```

Put new, strong projects near the top; the first cards are what visitors see.

## 3. Check and publish

```bash
npm run lint        # type check
npm run build       # must succeed
git add -A
git commit -m "Add <project> to portfolio"
git push origin main  # GitHub Actions builds and deploys to GitHub Pages
```

Example: the `nf-batch-stream-pipeline` entry (Batch & Stream Processing Pipeline).
