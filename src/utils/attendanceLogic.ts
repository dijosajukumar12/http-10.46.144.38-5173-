import {
  AttendanceRecord,
  Student,
  Subject,
  SubjectAttendanceSummary,
  StudentOverallSummary,
} from '../types/attendance';

/**
 * Calculates attendance percentage according to Section 3.1:
 * Attendance % = (Number of classes attended / Total number of classes conducted) * 100
 * Note: On-duty (OD) entries are counted as present!
 */
export function calculateAttendancePercentage(attended: number, conducted: number): number {
  if (conducted === 0) return 100.0;
  const pct = (attended / conducted) * 100;
  return Math.round(pct * 10) / 10; // Round to 1 decimal place (e.g. 84.0%)
}

/**
 * Calculates Bunk or Recovery margins based on target threshold (e.g. 75%)
 */
export function calculateMargin(attended: number, conducted: number, threshold: number): {
  safeToBunk: number;
  neededToRecover: number;
} {
  if (conducted === 0) {
    return { safeToBunk: 0, neededToRecover: 0 };
  }

  const currentPct = (attended / conducted) * 100;
  const target = threshold / 100;

  if (currentPct >= threshold) {
    // How many classes can be missed:
    // (attended) / (conducted + x) >= target
    // attended >= target * (conducted + x)
    // attended / target - conducted >= x
    const safe = Math.floor(attended / target - conducted);
    return { safeToBunk: Math.max(0, safe), neededToRecover: 0 };
  } else {
    // How many classes must be attended consecutively:
    // (attended + y) / (conducted + y) >= target
    // attended + y >= target * conducted + target * y
    // y * (1 - target) >= target * conducted - attended
    // y >= (target * conducted - attended) / (1 - target)
    if (threshold >= 100) {
      return { safeToBunk: 0, neededToRecover: 99 };
    }
    const needed = Math.ceil((target * conducted - attended) / (1 - target));
    return { safeToBunk: 0, neededToRecover: Math.max(1, needed) };
  }
}

/**
 * Generates subject-wise attendance summary for a specific student
 */
export function getStudentSubjectSummaries(
  studentRegNo: string,
  subjects: Subject[],
  records: AttendanceRecord[],
  threshold: number = 75
): SubjectAttendanceSummary[] {
  return subjects.map((subject) => {
    const studentRecords = records.filter(
      (r) => r.studentRegisterNo === studentRegNo && r.subjectCode === subject.code
    );

    const conducted = studentRecords.length;
    let presentCount = 0;
    let absentCount = 0;
    let onDutyCount = 0;

    studentRecords.forEach((r) => {
      if (r.status === 'P') presentCount++;
      else if (r.status === 'A') absentCount++;
      else if (r.status === 'OD') onDutyCount++;
    });

    const attended = presentCount + onDutyCount; // On-duty counts as present!
    const percentage = calculateAttendancePercentage(attended, conducted);
    const isBelowThreshold = percentage < threshold;
    const { safeToBunk, neededToRecover } = calculateMargin(attended, conducted, threshold);

    return {
      subjectCode: subject.code,
      subjectName: subject.name,
      facultyName: subject.facultyName,
      classesConducted: conducted,
      classesAttended: attended,
      presentCount,
      absentCount,
      onDutyCount,
      percentage,
      isBelowThreshold,
      safeToBunk,
      neededToRecover,
    };
  });
}

/**
 * Calculates overall attendance summary for a student across all enrolled subjects
 */
export function getStudentOverallSummary(
  student: Student,
  subjects: Subject[],
  records: AttendanceRecord[],
  threshold: number = 75
): StudentOverallSummary {
  const subjectSummaries = getStudentSubjectSummaries(student.registerNo, subjects, records, threshold);

  const totalConducted = subjectSummaries.reduce((acc, curr) => acc + curr.classesConducted, 0);
  const totalAttended = subjectSummaries.reduce((acc, curr) => acc + curr.classesAttended, 0);
  const overallPercentage = calculateAttendancePercentage(totalAttended, totalConducted);

  return {
    student,
    totalConducted,
    totalAttended,
    overallPercentage,
    isBelowThreshold: overallPercentage < threshold,
    subjectSummaries,
  };
}

/**
 * Checks if attendance has already been recorded for a subject, date, and period (Section 3.2.2 & 3.2.4)
 */
export function checkDuplicateAttendance(
  records: AttendanceRecord[],
  subjectCode: string,
  date: string,
  period: number
): AttendanceRecord[] {
  return records.filter(
    (r) => r.subjectCode === subjectCode && r.date === date && r.period === period
  );
}

/**
 * Generates CSV string for export
 */
export function exportAttendanceToCsv(
  students: Student[],
  subject: Subject,
  records: AttendanceRecord[],
  threshold: number = 75
): string {
  const headers = ['Register Number', 'Student Name', 'Department', 'Conducted', 'Attended (P+OD)', 'Present', 'Absent', 'On-Duty', 'Percentage (%)', 'Status'];
  
  const rows = students.map((s) => {
    const sRecords = records.filter(
      (r) => r.studentRegisterNo === s.registerNo && r.subjectCode === subject.code
    );
    const conducted = sRecords.length;
    const p = sRecords.filter((r) => r.status === 'P').length;
    const a = sRecords.filter((r) => r.status === 'A').length;
    const od = sRecords.filter((r) => r.status === 'OD').length;
    const attended = p + od;
    const pct = calculateAttendancePercentage(attended, conducted);
    const status = pct >= threshold ? 'Eligible' : 'SHORTAGE WARNING';

    return [
      `"${s.registerNo}"`,
      `"${s.name}"`,
      `"${s.department}"`,
      conducted,
      attended,
      p,
      a,
      od,
      `${pct}%`,
      `"${status}"`
    ].join(',');
  });

  return [
    `"EXCEL ENGINEERING COLLEGE (AUTONOMOUS) - STUDENT ATTENDANCE REPORT"`,
    `"Subject: ${subject.code} - ${subject.name} | Faculty: ${subject.facultyName} | Generated: ${new Date().toLocaleDateString()}"`,
    `"Attendance Threshold: ${threshold}%"`,
    '',
    headers.join(','),
    ...rows,
  ].join('\n');
}

/**
 * Download CSV helper
 */
export function triggerCsvDownload(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
