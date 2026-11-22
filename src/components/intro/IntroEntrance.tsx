import React, { useEffect, useRef, useState } from 'react';
import {
  Shield,
  Sparkles,
  ArrowRight,
  Cpu,
  Building2,
  Lock,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface IntroEntranceProps {
  onEnter: () => void;
}

export const IntroEntrance: React.FC<IntroEntranceProps> = ({ onEnter }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('Initializing Encrypted Quantum Core...');
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Animated particle & constellation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate stars / nodes
    const particleCount = Math.min(100, Math.floor((width * height) / 12000));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.8 + 0.2,
      color: Math.random() > 0.4 ? '#2dd4bf' : '#a855f7',
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(5, 7, 13, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Draw faint cyber grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw particles and connection lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // System loading sequence progression
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2800; // 2.8 seconds total

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 30) {
        setStageText('Establishing 256-Bit Quantum Protocol (RBI Standard)...');
      } else if (pct < 65) {
        setStageText('Synchronizing Multi-Bank Ledgers (HDFC, SBI, ICICI, Zerodha)...');
      } else if (pct < 95) {
        setStageText('Mounting Encrypted Local Device Vault (₹ INR)...');
      } else {
        setStageText('Personal Banking System Ready • Authorized Access');
      }

      if (pct >= 100) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const handleLaunch = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-[#05060A] text-slate-100 overflow-hidden select-none transition-all duration-500 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Live Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      />

      {/* Subtle Radial Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/15 via-indigo-600/15 to-teal-400/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar: Security Badge & Skip */}
      <div className="w-full max-w-6xl flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          <span className="text-[11px] font-mono tracking-wider text-teal-300 uppercase">
            SECURE PORTAL • VER 2.4.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAudioActive(!isAudioActive)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
            title={isAudioActive ? 'Mute ambient sound' : 'Enable ambient sound'}
            aria-label="Toggle ambient audio"
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4 text-teal-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={handleLaunch}
            className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            Skip Intro ⏩
          </button>
        </div>
      </div>

      {/* Center Hero: Animated Vault Logo & Grand Title */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl my-auto space-y-7">
        {/* Holographic Logo Emblem */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Outer Rotating Energy Ring 1 */}
          <div className="absolute inset-0 rounded-full border border-teal-500/30 animate-[spin_12s_linear_infinite] border-t-teal-400 border-r-transparent" />
          {/* Counter Rotating Ring 2 */}
          <div className="absolute inset-2 rounded-full border border-purple-500/30 animate-[spin_8s_linear_infinite_reverse] border-b-purple-400 border-l-transparent" />

          {/* Central Shield Vault Emblem */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#12162A] to-[#0A0D18] border border-white/15 shadow-[0_0_50px_rgba(168,85,247,0.35)] flex items-center justify-center relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500/20 via-transparent to-teal-400/20 opacity-75" />
            <div className="relative flex flex-col items-center justify-center">
              <Building2 className="w-8 h-8 text-teal-300 mb-0.5 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black tracking-widest text-white">PBS</span>
                <Sparkles className="w-2.5 h-2.5 text-purple-400 animate-pulse" />
              </div>
            </div>

            {/* Orbiting glowing dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_12px_#2dd4bf] animate-ping" />
          </div>
        </div>

        {/* Website Name & Professional Banking Credentials */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-[11px] font-semibold text-purple-300 tracking-wider uppercase shadow-inner">
            <Lock className="w-3 h-3 text-purple-400" />
            <span>Encrypted Wealth Infrastructure</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-teal-200 tracking-[0.12em] sm:tracking-[0.16em] uppercase">
            Personal Banking System
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-normal leading-relaxed">
            Autonomous multi-account wealth manager, UPI ledger, envelope budgeting & India reserve analytics.
          </p>
        </div>

        {/* Video / High-Tech Loading HUD */}
        <div className="w-full max-w-md bg-[#0C0F1A]/90 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5 truncate">
              <Cpu className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="truncate">{stageText}</span>
            </span>
            <span className="text-teal-400 font-bold ml-2">{progress}%</span>
          </div>

          {/* Progress Bar with Starlight Gradient */}
          <div className="w-full h-2 rounded-full bg-[#181C2E] overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-400 to-teal-400 transition-all duration-150 shadow-[0_0_12px_rgba(45,212,191,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-3 text-center text-[10px] font-mono text-slate-500 pt-1 border-t border-white/5">
            <div>VAULT: 256-BIT</div>
            <div>CURRENCY: ₹ INR</div>
            <div>STATUS: ONLINE</div>
          </div>
        </div>

        {/* Big Grand Launch Button */}
        <div>
          <button
            type="button"
            onClick={handleLaunch}
            className="group relative px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-sm sm:text-base shadow-[0_0_35px_-5px_rgba(168,85,247,0.6)] transition-all duration-200 active:scale-95 border border-white/20 flex items-center gap-3 cursor-pointer"
          >
            <Shield className="w-5 h-5 text-teal-300 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide uppercase font-extrabold">
              Enter Personal Banking System
            </span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom Footer: Compliance & Reserve Standards */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 border-t border-white/5 pt-4 gap-2 relative z-10">
        <div>© 2026 Personal Banking System • India Edition (₹ INR)</div>
        <div className="flex items-center gap-4">
          <span>Local Device Storage</span>
          <span>•</span>
          <span>Zero External Transmission</span>
          <span>•</span>
          <span className="text-teal-400 font-mono">ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
};
