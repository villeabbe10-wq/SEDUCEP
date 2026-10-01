import React from 'react';

export default function SpotlightBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient Pastel Radial Mesh Gradients */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-400/[0.12] blur-[140px]" />
      <div className="absolute top-1/4 -right-40 w-[650px] h-[650px] rounded-full bg-cyan-400/[0.1] blur-[150px]" />
      <div className="absolute top-2/3 left-1/3 w-[700px] h-[700px] rounded-full bg-indigo-300/[0.08] blur-[160px]" />
      <div className="absolute -bottom-40 right-10 w-[550px] h-[550px] rounded-full bg-amber-300/[0.08] blur-[140px]" />

      {/* Subtle Micro-Dot / Grid Matrix Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(15, 23, 42, 0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top subtle fade */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#f8fafc]/90 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
