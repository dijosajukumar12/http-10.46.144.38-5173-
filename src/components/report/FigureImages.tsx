import React from 'react';

/**
 * Figure 4.1 - Login screen (Chapter 4, Page 15)
 */
export const Figure41LoginImage: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-xl text-left select-none ${className}`}>
      {/* Browser chrome header */}
      <div className="bg-slate-800 px-3 py-2 flex items-center justify-between border-b border-slate-700 gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <div className="text-[10px] text-slate-400 font-mono bg-slate-900/80 px-2 sm:px-4 py-0.5 rounded border border-slate-700 truncate max-w-[150px] sm:max-w-xs">
          https://sas.excelcolleges.com/auth/login
        </div>
        <div className="text-[10px] text-emerald-400 font-mono shrink-0 hidden sm:block">🔒 SSL 256-bit</div>
      </div>

      {/* Login Screen Mockup Content */}
      <div className="p-5 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-indigo-950/40">
        <div className="w-full max-w-sm bg-slate-950/90 border border-indigo-500/30 rounded-xl p-5 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              SAS
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-none">STUDENT ATTENDANCE SYSTEM</p>
              <p className="text-[9px] text-slate-400">Excel Engineering College (Autonomous)</p>
            </div>
          </div>

          <div className="space-y-2.5 text-[11px]">
            <div>
              <span className="text-slate-400 block mb-0.5 text-[10px]">Username / Register Number</span>
              <div className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono flex items-center justify-between">
                <span>730925104051</span>
                <span className="text-[9px] text-indigo-400">Student</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5 text-[10px]">Password (SHA-256 Hashed)</span>
              <div className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-400 font-mono flex items-center justify-between">
                <span>••••••••••••</span>
                <span className="text-[9px] text-emerald-400">Encrypted</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="w-full py-2 rounded bg-indigo-600 text-white font-bold text-center text-[11px] shadow">
                Sign In to Dashboard
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1">
              <span>Sign in with Google</span>
              <span>Create Account</span>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 font-medium">
          Figure 4.1 - Implemented Role-Based Secure Login Interface
        </p>
      </div>
    </div>
  );
};

/**
 * Figure 4.2 - Administrator view: registered users and attendance records (Chapter 4, Page 15)
 */
export const Figure42AdminImage: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-xl text-left select-none ${className}`}>
      {/* Browser chrome header */}
      <div className="bg-slate-800 px-3 py-2 flex items-center justify-between border-b border-slate-700 gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <div className="text-[10px] text-slate-400 font-mono bg-slate-900/80 px-2 sm:px-4 py-0.5 rounded border border-slate-700 truncate max-w-[150px] sm:max-w-xs">
          https://sas.excelcolleges.com/admin/master-records
        </div>
        <div className="text-[10px] text-indigo-400 font-mono shrink-0 hidden sm:block">Admin (HOD)</div>
      </div>

      {/* Admin View Mockup */}
      <div className="p-3 sm:p-4 space-y-3 bg-slate-950">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-2">
          <div>
            <h4 className="text-xs font-bold text-white">Centralised Database: Master Records</h4>
            <p className="text-[10px] text-slate-400">Users, Students, Faculty, Subjects (Section 3.2.2)</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700">
              Threshold: 75%
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700">
              Active Sync
            </span>
          </div>
        </div>

        {/* Mini Table Preview */}
        <div className="overflow-x-auto">
          <div className="min-w-[420px] border border-slate-800 rounded-lg overflow-hidden text-[10px]">
          <div className="grid grid-cols-5 bg-slate-800/80 px-3 py-1.5 font-bold text-slate-300">
            <span>Register / ID</span>
            <span>Name</span>
            <span>Department</span>
            <span>Role</span>
            <span>Status / Subject</span>
          </div>
          <div className="divide-y divide-slate-800/60 bg-slate-900/40">
            <div className="grid grid-cols-5 px-3 py-1.5 text-slate-200">
              <span className="font-mono text-cyan-400">730925104051</span>
              <span>S. DIJO</span>
              <span>CSE - Year III</span>
              <span className="text-indigo-400">Student</span>
              <span className="text-emerald-400 font-semibold">Active (88.4%)</span>
            </div>
            <div className="grid grid-cols-5 px-3 py-1.5 text-slate-200">
              <span className="font-mono text-cyan-400">FAC-CSE-102</span>
              <span>Mr. N. Nandhakumar</span>
              <span>CSE Dept</span>
              <span className="text-amber-400">Faculty</span>
              <span>CS8591, CS8592</span>
            </div>
            <div className="grid grid-cols-5 px-3 py-1.5 text-slate-200">
              <span className="font-mono text-cyan-400">FAC-CSE-101</span>
              <span>Dr. P.C. Senthil Mahesh</span>
              <span>CSE (HOD)</span>
              <span className="text-purple-400">Administrator</span>
              <span>CS8491 (DBMS)</span>
            </div>
            <div className="grid grid-cols-5 px-3 py-1.5 text-slate-200">
              <span className="font-mono text-cyan-400">730925104053</span>
              <span>Rahul K.</span>
              <span>CSE - Year III</span>
              <span className="text-indigo-400">Student</span>
              <span className="text-red-400 font-semibold">Low Attendance (69.2%)</span>
            </div>
          </div>
        </div>
      </div>

        <p className="text-[10px] text-slate-400 font-medium">
          Figure 4.2 - Administrator View: Registered Users and Attendance Records (Live Database Entity)
        </p>
      </div>
    </div>
  );
};

