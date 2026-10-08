import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Bell, Cpu, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

export const IndustrialIoTMonitor: React.FC = () => {
  const [opticalSorterRpm, setOpticalSorterRpm] = useState<number>(2450);
  const [vibrationSpectrum, setVibrationSpectrum] = useState<number>(1.24); // mm/s
  const [purityPercentage, setPurityPercentage] = useState<number>(96.8);
  const [anomalyScore, setAnomalyScore] = useState<number>(0.08); // 0-1
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const [simulatingFault, setSimulatingFault] = useState<boolean>(false);
  const [logMessages, setLogMessages] = useState<Array<{ time: string; text: string; type: 'info' | 'warn' | 'success' }>>([
    { time: '10:42:15', text: 'InfluxDB batch ingested: 1200 data points from MRF Line 3', type: 'info' },
    { time: '10:42:18', text: 'Prometheus target scraper healthy · latency 14ms', type: 'info' },
    { time: '10:42:20', text: 'ML anomaly score nominal (0.08 < threshold 0.65)', type: 'success' },
  ]);

  // Live sensor oscillation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!simulatingFault) {
        setOpticalSorterRpm((prev) => Math.round(2450 + (Math.random() - 0.5) * 35));
        setVibrationSpectrum((prev) => Number((1.22 + (Math.random() - 0.5) * 0.08).toFixed(2)));
        setPurityPercentage((prev) => Number((96.7 + (Math.random() - 0.5) * 0.3).toFixed(1)));
        setAnomalyScore((prev) => Number((0.08 + (Math.random() - 0.5) * 0.03).toFixed(2)));
      }
    }, 1800);
    return () => clearInterval(interval);
  }, [simulatingFault]);

  // Trigger anomaly simulation
  const handleSimulateFault = () => {
    if (simulatingFault) return;
    setSimulatingFault(true);
    setVibrationSpectrum(4.85);
    setOpticalSorterRpm(2720);
    setAnomalyScore(0.89);
    setIsAlerting(true);

    const now = new Date().toLocaleTimeString('de-DE');
    setLogMessages((prev) => [
      { time: now, text: 'CRITICAL: High vibration spike detected on Rotor Bearing #2 (4.85 mm/s)', type: 'warn' },
      { time: now, text: 'Anomaly Model triggered Webhook: MS Teams Ops channel notified', type: 'warn' },
      ...prev.slice(0, 4),
    ]);

    // Automatically recover after 6 seconds
    setTimeout(() => {
      setSimulatingFault(false);
      setVibrationSpectrum(1.24);
      setOpticalSorterRpm(2450);
      setAnomalyScore(0.09);
      setIsAlerting(false);
      const recoverTime = new Date().toLocaleTimeString('de-DE');
      setLogMessages((prev) => [
        { time: recoverTime, text: 'System recovered: Vibration stabilized within ISO threshold', type: 'success' },
        ...prev.slice(0, 4),
      ]);
    }, 6000);
  };

  return (
    <div
      id="industrial-iot-monitor"
      className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900/95 via-[#0c1322]/95 to-slate-950/95 border border-slate-800/80 shadow-2xl backdrop-blur-xl overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                WaDaCon GmbH · MRF Recycling Telemetry
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Edge Ingest Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Dockerized InfluxDB + Prometheus + Grafana Alerting Stack
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          id="simulate-iot-anomaly-btn"
          onClick={handleSimulateFault}
          disabled={simulatingFault}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
            simulatingFault
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-cyan-500/50'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${simulatingFault ? 'text-amber-400' : 'text-cyan-400'}`} />
          {simulatingFault ? 'Simulating Machinery Spike...' : 'Simulate Sensor Anomaly'}
        </button>
      </div>

      {/* Grid of Telemetry Sensors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-5">
        {/* Sensor 1: Optical Sorter */}
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Optical Sorter Velocity</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-slate-100">{opticalSorterRpm}</span>
            <span className="text-[11px] text-slate-400 font-mono">RPM</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3" /> Nominal throughput
          </div>
        </div>

        {/* Sensor 2: Vibration Spectrum */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          vibrationSpectrum > 3.0
            ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
            : 'bg-slate-950/50 border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Bearing Vibration</span>
            <Activity className={`w-3.5 h-3.5 ${vibrationSpectrum > 3.0 ? 'text-amber-400' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-bold font-mono ${vibrationSpectrum > 3.0 ? 'text-amber-400' : 'text-slate-100'}`}>
              {vibrationSpectrum}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">mm/s RMS</span>
          </div>
          <div className="mt-2 text-[11px] font-mono">
            {vibrationSpectrum > 3.0 ? (
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3 h-3" /> ISO Limit Exceeded!
              </span>
            ) : (
              <span className="text-slate-400">ISO 10816-3 Zone A</span>
            )}
          </div>
        </div>

        {/* Sensor 3: Recovery Purity */}
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Material Yield Purity</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-emerald-400">{purityPercentage}%</span>
            <span className="text-[11px] text-slate-400 font-mono">Target &gt;95%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            High-grade polymer stream
          </div>
        </div>

        {/* Sensor 4: AI Anomaly Gauge */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isAlerting ? 'bg-rose-950/30 border-rose-500/60' : 'bg-slate-950/50 border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>AI Anomaly Score</span>
            <Bell className={`w-3.5 h-3.5 ${isAlerting ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-bold font-mono ${isAlerting ? 'text-rose-400' : 'text-slate-100'}`}>
              {anomalyScore}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">/ 1.00</span>
          </div>
          <div className="mt-2">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isAlerting ? 'bg-rose-500 w-[89%]' : 'bg-emerald-500 w-[12%]'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Pipeline Log Feed */}
      <div className="px-5 pb-4">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/70 font-mono text-[11px]">
          <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
              <Zap className="w-3 h-3 text-cyan-400" /> Real-Time Telemetry Pipeline Stream
            </span>
            <span className="text-[10px] text-slate-500">Auto-synced with edge broker</span>
          </div>
          <div className="space-y-1">
            {logMessages.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span
                  className={
                    log.type === 'warn'
                      ? 'text-amber-300 font-medium'
                      : log.type === 'success'
                      ? 'text-emerald-400'
                      : 'text-slate-300'
                  }
                >
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
