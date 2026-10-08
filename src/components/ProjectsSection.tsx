import React, { useState } from 'react';
import { TargetRole, Project } from '../types';
import { PROJECTS_DATA } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';
import { 
  Github, 
  ExternalLink, 
  Layers, 
  Activity, 
  Cpu, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';

interface ProjectsSectionProps {
  activeRole: TargetRole;
  language?: 'en' | 'de';
  onSelectProjectForTrack?: (projectId: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ 
  activeRole,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language]?.projects || TRANSLATIONS.en.projects;
  const isDe = language === 'de';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // Filter based on active role and user local tab
  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (activeRole !== 'all' && p.category !== activeRole) {
      return false;
    }
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <section id="projects" className="py-16 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              {t.tag}
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              {t.title}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-1">
              {t.desc}
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            {[
              { id: 'all', label: isDe ? 'Alle Projekte' : 'All Projects' },
              { id: 'it-devops', label: isDe ? 'Load Balancer & DevOps' : 'Load Balancers & DevOps' },
              { id: 'observability', label: isDe ? 'Observability & IoT' : 'Observability & IoT' },
              { id: 'ai-ml', label: isDe ? 'KI & Deep Learning' : 'AI & Deep Learning' },
              { id: 'data-eng', label: isDe ? 'Daten & Modellierung' : 'Data & Modeling' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isExpanded = expandedProject === project.id;

            return (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                className="group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 hover:border-emerald-500/40 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/20"
              >
                {/* Status and Category Badge */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                        project.status === 'Production at WaDaCon'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 font-semibold'
                          : project.status === 'Open Source'
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      {project.status}
                    </span>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors p-1"
                        title="View Source on GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-lg font-bold font-display text-white group-hover:text-emerald-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono text-cyan-400/90 mt-0.5">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Measurable Impact Chip */}
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Key Engineering Impact:</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      {project.impact}
                    </p>
                  </div>

                  {/* Architecture Metrics if available */}
                  {project.metrics && (
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                      {project.metrics.map((m, idx) => (
                        <div key={idx} className="px-2 py-1 rounded bg-slate-800/50 border border-slate-700/50">
                          <span className="text-slate-400 block">{m.label}:</span>
                          <span className="text-slate-200 font-medium truncate block">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Tech Tags & Action */}
                <div className="pt-5 mt-5 border-t border-slate-800/80 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Inspect Repository</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-slate-500">Enterprise WaDaCon Stack</span>
                    )}

                    <span className="text-[10px] font-mono text-slate-500">
                      {project.viewsCount} Recruiter views
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">No projects matching the current filter combination.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-3 px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
