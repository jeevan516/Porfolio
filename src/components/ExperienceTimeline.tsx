import React, { useState } from 'react';
import { EXPERIENCES } from '../data/portfolioData';
import { 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Activity, 
  Layers, 
  Terminal, 
  Cpu, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Award
} from 'lucide-react';

export const ExperienceTimeline: React.FC = () => {
  const [filter, setFilter] = useState<'work' | 'education' | 'all'>('work');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'wadacon-gmbh': true,
    'cogent-networks': true,
    'radicalx-ai': false,
    'netidentity-analytics': false,
    'avast-technologies': false,
    'tu-clausthal-master-thesis': true,
  });

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredExperiences = EXPERIENCES.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const workCount = EXPERIENCES.filter(e => e.category === 'work').length;
  const eduCount = EXPERIENCES.filter(e => e.category === 'education').length;

  return (
    <section id="experience" className="py-20 border-t border-slate-800/80 relative overflow-hidden bg-slate-950/70">
      {/* Background Animated Gradient Mesh */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider mb-3">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              Career & Professional Track Record
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
              Work Experience & Academic Rigor
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Comprehensive industry engineering across enterprise IT infrastructure, automated observability, AI/ML APIs, and graduate computer science research in Germany.
            </p>
          </div>

          {/* Availability Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-lg shadow-emerald-950/40">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Immediate Availability
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Available for New Role · Across Germany (Immediate Start)
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Animated Career Progression Graphic */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                <TrendingUp className="w-4 h-4" />
                Career Evolution & Domain Architecture (2015 – 2026)
              </div>
              <h3 className="text-lg font-bold text-white mt-1 font-display">
                Engineering Progression: Software ➔ Infrastructure ➔ AI ➔ Industrial Telemetry
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/50">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                10+ Years Combined Track Record
              </span>
            </div>
          </div>

          {/* Animated Stages Stepper */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {/* Stage 1 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>2015 – 2018</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px]">3 Years</span>
              </div>
              <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                Software Developer
              </div>
              <div className="text-xs text-emerald-400 font-mono mt-0.5">Avast Technologies</div>
              <p className="text-[11px] text-slate-400 mt-2 leading-snug">
                Full-stack engineering, testable modular code, POC prototyping, and Agile sprints.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>2019 – 2025</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px]">6+ Years</span>
              </div>
              <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                IT Support Engineer
              </div>
              <div className="text-xs text-purple-400 font-mono mt-0.5">Cogent Networks (Stade)</div>
              <p className="text-[11px] text-slate-400 mt-2 leading-snug">
                Systems & network administration, enterprise hardware, VoIP, and mission-critical uptime.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>2021 (7 Mos)</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px]">Amsterdam</span>
              </div>
              <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                Data Analyst
              </div>
              <div className="text-xs text-amber-400 font-mono mt-0.5">Netidentity</div>
              <p className="text-[11px] text-slate-400 mt-2 leading-snug">
                Interactive Power BI dashboards, e-commerce KPI modeling, DAX data pipelines, and POCs.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>2023 – 2024</span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[10px]">AI Backend</span>
              </div>
              <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                Artificial Intelligence Eng.
              </div>
              <div className="text-xs text-indigo-400 font-mono mt-0.5">RadicalX (Google Gemini)</div>
              <p className="text-[11px] text-slate-400 mt-2 leading-snug">
                Vertex AI, Google Gemini Flights, FastAPI backend server, and automated data ingestion.
              </p>
            </div>

            {/* Stage 5 - WaDaCon */}
            <div className="p-4 rounded-xl bg-slate-900 border-2 border-emerald-500/50 shadow-lg shadow-emerald-950/50 group relative">
              <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-mono font-extrabold uppercase">
                Recent Tenure
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>2025 – 2026</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">Hamburg</span>
              </div>
              <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                IT Specialist (Observability)
              </div>
              <div className="text-xs text-emerald-400 font-mono mt-0.5">WaDaCon GmbH</div>
              <p className="text-[11px] text-slate-300 mt-2 leading-snug">
                Grafana/InfluxDB pipelines, Docker CI/CD, Teleport zero-trust, Teams alerts, AI anomaly detection.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-10 pb-4 border-b border-slate-800">
          <button
            onClick={() => setFilter('work')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
              filter === 'work'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Industry Work Experience
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
              filter === 'work' ? 'bg-slate-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
            }`}>
              {workCount} Roles
            </span>
          </button>

          <button
            onClick={() => setFilter('education')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
              filter === 'education'
                ? 'bg-purple-500 text-white font-bold shadow-lg shadow-purple-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Academic Research & Degree
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
              filter === 'education' ? 'bg-slate-950 text-purple-300' : 'bg-slate-800 text-slate-400'
            }`}>
              {eduCount} Programs
            </span>
          </button>

          <button
            onClick={() => setFilter('all')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
              filter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Unified Career Timeline
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
              filter === 'all' ? 'bg-slate-950 text-cyan-300' : 'bg-slate-800 text-slate-400'
            }`}>
              {EXPERIENCES.length}
            </span>
          </button>
        </div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-slate-800/80 ml-4 sm:ml-8 space-y-10">
          {filteredExperiences.map((item, idx) => {
            const isWork = item.category === 'work';
            const isExpanded = !!expandedItems[item.id];
            const isWaDaCon = item.id === 'wadacon-gmbh';
            const isCogent = item.id === 'cogent-networks';

            return (
              <div key={item.id} className="relative pl-6 sm:pl-10 group">
                
                {/* Timeline node icon */}
                <div className={`absolute -left-[17px] top-3 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110 ${
                  isWaDaCon
                    ? 'bg-emerald-500 border-white text-slate-950 shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-950'
                    : isWork 
                    ? 'bg-slate-900 border-emerald-400 text-emerald-400 shadow-md shadow-emerald-500/20' 
                    : 'bg-slate-900 border-purple-400 text-purple-400 shadow-md shadow-purple-500/20'
                }`}>
                  {isWork ? <Briefcase className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                </div>

                {/* Content Card */}
                <div className={`p-6 sm:p-7 rounded-2xl transition-all shadow-xl space-y-5 ${
                  isWaDaCon 
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/40 shadow-emerald-950/20' 
                    : 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-slate-700'
                }`}>
                  
                  {/* Top Metadata Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
                          isWaDaCon
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : isWork
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : 'bg-purple-950 text-purple-300 border border-purple-800'
                        }`}>
                          {item.employmentType || (isWork ? 'Industry Experience' : 'Academic Research')}
                        </span>
                        {isWaDaCon && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                            Available Immediately
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                        {item.role}
                      </h3>
                      <div className="text-sm sm:text-base font-semibold text-emerald-400 mt-0.5 flex items-center gap-2">
                        <span>{item.company}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap lg:flex-col lg:items-end gap-2 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded border border-slate-700/50 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        {item.period}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  {/* High-Level Overview */}
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Bullet achievements with accordion toggle */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        Key Accomplishments & Responsibilities ({item.achievements.length} Points):
                      </span>
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                      >
                        {isExpanded ? (
                          <><span>Collapse</span> <ChevronUp className="w-3.5 h-3.5" /></>
                        ) : (
                          <><span>Expand All ({item.achievements.length})</span> <ChevronDown className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    </div>

                    <ul className="space-y-2.5">
                      {(isExpanded ? item.achievements : item.achievements.slice(0, 3)).map((ach, aIdx) => (
                        <li key={aIdx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{ach}</span>
                        </li>
                      ))}
                    </ul>

                    {!isExpanded && item.achievements.length > 3 && (
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="w-full py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-xs font-mono text-slate-400 hover:text-white border border-slate-700/50 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Show {item.achievements.length - 3} more verified responsibilities from LinkedIn</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Tech stack tags */}
                  <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-slate-400 mr-2">Technologies & Skills:</span>
                    {item.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded text-xs font-mono bg-slate-800/80 text-cyan-300 border border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
