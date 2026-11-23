import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILL_CATEGORIES, CERTIFICATIONS } from '../data/portfolioData';
import { TargetRole, Certification } from '../types';
import { playTactileClick } from '../services/soundFx';
import { tint, type PaletteKey } from '../data/palette';

/** Colour group per skill card (shared accent palette). */
const SKILL_COLOR: Record<string, PaletteKey> = {
  Brain: 'ml',
  Activity: 'python',
  Server: 'mlops',
  Database: 'data',
  Cpu: 'api',
  Network: 'tools',
};
import {
  Brain,
  Activity,
  Server,
  Database,
  Network,
  Award,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  FileCheck,
  CheckSquare,
  Users,
  MessageSquare,
  TrendingUp,
  Globe,
  Briefcase,
  Layers,
  Binary,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface SkillsSectionProps {
  activeRole: TargetRole;
  language?: 'en' | 'de';
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Brain':
      return <Brain className="w-5 h-5 text-accent-fg" />;
    case 'Activity':
      return <Activity className="w-5 h-5 text-teal" />;
    case 'Server':
      return <Server className="w-5 h-5 text-info" />;
    case 'Database':
      return <Database className="w-5 h-5 text-info" />;
    case 'Network':
      return <Network className="w-5 h-5 text-teal" />;
    default:
      return <Cpu className="w-5 h-5 text-accent-fg" />;
  }
};

const CERT_ICONS: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-4 h-4 text-accent-fg" />,
  Brain: <Brain className="w-4 h-4 text-info" />,
  Cpu: <Cpu className="w-4 h-4 text-teal" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4 text-accent-fg" />,
  Award: <Award className="w-4 h-4 text-warning" />,
  FileCheck: <FileCheck className="w-4 h-4 text-info" />,
  Activity: <Activity className="w-4 h-4 text-teal" />,
  Users: <Users className="w-4 h-4 text-info" />,
  MessageSquare: <MessageSquare className="w-4 h-4 text-accent-fg" />,
  Layers: <Layers className="w-4 h-4 text-teal" />,
  CheckSquare: <CheckSquare className="w-4 h-4 text-teal" />,
  TrendingUp: <TrendingUp className="w-4 h-4 text-accent-fg" />,
  Server: <Server className="w-4 h-4 text-info" />,
  Database: <Database className="w-4 h-4 text-info" />,
  Binary: <Binary className="w-4 h-4 text-info" />,
  Globe: <Globe className="w-4 h-4 text-accent-fg" />,
  Radio: <Radio className="w-4 h-4 text-teal" />,
  Sparkles: <Sparkles className="w-4 h-4 text-warning" />,
};
const getCertIcon = (iconName: string) => CERT_ICONS[iconName] ?? <Award className="w-4 h-4 text-accent-fg" />;

type CertFilter = 'all' | '2026' | 'business-analysis' | 'ai-ml' | 'it-management' | 'data-eng' | 'languages';

const isRecent = (c: Certification) => c.year === '2026' || c.date.includes('2026');

const matchesFilter = (c: Certification, f: CertFilter) =>
  f === 'all' ? true : f === '2026' ? isRecent(c) : c.category === f;

