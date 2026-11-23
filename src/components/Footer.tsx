import React, { useState, useEffect } from 'react';
import { Mail, Phone, Github, Linkedin, MapPin, ArrowUp, FileText, Clock } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  onOpenContact: () => void;
  onOpenBrief: () => void;
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

const LINK = `inline-flex items-center gap-2 rounded-md hover:text-accent-fg transition-colors ${FOCUS_RING}`;

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
    <footer id="contact" className="border-t border-line bg-surface text-muted text-sm">
      {/* Contact call-to-action */}
      <div className="border-b border-line/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-surface/70 border border-line">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-xs text-accent-fg font-semibold">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Ready for the next technical challenge</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-fg">
                Let's Build Resilient Systems Together
              </h3>
              <p className="text-muted text-sm max-w-xl">
                Open to roles as an AI Engineer, IT Specialist, Observability/SRE Engineer, or Data Specialist in Hamburg, Germany or remote.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                id="footer-contact-btn"
                onClick={onOpenContact}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-on-accent font-bold text-sm transition-colors ${FOCUS_RING}`}
              >
                <Mail className="w-4 h-4" />
                <span>Get in Touch</span>
              </button>
              <button
                id="footer-brief-btn"
                onClick={onOpenBrief}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-line-strong hover:border-line-strong text-fg hover:text-fg text-sm font-semibold transition-colors ${FOCUS_RING}`}
              >
                <FileText className="w-4 h-4 text-teal" />
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
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-accent-fg/40 shrink-0 bg-surface-2">
                <img src="./jeevan-dutta.jpg" alt="" className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <div className="font-display font-bold text-fg text-base">{PERSONAL_INFO.name}</div>
                <div className="text-xs text-muted">MSc Informatics · TU Clausthal</div>
              </div>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              IT Specialist & AI Engineer based in Hamburg, Germany. Bootcamp at neuefische GmbH (AI, Data Science & SE). Available immediately.
            </p>
            {hamburgTime && (
              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <Clock className="w-3.5 h-3.5 text-accent-fg" />
                <span>Hamburg {hamburgTime}</span>
              </div>
            )}
          </div>

          {/* Direct contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-fg text-sm">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href={`mailto:${PERSONAL_INFO.email}`} className={`${LINK} break-all`}>
                  <Mail className="w-4 h-4 text-subtle shrink-0" />
                  <span>{PERSONAL_INFO.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${PERSONAL_INFO.phone.replace(/\s+/g, '')}`} className={LINK}>
                  <Phone className="w-4 h-4 text-subtle shrink-0" />
                  <span>{PERSONAL_INFO.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-subtle shrink-0" />
                <span>Hamburg, Germany</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-fg text-sm">Links</h4>
            <ul className="space-y-2">
              <li>
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className={LINK}>
                  <Github className="w-4 h-4 text-subtle" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className={LINK}>
                  <Linkedin className="w-4 h-4 text-subtle" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <button onClick={onOpenBrief} className={LINK}>
                  <FileText className="w-4 h-4 text-subtle" />
                  <span>Recruiter Brief</span>
                </button>
              </li>
              <li>
                <button onClick={scrollToTop} className={LINK}>
                  <ArrowUp className="w-4 h-4 text-subtle" />
                  <span>Back to top</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 mt-10 border-t border-line/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-subtle text-center">
          <div>
            &copy; {new Date().getFullYear()} {PERSONAL_INFO.name} · Hamburg, Germany
          </div>
          <div>MSc Informatics (TU Clausthal) · Open to opportunities</div>
        </div>
      </div>
    </footer>
  );
};
