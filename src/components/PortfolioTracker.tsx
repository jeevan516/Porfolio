import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Mail, 
  TrendingUp, 
  CheckCircle2, 
  Plus, 
  Search, 
  Clock, 
  MapPin, 
  Building2, 
  ArrowRight, 
  ExternalLink,
  Trash2,
  Filter,
  Sparkles,
  Zap,
  Globe,
  Sliders,
  Copy,
  Check
} from 'lucide-react';
import { 
  INITIAL_ANALYTICS, 
  INITIAL_PIPELINE, 
  PERSONAL_INFO,
  PROJECTS_DATA 
} from '../data/portfolioData';
import { RecruiterInquiry, PipelineStage } from '../types';

interface PortfolioTrackerProps {
  onOpenContact: () => void;
  onOpenBrief: () => void;
}

export const PortfolioTracker: React.FC<PortfolioTrackerProps> = ({
  onOpenContact,
  onOpenBrief,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'analytics' | 'match' | 'roadmap'>('pipeline');
  
  // Pipeline State with localStorage fallback
  const [pipeline, setPipeline] = useState<RecruiterInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('jeevan_portfolio_pipeline');
      return saved ? JSON.parse(saved) : INITIAL_PIPELINE;
    } catch {
      return INITIAL_PIPELINE;
    }
  });

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
      localStorage.setItem('jeevan_portfolio_pipeline', JSON.stringify(pipeline));
    } catch (e) {
      console.warn('Could not save pipeline to localStorage', e);
    }
  }, [pipeline]);

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
    if (!newCompany || !newRole) return;

    const newEntry: RecruiterInquiry = {
      id: `lead-${Date.now()}`,
      companyName: newCompany,
      contactName: newContact || 'Hiring Lead',
      email: newEmail || 'inquiry@company.example',
      roleTitle: newRole,
      locationType: newLocationType,
      stage: 'inquiry',
      message: newMessage || 'Recruiter inquiry logged via portfolio tracker.',
      salaryOrBudget: newSalary || 'Open / Market Standard',
      dateAdded: new Date().toISOString().split('T')[0],
      notes: 'New pipeline lead tracked.',
    };

    setPipeline([newEntry, ...pipeline]);
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

  const handleCopyTailoredSummary = () => {
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

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // Pipeline stages configuration
  const STAGES: { id: PipelineStage; label: string; color: string }[] = [
    { id: 'inquiry', label: '1. New Outreach', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
    { id: 'screening', label: '2. Screening', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' },
    { id: 'technical', label: '3. Technical Round', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    { id: 'offer', label: '4. Offer / Decision', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <section id="tracker" className="py-16 border-t border-slate-800 bg-[#060911] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tracker Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-800/80 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider mb-2">
              <BarChart3 className="w-4 h-4" />
              Career Pipeline & Portfolio Analytics
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Portfolio Reach & Opportunity Tracker
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-1">
              Real-time analytics for portfolio visitors, hiring team interest, technical skill fit matching, and ongoing interview pipelines.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="tracker-log-lead-btn"
              onClick={() => setShowAddLead(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Job Opportunity / Interview</span>
            </button>

            <button
              id="tracker-open-contact-btn"
              onClick={onOpenContact}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Send Direct Inquiry</span>
            </button>
          </div>
        </div>

        {/* Top Telemetry KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Total Portfolio Views</span>
              <Globe className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-white">
                {INITIAL_ANALYTICS.totalViews.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">+18.4%</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Organic recruiter traffic</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Recruiter Sessions</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-white">
                {INITIAL_ANALYTICS.uniqueRecruiters}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">Hamburg 42%</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Verified talent acquisition</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Executive Brief Views</span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-white">
                {INITIAL_ANALYTICS.briefDownloads}
              </span>
              <span className="text-xs font-mono text-indigo-400 font-semibold">55.7% rate</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Hiring manager downloads</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Active Pipeline Leads</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-amber-300">
                {pipeline.length}
              </span>
              <span className="text-xs font-mono text-slate-400">Companies</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Airbus, Otto, Nordex, Zalando</span>
          </div>
        </div>

        {/* Tracker View Tabs Navigation */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl mb-8 overflow-x-auto">
          {[
            { id: 'pipeline', label: 'Recruiter & Client Pipeline CRM', icon: Users },
            { id: 'match', label: 'Recruiter Quick Match & Brief', icon: Sparkles },
            { id: 'analytics', label: 'Engagement & Geo Analytics', icon: BarChart3 },
            { id: 'roadmap', label: 'Project Repos & Deliverables', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tracker-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
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
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>
                  <strong>Interactive Pipeline:</strong> Recruiters can log real inquiries here or change candidate stages. Persisted locally.
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-500">
                {pipeline.length} active opportunities tracked
              </span>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {STAGES.map((stage) => {
                const stageItems = pipeline.filter((i) => i.stage === stage.id);

                return (
                  <div
                    key={stage.id}
                    className="flex flex-col rounded-2xl bg-slate-900/40 border border-slate-800/80 p-4 space-y-3 min-h-[350px]"
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
                      {stageItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/50 transition-all shadow-md space-y-2.5 text-xs"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <h4 className="font-bold text-white text-sm">
                                {item.companyName}
                              </h4>
                              <p className="text-emerald-400 font-medium text-[11px]">
                                {item.roleTitle}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteLead(item.id)}
                              className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                              title="Remove lead"
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
                              <span className="text-cyan-300 font-semibold">
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
                            <span className="text-[10px] text-slate-500">Stage:</span>
                            <select
                              value={item.stage}
                              onChange={(e) => handleStageChange(item.id, e.target.value as PipelineStage)}
                              className="bg-slate-950 text-slate-200 text-[10px] px-2 py-1 rounded border border-slate-700 cursor-pointer focus:outline-none focus:border-cyan-400"
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
            <div className="lg:col-span-5 space-y-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
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
                    onClick={() => setSelectedRoleType(item.id as any)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      selectedRoleType === item.id
                        ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/50 shadow-md'
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
                  <span className="text-cyan-400 font-semibold">Immediately</span>
                </div>
              </div>
            </div>

            {/* Right Output: Score & Recruiter Summary */}
            <div className="lg:col-span-7 space-y-4 p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800">
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
                  <button
                    onClick={handleCopyTailoredSummary}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md active:scale-95"
                  >
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
                    <span key={idx} className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800 text-cyan-300 border border-slate-700">
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
                <button
                  onClick={onOpenContact}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-md hover:scale-102 transition-all"
                >
                  Contact Jeevan Now
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: Engagement & Geo Analytics */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Geo Breakdown */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Recruiter Geographic Concentration
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Past 30 Days</span>
              </div>

              <div className="space-y-3">
                {INITIAL_ANALYTICS.topRegions.map((region, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{region.region}</span>
                      <span className="font-mono text-slate-400">
                        {region.count} visits ({region.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                        style={{ width: `${region.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 pt-2 font-mono">
                High concentration of inquiries from Hamburg aerospace, green tech, and industrial automation hubs.
              </p>
            </div>

            {/* Weekly Traffic Chart Simulation */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Weekly Recruiter Visits vs. Views
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Peak on Wednesdays</span>
              </div>

              {/* Bar Visualizer */}
              <div className="flex items-end justify-between gap-3 h-48 pt-6 px-2">
                {INITIAL_ANALYTICS.weeklyTraffic.map((day, idx) => {
                  const heightPercent = (day.views / 1000) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.recruiters} rec
                      </div>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600 to-emerald-400 transition-all duration-500 group-hover:brightness-125"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-xs font-mono text-slate-400">{day.day}</span>
                    </div>
                  );
                })}
              </div>

              {/* Project popular rankings */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-semibold text-slate-300 mb-2 font-mono uppercase tracking-wider">
                  Most Explored Projects by Hiring Managers:
                </h4>
                <div className="space-y-1.5">
                  {INITIAL_ANALYTICS.projectInteractions.map((proj, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded bg-slate-950/40 border border-slate-800/60">
                      <span className="text-slate-200 truncate">{proj.title}</span>
                      <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
                        <span className="text-slate-400">{proj.views} views</span>
                        <span className="text-emerald-400 font-semibold">{proj.clickRate} CTR</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: Project Repos & Deliverables Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
              Live engineering status of open-source and active production systems.
            </div>

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
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[11px]"
                      >
                        github.com/jeevan516
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">WaDaCon Internal</span>
                    )}

                    <span className="text-emerald-400 font-mono text-[11px] font-semibold">
                      v2.4 Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: Log New Recruiter Lead */}
        {showAddLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  Log Opportunity to Pipeline
                </h3>
                <button
                  onClick={() => setShowAddLead(false)}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddLead} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Airbus, Otto Group, Scale AI..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Industrial IoT Lead, AI Engineer..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      placeholder="e.g. Sarah Schmidt"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Location Type</label>
                    <select
                      value={newLocationType}
                      onChange={(e) => setNewLocationType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Hamburg Onsite">Hamburg Onsite</option>
                      <option value="Hybrid Germany">Hybrid Germany</option>
                      <option value="Remote">Remote</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Compensation / Budget</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="e.g. €80k - €95k"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Message / Key Scope</label>
                  <textarea
                    rows={3}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Details about project, tech stack, or interview dates..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLead(false)}
                    className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                  >
                    Save Opportunity
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
