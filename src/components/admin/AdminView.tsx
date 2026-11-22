import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { calculateAttendancePercentage } from '../../utils/attendanceLogic';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Database
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    students,
    faculty,
    subjects,
    records,
    odRequests,
    settings,
    updateSettings,
    addStudent,
    deleteStudent,
    reviewODRequest,
    currentUser
  } = useAttendance();

  // Active Admin tab
  const [activeTab, setActiveTab] = useState<'students' | 'faculty' | 'subjects' | 'audit' | 'od'>('students');

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');

  // Add student modal state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newRegNo, setNewRegNo] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSection, setNewSection] = useState('A');

  // Overall KPI statistics
  const totalStudents = students.length;
  const totalFaculty = faculty.length;
  const totalSubjects = subjects.length;
  const totalRecords = records.length;

  // Calculate low attendance students count
  const lowAttendanceCount = students.filter((s) => {
    const sRecords = records.filter((r) => r.studentRegisterNo === s.registerNo);
    const conducted = sRecords.length;
    const attended = sRecords.filter((r) => r.status === 'P' || r.status === 'OD').length;
    const pct = calculateAttendancePercentage(attended, conducted);
    return pct < settings.minAttendanceThreshold;
  }).length;

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegNo || !newName) return;

    addStudent({
      registerNo: newRegNo,
      name: newName,
      department: 'Computer Science and Engineering',
      year: 3,
      semester: 5,
      section: newSection,
      email: newEmail || `${newRegNo}@excelcolleges.com`,
      phone: '+91 98765 00000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    setNewRegNo('');
    setNewName('');
    setNewEmail('');
    setShowAddStudentModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Administrator Profile Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-600 text-white shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight truncate">
                {currentUser?.name || 'Dr. P.C. Senthil Mahesh, M.E., Ph.D.'}
              </h2>
              <p className="text-xs text-purple-300 font-medium truncate">
                Head of Department & Administrator • Dept. of CSE
              </p>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
            Central Repository • Role-Based Access Control
          </p>
        </div>

        {/* Global Threshold Controller Card */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full md:w-auto">
          <div>
            <div className="flex items-center justify-between gap-3 text-xs mb-1">
              <span className="font-semibold text-slate-300">Min. Attendance Threshold:</span>
              <span className="font-extrabold text-amber-400 text-sm font-mono">
                {settings.minAttendanceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              step="1"
              value={settings.minAttendanceThreshold}
              onChange={(e) => updateSettings({ minAttendanceThreshold: Number(e.target.value) })}
              className="w-full sm:w-44 accent-indigo-500 cursor-pointer"
            />
          </div>
          <div className="text-[10px] text-slate-400 leading-tight hidden sm:block max-w-[110px]">
            Anna Univ. AICTE Regulation
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Enrolled Students</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalStudents}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">Class 5th Sem CSE</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Faculty Registered</span>
            <Users className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalFaculty}
          </div>
          <span className="text-[11px] text-cyan-500 font-medium">Allocated to {totalSubjects} Subjects</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Central Records</span>
            <Database className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalRecords}
          </div>
          <span className="text-[11px] text-purple-400 font-medium">Logged Sessions</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Shortage Defaulters</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-red-500">
            {lowAttendanceCount}
          </div>
          <span className="text-[11px] text-red-400 font-medium">&lt; {settings.minAttendanceThreshold}% Threshold</span>
        </div>
      </div>

      {/* Database Management Navigation Tabs */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-950 p-1 rounded-xl text-xs font-bold overflow-x-auto no-scrollbar max-w-full w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'students'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              <span className="sm:hidden">Students ({students.length})</span>
              <span className="hidden sm:inline">Students Entity ({students.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('faculty')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'faculty'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              <span className="sm:hidden">Faculty ({faculty.length})</span>
              <span className="hidden sm:inline">Faculty Entity ({faculty.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'subjects'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              <span className="sm:hidden">Subjects ({subjects.length})</span>
              <span className="hidden sm:inline">Subjects Entity ({subjects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('od')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'od'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              <span className="sm:hidden">OD ({odRequests.filter((r) => r.status === 'Pending').length})</span>
              <span className="hidden sm:inline">OD Requests ({odRequests.filter((r) => r.status === 'Pending').length} Pending)</span>
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-auto">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search register no, name..."
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>

            {activeTab === 'students' && (
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Student</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: STUDENTS MASTER */}
        {activeTab === 'students' && (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px]">
                    <th className="py-3 px-4">Register Number</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Department & Class</th>
                    <th className="py-3 px-4">Contact Email</th>
                    <th className="py-3 px-4 text-center">Cumulative %</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {students
                    .filter(
                      (s) =>
                        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.registerNo.includes(searchQuery)
                    )
                    .map((student) => {
                      const sRecords = records.filter((r) => r.studentRegisterNo === student.registerNo);
                      const conducted = sRecords.length;
                      const attended = sRecords.filter((r) => r.status === 'P' || r.status === 'OD').length;
                      const pct = calculateAttendancePercentage(attended, conducted);
                      const isShortage = pct < settings.minAttendanceThreshold;

                      return (
                        <tr
                          key={student.registerNo}
                          className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                            isShortage ? 'bg-red-50/50 dark:bg-red-950/20' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            {student.registerNo}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                            {student.name}
                            {student.registerNo === '730925104051' && (
                              <span className="ml-2 text-[10px] text-indigo-500 font-normal">
                                (Project Author)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {student.department} • Y{student.year}/S{student.semester} ({student.section})
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                            {student.email}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`font-black text-xs ${
                                pct >= settings.minAttendanceThreshold ? 'text-emerald-500' : 'text-red-500'
                              }`}
                            >
                              {pct}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete student record for ${student.name}?`)) {
                                  deleteStudent(student.registerNo);
                                }
                              }}
                              className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View for Phone Ratio */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {students
                .filter(
                  (s) =>
                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.registerNo.includes(searchQuery)
                )
                .map((student) => {
                  const sRecords = records.filter((r) => r.studentRegisterNo === student.registerNo);
                  const conducted = sRecords.length;
                  const attended = sRecords.filter((r) => r.status === 'P' || r.status === 'OD').length;
                  const pct = calculateAttendancePercentage(attended, conducted);
                  const isShortage = pct < settings.minAttendanceThreshold;

                  return (
                    <div
                      key={student.registerNo}
                      className={`p-4 space-y-2.5 ${
                        isShortage ? 'bg-red-50/50 dark:bg-red-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                              {student.name}
                            </h4>
                            {student.registerNo === '730925104051' && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                                Lead Author
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                            {student.registerNo}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`font-black text-sm px-2 py-0.5 rounded-lg ${
                              pct >= settings.minAttendanceThreshold
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                                : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'
                            }`}
                          >
                            {pct}%
                          </span>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete student record for ${student.name}?`)) {
                                deleteStudent(student.registerNo);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span>Sec {student.section} • Year {student.year}/Sem {student.semester}</span>
                        <span className="font-mono text-[11px] truncate max-w-[170px]">{student.email}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {/* TAB 2: FACULTY MASTER */}
        {activeTab === 'faculty' && (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px]">
                    <th className="py-3 px-4">Faculty ID</th>
                    <th className="py-3 px-4">Faculty Name</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Assigned Subjects</th>
                    <th className="py-3 px-4">Official Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {faculty.map((fac) => (
                    <tr key={fac.facultyId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {fac.facultyId}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {fac.name}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {fac.designation}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-cyan-600 dark:text-cyan-400">
                        {fac.subjectsHandled.join(', ')}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {fac.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View for Phone Ratio */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {faculty.map((fac) => (
                <div key={fac.facultyId} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {fac.name}
                      </h4>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        {fac.designation}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {fac.facultyId}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-400">Courses:</strong> {fac.subjectsHandled.join(', ')}
                    </p>
                    <p className="font-mono text-slate-400 text-[11px]">
                      {fac.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TAB 3: SUBJECTS MASTER */}
        {activeTab === 'subjects' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px]">
                  <th className="py-3 px-4">Subject Code</th>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">Faculty Handling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subjects.map((sub) => (
                  <tr key={sub.code} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {sub.code}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {sub.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {sub.credits} Credits
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      Semester {sub.semester}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-200 font-medium">
                      {sub.facultyName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: OD APPROVALS */}
        {activeTab === 'od' && (
          <div className="p-4 space-y-3">
            <div className="space-y-3">
              {odRequests.map((od) => (
                <div
                  key={od.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {od.eventName}
                      </span>
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

                    <p className="text-slate-600 dark:text-slate-300">
                      Candidate: <strong>{od.studentName}</strong> ({od.studentRegisterNo}) • Date: {od.date} • Periods: {od.periods.join(', ')}
                    </p>
                    <p className="text-slate-500 italic text-[11px]">{od.reason}</p>
                  </div>

                  {od.status === 'Pending' && (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => reviewODRequest(od.id, 'Approved', currentUser?.name || 'Dr. P.C. Senthil Mahesh')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve OD</span>
                      </button>

                      <button
                        onClick={() => reviewODRequest(od.id, 'Rejected', currentUser?.name || 'Dr. P.C. Senthil Mahesh')}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 shadow"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Register New Student into Central DB
            </h3>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Register Number
                </label>
                <input
                  type="text"
                  value={newRegNo}
                  onChange={(e) => setNewRegNo(e.target.value)}
                  placeholder="e.g. 730925104060"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Arun Kumar S."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Section
                </label>
                <select
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@excelcolleges.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
