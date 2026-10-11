/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * UI/UX Pro Max - Synthesized Web Audio Haptic Feedback
 * Ultra-lightweight micro-interactions without audio asset downloads.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

let soundEnabled = true;
try {
  const saved = localStorage.getItem('jeevan_sound_fx_enabled');
  if (saved !== null) {
    soundEnabled = saved === 'true';
  }
} catch {
  soundEnabled = true;
}

export function isSoundFxEnabled(): boolean {
  return soundEnabled;
}

export function setSoundFxEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  try {
    localStorage.setItem('jeevan_sound_fx_enabled', enabled ? 'true' : 'false');
  } catch {
    // ignore
  }
}

/**
 * Play a delicate, soft tactile click
 */
export function playTactileClick(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // ignore
  }
}

/**
 * Play an ultra-subtle hover tick
 */
export function playHoverTick(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);

    gain.gain.setValueAtTime(0.008, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch {
    // ignore
  }
}

/**
 * Play a pleasant two-tone confirmation chord for achievements & downloads
 */
export function playSuccessChime(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime + idx * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.025, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.28);
    });
  } catch {
    // ignore
  }
}
