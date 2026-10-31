import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Sparkles, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  ExternalLink,
  Award,
  GraduationCap,
  Briefcase,
  Cpu,
  Layers,
  CheckCircle2,
  RefreshCw,
  Eye
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { playSuccessChime } from '../services/soundFx';
import { PERSONAL_INFO, EXPERIENCES, EDUCATION_DATA, CERTIFICATIONS, SKILL_CATEGORIES, MASTER_THESIS_DETAILS } from '../data/portfolioData';

interface ResumeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'de';
}

export const ResumeExportModal: React.FC<ResumeExportModalProps> = ({
  isOpen,
  onClose,
  language: initialLang = 'en',
}) => {
  const [lang, setLang] = useState<'en' | 'de'>(initialLang);
  const [themeStyle, setThemeStyle] = useState<'executive' | 'modern'>('executive');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const resumeRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const isDe = lang === 'de';

  // Export high-resolution PDF using html2canvas and jsPDF
  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    setIsExporting(true);

    try {
      const element = resumeRef.current;
      
      // Capture at 2x scale for 300 DPI print quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Standard A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Additional pages if resume spans multi-page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = isDe 
        ? `Jeevan_Dutta_Lebenslauf_2026.pdf` 
        : `Jeevan_Dutta_Executive_CV_2026.pdf`;
      
      pdf.save(fileName);
      playSuccessChime();
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b']
      });
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      // Fallback to browser native print
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // Browser Native Print (Vector PDF)
  const handlePrint = () => {
    window.print();
  };

  // Plain Text ATS Resume Copy
  const handleCopyAtsText = () => {
    const text = `
JEEVAN DUTTA
IT Specialist & AI Engineer · MSc Informatics (TU Clausthal)
Email: ${PERSONAL_INFO.email} | Phone: ${PERSONAL_INFO.phone}
Location: ${PERSONAL_INFO.location}
LinkedIn: ${PERSONAL_INFO.linkedin} | GitHub: ${PERSONAL_INFO.github}
Availability: ${PERSONAL_INFO.status}

--------------------------------------------------------------------------------
EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
Results-oriented IT professional with a dual foundation in Data Analysis and IT Engineering. Holds an MSc in Informatics from Technische Universität Clausthal (with Master's thesis on 4-Node Synchronous PLC Networks under Prof. Dr. Christian Siemers). Over 10 years of professional experience across industrial observability (WaDaCon GmbH), systems & network engineering (Cogent Networks), distributed AI architectures (RadicalX), business intelligence (Netidentity), and scalable software engineering (Avast Technologies). Currently attending an intensive professional engineering bootcamp at neuefische GmbH covering Artificial Intelligence, Machine Learning, Data Science, Data Engineering, and modern Software Engineering. Available immediately and ready for work across Germany.

--------------------------------------------------------------------------------
EDUCATION & ACADEMIC RESEARCH
--------------------------------------------------------------------------------
Master of Science (MSc) in Informatics
Technische Universität Clausthal (TU Clausthal), Germany · 2019 - 2023
- Master Thesis: "${MASTER_THESIS_DETAILS.title}"
- Supervised by: Prof. Dr. Christian Siemers & Prof. Dr. Sven Hartmann
- Simulated 4-node synchronous PLC communication in VHDL using Xilinx Vivado over EIA-485 with guaranteed deterministic reaction times < 12 µs and hardware CRC-8 error detection.

--------------------------------------------------------------------------------
PROFESSIONAL EXPERIENCE
--------------------------------------------------------------------------------
1. WaDaCon GmbH | Hamburg, Germany
   Role: IT Specialist (Observability & Systems) | May 2025 - May 2026
   - Built end-to-end Grafana + Prometheus telemetry scraping pipelines and automated MS Teams webhook alerting, reducing incident mean time to response by >60%.
   - Ingested high-frequency industrial sensor streams into InfluxDB for recycling machinery analytics.
   - Designed Docker-based CI/CD pipelines achieving a 60% reduction in release cycle duration.
   - Configured Teleport for encrypted SSH tunneling and remote access across industrial plant facilities.
   - Engineered HAProxy and Keepalived active-standby L4/L7 load balancer clusters with zero-downtime failover.
   - Developed AI-driven anomaly detection models for short- and long-term machinery wear forecasting.

2. Cogent Networks | Stade, Lower Saxony, Germany
   Role: IT Support & Systems Engineer | Mar 2019 - Apr 2025 (6 yrs 2 mos)
   - Administered enterprise workstation hardware, peripherals, network routers, and VoIP communication systems.
   - Executed infrastructure deployments, software upgrades, and network security policies.
   - Provided comprehensive L1/L2 support and technical staff training.

3. RadicalX | Germany (Remote)
   Role: Artificial Intelligence Engineer | Dec 2023 - Feb 2024
   - Built backend architecture for Google Gemini Flights utilizing Vertex AI and FastAPI.
   - Developed performant REST APIs documented via Swagger UI and backed by SQLAlchemy ORM.
   - Converted machine learning models into production-ready web services.

4. Netidentity | Amsterdam, Netherlands (Remote)
   Role: Data Analyst & Web Developer | Jan 2021 - Jul 2021
   - Designed interactive Power BI dashboards tracking critical e-commerce KPIs and revenue funnels.
   - Performed customer journey friction analysis leading to measurable conversion increases.
   - Developed reusable web modules and conducted rigorous code reviews.

5. Avast Technologies Pvt Ltd | Hyderabad, India
   Role: Software Developer | Jun 2015 - May 2018 (3 yrs)
   - Engineered scalable, testable object-oriented backend and frontend software components.
   - Built proof-of-concept (POC) prototypes demonstrating technical solution viability.
   - Mentored junior engineers and championed clean code architecture in Agile sprints.

--------------------------------------------------------------------------------
CORE TECHNICAL COMPETENCIES
--------------------------------------------------------------------------------
- Languages & Frameworks: Python, FastAPI, Flask, Django, SQL, VHDL, TypeScript, HTML5/CSS3
- Infrastructure & Cloud: Docker, Portainer, CI/CD, Teleport, Linux (Ubuntu/Debian), HAProxy, Keepalived, Bash
- Observability & Data: Grafana, Prometheus, InfluxDB, Power BI, DAX, Sensor Streams, Log Analytics
- AI & Machine Learning: Vertex AI, Google Gemini, Time-Series Anomaly Detection, PyTorch, Scikit-Learn
- Languages: English (Fluent / C1), German (BAMF Certified B1/B2)
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-950 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                {isDe ? 'Professioneller Lebenslauf (PDF-Export)' : 'Professional Executive CV (PDF Export)'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isDe ? 'DIN A4 Format · Recruiter- & ATS-Optimiert' : 'DIN A4 Standard · Recruiter & ATS-Optimized'}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === 'en' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN (CV)
              </button>
              <button
                onClick={() => setLang('de')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === 'de' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                DE (Lebenslauf)
              </button>
            </div>

            {/* Copy ATS Text */}
            <button
              onClick={handleCopyAtsText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs"
              title="Copy plain text version for ATS job boards"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copied ATS Text' : 'Copy ATS Text'}</span>
            </button>

            {/* Print / Save as PDF */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs"
              title="Print via browser native print dialog"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Primary Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? (isDe ? 'Erstelle PDF...' : 'Generating PDF...') : (isDe ? 'PDF Herunterladen' : 'Download PDF')}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/60 flex justify-center">
          
          {/* Printable White A4 Document Canvas */}
          <div 
            ref={resumeRef}
            id="printable-cv-document"
            className="w-full max-w-[850px] bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 font-sans text-xs leading-normal border border-slate-200 select-text print:p-0 print:border-none print:shadow-none print:rounded-none"
          >
            
            {/* Header: Name, Title, Contact Info */}
            <header className="border-b-2 border-slate-900 pb-5 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                  {PERSONAL_INFO.name}
                </h1>
                <div className="text-sm font-bold text-emerald-700 tracking-wide mt-0.5">
                  {isDe ? 'IT-Spezialist & KI-Ingenieur · MSc Informatik (TU Clausthal)' : 'IT Specialist & AI Engineer · MSc Informatics (TU Clausthal)'}
                </div>
                <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>{isDe ? 'Im KI- & ML-Bootcamp · Sofort verfügbar & einsatzbereit' : 'AI & ML Bootcamp · Available Immediately & Ready for Work'}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="text-[11px] font-mono text-slate-700 space-y-1 text-left sm:text-right shrink-0">
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="w-3 h-3 text-slate-600" />
                  <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:underline">{PERSONAL_INFO.email}</a>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Phone className="w-3 h-3 text-slate-600" />
                  <span>{PERSONAL_INFO.phone}</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-600" />
                  <span>{isDe ? 'Hamburg, Deutschland (Umzugsbereit)' : 'Hamburg, Germany (Open to Relocation)'}</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Linkedin className="w-3 h-3 text-slate-600" />
                  <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">linkedin.com/in/jeevan-dutta</a>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Github className="w-3 h-3 text-slate-600" />
                  <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="hover:underline">github.com/jeevan516</a>
                </div>
              </div>
            </header>

            {/* Executive Summary */}
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{isDe ? 'Kurzprofil & Fachliche Ausrichtung' : 'Executive Profile & Objective'}</span>
              </h2>
              <p className="text-slate-700 text-[11px] leading-relaxed text-justify">
                {isDe 
                  ? 'Ergebnisorientierter IT-Experte mit dualem Fundament in Datenanalyse und IT-Engineering. Master of Science in Informatik an der Technischen Universität Clausthal (Masterarbeit über synchrone 4-Knoten-SPS-Netzwerke unter Betreuung von Prof. Dr. Christian Siemers). Mehr als 10 Jahre Praxiserfahrung in industrieller Telemetrie (WaDaCon GmbH), System- und Netzwerkadministration (Cogent Networks), KI-Backend-Entwicklung (RadicalX), E-Commerce-Analytics (Netidentity) und skalierbarer Softwareentwicklung (Avast Technologies). Spezialisiert auf hochverfügbare Infrastruktur, InfluxDB/Prometheus-Pipelines, Docker CI/CD, HAProxy-Load-Balancing und KI-Anomalieerkennung. Absolviert derzeit ein professionelles Bootcamp bei der neuefische GmbH (Künstliche Intelligenz, Machine Learning, Data Science, Data Engineering und Software Engineering) und ist ab sofort einsatzbereit für neue Aufgaben in Deutschland.'
                  : 'Results-oriented IT professional with a dual foundation in Data Analysis and IT Engineering. Holds an MSc in Informatics from Technische Universität Clausthal with specialized Master’s Thesis research on deterministic 4-node PLC networks under Prof. Dr. Christian Siemers. Brings over a decade of hands-on experience spanning industrial observability pipelines (WaDaCon GmbH), enterprise systems & network engineering (Cogent Networks), cloud AI architectures (RadicalX), business intelligence (Netidentity), and scalable object-oriented software development (Avast Technologies). Currently attending an intensive professional engineering bootcamp at neuefische GmbH covering Artificial Intelligence, Machine Learning, Data Science, Data Engineering, and modern Software Engineering. Available immediately and ready for work across Germany.'}
              </p>
            </section>

            {/* Education & Academic Rigor (TU Clausthal) */}
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-700" />
                <span>{isDe ? 'Ausbildung & Wissenschaftliche Forschung' : 'Education & Academic Research'}</span>
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">
                      Master of Science (MSc) — Informatics (Informatik)
                    </span>
                    <span className="text-slate-600 font-medium"> · Technische Universität Clausthal</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 shrink-0">
                    {isDe ? 'Okt 2019 – Jun 2023 · Deutschland' : 'Oct 2019 – Jun 2023 · Germany'}
                  </span>
                </div>

                {/* Thesis Callout */}
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[11px] space-y-1">
                  <div className="font-bold text-purple-900">
                    {isDe ? 'Masterarbeit:' : 'Master’s Thesis:'} <em>"{MASTER_THESIS_DETAILS.title}"</em>
                  </div>
                  <div className="text-slate-700 text-[10px] flex flex-wrap gap-x-4">
                    <span><strong>{isDe ? 'Erstprüfer:' : 'Supervisor:'}</strong> Prof. Dr. Christian Siemers</span>
                    <span><strong>{isDe ? 'Zweitprüfer:' : 'Second Examiner:'}</strong> Prof. Dr. Sven Hartmann</span>
                    <span><strong>{isDe ? 'Matrikel-Nr.:' : 'Matriculation No.:'}</strong> 517360</span>
                  </div>
                  <p className="text-slate-600 text-[10.5px] leading-relaxed pt-0.5">
                    {isDe 
                      ? 'Entwicklung und Simulation eines synchronen 4-Knoten-ZanderLink-Kommunikationsnetzwerks in VHDL mit Xilinx Vivado (2020.2) über EIA-485. Garantierte deterministische Reaktionszeiten unter 12 µs ohne Jitter sowie Hardware-CRC-8-Fehlerkorrektur.'
                      : 'Engineered and simulated a synchronous 4-node ZanderLink bus protocol in VHDL using Xilinx Vivado (2020.2) over EIA-485. Achieved guaranteed deterministic reaction times under 12 µs without jitter across distributed control nodes with hardware CRC-8 error detection.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Professional Work Experience */}
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 font-mono flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isDe ? 'Berufliche Erfahrung' : 'Professional Work Experience'}</span>
              </h2>

              <div className="space-y-4">
                {EXPERIENCES.filter(e => e.category === 'work').map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 text-xs">
                          {exp.role}
                        </span>
                        <span className="text-slate-700 font-semibold"> · {exp.company}</span>
                        <span className="text-[10px] text-slate-500 font-mono"> ({exp.location})</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-800 font-bold shrink-0">
                        {exp.period}
                      </span>
                    </div>

                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-[10.5px] leading-relaxed">
                      {exp.achievements.slice(0, 4).map((ach, aIdx) => (
                        <li key={aIdx}>
                          {ach}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {exp.technologies.slice(0, 8).map((tech, tIdx) => (
                        <span key={tIdx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Core Technical Competencies Grid */}
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                <span>{isDe ? 'Kernkompetenzen & Technologischer Stack' : 'Core Technical Competencies'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 font-mono text-[10px] block mb-1 uppercase text-emerald-800">
                    Infrastructure & DevOps
                  </strong>
                  <span className="text-slate-700">
                    Docker, Portainer, CI/CD Pipelines, Teleport, Linux Sysadmin (Ubuntu/Debian), HAProxy, Keepalived VRRP, SSH Tunneling, Bash Scripting
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 font-mono text-[10px] block mb-1 uppercase text-cyan-800">
                    Observability & Telemetry
                  </strong>
                  <span className="text-slate-700">
                    Grafana, Prometheus, InfluxDB, Custom Metric Exporters, MS Teams Webhooks, Time-Series Sensor Pipelines, Incident TTR Reduction
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 font-mono text-[10px] block mb-1 uppercase text-purple-800">
                    AI, Data & Backend APIs
                  </strong>
                  <span className="text-slate-700">
                    Python (FastAPI, Flask, Django), Vertex AI, Google Gemini API, PyTorch, Scikit-Learn, Power BI (DAX), SQLAlchemy, REST APIs
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 font-mono text-[10px] block mb-1 uppercase text-blue-800">
                    Hardware, Networking & Languages
                  </strong>
                  <span className="text-slate-700">
                    VHDL (Xilinx Vivado), EIA-485 / RS-485, TCP/IP, OSI 7-Layer, VoIP, English (Fluent / C1), German (BAMF Certified B1/B2)
                  </span>
                </div>
              </div>
            </section>

            {/* Verified Certifications (Top Accreditations) */}
            <section className="mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>{isDe ? 'Zertifizierungen & Verifizierte Nachweise' : 'Verified Industry Certifications'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] text-slate-700">
                {CERTIFICATIONS.slice(0, 8).map((cert) => (
                  <div key={cert.id} className="flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <div>
                      <span className="font-semibold text-slate-900">{cert.title}</span>
                      <span className="text-slate-500 font-mono"> — {cert.issuer} ({cert.date || cert.year})</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Document Footer */}
            <footer className="mt-6 pt-3 border-t border-slate-200 flex justify-between items-center text-[9px] font-mono text-slate-500">
              <span>Jeevan Dutta · Professional CV / Resume · Generated 2026</span>
              <span>Online Verification: jeevan516.github.io/jeevan-Dutta</span>
            </footer>

          </div>

        </div>

      </div>
    </div>
  );
};
