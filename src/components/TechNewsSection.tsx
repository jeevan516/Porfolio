import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  Share2,
  Check,
  ArrowRight,
  X,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { TechNewsArticle, TechNewsCategory, CURATED_TECH_NEWS, filterCuratedNews } from '../services/techNewsData';
import { fetchApiJson, copyText } from '../services/clientUtils';
import { useModalA11y } from '../services/useModalA11y';
import { ui } from '../services/uiClasses';

interface TechNewsSectionProps {
  language?: 'en' | 'de';
}

interface TechNewsResponse {
  success?: boolean;
  articles?: TechNewsArticle[];
  fallback?: boolean;
}

export const TechNewsSection: React.FC<TechNewsSectionProps> = ({ language = 'en' }) => {
  const isDe = language === 'de';

  const [articles, setArticles] = useState<TechNewsArticle[]>(CURATED_TECH_NEWS);
  const [activeCategory, setActiveCategory] = useState<TechNewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // true = live grounded results from the dev API; false = curated client-side set
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<TechNewsArticle | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Once the API has failed (static hosting), stop hitting the network and filter locally.
  const apiAvailable = useRef<boolean>(true);
  const requestId = useRef(0);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const closeModal = useCallback(() => setSelectedArticle(null), []);
  useModalA11y(!!selectedArticle, closeModal, modalRef);

  const fetchNews = useCallback(async (cat: TechNewsCategory, query: string, force = false) => {
    const id = ++requestId.current;

    if (!apiAvailable.current && !force) {
      setArticles(filterCuratedNews(cat, query));
      setIsLive(false);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat !== 'all') params.set('category', cat);
      if (query.trim()) params.set('query', query.trim());
      const qs = params.toString();
      const data = await fetchApiJson<TechNewsResponse>(`/api/tech-news${qs ? `?${qs}` : ''}`);
      if (!Array.isArray(data.articles)) throw new Error('Malformed response');
      if (id !== requestId.current) return;
      apiAvailable.current = true;
      setArticles(data.articles);
      setIsLive(!data.fallback);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      if (id !== requestId.current) return;
      apiAvailable.current = false;
      setArticles(filterCuratedNews(cat, query));
      setIsLive(false);
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(activeCategory, searchQuery);
    // search is applied on submit (or live when offline, below)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, fetchNews]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Without the API, filtering is instant, so apply it as the user types.
    if (!apiAvailable.current) setArticles(filterCuratedNews(activeCategory, value));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews(activeCategory, searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchNews(activeCategory, '');
  };

  const resetFilters = () => {
    setSearchQuery('');
    if (activeCategory === 'all') fetchNews('all', '');
    else setActiveCategory('all');
  };

  const handleCopyShare = async (art: TechNewsArticle) => {
    const ok = await copyText(`${art.title} - ${art.sourceUrl}`);
    if (!ok) return;
    setCopiedLink(true);
    window.setTimeout(() => setCopiedLink(false), 2000);
  };

  const categories: { id: TechNewsCategory; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: isDe ? 'Alle' : 'All', icon: Globe },
    { id: 'ai', label: 'AI & Models', icon: Sparkles },
    { id: 'cloud', label: 'Cloud & Infra', icon: Cloud },
    { id: 'iot', label: 'Industrial IoT', icon: Radio },
    { id: 'chips', label: 'Semiconductors', icon: Cpu },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <section id="tech-news" className="py-20 sm:py-24 border-t border-slate-800/80 relative overflow-hidden text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/70 text-[11px] font-mono text-slate-400">
              <span className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              {isLive
                ? isDe ? 'Live · Google Search Grounding' : 'Live · Google Search grounded'
                : isDe ? 'Kuratierte Auswahl' : 'Curated briefing'}
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              {isDe ? 'Technologie-' : 'Technology '}
              <span className="text-emerald-400">{isDe ? 'Nachrichten' : 'News'}</span>
            </h2>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {isDe
                ? 'Entwicklungen zu KI, Cloud-Infrastruktur, industriellem IoT, Halbleitern und Sicherheit – mit Einordnung aus Ingenieurssicht.'
                : 'Developments across AI, cloud infrastructure, industrial IoT, semiconductors and security — with an engineering takeaway for each.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && isLive && (
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                {isDe ? 'Aktualisiert' : 'Updated'} {lastUpdated}
              </span>
            )}
            <button
              type="button"
              onClick={() => fetchNews(activeCategory, searchQuery, true)}
              disabled={isLoading}
              className={ui.btnSecondary}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? (isDe ? 'Lädt…' : 'Loading…') : isDe ? 'Aktualisieren' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center gap-4">
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar"
            role="toolbar"
            aria-label={isDe ? 'Kategorien' : 'News categories'}
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(cat.id)}
                  className={ui.chip(isActive)}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-sm lg:ml-auto" role="search">
            <label htmlFor="tech-news-search" className="sr-only">
              {isDe ? 'Nachrichten durchsuchen' : 'Search news'}
            </label>
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="tech-news-search"
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={isDe ? 'z. B. Kubernetes, TSMC, Zero-Trust' : 'e.g. Kubernetes, TSMC, zero-trust'}
              className={`${ui.input} pl-9 pr-24 [&::-webkit-search-cancel-button]:hidden`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label={isDe ? 'Suche löschen' : 'Clear search'}
                className={`absolute right-[4.5rem] top-1/2 -translate-y-1/2 !h-7 !w-7 ${ui.iconBtn}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 !px-3 !py-1.5 ${ui.btnPrimary}`}
            >
              {isDe ? 'Suchen' : 'Search'}
            </button>
          </form>
        </div>

        {/* Articles */}
        {articles.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy={isLoading}>
            <AnimatePresence mode="popLayout">
              {articles.map((art, aIdx) => (
                <motion.article
                  key={art.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, delay: Math.min(aIdx, 6) * 0.04 }}
                  className="group p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-colors flex flex-col"
                >
                  <div className="flex items-center justify-between gap-3 text-[11px] font-mono text-slate-500 mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {art.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold font-display text-white leading-snug mb-2">{art.title}</h3>

                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4">{art.summary}</p>

                  <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500 truncate font-mono text-[11px]">{art.source}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => setSelectedArticle(art)} className={`${ui.btnGhost} text-emerald-400`}>
                        {isDe ? 'Details' : 'Read brief'}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <a
                        href={art.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={ui.iconBtn}
                        aria-label={`${isDe ? 'Quelle öffnen' : 'Open source'}: ${art.source}`}
                        title={isDe ? 'Quelle öffnen' : 'Open source'}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <AlertCircle className="w-7 h-7 text-slate-500 mx-auto" />
            <h3 className="text-base font-semibold text-white">{isDe ? 'Keine Artikel gefunden' : 'No articles match your search'}</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              {isDe ? 'Versuchen Sie einen anderen Begriff oder setzen Sie die Filter zurück.' : 'Try a different term or reset the filters.'}
            </p>
            <button type="button" onClick={resetFilters} className={ui.btnPrimary}>
              {isDe ? 'Filter zurücksetzen' : 'Reset filters'}
            </button>
          </div>
        )}
      </div>

      {/* Article detail modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={ui.overlay}
            onClick={closeModal}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="tech-news-modal-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`${ui.panel} max-w-2xl p-5 sm:p-8 space-y-5`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {selectedArticle.categoryLabel}
                  </span>
                  <h3 id="tech-news-modal-title" className="text-xl sm:text-2xl font-bold font-display text-white leading-tight">
                    {selectedArticle.title}
                  </h3>
                  <div className="text-xs font-mono text-slate-500">
                    {selectedArticle.source} · {selectedArticle.publishedAt} · {selectedArticle.readTime}
                  </div>
                </div>
                <button type="button" onClick={closeModal} className={ui.iconBtn} aria-label={isDe ? 'Schließen' : 'Close'}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{selectedArticle.summary}</p>

              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/25 space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {isDe ? 'Einordnung für Ingenieure' : 'Engineering takeaway'}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{selectedArticle.keyTakeaway}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedArticle.tags.map((t) => (
                  <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    #{t}
                  </span>
                ))}
              </div>

              {selectedArticle.groundingSources && selectedArticle.groundingSources.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    {isDe ? 'Referenzen' : 'References'}
                  </div>
                  <div className="space-y-1.5">
                    {selectedArticle.groundingSources.map((src) => (
                      <a
                        key={src.url + src.title}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 hover:text-emerald-300 hover:border-slate-700 transition-colors ${ui.focusRing}`}
                      >
                        <span className="truncate">{src.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <button type="button" onClick={() => handleCopyShare(selectedArticle)} className={ui.btnSecondary}>
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? (isDe ? 'Link kopiert' : 'Link copied') : isDe ? 'Link kopieren' : 'Copy link'}</span>
                </button>
                <a href={selectedArticle.sourceUrl} target="_blank" rel="noopener noreferrer" className={ui.btnPrimary}>
                  <span>{isDe ? 'Originalartikel lesen' : 'Read full article'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
