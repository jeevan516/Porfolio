import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  ReferenceDot 
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Award,
  ArrowUpRight
} from 'lucide-react';

interface CareerTrajectoryChartSectionProps {
  language?: 'en' | 'de';
}

interface MilestonePoint {
  year: string;
  displayYear: string;
  role: string;
  roleDe: string;
  company: string;
  location: string;
  impactScore: number; // 0 - 100
  cycleReduction: number; // % improvement in release / MTTR
  throughputK: number; // Ingestion / request scale (k req/s)
  keyAchievement: string;
  keyAchievementDe: string;
  highlight?: boolean;
}

const TRAJECTORY_DATA: MilestonePoint[] = [
  {
    year: '2015-18',
    displayYear: '2015 – 2018',
    role: 'Software Developer',
    roleDe: 'Software-Entwickler',
    company: 'Avast Technologies',
    location: 'Hyderabad, India',
    impactScore: 48,
    cycleReduction: 20,
    throughputK: 5,
    keyAchievement: 'Architected reusable OOP software modules and POC prototypes across agile sprint cycles.',
    keyAchievementDe: 'Entwicklung wiederverwendbarer OOP-Softwaremodule und POC-Prototypen in agilen Sprints.'
  },
  {
    year: '2019-21',
    displayYear: '2019 – 2021',
    role: 'IT Support & Systems Engineer',
    roleDe: 'IT-System- & Support-Ingenieur',
    company: 'Cogent Networks',
    location: 'Stade, Germany',
    impactScore: 64,
    cycleReduction: 32,
    throughputK: 15,
    keyAchievement: 'Administered multi-site enterprise network infrastructure, VoIP routing, and hardware workstations.',
    keyAchievementDe: 'Verwaltung standortübergreifender Netzwerk-Infrastrukturen, VoIP-Routing und Workstations.'
  },
  {
    year: '2021',
    displayYear: '2021 (Mid)',
    role: 'Data Analyst & Web Developer',
    roleDe: 'Datenanalyst & Web-Entwickler',
    company: 'Netidentity',
    location: 'Amsterdam (Remote)',
    impactScore: 72,
    cycleReduction: 42,
    throughputK: 25,
    keyAchievement: 'Engineered Power BI dashboards and conversion journey funnels for multi-brand e-commerce.',
    keyAchievementDe: 'Erstellung von Power BI-Dashboards und Conversion-Trichtern für E-Commerce-Plattformen.'
  },
  {
    year: '2022-23',
    displayYear: '2022 – 2023',
    role: 'MSc Thesis Researcher',
    roleDe: 'MSc Masterarbeit (Informatik)',
    company: 'TU Clausthal',
    location: 'Clausthal-Zellerfeld',
    impactScore: 86,
    cycleReduction: 52,
    throughputK: 35,
    highlight: true,
    keyAchievement: 'Engineered 4-node deterministic PLC network in VHDL with sub-12 µs guaranteed latency and CRC-8 check.',
    keyAchievementDe: '4-Knoten deterministisches SPS-Netzwerk in VHDL mit <12 µs Latenz unter Prof. Dr. Siemers.'
  },
  {
    year: '2023-24',
    displayYear: '2023 – 2024',
    role: 'AI Engineer',
    roleDe: 'KI-Ingenieur',
    company: 'RadicalX',
    location: 'Germany (Remote)',
    impactScore: 90,
    cycleReduction: 56,
    throughputK: 42,
    keyAchievement: 'Built Google Gemini Flights backend with FastAPI, Vertex AI natural language APIs, and SQLAlchemy.',
    keyAchievementDe: 'Backend für Google Gemini Flights mit FastAPI, Vertex AI und SQLAlchemy implementiert.'
  },
  {
    year: '2025-26',
    displayYear: '2025 – 2026',
    role: 'IT Specialist (Observability & Systems)',
    roleDe: 'IT-Spezialist (Observability & Systeme)',
    company: 'WaDaCon GmbH',
    location: 'Hamburg, Germany',
    impactScore: 98,
    cycleReduction: 60,
    throughputK: 50,
    highlight: true,
    keyAchievement: 'Delivered production InfluxDB sensor pipelines, Docker CI/CD, HAProxy/Keepalived load balancers & -60% MTTR.',
    keyAchievementDe: 'Produktionsreife InfluxDB-Sensorpipelines, Docker CI/CD, HAProxy-Cluster und 60% schnellere MTTR.'
  },
  {
    year: '2026+',
    displayYear: '2026 (Now)',
    role: 'AI & ML Bootcamp · Ready for Work',
    roleDe: 'KI- & ML-Bootcamp · Sofort Einsatzbereit',
    company: 'Next Engineering Chapter',
    location: 'Across Germany',
    impactScore: 100,
    cycleReduction: 65,
    throughputK: 55,
    highlight: true,
    keyAchievement: 'Attending AI & ML Bootcamp while available immediately for cloud infrastructure, industrial telemetry, and AI systems.',
    keyAchievementDe: 'Im KI- & ML-Bootcamp und ab sofort einsatzbereit für Aufgaben in Cloud, Telemetrie, KI und verteilten Systemen.'
  }
];

