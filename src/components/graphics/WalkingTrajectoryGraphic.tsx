import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Compass, Navigation, Footprints, Sparkles, Activity } from 'lucide-react';

interface WalkingTrajectoryGraphicProps {
  language?: 'en' | 'de';
  compact?: boolean;
}

export const WalkingTrajectoryGraphic: React.FC<WalkingTrajectoryGraphicProps> = ({
  language = 'en',
  compact = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [walkSpeed, setWalkSpeed] = useState<'normal' | 'fast'>('normal');
  const [stepCount, setStepCount] = useState<number>(1420);
  const [activeMilestone, setActiveMilestone] = useState<number>(1);

  const milestones = [
    {
      id: 0,
      titleEn: 'TU Clausthal (MSc Informatics)',
      titleDe: 'TU Clausthal (MSc Informatik)',
      detailEn: 'Deterministic 4-Node VHDL Network · <12 µs Reaction Time',
      detailDe: 'Deterministisches 4-Knoten VHDL-Netzwerk · <12 µs Reaktionszeit',
      icon: '🎓'
    },
    {
      id: 1,
      titleEn: 'WaDaCon GmbH Hamburg',
      titleDe: 'WaDaCon GmbH Hamburg',
      detailEn: 'Industrial MRF IoT · -60% Incident Response MTTR',
      detailDe: 'Industrielles MRF IoT · -60% MTTR Reaktionszeit',
      icon: '🏭'
    },
    {
      id: 2,
      titleEn: 'AI & Trajectory Prediction',
      titleDe: 'KI & Trajektorienvorhersage',
      detailEn: 'Deep Learning LSTMs & Spatial-Temporal Sequence Modeling',
      detailDe: 'Deep Learning LSTMs & räumlich-zeitliche Sequenzmodelle',
      icon: '🧠'
    },
    {
      id: 3,
      titleEn: 'Career Forward: Available Now',
      titleDe: 'Karriereweg: Ab sofort verfügbar',
      detailEn: 'Ready for Immediate High-Impact Roles Across Germany',
      detailDe: 'Sofort einsatzbereit für anspruchsvolle Rollen bundesweit',
      icon: '🇩🇪'
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = Math.max(300, container.clientWidth || 600));
    let height = (canvas.height = compact ? 220 : 320);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = Math.max(300, container.clientWidth || 600);
      height = canvas.height = compact ? 220 : 320;
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    let frame = 0;
    const footprints: { x: number; y: number; alpha: number; isLeft: boolean }[] = [];
    const particles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[] = [];

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Cyber Grid perspective background
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      const horizonY = height * 0.45;
      const groundY = height * 0.78;

      // Draw perspective vanishing ground lines
      const vanishingX = width * 0.5;
      for (let i = -8; i <= 8; i++) {
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(vanishingX + i * (width / 9), height);
        ctx.stroke();
      }

      // Horizontal grid lines with speed motion
      const speedMultiplier = walkSpeed === 'fast' ? 2.2 : 1.4;
      const gridOffset = isRunning ? (frame * speedMultiplier) % 30 : 0;
      for (let y = horizonY; y <= height; y += 18) {
        const animatedY = y + (gridOffset * ((y - horizonY) / (height - horizonY)));
        if (animatedY <= height) {
          ctx.beginPath();
          ctx.moveTo(0, animatedY);
          ctx.lineTo(width, animatedY);
          ctx.stroke();
        }
      }

      // Moving path / runway
      const pathGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      pathGrad.addColorStop(0, 'rgba(16, 185, 129, 0.0)');
      pathGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)');
      pathGrad.addColorStop(1, 'rgba(16, 185, 129, 0.15)');
      ctx.fillStyle = pathGrad;
      ctx.beginPath();
      ctx.moveTo(vanishingX - 50, horizonY);
      ctx.lineTo(vanishingX + 50, horizonY);
      ctx.lineTo(vanishingX + 220, height);
      ctx.lineTo(vanishingX - 220, height);
      ctx.closePath();
      ctx.fill();

      // Walking Figure Parameters
      const figureX = width * 0.42;
      const figureY = groundY;
      const scale = compact ? 0.75 : 0.95;

      // Walk cycle math (arm & leg swing angle)
      const walkFreq = walkSpeed === 'fast' ? 0.14 : 0.085;
      const phase = isRunning ? frame * walkFreq : 0;
      const swing = Math.sin(phase);
      const cosSwing = Math.cos(phase);
      const bobbing = Math.abs(Math.sin(phase * 2)) * 5; // vertical bounce

      // Add footprints behind walker
      if (isRunning && frame % 18 === 0) {
        const isLeft = (frame / 18) % 2 === 0;
        footprints.push({
          x: figureX + (isLeft ? -10 : 8),
          y: figureY + 12,
          alpha: 0.9,
          isLeft
        });
        setStepCount((prev) => prev + 1);

        // Spawn futuristic sparks on step
        for (let p = 0; p < 4; p++) {
          particles.push({
            x: figureX + (isLeft ? -10 : 8),
            y: figureY + 12,
            vx: (Math.random() - 0.5) * 1.5 - (speedMultiplier * 0.5),
            vy: -Math.random() * 2,
            alpha: 1,
            size: Math.random() * 2.5 + 1
          });
        }
      }

      // Render & update fading footprints moving backwards with ground speed
      for (let i = footprints.length - 1; i >= 0; i--) {
        const fp = footprints[i];
        if (isRunning) {
          fp.x -= speedMultiplier * 0.8;
          fp.alpha -= 0.008;
        }
        if (fp.alpha <= 0 || fp.x < 0) {
          footprints.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(16, 185, 129, ${fp.alpha * 0.7})`;
        ctx.beginPath();
        ctx.ellipse(fp.x, fp.y, 5 * scale, 3 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing ripple ring
        ctx.strokeStyle = `rgba(6, 182, 212, ${fp.alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(fp.x, fp.y, (1 - fp.alpha) * 14 * scale + 5, (1 - fp.alpha) * 7 * scale + 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Render step particles
      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p];
        if (isRunning) {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.alpha -= 0.02;
        }
        if (pt.alpha <= 0) {
          particles.splice(p, 1);
          continue;
        }
        ctx.fillStyle = `rgba(52, 211, 153, ${pt.alpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shadow under walking figure
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(figureX, figureY + 14, 26 * scale, 7 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // ================= DRAW WALKING ENGINEER SILHOUETTE =================
      ctx.save();
      ctx.translate(figureX, figureY - bobbing);

      const legLength = 40 * scale;
      const torsoHeight = 44 * scale;
      const headRadius = 11 * scale;

      // Leg 1 (Back Leg)
      const leg1Angle = swing * 0.55;
      const knee1X = Math.sin(leg1Angle) * (legLength * 0.5);
      const knee1Y = Math.cos(leg1Angle) * (legLength * 0.5);
      const foot1X = Math.sin(leg1Angle * 0.8) * legLength;
      const foot1Y = Math.cos(leg1Angle * 0.8) * legLength;

      ctx.strokeStyle = '#059669'; // Emerald darker
      ctx.lineWidth = 5 * scale;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(knee1X, knee1Y);
      ctx.lineTo(foot1X, foot1Y + 10);
      ctx.stroke();

      // Foot 1
      ctx.lineWidth = 4 * scale;
      ctx.beginPath();
      ctx.moveTo(foot1X, foot1Y + 10);
      ctx.lineTo(foot1X + 8 * scale, foot1Y + 10);
      ctx.stroke();

      // Arm 1 (Back Arm - swings opposite to back leg)
      const arm1Angle = -swing * 0.6;
      ctx.strokeStyle = '#0d9488';
      ctx.lineWidth = 4 * scale;
      ctx.beginPath();
      ctx.moveTo(0, -torsoHeight + 10);
      ctx.lineTo(Math.sin(arm1Angle) * 22 * scale, -torsoHeight + 10 + Math.cos(arm1Angle) * 22 * scale);
      ctx.stroke();

      // Torso & Cyber Backpack (Engineer Equipment)
      ctx.strokeStyle = '#10b981'; // Primary Emerald
      ctx.lineWidth = 7 * scale;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -torsoHeight);
      ctx.stroke();

      // High-tech backpack / laptop bag
      ctx.fillStyle = '#065f46';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-10 * scale, -torsoHeight + 6 * scale, 8 * scale, 22 * scale, 3);
      ctx.fill();
      ctx.stroke();

      // Leg 2 (Front Leg)
      const leg2Angle = -swing * 0.55;
      const knee2X = Math.sin(leg2Angle) * (legLength * 0.5);
      const knee2Y = Math.cos(leg2Angle) * (legLength * 0.5);
      const foot2X = Math.sin(leg2Angle * 0.8) * legLength;
      const foot2Y = Math.cos(leg2Angle * 0.8) * legLength;

      ctx.strokeStyle = '#34d399'; // Bright Emerald
      ctx.lineWidth = 6 * scale;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(knee2X, knee2Y);
      ctx.lineTo(foot2X, foot2Y + 10);
      ctx.stroke();

      // Foot 2
      ctx.lineWidth = 4 * scale;
      ctx.beginPath();
      ctx.moveTo(foot2X, foot2Y + 10);
      ctx.lineTo(foot2X + 9 * scale, foot2Y + 10);
      ctx.stroke();

      // Head & Tech Headset
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(0, -torsoHeight - headRadius, headRadius, 0, Math.PI * 2);
      ctx.fill();

      // Visor / HUD glow
      ctx.strokeStyle = '#38bdf8'; // Cyan visor
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.arc(3 * scale, -torsoHeight - headRadius, headRadius * 0.65, -0.4, 0.4);
      ctx.stroke();

      // Arm 2 (Front Arm - swings opposite to front leg)
      const arm2Angle = swing * 0.6;
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 4.5 * scale;
      ctx.beginPath();
      ctx.moveTo(0, -torsoHeight + 10);
      const handX = Math.sin(arm2Angle) * 24 * scale;
      const handY = -torsoHeight + 10 + Math.cos(arm2Angle) * 24 * scale;
      ctx.lineTo(handX, handY);
      ctx.stroke();

      ctx.restore();

      // ================= TRAJECTORY PREDICTION VECTORS (Research Link!) =================
      // Projected Trajectory Path curving ahead of the walking engineer
      ctx.save();
      const originX = figureX + 10;
      const originY = figureY;

      // Draw Predicted Waypoint Cones (Spatial-Temporal 8-Frame Horizon)
      const waypoints = [
        { x: originX + 45, y: originY - 4, label: 't+1 (0.4s)' },
        { x: originX + 95, y: originY - 10, label: 't+2 (0.8s)' },
        { x: originX + 150, y: originY - 16, label: 't+3 (1.2s)' },
        { x: originX + 210, y: originY - 24, label: 't+4 (1.6s)' },
        { x: originX + 280, y: originY - 32, label: 't+5 (2.0s)' }
      ];

      // Draw trajectory beam
      const trajGrad = ctx.createLinearGradient(originX, originY, originX + 280, originY - 32);
      trajGrad.addColorStop(0, '#10b981');
      trajGrad.addColorStop(0.5, '#06b6d4');
      trajGrad.addColorStop(1, 'rgba(56, 189, 248, 0.1)');

      ctx.strokeStyle = trajGrad;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 4]);
      ctx.lineDashOffset = -frame * 0.8;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      waypoints.forEach((wp) => {
        ctx.lineTo(wp.x, wp.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw prediction confidence bounds (cone)
      ctx.fillStyle = 'rgba(6, 182, 212, 0.06)';
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + 280, originY - 32 - 18);
      ctx.lineTo(originX + 280, originY - 32 + 18);
      ctx.closePath();
      ctx.fill();

      // Draw waypoint node targets
      waypoints.forEach((wp, idx) => {
        if (wp.x < width - 20) {
          // Node ring
          ctx.strokeStyle = idx === 1 ? '#38bdf8' : '#10b981';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(wp.x, wp.y, 4, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = idx === 1 ? '#38bdf8' : '#059669';
          ctx.beginPath();
          ctx.arc(wp.x, wp.y, 2, 0, Math.PI * 2);
          ctx.fill();

          // Timestamp label on higher screens
          if (!compact && idx % 2 === 0) {
            ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
            ctx.font = '9px monospace';
            ctx.fillText(wp.label, wp.x - 14, wp.y - 8);
          }
        }
      });

      // Target Destination Marker ahead
      const targetX = Math.min(width - 55, originX + 280);
      const targetY = originY - 32;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 9, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(targetX - 12, targetY);
      ctx.lineTo(targetX + 12, targetY);
      ctx.moveTo(targetX, targetY - 12);
      ctx.lineTo(targetX, targetY + 12);
      ctx.stroke();

      ctx.restore();

      // Top Header HUD Info
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(
        language === 'de' ? '▶ LIVE-TRAJEKTORIE: BEWEGUNG & FORTSCHRITT' : '▶ LIVE TRAJECTORY: LOCOMOTION & PROGRESS',
        14,
        22
      );

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(
        language === 'de' 
          ? `Geschwindigkeit: ${walkSpeed === 'fast' ? '1.9 m/s (Dynamisch)' : '1.3 m/s (Standard)'} · Schritte: ${stepCount}`
          : `Velocity: ${walkSpeed === 'fast' ? '1.9 m/s (Dynamic)' : '1.3 m/s (Standard)'} · Steps: ${stepCount}`,
        14,
        38
      );

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [isRunning, walkSpeed, compact, language]);

  return (
    <div ref={containerRef} className="relative rounded-2xl bg-slate-950/90 border border-slate-800 overflow-hidden shadow-xl">
      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full block" />

      {/* Floating HUD Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={() => setWalkSpeed(walkSpeed === 'normal' ? 'fast' : 'normal')}
          className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-[10px] font-mono font-bold text-cyan-300 hover:text-white transition-colors"
          title="Adjust walking speed"
        >
          {walkSpeed === 'normal' ? (language === 'de' ? '🚶 Tempo: Normal' : '🚶 Pace: 1x') : (language === 'de' ? '🏃 Tempo: Schnell' : '🏃 Pace: Fast')}
        </button>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-emerald-400 hover:text-white transition-colors"
          title={isRunning ? 'Pause animation' : 'Resume animation'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Trajectory Milestones Footer */}
      {!compact && (
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {milestones.map((m) => {
            const isCurrent = m.id === activeMilestone;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMilestone(m.id)}
                className={`p-2 rounded-xl text-left border transition-all ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                  <span>{m.icon}</span>
                  <span className="truncate">{language === 'de' ? m.titleDe : m.titleEn}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {language === 'de' ? m.detailDe : m.detailEn}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
