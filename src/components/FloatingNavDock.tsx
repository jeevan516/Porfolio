import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  Sparkles, 
  Video, 
  Briefcase, 
  TrendingUp, 
  Layers, 
  Users, 
  Download, 
  ArrowUp,
  MessageSquare,
  Activity,
  Globe
} from 'lucide-react';
import { playTactileClick } from '../services/soundFx';

interface FloatingNavDockProps {
  onOpenResume?: () => void;
  onOpenContact?: () => void;
  language?: 'en' | 'de';
}

export const FloatingNavDock: React.FC<FloatingNavDockProps> = ({
  onOpenResume,
  onOpenContact,
  language = 'en',
}) => {
  const isDe = language === 'de';
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsVisible(latest > 300);

      // Section tracking
      const sections = ['video-portfolio', 'experience', 'career-trajectory', 'projects', 'observability', 'tech-news', 'visitor-tracker'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 300 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    });
  }, [scrollY]);

  const scrollTo = (id: string) => {
    playTactileClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    playTactileClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'video-portfolio', label: isDe ? 'Video Pitch' : 'Video Pitch', icon: Video },
    { id: 'experience', label: isDe ? 'Erfahrung' : 'Experience', icon: Briefcase },
    { id: 'career-trajectory', label: isDe ? 'Wachstum' : 'Trajectory', icon: TrendingUp },
    { id: 'projects', label: isDe ? 'Projekte' : 'Projects', icon: Layers },
    { id: 'observability', label: isDe ? 'Observability' : 'Observability', icon: Activity },
    { id: 'tech-news', label: isDe ? 'Tech-News' : 'Tech News', icon: Globe },
    { id: 'visitor-tracker', label: isDe ? 'Besucher' : 'Visitors', icon: Users },
  ];

  return (
    <>
      {/* Scroll Progress Bar at Top of Page */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Floating Center Bottom Dock */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-1.5 p-1.5 rounded-full bg-slate-950/85 backdrop-blur-xl border border-slate-800/80 shadow-2xl shadow-black/80"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                    isActive 
                      ? 'text-emerald-300 font-bold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={item.label}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDockPill"
                      className="absolute inset-0 bg-emerald-500/15 border border-emerald-500/30 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{item.label}</span>
                </motion.button>
              );
            })}

            <div className="w-[1px] h-4 bg-slate-800 mx-1" />

            {/* Download CV Quick Button */}
            {onOpenResume && (
              <motion.button
                onClick={onOpenResume}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-mono font-bold shadow-md shadow-emerald-500/20"
                title={isDe ? 'Lebenslauf als PDF herunterladen' : 'Export CV as PDF'}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">CV (PDF)</span>
              </motion.button>
            )}

            {/* Scroll to Top Arrow */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title={isDe ? 'Nach oben scrollen' : 'Scroll to top'}
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
