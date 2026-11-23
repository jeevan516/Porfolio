import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GraduationCap, Github, FileText, Lock, CalendarDays, Sparkles, Download, ChevronDown, X } from 'lucide-react';
import { JOURNEY, type JourneyProject } from '../data/journey';
import { assetUrl } from './ProjectGallery';
import { CountUp } from './ui/CountUp';
import { stageSwatch, tint, type Swatch } from '../data/palette';
import { projectBlurb } from '../data/projectCopy';
import { caseForJourney } from '../data/projectCases';
import { CaseSteps } from './ui/CaseSteps';

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

// One vivid colour per stage (shared JD accent palette, src/data/palette.ts)

const formatDate = (iso: string | null, isDe: boolean) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString(isDe ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short' }) : '';

const ease = [0.2, 0.7, 0.2, 1] as const;

export const NeuefischeJourney: React.FC<NeuefischeJourneyProps> = ({ language = 'en' }) => {
  const isDe = language === 'de';
  const reduce = !!useReducedMotion();
  const { stages, projects } = JOURNEY;
  const [stage, setStage] = useState<string>('all');
  const [skill, setSkill] = useState<string | null>(null);
  const [showDecks, setShowDecks] = useState(false);

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
  // Colour group of a tool: the stage where it was used most (ties go to the earlier stage)
  const toolSwatch = useMemo(() => {
    const m = new Map<string, Swatch>();
    skills.forEach(([name]) => {
      let best = stages[0];
      let bestN = -1;
      stages.forEach((st) => {
        const n = projects.filter((p) => p.stage === st && p.stack.includes(name)).length;
        if (n > bestN) {
          best = st;
          bestN = n;
        }
      });
      m.set(name, stageSwatch(best));
    });
    return m;
  }, [skills, stages, projects]);
  const maxSkill = skills[0]?.[1] ?? 1;

  const dates = projects.map((p) => p.startDate).filter(Boolean).sort() as string[];
  const decks = projects.filter((p) => p.deckUrl).length;

  const visible = projects.filter((p) => (stage === 'all' || p.stage === stage) && (!skill || p.stack.includes(skill)));
  const visibleStages = byStage
    .map((g) => ({ ...g, projects: g.projects.filter((p) => visible.includes(p)) }))
    .filter((g) => g.projects.length > 0);

  const stageLabel = (s: string) => (isDe ? STAGE_DE[s] ?? s : s);
  const filtered = stage !== 'all' || !!skill;

  return (
    <section id="neuefische-journey" aria-labelledby="journey-title" className="py-20 sm:py-28 border-t border-line relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10"
        >
          <div className="max-w-2xl">
            <p className="jd-eyebrow inline-flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
              neuefische · Bootcamp
            </p>
            <h2 id="journey-title" className="section-title text-4xl sm:text-6xl font-bold text-fg">
              {isDe ? 'Meine Bootcamp-Reise' : 'My bootcamp journey'}
            </h2>
            <p className="section-lead text-muted text-base sm:text-lg mt-4 leading-relaxed">
              {isDe
                ? `${projects.length} Projekte in ${stages.length} Etappen, von Python-Grundlagen bis zu ML-Modellen, die per API in Docker und mit CI laufen. Jede Karte zeigt Problem, Lösung und das echte Ergebnis des Laufs und verlinkt den Foliensatz.`
                : `${projects.length} projects in ${stages.length} stages, from Python foundations to ML models served by APIs in Docker and checked in CI. Every card shows the problem, the solution and the real result of the run, and links its slide deck.`}
            </p>
            {dates.length > 0 && (
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-subtle">
                <CalendarDays className="w-4 h-4" aria-hidden="true" />
                {formatDate(dates[0], isDe)} – {formatDate(dates[dates.length - 1], isDe)} 2026
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
            <div className="jd-card !p-4 text-center sm:min-w-[110px]">
              <span className="block font-display text-3xl sm:text-4xl font-bold text-fg tabular-nums leading-none">
                <CountUp to={projects.length} />
              </span>
              <span className="block mt-2 text-[13px] font-semibold text-muted">{isDe ? 'Projekte' : 'Projects'}</span>
            </div>
            <div className="jd-card !p-4 text-center sm:min-w-[110px]">
              <span className="block font-display text-3xl sm:text-4xl font-bold text-fg tabular-nums leading-none">
                <CountUp to={stages.length} />
              </span>
              <span className="block mt-2 text-[13px] font-semibold text-muted">{isDe ? 'Etappen' : 'Stages'}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowDecks((v) => !v)}
              aria-expanded={showDecks}
              aria-controls="neuefische-decks"
              className={`jd-card jd-card--interactive !p-4 text-center sm:min-w-[110px] ${showDecks ? '!border-accent !bg-accent-soft' : ''}`}
            >
              <span className="block font-display text-3xl sm:text-4xl font-bold text-accent-fg tabular-nums leading-none">
                <CountUp to={decks} />
              </span>
              <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-accent-fg">
                {isDe ? 'Foliensätze' : 'Slide decks'}
                <ChevronDown className={`w-4 h-4 transition-transform ${showDecks ? 'rotate-180' : ''}`} aria-hidden="true" />
              </span>
            </button>
          </div>
        </motion.div>

        {/* Every deck in one place */}
        <AnimatePresence initial={false}>
          {showDecks && (
            <motion.div
              id="neuefische-decks"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease }}
              className="overflow-hidden mb-10"
            >
              <div className="jd-card">
                <h3 className="flex items-center gap-2 mb-3 text-base font-semibold text-fg">
                  <FileText className="w-5 h-5 text-accent-fg" aria-hidden="true" />
                  {isDe ? 'Alle neuefische-Foliensätze (PowerPoint)' : 'All neuefische slide decks (PowerPoint)'}
                </h3>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
                  {byStage.flatMap((g) =>
                    g.projects
                      .filter((p) => p.deckUrl)
                      .map((p) => (
                        <li key={p.id}>
                          <a
                            href={assetUrl(p.deckUrl as string)}
                            download
                            className="group flex items-center gap-2.5 min-h-10 rounded-lg px-2.5 text-[15px] text-fg no-underline hover:bg-surface-2 transition-colors"
                          >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: stageSwatch(g.stage).fill }} aria-hidden="true" />
                            <span className="truncate">{p.title}</span>
                            <Download className="w-4 h-4 ml-auto shrink-0 text-subtle group-hover:text-accent-fg" aria-hidden="true" />
                          </a>
                        </li>
                      )),
                  )}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage stepper: the path through the bootcamp (click to filter) */}
        <nav aria-label={isDe ? 'Etappen filtern' : 'Filter by stage'} className="relative mb-10">
          <motion.div
            className="absolute left-6 right-6 top-[26px] h-0.5 origin-left hidden md:block rounded-full"
            style={{ background: `linear-gradient(90deg, ${stages.map((st) => stageSwatch(st).fill).join(', ')})`, opacity: 0.8, height: 3 }}
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          <ol className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 relative">
            {byStage.map((g, i) => {
              const active = stage === g.stage;
              const sw = stageSwatch(g.stage);
              return (
                <motion.li
                  key={g.stage}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.1, ease }}
                  className={i === byStage.length - 1 ? 'col-span-2 sm:col-span-1' : ''}
                >
                  <motion.button
                    type="button"
                    whileHover={reduce ? undefined : { y: -3 }}
                    onClick={() => setStage(active ? 'all' : g.stage)}
                    aria-pressed={active}
                    className={`w-full h-full text-left rounded-xl border px-3.5 py-3 transition-[background-color,border-color,box-shadow] ${
                      active ? 'shadow-md' : 'border-line bg-surface hover:border-line-strong shadow-sm'
                    }`}
                    style={
                      active
                        ? { borderColor: sw.fill, background: `linear-gradient(${tint(sw.fill, 16)}, ${tint(sw.fill, 16)}), var(--jd-surface)`, boxShadow: `0 10px 28px -14px ${sw.fill}` }
                        : { borderTopColor: sw.fill, borderTopWidth: 3 }
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className="w-8 h-8 shrink-0 rounded-full grid place-items-center text-sm font-bold ring-4 ring-bg"
                        style={{ background: sw.fill, color: 'var(--c-ink)', boxShadow: `0 0 0 6px ${tint(sw.fill, 22)}` }}
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <span className="text-[15px] font-semibold text-fg leading-tight">{stageLabel(g.stage)}</span>
                    </span>
                    <span className="mt-2 flex items-center justify-between text-[13px] text-muted">
                      <span>
                        {g.projects.length} {isDe ? 'Projekte' : 'projects'}
                      </span>
                      <span>{formatDate(g.projects[0]?.startDate ?? null, isDe)}</span>
                    </span>
                  </motion.button>
                </motion.li>
              );
            })}
          </ol>
        </nav>

        {/* Tools used across the bootcamp: select one to filter the projects */}
        <div className="mb-10" role="group" aria-labelledby="journey-tools-title">
          <h3 id="journey-tools-title" className="flex items-center gap-2 text-base font-semibold text-fg mb-3">
            <Sparkles className="w-4 h-4 text-accent-fg" aria-hidden="true" />
            {isDe ? 'Meistgenutzte Werkzeuge' : 'Tools used most'}
            <span className="text-[13px] font-normal text-subtle">
              · {isDe ? 'Farbe = Etappe mit der meisten Nutzung, antippen zum Filtern' : 'colour = stage where it was used most; select to filter'}
            </span>
          </h3>
          <ul className="flex flex-wrap gap-2">
            {skills.map(([name, count], idx) => {
              const active = skill === name;
              const sw = toolSwatch.get(name) ?? stageSwatch(stages[0]);
              return (
                <motion.li
                  key={name}
                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: reduce ? 0 : idx * 0.03 }}
                >
                  <button
                    type="button"
                    onClick={() => setSkill(active ? null : name)}
                    aria-pressed={active}
                    className="relative inline-flex items-center gap-2 min-h-10 pl-3.5 pr-2 rounded-full border text-sm font-medium overflow-hidden transition-colors text-fg bg-surface hover:bg-surface-2"
                    style={
                      active
                        ? { background: sw.fill, borderColor: sw.fill, color: 'var(--c-ink)' }
                        : { borderColor: `color-mix(in srgb, ${sw.fill} 55%, var(--jd-border))` }
                    }
                  >
                    {!active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 -z-0"
                        style={{ width: `${(count / maxSkill) * 100}%`, background: tint(sw.fill, 20) }}
                      />
                    )}
                    <span className="relative">{name}</span>
                    <span
                      className={`relative min-w-6 h-6 px-1.5 rounded-full grid place-items-center text-xs font-semibold tabular-nums ${
                        active ? 'bg-[rgb(15_27_45/0.15)]' : 'bg-surface-2 text-muted'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div>
          {/* Projects, grouped by stage */}
          <div className="min-w-0">
            <AnimatePresence initial={false}>
              {filtered && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex flex-wrap items-center gap-2 mb-6 text-sm text-muted"
                  role="status"
                >
                  <span>
                    {visible.length} {isDe ? 'Projekte' : visible.length === 1 ? 'project' : 'projects'}
                    {stage !== 'all' && <> · {stageLabel(stage)}</>}
                    {skill && <> · {skill}</>}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStage('all');
                      setSkill(null);
                    }}
                    className="jd-btn jd-btn--ghost !min-h-10 !px-3 text-accent-fg"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                    {isDe ? 'Filter zurücksetzen' : 'Clear filters'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-12">
              <AnimatePresence initial={false} mode="popLayout">
                {visibleStages.map((g) => {
                  const i = stages.indexOf(g.stage);
                  const sw = stageSwatch(g.stage);
                  return (
                    <motion.section
                      key={g.stage}
                      layout={!reduce}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, ease }}
                      aria-labelledby={`stage-${i}-title`}
                    >
                      <header className="flex items-end justify-between gap-3 mb-4 pb-3 border-b" style={{ borderColor: tint(sw.fill, 45) }}>
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-1.5 self-stretch rounded-full" style={{ background: sw.fill }} aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: sw.text }}>
                              {isDe ? 'Etappe' : 'Stage'} {i + 1}
                            </p>
                            <h3 id={`stage-${i}-title`} className="text-xl sm:text-2xl font-bold text-fg leading-tight">
                              {stageLabel(g.stage)}
                            </h3>
                          </div>
                        </div>
                        <span className="jd-badge shrink-0" style={{ background: tint(sw.fill, 16), borderColor: tint(sw.fill, 45), color: sw.text }}>
                          {g.projects.length} {isDe ? 'Projekte' : g.projects.length === 1 ? 'project' : 'projects'}
                        </span>
                      </header>
                      <motion.div layout={!reduce} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence initial={false} mode="popLayout">
                          {g.projects.map((p, k) => (
                            <JourneyCard key={p.id} project={p} isDe={isDe} index={k} reduce={reduce} activeSkill={skill} swatch={sw} stageLabel={stageLabel(g.stage)} />
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    </motion.section>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const JourneyCard = React.forwardRef<
  HTMLElement,
  { project: JourneyProject; isDe: boolean; index: number; reduce: boolean; activeSkill: string | null; swatch: Swatch; stageLabel: string }
>(({ project: p, isDe, index, reduce, activeSkill, swatch, stageLabel }, ref) => (
  <motion.article
    ref={ref}
    layout={!reduce}
    initial={reduce ? false : { opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.45, delay: reduce ? 0 : Math.min(index, 4) * 0.07, ease }}
    whileHover={reduce ? undefined : { y: -4 }}
    className="accent-card group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm"
    style={{ '--card-c': swatch.fill } as React.CSSProperties}
  >
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: tint(swatch.fill, 30) }}
    />
    <div className="relative">
      <p className="flex items-center justify-between gap-2 text-[13px] text-subtle">
        <span className="inline-flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: swatch.fill }} aria-hidden="true" />
          <span className="font-semibold truncate" style={{ color: swatch.text }}>{stageLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="shrink-0">{formatDate(p.startDate, isDe)}</span>
        </span>
        {!p.githubUrl && (
          <span className="inline-flex items-center gap-1" title={isDe ? 'Privates Kurs-Repository' : 'Private course repository'}>
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            {isDe ? 'Code auf Anfrage' : 'Code on request'}
          </span>
        )}
      </p>
      <h4 className="mt-1.5 text-lg font-semibold text-fg leading-snug">{p.title}</h4>
      {(() => {
        const c = caseForJourney(p);
        return c ? (
          <div className="mt-3">
            <CaseSteps data={c} fill={swatch.fill} text={swatch.text} isDe={isDe} compact />
          </div>
        ) : (
          <>
            <p className="mt-1.5 text-[15px] text-muted leading-relaxed">{projectBlurb(p.id, p.description)}</p>
            <p
              className="mt-3 rounded-lg border-l-[3px] pl-3 py-1.5 text-sm font-semibold text-fg leading-snug"
              style={{ borderColor: swatch.fill, background: tint(swatch.fill, 9) }}
            >
              <span className="sr-only">{isDe ? 'Ergebnis: ' : 'Result: '}</span>
              {p.headline}
            </p>
          </>
        );
      })()}
    </div>

    {p.metrics.length > 0 && (
      <dl className={`grid gap-2 ${p.metrics.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {p.metrics.map((m) => (
          <div key={m.label} className="relative flex flex-col-reverse rounded-xl bg-surface-2 px-3 py-2.5 min-w-0">
            <dt className="mt-0.5 text-xs font-medium text-muted leading-snug">{m.label}</dt>
            <dd className="font-display text-xl font-bold tabular-nums leading-tight break-words" style={{ color: swatch.text }}>{m.value}</dd>
          </div>
        ))}
      </dl>
    )}

    <ul className="relative flex flex-wrap gap-1.5" aria-label={isDe ? 'Technologien' : 'Tech stack'}>
      {p.stack.slice(0, 6).map((t) => (
        <li
          key={t}
          className="jd-chip"
          style={activeSkill === t ? { borderColor: swatch.fill, background: tint(swatch.fill, 18), color: 'var(--jd-text)' } : undefined}
        >
          {t}
        </li>
      ))}
    </ul>

    <div className="relative flex flex-wrap gap-2 mt-auto pt-1">
      {p.deckUrl && (
        <a href={assetUrl(p.deckUrl)} download className="jd-btn jd-btn--secondary no-underline flex-1 sm:flex-none">
          <FileText className="w-4 h-4" aria-hidden="true" />
          {isDe ? 'Folien (.pptx)' : 'Slides (.pptx)'}
        </a>
      )}
      {p.githubUrl ? (
        <a
          href={p.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="jd-btn jd-btn--secondary no-underline flex-1 sm:flex-none"
          aria-label={`${isDe ? 'Quellcode' : 'Source code'}: ${p.title} (GitHub)`}
        >
          <Github className="w-4 h-4" aria-hidden="true" />
          {isDe ? 'Quellcode' : 'Source'}
        </a>
      ) : null}
    </div>
  </motion.article>
));
JourneyCard.displayName = 'JourneyCard';
