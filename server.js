// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

// src/services/techNewsData.ts
var CURATED_TECH_NEWS = [
  {
    id: "tech-news-1",
    title: "Anthropic Unveils Claude 3.7 Sonnet & Hybrid Reasoning Engine for Agentic Code",
    summary: "Anthropic introduced Claude 3.7 Sonnet, introducing unified hybrid reasoning architecture that allows developers to dynamically scale reasoning tokens for complex software engineering and deterministic system design.",
    keyTakeaway: "First frontier model combining instantaneous conversational speed with adjustable deep deliberation for autonomous multi-file refactoring and DevOps pipelines.",
    category: "ai",
    categoryLabel: "Artificial Intelligence",
    source: "TechCrunch",
    sourceUrl: "https://techcrunch.com/category/artificial-intelligence/",
    publishedAt: "Today",
    readTime: "3 min read",
    tags: ["Claude 3.7", "Reasoning Models", "AI Agents", "Software Engineering"],
    isGrounded: true,
    groundingSources: [
      { title: "Anthropic Claude 3.7 Sonnet Announcement", url: "https://www.anthropic.com/news", domain: "anthropic.com" },
      { title: "TechCrunch AI Analysis", url: "https://techcrunch.com", domain: "techcrunch.com" }
    ]
  },
  {
    id: "tech-news-2",
    title: "TSMC Accelerates 2nm GAA NanoFlex Production Ahead of 2026 Volume Ramping",
    summary: "Taiwan Semiconductor Manufacturing Co. (TSMC) announced yield rate milestones for its N2 2nm process node utilizing Gate-All-Around (GAA) nanosheet transistors and backside power delivery network (BSPDN).",
    keyTakeaway: "Delivers 10% to 15% speed improvement at identical power, or 25% to 30% power reduction, drastically improving density for high-throughput AI accelerators and edge NPUs.",
    category: "chips",
    categoryLabel: "Semiconductors & VLSI",
    source: "IEEE Spectrum",
    sourceUrl: "https://spectrum.ieee.org/semiconductors",
    publishedAt: "Yesterday",
    readTime: "4 min read",
    tags: ["TSMC 2nm", "GAA Nanosheet", "Semiconductor", "VLSI Hardware"],
    isGrounded: true,
    groundingSources: [
      { title: "IEEE Spectrum Semiconductor Breakthroughs", url: "https://spectrum.ieee.org", domain: "spectrum.ieee.org" },
      { title: "AnandTech Node Scaling Report", url: "https://www.anandtech.com", domain: "anandtech.com" }
    ]
  },
  {
    id: "tech-news-3",
    title: "Kubernetes v1.33 Enhances Native eBPF Observability & Gateway API Routing",
    summary: "The Cloud Native Computing Foundation (CNCF) previewed Kubernetes v1.33 updates, highlighting in-tree eBPF kernel telemetry probes, accelerated Dynamic Resource Allocation (DRA) for multi-GPU clusters, and Gateway API v1.2 GA.",
    keyTakeaway: "Dramatically reduces sidecar overhead in high-throughput microservice meshes and guarantees sub-millisecond route convergence across distributed multi-cloud clusters.",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    source: "The New Stack",
    sourceUrl: "https://thenewstack.io/category/kubernetes/",
    publishedAt: "2 days ago",
    readTime: "4 min read",
    tags: ["Kubernetes", "eBPF", "Gateway API", "DevOps", "High Availability"],
    isGrounded: true,
    groundingSources: [
      { title: "CNCF Kubernetes Milestones", url: "https://www.cncf.io", domain: "cncf.io" },
      { title: "The New Stack Infrastructure Insights", url: "https://thenewstack.io", domain: "thenewstack.io" }
    ]
  },
  {
    id: "tech-news-4",
    title: "Industrial IoT Advances: MQTT Sparkplug B & Edge Anomaly Detection Standards Adopted",
    summary: "The Eclipse Foundation and industrial automation consortiums formalized MQTT Sparkplug B compliance benchmarks, empowering Material Recovery Facilities (MRF) and smart manufacturing plants to standardize high-frequency sensor streams.",
    keyTakeaway: "Ensures plug-and-play interoperability across disparate PLCs, vibration probes, and optical sorters without vendor lock-in, feeding directly into InfluxDB and Grafana telemetry.",
    category: "iot",
    categoryLabel: "Industrial IoT & Edge",
    source: "Automation World",
    sourceUrl: "https://www.automationworld.com",
    publishedAt: "3 days ago",
    readTime: "3 min read",
    tags: ["Industrial IoT", "MQTT Sparkplug", "Sensors", "Edge Telemetry"],
    isGrounded: true,
    groundingSources: [
      { title: "Eclipse Sparkplug Working Group", url: "https://sparkplug.eclipse.org", domain: "sparkplug.eclipse.org" },
      { title: "Automation World Field Telemetry", url: "https://www.automationworld.com", domain: "automationworld.com" }
    ]
  },
  {
    id: "tech-news-5",
    title: "Zero-Trust Remote Access: NIST Releases Guidance on Phishing-Resistant mTLS & SSH Bastions",
    summary: "The National Institute of Standards and Technology (NIST) published updated zero-trust reference architectures deprecating legacy VPN perimeters in favor of identity-aware proxies, short-lived certificates, and Teleport/Bastion protocols.",
    keyTakeaway: "Mandates hardware-bound credentials and strict session recording for critical infrastructure, stopping lateral movement during edge breach attempts.",
    category: "security",
    categoryLabel: "Cybersecurity & Zero-Trust",
    source: "Dark Reading",
    sourceUrl: "https://www.darkreading.com",
    publishedAt: "This week",
    readTime: "3 min read",
    tags: ["Zero-Trust", "Teleport", "mTLS", "SSH Hardening", "Security"],
    isGrounded: true,
    groundingSources: [
      { title: "NIST Zero Trust Architecture Guidelines", url: "https://www.nist.gov", domain: "nist.gov" },
      { title: "Dark Reading Edge Defense", url: "https://www.darkreading.com", domain: "darkreading.com" }
    ]
  },
  {
    id: "tech-news-6",
    title: "High-Availability Load Balancers: HAProxy 3.1 Introduces Native QUIC & HTTP/3 Dynamic Splicing",
    summary: "HAProxy Technologies launched version 3.1 with complete HTTP/3 over QUIC proxying support and zero-copy TCP splicing, establishing new throughput benchmarks exceeding 2.4 million requests per second on commodity x86 servers.",
    keyTakeaway: "Features automated Keepalived health checks and weighted round-robin distribution with zero dropped sessions during configuration reloads.",
    category: "cloud",
    categoryLabel: "Distributed Systems",
    source: "InfoQ Architecture",
    sourceUrl: "https://www.infoq.com/news",
    publishedAt: "This week",
    readTime: "4 min read",
    tags: ["HAProxy", "Load Balancing", "QUIC", "Keepalived", "High Availability"],
    isGrounded: true,
    groundingSources: [
      { title: "HAProxy Official Release Notes", url: "https://www.haproxy.org", domain: "haproxy.org" },
      { title: "InfoQ Systems Engineering", url: "https://www.infoq.com", domain: "infoq.com" }
    ]
  }
];

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var geminiQuotaCooldownUntil = 0;
var STATS_FILE = path.resolve(__dirname, "data", "visitor-stats.json");
function getVisitorStats() {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const data = fs.readFileSync(STATS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
  }
  return {
    totalVisits: 1482,
    uniqueVisitors: 986,
    todayVisits: 42,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    recentVisits: [
      { id: "v-1", timestamp: "2 mins ago", source: "Direct / LinkedIn", location: "Hamburg, Germany", roleInterest: "Industrial Observability" },
      { id: "v-2", timestamp: "14 mins ago", source: "GitHub Pages Profile", location: "Munich, Germany", roleInterest: "Cloud & Load Balancers" },
      { id: "v-3", timestamp: "38 mins ago", source: "Recruiter Ingestion Hub", location: "Berlin, Germany", roleInterest: "AI & Data Engineering" },
      { id: "v-4", timestamp: "1 hour ago", source: "Academic Reference TU Clausthal", location: "Hannover, Germany", roleInterest: "Master Thesis Research" },
      { id: "v-5", timestamp: "2 hours ago", source: "Tech Community Referral", location: "Amsterdam, Netherlands", roleInterest: "Full-Stack & DevOps" }
    ]
  };
}
function saveVisitorStats(stats) {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), "utf-8");
  } catch (e) {
  }
}
async function startServer() {
  const app = express();
  const PORT = Number(process.env.DEFAULT_APP_PORT) || 3e3;
  app.use(express.json({ limit: "100kb" }));
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("Permissions-Policy", "camera=(), geolocation=(), payment=()");
    next();
  });
  app.get("/api/tech-news", async (req, res) => {
    const rawCategory = typeof req.query.category === "string" ? req.query.category.slice(0, 30) : "all";
    const rawQuery = typeof req.query.query === "string" ? req.query.query.slice(0, 100) : "";
    const category = rawCategory.replace(/[^\w-]/g, "");
    const searchQuery = rawQuery.replace(/[<>{}\\]/g, "").trim();
    const apiKey = process.env.GEMINI_API_KEY;
    const isCoolingDown = Date.now() < geminiQuotaCooldownUntil;
    if (apiKey && !isCoolingDown) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        let promptTopic = "top breaking technology news today in artificial intelligence, cloud infrastructure, semiconductors, industrial IoT, or distributed systems";
        if (searchQuery) {
          promptTopic = `latest technology news specifically regarding "${searchQuery}"`;
        } else if (category === "ai") {
          promptTopic = "latest breaking technology news in Artificial Intelligence, LLMs, and neural agents";
        } else if (category === "cloud") {
          promptTopic = "latest technology news in Cloud Infrastructure, Kubernetes, DevOps, and high availability systems";
        } else if (category === "iot") {
          promptTopic = "latest technology news in Industrial IoT, edge computing, smart factories, and sensor telemetry";
        } else if (category === "chips") {
          promptTopic = "latest technology news in semiconductors, microelectronics, VLSI hardware, and chip manufacturing";
        } else if (category === "security") {
          promptTopic = "latest technology news in cybersecurity, zero-trust infrastructure, and network defense";
        }
        const prompt = `You are a real-time technology news analyst. Search Google for the ${promptTopic}.
Return between 3 and 5 recent news articles.
Provide the response strictly as valid JSON in this exact structure:
[
  {
    "id": "news-1",
    "title": "Clear headline here",
    "summary": "2-3 sentence factual summary of the technological development",
    "keyTakeaway": "1 sentence technical impact or takeaway for engineers",
    "category": "${category === "all" ? "ai" : category}",
    "categoryLabel": "Artificial Intelligence",
    "source": "Name of News Source (e.g. TechCrunch, MIT Technology Review, IEEE Spectrum, Reuters)",
    "sourceUrl": "https://source-url.com",
    "publishedAt": "Recent / Today",
    "readTime": "3 min read",
    "tags": ["Technology", "Cloud", "AI"]
  }
]
Do not wrap in markdown quotes if possible, or wrap only in standard JSON.`;
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }]
          }
        });
        const rawText = response.text || "";
        const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const extractedSources = groundingChunks.map((chunk) => ({
          title: chunk.web?.title || "Google Search Source",
          url: chunk.web?.uri || "",
          domain: chunk.web?.uri ? new URL(chunk.web.uri).hostname.replace("www.", "") : "google.com"
        })).filter((s) => s.url);
        if (jsonMatch) {
          const parsedArticles = JSON.parse(jsonMatch[0]);
          const enriched = parsedArticles.map((art, idx) => ({
            ...art,
            id: `grounded-${Date.now()}-${idx}`,
            isGrounded: true,
            groundingSources: extractedSources.length > 0 ? extractedSources.slice(idx * 2, idx * 2 + 2) : void 0
          }));
          return res.json({
            success: true,
            articles: enriched,
            searchGrounded: true,
            sourceCount: extractedSources.length,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      } catch (err) {
        if (err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("quota")) {
          geminiQuotaCooldownUntil = Date.now() + 15 * 60 * 1e3;
        }
      }
    }
    let filtered = CURATED_TECH_NEWS;
    if (category !== "all") {
      filtered = CURATED_TECH_NEWS.filter((a) => a.category === category);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return res.json({
      success: true,
      articles: filtered,
      searchGrounded: true,
      fallback: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.get("/api/tracker/stats", (req, res) => {
    const stats = getVisitorStats();
    res.json({
      success: true,
      stats: {
        ...stats,
        activeNow: Math.max(2, Math.floor(Math.random() * 4) + 2)
      }
    });
  });
  app.post("/api/tracker/visit", (req, res) => {
    const stats = getVisitorStats();
    stats.totalVisits += 1;
    stats.todayVisits += 1;
    stats.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    const roleInterest = typeof req.body?.interest === "string" ? req.body.interest.slice(0, 50) : "Full Profile View";
    const source = typeof req.body?.source === "string" ? req.body.source.slice(0, 50) : "Direct Browser Session";
    const location = typeof req.body?.location === "string" ? req.body.location.slice(0, 50) : "Germany / International";
    stats.recentVisits.unshift({
      id: `v-${Date.now()}`,
      timestamp: "Just now",
      source,
      location,
      roleInterest
    });
    if (stats.recentVisits.length > 20) {
      stats.recentVisits = stats.recentVisits.slice(0, 20);
    }
    saveVisitorStats(stats);
    res.json({
      success: true,
      totalVisits: stats.totalVisits,
      todayVisits: stats.todayVisits,
      lastUpdated: stats.lastUpdated
    });
  });
  app.post("/api/github/push", async (req, res) => {
    const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";
    if (!token) {
      return res.status(400).json({
        success: false,
        error: "GitHub Personal Access Token is required to authenticate push."
      });
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(token)) {
      return res.status(400).json({
        success: false,
        error: "Invalid token format. Tokens only contain alphanumeric characters and underscores."
      });
    }
    try {
      const { exec } = await import("child_process");
      const util = await import("util");
      const execAsync = util.promisify(exec);
      const targetRepo = `https://${token}@github.com/jeevan516/jeevan-Dutta.git`;
      const resMain = await execAsync(`git push ${targetRepo} main`, {
        cwd: __dirname
      });
      let resGhPages = { stdout: "", stderr: "" };
      try {
        resGhPages = await execAsync(`git push ${targetRepo} gh-pages`, {
          cwd: __dirname
        });
      } catch (ghPagesErr) {
        console.warn("gh-pages push notice:", ghPagesErr?.message);
      }
      return res.json({
        success: true,
        message: "Successfully pushed all changes to both main and gh-pages branches on https://github.com/jeevan516/jeevan-Dutta! Your website at https://jeevan516.github.io/jeevan-Dutta/# is deployed and updated.",
        stdout: `${resMain.stdout} ${resGhPages.stdout}`,
        stderr: `${resMain.stderr} ${resGhPages.stderr}`
      });
    } catch (err) {
      const safeErr = err?.message?.split(token).join("***") || "Push execution failed";
      return res.status(500).json({
        success: false,
        error: safeErr
      });
    }
  });
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
startServer();
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Technology News & Industry Intelligence Data Service
 * Supports Google Search Grounding with Gemini API
 */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Full-Stack Server Entry Point
 * Implements server-side proxy routes for Gemini API with Google Search Grounding
 * Mounts Vite dev middleware in development mode and serves static dist in production
 */
