import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PERSONAL_INFO } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';
import { JOURNEY } from '../data/journey';
import { InteractiveMeshCanvas } from './graphics/InteractiveMeshCanvas';
import { CountUp } from './ui/CountUp';
import { playTactileClick } from '../services/soundFx';
import { ArrowRight, Download, GraduationCap, Mail, MapPin } from 'lucide-react';

interface HeroProps {
  onOpenContact: () => void;
  onOpenResume?: () => void;
  language?: 'en' | 'de';
}

// Roles cycled under the name (typewriter); all from the CV
const ROLES = {
  en: ['IT Specialist & AI Engineer', 'Data & ML Engineer', 'Industrial IoT Observability', 'Cloud & DevOps Engineer'],
  de: ['IT-Spezialist & KI-Ingenieur', 'Data- & ML-Engineer', 'Industrielle IoT-Observability', 'Cloud- & DevOps-Engineer'],
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] as const } },
};

/** Smooth-scroll to a section, accounting for the sticky header height. */
const scrollToSection = (e: React.MouseEvent, id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  playTactileClick();
  const header = document.querySelector('header');
  const offset = (header instanceof HTMLElement ? header.offsetHeight : 80) + 8;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
};

export const Hero: React.FC<HeroProps> = ({ onOpenContact, onOpenResume, language = 'en' }) => {
  const isDe = language === 'de';
  const t = TRANSLATIONS[language].hero;
  const reduce = useReducedMotion();
  const roles = ROLES[language];
  const projectCount = JOURNEY.projects.length;
  const deckCount = JOURNEY.projects.filter((p) => p.deckUrl).length;

  // Typewriter; under reduced motion the role simply changes every few seconds
  const [roleIdx, setRoleIdx] = useState(0);
  const [typed, setTyped] = useState(reduce ? roles[0] : '');
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const cur = roles[roleIdx % roles.length];
    if (reduce) {
      setTyped(cur);
      const id = setTimeout(() => setRoleIdx((i) => (i + 1) % roles.length), 3500);
      return () => clearTimeout(id);
    }
    const id = setTimeout(
      () => {
        if (!deleting) {
          setTyped(cur.substring(0, typed.length + 1));
          if (typed.length + 1 === cur.length) setTimeout(() => setDeleting(true), 2200);
        } else {
          setTyped(cur.substring(0, typed.length - 1));
          if (typed.length <= 1) {
            setDeleting(false);
            setRoleIdx((i) => (i + 1) % roles.length);
          }
        }
      },
      deleting ? 35 : 70,
    );
    return () => clearTimeout(id);
  }, [typed, deleting, roleIdx, reduce, roles]);

  const facts = [
    {
      value: <CountUp to={10} suffix="+" />,
      label: isDe ? 'Jahre Praxis' : 'years hands-on',
      note: isDe ? 'Datenanalyse & IT-Engineering' : 'data analysis & IT engineering',
    },
    {
      value: <CountUp to={projectCount} />,
      label: isDe ? 'Bootcamp-Projekte' : 'bootcamp projects',
      note: isDe ? `${deckCount} mit Foliensatz` : `${deckCount} with slide decks`,
    },
    {
      value: <CountUp to={60} suffix="%" />,
      label: isDe ? 'schnellere Störungsbehebung' : 'faster incident response',
      note: 'Grafana + InfluxDB alerting',
    },
    {
      value: <span>MSc</span>,
      label: isDe ? 'Informatik' : 'Informatics',
      note: 'TU Clausthal',
    },
  ];

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden pt-10 pb-14 sm:pt-16 sm:pb-20">
      {/* Ambient network canvas (static under reduced motion) */}
      <InteractiveMeshCanvas />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] gap-10 lg:gap-14 items-center">
          {/* Message */}
          <motion.div variants={stagger} initial={reduce ? false : 'hidden'} animate="show" className="min-w-0">
            <motion.div variants={rise} className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-soft px-3 py-1 text-sm font-semibold text-success">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                {isDe ? 'Ab sofort verfügbar' : 'Available now'}
              </span>
            </motion.div>

            <motion.h1
              variants={rise}
              id="hero-title"
              className="font-display font-bold text-fg tracking-tight leading-[1.05] text-[2.75rem] sm:text-6xl lg:text-7xl"
            >
              <span className="relative inline-block">
                {PERSONAL_INFO.name}
                <span aria-hidden="true" className="jd-sweep absolute left-0 right-0 -bottom-1 h-1.5 rounded-full bg-accent" />
              </span>
            </motion.h1>

            <motion.p variants={rise} className="mt-5 font-mono text-base sm:text-lg text-teal min-h-[1.75rem]" aria-live="off">
              <span className="jd-visually-hidden">{roles.join(', ')}</span>
              <span aria-hidden="true">
                {typed}
                <span className="ml-0.5 inline-block w-2 h-5 align-[-3px] bg-accent motion-safe:animate-pulse" />
              </span>
            </motion.p>

            <motion.p variants={rise} className="mt-4 text-lg sm:text-xl leading-relaxed text-muted max-w-2xl">
              {isDe
                ? 'Ich verbinde Datenintelligenz und IT-Engineering zu robusten Systemen: über zehn Jahre Praxis, M.Sc. Informatik, und jetzt ML- und MLOps-Projekte im neuefische Bootcamp.'
                : 'I bridge data intelligence and IT engineering to build resilient systems: a decade of hands-on work, an MSc in Informatics, and now ML and MLOps projects in the neuefische bootcamp.'}
            </motion.p>

            <motion.p variants={rise} className="mt-3 flex items-center gap-2 text-base text-muted">
              <MapPin className="w-4 h-4 text-accent-fg shrink-0" aria-hidden="true" />
              <span>{isDe ? t.locationValue : PERSONAL_INFO.location}</span>
            </motion.p>

            <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3">
              <a
                href="#neuefische-journey"
                id="hero-journey-btn"
                onClick={(e) => scrollToSection(e, 'neuefische-journey')}
                className="jd-btn jd-btn--primary jd-btn--lg group w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
              >
                <GraduationCap className="w-5 h-5" aria-hidden="true" />
                {isDe ? 'Bootcamp-Projekte & Folien' : 'Bootcamp projects & slides'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
              {onOpenResume && (
                <button type="button" id="hero-resume-btn" onClick={onOpenResume} className="jd-btn jd-btn--secondary jd-btn--lg flex-1 sm:flex-none">
                  <Download className="w-4 h-4" aria-hidden="true" />
                  {isDe ? 'Lebenslauf (PDF)' : 'Download CV'}
                </button>
              )}
              <button type="button" id="hero-contact-btn" onClick={onOpenContact} className="jd-btn jd-btn--ghost jd-btn--lg flex-1 sm:flex-none">
                <Mail className="w-4 h-4" aria-hidden="true" />
                {isDe ? 'Kontakt' : 'Get in touch'}
              </button>
            </motion.div>

            {/* Headline facts */}
            <motion.dl variants={rise} className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 border-t border-line pt-6">
              {facts.map((f) => (
                <div key={f.label} className="min-w-0">
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="font-display font-bold text-3xl sm:text-4xl text-fg tabular-nums leading-none">{f.value}</dd>
                  <dd className="mt-2 text-sm font-semibold text-fg">{f.label}</dd>
                  <dd className="text-[13px] text-subtle leading-snug">{f.note}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* Portrait (desktop) */}
          <motion.div
            className="hidden lg:block"
            initial={reduce ? false : { opacity: 0, scale: 0.94, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1], delay: 0.15 }}
          >
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,var(--jd-accent),transparent_60%),radial-gradient(circle_at_80%_90%,var(--jd-teal),transparent_55%)] opacity-30 blur-2xl motion-safe:animate-[auroraDrift_18s_ease-in-out_infinite_alternate]"
              />
              <motion.div
                whileHover={reduce ? undefined : { y: -6, rotate: 0.6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="relative rounded-[1.75rem] overflow-hidden border border-line bg-surface shadow-[var(--jd-shadow-3)]"
              >
                <img
                  src="./jeevan-dutta.jpg"
                  alt={`${PERSONAL_INFO.name}, portrait`}
                  width={340}
                  height={400}
                  className="w-full aspect-[17/20] object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[rgb(15_27_45/0.85)] to-transparent">
                  <p className="text-sm font-semibold text-white">{isDe ? 'neuefische Bootcamp' : 'neuefische bootcamp'}</p>
                  <p className="text-[13px] text-white/85">AI, ML, Data Science, Data Eng & SE</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
