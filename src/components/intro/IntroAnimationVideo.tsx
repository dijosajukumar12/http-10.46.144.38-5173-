import React, { useEffect, useRef, useState } from 'react';
import { SasLogo } from '../common/SasLogo';
import { Play, Volume2, VolumeX, ArrowRight, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';

interface IntroAnimationVideoProps {
  onComplete: () => void;
}

export const IntroAnimationVideo: React.FC<IntroAnimationVideoProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [stage, setStage] = useState<number>(0); // 0: Init, 1: Pulse, 2: Logo reveal, 3: College & Project, 4: Enter
  const [countdown, setCountdown] = useState(6);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play a synthesized sci-fi cinematic swoosh/hum
  const playCinematicSound = (type: 'hum' | 'reveal' | 'chime') => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'hum') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      } else if (type === 'reveal') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      } else if (type === 'chime') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch {
      // Audio might be blocked by browser policy until interaction
    }
  };

  // Canvas particle motion effect
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

    // Particles
    const particlesCount = 120;
    const particles = Array.from({ length: particlesCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.6,
      color: ['#6366f1', '#38bdf8', '#10b981', '#f59e0b', '#ffffff'][Math.floor(Math.random() * 5)],
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      glow: Math.random() * 8 + 4,
    }));

    let tick = 0;

    const render = () => {
      tick++;
      ctx.fillStyle = 'rgba(6, 8, 18, 0.28)';
      ctx.fillRect(0, 0, width, height);

      // Cyber Grid Lines
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = (tick * 0.4) % gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw and connect particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Connect near particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 85) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.18 * (1 - dist / 85)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Stage sequence animation timers
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage(1);
      playCinematicSound('hum');
    }, 600);

    const t2 = setTimeout(() => {
      setStage(2);
      playCinematicSound('reveal');
    }, 1800);

    const t3 = setTimeout(() => {
      setStage(3);
      playCinematicSound('chime');
    }, 3200);

    const t4 = setTimeout(() => {
      setStage(4);
    }, 4500);

    // Auto finish after countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearInterval(countdownInterval);
    };
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070913] text-white overflow-y-auto overflow-x-hidden p-3 sm:p-6 select-none">
      {/* Background Motion Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Futuristic Scanline Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent pointer-events-none animate-pulse" />

      {/* Top Bar with Audio & Skip (Mobile-optimized padding & flex) */}
      <div className="absolute top-3 sm:top-6 left-3 sm:left-6 right-3 sm:right-6 flex items-center justify-between z-20 gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 text-[9px] sm:text-xs font-mono tracking-wider text-indigo-400 bg-indigo-950/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-indigo-800/60 backdrop-blur-md shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="hidden sm:inline">SYSTEM LAUNCH SEQUENCE • SAS v2.0</span>
          <span className="sm:hidden font-bold">SAS v2.0</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              if (!audioEnabled) playCinematicSound('hum');
            }}
            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-[10px] sm:text-xs font-medium border border-slate-700/60 transition-all text-slate-300 hover:text-white"
          >
            {audioEnabled ? <Volume2 className="w-3 h-3 text-cyan-400" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
            <span className="hidden sm:inline">{audioEnabled ? 'Audio On' : 'Audio Off'}</span>
          </button>

          <button
            onClick={onComplete}
            className="flex items-center gap-1 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-indigo-600/30 active:scale-95 shrink-0"
          >
            <span>Skip ({countdown}s)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Center Cinematic Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center flex flex-col items-center justify-center">
        {/* Animated HUD Rings surrounding the Logo */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer Pulsing Glow */}
          <div className="absolute -inset-8 bg-gradient-to-tr from-indigo-600/30 via-cyan-500/20 to-emerald-500/30 rounded-full blur-2xl animate-pulse" />

          {/* Rotating Tech HUD Circle */}
          <div
            className={`absolute -inset-6 border border-cyan-400/40 rounded-full border-dashed transition-all duration-1000 ${
              stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            style={{ animation: 'spin 18s linear infinite' }}
          />

          {/* Secondary Counter-Rotating Ring */}
          <div
            className={`absolute -inset-12 border border-indigo-500/30 rounded-full border-t-cyan-400 border-b-emerald-400 transition-all duration-1000 ${
              stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{ animation: 'spin 24s linear infinite reverse' }}
          />

          {/* Primary SAS Logo Component with Zoom & Entrance */}
          <div
            className={`transform transition-all duration-1000 ease-out ${
              stage >= 1 ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-8'
            }`}
          >
            <div className="hidden sm:block">
              <SasLogo size="hero" showText={false} animated={true} />
            </div>
            <div className="sm:hidden">
              <SasLogo size="xl" showText={false} animated={true} />
            </div>
          </div>
        </div>

        {/* Title Reveal */}
        <div
          className={`space-y-2 sm:space-y-3 transform transition-all duration-700 ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] sm:text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" />
            Official Demonstration Portal • Nov 2026
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
            SAS
          </h1>

          <p className="text-sm sm:text-xl font-bold tracking-widest text-cyan-400 font-mono uppercase">
            STUDENT ATTENDANCE SYSTEM
          </p>
        </div>

        {/* College & Project Metadata Details */}
        <div
          className={`mt-4 sm:mt-6 space-y-1.5 sm:space-y-2 max-w-xl transform transition-all duration-700 delay-150 ${
            stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-xs sm:text-base font-semibold text-slate-200">
            EXCEL ENGINEERING COLLEGE <span className="text-indigo-400 font-normal">(AUTONOMOUS)</span>
          </p>
          <p className="text-[10px] sm:text-xs text-slate-400">
            Affiliated to Anna University Chennai • Approved by AICTE, New Delhi
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs text-slate-300">
            <span className="bg-slate-800/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-slate-700/60 font-mono">
              Student: <strong className="text-amber-400 font-sans">S. DIJO (730925104051)</strong>
            </span>
            <span className="bg-slate-800/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-slate-700/60 font-mono">
              Guide: <strong className="text-cyan-400 font-sans">Mr. N. Nandhakumar</strong>
            </span>
          </div>
        </div>

        {/* Enter Portal Action Button */}
        <div
          className={`mt-8 transform transition-all duration-700 delay-300 ${
            stage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <button
            onClick={onComplete}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 text-white font-bold text-sm tracking-wide shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>ENTER SAS PORTAL</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Bottom SDG Compliance Bar */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-slate-500 text-center px-2">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            SDG 4: Quality Education
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            SDG 9: Industry & Innovation
          </span>
        </div>
      </div>
    </div>
  );
};
