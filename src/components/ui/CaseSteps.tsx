import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ProjectCase } from '../../data/projectCases';
import { tint } from '../../data/palette';

const ease = [0.2, 0.7, 0.2, 1] as const;

/**
 * Problem -> solution -> result as a short case-study rail. The rail and the result tint take the
 * card's colour (`fill`/`text` from the shared palette); steps fade in one after another once.
 */
export const CaseSteps: React.FC<{
  data: Required<ProjectCase>;
  fill: string;
  text: string;
  isDe?: boolean;
  compact?: boolean;
  /** animate when mounted (inside a panel that just opened) instead of when scrolled into view */
  animateOnMount?: boolean;
}> = ({ data, fill, text, isDe = false, compact = false, animateOnMount = false }) => {
  const reduce = !!useReducedMotion();
  const steps = [
    { key: 'problem', label: isDe ? 'Problem' : 'Problem', body: data.problem },
    { key: 'solution', label: isDe ? 'Lösung' : 'Solution', body: data.solution },
    ...(data.result ? [{ key: 'result', label: isDe ? 'Ergebnis' : 'Result', body: data.result }] : []),
  ];
  return (
    <ol
      className="case-steps relative"
      // Case copy is English only; tell screen readers so under the German UI.
      lang={isDe ? 'en' : undefined}
      style={{ '--case-c': fill } as React.CSSProperties}>
      {steps.map((s, i) => {
        const isResult = s.key === 'result';
        return (
          <motion.li
            key={s.key}
            initial={reduce ? false : { opacity: 0, y: 10, x: animateOnMount ? -6 : 0 }}
            {...(animateOnMount
              ? { animate: { opacity: 1, y: 0, x: 0 } }
              : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.6 } })}
            transition={{ duration: 0.45, delay: reduce ? 0 : (animateOnMount ? 0.08 : 0) + i * 0.12, ease }}
            className={`case-step relative pl-6 ${i < steps.length - 1 ? (compact ? 'pb-2.5' : 'pb-3') : ''}`}
          >
            <span
              aria-hidden="true"
              className="case-step__dot absolute left-0 top-[0.3rem] w-3 h-3 rounded-full border-2"
              style={isResult ? { background: fill, borderColor: fill } : { borderColor: fill, background: 'var(--jd-surface)' }}
            />
            <p
              lang={isDe ? 'de' : undefined}
              className="text-xs font-bold uppercase tracking-[0.08em] leading-none"
              style={{ color: text }}
            >
              {s.label}
            </p>
            <p
              className={`mt-1 leading-relaxed ${compact ? 'text-sm' : 'text-[15px]'} ${
                isResult ? 'font-semibold text-fg rounded-lg -ml-1 px-2 py-1' : 'text-muted'
              }`}
              style={isResult ? { background: tint(fill, 12) } : undefined}
            >
              {s.body}
            </p>
          </motion.li>
        );
      })}
    </ol>
  );
};
