import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TargetRole } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';
import { NeuralNetworkCanvas } from './graphics/NeuralNetworkCanvas';
import { IndustrialIoTMonitor } from './graphics/IndustrialIoTMonitor';
import { VLSIIntegratedCircuitGraphic } from './graphics/VLSIIntegratedCircuitGraphic';
import { InteractiveMeshCanvas } from './graphics/InteractiveMeshCanvas';
import { SpotlightCard } from './ui/SpotlightCard';
import { playTactileClick, playHoverTick } from '../services/soundFx';
import { 
  Brain, 
  Activity, 
  Server, 
  Database, 
  ArrowDown, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Cpu,
  Play,
  Video,
  Network,
  Download
} from 'lucide-react';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a12]';
const BTN_PRIMARY = `inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-colors ${FOCUS_RING}`;
const BTN_SECONDARY = `inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:border-emerald-500/50 bg-slate-900/60 text-slate-200 hover:text-white text-sm font-semibold transition-colors ${FOCUS_RING}`;
const BTN_TEXT = `inline-flex items-center gap-1.5 rounded-md text-slate-400 hover:text-emerald-400 transition-colors ${FOCUS_RING}`;

interface HeroProps {
  activeRole: TargetRole;
  setActiveRole: (role: TargetRole) => void;
  onOpenContact: () => void;
  onOpenBrief: () => void;
  onOpenResume?: () => void;
  language?: 'en' | 'de';
}