export const SkillsSection: React.FC<SkillsSectionProps> = ({ language = 'en' }) => {
  const isDe = language === 'de';
  const [certFilter, setCertFilter] = useState<CertFilter>('all');

  const filteredCerts = CERTIFICATIONS.filter((c) => matchesFilter(c, certFilter));

  const certTabs: { id: CertFilter; label: string }[] = [
    { id: 'all', label: isDe ? 'Alle' : 'All' },
    { id: '2026', label: '2026' },
    { id: 'business-analysis', label: isDe ? 'Business-Analyse' : 'Business Analysis' },
    { id: 'it-management', label: 'ITIL & SAP' },
    { id: 'ai-ml', label: isDe ? 'KI & VLSI' : 'AI & VLSI' },
    { id: 'data-eng', label: 'Data & BI' },
    { id: 'languages', label: isDe ? 'Sprachen' : 'Languages' },
  ];

  return (
    <section id="skills" className="py-16 sm:py-20 border-t border-line/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-accent-fg font-semibold uppercase tracking-wider mb-3">
            <Cpu className="w-4 h-4" aria-hidden="true" />
            {isDe ? 'Kompetenzen' : 'Skills'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-fg tracking-tight">
            {isDe ? 'Fähigkeiten & Technologie-Stack' : 'Technical Skills & Stack'}
          </h2>
          <p className="text-muted text-sm sm:text-base mt-2 leading-relaxed">
            {isDe
              ? 'Erprobt in Industrieanlagen, in der Deep-Learning-Forschung an der TU Clausthal und in IT- & Load-Balancing-Infrastruktur.'
              : 'Applied in industrial facilities, deep learning research at TU Clausthal, and IT & load-balancing infrastructure.'}
          </p>
        </div>

        {/* Skill Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SKILL_CATEGORIES.map((cat, idx) => {
            const key = SKILL_COLOR[cat.icon] ?? 'mlops';
            const fill = `var(--c-${key})`;
            const text = `var(--c-${key}-text)`;
            return (
            <motion.div
              key={cat.title}
              id={`skill-category-${cat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="accent-card p-6 rounded-2xl bg-surface/70 border border-line hover:-translate-y-1"
              style={{ '--card-c': fill } as React.CSSProperties}
            >
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-line">
                <div className="p-2.5 rounded-xl border [&_svg]:!text-current" style={{ background: tint(fill, 16), borderColor: tint(fill, 45), color: text }}>
                  {getCategoryIcon(cat.icon)}
                </div>
                <h3 className="font-display font-bold text-base text-fg">{cat.title}</h3>
              </div>

              <ul className="space-y-3.5">
                {cat.skills.map((skill, sIdx) => (
                  <li key={skill.name} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span
                        className={`flex items-center gap-1.5 min-w-0 ${
                          skill.highlight ? 'text-fg font-semibold' : 'text-muted font-medium'
                        }`}
                      >
                        {skill.highlight && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: fill }} aria-hidden="true" />}
                        <span className="truncate">{skill.name}</span>
                      </span>
                      <span className="font-mono text-xs text-muted shrink-0">{skill.experience}</span>
                    </div>
                    <div
                      className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden"
                      role="meter"
                      aria-label={skill.name}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={skill.level}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: skill.highlight ? fill : tint(fill, 45) }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.15 + sIdx * 0.04, ease: 'easeOut' }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <div className="pt-10 border-t border-line/80">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
            <div>
              <h3 className="flex items-center gap-2 text-xl sm:text-2xl font-display font-bold text-fg">
                <Award className="w-5 h-5 text-accent-fg" aria-hidden="true" />
                {isDe ? 'Zertifizierungen' : 'Certifications'}
                <span className="text-sm font-mono font-normal text-subtle">({CERTIFICATIONS.length})</span>
              </h3>
              <p className="text-muted text-xs sm:text-sm mt-1">IIBA®, PMI®, CompTIA®, NASBA, Microsoft, Coursera, SAP & BAMF.</p>
            </div>

            <div
              role="tablist"
              aria-label={isDe ? 'Zertifikate filtern' : 'Filter certifications'}
              className="flex flex-wrap gap-1 p-1 bg-surface/80 border border-line rounded-xl self-start lg:self-auto"
            >
              {certTabs.map((tab) => {
                const active = certFilter === tab.id;
                const count = CERTIFICATIONS.filter((c) => matchesFilter(c, tab.id)).length;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      playTactileClick();
                      setCertFilter(tab.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 ${
                      active ? 'bg-surface-2 text-fg border-line-strong' : 'text-muted hover:text-fg border-transparent'
                    }`}
                  >
                    {tab.label}
                    <span className={`ml-1.5 font-mono text-xs ${active ? 'text-accent-fg' : 'text-subtle'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredCerts.map((cert) => (
                <motion.div
                  key={cert.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-2xl bg-surface/70 border border-line hover:border-line-strong transition-colors duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs mb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1 rounded-md bg-surface-2 border border-line-strong shrink-0">{getCertIcon(cert.icon)}</div>
                        <span className="font-semibold text-accent-fg truncate">{cert.issuer}</span>
                      </div>
                      <span className="text-xs font-mono text-subtle shrink-0">{cert.date}</span>
                    </div>

                    <h4 className="text-sm font-bold text-fg leading-snug">{cert.title}</h4>

                    {cert.accreditation && (
                      <p className="text-xs text-muted mt-1.5 flex items-start gap-1">
                        <CheckCircle2 className="w-3 h-3 text-accent-fg shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{cert.accreditation}</span>
                      </p>
                    )}
                    {cert.certificateId && (
                      <p className="mt-1 text-xs font-mono text-subtle truncate">ID {cert.certificateId}</p>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-line flex items-end justify-between gap-2">
                    <div className="flex flex-wrap gap-1 min-w-0">
                      {cert.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md text-xs font-mono bg-surface-2/80 text-muted">
                          {s}
                        </span>
                      ))}
                    </div>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${isDe ? 'Nachweis ansehen' : 'View credential'}: ${cert.title}`}
                        title={isDe ? 'Nachweis ansehen' : 'View credential'}
                        className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg text-muted hover:text-accent-fg hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
