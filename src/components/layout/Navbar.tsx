import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  FileText,
  Sun,
  Moon,
  RotateCcw,
  LogOut,
  ChevronDown,
  Award,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  onOpenReportModal: () => void;
  onOpenPrintModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenReportModal, onOpenPrintModal }) => {
  const { currentUser, switchUser, logout, theme, toggleTheme, resetToDefaultData, settings } = useAttendance();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (window.confirm('Reset all demo attendance records and users back to initial college state?')) {
      resetToDefaultData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      {/* Top Academic Sub-bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-indigo-950">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-amber-300 text-[11px] sm:text-xs truncate">
            <span className="sm:hidden">EXCEL ENGG. COLLEGE</span>
            <span className="hidden sm:inline">EXCEL ENGINEERING COLLEGE (AUTONOMOUS)</span>
          </span>
          <span className="hidden md:inline text-slate-300">• Affiliated to Anna University • Approved by AICTE</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px]">
            <Award className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" />
            <span className="hidden sm:inline">SDG 4: Quality Education</span>
            <span className="sm:hidden">SDG 4 & 9</span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline">SDG 9: Innovation</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-slate-300">
            <span>Threshold:</span>
            <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
              {settings.minAttendanceThreshold}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand & Identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-black text-sm sm:text-lg text-slate-900 dark:text-white tracking-tight truncate">
                <span className="sm:hidden">SAS</span>
                <span className="hidden sm:inline">STUDENT ATTENDANCE SYSTEM</span>
              </h1>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">
              Dept. of CSE • Project by <strong className="text-indigo-600 dark:text-indigo-400">S. DIJO (730925104051)</strong>
            </p>
          </div>
        </div>

        {/* Center: Instant Role Switcher for seamless demonstration */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-inner">
          <button
            onClick={() => switchUser('student')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentUser?.role === 'student'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student (S. Dijo)</span>
          </button>

          <button
            onClick={() => switchUser('faculty')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentUser?.role === 'faculty'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Faculty (Nandhakumar)</span>
          </button>

          <button
            onClick={() => switchUser('admin')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentUser?.role === 'admin'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin (HOD)</span>
          </button>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Project Report & Live Test Suite Modal Trigger */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25 transition-all"
            title="Open Knowledge Demonstration Report & Table 4.2 Test Suite"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Project Report & Tests</span>
            <span className="sm:hidden">Report</span>
          </button>

          {/* Print/Export Attendance Report */}
          <button
            onClick={onOpenPrintModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Print Attendance Record"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>Print</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={handleReset}
            className={`p-1.5 sm:p-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              resetSuccess ? 'text-emerald-500' : ''
            }`}
            title="Reset Mock Data to Initial State"
          >
            {resetSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-bounce" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* User Profile / Logout Dropdown */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1 pl-1 pr-0.5 py-0.5 sm:py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors bg-white dark:bg-slate-800"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-indigo-400/50"
                />
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showRoleDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setShowRoleDropdown(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {currentUser.role.toUpperCase()} • {currentUser.registerNo || currentUser.facultyId || 'Administrator'}
                    </p>
                  </div>

                  <div className="py-1">
                    <p className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role Mode
                    </p>
                    <button
                      onClick={() => switchUser('student')}
                      className="w-full text-left px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-indigo-500" />
                        Student View (S. Dijo)
                      </span>
                      {currentUser.role === 'student' && <span className="text-emerald-500 text-xs font-bold">Active</span>}
                    </button>
                    <button
                      onClick={() => switchUser('faculty')}
                      className="w-full text-left px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        Faculty View (Mr. Nandhakumar)
                      </span>
                      {currentUser.role === 'faculty' && <span className="text-emerald-500 text-xs font-bold">Active</span>}
                    </button>
                    <button
                      onClick={() => switchUser('admin')}
                      className="w-full text-left px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-purple-500" />
                        Administrator View (HOD)
                      </span>
                      {currentUser.role === 'admin' && <span className="text-emerald-500 text-xs font-bold">Active</span>}
                    </button>
                  </div>

                  <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
