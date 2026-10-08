import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  CornerDownLeft, 
  Mail, 
  Cpu, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Minus,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { PERSONAL_INFO, ACADEMIC_REFERENCES, CERTIFICATIONS, EXPERIENCES } from '../data/portfolioData';

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
}

export const JeevanChatbot: React.FC<JeevanChatbotProps> = ({ onOpenContact, onOpenBrief }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Welcome to Jeevan Dutta's Professional Career & Technical Assistant.

I am a results-oriented IT professional with a dual foundation in Data Analysis and IT Engineering. With an MSc in Informatics from TU Clausthal (Master's thesis on 4-Node Synchronous Networks under Prof. Dr. Christian Siemers) and over a decade of hands-on experience, I specialize in transforming complex technical processes into streamlined, impactful outcomes.

🎯 Current Status: Available for New Role (Immediate Availability · Hamburg & across Germany)

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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase();

    // Education & Academic Background Query
    if (q.includes('education') || q.includes('degree') || q.includes('university') || q.includes('clausthal') || q.includes('jntu') || q.includes('bachelor')) {
      return `Here is Jeevan Dutta's formal educational background from Germany and India (verified on LinkedIn):
 
1. Master of Science (M.Sc.) in Informatics (2019 – 2023 · Degree Awarded)
   • Institution: Technische Universität Clausthal (TU Clausthal), Lower Saxony, Germany
   • Specialization: Distributed Systems, Machine Learning, Telecommunications & VLSI Microelectronics
   • Master's Thesis: "Definition, Development and Simulation of a 4-Node Communication Network for Reliable Reaction Times Inside Distributed Networks"
   • Advisors: Prof. Dr. Christian Siemers (1st Examiner) & Prof. Dr. Sven Hartmann (2nd Examiner) · Matriculation No. 517360
   • Key Deliverable: Engineered & simulated 4-node synchronous ZanderLink bus in VHDL (Xilinx Vivado) with guaranteed <12 µs deterministic reaction times and zero jitter.
   • Public Research Code: Published publicly on GitHub at github.com/jeevan516/4-node-communication-network-master-thesis

2. Bachelor of Science (B.Sc.) in Computer Science (2011 – 2015 · Degree Conferred)
   • Institution: Jawaharlal Nehru Technological University (JNTU), Hyderabad, India
   • Technical Focus: Netzwerktechnik (Computer Networks), Compilerdesign, C and C++ Systems Programming, Data Structures, Algorithms & Relational Databases.`;
    }

    // Master's Thesis specific query
    if (q.includes('thesis') || q.includes('master') || q.includes('zanderlink') || q.includes('4-node') || q.includes('siemers') || q.includes('hartmann') || q.includes('vivado') || q.includes('vhdl')) {
      return `Here are the details on Jeevan's attached Master's Thesis:

🎓 Title: "Definition, Development and Simulation of a 4-Node Communication Network for Reliable Reaction Times Inside Distributed Networks"
🏛️ Institution: Institute of Informatics, Technische Universität Clausthal (TU Clausthal)
👨‍🏫 Examiners: Prof. Dr. Christian Siemers (First Examiner) & Prof. Dr. Sven Hartmann (Second Examiner)
📅 Submitted: 27.07.2023 · Matriculation No. 517360
🌐 Public GitHub Repo: github.com/jeevan516/4-node-communication-network-master-thesis

Core Engineering Highlights:
• ZanderLink Protocol: Enhanced the synchronous serial communication protocol between PLCs from P2P to a deterministic 4-node bus (1 Master "00", 3 Slaves: "01", "10", "11") over EIA-485 (RS-485).
• Guaranteed Deterministic Timing: Achieved complete 156-bit roundtrip data exchange in 9.75 µs at 16 Mbit/s, guaranteeing total reaction times under 12 µs (including 1 µs calculation and 1 µs driver delay) with zero jitter ("Mission Jitter Zero").
• Hardware VHDL in Vivado 2020.2: Implemented the entire ZanderLink4 entity in VHDL with separate Master and Slave Finite State Machines (FSMs) handling SCAN, TRANSMIT, RECEIVE, and CRC CHECK.
• CRC Error Detection: Integrated CRC-5 (polynomial x⁴ + x) and CRC-8 validation, start bit framing ('00' normal byte, '01' last byte), noise injection simulations, and format error recovery.
• Physical Synthesis: Mapped to 1,086 nets, 832 leaf cells, and 400 RTL cells utilizing Xilinx C5LUTs, CLBs, clock regions (X0Y3..X1Y3), and RPM grid coordinates.
• Open-Source & Public: The full VHDL source code, testbenches, and synthesis reports are public on GitHub and showcased on this portfolio!`;
    }

    // Reaction time specific query
    if (q.includes('reaction time') || q.includes('latency') || q.includes('12') || q.includes('speed') || q.includes('jitter')) {
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

    // Resignation and active job search query
    if (q.includes('role') || q.includes('open') || q.includes('job') || q.includes('opportunit') || q.includes('availab') || q.includes('hire') || q.includes('resign') || q.includes('seeking')) {
      return `Jeevan is actively open and exploring full-time engineering and specialist opportunities across Germany with immediate availability.

Target Positions:
• IT Specialist / Systems Engineer
• Observability & Site Reliability / Telemetry Engineer
• Artificial Intelligence / Machine Learning Engineer
• Cloud & DevOps Engineer / Linux Infrastructure Specialist
• Full-Stack IoT & Data Solutions Developer

Professional Profile Summary:
• Location: Based in Hamburg, Germany (Available for on-site roles in Hamburg / Lower Saxony, hybrid models across Germany, or remote).
• Work Authorization: Full, unrestricted German work authorization.
• Availability: Immediate.
• Languages: Fluent English, Professional German.
• Education: Master of Science (MSc) in Informatics, Technische Universität Clausthal.

Would you like to schedule an introductory discussion or inspect his Executive Brief?`;
    }

    // Full work history query
    if (q.includes('history') || q.includes('experien') || q.includes('all jobs') || q.includes('cogent') || q.includes('radical') || q.includes('avast') || q.includes('netidentity')) {
      return `Here is a summary of Jeevan's 10+ year engineering track record across industry:

1. WaDaCon GmbH (Hamburg · May 2025 – May 2026, Full-Time):
   IT Specialist & Observability Engineer powering industrial recycling plants. Architected InfluxDB/Prometheus/Grafana pipelines, Docker CI/CD, Teleport zero-trust SSH, automated Teams alerts, and AI anomaly detection models. (Resigned · Immediate availability).

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
    if (q.includes('wadacon') || q.includes('iot') || q.includes('observability') || q.includes('grafana') || q.includes('influx') || q.includes('mrf')) {
      return `During his tenure at WaDaCon GmbH (Hamburg, Germany), Jeevan served as IT Specialist & Observability Engineer powering Next-Gen Material Recovery Facilities (MRF):

Key Production Accomplishments:
• Industrial Telemetry Stack: Architected InfluxDB + Prometheus + Grafana monitoring high-frequency sensor streams from recycling machinery.
• Rapid Incident Mitigation: Reduced critical incident detection & resolution times by over 60% through automated webhook alerts into Microsoft Teams.
• Edge Infrastructure: Implemented zero-trust Teleport SSH for secure remote plant management and Dockerized microservices that accelerated software rollouts by 35%.
• Predictive AI: Integrated time-series machine learning to flag equipment wear up to 72 hours before failure.
• REST Services & Administration: Developed Python (Flask/Django) APIs and performed Linux system administration and network troubleshooting.

Having completed all handovers, Jeevan is now open to new engineering opportunities with immediate availability.`;
    }

    // Certifications query
    if (q.includes('certif') || q.includes('credential') || q.includes('claude') || q.includes('microsoft') || q.includes('accenture')) {
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
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('linkedin') || q.includes('interview') || q.includes('reach')) {
      return `You can reach Jeevan directly for job inquiries or interviews:

• Email: jeevannaidu516@gmail.com
• Phone: +49 176 36369761
• LinkedIn: linkedin.com/in/jeevan-dutta
• GitHub: github.com/jeevan516
• Portfolio: jeevan516.github.io/jeevan-Dutta/

You can also use the 'Hire / Interview Jeevan' button on this page to log an opportunity directly into his tracker!`;
    }

    // Skills query
    if (q.includes('skill') || q.includes('stack') || q.includes('python') || q.includes('docker') || q.includes('tools')) {
      return `Jeevan's comprehensive technical toolkit includes:

• Distributed Systems & Hardware: VHDL, Xilinx Vivado (2020.2), FPGA Synthesis, RS-485 / EIA-485, PLC Communication, Finite State Machines (FSM), CRC Error Detection.
• Observability & DevOps: Grafana, Prometheus, InfluxDB, Webhook Automation, Docker, Linux (Ubuntu/Debian), Teleport Zero-Trust, CI/CD Pipelines.
• AI & Machine Learning: Python, PyTorch, TensorFlow, Scikit-Learn, Time-Series Anomaly Detection, FastAPI, Google Gemini API, Claude API, RAG.
• Data & Analytics: SQL, PostgreSQL, SQLAlchemy ORM, Power BI, DAX modeling.`;
    }

    // Default response
    return `Thank you for asking! This is Jeevan's Bot. Jeevan has recently resigned from WaDaCon GmbH and is actively looking for his next job as an IT Specialist or AI Engineer in Germany (immediate availability).

Feel free to ask about his attached Master's Thesis under Prof. Dr. Christian Siemers (4-Node ZanderLink Network in VHDL/Vivado), his WaDaCon achievements, verified certifications, or click below to schedule an interview!`;
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

    setTimeout(() => {
      const answer = generateAnswer(query);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: answer,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            id="chatbot-launcher-btn"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-bold text-sm shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-slate-950" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-slate-950 animate-pulse" />
              )}
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <span className="block text-xs font-extrabold uppercase tracking-wider">
                This is Jeevan's Bot
              </span>
              <span className="text-[10px] font-mono text-slate-900 font-semibold">
                Status: Available for New Role · IT & AI Assistant
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Minimized Dock Bar */}
      {isOpen && isMinimized && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-emerald-500/50 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
            <button
              onClick={() => setIsMinimized(false)}
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left group"
              title="Click to restore Jeevan's Bot"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white font-display">This is Jeevan's Bot</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-700/60">
                    Available for New Role
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">Click to restore chat window</p>
              </div>
            </button>

            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={() => setIsMinimized(false)}
                title="Restore Window"
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsMinimized(false);
                  setIsMaximized(true);
                }}
                title="Maximize Full View"
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                title="Close Chatbot"
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window Dialog */}
      {isOpen && !isMinimized && (
        <div 
          className={`fixed z-50 rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden duration-200 ${
            isMaximized 
              ? 'inset-2 sm:inset-6 max-w-6xl mx-auto shadow-emerald-500/10' 
              : 'bottom-4 right-4 w-[95vw] sm:w-[440px] h-[600px] max-h-[90vh]'
          }`}
        >
          
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white font-display truncate">
                    This is Jeevan's Bot
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Available for New Role
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-mono truncate">
                  IT Specialist & AI Engineer · Immediate Availability (Germany)
                </p>
              </div>
            </div>

            {/* Window Control Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Minimize Button */}
              <button
                id="chatbot-minimize-btn"
                onClick={() => setIsMinimized(true)}
                title="Minimize window"
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              {/* Maximize / Restore Button */}
              <button
                id="chatbot-maximize-btn"
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? "Restore default size" : "Maximize window"}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Close Button */}
              <button
                id="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[84%] p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-medium rounded-tr-sm shadow-md'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Prompts Carousel */}
          <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                id="chatbot-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about Jeevan's skills, VLSI, WaDaCon..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Action Footer */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900 text-[10px] text-slate-400">
              <button
                onClick={onOpenContact}
                className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Mail className="w-3 h-3" />
                Schedule Interview / Contact Jeevan
              </button>

              <button
                onClick={handleCopyEmail}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedEmail ? 'Email Copied!' : 'Copy Email'}
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
