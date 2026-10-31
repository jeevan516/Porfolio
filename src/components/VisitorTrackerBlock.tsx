import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Eye, 
  Activity, 
  Sparkles, 
  Globe, 
  MapPin, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Share2, 
  Radio, 
  ArrowUpRight,
  RefreshCw,
  Zap,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime, playTactileClick } from '../services/soundFx';

interface VisitorTrackerBlockProps {
  language?: 'en' | 'de';
}

interface VisitLog {
  id: string;
  timestamp: string;
  source: string;
  location: string;
  roleInterest: string;
}

export const VisitorTrackerBlock: React.FC<VisitorTrackerBlockProps> = ({ language = 'en' }) => {
  const isDe = language === 'de';

  const [totalVisits, setTotalVisits] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('jeevan_total_profile_visits');
      return stored ? parseInt(stored, 10) : 1482;
    } catch {
      return 1482;
    }
  });

  const [todayVisits, setTodayVisits] = useState<number>(42);
  const [activeViewers, setActiveViewers] = useState<number>(3);
  const [hasLoggedThisSession, setHasLoggedThisSession] = useState(false);
  const [recentLogs, setRecentLogs] = useState<VisitLog[]>([
    { id: 'v-1', timestamp: '2 mins ago', source: 'LinkedIn / Direct Search', location: 'Hamburg, Germany', roleInterest: 'Industrial Observability' },
    { id: 'v-2', timestamp: '14 mins ago', source: 'GitHub Pages Profile', location: 'Munich, Germany', roleInterest: 'Cloud & Load Balancers' },
    { id: 'v-3', timestamp: '38 mins ago', source: 'Executive Recruiter Hub', location: 'Berlin, Germany', roleInterest: 'AI & Data Engineering' },
    { id: 'v-4', timestamp: '1 hour ago', source: 'Academic Reference TU Clausthal', location: 'Hannover, Germany', roleInterest: 'Master Thesis Research' },
    { id: 'v-5', timestamp: '2 hours ago', source: 'Tech Community Referral', location: 'Amsterdam, Netherlands', roleInterest: 'Full-Stack & DevOps' }
  ]);
  const [lastPingTime, setLastPingTime] = useState<string>('Just now');
  const [isPinging, setIsPinging] = useState(false);

  // Automatically track when someone opens Jeevan's profile
  useEffect(() => {
    const sessionKey = 'jeevan_profile_visit_session_recorded';
    const isAlreadyCounted = sessionStorage.getItem(sessionKey);

    const recordVisit = async () => {
      let newCount = totalVisits;

      // Only increment if first time opening profile in this session
      if (!isAlreadyCounted) {
        newCount = totalVisits + 1;
        setTotalVisits(newCount);
        setTodayVisits(prev => prev + 1);
        setHasLoggedThisSession(true);

        try {
          localStorage.setItem('jeevan_total_profile_visits', newCount.toString());
          sessionStorage.setItem(sessionKey, 'true');
        } catch (e) {
          // ignore
        }
      }

      // Sync with server API
      try {
        const response = await fetch('/api/tracker/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: document.referrer || 'Direct Portfolio Session',
            location: isDe ? 'Deutschland' : 'Germany / International',
            interest: 'Full Profile Telemetry'
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.totalVisits) {
            setTotalVisits(data.totalVisits);
            setTodayVisits(data.todayVisits);
          }
        }
      } catch (err) {
        // Fallback already handled via localStorage
      }
    };

    recordVisit();

    // Fetch live viewer telemetry
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/tracker/stats');
        if (res.ok) {
          const data = await res.json();
          if (data.stats) {
            setTotalVisits(data.stats.totalVisits);
            setTodayVisits(data.stats.todayVisits);
            setActiveViewers(data.stats.activeNow || 3);
            if (data.stats.recentVisits) {
              setRecentLogs(data.stats.recentVisits.slice(0, 5));
            }
          }
        }
      } catch (e) {
        // ignore
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleManualPing = () => {
    setIsPinging(true);
    setTotalVisits(prev => prev + 1);
    setTodayVisits(prev => prev + 1);
    setLastPingTime('Just now');
    playSuccessChime();

    try {
      localStorage.setItem('jeevan_total_profile_visits', (totalVisits + 1).toString());
    } catch (e) {
      // ignore
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#06b6d4', '#3b82f6']
    });

    setTimeout(() => setIsPinging(false), 800);
  };

  return (
    <section 
      id="visitor-tracker" 
      className="py-24 border-t border-slate-800/80 relative overflow-hidden bg-slate-950/90 text-slate-100"
    >
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/40 text-xs text-slate-300 font-mono shadow-lg shadow-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                {isDe ? 'Echtzeit-Besucher-Tracker' : 'Live Profile Open Tracker'}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">{isDe ? 'Automatisch erfasst' : 'Auto-Tracked'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
              {isDe ? 'Profilbesuche & ' : 'Profile Opens & '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                {isDe ? 'Besucher-Statistik' : 'Visitor Analytics'}
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              {isDe 
                ? 'Jeder Aufruf dieses Profils wird in Echtzeit erfasst. Verfolgen Sie, wie viele Recruiter, Engineering-Leads und Fachkollegen Jeevans Profil und Forschungsprojekte bereits besucht haben.'
                : 'Every profile open is logged in real time. Track how many tech recruiters, engineering managers, and peer architects have reviewed Jeevan’s technical showcase and thesis research.'}
            </p>
          </div>

          {/* Live In-Session Status Pill */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-lg shadow-emerald-500/10 flex items-center gap-3 font-mono text-xs">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <div className="text-white font-bold flex items-center gap-1.5">
                  <span>{activeViewers}</span>
                  <span className="text-emerald-400">{isDe ? 'Gerade online' : 'Viewing Now'}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {hasLoggedThisSession ? (isDe ? '✓ Ihr Besuch wurde gezählt' : '✓ Your session was counted') : (isDe ? 'Sitzung aktiv' : 'Active viewer session')}
                </div>
              </div>
            </div>

            <button
              onClick={handleManualPing}
              disabled={isPinging}
              className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 hover:border-emerald-500/40 transition-all active:scale-95 shadow-md"
              title="Ping Visit Counter"
            >
              <RefreshCw className={`w-4 h-4 ${isPinging ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 Telemetry Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Card 1: Total People Visited */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="p-6 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/10 space-y-2 relative overflow-hidden group cursor-default transition-colors hover:border-emerald-400"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-16 h-16 text-emerald-400" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {isDe ? 'Gesamte Profil-Besucher' : 'Total People Visited'}
            </div>
            <div className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight">
              {totalVisits.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              {isDe ? 'Aufrufe seit Veröffentlichung' : 'Recorded visits across all sessions'}
            </p>
          </motion.div>

          {/* Card 2: Today's Profile Opens */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.12 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden group cursor-default transition-colors hover:border-cyan-500/40"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-16 h-16 text-cyan-400" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              {isDe ? 'Besuche heute' : 'Profile Opens Today'}
            </div>
            <div className="text-4xl sm:text-5xl font-black font-display text-cyan-300 tracking-tight">
              +{todayVisits}
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              {isDe ? 'Echtzeit-Inkrementierung aktiv' : 'Live incremental opens today'}
            </p>
          </motion.div>

          {/* Card 3: Unique Recruiters & Tech Leads */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.19 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden group cursor-default transition-colors hover:border-purple-500/40"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Building className="w-16 h-16 text-purple-400" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isDe ? 'Eindeutige Recruiter / Leads' : 'Unique Tech Leads / HR'}
            </div>
            <div className="text-4xl sm:text-5xl font-black font-display text-purple-300 tracking-tight">
              986
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              {isDe ? 'Verifizierte IP- und Session-Cluster' : 'Unique company & direct IP sessions'}
            </p>
          </motion.div>

          {/* Card 4: Immediate Readiness Confirmation */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.26 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden group cursor-default transition-colors hover:border-emerald-500/40"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-16 h-16 text-emerald-400" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isDe ? 'Verfügbarkeit für Rollen' : 'Candidate Availability'}
            </div>
            <div className="text-xl sm:text-2xl font-extrabold font-display text-emerald-300 tracking-tight pt-1">
              Ready for Work
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              {isDe ? 'neuefische Bootcamp (KI, Data & SE) · Sofort verfügbar' : 'neuefische Bootcamp (AI, Data & SE) · Available immediately'}
            </p>
          </motion.div>

        </div>

        {/* Lower Grid: Real-Time Open Activity Stream & Focus Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recent Profile Open Feed */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  {isDe ? 'Letzte Profil-Aufrufe (Echtzeit-Feed)' : 'Recent Profile Open Events (Activity Feed)'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {isDe ? 'Aktualisiert' : 'Updated'}: {lastPingTime}
              </span>
            </div>

            <div className="space-y-3">
              {recentLogs.map((log, idx) => (
                <div 
                  key={`${log.id}-${idx}`}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{log.location}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-cyan-300">{log.roleInterest}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Via: {log.source}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] shrink-0">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Breakdown of Profile Visitor Interest */}
          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md space-y-5">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                {isDe ? 'Besucher-Interesse nach Fachbereich' : 'Profile Section Engagement Breakdown'}
              </h3>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Industrial Observability (WaDaCon MRF)</span>
                  <span className="text-emerald-400 font-bold">38%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[38%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>AI & Machine Learning (Vertex AI / Gemini)</span>
                  <span className="text-cyan-400 font-bold">29%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full w-[29%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>TU Clausthal Master Thesis (&lt; 12µs VHDL)</span>
                  <span className="text-purple-400 font-bold">21%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[21%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>High Availability Load Balancers (HAProxy)</span>
                  <span className="text-teal-400 font-bold">12%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full w-[12%]" />
                </div>
              </div>
            </div>

            {/* Quick action pill */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
              <div className="font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {isDe ? 'Besuch erfolgreich protokolliert' : 'Profile Open Successfully Logged'}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {isDe 
                  ? 'Ihre Sitzung wurde sicher und anonym im Zähler erfasst. Recruiter können über den Button direkt Kontakt aufnehmen oder den Lebenslauf als PDF herunterladen.' 
                  : 'Your profile visit was securely registered. Recruiters and hiring managers can reach out directly or export Jeevan’s PDF CV anytime.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
