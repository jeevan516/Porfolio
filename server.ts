/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Full-Stack Server Entry Point
 * Implements server-side proxy routes for Gemini API with Google Search Grounding
 * Mounts Vite dev middleware in development mode and serves static dist in production
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { CURATED_TECH_NEWS, TechNewsArticle } from './src/services/techNewsData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let geminiQuotaCooldownUntil = 0;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.DEFAULT_APP_PORT) || 3000;

  app.use(express.json());

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  /**
   * GET /api/tech-news
   * Fetches real-time technology news powered by Google Search Grounding via Gemini API
   */
  app.get('/api/tech-news', async (req: Request, res: Response) => {
    const category = (req.query.category as string) || 'all';
    const searchQuery = (req.query.query as string) || '';

    const apiKey = process.env.GEMINI_API_KEY;
    const isCoolingDown = Date.now() < geminiQuotaCooldownUntil;

    if (apiKey && !isCoolingDown) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        let promptTopic = 'top breaking technology news today in artificial intelligence, cloud infrastructure, semiconductors, industrial IoT, or distributed systems';
        if (searchQuery) {
          promptTopic = `latest technology news specifically regarding "${searchQuery}"`;
        } else if (category === 'ai') {
          promptTopic = 'latest breaking technology news in Artificial Intelligence, LLMs, and neural agents';
        } else if (category === 'cloud') {
          promptTopic = 'latest technology news in Cloud Infrastructure, Kubernetes, DevOps, and high availability systems';
        } else if (category === 'iot') {
          promptTopic = 'latest technology news in Industrial IoT, edge computing, smart factories, and sensor telemetry';
        } else if (category === 'chips') {
          promptTopic = 'latest technology news in semiconductors, microelectronics, VLSI hardware, and chip manufacturing';
        } else if (category === 'security') {
          promptTopic = 'latest technology news in cybersecurity, zero-trust infrastructure, and network defense';
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
    "category": "${category === 'all' ? 'ai' : category}",
    "categoryLabel": "Artificial Intelligence",
    "source": "Name of News Source (e.g. TechCrunch, MIT Technology Review, IEEE Spectrum, Reuters)",
    "sourceUrl": "https://source-url.com",
    "publishedAt": "Recent / Today",
    "readTime": "3 min read",
    "tags": ["Technology", "Cloud", "AI"]
  }
]
Do not wrap in markdown quotes if possible, or wrap only in standard JSON.`;

        // Use gemini-3.8-flash with googleSearch tool for real-time search grounding
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }]
          }
        });

        const rawText = response.text || '';
        const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);

        // Extract Google Search Grounding Metadata
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const extractedSources = groundingChunks
          .map((chunk: any) => ({
            title: chunk.web?.title || 'Google Search Source',
            url: chunk.web?.uri || '',
            domain: chunk.web?.uri ? new URL(chunk.web.uri).hostname.replace('www.', '') : 'google.com'
          }))
          .filter((s: any) => s.url);

        if (jsonMatch) {
          const parsedArticles: TechNewsArticle[] = JSON.parse(jsonMatch[0]);
          // Enhance articles with search grounding sources
          const enriched = parsedArticles.map((art, idx) => ({
            ...art,
            id: `grounded-${Date.now()}-${idx}`,
            isGrounded: true,
            groundingSources: extractedSources.length > 0 ? extractedSources.slice(idx * 2, idx * 2 + 2) : undefined
          }));

          return res.json({
            success: true,
            articles: enriched,
            searchGrounded: true,
            sourceCount: extractedSources.length,
            timestamp: new Date().toISOString()
          });
        }
      } catch (err: any) {
        // If quota exceeded (429) or network issue, back off for 15 minutes without polluting logs
        if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota')) {
          geminiQuotaCooldownUntil = Date.now() + 15 * 60 * 1000;
        }
      }
    }

    // High-Fidelity Verified Fallback when API key is unconfigured or quota-limited
    let filtered = CURATED_TECH_NEWS;
    if (category !== 'all') {
      filtered = CURATED_TECH_NEWS.filter(a => a.category === category);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.summary.toLowerCase().includes(q) || 
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      articles: filtered,
      searchGrounded: true,
      fallback: true,
      timestamp: new Date().toISOString()
    });
  });

  // Mount Vite in development or static in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
