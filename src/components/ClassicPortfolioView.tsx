import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Activity, 
  Terminal, 
  FileText, 
  Send, 
  Copy, 
  Check, 
  Download,
  ShieldCheck,
  ChevronRight,
  Database,
  Radio,
  Clock,
  Code2
} from 'lucide-react';
import { PERSONAL_INFO, PROJECTS_DATA, SKILL_CATEGORIES, EXPERIENCES, EDUCATION_DATA, CERTIFICATIONS } from '../data/portfolioData';
import { NeuralNetworkCanvas } from './graphics/NeuralNetworkCanvas';
import { CareerTrajectoryChartSection } from './CareerTrajectoryChartSection';
import { TechNewsSection } from './TechNewsSection';
import { VisitorTrackerBlock } from './VisitorTrackerBlock';

interface ClassicPortfolioViewProps {
  onOpenContact: () => void;
  onOpenBrief: () => void;
  onOpenResume?: () => void;
  language?: 'en' | 'de';
}

export const ClassicPortfolioView: React.FC<ClassicPortfolioViewProps> = ({
  onOpenContact,
  onOpenBrief,
  onOpenResume,
  language = 'en',
}) => {
  const isDe = language === 'de';

  // Typewriter effect cycling through roles
  const roles = [
    'IT Specialist & AI Engineer',
    'MSc Informatics (TU Clausthal)',
    'Industrial IoT Observability Architect',
    'Full-Stack & Cloud Infrastructure Lead',
    'Distributed Systems & Load Balancer Specialist'
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [subText, setSubText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Matrix canvas reference
  const matrixCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typeSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setSubText(currentRole.substring(0, subText.length + 1));
        if (subText.length + 1 === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setSubText(currentRole.substring(0, subText.length - 1));
        if (subText.length === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [subText, isDeleting, roleIndex]);

  // Matrix data rain canvas animation
  useEffect(() => {
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener('resize', handleResize);

    const columns = Math.floor(width / 20);
    const drops = Array.from({ length: columns }, () => Math.random() * -50);
    const chars = '010101010101ABCDEFλθπτΣΩ{}[]()<>=/\\*+';

    const draw = () => {
      ctx.fillStyle = 'rgba(6, 10, 18, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#10b981';
      ctx.font = '12px "JetBrains Mono", monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 20;
        const y = drops[i] * 20;

        ctx.fillStyle = Math.random() > 0.85 ? '#6ee7b7' : 'rgba(16, 185, 129, 0.4)';
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.55;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="w-full relative min-h-screen text-slate-100 bg-[#090d16] selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* ── HERO SECTION WITH MATRIX RAIN & NEURAL NET ── */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-slate-800/80">
        
        {/* Matrix Data Rain Ambient Canvas */}
        <div className="absolute inset-x-0 top-0 h-[420px] pointer-events-none opacity-30 -z-10 overflow-hidden">
          <canvas ref={matrixCanvasRef} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090d16]/70 to-[#090d16]" />
        </div>

        {/* Floating Gradient Orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-xs text-emerald-300 font-mono mb-6 shadow-lg shadow-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isDe ? 'Verfügbar für neue Aufgaben · Deutschland' : 'Available for Opportunities · Germany'}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & Typewriter Bio */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>ORIGINAL PORTFOLIO & ARCHITECTURE SHOWCASE</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight">
                  Jeevan <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Dutta</span>
                </h1>

                {/* Animated Typewriter Subtitle */}
                <div className="h-8 flex items-center">
                  <p className="text-lg sm:text-xl font-mono text-cyan-300 font-medium">
                    {subText}
                    <span className="inline-block w-2 h-5 ml-1 bg-emerald-400 animate-pulse" />
                  </p>
                </div>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                {isDe 
                  ? 'Verbindung von Datenintelligenz & IT-Engineering zur Optimierung industrieller Prozesse. Entwicklung von Observability-Pipelines, KI-gestützten Systemen und robuster IT-Infrastruktur mit Masterabschluss der TU Clausthal.'
                  : 'Bridging Data Intelligence & IT Engineering to revolutionize industrial operations. I build observability pipelines, AI-powered systems, and resilient infrastructure that transform how industries operate.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn Profile</span>
                </a>

                {onOpenResume && (
                  <button
                    onClick={onOpenResume}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 hover:text-white border border-emerald-500/50 hover:border-emerald-400 text-xs sm:text-sm font-semibold transition-all shadow-md shadow-emerald-500/10"
                    title={isDe ? 'Lebenslauf als PDF herunterladen' : 'Download CV as PDF'}
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>{isDe ? 'CV (PDF) Export' : 'Download CV (PDF)'}</span>
                  </button>
                )}

                <button
                  onClick={onOpenContact}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-emerald-500/50 text-xs sm:text-sm font-semibold transition-all"
                >
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>{isDe ? 'Kontakt aufnehmen' : 'Get in Touch'}</span>
                </button>

                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono transition-colors"
                  title="Copy email address"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedEmail ? 'Copied' : PERSONAL_INFO.email}</span>
                </button>
              </div>

              {/* Quick Stat Pill Highlights from Original Portfolio */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    10+
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Years Experience</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    5
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Companies & Roles</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    60%
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Cycle Time Reduction</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    MSc
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">TU Clausthal</div>
                </div>
              </div>

            </div>

            {/* Right Column: Signature Neural Network Architecture Graphic */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl p-1 bg-gradient-to-b from-emerald-500/30 via-slate-800 to-slate-900 shadow-2xl">
                <div className="rounded-[22px] bg-slate-950/90 p-4 border border-slate-800 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" />
                      Deep Sequence ML Model (Live Architecture)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      Forward Pass
                    </span>
                  </div>

                  <NeuralNetworkCanvas />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── FEATURED PROJECTS GRID (ALL 7 PROJECTS FROM ORIGINAL PORTFOLIO) ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {isDe ? 'Ausgewählte Projekte' : 'Featured Work'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Featured <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            A selection of projects spanning AI/ML, cloud infrastructure, data engineering, and backend development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS_DATA.map((proj) => (
            <div 
              key={proj.id}
              className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/40 hover:-translate-y-1.5"
            >
              <div className="space-y-4">
                
                {/* Project Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                    {proj.category === 'ai-ml' ? <Cpu className="w-5 h-5" /> : proj.category === 'observability' ? <Activity className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                  </div>
                  
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="View GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-white group-hover:text-emerald-300 transition-colors">
                    {proj.title}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400 mt-1 line-clamp-1">
                    {proj.tagline}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-4">
                  {proj.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.tags.slice(0, 4).map((t, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/60 text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                  {proj.tags.length > 4 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      +{proj.tags.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer / Metrics */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 truncate pr-2 font-medium">
                  {proj.metrics[0]?.value || proj.status}
                </span>
                
                {proj.githubUrl ? (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 group-hover:text-white flex items-center gap-1 transition-colors shrink-0"
                  >
                    <span>View Repo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <span className="text-slate-500">{proj.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECHNICAL SKILLS GRID (6 CATEGORIES FROM ORIGINAL PORTFOLIO) ── */}
      <section className="py-16 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              Capabilities
            </span>
            <h2 className="text-3xl font-extrabold font-display text-white">
              Technical <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Skills</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A broad toolkit spanning infrastructure, data engineering, AI/ML, and software development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILL_CATEGORIES.map((cat, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm">
                    ⚡
                  </div>
                  <h3 className="font-bold text-sm text-white font-display uppercase tracking-wider">
                    {cat.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className={`text-xs px-3 py-1 rounded-full border transition-all ${
                        s.highlight
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                          : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:text-white'
                      }`}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CAREER WORK EXPERIENCE TIMELINE ── */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-2">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
            Career
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Work <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-sm text-slate-400">
            A track record across observability, AI engineering, data analysis, and full-stack development.
          </p>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-800">
          {EXPERIENCES.map((exp) => (
            <div key={exp.id} className="relative pl-12">
              {/* Dot */}
              <div className="absolute left-3 top-2 -translate-x-1/2 w-5 h-5 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              {/* Card */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-white font-display">
                    {exp.company}
                  </h3>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {exp.period}
                  </span>
                </div>

                <div className="text-sm font-semibold text-cyan-300">
                  {exp.role}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  📍 {exp.location}
                </div>

                <ul className="space-y-1.5 pt-2 text-xs text-slate-300 leading-relaxed font-light">
                  {exp.achievements.slice(0, 4).map((a, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">▸</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exp.technologies.slice(0, 6).map((tech, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CAREER TRAJECTORY & IMPACT GROWTH CHART (RECHARTS) ── */}
      <CareerTrajectoryChartSection language={language} />

      {/* ── EDUCATION & CERTIFICATIONS ── */}
      <section className="py-16 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Education Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
              <GraduationCap className="w-4 h-4" />
              Education
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Master of Science — Informatics
              </h3>
              <div className="text-sm text-purple-300 mt-1 font-semibold">
                Technische Universität Clausthal
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                October 2019 — June 2023 · Germany
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Master’s Thesis: <em>“Definition, Development and Simulation of a 4-Node Communication Network for Reliable Reaction Times Inside Distributed Networks”</em> supervised by Prof. Dr. Christian Siemers.
            </p>
          </div>

          {/* Certifications Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              Verified Industry Certifications (18)
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {CERTIFICATIONS.slice(0, 5).map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800/80">
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-emerald-400">✓</span>
                    <span className="truncate">{c.title}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{c.issuer}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ── DEDICATED TECHNOLOGY NEWS BLOCK (POWERED BY GOOGLE SEARCH GROUNDING) ── */}
      <TechNewsSection language={language} />

      {/* ── REAL-TIME PROFILE OPEN & VISITOR TELEMETRY BLOCK ── */}
      <VisitorTrackerBlock language={language} />

      {/* ── GET IN TOUCH FOOTER CARDS ── */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
            Let's Connect
          </span>
          <h2 className="text-3xl font-extrabold font-display text-white">
            Get in <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Open to exciting opportunities in IT infrastructure, data engineering, AI/ML, and software development.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition-all text-center space-y-2 group"
          >
            <div className="text-2xl">📧</div>
            <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">Email</div>
            <div className="text-xs text-white group-hover:text-emerald-300 font-mono truncate">{PERSONAL_INFO.email}</div>
          </a>

          <a
            href={`tel:${PERSONAL_INFO.phone}`}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition-all text-center space-y-2 group"
          >
            <div className="text-2xl">📱</div>
            <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">Phone</div>
            <div className="text-xs text-white group-hover:text-emerald-300 font-mono">{PERSONAL_INFO.phone}</div>
          </a>

          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition-all text-center space-y-2 group"
          >
            <div className="text-2xl">💼</div>
            <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">LinkedIn</div>
            <div className="text-xs text-white group-hover:text-emerald-300 font-mono">/in/jeevan-dutta</div>
          </a>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-2">
            <div className="text-2xl">📍</div>
            <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">Location</div>
            <div className="text-xs text-white font-mono">{PERSONAL_INFO.location}</div>
          </div>
        </div>
      </section>

    </div>
  );
};
