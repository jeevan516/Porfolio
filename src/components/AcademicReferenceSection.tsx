import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ACADEMIC_REFERENCES } from '../data/portfolioData';
import { GraduationCap, CheckCircle2, Mail, Building2, Cpu, FileCheck, Copy, Check, X } from 'lucide-react';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60';

const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers / contexts without the async clipboard API.
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
};

export const AcademicReferenceSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const ref = ACADEMIC_REFERENCES[0];

  const handleCopyEmail = async (email: string) => {
    if (await copyText(email)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Close modal on Escape, lock body scroll, and manage focus.
  useEffect(() => {
    if (!showVerificationModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowVerificationModal(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    const opener = openerRef.current;
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, [showVerificationModal]);

  if (!ref) return null;

  return (
    <section id="academic-reference" className="py-16 sm:py-20 border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4" aria-hidden="true" />
            Academic reference
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">Research Supervision</h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
            Supervised at <span className="text-slate-200 font-medium">Clausthal University of Technology (TU Clausthal)</span> in
            VLSI, digital microelectronics, and computer engineering.
          </p>
        </div>

        <div className="max-w-4xl">
          <article className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white">
                  <GraduationCap className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white">{ref.name}</h3>
                  <p className="text-xs sm:text-sm text-purple-300 mt-0.5">{ref.title}</p>
                </div>
              </div>
              <div className="sm:text-right text-xs text-slate-400 shrink-0">
                <div className="inline-flex items-center gap-1.5 text-slate-200 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  TU Clausthal
                </div>
                <div className="mt-0.5">{ref.location}</div>
              </div>
            </div>

            {/* Research focus */}
            <div className="mt-6 flex items-start gap-3 text-sm">
              <Cpu className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-white font-semibold">{ref.subjectArea}</span>
                <span className="text-slate-400 block text-xs mt-0.5">{ref.relationship}</span>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="mt-6 text-slate-200 text-sm sm:text-base leading-relaxed pl-4 sm:pl-5 italic border-l-2 border-purple-500/60">
              {ref.quote}
            </blockquote>

            {/* Endorsements */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="text-sm font-semibold text-slate-200 mb-3">Endorsed capabilities</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ref.endorsements.map((item) => (
                  <li key={item} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
              <p className="flex items-start gap-2 text-xs text-slate-400">
                <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                {ref.verificationNote}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  ref={openerRef}
                  type="button"
                  onClick={() => setShowVerificationModal(true)}
                  aria-haspopup="dialog"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold transition-colors ${focusRing}`}
                >
                  <FileCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  Verification details
                </button>

                {ref.contactEmail && (
                  <>
                    <a
                      href={`mailto:${ref.contactEmail}`}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-300 text-xs font-medium transition-colors ${focusRing}`}
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="truncate max-w-[180px] sm:max-w-none">{ref.contactEmail}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(ref.contactEmail!)}
                      aria-label={copied ? 'Email copied' : 'Copy email address'}
                      title={copied ? 'Copied' : 'Copy email'}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 transition-colors ${focusRing}`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <span aria-live="polite" className="sr-only">
                      {copied ? 'Email copied to clipboard' : ''}
                    </span>
                  </>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Verification Details Modal */}
      <AnimatePresence>
        {showVerificationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setShowVerificationModal(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="academic-verification-title"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative"
            >
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setShowVerificationModal(false)}
                aria-label="Close"
                className={`absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${focusRing}`}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4 pr-8">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <GraduationCap className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="academic-verification-title" className="text-base font-bold text-white font-display">
                    Academic Verification Record
                  </h3>
                  <p className="text-xs text-purple-300">Technische Universität Clausthal</p>
                </div>
              </div>

              <dl className="space-y-3 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <dt className="text-slate-500">Candidate</dt>
                  <dd className="text-white font-semibold">Jeevan Dutta (MSc Informatics)</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Supervising professor</dt>
                  <dd className="text-white">{ref.name}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Institute</dt>
                  <dd className="text-slate-200">{ref.department}, TU Clausthal</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Research area</dt>
                  <dd className="text-emerald-400">{ref.subjectArea}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Address</dt>
                  <dd className="text-slate-400">TU Clausthal, Leibnizstraße 28, 38678 Clausthal-Zellerfeld, Germany</dd>
                </div>
              </dl>

              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                This academic reference confirms Jeevan Dutta's graduate curriculum and research track on Very Large Scale Integrated
                Circuits under {ref.name} at TU Clausthal. Direct reference checks can be coordinated via email.
              </p>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                {ref.contactEmail && (
                  <a
                    href={`mailto:${ref.contactEmail}`}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 hover:border-emerald-500/50 text-slate-200 text-xs font-medium transition-colors ${focusRing}`}
                  >
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    Email
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className={`px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold transition-colors ${focusRing}`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
