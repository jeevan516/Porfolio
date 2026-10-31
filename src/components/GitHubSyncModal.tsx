/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Github,
  Copy,
  Check,
  Terminal,
  Key,
  ExternalLink,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime, playTactileClick } from '../services/soundFx';
import { useModalA11y } from '../services/useModalA11y';
import { copyText } from '../services/clientUtils';
import { ui } from '../services/uiClasses';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'de';
}

const isLocalHost = () =>
  typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/.test(window.location.hostname);

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({ isOpen, onClose, language = 'en' }) => {
  const isDe = language === 'de';
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<{ type: 'idle' | 'success' | 'error' | 'unavailable'; message: string }>({
    type: 'idle',
    message: '',
  });
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    if (!isPushing) onClose();
  };
  useModalA11y(isOpen, handleClose, dialogRef);

  const repoWebUrl = 'https://github.com/jeevan516/jeevan-Dutta';
  const websiteUrl = 'https://jeevan516.github.io/jeevan-Dutta/';
  const localDev = isLocalHost();

  if (!isOpen) return null;

  const handleCopy = async (text: string, id: string) => {
    playTactileClick();
    if (await copyText(text)) {
      setCopiedCmd(id);
      window.setTimeout(() => setCopiedCmd(null), 2500);
    }
  };

  const unavailableMessage = isDe
    ? 'Der Direkt-Push benötigt den lokalen Entwicklungsserver (npm run dev). Auf der veröffentlichten statischen Seite gibt es kein Backend – bitte den Terminal-Befehl unten verwenden.'
    : 'Direct push needs the local dev server (npm run dev). The published static site has no backend — use the terminal command below instead.';

  const handleDirectPush = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = tokenInput.trim();
    if (!token) return;

    setIsPushing(true);
    setPushStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      // Static hosting returns 404 / 405 or index.html — not JSON.
      const isJson = (res.headers.get('content-type') || '').includes('application/json');
      if (!isJson) {
        setPushStatus({ type: 'unavailable', message: unavailableMessage });
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setTokenInput('');
        setPushStatus({
          type: 'success',
          message: isDe
            ? 'Erfolgreich gepusht. GitHub Pages baut die Website jetzt neu.'
            : 'Pushed successfully. GitHub Pages is now rebuilding the site.',
        });
        playSuccessChime();
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      } else {
        setPushStatus({
          type: 'error',
          message: data.error || (isDe ? 'Push fehlgeschlagen. Bitte Token-Berechtigungen prüfen.' : 'Push failed. Please check token permissions.'),
        });
      }
    } catch {
      setPushStatus({ type: 'unavailable', message: unavailableMessage });
    } finally {
      setIsPushing(false);
    }
  };

  const commandOneLiner = `git push origin main gh-pages`;

  return (
    <div className={ui.overlay} onMouseDown={(e) => e.target === e.currentTarget && handleClose()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="github-sync-title"
        tabIndex={-1}
        className={`${ui.panel} max-w-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white shrink-0">
              <Github className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 id="github-sync-title" className="text-base font-bold font-display text-white">
                {isDe ? 'Website mit GitHub synchronisieren' : 'Sync website to GitHub'}
              </h3>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs text-emerald-400 hover:underline font-mono truncate block rounded ${ui.focusRing}`}
              >
                {websiteUrl.replace('https://', '')}
              </a>
            </div>
          </div>
          <button type="button" onClick={handleClose} className={ui.iconBtn} aria-label={isDe ? 'Schließen' : 'Close GitHub sync'}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {!localDev && (
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>{unavailableMessage}</p>
            </div>
          )}

          {pushStatus.type === 'success' && (
            <div role="status" className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs text-emerald-100 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {isDe ? 'Änderungen gepusht' : 'Changes pushed'}
              </div>
              <p>{pushStatus.message}</p>
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className={`${ui.btnPrimary} !py-2`}>
                  {isDe ? 'Website öffnen' : 'Open website'}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a href={`${repoWebUrl}/actions`} target="_blank" rel="noopener noreferrer" className={`${ui.btnSecondary} !py-2`}>
                  {isDe ? 'Build ansehen' : 'View build'}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {(pushStatus.type === 'error' || pushStatus.type === 'unavailable') && (
            <div role="alert" className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{pushStatus.message}</p>
            </div>
          )}

          {/* Direct push (local dev only) */}
          <section className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-3">
            <h4 className="font-semibold text-sm text-white flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              {isDe ? 'Direkt-Push mit Token' : 'Direct push with token'}
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {isDe ? 'nur lokal' : 'local dev only'}
              </span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isDe
                ? 'Personal Access Token mit Schreibrechten eingeben. Der lokale Server pusht main und gh-pages; der Token wird nicht gespeichert.'
                : 'Enter a Personal Access Token with repo write access. The local server pushes main and gh-pages; the token is not stored.'}
            </p>

            <form onSubmit={handleDirectPush} className="space-y-3">
              <div className="relative">
                <label htmlFor="github-token" className="sr-only">
                  GitHub Personal Access Token
                </label>
                <input
                  id="github-token"
                  type={showToken ? 'text' : 'password'}
                  autoComplete="off"
                  spellCheck={false}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="ghp_… or github_pat_…"
                  disabled={!localDev}
                  className={`${ui.input} font-mono pr-11 disabled:opacity-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  disabled={!localDev}
                  aria-label={showToken ? (isDe ? 'Token verbergen' : 'Hide token') : isDe ? 'Token anzeigen' : 'Show token'}
                  className={`absolute right-1 top-1/2 -translate-y-1/2 ${ui.iconBtn} disabled:opacity-50`}
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=Portfolio+Push"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${ui.btnGhost} text-emerald-400`}
                >
                  <Key className="w-3.5 h-3.5" />
                  {isDe ? 'Token erstellen' : 'Create a token'}
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button type="submit" disabled={!localDev || isPushing || !tokenInput.trim()} className={ui.btnPrimary}>
                  {isPushing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      {isDe ? 'Pushe…' : 'Pushing…'}
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      {isDe ? 'Pushen & deployen' : 'Push & deploy'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Terminal */}
          <section className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              {isDe ? 'Alternative: Terminal' : 'Alternative: terminal'}
            </h4>
            <div className="p-2 pl-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 flex items-center justify-between gap-3">
              <code className="truncate">{commandOneLiner}</code>
              <button type="button" onClick={() => handleCopy(commandOneLiner, 'oneliner')} className={`${ui.btnSecondary} !px-3 !py-1.5 shrink-0`}>
                {copiedCmd === 'oneliner' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCmd === 'oneliner' ? (isDe ? 'Kopiert' : 'Copied') : isDe ? 'Kopieren' : 'Copy'}
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-slate-800 flex justify-end">
          <button type="button" onClick={handleClose} className={`${ui.btnSecondary} !py-2`}>
            {isDe ? 'Schließen' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
