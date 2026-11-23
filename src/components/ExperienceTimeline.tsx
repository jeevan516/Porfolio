import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCES } from '../data/portfolioData';
import { Briefcase, GraduationCap, Calendar, MapPin, CheckCircle2, ChevronDown, ChevronUp, Layers, TrendingUp } from 'lucide-react';

type Filter = 'work' | 'education' | 'all';

const PREVIEW_COUNT = 3;

/** Condensed career stages; each links to its full entry in the timeline below. */
const STAGES = [
  {
    id: 'avast-technologies',
    period: '2015 – 2018',
    role: 'Software Developer',
    company: 'Avast Technologies',
    summary: 'Full-stack engineering, testable modular code, POC prototyping, and Agile sprints.',
  },
  {
    id: 'cogent-networks',
    period: '2019 – 2025',
    role: 'IT Support Engineer',
    company: 'Cogent Networks (Stade)',
    summary: 'Systems & network administration, enterprise hardware, VoIP, and mission-critical uptime.',
  },
  {
    id: 'netidentity-analytics',
    period: '2021',
    role: 'Data Analyst',
    company: 'Netidentity',
    summary: 'Power BI dashboards, e-commerce KPI modeling, DAX data pipelines, and POCs.',
  },
  {
    id: 'radicalx-ai',
    period: '2023 – 2024',
    role: 'AI Engineer',
    company: 'RadicalX',
    summary: 'Vertex AI, Google Gemini Flights, FastAPI backend, and automated data ingestion.',
  },
  {
    id: 'wadacon-gmbh',
    period: '2025 – 2026',
    role: 'IT Specialist (Observability)',
    company: 'WaDaCon GmbH',
    summary: 'Grafana/InfluxDB pipelines, Docker CI/CD, Teleport zero-trust, Teams alerts, AI anomaly detection.',
  },
];

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60';

