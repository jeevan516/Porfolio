import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Database, 
  Server, 
  Cpu, 
  ShieldCheck, 
  Terminal, 
  Radio, 
  Lock, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface PipelineNode {
  id: string;
  name: string;
  category: 'ingest' | 'metrics' | 'security' | 'ai' | 'deploy' | 'load-balancer';
  status: 'active' | 'nominal' | 'secured';
  metric: string;
  detail: string;
}

export const SystemArchitectureVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'telemetry' | 'terminal'>('architecture');
  const [selectedNode, setSelectedNode] = useState<string>('load-balancer-ha');
  const [streamCount, setStreamCount] = useState<number>(1420);
  const [pulseActive, setPulseActive] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setStreamCount((prev) => prev + Math.floor(Math.random() * 12) + 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const nodes: PipelineNode[] = [
    {
      id: 'sensor-edge',
      name: 'MRF Industrial Edge',
      category: 'ingest',
      status: 'active',
      metric: `${streamCount} pts/sec`,
      detail: 'Optical sorters, acoustic sensors & rotor vibration probes'
    },
    {
      id: 'teleport-tunnel',
      name: 'Teleport Zero-Trust Tunnel',
      category: 'security',
      status: 'secured',
      metric: 'mTLS Encrypted',
      detail: 'Hardened edge-to-cloud proxy eliminating perimeter exposures'
    },
    {
      id: 'load-balancer-ha',
      name: 'Dual HAProxy Load Balancers',
      category: 'load-balancer',
      status: 'active',
      metric: '0.4ms Round-Robin (HA)',
      detail: 'Redundant L4/L7 load balancers with Keepalived VRRP virtual IP failover & active health checks'
    },
    {
      id: 'influx-db',
      name: 'InfluxDB Time-Series',
      category: 'ingest',
      status: 'active',
      metric: '99.98% Ingestion',
      detail: 'High-frequency telemetry storage with automated retention'
    },
    {
      id: 'prometheus-stack',
      name: 'Prometheus & Alertmanager',
      category: 'metrics',
      status: 'nominal',
      metric: '14ms Scrape Latency',
      detail: 'Exporters & threshold triggers with instant MS Teams alerts'
    },
    {
      id: 'ai-core',
      name: 'AI Anomaly Predictor',
      category: 'ai',
      status: 'active',
      metric: '98.4% Precision',
      detail: 'Spatial-temporal sequence models detecting mechanical faults'
    },
    {
      id: 'docker-cicd',
      name: 'Dockerized CI/CD',
      category: 'deploy',
      status: 'nominal',
      metric: '60% Faster Cycles',
      detail: 'Automated container build, test, and zero-downtime releases'
    }
  ];

  return (
    <div className="rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Top Controller Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-200">
            WaDaCon MRF Telemetry & IT Stack
          </span>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'architecture'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            System Map
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'telemetry'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Vitals
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'terminal'
                ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CLI Output
          </button>
        </div>
      </div>

      {/* Main Body Depending on Tab */}
      <div className="p-5">
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Live Industrial Topology
              </span>
              <span>Click node to inspect</span>
            </div>

            {/* Architecture Node Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
              {nodes.map((node) => {
                const isSelected = selectedNode === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900/95 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-200 text-xs truncate">
                        {node.name}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {node.metric}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                      {node.detail}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Node Deep Inspector */}
            {selectedNode && (
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                    Node Configuration & Ownership:
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Jeevan Dutta · Lead Engineer</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {nodes.find((n) => n.id === selectedNode)?.detail} Designed with zero-downtime reliability, proactive Prometheus threshold monitors, and end-to-end ownership.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'telemetry' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
                <div className="text-2xl font-bold font-display text-emerald-400">99.98%</div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">Pipeline Uptime</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
                <div className="text-2xl font-bold font-display text-cyan-400">&gt; 60%</div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">MTTR Incident Reduction</div>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-300">
                <span className="text-slate-400">InfluxDB Ingestion Rate:</span>
                <span className="text-emerald-400 font-bold">{streamCount} data points / sec</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-300">
                <span className="text-slate-400">Teleport Zero-Trust Proxy:</span>
                <span className="text-cyan-400 font-bold">Encrypted mTLS (Active)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-300">
                <span className="text-slate-400">HAProxy Load Balancer Cluster:</span>
                <span className="text-emerald-400 font-bold">VIP 10.0.1.100 · 3 Nodes Active (0.4ms)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-300">
                <span className="text-slate-400">Grafana Incident Alerts:</span>
                <span className="text-purple-300 font-bold">MS Teams Webhook (Configured)</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="p-4 rounded-2xl bg-black/80 border border-slate-800 font-mono text-xs space-y-3 text-slate-300">
            <div>
              <span className="text-emerald-400">jeevan@tu-clausthal:~$</span> whoami
              <div className="text-slate-400 pl-3 mt-0.5">
                Jeevan Dutta · MSc Informatics (TU Clausthal) · IT & AI Engineer
              </div>
            </div>

            <div>
              <span className="text-emerald-400">jeevan@tu-clausthal:~$</span> cat thesis.nfo
              <div className="text-cyan-300 pl-3 mt-0.5 text-[11px] leading-relaxed">
                "Definition, Development and Simulation of a 4-Node Communication Network for Reliable Reaction Times Inside Distributed Networks"
                Advisors: Prof. Dr. Christian Siemers & Prof. Dr. Sven Hartmann (Matr. 517360)
              </div>
            </div>

            <div>
              <span className="text-emerald-400">jeevan@tu-clausthal:~$</span> systemctl status career-status
              <div className="text-emerald-400 pl-3 mt-0.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>ACTIVE: Available for New Role (Immediate Availability Across Germany)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Production Engineering Rigor
        </span>
        <span>TU Clausthal & WaDaCon Proven</span>
      </div>
    </div>
  );
};
