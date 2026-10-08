import React, { useState, useEffect } from 'react';
import { TargetRole } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';
import { NeuralNetworkCanvas } from './graphics/NeuralNetworkCanvas';
import { IndustrialIoTMonitor } from './graphics/IndustrialIoTMonitor';
import { VLSIIntegratedCircuitGraphic } from './graphics/VLSIIntegratedCircuitGraphic';
import { 
  Brain, 
  Activity, 
  Server, 
  Database, 
  ArrowDown, 
  Mail, 
  Copy, 
  Check, 
  FileText, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Cpu,
  Play,
  Video,
  Network
} from 'lucide-react';

interface HeroProps {
  activeRole: TargetRole;
  setActiveRole: (role: TargetRole) => void;
  onOpenContact: () => void;
  onOpenBrief: () => void;
  language?: 'en' | 'de';
}

export const Hero: React.FC<HeroProps> = ({
  activeRole,
  setActiveRole,
  onOpenContact,
  onOpenBrief,
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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="hero" className="relative pt-8 pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-600/10 via-cyan-500/15 to-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Announcement Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/95 border border-emerald-500/40 text-xs text-slate-300 shadow-lg shadow-emerald-500/10 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white font-mono uppercase tracking-wider text-[11px]">{t.statusLabel}</span>
            <span className="text-emerald-400 font-semibold">{t.statusValue}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>{t.locationLabel}</span>
            <span className="text-slate-200 font-semibold">{language === 'de' ? 'Hamburg, Deutschland (Vor-Ort / Hybrid / Remote)' : PERSONAL_INFO.location}</span>
          </div>
        </div>

        {/* Hero Title, Executive Portrait & Pitch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            
            {/* Executive Portrait & Identity Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg shadow-black/30">
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
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
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
                <span className="text-[11px] font-mono text-slate-500">{t.filterSub}</span>
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
                    <button
                      key={item.id}
                      id={`filter-role-${item.id}`}
                      onClick={() => setActiveRole(item.id as TargetRole)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-[1.02]'
                          : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#video-portfolio"
                id="hero-watch-video-btn"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all group"
              >
                <div className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-slate-950 ml-0.5 text-slate-950 group-hover:scale-110 transition-transform" />
                </div>
                <span>{t.watchVideo}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-950/20 text-slate-950 font-bold border border-slate-950/30">
                  {language.toUpperCase()}
                </span>
              </a>

              <a
                href="#observability"
                id="hero-load-balancers-btn"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-emerald-500/30 hover:border-emerald-400 text-sm font-semibold transition-all group"
              >
                <Network className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span>{language === 'de' ? 'Load Balancer & Studio' : 'Load Balancers & Studio'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </a>

              <button
                id="hero-contact-btn"
                onClick={onOpenContact}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/90 text-sm font-semibold transition-all hover:border-emerald-500/40"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>{t.hireJeevan}</span>
              </button>

              <button
                id="hero-brief-btn"
                onClick={onOpenBrief}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/90 text-sm font-semibold transition-all"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>{t.briefBtn}</span>
              </button>

              <button
                id="hero-copy-email-btn"
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-all"
                title="Copy Email Address"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedEmail ? t.copied : PERSONAL_INFO.email}</span>
              </button>
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
                  <div className="text-[10px] text-slate-400 truncate">
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
                Engineering Graphic:
              </span>
              <div className="flex items-center gap-1 text-xs">
                <button
                  id="tab-graphic-vlsi"
                  onClick={() => setActiveGraphic('vlsi')}
                  className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
                    activeGraphic === 'vlsi'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  VLSI Circuits (Siemers)
                </button>
                <button
                  id="tab-graphic-neural"
                  onClick={() => setActiveGraphic('neural')}
                  className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
                    activeGraphic === 'neural'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Deep Learning
                </button>
                <button
                  id="tab-graphic-iot"
                  onClick={() => setActiveGraphic('iot')}
                  className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
                    activeGraphic === 'iot'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Industrial IoT
                </button>
              </div>
            </div>

            {/* Display Active Graphic */}
            <div className="transition-all duration-300">
              {activeGraphic === 'vlsi' && <VLSIIntegratedCircuitGraphic />}
              {activeGraphic === 'neural' && <NeuralNetworkCanvas />}
              {activeGraphic === 'iot' && <IndustrialIoTMonitor />}
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
