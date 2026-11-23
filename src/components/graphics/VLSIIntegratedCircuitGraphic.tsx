import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Play, Pause } from 'lucide-react';
import { prefersReducedMotion } from '../../utils/tokens';

export const VLSIIntegratedCircuitGraphic: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(
    () => typeof window === 'undefined' || !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  const [frequencyMhz, setFrequencyMhz] = useState(400); // Clock frequency
  const [circuitMode, setCircuitMode] = useState<'layout' | 'waveform' | 'logic'>('layout');
  const transistorDensity = '0.18µm CMOS';
  const tickRef = useRef(0); // persists across mode / frequency changes

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = tickRef.current;
    let rAFId: number | null = null;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
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
      { id: 'ALU', name: 'Arithmetic Logic Unit', x: 0.12, y: 0.16, w: 0.32, h: 0.34, color: '#3cc0b4' },
      { id: 'REG', name: 'Register Bank (32-Bit)', x: 0.52, y: 0.16, w: 0.36, h: 0.22, color: '#f2a541' },
      { id: 'CLK_TREE', name: 'H-Tree Clock Distribution', x: 0.52, y: 0.44, w: 0.36, h: 0.26, color: '#9085e9' },
      { id: 'IO_BUS', name: 'High-Density Routing Bus', x: 0.12, y: 0.56, w: 0.32, h: 0.28, color: '#d95926' },
      { id: 'SRAM', name: 'L1 Cache / Memory Arrays', x: 0.12, y: 0.88, w: 0.76, h: 0.08, color: '#3987e5' }
    ];

    const render = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      if (width === 0 || height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (isRunning) {
        tick += (frequencyMhz / 100) * 0.4;
        tickRef.current = tick;
      }

      if (circuitMode === 'layout') {
        // Render Silicon Die Background
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0b1320');
        grad.addColorStop(1, '#0b1320');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Render Silicon Micro-Grid / Substrate Mesh
        ctx.strokeStyle = 'rgba(42, 61, 85, 0.18)';
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
        ctx.strokeStyle = 'rgba(60, 192, 180, 0.4)';
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
          ctx.fillStyle = '#6aaef2';
          ctx.beginPath();
          ctx.arc(pX, yOff, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw H-Tree Clock Lines
        const centerX = width * 0.5;
        const centerY = height * 0.45;
        const clkPulse = Math.sin(tick * 0.25);
        ctx.strokeStyle = clkPulse > 0 ? 'rgba(144, 133, 233, 0.7)' : 'rgba(144, 133, 233, 0.25)';
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
          ctx.fillStyle = 'rgba(17, 28, 46, 0.85)';
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

          // Labels: id at the top and name at the bottom; a block too short for two lines gets
          // both on one centred line, so they never overlap.
          const oneLine = bh < 34;
          const labelY = oneLine ? by + bh / 2 + 4 : by + 14;
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(block.id, bx + 8, labelY);

          ctx.fillStyle = '#a3b3c3';
          ctx.font = '9px sans-serif';
          if (oneLine) {
            ctx.font = 'bold 10px monospace';
            const idWidth = ctx.measureText(block.id).width;
            ctx.font = '9px sans-serif';
            ctx.fillText(`· ${block.name}`, bx + 14 + idWidth, labelY);
          } else {
            ctx.fillText(block.name, bx + 8, by + bh - 6);
          }
        });

        // Corner Pin Pads (VLSI Package Leads)
        ctx.fillStyle = '#8394a6';
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
        ctx.fillStyle = '#0b1320';
        ctx.fillRect(0, 0, width, height);

        // Oscilloscope Grid Lines
        ctx.strokeStyle = 'rgba(31, 47, 69, 0.8)';
        ctx.lineWidth = 1;
        for (let y = 0; y < height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        const signals = [
          { name: `CLK (${frequencyMhz} MHz)`, color: '#9085e9', y: height * 0.22, freq: 0.08, digital: true },
          { name: 'BUS_DATA[31:0]', color: '#3cc0b4', y: height * 0.45, freq: 0.04, digital: true },
          { name: 'PROPAGATION_DELAY (τ)', color: '#f2a541', y: height * 0.68, freq: 0.02, digital: false },
          { name: 'VLSI_ALU_OUT', color: '#d95926', y: height * 0.88, freq: 0.06, digital: true }
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
        ctx.fillStyle = '#0b1320';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#6aaef2';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(width < 420 ? 'FULL-ADDER CELL (0.18µm CMOS)' : 'VLSI FULL-ADDER & LOGIC REGISTER CELL (0.18µm CMOS)', 16, 24);

        // Draw simplified digital logic flow
        const gates = [
          { name: 'XOR_1 (Sum A^B)', x: width * 0.25, y: height * 0.35, out: 'P' },
          { name: 'AND_1 (Carry G)', x: width * 0.25, y: height * 0.65, out: 'G' },
          { name: 'XOR_2 (Final Sum)', x: width * 0.65, y: height * 0.35, out: 'S' },
          { name: 'OR_1 (Carry Out)', x: width * 0.65, y: height * 0.65, out: 'C_OUT' }
        ];

        gates.forEach((g) => {
          ctx.fillStyle = '#1f2f45';
          ctx.strokeStyle = '#3cc0b4';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') ctx.roundRect(g.x - 55, g.y - 22, 110, 44, 8);
          else ctx.rect(g.x - 55, g.y - 22, 110, 44);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(g.name, g.x, g.y + 4);
          ctx.textAlign = 'left';
        });

        // Interconnect Wires
        ctx.strokeStyle = '#f2a541';
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
        ctx.fillStyle = '#d95926';
        ctx.beginPath();
        ctx.arc(wirePos, height * 0.35, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#a3b3c3';
        ctx.font = '10px monospace';
        ctx.fillText(width < 420 ? 'A=1, B=0, CIN=1 → S=0, COUT=1' : 'Inputs: A=1, B=0, CIN=1  →  Sum=0, COUT=1 (Clock Synchronized)', 16, height - 16);
      }

      // Reduced motion: draw a still frame instead of animating
      if (!reduceMotion) animId = requestAnimationFrame(render);
    };

    const reduceMotion = prefersReducedMotion();
    animId = requestAnimationFrame(render);

    return () => {
      if (rAFId !== null) cancelAnimationFrame(rAFId);
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [isRunning, frequencyMhz, circuitMode]);

  return (
    <div className="jd-dark-panel rounded-2xl bg-bg/70 border border-line overflow-hidden">
      {/* Top Banner */}
      <div className="px-4 py-3 bg-bg/80 border-b border-line flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-info/10 border border-info/30 text-info">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-fg">VLSI circuit simulator</h3>
            <p className="text-xs text-subtle">TU Clausthal · Very Large Scale Integrated Circuits</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div role="tablist" aria-label="Simulator view" className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-line text-xs">
          <button
            type="button"
            role="tab"
            aria-selected={circuitMode === 'layout'}
            onClick={() => setCircuitMode('layout')}
            className={`px-2.5 py-1 rounded-lg font-medium text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 ${
              circuitMode === 'layout'
                ? 'bg-surface-2 text-fg border-line-strong'
                : 'text-muted hover:text-fg border-transparent'
            }`}
          >
            Silicon Die
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={circuitMode === 'waveform'}
            onClick={() => setCircuitMode('waveform')}
            className={`px-2.5 py-1 rounded-lg font-medium text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 ${
              circuitMode === 'waveform'
                ? 'bg-surface-2 text-fg border-line-strong'
                : 'text-muted hover:text-fg border-transparent'
            }`}
          >
            Waveforms
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={circuitMode === 'logic'}
            onClick={() => setCircuitMode('logic')}
            className={`px-2.5 py-1 rounded-lg font-medium text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 ${
              circuitMode === 'logic'
                ? 'bg-surface-2 text-fg border-line-strong'
                : 'text-muted hover:text-fg border-transparent'
            }`}
          >
            Logic Gates
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-[320px] overflow-hidden bg-bg">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          role="img"
          aria-label={`VLSI circuit simulation, ${circuitMode} view at ${frequencyMhz} MHz`}
        />

        {/* Live Status Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-2 pointer-events-none">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface/90 border border-line-strong/80 text-xs font-mono text-accent-fg backdrop-blur-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-accent animate-pulse' : 'bg-line-strong'}`} />
            CLK: {frequencyMhz} MHz
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface/90 border border-line-strong/80 text-xs font-mono text-muted backdrop-blur-sm">
            Node: {transistorDensity}
          </span>
        </div>
      </div>

      {/* Bottom Telemetry & Interaction Strip */}
      <div className="px-4 py-2.5 bg-bg/90 border-t border-line flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            aria-pressed={!isRunning}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 hover:bg-line-strong text-fg border border-line-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60"
          >
            {isRunning ? <Pause className="w-3 h-3 text-warning" aria-hidden="true" /> : <Play className="w-3 h-3 text-accent-fg" aria-hidden="true" />}
            <span>{isRunning ? 'Pause' : 'Play'}</span>
          </button>

          <div className="flex items-center gap-1 text-xs font-mono text-muted" role="group" aria-label="Clock frequency">
            {[200, 400, 800].map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={frequencyMhz === f}
                onClick={() => setFrequencyMhz(f)}
                className={`px-1.5 py-0.5 rounded border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60 ${
                  frequencyMhz === f ? 'bg-accent/15 text-accent-fg font-bold border-accent/40' : 'border-transparent hover:text-fg'
                }`}
              >
                {f} MHz
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
