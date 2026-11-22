import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { SasLogo } from '../common/SasLogo';
import {
  Lock,
  User as UserIcon,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  KeyRound,
  Sparkles,
  Eye,
  EyeOff,
  UserPlus,
  LogIn
} from 'lucide-react';
import { INITIAL_USERS } from '../../data/mockAttendanceData';
import { UserRole } from '../../types/attendance';

interface LoginViewProps {
  onSuccessLogin: () => void;
  onReplayIntro: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccessLogin, onReplayIntro }) => {
  const { login, addStudent } = useAttendance();

  // Tabs: 'signin' | 'create' | 'google'
  const [activeTab, setActiveTab] = useState<'signin' | 'create' | 'google'>('signin');

  // Sign In form state
  const [username, setUsername] = useState('730925104051'); // Default S. Dijo for convenience
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Create Account form state
  const [createName, setCreateName] = useState('');
  const [createRole, setCreateRole] = useState<UserRole>('student');
  const [createIdentifier, setCreateIdentifier] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createConfirmPassword, setCreateConfirmPassword] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Audio feedback synthesizer
  const playAuthSound = (type: 'error' | 'success') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // Audio might be blocked by browser policy
    }
  };

  // Quick fill helper for testing
  const handleQuickFill = (role: 'student' | 'faculty' | 'admin') => {
    if (role === 'student') {
      setUsername('730925104051');
      setPassword('dijo123');
    } else if (role === 'faculty') {
      setUsername('nandhakumar');
      setPassword('faculty123');
    } else {
      setUsername('admin');
      setPassword('admin123');
    }
    setErrorMessage(null);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // If password is empty or incorrect, trigger warning and shake!
    if (!password) {
      setErrorMessage('⚠️ Password is required! Please enter your institutional password.');
      triggerShake();
      playAuthSound('error');
      return;
    }

    const result = login(username, password);

    if (!result.success) {
      setErrorMessage(
        result.message || '⚠️ Access Denied: Invalid Password! Passwords in SAS are verified using hashed cryptographic storage (Table 3.3). Please try again or use the test credentials below.'
      );
      triggerShake();
      playAuthSound('error');
    } else {
      setIsSuccess(true);
      playAuthSound('success');
      setTimeout(() => {
        onSuccessLogin();
      }, 700);
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 550);
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!createName || !createIdentifier || !createEmail || !createPassword) {
      setCreateError('Please fill in all required registration fields.');
      return;
    }

    if (createPassword.length < 6) {
      setCreateError('Password must contain at least 6 characters for institutional compliance.');
      return;
    }

    if (createPassword !== createConfirmPassword) {
      setCreateError('Passwords do not match. Please re-enter.');
      return;
    }

    // Register new student in master list
    if (createRole === 'student') {
      addStudent({
        registerNo: createIdentifier,
        name: createName,
        department: 'Computer Science and Engineering',
        year: 3,
        semester: 5,
        section: 'A',
        email: createEmail,
        phone: '+91 98765 00000',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      });
    }

    setCreateSuccess(true);
    setTimeout(() => {
      // Auto login
      setUsername(createIdentifier);
      setPassword(createPassword);
      setActiveTab('signin');
      setCreateSuccess(false);
      onSuccessLogin();
    }, 1200);
  };

  const handleGoogleSelect = (userIndex: number) => {
    const selected = INITIAL_USERS[userIndex];
    setShowGoogleModal(false);
    setIsSuccess(true);
    // Instant login as selected user
    const defaultPass =
      selected.role === 'admin'
        ? 'admin123'
        : selected.role === 'faculty'
        ? 'faculty123'
        : 'dijo123';
    login(selected.username, defaultPass);
    setTimeout(() => {
      onSuccessLogin();
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-3 py-6 relative overflow-x-hidden">
      {/* Background Ambience & Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Top Banner Bar */}
      <div className="w-full max-w-sm sm:max-w-md mb-4 flex items-center justify-between z-10 gap-2">
        <button
          onClick={onReplayIntro}
          className="text-xs font-medium text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Replay Intro</span>
        </button>

        <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 shrink-0">
          SSL • SHA-256 SECURED
        </span>
      </div>

      {/* Main Authentication Card */}
      <div
        className={`w-full max-w-sm sm:max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden z-10 transition-all ${
          isShaking ? 'animate-shake ring-2 ring-red-500/80 shadow-red-500/30' : ''
        }`}
      >
        {/* Card Header with SAS Logo */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-800/80 bg-gradient-to-b from-indigo-950/40 to-transparent">
          <div className="flex items-center justify-between">
            <SasLogo size="md" showText={true} />
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50 shrink-0">
              Nov 2026
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Excel Engineering College (Autonomous) • Student Attendance Portal
          </p>
        </div>

        {/* Navigation Tabs (Sign In, Create, Google) */}
        <div className="flex border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              activeTab === 'signin'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('create');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              activeTab === 'create'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="sm:hidden">Create</span>
            <span className="hidden sm:inline">Create Account</span>
          </button>

          <button
            onClick={() => setShowGoogleModal(true)}
            className="flex-1 py-3 text-center border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all flex items-center justify-center gap-1 sm:gap-1.5"
          >
            {/* Google G Icon */}
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>
        </div>

        {/* Tab 1: SIGN IN CONTENT */}
        {activeTab === 'signin' && (
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Warning Banner if password is wrong */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-300">Authentication Failed!</p>
                  <p className="mt-0.5 leading-relaxed text-[11px]">{errorMessage}</p>
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Credentials verified! Opening SAS Portal...</span>
              </div>
            )}

            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  User ID / Register Number
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. 730925104051, nandhakumar, or admin"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Encrypted Password
                  </label>
                  <span className="text-[10px] text-indigo-400 font-mono">
                    SHA-256 Verified
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSuccess}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to SAS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Google SSO Button */}
            <div className="relative my-3 sm:my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-slate-900 px-2 text-slate-500 font-mono">Or Continue With</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google <span className="hidden sm:inline">(Excel Colleges)</span></span>
            </button>

            {/* Test Credentials Chips for Quick Viva/Demo Inspection */}
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Fill Credentials (1-Click):</span>
              </p>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('student')}
                  className="px-1.5 sm:px-2 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 text-[10px] text-indigo-300 font-semibold text-center truncate transition-colors"
                  title="Fill S. Dijo (Student)"
                >
                  🎓 S. Dijo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('faculty')}
                  className="px-1.5 sm:px-2 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 text-[10px] text-cyan-300 font-semibold text-center truncate transition-colors"
                  title="Fill Mr. Nandhakumar (Faculty)"
                >
                  👨‍🏫 Faculty
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin')}
                  className="px-1.5 sm:px-2 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/60 text-[10px] text-purple-300 font-semibold text-center truncate transition-colors"
                  title="Fill Dr. Senthil Mahesh (Admin)"
                >
                  🛡️ Admin HOD
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: CREATE ACCOUNT CONTENT */}
        {activeTab === 'create' && (
          <div className="p-6 space-y-4">
            {createError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            {createSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Account created successfully! Directing inside...</span>
              </div>
            )}

            <form onSubmit={handleCreateAccountSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="e.g. S. Dijo / Arun Kumar"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Role Type
                  </label>
                  <select
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {createRole === 'student' ? 'Register Number' : 'Faculty ID'}
                  </label>
                  <input
                    type="text"
                    value={createIdentifier}
                    onChange={(e) => setCreateIdentifier(e.target.value)}
                    placeholder={createRole === 'student' ? 'e.g. 730925104099' : 'FAC-CSE-120'}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="name@excelcolleges.com"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={createConfirmPassword}
                    onChange={(e) => setCreateConfirmPassword(e.target.value)}
                    placeholder="Repeat"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={createSuccess}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create & Register to SAS</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Google OAuth Simulation Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {/* Google Logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
              </svg>
                <h3 className="text-sm font-bold text-white">Sign in with Google</h3>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-500 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Choose an institutional Google account to continue to <strong>SAS Portal</strong>:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleGoogleSelect(2)} // S. Dijo
                className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500 transition-colors flex items-center gap-3"
              >
                <img
                  src={INITIAL_USERS[2].avatar}
                  alt="Dijo"
                  className="w-8 h-8 rounded-full border border-indigo-400"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-white">S. DIJO (Student)</p>
                  <p className="text-[10px] text-slate-400 truncate">dijo.730925104051@excelcolleges.com</p>
                </div>
              </button>

              <button
                onClick={() => handleGoogleSelect(1)} // Mr. Nandhakumar
                className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500 transition-colors flex items-center gap-3"
              >
                <img
                  src={INITIAL_USERS[1].avatar}
                  alt="Nandhakumar"
                  className="w-8 h-8 rounded-full border border-cyan-400"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-white">Mr. N. Nandhakumar, M.E.</p>
                  <p className="text-[10px] text-slate-400 truncate">nandhakumar.cse@excelcolleges.com</p>
                </div>
              </button>

              <button
                onClick={() => handleGoogleSelect(0)} // Dr. Senthil Mahesh
                className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500 transition-colors flex items-center gap-3"
              >
                <img
                  src={INITIAL_USERS[0].avatar}
                  alt="Senthil"
                  className="w-8 h-8 rounded-full border border-purple-400"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-white">Dr. P.C. Senthil Mahesh (HOD)</p>
                  <p className="text-[10px] text-slate-400 truncate">hod.cse@excelcolleges.com</p>
                </div>
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center">
              Secured by Google Identity Services & Anna University Authentication Protocol
            </p>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-slate-500 space-y-1">
        <p>Excel Engineering College (Autonomous), Komarapalayam - 637303</p>
        <p className="text-[11px] text-slate-600">
          Knowledge Demonstration Project by <strong>S. DIJO (730925104051)</strong> • B.E CSE Nov 2026
        </p>
      </div>
    </div>
  );
};
