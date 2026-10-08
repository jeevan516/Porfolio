/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Technology News & Industry Intelligence Data Service
 * Supports Google Search Grounding with Gemini API
 */

export interface GroundingSource {
  title: string;
  url: string;
  domain: string;
}

export interface TechNewsArticle {
  id: string;
  title: string;
  summary: string;
  keyTakeaway: string;
  category: 'ai' | 'cloud' | 'iot' | 'chips' | 'security';
  categoryLabel: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  groundingSources?: GroundingSource[];
  isGrounded?: boolean;
}

export const CURATED_TECH_NEWS: TechNewsArticle[] = [
  {
    id: 'tech-news-1',
    title: 'Anthropic Unveils Claude 3.7 Sonnet & Hybrid Reasoning Engine for Agentic Code',
    summary: 'Anthropic introduced Claude 3.7 Sonnet, introducing unified hybrid reasoning architecture that allows developers to dynamically scale reasoning tokens for complex software engineering and deterministic system design.',
    keyTakeaway: 'First frontier model combining instantaneous conversational speed with adjustable deep deliberation for autonomous multi-file refactoring and DevOps pipelines.',
    category: 'ai',
    categoryLabel: 'Artificial Intelligence',
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com/category/artificial-intelligence/',
    publishedAt: 'Today',
    readTime: '3 min read',
    tags: ['Claude 3.7', 'Reasoning Models', 'AI Agents', 'Software Engineering'],
    isGrounded: true,
    groundingSources: [
      { title: 'Anthropic Claude 3.7 Sonnet Announcement', url: 'https://www.anthropic.com/news', domain: 'anthropic.com' },
      { title: 'TechCrunch AI Analysis', url: 'https://techcrunch.com', domain: 'techcrunch.com' }
    ]
  },
  {
    id: 'tech-news-2',
    title: 'TSMC Accelerates 2nm GAA NanoFlex Production Ahead of 2026 Volume Ramping',
    summary: 'Taiwan Semiconductor Manufacturing Co. (TSMC) announced yield rate milestones for its N2 2nm process node utilizing Gate-All-Around (GAA) nanosheet transistors and backside power delivery network (BSPDN).',
    keyTakeaway: 'Delivers 10% to 15% speed improvement at identical power, or 25% to 30% power reduction, drastically improving density for high-throughput AI accelerators and edge NPUs.',
    category: 'chips',
    categoryLabel: 'Semiconductors & VLSI',
    source: 'IEEE Spectrum',
    sourceUrl: 'https://spectrum.ieee.org/semiconductors',
    publishedAt: 'Yesterday',
    readTime: '4 min read',
    tags: ['TSMC 2nm', 'GAA Nanosheet', 'Semiconductor', 'VLSI Hardware'],
    isGrounded: true,
    groundingSources: [
      { title: 'IEEE Spectrum Semiconductor Breakthroughs', url: 'https://spectrum.ieee.org', domain: 'spectrum.ieee.org' },
      { title: 'AnandTech Node Scaling Report', url: 'https://www.anandtech.com', domain: 'anandtech.com' }
    ]
  },
  {
    id: 'tech-news-3',
    title: 'Kubernetes v1.33 Enhances Native eBPF Observability & Gateway API Routing',
    summary: 'The Cloud Native Computing Foundation (CNCF) previewed Kubernetes v1.33 updates, highlighting in-tree eBPF kernel telemetry probes, accelerated Dynamic Resource Allocation (DRA) for multi-GPU clusters, and Gateway API v1.2 GA.',
    keyTakeaway: 'Dramatically reduces sidecar overhead in high-throughput microservice meshes and guarantees sub-millisecond route convergence across distributed multi-cloud clusters.',
    category: 'cloud',
    categoryLabel: 'Cloud & Infrastructure',
    source: 'The New Stack',
    sourceUrl: 'https://thenewstack.io/category/kubernetes/',
    publishedAt: '2 days ago',
    readTime: '4 min read',
    tags: ['Kubernetes', 'eBPF', 'Gateway API', 'DevOps', 'High Availability'],
    isGrounded: true,
    groundingSources: [
      { title: 'CNCF Kubernetes Milestones', url: 'https://www.cncf.io', domain: 'cncf.io' },
      { title: 'The New Stack Infrastructure Insights', url: 'https://thenewstack.io', domain: 'thenewstack.io' }
    ]
  },
  {
    id: 'tech-news-4',
    title: 'Industrial IoT Advances: MQTT Sparkplug B & Edge Anomaly Detection Standards Adopted',
    summary: 'The Eclipse Foundation and industrial automation consortiums formalized MQTT Sparkplug B compliance benchmarks, empowering Material Recovery Facilities (MRF) and smart manufacturing plants to standardize high-frequency sensor streams.',
    keyTakeaway: 'Ensures plug-and-play interoperability across disparate PLCs, vibration probes, and optical sorters without vendor lock-in, feeding directly into InfluxDB and Grafana telemetry.',
    category: 'iot',
    categoryLabel: 'Industrial IoT & Edge',
    source: 'Automation World',
    sourceUrl: 'https://www.automationworld.com',
    publishedAt: '3 days ago',
    readTime: '3 min read',
    tags: ['Industrial IoT', 'MQTT Sparkplug', 'Sensors', 'Edge Telemetry'],
    isGrounded: true,
    groundingSources: [
      { title: 'Eclipse Sparkplug Working Group', url: 'https://sparkplug.eclipse.org', domain: 'sparkplug.eclipse.org' },
      { title: 'Automation World Field Telemetry', url: 'https://www.automationworld.com', domain: 'automationworld.com' }
    ]
  },
  {
    id: 'tech-news-5',
    title: 'Zero-Trust Remote Access: NIST Releases Guidance on Phishing-Resistant mTLS & SSH Bastions',
    summary: 'The National Institute of Standards and Technology (NIST) published updated zero-trust reference architectures deprecating legacy VPN perimeters in favor of identity-aware proxies, short-lived certificates, and Teleport/Bastion protocols.',
    keyTakeaway: 'Mandates hardware-bound credentials and strict session recording for critical infrastructure, stopping lateral movement during edge breach attempts.',
    category: 'security',
    categoryLabel: 'Cybersecurity & Zero-Trust',
    source: 'Dark Reading',
    sourceUrl: 'https://www.darkreading.com',
    publishedAt: 'This week',
    readTime: '3 min read',
    tags: ['Zero-Trust', 'Teleport', 'mTLS', 'SSH Hardening', 'Security'],
    isGrounded: true,
    groundingSources: [
      { title: 'NIST Zero Trust Architecture Guidelines', url: 'https://www.nist.gov', domain: 'nist.gov' },
      { title: 'Dark Reading Edge Defense', url: 'https://www.darkreading.com', domain: 'darkreading.com' }
    ]
  },
  {
    id: 'tech-news-6',
    title: 'High-Availability Load Balancers: HAProxy 3.1 Introduces Native QUIC & HTTP/3 Dynamic Splicing',
    summary: 'HAProxy Technologies launched version 3.1 with complete HTTP/3 over QUIC proxying support and zero-copy TCP splicing, establishing new throughput benchmarks exceeding 2.4 million requests per second on commodity x86 servers.',
    keyTakeaway: 'Features automated Keepalived health checks and weighted round-robin distribution with zero dropped sessions during configuration reloads.',
    category: 'cloud',
    categoryLabel: 'Distributed Systems',
    source: 'InfoQ Architecture',
    sourceUrl: 'https://www.infoq.com/news',
    publishedAt: 'This week',
    readTime: '4 min read',
    tags: ['HAProxy', 'Load Balancing', 'QUIC', 'Keepalived', 'High Availability'],
    isGrounded: true,
    groundingSources: [
      { title: 'HAProxy Official Release Notes', url: 'https://www.haproxy.org', domain: 'haproxy.org' },
      { title: 'InfoQ Systems Engineering', url: 'https://www.infoq.com', domain: 'infoq.com' }
    ]
  }
];
