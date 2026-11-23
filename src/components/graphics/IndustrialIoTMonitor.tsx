import React, { useState, useEffect, useRef } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Bell, Cpu, ShieldCheck, Zap } from 'lucide-react';

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

  const recoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (recoverTimer.current) clearTimeout(recoverTimer.current);
  }, []);

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
    recoverTimer.current = setTimeout(() => {
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
      className="jd-dark-panel relative w-full rounded-2xl bg-bg/70 border border-line overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-line/80 bg-bg/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-accent/10 text-accent-fg border border-accent/20 shrink-0">
            <Activity className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-fg">MRF recycling telemetry · WaDaCon</div>
            <p className="text-xs text-subtle">InfluxDB + Prometheus + Grafana alerting (simulated)</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          id="simulate-iot-anomaly-btn"
          onClick={handleSimulateFault}
          disabled={simulatingFault}
          type="button"
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 disabled:cursor-not-allowed ${
            simulatingFault
              ? 'bg-accent/20 text-warning border-warning/40'
              : 'bg-surface-2 hover:bg-line-strong text-fg border-line-strong hover:border-accent/50'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${simulatingFault ? 'text-warning' : 'text-accent-fg'}`} aria-hidden="true" />
          {simulatingFault ? 'Anomaly in progress…' : 'Simulate anomaly'}
        </button>
      </div>

      {/* Grid of Telemetry Sensors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-5">
        {/* Sensor 1: Optical Sorter */}
        <div className="p-3.5 rounded-xl bg-bg/50 border border-line/80">
          <div className="flex items-center justify-between text-muted text-xs mb-1">
            <span>Optical Sorter Velocity</span>
            <Cpu className="w-3.5 h-3.5 text-teal" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-fg">{opticalSorterRpm}</span>
            <span className="text-xs text-muted font-mono">RPM</span>
          </div>
          <div className="mt-2 text-xs text-accent-fg flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3" /> Nominal throughput
          </div>
        </div>

        {/* Sensor 2: Vibration Spectrum */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          vibrationSpectrum > 3.0
            ? 'bg-warning-soft/30 border-warning/50 text-warning'
            : 'bg-bg/50 border-line/80'
        }`}>
          <div className="flex items-center justify-between text-muted text-xs mb-1">
            <span>Bearing Vibration</span>
            <Activity className={`w-3.5 h-3.5 ${vibrationSpectrum > 3.0 ? 'text-warning' : 'text-muted'}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-bold font-mono ${vibrationSpectrum > 3.0 ? 'text-warning' : 'text-fg'}`}>
              {vibrationSpectrum}
            </span>
            <span className="text-xs text-muted font-mono">mm/s RMS</span>
          </div>
          <div className="mt-2 text-xs font-mono">
            {vibrationSpectrum > 3.0 ? (
              <span className="text-warning flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3 h-3" /> ISO Limit Exceeded!
              </span>
            ) : (
              <span className="text-muted">ISO 10816-3 Zone A</span>
            )}
          </div>
        </div>

        {/* Sensor 3: Recovery Purity */}
        <div className="p-3.5 rounded-xl bg-bg/50 border border-line/80">
          <div className="flex items-center justify-between text-muted text-xs mb-1">
            <span>Material Yield Purity</span>
            <ShieldCheck className="w-3.5 h-3.5 text-accent-fg" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-accent-fg">{purityPercentage}%</span>
            <span className="text-xs text-muted font-mono">Target &gt;95%</span>
          </div>
          <div className="mt-2 text-xs text-muted font-mono">
            High-grade polymer stream
          </div>
        </div>

        {/* Sensor 4: AI Anomaly Gauge */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isAlerting ? 'bg-danger-soft/30 border-danger/60' : 'bg-bg/50 border-line/80'
        }`}>
          <div className="flex items-center justify-between text-muted text-xs mb-1">
            <span>AI Anomaly Score</span>
            <Bell className={`w-3.5 h-3.5 ${isAlerting ? 'text-danger animate-bounce' : 'text-muted'}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-bold font-mono ${isAlerting ? 'text-danger' : 'text-fg'}`}>
              {anomalyScore}
            </span>
            <span className="text-xs text-muted font-mono">/ 1.00</span>
          </div>
          <div className="mt-2">
            <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${isAlerting ? 'bg-danger' : 'bg-accent'}`}
                style={{ width: `${Math.round(Math.min(1, Math.max(0, anomalyScore)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Pipeline Log Feed */}
      <div className="px-4 sm:px-5 pb-4">
        <div className="p-3 rounded-xl bg-bg/80 border border-line/70 font-mono text-xs">
          <div className="flex items-center justify-between text-muted mb-2 border-b border-line pb-1.5">
            <span className="flex items-center gap-1.5 text-xs text-muted font-semibold">
              <Zap className="w-3 h-3 text-accent-fg" aria-hidden="true" /> Pipeline log
            </span>
          </div>
          <div className="space-y-1" aria-live="polite">
            {logMessages.map((log, idx) => (
              <div key={`${log.time}-${idx}`} className="flex items-start gap-2 min-w-0">
                <span className="text-subtle shrink-0">[{log.time}]</span>
                <span
                  className={'break-words min-w-0 ' + (
                    log.type === 'warn'
                      ? 'text-warning font-medium'
                      : log.type === 'success'
                      ? 'text-accent-fg'
                      : 'text-muted')
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
