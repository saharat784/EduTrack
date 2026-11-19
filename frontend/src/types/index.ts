export type UserRole = 'student' | 'instructor';

export type AssignmentCategory = 'assignment' | 'quiz' | 'exam' | 'project';

export type SubmissionStatus = 'not_submitted' | 'submitted' | 'late' | 'graded';

export interface StudentProfile {
  id: string;
  studentCode: string;
  fullName: string;
  academicYear: string; // e.g. "Year 3 (ชั้นปีที่ 3)"
  faculty: string;      // e.g. "Faculty of Engineering"
  major: string;        // e.g. "Computer Engineering (วิศวกรรมคอมพิวเตอร์)"
  email: string;
  avatarUrl: string;
}

export interface InstructorProfile {
  id: string;
  fullName: string;
  title: string;        // e.g. "Lecturer / Senior Tech Lead"
  department: string;
  email: string;
  avatarUrl: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  category: AssignmentCategory;
  dueDate: string;      // ISO string e.g. "2026-11-25T23:59:00"
  maxScore: number;
  weightPercentage: number;
  courseCode: string;   // e.g. "CPE301"
  courseName: string;   // e.g. "Fullstack Software Architecture"
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string | null;
  status: SubmissionStatus;
  
  // Work submission payload
  workType: 'link' | 'text' | 'file';
  workContent: string;  // URL or text or file reference name
  workFileName?: string;
  
  // Student reflection note (โน้ตฝั่งนักศึกษา)
  studentNote: string;
  
  // Instructor grading & note (โน้ตฝั่งอาจารย์)
  score: number | null;
  instructorNote: string;
  gradedAt: string | null;
  gradedBy: string | null;
}

export interface CourseSummary {
  courseCode: string;
  courseName: string;
  academicYear: string;
  term: string;
  instructorName: string;
  totalAssignments: number;
  totalMaxScore: number;
}

export interface GradeScale {
  grade: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'F';
  minScore: number;
  gpaPoint: number;
  colorClass: string;
}
