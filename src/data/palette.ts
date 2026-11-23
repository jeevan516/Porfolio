/**
 * Shared JD accent palette: one vivid colour per bootcamp stage / project family.
 * The same values are used on the hub, portal and dashboards. The CSS variables live in index.css:
 *   --c-<key>       vivid fill (dots, rules, borders, glows; text on it is navy ink #0f1b2d)
 *   --c-<key>-text  text-safe shade (AA on the page and card surfaces, per theme)
 */
import type { Project } from '../types';

export type PaletteKey = 'python' | 'api' | 'data' | 'ml' | 'mlops' | 'tools';

export interface Swatch {
  key: PaletteKey;
  /** vivid fill, for shapes only */
  fill: string;
  /** readable text colour in the current theme */
  text: string;
}

const swatch = (key: PaletteKey): Swatch => ({ key, fill: `var(--c-${key})`, text: `var(--c-${key}-text)` });

export const STAGE_SWATCH: Record<string, Swatch> = {
  'Python foundations': swatch('python'),
  'APIs & cloud': swatch('api'),
  'Data engineering': swatch('data'),
  'Machine learning': swatch('ml'),
  'MLOps & deployment': swatch('mlops'),
  'Tools & agents': swatch('tools'),
};

export const stageSwatch = (stage: string): Swatch => STAGE_SWATCH[stage] ?? swatch('mlops');

/** Colour for a project card outside the bootcamp: personal tools are pink, the rest follow their category. */
export const projectSwatch = (p: Pick<Project, 'category' | 'status'>): Swatch => {
  if (p.status === 'Personal Project') return swatch('tools');
  switch (p.category) {
    case 'ai-ml':
      return swatch('ml');
    case 'data-eng':
      return swatch('data');
    case 'observability':
      return swatch('python');
    default:
      return swatch('api');
  }
};

/** Soft tint of a swatch colour for backgrounds (keeps text on top readable). */
export const tint = (fill: string, pct = 14) => `color-mix(in srgb, ${fill} ${pct}%, transparent)`;
