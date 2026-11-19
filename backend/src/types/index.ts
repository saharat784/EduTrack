export type UserRole = 'student' | 'instructor';

export type AssignmentCategory = 'assignment' | 'quiz' | 'exam' | 'project';

export type SubmissionStatus = 'not_submitted' | 'submitted' | 'late' | 'graded';

export interface StudentProfile {
  id: string;
  studentCode: string;
  fullName: string;
  academicYear: string;
  faculty: string;
  major: string;
  email: string;
  avatarUrl: string;
}

export interface InstructorProfile {
  id: string;
  fullName: string;
  title: string;
  department: string;
  email: string;
  avatarUrl: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  category: AssignmentCategory;
  dueDate: string;
  maxScore: number;
  weightPercentage: number;
  courseCode: string;
  courseName: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string | null;
  status: SubmissionStatus;
  workType: 'link' | 'text' | 'file';
  workContent: string;
  workFileName?: string;
  studentNote: string;
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
