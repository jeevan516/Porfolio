import React from 'react';
import { EDUCATION_DATA, MASTER_THESIS_DETAILS } from '../data/portfolioData';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  ExternalLink, 
  Github, 
  Globe, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Cpu, 
  FileText, 
  Linkedin,
  Sparkles,
  ChevronRight,
  School
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

interface EducationSectionProps {
  language?: 'en' | 'de';
}

export const EducationSection: React.FC<EducationSectionProps> = ({ language = 'en' }) => {
  const t = TRANSLATIONS[language]?.education || TRANSLATIONS.en.education;
  const isDe = language === 'de';

  return (
    <section id="education" className="py-20 border-t border-slate-800/80 bg-slate-950/60 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-purple-500/40 text-xs font-mono text-purple-300 font-semibold uppercase tracking-wider mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
              {t.tag}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
              {t.title}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              {t.desc}{' '}
              <a 
                href="https://www.linkedin.com/in/jeevan-dutta/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 inline-flex items-center gap-1 font-medium"
              >
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
              .
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/jeevan-dutta/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-mono text-xs transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
              <span>{isDe ? 'Auf LinkedIn überprüfen' : 'Verify on LinkedIn'}</span>
            </a>
          </div>
        </div>

        {/* Education Timeline Grid */}
        <div className="space-y-8">
          {EDUCATION_DATA.map((edu) => {
            const isMaster = edu.id === 'tu-clausthal';

            return (
              <div
                key={edu.id}
                className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                  isMaster
                    ? 'bg-gradient-to-br from-slate-900/90 via-purple-950/20 to-slate-950/90 border-purple-500/40 shadow-xl'
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isMaster 
                        ? 'bg-purple-950/80 border-purple-500/50 text-purple-300' 
                        : 'bg-slate-800 border-slate-700 text-cyan-400'
                    }`}>
                      {isMaster ? <Cpu className="w-6 h-6" /> : <School className="w-6 h-6" />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider border ${
                          isMaster
                            ? 'bg-purple-950 text-purple-300 border-purple-700/60'
                            : 'bg-cyan-950 text-cyan-300 border-cyan-800/60'
                        }`}>
                          {isMaster ? 'Master of Science (M.Sc.)' : 'Bachelor of Science (B.Sc.)'}
                        </span>
                        {edu.verifiedOnLinkedIn && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            LinkedIn Verified
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                        {edu.degree}
                      </h3>
                      <div className="text-base font-semibold text-emerald-400 mt-0.5">
                        {edu.institution}
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">
                        Field of Study: <span className="text-slate-200">{edu.fieldOfStudy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap lg:flex-col lg:items-end gap-2 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 bg-slate-800/70 px-3 py-1 rounded-lg border border-slate-700/60 text-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {edu.period}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {edu.location}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {edu.description && (
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                    {edu.description}
                  </p>
                )}

                {/* Master's Thesis Explicit Highlight Box (When Master's degree) */}
                {isMaster && (
                  <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-purple-950/40 border border-purple-700/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3 pb-3 border-b border-purple-800/40">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          Master's Thesis Research Project (Supervised by Prof. Dr. Christian Siemers)
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                          "{edu.thesisTitle}"
                        </h4>
                        <div className="text-xs font-mono text-purple-300/80 mt-1">
                          Academic Advisors: {edu.thesisAdvisors?.join(' · ')} · Matriculation No. 517360
                        </div>
                      </div>

                      {/* GitHub & Public Page CTA Buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <a
                          href="https://github.com/jeevan516/4-node-communication-network-master-thesis"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-semibold text-xs border border-purple-500/60 hover:border-cyan-400 transition-all shadow-md group"
                        >
                          <Github className="w-4 h-4 text-slate-300 group-hover:text-white" />
                          <span>Thesis on GitHub</span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                        </a>

                        <a
                          href="#master-thesis"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-semibold text-xs transition-all shadow-lg shadow-purple-600/30"
                        >
                          <span>Explore Deep Dive</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs mt-3">
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-900/50">
                        <span className="text-slate-400 block text-[10px]">Guaranteed Latency:</span>
                        <span className="text-emerald-400 font-bold">&lt; 12 µs Reaction Time</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-900/50">
                        <span className="text-slate-400 block text-[10px]">Hardware Synthesis:</span>
                        <span className="text-cyan-400 font-bold">1,086 Nets / 832 Leaf Cells</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-900/50">
                        <span className="text-slate-400 block text-[10px]">Code Artifacts:</span>
                        <span className="text-purple-300 font-bold">Open-Source VHDL on GitHub</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Academic Highlights */}
                <div className="space-y-2 mb-6">
                  <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    Key Academic Highlights & Research Deliverables:
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {edu.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acquired Skills & Coursework */}
                <div className="pt-4 border-t border-slate-800">
                  <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Skills & Coursework Acquired (from LinkedIn):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.skillsAcquired.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800/90 text-cyan-300 border border-slate-700/60"
                      >
                        {skill}
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
