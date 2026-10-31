import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Video, Briefcase, TrendingUp, Layers, Users, Download, ArrowUp, Mail, Activity, Globe } from 'lucide-react';
import { playTactileClick } from '../services/soundFx';

interface FloatingNavDockProps {
  onOpenResume?: () => void;
  onOpenContact?: () => void;
  language?: 'en' | 'de';
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60';

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const header = document.querySelector('header');
  const offset = (header instanceof HTMLElement ? header.offsetHeight : 80) + 8;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
};

export const FloatingNavDock: React.FC<FloatingNavDockProps> = ({
  onOpenResume,
  onOpenContact,
  language = 'en',
}) => {
  const isDe = language === 'de';
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  // Only show links whose target section is actually rendered (e.g. not in the classic / tracker views)
  const [availableIds, setAvailableIds] = useState<string[]>([]);

  const navItems = [
    { id: 'video-portfolio', label: 'Video Pitch', icon: Video },
    { id: 'experience', label: isDe ? 'Erfahrung' : 'Experience', icon: Briefcase },
    { id: 'career-trajectory', label: isDe ? 'Werdegang' : 'Trajectory', icon: TrendingUp },
    { id: 'projects', label: isDe ? 'Projekte' : 'Projects', icon: Layers },
    { id: 'observability', label: 'Observability', icon: Activity },
    { id: 'tech-news', label: isDe ? 'Tech-News' : 'Tech News', icon: Globe },
    { id: 'visitor-tracker', label: isDe ? 'Besucher' : 'Visitors', icon: Users },
  ];

  useEffect(() => {
    const ids = navItems.map((i) => i.id);
    const update = (latest: number) => {
      setIsVisible(latest > 300);
      const present = ids.filter((id) => document.getElementById(id));
      setAvailableIds((prev) => (prev.join() === present.join() ? prev : present));
      for (const id of present) {
        const rect = document.getElementById(id)!.getBoundingClientRect();
        if (rect.top <= 300 && rect.bottom >= 200) {
          setActiveSection(id);
          break;
        }
      }
    };
    update(window.scrollY);
    return scrollY.on('change', update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollY]);

  const scrollTo = (id: string) => {
    playTactileClick();
    scrollToId(id);
  };

  const scrollToTop = () => {
    playTactileClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleItems = navItems.filter((item) => availableIds.includes(item.id));

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-emerald-400 origin-left z-[100]"
        style={{ scaleX }}
      />

      <AnimatePresence>
        {isVisible && (
          <motion.nav
            aria-label={isDe ? 'Schnellnavigation' : 'Quick navigation'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-1 p-1.5 rounded-full bg-slate-950/90 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-black/60 max-w-[calc(100vw-2rem)]"
          >
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  aria-label={item.label}
                  aria-current={isActive ? 'true' : undefined}
                  title={item.label}
                  className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${FOCUS_RING} ${
                    isActive ? 'text-emerald-300' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDockPill"
                      className="absolute inset-0 bg-emerald-500/15 border border-emerald-500/30 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">{item.label}</span>
                </button>
              );
            })}

            {visibleItems.length > 0 && <div className="w-px h-4 bg-slate-800 mx-1" />}

            {onOpenContact && (
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenContact();
                }}
                className={`p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ${FOCUS_RING}`}
                aria-label={isDe ? 'Kontakt aufnehmen' : 'Get in touch'}
                title={isDe ? 'Kontakt aufnehmen' : 'Get in touch'}
              >
                <Mail className="w-3.5 h-3.5" />
              </button>
            )}

            {onOpenResume && (
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenResume();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors ${FOCUS_RING}`}
                aria-label={isDe ? 'Lebenslauf als PDF herunterladen' : 'Download CV as PDF'}
                title={isDe ? 'Lebenslauf als PDF herunterladen' : 'Download CV as PDF'}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">CV</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className={`p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${FOCUS_RING}`}
              aria-label={isDe ? 'Nach oben scrollen' : 'Scroll to top'}
              title={isDe ? 'Nach oben scrollen' : 'Scroll to top'}
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};
