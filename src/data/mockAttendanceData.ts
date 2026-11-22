import {
  Student,
  Faculty,
  Subject,
  AttendanceRecord,
  User,
  ODRequest,
  SystemSettings
} from '../types/attendance';

export const INITIAL_SETTINGS: SystemSettings = {
  minAttendanceThreshold: 75,
  collegeName: 'Excel Engineering College (Autonomous)',
  autonomousStatus: 'Approved by AICTE, New Delhi & Affiliated to Anna University Chennai',
  affiliation: 'Anna University Chennai',
  departmentName: 'Department of Computer Science and Engineering',
  allowEditMinutes: 1440, // 24 hours
};

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-ADMIN-1',
    username: 'admin',
    name: 'Dr. P.C. Senthil Mahesh, M.E., Ph.D.',
    role: 'admin',
    email: 'hod.cse@excelcolleges.com',
    department: 'Computer Science and Engineering',
    phone: '+91 98421 11223',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-FAC-102',
    username: 'nandhakumar',
    name: 'Mr. N. Nandhakumar, M.E.',
    role: 'faculty',
    email: 'nandhakumar.cse@excelcolleges.com',
    department: 'Computer Science and Engineering',
    facultyId: 'FAC-CSE-102',
    phone: '+91 94432 44556',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-STU-051',
    username: '730925104051',
    name: 'S. DIJO',
    role: 'student',
    email: 'dijo.730925104051@excelcolleges.com',
    department: 'Computer Science and Engineering',
    registerNo: '730925104051',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-STU-052',
    username: '730925104052',
    name: 'Priya Sharma',
    role: 'student',
    email: 'priya.730925104052@excelcolleges.com',
    department: 'Computer Science and Engineering',
    registerNo: '730925104052',
    phone: '+91 98765 43211',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-STU-053',
    username: '730925104053',
    name: 'Rahul K.',
    role: 'student',
    email: 'rahul.730925104053@excelcolleges.com',
    department: 'Computer Science and Engineering',
    registerNo: '730925104053',
    phone: '+91 98765 43212',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    registerNo: '730925104051',
    name: 'S. DIJO',
    department: 'Computer Science and Engineering',
    year: 3,
    semester: 5,
    section: 'A',
    email: 'dijo.730925104051@excelcolleges.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    registerNo: '730925104052',
    name: 'Priya Sharma',
    department: 'Computer Science and Engineering',
    year: 3,
    semester: 5,
    section: 'A',
    email: 'priya.730925104052@excelcolleges.com',
    phone: '+91 98765 43211',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    registerNo: '730925104053',
    name: 'Rahul K.',
    department: 'Computer Science and Engineering',
    year: 3,
    semester: 5,
    section: 'A',
    email: 'rahul.730925104053@excelcolleges.com',
    phone: '+91 98765 43212',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    registerNo: '730925104054',
    name: 'Ananya Ramesh',
    department: 'Computer Science and Engineering',
    year: 3,
    semester: 5,
    section: 'A',
    email: 'ananya.730925104054@excelcolleges.com',
    phone: '+91 98765 43213',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
  },
  {
    registerNo: '730925104055',
    name: 'Mohammed Faiz',
    department: 'Computer Science and Engineering',
    year: 3,
    semester: 5,
    section: 'A',
    email: 'faiz.730925104055@excelcolleges.com',
    phone: '+91 98765 43214',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    registerNo: '730925104056',
    name: 'Sneha Patel',
    department: 'Computer Science and Engineering',
    year: 3,
    semester: 5,
    section: 'A',
    email: 'sneha.730925104056@excelcolleges.com',
    phone: '+91 98765 43215',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    registerNo: '730925104057',
    name: 'Vikramaditya S.',
    department: 'Computer Science and Engineering',
    year: 3,
    semester: 5,
    section: 'A',
    email: 'vikram.730925104057@excelcolleges.com',
    phone: '+91 98765 43216',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    registerNo: '730925104058',
    name: 'Divya Nair',
    department: 'Computer Science and Engineering',
    year: 3,
    semester: 5,
    section: 'A',
    email: 'divya.730925104058@excelcolleges.com',
    phone: '+91 98765 43217',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_FACULTY: Faculty[] = [
  {
    facultyId: 'FAC-CSE-102',
    name: 'Mr. N. Nandhakumar, M.E.',
    department: 'Computer Science and Engineering',
    designation: 'Assistant Professor & Project Supervisor',
    email: 'nandhakumar.cse@excelcolleges.com',
    phone: '+91 94432 44556',
    subjectsHandled: ['CS8591', 'CS8592'],
  },
  {
    facultyId: 'FAC-CSE-101',
    name: 'Dr. P.C. Senthil Mahesh, M.E., Ph.D.',
    department: 'Computer Science and Engineering',
    designation: 'Professor & Head of Department',
    email: 'hod.cse@excelcolleges.com',
    phone: '+91 98421 11223',
    subjectsHandled: ['CS8491'],
  },
  {
    facultyId: 'FAC-CSE-105',
    name: 'Mrs. R. Kavitha, M.E.',
    department: 'Computer Science and Engineering',
    designation: 'Associate Professor',
    email: 'kavitha.cse@excelcolleges.com',
    phone: '+91 94431 88990',
    subjectsHandled: ['CS8492'],
  },
  {
    facultyId: 'FAC-CSE-108',
    name: 'Mr. M. Saravanan, M.E.',
    department: 'Computer Science and Engineering',
    designation: 'Assistant Professor',
    email: 'saravanan.cse@excelcolleges.com',
    phone: '+91 97890 12345',
    subjectsHandled: ['CS8493'],
  },
  {
    facultyId: 'FAC-CSE-112',
    name: 'Dr. K. Anand, Ph.D.',
    department: 'Computer Science and Engineering',
    designation: 'Assistant Professor (Senior Grade)',
    email: 'anand.cse@excelcolleges.com',
    phone: '+91 99440 67890',
    subjectsHandled: ['CS8461'],
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    code: 'CS8591',
    name: 'Computer Networks',
    semester: 5,
    department: 'Computer Science and Engineering',
    credits: 4,
    facultyId: 'FAC-CSE-102',
    facultyName: 'Mr. N. Nandhakumar, M.E.',
  },
  {
    code: 'CS8592',
    name: 'Object Oriented Analysis and Design',
    semester: 5,
    department: 'Computer Science and Engineering',
    credits: 3,
    facultyId: 'FAC-CSE-102',
    facultyName: 'Mr. N. Nandhakumar, M.E.',
  },
  {
    code: 'CS8491',
    name: 'Database Management Systems',
    semester: 5,
    department: 'Computer Science and Engineering',
    credits: 4,
    facultyId: 'FAC-CSE-101',
    facultyName: 'Dr. P.C. Senthil Mahesh, M.E., Ph.D.',
  },
  {
    code: 'CS8492',
    name: 'Operating Systems',
    semester: 5,
    department: 'Computer Science and Engineering',
    credits: 3,
    facultyId: 'FAC-CSE-105',
    facultyName: 'Mrs. R. Kavitha, M.E.',
  },
  {
    code: 'CS8493',
    name: 'Theory of Computation',
    semester: 5,
    department: 'Computer Science and Engineering',
    credits: 4,
    facultyId: 'FAC-CSE-108',
    facultyName: 'Mr. M. Saravanan, M.E.',
  },
  {
    code: 'CS8461',
    name: 'Open Source Software Lab',
    semester: 5,
    department: 'Computer Science and Engineering',
    credits: 2,
    facultyId: 'FAC-CSE-112',
    facultyName: 'Dr. K. Anand, Ph.D.',
  }
];

// Generate consistent realistic attendance records for the semester
function generateSampleAttendanceRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const students = INITIAL_STUDENTS;
  const subjects = INITIAL_SUBJECTS;

  // Let's create dates over the last 35 working days
  const baseDate = new Date(2026, 9, 1); // Oct 1, 2026
  const dates: string[] = [];
  
  for (let i = 0; i < 48; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    // Skip Sundays
    if (d.getDay() !== 0) {
      dates.push(d.toISOString().split('T')[0]);
    }
    if (dates.length >= 36) break;
  }

  let recordIdCounter = 1000;

  // For each subject, schedule classes across dates and periods
  subjects.forEach((subject, subIdx) => {
    // Select about 24-30 sessions per subject
    const sessionDates = dates.slice(0, 26 + (subIdx % 4));
    const period = (subIdx % 6) + 1;

    sessionDates.forEach((date, dateIdx) => {
      students.forEach((student) => {
        let status: 'P' | 'A' | 'OD' = 'P';

        // Customise patterns so:
        // 1. S. DIJO (730925104051): High attendance ~88%, attended hackathons on OD
        if (student.registerNo === '730925104051') {
          if (dateIdx === 4 || dateIdx === 18) {
            status = 'OD'; // On-duty for Anna University Smart India Hackathon
          } else if (dateIdx === 11 || (subIdx === 4 && dateIdx === 15)) {
            status = 'A'; // Occasional planned leave
          } else {
            status = 'P';
          }
        } 
        // 2. Rahul K. (730925104053): Struggling attendance ~69% (Below 75% threshold!) to test warning
        else if (student.registerNo === '730925104053') {
          if (dateIdx % 3 === 0 || dateIdx % 5 === 0) {
            status = 'A';
          } else {
            status = 'P';
          }
        }
        // 3. Priya Sharma: Very high attendance ~96%
        else if (student.registerNo === '730925104052') {
          if (dateIdx === 9 && subIdx === 1) {
            status = 'A';
          } else {
            status = 'P';
          }
        }
        // Others: realistic mix
        else {
          const hash = (student.registerNo.charCodeAt(11) + dateIdx * 7 + subIdx * 13) % 100;
          if (hash < 12) {
            status = 'A';
          } else if (hash > 94) {
            status = 'OD';
          } else {
            status = 'P';
          }
        }

        records.push({
          id: `REC-${recordIdCounter++}`,
          studentRegisterNo: student.registerNo,
          subjectCode: subject.code,
          date: date,
          period: period,
          status: status,
          recordedBy: subject.facultyName,
          recordedAt: `${date}T10:00:00.000Z`,
        });
      });
    });
  });

  return records;
}

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = generateSampleAttendanceRecords();