/**
 * Figure 4.3 - Attendance marking screen (Chapter 4, Page 16)
 */
export const Figure43MarkingImage: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-xl text-left select-none ${className}`}>
      {/* Browser chrome header */}
      <div className="bg-slate-800 px-3 py-2 flex items-center justify-between border-b border-slate-700 gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <div className="text-[10px] text-slate-400 font-mono bg-slate-900/80 px-2 sm:px-4 py-0.5 rounded border border-slate-700 truncate max-w-[150px] sm:max-w-xs">
          https://sas.excelcolleges.com/faculty/mark-attendance
        </div>
        <div className="text-[10px] text-cyan-400 font-mono shrink-0 hidden sm:block">Faculty: Nandhakumar</div>
      </div>

      {/* Attendance Marking Mockup */}
      <div className="p-3 sm:p-4 space-y-3 bg-slate-950">
        {/* Selector Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] bg-slate-900 p-2 rounded-lg border border-slate-800">
          <div>
            <span className="text-slate-500 block">Subject:</span>
            <span className="font-bold text-white truncate block">CS8591 - Networks</span>
          </div>
          <div>
            <span className="text-slate-500 block">Date:</span>
            <span className="font-bold text-white">2026-11-22</span>
          </div>
          <div>
            <span className="text-slate-500 block">Period:</span>
            <span className="font-bold text-cyan-400">P2 (10:00 - 10:50)</span>
          </div>
          <div className="flex items-end justify-end">
            <span className="px-2 py-0.5 bg-emerald-600 text-white rounded font-bold text-[9px]">
              Mark All Present
            </span>
          </div>
        </div>

        {/* Student Roster Marking Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[400px] border border-slate-800 rounded-lg overflow-hidden text-[10px]">
            <div className="grid grid-cols-4 bg-slate-800/80 px-3 py-1.5 font-bold text-slate-300">
              <span>Reg. Number</span>
              <span>Student Name</span>
              <span>Past %</span>
              <span className="text-right">Period 2 Status</span>
            </div>
            <div className="divide-y divide-slate-800/60 bg-slate-900/50">
              <div className="grid grid-cols-4 items-center px-3 py-1.5 text-slate-200">
                <span className="font-mono text-cyan-400">730925104051</span>
                <span className="font-semibold">S. DIJO</span>
                <span className="text-emerald-400 font-semibold">88.4%</span>
                <div className="flex justify-end gap-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[9px]">P</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">A</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">OD</span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center px-3 py-1.5 text-slate-200">
                <span className="font-mono text-cyan-400">730925104052</span>
              <span>Priya Sharma</span>
              <span className="text-emerald-400 font-semibold">95.8%</span>
              <div className="flex justify-end gap-1">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[9px]">P</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">A</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">OD</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center px-3 py-1.5 text-slate-200">
              <span className="font-mono text-cyan-400">730925104053</span>
              <span>Rahul K.</span>
              <span className="text-red-400 font-semibold">69.2%</span>
              <div className="flex justify-end gap-1">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">P</span>
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[9px]">A</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">OD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

        <div className="flex items-center justify-between text-[10px]">
          <span className="text-amber-400 font-mono">🔒 Duplicate Prevention Guard: Active</span>
          <span className="bg-indigo-600 text-white px-3 py-1 rounded font-bold">
            Submit Attendance to Central DB
          </span>
        </div>

        <p className="text-[10px] text-slate-400 font-medium">
          Figure 4.3 - Period-wise Attendance Marking Screen with P / A / OD Toggle Controls
        </p>
      </div>
    </div>
  );
};

/**
 * Figure 4.4 - Attendance report view (Chapter 4, Page 16)
 */
export const Figure44ReportImage: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-xl text-left select-none ${className}`}>
      {/* Browser chrome header */}
      <div className="bg-slate-800 px-3 py-2 flex items-center justify-between border-b border-slate-700 gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <div className="text-[10px] text-slate-400 font-mono bg-slate-900/80 px-2 sm:px-4 py-0.5 rounded border border-slate-700 truncate max-w-[150px] sm:max-w-xs">
          https://sas.excelcolleges.com/reports/subject-summary
        </div>
        <div className="text-[10px] text-indigo-400 font-mono shrink-0 hidden sm:block">Report Generator</div>
      </div>

      {/* Attendance Report Mockup */}
      <div className="p-3 sm:p-4 space-y-3 bg-slate-950">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-2">
          <div>
            <h4 className="text-xs font-bold text-white">Subject-Wise Attendance Percentage Report</h4>
            <p className="text-[10px] text-slate-400">Formula: ((Attended [P + OD]) / Conducted) * 100 • Threshold: 75%</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-200 text-[9px] rounded font-mono">
              Export CSV
            </span>
            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] rounded font-bold">
              Print Sheet
            </span>
          </div>
        </div>

        {/* Visual Report Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[460px] border border-slate-800 rounded-lg overflow-hidden text-[10px]">
            <div className="grid grid-cols-6 bg-slate-800/80 px-3 py-1.5 font-bold text-slate-300">
              <span>Reg. No.</span>
              <span>Student</span>
              <span>Conducted</span>
              <span>Attended</span>
              <span>Percentage</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-slate-800/60 bg-slate-900/40">
              {/* S. DIJO */}
              <div className="grid grid-cols-6 items-center px-3 py-1.5 text-slate-200 bg-indigo-950/20">
                <span className="font-mono text-cyan-400 font-semibold">730925104051</span>
                <span className="font-bold text-white">S. DIJO</span>
                <span>50</span>
                <span>44 (42P+2OD)</span>
                <span className="font-bold text-emerald-400">88.0%</span>
                <span className="text-emerald-400 font-semibold">Above Threshold</span>
              </div>
              {/* Table 3.1 row 1 */}
              <div className="grid grid-cols-6 items-center px-3 py-1.5 text-slate-200">
                <span className="font-mono text-cyan-400">730925104052</span>
                <span>Priya Sharma</span>
                <span>50</span>
                <span>42</span>
                <span className="font-bold text-emerald-400">84.0%</span>
                <span className="text-emerald-400 font-semibold">Above Threshold</span>
              </div>
              {/* Table 3.1 row 2 */}
              <div className="grid grid-cols-6 items-center px-3 py-1.5 text-slate-200">
                <span className="font-mono text-cyan-400">730925104054</span>
                <span>Ananya Ramesh</span>
                <span>50</span>
                <span>38</span>
                <span className="font-bold text-emerald-400">76.0%</span>
                <span className="text-emerald-400 font-semibold">Above Threshold</span>
              </div>
              {/* Table 3.1 row 3 - Low Attendance Highlight */}
              <div className="grid grid-cols-6 items-center px-3 py-1.5 text-red-200 bg-red-950/40 border-l-2 border-red-500">
                <span className="font-mono text-red-300 font-bold">730925104053</span>
                <span className="font-bold">Rahul K.</span>
                <span>50</span>
                <span>36</span>
                <span className="font-bold text-red-400">72.0%</span>
                <span className="text-red-400 font-bold">Below Threshold: Flagged</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 font-medium">
          Figure 4.4 - Attendance Report View with Automatic Percentage Calculation and Low-Attendance Highlighting
        </p>
      </div>
    </div>
  );
};

