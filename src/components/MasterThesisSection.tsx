import React, { useState } from 'react';
import { Cpu, GraduationCap, Network, Clock, ShieldCheck, FileText, Activity, ExternalLink, Bot, Github, Link2, Check, Code2 } from 'lucide-react';
import { MASTER_THESIS_DETAILS } from '../data/portfolioData';

interface MasterThesisSectionProps {
  onOpenChatbot?: () => void;
  onOpenContact?: () => void;
}

type ThesisTab = 'abstract' | 'architecture' | 'timing' | 'synthesis';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60';

const TABS: { id: ThesisTab; label: string; icon: React.ElementType }[] = [
  { id: 'abstract', label: 'Abstract', icon: FileText },
  { id: 'architecture', label: 'Protocol & FSM', icon: Network },
  { id: 'timing', label: 'Timing (<12 µs)', icon: Clock },
  { id: 'synthesis', label: 'RTL & Synthesis', icon: Cpu },
];

export const MasterThesisSection: React.FC<MasterThesisSectionProps> = ({ onOpenChatbot, onOpenContact }) => {
  const [activeTab, setActiveTab] = useState<ThesisTab>('abstract');
  const [simulatedNode, setSimulatedNode] = useState<number>(0);
  const [linkCopied, setLinkCopied] = useState(false);

  const nodes = [
    { id: 0, address: '00', role: 'Master Node', payload: '0x1234', status: 'Clock Generator & Orchestrator' },
    { id: 1, address: '01', role: 'Slave Node 1', payload: '0x5678', status: 'Sensor / PLC Actuator 1' },
    { id: 2, address: '10', role: 'Slave Node 2', payload: '0x9ABC', status: 'Industrial Optical Sorter' },
    { id: 3, address: '11', role: 'Slave Node 3', payload: '0xDEF0', status: 'Emergency Stop / Safety Relay' },
  ];

  /** Share a deep link to this section (native share sheet when available, otherwise copy to clipboard). */
  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#master-thesis`;
    try {
      if (navigator.share) {
        await navigator.share({ title: MASTER_THESIS_DETAILS.title, url });
        return;
      }
    } catch {
      // User cancelled the share sheet – fall through to copying.
    }
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      window.location.hash = 'master-thesis';
    }
  };

  const metrics = [
    { label: 'Guaranteed reaction', value: '< 12 µs', sub: '9.75 µs roundtrip + delays', color: 'text-emerald-400' },
    { label: 'Topology', value: '4-Node Bus', sub: '1 Master + 3 Slaves (RS-485)', color: 'text-cyan-400' },
    { label: 'Jitter', value: '0', sub: 'FPGA hardware state logic', color: 'text-purple-400' },
    { label: 'FPGA netlist', value: '1,086 Nets', sub: '832 leaf cells · Vivado 2020.2', color: 'text-amber-400' },
  ];

  return (
    <section id="master-thesis" className="py-16 sm:py-20 border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider mb-3">
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
              Master Thesis · TU Clausthal
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">MSc Informatik Research</h2>
          </div>
          <dl className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <div>
              <dt className="text-slate-500">1st examiner</dt>
              <dd className="text-white font-medium">{MASTER_THESIS_DETAILS.firstExaminer}</dd>
            </div>
            <div>
              <dt className="text-slate-500">2nd examiner</dt>
              <dd className="text-white font-medium">{MASTER_THESIS_DETAILS.secondExaminer}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Submitted</dt>
              <dd className="text-emerald-400 font-mono font-medium">{MASTER_THESIS_DETAILS.submissionDate}</dd>
            </div>
          </dl>
        </div>

        {/* Thesis Title Block */}
        <div className="mb-10 p-5 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="max-w-4xl space-y-4">
            <p className="text-xs text-slate-400">Institute of Informatics · Matriculation #{MASTER_THESIS_DETAILS.matriculationNumber}</p>

            <h3 className="text-xl sm:text-3xl font-bold font-display text-white tracking-tight leading-snug">
              {MASTER_THESIS_DETAILS.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Researched, developed, and simulated a high-performance synchronous serial communication network based on the{' '}
              <strong className="text-white">ZanderLink protocol</strong> for distributed Programmable Logic Controllers (PLCs) on{' '}
              <strong className="text-white">Xilinx FPGAs via VHDL</strong>. Achieved deterministic, zero-jitter sub-12µs system reaction
              times across a multi-node bus architecture.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6">
            {metrics.map((m) => (
              <div key={m.label} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 min-w-0">
                <div className="text-xs text-slate-400">{m.label}</div>
                <div className={`text-xl sm:text-2xl font-bold font-display ${m.color}`}>{m.value}</div>
                <div className="text-[10px] text-slate-500 font-mono truncate" title={m.sub}>
                  {m.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Repository links */}
          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Code2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-slate-300">
                VHDL entities, Vivado testbenches, timing constraints and simulation traces were developed in Xilinx Vivado 2020.2.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleShare}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-300 font-semibold text-xs transition-colors ${focusRing}`}
              >
                {linkCopied ? <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> : <Link2 className="w-4 h-4" aria-hidden="true" />}
                {linkCopied ? 'Link copied' : 'Share link'}
              </button>
              <span aria-live="polite" className="sr-only">
                {linkCopied ? 'Link copied to clipboard' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive 4-Node Communication Visualizer */}
        <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold font-display text-white">
              <Activity className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              4-Node ZanderLink network
            </h3>
            <p className="text-xs text-slate-400 mt-1">Select a node to inspect its role in the clock-synchronized EIA-485 sequence.</p>
          </div>

          <div className="relative p-4 sm:p-6 rounded-xl bg-slate-950/70 border border-slate-800">
            {/* Bus line */}
            <div
              aria-hidden="true"
              className="absolute top-[calc(50%-2.5rem)] left-8 right-8 h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500 rounded-full opacity-50 hidden md:block"
            />

            <div role="radiogroup" aria-label="ZanderLink nodes" className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
              {nodes.map((node) => {
                const isSelected = simulatedNode === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSimulatedNode(node.id)}
                    className={`text-left p-3 sm:p-4 rounded-xl border transition-colors duration-200 min-w-0 ${focusRing} ${
                      isSelected ? 'bg-slate-900 border-emerald-400/70' : 'bg-slate-900/60 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          isSelected ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {node.address}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{node.payload}</span>
                    </div>
                    <div className="text-sm font-bold font-display text-white">{node.role}</div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{node.status}</p>
                  </button>
                );
              })}
            </div>

            <div aria-live="polite" className="mt-4 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <p>
                <strong className="text-white">
                  Node {simulatedNode} · address {nodes[simulatedNode].address}
                </strong>{' '}
                — {nodes[simulatedNode].role} handles synchronized serial communication over EIA-485 via a VHDL state machine with CRC-5 error
                detection.
              </p>
              <p className="font-mono text-[11px] text-slate-400">
                Clock source: <span className="text-emerald-400">{simulatedNode === 0 ? 'Divided Master CLK' : 'CLK_485_IN'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabbed Deep-Dive Sections */}
        <div className="space-y-5">
          <div role="tablist" aria-label="Thesis details" className="flex flex-wrap gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`thesis-tab-${tab.id}`}
                  aria-selected={active}
                  aria-controls="thesis-tabpanel"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${focusRing} ${
                    active ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : ''}`} aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div id="thesis-tabpanel" role="tabpanel" aria-labelledby={`thesis-tab-${activeTab}`}>
          {/* Tab 1: Abstract & Problem */}
          {activeTab === 'abstract' && (
            <div className="p-5 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
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
                    <li className="flex justify-between gap-3 border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">Degree:</span>
                      <span className="font-mono text-white">MSc. Informatik</span>
                    </li>
                    <li className="flex justify-between gap-3 border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">University:</span>
                      <span className="font-mono text-white">TU Clausthal</span>
                    </li>
                    <li className="flex justify-between gap-3 border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">First Examiner:</span>
                      <span className="font-mono text-purple-300">Prof. Dr. C. Siemers</span>
                    </li>
                    <li className="flex justify-between gap-3 border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">Second Examiner:</span>
                      <span className="font-mono text-slate-300">Prof. Dr. S. Hartmann</span>
                    </li>
                    <li className="flex justify-between gap-3 border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">Matriculation No:</span>
                      <span className="font-mono text-slate-300">517360</span>
                    </li>
                    <li className="flex justify-between gap-3 border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">Protocol:</span>
                      <span className="font-mono text-cyan-400">ZanderLink 4-Node</span>
                    </li>
                    <li className="flex justify-between gap-3 border-b border-slate-800 pb-1.5">
                      <span className="text-slate-500">Physical Layer:</span>
                      <span className="font-mono text-amber-400">EIA-485 (RS-485)</span>
                    </li>
                    <li className="flex justify-between gap-3">
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
            <div className="p-5 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
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
            <div className="p-5 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
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
            <div className="p-5 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
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
        </div>

        {/* Call to action */}
        {(onOpenChatbot || onOpenContact) && (
          <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bot className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Questions about the thesis or FPGA work?</h4>
                <p className="text-xs text-slate-400">Get in touch to discuss the research or an interview.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onOpenContact && (
                <button
                  type="button"
                  onClick={onOpenContact}
                  className={`px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors ${focusRing}`}
                >
                  Contact Jeevan
                </button>
              )}
              {onOpenChatbot && (
                <button
                  type="button"
                  onClick={onOpenChatbot}
                  className={`px-4 py-2 rounded-xl border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-300 font-semibold text-xs transition-colors ${focusRing}`}
                >
                  Ask Jeevan's Bot
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
