/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TargetRole } from './types';
import { Languages } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoPortfolioSection } from './components/VideoPortfolioSection';
import { AboutSection } from './components/AboutSection';
import { EducationSection } from './components/EducationSection';
import { MasterThesisSection } from './components/MasterThesisSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { AcademicReferenceSection } from './components/AcademicReferenceSection';
import { InteractiveArchitectureStudio } from './components/graphics/InteractiveArchitectureStudio';
import { TechNewsSection } from './components/TechNewsSection';
import { PortfolioTracker } from './components/PortfolioTracker';
import { ContactModal } from './components/ContactModal';
import { ExecutiveBriefModal } from './components/ExecutiveBriefModal';
import { GitHubSyncModal } from './components/GitHubSyncModal';
import { ClassicPortfolioView } from './components/ClassicPortfolioView';
import { JeevanChatbot } from './components/JeevanChatbot';
import { Footer } from './components/Footer';

export default function App() {
  const [activeView, setActiveView] = useState<'showcase' | 'classic' | 'tracker'>('showcase');
  const [activeRole, setActiveRole] = useState<TargetRole>('all');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [isGitHubSyncOpen, setIsGitHubSyncOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'de'>(() => {
    try {
      const stored = localStorage.getItem('jeevan_portfolio_lang');
      return (stored as 'en' | 'de') || 'en';
    } catch {
      return 'en';
    }
  });

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'de' : 'en';
      try {
        localStorage.setItem('jeevan_portfolio_lang', next);
      } catch (e) {
        console.warn('Could not save language preference', e);
      }
      return next;
    });
  };

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const stored = localStorage.getItem('jeevan_portfolio_theme');
      return (stored as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('jeevan_portfolio_theme', next);
      } catch (e) {
        console.warn('Could not save theme preference', e);
      }
      return next;
    });
  };

  // When a recruiter submits an opportunity from ContactModal, we can record it
  const handleOpportunitySubmitted = (opportunity: {
    company: string;
    contact: string;
    email: string;
    role: string;
    message: string;
  }) => {
    try {
      const saved = localStorage.getItem('jeevan_portfolio_pipeline');
      const existing = saved ? JSON.parse(saved) : [];
      const newLead = {
        id: `lead-${Date.now()}`,
        companyName: opportunity.company,
        contactName: opportunity.contact,
        email: opportunity.email,
        roleTitle: opportunity.role,
        locationType: 'Hamburg Onsite',
        stage: 'inquiry',
        message: opportunity.message,
        salaryOrBudget: 'Market Standard',
        dateAdded: new Date().toISOString().split('T')[0],
        notes: 'Submitted via website contact form.',
      };
      localStorage.setItem('jeevan_portfolio_pipeline', JSON.stringify([newLead, ...existing]));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'dark-theme bg-[#070a12] text-[#e2e8f0]' : 'light-theme bg-[#f8fafc] text-[#0f172a]'} selection:bg-emerald-500/30 selection:text-emerald-200`}>
      
      {/* Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenBrief={() => setIsBriefOpen(true)}
        onOpenGitHubSync={() => setIsGitHubSyncOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'showcase' ? (
          <>
            {/* High-Impact Hero with Live Graphics & Role Filter */}
            <Hero
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              onOpenContact={() => setIsContactOpen(true)}
              onOpenBrief={() => setIsBriefOpen(true)}
              language={language}
            />

            {/* High-Impact Bilingual Video Portfolio & Executive Pitch (English & German) */}
            <VideoPortfolioSection
              onOpenContact={() => setIsContactOpen(true)}
              onOpenBrief={() => setIsBriefOpen(true)}
              language={language}
              onToggleLanguage={toggleLanguage}
            />

            {/* About & Dual Foundation Section */}
            <AboutSection language={language} />

            {/* University Education & Master's Thesis Research Project */}
            <EducationSection language={language} />

            {/* Master's Thesis Dedicated Deep-Dive Block (TU Clausthal & Prof. Dr. Christian Siemers) */}
            <MasterThesisSection
              onOpenContact={() => setIsContactOpen(true)}
            />

            {/* Projects with Real-World Industrial & AI Impact */}
            <ProjectsSection activeRole={activeRole} language={language} />

            {/* Comprehensive Skills & Verified Certifications */}
            <SkillsSection activeRole={activeRole} language={language} />

            {/* Experience & Academic Trajectory (WaDaCon & TU Clausthal) */}
            <ExperienceTimeline />

            {/* Academic Reference & Research Supervised by Prof. Dr. Christian Siemers */}
            <AcademicReferenceSection />

            {/* Interactive Industrial Observability & System Architecture Studio */}
            <InteractiveArchitectureStudio language={language} />

            {/* Dedicated Technology News & Google Search Grounding Block */}
            <TechNewsSection language={language} />

            {/* Embedded Portfolio Tracker & Recruiter Hub */}
            <PortfolioTracker
              onOpenContact={() => setIsContactOpen(true)}
              onOpenBrief={() => setIsBriefOpen(true)}
            />
          </>
        ) : activeView === 'classic' ? (
          /* Jeevan's Integrated Original / Classic Developer Portfolio */
          <ClassicPortfolioView
            onOpenContact={() => setIsContactOpen(true)}
            onOpenBrief={() => setIsBriefOpen(true)}
            language={language}
          />
        ) : (
          /* Dedicated Recruiter & Portfolio Tracker Hub */
          <div className="py-6">
            <PortfolioTracker
              onOpenContact={() => setIsContactOpen(true)}
              onOpenBrief={() => setIsBriefOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenContact={() => setIsContactOpen(true)}
        onOpenBrief={() => setIsBriefOpen(true)}
      />

      {/* AI Portfolio Career Chatbot */}
      <JeevanChatbot
        onOpenContact={() => setIsContactOpen(true)}
        onOpenBrief={() => setIsBriefOpen(true)}
      />

      {/* Modals */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onOpportunitySubmitted={handleOpportunitySubmitted}
      />

      <ExecutiveBriefModal
        isOpen={isBriefOpen}
        onClose={() => setIsBriefOpen(false)}
      />

      <GitHubSyncModal
        isOpen={isGitHubSyncOpen}
        onClose={() => setIsGitHubSyncOpen(false)}
        language={language}
      />

      {/* Floating Quick Translate Button (Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          id="floating-translate-btn"
          onClick={toggleLanguage}
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-white border-2 border-emerald-500/60 hover:border-emerald-400 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 group"
          title={language === 'de' ? 'Switch back to English' : 'Gesamte Seite auf Deutsch übersetzen'}
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:rotate-12 transition-transform">
            <Languages className="w-4 h-4" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
              {language === 'de' ? 'Sprache / Language' : 'Translate Page'}
            </div>
            <div className="text-xs font-extrabold flex items-center gap-1.5 text-white">
              <span>{language === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English'}</span>
              <span className="text-emerald-400 text-[10px]">⇄</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {language === 'de' ? 'EN' : 'DE'}
              </span>
            </div>
          </div>
        </button>
      </div>

    </div>
  );
}
