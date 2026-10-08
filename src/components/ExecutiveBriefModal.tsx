import React, { useState } from 'react';
import { FileText, Copy, Check, Printer, Download, ExternalLink, MapPin, Mail, Phone, Globe, Award, Briefcase, GraduationCap } from 'lucide-react';
import { PERSONAL_INFO, EXPERIENCES, CERTIFICATIONS } from '../data/portfolioData';

interface ExecutiveBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveBriefModal: React.FC<ExecutiveBriefModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    const briefText = `======================================================================
EXECUTIVE CANDIDATE BRIEF: JEEVAN DUTTA
======================================================================
Role Focus: IT Specialist | AI & Observability Engineer | Data Systems
Location: Hamburg, Germany (Available Immediately)
Contact: ${PERSONAL_INFO.email} | ${PERSONAL_INFO.phone}
LinkedIn: ${PERSONAL_INFO.linkedin}
GitHub: ${PERSONAL_INFO.github}

SUMMARY:
Results-oriented IT Specialist with a dual foundation in Data Intelligence and IT Infrastructure.
Holds an MSc in Informatics from TU Clausthal with deep experience in industrial observability
pipelines (Grafana/Prometheus/InfluxDB), edge computing, and AI anomaly detection at WaDaCon GmbH.

EDUCATION:
- Master of Science (MSc) in Informatics
  Technische Universität Clausthal (Germany), 2019 - 2023
  Focus: Deep Learning Sequence Modeling, Distributed Systems, Neural Architectures

CORE EXPERIENCE:
- IT Specialist & Observability Engineer | WaDaCon GmbH (Hamburg, Germany)
  * Designed end-to-end industrial telemetry stack (InfluxDB, Prometheus, Grafana).
  * Reduced incident response times by 60% with automated alerting.
  * Secured edge deployments using Teleport zero-trust SSH tunneling and Docker.
  * Trained ML anomaly detection models on high-frequency sensor streams.

KEY TECHNICAL CAPABILITIES:
- Observability: Grafana, Prometheus, InfluxDB, Custom Exporters, MS Teams Webhooks
- AI & Deep Learning: Python, PyTorch, TensorFlow, LSTM Sequence Prediction, RAG, Vertex AI
- DevOps & Systems: Docker, Portainer, Linux (Ubuntu), Teleport SSH, CI/CD, Shell Scripting
- Backend & Data: FastAPI, SQLAlchemy, SQL, Power BI DAX Analytics

CERTIFICATIONS:
- Claude Code in Action (Anthropic, 2026)
- Networking Foundations: Networking Basics (LinkedIn Learning, 2026)
- AI Tools Workshop Certification (Be10x, 2026)
- Requirements Elicitation & Analysis (PMI & NASBA Accredited)
- Certified Scrum Master (NASBA Accredited)
- Business Analysis Foundations & BPMN (IIBA Endorsed)
- ITIL® 4 & IT Service Management Foundations
- German Language Qualification (BAMF DTZ B1 gut erfüllt)
======================================================================`;

    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Top Action Bar (Hidden when printing) */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
            <FileText className="w-4 h-4" />
            <span>EXECUTIVE CANDIDATE BRIEF · HIRING MANAGER READY</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied ATS Text!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Executive Brief Content */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-200 print:text-slate-900 print:p-4 bg-slate-900 print:bg-white font-sans">
          
          {/* Header */}
          <div className="border-b border-slate-800 pb-6 print:border-slate-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden ring-2 ring-emerald-500/50 shrink-0 bg-slate-800 print:ring-1 print:ring-slate-400">
                  <img
                    src="./jeevan-dutta.jpg"
                    alt="Jeevan Dutta"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white print:text-black">
                    {PERSONAL_INFO.name}
                  </h2>
                  <p className="text-sm font-semibold text-emerald-400 print:text-emerald-700 font-mono mt-0.5">
                    {PERSONAL_INFO.title} · MSc Informatics
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-400 print:text-slate-600 sm:text-right space-y-0.5">
                <div>{PERSONAL_INFO.location} · Available Immediately</div>
                <div>{PERSONAL_INFO.email} · {PERSONAL_INFO.phone}</div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 print:text-slate-700 mt-3 leading-relaxed">
              {PERSONAL_INFO.bio}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PERSONAL_INFO.stats.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800/80 print:border-slate-300">
                <div className="text-xs font-semibold text-emerald-400 print:text-emerald-800">{s.label}</div>
                <div className="text-base font-bold text-white print:text-black mt-0.5">{s.value}</div>
                <div className="text-[10px] text-slate-400 print:text-slate-600">{s.detail}</div>
              </div>
            ))}
          </div>

          {/* Work & Education Highlights */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 print:text-cyan-800 font-bold flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Key Positions & Academic Rigor
            </h3>

            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className="p-4 rounded-xl bg-slate-950/40 print:bg-slate-50 border border-slate-800/60 print:border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                  <div className="font-bold text-white print:text-black text-sm">
                    {exp.role} — <span className="text-emerald-400 print:text-emerald-700">{exp.company}</span>
                  </div>
                  <div className="font-mono text-slate-400 print:text-slate-600 text-[11px]">
                    {exp.period} · {exp.location}
                  </div>
                </div>

                <ul className="space-y-1 text-xs text-slate-300 print:text-slate-700">
                  {exp.achievements.slice(0, 3).map((a, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 print:text-emerald-700 mt-0.5">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Core Technical Stacks */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 print:text-emerald-800 font-bold">
              Core Technical Competencies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/50 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="font-bold text-white print:text-black block mb-1">Observability & IoT:</span>
                <span className="text-slate-300 print:text-slate-700 font-mono text-[11px]">
                  Grafana, Prometheus, InfluxDB, Custom Exporters, MS Teams Webhooks, ISO 10816 Vibration Analysis
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/50 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="font-bold text-white print:text-black block mb-1">AI & Machine Learning:</span>
                <span className="text-slate-300 print:text-slate-700 font-mono text-[11px]">
                  Python, PyTorch, TensorFlow, LSTM Sequence Forecasting, Time-Series Anomaly Detection, RAG, Vertex AI
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/50 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="font-bold text-white print:text-black block mb-1">DevOps & Edge Systems:</span>
                <span className="text-slate-300 print:text-slate-700 font-mono text-[11px]">
                  Docker, Linux (Ubuntu), Teleport SSH Zero-Trust, CI/CD Automation, Shell Scripting, Port Forwarding
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/50 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="font-bold text-white print:text-black block mb-1">Backend & BI:</span>
                <span className="text-slate-300 print:text-slate-700 font-mono text-[11px]">
                  FastAPI, SQLAlchemy, SQL, Power BI DAX Analytics, REST APIs, Git/GitHub
                </span>
              </div>
            </div>
          </div>

          {/* Certifications footer */}
          <div className="pt-4 border-t border-slate-800 print:border-slate-300 text-[11px] font-mono text-slate-400 print:text-slate-600 flex flex-wrap justify-between items-center gap-2">
            <span>Verified Credentials: Anthropic (Claude Code), Microsoft & LinkedIn (GenAI), Accenture (Data Analytics)</span>
            <span className="font-semibold text-emerald-400 print:text-emerald-800">Available Immediately</span>
          </div>

        </div>

      </div>
    </div>
  );
};
