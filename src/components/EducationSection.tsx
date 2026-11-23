import React from 'react';
import { EDUCATION_DATA, PERSONAL_INFO } from '../data/portfolioData';
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

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

const scrollToSection = (e: React.MouseEvent, id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const header = document.querySelector('header');
  const offset = (header instanceof HTMLElement ? header.offsetHeight : 80) + 8;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
};

interface EducationSectionProps {
  language?: 'en' | 'de';
}

export const EducationSection: React.FC<EducationSectionProps> = ({ language = 'en' }) => {
  const t = TRANSLATIONS[language]?.education || TRANSLATIONS.en.education;
  const isDe = language === 'de';

  return (
    <section id="education" className="py-20 border-t border-line/80 bg-bg/60 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-info/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-sm text-info font-semibold mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-info" />
              {t.tag}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-fg tracking-tight">
              {t.title}
            </h2>
            <p className="text-muted text-sm sm:text-base mt-3 leading-relaxed">
              {t.desc}{' '}
              <a 
                href={PERSONAL_INFO.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`text-teal hover:text-teal underline underline-offset-2 inline-flex items-center gap-1 font-medium rounded ${FOCUS_RING}`}
              >
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
              .
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line-strong hover:border-line-strong text-fg hover:text-fg text-sm font-semibold transition-colors ${FOCUS_RING}`}
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
              <span>{isDe ? 'Auf LinkedIn überprüfen' : 'Verify on LinkedIn'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-subtle" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Education Timeline Grid */}
        <div className="space-y-8">
          {EDUCATION_DATA.map((edu) => {
            const isMaster = edu.id === 'tu-clausthal';
            const isBootcamp = edu.id === 'neuefische-bootcamp';

            return (
              <div
                key={edu.id}
                className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                  isBootcamp
                    ? 'bg-gradient-to-br from-surface/90 via-accent-soft/20 to-teal-soft/30 border-accent/50 shadow-xl'
                    : isMaster
                    ? 'bg-gradient-to-br from-surface/90 via-info-soft/20 to-bg/90 border-info/40 shadow-xl'
                    : 'bg-surface/50 border-line/80 hover:border-line-strong'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isBootcamp
                        ? 'bg-accent-soft/80 border-accent/50 text-accent-fg'
                        : isMaster 
                        ? 'bg-info-soft/80 border-info/50 text-info' 
                        : 'bg-surface-2 border-line-strong text-teal'
                    }`}>
                      {isBootcamp ? <Sparkles className="w-6 h-6" /> : isMaster ? <Cpu className="w-6 h-6" /> : <School className="w-6 h-6" />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          isBootcamp
                            ? 'bg-accent-soft text-accent-fg border-accent/60'
                            : isMaster
                            ? 'bg-info-soft text-info border-info/60'
                            : 'bg-teal-soft text-teal border-teal/60'
                        }`}>
                          {isBootcamp 
                            ? (isDe ? 'Bootcamp (aktuell)' : 'Bootcamp (current)')
                            : isMaster 
                            ? 'Master of Science (M.Sc.)' 
                            : 'Bachelor of Science (B.Sc.)'}
                        </span>
                        {edu.verifiedOnLinkedIn && (
                          <span className="inline-flex items-center gap-1 text-xs text-accent-fg bg-accent-soft/60 border border-accent/60 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            LinkedIn Verified
                          </span>
                        )}
                        {isBootcamp && (
                          <span className="inline-flex items-center gap-1 text-xs text-teal bg-teal-soft/60 border border-teal/60 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                            {isDe ? 'Sofort einsatzbereit' : 'Available Immediately'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-display text-fg">
                        {edu.degree}
                      </h3>
                      <div className="text-base font-semibold text-accent-fg mt-0.5">
                        {edu.institution}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        {isDe ? 'Studienfach' : 'Field of study'}: <span className="text-fg">{edu.fieldOfStudy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap lg:flex-col lg:items-end gap-2 text-xs font-mono text-muted">
                    <span className="flex items-center gap-1.5 bg-surface-2/70 px-3 py-1 rounded-lg border border-line-strong/60 text-fg">
                      <Calendar className="w-3.5 h-3.5 text-teal" />
                      {edu.period}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted">
                      <MapPin className="w-3.5 h-3.5 text-subtle" />
                      {edu.location}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {edu.description && (
                  <p className="text-sm sm:text-base text-muted leading-relaxed mb-6">
                    {edu.description}
                  </p>
                )}

                {/* Master's Thesis Explicit Highlight Box (When Master's degree) */}
                {isMaster && (
                  <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-info-soft/40 border border-info/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-info/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3 pb-3 border-b border-info/40">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs text-info font-semibold">
                          <BookOpen className="w-4 h-4 text-teal" />
                          Master's Thesis · Supervised by Prof. Dr. Christian Siemers
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-fg mt-1">
                          "{edu.thesisTitle}"
                        </h4>
                        <div className="text-xs text-info/80 mt-1">
                          Academic Advisors: {edu.thesisAdvisors?.join(' · ')} · Matriculation No. 517360
                        </div>
                      </div>

                      {/* GitHub & Public Page CTA Buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">

                        <a
                          href="#master-thesis"
                          onClick={(e) => scrollToSection(e, 'master-thesis')}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-on-accent font-bold text-xs transition-colors ${FOCUS_RING}`}
                        >
                          <span>{isDe ? 'Details ansehen' : 'Explore deep dive'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-3">
                      <div className="p-2.5 rounded-xl bg-bg/60 border border-info/50">
                        <span className="text-muted block text-xs">Guaranteed Latency:</span>
                        <span className="text-accent-fg font-bold">&lt; 12 µs Reaction Time</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-bg/60 border border-info/50">
                        <span className="text-muted block text-xs">Hardware Synthesis:</span>
                        <span className="text-teal font-bold">1,086 Nets / 832 Leaf Cells</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-bg/60 border border-info/50">
                        <span className="text-muted block text-xs">Code Artifacts:</span>
                        <span className="text-info font-bold">VHDL in Xilinx Vivado</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Academic Highlights */}
                <div className="space-y-2 mb-6">
                  <div className="text-sm font-semibold text-fg flex items-center gap-1.5 mb-2">
                    <Award className="w-4 h-4 text-accent-fg" />
                    {isDe ? 'Schwerpunkte' : 'Highlights'}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {edu.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted bg-bg/40 p-2.5 rounded-xl border border-line/50">
                        <CheckCircle2 className="w-4 h-4 text-accent-fg shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acquired Skills & Coursework */}
                <div className="pt-4 border-t border-line">
                  <div className="text-sm font-semibold text-fg mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal" />
                    <span>{isDe ? 'Kompetenzen & Kurse' : 'Skills & coursework'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.skillsAcquired.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-md text-xs bg-surface-2/80 text-muted border border-line-strong/60"
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
