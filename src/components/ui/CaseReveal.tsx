import React, { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { ProjectCase } from '../../data/projectCases';
import { tint } from '../../data/palette';
import { CaseSteps } from './CaseSteps';

const ease = [0.2, 0.7, 0.2, 1] as const;

/**
 * A card shows a plain explanation first; problem -> solution -> result unfolds when the visitor
 * clicks the card (see `onCaseTileClick`) or the toggle button. The button carries the state for
 * keyboards and screen readers (aria-expanded / aria-controls).
 */
export const CaseReveal: React.FC<{
  summary: string;
  data: Required<ProjectCase>;
  fill: string;
  text: string;
  isDe?: boolean;
}> = ({ summary, data, fill, text, isDe = false }) => {
  const [open, setOpen] = useState(false);
  const reduce = !!useReducedMotion();
  const panelId = useId();
  return (
    <div className="case-reveal" data-open={open || undefined}>
      <p className={`text-[15px] text-muted leading-relaxed ${open ? '' : 'line-clamp-3'}`}>{summary}</p>
      <button
        type="button"
        data-case-toggle
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="case-toggle mt-3 inline-flex items-center gap-2 min-h-10 px-3 -ml-1 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg/60"
        style={{ color: text, background: open ? tint(fill, 14) : 'transparent' }}
      >
        <span className="case-toggle__dots inline-flex items-center gap-1" aria-hidden="true">
          <span className="w-1.5 h-1.5 rounded-full border" style={{ borderColor: fill }} />
          <span className="w-3 h-px" style={{ background: fill }} />
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: fill }} />
        </span>
        {open ? (isDe ? 'Weniger anzeigen' : 'Show less') : isDe ? 'Problem & Lösung' : 'Problem & solution'}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : 'case-toggle__nudge'}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="case"
            initial={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.4, ease }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              <CaseSteps data={data} fill={fill} text={text} isDe={isDe} compact animateOnMount />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** Card onClick: a click anywhere on the tile (not on its own links/buttons) toggles its case. */
export function onCaseTileClick(e: React.MouseEvent<HTMLElement>) {
  const target = e.target as HTMLElement;
  if (target.closest('a, button, summary, input, select, textarea, [role="button"]')) return;
  if (window.getSelection()?.toString()) return; // the visitor is selecting text, not clicking
  e.currentTarget.querySelector<HTMLButtonElement>('[data-case-toggle]')?.click();
}
