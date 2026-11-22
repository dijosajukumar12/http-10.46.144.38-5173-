import React, { useState, useEffect } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { AttendanceStatus } from '../../types/attendance';
import {
  checkDuplicateAttendance,
  calculateAttendancePercentage,
  exportAttendanceToCsv,
  triggerCsvDownload
} from '../../utils/attendanceLogic';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Save,
  Download,
  Filter,
  Edit3,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FacultyView: React.FC<{ onOpenPrintModal?: () => void }> = ({ onOpenPrintModal }) => {
  const {
    currentUser,
    students,
    subjects,
    records,
    markPeriodAttendance,
    settings
  } = useAttendance();

  // Active faculty (Default: Mr. N. Nandhakumar)
  const facultyName = currentUser?.name || 'Mr. N. Nandhakumar, M.E.';

  // Faculty handled subjects
  const facultySubjects = subjects.filter(
    (s) => s.facultyName.includes('Nandhakumar') || s.facultyId === currentUser?.facultyId
  );
  const activeSubjectList = facultySubjects.length > 0 ? facultySubjects : subjects;

  // Selection states
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(activeSubjectList[0]?.code || 'CS8591');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(2);

  // Student statuses state map
  const [studentStatuses, setStudentStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  // Active view tab: 'mark' | 'reports'
  const [activeTab, setActiveTab] = useState<'mark' | 'reports'>('mark');
  const [onlyLowAttendance, setOnlyLowAttendance] = useState(false);

  // Check duplicate attendance for current (subject, date, period)
  const existingDuplicates = checkDuplicateAttendance(records, selectedSubjectCode, selectedDate, selectedPeriod);
  const hasExistingRecord = existingDuplicates.length > 0;

  // Initialize statuses when subject/date/period changes
  useEffect(() => {
    const newStatuses: Record<string, AttendanceStatus> = {};
    if (hasExistingRecord) {
      existingDuplicates.forEach((r) => {
        newStatuses[r.studentRegisterNo] = r.status;
      });
      setIsEditMode(false); // Locked by default unless faculty enables edit
    } else {
      // Default all to Present (P) as per Section 3.1
      students.forEach((s) => {
        newStatuses[s.registerNo] = 'P';
      });
      setIsEditMode(true);
    }
    setStudentStatuses(newStatuses);
    setFeedbackMessage(null);
    // oxlint-disable-next-line react/set-state-in-effect, react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubjectCode, selectedDate, selectedPeriod, hasExistingRecord]);

  // Bulk actions
  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      updated[s.registerNo] = status;
    });
    setStudentStatuses(updated);
  };

  const handleStatusChange = (regNo: string, status: AttendanceStatus) => {
    if (hasExistingRecord && !isEditMode) return;
    setStudentStatuses((prev) => ({
      ...prev,
      [regNo]: status,
    }));
  };

  // Submit attendance
  const handleSubmitAttendance = () => {
    const statusPayload = students.map((s) => ({
      studentRegisterNo: s.registerNo,
      status: studentStatuses[s.registerNo] || 'P',
    }));

    const result = markPeriodAttendance({
      subjectCode: selectedSubjectCode,
      date: selectedDate,
      period: selectedPeriod,
      statuses: statusPayload,
      recordedBy: facultyName,
      overrideDuplicate: hasExistingRecord && isEditMode,
    });

    if (!result.success) {
      setFeedbackMessage({ type: 'error', text: result.message });
    } else {
      setFeedbackMessage({ type: 'success', text: result.message });
      setIsEditMode(false);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  // Export current subject CSV
  const handleExportCsv = () => {
    const currentSubject = subjects.find((s) => s.code === selectedSubjectCode) || subjects[0];
    const csvData = exportAttendanceToCsv(students, currentSubject, records, settings.minAttendanceThreshold);
    triggerCsvDownload(csvData, `Attendance_${selectedSubjectCode}_${selectedDate}.csv`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Faculty Header Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shrink-0">
              <Users className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight truncate">
                {facultyName}
              </h2>
              <p className="text-xs text-indigo-300 font-medium truncate">
                Assistant Professor • Dept. of CSE
              </p>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
            Courses: {activeSubjectList.map((s) => `${s.code} (${s.name})`).join(', ')}
          </p>
        </div>

        {/* View Switcher Tabs (Responsive grid on mobile for any phone) */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('mark')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
              activeTab === 'mark'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="sm:hidden">Mark Attendance</span>
            <span className="hidden sm:inline">Mark Period Attendance</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
              activeTab === 'reports'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="sm:hidden">Reports & Lists</span>
            <span className="hidden sm:inline">Subject Reports & Defaulters</span>
          </button>
        </div>
      </div>

      {activeTab === 'mark' ? (
        /* MARK ATTENDANCE VIEW (Figure 4.3 reference) */
        <div className="space-y-6">
          {/* Session Parameters Toolbar */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Select Subject */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Subject Allocated
                </label>
                <select
                  value={selectedSubjectCode}
                  onChange={(e) => setSelectedSubjectCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  {activeSubjectList.map((sub) => (
                    <option key={sub.code} value={sub.code}>
                      {sub.code} - {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class & Section */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Class & Section
                </label>
                <div className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>B.E CSE - Sem 5 (Sec A)</span>
                  <span className="text-[10px] text-emerald-500 font-mono">8 Students</span>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Period Selector (1 to 7) */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Select Period (Hour 1 - 7)
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPeriod(p)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        selectedPeriod === p
                          ? 'bg-indigo-600 text-white shadow-sm scale-105'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      P{p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Strict Duplicate Submission Guard Banner (Section 3.2.4 & Table 4.2 Test Case 4) */}
            {hasExistingRecord && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-800 dark:text-amber-200">
                      Duplicate Entry Prevented! Attendance Already Recorded
                    </p>
                    <p className="text-amber-700 dark:text-amber-300 text-[11px] mt-0.5">
                      Period {selectedPeriod} on {selectedDate} ({selectedSubjectCode}) was recorded by{' '}
                      <strong>{existingDuplicates[0].recordedBy}</strong> at{' '}
                      {new Date(existingDuplicates[0].recordedAt).toLocaleTimeString()}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isEditMode ? (
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Enable Correction Mode</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-700">
                      Editing Permitted
                    </span>
                  )}
                </div>
              </div>
            )}

            {feedbackMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                  feedbackMessage.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
                }`}
              >
                {feedbackMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span className="font-semibold">{feedbackMessage.text}</span>
              </div>
            )}
          </div>

          {/* Student Roster Table (Attendance Marking Grid) */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {/* Table Header Action Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Students List ({students.length})
                </span>
                <span className="text-[11px] text-slate-400">
                  Select P (Present), A (Absent), or OD (On-Duty)
                </span>
              </div>

              {/* Bulk Quick Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={hasExistingRecord && !isEditMode}
                  onClick={() => handleMarkAll('P')}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 text-center"
                  title="Mark All Students Present in one click"
                >
                  Mark All Present (P)
                </button>
                <button
                  type="button"
                  disabled={hasExistingRecord && !isEditMode}
                  onClick={() => handleMarkAll('A')}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 text-center"
                >
                  Mark All Absent (A)
                </button>
              </div>
            </div>

            {/* Student Roster Grid */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student) => {
                // Calculate student's current % in this subject
                const sRecords = records.filter(
                  (r) => r.studentRegisterNo === student.registerNo && r.subjectCode === selectedSubjectCode
                );
                const conducted = sRecords.length;
                const attended = sRecords.filter((r) => r.status === 'P' || r.status === 'OD').length;
                const currentPct = calculateAttendancePercentage(attended, conducted);
                const isShortage = currentPct < settings.minAttendanceThreshold;

                const currentStatus = studentStatuses[student.registerNo] || 'P';

                return (
                  <div
                    key={student.registerNo}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Student Info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {student.name}
                          </span>
                          {student.registerNo === '730925104051' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                              Lead Author
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono text-cyan-600 dark:text-cyan-400">
                            {student.registerNo}
                          </span>
                          <span>•</span>
                          <span>
                            Cumulative: <strong className={isShortage ? 'text-red-500 font-bold' : 'text-emerald-500 font-bold'}>{currentPct}%</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Segmented P / A / OD Toggle Buttons (Optimized for Phone Ratio) */}
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <button
                        type="button"
                        disabled={hasExistingRecord && !isEditMode}
                        onClick={() => handleStatusChange(student.registerNo, 'P')}
                        className={`flex-1 sm:w-12 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1 ${
                          currentStatus === 'P'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500 scale-[1.02]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                        }`}
                      >
                        <span className="sm:hidden text-[10px] font-semibold opacity-80">Present</span>
                        <span>P</span>
                      </button>

                      <button
                        type="button"
                        disabled={hasExistingRecord && !isEditMode}
                        onClick={() => handleStatusChange(student.registerNo, 'A')}
                        className={`flex-1 sm:w-12 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1 ${
                          currentStatus === 'A'
                            ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-500 scale-[1.02]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40'
                        }`}
                      >
                        <span className="sm:hidden text-[10px] font-semibold opacity-80">Absent</span>
                        <span>A</span>
                      </button>

                      <button
                        type="button"
                        disabled={hasExistingRecord && !isEditMode}
                        onClick={() => handleStatusChange(student.registerNo, 'OD')}
                        className={`flex-1 sm:w-12 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1 ${
                          currentStatus === 'OD'
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-400 scale-[1.02]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                        }`}
                        title="On-Duty (Counted as present in calculations)"
                      >
                        <span className="sm:hidden text-[10px] font-semibold opacity-80">On-Duty</span>
                        <span>OD</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Finalize Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-mono text-center sm:text-left">
                {selectedSubjectCode} • Date: {selectedDate} • Period: {selectedPeriod}
              </span>

              <button
                type="button"
                disabled={hasExistingRecord && !isEditMode}
                onClick={handleSubmitAttendance}
                className="w-full sm:w-auto justify-center px-6 py-3 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Attendance to Central DB</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* REPORTS VIEW (Figure 4.4 reference) */
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Course Attendance Register & Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automatic percentage calculations with {settings.minAttendanceThreshold}% shortage threshold
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOnlyLowAttendance(!onlyLowAttendance)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  onlyLowAttendance
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{onlyLowAttendance ? 'Show All Students' : 'Only < 75% Defaulters'}</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              {onOpenPrintModal && (
                <button
                  onClick={onOpenPrintModal}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Sheet</span>
                </button>
              )}
            </div>
          </div>

          {/* Consolidated Report Table */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px]">
                    <th className="py-3 px-4">Register Number</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4 text-center">Conducted</th>
                    <th className="py-3 px-4 text-center">Attended (P+OD)</th>
                    <th className="py-3 px-4 text-center">Present</th>
                    <th className="py-3 px-4 text-center">Absent</th>
                    <th className="py-3 px-4 text-center">OD</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {students.map((student) => {
                    const sRecords = records.filter(
                      (r) => r.studentRegisterNo === student.registerNo && r.subjectCode === selectedSubjectCode
                    );
                    const conducted = sRecords.length;
                    const p = sRecords.filter((r) => r.status === 'P').length;
                    const a = sRecords.filter((r) => r.status === 'A').length;
                    const od = sRecords.filter((r) => r.status === 'OD').length;
                    const attended = p + od;
                    const pct = calculateAttendancePercentage(attended, conducted);
                    const isBelow = pct < settings.minAttendanceThreshold;

                    if (onlyLowAttendance && !isBelow) return null;

                    return (
                      <tr
                        key={student.registerNo}
                        className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                          isBelow ? 'bg-red-50/60 dark:bg-red-950/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                          {student.registerNo}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {student.name}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                          {conducted}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-indigo-600 dark:text-indigo-400">
                          {attended}
                        </td>
                        <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400">
                          {p}
                        </td>
                        <td className="py-3 px-4 text-center text-red-500 font-semibold">
                          {a}
                        </td>
                        <td className="py-3 px-4 text-center text-amber-500 font-semibold">
                          {od}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-black text-sm ${
                              pct >= settings.minAttendanceThreshold ? 'text-emerald-500' : 'text-red-500'
                            }`}
                          >
                            {pct}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {pct >= settings.minAttendanceThreshold ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              Eligible
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 animate-pulse">
                              Shortage Flagged
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
