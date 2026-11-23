import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { TargetRole } from '../types';
import { PROJECTS_DATA, PERSONAL_INFO } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';
import { SpotlightCard } from './ui/SpotlightCard';
import { playTactileClick } from '../services/soundFx';
import { Github, ExternalLink, Layers, TrendingUp, ArrowRight, FileText, Images, ChevronDown } from 'lucide-react';
import type { Project } from '../types';
import { ProjectGallery, assetUrl } from './ProjectGallery';
import { JOURNEY, CURATED_CARD_FOR_FOLDER } from '../data/journey';
import { projectSwatch, stageSwatch, tint, type Swatch } from '../data/palette';
import { caseForProject } from '../data/projectCases';
import { CaseSteps } from './ui/CaseSteps';

/** Bootcamp cards take their stage colour; every other card its family colour. */
const STAGE_BY_CARD_ID = new Map<string, string>(
  JOURNEY.projects.map((j) => [CURATED_CARD_FOR_FOLDER[j.folder] ?? j.id, j.stage] as const),
);
const cardSwatch = (p: Project): Swatch => {
  const stage = STAGE_BY_CARD_ID.get(p.id);
  return stage ? stageSwatch(stage) : projectSwatch(p);
};

interface ProjectsSectionProps {
  activeRole: TargetRole;
  language?: 'en' | 'de';
  onSelectProjectForTrack?: (projectId: string) => void;
}

/** Turn links to this same site (e.g. ".../jeevan-Dutta/#master-thesis") into in-page anchors. */
const resolveLiveUrl = (url?: string): { href: string; internal: boolean } | null => {
  if (!url) return null;
  if (url.startsWith(PERSONAL_INFO.githubPages) && url.includes('#')) {
    return { href: url.slice(url.indexOf('#')), internal: true };
  }
  return { href: url, internal: false };
};

