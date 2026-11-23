import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Mail,
  FileText,
  Github,
  Linkedin,
  Sparkles,
  Sun,
  Moon,
  Languages,
  Code2,
  Download,
  Volume2,
  VolumeX,
  Menu,
  X,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';
import { isSoundFxEnabled, setSoundFxEnabled, playTactileClick } from '../services/soundFx';

type View = 'showcase' | 'classic' | 'tracker';

interface NavbarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onOpenContact: () => void;
  onOpenBrief: () => void;
  onOpenResume?: () => void;
  onOpenGitHubSync?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  language?: 'en' | 'de';
  onToggleLanguage?: () => void;
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

// Sections shown in the desktop link row; the mobile menu lists every section
const PRIMARY_SECTIONS = ['neuefische-journey', 'about', 'projects', 'experience', 'education', 'master-thesis', 'skills', 'observability', 'contact'];

const ICON_BTN = `items-center justify-center w-10 h-10 rounded-lg text-muted hover:text-fg hover:bg-surface-2 transition-colors ${FOCUS_RING}`;

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
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  // The hero already shows the name; the header only shows it once the hero has scrolled away.
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 360);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const showName = pastHero || activeView !== 'showcase';
  const t = TRANSLATIONS[language].nav;
  const isDe = language === 'de';

  // The GitHub sync flow needs the local Express server (/api/*), which does not exist on GitHub Pages.
  // (Cast because the project has no vite/client type reference; Vite still statically replaces import.meta.env.DEV.)
  const isDev = (import.meta as unknown as { env: { DEV: boolean } }).env.DEV === true;
  const showGitHubSync = isDev && !!onOpenGitHubSync;

  const sectionLinks: { id: string; label: string }[] = [
    { id: 'neuefische-journey', label: isDe ? 'Bootcamp-Reise' : 'Bootcamp journey' },
    { id: 'about', label: t.about },
    { id: 'education', label: t.education },
    { id: 'master-thesis', label: t.masterThesis },
    { id: 'projects', label: t.projects },
    { id: 'skills', label: t.skills },
    { id: 'experience', label: t.experience },
    { id: 'research-visuals', label: isDe ? 'Forschung interaktiv' : 'Research visuals' },
    { id: 'career-trajectory', label: isDe ? 'Werdegang' : 'Trajectory' },
    { id: 'academic-reference', label: t.academicRef },
    { id: 'observability', label: 'Observability' },
    { id: 'tech-news', label: isDe ? 'Tech-News' : 'Tech News' },
    { id: 'contact', label: t.contact },
  ];

  // Close the mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return false;
    const offset = (headerRef.current?.offsetHeight ?? 80) + 8;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    return true;
  };

  /** Navigate to a section, switching to the showcase view first if the target only lives there. */
  const navigateTo = (id: string) => {
    playTactileClick();
    setMenuOpen(false);
    if (id !== 'contact' && activeView !== 'showcase') {
      setActiveView('showcase');
      // Wait for the showcase view to render before scrolling
      let attempts = 0;
      const tryScroll = () => {
        if (scrollToId(id) || attempts++ > 20) return;
        window.setTimeout(tryScroll, 50);
      };
      window.requestAnimationFrame(() => window.setTimeout(tryScroll, 30));
      return;
    }
    scrollToId(id);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    navigateTo(id);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    playTactileClick();
    setMenuOpen(false);
    if (activeView !== 'showcase') setActiveView('showcase');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundFxEnabled(next);
    if (next) playTactileClick();
  };

  const handleSelectView = (view: View) => {
    playTactileClick();
    setMenuOpen(false);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const runAndClose = (fn?: () => void) => () => {
    setMenuOpen(false);
    fn?.();
  };

  const views: { id: View; label: string; short: string; icon: typeof Sparkles }[] = [
    { id: 'showcase', label: t.showcaseView, short: isDe ? 'Übersicht' : 'Showcase', icon: Sparkles },
    { id: 'classic', label: isDe ? 'Klassisches Portfolio' : 'Classic Portfolio', short: isDe ? 'Klassisch' : 'Classic', icon: Code2 },
    { id: 'tracker', label: t.trackerView, short: 'Pipeline', icon: BarChart3 },
  ];

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-line/80 bg-surface/85 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & identity */}
          <a
            href="#hero"
            onClick={handleLogoClick}
            aria-label={isDe ? 'Zum Seitenanfang' : 'Back to top'}
            className={`flex items-center gap-3 group shrink-0 rounded-xl ${FOCUS_RING}`}
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-accent/70 shrink-0 bg-surface-2">
              {!imageError ? (
                <img
                  src="./jeevan-dutta.jpg"
                  alt=""
                  className="w-full h-full object-cover object-top"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-ink-2 flex items-center justify-center text-white font-extrabold text-sm">
                  JD
                </div>
              )}
            </div>
            <div className="min-w-0">
              <span
                className={`block font-display font-bold text-base tracking-tight text-fg group-hover:text-accent-fg transition-[opacity,transform,color] duration-300 whitespace-nowrap ${
                  showName ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 h-0 overflow-hidden'
                }`}
                aria-hidden={!showName}
              >
                {PERSONAL_INFO.name}
              </span>
              <span className="flex items-center gap-1.5 text-[13px] text-muted whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
                {isDe ? 'Sofort verfügbar' : 'Available for work'}
              </span>
            </div>
          </a>

          {/* View switcher (desktop) */}
          <div
            role="tablist"
            aria-label={isDe ? 'Ansicht wählen' : 'Select view'}
            className="hidden md:flex items-center p-1 bg-surface/90 border border-line rounded-xl"
          >
            {views.map((v) => {
              const Icon = v.icon;
              const isActive = activeView === v.id;
              return (
                <button
                  key={v.id}
                  id={`view-${v.id}-tab`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectView(v.id)}
                  title={v.label}
                  aria-label={v.label}
                  className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${FOCUS_RING} ${
                    isActive ? 'text-on-accent' : 'text-muted hover:text-fg'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavbarModePill"
                      className="absolute inset-0 bg-accent rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">{v.short}</span>
                </button>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden xl:inline-flex ${ICON_BTN}`}
              aria-label="GitHub profile"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden xl:inline-flex ${ICON_BTN}`}
              aria-label="LinkedIn profile"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            {onToggleLanguage && (
              <button
                id="navbar-language-toggle-btn"
                onClick={onToggleLanguage}
                className={`hidden sm:inline-flex items-center gap-1.5 h-10 px-2.5 rounded-lg border border-line-strong hover:border-accent/60 text-sm font-semibold text-fg hover:text-fg transition-colors ${FOCUS_RING}`}
                aria-label={isDe ? 'Switch to English' : 'Auf Deutsch umschalten'}
                title={isDe ? 'Switch to English' : 'Auf Deutsch umschalten'}
              >
                <Languages className="w-3.5 h-3.5 text-accent-fg" />
                <span className="font-mono">{isDe ? 'DE' : 'EN'}</span>
              </button>
            )}

            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              className={`inline-flex ${ICON_BTN}`}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-accent-fg" aria-hidden="true" /> : <Moon className="w-4 h-4 text-teal" aria-hidden="true" />}
            </button>

            <button
              id="sound-fx-toggle-btn"
              onClick={handleToggleSound}
              className={`hidden sm:inline-flex ${ICON_BTN} ${soundOn ? 'text-accent-fg' : ''}`}
              title={soundOn ? 'Sound effects on' : 'Sound effects off'}
              aria-label={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
              aria-pressed={soundOn}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {showGitHubSync && (
              <button
                id="navbar-github-sync-btn"
                onClick={onOpenGitHubSync}
                className={`hidden xl:inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-sm font-semibold border border-dashed border-line-strong text-muted hover:text-fg hover:border-accent/60 transition-colors ${FOCUS_RING}`}
                title="Dev only: sync & push to GitHub"
              >
                <Github className="w-3.5 h-3.5 text-accent-fg" />
                <span>Sync</span>
              </button>
            )}

            {onOpenResume && (
              <button
                id="navbar-resume-btn"
                onClick={onOpenResume}
                className={`hidden md:inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-sm font-semibold border border-accent/40 text-accent-fg hover:text-fg hover:border-accent hover:bg-accent/10 transition-colors ${FOCUS_RING}`}
                title={isDe ? 'Lebenslauf als PDF herunterladen' : 'Download CV as PDF'}
                aria-label={isDe ? 'Lebenslauf als PDF herunterladen' : 'Download CV as PDF'}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{isDe ? 'CV' : 'Resume'}</span>
              </button>
            )}

            <button
              id="navbar-brief-btn"
              onClick={onOpenBrief}
              title={t.recruiterBrief}
              aria-label={t.recruiterBrief}
              className={`hidden lg:inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-sm font-semibold border border-line-strong text-fg hover:text-fg hover:border-line-strong transition-colors ${FOCUS_RING}`}
            >
              <FileText className="w-3.5 h-3.5 text-teal" />
              <span className="hidden xl:inline">{t.recruiterBrief}</span>
            </button>

            <button
              id="navbar-contact-btn"
              onClick={onOpenContact}
              aria-label={t.getInTouch}
              className={`inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-sm font-bold bg-accent hover:bg-accent-hover text-on-accent transition-colors ${FOCUS_RING}`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{t.getInTouch}</span>
            </button>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`inline-flex lg:hidden ${ICON_BTN}`}
              aria-label={menuOpen ? (isDe ? 'Menü schließen' : 'Close menu') : isDe ? 'Menü öffnen' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-panel"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Section links (desktop) */}
        <nav
          aria-label={isDe ? 'Abschnitte' : 'Sections'}
          className="hidden lg:flex items-center gap-1 -mx-2 pb-2 overflow-x-auto text-sm font-medium text-muted [scrollbar-width:none]"
        >
          {sectionLinks.filter((link) => PRIMARY_SECTIONS.includes(link.id)).map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link.id)}
              className={`shrink-0 px-2.5 py-1.5 rounded-md hover:text-fg hover:bg-surface-2/60 transition-colors ${FOCUS_RING}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Mobile / tablet menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-line bg-bg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* View switcher */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-surface border border-line rounded-xl">
                {views.map((v) => {
                  const Icon = v.icon;
                  const isActive = activeView === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleSelectView(v.id)}
                      aria-pressed={isActive}
                      className={`flex items-center justify-center gap-1.5 py-2 text-sm font-semibold rounded-lg transition-colors ${FOCUS_RING} ${
                        isActive ? 'bg-accent text-on-accent' : 'text-muted hover:text-fg'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {v.short}
                    </button>
                  );
                })}
              </div>

              {/* Section links */}
              <nav aria-label={isDe ? 'Abschnitte' : 'Sections'} className="grid grid-cols-2 gap-1">
                {sectionLinks.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => handleLinkClick(e, link.id)}
                    className={`px-3 py-2 rounded-lg text-sm text-muted hover:text-fg hover:bg-surface-2/70 transition-colors ${FOCUS_RING}`}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-line">
                {onOpenResume && (
                  <button
                    onClick={runAndClose(onOpenResume)}
                    className={`inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-sm font-semibold border border-accent/40 text-accent-fg hover:text-fg transition-colors ${FOCUS_RING}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isDe ? 'CV (PDF)' : 'Resume (PDF)'}
                  </button>
                )}
                <button
                  onClick={runAndClose(onOpenBrief)}
                  className={`inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-sm font-semibold border border-line-strong text-fg hover:text-fg transition-colors ${FOCUS_RING}`}
                >
                  <FileText className="w-3.5 h-3.5 text-teal" />
                  {t.recruiterBrief}
                </button>
                {onToggleLanguage && (
                  <button
                    onClick={runAndClose(onToggleLanguage)}
                    className={`sm:hidden inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-sm font-semibold border border-line-strong text-fg hover:text-fg transition-colors ${FOCUS_RING}`}
                  >
                    <Languages className="w-3.5 h-3.5 text-accent-fg" />
                    {isDe ? 'English' : 'Deutsch'}
                  </button>
                )}
                <button
                  onClick={handleToggleSound}
                  aria-pressed={soundOn}
                  className={`sm:hidden inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-sm font-semibold border border-line-strong text-fg hover:text-fg transition-colors ${FOCUS_RING}`}
                >
                  {soundOn ? <Volume2 className="w-3.5 h-3.5 text-accent-fg" /> : <VolumeX className="w-3.5 h-3.5" />}
                  Sound {soundOn ? 'on' : 'off'}
                </button>
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className={`inline-flex ${ICON_BTN}`}
                  aria-label="GitHub profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className={`inline-flex ${ICON_BTN}`}
                  aria-label="LinkedIn profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
