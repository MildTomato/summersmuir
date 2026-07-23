'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const rolodexTransitions = [
  { type: 'tween' as const, duration: 0.09, ease: 'easeOut' as const },
  { type: 'tween' as const, duration: 0.1, ease: 'easeOut' as const },
  { type: 'tween' as const, duration: 0.11, ease: 'easeOut' as const },
  { type: 'tween' as const, duration: 0.13, ease: 'easeOut' as const },
  { type: 'tween' as const, duration: 0.16, ease: 'easeOut' as const },
  { type: 'tween' as const, duration: 0.21, ease: 'easeOut' as const },
  { type: 'tween' as const, duration: 0.28, ease: 'easeOut' as const },
  { type: 'tween' as const, duration: 0.38, ease: 'easeOut' as const },
  { type: 'tween' as const, duration: 0.52, ease: 'easeOut' as const },
];

export function RolodexMark() {
  const [animationKey, setAnimationKey] = useState(0);
  const [cycleStep, setCycleStep] = useState(-1);
  const isAnimating = useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const rolodexTransition = rolodexTransitions[Math.max(0, cycleStep)];

  const animate = () => {
    if (shouldReduceMotion || isAnimating.current) return;

    isAnimating.current = true;
    setCycleStep(0);
    setAnimationKey((key) => key + 1);
  };

  const finishCycle = () => {
    if (animationKey === 0) return;

    if (cycleStep < rolodexTransitions.length - 1) {
      setCycleStep((step) => step + 1);
      setAnimationKey((key) => key + 1);
      return;
    }

    isAnimating.current = false;
    setCycleStep(-1);
  };

  return (
    <button
      type="button"
      aria-label="Animate rolodex"
      className="group -m-2 cursor-default rounded-sm p-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-heading"
      onFocus={animate}
      onPointerDown={animate}
      onPointerEnter={animate}
    >
      <span
        key={animationKey}
        aria-hidden
        className="relative block h-[18px] w-[22px] [perspective:48px] [transform-style:preserve-3d]"
      >
        <motion.span
          className="absolute left-px top-0 z-[3] h-3 w-5 border border-heading bg-app-bg"
          initial={{ y: -3, z: -6, scaleX: 0.8, opacity: 0.52 }}
          animate={
            animationKey > 0
              ? { y: -6, z: -12, scaleX: 0.6, opacity: 0 }
              : { y: -3, z: -6, scaleX: 0.8, opacity: 0.52 }
          }
          transition={rolodexTransition}
        />
        <motion.span
          className="absolute left-px top-0 z-[5] h-3 w-5 border border-heading bg-app-bg"
          style={{ transformOrigin: 'center bottom' }}
          initial={{ y: 0, z: 0, rotateX: 0, scaleX: 1, opacity: 1 }}
          animate={
            animationKey > 0
              ? {
                  y: -3,
                  z: -6,
                  rotateX: [0, -18, 0],
                  scaleX: 0.8,
                  opacity: 0.52,
                }
              : { y: 0, z: 0, rotateX: 0, scaleX: 1, opacity: 1 }
          }
          transition={rolodexTransition}
          onAnimationComplete={finishCycle}
        />
        <motion.span
          className="absolute left-px top-0 z-[4] h-3 w-5 border border-heading bg-app-bg"
          initial={{ y: 3, z: -6, scaleX: 0.8, opacity: 0.78 }}
          animate={
            animationKey > 0
              ? { y: 0, z: 0, scaleX: 1, opacity: 1 }
              : { y: 3, z: -6, scaleX: 0.8, opacity: 0.78 }
          }
          transition={rolodexTransition}
        />
        <motion.span
          className="absolute left-px top-0 z-[2] h-3 w-5 border border-heading bg-app-bg"
          initial={{ y: 6, z: -12, scaleX: 0.6, opacity: 0.52 }}
          animate={
            animationKey > 0
              ? { y: 3, z: -6, scaleX: 0.8, opacity: 0.78 }
              : { y: 6, z: -12, scaleX: 0.6, opacity: 0.52 }
          }
          transition={rolodexTransition}
        />
        <motion.span
          className="absolute left-px top-0 z-[1] h-3 w-5 border border-heading bg-app-bg"
          initial={{ y: 9, z: -18, scaleX: 0.4, opacity: 0 }}
          animate={
            animationKey > 0
              ? { y: 6, z: -12, scaleX: 0.6, opacity: 0.52 }
              : { y: 9, z: -18, scaleX: 0.4, opacity: 0 }
          }
          transition={rolodexTransition}
        />
      </span>
    </button>
  );
}
