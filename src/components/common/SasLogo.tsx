import React from 'react';

interface SasLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

export const SasLogo: React.FC<SasLogoProps> = ({
  size = 'md',
  showText = true,
  animated = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 40, text: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 54, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 72, text: 'text-3xl', sub: 'text-sm' },
    hero: { icon: 110, text: 'text-5xl', sub: 'text-base' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-tech Emblem */}
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/40 shadow-xl shadow-indigo-500/20 ${
          animated ? 'animate-pulse' : ''
        }`}
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-cyan-500/10 to-amber-500/20 blur-md pointer-events-none" />

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-1.5 z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4338CA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Hexagonal Shield Outline */}
          <polygon
            points="50,6 90,26 90,74 50,94 10,74 10,26"
            stroke="url(#sasGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="url(#shieldGrad)"
          />

          {/* Internal Geometric Tech Grid Rings */}
          <circle
            cx="50"
            cy="50"
            r="26"
            stroke="#818CF8"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            opacity="0.6"
            className={animated ? 'animate-spin' : ''}
            style={{ transformOrigin: 'center', animationDuration: '14s' }}
          />

          {/* Stylized Interlocking SAS Monogram */}
          {/* 'S' First glyph */}
          <path
            d="M 32 36 C 32 30, 42 28, 48 28 C 55 28, 58 32, 58 36 C 58 42, 42 44, 42 50 C 42 56, 56 56, 62 50"
            stroke="#38BDF8"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Central 'A' Apex / Compass */}
          <path
            d="M 50 24 L 38 72 M 50 24 L 62 72 M 42 56 L 58 56"
            stroke="url(#sasGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Graduation Cap Motif / Digital Check Accent */}
          <path
            d="M 50 16 L 70 24 L 50 32 L 30 24 Z"
            fill="#F59E0B"
            opacity="0.9"
          />
          <path
            d="M 68 25 L 68 36"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Biometric verification dot */}
          <circle cx="50" cy="50" r="4.5" fill="#10B981" />
          <circle cx="50" cy="50" r="8" stroke="#10B981" strokeWidth="1" opacity="0.6" />
        </svg>

        {/* Corner Neon Accents */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400" />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-sm shadow-emerald-400" />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight bg-gradient-to-r from-indigo-600 via-cyan-600 to-emerald-600 dark:from-indigo-400 dark:via-cyan-300 dark:to-emerald-400 bg-clip-text text-transparent ${currentSize.text}`}
            >
              SAS
            </span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              PORTAL
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-700/60">
              Auto-Sync
            </span>
          </div>
          <span className={`text-slate-500 dark:text-slate-400 font-medium ${currentSize.sub}`}>
            Student Attendance System • Excel Engineering College
          </span>
        </div>
      )}
    </div>
  );
};
