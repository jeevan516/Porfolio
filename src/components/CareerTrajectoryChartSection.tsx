import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceDot } from 'recharts';
import { TrendingUp, Activity, Zap, CheckCircle2, Cpu } from 'lucide-react';


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
    role: 'neuefische Bootcamp (AI/ML/Data/SE) · Ready for Work',
    roleDe: 'neuefische Bootcamp (KI/ML/Data/SE) · Sofort Einsatzbereit',
    company: 'Next Engineering Chapter',
    location: 'Across Germany',
    impactScore: 100,
    cycleReduction: 65,
    throughputK: 55,
    highlight: true,
    keyAchievement: 'Attending neuefische GmbH Bootcamp covering AI, ML, Data Science, Data Engineering & SE while available immediately across Germany.',
    keyAchievementDe: 'Im Bootcamp bei neuefische GmbH (KI, ML, Data Science, Data Engineering & Software Engineering) und ab sofort einsatzbereit.'
  }
];

type MetricId = 'impact' | 'cycle' | 'throughput';

const METRICS: Record<MetricId, { key: keyof MilestonePoint; color: string; gradient: string; unit: string; domain: [number, number] }> = {
  impact: { key: 'impactScore', color: '#10b981', gradient: 'impactGradient', unit: '', domain: [30, 105] },
  cycle: { key: 'cycleReduction', color: '#06b6d4', gradient: 'cycleGradient', unit: '%', domain: [0, 75] },
  throughput: { key: 'throughputK', color: '#14b8a6', gradient: 'throughputGradient', unit: 'k', domain: [0, 65] },
};

