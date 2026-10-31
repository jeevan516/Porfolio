import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TargetRole } from '../types';
import { PROJECTS_DATA, PERSONAL_INFO } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';
import { SpotlightCard } from './ui/SpotlightCard';
import { playTactileClick } from '../services/soundFx';
import { Github, ExternalLink, Layers, TrendingUp, ArrowRight } from 'lucide-react';

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

const statusStyle = (status: string) => {
  if (status.startsWith('Production')) return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
  if (status === 'Open Source') return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
  if (status === 'neuefische Course Project') return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
  return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
};

/** Shorter display labels for long status strings. */
const statusLabel = (status: string, isDe: boolean) => {
  if (status.startsWith('Production')) return isDe ? 'Produktiv · WaDaCon' : 'Production · WaDaCon';
  if (status === 'neuefische Course Project') return isDe ? 'neuefische · Kursprojekt' : 'neuefische · Course project';
  if (status.startsWith('Defended')) return isDe ? 'Verteidigt · TU Clausthal' : 'Defended · TU Clausthal';
  return status;
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ activeRole, language = 'en' }) => {
  const t = TRANSLATIONS[language]?.projects || TRANSLATIONS.en.projects;
  const isDe = language === 'de';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: t.filterAll },
    { id: 'neuefische', label: 'neuefische Bootcamp' },
    { id: 'it-devops', label: t.filterDevops },
    { id: 'observability', label: t.filterObs },
    { id: 'ai-ml', label: t.filterAi },
    { id: 'data-eng', label: t.filterData },
  ];

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (activeRole !== 'all' && p.category !== activeRole) return false;
    if (selectedCategory === 'neuefische') return p.status === 'neuefische Course Project';
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <section id="projects" className="py-16 sm:py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider mb-3">
              <Layers className="w-4 h-4" aria-hidden="true" />
              {t.tag}
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">{t.title}</h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">{t.desc}</p>
          </div>

          {/* Category Filter Chips */}
          <div
            role="tablist"
            aria-label={isDe ? 'Projekte filtern' : 'Filter projects'}
            className="flex flex-wrap items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl"
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
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                    active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="activeProjectCategory"
                      className="absolute inset-0 bg-slate-800 border border-slate-700 rounded-lg"
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
            {filteredProjects.map((project) => {
              const live = resolveLiveUrl(project.liveUrl);
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <SpotlightCard
                    id={`project-card-${project.id}`}
                    spotlightColor="rgba(16, 185, 129, 0.14)"
                    className="h-full p-6 hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${statusStyle(project.status)}`}>
                          {statusLabel(project.status, isDe)}
                        </span>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} on GitHub`}
                            title="GitHub"
                            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold font-display text-white leading-snug">{project.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{project.tagline}</p>
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>

                      <div className="flex gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <p>{project.impact}</p>
                      </div>

                      {project.metrics && (
                        <dl className="grid grid-cols-2 gap-2 text-[11px]">
                          {project.metrics.map((m) => (
                            <div key={m.label} className="px-2.5 py-1.5 rounded-lg bg-slate-800/40 border border-slate-800 min-w-0">
                              <dt className="text-slate-500">{m.label}</dt>
                              <dd className="text-slate-200 font-medium truncate" title={m.value}>{m.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-800 space-y-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800/70 text-slate-300 border border-slate-700/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {(project.githubUrl || live) && (
                        <div className="flex flex-wrap items-center gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                            >
                              <Github className="w-3.5 h-3.5" aria-hidden="true" />
                              {isDe ? 'Quellcode' : 'Source'}
                              <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            </a>
                          )}
                          {live && (
                            <a
                              href={live.href}
                              {...(live.internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
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
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">
              {isDe ? 'Keine Projekte für diesen Filter.' : 'No projects match this filter.'}
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="mt-4 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
            >
              {isDe ? 'Filter zurücksetzen' : 'Reset filter'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