export const CareerTrajectoryChartSection: React.FC<CareerTrajectoryChartSectionProps> = ({ 
  language = 'en' 
}) => {
  const isDe = language === 'de';
  const [activeMetric, setActiveMetric] = useState<'impact' | 'cycle' | 'throughput'>('impact');

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: MilestonePoint = payload[0].payload;
      return (
        <div className="p-4 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-xl max-w-xs text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono font-bold text-emerald-400">{data.displayYear}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {data.location}
            </span>
          </div>

          <div>
            <div className="font-bold text-white text-sm">
              {isDe ? data.roleDe : data.role}
            </div>
            <div className="text-cyan-300 font-mono text-xs">
              {data.company}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 font-mono text-[11px]">
            <div>
              <span className="text-slate-400">Impact Score:</span>
              <strong className="text-emerald-400 block text-xs">{data.impactScore} / 100</strong>
            </div>
            <div>
              <span className="text-slate-400">TTR Acceleration:</span>
              <strong className="text-cyan-400 block text-xs">+{data.cycleReduction}%</strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 font-sans leading-relaxed pt-1 border-t border-slate-800/80">
            {isDe ? data.keyAchievementDe : data.keyAchievement}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section 
      id="career-trajectory" 
      className="py-24 border-t border-slate-800/80 relative overflow-hidden bg-slate-950/95 text-slate-100"
    >
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/40 text-xs text-slate-300 font-mono shadow-lg shadow-emerald-500/10">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                {isDe ? 'Karriere- & Auswirkungs-Trajektorie' : 'Career Progression & Impact Trajectory'}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">2015 – 2026</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
              {isDe ? 'Technologisches Wachstum ' : 'Engineering Growth & '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                {isDe ? 'im Zeitverlauf' : 'Impact Over Time'}
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              {isDe 
                ? 'Quantitative Visualisierung von Systemdurchsatz, Latenzreduktion und Architekturkompetenz von den Anfängen in der Softwareentwicklung bis zu industriellen Telemetrie- und KI-Infrastrukturen in Deutschland.'
                : 'Quantitative visualization of system throughput, incident MTTR acceleration, and architectural capability scaling from early full-stack engineering to mission-critical industrial telemetry and AI infrastructure in Germany.'}
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner">
            {[
              { id: 'impact', label: isDe ? 'Architektur-Impact' : 'Impact Index', icon: Zap, bg: 'from-emerald-500 to-cyan-500' },
              { id: 'cycle', label: isDe ? 'MTTR & Zyklen (-60%)' : 'MTTR / Speedup (%)', icon: Activity, bg: 'from-cyan-500 to-blue-500' },
              { id: 'throughput', label: isDe ? 'Durchsatz (k Req/s)' : 'Throughput (k/s)', icon: Cpu, bg: 'from-teal-500 to-emerald-500' },
            ].map((metric) => {
              const Icon = metric.icon;
              const isActive = activeMetric === metric.id;
              return (
                <motion.button
                  key={metric.id}
                  onClick={() => setActiveMetric(metric.id as any)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-colors z-10 ${
                    isActive
                      ? 'text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTrajectoryMetricPill"
                      className={`absolute inset-0 bg-gradient-to-r ${metric.bg} rounded-xl -z-10 shadow-md shadow-emerald-500/20`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5" />
                  <span>{metric.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Main Chart Container Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md space-y-6">
          
          {/* Top Chart Telemetry Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-bold">
                {activeMetric === 'impact' 
                  ? (isDe ? 'Metrik: Gesamter technischer Auswirkungsindex (0–100)' : 'Metric: Overall Engineering & Architectural Impact Index (0–100)')
                  : activeMetric === 'cycle'
                  ? (isDe ? 'Metrik: Reduzierung der Reaktionszeit bei Störungen (% Beschleunigung)' : 'Metric: Incident Resolution & Release Cycle Acceleration (%)')
                  : (isDe ? 'Metrik: Spitzen-Telemetriedurchsatz (k Anfragen/Sekunde)' : 'Metric: Peak Ingestion & Telemetry Throughput (k Req/sec)')}
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-400" />
                <span>Primary Curve</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Milestone Node</span>
              </span>
            </div>
          </div>

          {/* Interactive Recharts Line & Area Chart */}
          <div className="w-full h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={TRAJECTORY_DATA}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <defs>
                  <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="cycleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

                <XAxis 
                  dataKey="year" 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  tickLine={{ stroke: '#334155' }}
                />

                <YAxis 
                  stroke="#64748b"
                  domain={activeMetric === 'impact' ? [30, 105] : activeMetric === 'cycle' ? [0, 75] : [0, 65]}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  tickLine={{ stroke: '#334155' }}
                  unit={activeMetric === 'cycle' ? '%' : activeMetric === 'throughput' ? 'k' : ''}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Shaded Area for Depth */}
                <Area 
                  type="monotone" 
                  dataKey={activeMetric === 'impact' ? 'impactScore' : activeMetric === 'cycle' ? 'cycleReduction' : 'throughputK'}
                  fill={activeMetric === 'impact' ? 'url(#impactGradient)' : activeMetric === 'cycle' ? 'url(#cycleGradient)' : 'url(#throughputGradient)'}
                  stroke="none"
                />

                {/* Primary Animated Line */}
                <Line
                  type="monotone"
                  dataKey={activeMetric === 'impact' ? 'impactScore' : activeMetric === 'cycle' ? 'cycleReduction' : 'throughputK'}
                  stroke={activeMetric === 'impact' ? '#10b981' : activeMetric === 'cycle' ? '#06b6d4' : '#14b8a6'}
                  strokeWidth={3.5}
                  dot={{ r: 5, fill: '#0f172a', stroke: '#10b981', strokeWidth: 2.5 }}
                  activeDot={{ r: 8, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                  name={activeMetric === 'impact' ? 'Impact Score' : activeMetric === 'cycle' ? 'Cycle Speedup %' : 'Throughput (k/s)'}
                />

                {/* Reference point for Master Thesis at TU Clausthal */}
                <ReferenceDot
                  x="2022-23"
                  y={activeMetric === 'impact' ? 86 : activeMetric === 'cycle' ? 52 : 35}
                  r={7}
                  fill="#8b5cf6"
                  stroke="#ffffff"
                  strokeWidth={2}
                />

                {/* Reference point for WaDaCon GmbH Production Telemetry */}
                <ReferenceDot
                  x="2025-26"
                  y={activeMetric === 'impact' ? 98 : activeMetric === 'cycle' ? 60 : 50}
                  r={8}
                  fill="#06b6d4"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom Milestone Highlights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                {isDe ? 'Wichtigste Station' : 'Key Milestone'}
              </span>
              <div className="text-base font-bold text-white font-display">WaDaCon GmbH</div>
              <div className="text-xs text-slate-400 font-mono">Hamburg · 2025 – 2026</div>
              <p className="text-[11px] text-slate-300 leading-normal pt-1">
                {isDe 
                  ? 'Reduzierte die mittlere Lösungszeit für kritische Vorfälle durch Grafana/InfluxDB-Telemetrie um >60%.' 
                  : 'Engineered Grafana & InfluxDB sensor pipelines reducing incident mean time to response by >60%.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">
                {isDe ? 'Akademische Forschung' : 'Academic Rigor'}
              </span>
              <div className="text-base font-bold text-white font-display">TU Clausthal (MSc)</div>
              <div className="text-xs text-slate-400 font-mono">2022 – 2023 · Grade Awarded</div>
              <p className="text-[11px] text-slate-300 leading-normal pt-1">
                {isDe 
                  ? 'Deterministisches 4-Knoten-ZanderLink-Netzwerk in VHDL mit Reaktionszeiten unter 12 µs.' 
                  : 'Simulated 4-node ZanderLink network in VHDL with guaranteed reaction times <12 µs under Prof. Dr. Siemers.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                {isDe ? 'KI & Cloud-APIs' : 'AI & Backend APIs'}
              </span>
              <div className="text-base font-bold text-white font-display">RadicalX & Netidentity</div>
              <div className="text-xs text-slate-400 font-mono">2021 – 2024</div>
              <p className="text-[11px] text-slate-300 leading-normal pt-1">
                {isDe 
                  ? 'Google Gemini Flights mit Vertex AI, FastAPI sowie Power BI-Unternehmensdashboards.' 
                  : 'FastAPI backends with Vertex AI & Google Gemini, paired with Power BI e-commerce KPI analytics.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {isDe ? 'Aktueller Status' : 'Immediate Readiness'}
              </span>
              <div className="text-base font-bold text-white font-display">
                {isDe ? 'KI- & ML-Bootcamp · Sofort einsatzbereit' : 'AI & ML Bootcamp · Ready for Work'}
              </div>
              <div className="text-xs text-emerald-400 font-mono">
                {isDe ? 'Ab sofort verfügbar · Deutschlandweit' : 'Available Immediately · Across Germany'}
              </div>
              <p className="text-[11px] text-slate-300 leading-normal pt-1">
                {isDe 
                  ? 'Vertieft derzeit State-of-the-Art Machine Learning & KI im intensiven Bootcamp. Sofort einsatzbereit für DevOps, Observability, verteilte Systeme und Softwarearchitektur.' 
                  : 'Currently attending an intensive AI & Machine Learning Bootcamp while available immediately for cloud infrastructure, observability pipelines, and AI systems architecture.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
