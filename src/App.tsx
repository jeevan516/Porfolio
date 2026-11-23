/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { TargetRole } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ResearchVisualsSection } from './components/ResearchVisualsSection';
import { RoleFilterBar } from './components/RoleFilterBar';
import { NeuefischeJourney } from './components/NeuefischeJourney';
import { AboutSection } from './components/AboutSection';
import { EducationSection } from './components/EducationSection';
import { MasterThesisSection } from './components/MasterThesisSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { CareerTrajectoryChartSection } from './components/CareerTrajectoryChartSection';
import { AcademicReferenceSection } from './components/AcademicReferenceSection';
import { InteractiveArchitectureStudio } from './components/graphics/InteractiveArchitectureStudio';
import { TechNewsSection } from './components/TechNewsSection';
import { PortfolioTracker } from './components/PortfolioTracker';
import { ContactModal } from './components/ContactModal';
import { ExecutiveBriefModal } from './components/ExecutiveBriefModal';
import { ResumeExportModal } from './components/ResumeExportModal';
import { GitHubSyncModal } from './components/GitHubSyncModal';
import { ClassicPortfolioView } from './components/ClassicPortfolioView';
import { JeevanChatbot } from './components/JeevanChatbot';
import { Reveal } from './components/ui/Reveal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeView, setActiveView] = useState<'showcase' | 'classic' | 'tracker'>('showcase');
  const [activeRole, setActiveRole] = useState<TargetRole>('all');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isGitHubSyncOpen, setIsGitHubSyncOpen] = useState(false);
  const [chatbotOpenSignal, setChatbotOpenSignal] = useState(0);
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

  // Theme: follow the OS until the visitor picks one with the toggle; the choice is stored and
  // written to <html data-theme>, which jd.css honours both ways.
  const prefersDark = () =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const stored = localStorage.getItem('jeevan_portfolio_theme');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      /* storage blocked */
    }
    return prefersDark() ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // While no choice is stored, keep following OS changes
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem('jeevan_portfolio_theme')) return;
      } catch {
        /* storage blocked: follow the OS */
      }
      setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen flex flex-col bg-bg text-fg">

      {/* Ambient background: slow amber/teal aurora + cursor spotlight (both stop under reduced motion) */}
      <div className="aurora-backdrop" aria-hidden="true">
        <div className="aurora-grid" />
      </div>
      <div className="cursor-spotlight" aria-hidden="true" />

      {/* Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenBrief={() => setIsBriefOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenGitHubSync={() => setIsGitHubSyncOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* Main Content Area */}
      <main id="main" tabIndex={-1} className="relative z-[2] flex-1 focus:outline-none">
        {activeView === 'showcase' ? (
          <>
            {/* Hero: one message, primary CTA, headline facts */}
            <Hero
              onOpenContact={() => setIsContactOpen(true)}
              onOpenResume={() => setIsResumeOpen(true)}
              language={language}
            />

            {/* neuefische bootcamp journey: generated from ~/Projects/project-notes (see src/data/journey.ts) */}
            <NeuefischeJourney language={language} />

            {/* About & Dual Foundation Section */}
            <Reveal>
            <AboutSection language={language} />
            </Reveal>

            {/* Interactive research visualisations (VLSI, LSTM, IoT), moved out of the hero */}
            <ResearchVisualsSection language={language} />

            {/* University Education & Master's Thesis Research Project */}
            <Reveal>
            <EducationSection language={language} />
            </Reveal>

            {/* Master's Thesis Dedicated Deep-Dive Block (TU Clausthal & Prof. Dr. Christian Siemers) */}
            <Reveal>
            <MasterThesisSection
              onOpenContact={() => setIsContactOpen(true)}
              onOpenChatbot={() => setChatbotOpenSignal((n) => n + 1)}
            />
            </Reveal>

            {/* Role filter: tailors the Projects and Skills sections below */}
            <RoleFilterBar activeRole={activeRole} setActiveRole={setActiveRole} language={language} />

            {/* Projects with Real-World Industrial & AI Impact */}
            <Reveal>
            <ProjectsSection activeRole={activeRole} language={language} />
            </Reveal>

            {/* Comprehensive Skills & Verified Certifications */}
            <Reveal>
            <SkillsSection activeRole={activeRole} language={language} />
            </Reveal>

            {/* Experience & Academic Trajectory (WaDaCon & TU Clausthal) */}
            <Reveal>
            <ExperienceTimeline />
            </Reveal>

            {/* Career Progression Trajectory & Impact Growth Line Chart (Recharts) */}
            <Reveal>
            <CareerTrajectoryChartSection language={language} />
            </Reveal>

            {/* Academic Reference & Research Supervised by Prof. Dr. Christian Siemers */}
            <Reveal>
            <AcademicReferenceSection />
            </Reveal>

            {/* Interactive Industrial Observability & System Architecture Studio */}
            <Reveal>
            <InteractiveArchitectureStudio language={language} />
            </Reveal>

            {/* Dedicated Technology News & Google Search Grounding Block */}
            <Reveal>
            <TechNewsSection language={language} />
            </Reveal>


          </>
        ) : activeView === 'classic' ? (
          /* Jeevan's Integrated Original / Classic Developer Portfolio */
          <ClassicPortfolioView
            onOpenContact={() => setIsContactOpen(true)}
            onOpenBrief={() => setIsBriefOpen(true)}
            onOpenResume={() => setIsResumeOpen(true)}
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
      <div className="relative z-[2]">
        <Footer
          onOpenContact={() => setIsContactOpen(true)}
          onOpenBrief={() => setIsBriefOpen(true)}
        />
      </div>

      {/* AI Portfolio Career Chatbot */}
      <JeevanChatbot
        onOpenContact={() => setIsContactOpen(true)}
        onOpenBrief={() => setIsBriefOpen(true)}
        openSignal={chatbotOpenSignal}
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

      <ResumeExportModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        language={language}
      />

      <GitHubSyncModal
        isOpen={isGitHubSyncOpen}
        onClose={() => setIsGitHubSyncOpen(false)}
        language={language}
      />



    </div>
    </MotionConfig>
  );
}
