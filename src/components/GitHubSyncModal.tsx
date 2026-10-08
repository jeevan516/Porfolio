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
  Lock
} from 'lucide-react';

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
  const repoUrl = 'https://github.com/jeevan516/jeevan-Dutta.git';

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const commandOneLiner = `git push https://<YOUR_GITHUB_TOKEN>@github.com/jeevan516/jeevan-Dutta.git main`;
  const commandGitRemote = `git remote set-url origin https://<YOUR_GITHUB_TOKEN>@github.com/jeevan516/jeevan-Dutta.git\ngit push origin main`;
  const commandBundlePull = `git pull ./public/portfolio-update.bundle main`;

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
                <span>{isDe ? 'GitHub Repository Synchronisation' : 'GitHub Repository Sync & Push'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  v2.4 READY
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Target: <span className="text-emerald-400">{repoUrl}</span>
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
          
          {/* Security Notice Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                <span>{isDe ? 'Sicherheitsrichtlinie & Zero-Trust Hygiene' : 'Security & Zero-Trust Token Policy'}</span>
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-slate-300 leading-relaxed font-light">
                {isDe 
                  ? 'Alle Quellcodedateien, das lively Avatar-Modul, die Load-Balancer-Simulation und Sicherheitsfeatures sind im lokalen Git-Repository fertig vorbereitet und bereinigt. Da GitHub seit August 2021 Passwörter deaktiviert hat, erfordert ein Push zu Ihrem privaten Repository einen persönlichen GitHub-Token (PAT) mit repo-Rechten.'
                  : 'All portfolio enhancements, the ultra-lively 60FPS avatar rig, interactive load balancers, and security protections are committed and staged locally. To push to your GitHub repository, authenticate using your GitHub Personal Access Token (PAT) with repo write permissions.'}
              </p>
            </div>
          </div>

          {/* Quick Push Method 1: Instant Terminal Command */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                {isDe ? 'Methode 1: Direkter Push-Befehl mit Ihrem Token' : 'Method 1: Direct 1-Line Push with Token'}
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
            <p className="text-[11px] text-slate-400 italic">
              {isDe 
                ? 'Ersetzen Sie <YOUR_GITHUB_TOKEN> durch Ihren GitHub Classic Token (ghp_...) oder Fine-Grained Token.'
                : 'Replace <YOUR_GITHUB_TOKEN> with your personal access token (starts with ghp_... or github_pat_...).'}
            </p>
          </div>

          {/* Quick Push Method 2: Configure Origin & Push */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="font-bold flex items-center gap-1.5 text-cyan-400">
                <GitBranch className="w-3.5 h-3.5" />
                {isDe ? 'Methode 2: Authentifizierte Remote-URL setzen' : 'Method 2: Set Authenticated Remote URL'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 flex items-center justify-between gap-3">
              <pre className="truncate overflow-x-auto select-all text-[11px]">
                {commandGitRemote}
              </pre>
              <button
                onClick={() => handleCopy(commandGitRemote, 'remote')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-sans font-semibold shrink-0 flex items-center gap-1 transition-all"
              >
                {copiedCmd === 'remote' ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'remote' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Quick Push Method 3: Download Patch & Bundle */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="font-bold flex items-center gap-1.5 text-white">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                {isDe ? 'Methode 3: Vorbereitetes Git Bundle herunterladen' : 'Method 3: Download Complete Git Update Bundle'}
              </span>
              <span className="text-[10px] text-emerald-400">Standalone Archive</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              {isDe 
                ? 'Laden Sie das Git-Bundle oder Patch herunter und wenden Sie es mit einem einzigen Befehl lokal an:'
                : 'Download the prepared offline Git Bundle file containing every commit and all source files:'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href="./portfolio-update.bundle"
                download="portfolio-update.bundle"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDe ? 'Git Bundle herunterladen (.bundle)' : 'Download Git Bundle (.bundle)'}</span>
              </a>

              <a
                href="./update-portfolio.patch"
                download="update-portfolio.patch"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Patch (.patch)</span>
              </a>

              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=Jeevan+Portfolio+Push"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 text-xs font-semibold flex items-center gap-1.5 transition-all ml-auto"
              >
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>Create GitHub Token</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Branch: main · Ready for Push
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
