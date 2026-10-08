import React, { useState } from 'react';
import { SKILL_CATEGORIES, CERTIFICATIONS } from '../data/portfolioData';
import { TargetRole } from '../types';
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
  Filter,
  Radio
} from 'lucide-react';

interface SkillsSectionProps {
  activeRole: TargetRole;
  language?: 'en' | 'de';
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Brain':
      return <Brain className="w-5 h-5 text-emerald-400" />;
    case 'Activity':
      return <Activity className="w-5 h-5 text-cyan-400" />;
    case 'Server':
      return <Server className="w-5 h-5 text-blue-400" />;
    case 'Database':
      return <Database className="w-5 h-5 text-indigo-400" />;
    case 'Network':
      return <Network className="w-5 h-5 text-teal-400" />;
    default:
      return <Cpu className="w-5 h-5 text-emerald-400" />;
  }
};

const getCertIcon = (iconName: string) => {
  switch (iconName) {
    case 'Briefcase':
      return <Briefcase className="w-4 h-4 text-emerald-400" />;
    case 'Brain':
      return <Brain className="w-4 h-4 text-purple-400" />;
    case 'Cpu':
      return <Cpu className="w-4 h-4 text-cyan-400" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    case 'Award':
      return <Award className="w-4 h-4 text-amber-400" />;
    case 'FileCheck':
      return <FileCheck className="w-4 h-4 text-blue-400" />;
    case 'Activity':
      return <Activity className="w-4 h-4 text-teal-400" />;
    case 'Users':
      return <Users className="w-4 h-4 text-indigo-400" />;
    case 'MessageSquare':
      return <MessageSquare className="w-4 h-4 text-emerald-400" />;
    case 'Layers':
      return <Layers className="w-4 h-4 text-cyan-400" />;
    case 'CheckSquare':
      return <CheckSquare className="w-4 h-4 text-teal-400" />;
    case 'TrendingUp':
      return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    case 'Server':
      return <Server className="w-4 h-4 text-blue-400" />;
    case 'Database':
      return <Database className="w-4 h-4 text-indigo-400" />;
    case 'Binary':
      return <Binary className="w-4 h-4 text-purple-400" />;
    case 'Globe':
      return <Globe className="w-4 h-4 text-emerald-400" />;
    case 'Radio':
      return <Radio className="w-4 h-4 text-cyan-400" />;
    case 'Sparkles':
      return <Sparkles className="w-4 h-4 text-amber-400" />;
    default:
      return <Award className="w-4 h-4 text-emerald-400" />;
  }
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ 
  activeRole,
  language = 'en'
}) => {
  const isDe = language === 'de';
  const [certFilter, setCertFilter] = useState<'all' | '2026' | 'business-analysis' | 'ai-ml' | 'it-management' | 'data-eng' | 'languages'>('all');

  const filteredCerts = certFilter === 'all' 
    ? CERTIFICATIONS 
    : certFilter === '2026'
    ? CERTIFICATIONS.filter(c => c.year === '2026' || c.date.includes('2026'))
    : CERTIFICATIONS.filter(c => c.category === certFilter);

  return (
    <section id="skills" className="py-16 border-t border-slate-800/80 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4" />
            {isDe ? 'Technologische Kernkompetenzen' : 'Full-Spectrum Technical Toolkit'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
            {isDe ? 'Verifizierte Fähigkeiten & Technologie-Stack' : 'Technical Proficiencies & Systems Mastery'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            {isDe 
              ? 'Erprobt in hochverfügbaren Industrieanlagen, sequentieller Deep-Learning-Forschung an der TU Clausthal und moderner Cloud- & Load-Balancing-Infrastruktur.' 
              : 'Validated across high-throughput industrial facilities, deep learning sequence research at TU Clausthal, and enterprise IT & load-balancing infrastructure.'}
          </p>
        </div>

        {/* Skill Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              id={`skill-category-${cat.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 shadow-lg"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800/80">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
                  {getCategoryIcon(cat.icon)}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    {cat.title}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {cat.skills.length} core competencies
                  </span>
                </div>
              </div>

              {/* Skills Progress List */}
              <div className="space-y-3.5">
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium flex items-center gap-1.5 ${skill.highlight ? 'text-white font-semibold' : 'text-slate-300'}`}>
                        {skill.highlight && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        )}
                        {skill.name}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700/60 text-cyan-300 font-medium">
                        {skill.experience}
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          skill.highlight
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                            : 'bg-slate-500'
                        }`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Industry Certifications */}
        <div className="mt-8 pt-8 border-t border-slate-800/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                Continuous Learning & Verified Credentials
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
                Certifications & Professional Credentials ({CERTIFICATIONS.length})
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Verified certificates across IIBA®, PMI®, CompTIA®, NASBA, Microsoft, Coursera, SAP & BAMF German Language.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto">
              {[
                { id: 'all', label: `All (${CERTIFICATIONS.length})` },
                { id: '2026', label: '⚡ 2026 Certified' },
                { id: 'business-analysis', label: 'Business Analysis & Requirements' },
                { id: 'it-management', label: 'ITIL & SAP ERP' },
                { id: 'ai-ml', label: 'AI & VLSI' },
                { id: 'data-eng', label: 'Data Science & BI' },
                { id: 'languages', label: 'Language (DTZ B1)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCertFilter(tab.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    certFilter === tab.id
                      ? tab.id === '2026'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                className={`p-4 rounded-xl bg-slate-900/70 border transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md ${
                  cert.year === '2026' || cert.date.includes('2026')
                    ? 'border-emerald-500/50 ring-1 ring-emerald-500/20'
                    : 'border-slate-800/90 hover:border-emerald-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded-md bg-slate-800 border border-slate-700">
                        {getCertIcon(cert.icon)}
                      </div>
                      <span className="font-mono text-emerald-400 font-semibold">{cert.issuer}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {(cert.year === '2026' || cert.date.includes('2026')) && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          2026
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-slate-400">{cert.date}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">
                    {cert.title}
                  </h4>

                  {cert.accreditation && (
                    <div className="text-[11px] font-mono text-cyan-300/90 mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{cert.accreditation}</span>
                    </div>
                  )}

                  {cert.certificateId && (
                    <div className="mt-1 text-[10px] font-mono text-slate-400 truncate">
                      ID: <span className="text-slate-300">{cert.certificateId}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

