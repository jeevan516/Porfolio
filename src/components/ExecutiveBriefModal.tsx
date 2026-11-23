import React, { useState, useRef } from 'react';
import { FileText, Copy, Check, Printer, Briefcase, X } from 'lucide-react';
import { PERSONAL_INFO, EXPERIENCES } from '../data/portfolioData';
import { useModalA11y } from '../services/useModalA11y';
import { copyText } from '../services/clientUtils';
import { printElement } from '../services/documentExport';
import { ui } from '../services/uiClasses';

interface ExecutiveBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveBriefModal: React.FC<ExecutiveBriefModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const briefRef = useRef<HTMLDivElement | null>(null);
  useModalA11y(isOpen, onClose, dialogRef);

  if (!isOpen) return null;

  const handleCopyText = async () => {
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

    if (await copyText(briefText)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  // Print only the brief (window.print() would print the entire page)
  const handlePrint = () => {
    if (briefRef.current) printElement(briefRef.current, `${PERSONAL_INFO.name} - Executive Brief`);
  };

  return (
    <div className={ui.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="brief-modal-title"
        tabIndex={-1}
        className={`${ui.panel} max-w-3xl overflow-hidden`}
      >
        {/* Action bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-line flex items-center justify-between gap-3">
          <div id="brief-modal-title" className="flex items-center gap-2 text-sm font-semibold text-fg min-w-0">
            <FileText className="w-4 h-4 text-accent-fg shrink-0" />
            <span className="truncate">Executive brief</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={handleCopyText} className={`${ui.btnSecondary} !px-3 !py-2`} aria-label="Copy brief as plain text">
              {copied ? <Check className="w-3.5 h-3.5 text-accent-fg" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy text'}</span>
            </button>
            <button type="button" onClick={handlePrint} className={`${ui.btnPrimary} !px-3 !py-2`} aria-label="Print or save as PDF">
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button type="button" onClick={onClose} className={ui.iconBtn} aria-label="Close executive brief">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Executive Brief Content */}
        <div ref={briefRef} className="p-5 sm:p-10 space-y-6 text-fg print:p-0 bg-surface font-sans">
          
          {/* Header */}
          <div className="border-b border-line pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden ring-2 ring-accent-fg/50 shrink-0 bg-surface-2 print:ring-1 print:ring-line-strong">
                  <img
                    src="./jeevan-dutta.jpg"
                    alt="Jeevan Dutta"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-fg">
                    {PERSONAL_INFO.name}
                  </h2>
                  <p className="text-sm font-semibold text-accent-fg font-mono mt-0.5">
                    {PERSONAL_INFO.title} · MSc Informatics
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono text-muted sm:text-right space-y-0.5">
                <div>{PERSONAL_INFO.location} · AI & ML Bootcamp · Ready for Work</div>
                <div>{PERSONAL_INFO.email} · {PERSONAL_INFO.phone}</div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted mt-3 leading-relaxed">
              {PERSONAL_INFO.bio}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PERSONAL_INFO.stats.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-bg/60 border border-line/80">
                <div className="text-xs font-semibold text-accent-fg">{s.label}</div>
                <div className="text-base font-bold text-fg mt-0.5">{s.value}</div>
                <div className="text-xs text-muted">{s.detail}</div>
              </div>
            ))}
          </div>

          {/* Work & Education Highlights */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-teal font-bold flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Key Positions & Academic Rigor
            </h3>

            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className="p-4 rounded-xl bg-bg/40 border border-line/60 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                  <div className="font-bold text-fg text-sm">
                    {exp.role} — <span className="text-accent-fg">{exp.company}</span>
                  </div>
                  <div className="font-mono text-muted text-xs">
                    {exp.period} · {exp.location}
                  </div>
                </div>

                <ul className="space-y-1 text-xs text-muted">
                  {exp.achievements.slice(0, 3).map((a, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-1.5">
                      <span className="text-accent-fg mt-0.5">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Core Technical Stacks */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-accent-fg font-bold">
              Core Technical Competencies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-bg/50 border border-line">
                <span className="font-bold text-fg block mb-1">Observability & IoT:</span>
                <span className="text-muted font-mono text-xs">
                  Grafana, Prometheus, InfluxDB, Custom Exporters, MS Teams Webhooks, ISO 10816 Vibration Analysis
                </span>
              </div>
              <div className="p-3 rounded-lg bg-bg/50 border border-line">
                <span className="font-bold text-fg block mb-1">AI & Machine Learning:</span>
                <span className="text-muted font-mono text-xs">
                  Python, PyTorch, TensorFlow, LSTM Sequence Forecasting, Time-Series Anomaly Detection, RAG, Vertex AI
                </span>
              </div>
              <div className="p-3 rounded-lg bg-bg/50 border border-line">
                <span className="font-bold text-fg block mb-1">DevOps & Edge Systems:</span>
                <span className="text-muted font-mono text-xs">
                  Docker, Linux (Ubuntu), Teleport SSH Zero-Trust, CI/CD Automation, Shell Scripting, Port Forwarding
                </span>
              </div>
              <div className="p-3 rounded-lg bg-bg/50 border border-line">
                <span className="font-bold text-fg block mb-1">Backend & BI:</span>
                <span className="text-muted font-mono text-xs">
                  FastAPI, SQLAlchemy, SQL, Power BI DAX Analytics, REST APIs, Git/GitHub
                </span>
              </div>
            </div>
          </div>

          {/* Certifications footer */}
          <div className="pt-4 border-t border-line text-xs font-mono text-muted flex flex-wrap justify-between items-center gap-2">
            <span>Verified Credentials: Anthropic (Claude Code), Microsoft & LinkedIn (GenAI), Accenture (Data Analytics)</span>
            <span className="font-semibold text-accent-fg">AI & ML Bootcamp · Ready for Work</span>
          </div>

        </div>

      </div>
    </div>
  );
};
