/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * UI/UX Pro Max - Spotlight Card Component
 * Powered by Motion (github.com/motiondivision/motion)
 * Features cursor-tracking radiant spotlight and subtle 3D tilt physics.
 */

import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  enableTilt?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(16, 185, 129, 0.15)', // Emerald luminous glow
  enableTilt = false,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // 3D Tilt calculation
  const rawTiltX = useMotionValue(0);
  const rawTiltY = useMotionValue(0);
  const tiltSpringX = useSpring(rawTiltX, { stiffness: 300, damping: 20 });
  const tiltSpringY = useSpring(rawTiltY, { stiffness: 300, damping: 20 });
  const rotateX = useTransform(tiltSpringY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(tiltSpringX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    mouseX.set(x);
    mouseY.set(y);

    if (enableTilt) {
      const normalizedX = (x / width) - 0.5;
      const normalizedY = (y / height) - 0.5;
      rawTiltX.set(normalizedX);
      rawTiltY.set(normalizedY);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
    if (enableTilt) {
      rawTiltX.set(0);
      rawTiltY.set(0);
    }
  };

  const backgroundGradient = useMotionTemplate`
    radial-gradient(
      450px circle at ${mouseX}px ${mouseY}px,
      ${spotlightColor},
      transparent 80%
    )
  `;

  const borderGradient = useMotionTemplate`
    radial-gradient(
      320px circle at ${mouseX}px ${mouseY}px,
      rgba(52, 211, 153, 0.45),
      transparent 70%
    )
  `;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={enableTilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      className={`group relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/80 transition-[border-color,box-shadow,translate] duration-300 hover:border-slate-700 hover:shadow-lg hover:shadow-black/30 ${className}`}
      {...(props as any)}
    >
      {/* Dynamic Cursor Spotlight Radial Overlay */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
        style={{ background: backgroundGradient }}
      />

      {/* Dynamic Cursor Spotlight Border Accent (masked to a 1px ring) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
        style={{
          background: borderGradient,
          maskImage: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskImage: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />

      {/* Card Content with Relative Depth */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
};
