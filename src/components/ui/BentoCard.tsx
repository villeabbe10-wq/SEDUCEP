import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface BentoCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'emerald' | 'cyan' | 'orange' | 'indigo' | 'rose';
  onClick?: () => void;
}

export default function BentoCard({ 
  children, 
  className = '', 
  glowColor = 'emerald',
  onClick,
  ...props 
}: BentoCardProps) {
  const glowStyles = {
    emerald: 'hover:border-emerald-500/50 hover:shadow-[0_16px_36px_rgba(16,185,129,0.12)]',
    cyan: 'hover:border-cyan-500/50 hover:shadow-[0_16px_36px_rgba(6,182,212,0.12)]',
    orange: 'hover:border-orange-500/50 hover:shadow-[0_16px_36px_rgba(249,115,22,0.12)]',
    indigo: 'hover:border-indigo-500/50 hover:shadow-[0_16px_36px_rgba(99,102,241,0.12)]',
    rose: 'hover:border-rose-500/50 hover:shadow-[0_16px_36px_rgba(244,63,94,0.12)]',
  }[glowColor];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-b from-white/95 via-white/90 to-slate-50/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.04)] ${glowStyles} transition-all duration-500 group ${className}`}
      {...props}
    >
      {/* Top subtle rim light */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent pointer-events-none" />
      
      {/* Ambient hover light sheen */}
      <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-transparent pointer-events-none rounded-[inherit]" />

      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}
