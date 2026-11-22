export type UserRole = 'admin' | 'faculty' | 'student';

export type AttendanceStatus = 'P' | 'A' | 'OD'; // Present, Absent, On Duty

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  department: string;
  registerNo?: string; // For students (e.g. 730925104051)
  facultyId?: string; // For faculty (e.g. FAC-CSE-102)
  avatar?: string;
  phone?: string;
}

export interface Student {
  registerNo: string;
  name: string;
  department: string;
  year: number;
  semester: number;
  section: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Faculty {
  facultyId: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  subjectsHandled: string[]; // array of subject codes
}

export interface Subject {
  code: string;
  name: string;
  semester: number;
  department: string;
  credits: number;
  facultyId: string;
  facultyName: string;
}

export interface AttendanceRecord {
  id: string;
  studentRegisterNo: string;
  subjectCode: string;
  date: string; // YYYY-MM-DD
  period: number; // 1 to 7
  status: AttendanceStatus;
  recordedBy: string; // Faculty ID or name
  recordedAt: string; // ISO timestamp
  isModified?: boolean;
  modifiedAt?: string;
}

export interface SubjectAttendanceSummary {
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  classesConducted: number;
  classesAttended: number; // Present + On Duty
  presentCount: number;
  absentCount: number;
  onDutyCount: number;
  percentage: number;
  isBelowThreshold: boolean;
  safeToBunk: number;
  neededToRecover: number;
}

export interface StudentOverallSummary {
  student: Student;
  totalConducted: number;
  totalAttended: number;
  overallPercentage: number;
  isBelowThreshold: boolean;
  subjectSummaries: SubjectAttendanceSummary[];
}

export interface ODRequest {
  id: string;
  studentRegisterNo: string;
  studentName: string;
  date: string;
  periods: number[];
  subjectCodes: string[];
  reason: string;
  eventName: string;
  proofDocumentName?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface SystemSettings {
  minAttendanceThreshold: number; // Default 75
  collegeName: string;
  autonomousStatus: string;
  affiliation: string;
  departmentName: string;
  allowEditMinutes: number; // e.g. 1440 mins (24h)
}

export interface TestCase {
  id: number;
  testCase: string;
  expectedResult: string;
  actualResult: string;
  status: 'Pass' | 'Fail' | 'Pending';
  executionTimeMs?: number;
  details?: string;
}
