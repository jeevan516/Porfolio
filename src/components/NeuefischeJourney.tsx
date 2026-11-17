import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GraduationCap, Github, FileText, Lock, CalendarDays, Layers, Sparkles } from 'lucide-react';
import { JOURNEY, type JourneyProject } from '../data/journey';
import { assetUrl } from './ProjectGallery';

interface NeuefischeJourneyProps {
  language?: 'en' | 'de';
}

const STAGE_DE: Record<string, string> = {
  'Python foundations': 'Python-Grundlagen',
  'APIs & cloud': 'APIs & Cloud',
  'Data engineering': 'Data Engineering',
  'Machine learning': 'Machine Learning',
  'MLOps & deployment': 'MLOps & Deployment',
};

const STAGE_ACCENT = ['text-sky-300', 'text-violet-300', 'text-cyan-300', 'text-amber-300', 'text-emerald-300'];
const STAGE_DOT = ['bg-sky-400', 'bg-violet-400', 'bg-cyan-400', 'bg-amber-400', 'bg-emerald-400'];

const formatDate = (iso: string | null, isDe: boolean) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString(isDe ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short' }) : '';

export const NeuefischeJourney: React.FC<NeuefischeJourneyProps> = ({ language = 'en' }) => {
  const isDe = language === 'de';
  const reduce = useReducedMotion();
  const { stages, projects } = JOURNEY;
  const [stage, setStage] = useState<string>('all');
  const [skill, setSkill] = useState<string | null>(null);

  const byStage = useMemo(
    () => stages.map((s) => ({ stage: s, projects: projects.filter((p) => p.stage === s) })),
    [stages, projects],
  );

  // How often each tool appears across the bootcamp projects.
  const skills = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.stack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 12);
  }, [projects]);
  const maxSkill = skills[0]?.[1] ?? 1;

  const dates = projects.map((p) => p.startDate).filter(Boolean).sort() as string[];
  const decks = projects.filter((p) => p.deckUrl).length;

  const visible = projects.filter(
    (p) => (stage === 'all' || p.stage === stage) && (!skill || p.stack.includes(skill)),
  );
  const visibleStages = byStage
    .map((g) => ({ ...g, projects: g.projects.filter((p) => visible.includes(p)) }))
    .filter((g) => g.projects.length > 0);

  const stageLabel = (s: string) => (isDe ? STAGE_DE[s] ?? s : s);

  return (
    <section id="neuefische-journey" className="py-16 sm:py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider mb-3">
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
              neuefische · {isDe ? 'Bootcamp' : 'Bootcamp'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              {isDe ? 'Meine Bootcamp-Reise' : 'My bootcamp journey'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
              {isDe
                ? 'Von Python-Grundlagen bis zu deployten ML-Systemen: jedes Projekt mit echten Ergebnissen und Folien.'
                : 'From Python foundations to deployed ML systems: every project with its real results and slides.'}
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-3 text-center">
            {[
              { k: isDe ? 'Projekte' : 'Projects', v: projects.length },
              { k: isDe ? 'Etappen' : 'Stages', v: stages.length },
              { k: isDe ? 'Foliensätze' : 'Slide decks', v: decks },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 min-w-[92px]">
                <dd className="text-2xl font-bold text-white tabular-nums">{s.v}</dd>
                <dt className="text-[11px] text-slate-400 uppercase tracking-wide">{s.k}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Stage stepper: the path through the bootcamp */}
        <div className="relative mb-8">
          <motion.div
            className="absolute left-0 right-0 top-[22px] h-px origin-left bg-gradient-to-r from-sky-500/60 via-cyan-500/60 to-emerald-500/70 hidden md:block"
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 relative">
            {byStage.map((g, i) => {
              const active = stage === g.stage;
              return (
                <motion.button
                  key={g.stage}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.12 }}
                  whileHover={reduce ? undefined : { y: -2 }}
                  onClick={() => setStage(active ? 'all' : g.stage)}
                  aria-pressed={active}
                  className={`group text-left rounded-xl border px-3 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                    active ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/70 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full grid place-items-center text-[11px] font-bold text-slate-950 ${STAGE_DOT[i % 5]}`}>{i + 1}</span>
                    <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-200'}`}>{stageLabel(g.stage)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{g.projects.length} {isDe ? 'Projekte' : 'projects'}</span>
                    <span>{formatDate(g.projects[0]?.startDate ?? null, isDe)}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Timeline */}
          <div>
            <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
                {formatDate(dates[0] ?? null, isDe)} – {formatDate(dates[dates.length - 1] ?? null, isDe)} 2026
              </span>
              {(stage !== 'all' || skill) && (
                <button
                  onClick={() => { setStage('all'); setSkill(null); }}
                  className="text-emerald-300 hover:text-emerald-200 font-semibold"
                >
                  {isDe ? 'Filter zurücksetzen' : 'Clear filters'} ({visible.length})
                </button>
              )}
            </div>

            <ol className="relative border-l border-slate-800 ml-2 space-y-8">
              <AnimatePresence initial={false}>
                {visibleStages.map((g) => {
                  const i = stages.indexOf(g.stage);
                  return (
                    <motion.li
                      key={g.stage}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="pl-6"
                    >
                      <span className={`absolute -left-[7px] mt-1 w-3.5 h-3.5 rounded-full ring-4 ring-slate-950 ${STAGE_DOT[i % 5]}`} aria-hidden="true" />
                      <h3 className={`text-xs font-mono font-semibold uppercase tracking-wider mb-3 ${STAGE_ACCENT[i % 5]}`}>
                        {i + 1}. {stageLabel(g.stage)}
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {g.projects.map((p, k) => (
                          <JourneyCard key={p.id} project={p} isDe={isDe} activeSkill={skill} onSkill={setSkill} index={k} reduce={!!reduce} />
                        ))}
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ol>
          </div>

          {/* Skills built across the bootcamp */}
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 h-fit lg:sticky lg:top-24">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              {isDe ? 'Eingesetzte Werkzeuge' : 'Tools used most'}
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">{isDe ? 'Klicken zum Filtern' : 'Click to filter'}</p>
            <ul className="space-y-1.5">
              {skills.map(([name, count]) => {
                const active = skill === name;
                return (
                  <li key={name}>
                    <button
                      onClick={() => setSkill(active ? null : name)}
                      aria-pressed={active}
                      className="w-full text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 rounded"
                    >
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className={active ? 'text-emerald-300 font-semibold' : 'text-slate-300 group-hover:text-white'}>{name}</span>
                        <span className="text-slate-500 tabular-nums">{count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${active ? 'bg-emerald-400' : 'bg-emerald-500/60 group-hover:bg-emerald-400/80'}`}
                          initial={reduce ? false : { width: 0 }}
                          whileInView={{ width: `${(count / maxSkill) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
};

const JourneyCard: React.FC<{
  project: JourneyProject;
  isDe: boolean;
  activeSkill: string | null;
  onSkill: (s: string | null) => void;
  index: number;
  reduce: boolean;
}> = ({ project: p, isDe, activeSkill, onSkill, index, reduce }) => (
  <motion.article
    initial={reduce ? false : { opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.05 }}
    transition={{ duration: 0.45, delay: reduce ? 0 : Math.min(index, 4) * 0.08 }}
    whileHover={reduce ? undefined : { y: -3 }}
    className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col gap-3 hover:border-emerald-500/40 hover:shadow-[0_8px_30px_-12px_rgba(16,185,129,0.35)] transition-[border-color,box-shadow]"
  >
    <div>
      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>{formatDate(p.startDate, isDe)}</span>
        <Layers className="w-3.5 h-3.5" aria-hidden="true" />
      </div>
      <h4 className="text-sm font-semibold text-white mt-1 leading-snug">{p.title}</h4>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.headline}</p>
    </div>
    {p.metrics.length > 0 && (
      <dl className="flex flex-wrap gap-2">
        {p.metrics.map((m) => (
          <div key={m.label} className="rounded-lg bg-slate-950/70 border border-slate-800 px-2.5 py-1">
            <dd className="text-sm font-bold text-emerald-300 tabular-nums leading-tight">{m.value}</dd>
            <dt className="text-[10px] text-slate-500">{m.label}</dt>
          </div>
        ))}
      </dl>
    )}
    <div className="flex flex-wrap gap-1">
      {p.stack.slice(0, 5).map((t) => (
        <button
          key={t}
          onClick={() => onSkill(activeSkill === t ? null : t)}
          className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition-colors ${
            activeSkill === t
              ? 'border-emerald-500/60 text-emerald-300 bg-emerald-500/10'
              : 'border-slate-700/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
    <div className="flex flex-wrap gap-2 mt-auto pt-1">
      {p.deckUrl && (
        <a
          href={assetUrl(p.deckUrl)}
          download
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-semibold text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" aria-hidden="true" />
          {isDe ? 'Folien' : 'Slides'}
        </a>
      )}
      {p.githubUrl ? (
        <a
          href={p.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-semibold text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
        >
          <Github className="w-3.5 h-3.5" aria-hidden="true" />
          {isDe ? 'Quellcode' : 'Source'}
        </a>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-slate-500" title={isDe ? 'Privates Kurs-Repository' : 'Private course repository'}>
          <Lock className="w-3 h-3" aria-hidden="true" />
          {isDe ? 'Code auf Anfrage' : 'Code on request'}
        </span>
      )}
    </div>
  </motion.article>
);
