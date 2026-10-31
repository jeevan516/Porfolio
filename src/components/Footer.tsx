import React, { useState, useEffect } from 'react';
import { Mail, Phone, Github, Linkedin, MapPin, ArrowUp, FileText, Clock } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  onOpenContact: () => void;
  onOpenBrief: () => void;
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]';

const LINK = `inline-flex items-center gap-2 rounded-md hover:text-emerald-400 transition-colors ${FOCUS_RING}`;

export const Footer: React.FC<FooterProps> = ({ onOpenContact, onOpenBrief }) => {
  const [hamburgTime, setHamburgTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        setHamburgTime(
          new Intl.DateTimeFormat('de-DE', {
            timeZone: 'Europe/Berlin',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date())
        );
      } catch {
        setHamburgTime('');
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 30_000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="border-t border-slate-800 bg-[#05070d] text-slate-400 text-sm">
      {/* Contact call-to-action */}
      <div className="border-b border-slate-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Ready for the next technical challenge</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Let's Build Resilient Systems Together
              </h3>
              <p className="text-slate-300 text-sm max-w-xl">
                Open to roles as an AI Engineer, IT Specialist, Observability/SRE Engineer, or Data Specialist in Hamburg, Germany or remote.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                id="footer-contact-btn"
                onClick={onOpenContact}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors ${FOCUS_RING}`}
              >
                <Mail className="w-4 h-4" />
                <span>Get in Touch</span>
              </button>
              <button
                id="footer-brief-btn"
                onClick={onOpenBrief}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white text-sm font-semibold transition-colors ${FOCUS_RING}`}
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Recruiter Brief</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-emerald-500/40 shrink-0 bg-slate-800">
                <img src="./jeevan-dutta.jpg" alt="" className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <div className="font-display font-bold text-white text-base">{PERSONAL_INFO.name}</div>
                <div className="text-xs text-slate-400">MSc Informatics · TU Clausthal</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              IT Specialist & AI Engineer based in Hamburg, Germany. Bootcamp at neuefische GmbH (AI, Data Science & SE). Available immediately.
            </p>
            {hamburgTime && (
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hamburg {hamburgTime}</span>
              </div>
            )}
          </div>

          {/* Direct contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href={`mailto:${PERSONAL_INFO.email}`} className={`${LINK} break-all`}>
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{PERSONAL_INFO.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${PERSONAL_INFO.phone.replace(/\s+/g, '')}`} className={LINK}>
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{PERSONAL_INFO.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Hamburg, Germany</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm">Links</h4>
            <ul className="space-y-2">
              <li>
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className={LINK}>
                  <Github className="w-4 h-4 text-slate-500" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className={LINK}>
                  <Linkedin className="w-4 h-4 text-slate-500" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <button onClick={onOpenBrief} className={LINK}>
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Recruiter Brief</span>
                </button>
              </li>
              <li>
                <button onClick={scrollToTop} className={LINK}>
                  <ArrowUp className="w-4 h-4 text-slate-500" />
                  <span>Back to top</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 mt-10 border-t border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 text-center">
          <div>
            &copy; {new Date().getFullYear()} {PERSONAL_INFO.name} · Hamburg, Germany
          </div>
          <div>MSc Informatics (TU Clausthal) · Open to opportunities</div>
        </div>
      </div>
    </footer>
  );
};