export const ExperienceTimeline: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('work');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredExperiences = EXPERIENCES.filter((item) => filter === 'all' || item.category === filter);

  const workCount = EXPERIENCES.filter((e) => e.category === 'work').length;
  const eduCount = EXPERIENCES.filter((e) => e.category === 'education').length;

  const jumpToEntry = (id: string) => {
    const target = EXPERIENCES.find((e) => e.id === id);
    if (target && filter !== 'all' && target.category !== filter) setFilter(target.category);
    setExpandedItems((prev) => ({ ...prev, [id]: true }));
    // Wait for the filtered list to render before scrolling.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.getElementById(`experience-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
    );
  };

  const tabs: { id: Filter; label: string; count: number; icon: React.ReactNode }[] = [
    { id: 'work', label: 'Work', count: workCount, icon: <Briefcase className="w-4 h-4" aria-hidden="true" /> },
    { id: 'education', label: 'Education', count: eduCount, icon: <GraduationCap className="w-4 h-4" aria-hidden="true" /> },
    { id: 'all', label: 'All', count: EXPERIENCES.length, icon: <Layers className="w-4 h-4" aria-hidden="true" /> },
  ];

  return (
    <section id="experience" className="py-16 sm:py-20 border-t border-line/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-accent-fg font-semibold uppercase tracking-wider mb-3">
              <Briefcase className="w-4 h-4" aria-hidden="true" />
              Experience
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-fg tracking-tight">Work Experience & Education</h2>
            <p className="text-muted text-sm sm:text-base mt-2 leading-relaxed">
              Enterprise IT infrastructure, automated observability, AI/ML APIs, and graduate computer science research in Germany.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start lg:self-auto px-3.5 py-2 rounded-xl bg-surface/80 border border-accent/30 text-xs font-semibold text-accent-fg">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            Ready for work · Bootcamp @ neuefische
          </div>
        </div>

        {/* Career progression overview */}
        <div className="mb-12 p-5 sm:p-6 rounded-2xl bg-surface/60 border border-line">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <h3 className="flex items-center gap-2 text-base font-bold text-fg font-display">
              <TrendingUp className="w-4 h-4 text-accent-fg" aria-hidden="true" />
              Career progression
            </h3>
            <span className="text-xs font-mono text-subtle">2015 – 2026 · 10+ years</span>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {STAGES.map((stage, i) => {
              const latest = i === STAGES.length - 1;
              return (
                <li key={stage.id}>
                  <button
                    type="button"
                    onClick={() => jumpToEntry(stage.id)}
                    aria-label={`${stage.role} at ${stage.company} — show details`}
                    className={`w-full h-full text-left p-4 rounded-xl border transition-[border-color,translate] duration-200 hover:-translate-y-0.5 group ${focusRing} ${
                      latest
                        ? 'bg-surface border-accent/50 hover:border-accent'
                        : 'bg-bg/60 border-line hover:border-line-strong'
                    }`}
                  >
                    <div className="text-xs font-mono text-subtle mb-1.5">{stage.period}</div>
                    <div className="font-bold text-sm text-fg group-hover:text-accent-fg transition-colors">{stage.role}</div>
                    <div className="text-xs text-accent-fg mt-0.5">{stage.company}</div>
                    <p className="text-xs text-muted mt-2 leading-snug">{stage.summary}</p>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Filter Tabs */}
        <div role="tablist" aria-label="Filter timeline" className="flex flex-wrap items-center gap-2 mb-10">
          {tabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${focusRing} ${
                  active
                    ? 'bg-accent border-accent text-on-accent font-semibold'
                    : 'bg-surface border-line text-muted hover:bg-surface-2 hover:text-fg'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-md text-xs font-mono ${active ? 'bg-bg/20 text-on-accent' : 'bg-surface-2 text-muted'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-line ml-4 sm:ml-6 space-y-8">
          {filteredExperiences.map((item, idx) => {
            const isWork = item.category === 'work';
            const isExpanded = !!expandedItems[item.id];
            const canExpand = item.achievements.length > PREVIEW_COUNT;
            const shown = isExpanded || !canExpand ? item.achievements : item.achievements.slice(0, PREVIEW_COUNT);
            const isLatest = item.id === 'wadacon-gmbh';

            return (
              <motion.div
                key={item.id}
                id={`experience-${item.id}`}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: Math.min(idx, 4) * 0.06 }}
                className="relative pl-6 sm:pl-10 scroll-mt-24"
              >
                {/* Timeline node */}
                <div
                  aria-hidden="true"
                  className={`absolute -left-[17px] top-6 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    isLatest
                      ? 'bg-accent border-accent text-on-accent'
                      : isWork
                      ? 'bg-surface border-accent text-accent-fg'
                      : 'bg-surface border-info text-info'
                  }`}
                >
                  {isWork ? <Briefcase className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                </div>

                <article
                  className={`p-5 sm:p-7 rounded-2xl bg-surface/70 border transition-colors space-y-5 ${
                    isLatest ? 'border-accent/40 hover:border-accent/60' : 'border-line hover:border-line-strong'
                  }`}
                >
                  <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 pb-4 border-b border-line">
                    <div className="min-w-0">
                      {item.employmentType && (
                        <span
                          className={`inline-block mb-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            isWork ? 'bg-accent/10 text-accent-fg border-accent/30' : 'bg-info/10 text-info border-info/30'
                          }`}
                        >
                          {item.employmentType.split(' · ')[0]}
                        </span>
                      )}
                      <h3 className="text-lg sm:text-2xl font-bold font-display text-fg leading-snug">{item.role}</h3>
                      <div className="text-sm sm:text-base font-semibold text-accent-fg mt-0.5">{item.company}</div>
                    </div>

                    <div className="flex flex-wrap lg:flex-col lg:items-end gap-x-4 gap-y-1.5 text-xs text-muted shrink-0">
                      <span className="flex items-center gap-1.5 font-mono text-muted">
                        <Calendar className="w-3.5 h-3.5 text-accent-fg" aria-hidden="true" />
                        {item.period}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-subtle" aria-hidden="true" />
                        {item.location}
                      </span>
                    </div>
                  </header>

                  <p className="text-sm sm:text-base text-muted leading-relaxed">{item.description}</p>

                  <div className="space-y-3">
                    <ul id={`experience-${item.id}-achievements`} className="space-y-2">
                      {shown.map((ach, aIdx) => (
                        <li key={aIdx} className="text-sm text-muted flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-accent-fg shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="leading-relaxed">{ach}</span>
                        </li>
                      ))}
                    </ul>

                    {canExpand && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`experience-${item.id}-achievements`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line-strong text-xs font-medium text-muted hover:text-fg hover:border-line-strong transition-colors ${focusRing}`}
                      >
                        {isExpanded ? (
                          <>
                            Show less <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                          </>
                        ) : (
                          <>
                            Show {item.achievements.length - PREVIEW_COUNT} more <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="pt-4 border-t border-line flex flex-wrap items-center gap-1.5">
                    {item.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-md text-xs font-mono bg-surface-2/70 text-muted border border-line-strong/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
