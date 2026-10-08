import React, { useState } from 'react';
import { 
  Cpu, 
  GraduationCap, 
  Network, 
  Clock, 
  ShieldCheck, 
  Layers, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  Activity, 
  Terminal, 
  Sparkles,
  ExternalLink,
  Bot,
  Github,
  Globe,
  Share2,
  Code2
} from 'lucide-react';
import { MASTER_THESIS_DETAILS } from '../data/portfolioData';

interface MasterThesisSectionProps {
  onOpenChatbot?: () => void;
  onOpenContact?: () => void;
}

export const MasterThesisSection: React.FC<MasterThesisSectionProps> = ({ 
  onOpenChatbot,
  onOpenContact 
}) => {
  const [activeTab, setActiveTab] = useState<'abstract' | 'architecture' | 'timing' | 'synthesis'>('abstract');
  const [simulatedNode, setSimulatedNode] = useState<number>(0);

  const nodes = [
    { id: 0, address: '00', role: 'Master Node', payload: '0x1234', color: 'emerald', status: 'Clock Generator & Orchestrator' },
    { id: 1, address: '01', role: 'Slave Node 1', payload: '0x5678', color: 'cyan', status: 'Sensor / PLC Actuator 1' },
    { id: 2, address: '10', role: 'Slave Node 2', payload: '0x9ABC', color: 'purple', status: 'Industrial Optical Sorter' },
    { id: 3, address: '11', role: 'Slave Node 3', payload: '0xDEF0', color: 'amber', status: 'Emergency Stop / Safety Relay' },
  ];

  return (
    <section id="master-thesis" className="py-20 border-t border-slate-800/80 relative overflow-hidden bg-slate-950/60">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Master Thesis · TU Clausthal
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                MSc. Informatik Research Showcase
              </h2>
            </div>
          </div>

          {/* Supervisor pill */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-800/60 text-purple-300 text-xs font-mono">
              <span className="text-slate-400">1st Examiner:</span> <strong className="text-white">Prof. Dr. Christian Siemers</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
              <span className="text-slate-400">2nd Examiner:</span> <strong className="text-white">Prof. Dr. Sven Hartmann</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono">
              Submitted: <strong>27.07.2023</strong>
            </div>
          </div>
        </div>

        {/* Hero Thesis Title Block */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-purple-500/30 shadow-2xl backdrop-blur-md">
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700/50 text-[11px] font-mono text-purple-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Institute of Informatics · Matriculation #517360</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white tracking-tight leading-snug">
              {MASTER_THESIS_DETAILS.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Researched, developed, and simulated a high-performance synchronous serial communication network based on the <strong className="text-white">ZanderLink protocol</strong> for distributed Programmable Logic Controllers (PLCs) on <strong className="text-white">Xilinx FPGAs via VHDL</strong>. Achieved deterministic, zero-jitter sub-12µs system reaction times across a multi-node bus architecture.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">Guaranteed Reaction</div>
                <div className="text-2xl font-bold font-display text-emerald-400">&lt; 12 µs</div>
                <div className="text-[10px] text-slate-500 font-mono">9.75µs roundtrip + delays</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">Topology & Nodes</div>
                <div className="text-2xl font-bold font-display text-cyan-400">4-Node Bus</div>
                <div className="text-[10px] text-slate-500 font-mono">1 Master + 3 Slaves (RS-485)</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">Jitter Determinism</div>
                <div className="text-2xl font-bold font-display text-purple-400">Mission Jitter 0</div>
                <div className="text-[10px] text-slate-500 font-mono">FPGA hardware state logic</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">FPGA Netlist</div>
                <div className="text-2xl font-bold font-display text-amber-400">1086 Nets</div>
                <div className="text-[10px] text-slate-500 font-mono">832 Leaf Cells in Vivado 2020.2</div>
              </div>
            </div>

            {/* Public GitHub Repository & Open Publication Banner */}
            <div className="mt-5 pt-5 border-t border-purple-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-700/60 flex items-center justify-center text-purple-300 shrink-0">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                      Published Research & Open-Source Artifacts
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Public Access
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    VHDL code entities, Xilinx Vivado testbenches, timing constraint files, and thesis simulation traces are open and publicly accessible on GitHub.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
                <a
                  href="https://github.com/jeevan516/4-node-communication-network-master-thesis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-semibold text-xs border border-slate-700 hover:border-purple-500 transition-all shadow-md group"
                >
                  <Github className="w-4 h-4 text-slate-300 group-hover:text-white" />
                  <span>View on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </a>

                <a
                  href="https://jeevan516.github.io/jeevan-Dutta/#master-thesis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-semibold text-xs transition-all shadow-lg shadow-purple-600/30"
                >
                  <Globe className="w-4 h-4" />
                  <span>Public Live Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive 4-Node Communication Visualizer */}
        <div className="mb-12 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                <Activity className="w-4 h-4" />
                Interactive 4-Node ZanderLink Network Simulator
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulating round-robin broadcast and clock-synchronized EIA-485 transmission sequence
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Click node to inspect:</span>
              <div className="flex gap-1">
                {nodes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setSimulatedNode(n.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      simulatedNode === n.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 scale-105'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Node {n.id} ({n.address})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4-Node Architecture Map */}
          <div className="relative p-6 rounded-2xl bg-slate-950/90 border border-slate-800/80 overflow-x-auto">
            {/* Bus Cable Line */}
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 via-purple-500 to-amber-500 -translate-y-1/2 rounded-full opacity-60 hidden md:block" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {nodes.map((node) => {
                const isSelected = simulatedNode === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSimulatedNode(node.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/20 shadow-xl shadow-cyan-500/10 scale-102'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        node.id === 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        ADDR: "{node.address}"
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {node.id === 0 ? 'Master' : `Slave ${node.id}`}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-display text-white">
                      {node.role}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {node.status}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Test Vector:</span>
                      <span className="font-bold text-cyan-400">{node.payload}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Node Deep-Dive Drawer */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span>
                  <strong className="text-white font-mono">Inspecting Node {simulatedNode} (Address {nodes[simulatedNode].address}):</strong>{' '}
                  {nodes[simulatedNode].role} handles synchronized serial communication over EIA-485 via VHDL state machine with CRC-5 error detection.
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <span>FSM State: <strong className="text-emerald-400">SCAN / ACTIVE</strong></span>
                <span>·</span>
                <span>Clock Source: <strong className="text-cyan-400">{simulatedNode === 0 ? 'Divided Master CLK' : 'CLK_485_IN'}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Deep-Dive Sections */}
        <div className="space-y-6">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <button
              onClick={() => setActiveTab('abstract')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'abstract'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              Abstract & Context
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'architecture'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Network className="w-4 h-4" />
              Protocol & FSM State Machines
            </button>

            <button
              onClick={() => setActiveTab('timing')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'timing'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              Deterministic Timing (&lt;12 µs)
            </button>

            <button
              onClick={() => setActiveTab('synthesis')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'synthesis'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Vivado RTL & Synthesis Netlist
            </button>
          </div>

          {/* Tab 1: Abstract & Problem */}
          {activeTab === 'abstract' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <h3 className="text-lg font-bold font-display text-white">
                    Research Abstract & Motivation
                  </h3>
                  <p>
                    {MASTER_THESIS_DETAILS.abstract}
                  </p>
                  <p>
                    Traditional Ethernet II networks rely on intermediate switches and network interface controllers (NICs) with non-deterministic queuing, buffering, and variable packet flight times. In mission-critical automation (such as fast-reacting industrial PLCs, emergency cut-offs, or optical sorting lines), even minor jitter can lead to synchronization failures.
                  </p>
                  <p>
                    By implementing the entire communication protocol as an independent parallel logic directly inside an FPGA (Field-Programmable Gate Array), ZanderLink achieves <strong className="text-white">absolute determinism in execution times</strong>. Communication through other FPGA-programmed logic (such as the user's PLC application) remains completely unaffected in terms of timing, achieving the academic initiative known as <strong className="text-purple-400">"Mission Jitter Zero"</strong>.
                  </p>

                  <div className="pt-2">
                    <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400 mb-2">
                      Acknowledgement from Thesis Preface:
                    </h4>
                    <blockquote className="p-4 rounded-xl bg-purple-950/30 border-l-4 border-purple-500 italic text-slate-300 text-xs">
                      "I would especially like to thank my main supervisor, <strong>Prof. Dr. Christian Siemers</strong>, who has been a very solid and inspiring guide for me all along... With his magic touch, he has helped me focus on the common thread between the often-difficult tasks. He stayed very calm and focused, which has helped me a lot not to stray from the main topic."
                    </blockquote>
                  </div>
                </div>

                {/* Sidebar Quick Highlights */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 text-xs">
                  <h4 className="font-bold text-white font-display flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Thesis Specifications
                  </h4>
                  <ul className="space-y-2.5 text-slate-300">
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">Degree:</span>
                      <span className="font-mono text-white">MSc. Informatik</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">University:</span>
                      <span className="font-mono text-white">TU Clausthal</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">First Examiner:</span>
                      <span className="font-mono text-purple-300">Prof. Dr. C. Siemers</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">Second Examiner:</span>
                      <span className="font-mono text-slate-300">Prof. Dr. S. Hartmann</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">Matriculation No:</span>
                      <span className="font-mono text-slate-300">517360</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">Protocol:</span>
                      <span className="font-mono text-cyan-400">ZanderLink 4-Node</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">Physical Layer:</span>
                      <span className="font-mono text-amber-400">EIA-485 (RS-485)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-500">Simulation Tool:</span>
                      <span className="font-mono text-white">Xilinx Vivado 2020.2</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Protocol & FSM Architecture */}
          {activeTab === 'architecture' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display text-white">
                  ZanderLink Frame Format & Finite State Machine (FSM)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Unlike traditional asynchronous serial protocols using start/stop bits with arbitrary gaps, ZanderLink operates synchronously on a fixed time sequence with 2 start bits: <code className="text-cyan-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">'00'</code> for standard payload frames, and <code className="text-purple-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">'01'</code> for the terminal CRC byte.
                </p>
              </div>

              {/* Protocol Frame Format Diagram */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
                  Frame Format (First Byte, Mid Bytes & Last Byte):
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                  {/* First Byte */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-cyan-400 font-bold">Byte 1: Header & Address</div>
                    <div className="flex gap-1 text-[10px] text-center">
                      <div className="p-1.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800 flex-1">Start (00)</div>
                      <div className="p-1.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800 flex-1">Addr (A0 A1)</div>
                      <div className="p-1.5 bg-slate-800 text-slate-200 rounded border border-slate-700 flex-[2]">8 Data Bits (LSB)</div>
                    </div>
                    <p className="text-[11px] text-slate-400">Contains 2-bit sender address identifying one of 4 participants.</p>
                  </div>

                  {/* Mid Bytes */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-purple-400 font-bold">Mid Bytes: Payload</div>
                    <div className="flex gap-1 text-[10px] text-center">
                      <div className="p-1.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800 flex-1">Start (00)</div>
                      <div className="p-1.5 bg-slate-800 text-slate-200 rounded border border-slate-700 flex-[3]">8 Data Bits (LSB first)</div>
                    </div>
                    <p className="text-[11px] text-slate-400">Consecutive payload bytes synchronized across the common bus clock.</p>
                  </div>

                  {/* Last Byte */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-amber-400 font-bold">Last Byte: CRC & Validation</div>
                    <div className="flex gap-1 text-[10px] text-center">
                      <div className="p-1.5 bg-purple-950 text-purple-300 rounded border border-purple-800 flex-1">Start (01)</div>
                      <div className="p-1.5 bg-amber-950 text-amber-300 rounded border border-amber-800 flex-[2]">CRC-5 Checksum</div>
                    </div>
                    <p className="text-[11px] text-slate-400">Start combination '01' signals terminal frame followed by polynomial validation.</p>
                  </div>
                </div>
              </div>

              {/* FSM State Transition Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    Master State Machine (FSM_Master)
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Operates in 4 sequential states: <strong className="text-white">SCAN</strong> (monitors bus for reception start bit '0'), <strong className="text-white">TRANSMIT</strong> (transmits data with start bit and 2-bit ID on timeout), <strong className="text-white">RECEIVE</strong> (accumulates serial stream on clock edge), and <strong className="text-white">CRC CHECK</strong> (validates polynomial integrity before latching data).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    Slave State Machine (FSM_Slave)
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Monitors the shared line. Upon detecting a start bit, transitions to <strong className="text-white">RECEIVE</strong>, executes <strong className="text-white">CRC CHECK</strong>, verifies the source address, and transitions to <strong className="text-white">TRANSMIT</strong> to broadcast its response (Master 0x1234 → Slave1 0x5678 → Slave2 0x9ABC → Slave3 0xDEF0).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Timing & Determinism Benchmark */}
          {activeTab === 'timing' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display text-white">
                  Deterministic Reaction Time Analysis: Under 12 µs
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  In distributed industrial control, reaction time guarantees are paramount. Section 2.7 ("Simultaneity Via ZanderLink") details the exact mathematical model proving reaction time determinism at 16 Mbit/s:
                </p>
              </div>

              {/* Formula & Calculation Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 font-mono text-xs space-y-4">
                <div className="text-emerald-400 font-bold uppercase tracking-wider">
                  Bit-Budget per Station Roundtrip:
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Data Bytes:</div>
                    <div className="text-white font-bold text-sm">8 bits + 2 start bits</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Station Identifier:</div>
                    <div className="text-white font-bold text-sm">2 bits (address)</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Terminal Byte:</div>
                    <div className="text-white font-bold text-sm">10 bits (CRC+ACK)</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Total Per Node:</div>
                    <div className="text-emerald-400 font-bold text-sm">52 bits / station</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-slate-300">
                  <div className="font-bold text-white">System Roundtrip Calculation (3 Connected Controllers):</div>
                  <div className="text-emerald-300 font-semibold">
                    156 bits total ÷ 16 Mbit/s bus speed = 9.75 µs Roundtrip Time
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    + 1.0 µs controller computation time + 1.0 µs output driver propagation delay = <strong className="text-white">11.75 µs Guaranteed Reaction Time</strong> across distributed PLCs.
                  </div>
                </div>
              </div>

              {/* Noise Injection and Fault-Tolerance */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Fault-Tolerance & Simulated Error Injection:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-1">XOR Noise Injection:</strong>
                    Tested with simulated transmission noise vector (Figure 36) to verify CRC-5 error tripping without corrupting application state.
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-1">Delayed Start Bit:</strong>
                    Simulated delayed start bits ('01' resume) in Vivado to confirm that slave nodes handle transmission jitter gracefully.
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-1">Early Start Bit Trapping:</strong>
                    Simulated early pulse inputs; confirmed that the FSM exits to <code className="text-cyan-300">format_error</code> and resets cleanly to SCAN state.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Vivado RTL & Synthesis Netlist */}
          {activeTab === 'synthesis' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display text-white">
                  Xilinx Vivado (2020.2) RTL Analysis & Synthesized FPGA Netlist
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Sections 7 and 8 of the thesis document the detailed physical synthesis targeting Xilinx FPGA architecture, translating VHDL behavioral descriptions into low-level look-up tables (LUTs), Configurable Logic Blocks (CLBs), and dedicated clock trees.
                </p>
              </div>

              {/* Netlist Stats Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500">RTL Flattened Cells</div>
                  <div className="text-2xl font-bold text-white mt-1">400</div>
                  <div className="text-[10px] text-slate-400">29 I/O ports · 1306 nets</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500">Synthesized Nets</div>
                  <div className="text-2xl font-bold text-cyan-400 mt-1">1,086</div>
                  <div className="text-[10px] text-slate-400">Post-synthesis interconnects</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500">Synthesized Leaf Cells</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">832</div>
                  <div className="text-[10px] text-slate-400">Mapped to physical FPGA logic</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500">Clock Regions</div>
                  <div className="text-2xl font-bold text-purple-400 mt-1">8 Regions</div>
                  <div className="text-[10px] text-slate-400">X0Y0 to X1Y3 (low skew)</div>
                </div>
              </div>

              {/* FPGA Primitive Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-white font-mono uppercase tracking-wider">
                  Hardware Elements & Xilinx Architectures Used:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <strong className="text-cyan-400 block mb-1">C5LUT (5-Input LUT):</strong>
                    Stores and decodes 32 input combinations to implement fast combinatorial error checking and FSM state transition logic.
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <strong className="text-emerald-400 block mb-1">CLB & Slice Layout:</strong>
                    Placed in dedicated slices (e.g. SLICE_X45Y66 with CARRY4 logic, 18 BEL pins) for minimum propagation delay.
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <strong className="text-purple-400 block mb-1">RPM Grid (RLOC):</strong>
                    Used Relationally Placed Macro (RPM) grid coordinates (slice X38Y98) to enforce exact physical placement and eliminate clock skew.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Callout Bar */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-cyan-950/70 border border-purple-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Have questions about Jeevan's thesis or FPGA hardware expertise?
              </h4>
              <p className="text-xs text-slate-400">
                Ask Jeevan's Bot for real-time explanations, or contact Jeevan directly for job interviews.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenChatbot && (
              <button
                onClick={onOpenChatbot}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all"
              >
                Ask This is Jeevan's Bot
              </button>
            )}
            {onOpenContact && (
              <button
                onClick={onOpenContact}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                Hire / Interview Jeevan
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
