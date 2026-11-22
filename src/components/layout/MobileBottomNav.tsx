import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { GraduationCap, Users, ShieldCheck, FileText, LogOut } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenReportModal: () => void;
  onOpenPrintModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenReportModal,
}) => {
  const { currentUser, switchUser, logout } = useAttendance();

  if (!currentUser) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-1 pt-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
      <div className="grid grid-cols-5 items-center w-full max-w-lg mx-auto">
        {/* Student Tab */}
        <button
          onClick={() => switchUser('student')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all w-full ${
            currentUser.role === 'student'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              currentUser.role === 'student'
                ? 'bg-indigo-50 dark:bg-indigo-950/80 shadow-sm ring-1 ring-indigo-500/30'
                : ''
            }`}
          >
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate w-full text-center">Student</span>
        </button>

        {/* Faculty Tab */}
        <button
          onClick={() => switchUser('faculty')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all w-full ${
            currentUser.role === 'faculty'
              ? 'text-cyan-600 dark:text-cyan-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              currentUser.role === 'faculty'
                ? 'bg-cyan-50 dark:bg-cyan-950/80 shadow-sm ring-1 ring-cyan-500/30'
                : ''
            }`}
          >
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate w-full text-center">Faculty</span>
        </button>

        {/* Admin Tab */}
        <button
          onClick={() => switchUser('admin')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all w-full ${
            currentUser.role === 'admin'
              ? 'text-purple-600 dark:text-purple-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              currentUser.role === 'admin'
                ? 'bg-purple-50 dark:bg-purple-950/80 shadow-sm ring-1 ring-purple-500/30'
                : ''
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate w-full text-center">Admin</span>
        </button>

        {/* Report & Test Suite */}
        <button
          onClick={onOpenReportModal}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-amber-600 dark:text-amber-400 font-semibold w-full"
        >
          <div className="p-1 rounded-xl bg-amber-50 dark:bg-amber-950/80 shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate w-full text-center">Report</span>
        </button>

        {/* Exit Logout */}
        <button
          onClick={logout}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-red-500 dark:text-red-400 w-full"
          title="Sign Out"
        >
          <div className="p-1 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate w-full text-center">Exit</span>
        </button>
      </div>
    </nav>
  );
};
