import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Fades and lifts a section in the first time it scrolls into view (instant under reduced motion). */
export const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      // A fixed pixel margin, not a share of the element: very tall sections (Projects on a phone)
      // could never show 8% of themselves in one viewport and stayed invisible.
      viewport={{ once: true, amount: 0, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};