/** Shorter display labels for long status strings. */
const statusLabel = (status: string, isDe: boolean) => {
  if (status.startsWith('Production')) return isDe ? 'Produktiv · WaDaCon' : 'Production · WaDaCon';
  if (status === 'neuefische Course Project') return isDe ? 'neuefische · Kursprojekt' : 'neuefische · Course project';
  if (status === 'Personal Project') return isDe ? 'Eigenes Projekt' : 'Personal project';
  if (status.startsWith('Defended')) return isDe ? 'Verteidigt · TU Clausthal' : 'Defended · TU Clausthal';
  return status;
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ activeRole, language = 'en' }) => {
  const t = TRANSLATIONS[language]?.projects || TRANSLATIONS.en.projects;
  const isDe = language === 'de';
  const reduce = !!useReducedMotion();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [gallery, setGallery] = useState<{ project: Project; index: number } | null>(null);

  const categories = [
    { id: 'all', label: t.filterAll },
    { id: 'neuefische', label: 'neuefische Bootcamp' },
    { id: 'personal', label: isDe ? 'Eigene Projekte' : 'Personal projects' },
    { id: 'it-devops', label: t.filterDevops },
    { id: 'observability', label: t.filterObs },
    { id: 'ai-ml', label: t.filterAi },
    { id: 'data-eng', label: t.filterData },
  ];

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (activeRole !== 'all' && p.category !== activeRole) return false;
    if (selectedCategory === 'neuefische') return p.status === 'neuefische Course Project';
    if (selectedCategory === 'personal') return p.status === 'Personal Project';
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <section id="projects" className="py-20 sm:py-28 border-t border-line/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-accent-fg font-semibold uppercase tracking-wider mb-3">
              <Layers className="w-4 h-4" aria-hidden="true" />
              {t.tag}
            </div>
            <h2 className="section-title text-4xl sm:text-6xl font-display font-bold text-fg">{t.title}</h2>
            <p className="section-lead text-muted text-base sm:text-lg mt-4 leading-relaxed">{t.desc}</p>
          </div>

          {/* Category Filter Chips */}
          <div
            role="tablist"
            aria-label={isDe ? 'Projekte filtern' : 'Filter projects'}
            className="flex flex-wrap items-center gap-1 p-1 bg-surface/80 border border-line rounded-xl"
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    playTactileClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 ${
                    active ? 'text-fg' : 'text-muted hover:text-fg'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="activeProjectCategory"
                      className="absolute inset-0 bg-surface-2 border border-line-strong rounded-lg"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              const live = resolveLiveUrl(project.liveUrl);
              const sw = cardSwatch(project);
              const cs = caseForProject(project);
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5, delay: reduce ? 0 : (idx % 3) * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <SpotlightCard
                    id={`project-card-${project.id}`}
                    spotlightColor={tint(sw.fill, 16)}
                    className="accent-card h-full p-6 hover:-translate-y-1"
                    style={{ '--card-c': sw.fill } as React.CSSProperties}
                  >
                    <div className="space-y-4">
                      {project.images && project.images.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            playTactileClick();
                            setGallery({ project, index: 0 });
                          }}
                          aria-label={`${isDe ? 'Screenshots ansehen' : 'View screenshots'}: ${project.title}`}
                          className="group relative block w-full aspect-[16/10] overflow-hidden rounded-xl border border-line bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60"
                        >
                          <img
                            src={assetUrl(project.images[0].src)}
                            alt={project.images[0].alt}
                            loading="lazy"
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono bg-bg/85 text-fg border border-line-strong">
                            <Images className="w-3 h-3" aria-hidden="true" />
                            {project.images.length} {isDe ? 'Bilder' : project.images.length === 1 ? 'screenshot' : 'screenshots'}
                          </span>
                        </button>
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded-full border"
                          style={{ color: sw.text, background: tint(sw.fill, 12), borderColor: tint(sw.fill, 40) }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: sw.fill }} aria-hidden="true" />
                          {statusLabel(project.status, isDe)}
                        </span>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} on GitHub`}
                            title="GitHub"
                            className="inline-flex items-center justify-center w-10 h-10 -m-1.5 text-muted hover:text-fg transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold font-display text-fg leading-snug">{project.title}</h3>
                        <p className="text-xs text-muted mt-1">{project.tagline}</p>
                      </div>

                      {cs ? (
                        <>
                          <CaseSteps data={cs} fill={sw.fill} text={sw.text} isDe={isDe} compact />
                          <details className="case-more group/more">
                            <summary className="case-more__summary inline-flex items-center gap-1.5 min-h-10 text-sm font-semibold text-fg cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60">
                              <ChevronDown className="w-4 h-4 transition-transform group-open/more:rotate-180" aria-hidden="true" />
                              {isDe ? 'Mehr Details' : 'More detail'}
                            </summary>
                            <p className="mt-1 text-sm text-muted leading-relaxed">{project.description}</p>
                          </details>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-muted leading-relaxed">{project.description}</p>
                          <div
                            className="flex gap-2 p-3 rounded-xl border border-line border-l-[3px] text-xs text-fg leading-relaxed"
                            style={{ borderLeftColor: sw.fill, background: tint(sw.fill, 7) }}
                          >
                            <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" style={{ color: sw.text }} aria-hidden="true" />
                            <p>{project.impact}</p>
                          </div>
                        </>
                      )}

                      {project.metrics && (
                        <dl className="grid grid-cols-2 gap-2 text-xs">
                          {project.metrics.map((m) => (
                            <div key={m.label} className="px-2.5 py-1.5 rounded-lg bg-surface-2/40 border border-line min-w-0">
                              <dt className="text-subtle">{m.label}</dt>
                              <dd className="text-fg font-medium truncate" title={m.value}>{m.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>

                    <div className="pt-5 mt-5 border-t border-line space-y-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-xs font-mono bg-surface-2/70 text-muted border"
                            style={{ borderColor: tint(sw.fill, 38) }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {(project.githubUrl || live || project.docs?.length) && (
                        <div className="flex flex-wrap items-center gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line-strong text-xs font-semibold text-fg hover:border-accent/50 hover:text-accent-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60"
                            >
                              <Github className="w-3.5 h-3.5" aria-hidden="true" />
                              {isDe ? 'Quellcode' : 'Source'}
                              <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            </a>
                          )}
                          {project.docs?.map((doc) => (
                            <a
                              key={doc.url}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line-strong text-xs font-semibold text-fg hover:border-accent/50 hover:text-accent-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60"
                            >
                              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                              {doc.label}
                            </a>
                          ))}
                          {live && (
                            <a
                              href={live.href}
                              {...(live.internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                              className="arrow-nudge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-accent-fg hover:text-accent-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60"
                            >
                              {isDe ? 'Details' : 'Details'}
                              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-surface/40 rounded-2xl border border-line">
            <p className="text-muted text-sm">
              {isDe ? 'Keine Projekte für diesen Filter.' : 'No projects match this filter.'}
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="mt-4 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-on-accent font-semibold text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60"
            >
              {isDe ? 'Filter zurücksetzen' : 'Reset filter'}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {gallery && (
          <ProjectGallery
            project={gallery.project}
            startIndex={gallery.index}
            onClose={() => setGallery(null)}
            language={language}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
