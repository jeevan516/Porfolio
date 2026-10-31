/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Github, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  ShieldCheck, 
  Key, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  AlertCircle,
  GitBranch,
  RefreshCw,
  Lock,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime, playTactileClick } from '../services/soundFx';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'de';
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  language = 'en'
}) => {
  const isDe = language === 'de';
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  const repoUrl = 'https://github.com/jeevan516/jeevan-Dutta.git';
  const websiteUrl = 'https://jeevan516.github.io/jeevan-Dutta/#';

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    playTactileClick();
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

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
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPushStatus({
          type: 'success',
          message: isDe
            ? 'Erfolgreich zum GitHub Repository gepusht! GitHub Pages baut und aktualisiert Ihre Website automatisch in ca. 60 Sekunden.'
            : 'Successfully pushed to GitHub! GitHub Pages workflow is now building and deploying your live site automatically.'
        });
        playSuccessChime();
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        setPushStatus({
          type: 'error',
          message: data.error || (isDe ? 'Push fehlgeschlagen. Bitte überprüfen Sie Ihr Token.' : 'Push failed. Please check token permissions.')
        });
      }
    } catch (err: any) {
      setPushStatus({
        type: 'error',
        message: err?.message || 'Network error occurred while pushing.'
      });
    } finally {
      setIsPushing(false);
    }
  };

  const commandOneLiner = `git push https://<YOUR_GITHUB_TOKEN>@github.com/jeevan516/jeevan-Dutta.git main gh-pages`;
  const commandGitRemote = `git remote set-url origin https://<YOUR_GITHUB_TOKEN>@github.com/jeevan516/jeevan-Dutta.git\ngit push origin main\ngit push origin gh-pages`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-emerald-500/10 overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display text-white flex items-center gap-2">
                <span>{isDe ? 'Website Synchronisation & GitHub Push' : 'Website Sync & GitHub Push'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  LIVE READY
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Target: <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{websiteUrl}</a>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Status Alert if push just happened */}
          {pushStatus.type === 'success' && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-xs text-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{isDe ? 'Website erfolgreich aktualisiert!' : 'Changes Pushed Successfully!'}</span>
              </div>
              <p className="leading-relaxed">{pushStatus.message}</p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5"
                >
                  <span>Open Live Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://github.com/jeevan516/jeevan-Dutta/actions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-300 hover:underline flex items-center gap-1"
                >
                  <span>View GitHub Actions Build</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {pushStatus.type === 'error' && (
            <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-xs text-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-white">Push Error</div>
                <p className="font-mono text-[11px] leading-relaxed">{pushStatus.message}</p>
              </div>
            </div>
          )}

          {/* Direct One-Click Push Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs font-mono text-emerald-400 flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                {isDe ? '1-Klick Direkt-Push mit Token' : '1-Click Push to Website via GitHub Token'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Recommended
              </span>
            </div>

            <p className="text-xs text-slate-300 font-light">
              {isDe 
                ? 'Geben Sie Ihren GitHub Personal Access Token (PAT) ein, um alle Änderungen direkt auf branch main zu übertragen. GitHub Pages baut und aktualisiert Ihre Website dann automatisch.'
                : 'Enter your GitHub Personal Access Token (PAT) with repo write permissions to push directly to main. The GitHub Actions workflow will instantly deploy to your live website.'}
            </p>

            <form onSubmit={handleDirectPush} className="space-y-3">
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_xxxx..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 text-xs font-mono text-white placeholder-slate-500 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=Jeevan+Portfolio+Push"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Key className="w-3 h-3" />
                  <span>Generate token on GitHub (10s)</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>

                <button
                  type="submit"
                  disabled={isPushing || !tokenInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all font-mono"
                >
                  {isPushing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Pushing to GitHub...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{isDe ? 'Jetzt zur Website pushen' : 'Push & Deploy to Website Now'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Alternative Method 1: Terminal Command */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                {isDe ? 'Alternative: Manueller Terminal-Befehl' : 'Alternative: Direct Terminal Command'}
              </span>
              <span className="text-[10px] text-slate-500">Terminal / Git Bash</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 flex items-center justify-between gap-3">
              <code className="truncate overflow-x-auto select-all">
                {commandOneLiner}
              </code>
              <button
                onClick={() => handleCopy(commandOneLiner, 'oneliner')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-sans font-semibold shrink-0 flex items-center gap-1 transition-all"
              >
                {copiedCmd === 'oneliner' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'oneliner' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Download Complete Bundle */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="font-bold flex items-center gap-1.5 text-white">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                {isDe ? 'Git Update Bundle herunterladen' : 'Download Complete Git Update Bundle'}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">717 KB Complete</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              {isDe 
                ? 'Enthält alle 19 aktualisierten Dateien, Motion Division Physik, Spotlight-Komponenten und den fertigen Commit:'
                : 'Contains all 19 updated files, Motion Division components, SpotlightCard, and the staged commit:'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href="./portfolio-update.bundle"
                download="portfolio-update.bundle"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Git Bundle (.bundle)</span>
              </a>

              <a
                href="./update-portfolio.patch"
                download="update-portfolio.patch"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Git Patch (.patch)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Commit: c2b923b on main · Ready to Sync
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-sans font-semibold transition-colors"
          >
            {isDe ? 'Schließen' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
