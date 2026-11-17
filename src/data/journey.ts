/**
 * neuefische bootcamp projects, generated from ~/Projects/project-notes (export_portfolio.py).
 *
 * journey.generated.json is rewritten automatically whenever a project's notes are collected;
 * do not edit it by hand. Edit the project's run-info/<project>.json "portfolio" block instead.
 */
import journeyData from './journey.generated.json';
import type { Project, ProjectLink } from '../types';

export interface JourneyProject {
  id: string;
  folder: string;
  title: string;
  stage: string;
  category: Project['category'];
  startDate: string | null;
  headline: string;
  description: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  githubUrl: string | null;
  deckUrl: string | null;
  liveUrl: string | null;
}

export const JOURNEY = journeyData as { stages: string[]; projects: JourneyProject[] };

/** Hand-written cards in portfolioData.ts that already cover a bootcamp project folder. */
export const CURATED_CARD_FOR_FOLDER: Record<string, string> = {
  'mle-refactoring-project': 'nf-king-county-refactoring',
  'model-review-board': 'nf-model-review-board',
  'Batch-and-Stream-processing': 'nf-batch-stream-pipeline',
  docker: 'nf-fastapi-docker',
  'Data-pipeline-and-modelling': 'nf-nyc-taxi-pipeline',
  'datapipeline-with-dbt': 'nf-dbt-pipeline',
  'Unit-integration-testing': 'nf-testing',
  Opps: 'nf-clean-code-oop',
  'web-service-deployment': 'nf-gcp-deployment',
};

const slides = (j: JourneyProject): ProjectLink[] => (j.deckUrl ? [{ label: 'Slides', url: j.deckUrl }] : []);

/** A project card for a bootcamp project that has no hand-written card yet. */
const toCard = (j: JourneyProject): Project => ({
  id: j.id,
  title: j.title,
  tagline: `neuefische project · ${j.stage}`,
  description: j.description,
  category: j.category,
  tags: j.stack,
  impact: j.headline,
  metrics: j.metrics,
  githubUrl: j.githubUrl ?? undefined,
  liveUrl: j.liveUrl ?? undefined,
  docs: slides(j),
  featured: false,
  status: 'neuefische Course Project',
  viewsCount: 0,
});

const isPrivateRepoLink = (url: string, j: JourneyProject) =>
  !j.githubUrl && url.toLowerCase().includes(`github.com/jeevan516/${j.folder.toLowerCase()}`);

/**
 * Merge the generated bootcamp projects into the hand-written list:
 * - new bootcamp projects become cards, newest first, right after `afterId`;
 * - hand-written bootcamp cards get the generated deck, and lose links to private repos
 *   (a private repo would show visitors a 404).
 */
export const withJourneyProjects = (curated: Project[], afterId: string): Project[] => {
  const byCardId = new Map(
    JOURNEY.projects
      .filter((j) => CURATED_CARD_FOR_FOLDER[j.folder])
      .map((j) => [CURATED_CARD_FOR_FOLDER[j.folder], j] as const),
  );
  const updated = curated.map((card) => {
    const j = byCardId.get(card.id);
    if (!j) return card;
    const docs = (card.docs ?? []).filter((d) => !isPrivateRepoLink(d.url, j));
    if (!docs.some((d) => d.label === 'Slides')) docs.push(...slides(j));
    return { ...card, githubUrl: j.githubUrl ?? undefined, docs };
  });
  const generated = JOURNEY.projects
    .filter((j) => !CURATED_CARD_FOR_FOLDER[j.folder])
    .sort((a, b) => (b.startDate ?? '').localeCompare(a.startDate ?? ''))
    .map(toCard);
  const at = updated.findIndex((p) => p.id === afterId) + 1;
  return [...updated.slice(0, at), ...generated, ...updated.slice(at)];
};
