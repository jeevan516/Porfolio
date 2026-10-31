import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Github,
  ArrowRight,
  Layers,
  Cpu,
  Activity,
  Copy,
  Check,
  Download,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { PERSONAL_INFO, PROJECTS_DATA, SKILL_CATEGORIES, EXPERIENCES, CERTIFICATIONS } from '../data/portfolioData';
import { NeuralNetworkCanvas } from './graphics/NeuralNetworkCanvas';
import { CareerTrajectoryChartSection } from './CareerTrajectoryChartSection';
import { TechNewsSection } from './TechNewsSection';
import { VisitorTrackerBlock } from './VisitorTrackerBlock';

interface ClassicPortfolioViewProps {
  onOpenContact: () => void;
  onOpenBrief: () => void;
  onOpenResume?: () => void;
  language?: 'en' | 'de';
}

const ROLES = [
  'IT Specialist & AI Engineer',
  'MSc Informatics (TU Clausthal)',
  'Industrial IoT Observability Architect',
  'Full-Stack & Cloud Infrastructure Lead',
  'Distributed Systems & Load Balancer Specialist',
];

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60';
const btnPrimary = `inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors ${focusRing}`;
const btnSecondary = `inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-300 font-semibold text-sm transition-colors ${focusRing}`;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const SectionHeader: React.FC<{ tag: string; title: string; desc?: string }> = ({ tag, title, desc }) => (
  <div className="max-w-2xl mb-10">
    <div className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider mb-3">{tag}</div>
    <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">{title}</h2>
    {desc && <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">{desc}</p>}
  </div>
);

export const ClassicPortfolioView: React.FC<ClassicPortfolioViewProps> = ({ onOpenContact, onOpenResume, language = 'en' }) => {
  const isDe = language === 'de';

  const [roleIndex, setRoleIndex] = useState(0);
  const [subText, setSubText] = useState(() => (prefersReducedMotion() ? ROLES[0] : ''));
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const matrixCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Typewriter effect cycling through roles (static when reduced motion is requested)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const currentRole = ROLES[roleIndex];
    const full = subText === currentRole;

    let delay = isDeleting ? 40 : 80;
    if (!isDeleting && full) delay = 2000;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (full) setIsDeleting(true);
        else setSubText(currentRole.substring(0, subText.length + 1));
      } else if (subText.length === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      } else {
        setSubText(currentRole.substring(0, subText.length - 1));
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [subText, isDeleting, roleIndex]);

  // Matrix data rain canvas animation
  useEffect(() => {
    const canvas = matrixCanvasRef.current;
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const HEIGHT = 420;
    const COL = 20;
    let animId = 0;
    let width = 0;
    let drops: number[] = [];
    const chars = '010101010101ABCDEFλθπτΣΩ{}[]()<>=/\\*+';

    const setup = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = HEIGHT;
      const columns = Math.ceil(width / COL);
      drops = Array.from({ length: columns }, (_, i) => drops[i] ?? Math.random() * -50);
    };
    setup();
    window.addEventListener('resize', setup);

    const draw = () => {
      ctx.fillStyle = 'rgba(6, 10, 18, 0.15)';
      ctx.fillRect(0, 0, width, HEIGHT);
      ctx.font = '12px "JetBrains Mono", monospace';
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * COL;
        ctx.fillStyle = Math.random() > 0.85 ? '#6ee7b7' : 'rgba(16, 185, 129, 0.4)';
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * COL, y);
        if (y > HEIGHT && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.55;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', setup);
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      window.location.href = `mailto:${PERSONAL_INFO.email}`;
    }
  };

  const telHref = `tel:${PERSONAL_INFO.phone.replace(/[^\d+]/g, '')}`;

  const contactCards = [
    { icon: Mail, label: 'Email', value: PERSONAL_INFO.email, href: `mailto:${PERSONAL_INFO.email}` },
    { icon: Phone, label: isDe ? 'Telefon' : 'Phone', value: PERSONAL_INFO.phone, href: telHref },
    { icon: Linkedin, label: 'LinkedIn', value: '/in/jeevan-dutta', href: PERSONAL_INFO.linkedin, external: true },
    { icon: Github, label: 'GitHub', value: '@jeevan516', href: PERSONAL_INFO.github, external: true },
  ];

  return (
    <div className="w-full relative min-h-screen text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Hero */}
      <section className="relative pt-12 pb-16 sm:pb-20 overflow-hidden border-b border-slate-800/80">
        <div className="absolute inset-x-0 top-0 h-[420px] pointer-events-none opacity-30 -z-10 overflow-hidden" aria-hidden="true">
          <canvas ref={matrixCanvasRef} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070a12]/70 to-[#070a12]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 text-xs text-emerald-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            {isDe ? 'Sofort verfügbar · KI- & ML-Bootcamp' : 'Available immediately · AI & ML Bootcamp'}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6 min-w-0">
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight">
                  Jeevan <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Dutta</span>
                </h1>
                <div className="min-h-8 flex items-center" aria-live="off">
                  <p className="text-base sm:text-xl font-mono text-emerald-300 font-medium">
                    <span className="sr-only">{ROLES.join(', ')}</span>
                    <span aria-hidden="true">
                      {subText}
                      <span className="inline-block w-2 h-5 ml-1 align-middle bg-emerald-400 animate-pulse" />
                    </span>
                  </p>
                </div>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {isDe
                  ? 'Verbindung von Datenintelligenz & IT-Engineering zur Optimierung industrieller Prozesse. Entwicklung von Observability-Pipelines, KI-gestützten Systemen und robuster IT-Infrastruktur mit Masterabschluss der TU Clausthal.'
                  : 'Bridging Data Intelligence & IT Engineering to revolutionize industrial operations. I build observability pipelines, AI-powered systems, and resilient infrastructure that transform how industries operate.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button type="button" onClick={onOpenContact} className={btnPrimary}>
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  {isDe ? 'Kontakt aufnehmen' : 'Get in touch'}
                </button>
                {onOpenResume && (
                  <button type="button" onClick={onOpenResume} className={btnSecondary}>
                    <Download className="w-4 h-4" aria-hidden="true" />
                    {isDe ? 'Lebenslauf (PDF)' : 'Download CV'}
                  </button>
                )}
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" title="LinkedIn" className={`p-2.5 rounded-xl border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 transition-colors ${focusRing}`}>
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" title="GitHub" className={`p-2.5 rounded-xl border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 transition-colors ${focusRing}`}>
                  <Github className="w-5 h-5" />
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label={copiedEmail ? 'Email copied' : 'Copy email address'}
                  title={copiedEmail ? 'Copied' : 'Copy email'}
                  className={`p-2.5 rounded-xl border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 transition-colors ${focusRing}`}
                >
                  {copiedEmail ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
                <span aria-live="polite" className="sr-only">
                  {copiedEmail ? 'Email copied to clipboard' : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
                {[
                  { value: '10+', label: isDe ? 'Jahre Erfahrung' : 'Years experience' },
                  { value: '5', label: isDe ? 'Unternehmen' : 'Companies' },
                  { value: '60%', label: isDe ? 'Schnellere Zyklen' : 'Cycle time reduction' },
                  { value: 'MSc', label: 'TU Clausthal' },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                    <div className="text-xl sm:text-2xl font-bold font-display text-emerald-400">{s.value}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 min-w-0">
              <div className="rounded-2xl bg-slate-950/80 p-4 border border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800 text-xs font-semibold text-emerald-400">
                  <Cpu className="w-4 h-4" aria-hidden="true" />
                  {isDe ? 'Sequenzmodell-Architektur' : 'Deep sequence model'}
                </div>
                <NeuralNetworkCanvas />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag={isDe ? 'Projekte' : 'Projects'}
          title={isDe ? 'Ausgewählte Projekte' : 'Featured Projects'}
          desc={isDe ? 'Projekte aus KI/ML, Cloud-Infrastruktur, Data Engineering und Backend-Entwicklung.' : 'Projects spanning AI/ML, cloud infrastructure, data engineering, and backend development.'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS_DATA.map((proj) => (
            <article
              key={proj.id}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:-translate-y-1 transition-[border-color,translate] duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-emerald-400">
                    {proj.category === 'ai-ml' ? <Cpu className="w-5 h-5" /> : proj.category === 'observability' ? <Activity className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                  </div>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${proj.title} on GitHub`}
                      title="GitHub"
                      className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${focusRing}`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-white leading-snug">{proj.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{proj.tagline}</p>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed line-clamp-4">{proj.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.slice(0, 4).map((t) => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/70 border border-slate-700/50 text-slate-300">
                      {t}
                    </span>
                  ))}
                  {proj.tags.length > 4 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">+{proj.tags.length - 4}</span>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                <span className="text-emerald-400 truncate font-medium">{proj.metrics?.[0]?.value || proj.status}</span>
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-slate-300 hover:text-emerald-300 inline-flex items-center gap-1 shrink-0 rounded ${focusRing}`}
                  >
                    {isDe ? 'Repository' : 'View repo'}
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 sm:py-20 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            tag={isDe ? 'Kompetenzen' : 'Skills'}
            title={isDe ? 'Technische Fähigkeiten' : 'Technical Skills'}
            desc={isDe ? 'Infrastruktur, Data Engineering, KI/ML und Softwareentwicklung.' : 'A broad toolkit spanning infrastructure, data engineering, AI/ML, and software development.'}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.title} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-sm text-white font-display">{cat.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((s) => (
                    <span
                      key={s.name}
                      className={`text-xs px-3 py-1 rounded-full border ${
                        s.highlight ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold' : 'bg-slate-800/60 border-slate-700/50 text-slate-300'
                      }`}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-16 sm:py-20 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            tag={isDe ? 'Werdegang' : 'Career'}
            title={isDe ? 'Berufserfahrung' : 'Work Experience'}
            desc={isDe ? 'Observability, KI-Engineering, Datenanalyse und Full-Stack-Entwicklung.' : 'A track record across observability, AI engineering, data analysis, and full-stack development.'}
          />
          <ol className="space-y-6 relative before:absolute before:top-0 before:bottom-0 before:left-[11px] before:w-0.5 before:bg-slate-800">
            {EXPERIENCES.map((exp) => (
              <li key={exp.id} className="relative pl-10">
                <div className="absolute left-0 top-6 w-6 h-6 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center" aria-hidden="true">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <article className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-white font-display">{exp.company}</h3>
                      <div className="text-sm font-semibold text-emerald-300">{exp.role}</div>
                    </div>
                    <span className="self-start text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shrink-0">
                      {exp.period}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                    {exp.location}
                  </div>
                  <ul className="space-y-1.5 pt-1 text-sm text-slate-300 leading-relaxed">
                    {exp.achievements.slice(0, 4).map((a, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.technologies.slice(0, 6).map((tech) => (
                      <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CareerTrajectoryChartSection language={language} />

      {/* Education & Certifications */}
      <section className="py-16 sm:py-20 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
              {isDe ? 'Studium' : 'Education'}
            </h2>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Master of Science — Informatics</h3>
              <div className="text-sm text-slate-200 mt-1 font-medium">Technische Universität Clausthal</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">October 2019 — June 2023 · Germany</div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Master’s Thesis:{' '}
              <em>
                “Definition, Development and Simulation of a 4-Node Communication Network for Reliable Reaction Times Inside Distributed
                Networks”
              </em>{' '}
              supervised by Prof. Dr. Christian Siemers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              {isDe ? 'Zertifizierungen' : 'Certifications'} ({CERTIFICATIONS.length})
            </h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {CERTIFICATIONS.slice(0, 5).map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800 last:border-0">
                  <span className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                    <span className="truncate">{c.title}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 shrink-0">{c.issuer}</span>
                </li>
              ))}
            </ul>
            {CERTIFICATIONS.length > 5 && (
              <p className="text-xs text-slate-500">
                +{CERTIFICATIONS.length - 5} {isDe ? 'weitere' : 'more'}
              </p>
            )}
          </div>
        </div>
      </section>

      <TechNewsSection language={language} />
      <VisitorTrackerBlock language={language} />

      {/* Contact */}
      <section className="py-16 sm:py-20 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            tag={isDe ? 'Kontakt' : 'Contact'}
            title={isDe ? 'Kontakt aufnehmen' : 'Get in Touch'}
            desc={isDe ? 'Offen für Rollen in IT-Infrastruktur, Data Engineering, KI/ML und Softwareentwicklung.' : 'Open to opportunities in IT infrastructure, data engineering, AI/ML, and software development.'}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactCards.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.label}
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 hover:-translate-y-0.5 transition-[border-color,translate] space-y-2 group min-w-0 ${focusRing}`}
                >
                  <Icon className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                  <div className="text-xs text-slate-400">{c.label}</div>
                  <div className="text-sm text-white group-hover:text-emerald-300 truncate">{c.value}</div>
                </a>
              );
            })}
          </div>

          <p className="mt-6 flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            {PERSONAL_INFO.location}
          </p>
        </div>
      </section>
    </div>
  );
};
