import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, MapPin, Clock, CheckCircle2, RefreshCw, Info, Monitor } from 'lucide-react';
import { fetchApiJson } from '../services/clientUtils';
import { ui } from '../services/uiClasses';

interface VisitorTrackerBlockProps {
  language?: 'en' | 'de';
}

interface VisitLog {
  id: string;
  timestamp: string;
  source: string;
  location: string;
  roleInterest: string;
}

interface ServerStats {
  totalVisits: number;
  todayVisits: number;
  recentVisits?: VisitLog[];
}

interface LocalStats {
  visits: number;
  firstVisit: string;
}

const LOCAL_KEY = 'jeevan_local_visit_stats';
const SESSION_LOCAL_KEY = 'jeevan_local_visit_counted';
const SESSION_SERVER_KEY = 'jeevan_server_visit_counted';

function safeGet(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage: Storage, key: string, value: string) {
  try {
    storage.setItem(key, value);
  } catch {
    // storage disabled (private mode etc.) — ignore
  }
}

/** Counts this browser's visits (once per browser session). Purely local, never presented as global traffic. */
function recordLocalVisit(): LocalStats {
  let stats: LocalStats = { visits: 0, firstVisit: new Date().toISOString() };
  const raw = safeGet(localStorage, LOCAL_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.visits === 'number' && typeof parsed?.firstVisit === 'string') stats = parsed;
    } catch {
      // ignore corrupt value
    }
  }
  if (!safeGet(sessionStorage, SESSION_LOCAL_KEY)) {
    stats = { ...stats, visits: stats.visits + 1 };
    safeSet(localStorage, LOCAL_KEY, JSON.stringify(stats));
    safeSet(sessionStorage, SESSION_LOCAL_KEY, '1');
  }
  return stats;
}

