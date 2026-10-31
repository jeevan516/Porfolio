import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Cpu } from 'lucide-react';

interface NodePos {
  x: number;
  y: number;
  activation: number;
}

interface Pulse {
  src: { x: number; y: number };
  dst: { x: number; y: number };
  t: number;
  speed: number;
  color: string;
}

const CANVAS_HEIGHT = 320;

const LAYERS = [
  { name: 'Input', count: 5, color: '#00d4aa', sub: 'Spatial (x,y,t)' },
  { name: 'LSTM 1', count: 7, color: '#0284c7', sub: 'Hidden Units' },
  { name: 'LSTM 2', count: 6, color: '#38bdf8', sub: 'Temporal Cells' },
  { name: 'Dense', count: 4, color: '#a855f7', sub: 'Dense Softmax' },
  { name: 'Output', count: 3, color: '#10b981', sub: 'Trajectory (Δx,Δy)' },
];

const INITIAL = { epoch: 42, accuracy: 98.42, loss: 0.0418 };

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60';

export const NeuralNetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  });
  const [epoch, setEpoch] = useState<number>(INITIAL.epoch);
  const [accuracy, setAccuracy] = useState<number>(INITIAL.accuracy);
  const [loss, setLoss] = useState<number>(INITIAL.loss);

  // Refs let the long-lived animation loop read the latest UI state without restarting.
  const runningRef = useRef(isRunning);
  const lossRef = useRef(loss);
  const pulsesRef = useRef<Pulse[]>([]);
  runningRef.current = isRunning;
  lossRef.current = loss;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    const height = CANVAS_HEIGHT;
    let simTime = 0; // advances only while running, so pausing freezes the scene
    let lastFrame = performance.now();
    let lastPulseTime = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(240, Math.floor(canvas.clientWidth || container.clientWidth));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    const render = (now: number) => {
      const dt = now - lastFrame;
      lastFrame = now;
      const running = runningRef.current;
      if (running) simTime += dt;

      ctx.clearRect(0, 0, width, height);
      const compact = width < 440;

      const padX = Math.max(24, Math.min(80, width * 0.1));
      const stepX = (width - padX * 2) / (LAYERS.length - 1);
      const padY = compact ? 44 : 55;

      const layerPositions = LAYERS.map((layer, lIdx) => {
        const x = padX + lIdx * stepX;
        const stepY = (height - padY * 2) / (layer.count + 1);
        const nodes: NodePos[] = [];
        for (let i = 0; i < layer.count; i++) {
          const osc = Math.sin(simTime * 0.002 + lIdx * 1.2 + i * 0.8) * 0.5 + 0.5;
          nodes.push({ x, y: padY + (i + 1) * stepY, activation: 0.2 + osc * 0.8 });
        }
        return { config: layer, nodes };
      });

      // Connections
      ctx.lineWidth = 0.8;
      for (let l = 0; l < layerPositions.length - 1; l++) {
        layerPositions[l].nodes.forEach((src, sIdx) => {
          layerPositions[l + 1].nodes.forEach((dst, dIdx) => {
            const w = Math.sin(sIdx * 2.3 + dIdx * 1.7) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.moveTo(src.x, src.y);
            ctx.lineTo(dst.x, dst.y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${0.03 + w * 0.12})`;
            ctx.stroke();
          });
        });
      }

      // Pulses
      if (running && simTime - lastPulseTime > 140) {
        lastPulseTime = simTime;
        const li = Math.floor(Math.random() * (layerPositions.length - 1));
        const srcNodes = layerPositions[li].nodes;
        const dstNodes = layerPositions[li + 1].nodes;
        const src = srcNodes[Math.floor(Math.random() * srcNodes.length)];
        const dst = dstNodes[Math.floor(Math.random() * dstNodes.length)];
        pulsesRef.current.push({
          src: { x: src.x, y: src.y },
          dst: { x: dst.x, y: dst.y },
          t: 0,
          speed: 0.02 + Math.random() * 0.015,
          color: layerPositions[li].config.color,
        });
      }
      pulsesRef.current = pulsesRef.current.filter((p) => p.t <= 1);
      pulsesRef.current.forEach((p) => {
        if (running) p.t += p.speed;
        ctx.beginPath();
        ctx.arc(p.src.x + (p.dst.x - p.src.x) * p.t, p.src.y + (p.dst.y - p.src.y) * p.t, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Nodes & labels
      ctx.textAlign = 'center';
      layerPositions.forEach(({ config, nodes }) => {
        ctx.fillStyle = config.color;
        ctx.font = `600 ${compact ? 10 : 11}px "JetBrains Mono", monospace`;
        ctx.fillText(config.name, nodes[0].x, 22);
        if (!compact) {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
          ctx.font = '400 9px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(config.sub, nodes[0].x, 34);
        }
        nodes.forEach((node) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 11, 0, Math.PI * 2);
          ctx.fillStyle = `${config.color}15`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
          ctx.strokeStyle = `${config.color}80`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = config.color;
          ctx.shadowColor = config.color;
          ctx.shadowBlur = node.activation * 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      });

      // Mini loss inset
      if (!compact) {
        const boxW = 120;
        const boxH = 45;
        const boxX = 16;
        const boxY = height - boxH - 12;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') ctx.roundRect(boxX, boxY, boxW, boxH, 6);
        else ctx.rect(boxX, boxY, boxW, boxH);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`loss: ${lossRef.current.toFixed(4)}`, boxX + 8, boxY + 14);
        ctx.beginPath();
        ctx.moveTo(boxX + 8, boxY + 22);
        ctx.bezierCurveTo(boxX + 30, boxY + 28, boxX + 70, boxY + 38, boxX + boxW - 8, boxY + 39);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  // Simulated training metrics while running
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setEpoch((prev) => (prev >= 100 ? 1 : prev + 1));
      setAccuracy((prev) => Number(Math.min(99.4, Math.max(97.8, prev + (Math.random() - 0.48) * 0.05)).toFixed(2)));
      setLoss((prev) => Number(Math.max(0.021, Math.min(0.065, prev + (Math.random() - 0.52) * 0.001)).toFixed(4)));
    }, 1500);
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleReset = () => {
    pulsesRef.current = [];
    setEpoch(INITIAL.epoch);
    setAccuracy(INITIAL.accuracy);
    setLoss(INITIAL.loss);
  };

  return (
    <div
      ref={containerRef}
      id="neural-network-visualizer"
      className="relative w-full rounded-2xl bg-slate-950/70 border border-slate-800 overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Cpu className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">Trajectory prediction model</div>
            <p className="text-[11px] text-slate-500 truncate">LSTM sequence model · TU Clausthal research</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="neural-sim-toggle"
            type="button"
            onClick={() => setIsRunning((r) => !r)}
            aria-pressed={!isRunning}
            aria-label={isRunning ? 'Pause simulation' : 'Resume simulation'}
            title={isRunning ? 'Pause' : 'Play'}
            className={`p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 ${focusRing}`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset simulation"
            title="Reset"
            className={`p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 ${focusRing}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative w-full overflow-hidden" style={{ height: CANVAS_HEIGHT }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          role="img"
          aria-label="Animated neural network: 5 input, 7 LSTM, 6 LSTM, 4 dense and 3 output units"
        />
      </div>

      <div className="px-4 py-2.5 border-t border-slate-800 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-slate-400">
        <span>
          epoch <span className="text-slate-200">{epoch}/100</span>
        </span>
        <span>
          acc <span className="text-emerald-400">{accuracy.toFixed(2)}%</span>
        </span>
        <span>
          loss <span className="text-amber-300">{loss.toFixed(4)}</span>
        </span>
        <span className="ml-auto text-slate-500 hidden sm:inline">{isRunning ? 'running' : 'paused'}</span>
      </div>
    </div>
  );
};
