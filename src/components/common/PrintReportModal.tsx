import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { calculateAttendancePercentage } from '../../utils/attendanceLogic';
import { Printer, X } from 'lucide-react';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({ isOpen, onClose }) => {
  const { students, records, settings } = useAttendance();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-1.5 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Controls Bar */}
        <div className="p-3 sm:p-4 bg-slate-900 text-white flex items-center justify-between print:hidden gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Printer className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <span className="font-bold text-xs sm:text-sm truncate">Institutional Print Preview</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="px-3 sm:px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Content */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-slate-900 text-xs">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <h1 className="text-base sm:text-xl font-black uppercase tracking-wider text-slate-900">
              EXCEL ENGINEERING COLLEGE (AUTONOMOUS)
            </h1>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-700">
              Approved by AICTE, New Delhi & Affiliated to Anna University, Chennai
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-600 font-mono">
              KOMARAPALAYAM - 637303, NAMAKKAL DISTRICT, TAMIL NADU
            </p>
            <p className="text-[11px] sm:text-xs font-bold text-indigo-900 pt-1 uppercase tracking-widest">
              DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
            </p>
            <h2 className="text-xs sm:text-sm font-extrabold underline tracking-wide uppercase pt-1">
              STUDENT ATTENDANCE CONSOLIDATED REGISTER & ELIGIBILITY REPORT
            </h2>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono">
              Academic Year 2026-2027 • 5th Semester • Section A • Minimum Threshold: {settings.minAttendanceThreshold}%
            </p>
          </div>

          {/* Student Performance Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px] text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-[11px]">
                <th className="p-2 border-r border-slate-300">S.No</th>
                <th className="p-2 border-r border-slate-300">Register Number</th>
                <th className="p-2 border-r border-slate-300">Student Name</th>
                <th className="p-2 border-r border-slate-300 text-center">Conducted</th>
                <th className="p-2 border-r border-slate-300 text-center">Attended (P+OD)</th>
                <th className="p-2 border-r border-slate-300 text-center">Present</th>
                <th className="p-2 border-r border-slate-300 text-center">On-Duty</th>
                <th className="p-2 border-r border-slate-300 text-center">Attendance %</th>
                <th className="p-2 text-right">Exam Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map((student, idx) => {
                const sRecords = records.filter((r) => r.studentRegisterNo === student.registerNo);
                const conducted = sRecords.length;
                const p = sRecords.filter((r) => r.status === 'P').length;
                const od = sRecords.filter((r) => r.status === 'OD').length;
                const attended = p + od;
                const pct = calculateAttendancePercentage(attended, conducted);
                const isShortage = pct < settings.minAttendanceThreshold;

                return (
                  <tr key={student.registerNo} className={isShortage ? 'bg-red-50' : ''}>
                    <td className="p-2 border-r border-slate-300 font-mono">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-300 font-mono font-bold">
                      {student.registerNo}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-semibold">
                      {student.name}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center">{conducted}</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">{attended}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{p}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{od}</td>
                    <td className="p-2 border-r border-slate-300 text-center font-black">
                      {pct}%
                    </td>
                    <td className="p-2 text-right font-bold">
                      {!isShortage ? (
                        <span className="text-emerald-700">Eligible</span>
                      ) : (
                        <span className="text-red-700 font-black">SHORTAGE (&lt; {settings.minAttendanceThreshold}%)</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Institutional Signatures Block */}
          <div className="pt-16 grid grid-cols-3 gap-6 text-center text-xs">
            <div className="border-t border-slate-400 pt-2 space-y-0.5">
              <p className="font-bold">Mr. N. NANDHAKUMAR, M.E.</p>
              <p className="text-slate-600 text-[10px]">Project Supervisor & Class In-Charge</p>
            </div>

            <div className="border-t border-slate-400 pt-2 space-y-0.5">
              <p className="font-bold">Dr. P.C. SENTHIL MAHESH, Ph.D.</p>
              <p className="text-slate-600 text-[10px]">Professor & Head of Department</p>
            </div>

            <div className="border-t border-slate-400 pt-2 space-y-0.5">
              <p className="font-bold">PRINCIPAL</p>
              <p className="text-slate-600 text-[10px]">Excel Engineering College (Autonomous)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
