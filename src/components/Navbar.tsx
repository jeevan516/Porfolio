import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, BarChart3, Mail, FileText, Github, Linkedin, Sparkles, Sun, Moon, Languages, Code2, Download, Volume2, VolumeX } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';
import { isSoundFxEnabled, setSoundFxEnabled, playTactileClick } from '../services/soundFx';

interface NavbarProps {
  activeView: 'showcase' | 'classic' | 'tracker';
  setActiveView: (view: 'showcase' | 'classic' | 'tracker') => void;
  onOpenContact: () => void;
  onOpenBrief: () => void;
  onOpenResume?: () => void;
  onOpenGitHubSync?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  language?: 'en' | 'de';
  onToggleLanguage?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenContact,
  onOpenBrief,
  onOpenResume,
  onOpenGitHubSync,
  theme,
  onToggleTheme,
  language = 'en',
  onToggleLanguage,
}) => {
  const [imageError, setImageError] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundFxEnabled());
  const t = TRANSLATIONS[language].nav;

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundFxEnabled(next);
    if (next) playTactileClick();
  };

  const handleSelectView = (view: 'showcase' | 'classic' | 'tracker') => {
    playTactileClick();
    setActiveView(view);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#070a12]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Identity with Profile Picture */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0 bg-slate-800">
                {!imageError ? (
                  <img
                    src="./jeevan-dutta.jpg"
                    alt="Jeevan Dutta"
                    className="w-full h-full object-cover object-top"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-extrabold text-sm">
                    JD
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              </div>
              <div>
                <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  {PERSONAL_INFO.name}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AI & ML Bootcamp · Ready for Work</span>
                </div>
              </div>
            </a>
          </div>

          {/* Mode Switcher: Showcase vs Classic vs Portfolio Tracker */}
          <div className="hidden md:flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl shadow-inner">
            <button
              id="view-showcase-tab"
              onClick={() => handleSelectView('showcase')}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors z-10 ${
                activeView === 'showcase'
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeView === 'showcase' && (
                <motion.div
                  layoutId="activeNavbarModePill"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg -z-10 shadow-md shadow-emerald-500/20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.showcaseView}</span>
            </button>

            <button
              id="view-classic-tab"
              onClick={() => handleSelectView('classic')}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors z-10 ${
                activeView === 'classic'
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="View Jeevan's Original Developer Portfolio with Matrix Rain & Neural Architecture"
            >
              {activeView === 'classic' && (
                <motion.div
                  layoutId="activeNavbarModePill"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg -z-10 shadow-md shadow-emerald-500/20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Code2 className="w-3.5 h-3.5" />
              <span>{language === 'de' ? 'Klassisches Portfolio' : 'Classic Portfolio'}</span>
            </button>

            <button
              id="view-tracker-tab"
              onClick={() => handleSelectView('tracker')}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors z-10 ${
                activeView === 'tracker'
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeView === 'tracker' && (
                <motion.div
                  layoutId="activeNavbarModePill"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg -z-10 shadow-md shadow-cyan-500/20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.trackerView}</span>
              <span className="px-1.5 py-0.2 bg-cyan-950/80 text-cyan-300 text-[10px] rounded-full border border-cyan-700/50">
                Live
              </span>
            </button>
          </div>

          {/* Navigation Links for standard view */}
          {activeView === 'showcase' && (
            <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs font-medium text-slate-300">
              <a href="#video-portfolio" className="hover:text-emerald-300 text-emerald-400 font-bold transition-colors flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t.videoPitch}
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  {language.toUpperCase()}
                </span>
              </a>
              <a href="#about" className="hover:text-emerald-400 transition-colors">{t.about}</a>
              <a href="#education" className="hover:text-purple-300 text-purple-400/95 font-semibold transition-colors flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                {t.education}
              </a>
              <a href="#master-thesis" className="hover:text-purple-300 transition-colors">{t.masterThesis}</a>
              <a href="#projects" className="hover:text-emerald-400 transition-colors">{t.projects}</a>
              <a href="#skills" className="hover:text-emerald-400 transition-colors">{t.skills}</a>
              <a href="#experience" className="hover:text-emerald-400 text-slate-200 transition-colors font-medium">{t.experience}</a>
              <a href="#career-trajectory" className="hover:text-emerald-300 text-emerald-400 font-medium transition-colors flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{language === 'de' ? 'Wachstums-Chart' : 'Trajectory'}</span>
              </a>
              <a href="#observability" className="hover:text-emerald-400 text-emerald-400/90 transition-colors flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t.observability}
              </a>
              <a href="#academic-reference" className="hover:text-purple-400 text-purple-300/90 transition-colors flex items-center gap-1">
                {t.academicRef}
              </a>
              <a href="#tech-news" className="hover:text-cyan-300 text-cyan-400 font-bold transition-colors flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>{language === 'de' ? 'Tech-News' : 'Tech News'}</span>
              </a>
              <a href="#visitor-tracker" className="hover:text-emerald-300 text-emerald-400 font-bold transition-colors flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{language === 'de' ? 'Besucher' : 'Visitors'}</span>
              </a>
              <a href="#contact" className="hover:text-emerald-400 transition-colors">{t.contact}</a>
            </nav>
          )}

          {/* Right CTAs for Recruiters / Clients */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Links */}
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-[#0a66c2] rounded-lg hover:bg-slate-800 transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            {/* Global Translate Page Button */}
            {onToggleLanguage && (
              <button
                id="navbar-language-toggle-btn"
                onClick={onToggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border-2 border-emerald-500/50 hover:border-emerald-400 text-xs font-bold text-white transition-all shadow-md shadow-emerald-500/10 hover:scale-105 active:scale-95"
                title={language === 'de' ? 'Switch entire page back to English' : 'Gesamte Seite auf Deutsch übersetzen'}
              >
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                <span className="flex items-center gap-1">
                  <span>{language === 'de' ? '🇩🇪 DE' : '🇬🇧 EN'}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">⇄</span>
                  <span className="text-[11px] text-slate-300 font-semibold hidden md:inline">
                    {language === 'de' ? 'English' : 'Deutsch'}
                  </span>
                </span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
              <span className="hidden xl:inline text-[11px] font-mono font-medium">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Sound FX Audio Haptic Feedback Toggle */}
            <button
              id="sound-fx-toggle-btn"
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                soundOn
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : 'text-slate-400 bg-slate-800/80 hover:bg-slate-700 border-slate-700'
              }`}
              title={soundOn ? 'Tactile Sound Effects: ON (Click to Mute)' : 'Tactile Sound Effects: OFF (Click to Enable)'}
              aria-label="Toggle Sound Effects"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden xl:inline text-[10px] font-mono font-medium">
                {soundOn ? 'SFX ON' : 'MUTE'}
              </span>
            </button>

            {/* GitHub Sync Button */}
            {onOpenGitHubSync && (
              <button
                id="navbar-github-sync-btn"
                onClick={onOpenGitHubSync}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/50 transition-all"
                title="Sync & Push to your GitHub repo"
              >
                <Github className="w-3.5 h-3.5 text-emerald-400" />
                <span>GitHub Sync</span>
              </button>
            )}

            {/* Export & Download CV (PDF) */}
            {onOpenResume && (
              <button
                id="navbar-resume-btn"
                onClick={onOpenResume}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white border border-emerald-500/40 hover:border-emerald-400 font-mono text-xs font-bold transition-all shadow-md shadow-emerald-500/10"
                title={language === 'de' ? 'Lebenslauf als PDF herunterladen' : 'Export & Download Professional CV as PDF'}
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'de' ? 'CV (PDF)' : 'Resume (PDF)'}</span>
              </button>
            )}

            {/* Recruiter Brief Button */}
            <button
              id="navbar-brief-btn"
              onClick={onOpenBrief}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.recruiterBrief}</span>
            </button>

            {/* Direct Connect / Hire Button */}
            <button
              id="navbar-contact-btn"
              onClick={onOpenContact}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t.getInTouch}</span>
            </button>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex md:hidden items-center justify-center p-1 my-2 bg-slate-900 border border-slate-800 rounded-xl gap-2">
          <button
            onClick={() => setActiveView('showcase')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg ${
              activeView === 'showcase' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> {t.showcaseView}
          </button>
          <button
            onClick={() => setActiveView('classic')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg ${
              activeView === 'classic' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> Classic
          </button>
          <button
            onClick={() => setActiveView('tracker')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg ${
              activeView === 'tracker' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> {t.trackerView}
          </button>
          {onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1.5 bg-slate-800 border border-emerald-500/40 rounded-lg text-xs font-bold text-white flex items-center gap-1"
            >
              {language === 'de' ? '🇩🇪 DE' : '🇬🇧 EN'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
