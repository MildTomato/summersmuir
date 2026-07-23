'use client';

import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.4, 0, 0.2, 1] as const;

export function HoldingPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f2efe8] text-[#20201d] dark:bg-[#161714] dark:text-[#f2efe8]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-80 dark:opacity-35"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, rgba(214, 225, 205, 0.9), transparent 34%), radial-gradient(circle at 78% 76%, rgba(223, 207, 184, 0.75), transparent 38%)',
        }}
      />

      <motion.div
        aria-hidden
        className="absolute left-[8%] top-[14%] h-[34rem] w-[34rem] rounded-full border border-[#20201d]/10 dark:border-[#f2efe8]/10"
        animate={shouldReduceMotion ? undefined : { x: [0, 18, 0], y: [0, -12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 -right-28 h-[30rem] w-[30rem] rounded-full border border-[#20201d]/10 dark:border-[#f2efe8]/10"
        animate={shouldReduceMotion ? undefined : { x: [0, -14, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-7xl flex-col justify-between px-6 py-7 sm:px-10 sm:py-9 lg:px-16 lg:py-12">
        <motion.div
          className="flex items-center gap-3"
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="grid size-10 place-items-center rounded-full border border-current/30">
            <span className="font-serif text-lg italic">N</span>
          </div>
          <span className="text-sm font-medium tracking-[-0.02em]">jonny.design</span>
        </motion.div>

        <div className="max-w-4xl pb-[8vh]">
          <motion.p
            className="mb-7 text-[11px] font-medium uppercase tracking-[0.22em] text-[#65655f] dark:text-[#aaa99f]"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5, ease }}
          >
            Work in progress
          </motion.p>
          <motion.h1
            className="max-w-4xl text-balance text-[clamp(3.4rem,9vw,8.5rem)] font-light leading-[0.88] tracking-[-0.065em]"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.65, ease }}
          >
            A new chapter is taking shape.
          </motion.h1>
          <motion.p
            className="mt-8 max-w-xl text-pretty text-base leading-7 text-[#65655f] dark:text-[#aaa99f] sm:text-lg sm:leading-8"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.55, ease }}
          >
            The site is being refined. Design, product, and the systems behind
            both will return here soon.
          </motion.p>
        </div>

        <motion.div
          className="flex items-end justify-between border-t border-current/15 pt-5 text-[11px] uppercase tracking-[0.18em] text-[#65655f] dark:text-[#aaa99f]"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.36, duration: 0.5, ease }}
        >
          <span>Back shortly</span>
          <span aria-hidden>© {new Date().getFullYear()}</span>
        </motion.div>
      </div>
    </main>
  );
}