export const CareerTrajectoryChartSection: React.FC<CareerTrajectoryChartSectionProps> = ({ language = 'en' }) => {
  const isDe = language === 'de';
  const [activeMetric, setActiveMetric] = useState<MetricId>('impact');
  const metric = METRICS[activeMetric];

  const thesisPoint = TRAJECTORY_DATA.find((d) => d.year === '2022-23')!;
  const wadaconPoint = TRAJECTORY_DATA.find((d) => d.year === '2025-26')!;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data: MilestonePoint = payload[0].payload;
    return (
      <div className="p-3.5 rounded-xl bg-slate-950/95 border border-slate-800 shadow-2xl max-w-[260px] text-xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono font-bold text-emerald-400">{data.displayYear}</span>
          <span className="text-[10px] text-slate-400 truncate">{data.location}</span>
        </div>
        <div>
          <div className="font-bold text-white text-sm leading-snug">{isDe ? data.roleDe : data.role}</div>
          <div className="text-slate-400">{data.company}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 font-mono text-[10px] text-slate-400">
          <div>
            Impact<strong className="text-emerald-400 block text-xs">{data.impactScore}</strong>
          </div>
          <div>
            MTTR<strong className="text-cyan-400 block text-xs">+{data.cycleReduction}%</strong>
          </div>
          <div>
            k/s<strong className="text-teal-400 block text-xs">{data.throughputK}k</strong>
          </div>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
          {isDe ? data.keyAchievementDe : data.keyAchievement}
        </p>
      </div>
    );
  };

  const metricTabs: { id: MetricId; label: string; icon: React.ElementType }[] = [
    { id: 'impact', label: isDe ? 'Impact' : 'Impact', icon: Zap },
    { id: 'cycle', label: 'MTTR %', icon: Activity },
    { id: 'throughput', label: isDe ? 'Durchsatz' : 'Throughput', icon: Cpu },
  ];

  const metricDescription =
    activeMetric === 'impact'
      ? isDe
        ? 'Technischer Auswirkungsindex (0–100)'
        : 'Engineering impact index (0–100)'
      : activeMetric === 'cycle'
      ? isDe
        ? 'Beschleunigung der Störungsbehebung (%)'
        : 'Incident resolution & release cycle speed-up (%)'
      : isDe
      ? 'Spitzen-Telemetriedurchsatz (k Anfragen/s)'
      : 'Peak telemetry throughput (k req/s)';

  const highlights = [
    {
      accent: 'text-emerald-400',
      label: isDe ? 'Wichtigste Station' : 'Key milestone',
      title: 'WaDaCon GmbH',
      meta: 'Hamburg · 2025 – 2026',
      body: isDe
        ? 'Reduzierte die mittlere Lösungszeit für kritische Vorfälle durch Grafana/InfluxDB-Telemetrie um >60%.'
        : 'Grafana & InfluxDB sensor pipelines that cut incident mean time to response by >60%.',
    },
    {
      accent: 'text-purple-400',
      label: isDe ? 'Forschung' : 'Research',
      title: 'TU Clausthal (MSc)',
      meta: '2022 – 2023',
      body: isDe
        ? 'Deterministisches 4-Knoten-ZanderLink-Netzwerk in VHDL mit Reaktionszeiten unter 12 µs.'
        : 'Simulated 4-node ZanderLink network in VHDL with guaranteed reaction times <12 µs under Prof. Dr. Siemers.',
    },
    {
      accent: 'text-cyan-400',
      label: isDe ? 'KI & APIs' : 'AI & APIs',
      title: 'RadicalX & Netidentity',
      meta: '2021 – 2024',
      body: isDe
        ? 'Google Gemini Flights mit Vertex AI, FastAPI sowie Power BI-Unternehmensdashboards.'
        : 'FastAPI backends with Vertex AI & Google Gemini, plus Power BI e-commerce KPI analytics.',
    },
    {
      accent: 'text-emerald-400',
      label: isDe ? 'Aktuell' : 'Now',
      title: isDe ? 'neuefische Bootcamp' : 'neuefische Bootcamp',
      meta: 'AI · ML · Data Science · Data Eng · SE',
      body: isDe
        ? 'Vertieft KI, Machine Learning, Data Science, Data Engineering und Software Engineering bei neuefische GmbH. Sofort einsatzbereit in Deutschland.'
        : 'Upskilling at neuefische GmbH across AI, ML, Data Science, Data Engineering and Software Engineering. Available immediately across Germany.',
      featured: true,
    },
  ];

  return (
    <section id="career-trajectory" className="py-16 sm:py-20 border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider mb-3">
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
              {isDe ? 'Karriereverlauf' : 'Career trajectory'} · 2015 – 2026
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              {isDe ? 'Technisches Wachstum im Zeitverlauf' : 'Engineering Growth Over Time'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
              {isDe
                ? 'Systemdurchsatz, Latenzreduktion und Architekturkompetenz – von der Softwareentwicklung bis zu industrieller Telemetrie und KI-Infrastruktur.'
                : 'Throughput, incident MTTR and architectural scope – from early full-stack engineering to industrial telemetry and AI infrastructure.'}
            </p>
          </div>

          <div
            role="tablist"
            aria-label={isDe ? 'Metrik wählen' : 'Choose metric'}
            className="flex flex-wrap items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl self-start lg:self-auto"
          >
            {metricTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMetric === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveMetric(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                    isActive ? 'text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTrajectoryMetricPill"
                      className="absolute inset-0 bg-emerald-500 rounded-lg"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" aria-hidden="true" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart Card */}
        <div className="rounded-2xl p-4 sm:p-8 bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 text-xs">
            <span className="text-slate-200 font-semibold">{metricDescription}</span>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" aria-hidden="true" />
                MSc thesis
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" aria-hidden="true" />
                WaDaCon
              </span>
            </div>
          </div>

          <div className="w-full h-72 sm:h-96 -ml-2 sm:ml-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={TRAJECTORY_DATA} margin={{ top: 16, right: 12, bottom: 8, left: -8 }}>
                <defs>
                  <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cycleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="#475569"
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={8}
                />
                <YAxis
                  stroke="#475569"
                  domain={metric.domain}
                  width={44}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                  tickLine={false}
                  unit={metric.unit}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeDasharray: '4 4' }} />

                <Area type="monotone" dataKey={metric.key as string} fill={`url(#${metric.gradient})`} stroke="none" />
                <Line
                  type="monotone"
                  dataKey={metric.key as string}
                  stroke={metric.color}
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0f172a', stroke: metric.color, strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: metric.color, stroke: '#ffffff', strokeWidth: 2 }}
                />
                <ReferenceDot x={thesisPoint.year} y={thesisPoint[metric.key] as number} r={6} fill="#8b5cf6" stroke="#ffffff" strokeWidth={2} />
                <ReferenceDot x={wadaconPoint.year} y={wadaconPoint[metric.key] as number} r={6} fill="#06b6d4" stroke="#ffffff" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
            {highlights.map((h) => (
              <div
                key={h.title}
                className={`p-4 rounded-2xl bg-slate-950/60 border space-y-1 ${h.featured ? 'border-emerald-500/30' : 'border-slate-800'}`}
              >
                <span className={`text-xs font-semibold ${h.accent} flex items-center gap-1`}>
                  {h.featured && <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />}
                  {h.label}
                </span>
                <div className="text-base font-bold text-white font-display">{h.title}</div>
                <div className="text-[11px] text-slate-500 font-mono">{h.meta}</div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