export const VisitorTrackerBlock: React.FC<VisitorTrackerBlockProps> = ({ language = 'en' }) => {
  const isDe = language === 'de';

  const [mode, setMode] = useState<'loading' | 'server' | 'local'>('loading');
  const [serverStats, setServerStats] = useState<ServerStats | null>(null);
  const [localStats, setLocalStats] = useState<LocalStats>(() => recordLocalVisit());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const data = await fetchApiJson<{ stats?: ServerStats }>('/api/tracker/stats');
      if (!data.stats || typeof data.stats.totalVisits !== 'number') throw new Error('Malformed stats');
      setServerStats(data.stats);
      setMode('server');
      return true;
    } catch {
      setMode('local');
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let interval: number | undefined;

    const init = async () => {
      // Register this session's visit with the dev API once per browser session.
      if (!safeGet(sessionStorage, SESSION_SERVER_KEY)) {
        safeSet(sessionStorage, SESSION_SERVER_KEY, '1');
        try {
          await fetchApiJson('/api/tracker/visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source: (document.referrer ? new URL(document.referrer).hostname : 'Direct visit').slice(0, 50),
              location: 'Not collected',
              interest: 'Profile view',
            }),
          });
        } catch {
          // static hosting — no backend; local fallback handles display
        }
      }
      if (cancelled) return;
      const ok = await fetchStats();
      if (!cancelled && ok) interval = window.setInterval(fetchStats, 30000);
    };

    init();
    return () => {
      cancelled = true;
      if (interval) window.clearInterval(interval);
    };
  }, [fetchStats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const ok = await fetchStats();
    if (!ok) setLocalStats(recordLocalVisit());
    setIsRefreshing(false);
  };

  const firstVisitLabel = (() => {
    try {
      return new Date(localStats.firstVisit).toLocaleDateString(isDe ? 'de-DE' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  })();

  const isServer = mode === 'server' && serverStats;

  const cards = isServer
    ? [
        {
          icon: Users,
          label: isDe ? 'Profilaufrufe gesamt' : 'Total profile views',
          value: serverStats.totalVisits.toLocaleString(),
          note: isDe ? 'Vom Portfolio-Server gezählt' : 'Counted by the portfolio server',
        },
        {
          icon: Activity,
          label: isDe ? 'Aufrufe heute' : 'Views today',
          value: serverStats.todayVisits.toLocaleString(),
          note: isDe ? 'Seit Mitternacht' : 'Since midnight',
        },
      ]
    : [
        {
          icon: Monitor,
          label: isDe ? 'Ihre Besuche' : 'Your visits',
          value: mode === 'loading' ? '…' : localStats.visits.toLocaleString(),
          note: isDe ? 'Nur in diesem Browser gezählt' : 'Counted in this browser only',
        },
        {
          icon: Clock,
          label: isDe ? 'Erster Besuch' : 'First visit',
          value: mode === 'loading' ? '…' : firstVisitLabel,
          note: isDe ? 'Lokal gespeichert, nicht übertragen' : 'Stored locally, never sent anywhere',
        },
      ];

  return (
    <section id="visitor-tracker" className="py-20 sm:py-24 border-t border-slate-800/80 relative text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/70 text-[11px] font-mono text-slate-400">
              <span className={`h-1.5 w-1.5 rounded-full ${isServer ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              {isServer
                ? isDe ? 'Server-Statistik' : 'Server statistics'
                : isDe ? 'Lokaler Zähler' : 'Local counter'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              {isDe ? 'Profil' : 'Profile '}
              <span className="text-emerald-400">{isDe ? 'besuche' : 'visits'}</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {isServer
                ? isDe
                  ? 'Aufrufe dieses Portfolios, wie sie vom Portfolio-Server erfasst werden.'
                  : 'Views of this portfolio as recorded by the portfolio server.'
                : isDe
                  ? 'Diese Seite ist statisch gehostet und erfasst keine Besucherdaten. Der Zähler unten gilt nur für Ihren Browser.'
                  : 'This site is statically hosted and does not collect visitor data. The counter below reflects your browser only.'}
            </p>
          </div>

          {isServer && (
            <button type="button" onClick={handleRefresh} disabled={isRefreshing} className={ui.btnSecondary}>
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isDe ? 'Aktualisieren' : 'Refresh'}
            </button>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2"
              >
                <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  {card.label}
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">{card.value}</div>
                <p className="text-xs text-slate-500">{card.note}</p>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/30 space-y-2 sm:col-span-2 lg:col-span-1"
          >
            <div className="text-xs font-medium text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {isDe ? 'Verfügbarkeit' : 'Availability'}
            </div>
            <div className="text-2xl font-bold font-display text-white tracking-tight">
              {isDe ? 'Sofort verfügbar' : 'Ready for work'}
            </div>
            <p className="text-xs text-slate-400">
              {isDe ? 'neuefische Bootcamp (KI, Data & SE) · Sofort verfügbar' : 'neuefische Bootcamp (AI, Data & SE) · Available immediately'}
            </p>
          </motion.div>
        </div>

        {/* Recent activity (server mode only) or honest note */}
        {isServer && serverStats.recentVisits && serverStats.recentVisits.length > 0 ? (
          <div className="rounded-2xl p-5 sm:p-6 bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-white mb-4">{isDe ? 'Letzte Aufrufe' : 'Recent views'}</h3>
            <ul className="divide-y divide-slate-800">
              {serverStats.recentVisits.slice(0, 5).map((log, idx) => (
                <li key={`${log.id}-${idx}`} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-200 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{log.source}</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] shrink-0">
                    <Clock className="w-3 h-3" />
                    {log.timestamp}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : mode === 'local' ? (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              {isDe
                ? 'Kein Tracking, keine Cookies: Der Zähler wird ausschließlich im localStorage Ihres Browsers gespeichert und kann jederzeit über die Browser-Einstellungen gelöscht werden.'
                : 'No tracking, no cookies: the counter lives only in your browser’s localStorage and can be cleared any time from your browser settings.'}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
};
