import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Project } from '../types';
import { useModalA11y } from '../services/useModalA11y';

/** Public-folder path. Relative, like vite's base: './', so it also works on the GitHub Pages sub-path. */
export const assetUrl = (src: string) => `./${src.replace(/^\.?\//, '')}`;

interface ProjectGalleryProps {
  project: Project;
  startIndex: number;
  onClose: () => void;
  language?: 'en' | 'de';
}

/** Full-screen screenshot viewer: arrows or ←/→ to browse, Esc or the backdrop to close. */
export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ project, startIndex, onClose, language = 'en' }) => {
  const images = project.images ?? [];
  const [index, setIndex] = useState(startIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isDe = language === 'de';
  useModalA11y(true, onClose, dialogRef);

  const go = useCallback(
    (step: number) => setIndex((i) => (i + step + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  if (!images.length) return null;
  const image = images[index];
  const many = images.length > 1;
  const buttonClass =
    'p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-200 hover:text-white hover:border-emerald-500/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60';

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} – ${isDe ? 'Screenshots' : 'screenshots'}`}
        className="relative w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{project.title}</p>
            <p className="text-xs text-slate-400">
              {index + 1} / {images.length}
              {image.caption ? ` · ${image.caption}` : ''}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label={isDe ? 'Schließen' : 'Close'} className={buttonClass}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <img
            key={image.src}
            src={assetUrl(image.src)}
            alt={image.alt}
            className="w-full max-h-[78vh] object-contain rounded-xl border border-slate-800 bg-slate-900"
          />
          {many && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={isDe ? 'Vorheriges Bild' : 'Previous image'}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${buttonClass}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={isDe ? 'Nächstes Bild' : 'Next image'}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${buttonClass}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {many && (
          <div className="flex justify-center gap-2 mt-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={img.caption || img.alt}
                aria-current={i === index}
                className={`shrink-0 w-20 h-12 rounded-md overflow-hidden border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                  i === index ? 'border-emerald-400' : 'border-slate-700 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={assetUrl(img.src)} alt="" className="w-full h-full object-cover object-top" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
