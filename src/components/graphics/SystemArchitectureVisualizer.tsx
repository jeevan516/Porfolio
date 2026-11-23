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
    <div className="rounded-2xl bg-bg/80 border border-line overflow-hidden">
      {/* Top Controller Header */}
      <div className="px-4 sm:px-5 py-3 border-b border-line flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-danger/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent/80" />
          </div>
          <span className="text-xs font-semibold text-fg">WaDaCon MRF telemetry stack</span>
        </div>

        {/* View Switcher */}
        <div role="tablist" aria-label="Stack views" className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-line text-xs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'architecture'}
            onClick={() => setActiveTab('architecture')}
            className={`px-2.5 py-1 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 ${
              activeTab === 'architecture'
                ? 'bg-surface-2 text-fg font-semibold border-line-strong'
                : 'text-muted hover:text-fg border-transparent'
            }`}
          >
            System Map
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'telemetry'}
            onClick={() => setActiveTab('telemetry')}
            className={`px-2.5 py-1 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 ${
              activeTab === 'telemetry'
                ? 'bg-surface-2 text-fg font-semibold border-line-strong'
                : 'text-muted hover:text-fg border-transparent'
            }`}
          >
            Live Vitals
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'terminal'}
            onClick={() => setActiveTab('terminal')}
            className={`px-2.5 py-1 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 ${
              activeTab === 'terminal'
                ? 'bg-surface-2 text-fg font-semibold border-line-strong'
                : 'text-muted hover:text-fg border-transparent'
            }`}
          >
            CLI Output
          </button>
        </div>
      </div>

      {/* Main Body Depending on Tab */}
      <div className="p-4 sm:p-5" role="tabpanel">
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 text-xs text-muted">
              <span className="flex items-center gap-1.5 text-accent-fg font-medium">
                <Radio className="w-3.5 h-3.5" aria-hidden="true" />
                Industrial topology
              </span>
              <span className="text-subtle">Select a node</span>
            </div>

            {/* Architecture Node Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
              {nodes.map((node) => {
                const isSelected = selectedNode === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedNode(node.id)}
                    className={`p-3 rounded-xl border text-left transition-colors min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 ${
                      isSelected
                        ? 'bg-surface border-accent/60'
                        : 'bg-surface/50 border-line/80 hover:border-line-strong hover:bg-surface/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-fg text-xs truncate">
                        {node.name}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-accent-fg bg-accent-soft/80 px-1.5 py-0.5 rounded border border-accent/50 shrink-0">
                        {node.metric}
                      </span>
                    </div>
                    <p className="text-xs text-muted line-clamp-2 leading-relaxed font-sans">
                      {node.detail}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Node Deep Inspector */}
            {selectedNode && (
              <div className="p-3.5 rounded-xl bg-surface/80 border border-line text-xs" aria-live="polite">
                <div className="text-sm font-semibold text-fg mb-1">{nodes.find((n) => n.id === selectedNode)?.name}</div>
                <p className="text-muted text-xs leading-relaxed">
                  {nodes.find((n) => n.id === selectedNode)?.detail} Designed with zero-downtime reliability, proactive Prometheus threshold monitors, and end-to-end ownership.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'telemetry' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-surface/70 border border-line text-center">
                <div className="text-2xl font-bold font-display text-accent-fg">99.98%</div>
                <div className="text-xs font-mono text-muted mt-0.5">Pipeline Uptime</div>
              </div>
              <div className="p-4 rounded-xl bg-surface/70 border border-line text-center">
                <div className="text-2xl font-bold font-display text-teal">&gt; 60%</div>
                <div className="text-xs font-mono text-muted mt-0.5">MTTR Incident Reduction</div>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-0.5 p-2.5 rounded-xl bg-surface/50 border border-line text-muted">
                <span className="text-muted">InfluxDB Ingestion Rate:</span>
                <span className="text-accent-fg font-bold">{streamCount} data points / sec</span>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-0.5 p-2.5 rounded-xl bg-surface/50 border border-line text-muted">
                <span className="text-muted">Teleport Zero-Trust Proxy:</span>
                <span className="text-teal font-bold">Encrypted mTLS (Active)</span>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-0.5 p-2.5 rounded-xl bg-surface/50 border border-line text-muted">
                <span className="text-muted">HAProxy Load Balancer Cluster:</span>
                <span className="text-accent-fg font-bold">VIP 10.0.1.100 · 3 Nodes Active (0.4ms)</span>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-0.5 p-2.5 rounded-xl bg-surface/50 border border-line text-muted">
                <span className="text-muted">Grafana Incident Alerts:</span>
                <span className="text-info font-bold">MS Teams Webhook (Configured)</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="p-4 rounded-xl bg-black/80 border border-line font-mono text-xs space-y-3 text-muted break-words">
            <div>
              <span className="text-accent-fg">jeevan@tu-clausthal:~$</span> whoami
              <div className="text-muted pl-3 mt-0.5">
                Jeevan Dutta · MSc Informatics (TU Clausthal) · IT & AI Engineer
              </div>
            </div>

            <div>
              <span className="text-accent-fg">jeevan@tu-clausthal:~$</span> cat thesis.nfo
              <div className="text-teal pl-3 mt-0.5 text-xs leading-relaxed">
                "Definition, Development and Simulation of a 4-Node Communication Network for Reliable Reaction Times Inside Distributed Networks"
                Advisors: Prof. Dr. Christian Siemers & Prof. Dr. Sven Hartmann (Matr. 517360)
              </div>
            </div>

            <div>
              <span className="text-accent-fg">jeevan@tu-clausthal:~$</span> systemctl status career-status
              <div className="text-accent-fg pl-3 mt-0.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
                <span>ACTIVE: Available for New Role (Immediate Availability Across Germany)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
    </div>
  );
};
