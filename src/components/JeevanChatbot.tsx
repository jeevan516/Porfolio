import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Mail, Copy, Check, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { copyText } from '../services/clientUtils';
import { ui } from '../services/uiClasses';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: () => void }[];
}

interface JeevanChatbotProps {
  onOpenContact: () => void;
  onOpenBrief: () => void;
  /** Incremented by the parent to open the chat from elsewhere on the page */
  openSignal?: number;
}

const IRRELEVANT_REPLY = `I apologize, but I can only answer questions about Jeevan Dutta's professional profile.

Try asking about:
• His education and Master's thesis at TU Clausthal
• His neuefische bootcamp and course projects
• Work experience and technical skills
• Availability and contact details`;

export const JeevanChatbot: React.FC<JeevanChatbotProps> = ({ onOpenContact, onOpenBrief, openSignal = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const typingTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(typingTimer.current), []);

  useEffect(() => {
    if (openSignal > 0) {
      setIsOpen(true);
      setIsMinimized(false);
      setHasUnread(false);
    }
  }, [openSignal]);

  // Focus the input whenever the chat window is shown
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const t = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
      return () => window.clearTimeout(t);
    }
  }, [isOpen, isMinimized]);

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Welcome to Jeevan Dutta's Professional Career & Technical Assistant.

