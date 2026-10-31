import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BarChart3,
  Users,
  FileText,
  Mail,
  CheckCircle2,
  Plus,
  MapPin,
  ExternalLink,
  Trash2,
  Sparkles,
  Sliders,
  Copy,
  Check,
  X,
  Info,
  RotateCcw,
} from 'lucide-react';
import { INITIAL_PIPELINE, PERSONAL_INFO, PROJECTS_DATA } from '../data/portfolioData';
import { RecruiterInquiry, PipelineStage } from '../types';
import { useModalA11y } from '../services/useModalA11y';
import { copyText } from '../services/clientUtils';
import { safeJsonParse } from '../utils/security';
import { ui } from '../services/uiClasses';

const PIPELINE_KEY = 'jeevan_portfolio_pipeline';
const SAMPLE_IDS = new Set(INITIAL_PIPELINE.map((p) => p.id));

function loadPipeline(): RecruiterInquiry[] {
  try {
    const parsed = safeJsonParse<RecruiterInquiry[] | null>(localStorage.getItem(PIPELINE_KEY), null);
    return Array.isArray(parsed) ? parsed : INITIAL_PIPELINE;
  } catch {
    return INITIAL_PIPELINE;
  }
}

interface PortfolioTrackerProps {
  onOpenContact: () => void;
  onOpenBrief: () => void;
}

