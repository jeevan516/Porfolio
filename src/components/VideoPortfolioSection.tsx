import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Maximize2, 
  Subtitles, 
  Languages, 
  Download, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles, 
  GraduationCap, 
  Cpu, 
  Activity, 
  Layers, 
  Mail, 
  FileText, 
  ChevronRight, 
  Sliders, 
  Share2, 
  Video, 
  Radio, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tv,
  Footprints,
  Mic,
  UserCheck
} from 'lucide-react';
import { PERSONAL_INFO, MASTER_THESIS_DETAILS } from '../data/portfolioData';
import { WalkingTrajectoryGraphic } from './graphics/WalkingTrajectoryGraphic';
import { InterviewAvatarStage } from './graphics/InterviewAvatarStage';
import { MovingExplainingAvatar } from './graphics/MovingExplainingAvatar';

interface VideoPortfolioSectionProps {
  onOpenContact: () => void;
  onOpenBrief: () => void;
  language?: VideoLanguage;
  onToggleLanguage?: () => void;
}

export type VideoLanguage = 'en' | 'de';

export interface Chapter {
  id: string;
  number: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  titleEn: string;
  titleDe: string;
  subtitleEn: string;
  subtitleDe: string;
  scriptEn: string;
  scriptDe: string;
  keyHighlightEn: string;
  keyHighlightDe: string;
  tagEn: string;
  tagDe: string;
  metrics: { labelEn: string; labelDe: string; value: string }[];
}

