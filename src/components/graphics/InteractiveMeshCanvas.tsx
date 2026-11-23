/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Ambient Mesh & Synapse Canvas
 * Dynamic background network representing neural signals and load balancing streams.
 */

import React, { useEffect, useRef } from 'react';
import { jdColor } from '../../utils/tokens';

export const InteractiveMeshCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const nodeCount = Math.min(32, Math.floor((width * height) / 30000));
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: () => string;
    }> = [];

    // Brand colours from the JD tokens (re-read each frame from a cache, so a theme switch applies at once)
    const colors = [
      () => jdColor('--jd-accent', 0.75),
      () => jdColor('--jd-teal', 0.7),
      () => jdColor('--jd-accent', 0.55),
      () => jdColor('--jd-info', 0.5),
    ];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1,
        color: colors[i % colors.length]
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        // Move
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < 0 || a.x > width) a.vx *= -1;
        if (a.y < 0 || a.y > height) a.vy *= -1;
        a.x = Math.max(0, Math.min(width, a.x));
        a.y = Math.max(0, Math.min(height, a.y));

        // Subtle attraction to mouse
        const dxMouse = mouseX - a.x;
        const dyMouse = mouseY - a.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 180 && distMouse > 10) {
          a.x += (dxMouse / distMouse) * 0.25;
          a.y += (dyMouse / distMouse) * 0.25;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        const c = a.color();
        ctx.fillStyle = c;
        ctx.shadowBlur = 8;
        ctx.shadowColor = c;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = jdColor('--jd-teal', alpha * 1.4);
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      if (!reduceMotion) animationFrameId = requestAnimationFrame(render);
    };

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-45 z-0"
    />
  );
};
