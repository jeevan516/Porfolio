import React, { useState } from 'react';
import { ACADEMIC_REFERENCES } from '../data/portfolioData';
import { 
  GraduationCap, 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  Mail, 
  Building2, 
  Cpu, 
  FileCheck, 
  ShieldCheck, 
  Copy, 
  Check 
} from 'lucide-react';

export const AcademicReferenceSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const ref = ACADEMIC_REFERENCES[0];

  return (
    <section id="academic-reference" className="py-16 border-t border-slate-800/80 bg-slate-950/70 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/60 text-xs font-mono text-purple-300 font-semibold uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            Academic Research Endorsement
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Academic Reference & Research Supervision
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Supervised by renowned faculty at <strong className="text-slate-200">Clausthal University of Technology (TU Clausthal)</strong>, specializing in Very Large Scale Integrated Circuits (VLSI), digital microelectronics, and computer engineering.
          </p>
        </div>

        {/* Academic Reference Card */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-purple-900/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Top Badge & University Logo Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                      {ref.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-900/50 text-purple-300 border border-purple-700/60 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-purple-400" />
                      Verified Professor
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-purple-300 font-medium mt-0.5">
                    {ref.title}
                  </p>
                </div>
              </div>

              {/* Institution Seal Pill */}
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-200">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TU Clausthal (Germany)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {ref.location}
                </div>
              </div>
            </div>

            {/* Academic Collaboration Context Banner */}
            <div className="mt-6 p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-center gap-3 text-xs text-purple-200">
              <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <span className="font-semibold text-white">Research Focus: </span>
                <span className="text-purple-300 font-mono">{ref.subjectArea}</span>
                <span className="text-slate-400 block sm:inline sm:ml-2">({ref.relationship})</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="mt-6 relative">
              <div className="text-4xl font-serif text-purple-500/30 absolute -top-4 -left-2 select-none pointer-events-none">
                “
              </div>
              <blockquote className="text-slate-200 text-sm sm:text-base leading-relaxed pl-6 italic border-l-2 border-purple-500/50">
                {ref.quote}
              </blockquote>
            </div>

            {/* Endorsed Competencies Grid */}
            <div className="mt-6 pt-6 border-t border-slate-800/80">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Key Endorsed Technical Capabilities (TU Clausthal)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ref.endorsements.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>{ref.verificationNote}</span>
              </div>

              <div className="flex items-center gap-3">
                {ref.contactEmail && (
                  <button
                    onClick={() => handleCopyEmail(ref.contactEmail!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-all"
                  >
                    {copiedEmail === ref.contactEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Email Copied!</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5 text-purple-400" />
                        <span>{ref.contactEmail}</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setShowVerificationModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-xs font-semibold transition-all"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>View Verification Letter Details</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Verification Details Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Academic Verification Record
                </h3>
                <p className="text-xs text-purple-300 font-mono">
                  Technische Universität Clausthal
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 font-mono">
              <div>
                <span className="text-slate-500 block">Candidate:</span>
                <span className="text-white font-semibold">Jeevan Dutta (MSc Informatics)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Supervising Professor:</span>
                <span className="text-white">Prof. Dr. Christian Siemers</span>
              </div>
              <div>
                <span className="text-slate-500 block">Affiliated Institute:</span>
                <span className="text-slate-200">
                  Institute for Electrical Information Technology & Institute of Computer Science, TU Clausthal
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Core Research Area:</span>
                <span className="text-emerald-400">
                  Very Large Scale Integrated Circuits (VLSI), Digital Microelectronics & Computer Architecture
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Official Reference Address:</span>
                <span className="text-slate-400">
                  TU Clausthal, Leibnizstraße 28, 38678 Clausthal-Zellerfeld, Germany
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
              This academic reference confirms Jeevan Dutta's graduate curriculum, research track on Very Large Scale Integrated Circuits under Prof. Dr. Christian Siemers, and technical integrity at TU Clausthal. Direct reference checks can be coordinated via email.
            </p>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
