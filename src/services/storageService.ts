import { Assignment, Submission, StudentProfile, InstructorProfile, CourseSummary } from '../types';
import {
  INITIAL_STUDENT,
  INITIAL_INSTRUCTOR,
  INITIAL_COURSE,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
} from '../data/initialData';

const STORAGE_KEYS = {
  STUDENT: 'edutrack_student',
  INSTRUCTOR: 'edutrack_instructor',
  COURSE: 'edutrack_course',
  ASSIGNMENTS: 'edutrack_assignments',
  SUBMISSIONS: 'edutrack_submissions',
  ROLE: 'edutrack_active_role',
};

export const storageService = {
  getStudent(): StudentProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT);
    if (!raw) {
      this.saveStudent(INITIAL_STUDENT);
      return INITIAL_STUDENT;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STUDENT;
    }
  },

  saveStudent(student: StudentProfile): void {
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(student));
  },

  getInstructor(): InstructorProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.INSTRUCTOR);
    if (!raw) {
      this.saveInstructor(INITIAL_INSTRUCTOR);
      return INITIAL_INSTRUCTOR;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_INSTRUCTOR;
    }
  },

  saveInstructor(instructor: InstructorProfile): void {
    localStorage.setItem(STORAGE_KEYS.INSTRUCTOR, JSON.stringify(instructor));
  },

  getCourse(): CourseSummary {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSE);
    if (!raw) {
      this.saveCourse(INITIAL_COURSE);
      return INITIAL_COURSE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COURSE;
    }
  },

  saveCourse(course: CourseSummary): void {
    localStorage.setItem(STORAGE_KEYS.COURSE, JSON.stringify(course));
  },

  getAssignments(): Assignment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    if (!raw) {
      this.saveAssignments(INITIAL_ASSIGNMENTS);
      return INITIAL_ASSIGNMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  },

  saveAssignments(assignments: Assignment[]): void {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },

  getSubmissions(): Record<string, Submission> {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) {
      this.saveSubmissions(INITIAL_SUBMISSIONS);
      return INITIAL_SUBMISSIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  },

  saveSubmissions(submissions: Record<string, Submission>): void {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  },

  resetAllToDefault(): {
    student: StudentProfile;
    instructor: InstructorProfile;
    course: CourseSummary;
    assignments: Assignment[];
    submissions: Record<string, Submission>;
  } {
    this.saveStudent(INITIAL_STUDENT);
    this.saveInstructor(INITIAL_INSTRUCTOR);
    this.saveCourse(INITIAL_COURSE);
    this.saveAssignments(INITIAL_ASSIGNMENTS);
    this.saveSubmissions(INITIAL_SUBMISSIONS);
    return {
      student: INITIAL_STUDENT,
      instructor: INITIAL_INSTRUCTOR,
      course: INITIAL_COURSE,
      assignments: INITIAL_ASSIGNMENTS,
      submissions: INITIAL_SUBMISSIONS,
    };
  },

  exportFullDataJSON(): string {
    const payload = {
      exportedAt: new Date().toISOString(),
      student: this.getStudent(),
      instructor: this.getInstructor(),
      course: this.getCourse(),
      assignments: this.getAssignments(),
      submissions: this.getSubmissions(),
    };
    return JSON.stringify(payload, null, 2);
  },
};
