import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  /** Final number shown. */
  to: number;
  /** Text after the number, e.g. "%" or "+". */
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/** Counts from 0 to `to` the first time it scrolls into view; shows the final value at once under reduced motion. */
export const CountUp: React.FC<CountUpProps> = ({ to, suffix = '', prefix = '', duration = 1.2, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className={className}>
      {/* Screen readers get the final value only, not every frame */}
      <span aria-hidden="true">
        {prefix}
        {value}
        {suffix}
      </span>
      <span className="jd-visually-hidden">
        {prefix}
        {to}
        {suffix}
      </span>
    </span>
  );
};