export const INITIAL_OD_REQUESTS: ODRequest[] = [
  {
    id: 'OD-2026-001',
    studentRegisterNo: '730925104051',
    studentName: 'S. DIJO',
    date: '2026-10-06',
    periods: [1, 2, 3, 4, 5, 6, 7],
    subjectCodes: ['CS8591', 'CS8592', 'CS8491'],
    eventName: 'Anna University Smart India Hackathon 2026',
    reason: 'Representing Excel Engineering College CSE Department in the State-level Hackathon Grand Finale.',
    proofDocumentName: 'SIH2026_Selection_Letter.pdf',
    status: 'Approved',
    submittedAt: '2026-10-04T14:20:00.000Z',
    reviewedBy: 'Mr. N. Nandhakumar, M.E.',
    reviewedAt: '2026-10-05T09:15:00.000Z',
  },
  {
    id: 'OD-2026-002',
    studentRegisterNo: '730925104051',
    studentName: 'S. DIJO',
    date: '2026-10-22',
    periods: [3, 4, 5],
    subjectCodes: ['CS8592', 'CS8492'],
    eventName: 'IEEE National Technical Paper Presentation',
    reason: 'Presenting research paper on Web-based Digital Attendance Systems & SDG 4/9 compliance.',
    proofDocumentName: 'IEEE_Acceptance_Pass.pdf',
    status: 'Approved',
    submittedAt: '2026-10-20T11:00:00.000Z',
    reviewedBy: 'Dr. P.C. Senthil Mahesh, M.E., Ph.D.',
    reviewedAt: '2026-10-21T10:30:00.000Z',
  },
  {
    id: 'OD-2026-003',
    studentRegisterNo: '730925104053',
    studentName: 'Rahul K.',
    date: '2026-11-20',
    periods: [1, 2],
    subjectCodes: ['CS8591'],
    eventName: 'Zonal Inter-College Badminton Tournament',
    reason: 'Participated in Men Singles Badminton representing College Sports Club.',
    proofDocumentName: 'Sports_Council_Duty_Slip.pdf',
    status: 'Pending',
    submittedAt: '2026-11-19T16:45:00.000Z',
  }
];