/**
 * Figure 4.5 - Student dashboard (Chapter 4, Page 17)
 */
export const Figure45StudentImage: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-xl text-left select-none ${className}`}>
      {/* Browser chrome header */}
      <div className="bg-slate-800 px-3 py-2 flex items-center justify-between border-b border-slate-700 gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <div className="text-[10px] text-slate-400 font-mono bg-slate-900/80 px-2 sm:px-4 py-0.5 rounded border border-slate-700 truncate max-w-[150px] sm:max-w-xs">
          https://sas.excelcolleges.com/student/dashboard
        </div>
        <div className="text-[10px] text-indigo-400 font-mono shrink-0 hidden sm:block">S. DIJO (730925104051)</div>
      </div>

      {/* Student Dashboard Mockup */}
      <div className="p-4 space-y-3 bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h4 className="text-xs font-bold text-white">Student Personal Portal: Academic Attendance Summary</h4>
            <p className="text-[10px] text-slate-400">B.E Computer Science and Engineering • Year III / Semester 5</p>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[9px]">
            Eligible for Examinations
          </span>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-400 block">Overall Percentage</span>
            <span className="text-base font-extrabold text-emerald-400">88.4%</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-400 block">Classes Attended</span>
            <span className="text-base font-extrabold text-cyan-400">138 / 156</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-400 block">Min Threshold</span>
            <span className="text-base font-extrabold text-indigo-400">75.0%</span>
          </div>
        </div>

        {/* Subject Rows */}
        <div className="space-y-1.5 text-[10px]">
          <div className="bg-slate-900/80 p-2 rounded border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white">CS8591 - Computer Networks</span>
              <span className="text-slate-400 block text-[9px]">Conducted: 26 | Attended: 24 (2 OD)</span>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-emerald-400 text-xs">92.3%</span>
              <span className="text-[9px] text-slate-400 block">Safe to miss 5 classes</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-2 rounded border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white">CS8592 - OOAD</span>
              <span className="text-slate-400 block text-[9px]">Conducted: 26 | Attended: 23 (1 OD)</span>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-emerald-400 text-xs">88.5%</span>
              <span className="text-[9px] text-slate-400 block">Safe to miss 4 classes</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 font-medium">
          Figure 4.5 - Student Dashboard: Classes Conducted, Classes Attended, Percentage, and Bunk Calculator
        </p>
      </div>
    </div>
  );
};
