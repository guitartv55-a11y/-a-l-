import React from 'react';
import { motion } from 'motion/react';

interface SlideHeaderProps {
  kicker: string;
  title: string;
  subtitle?: string;
}

export const SlideHeader: React.FC<SlideHeaderProps> = ({
  kicker,
  title,
  subtitle,
}) => {
  return (
    <header className="shrink-0 pb-3">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 text-[11px] font-semibold leading-snug tracking-wider text-[#0D7A7E] sm:text-xs"
      >
        <span>{kicker}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="mt-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-slate-200/90 pb-2.5"
      >
        <h1 className="text-balance text-xl font-bold leading-[1.28] tracking-tight text-[#0F294A] sm:text-2xl lg:text-[1.75rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs font-medium leading-relaxed text-slate-500 sm:text-sm">
            {subtitle}
          </p>
        )}
      </motion.div>
    </header>
  );
};
