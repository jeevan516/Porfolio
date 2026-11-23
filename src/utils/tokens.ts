/**
 * Read JD design tokens (CSS custom properties from src/styles/jd.css) from JavaScript, for canvases
 * and charts that cannot use CSS classes. Values follow the active theme: the cache is cleared when
 * <html data-theme> or the OS colour scheme changes.
 */
import { useEffect, useState } from 'react';

const cache = new Map<string, string>();
let version = 0;
const listeners = new Set<() => void>();

const invalidate = () => {
  cache.clear();
  version += 1;
  listeners.forEach((fn) => fn());
};

if (typeof window !== 'undefined') {
  new MutationObserver(invalidate).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', invalidate);
}

/** Raw token value, e.g. jdToken('--jd-accent') -> "#f2a541". */
export const jdToken = (name: string): string => {
  let v = cache.get(name);
  if (v === undefined) {
    v = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888888';
    cache.set(name, v);
  }
  return v;
};

/** Token colour with alpha, e.g. jdColor('--jd-teal', 0.3) -> "rgba(11, 110, 109, 0.3)". */
export const jdColor = (name: string, alpha = 1): string => {
  const v = jdToken(name);
  const m = /^#([0-9a-f]{6})$/i.exec(v);
  if (!m) return v;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/** Current token version; changes whenever the theme changes. */
export const tokenVersion = () => version;

/** Re-render a component when the theme (and so every token) changes. */
export const useThemeTokens = (): number => {
  const [v, setV] = useState(version);
  useEffect(() => {
    const fn = () => setV(version);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return v;
};

/** True when the visitor asked the OS for reduced motion. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