export const Hero: React.FC<HeroProps> = ({
  activeRole,
  setActiveRole,
  onOpenContact,
  onOpenBrief,
  onOpenResume,
  language = 'en',
}) => {
  const [activeGraphic, setActiveGraphic] = useState<'neural' | 'iot' | 'vlsi'>('vlsi');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const t = TRANSLATIONS[language].hero;

  // Typewriter effect cycling through signature roles
  const roles = [
    'IT Specialist & AI Engineer',
    'MSc Informatics (TU Clausthal)',
    'Industrial IoT Observability Architect',
    'Full-Stack & Cloud Infrastructure Lead',
    'Distributed Systems & Load Balancer Specialist'
  ];
  const [roleIdx, setRoleIdx] = useState(0);
  const [typedRole, setTypedRole] = useState('');
  const [isDeletingRole, setIsDeletingRole] = useState(false);

  useEffect(() => {
    const cur = roles[roleIdx];
    const speed = isDeletingRole ? 35 : 75;
    const timer = setTimeout(() => {
      if (!isDeletingRole) {
        setTypedRole(cur.substring(0, typedRole.length + 1));
        if (typedRole.length + 1 === cur.length) {
          setTimeout(() => setIsDeletingRole(true), 2200);
        }
      } else {
        setTypedRole(cur.substring(0, typedRole.length - 1));
        if (typedRole.length === 0) {
          setIsDeletingRole(false);
          setRoleIdx((prev) => (prev + 1) % roles.length);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [typedRole, isDeletingRole, roleIdx]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Clipboard unavailable (insecure context / permissions) — fall back to the mail client
      window.location.href = `mailto:${PERSONAL_INFO.email}`;
    }
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

  return (
    <section id="hero" className="relative pt-8 pb-16 overflow-hidden">
      {/* Background ambient mesh network canvas */}
      <InteractiveMeshCanvas />

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-600/10 via-cyan-500/15 to-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-start sm:items-center gap-2.5 px-4 py-1.5 rounded-2xl sm:rounded-full bg-slate-900/90 border border-emerald-500/40 text-xs text-slate-300 backdrop-blur-md max-w-full">
            <span className="relative flex h-2 w-2 shrink-0 mt-1 sm:mt-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-300 font-medium">{t.statusValue}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>{t.locationLabel}</span>
            <span className="text-slate-200 font-medium">{language === 'de' ? 'Hamburg, Deutschland (Vor-Ort / Hybrid / Remote)' : PERSONAL_INFO.location}</span>
          </div>
        </div>

        {/* Hero Title, Executive Portrait & Pitch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            
            {/* Executive Portrait & Identity Header with Spotlight & 3D Tilt */}
            <SpotlightCard
              enableTilt={true}
              spotlightColor="rgba(16, 185, 129, 0.22)"
              className="p-5 shadow-2xl shadow-emerald-950/30 backdrop-blur-md"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ring-emerald-500/60 shadow-xl shadow-emerald-500/20 bg-slate-800">
                    <img
                      src="./jeevan-dutta.jpg"
                      alt="Jeevan Dutta - MSc Informatics TU Clausthal"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-slate-900"></span>
                  </span>
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                      {PERSONAL_INFO.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                      {t.degreeBadge}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 min-h-[22px]">
                    <p className="text-xs sm:text-sm text-cyan-300 font-mono font-semibold">
                      {typedRole}
                    </p>
                    <span className="w-1.5 h-3.5 bg-emerald-400 animate-pulse inline-block" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {language === 'de' ? 'Sofortige Verfügbarkeit' : 'Immediate Availability'}
                    </span>
                    <span>·</span>
                    <span>{language === 'de' ? 'Hamburg, Deutschland' : 'Hamburg, Germany'}</span>
                    <span>·</span>
                    <span className="text-purple-300">{t.supervisor}</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>

            <div className="space-y-2">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {t.headlineStart} <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">{t.headlineData}</span> {t.headlineAnd} <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">{t.headlineInfra}</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              {t.bio}
            </p>

            {/* Recruiter Role Quick-Filter Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {t.filterHeading}
                </span>
                <span className="hidden sm:inline text-[11px] text-slate-500">{t.filterSub}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: t.allRoles, icon: Sparkles },
                  { id: 'ai-ml', label: t.aiRole, icon: Brain },
                  { id: 'it-devops', label: t.devopsRole, icon: Server },
                  { id: 'observability', label: t.obsRole, icon: Activity },
                  { id: 'data-eng', label: t.dataRole, icon: Database },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeRole === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      id={`filter-role-${item.id}`}
                      onClick={() => {
                        playTactileClick();
                        setActiveRole(item.id as TargetRole);
                      }}
                      aria-pressed={isActive}
                      whileTap={{ scale: 0.96 }}
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors z-10 ${FOCUS_RING} ${
                        isActive
                          ? 'text-slate-950'
                          : 'bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeHeroRolePill"
                          className="absolute inset-0 bg-emerald-500 rounded-lg -z-10"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#video-portfolio"
                  id="hero-watch-video-btn"
                  onClick={(e) => scrollToSection(e, 'video-portfolio')}
                  className={`${BTN_PRIMARY} group`}
                >
                  <Play className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform" />
                  <span>{t.watchVideo}</span>
                </a>

                <button id="hero-contact-btn" onClick={onOpenContact} className={BTN_SECONDARY}>
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>{t.hireJeevan}</span>
                </button>

                {onOpenResume && (
                  <button
                    id="hero-resume-btn"
                    onClick={onOpenResume}
                    className={BTN_SECONDARY}
                    title={language === 'de' ? 'Lebenslauf als PDF exportieren' : 'Export and download CV as PDF'}
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'de' ? 'CV (PDF)' : 'Download CV'}</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <a
                  href="#observability"
                  id="hero-load-balancers-btn"
                  onClick={(e) => scrollToSection(e, 'observability')}
                  className={`${BTN_TEXT} group`}
                >
                  <Network className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                  <span>{language === 'de' ? 'Load Balancer & Studio' : 'Load Balancers & Studio'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>

                <button
                  id="hero-copy-email-btn"
                  onClick={handleCopyEmail}
                  className={`${BTN_TEXT} font-mono text-xs break-all`}
                  aria-label={language === 'de' ? 'E-Mail-Adresse kopieren' : 'Copy email address'}
                  title={language === 'de' ? 'E-Mail-Adresse kopieren' : 'Copy email address'}
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                  <span aria-live="polite">{copiedEmail ? t.copied : PERSONAL_INFO.email}</span>
                </button>
              </div>
            </div>

            {/* Quick KPI stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
              {[
                { label: t.stats.academic, value: t.stats.academicVal, detail: t.stats.academicDetail },
                { label: t.stats.thesis, value: t.stats.thesisVal, detail: t.stats.thesisDetail },
                { label: t.stats.status, value: t.stats.statusVal, detail: t.stats.statusDetail },
                { label: t.stats.ttr, value: t.stats.ttrVal, detail: t.stats.ttrDetail },
              ].map((stat, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <div className="text-base sm:text-lg font-extrabold font-display text-white">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-400">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate" title={stat.detail}>
                    {stat.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: High-End Live Interactive Graphics */}
          <div className="lg:col-span-5 space-y-3">
            {/* Graphic Switcher Header */}
            <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex-wrap gap-2">
              <span className="text-xs font-semibold text-slate-300 px-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                {language === 'de' ? 'Visualisierung' : 'Visualization'}
              </span>
              <div className="flex items-center gap-1 text-xs">
                {[
                  { id: 'vlsi', label: 'VLSI Circuits', color: 'text-purple-300', activeBg: 'bg-purple-500/20 border-purple-500/40' },
                  { id: 'neural', label: 'Deep Learning', color: 'text-emerald-300', activeBg: 'bg-emerald-500/20 border-emerald-500/40' },
                  { id: 'iot', label: 'Industrial IoT', color: 'text-cyan-300', activeBg: 'bg-cyan-500/20 border-cyan-500/40' },
                ].map((tab) => {
                  const isActive = activeGraphic === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      id={`tab-graphic-${tab.id}`}
                      onClick={() => {
                        playTactileClick();
                        setActiveGraphic(tab.id as any);
                      }}
                      aria-pressed={isActive}
                      className={`relative px-2.5 py-1 rounded-lg font-medium text-xs transition-colors ${FOCUS_RING} ${
                        isActive ? `${tab.color} font-bold` : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeGraphicTabPill"
                          className={`absolute inset-0 rounded-lg border ${tab.activeBg} -z-10`}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span>{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Display Active Graphic with AnimatePresence */}
            <div className="relative min-h-[360px] overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGraphic}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {activeGraphic === 'vlsi' && <VLSIIntegratedCircuitGraphic />}
                  {activeGraphic === 'neural' && <NeuralNetworkCanvas />}
                  {activeGraphic === 'iot' && <IndustrialIoTMonitor />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Key Engineering Rigor Card */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Full-Stack Rigor: </span>
                From microelectronic VLSI circuit design under Prof. Dr. Christian Siemers (TU Clausthal) to production industrial IoT observability & automated alerting at WaDaCon GmbH.
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
