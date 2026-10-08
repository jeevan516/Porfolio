import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Sparkles, 
  Activity, 
  Volume2, 
  Mic, 
  Radio, 
  CheckCircle2, 
  Maximize2,
  Sliders,
  Eye,
  Smile,
  Zap,
  Layers,
  Cpu
} from 'lucide-react';

export interface MovingExplainingAvatarProps {
  isSpeaking: boolean;
  language?: 'en' | 'de';
  activeTopic?: string;
  avatarStyle?: 'studio' | 'holographic';
  gestureMode?: 'conversational' | 'architecture' | 'highlights';
}

export const MovingExplainingAvatar: React.FC<MovingExplainingAvatarProps> = ({
  isSpeaking,
  language = 'en',
  activeTopic = 'Data & Infrastructure',
  avatarStyle = 'studio',
  gestureMode: initialGestureMode = 'conversational'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentStyle, setCurrentStyle] = useState<'studio' | 'holographic'>(avatarStyle);
  const [gestureMode, setGestureMode] = useState<'conversational' | 'architecture' | 'highlights'>(initialGestureMode);
  const [expressionMood, setExpressionMood] = useState<'confident' | 'analytical' | 'warm'>('confident');
  const [mouseTracking, setMouseTracking] = useState(true);

  // Mouse / Pointer coordinates relative to canvas center (-1 to 1)
  const mousePosRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseTracking || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / rect.width; // 0 to 1
    const rawY = (e.clientY - rect.top) / rect.height; // 0 to 1
    mousePosRef.current = {
      x: (rawX - 0.5) * 2, // -1 to 1
      y: (rawY - 0.5) * 2
    };
  }, [mouseTracking]);

  const handleMouseLeave = useCallback(() => {
    mousePosRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let displayWidth = Math.max(280, container.clientWidth || 320);
    let displayHeight = 350;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    const handleResize = () => {
      if (!container || !canvas) return;
      const newWidth = Math.max(280, container.clientWidth || 320);
      if (Math.abs(displayWidth - newWidth) > 5) {
        displayWidth = newWidth;
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }
    };

    window.addEventListener('resize', handleResize);

    // Dynamic Kinetics variables
    let frame = 0;
    let eyeBlinkTimer = 0;
    let isBlinking = false;
    let blinkProgress = 0; // 0 (open) -> 1 (closed) -> 0
    let saccadeX = 0;
    let saccadeY = 0;
    let saccadeTimer = 0;

    // Head kinetics interpolation
    let headRoll = 0;
    let headPitch = 0;
    let headYaw = 0;

    // Smoothed gaze
    let gazeX = 0;
    let gazeY = 0;

    // Hand & Gesture kinetics
    let handGesturePhase = 0;
    let handPosX = 0;
    let handPosY = 0;

    // Ambient floating studio dust motes
    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random() * displayWidth,
      y: Math.random() * displayHeight,
      r: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      frame++;

      // Scale context for high-DPI retina display
      ctx.save();
      ctx.scale(dpr, dpr);

      const centerX = displayWidth / 2;
      const centerY = displayHeight / 2;

      // 1. Natural Breathing & Posture Kinetics
      const breathe = Math.sin(frame * 0.038) * 3.2; // slow human respiratory rhythm
      const bodySway = Math.sin(frame * 0.02) * 1.4;

      // 2. Micro-Saccade Gaze Generation
      saccadeTimer++;
      if (saccadeTimer > 160 + Math.random() * 80) {
        saccadeX = (Math.random() - 0.5) * 0.4;
        saccadeY = (Math.random() - 0.5) * 0.25;
        saccadeTimer = 0;
      }

      // Smooth gaze tracking (mouse target + subtle saccade)
      const targetGazeX = mousePosRef.current.x * 0.7 + saccadeX;
      const targetGazeY = mousePosRef.current.y * 0.5 + saccadeY;
      gazeX += (targetGazeX - gazeX) * 0.08;
      gazeY += (targetGazeY - gazeY) * 0.08;

      // 3. Head Kinetics (Speech emphasis & engagement)
      let targetHeadPitch = 0;
      let targetHeadRoll = 0;
      let targetHeadYaw = gazeX * 0.08;

      if (isSpeaking) {
        // Natural speech rhythm: rhythmic nodding & expressive tilt
        targetHeadPitch = Math.sin(frame * 0.11) * 2.8 + Math.cos(frame * 0.05) * 1.5;
        targetHeadRoll = Math.sin(frame * 0.07) * 0.04 + (expressionMood === 'warm' ? 0.02 : 0);
      } else {
        // Attentive resting posture
        targetHeadPitch = Math.sin(frame * 0.025) * 0.8;
        targetHeadRoll = Math.sin(frame * 0.015) * 0.015;
      }

      headPitch += (targetHeadPitch - headPitch) * 0.1;
      headRoll += (targetHeadRoll - headRoll) * 0.1;
      headYaw += (targetHeadYaw - headYaw) * 0.1;

      // 4. Natural Blinking (Smooth cubic easing)
      eyeBlinkTimer++;
      if (eyeBlinkTimer > 220) {
        isBlinking = true;
        blinkProgress += 0.22;
        if (blinkProgress >= 1.0) {
          blinkProgress = 1.0;
        }
        if (eyeBlinkTimer > 230) {
          blinkProgress -= 0.24;
          if (blinkProgress <= 0) {
            blinkProgress = 0;
            isBlinking = false;
            eyeBlinkTimer = Math.floor(Math.random() * 50); // randomize interval
          }
        }
      }

      // 5. Hand Gesturing Phase
      handGesturePhase += isSpeaking ? 0.045 : 0.012;

      // ------------------------------------------------------------------
      // BACKGROUND & STUDIO AMBIENCE
      // ------------------------------------------------------------------
      // Dark executive studio gradient
      const bgGrad = ctx.createLinearGradient(0, 0, displayWidth, displayHeight);
      if (currentStyle === 'studio') {
        bgGrad.addColorStop(0, '#060a14');
        bgGrad.addColorStop(0.5, '#0b1325');
        bgGrad.addColorStop(1, '#05070e');
      } else {
        bgGrad.addColorStop(0, '#040b17');
        bgGrad.addColorStop(0.5, '#08172e');
        bgGrad.addColorStop(1, '#02050b');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Studio Spotlight / Key Glow
      const spotGrad = ctx.createRadialGradient(
        centerX + 20,
        centerY - 50,
        10,
        centerX,
        centerY,
        displayWidth * 0.7
      );
      if (currentStyle === 'studio') {
        spotGrad.addColorStop(0, isSpeaking ? 'rgba(16, 185, 129, 0.22)' : 'rgba(56, 189, 248, 0.14)');
        spotGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.35)');
        spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        spotGrad.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
        spotGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.1)');
        spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Floating Ambient Studio Particles / Bokeh
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y < 0) p.y = displayHeight;
        if (p.x < 0) p.x = displayWidth;
        if (p.x > displayWidth) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = currentStyle === 'studio' 
          ? `rgba(52, 211, 153, ${p.alpha * (isSpeaking ? 0.7 : 0.3)})` 
          : `rgba(56, 189, 248, ${p.alpha * 0.8})`;
        ctx.fill();
      });

      // Sound Wave Ripples emanating during active speech
      if (isSpeaking) {
        ctx.save();
        for (let i = 0; i < 4; i++) {
          const ringRad = 70 + i * 28 + ((frame * 1.8) % 36);
          const ringAlpha = Math.max(0, 0.22 - (ringRad / 210));
          ctx.strokeStyle = currentStyle === 'studio' 
            ? `rgba(16, 185, 129, ${ringAlpha})` 
            : `rgba(6, 182, 212, ${ringAlpha})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(centerX + bodySway, centerY - 45 + headPitch, ringRad, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // ------------------------------------------------------------------
      // TORSO & BESPOKE EXECUTIVE SUIT
      // ------------------------------------------------------------------
      ctx.save();
      const bodyY = centerY + 78 + breathe;

      // Shoulders & Torso Outline
      ctx.beginPath();
      ctx.moveTo(centerX - 118, displayHeight);
      ctx.lineTo(centerX - 100, bodyY + 34);
      ctx.quadraticCurveTo(centerX - 65, bodyY - 12, centerX, bodyY - 2);
      ctx.quadraticCurveTo(centerX + 65, bodyY - 12, centerX + 100, bodyY + 34);
      ctx.lineTo(centerX + 118, displayHeight);
      ctx.closePath();

      if (currentStyle === 'studio') {
        // Tailored Charcoal/Midnight Navy Blazer
        const suitGrad = ctx.createLinearGradient(centerX - 80, bodyY, centerX + 80, displayHeight);
        suitGrad.addColorStop(0, '#1a2234');
        suitGrad.addColorStop(0.5, '#0f172a');
        suitGrad.addColorStop(1, '#020617');
        ctx.fillStyle = suitGrad;
        ctx.fill();

        // Blazer Edge Highlight & Seam
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Inner V-Neck / Shirt Layer
        ctx.beginPath();
        ctx.moveTo(centerX - 36, bodyY + 2);
        ctx.lineTo(centerX, bodyY + 70);
        ctx.lineTo(centerX + 36, bodyY + 2);
        ctx.closePath();
        ctx.fillStyle = '#090d16';
        ctx.fill();

        // Crisp White Shirt Collar
        ctx.beginPath();
        ctx.moveTo(centerX - 24, bodyY + 4);
        ctx.lineTo(centerX, bodyY + 42);
        ctx.lineTo(centerX + 24, bodyY + 4);
        ctx.fillStyle = '#f8fafc';
        ctx.fill();

        // Dark Executive Tie / Collar Button
        ctx.beginPath();
        ctx.moveTo(centerX - 7, bodyY + 42);
        ctx.lineTo(centerX + 7, bodyY + 42);
        ctx.lineTo(centerX + 4, bodyY + 95);
        ctx.lineTo(centerX, bodyY + 105);
        ctx.lineTo(centerX - 4, bodyY + 95);
        ctx.closePath();
        ctx.fillStyle = '#1e293b';
        ctx.fill();

        // Lapels
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        // Left Lapel
        ctx.moveTo(centerX - 58, bodyY + 12);
        ctx.lineTo(centerX - 16, bodyY + 72);
        ctx.lineTo(centerX, displayHeight);
        // Right Lapel
        ctx.moveTo(centerX + 58, bodyY + 12);
        ctx.lineTo(centerX + 16, bodyY + 72);
        ctx.lineTo(centerX, displayHeight);
        ctx.stroke();

        // Pocket Square with Emerald Edge
        ctx.beginPath();
        ctx.moveTo(centerX - 78, bodyY + 68);
        ctx.lineTo(centerX - 52, bodyY + 64);
        ctx.lineTo(centerX - 50, bodyY + 75);
        ctx.lineTo(centerX - 76, bodyY + 79);
        ctx.closePath();
        ctx.fillStyle = '#10b981';
        ctx.fill();

        // Lapel Tech Pin (Glowing Emerald Insignia)
        ctx.beginPath();
        ctx.arc(centerX + 38, bodyY + 46, 3, 0, Math.PI * 2);
        ctx.fillStyle = isSpeaking ? '#10b981' : '#06b6d4';
        ctx.fill();
      } else {
        // Holographic Cyber Architect Rig
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Circuit Grid Matrix across shoulders
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 75, bodyY + 30);
        ctx.lineTo(centerX + 75, bodyY + 30);
        ctx.moveTo(centerX - 60, bodyY + 55);
        ctx.lineTo(centerX + 60, bodyY + 55);
        ctx.moveTo(centerX, bodyY);
        ctx.lineTo(centerX, displayHeight);
        ctx.stroke();
      }
      ctx.restore();

      // ------------------------------------------------------------------
      // GESTURING ARM & ARTICULATED HAND
      // ------------------------------------------------------------------
      ctx.save();
      // Target hand position based on mode & speech rhythm
      let targetHandX = centerX + 75;
      let targetHandY = bodyY + 35;

      if (isSpeaking) {
        if (gestureMode === 'conversational') {
          // Open, welcoming gesture
          targetHandX = centerX + 65 + Math.sin(handGesturePhase) * 25;
          targetHandY = bodyY - 12 + Math.cos(handGesturePhase * 1.3) * 20;
        } else if (gestureMode === 'architecture') {
          // Spatial architectural framing (raising hand to show system tiers)
          targetHandX = centerX + 80 + Math.sin(handGesturePhase * 0.9) * 20;
          targetHandY = bodyY - 35 + Math.cos(handGesturePhase) * 16;
        } else {
          // High-precision pitch gesture (forward emphasis)
          targetHandX = centerX + 70 + Math.sin(handGesturePhase * 1.2) * 28;
          targetHandY = bodyY + 2 + Math.cos(handGesturePhase * 0.8) * 18;
        }
      } else {
        // Resting posture
        targetHandX = centerX + 62;
        targetHandY = bodyY + 48;
      }

      handPosX += (targetHandX - handPosX) * 0.1;
      handPosY += (targetHandY - handPosY) * 0.1;

      // Forearm connecting shoulder to hand
      const shoulderX = centerX + 72;
      const shoulderY = bodyY + 25;
      const elbowX = (shoulderX + handPosX) / 2 + 18;
      const elbowY = Math.max(shoulderY + 35, (shoulderY + handPosY) / 2 + 25);

      // Draw Arm
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.quadraticCurveTo(elbowX, elbowY, handPosX, handPosY);
      ctx.strokeStyle = currentStyle === 'studio' ? '#1e293b' : 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Hand Wrist & Palm
      ctx.save();
      ctx.translate(handPosX, handPosY);
      const handAngle = Math.sin(handGesturePhase) * 0.15 - 0.2;
      ctx.rotate(handAngle);

      // Palm (Rich natural skin gradient)
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 14, 0, 0, Math.PI * 2);
      const palmGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 14);
      palmGrad.addColorStop(0, '#e5a56d');
      palmGrad.addColorStop(1, '#c28145');
      ctx.fillStyle = palmGrad;
      ctx.fill();

      // Articulated Fingers (Thumb, Index, Middle, Ring, Pinky)
      const fingerColors = ['#d8955d', '#d49159', '#cf8c54', '#cb8850'];
      for (let f = 0; f < 4; f++) {
        const fingerSpread = (f - 1.5) * 4.8;
        const fingerLen = f === 1 || f === 2 ? 14 : 11;
        const flex = isSpeaking ? Math.sin(handGesturePhase + f * 0.6) * 2.5 : 0;

        ctx.beginPath();
        ctx.ellipse(fingerSpread, -12 - flex, 3.2, fingerLen / 2, 0.08 * (f - 1.5), 0, Math.PI * 2);
        ctx.fillStyle = fingerColors[f];
        ctx.fill();
      }

      // Thumb
      ctx.beginPath();
      ctx.ellipse(-11, -3, 3.8, 8, -0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#db9860';
      ctx.fill();

      // Floating Shimmering Tech HUD Particle from Hand during speech
      if (isSpeaking) {
        ctx.beginPath();
        ctx.arc(8, -26, 4.5 + Math.sin(frame * 0.2) * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = currentStyle === 'studio' ? '#10b981' : '#38bdf8';
        ctx.shadowColor = currentStyle === 'studio' ? '#10b981' : '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
      ctx.restore();
      ctx.restore();

      // ------------------------------------------------------------------
      // HEAD, FACE, EYES & EXPRESSIVE LIKENESS
      // ------------------------------------------------------------------
      ctx.save();
      const headCenterY = centerY - 28 + headPitch + breathe * 0.5;
      ctx.translate(centerX + bodySway, headCenterY);
      ctx.rotate(headRoll);

      // Neck
      ctx.beginPath();
      ctx.moveTo(-19, 36);
      ctx.lineTo(-17, 72);
      ctx.lineTo(17, 72);
      ctx.lineTo(19, 36);
      ctx.closePath();
      const neckGrad = ctx.createLinearGradient(-18, 36, 18, 72);
      neckGrad.addColorStop(0, '#be7e40');
      neckGrad.addColorStop(1, '#a86c32');
      ctx.fillStyle = neckGrad;
      ctx.fill();

      // Neck Ambient Occlusion Shadow
      ctx.beginPath();
      ctx.ellipse(0, 48, 18, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
      ctx.fill();

      // Head / Face Contour (Structured Jaw & High Cheekbones)
      ctx.beginPath();
      ctx.moveTo(-39, -24);
      ctx.quadraticCurveTo(-45, 26, -24, 49);
      ctx.quadraticCurveTo(0, 64, 24, 49);
      ctx.quadraticCurveTo(45, 26, 39, -24);
      ctx.quadraticCurveTo(0, -62, -39, -24);
      ctx.closePath();

      // 3-Point Light Face Shading
      const faceGrad = ctx.createRadialGradient(-10, -5, 10, 0, 0, 56);
      faceGrad.addColorStop(0, '#e8aa72'); // Warm key light on forehead & nose
      faceGrad.addColorStop(0.55, '#d3935b'); // Natural warm skin tone
      faceGrad.addColorStop(0.88, '#be7f45'); // Shadow contour
      faceGrad.addColorStop(1, '#9f642d'); // Jawline depth
      ctx.fillStyle = faceGrad;
      ctx.fill();

      // Subsurface Warmth on Cheeks & Temples (Rosy warmth)
      ctx.beginPath();
      ctx.ellipse(-23, 14, 11, 7, 0.1, 0, Math.PI * 2);
      ctx.ellipse(23, 14, 11, 7, -0.1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
      ctx.fill();

      // Ears with subtle inner cartilage detail
      // Left Ear
      ctx.beginPath();
      ctx.ellipse(-43, 7, 7, 13, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = '#c78546';
      ctx.fill();
      // Right Ear
      ctx.beginPath();
      ctx.ellipse(43, 7, 7, 13, -0.1, 0, Math.PI * 2);
      ctx.fillStyle = '#c78546';
      ctx.fill();

      // ------------------------------------------------------------------
      // HAIR: Modern Executive Cut with Textured Strands & Rim Lighting
      // ------------------------------------------------------------------
      ctx.beginPath();
      ctx.moveTo(-43, -16);
      ctx.quadraticCurveTo(-48, -58, -5, -67);
      ctx.quadraticCurveTo(42, -64, 44, -16);
      ctx.quadraticCurveTo(36, -38, 0, -46);
      ctx.quadraticCurveTo(-36, -38, -43, -16);
      ctx.closePath();
      ctx.fillStyle = '#11141e';
      ctx.fill();

      // Hair Strands & Volume Highlights
      ctx.strokeStyle = '#273142';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-24, -60);
      ctx.quadraticCurveTo(0, -64, 28, -52);
      ctx.moveTo(-15, -54);
      ctx.quadraticCurveTo(12, -56, 35, -42);
      ctx.moveTo(-32, -48);
      ctx.quadraticCurveTo(-15, -56, 12, -50);
      ctx.stroke();

      // Emerald/Cyan Rim Light Catch on Hair Contour
      ctx.strokeStyle = currentStyle === 'studio' ? 'rgba(52, 211, 153, 0.45)' : 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(-26, -56, 18, Math.PI * 0.9, Math.PI * 1.5);
      ctx.stroke();

      // ------------------------------------------------------------------
      // EYEBROWS (Expressive speech animation)
      // ------------------------------------------------------------------
      const browLift = isSpeaking ? Math.sin(frame * 0.09) * 2.2 : (expressionMood === 'warm' ? 1.2 : 0);
      const browFurrow = expressionMood === 'analytical' ? 1.4 : 0;

      ctx.strokeStyle = '#181e29';
      ctx.lineWidth = 3.8;
      ctx.lineCap = 'round';

      // Left Eyebrow
      ctx.beginPath();
      ctx.moveTo(-29, -13 - browLift);
      ctx.quadraticCurveTo(-18, -19 - browLift + browFurrow, -7, -14 - browLift + browFurrow);
      ctx.stroke();

      // Right Eyebrow
      ctx.beginPath();
      ctx.moveTo(7, -14 - browLift + browFurrow);
      ctx.quadraticCurveTo(18, -19 - browLift + browFurrow, 29, -13 - browLift);
      ctx.stroke();

      // ------------------------------------------------------------------
      // EYES: Multi-Layered Sclera, Iris, Pupil, Catchlights & Blink Rig
      // ------------------------------------------------------------------
      const eyeCenterLeftX = -18;
      const eyeCenterRightX = 18;
      const eyeY = 2;

      // Eye pupil tracking offset
      const pupilShiftX = gazeX * 2.6;
      const pupilShiftY = gazeY * 1.8;

      if (blinkProgress > 0.6) {
        // Closed / Blinking Eyelid (Smooth natural crease)
        ctx.strokeStyle = '#5a3b1a';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(-28, eyeY + 2);
        ctx.quadraticCurveTo(-18, eyeY + 6, -8, eyeY + 2);
        ctx.moveTo(8, eyeY + 2);
        ctx.quadraticCurveTo(18, eyeY + 6, 28, eyeY + 2);
        ctx.stroke();
      } else {
        // Open Eyes (Both left and right)
        [eyeCenterLeftX, eyeCenterRightX].forEach((eyeCenterX) => {
          // Eye Sclera (Ivory White with soft shading)
          ctx.beginPath();
          ctx.ellipse(eyeCenterX, eyeY, 9.5, 6.2 * (1 - blinkProgress * 0.7), 0, 0, Math.PI * 2);
          ctx.fillStyle = '#f8fafc';
          ctx.fill();

          // Sclera Upper Shadow
          ctx.beginPath();
          ctx.ellipse(eyeCenterX, eyeY - 2.5, 8.5, 2.5, 0, 0, Math.PI);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
          ctx.fill();

          // Iris (Warm Deep Amber/Brown)
          const curPupilX = eyeCenterX + pupilShiftX;
          const curPupilY = eyeY + pupilShiftY;

          ctx.beginPath();
          ctx.arc(curPupilX, curPupilY, 4.8, 0, Math.PI * 2);
          const irisGrad = ctx.createRadialGradient(curPupilX, curPupilY, 1, curPupilX, curPupilY, 4.8);
          irisGrad.addColorStop(0, '#3d200e');
          irisGrad.addColorStop(0.7, '#241206');
          irisGrad.addColorStop(1, '#150a03'); // Limbal ring
          ctx.fillStyle = irisGrad;
          ctx.fill();

          // Pupil (Jet Black)
          ctx.beginPath();
          ctx.arc(curPupilX, curPupilY, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = '#0a0502';
          ctx.fill();

          // Specular Catchlight #1 (Primary Key Light Reflection)
          ctx.beginPath();
          ctx.arc(curPupilX - 1.5, curPupilY - 1.5, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          // Specular Catchlight #2 (Soft Fill Reflection)
          ctx.beginPath();
          ctx.arc(curPupilX + 1.6, curPupilY + 1.2, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.fill();

          // Upper Eyelash line
          ctx.strokeStyle = '#1a202c';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.ellipse(eyeCenterX, eyeY - 2, 9, 4, 0, Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();
        });
      }

      // ------------------------------------------------------------------
      // SMART EXECUTIVE GLASSES (Sleek Titanium Rectangles with Anti-Glare)
      // ------------------------------------------------------------------
      ctx.strokeStyle = currentStyle === 'studio' ? '#334155' : '#38bdf8';
      ctx.lineWidth = 2.2;

      // Left Frame
      ctx.beginPath();
      ctx.roundRect(-30, -7, 24, 18, 5);
      ctx.stroke();

      // Right Frame
      ctx.beginPath();
      ctx.roundRect(6, -7, 24, 18, 5);
      ctx.stroke();

      // Bridge
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(6, 0);
      ctx.stroke();

      // Anti-Reflective Studio Glare Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-25, -4);
      ctx.lineTo(-13, 6);
      ctx.moveTo(11, -4);
      ctx.lineTo(23, 6);
      ctx.stroke();

      // ------------------------------------------------------------------
      // NOSE (Sculpted Bridge & Nostril Contour)
      // ------------------------------------------------------------------
      ctx.strokeStyle = '#ab6b2f';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, -2);
      ctx.lineTo(2.5, 17);
      ctx.lineTo(-3, 21);
      ctx.stroke();

      // Subtle nose tip highlight
      ctx.beginPath();
      ctx.arc(0, 19, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fill();

      // ------------------------------------------------------------------
      // MOUTH & PHONETIC LIP-SYNC RIG
      // ------------------------------------------------------------------
      ctx.save();
      const mouthY = 36;

      if (isSpeaking) {
        // Multi-Viseme speech animation (syllables oscillate dynamically)
        const visemeCycle = Math.sin(frame * 0.32) * 0.6 + Math.cos(frame * 0.22) * 0.4;
        const openH = Math.max(3.5, Math.abs(visemeCycle) * 11);
        const openW = Math.max(9, 15 - Math.abs(visemeCycle) * 3);

        // Oral Cavity (Depth)
        ctx.beginPath();
        ctx.ellipse(0, mouthY, openW, openH, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#451010';
        ctx.fill();

        // Upper Teeth (Natural smile alignment)
        ctx.beginPath();
        ctx.ellipse(0, mouthY - openH * 0.45, openW * 0.72, 2.8, 0, 0, Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Subtle Tongue Hint
        ctx.beginPath();
        ctx.ellipse(0, mouthY + openH * 0.4, openW * 0.5, 2.2, 0, Math.PI, 0);
        ctx.fillStyle = '#b95656';
        ctx.fill();

        // Lip Contours
        ctx.strokeStyle = '#93493b';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(0, mouthY, openW + 1, openH + 1, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Resting Expression: Confident, Friendly Duchenne Smile
        const smileLift = expressionMood === 'warm' ? 5 : 3.5;
        ctx.strokeStyle = '#93493b';
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-13, mouthY);
        ctx.quadraticCurveTo(0, mouthY + smileLift, 13, mouthY);
        ctx.stroke();

        // Subtle lip corners
        ctx.beginPath();
        ctx.arc(-13, mouthY - 0.5, 1, 0, Math.PI * 2);
        ctx.arc(13, mouthY - 0.5, 1, 0, Math.PI * 2);
        ctx.fillStyle = '#7a3b30';
        ctx.fill();
      }
      ctx.restore();

      ctx.restore(); // end head transform

      // ------------------------------------------------------------------
      // BROADCAST STUDIO MICROPHONE (Shure SM7B Style with "ON AIR" Ring)
      // ------------------------------------------------------------------
      ctx.save();
      const micX = centerX - 65 + bodySway * 0.4;
      const micY = centerY + 76;

      // Boom Arm Rod
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 5.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(10, displayHeight);
      ctx.lineTo(micX, micY + 32);
      ctx.stroke();

      // Mic Body Transform
      ctx.save();
      ctx.translate(micX, micY);
      ctx.rotate(-0.35);

      // Foam Windscreen Capsule
      ctx.beginPath();
      ctx.roundRect(-11, -26, 22, 38, 9);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Metal Chassis Base
      ctx.beginPath();
      ctx.roundRect(-10, 12, 20, 15, 3);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      // "ON AIR" Live LED Status Ring
      ctx.beginPath();
      ctx.arc(0, 18, 3, 0, Math.PI * 2);
      ctx.fillStyle = isSpeaking ? '#10b981' : '#f59e0b';
      ctx.shadowColor = isSpeaking ? '#10b981' : '#f59e0b';
      ctx.shadowBlur = isSpeaking ? 12 : 4;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
      ctx.restore();

      ctx.restore(); // restore dpr scale

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSpeaking, currentStyle, gestureMode, expressionMood, mouseTracking]);

  return (
    <div className="w-full flex flex-col items-center justify-center relative select-none">
      
      {/* Moving Avatar Canvas Stage */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[340px] aspect-[4/5] max-h-[360px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-[#040711] border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 flex items-center justify-center cursor-crosshair group"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />

        {/* Top Floating Badge: Explaining Live Telemetry */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-emerald-500/50 text-[10px] font-mono text-emerald-300 backdrop-blur-md shadow-lg">
          <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
          <span className="font-bold">
            {isSpeaking 
              ? (language === 'de' ? 'LIVE-ERKLÄRUNG' : 'EXPLAINING LIVE') 
              : (language === 'de' ? 'BEREIT' : 'READY')}
          </span>
        </div>

        {/* Top Right: Style & Gaze Switcher */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-slate-950/90 p-0.5 rounded-xl border border-slate-800 text-[10px] font-mono shadow-md backdrop-blur-md">
          <button
            onClick={() => setMouseTracking(!mouseTracking)}
            className={`p-1.5 rounded-lg transition-colors ${
              mouseTracking 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title={mouseTracking ? 'Eye Gaze: Following Cursor' : 'Eye Gaze: Direct Camera'}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentStyle(currentStyle === 'studio' ? 'holographic' : 'studio')}
            className={`px-2 py-0.5 rounded-lg transition-colors font-bold ${
              currentStyle === 'studio' 
                ? 'bg-slate-800 text-slate-200' 
                : 'bg-cyan-500 text-slate-950'
            }`}
            title="Toggle Studio Presenter vs Holographic AI mode"
          >
            {currentStyle === 'studio' ? 'Studio' : 'Holo'}
          </button>
        </div>

        {/* Bottom Floating Technical Topic Telemetry */}
        <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[10px] font-mono backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-slate-300 truncate pr-2">
            <Activity className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{activeTopic}</span>
          </div>
          <span className="text-emerald-400 font-bold shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            60 FPS Kinetics
          </span>
        </div>
      </div>

      {/* Interactive Controls Strip: Gestures & Expression Mood */}
      <div className="w-full max-w-[340px] mt-2.5 space-y-1.5">
        <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-slate-950/90 border border-slate-800 text-[10px] font-mono">
          <span className="text-slate-400 px-1.5 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-emerald-400" />
            {language === 'de' ? 'Geste:' : 'Gesture:'}
          </span>
          <button
            onClick={() => setGestureMode('conversational')}
            className={`flex-1 py-1 rounded-lg transition-all ${
              gestureMode === 'conversational'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Natural conversational interview gestures"
          >
            {language === 'de' ? 'Gespräch' : 'Natural'}
          </button>
          <button
            onClick={() => setGestureMode('architecture')}
            className={`flex-1 py-1 rounded-lg transition-all ${
              gestureMode === 'architecture'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Hands gesturing towards distributed system architecture"
          >
            {language === 'de' ? 'Systeme' : 'Systems'}
          </button>
          <button
            onClick={() => setGestureMode('highlights')}
            className={`flex-1 py-1 rounded-lg transition-all ${
              gestureMode === 'highlights'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="High-precision executive pitch gestures"
          >
            {language === 'de' ? 'Fokus' : 'Pitch'}
          </button>
        </div>

        {/* Expression Mood Selector */}
        <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-900 text-[10px] font-mono">
          <span className="text-slate-400 px-1.5 flex items-center gap-1">
            <Smile className="w-3 h-3 text-cyan-400" />
            {language === 'de' ? 'Mimik:' : 'Mood:'}
          </span>
          <button
            onClick={() => setExpressionMood('confident')}
            className={`flex-1 py-0.5 rounded-md transition-all ${
              expressionMood === 'confident'
                ? 'bg-slate-800 text-emerald-300 font-bold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {language === 'de' ? 'Souverän' : 'Confident'}
          </button>
          <button
            onClick={() => setExpressionMood('analytical')}
            className={`flex-1 py-0.5 rounded-md transition-all ${
              expressionMood === 'analytical'
                ? 'bg-slate-800 text-cyan-300 font-bold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {language === 'de' ? 'Analytisch' : 'Analytical'}
          </button>
          <button
            onClick={() => setExpressionMood('warm')}
            className={`flex-1 py-0.5 rounded-md transition-all ${
              expressionMood === 'warm'
                ? 'bg-slate-800 text-amber-300 font-bold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {language === 'de' ? 'Offen' : 'Warm'}
          </button>
        </div>
      </div>

    </div>
  );
};
