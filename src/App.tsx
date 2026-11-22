import React, { useState } from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { Navbar } from './components/layout/Navbar';
import { IntroAnimationVideo } from './components/intro/IntroAnimationVideo';
import { LoginView } from './components/auth/LoginView';
import { StudentView } from './components/student/StudentView';
import { FacultyView } from './components/faculty/FacultyView';
import { AdminView } from './components/admin/AdminView';
import { ReportDefenseModal } from './components/report/ReportDefenseModal';
import { PrintReportModal } from './components/common/PrintReportModal';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Sparkles, Play } from 'lucide-react';

const MainPortalContent: React.FC = () => {
  const { currentUser } = useAttendance();

  // Intro video animation state (Starts on site load as requested)
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    // If not authenticated, start with the full SAS intro animation video
    return !sessionStorage.getItem('SAS_AUTH_USER');
  });

  // Report & Print modals
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const handleFinishIntro = () => {
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  // 1. If intro animation video is running, show it full-screen
  if (showIntro) {
    return <IntroAnimationVideo onComplete={handleFinishIntro} />;
  }

  // 2. If no user is logged in, show the comprehensive Login view (Create, Sign In, Google)
  if (!currentUser) {
    return (
      <LoginView
        onSuccessLogin={() => {}}
        onReplayIntro={handleReplayIntro}
      />
    );
  }

  // 3. User is logged in: show the professional application portal
  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-[#080B14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500/30 selection:text-indigo-400 overflow-x-hidden">
      {/* Institutional Top Navbar */}
      <Navbar
        onOpenReportModal={() => setShowReportModal(true)}
        onOpenPrintModal={() => setShowPrintModal(true)}
      />

      {/* Main Body Content Container with mobile bottom padding for nav bar */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 pb-28 md:pb-8">
        {currentUser.role === 'student' && <StudentView />}
        {currentUser.role === 'faculty' && <FacultyView onOpenPrintModal={() => setShowPrintModal(true)} />}
        {currentUser.role === 'admin' && <AdminView />}
      </main>

      {/* Floating Action Button (FAB) on Desktop (on mobile bottom nav covers navigation) */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-30 flex-col gap-2.5 items-end">
        <button
          onClick={handleReplayIntro}
          className="p-3 rounded-full bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-slate-700 shadow-xl backdrop-blur-md hover:scale-110 active:scale-95 transition-all group relative"
          title="Replay SAS Intro Animation Video"
        >
          <Play className="w-4 h-4 fill-cyan-400" />
          <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-slate-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Replay SAS Motion Intro
          </span>
        </button>

        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all group"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Project Report & Defense</span>
        </button>
      </div>

      {/* Mobile Phone Native App Bottom Navigation */}
      <MobileBottomNav
        onOpenReportModal={() => setShowReportModal(true)}
        onOpenPrintModal={() => setShowPrintModal(true)}
      />

      {/* Modals */}
      <ReportDefenseModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onOpenPrintModal={() => {
          setShowReportModal(false);
          setShowPrintModal(true);
        }}
      />

      <PrintReportModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-4 text-center text-xs text-slate-500 dark:text-slate-400 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-center sm:text-left">
            <strong>SAS (Student Attendance System)</strong> • Excel Engineering College (Autonomous)
          </p>
          <p className="font-mono text-[11px] text-slate-400 text-center sm:text-right">
            Lead Author: <strong>S. DIJO (730925104051)</strong> • Anna University
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AttendanceProvider>
      <MainPortalContent />
    </AttendanceProvider>
  );
}
