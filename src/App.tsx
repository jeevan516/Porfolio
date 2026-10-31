/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TargetRole } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoPortfolioSection } from './components/VideoPortfolioSection';
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

  // Drive the cursor spotlight via CSS variables, throttled to one update per frame
  useEffect(() => {
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--spot-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--spot-y', `${e.clientY}px`);
        frame = 0;
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
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
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'dark-theme bg-[#070a12] text-[#e2e8f0]' : 'light-theme bg-[#f8fafc] text-[#0f172a]'} selection:bg-emerald-500/30 selection:text-emerald-200`}>

      {/* Ambient background layers */}
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
      <main className="relative z-[2] flex-1">
        {activeView === 'showcase' ? (
          <>
            {/* High-Impact Hero with Live Graphics & Role Filter */}
            <Hero
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              onOpenContact={() => setIsContactOpen(true)}
              onOpenBrief={() => setIsBriefOpen(true)}
              onOpenResume={() => setIsResumeOpen(true)}
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
              onOpenChatbot={() => setChatbotOpenSignal((n) => n + 1)}
            />

            {/* Projects with Real-World Industrial & AI Impact */}
            <ProjectsSection activeRole={activeRole} language={language} />

            {/* Comprehensive Skills & Verified Certifications */}
            <SkillsSection activeRole={activeRole} language={language} />

            {/* Experience & Academic Trajectory (WaDaCon & TU Clausthal) */}
            <ExperienceTimeline />

            {/* Career Progression Trajectory & Impact Growth Line Chart (Recharts) */}
            <CareerTrajectoryChartSection language={language} />

            {/* Academic Reference & Research Supervised by Prof. Dr. Christian Siemers */}
            <AcademicReferenceSection />

            {/* Interactive Industrial Observability & System Architecture Studio */}
            <InteractiveArchitectureStudio language={language} />

            {/* Dedicated Technology News & Google Search Grounding Block */}
            <TechNewsSection language={language} />


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
  );
}
