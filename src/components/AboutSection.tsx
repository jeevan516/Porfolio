import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { TRANSLATIONS } from '../data/translations';
import { SystemArchitectureVisualizer } from './graphics/SystemArchitectureVisualizer';
import { 
  Database, 
  Server, 
  Cpu, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Terminal,
  Activity
} from 'lucide-react';

interface AboutSectionProps {
  language?: 'en' | 'de';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ language = 'en' }) => {
  const t = TRANSLATIONS[language].about;
  return (
    <section id="about" className="py-16 border-t border-line/80 bg-bg/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & Bio */}
          <div className="lg:col-span-7 space-y-6">
            
            <div>
              <div className="inline-flex items-center gap-2 text-sm text-accent-fg font-semibold mb-2">
                <Sparkles className="w-4 h-4" />
                {t.tag}
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-fg tracking-tight">
                {t.heading}
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-muted leading-relaxed font-light">
              <p>{t.p1}</p>
              <p>{t.p2}</p>
              <p>{t.p3}</p>
            </div>

            {/* Pillar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-surface/80 border border-line space-y-1.5">
                <div className="flex items-center gap-2 text-accent-fg font-semibold text-sm">
                  <Database className="w-4 h-4" />
                  <span>{t.pillar1Title}</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {t.pillar1Desc}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface/80 border border-line space-y-1.5">
                <div className="flex items-center gap-2 text-teal font-semibold text-sm">
                  <Server className="w-4 h-4" />
                  <span>{t.pillar2Title}</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {t.pillar2Desc}
                </p>
              </div>
            </div>

            {/* Key Availability & Bootcamp Note */}
            <div className="p-5 rounded-2xl bg-surface/80 border border-accent/40 flex flex-col sm:flex-row items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent-fg shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-fg text-sm">{t.availTitle}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/15 text-accent-fg border border-accent/30">
                    {t.availBadge}
                  </span>
                </div>
                <p className="text-muted leading-relaxed text-sm">{t.availDesc}</p>
                <ul className="flex flex-wrap gap-2 pt-1 text-xs text-muted">
                  <li className="px-2.5 py-1 rounded-md bg-surface-2/80 border border-line-strong">neuefische GmbH: AI, ML, Data Science, Data Eng &amp; SE</li>
                  <li className="px-2.5 py-1 rounded-md bg-surface-2/80 border border-line-strong">Full-Time / Contract</li>
                  <li className="px-2.5 py-1 rounded-md bg-surface-2/80 border border-line-strong">Hamburg · On-site / Hybrid / Remote</li>
                  <li className="px-2.5 py-1 rounded-md bg-surface-2/80 border border-line-strong">Full work authorization in Germany</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Right Column: Architectural Highlights, Executive Profile & Interactive Visualizer */}
          <div className="lg:col-span-5 space-y-4">
            {/* Professional Profile Spotlight Card */}
            <div className="p-4 rounded-2xl bg-surface/80 border border-line flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ring-accent-fg/50 shadow-md bg-surface-2">
                  <img
                    src="./jeevan-dutta.jpg"
                    alt="Jeevan Dutta - Professional Profile"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-accent text-on-accent">
                  <CheckCircle2 className="w-3.5 h-3.5 text-on-accent font-bold" />
                </div>
              </div>

              <div className="space-y-1 text-xs min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-fg font-display">
                    Jeevan Dutta
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-accent/15 text-accent-fg border border-accent/30">
                    Verified
                  </span>
                </div>
                <div className="text-muted font-medium">
                  MSc Informatics (TU Clausthal)
                </div>
                <div className="text-muted text-xs leading-snug">
                  Specializing in Industrial IoT Observability, Deep Sequence Forecasting, and Resilient IT Architecture.
                </div>
                <div className="flex flex-wrap items-center gap-x-2 text-xs text-accent-fg pt-0.5">
                  <span>Authorized to Work in Germany</span>
                  <span>·</span>
                  <span>DTZ B1 Certified</span>
                </div>
              </div>
            </div>

            <SystemArchitectureVisualizer />
          </div>

        </div>

      </div>
    </section>
  );
};
