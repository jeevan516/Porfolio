import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ACADEMIC_REFERENCES } from '../data/portfolioData';
import { GraduationCap, CheckCircle2, Mail, Building2, Cpu, FileCheck, Copy, Check, X } from 'lucide-react';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60';

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
    <section id="academic-reference" className="py-16 sm:py-20 border-t border-line/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-accent-fg font-semibold uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4" aria-hidden="true" />
            Academic reference
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-fg tracking-tight">Research Supervision</h2>
          <p className="text-muted text-sm sm:text-base mt-2 leading-relaxed">
            Supervised at <span className="text-fg font-medium">Clausthal University of Technology (TU Clausthal)</span> in
            VLSI, digital microelectronics, and computer engineering.
          </p>
        </div>

        <div className="max-w-4xl">
          <article className="rounded-2xl bg-surface/70 border border-line p-5 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-info to-info flex items-center justify-center text-fg">
                  <GraduationCap className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-fg">{ref.name}</h3>
                  <p className="text-xs sm:text-sm text-info mt-0.5">{ref.title}</p>
                </div>
              </div>
              <div className="sm:text-right text-xs text-muted shrink-0">
                <div className="inline-flex items-center gap-1.5 text-fg font-medium">
                  <Building2 className="w-3.5 h-3.5 text-accent-fg" aria-hidden="true" />
                  TU Clausthal
                </div>
                <div className="mt-0.5">{ref.location}</div>
              </div>
            </div>

            {/* Research focus */}
            <div className="mt-6 flex items-start gap-3 text-sm">
              <Cpu className="w-5 h-5 text-info shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-fg font-semibold">{ref.subjectArea}</span>
                <span className="text-muted block text-xs mt-0.5">{ref.relationship}</span>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="mt-6 text-fg text-sm sm:text-base leading-relaxed pl-4 sm:pl-5 italic border-l-2 border-info/60">
              {ref.quote}
            </blockquote>

            {/* Endorsements */}
            <div className="mt-6 pt-6 border-t border-line">
              <h4 className="text-sm font-semibold text-fg mb-3">Endorsed capabilities</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ref.endorsements.map((item) => (
                  <li key={item} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg/50 border border-line text-xs text-muted">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-fg shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-line space-y-4">
              <p className="flex items-start gap-2 text-xs text-muted">
                <FileCheck className="w-4 h-4 text-accent-fg shrink-0" aria-hidden="true" />
                {ref.verificationNote}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  ref={openerRef}
                  type="button"
                  onClick={() => setShowVerificationModal(true)}
                  aria-haspopup="dialog"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-on-accent text-xs font-semibold transition-colors ${focusRing}`}
                >
                  <FileCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  Verification details
                </button>

                {ref.contactEmail && (
                  <>
                    <a
                      href={`mailto:${ref.contactEmail}`}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-line-strong hover:border-accent/50 text-fg hover:text-accent-fg text-xs font-medium transition-colors ${focusRing}`}
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="truncate max-w-[180px] sm:max-w-none">{ref.contactEmail}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(ref.contactEmail!)}
                      aria-label={copied ? 'Email copied' : 'Copy email address'}
                      title={copied ? 'Copied' : 'Copy email'}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-xl border border-line-strong hover:border-line-strong text-muted transition-colors ${focusRing}`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-accent-fg" /> : <Copy className="w-3.5 h-3.5" />}
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
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-line shadow-2xl p-6 relative"
            >
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setShowVerificationModal(false)}
                aria-label="Close"
                className={`absolute top-3 right-3 p-2 rounded-lg text-muted hover:text-fg hover:bg-surface-2 transition-colors ${focusRing}`}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4 pr-8">
                <div className="p-2 rounded-xl bg-info/20 text-info">
                  <GraduationCap className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="academic-verification-title" className="text-base font-bold text-fg font-display">
                    Academic Verification Record
                  </h3>
                  <p className="text-xs text-info">Technische Universität Clausthal</p>
                </div>
              </div>

              <dl className="space-y-3 text-xs text-muted bg-bg/60 p-4 rounded-xl border border-line">
                <div>
                  <dt className="text-subtle">Candidate</dt>
                  <dd className="text-fg font-semibold">Jeevan Dutta (MSc Informatics)</dd>
                </div>
                <div>
                  <dt className="text-subtle">Supervising professor</dt>
                  <dd className="text-fg">{ref.name}</dd>
                </div>
                <div>
                  <dt className="text-subtle">Institute</dt>
                  <dd className="text-fg">{ref.department}, TU Clausthal</dd>
                </div>
                <div>
                  <dt className="text-subtle">Research area</dt>
                  <dd className="text-accent-fg">{ref.subjectArea}</dd>
                </div>
                <div>
                  <dt className="text-subtle">Address</dt>
                  <dd className="text-muted">TU Clausthal, Leibnizstraße 28, 38678 Clausthal-Zellerfeld, Germany</dd>
                </div>
              </dl>

              <p className="text-xs text-muted mt-4 leading-relaxed">
                This academic reference confirms Jeevan Dutta's graduate curriculum and research track on Very Large Scale Integrated
                Circuits under {ref.name} at TU Clausthal. Direct reference checks can be coordinated via email.
              </p>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                {ref.contactEmail && (
                  <a
                    href={`mailto:${ref.contactEmail}`}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-line-strong hover:border-accent/50 text-fg text-xs font-medium transition-colors ${focusRing}`}
                  >
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    Email
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className={`px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-on-accent text-xs font-semibold transition-colors ${focusRing}`}
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