export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 'intro',
    number: '01',
    startTime: 0,
    duration: 24,
    titleEn: 'Executive Introduction & Core Vision',
    titleDe: 'Leitbild & Doppelte Kernkompetenz',
    subtitleEn: 'Bridging Data Intelligence & Resilient IT Infrastructure',
    subtitleDe: 'Verbindung von Datenintelligenz & robuster IT-Infrastruktur',
    scriptEn: "Hello, I'm Jeevan Dutta. As an IT Specialist and AI Engineer based in Hamburg, I specialize in bridging complex data intelligence with resilient, production-grade IT infrastructure. Over the past decade, I've transformed mission-critical sensor streams, industrial automation, and operational bottlenecks into high-uptime, intelligent digital systems.",
    scriptDe: "Guten Tag, mein Name ist Jeevan Dutta. Als IT-Spezialist und KI-Ingenieur mit Sitz in Hamburg verbinde ich moderne Datenintelligenz mit robuster, unternehmenskritischer IT-Infrastruktur. In den vergangenen zehn Jahren habe ich mich darauf spezialisiert, industrielle Sensordaten und betriebliche Prozesse in hochverfügbare, zukunftssichere Gesamtsysteme zu überführen.",
    keyHighlightEn: 'MSc Informatics (TU Clausthal) · Over a decade of hands-on technical execution',
    keyHighlightDe: 'MSc Informatik (TU Clausthal) · Über ein Jahrzehnt praktische IT-Erfahrung',
    tagEn: 'Executive Profile',
    tagDe: 'Profilübersicht',
    metrics: [
      { labelEn: 'Location', labelDe: 'Standort', value: 'Hamburg, Germany' },
      { labelEn: 'Discipline', labelDe: 'Schwerpunkt', value: 'Data × Infrastructure' },
      { labelEn: 'Availability', labelDe: 'Verfügbarkeit', value: 'Immediate / Sofort' }
    ]
  },
  {
    id: 'tu-clausthal',
    number: '02',
    startTime: 24,
    duration: 28,
    titleEn: 'Academic Rigor & TU Clausthal Research',
    titleDe: 'Akademische Exzellenz an der TU Clausthal',
    subtitleEn: 'ZanderLink 4-Node Deterministic Communication Network (VHDL / Vivado)',
    subtitleDe: 'Deterministisches 4-Knoten ZanderLink-Netzwerk (VHDL / Vivado)',
    scriptEn: "My academic foundation was built at Technische Universität Clausthal with an MSc in Informatics. Under the direct supervision of Prof. Dr. Christian Siemers, my Master's Thesis designed and simulated a 4-node ZanderLink communication network in VHDL using Xilinx Vivado. We achieved guaranteed deterministic reaction times under 12 microseconds across distributed PLCs with zero jitter and hardware-level CRC error detection.",
    scriptDe: "Mein wissenschaftliches Fundament bildet der Master of Science in Informatik an der TU Clausthal. Unter der Leitung von Prof. Dr. Christian Siemers entwickelte ich in meiner Masterarbeit ein deterministisches 4-Knoten-Kommunikationsnetzwerk in VHDL mit Xilinx Vivado. Wir erreichten garantierte Reaktionszeiten von unter 12 Mikrosekunden für verteilte SPS-Steuerungen – jitterfrei und mit hardwarenaher CRC-Fehlererkennung.",
    keyHighlightEn: '< 12 µs Guaranteed Deterministic Reaction Time · 1,086 Nets Synthesized',
    keyHighlightDe: '< 12 µs garantierte Reaktionszeit · 1.086 Netze synthetisiert',
    tagEn: 'Master Thesis Research',
    tagDe: 'Masterarbeit & Forschung',
    metrics: [
      { labelEn: 'Reaction Time', labelDe: 'Reaktionszeit', value: '< 12 µs' },
      { labelEn: 'Advisor', labelDe: 'Erstprüfer', value: 'Prof. Dr. C. Siemers' },
      { labelEn: 'Synthesis', labelDe: 'RTL-Synthese', value: '1,086 Nets / 832 Cells' }
    ]
  },
  {
    id: 'wadacon',
    number: '03',
    startTime: 52,
    duration: 28,
    titleEn: 'Industrial IoT & Observability at WaDaCon',
    titleDe: 'Industrielles IoT & Observability bei WaDaCon',
    subtitleEn: 'High-Frequency Sensor Ingest & 60% Quicker Incident Response in Hamburg',
    subtitleDe: 'Echtzeit-Sensordaten & 60% schnellere Störungsbehebung in Hamburg',
    scriptEn: "In the industrial field at WaDaCon GmbH in Hamburg, I architected high-performance observability pipelines for next-generation recycling machinery. By streaming sensor telemetry into InfluxDB, visualizing operational KPIs in Grafana, and orchestrating automated threshold alerts into MS Teams, we cut incident response time by over 60% and introduced predictive anomaly detection.",
    scriptDe: "In der industriellen Praxis bei der WaDaCon GmbH in Hamburg habe ich hochperformante Observability-Pipelines für moderne Recyclinganlagen aufgebaut. Durch kontinuierliches Sensor-Streaming in InfluxDB, KPI-Dashboards in Grafana und automatisierte Alerting-Pipelines in MS Teams konnten wir die Störungsreaktionszeiten um über 60 % senken und prädiktive Anomalie-Erkennung etablieren.",
    keyHighlightEn: '60% Faster Incident TTR · Edge Ingest · Automated Vibration Alerting',
    keyHighlightDe: '60% schnellere MTTR · Edge Ingest · Automatische Vibrationsüberwachung',
    tagEn: 'Production Impact',
    tagDe: 'Praxiserfolg & Industrie',
    metrics: [
      { labelEn: 'MTTR Reduction', labelDe: 'MTTR-Reduktion', value: '-60% Quicker' },
      { labelEn: 'Telemetry Stack', labelDe: 'Technologie-Stack', value: 'Grafana + InfluxDB' },
      { labelEn: 'Environment', labelDe: 'Umfeld', value: 'Industrial MRF IoT' }
    ]
  },
  {
    id: 'tech-stack',
    number: '04',
    startTime: 80,
    duration: 26,
    titleEn: 'End-to-End Systems & AI Engineering Mastery',
    titleDe: 'Ganzheitliche Systemarchitektur & KI-Entwicklung',
    subtitleEn: 'From Deep Learning Models & Load Balancers to Containerized Enterprise Infrastructure',
    subtitleDe: 'Vom Deep-Learning-Modell & Load Balancern bis zur containerisierten Unternehmensinfrastruktur',
    scriptEn: "My technical competencies span the full engineering lifecycle: from training LSTM neural networks for spatial-temporal trajectory forecasting to architecting HAProxy and NGINX load-balancing clusters with Keepalived VRRP failover, Dockerizing production edge stacks, and securing zero-trust Teleport SSH access. I don't build isolated prototypes; I deliver production-ready, highly available, and observable solutions.",
    scriptDe: "Mein technisches Profil umfasst den gesamten Lebenszyklus: von Deep-Learning- und LSTM-Modellen zur Trajektorienvorhersage über hochverfügbare HAProxy- und NGINX-Load-Balancer mit Keepalived VRRP-Failover bis hin zur Docker-Containerisierung und Teleport Zero-Trust SSH-Zugängen. Ich erstelle keine isolierten Prototypen, sondern überführe Systeme zuverlässig und ausfallsicher in den dauerhaften Produktivbetrieb.",
    keyHighlightEn: 'PyTorch · HAProxy Load Balancing · Docker & CI/CD · Keepalived VRRP · FastAPI · VHDL',
    keyHighlightDe: 'PyTorch · HAProxy Load-Balancer · Docker & CI/CD · Keepalived VRRP · FastAPI · VHDL',
    tagEn: 'Technical Competence',
    tagDe: 'Technische Kompetenz',
    metrics: [
      { labelEn: 'Core Stack', labelDe: 'Kernkompetenzen', value: 'AI / ML + DevOps' },
      { labelEn: 'Security', labelDe: 'Sicherheit', value: 'Zero-Trust Teleport' },
      { labelEn: 'Ownership', labelDe: 'Verantwortung', value: 'End-to-End Architecture' }
    ]
  },
  {
    id: 'availability',
    number: '05',
    startTime: 106,
    duration: 24,
    titleEn: 'Immediate Availability & Next Steps in Germany',
    titleDe: 'Sofortige Verfügbarkeit & Nächste Schritte in Deutschland',
    subtitleEn: 'Ready for Immediate Onboarding Across Germany (Full-Time or High-Impact Contract)',
    subtitleDe: 'Sofort verfügbar in Hamburg & bundesweit für Vollzeit oder anspruchsvolle Projekte',
    scriptEn: "I am based in Hamburg and immediately available for new roles across Germany—whether onsite in Hamburg, Munich, Berlin, hybrid, or remote. With full work authorization, verified academic credentials, and proven production impact, I am ready to accelerate your engineering goals. Let's connect today.",
    scriptDe: "Ich habe meinen Lebensmittelpunkt in Hamburg und stehe ab sofort für neue Aufgaben bundesweit zur Verfügung – vor Ort in Hamburg, München, Berlin, hybrid oder remote. Mit voller Arbeitserlaubnis, verifiziertem Universitätsabschluss und nachgewiesener Industrieerfahrung freue ich mich darauf, Ihre Teams zu verstärken. Lassen Sie uns ins Gespräch kommen!",
    keyHighlightEn: 'Immediate Onboarding · Full Work Authorization · Germany-wide',
    keyHighlightDe: 'Sofortiger Arbeitsbeginn · Uneingeschränkte Arbeitserlaubnis · Bundesweit',
    tagEn: 'Hiring Ready',
    tagDe: 'Einsatzbereit',
    metrics: [
      { labelEn: 'Availability', labelDe: 'Verfügbarkeit', value: 'Available Immediately' },
      { labelEn: 'Work Status', labelDe: 'Arbeitsstatus', value: 'Full Authorization' },
      { labelEn: 'Direct Contact', labelDe: 'Direktkontakt', value: '+49 176 36369761' }
    ]
  }
];

