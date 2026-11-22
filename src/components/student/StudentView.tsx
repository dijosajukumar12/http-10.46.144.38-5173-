import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import {
  getStudentSubjectSummaries,
  getStudentOverallSummary
} from '../../utils/attendanceLogic';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FileCheck,
  PlusCircle,
  TrendingUp
} from 'lucide-react';

export const StudentView: React.FC = () => {
  const { currentUser, students, subjects, records, odRequests, settings, submitODRequest } = useAttendance();

  // Selected student (Default: S. Dijo)
  const student = students.find((s) => s.registerNo === (currentUser?.registerNo || '730925104051')) || students[0];

  const overall = getStudentOverallSummary(student, subjects, records, settings.minAttendanceThreshold);
  const subjectSummaries = getStudentSubjectSummaries(
    student.registerNo,
    subjects,
    records,
    settings.minAttendanceThreshold
  );

  // Student's OD requests
  const studentODs = odRequests.filter((od) => od.studentRegisterNo === student.registerNo);

  // OD Request modal state
  const [showODModal, setShowODModal] = useState(false);
  const [odEvent, setOdEvent] = useState('');
  const [odDate, setOdDate] = useState('2026-11-23');
  const [odReason, setOdReason] = useState('');
  const [odPeriods, setOdPeriods] = useState<number[]>([1, 2, 3]);
  const odSubjects = ['CS8591', 'CS8592'];
  const [odSuccessMessage, setOdSuccessMessage] = useState(false);

  // History filter
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const studentRecords = records.filter((r) => {
    if (r.studentRegisterNo !== student.registerNo) return false;
    if (selectedSubjectFilter !== 'all' && r.subjectCode !== selectedSubjectFilter) return false;
    return true;
  });

  // Sort by date desc
  const sortedRecords = [...studentRecords].sort((a, b) => b.date.localeCompare(a.date) || b.period - a.period);

  const handleODSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!odEvent || !odReason) return;

    submitODRequest({
      studentRegisterNo: student.registerNo,
      studentName: student.name,
      date: odDate,
      periods: odPeriods,
      subjectCodes: odSubjects,
      eventName: odEvent,
      reason: odReason,
      proofDocumentName: `${odEvent.replace(/\s+/g, '_')}_Official_Duty_Slip.pdf`,
    });

    setOdSuccessMessage(true);
    setTimeout(() => {
      setOdSuccessMessage(false);
      setShowODModal(false);
      setOdEvent('');
      setOdReason('');
    }, 1500);
  };

  const togglePeriod = (p: number) => {
    if (odPeriods.includes(p)) {
      setOdPeriods(odPeriods.filter((item) => item !== p));
    } else {
      setOdPeriods([...odPeriods, p].sort((a, b) => a - b));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Student Profile Card (Chapter 4, Figure 4.5 reference) */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-4 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative z-10">
          {/* Left: Student identity info */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="relative shrink-0">
              <img
                src={student.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
                alt={student.name}
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-400 shadow-lg shadow-indigo-500/30"
              />
              <span className="absolute -bottom-1 -right-1 p-0.5 sm:p-1 bg-emerald-500 text-white rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-0.5 sm:space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight truncate">
                  {student.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
                  {student.registerNo}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                {student.department}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Year {student.year} / Sem {student.semester} (Sec {student.section}) • Anna Univ. Reg.
              </p>
            </div>
          </div>

          {/* Right: Quick actions & Eligibility */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowODModal(true)}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply On-Duty (OD)</span>
            </button>

            <div
              className={`w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                !overall.isBelowThreshold
                  ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300'
                  : 'bg-red-950/80 border-red-700/80 text-red-300 animate-pulse'
              }`}
            >
              {!overall.isBelowThreshold ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Eligible for Anna Univ. Exams</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Attendance Shortage Warning</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (Section 3.1 & Figure 4.5) - 2x2 on mobile for perfect phone aspect ratio */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Overall Percentage */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Cumulative %
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span
                className={`text-2xl sm:text-3xl font-extrabold ${
                  overall.overallPercentage >= settings.minAttendanceThreshold
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }`}
              >
                {overall.overallPercentage}%
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500">
                ({settings.minAttendanceThreshold}%)
              </span>
            </div>
            <p className="mt-0.5 text-[9px] sm:text-[11px] text-slate-400">
              (Attended/Conducted)×100
            </p>
          </div>

          {/* Circular Radial Ring */}
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center self-end sm:self-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={
                  overall.overallPercentage >= settings.minAttendanceThreshold
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }
                strokeDasharray={`${overall.overallPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-300">
              {Math.round(overall.overallPercentage)}%
            </span>
          </div>
        </div>

        {/* Classes Attended */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Attended
            </span>
            <span className="p-1 sm:p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {overall.totalAttended}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500">/ {overall.totalConducted}</span>
          </div>
          <p className="mt-0.5 text-[9px] sm:text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
            Present + On-Duty
          </p>
        </div>

        {/* Total Conducted */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Conducted
            </span>
            <span className="p-1 sm:p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {overall.totalConducted}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500">Hours</span>
          </div>
          <p className="mt-0.5 text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400">
            Across 6 Courses
          </p>
        </div>

        {/* On Duty & Activities */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              On-Duty (OD)
            </span>
            <span className="p-1 sm:p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-500">
              {studentODs.filter((o) => o.status === 'Approved').length}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500">Approved</span>
          </div>
          <p className="mt-0.5 text-[9px] sm:text-[11px] text-amber-600 dark:text-amber-400 font-medium truncate">
            Hackathons & IEEE
          </p>
        </div>
      </div>

      {/* Smart Bunk & Recovery Forecaster Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-indigo-500/30 p-5 backdrop-blur-md">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 shadow-md">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Attendance Intelligence & Margin Forecaster</span>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-mono">
                Min Threshold: {settings.minAttendanceThreshold}%
              </span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on the Anna University regulation formula, our algorithm projects your margin for each course:
              You can safely miss up to{' '}
              <strong className="text-emerald-400 font-semibold">
                {Math.max(...subjectSummaries.map((s) => s.safeToBunk))} classes
              </strong>{' '}
              in your highest attended course without dropping below {settings.minAttendanceThreshold}%.
            </p>
          </div>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown (Table 3.1 & Figure 4.5) */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Subject-Wise Attendance Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Classes Conducted, Attended, and Exam Eligibility status
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter View:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Subjects (6 Courses)</option>
              {subjects.map((sub) => (
                <option key={sub.code} value={sub.code}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subjects Table (Desktop / Tablet view) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Faculty In-Charge</th>
                <th className="py-3 px-4 text-center">Conducted</th>
                <th className="py-3 px-4 text-center">Attended (P+OD)</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Margin / Advice</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {subjectSummaries
                .filter((sub) => selectedSubjectFilter === 'all' || sub.subjectCode === selectedSubjectFilter)
                .map((sub) => (
                  <tr
                    key={sub.subjectCode}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      sub.isBelowThreshold ? 'bg-red-50/50 dark:bg-red-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {sub.subjectName}
                      </div>
                      <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        {sub.subjectCode}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {sub.facultyName}
                    </td>

                    <td className="py-3 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                      {sub.classesConducted}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {sub.classesAttended}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        ({sub.presentCount}P + {sub.onDutyCount}OD)
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black text-sm ${
                            sub.percentage >= settings.minAttendanceThreshold
                              ? 'text-emerald-500'
                              : 'text-red-500'
                          }`}
                        >
                          {sub.percentage}%
                        </span>
                      </div>
                      <div className="w-28 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1 overflow-hidden relative">
                        <div
                          className={`h-full rounded-full ${
                            sub.percentage >= settings.minAttendanceThreshold
                              ? 'bg-emerald-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, sub.percentage)}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {sub.percentage >= settings.minAttendanceThreshold ? (
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          Safe to miss {sub.safeToBunk} classes
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
                          Must attend {sub.neededToRecover} classes
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {sub.percentage >= settings.minAttendanceThreshold ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          Low Attendance
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Dedicated Mobile Card View (md:hidden) for Phone Ratio */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {subjectSummaries
            .filter((sub) => selectedSubjectFilter === 'all' || sub.subjectCode === selectedSubjectFilter)
            .map((sub) => (
              <div
                key={sub.subjectCode}
                className={`p-4 space-y-3 transition-colors ${
                  sub.isBelowThreshold ? 'bg-red-50/50 dark:bg-red-950/20' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 pr-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                      {sub.subjectCode}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white pt-1 leading-snug">
                      {sub.subjectName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Faculty: {sub.facultyName}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-xl font-black ${
                        sub.percentage >= settings.minAttendanceThreshold
                          ? 'text-emerald-500'
                          : 'text-red-500'
                      }`}
                    >
                      {sub.percentage}%
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {sub.classesAttended}/{sub.classesConducted} Attended
                    </span>
                  </div>
                </div>

                {/* Mobile Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sub.percentage >= settings.minAttendanceThreshold ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, sub.percentage)}%` }}
                  />
                </div>

                {/* Status & Margin Advice Pills */}
                <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                  <div className="flex-1 min-w-0">
                    {sub.percentage >= settings.minAttendanceThreshold ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800 text-[10px] sm:text-[11px] truncate">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate">Safe to miss {sub.safeToBunk}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-lg border border-red-200 dark:border-red-800 text-[10px] sm:text-[11px] animate-pulse truncate">
                        <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                        <span className="truncate">Need {sub.neededToRecover} to recover</span>
                      </span>
                    )}
                  </div>

                  <div className="shrink-0">
                    {sub.percentage >= settings.minAttendanceThreshold ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                        Shortage
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Two Column Section: Attendance Log & OD Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Daily Period-by-Period Attendance Log */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Daily Period Attendance Log
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Session-by-session verification records recorded by faculty
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              Showing {Math.min(sortedRecords.length, 12)} of {sortedRecords.length} records
            </span>
          </div>

          <div className="space-y-2">
            {sortedRecords.slice(0, 10).map((record) => (
              <div
                key={record.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs transition-colors hover:border-indigo-400"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      record.status === 'P'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                        : record.status === 'OD'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                        : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800'
                    }`}
                  >
                    {record.status}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.subjectCode}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Period {record.period}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Faculty: {record.recordedBy}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold block">
                    {record.date}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {record.status === 'P' ? 'Present' : record.status === 'OD' ? 'On-Duty' : 'Absent'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (1 col): Submitted On-Duty (OD) Requests & Status */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              On-Duty (OD) Applications
            </h3>
            <button
              onClick={() => setShowODModal(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Apply New
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Approved On-Duty hours count towards active attendance percentage as per Section 3.1.
          </p>

          <div className="space-y-3">
            {studentODs.map((od) => (
              <div
                key={od.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {od.eventName}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      od.status === 'Approved'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : od.status === 'Rejected'
                        ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {od.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                  {od.reason}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200 dark:border-slate-700/60 pt-2 font-mono">
                  <span>Date: {od.date}</span>
                  <span>Periods: {od.periods.join(', ')}</span>
                </div>

                {od.reviewedBy && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 italic">
                    Approved by: {od.reviewedBy}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply On-Duty Modal */}
      {showODModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Apply for Academic On-Duty (OD)
                </h3>
              </div>
              <button
                onClick={() => setShowODModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            {odSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>OD Application submitted to HOD and Faculty Supervisor!</span>
              </div>
            )}

            <form onSubmit={handleODSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Event / Competition Title
                </label>
                <input
                  type="text"
                  value={odEvent}
                  onChange={(e) => setOdEvent(e.target.value)}
                  placeholder="e.g. Anna University Smart India Hackathon / Tech Symposium"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  value={odDate}
                  onChange={(e) => setOdDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Select Periods (P1 to P7)
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePeriod(p)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors ${
                        odPeriods.includes(p)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      P{p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Justification / Duty Details
                </label>
                <textarea
                  value={odReason}
                  onChange={(e) => setOdReason(e.target.value)}
                  placeholder="Provide representation details or college club sanction..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={odSuccessMessage}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Submit OD Request for Approval</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