I am a results-oriented IT professional with a dual foundation in Data Analysis and IT Engineering. With an MSc in Informatics from TU Clausthal (Master's thesis on 4-Node Synchronous Networks under Prof. Dr. Christian Siemers) and over a decade of hands-on experience, I specialize in transforming complex technical processes into streamlined, impactful outcomes.

🎯 Current Status: Currently Attending AI & Machine Learning Bootcamp · Available Immediately & Ready for Work (Hamburg & across Germany)

I can provide verified technical details on:
• Comprehensive Work History: Production engineering at WaDaCon GmbH, Cogent Networks (6+ yrs), RadicalX (Google Gemini Flights & Vertex AI), Netidentity (Power BI), and Avast Technologies.
• Master’s Thesis & Research: Synchronous 4-Node Deterministic Network (<12 µs reaction time in VHDL/Vivado) advised by Prof. Dr. Christian Siemers & Prof. Dr. Sven Hartmann.
• Core Technical Proficiencies: Grafana/InfluxDB observability, Docker CI/CD, Linux SysAdmin, Python REST APIs, and Machine Learning.
• Scheduling & Inquiries: Instant contact coordination and interview scheduling.

How can I assist your evaluation or hiring process today?`,
      timestamp: 'Just now',
    },
  ]);

  const presetQuestions = [
    'What job roles is Jeevan currently open to?',
    'What is his education and thesis research?',
    'Show all his verified LinkedIn certifications',
    'Walk me through his complete work history',
    'What did he build at WaDaCon GmbH?',
    'How do I schedule an interview with Jeevan?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, isMinimized, messages, isTyping]);

  const handleCopyEmail = async () => {
    if (await copyText(PERSONAL_INFO.email)) {
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  // Follow-up buttons attached to certain answers (the text offers these actions)
  const getQuickActions = (query: string, answer: string): ChatMessage['quickActions'] => {
    const actions: NonNullable<ChatMessage['quickActions']> = [];
    const q = query.toLowerCase();
    if (/executive brief|resume|\bcv\b/i.test(answer) || /resume|\bcv\b|brief|pdf/.test(q)) {
      actions.push({ label: 'Open executive brief', action: onOpenBrief });
    }
    if (/schedule|interview|contact|reach jeevan/i.test(answer)) {
      actions.push({ label: 'Contact Jeevan', action: onOpenContact });
    }
    return actions.length ? actions : undefined;
  };

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase().trim();

    // Match terms at word boundaries so e.g. "cv" doesn't fire on "cvs" and "iot" on "idiot".
    // Short tokens must match as whole words; longer ones may be stems ("certif", "experien").
    const has = (term: string) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const tail = term.length <= 4 ? '\\b' : '';
      return new RegExp(`\\b${escaped}${tail}`, 'i').test(q);
    };

    // General-knowledge / off-topic questions that don't refer to Jeevan get the apology
    const aboutJeevan = /\b(jeevan|dutta|he|his|him|you|your|candidate|this portfolio)\b/i.test(q);
    const offTopic =
      /\b(weather|recipe|cook|joke|poem|song|lyrics|movie|film|football|cricket|soccer|sport|score|stock price|bitcoin|crypto|news today|president|prime minister|capital of|translate|population|horoscope|game|celebrity)\b/i.test(q) ||
      /^(how (do|can|to|does)|write (me )?(a|an|some)|explain|what is (a|an|the)|calculate|solve|tell me about (the|a)\b)/i.test(q);
    if (offTopic && !aboutJeevan) {
      return IRRELEVANT_REPLY;
    }

    // Education & Academic Background Query
    if (has('education') || has('degree') || has('university') || has('clausthal') || has('jntu') || has('bachelor')) {
      return `Here is Jeevan Dutta's formal educational background from Germany and India (verified on LinkedIn):
 
1. Master of Science (M.Sc.) in Informatics (2019 – 2023 · Degree Awarded)
   • Institution: Technische Universität Clausthal (TU Clausthal), Lower Saxony, Germany
   • Specialization: Distributed Systems, Machine Learning, Telecommunications & VLSI Microelectronics
   • Master's Thesis: "Definition, Development and Simulation of a 4-Node Communication Network for Reliable Reaction Times Inside Distributed Networks"
   • Advisors: Prof. Dr. Christian Siemers (1st Examiner) & Prof. Dr. Sven Hartmann (2nd Examiner) · Matriculation No. 517360
   • Key Deliverable: Engineered & simulated 4-node synchronous ZanderLink bus in VHDL (Xilinx Vivado) with guaranteed <12 µs deterministic reaction times and zero jitter.

2. Bachelor of Science (B.Sc.) in Computer Science (2011 – 2015 · Degree Conferred)
   • Institution: Jawaharlal Nehru Technological University (JNTU), Hyderabad, India
   • Technical Focus: Netzwerktechnik (Computer Networks), Compilerdesign, C and C++ Systems Programming, Data Structures, Algorithms & Relational Databases.`;
    }

    // Greetings and polite introductions
    if (/^(hi|hello|hey|greetings|hallo|guten tag|good morning|good afternoon|good evening|who are you|what can you do)/i.test(q.trim())) {
      return `Hello! I am Jeevan Dutta's AI career and technical portfolio assistant.

I can assist you with verified details about:
• Jeevan's education (MSc in Informatics from TU Clausthal) & Master's Thesis research (<12 µs deterministic 4-node ZanderLink network)
• Current upskilling in an intensive AI & Machine Learning Bootcamp
• Work history at WaDaCon GmbH, Cogent Networks, RadicalX, Netidentity & Avast Technologies
• Technical skillset (Observability, InfluxDB/Prometheus/Grafana, Docker, Linux, Python, PyTorch)
• Immediate availability across Germany & contact information

How can I help with your recruitment or technical inquiry?`;
    }

    // Bootcamp & Upskilling query (neuefische GmbH)
    if (has('bootcamp') || has('neuefische') || has('upskill') || has('data science') || has('data engineering') || has('software engineering')) {
      return `Jeevan is currently attending an ongoing professional bootcamp at **neuefische GmbH** (AI, Machine Learning, Data Science, Data Engineering & Software Engineering).

Course projects so far:
• King County House Prices — refactored an exploratory notebook into a tested Python package and pipeline, with a containerized FastAPI service (github.com/jeevan516/mle-refactoring-project).
• Model Review Board — Flask app where an ML team reviews model predictions; SQLite locally, PostgreSQL on Render, pytest suite (github.com/jeevan516/model-review-board).
• FastAPI + PostgreSQL + Docker Compose — typed CRUD API with Pydantic and SQLAlchemy, packaged as a multi-container stack (github.com/jeevan516/docker).
• NYC Taxi Data Pipeline — Python ETL loading Parquet into PostgreSQL in Docker, remodelled into a star schema.
• dbt Analytics Pipeline — staging, intermediate and mart layers on PostgreSQL and DuckDB, run in Docker.
• Notebook → Production Python — scikit-learn custom transformers and pipelines (Titanic dataset).
• Packaging & Testing — source-layout packages, pytest unit and integration tests with SQLite.
• Clean Code & OOP — refactoring, object-oriented design and Pydantic data validation (github.com/jeevan516/Opps).
• Cloud Deployment — GCP virtual machine connected to Cloud SQL serving a web app.

He is available immediately for roles across Germany while the bootcamp continues. Would you like to review his resume or get in touch?`;
    }

    // Master Thesis / Academic Research Query
    if (has('thesis') || has('master') || has('zanderlink') || has('4-node') || has('siemers') || has('hartmann') || has('vivado') || has('vhdl') || has('fpga') || has('plc') || has('microelectronics') || has('vlsi') || has('fsm') || has('crc')) {
      return `Here are the details on Jeevan's attached Master's Thesis:

🎓 Title: "Definition, Development and Simulation of a 4-Node Communication Network for Reliable Reaction Times Inside Distributed Networks"
🏛️ Institution: Institute of Informatics, Technische Universität Clausthal (TU Clausthal)
👨‍🏫 Examiners: Prof. Dr. Christian Siemers (First Examiner) & Prof. Dr. Sven Hartmann (Second Examiner)
📅 Submitted: 27.07.2023 · Matriculation No. 517360

Core Engineering Highlights:
• ZanderLink Protocol: Enhanced the synchronous serial communication protocol between PLCs from P2P to a deterministic 4-node bus (1 Master "00", 3 Slaves: "01", "10", "11") over EIA-485 (RS-485).
• Guaranteed Deterministic Timing: Achieved complete 156-bit roundtrip data exchange in 9.75 µs at 16 Mbit/s, guaranteeing total reaction times under 12 µs (including 1 µs calculation and 1 µs driver delay) with zero jitter ("Mission Jitter Zero").
• Hardware VHDL in Vivado 2020.2: Implemented the entire ZanderLink4 entity in VHDL with separate Master and Slave Finite State Machines (FSMs) handling SCAN, TRANSMIT, RECEIVE, and CRC CHECK.
• CRC Error Detection: Integrated CRC-5 (polynomial x⁴ + x) and CRC-8 validation, start bit framing ('00' normal byte, '01' last byte), noise injection simulations, and format error recovery.
• Physical Synthesis: Mapped to 1,086 nets, 832 leaf cells, and 400 RTL cells utilizing Xilinx C5LUTs, CLBs, clock regions (X0Y3..X1Y3), and RPM grid coordinates.
• Deliverables: VHDL source, testbenches, and synthesis reports, with the full thesis showcased on this portfolio.`;
    }

    // Reaction time specific query
    if (has('reaction time') || has('latency') || has('jitter') || has('roundtrip')) {
      return `In his Master's Thesis, Jeevan proved and simulated a guaranteed deterministic reaction time of under 12 µs!

Here is the exact mathematical model:
• Per data byte: 8 bits + 2 start bits.
• Per node header: 2-bit sender address identifier.
• Terminal byte: 2 start bits + 1 ACK bit + 5 CRC bits + 1 stop bit + 1 switch bit = 10 bits.
• Per node frame: 2-bit ID + 4 * (8 + 2) payload + 10-bit terminal = 52 bits.
• Roundtrip across 3 stations: 156 bits total.
• Bus speed: 16 Mbit/s ➔ 156 bits ÷ 16 Mbit/s = 9.75 µs roundtrip!
• Factoring 1.0 µs controller execution + 1.0 µs driver delay = 11.75 µs (< 12 µs guaranteed reaction time) across the distributed network with zero jitter.`;
    }

    // Location & Relocation & German Work Authorization query
    if (has('location') || has('hamburg') || has('germany') || has('remote') || has('relocat') || has('visa') || has('authorization') || has('permit') || has('german') || has('deutsch')) {
      return `Here are Jeevan's location and eligibility details:

• Current Location: Hamburg, Germany
• Mobility: Open to on-site roles in Hamburg / Lower Saxony, hybrid arrangements across Germany, or remote positions.
• Work Authorization: Unrestricted German work authorization (no visa sponsorship required).
• Availability: Available immediately and ready for work while currently attending an AI & ML Bootcamp.
• Languages: Fluent English (professional & technical), Professional German (DTZ B1 certified).`;
    }

    // Resume / CV / Executive Brief query
    if (has('resume') || has('cv') || has('brief') || has('pdf')) {
      return `You can view and export Jeevan's complete credentials right here on this portfolio:

• Executive Brief & PDF CV: Click the "Executive Brief & Resume" button in the navigation or top banner to download a clean, ATS-compliant PDF resume.
• Plain Text Export: The modal also offers instant copying of a plain-text markdown resume.
• Verified References: Contains his TU Clausthal degree verification, research overview, and industrial telemetry deliverables.

Would you like me to open the Executive Brief modal for you?`;
    }

    // Target roles and active job search query
    if (has('role') || has('job') || has('opportunit') || has('availab') || has('hire') || has('resign') || has('seeking') || has('position')) {
      return `Jeevan is actively open and exploring full-time engineering and specialist opportunities across Germany with immediate availability while attending an AI & ML Bootcamp.

Target Positions:
• IT Specialist / Systems Engineer
• Observability & Site Reliability / Telemetry Engineer
• Artificial Intelligence / Machine Learning Engineer
• Cloud & DevOps Engineer / Linux Infrastructure Specialist
• Full-Stack IoT & Data Solutions Developer

Professional Profile Summary:
• Location: Based in Hamburg, Germany (Available for on-site roles in Hamburg / Lower Saxony, hybrid models across Germany, or remote).
• Work Authorization: Full, unrestricted German work authorization.
• Availability: Immediate & Ready for Work.
• Languages: Fluent English, Professional German (DTZ B1).
• Education: Master of Science (MSc) in Informatics, Technische Universität Clausthal.

Would you like to schedule an introductory discussion or inspect his Executive Brief?`;
    }

    // Full work history query
    if (has('experien') || has('all jobs') || has('cogent') || has('radical') || has('avast') || has('netidentity')) {
      return `Here is a summary of Jeevan's 10+ year engineering track record across industry:

1. WaDaCon GmbH (Hamburg · May 2025 – May 2026, Full-Time):
   IT Specialist & Observability Engineer powering industrial recycling plants. Architected InfluxDB/Prometheus/Grafana pipelines, Docker CI/CD, Teleport zero-trust SSH, automated Teams alerts, and AI anomaly detection models. (Immediate availability & ready for work).

2. Cogent Networks (Stade, Lower Saxony · Mar 2019 – Apr 2025, 6+ yrs, Freelance):
   IT Support Engineer managing workstation hardware, system upgrades, VoIP telephony, enterprise networks, L1/L2 support, and infrastructure rollouts.

3. RadicalX (Germany Remote · Dec 2023 – Feb 2024, Internship):
   Artificial Intelligence Engineer building Google Gemini Flights backend with Vertex AI, FastAPI, Swagger UI, and machine learning pipelines.

4. Netidentity (Amsterdam Remote · Jan 2021 – Jul 2021, Internship):
   Data Analyst developing Power BI interactive dashboards, e-commerce KPI models, DAX pipelines, and UX friction analysis.

5. Avast Technologies Pvt Ltd (Greater Hyderabad · Jun 2015 – May 2018, 3 yrs, Full-Time):
   Software Developer engineering testable modular applications, POC feasibility prototypes, Agile sprints, and code reviews.`;
    }

    // WaDaCon experience query
    if (has('wadacon') || has('iot') || has('observability') || has('grafana') || has('influx') || has('mrf')) {
      return `During his tenure at WaDaCon GmbH (Hamburg, Germany), Jeevan served as IT Specialist & Observability Engineer powering Next-Gen Material Recovery Facilities (MRF):

Key Production Accomplishments:
• Industrial Telemetry Stack: Architected InfluxDB + Prometheus + Grafana monitoring high-frequency sensor streams from recycling machinery.
• Rapid Incident Mitigation: Reduced critical incident detection & resolution times by over 60% through automated webhook alerts into Microsoft Teams.
• Edge Infrastructure: Implemented zero-trust Teleport SSH for secure remote plant management and Dockerized microservices that accelerated software rollouts by 35%.
• Predictive AI: Integrated time-series machine learning to flag equipment wear up to 72 hours before failure.
• REST Services & Administration: Developed Python (Flask/Django) APIs and performed Linux system administration and network troubleshooting.

Having completed all handovers, Jeevan is attending an AI & ML Bootcamp and is ready for work with immediate availability.`;
    }

    // Certifications query
    if (has('certif') || has('credential') || has('claude') || has('microsoft') || has('accenture')) {
      return `Jeevan holds verified technical and AI credentials listed on his LinkedIn profile (linkedin.com/in/jeevan-dutta):

1. Claude Code in Action — Anthropic (AI Engineering, Agentic Workflows, Claude API)
2. Career Essentials in Generative AI — Microsoft & LinkedIn (Copilot & Prompt Architecture)
3. Generative AI: The Evolution of Thoughtful Search — Microsoft (Vector Embeddings, RAG & Semantic Retrieval)
4. What Is Generative AI? — Microsoft (LLM Architecture & Ethics)
5. Streamlining Your Work with Microsoft Copilot — Microsoft (AI Workflow Optimization)
6. Data Analytics and Visualization Job Simulation — Accenture North America (Forage)
7. Learning Power BI Desktop — LinkedIn Learning (DAX Formulas, Data Modeling & KPI Funnels)
8. Very Large Scale Integrated Circuits (VLSI) & Microelectronics Research — TU Clausthal (Prof. Dr. Christian Siemers)`;
    }

    // Contact and hiring query
    if (has('contact') || has('email') || has('phone') || has('linkedin') || has('interview')) {
      return `You can reach Jeevan directly for job inquiries or interviews:

• Email: jeevannaidu516@gmail.com
• Phone: +49 176 36369761
• LinkedIn: linkedin.com/in/jeevan-dutta
• GitHub: github.com/jeevan516
• Portfolio: jeevan516.github.io/jeevan-Dutta/

You can also use the 'Hire / Interview Jeevan' button on this page to log an opportunity directly into his tracker!`;
    }

    // Technical Skills query
    if (has('skill') || has('stack') || has('python') || has('docker') || has('pytorch') || has('kubernetes') || has('linux')) {
      return `Jeevan's comprehensive technical toolkit includes:

• Distributed Systems & Hardware: VHDL, Xilinx Vivado (2020.2), FPGA Synthesis, RS-485 / EIA-485, PLC Communication, Finite State Machines (FSM), CRC Error Detection.
• Observability & DevOps: Grafana, Prometheus, InfluxDB, Webhook Automation, Docker, Linux (Ubuntu/Debian), Teleport Zero-Trust, CI/CD Pipelines.
• AI & Machine Learning: Python, PyTorch, TensorFlow, Scikit-Learn, Time-Series Anomaly Detection, FastAPI, Google Gemini API, Claude API, RAG.
• Data & Analytics: SQL, PostgreSQL, SQLAlchemy ORM, Power BI, DAX modeling.`;
    }

    // Projects query
    if (has('project') || has('telemetry') || has('pipeline')) {
      return `Jeevan's portfolio features several production-grade engineering projects:

1. Industrial IoT Observability Pipeline (WaDaCon GmbH):
   • InfluxDB + Prometheus + Grafana telemetry system monitoring industrial recycling plant sensor streams.
   • Reduced mean time to response by >60% through automated webhook alerts into Microsoft Teams.

2. Deterministic 4-Node Synchronous PLC Network:
   • Master's Thesis research at TU Clausthal under Prof. Dr. Christian Siemers.
   • Simulated in Xilinx Vivado with guaranteed <12 µs deterministic reaction time and zero jitter.

3. Google Gemini Flights Backend (RadicalX):
   • Built using Google Cloud Vertex AI, Gemini models, FastAPI, and Docker.

4. E-Commerce KPI Analytics Dashboard (Netidentity):
   • Interactive Power BI dashboards, DAX data modeling, and customer acquisition funnel metrics.

You can inspect all projects and interactive architecture diagrams in the Projects section above!`;
    }

    // Anything not about Jeevan's profile
    return IRRELEVANT_REPLY;
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => {
      const answer = generateAnswer(query);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: answer,
        timestamp: 'Just now',
        quickActions: getQuickActions(query, answer),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <>
      {/* Floating launcher */}
      {!isOpen && (
        <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40">
          <button
            ref={launcherRef}
            id="chatbot-launcher-btn"
            type="button"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            aria-label="Open Jeevan's career assistant chat"
            className={`group flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all ${ui.focusRing}`}
          >
            <span className="relative">
              <Bot className="w-5 h-5" />
              {hasUnread && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white ring-2 ring-emerald-500" />}
            </span>
            <span className="text-left leading-tight hidden sm:block">
              <span className="block text-xs font-bold">Ask Jeevan's bot</span>
              <span className="block text-[10px] font-medium text-slate-900/80">Career & skills assistant</span>
            </span>
          </button>
        </div>
      )}

      {/* Minimized dock */}
      {isOpen && isMinimized && (
        <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-2rem)]">
          <div className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className={`flex items-center gap-2.5 text-left rounded-lg min-w-0 ${ui.focusRing}`}
              aria-label="Restore chat window"
            >
              <span className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0">
                <Bot className="w-4 h-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-white truncate">Jeevan's bot</span>
                <span className="block text-[10px] text-slate-400 truncate">Click to restore</span>
              </span>
            </button>

            <div className="flex items-center gap-0.5 border-l border-slate-800 pl-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsMinimized(false);
                  setIsMaximized(true);
                }}
                aria-label="Maximize chat window"
                title="Maximize"
                className={`${ui.iconBtn} !h-8 !w-8`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={closeChat} aria-label="Close chat" title="Close" className={`${ui.iconBtn} !h-8 !w-8`}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat window */}
      {isOpen && !isMinimized && (
        <div
          role="dialog"
          aria-label="Jeevan's career assistant"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation();
              closeChat();
            }
          }}
          className={`fixed z-50 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden ${
            isMaximized
              ? 'inset-2 sm:inset-6 max-w-5xl mx-auto'
              : 'inset-x-2 bottom-2 top-16 sm:top-auto sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[420px] sm:h-[600px] sm:max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white font-display truncate">Jeevan's bot</h3>
                <p className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  Available for a new role · Germany
                </p>
              </div>
            </div>

            <div className="flex items-center gap-0.5 shrink-0">
              <button
                id="chatbot-minimize-btn"
                type="button"
                onClick={() => setIsMinimized(true)}
                aria-label="Minimize chat"
                title="Minimize"
                className={`${ui.iconBtn} !h-8 !w-8`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                id="chatbot-maximize-btn"
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                aria-label={isMaximized ? 'Restore chat size' : 'Maximize chat'}
                title={isMaximized ? 'Restore size' : 'Maximize'}
                className={`${ui.iconBtn} !h-8 !w-8 hidden sm:inline-flex`}
              >
                {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                id="chatbot-close-btn"
                type="button"
                onClick={closeChat}
                aria-label="Close chat"
                title="Close"
                className={`${ui.iconBtn} !h-8 !w-8`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-[13px]" aria-live="polite">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-sm'
                        : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.quickActions && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.quickActions.map((qa) => (
                        <button key={qa.label} type="button" onClick={qa.action} className={`${ui.btnSecondary} !px-3 !py-1.5 !text-[11px]`}>
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2" aria-label="Assistant is typing">
                <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts */}
          <div className="px-3 py-2 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar" aria-label="Suggested questions">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            {presetQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className={`px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors disabled:opacity-50 ${ui.focusRing}`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <label htmlFor="chatbot-input" className="sr-only">
                Ask a question
              </label>
              <input
                ref={inputRef}
                id="chatbot-input"
                type="text"
                autoComplete="off"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about skills, thesis, WaDaCon…"
                className={`${ui.input} flex-1 !text-[13px]`}
              />
              <button type="submit" disabled={!inputValue.trim() || isTyping} aria-label="Send message" className={`${ui.btnPrimary} !p-2.5`}>
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between gap-2 mt-2 text-[11px]">
              <button type="button" onClick={onOpenContact} className={`${ui.btnGhost} !px-2 !py-1 text-emerald-400`}>
                <Mail className="w-3 h-3" />
                Contact Jeevan
              </button>
              <button type="button" onClick={handleCopyEmail} className={`${ui.btnGhost} !px-2 !py-1`}>
                {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedEmail ? 'Email copied' : 'Copy email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
