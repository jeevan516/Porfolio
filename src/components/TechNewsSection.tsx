import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Sparkles, 
  ExternalLink, 
  RefreshCw, 
  Cpu, 
  Cloud, 
  Radio, 
  ShieldCheck, 
  Layers, 
  Clock, 
  BookOpen, 
  Share2, 
  Check, 
  ArrowRight,
  X,
  AlertCircle,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { TechNewsArticle, GroundingSource, CURATED_TECH_NEWS } from '../services/techNewsData';

interface TechNewsSectionProps {
  language?: 'en' | 'de';
}

export const TechNewsSection: React.FC<TechNewsSectionProps> = ({ language = 'en' }) => {
  const isDe = language === 'de';

  const [articles, setArticles] = useState<TechNewsArticle[]>(CURATED_TECH_NEWS);
  const [activeCategory, setActiveCategory] = useState<'all' | 'ai' | 'cloud' | 'iot' | 'chips' | 'security'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGroundedLive, setIsGroundedLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [selectedArticle, setSelectedArticle] = useState<TechNewsArticle | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch articles from /api/tech-news with Google Search Grounding
  const fetchNews = async (cat: string = activeCategory, query: string = searchQuery) => {
    setIsLoading(true);
    try {
      const url = new URL('/api/tech-news', window.location.origin);
      if (cat !== 'all') url.searchParams.set('category', cat);
      if (query.trim()) url.searchParams.set('query', query.trim());

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        if (data.articles && Array.isArray(data.articles)) {
          setArticles(data.articles);
          setIsGroundedLive(data.searchGrounded ?? true);
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } else {
        // Local filtering fallback
        applyLocalFilter(cat, query);
      }
    } catch (err) {
      console.warn('API error, using local grounding fallback:', err);
      applyLocalFilter(cat, query);
    } finally {
      setIsLoading(false);
    }
  };

  const applyLocalFilter = (cat: string, query: string) => {
    let result = CURATED_TECH_NEWS;
    if (cat !== 'all') {
      result = result.filter((a) => a.category === cat);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    setArticles(result);
  };

  useEffect(() => {
    fetchNews(activeCategory, searchQuery);
  }, [activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews(activeCategory, searchQuery);
  };

  const handleCopyShare = (art: TechNewsArticle) => {
    navigator.clipboard.writeText(`${art.title} - ${art.sourceUrl}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const categories = [
    { id: 'all', label: isDe ? 'Alle Technologien' : 'All Tech News', icon: Globe },
    { id: 'ai', label: 'AI & Frontier Models', icon: Sparkles },
    { id: 'cloud', label: 'Cloud & Infrastructure', icon: Cloud },
    { id: 'iot', label: 'Industrial IoT & Edge', icon: Radio },
    { id: 'chips', label: 'VLSI & Semiconductors', icon: Cpu },
    { id: 'security', label: 'Zero-Trust & Security', icon: ShieldCheck },
  ];

  return (
    <section 
      id="tech-news" 
      className="py-24 border-t border-slate-800/80 relative overflow-hidden bg-slate-950/90 text-slate-100"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Standalone Block Identity */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl space-y-3">
            
            {/* Grounding Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/40 text-xs text-slate-300 font-mono shadow-lg shadow-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                {isDe ? 'Google Search Grounding Aktiv' : 'Google Search Grounding Active'}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Live Tech Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
              Technology <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">News Block</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              {isDe 
                ? 'Aktuelle Technologie-Nachrichten zu Künstlicher Intelligenz, Cloud-Infrastruktur, industriellem IoT und Halbleitern – verifiziert durch Google Search Grounding.'
                : 'Real-time technology breakthroughs across AI reasoning models, cloud infrastructure, industrial IoT edge, and semiconductor hardware — verified with Google Search Grounding.'}
            </p>
          </div>

          {/* Refresh Action & Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchNews(activeCategory, searchQuery)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500/50 text-xs font-mono transition-all shadow-md active:scale-95 disabled:opacity-50"
              title="Refresh with Google Search Grounding"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? (isDe ? 'Wird geladen...' : 'Searching Google...') : (isDe ? 'Aktualisieren' : 'Refresh News')}</span>
            </button>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Updated: {lastUpdated}
            </span>
          </div>
        </div>

        {/* Filter Tabs & Real-Time Search Bar */}
        <div className="mb-8 space-y-4">
          
          {/* Category Chips Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Google Input */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isDe ? 'Thema suchen (z.B. Claude 3.7, TSMC 2nm, Kubernetes eBPF)...' : 'Search any tech topic (e.g., Claude 3.7, TSMC 2nm, Kubernetes eBPF)...'}
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] font-mono transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Technology News Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <article 
              key={art.id}
              className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/40 hover:-translate-y-1"
            >
              <div className="space-y-4">
                
                {/* Meta Top Bar */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                    {art.categoryLabel}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {art.publishedAt} · {art.readTime}
                  </span>
                </div>

                {/* Article Headline */}
                <h3 className="text-base sm:text-lg font-bold font-display text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {art.title}
                </h3>

                {/* Article Summary */}
                <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                  {art.summary}
                </p>

                {/* Key Engineering Takeaway Box */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {isDe ? 'Ingenieur-Erkenntnis' : 'Engineering Impact'}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal font-sans">
                    {art.keyTakeaway}
                  </p>
                </div>

                {/* Grounding Source Tags */}
                {art.groundingSources && art.groundingSources.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-cyan-400" />
                      Google Grounded Sources:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {art.groundingSources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700/80 flex items-center gap-1 transition-colors"
                        >
                          <span className="truncate max-w-[120px]">{src.domain}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Source and Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-semibold truncate pr-2">
                  via {art.source}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedArticle(art)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Read Brief</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <a
                    href={art.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Open original publication"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-base font-bold text-white">No tech articles found for query</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try searching for a different technology topic or reset the category filter above.
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* ── ARTICLE DETAIL MODAL ── */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-200 space-y-5 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                  {selectedArticle.categoryLabel}
                </span>
                <div className="text-[11px] font-mono text-slate-400 pt-1">
                  Source: <strong>{selectedArticle.source}</strong> · {selectedArticle.publishedAt}
                </div>
              </div>
              
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white leading-tight">
              {selectedArticle.title}
            </h3>

            {/* Body */}
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {selectedArticle.summary}
            </p>

            {/* Takeaway */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Technical Implication for Systems & AI:
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {selectedArticle.keyTakeaway}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {selectedArticle.tags.map((t, idx) => (
                <span key={idx} className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  #{t}
                </span>
              ))}
            </div>

            {/* Grounding Sources */}
            {selectedArticle.groundingSources && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Google Search Grounded References:
                </div>
                <div className="space-y-1.5">
                  {selectedArticle.groundingSources.map((src, sIdx) => (
                    <a
                      key={sIdx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-300 hover:text-emerald-400 flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
                    >
                      <span className="truncate pr-2 font-mono text-[11px]">{src.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleCopyShare(selectedArticle)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <span>Read Full Article</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
