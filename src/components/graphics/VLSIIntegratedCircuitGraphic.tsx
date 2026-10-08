import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Zap, Activity, Play, Pause, RefreshCw, Layers } from 'lucide-react';

export const VLSIIntegratedCircuitGraphic: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [frequencyMhz, setFrequencyMhz] = useState(400); // Clock frequency
  const [circuitMode, setCircuitMode] = useState<'layout' | 'waveform' | 'logic'>('layout');
  const [transistorDensity, setTransistorDensity] = useState('0.18µm CMOS');
  const [activeGate, setActiveGate] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;
    let rAFId: number | null = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      if (rAFId !== null) cancelAnimationFrame(rAFId);
      rAFId = requestAnimationFrame(resize);
    });

    resizeObserver.observe(canvas);
    resize();

    // Circuit layout blocks
    const blocks = [
      { id: 'ALU', name: 'Arithmetic Logic Unit', x: 0.12, y: 0.16, w: 0.32, h: 0.34, color: '#06b6d4' },
      { id: 'REG', name: 'Register Bank (32-Bit)', x: 0.52, y: 0.16, w: 0.36, h: 0.22, color: '#10b981' },
      { id: 'CLK_TREE', name: 'H-Tree Clock Distribution', x: 0.52, y: 0.44, w: 0.36, h: 0.26, color: '#8b5cf6' },
      { id: 'IO_BUS', name: 'High-Density Routing Bus', x: 0.12, y: 0.56, w: 0.32, h: 0.28, color: '#f59e0b' },
      { id: 'SRAM', name: 'L1 Cache / Memory Arrays', x: 0.12, y: 0.88, w: 0.76, h: 0.08, color: '#3b82f6' }
    ];

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (isRunning) {
        tick += (frequencyMhz / 100) * 0.4;
      }

      if (circuitMode === 'layout') {
        // Render Silicon Die Background
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#040b17');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Render Silicon Micro-Grid / Substrate Mesh
        ctx.strokeStyle = 'rgba(30, 58, 138, 0.18)';
        ctx.lineWidth = 1;
        const gridSize = Math.max(16, Math.floor(width / 32));
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Draw Interconnect Buses / Signal Traces
        const busY1 = height * 0.38;
        const busY2 = height * 0.72;
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 1.5;

        // Dynamic Bus Traces with traveling electron pulses
        for (let i = 0; i < 4; i++) {
          const yOff = busY1 + (i - 1.5) * 6;
          ctx.beginPath();
          ctx.moveTo(width * 0.1, yOff);
          ctx.lineTo(width * 0.9, yOff);
          ctx.stroke();

          // Flowing data packets
          const pX = ((tick * 1.5 + i * 80) % (width * 0.8)) + width * 0.1;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(pX, yOff, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw H-Tree Clock Lines
        const centerX = width * 0.5;
        const centerY = height * 0.45;
        const clkPulse = Math.sin(tick * 0.25);
        ctx.strokeStyle = clkPulse > 0 ? 'rgba(168, 85, 247, 0.7)' : 'rgba(168, 85, 247, 0.25)';
        ctx.lineWidth = 2;

        // Root clock trunk
        ctx.beginPath();
        ctx.moveTo(centerX, height * 0.1);
        ctx.lineTo(centerX, centerY);
        // Horizontal branch
        ctx.lineTo(centerX - width * 0.25, centerY);
        ctx.lineTo(centerX + width * 0.25, centerY);
        // Vertical sub-branches
        ctx.moveTo(centerX - width * 0.25, centerY - height * 0.15);
        ctx.lineTo(centerX - width * 0.25, centerY + height * 0.15);
        ctx.moveTo(centerX + width * 0.25, centerY - height * 0.15);
        ctx.lineTo(centerX + width * 0.25, centerY + height * 0.15);
        ctx.stroke();

        // Render VLSI Macro Blocks
        blocks.forEach((block) => {
          const bx = block.x * width;
          const by = block.y * height;
          const bw = block.w * width;
          const bh = block.h * height;

          // Block Fill
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(bx, by, bw, bh);

          // Border with subtle glow
          ctx.strokeStyle = block.color;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx, by, bw, bh);

          // Internal micro-cells
          ctx.fillStyle = `${block.color}18`;
          const cellStep = Math.max(12, Math.floor(bw / 6));
          for (let cx = bx + 6; cx < bx + bw - 6; cx += cellStep) {
            for (let cy = by + 20; cy < by + bh - 6; cy += 12) {
              const active = Math.sin((cx + cy + tick * 4) * 0.05) > 0.3;
              if (active) {
                ctx.fillRect(cx, cy, cellStep - 3, 8);
              }
            }
          }

          // Block Header Label
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(block.id, bx + 8, by + 14);

          // Secondary text
          ctx.fillStyle = '#94a3b8';
          ctx.font = '9px sans-serif';
          ctx.fillText(block.name, bx + 8, by + bh - 6);
        });

        // Corner Pin Pads (VLSI Package Leads)
        ctx.fillStyle = '#64748b';
        const padSize = 5;
        for (let x = 12; x < width - 12; x += 18) {
          ctx.fillRect(x, 2, padSize, 5);
          ctx.fillRect(x, height - 7, padSize, 5);
        }
        for (let y = 12; y < height - 12; y += 18) {
          ctx.fillRect(2, y, 5, padSize);
          ctx.fillRect(width - 7, y, 5, padSize);
        }

      } else if (circuitMode === 'waveform') {
        // Digital Waveform Oscilloscope Mode
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, width, height);

        // Oscilloscope Grid Lines
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.8)';
        ctx.lineWidth = 1;
        for (let y = 0; y < height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        const signals = [
          { name: `CLK (${frequencyMhz} MHz)`, color: '#a855f7', y: height * 0.22, freq: 0.08, digital: true },
          { name: 'BUS_DATA[31:0]', color: '#06b6d4', y: height * 0.45, freq: 0.04, digital: true },
          { name: 'PROPAGATION_DELAY (τ)', color: '#10b981', y: height * 0.68, freq: 0.02, digital: false },
          { name: 'VLSI_ALU_OUT', color: '#f59e0b', y: height * 0.88, freq: 0.06, digital: true }
        ];

        signals.forEach((sig) => {
          ctx.fillStyle = sig.color;
          ctx.font = 'bold 11px monospace';
          ctx.fillText(sig.name, 12, sig.y - 12);

          ctx.strokeStyle = sig.color;
          ctx.lineWidth = 2;
          ctx.beginPath();

          const amp = 16;
          for (let x = 140; x < width - 10; x++) {
            const time = (x + tick * 3) * sig.freq;
            let val = 0;
            if (sig.digital) {
              val = Math.sin(time) > 0 ? 1 : -1;
            } else {
              val = Math.sin(time) * Math.cos(time * 0.4);
            }
            const yPos = sig.y - val * amp;
            if (x === 140) ctx.moveTo(x, yPos);
            else ctx.lineTo(x, yPos);
          }
          ctx.stroke();
        });

      } else {
        // Logic Gate Schematic Mode
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('VLSI FULL-ADDER & LOGIC REGISTER CELL (0.18µm CMOS)', 16, 24);

        // Draw simplified digital logic flow
        const gates = [
          { name: 'XOR_1 (Sum A^B)', x: width * 0.25, y: height * 0.35, out: 'P' },
          { name: 'AND_1 (Carry G)', x: width * 0.25, y: height * 0.65, out: 'G' },
          { name: 'XOR_2 (Final Sum)', x: width * 0.65, y: height * 0.35, out: 'S' },
          { name: 'OR_1 (Carry Out)', x: width * 0.65, y: height * 0.65, out: 'C_OUT' }
        ];

        gates.forEach((g) => {
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(g.x - 55, g.y - 22, 110, 44, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(g.name, g.x, g.y + 4);
          ctx.textAlign = 'left';
        });

        // Interconnect Wires
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width * 0.25 + 55, height * 0.35);
        ctx.lineTo(width * 0.65 - 55, height * 0.35);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width * 0.25 + 55, height * 0.65);
        ctx.lineTo(width * 0.65 - 55, height * 0.65);
        ctx.stroke();

        // Pulsing data packet on wire
        const wirePos = ((tick * 2) % (width * 0.4 - 110)) + (width * 0.25 + 55);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(wirePos, height * 0.35, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText('Inputs: A=1, B=0, CIN=1  →  Sum=0, COUT=1 (Clock Synchronized)', 16, height - 16);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (rAFId !== null) cancelAnimationFrame(rAFId);
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [isRunning, frequencyMhz, circuitMode]);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden">
      {/* Top Banner */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
              VLSI & Integrated Circuit Simulator
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-950/80 border border-purple-800 text-purple-300">
                TU Clausthal
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Prof. Dr. Christian Siemers Research · Very Large Scale Integrated Circuits
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setCircuitMode('layout')}
            className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
              circuitMode === 'layout'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Silicon Die
          </button>
          <button
            onClick={() => setCircuitMode('waveform')}
            className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
              circuitMode === 'waveform'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Waveforms
          </button>
          <button
            onClick={() => setCircuitMode('logic')}
            className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
              circuitMode === 'logic'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Logic Gates
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-[320px] overflow-hidden bg-slate-950">
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

        {/* Live Status Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-2 pointer-events-none">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[10px] font-mono text-emerald-400 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CLK: {frequencyMhz} MHz
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[10px] font-mono text-slate-300 backdrop-blur-sm">
            Node: {transistorDensity}
          </span>
        </div>
      </div>

      {/* Bottom Telemetry & Interaction Strip */}
      <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {isRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span>{isRunning ? 'Pause Clock' : 'Resume Clock'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span>Clock Freq:</span>
            {[200, 400, 800].map((f) => (
              <button
                key={f}
                onClick={() => setFrequencyMhz(f)}
                className={`px-1.5 py-0.5 rounded ${
                  frequencyMhz === f ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'hover:text-white'
                }`}
              >
                {f}M
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <span className="text-purple-400 font-semibold">TU Clausthal Lab:</span>
          <span>Digital Microelectronics & Logic Design</span>
        </div>
      </div>
    </div>
  );
};