export const PortfolioTracker: React.FC<PortfolioTrackerProps> = ({
  onOpenContact,
  onOpenBrief,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'match' | 'roadmap'>('pipeline');

  // Pipeline board, persisted in this browser only
  const [pipeline, setPipeline] = useState<RecruiterInquiry[]>(loadPipeline);
  const addLeadRef = useRef<HTMLDivElement | null>(null);

  // Pick up entries written elsewhere (contact form via App, or another tab)
  useEffect(() => {
    const reload = () => setPipeline(loadPipeline());
    const onStorage = (e: StorageEvent) => {
      if (e.key === PIPELINE_KEY) reload();
    };
    window.addEventListener('jeevan-pipeline-updated', reload);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('jeevan-pipeline-updated', reload);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // New Lead Modal / Drawer form state
  const [showAddLead, setShowAddLead] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLocationType, setNewLocationType] = useState<RecruiterInquiry['locationType']>('Hamburg Onsite');
  const [newMessage, setNewMessage] = useState('');
  const [newSalary, setNewSalary] = useState('');

  // Recruiter Match State
  const [selectedRoleType, setSelectedRoleType] = useState<'ai-ml' | 'iot-observability' | 'devops' | 'data'>('iot-observability');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Sync pipeline to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PIPELINE_KEY, JSON.stringify(pipeline));
    } catch {
      // storage unavailable — board still works for this session
    }
  }, [pipeline]);

  const closeAddLead = useCallback(() => setShowAddLead(false), []);
  useModalA11y(showAddLead, closeAddLead, addLeadRef);

  const handleResetBoard = () => setPipeline(INITIAL_PIPELINE);

  // Handle stage change
  const handleStageChange = (id: string, nextStage: PipelineStage) => {
    setPipeline((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stage: nextStage } : item))
    );
  };

  // Delete lead
  const handleDeleteLead = (id: string) => {
    setPipeline((prev) => prev.filter((item) => item.id !== id));
  };

  // Add new lead
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    const newEntry: RecruiterInquiry = {
      id: `lead-${Date.now()}`,
      companyName: newCompany.trim(),
      contactName: newContact.trim() || 'Hiring Lead',
      email: newEmail.trim() || 'inquiry@company.example',
      roleTitle: newRole.trim(),
      locationType: newLocationType,
      stage: 'inquiry',
      message: newMessage || 'Recruiter inquiry logged via portfolio tracker.',
      salaryOrBudget: newSalary || 'Open / Market Standard',
      dateAdded: new Date().toISOString().split('T')[0],
      notes: 'New pipeline lead tracked.',
    };

    setPipeline((prev) => [newEntry, ...prev]);
    setShowAddLead(false);
    setNewCompany('');
    setNewContact('');
    setNewEmail('');
    setNewRole('');
    setNewMessage('');
    setNewSalary('');
  };

  // Recruiter Match Calculation
  const getRoleMatchDetails = () => {
    switch (selectedRoleType) {
      case 'iot-observability':
        return {
          title: 'Industrial IoT & Observability Lead / Engineer',
          score: 98,
          highlights: [
            'Direct production experience at WaDaCon GmbH building Grafana + Prometheus + InfluxDB telemetry stacks.',
            'Reduced industrial plant incident response times by 60% with threshold alerting into MS Teams.',
            'Teleport zero-trust SSH tunneling for secure edge machinery access across Germany.',
            'Docker containerization cutting production release rollouts by 35%.',
          ],
          matchedProjects: ['Industrial IoT Observability Pipeline', 'AI Anomaly Detection for Plant Operations'],
        };
      case 'ai-ml':
        return {
          title: 'AI / Machine Learning Engineer',
          score: 95,
          highlights: [
            'MSc in Informatics from TU Clausthal with specialization in neural network architectures and sequence modeling.',
            'Authored deep learning LSTM framework for trajectory prediction of pedestrians.',
            'Google Gemini & Vertex AI backend architecture deployed with FastAPI and SQLAlchemy.',
            'Anthropic certified in Claude Code and Agentic Workflows.',
          ],
          matchedProjects: ['Trajectory Prediction of Pedestrians', 'Google Gemini Flights Backend', 'AI Anomaly Detection'],
        };
      case 'devops':
        return {
          title: 'DevOps & Systems Specialist',
          score: 92,
          highlights: [
            'Extensive Linux (Ubuntu/Debian) system administration and edge device fleet orchestration.',
            'Secure tunneling with Teleport, reverse proxies, and firewall DMZ configuration.',
            'Automated CI/CD pipelines, Docker container orchestration, and shell scripting.',
            'High-availability telemetry monitoring and automated incident response hooks.',
          ],
          matchedProjects: ['Industrial IoT Observability Pipeline', 'WaDaCon Edge Fleet Infrastructure'],
        };
      case 'data':
        return {
          title: 'Data & Analytics Engineer',
          score: 91,
          highlights: [
            'High-frequency time-series data ingestion with InfluxDB and SQL data modeling.',
            'Enterprise Power BI KPI dashboards built for Netidentity tracking customer conversion funnels.',
            'Mathematical modeling, Python pandas/numpy data engineering pipelines, and DAX modeling.',
            'Accenture North America certified in Data Analytics & Visualization.',
          ],
          matchedProjects: ['E-commerce KPI Analytics Dashboard', 'Aeronautical Mini Project'],
        };
    }
  };

  const matchData = getRoleMatchDetails();

  const handleCopyTailoredSummary = async () => {
    const summaryText = `Candidate Profile: Jeevan Dutta (MSc Informatics, TU Clausthal)
Target Role: ${matchData.title}
Match Score: ${matchData.score}%
Location: Hamburg, Germany (Immediate availability)
Contact: ${PERSONAL_INFO.email} | ${PERSONAL_INFO.phone}
LinkedIn: ${PERSONAL_INFO.linkedin} | GitHub: ${PERSONAL_INFO.github}

Key Strengths:
${matchData.highlights.map((h) => `- ${h}`).join('\n')}

Key Projects:
${matchData.matchedProjects.map((p) => `- ${p}`).join('\n')}`;

    if (await copyText(summaryText)) {
      setCopiedSummary(true);
      window.setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  // Pipeline stages configuration
  const STAGES: { id: PipelineStage; label: string; color: string }[] = [
    { id: 'inquiry', label: '1. New Outreach', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
    { id: 'screening', label: '2. Screening', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' },
    { id: 'technical', label: '3. Technical Round', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    { id: 'offer', label: '4. Offer / Decision', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <section id="tracker" className="py-16 sm:py-20 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-800/80 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
              <BarChart3 className="w-4 h-4" />
              Recruiter hub
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">Role match & opportunity board</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2">
              Check how Jeevan's experience maps to your vacancy, grab a tailored brief, or keep track of conversations on a private board stored in your browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button id="tracker-open-contact-btn" type="button" onClick={onOpenContact} className={ui.btnPrimary}>
              <Mail className="w-4 h-4" />
              Contact Jeevan
            </button>
            <button type="button" onClick={onOpenBrief} className={ui.btnSecondary}>
              <FileText className="w-4 h-4" />
              Executive brief
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex items-center gap-1.5 p-1 bg-slate-900/70 border border-slate-800 rounded-xl mb-8 overflow-x-auto no-scrollbar"
          role="tablist"
          aria-label="Recruiter hub views"
        >
          {[
            { id: 'pipeline', label: 'Opportunity board', icon: Users },
            { id: 'match', label: 'Role match & brief', icon: Sparkles },
            { id: 'roadmap', label: 'Projects', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tracker-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${ui.focusRing} ${
                  isActive ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Recruiter & Client Pipeline CRM */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  Demo board — entries marked <em>Sample</em> are illustrative. Anything you add or move is saved only in your browser.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={handleResetBoard} className={`${ui.btnGhost}`}>
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button id="tracker-log-lead-btn" type="button" onClick={() => setShowAddLead(true)} className={`${ui.btnPrimary} !py-2`}>
                  <Plus className="w-4 h-4" />
                  Add opportunity
                </button>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {STAGES.map((stage) => {
                const stageItems = pipeline.filter((i) => i.stage === stage.id);

                return (
                  <div
                    key={stage.id}
                    className="flex flex-col rounded-2xl bg-slate-900/40 border border-slate-800/80 p-4 space-y-3 md:min-h-[320px]"
                  >
                    {/* Stage Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${stage.color}`}>
                        {stage.label}
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-bold">
                        {stageItems.length}
                      </span>
                    </div>

                    {/* Cards inside this stage */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                      {stageItems.map((item, idx) => (
                        <div
                          key={`${item.id}-${idx}`}
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors space-y-2.5 text-xs"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <h4 className="font-bold text-white text-sm flex items-center gap-1.5 flex-wrap">
                                {item.companyName}
                                {SAMPLE_IDS.has(item.id) && (
                                  <span className="text-[9px] font-mono font-normal uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                    Sample
                                  </span>
                                )}
                              </h4>
                              <p className="text-emerald-400 font-medium text-[11px]">
                                {item.roleTitle}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteLead(item.id)}
                              className={`${ui.iconBtn} !h-7 !w-7 hover:!text-rose-400`}
                              title="Remove"
                              aria-label={`Remove ${item.companyName}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              {item.locationType}
                            </span>
                            {item.salaryOrBudget && (
                              <span className="text-slate-300 font-semibold">
                                {item.salaryOrBudget}
                              </span>
                            )}
                          </div>

                          <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-950/60 p-2 rounded border border-slate-800/60">
                            "{item.message}"
                          </p>

                          {item.notes && (
                            <div className="text-[10px] text-slate-400 italic">
                              Note: {item.notes}
                            </div>
                          )}

                          {/* Move stage control */}
                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                            <label htmlFor={`stage-${item.id}`} className="text-[10px] text-slate-500">Stage</label>
                            <select
                              id={`stage-${item.id}`}
                              value={item.stage}
                              onChange={(e) => handleStageChange(item.id, e.target.value as PipelineStage)}
                              className="bg-slate-950 text-slate-200 text-[10px] px-2 py-1 rounded border border-slate-700 cursor-pointer focus:outline-none focus:border-emerald-400"
                            >
                              <option value="inquiry">1. Outreach</option>
                              <option value="screening">2. Screening</option>
                              <option value="technical">3. Technical</option>
                              <option value="offer">4. Offer</option>
                            </select>
                          </div>
                        </div>
                      ))}

                      {stageItems.length === 0 && (
                        <div className="h-28 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 text-[11px]">
                          No active cards
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Recruiter Quick Match & Tailored Brief */}
        {activeTab === 'match' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Controls */}
            <div className="lg:col-span-5 space-y-4 p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Select Your Open Vacancy
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose your team's domain to calculate Jeevan's exact qualification match and generate an instant executive summary.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'iot-observability', label: 'Industrial IoT & Observability Lead', sub: 'WaDaCon MRF, InfluxDB, Grafana, Teleport' },
                  { id: 'ai-ml', label: 'AI / Machine Learning Engineer', sub: 'TU Clausthal, LSTMs, Gemini, PyTorch' },
                  { id: 'devops', label: 'DevOps & Systems Specialist', sub: 'Docker, Linux Ubuntu, Teleport SSH, CI/CD' },
                  { id: 'data', label: 'Data & Analytics Engineer', sub: 'Time-Series, Power BI DAX, SQL, Python' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selectedRoleType === item.id}
                    onClick={() => setSelectedRoleType(item.id as typeof selectedRoleType)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-colors ${ui.focusRing} ${
                      selectedRoleType === item.id
                        ? 'bg-emerald-500/10 border-emerald-500/50'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className={`font-semibold text-sm ${selectedRoleType === item.id ? 'text-white' : 'text-slate-200'}`}>
                      {item.label}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                      {item.sub}
                    </div>
                  </button>
                ))}
              </div>

              {/* Status Badge */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-2 font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Work Authorization:</span>
                  <span className="text-emerald-400 font-semibold">Eligible (Germany)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Location / Base:</span>
                  <span className="text-white font-semibold">Hamburg, Germany</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Earliest Start Date:</span>
                  <span className="text-emerald-400 font-semibold">Immediately</span>
                </div>
              </div>
            </div>

            {/* Right Output: Score & Recruiter Summary */}
            <div className="lg:col-span-7 space-y-4 p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    Candidate Qualification Analysis
                  </span>
                  <h3 className="text-xl font-bold font-display text-white mt-0.5">
                    {matchData.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-2xl font-black font-display text-emerald-400">
                      {matchData.score}%
                    </span>
                    <span className="text-[10px] block font-mono text-slate-400">Role Match</span>
                  </div>
                  <button type="button" onClick={handleCopyTailoredSummary} className={`${ui.btnPrimary} !py-2`}>
                    {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? 'Copied Brief!' : 'Copy Tailored Brief'}</span>
                  </button>
                </div>
              </div>

              {/* Matching Highlights */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                  Why Jeevan is an exceptional fit:
                </span>
                <div className="space-y-2">
                  {matchData.highlights.map((point, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched Projects */}
              <div className="pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono block mb-2">
                  Key Supporting Projects:
                </span>
                <div className="flex flex-wrap gap-2">
                  {matchData.matchedProjects.map((p, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fast Outreach CTA */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  Ready to schedule a preliminary screening?
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={onOpenBrief} className={`${ui.btnSecondary} !py-2`}>
                    <FileText className="w-3.5 h-3.5" />
                    Executive brief
                  </button>
                  <button type="button" onClick={onOpenContact} className={`${ui.btnPrimary} !py-2`}>
                    <Mail className="w-3.5 h-3.5" />
                    Contact Jeevan
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: Project Repos & Deliverables Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROJECTS_DATA.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-sm">
                      {p.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {p.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs">
                    {p.githubUrl ? (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono text-[11px] rounded ${ui.focusRing}`}
                      >
                        View on GitHub
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">Internal / not public</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: Add opportunity */}
        {showAddLead && (
          <div className={ui.overlay} onMouseDown={(e) => e.target === e.currentTarget && closeAddLead()}>
            <div
              ref={addLeadRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-lead-title"
              tabIndex={-1}
              className={`${ui.panel} max-w-md p-5 sm:p-6 space-y-4`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 id="add-lead-title" className="font-display font-bold text-base text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  Add opportunity
                </h3>
                <button type="button" onClick={closeAddLead} className={ui.iconBtn} aria-label="Close add opportunity dialog">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddLead} className="space-y-3 text-xs">
                <div>
                  <label htmlFor="lead-company" className={ui.label}>Company *</label>
                  <input
                    type="text"
                    required
                    id="lead-company"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Airbus, Otto Group, Scale AI..."
                    className={ui.input}
                  />
                </div>

                <div>
                  <label htmlFor="lead-role" className={ui.label}>Role title *</label>
                  <input
                    type="text"
                    required
                    id="lead-role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Industrial IoT Lead, AI Engineer..."
                    className={ui.input}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="lead-contact" className={ui.label}>Contact name</label>
                    <input
                      type="text"
                      id="lead-contact"
                    value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      placeholder="e.g. Sarah Schmidt"
                      className={ui.input}
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-location" className={ui.label}>Location</label>
                    <select
                      id="lead-location"
                      value={newLocationType}
                      onChange={(e) => setNewLocationType(e.target.value as any)}
                      className={ui.input}
                    >
                      <option value="Hamburg Onsite">Hamburg Onsite</option>
                      <option value="Hybrid Germany">Hybrid Germany</option>
                      <option value="Remote">Remote</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="lead-salary" className={ui.label}>Compensation / budget</label>
                  <input
                    type="text"
                    id="lead-salary"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="e.g. €80k - €95k"
                    className={ui.input}
                  />
                </div>

                <div>
                  <label htmlFor="lead-message" className={ui.label}>Notes</label>
                  <textarea
                    rows={3}
                    id="lead-message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Details about project, tech stack, or interview dates..."
                    className={ui.input}
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button type="button" onClick={closeAddLead} className={ui.btnSecondary}>
                    Cancel
                  </button>
                  <button type="submit" disabled={!newCompany.trim() || !newRole.trim()} className={ui.btnPrimary}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
