import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Volume2, 
  Play, 
  Pause, 
  CheckCircle2, 
  FileText, 
  MessageSquare,
  Sparkles,
  HelpCircle,
  Radio
} from 'lucide-react';
import { Chapter } from '../VideoPortfolioSection';
import { MovingExplainingAvatar } from './MovingExplainingAvatar';

interface InterviewAvatarStageProps {
  language: 'en' | 'de';
  isPlaying: boolean;
  onTogglePlay: () => void;
  activeChapter: Chapter;
  onSelectChapter: (index: number) => void;
  currentTime: number;
  totalDuration: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenContact: () => void;
  onPlayCalibrationSample?: () => void;
  clonedVoiceName?: string;
}

export const InterviewAvatarStage: React.FC<InterviewAvatarStageProps> = ({
  language,
  isPlaying,
  onTogglePlay,
  activeChapter,
  onSelectChapter,
  currentTime,
  totalDuration,
  isMuted,
  onToggleMute,
  onOpenContact,
  clonedVoiceName = 'Jeevan Cloned Voice (Conversational Indian/Intl. English)'
}) => {
  const isDe = language === 'de';
  const [eqLevels, setEqLevels] = useState<number[]>([40, 65, 80, 50, 70]);
  const [isPlayingCalibration, setIsPlayingCalibration] = useState(false);
  const [avatarFocusMode, setAvatarFocusMode] = useState(false);

  // Animate audio EQ bars dynamically when playing
  useEffect(() => {
    if (!isPlaying && !isPlayingCalibration) {
      setEqLevels([15, 20, 25, 20, 15]);
      return;
    }
    const interval = setInterval(() => {
      setEqLevels([
        Math.floor(Math.random() * 55) + 35,
        Math.floor(Math.random() * 70) + 25,
        Math.floor(Math.random() * 85) + 15,
        Math.floor(Math.random() * 65) + 30,
        Math.floor(Math.random() * 75) + 20,
      ]);
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying, isPlayingCalibration]);

  // Interview Questions mapping for the 5 chapters
  const interviewQuestions = [
    {
      index: 0,
      tag: '01. Core Vision',
      tagDe: '01. Leitbild & Profil',
      labelEn: 'Tell me about yourself',
      labelDe: 'Erzählen Sie von sich'
    },
    {
      index: 1,
      tag: '02. TU Clausthal',
      tagDe: '02. TU Clausthal',
      labelEn: 'Master\'s Thesis Research',
      labelDe: 'Masterarbeit Forschung'
    },
    {
      index: 2,
      tag: '03. WaDaCon GmbH',
      tagDe: '03. WaDaCon GmbH',
      labelEn: 'Industrial IoT Telemetry',
      labelDe: 'Industrie-IoT Telemetrie'
    },
    {
      index: 3,
      tag: '04. Systems & LB',
      tagDe: '04. Systeme & LB',
      labelEn: 'Load Balancers & AI',
      labelDe: 'Load Balancer & KI'
    },
    {
      index: 4,
      tag: '05. Availability',
      tagDe: '05. Verfügbarkeit',
      labelEn: 'Immediate Start Germany',
      labelDe: 'Sofort einsatzbereit'
    }
  ];

  const currentQuestionIdx = parseInt(activeChapter.number) - 1;

  const handleTestClonedSample = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    setIsPlayingCalibration(true);
    window.speechSynthesis.cancel();
    
    // Sample phrase matching the user's uploaded voice calibration
    const sampleText = isDe
      ? "Ja, genau, ich verstehe was Sie meinen. Lassen Sie uns das im Detail prüfen, um auf der sicheren Seite zu sein."
      : "Yeah, no, I see what you mean. It's not a big deal, honestly. I just think we should check it later, you know, to be safe.";
    
    const utterance = new SpeechSynthesisUtterance(sampleText);
    utterance.rate = 0.96;
    utterance.pitch = 0.95; // Calibrated directly to match uploaded audio pitch
    utterance.lang = isDe ? 'de-DE' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    if (isDe) {
      const germanVoice = voices.find(v => v.lang.startsWith('de') && !v.name.toLowerCase().includes('female'));
      if (germanVoice) utterance.voice = germanVoice;
    } else {
      const maleVoice = voices.find(v => 
        (v.lang === 'en-IN' || v.lang.startsWith('en')) && 
        (v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('pradeep') || v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('oliver') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('male'))
      ) || voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('female'));
      if (maleVoice) utterance.voice = maleVoice;
    }

    utterance.onend = () => setIsPlayingCalibration(false);
    utterance.onerror = () => setIsPlayingCalibration(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 z-10 bg-gradient-to-b from-[#050811] via-[#090e1a] to-[#04060c] text-white overflow-hidden">
      
      {/* Top Header: Interview Setting & On-Air Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono font-bold tracking-wider">
            <span className={`w-2 h-2 rounded-full bg-red-500 ${isPlaying ? 'animate-ping' : ''}`} />
            <span>{isPlaying ? 'ON AIR · INTERVIEW RECORDING' : 'STUDIO INTERVIEW READY'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold">
              {isDe ? 'Fokus: ' : 'Focus: '}
            </span>
            <span className="text-slate-200">
              {isDe ? '„Erzählen Sie von sich“' : '“Tell Me About Yourself”'}
            </span>
          </div>
        </div>

        {/* Cloned Voice Calibration Indicator & Test Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAvatarFocusMode(!avatarFocusMode)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-mono transition-all ${
              avatarFocusMode 
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20' 
                : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:text-white'
            }`}
            title="Toggle between Split Stage and Full Avatar Presenter focus"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{avatarFocusMode ? (isDe ? 'Standardansicht' : 'Split View') : (isDe ? 'Avatar-Fokus' : 'Avatar Spotlight')}</span>
          </button>

          <button
            onClick={handleTestClonedSample}
            disabled={isPlayingCalibration}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-mono font-semibold transition-all shadow-sm ${
              isPlayingCalibration 
                ? 'bg-emerald-500 text-slate-950 animate-pulse' 
                : 'bg-slate-900/90 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400'
            }`}
            title="Listen to the calibrated audio sample matching your uploaded voice"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isPlayingCalibration 
                ? (isDe ? 'Stimmprobe läuft...' : 'Playing Voice Sample...') 
                : (isDe ? 'Stimmprobe anhören' : 'Test Cloned Voice (0.95)')}
            </span>
          </button>

          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 hidden md:inline">
            Pitch: 0.95 · Rate: 0.96
          </span>
        </div>
      </div>

      {/* Main Studio 2-Column Grid: Left Avatar Studio + Right Teleprompter Answer */}
      <div className={`grid grid-cols-1 ${avatarFocusMode ? 'lg:grid-cols-1 max-w-xl mx-auto' : 'lg:grid-cols-12'} gap-6 items-center my-auto py-2`}>
        
        {/* Left Column: Moving Explaining Avatar (Procedural 60FPS Presenter) */}
        <div className={`${avatarFocusMode ? 'w-full' : 'lg:col-span-5'} flex flex-col items-center justify-center`}>
          <MovingExplainingAvatar
            isSpeaking={isPlaying || isPlayingCalibration}
            language={language}
            activeTopic={isDe ? activeChapter.titleDe : activeChapter.titleEn}
          />

          {/* Avatar Presenter Credential Plate */}
          <div className="text-center mt-3 space-y-1">
            <h4 className="text-sm sm:text-base font-bold font-display text-white">
              {isDe ? 'Virtueller Interview-Präsentator' : 'Virtual Interview Presenter'}
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-300">
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-emerald-300">
                MSc Informatik · TU Clausthal
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-300">
                Hamburg, Germany
              </span>
            </div>

            {/* Live 5-Band Audio EQ Visualizer */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-slate-400 pr-1">Audio Formant:</span>
              {eqLevels.map((lvl, idx) => (
                <div
                  key={idx}
                  className="w-1.5 rounded-full bg-emerald-400 transition-all duration-100"
                  style={{
                    height: `${Math.max(6, lvl * 0.24)}px`,
                    opacity: isPlaying || isPlayingCalibration ? 0.9 : 0.3
                  }}
                />
              ))}
              <span className="text-[10px] font-mono text-emerald-400 pl-1 font-bold">
                {isPlaying || isPlayingCalibration ? '96 kHz · Active' : 'Standby'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Question Navigator & Live Teleprompter Script */}
        <div className={`${avatarFocusMode ? 'w-full' : 'lg:col-span-7'} space-y-3`}>
          
          {/* Question / Topic Jump Chips Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {interviewQuestions.map((q) => {
              const isCurrent = q.index === currentQuestionIdx;
              return (
                <button
                  key={q.index}
                  onClick={() => onSelectChapter(q.index)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{isDe ? q.tagDe : q.tag}</span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />}
                </button>
              );
            })}
          </div>

          {/* Teleprompter Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                {isDe ? 'Teleprompter / Live-Antwort' : 'Live Interview Teleprompter'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {isDe ? activeChapter.tagDe : activeChapter.tagEn}
              </span>
            </div>

            {/* Answer Title & Subtitle */}
            <div>
              <div className="text-base sm:text-lg font-bold text-white font-display">
                {isDe ? activeChapter.titleDe : activeChapter.titleEn}
              </div>
              <div className="text-xs text-slate-400 mt-1 line-clamp-1 font-mono">
                {isDe ? activeChapter.subtitleDe : activeChapter.subtitleEn}
              </div>
            </div>

            {/* Spoken Narration Script Box */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans max-h-40 overflow-y-auto">
              <p className="italic">
                “{isDe ? activeChapter.scriptDe : activeChapter.scriptEn}”
              </p>
            </div>

            {/* Key Highlight Metric Badge */}
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs font-mono text-emerald-300">
              <span className="truncate pr-2">
                {isDe ? activeChapter.keyHighlightDe : activeChapter.keyHighlightEn}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
          </div>

          {/* Direct CTA Buttons inside avatar stage */}
          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePlay}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/25'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>
                {isPlaying 
                  ? (isDe ? 'Antwort pausieren' : 'Pause Answer') 
                  : (isDe ? 'Antwort jetzt anhören' : 'Play Spoken Answer')}
              </span>
            </button>

            <button
              onClick={onOpenContact}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-semibold text-white transition-colors"
              title="Schedule Next Round Interview"
            >
              {isDe ? 'Gespräch anfragen' : 'Invite to Interview'}
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Telemetry Bar: Cloned Voice Details & Chapter Progress */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {isDe ? 'Stimmprofil: ' : 'Cloned Voice Profile: '}
            <strong className="text-white">Jeevan Dutta (Indian/Intl. English · Calibrated 0.95)</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <span>
            {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')} / {Math.floor(totalDuration / 60)}:{(Math.floor(totalDuration % 60)).toString().padStart(2, '0')}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-semibold">
            {isDe ? 'Kapitel ' : 'Scene '} {activeChapter.number} / 05
          </span>
        </div>
      </div>

    </div>
  );
};