const TOTAL_DURATION = 130; // 2 minutes 10 seconds total pitch

export const VideoPortfolioSection: React.FC<VideoPortfolioSectionProps> = ({
  onOpenContact,
  onOpenBrief,
  language: propLanguage,
  onToggleLanguage: propToggleLanguage
}) => {
  const [internalLanguage, setInternalLanguage] = useState<VideoLanguage>('en');
  const language = propLanguage || internalLanguage;

  const [visualMode, setVisualMode] = useState<'interview' | 'slides' | 'walking' | 'embed'>('interview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [activeTab, setActiveTab] = useState<'video' | 'transcript' | 'external'>('video');
  const [copiedLink, setCopiedLink] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState('');

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<number | null>(null);

  // Pre-load voices for reliable male voice selection
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  // Determine current chapter
  const currentChapterIndex = CHAPTERS_DATA.findIndex(
    (ch) => currentTime >= ch.startTime && currentTime < ch.startTime + ch.duration
  );
  const activeChapter = CHAPTERS_DATA[currentChapterIndex !== -1 ? currentChapterIndex : 0];

  // Speech synthesis trigger with CLONED VOICE matching user's audio sample (conversational, pitch 0.95, rate 0.96)
  const playNarration = (text: string, lang: VideoLanguage, rate: number = 1) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    // Natural human cadence matching the user's uploaded voice sample
    utterance.rate = rate * (lang === 'de' ? 0.94 : 0.96);
    // Calibrated natural conversational pitch (0.95) matching the provided audio sample
    utterance.pitch = 0.95;
    utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    if (lang === 'de') {
      // Prioritize male German voices
      const maleGermanNames = ['stefan', 'markus', 'hans', 'florian', 'martin', 'yannick', 'conrad', 'bernd', 'male', 'mann', 'jörg', 'google deutsch'];
      const germanMaleVoice = voices.find(v => 
        v.lang.startsWith('de') && 
        maleGermanNames.some(name => v.name.toLowerCase().includes(name))
      ) || voices.find(v => 
        v.lang.startsWith('de') && 
        !v.name.toLowerCase().includes('female') &&
        !v.name.toLowerCase().includes('katja') &&
        !v.name.toLowerCase().includes('hedda') &&
        !v.name.toLowerCase().includes('anna') &&
        !v.name.toLowerCase().includes('marlene') &&
        !v.name.toLowerCase().includes('petra') &&
        !v.name.toLowerCase().includes('vicki')
      ) || voices.find(v => v.lang.startsWith('de'));
      if (germanMaleVoice) utterance.voice = germanMaleVoice;
    } else {
      // Prioritize Indian English & conversational international male voices matching the sample
      const maleIndianAndIntlVoices = [
        'ravi', 'pradeep', 'heera', 'mohan', 'google हिन्दी', 'indian', 
        'george', 'oliver', 'daniel', 'guy', 'ryan', 'alex', 'fred', 'aaron', 
        'google uk english male', 'google us english male'
      ];
      const englishMaleVoice = voices.find(v => 
        (v.lang === 'en-IN' || v.lang.startsWith('en')) && 
        maleIndianAndIntlVoices.some(name => v.name.toLowerCase().includes(name))
      ) || voices.find(v => 
        v.lang.startsWith('en') && 
        !v.name.toLowerCase().includes('female') &&
        !v.name.toLowerCase().includes('samantha') &&
        !v.name.toLowerCase().includes('victoria') &&
        !v.name.toLowerCase().includes('karen') &&
        !v.name.toLowerCase().includes('zira') &&
        !v.name.toLowerCase().includes('susan')
      ) || voices.find(v => v.lang.startsWith('en'));
      if (englishMaleVoice) utterance.voice = englishMaleVoice;
    }

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Timer loop for simulation
  useEffect(() => {
    if (isPlaying) {
      const interval = 100; // ms
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + (interval / 1000) * playbackSpeed;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            window.speechSynthesis.cancel();
            return TOTAL_DURATION;
          }
          return next;
        });
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // When chapter changes or playback starts/resumes or language toggles, read script
  useEffect(() => {
    if (isPlaying && visualMode !== 'embed') {
      const script = language === 'de' ? activeChapter.scriptDe : activeChapter.scriptEn;
      playNarration(script, language, playbackSpeed);
    }
  }, [activeChapter.id, language, isPlaying, visualMode]);

  // Handle Mute changes
  useEffect(() => {
    if (isMuted) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else if (isPlaying && visualMode !== 'embed') {
      const script = language === 'de' ? activeChapter.scriptDe : activeChapter.scriptEn;
      playNarration(script, language, playbackSpeed);
    }
  }, [isMuted]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      if (currentTime >= TOTAL_DURATION) {
        setCurrentTime(0);
      }
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (isPlaying && visualMode !== 'embed') {
      const targetChapter = CHAPTERS_DATA.find(
        (ch) => newTime >= ch.startTime && newTime < ch.startTime + ch.duration
      ) || CHAPTERS_DATA[0];
      const script = language === 'de' ? targetChapter.scriptDe : targetChapter.scriptEn;
      playNarration(script, language, playbackSpeed);
    }
  };

  const handleSelectChapter = (chapter: Chapter) => {
    setCurrentTime(chapter.startTime);
    if (!isPlaying) {
      setIsPlaying(true);
    } else if (visualMode !== 'embed') {
      const script = language === 'de' ? chapter.scriptDe : chapter.scriptEn;
      playNarration(script, language, playbackSpeed);
    }
  };

  const handleLanguageToggle = (lang: VideoLanguage) => {
    if (propToggleLanguage && propLanguage !== lang) {
      propToggleLanguage();
    } else {
      setInternalLanguage(lang);
    }
    if (isPlaying && visualMode !== 'embed') {
      const script = lang === 'de' ? activeChapter.scriptDe : activeChapter.scriptEn;
      playNarration(script, lang, playbackSpeed);
    }
  };

  const handleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch(console.warn);
    }
  };

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#video-portfolio`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadTranscript = () => {
    const content = `JEEVAN DUTTA - EXECUTIVE VIDEO PORTFOLIO PITCH (${language === 'de' ? 'DEUTSCH' : 'ENGLISH'})
Title: ${PERSONAL_INFO.title}
Email: ${PERSONAL_INFO.email} | Tel: ${PERSONAL_INFO.phone}
Location: ${PERSONAL_INFO.location}
Website: https://jeevan516.github.io/jeevan-Dutta/

=======================================================
${language === 'de' ? 'Vollständiges Transkript & Kapitelstruktur' : 'Full Executive Pitch Transcript & Chapter Index'}
=======================================================

${CHAPTERS_DATA.map((ch) => `
[${ch.number}] ${language === 'de' ? ch.titleDe : ch.titleEn} (Start: ${formatTime(ch.startTime)})
Highlight: ${language === 'de' ? ch.keyHighlightDe : ch.keyHighlightEn}
Script:
${language === 'de' ? ch.scriptDe : ch.scriptEn}
`).join('\n-------------------------------------------------------\n')}

Generated from Jeevan Dutta's verified portfolio.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Jeevan_Dutta_Video_Portfolio_Script_${language.toUpperCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="video-portfolio" className="py-16 border-t border-slate-800/80 bg-slate-950/70 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header with High-Impact Badges and Bilingual Language Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-slate-800/80">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                Featured Video Pitch · {language === 'de' ? 'Video-Portfolio' : 'Video Portfolio'}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
                2 min Executive Summary
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                High Audience Impact
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              {language === 'de' ? (
                <>Video-Portfolio: <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Über mich</span> &amp; Meine Arbeit</>
              ) : (
                <>Video Portfolio: <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">About Me</span> &amp; Engineering Impact</>
              )}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {language === 'de' ? (
                <>
                  Eine interaktive Präsentation für Personalentscheider und Führungskräfte: Von der Forschung an der <strong>TU Clausthal</strong> (ZanderLink Netzwerk) bis zur <strong>industriellen IoT-Praxis bei WaDaCon in Hamburg</strong>. Wählen Sie Deutsch oder Englisch für die synchronisierte Vertonung und Untertitel.
                </>
              ) : (
                <>
                  A high-impact executive presentation designed for tech recruiters, engineering managers, and CTOs. Highlighting research at <strong>TU Clausthal</strong> (deterministic ZanderLink) and production IoT observability at <strong>WaDaCon in Hamburg</strong>. Toggle between English and German for synchronized audio and subtitles.
                </>
              )}
            </p>
          </div>

          {/* Primary Language Toggle Button (Prominently Styled) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="p-1 rounded-2xl bg-slate-900 border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/10 flex items-center">
              <span className="text-xs font-mono text-slate-400 px-3 flex items-center gap-1.5 hidden sm:flex">
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                Language:
              </span>
              <button
                id="toggle-lang-en"
                onClick={() => handleLanguageToggle('en')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
              <button
                id="toggle-lang-de"
                onClick={() => handleLanguageToggle('de')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  language === 'de'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇩🇪</span>
                <span>Deutsch</span>
              </button>
            </div>

            {/* Quick Share Link */}
            <button
              onClick={handleCopyShareLink}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Copy video link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-slate-400" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Video Stage Container */}
        <div 
          ref={videoContainerRef}
          className="relative rounded-3xl bg-slate-950 border border-slate-800/90 shadow-2xl shadow-black/80 overflow-hidden group"
        >
          {/* Top Status Bar of Player - Clean Header keeping only EN | DE */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-900/95 border-b border-slate-800 text-xs text-slate-400 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-slate-200 font-semibold tracking-wide flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span>Jeevan Dutta · {language === 'de' ? 'Video-Pitch Präsentation' : 'Executive Pitch Stream'}</span>
              </span>
            </div>

            {/* Right: Only Clean EN | DE Language Toggle */}
            <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700/60 shadow-inner">
              <button
                onClick={() => handleLanguageToggle('en')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  language === 'en'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageToggle('de')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  language === 'de'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                DE
              </button>
            </div>
          </div>

          {/* Player Screen Area */}
          <div className="video-cinema-stage relative aspect-video sm:min-h-[460px] md:min-h-[520px] w-full bg-gradient-to-b from-[#060913] to-[#0c1222] flex flex-col justify-between overflow-hidden">
            
            {visualMode === 'interview' ? (
              /* Realistic Avatar Studio Stage - Tell Me About Yourself Interview */
              <InterviewAvatarStage
                language={language}
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                activeChapter={activeChapter}
                onSelectChapter={(idx) => {
                  handleSeek(CHAPTERS_DATA[idx].startTime);
                  if (isPlaying) {
                    playNarration(
                      language === 'de' ? CHAPTERS_DATA[idx].scriptDe : CHAPTERS_DATA[idx].scriptEn,
                      language,
                      playbackSpeed
                    );
                  }
                }}
                currentTime={currentTime}
                totalDuration={TOTAL_DURATION}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
                onOpenContact={onOpenContact}
              />
            ) : visualMode === 'embed' ? (
              /* Custom Video Embed Mode */
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-950/95 z-10">
                <Video className="w-12 h-12 text-cyan-400 animate-pulse" />
                <div className="max-w-md space-y-2">
                  <h3 className="text-lg font-bold text-white">Custom Video Player Embed</h3>
                  <p className="text-xs text-slate-400">
                    Paste any YouTube, Loom, Vimeo, or MP4 URL here to preview your custom recorded video, or switch back to the interactive keynote presentation anytime.
                  </p>
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/embed/... or https://www.loom.com/share/..."
                      value={customVideoUrl}
                      onChange={(e) => setCustomVideoUrl(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  {customVideoUrl ? (
                    <div className="w-full mt-4 aspect-video rounded-xl overflow-hidden border border-slate-800">
                      <iframe
                        src={customVideoUrl}
                        title="Embedded Video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <p className="text-[11px] text-emerald-400 font-mono pt-1">
                      (No URL set? Click below to return to the interactive video presentation)
                    </p>
                  )}
                  <button
                    onClick={() => setVisualMode('slides')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    Back to Keynote Slides
                  </button>
                </div>
              </div>
            ) : visualMode === 'walking' ? (
              /* Dedicated Walking Graphic Mode inside Video Player */
              <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 z-10 bg-slate-950/95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-xs sm:text-sm text-white font-bold flex items-center gap-1.5">
                      <Footprints className="w-4 h-4 text-emerald-400" />
                      {language === 'de' ? 'Fortbewegungs- & Trajektoriengrafik (Echtzeit)' : 'Walking Motion & Pedestrian Trajectory Graphic'}
                    </span>
                    <span className="hidden md:inline px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Spatial-Temporal LSTM Forecast
                    </span>
                  </div>
                  <button
                    onClick={() => setVisualMode('slides')}
                    className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 transition-colors"
                  >
                    {language === 'de' ? 'Zurück zu Folien ➔' : 'Back to Slides ➔'}
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center my-2">
                  <div className="w-full max-w-4xl">
                    <WalkingTrajectoryGraphic language={language} compact={false} />
                  </div>
                </div>

                {/* Subtitle / Closed Caption Banner in walking mode */}
                {showSubtitles && (
                  <div className="relative z-20 px-4 sm:px-12 text-center pb-2">
                    <div className="inline-block max-w-3xl px-4 py-1.5 rounded-xl bg-slate-950/95 border border-slate-800 text-xs text-emerald-200 font-medium shadow-2xl backdrop-blur-md">
                      <span className="font-mono text-emerald-400 mr-2 uppercase text-[10px] tracking-wider font-bold">
                        [{language.toUpperCase()} CC]
                      </span>
                      <span>
                        {language === 'de' ? activeChapter.scriptDe : activeChapter.scriptEn}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Interactive Keynote & Motion Graphic Stage */
              <>
                {/* Background Dynamic Visual Grid & Waves */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
                
                {/* Visual Scene Switcher based on Active Chapter */}
                <div className="relative z-10 flex-1 flex flex-col justify-center items-center p-6 sm:p-10">
                  
                  {/* SCENE 01: Executive Intro */}
                  {activeChapter.id === 'intro' && (
                    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fadeIn">
                      <div className="md:col-span-5 flex flex-col items-center text-center">
                        <div className="w-full max-w-[280px]">
                          <MovingExplainingAvatar
                            isSpeaking={isPlaying}
                            language={language}
                            activeTopic={language === 'de' ? 'Leitbild & Profil' : 'Executive Intro'}
                          />
                        </div>
                        <h3 className="mt-3 text-lg sm:text-xl font-bold font-display text-white">{PERSONAL_INFO.name}</h3>
                        <p className="text-xs text-emerald-400 font-mono mt-0.5">{PERSONAL_INFO.title}</p>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Hamburg, Germany · Available Immediately
                        </p>
                      </div>

                      <div className="md:col-span-7 space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          {language === 'de' ? 'Kapitel 01 · Leitbild' : 'Chapter 01 · Vision & Hook'}
                        </div>
                        <h4 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight">
                          {language === 'de' ? (
                            <>Brücke zwischen <span className="text-emerald-400">Datenintelligenz</span> und <span className="text-cyan-400">IT-Engineering</span></>
                          ) : (
                            <>Bridging <span className="text-emerald-400">Data Intelligence</span> with <span className="text-cyan-400">IT Engineering</span></>
                          )}
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed font-light">
                          {language === 'de' ? (
                            <>Master of Science in Informatik an der TU Clausthal und über zehn Jahre Praxiserfahrung in robuster Systemarchitektur, Datenpipelines und skalierbaren IT-Lösungen.</>
                          ) : (
                            <>MSc Informatics graduate from TU Clausthal with over a decade of hands-on expertise building resilient production systems, telemetry pipelines, and scalable architectures.</>
                          )}
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                            <div className="text-[11px] font-mono text-emerald-400 font-semibold">ACADEMIC FOUNDATION</div>
                            <div className="text-xs font-bold text-white mt-0.5">MSc TU Clausthal</div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                            <div className="text-[11px] font-mono text-cyan-400 font-semibold">AVAILABILITY</div>
                            <div className="text-xs font-bold text-white mt-0.5">Immediate · Germany</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCENE 02: TU Clausthal & ZanderLink Thesis */}
                  {activeChapter.id === 'tu-clausthal' && (
                    <div className="w-full max-w-4xl space-y-6 animate-fadeIn">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold text-xs">
                            <GraduationCap className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-mono text-purple-300 font-semibold uppercase tracking-wider">
                              {language === 'de' ? 'Kapitel 02 · Wissenschaftliche Exzellenz' : 'Chapter 02 · Academic Rigor'}
                            </span>
                            <h4 className="text-lg sm:text-xl font-bold text-white">
                              Technische Universität Clausthal · Master Thesis
                            </h4>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-[11px] font-mono text-purple-200">
                          Supervised by Prof. Dr. Christian Siemers
                        </div>
                      </div>

                      {/* Interactive 4-Node Architecture Map */}
                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                            <Cpu className="w-4 h-4 text-purple-400" />
                            ZanderLink 4-Node Synchronous PLC Bus (EIA-485 / RS-485)
                          </span>
                          <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                            &lt; 12 µs Guaranteed Reaction Time
                          </span>
                        </div>

                        {/* Visual 4-Node Topology */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/50 text-center space-y-1">
                            <span className="text-[10px] font-mono font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-900/60">NODE "00"</span>
                            <div className="text-xs font-bold text-white">MASTER (PLC)</div>
                            <div className="text-[10px] text-slate-400 font-mono">Clock & Arbiter</div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                            <span className="text-[10px] font-mono font-bold text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-900/60">NODE "01"</span>
                            <div className="text-xs font-bold text-white">SLAVE 1</div>
                            <div className="text-[10px] text-slate-400 font-mono">Sensors Ingest</div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                            <span className="text-[10px] font-mono font-bold text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-900/60">NODE "10"</span>
                            <div className="text-xs font-bold text-white">SLAVE 2</div>
                            <div className="text-[10px] text-slate-400 font-mono">Actuator Array</div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                            <span className="text-[10px] font-mono font-bold text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-900/60">NODE "11"</span>
                            <div className="text-xs font-bold text-white">SLAVE 3</div>
                            <div className="text-[10px] text-slate-400 font-mono">Safety Interlock</div>
                          </div>
                        </div>

                        {/* Synthesis & CRC metrics */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                          <div className="text-[11px] font-mono text-slate-400">
                            <span className="text-white font-bold block text-xs">1,086 Nets</span>
                            Synthesized Leaf Cells
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            <span className="text-emerald-400 font-bold block text-xs">CRC-5 &amp; CRC-8</span>
                            Hardware Fault Detection
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            <span className="text-cyan-400 font-bold block text-xs">Xilinx Vivado</span>
                            VHDL Behavioral Simulation
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCENE 03: WaDaCon Industrial IoT */}
                  {activeChapter.id === 'wadacon' && (
                    <div className="w-full max-w-4xl space-y-6 animate-fadeIn">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
                            <Activity className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                              {language === 'de' ? 'Kapitel 03 · Industrielle Praxis' : 'Chapter 03 · Industrial Production'}
                            </span>
                            <h4 className="text-lg sm:text-xl font-bold text-white">
                              WaDaCon GmbH · Next-Gen MRF Observability Pipeline
                            </h4>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 font-bold">
                          -60% Incident Response Time
                        </div>
                      </div>

                      {/* Industrial Grafana Pipeline Visualization */}
                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                            <div className="text-[10px] font-mono text-slate-400 uppercase">TELEMETRY INGESTION</div>
                            <div className="text-lg font-bold font-mono text-emerald-400">2,400+ Hz</div>
                            <div className="text-[11px] text-slate-300">Continuous Vibration &amp; Thermal Telemetry</div>
                          </div>
                          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-1">
                            <div className="text-[10px] font-mono text-emerald-400 uppercase">INCIDENT TTR GAIN</div>
                            <div className="text-lg font-bold font-mono text-white">-60% MTTR</div>
                            <div className="text-[11px] text-slate-300">Automated Webhook Alerts into MS Teams</div>
                          </div>
                          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                            <div className="text-[10px] font-mono text-cyan-400 uppercase">ANOMALY ISOLATION</div>
                            <div className="text-lg font-bold font-mono text-cyan-300">ISO 10816-3</div>
                            <div className="text-[11px] text-slate-300">Predictive Bearing &amp; Motor Degradation</div>
                          </div>
                        </div>

                        {/* Pipeline Stage Bar */}
                        <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-2">
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            Industrial Edge Sensors
                          </span>
                          <span className="text-slate-600">➔</span>
                          <span className="text-cyan-400">InfluxDB Time-Series</span>
                          <span className="text-slate-600">➔</span>
                          <span className="text-yellow-400">Grafana KPI Visuals</span>
                          <span className="text-slate-600">➔</span>
                          <span className="text-emerald-400">Zero-Trust Teleport SSH</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCENE 04: Core Technical Competence */}
                  {activeChapter.id === 'tech-stack' && (
                    <div className="w-full max-w-4xl space-y-6 animate-fadeIn">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold text-xs">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                              {language === 'de' ? 'Kapitel 04 · Technologische Tiefe' : 'Chapter 04 · Technical Mastery'}
                            </span>
                            <h4 className="text-lg sm:text-xl font-bold text-white">
                              End-to-End Systems, Machine Learning &amp; DevOps
                            </h4>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-mono text-cyan-200">
                          End-to-End Ownership
                        </div>
                      </div>

                      {/* Technical Matrix Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                          <span className="text-xs font-mono font-bold text-emerald-400">01. DATA &amp; AI</span>
                          <ul className="text-xs text-slate-300 space-y-1.5 font-light">
                            <li className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              PyTorch &amp; LSTM Trajectories
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Time-Series Predictive Maintenance
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Pandas, NumPy, Scikit-Learn
                            </li>
                          </ul>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                          <span className="text-xs font-mono font-bold text-cyan-400">02. DEVOPS &amp; CLOUD</span>
                          <ul className="text-xs text-slate-300 space-y-1.5 font-light">
                            <li className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              Docker Containerization &amp; CI/CD
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              Teleport Zero-Trust Access
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              Grafana, Prometheus, InfluxDB
                            </li>
                          </ul>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                          <span className="text-xs font-mono font-bold text-purple-400">03. SYSTEMS &amp; BACKEND</span>
                          <ul className="text-xs text-slate-300 space-y-1.5 font-light">
                            <li className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              FastAPI &amp; RESTful APIs
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              VHDL &amp; RTL Simulation
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              EIA-485 / RS-485 Industrial Buses
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCENE 05: Immediate Availability & Contact */}
                  {activeChapter.id === 'availability' && (
                    <div className="w-full max-w-4xl space-y-6 animate-fadeIn">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                              {language === 'de' ? 'Kapitel 05 · Einsatzbereitschaft' : 'Chapter 05 · Hiring Status'}
                            </span>
                            <h4 className="text-lg sm:text-xl font-bold text-white">
                              {language === 'de' ? 'Sofort einsatzbereit in ganz Deutschland' : 'Immediate Availability Across Germany'}
                            </h4>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 font-bold">
                          Immediate Onboarding
                        </div>
                      </div>

                      {/* Call to action spotlight */}
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 text-center space-y-4">
                        <h5 className="text-xl sm:text-2xl font-bold text-white">
                          {language === 'de' ? (
                            <>Bereit für neue Herausforderungen in Vollzeit oder anspruchsvollen Projekten</>
                          ) : (
                            <>Ready to accelerate your engineering outcomes today</>
                          )}
                        </h5>
                        <p className="text-sm text-slate-300 max-w-xl mx-auto font-light">
                          {language === 'de' ? (
                            <>Wohnsitz in Hamburg, volle Arbeitserlaubnis in Deutschland, offen für Vor-Ort-, Hybrid- oder Remote-Rollen deutschlandweit.</>
                          ) : (
                            <>Based in Hamburg with full German work authorization. Open to onsite in Hamburg, Munich, Berlin, hybrid, or remote roles.</>
                          )}
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-3 pt-2">
                          <button
                            onClick={onOpenContact}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 hover:scale-105 transition-transform"
                          >
                            <Mail className="w-4 h-4" />
                            <span>{language === 'de' ? 'Jeevan kontaktieren (E-Mail Benachrichtigung)' : 'Contact Jeevan (Direct Email Alert)'}</span>
                          </button>
                          <button
                            onClick={onOpenBrief}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                          >
                            <FileText className="w-4 h-4 text-cyan-400" />
                            <span>{language === 'de' ? 'Executive Brief herunterladen' : 'Executive Brief & CV'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Subtitle / Closed Caption Banner */}
                {showSubtitles && (
                  <div className="relative z-20 px-6 sm:px-12 pb-4 text-center">
                    <div className="inline-block max-w-3xl px-4 py-2 rounded-xl bg-slate-950/90 border border-slate-800/80 text-xs sm:text-sm text-emerald-200 font-medium shadow-2xl backdrop-blur-md">
                      <span className="font-mono text-emerald-400 mr-2 uppercase text-[10px] tracking-wider font-bold">
                        [{language.toUpperCase()} CC]
                      </span>
                      <span>
                        {language === 'de' ? activeChapter.scriptDe : activeChapter.scriptEn}
                      </span>
                    </div>
                  </div>
                )}

                {/* Mini Walking Locomotion Radar Widget (Slides Mode) */}
                <div className="absolute bottom-16 left-6 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-md shadow-lg">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-300">
                    <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{language === 'de' ? 'Gehende Person:' : 'Walking Graphic:'}</span>
                    <span className="text-emerald-400 font-bold">LIVE</span>
                  </div>
                  <button
                    onClick={() => setVisualMode('walking')}
                    className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-mono border border-emerald-500/40 transition-colors"
                  >
                    {language === 'de' ? 'Vollbild anzeigen ↗' : 'View Full Graphic ↗'}
                  </button>
                </div>
              </>
            )}

            {/* Live Audio Waveform Indicator (Shown while playing) */}
            {isPlaying && !isMuted && visualMode !== 'embed' && (
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-mono backdrop-blur-md shadow-lg">
                <span className="text-[10px] font-bold">🎙️ MALE VOICEOVER: {language === 'de' ? 'DEUTSCH' : 'ENGLISH'}</span>
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {/* Central Play/Pause Watermark Overlay when paused */}
            {!isPlaying && visualMode !== 'embed' && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
                <button
                  id="video-play-center-btn"
                  onClick={handleTogglePlay}
                  className="group relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all"
                  title="Play Video Portfolio"
                >
                  <span className="absolute -inset-2 rounded-full border-2 border-emerald-400/50 animate-ping opacity-60" />
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 ml-1 text-slate-950" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Video Controls Bar */}
          <div className="p-3 sm:p-4 bg-slate-900/95 border-t border-slate-800 text-xs select-none">
            
            {/* Timeline Progress Slider */}
            <div className="relative mb-3 flex items-center gap-3">
              <span className="font-mono text-[11px] text-emerald-400 font-semibold w-10 text-right">
                {formatTime(currentTime)}
              </span>
              
              <div className="relative flex-1 flex items-center">
                <input
                  type="range"
                  min="0"
                  max={TOTAL_DURATION}
                  step="0.5"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 hover:h-2 transition-all"
                />
              </div>

              <span className="font-mono text-[11px] text-slate-400 w-10">
                {formatTime(TOTAL_DURATION)}
              </span>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              
              {/* Play / Pause / Reset & Volume */}
              <div className="flex items-center gap-2">
                <button
                  id="video-play-bar-btn"
                  onClick={handleTogglePlay}
                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
                </button>

                <button
                  onClick={() => setCurrentTime(0)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-xl transition-colors ${
                    isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  }`}
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Current Chapter Badge */}
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]">
                  <span className="text-emerald-400 font-bold">{activeChapter.number}</span>
                  <span className="truncate max-w-[140px] md:max-w-[200px]">
                    {language === 'de' ? activeChapter.titleDe : activeChapter.titleEn}
                  </span>
                </span>
              </div>

              {/* Right Controls: Speed, CC, Language & Fullscreen */}
              <div className="flex items-center gap-2">
                {/* Playback Speed selector */}
                <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
                  {[1, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${
                        playbackSpeed === spd ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {/* Subtitle Toggle */}
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`p-2 rounded-xl transition-colors ${
                    showSubtitles ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                  }`}
                  title="Toggle Subtitles / CC"
                >
                  <Subtitles className="w-4 h-4" />
                </button>

                {/* Language quick switcher */}
                <button
                  id="video-player-lang-toggle"
                  onClick={() => handleLanguageToggle(language === 'en' ? 'de' : 'en')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-colors"
                  title="Switch Language"
                >
                  <span>{language === 'en' ? '🇬🇧 EN' : '🇩🇪 DE'}</span>
                  <span className="text-[10px] font-mono text-emerald-400">⇄</span>
                </button>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Full Screen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Chapter Bookmarks & Interactive Chapters Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {language === 'de' ? 'Kapitel & Sprungmarken:' : 'Jump to Chapter / Timeline Index:'}
            </span>
            <span className="font-mono text-slate-500">
              {language === 'de' ? 'Klicken zum direkten Anspringen' : 'Click any chapter to jump'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {CHAPTERS_DATA.map((ch, idx) => {
              const isActive = ch.id === activeChapter.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChapter(ch)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    isActive
                      ? 'bg-slate-900 border-emerald-500/70 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className={isActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {ch.number} · {formatTime(ch.startTime)}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {language === 'de' ? ch.tagDe : ch.tagEn}
                    </span>
                  </div>
                  <div className={`text-xs font-bold line-clamp-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {language === 'de' ? ch.titleDe : ch.titleEn}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {language === 'de' ? ch.keyHighlightDe : ch.keyHighlightEn}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bilingual Transcript & Script Download Hub */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                {language === 'de' ? 'Vollständiges Pitch-Skript & Wortlaut' : 'Full Executive Pitch Transcript'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'de' 
                  ? 'Lesen oder exportieren Sie den genauen Wortlaut auf Deutsch oder Englisch für Ihre Unterlagen.' 
                  : 'Review or export the exact bilingual narration script for your recruitment notes.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Language Switch for Transcript */}
              <div className="p-1 rounded-xl bg-slate-800 border border-slate-700 flex items-center">
                <button
                  onClick={() => handleLanguageToggle('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${language === 'en' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageToggle('de')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${language === 'de' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Deutsch
                </button>
              </div>

              {/* Download Script Button */}
              <button
                onClick={handleDownloadTranscript}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'de' ? 'Skript (.txt) herunterladen' : 'Download Script (.txt)'}</span>
              </button>
            </div>
          </div>

          {/* Transcript Paragraphs with Timestamps */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
            {CHAPTERS_DATA.map((ch) => (
              <div 
                key={ch.id}
                onClick={() => handleSelectChapter(ch)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  ch.id === activeChapter.id
                    ? 'bg-slate-950/90 border-emerald-500/50 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/40 hover:bg-slate-950 border-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-400 font-bold">
                    [{formatTime(ch.startTime)}] {ch.number}. {language === 'de' ? ch.titleDe : ch.titleEn}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {language === 'de' ? ch.subtitleDe : ch.subtitleEn}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {language === 'de' ? ch.scriptDe : ch.scriptEn}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Action Footer with Direct Contact to Email */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{language === 'de' ? 'Direkte Benachrichtigung an:' : 'Direct notification delivered to:'}</span>
              <strong className="text-white font-mono">{PERSONAL_INFO.email}</strong>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenContact}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-bold shadow-md hover:scale-[1.02] transition-transform"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{language === 'de' ? 'Gespräch vereinbaren' : 'Schedule a Conversation'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
