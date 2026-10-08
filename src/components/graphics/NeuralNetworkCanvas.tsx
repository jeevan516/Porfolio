import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RefreshCw, Cpu, Activity } from 'lucide-react';

interface NodePos {
  x: number;
  y: number;
  activation: number;
}

export const NeuralNetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [epoch, setEpoch] = useState<number>(42);
  const [accuracy, setAccuracy] = useState<number>(98.42);
  const [loss, setLoss] = useState<number>(0.0418);
  const [hoveredNode, setHoveredNode] = useState<{ layer: string; index: number; val: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rAFId: number | null = null;
    let width = (canvas.width = Math.max(300, container.clientWidth || 600));
    let height = (canvas.height = 360);

    const handleResize = (targetWidth?: number) => {
      if (!container || !canvas) return;
      const newWidth = Math.max(300, Math.floor(targetWidth ?? container.clientWidth));
      const newHeight = 360;
      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || !entries.length) return;
      const entry = entries[0];
      const targetWidth = entry.contentRect?.width ? Math.floor(entry.contentRect.width) : undefined;
      
      if (rAFId !== null) {
        cancelAnimationFrame(rAFId);
      }
      rAFId = requestAnimationFrame(() => {
        handleResize(targetWidth);
      });
    });
    resizeObserver.observe(container);

    // Layer definitions matching deep learning sequence architectures
    const layerConfigs = [
      { name: 'Input', count: 5, color: '#00d4aa', sub: 'Spatial (x,y,t)' },
      { name: 'LSTM 1', count: 7, color: '#0284c7', sub: 'Hidden Units' },
      { name: 'LSTM 2', count: 6, color: '#38bdf8', sub: 'Temporal Cells' },
      { name: 'Dense', count: 4, color: '#a855f7', sub: 'Dense Softmax' },
      { name: 'Output', count: 3, color: '#10b981', sub: 'Trajectory (Δx,Δy)' },
    ];

    interface Pulse {
      src: { x: number; y: number };
      dst: { x: number; y: number };
      t: number;
      speed: number;
      color: string;
    }

    let pulses: Pulse[] = [];
    let lastPulseTime = 0;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Calculate node positions
      const layerPositions: { config: typeof layerConfigs[0]; nodes: NodePos[] }[] = [];
      const padX = Math.min(80, width * 0.1);
      const availableWidth = width - padX * 2;
      const stepX = availableWidth / (layerConfigs.length - 1);

      layerConfigs.forEach((layer, lIdx) => {
        const x = padX + lIdx * stepX;
        const nodes: NodePos[] = [];
        const padY = 55;
        const availableHeight = height - padY * 2;
        const stepY = availableHeight / (layer.count + 1);

        for (let i = 0; i < layer.count; i++) {
          const y = padY + (i + 1) * stepY;
          const osc = Math.sin(time * 0.002 + lIdx * 1.2 + i * 0.8) * 0.5 + 0.5;
          nodes.push({ x, y, activation: 0.2 + osc * 0.8 });
        }
        layerPositions.push({ config: layer, nodes });
      });

      // Draw synaptic connections
      for (let l = 0; l < layerPositions.length - 1; l++) {
        const curLayer = layerPositions[l];
        const nextLayer = layerPositions[l + 1];

        curLayer.nodes.forEach((srcNode, sIdx) => {
          nextLayer.nodes.forEach((dstNode, dIdx) => {
            const weightStrength = Math.sin(sIdx * 2.3 + dIdx * 1.7) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.moveTo(srcNode.x, srcNode.y);
            ctx.lineTo(dstNode.x, dstNode.y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${0.03 + weightStrength * 0.12})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          });
        });
      }

      // Spawn pulses if running
      if (isRunning && time - lastPulseTime > 140) {
        lastPulseTime = time;
        const randLayer = Math.floor(Math.random() * (layerPositions.length - 1));
        const srcNodes = layerPositions[randLayer].nodes;
        const dstNodes = layerPositions[randLayer + 1].nodes;
        const src = srcNodes[Math.floor(Math.random() * srcNodes.length)];
        const dst = dstNodes[Math.floor(Math.random() * dstNodes.length)];
        pulses.push({
          src: { x: src.x, y: src.y },
          dst: { x: dst.x, y: dst.y },
          t: 0,
          speed: 0.02 + Math.random() * 0.015,
          color: layerPositions[randLayer].config.color,
        });
      }

      // Update and draw pulses
      pulses = pulses.filter((p) => p.t <= 1);
      pulses.forEach((p) => {
        if (isRunning) {
          p.t += p.speed;
        }
        const curX = p.src.x + (p.dst.x - p.src.x) * p.t;
        const curY = p.src.y + (p.dst.y - p.src.y) * p.t;
        const alpha = p.t < 0.5 ? p.t * 2 : (1 - p.t) * 2;

        ctx.beginPath();
        ctx.arc(curX, curY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw nodes and layer headers
      layerPositions.forEach((l) => {
        const { config, nodes } = l;

        // Layer labels
        ctx.fillStyle = config.color;
        ctx.font = '600 11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(config.name, nodes[0].x, 26);

        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = '400 9px Plus Jakarta Sans, sans-serif';
        ctx.fillText(config.sub, nodes[0].x, 38);

        // Nodes
        nodes.forEach((node) => {
          // Outer halo
          ctx.beginPath();
          ctx.arc(node.x, node.y, 11, 0, Math.PI * 2);
          ctx.fillStyle = `${config.color}15`;
          ctx.fill();

          // Ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
          ctx.strokeStyle = `${config.color}80`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Core
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = config.color;
          ctx.shadowColor = config.color;
          ctx.shadowBlur = node.activation * 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      });

      // Draw mini loss graph inset
      const boxW = 120;
      const boxH = 45;
      const boxX = 16;
      const boxY = height - boxH - 12;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText('loss: 0.0418', boxX + 8, boxY + 14);

      // Loss curve
      ctx.beginPath();
      ctx.moveTo(boxX + 8, boxY + 22);
      ctx.bezierCurveTo(boxX + 30, boxY + 28, boxX + 70, boxY + 38, boxX + boxW - 8, boxY + 39);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (rAFId !== null) {
        cancelAnimationFrame(rAFId);
      }
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [isRunning]);

  // Periodic metric jitter for live simulation
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setEpoch((prev) => (prev >= 100 ? 1 : prev + 1));
      setAccuracy((prev) => Number((Math.min(99.4, Math.max(97.8, prev + (Math.random() - 0.48) * 0.05))).toFixed(2)));
      setLoss((prev) => Number((Math.max(0.021, Math.min(0.065, prev + (Math.random() - 0.52) * 0.001))).toFixed(4)));
    }, 1500);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div
      ref={containerRef}
      id="neural-network-visualizer"
      className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900/90 via-[#0a1122]/90 to-slate-950/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl overflow-hidden"
    >
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-800/80 bg-slate-950/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Spatial-Temporal Trajectory Model
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Inference
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              LSTM Sequence Prediction · TU Clausthal Research
            </p>
          </div>
        </div>

        {/* Live Metrics Pill Group */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/50">
            <span className="text-slate-400">Epoch:</span>
            <span className="text-cyan-300 font-semibold">{epoch}/100</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/50">
            <span className="text-slate-400">Accuracy:</span>
            <span className="text-emerald-400 font-semibold">{accuracy}%</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/50">
            <span className="text-slate-400">Loss:</span>
            <span className="text-amber-300 font-semibold">{loss}</span>
          </div>
          <button
            id="neural-sim-toggle"
            onClick={() => setIsRunning(!isRunning)}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title={isRunning ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-[360px] overflow-hidden bg-slate-950/40">
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
      </div>

      {/* Bottom explanatory bar */}
      <div className="px-5 py-2.5 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time forward propagation & gradient backprop telemetry</span>
        </div>
        <div className="font-mono text-[10px] text-slate-500">
          Architecture: 5 In → 7 LSTM → 6 LSTM → 4 Dense → 3 Out
        </div>
      </div>
    </div>
  );
};
