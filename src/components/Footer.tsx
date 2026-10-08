import React, { useState, useEffect } from 'react';
import { Mail, Phone, Github, Linkedin, MapPin, ArrowUp, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  onOpenContact: () => void;
  onOpenBrief: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact, onOpenBrief }) => {
  const [hamburgTime, setHamburgTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('de-DE', {
          timeZone: 'Europe/Berlin',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date());
        setHamburgTime(timeStr);
      } catch {
        setHamburgTime(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="border-t border-slate-800 bg-[#05070d] text-slate-400 text-xs">
      {/* Top Banner with Direct Contact Pitch */}
      <div className="border-b border-slate-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Ready for Next Technical Challenge</span>
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
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Get in Touch</span>
              </button>

              <button
                id="footer-brief-btn"
                onClick={onOpenBrief}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition-all"
              >
                <span>Recruiter Brief</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-emerald-500/40 shrink-0 bg-slate-800">
                <img
                  src="./jeevan-dutta.jpg"
                  alt="Jeevan Dutta"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <span className="font-display font-bold text-white text-base">
                  {PERSONAL_INFO.name}
                </span>
                <div className="text-[11px] text-emerald-400 font-mono">
                  MSc Informatics · TU Clausthal
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              IT Specialist & AI Developer based in Hamburg, Germany. Available immediately.
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Hamburg Time: {hamburgTime || '10:42 CET'}</span>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider font-mono text-[11px]">
              Direct Inquiries
            </h4>
            <ul className="space-y-1.5 font-mono text-xs">
              <li>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{PERSONAL_INFO.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${PERSONAL_INFO.phone.replace(/\s+/g, '')}`}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{PERSONAL_INFO.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Hamburg, Germany</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider font-mono text-[11px]">
              Recruiter Quick Actions
            </h4>
            <div className="space-y-2">
              <button
                onClick={onOpenBrief}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs transition-colors flex items-center justify-between"
              >
                <span>Executive Recruiter Brief</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              <button
                onClick={scrollToTop}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-colors flex items-center justify-between"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            Built for Jeevan Dutta &copy; {new Date().getFullYear()} · Hamburg, Germany · Master of Science in Informatics (TU Clausthal)
          </div>
          <div className="flex items-center gap-4">
            <span>Portfolio Tracker & Engineering Showcase</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Open to Opportunities</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
