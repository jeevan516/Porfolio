import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Activity, 
  Cpu, 
  Radio, 
  ArrowRight, 
  Database, 
  Server, 
  Clock, 
  ShieldCheck, 
  Zap, 
  FileCode2, 
  Binary, 
  Play, 
  Pause,
  Maximize2,
  Network,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  GitFork,
  Sliders,
  Copy,
  Check,
  Flame,
  Gauge,
  Wifi,
  RadioTower,
  Shield
} from 'lucide-react';
import { TRANSLATIONS } from '../../data/translations';

interface InteractiveArchitectureStudioProps {
  language?: 'en' | 'de';
}

export const InteractiveArchitectureStudio: React.FC<InteractiveArchitectureStudioProps> = ({ 
  language = 'en' 
}) => {
  const t = TRANSLATIONS[language]?.architecture || TRANSLATIONS.en.architecture;
  const isDe = language === 'de';

  const [selectedLayer, setSelectedLayer] = useState<'edge' | 'load-balancer' | 'telemetry' | 'ai' | 'vlsi'>('load-balancer');
  const [isSimulating, setIsSimulating] = useState(true);
  const [lbAlgorithm, setLbAlgorithm] = useState<'roundrobin' | 'weighted' | 'leastconn' | 'iphash'>('roundrobin');
  const [trafficRate, setTrafficRate] = useState<'normal' | 'high' | 'surge'>('normal');
  
  // Interactive Load Balancer node health states
  const [nodesHealth, setNodesHealth] = useState({
    node1: true,
    node2: true,
    node3: false // Hot standby backup, kicks in on failover or manual trigger
  });

  // Weights for Weighted Round Robin
  const [nodeWeights, setNodeWeights] = useState({
    node1: 100,
    node2: 100,
    node3: 50
  });

  // Dynamic connection counts
  const [nodeConns, setNodeConns] = useState({
    node1: 142,
    node2: 139,
    node3: 0
  });
  
  const [simulatedRequests, setSimulatedRequests] = useState(24580);
  const [activeRoutingNode, setActiveRoutingNode] = useState<1 | 2 | 3>(1);
  const [copiedConfig, setCopiedConfig] = useState<string | null>(null);
  const [activeConfigTab, setActiveConfigTab] = useState<'haproxy' | 'nginx' | 'keepalived'>('haproxy');

  // Traffic rate speed multiplier
  const rateMultiplier = trafficRate === 'normal' ? 1 : trafficRate === 'high' ? 3 : 8;
  const rateLabel = trafficRate === 'normal' 
    ? (isDe ? '100 Anfr./s' : '100 req/s') 
    : trafficRate === 'high' 
    ? (isDe ? '500 Anfr./s' : '500 req/s') 
    : (isDe ? '1.500 Anfr./s' : '1,500 req/s');

  useEffect(() => {
    if (!isSimulating) return;

    const intervalMs = trafficRate === 'normal' ? 900 : trafficRate === 'high' ? 450 : 220;

    const interval = setInterval(() => {
      const added = (Math.floor(Math.random() * 8) + 4) * rateMultiplier;
      setSimulatedRequests((prev) => prev + added);

      // Routing destination calculation based on algorithm and health
      setActiveRoutingNode((prev) => {
        const availableNodes: (1 | 2 | 3)[] = [];
        if (nodesHealth.node1) availableNodes.push(1);
        if (nodesHealth.node2) availableNodes.push(2);
        if (nodesHealth.node3 || (!nodesHealth.node1 && !nodesHealth.node2)) availableNodes.push(3);
        if (availableNodes.length === 0) return 1;

        if (lbAlgorithm === 'leastconn') {
          // Route to node with smallest active connection count
          let minNode = availableNodes[0];
          let minConns = Infinity;
          availableNodes.forEach((n) => {
            const c = n === 1 ? nodeConns.node1 : n === 2 ? nodeConns.node2 : nodeConns.node3;
            if (c < minConns) {
              minConns = c;
              minNode = n;
            }
          });
          return minNode;
        }

        if (lbAlgorithm === 'weighted') {
          // Weighted probability selection
          const totalWeight = availableNodes.reduce((acc, n) => {
            const w = n === 1 ? nodeWeights.node1 : n === 2 ? nodeWeights.node2 : nodeWeights.node3;
            return acc + w;
          }, 0);
          let rand = Math.random() * totalWeight;
          for (const n of availableNodes) {
            const w = n === 1 ? nodeWeights.node1 : n === 2 ? nodeWeights.node2 : nodeWeights.node3;
            if (rand <= w) return n;
            rand -= w;
          }
          return availableNodes[0];
        }

        // Standard round robin / iphash sequential alternation
        const nextIdx = (availableNodes.indexOf(prev) + 1) % availableNodes.length;
        return availableNodes[nextIdx];
      });

      // Update active connection counts dynamically
      setNodeConns(() => {
        const base = trafficRate === 'normal' ? 120 : trafficRate === 'high' ? 380 : 850;
        const jitter = () => Math.floor((Math.random() - 0.5) * 20);
        return {
          node1: nodesHealth.node1 ? Math.max(10, base + jitter()) : 0,
          node2: nodesHealth.node2 ? Math.max(10, Math.floor(base * 0.96) + jitter()) : 0,
          node3: nodesHealth.node3 || (!nodesHealth.node1 && !nodesHealth.node2) 
            ? Math.max(10, Math.floor(base * 0.8) + jitter()) 
            : 0
        };
      });

    }, intervalMs);

    return () => clearInterval(interval);
  }, [isSimulating, nodesHealth, trafficRate, lbAlgorithm, nodeWeights, rateMultiplier]);

  const toggleNodeHealth = (nodeKey: 'node1' | 'node2' | 'node3') => {
    setNodesHealth((prev) => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  const copyToClipboard = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedConfig(tabId);
    setTimeout(() => setCopiedConfig(null), 2000);
  };

  const layers = [
    {
      id: 'load-balancer',
      title: isDe ? 'Hochverfügbare Load Balancer' : 'High-Availability Load Balancers',
      subtitle: isDe ? 'HAProxy / NGINX L4 & L7 Cluster mit Keepalived' : 'Dual HAProxy / NGINX L4 & L7 Cluster',
      tag: isDe ? 'Cloud & Infrastruktur · HA-Systeme' : 'Cloud & Infrastructure · HA Systems',
      latency: '< 0.4 ms Round-Robin',
      badgeColor: 'from-blue-500 to-indigo-500',
      description: isDe 
        ? 'Redundanter Load-Balancing-Cluster mit Keepalived VRRP Virtual-IP-Failover, aktiven HTTP Layer-7 Health-Checks und gewichteter Round-Robin-Verteilung zur Weiterleitung hochfrequenter industrieller Sensordaten ohne Paketverlust.'
        : 'Redundant Load Balancing cluster with Keepalived VRRP virtual IP failover, active HTTP Layer 7 health checks, and weighted round-robin distribution to route high-frequency industrial telemetry across backend clusters with zero packet drop.',
      specs: [
        { label: isDe ? 'Algorithmen' : 'Balancing Algorithms', val: 'Round-Robin · LeastConn · IP-Hash · Weighted' },
        { label: isDe ? 'HA-Redundanz' : 'HA Redundancy', val: 'Active-Passive Keepalived VRRP' },
        { label: isDe ? 'Health-Check' : 'Health Check Probing', val: 'HTTP /healthz @ 1500ms Fall 2 Rise 3' },
        { label: isDe ? 'Max. Durchsatz' : 'Max Throughput', val: '50,000+ Conns/sec · TLS 1.3 Offload' },
      ],
      codeSnippet: `# /etc/haproxy/haproxy.cfg
global
  daemon
  maxconn 50000

frontend telemetry_gateway
  bind 10.0.1.100:443 ssl crt /etc/ssl/jeevan_mrf.pem
  mode http
  option httplog
  default_backend edge_ingestion_workers

backend edge_ingestion_workers
  balance roundrobin
  option httpchk GET /healthz
  http-check expect status 200
  server edge_worker_1 10.0.1.11:8080 check inter 1500ms fall 2 rise 3 weight 100
  server edge_worker_2 10.0.1.12:8080 check inter 1500ms fall 2 rise 3 weight 100
  server edge_worker_3 10.0.1.13:8080 check inter 1500ms fall 2 rise 3 backup`,
    },
    {
      id: 'edge',
      title: isDe ? 'Industrielle Edge-Ingestion' : 'Industrial Edge Ingestion',
      subtitle: isDe ? 'WaDaCon Next-Gen MRF Recyclinganlage' : 'WaDaCon Next-Gen MRF Recycling Facility',
      tag: isDe ? 'Industrieproduktion · WaDaCon GmbH' : 'Industry Production · WaDaCon GmbH',
      latency: isDe ? '10 ms Hochfrequenzabtastung' : '10 ms High-Frequency Sampling',
      badgeColor: 'from-emerald-500 to-teal-500',
      description: isDe
        ? 'Gehärtete IoT-Edge-Knoten und optische Sortieranlagen, die Vibrations-, Temperatur- und Pneumatikdaten über isolierte Zero-Trust Teleport-Edge-Tunnel übertragen.'
        : 'Ruggedized IoT edge nodes and optical sorting machines transmitting vibration, temperature, and pneumatic pressure metrics via isolated zero-trust Teleport edge tunnels.',
      specs: [
        { label: isDe ? 'Protokolle' : 'Protocols', val: 'Modbus-TCP · MQTT · CAN bus' },
        { label: isDe ? 'Edge-Sicherheit' : 'Edge Security', val: 'Zero-Trust Teleport SSH Tunnels' },
        { label: isDe ? 'Datenintegrität' : 'Payload Integrity', val: 'ISO 10816 Vibration Envelopes' },
        { label: isDe ? 'Verfügbarkeit' : 'Reliability Tier', val: '99.98% High Availability' },
      ],
      codeSnippet: `// Industrial edge scraper - WaDaCon MRF
const sensor = await modbus.readHoldingRegisters(0x100, 8);
const metric = { 
  rpm: sensor[0], 
  isoVibRms: sensor[1] / 100,
  pneumaticBar: sensor[2] / 10 
};
prometheusGauge.set({ facility: 'hamburg_mrf' }, metric.isoVibRms);`,
    },
    {
      id: 'telemetry',
      title: isDe ? 'Observability & Metrik-Pipelines' : 'Observability & Metrics Pipeline',
      subtitle: isDe ? 'Prometheus, Grafana & Echtzeit-Alertmanager' : 'Prometheus, Grafana & Real-time Alertmanager',
      tag: isDe ? 'Cloud & Infrastruktur' : 'Cloud & Infrastructure',
      latency: isDe ? '50 ms Push-Aggregation' : '50 ms Push Aggregation',
      badgeColor: 'from-cyan-500 to-blue-500',
      description: isDe
        ? 'Echtzeit-Telemetrie-Pipelines zur Überwachung industrieller Anlagengesundheit. Automatische Prometheus-Alerting-Regeln für Schwingungsanomalien mit MS Teams & Webhook-Integration.'
        : 'Real-time telemetry ingestion pipelines aggregating industrial facility health. Implements automated Prometheus alert rules dispatching instant webhooks for bearing anomalies.',
      specs: [
        { label: isDe ? 'Metrik-Engine' : 'Metrics Engine', val: 'Prometheus TSDB + Pushgateway' },
        { label: isDe ? 'Dashboards' : 'Dashboards', val: 'Grafana Enterprise + Dark Panels' },
        { label: isDe ? 'Benachrichtigung' : 'Notification', val: 'Automated MS Teams/Ops Webhooks' },
        { label: isDe ? 'Aufbewahrung' : 'Retention', val: '90-Day Rolling Partitioning' },
      ],
      codeSnippet: `alert: BearingCriticalVibration
expr: rate(sorter_bearing_vib_mm_s[1m]) > 4.5
for: 30s
labels:
  severity: critical
  facility: hamburg_mrf
annotations:
  summary: "Immediate bearing inspection required: threshold > 4.5 mm/s"`,
    },
    {
      id: 'ai',
      title: isDe ? 'KI-Anomalieerkennung' : 'AI Anomaly Intelligence',
      subtitle: isDe ? 'Räumlich-zeitliche Sequenzprognosen' : 'Spatial-Temporal Sequence Forecasting',
      tag: isDe ? 'Deep Learning & ML Ops' : 'Deep Learning & ML Ops',
      latency: isDe ? '24-48 Std. Vorlauf' : '24-Hour Horizon Ahead',
      badgeColor: 'from-amber-500 to-orange-500',
      description: isDe
        ? 'LSTM-Neuronale Modelle prognostizieren mechanische Verschleißmuster 24 bis 48 Stunden vor dem physischen Bauteilversagen, um Stillstände in Recyclinganlagen zu verhindern.'
        : 'LSTM neural models forecasting mechanical failure patterns 24-48 hours before physical degradation, eliminating catastrophic sorter downtime in recycling plants.',
      specs: [
        { label: isDe ? 'Frameworks' : 'Frameworks', val: 'PyTorch · NumPy · Pandas · Scikit' },
        { label: isDe ? 'Modelltopologie' : 'Model Topology', val: 'Bi-Directional 2-Layer LSTM + Attn' },
        { label: isDe ? 'Vorwarnzeit' : 'Prediction Lead', val: '24 to 48 Hours Ahead' },
        { label: isDe ? 'F1-Score' : 'F1 Score', val: '0.942 on Real-World Datasets' },
      ],
      codeSnippet: `class AnomalyLSTM(nn.Module):
    def __init__(self, in_features=12, hidden_dim=64):
        super().__init__()
        self.lstm = nn.LSTM(in_features, hidden_dim, batch_first=True)
        self.head = nn.Linear(hidden_dim, 1)
    def forward(self, x):
        out, _ = self.lstm(x)
        return torch.sigmoid(self.head(out[:, -1, :]))`,
    },
    {
      id: 'vlsi',
      title: isDe ? 'Mikroelektronisches Fundament' : 'Microelectronic Foundation',
      subtitle: isDe ? 'Xilinx FPGA & VHDL-Zustandslogik' : 'Xilinx FPGA & VHDL State Logic',
      tag: isDe ? 'Forschung · TU Clausthal' : 'Academic Research · TU Clausthal',
      latency: isDe ? '< 12 µs (Jitterfrei)' : '< 12 µs (Zero Jitter)',
      badgeColor: 'from-purple-500 to-indigo-500',
      description: isDe
        ? 'ZanderLink 4-Knoten deterministisches Busprotokoll, entwickelt unter Prof. Dr. Christian Siemers. Takt-synchronisierte Round-Robin-Übertragung und hardwarenahe CRC-5-Prüfsummen.'
        : 'ZanderLink 4-Node deterministic bus protocol created under Prof. Dr. Christian Siemers. Features clock-synchronized round-robin transmission and hardware-level CRC-5 verification.',
      specs: [
        { label: isDe ? 'Bus-Standard' : 'Bus Standard', val: 'EIA-485 Synchronous Differential' },
        { label: isDe ? 'Ziel-Silizium' : 'Target Silicon', val: 'Xilinx Artix-7 / Spartan FPGA' },
        { label: isDe ? 'Netzlistenumfang' : 'Netlist Complexity', val: '1,086 Nets · 832 Leaf Cells' },
        { label: isDe ? 'Taktung' : 'Clocking Logic', val: 'Distributed H-Tree Global CLK' },
      ],
      codeSnippet: `entity zanderlink_node is
  Port ( clk_485 : in STD_LOGIC;
         tx_data : out STD_LOGIC_VECTOR(15 downto 0);
         crc5_ok : out STD_LOGIC;
         state_fsm : out STD_LOGIC_VECTOR(3 downto 0) );
end entity;`,
    },
  ];

  const current = layers.find((l) => l.id === selectedLayer) || layers[0];

  const nginxConfigCode = `# /etc/nginx/nginx.conf
upstream edge_backend_cluster {
    # Method: round-robin (default) / least_conn / ip_hash
    ${lbAlgorithm === 'leastconn' ? 'least_conn;' : lbAlgorithm === 'iphash' ? 'ip_hash;' : ''}
    server 10.0.1.11:8080 max_fails=2 fail_timeout=10s weight=100;
    server 10.0.1.12:8080 max_fails=2 fail_timeout=10s weight=100;
    server 10.0.1.13:8080 backup;
}

server {
    listen 443 ssl http2;
    server_name telemetry.wadacon-mrf.de;

    ssl_certificate /etc/ssl/certs/mrf.crt;
    ssl_certificate_key /etc/ssl/private/mrf.key;

    location / {
        proxy_pass http://edge_backend_cluster;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_next_upstream error timeout http_502 http_503;
    }

    location /healthz {
        access_log off;
        return 200 "healthy\\n";
    }
}`;

  const keepalivedConfigCode = `# /etc/keepalived/keepalived.conf
vrrp_script chk_haproxy {
    script "killall -0 haproxy"
    interval 2
    weight 2
}

vrrp_instance VI_TELEMETRY {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 101
    advert_int 1

    virtual_ipaddress {
        10.0.1.100/24 dev eth0
    }

    track_script {
        chk_haproxy
    }
}`;

  return (
    <section id="observability" className="py-20 border-t border-slate-800/80 bg-slate-950/70 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              {t.tag}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
              {t.title}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              {t.desc}
            </p>
          </div>

          {/* Quick Simulation controls */}
          <div className="flex items-center gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSimulating 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimulating ? t.simActive : t.simPaused}</span>
            </button>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 pr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.vipActive}</span>
            </div>
          </div>
        </div>

        {/* 5 Interactive Layer Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {layers.map((layer, idx) => {
            const isSelected = selectedLayer === layer.id;
            return (
              <div
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id as any)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-400/80 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30 -translate-y-1'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-slate-500 font-bold">0{idx + 1} // TIER</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    isSelected ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {layer.latency}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm text-white line-clamp-1">
                  {layer.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {layer.subtitle}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-emerald-400/90 font-medium truncate">
                    {layer.tag}
                  </span>
                  <ArrowRight className={`w-3 h-3 shrink-0 transition-transform ${isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Inspection Workbench */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Specs & Context */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isDe ? 'Architektur-Detailansicht & Spezifikationen' : 'Architecture Deep-Dive & Hardware Specifications'}</span>
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  {current.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {current.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.specs.map((spec, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      {spec.label}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-100 font-mono mt-1">
                      {spec.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Production Verification Pill */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-200">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">{isDe ? 'Praxisverifizierte Zuverlässigkeit: ' : 'Engineering Provenance: '}</span>
                  {isDe 
                    ? 'Ausgelegt auf maximale Verfügbarkeit (99,99%) mit Aktiv-Passiv-Redundanz und kontinuierlichen Layer-7 Health-Checks unter Echtzeit-Bedingungen.'
                    : 'Designed for high uptime (99.99%) and active-passive redundancy. Implemented under real industrial operations or verified academic research.'}
                </div>
              </div>
            </div>

            {/* Right Live Visual Code & Telemetry Terminal */}
            <div className="lg:col-span-6 space-y-4">
              {/* Code Snippet Terminal with Tab Selection for Load Balancers */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-slate-300 ml-2 font-semibold">
                      {selectedLayer === 'load-balancer' 
                        ? (activeConfigTab === 'haproxy' ? 'haproxy.cfg' : activeConfigTab === 'nginx' ? 'nginx.conf' : 'keepalived.conf')
                        : selectedLayer === 'vlsi' 
                        ? 'zanderlink_node.vhd' 
                        : selectedLayer === 'edge' 
                        ? 'edge_scraper.ts' 
                        : selectedLayer === 'telemetry' 
                        ? 'prometheus_rules.yml' 
                        : 'lstm_anomaly.py'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedLayer === 'load-balancer' && (
                      <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                        <button
                          onClick={() => setActiveConfigTab('haproxy')}
                          className={`px-2 py-0.5 rounded transition-all ${activeConfigTab === 'haproxy' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                        >
                          HAProxy
                        </button>
                        <button
                          onClick={() => setActiveConfigTab('nginx')}
                          className={`px-2 py-0.5 rounded transition-all ${activeConfigTab === 'nginx' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                        >
                          NGINX
                        </button>
                        <button
                          onClick={() => setActiveConfigTab('keepalived')}
                          className={`px-2 py-0.5 rounded transition-all ${activeConfigTab === 'keepalived' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                        >
                          VRRP
                        </button>
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        const snippet = selectedLayer === 'load-balancer' 
                          ? (activeConfigTab === 'haproxy' ? current.codeSnippet : activeConfigTab === 'nginx' ? nginxConfigCode : keepalivedConfigCode)
                          : current.codeSnippet;
                        copyToClipboard(snippet, selectedLayer);
                      }}
                      className="flex items-center gap-1 text-[10px] text-cyan-300 hover:text-white bg-slate-800 px-2 py-1 rounded transition-colors"
                      title={t.copyConfig}
                    >
                      {copiedConfig === selectedLayer ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{t.copyConfig}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 overflow-x-auto text-xs font-mono text-cyan-300 leading-relaxed bg-[#050811] max-h-72">
                  <pre>
                    {selectedLayer === 'load-balancer' 
                      ? (activeConfigTab === 'haproxy' ? current.codeSnippet : activeConfigTab === 'nginx' ? nginxConfigCode : keepalivedConfigCode)
                      : current.codeSnippet}
                  </pre>
                </div>
              </div>

              {/* Live Signal Status */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-slate-300 font-bold text-[11px]">
                      {isDe ? 'LOAD-BALANCER TELEMETRIE-BUS' : 'LOAD-BALANCER SIGNAL BUS'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isDe ? 'VRRP VIP aktiv · HTTP /healthz Heartbeat 1500ms' : 'VRRP VIP active · HTTP /healthz heartbeat 1500ms'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-emerald-400 font-bold">STATUS: 200 OK</div>
                  <div className="text-[10px] text-slate-400">0 PACKET LOSS (100% HA)</div>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Load Balancer Simulator Panel */}
          <div className="mt-8 pt-6 border-t border-slate-800 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-base sm:text-lg font-bold text-white font-display">
                    {t.lbDemoTitle}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                    Live Demo
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {t.lbDemoDesc}
                </p>
              </div>

              {/* Algorithm & Traffic Rate Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Traffic Rate */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                  <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    {t.trafficRate}
                  </span>
                  <button
                    onClick={() => setTrafficRate('normal')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      trafficRate === 'normal' 
                        ? 'bg-cyan-500 text-slate-950 font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    100 r/s
                  </button>
                  <button
                    onClick={() => setTrafficRate('high')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      trafficRate === 'high' 
                        ? 'bg-cyan-500 text-slate-950 font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    500 r/s
                  </button>
                  <button
                    onClick={() => setTrafficRate('surge')}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      trafficRate === 'surge' 
                        ? 'bg-amber-400 text-slate-950 font-bold' 
                        : 'text-slate-400 hover:text-amber-300'
                    }`}
                  >
                    <Flame className="w-3 h-3 text-red-500" />
                    1.5k r/s
                  </button>
                </div>

                {/* Algorithm Switcher */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                  <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    {t.algorithm}
                  </span>
                  <button
                    onClick={() => setLbAlgorithm('roundrobin')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      lbAlgorithm === 'roundrobin' 
                        ? 'bg-emerald-500 text-slate-950 font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Round Robin
                  </button>
                  <button
                    onClick={() => setLbAlgorithm('leastconn')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      lbAlgorithm === 'leastconn' 
                        ? 'bg-emerald-500 text-slate-950 font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Least Conn
                  </button>
                  <button
                    onClick={() => setLbAlgorithm('weighted')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      lbAlgorithm === 'weighted' 
                        ? 'bg-emerald-500 text-slate-950 font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Weighted
                  </button>
                  <button
                    onClick={() => setLbAlgorithm('iphash')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      lbAlgorithm === 'iphash' 
                        ? 'bg-emerald-500 text-slate-950 font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    IP Hash
                  </button>
                </div>
              </div>
            </div>

            {/* Visual Load Balancer Flow Diagram */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 relative overflow-hidden">
              <div className="text-[11px] font-mono text-slate-400 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <RadioTower className="w-3.5 h-3.5 text-emerald-400" />
                  {isDe ? 'Echtzeit-Traffic-Routen & Paketfluss' : 'Live Traffic Routing & Ingress Flow'}
                </span>
                <span className="text-cyan-400 font-mono font-bold">
                  {rateLabel} · {simulatedRequests.toLocaleString()} {t.reqsRouted}
                </span>
              </div>

              {/* Graphic Flow Lines */}
              <div className="relative py-2 flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* 1. Client Ingress Stream */}
                <div className="w-full md:w-1/4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    {isDe ? 'Clients & Edge-Geräte' : 'Client Ingress'}
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 font-mono">
                    HTTPS / WebSocket
                  </div>
                  <div className="mt-2 flex justify-center items-center gap-1 text-[10px] text-cyan-300 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>{rateLabel}</span>
                  </div>
                </div>

                {/* Arrow / Packet Pipe 1 */}
                <div className="hidden md:flex flex-col items-center justify-center text-emerald-400">
                  <ArrowRight className="w-5 h-5 animate-pulse" />
                  <span className="text-[9px] font-mono text-slate-500">TLS 1.3</span>
                </div>

                {/* 2. Virtual IP (VIP) Load Balancer */}
                <div className="w-full md:w-1/3 p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/60 text-center space-y-1.5 shadow-lg shadow-emerald-500/10">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    <Shield className="w-3.5 h-3.5" />
                    {t.virtualIp}
                  </div>
                  <div className="text-base font-bold font-mono text-white">
                    10.0.1.100:443
                  </div>
                  <div className="text-[11px] text-cyan-300 font-mono">
                    HAProxy L4/L7 · {t.vrrpMaster}
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                    Routing: <span className="text-emerald-300 font-bold uppercase">{lbAlgorithm}</span>
                  </div>
                </div>

                {/* Arrow / Packet Pipe 2 */}
                <div className="hidden md:flex flex-col items-center justify-center text-emerald-400">
                  <ArrowRight className="w-5 h-5 animate-pulse" />
                  <span className="text-[9px] font-mono text-slate-500">L7 Probes</span>
                </div>

                {/* 3. Dispatch Target Indicators */}
                <div className="w-full md:w-1/3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400">{isDe ? 'Aktiver Zielknoten:' : 'Active Target Node:'}</div>
                    <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>WORKER 0{activeRoutingNode}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">{isDe ? 'Failover-Schutz' : 'Failover Ready'}</div>
                    <div className="text-cyan-300 font-bold">0 Drop SLA</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Load Balancer Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              
              {/* Node 1 */}
              <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                nodesHealth.node1 
                  ? activeRoutingNode === 1 
                    ? 'bg-emerald-950/40 border-emerald-400/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40' 
                    : 'bg-slate-950/80 border-slate-800'
                  : 'bg-red-950/20 border-red-500/50'
              }`}>
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-emerald-400" />
                      WORKER 01 (PRIMARY)
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      nodesHealth.node1 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}>
                      {nodesHealth.node1 ? '200 OK' : 'FAILED'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-300">10.0.1.11:8080</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Weight: {nodeWeights.node1} · HTTP /healthz
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">{isDe ? 'Aktive Verbindungen' : 'Active Conns'}</span>
                      <span className="text-emerald-300 font-bold">{nodeConns.node1}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Latenz</span>
                      <span className="text-slate-200 font-bold">{nodesHealth.node1 ? '0.3 ms' : '∞ ms'}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleNodeHealth('node1')}
                  className={`w-full mt-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-sm ${
                    nodesHealth.node1
                      ? 'bg-slate-800 hover:bg-red-950/80 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/50'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                  }`}
                >
                  {nodesHealth.node1 ? t.simulateFailure : t.recoverNode}
                </button>
              </div>

              {/* Node 2 */}
              <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                nodesHealth.node2 
                  ? activeRoutingNode === 2 
                    ? 'bg-emerald-950/40 border-emerald-400/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40' 
                    : 'bg-slate-950/80 border-slate-800'
                  : 'bg-red-950/20 border-red-500/50'
              }`}>
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-emerald-400" />
                      WORKER 02 (PRIMARY)
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      nodesHealth.node2 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}>
                      {nodesHealth.node2 ? '200 OK' : 'FAILED'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-300">10.0.1.12:8080</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Weight: {nodeWeights.node2} · HTTP /healthz
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">{isDe ? 'Aktive Verbindungen' : 'Active Conns'}</span>
                      <span className="text-emerald-300 font-bold">{nodeConns.node2}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Latenz</span>
                      <span className="text-slate-200 font-bold">{nodesHealth.node2 ? '0.4 ms' : '∞ ms'}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleNodeHealth('node2')}
                  className={`w-full mt-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-sm ${
                    nodesHealth.node2
                      ? 'bg-slate-800 hover:bg-red-950/80 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/50'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                  }`}
                >
                  {nodesHealth.node2 ? t.simulateFailure : t.recoverNode}
                </button>
              </div>

              {/* Node 3 (Backup / Standby) */}
              <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                nodesHealth.node3 
                  ? activeRoutingNode === 3 
                    ? 'bg-cyan-950/40 border-cyan-400/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40' 
                    : 'bg-slate-950/80 border-slate-800'
                  : 'bg-slate-950/40 border-slate-800/60'
              }`}>
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-cyan-400" />
                      WORKER 03 ({isDe ? 'HOT-STANDBY' : 'HOT STANDBY'})
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      nodesHealth.node3 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {nodesHealth.node3 ? 'ONLINE' : 'HOT STANDBY'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-300">10.0.1.13:8080</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    {isDe ? 'Automatisches Failover-Ziel' : 'Hot Standby Failover Target'}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">{isDe ? 'Aktive Verbindungen' : 'Active Conns'}</span>
                      <span className="text-cyan-300 font-bold">{nodeConns.node3}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Latenz</span>
                      <span className="text-slate-200 font-bold">{nodesHealth.node3 ? '0.4 ms' : 'Standby'}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleNodeHealth('node3')}
                  className={`w-full mt-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-sm ${
                    nodesHealth.node3
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                  }`}
                >
                  {nodesHealth.node3 ? t.setStandby : t.activateBackup}
                </button>
              </div>

            </div>

            {/* Live Failover Guarantee Status */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {(!nodesHealth.node1 || !nodesHealth.node2) 
                    ? t.failoverActive 
                    : t.allHealthy}
                </span>
              </div>
              <span className="text-[11px] text-cyan-400 font-medium">
                {t.healthProbes}
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
